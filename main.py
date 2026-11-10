import hashlib
import math
import hmac
import html
import os
import re
import secrets
import time
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import date, datetime
from pathlib import Path
from typing import Optional
from urllib.parse import quote_plus

import requests
from fastapi import (BackgroundTasks, Cookie, Depends, FastAPI, File, Form,
                     HTTPException, Request, UploadFile)
from fastapi.concurrency import run_in_threadpool
from fastapi.exceptions import RequestValidationError
from fastapi.responses import (HTMLResponse, JSONResponse, PlainTextResponse,
                               RedirectResponse, Response)
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload
from starlette.exceptions import HTTPException as StarletteHTTPException

try:  # read settings from a .env file next to this script, if python-dotenv is installed
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent / ".env")
except ImportError:
    pass

import translations as i18n
import models

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ITEM_TYPES = ("hotel", "taxi", "transport", "experience", "trip")
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024

PER_PAGE = 9
HOME_CITIES = ("Samarkand", "Bukhara", "Khiva", "Tashkent")
SITE_URL = os.getenv("SITE_URL", "").rstrip("/")
CLOUDINARY_URL = os.getenv("CLOUDINARY_URL", "")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD") or secrets.token_urlsafe(12)
if not os.getenv("ADMIN_PASSWORD"):
    print(f"[susambil] ADMIN_PASSWORD not set. Temporary admin password: {ADMIN_PASSWORD}")


@asynccontextmanager
async def lifespan(_: FastAPI):
    models.Base.metadata.create_all(bind=models.engine)
    models.ensure_columns()
    yield


app = FastAPI(title="Susambil", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    return response


def resolve_lang(request: Request) -> str:
    cookie = request.cookies.get("lang", "")
    if cookie in i18n.LANGUAGES:
        return cookie
    return i18n.parse_accept_language(request.headers.get("accept-language", ""))


def resolve_currency(request: Request, lang: str) -> str:
    cookie = request.cookies.get("cur", "")
    return cookie if cookie in i18n.CURRENCIES else i18n.LANGUAGES[lang]["cur"]


def render(request: Request, name: str, context: Optional[dict] = None, status_code: int = 200):
    """Render a template with the visitor's language, currency and helpers."""
    lang = resolve_lang(request)
    cur = resolve_currency(request, lang)
    ctx = dict(context or {})
    ctx.update(
        lang=lang, lang_info=i18n.LANGUAGES[lang], rtl=i18n.LANGUAGES[lang]["rtl"],
        languages=i18n.LANGUAGE_LIST, lang_codes=i18n.LANG_CODES,
        lang_chosen=request.cookies.get("lang", "") in i18n.LANGUAGES,
        cur=cur, currencies=i18n.CURRENCIES, site_url=SITE_URL,
        canonical=(SITE_URL + request.url.path) if SITE_URL else "",
        t=lambda key: i18n.translate(lang, key),
        money=lambda usd: i18n.money(usd, cur),
    )
    return templates.TemplateResponse(request, name, ctx, status_code=status_code)


@app.get("/set-preferences")
def set_preferences(request: Request, lang: str = "", cur: str = "", next: str = "/"):
    """Remember the visitor's language and currency, then go back to the page they were on."""
    target = next if next.startswith("/") and not next.startswith("//") and "\\" not in next else "/"
    resp = RedirectResponse(target, status_code=303)
    opts = dict(max_age=365 * 24 * 3600, samesite="lax", secure=request.url.scheme == "https", path="/")
    if lang in i18n.LANGUAGES:
        resp.set_cookie("lang", lang, **opts)
    if cur in i18n.CURRENCIES:
        resp.set_cookie("cur", cur, **opts)
    return resp



# --------------------------------------------------------------------------- helpers
def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()


_hits = defaultdict(deque)


def hit(request: Request, scope: str, max_calls: int, per_seconds: int) -> None:
    """Simple per-IP sliding-window rate limit (in memory, per process)."""
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    if len(_hits) > 20000:
        _hits.clear()
    q = _hits[(scope, ip)]
    while q and now - q[0] > per_seconds:
        q.popleft()
    if len(q) >= max_calls:
        raise HTTPException(429, "Too many requests. Wait a minute and try again.")
    q.append(now)


def rate_limit(max_calls: int, per_seconds: int, scope: str):
    def dependency(request: Request) -> None:
        hit(request, scope, max_calls, per_seconds)
    return dependency


def redirect(path: str, msg: str = "") -> RedirectResponse:
    if msg:
        sep = "&" if "?" in path else "?"
        path = f"{path}{sep}msg={quote_plus(msg)}"
    return RedirectResponse(path, status_code=303)


def send_telegram(text: str) -> None:
    """Fire-and-forget Telegram alert. Silently skipped if not configured."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={"chat_id": TELEGRAM_CHAT_ID, "text": text},
            timeout=8,
        )
    except requests.RequestException as exc:
        print(f"[susambil] Telegram alert failed: {exc}")


def check_honeypot(value: Optional[str]) -> None:
    if value:
        raise HTTPException(status_code=400, detail="Request blocked.")


def clean(value: Optional[str], label: str, max_len: int, min_len: int = 1) -> str:
    value = (value or "").strip()
    if not (min_len <= len(value) <= max_len):
        raise HTTPException(400, f"{label} must be {min_len}-{max_len} characters long.")
    return value


def clean_phone(phone: str) -> str:
    phone = (phone or "").strip()
    if not re.fullmatch(r"[+\d][\d\s\-()]{6,19}", phone):
        raise HTTPException(400, "Enter a valid phone number, for example +998 90 123 45 67.")
    return phone


def parse_future_date(value: str) -> date:
    try:
        parsed = datetime.strptime((value or "").strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(400, "Choose a valid date.")
    if parsed < date.today():
        raise HTTPException(400, "The date can't be in the past.")
    return parsed


def normalize_tags(raw: str) -> str:
    tags = []
    for part in re.split(r"[\s,]+", raw or ""):
        part = re.sub(r"[^\w]", "", part, flags=re.UNICODE)
        if part:
            tags.append("#" + part[:30])
    return " ".join(tags[:10])


def looks_like_image(data: bytes) -> bool:
    return (
        data.startswith(b"\xff\xd8\xff")
        or data.startswith(b"\x89PNG\r\n\x1a\n")
        or (data[:4] == b"RIFF" and data[8:12] == b"WEBP")
    )


def cloudinary_upload(data: bytes, filename: str) -> str:
    """Upload to Cloudinary so images survive redeploys. Enabled by CLOUDINARY_URL."""
    match = re.fullmatch(r"cloudinary://([^:]+):([^@]+)@(.+)", CLOUDINARY_URL)
    if not match:
        raise HTTPException(500, "Image storage is not configured correctly.")
    key, secret, cloud = match.groups()
    stamp = str(int(time.time()))
    signature = hashlib.sha1(f"folder=susambil&timestamp={stamp}{secret}".encode()).hexdigest()
    try:
        resp = requests.post(
            f"https://api.cloudinary.com/v1_1/{cloud}/image/upload",
            data={"api_key": key, "timestamp": stamp, "folder": "susambil", "signature": signature},
            files={"file": (filename, data)}, timeout=30,
        )
        resp.raise_for_status()
        return resp.json()["secure_url"]
    except (requests.RequestException, KeyError, ValueError):
        raise HTTPException(502, "The image upload failed. Try again in a moment.")


async def save_image(upload) -> str:
    """Validate and store an uploaded image under a random UUID filename."""
    if upload is None or not getattr(upload, "filename", ""):
        raise HTTPException(400, "An image file is required.")
    ext = Path(upload.filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, "Only jpg, jpeg, png and webp images are allowed.")
    data = await upload.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "The image is larger than 10 MB.")
    if not data or not looks_like_image(data):
        raise HTTPException(400, "The file is not a valid image.")
    filename = f"{uuid.uuid4().hex}{ext}"
    if CLOUDINARY_URL:
        return await run_in_threadpool(cloudinary_upload, data, filename)
    (UPLOAD_DIR / filename).write_bytes(data)
    return f"/static/uploads/{filename}"


# --------------------------------------------------------------------------- errors
def _error_page(status: int, detail: str) -> HTMLResponse:
    body = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Susambil</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0c1633;color:#e2e8f0;font-family:system-ui,sans-serif">
<div style="max-width:28rem;padding:2rem;text-align:center">
<p style="color:#ffb703;font-size:3rem;margin:0">{status}</p>
<p style="font-size:1.1rem">{html.escape(str(detail))}</p>
<a href="javascript:history.back()" style="color:#ffb703">Go back</a> &nbsp;|&nbsp; <a href="/" style="color:#ffb703">Home</a>
</div></body></html>"""
    return HTMLResponse(body, status_code=status)


@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: StarletteHTTPException):
    if request.url.path.startswith("/post/"):
        return JSONResponse({"error": exc.detail}, status_code=exc.status_code)
    return _error_page(exc.status_code, exc.detail)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    detail = "Some required fields are missing or invalid."
    if request.url.path.startswith("/post/"):
        return JSONResponse({"error": detail}, status_code=400)
    return _error_page(400, detail)


# --------------------------------------------------------------------------- public pages
@app.get("/", response_class=HTMLResponse)
def home(request: Request, db: Session = Depends(get_db)):
    """One-screen start page: the cards lead to the other pages."""
    verified = models.Guide.is_verified.is_(True)
    kind = models.TourItem.item_type
    counts = {
        "guides": db.query(func.count(models.Guide.id)).filter(verified).scalar(),
        "trips": db.query(func.count(models.TourItem.id)).filter(kind.in_(("hotel", "experience", "trip"))).scalar(),
        "taxi": db.query(func.count(models.TourItem.id)).filter(kind == "taxi").scalar(),
        "photos": db.query(func.count(models.TravelPost.id)).scalar(),
    }
    return render(request, "index.html", {"counts": counts, "tab": "all", "location": ""})


@app.get("/trips", response_class=HTMLResponse)
def trips(request: Request, location: str = "", tab: str = "all", page: int = 1, db: Session = Depends(get_db)):
    tab = tab if tab in ITEM_TYPES else "all"
    location = location.strip()[:80]
    query = db.query(models.TourItem)
    if tab != "all":
        query = query.filter(models.TourItem.item_type == tab)
    if location:
        query = query.filter(models.TourItem.location.ilike(f"%{location}%"))
    total = query.count()
    pages = max(1, math.ceil(total / PER_PAGE))
    page = min(max(page, 1), pages)
    items = query.order_by(models.TourItem.id.desc()).offset((page - 1) * PER_PAGE).limit(PER_PAGE).all()
    return render(request, "trips.html", {"items": items, "tab": tab, "location": location,
                                          "page": page, "pages": pages, "cities": HOME_CITIES})


@app.get("/feed", response_class=HTMLResponse)
def feed(request: Request, db: Session = Depends(get_db)):
    posts = (
        db.query(models.TravelPost).options(selectinload(models.TravelPost.comments))
        .order_by(models.TravelPost.id.desc()).limit(30).all()
    )
    return render(request, "feed.html", {"posts": posts})


@app.get("/become-guide", response_class=HTMLResponse)
def become_guide(request: Request):
    return render(request, "register_guide.html", {})


@app.get("/item/{item_id}", response_class=HTMLResponse)
def item_detail(request: Request, item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.TourItem, item_id)
    if not item:
        raise HTTPException(404, "This listing doesn't exist.")
    reviews = (
        db.query(models.Review).filter(models.Review.item_id == item_id)
        .order_by(models.Review.id.desc()).all()
    )
    avg = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else None
    return render(
        request, "details.html",
        {"item": item, "reviews": reviews, "avg_rating": avg, "today": date.today().isoformat()},
    )


@app.post("/book/{item_id}", dependencies=[Depends(rate_limit(5, 60, "book"))])
def book_item(
    item_id: int,
    background: BackgroundTasks,
    customer_name: str = Form(...),
    phone: str = Form(...),
    booking_date: str = Form(..., alias="date"),
    bot_check: str = Form(""),
    db: Session = Depends(get_db),
):
    check_honeypot(bot_check)
    item = db.get(models.TourItem, item_id)
    if not item:
        raise HTTPException(404, "This listing doesn't exist.")
    name = clean(customer_name, "Name", 120, 2)
    phone = clean_phone(phone)
    when = parse_future_date(booking_date)

    db.add(models.Booking(item_id=item_id, customer_name=name, phone=phone, date=when))
    db.commit()
    background.add_task(
        send_telegram,
        f"New booking\n{item.title} ({item.item_type}, {item.location})\n"
        f"Customer: {name}\nPhone: {phone}\nDate: {when}\nPrice: ${item.price:,.0f}",
    )
    return redirect(f"/item/{item_id}", "Booking received. We'll call you to confirm.")


@app.post("/item/{item_id}/review", dependencies=[Depends(rate_limit(5, 60, "review"))])
def add_review(
    item_id: int,
    author_name: str = Form(...),
    rating: int = Form(...),
    comment: str = Form(...),
    bot_check: str = Form(""),
    db: Session = Depends(get_db),
):
    check_honeypot(bot_check)
    if not db.get(models.TourItem, item_id):
        raise HTTPException(404, "This listing doesn't exist.")
    if not 1 <= rating <= 5:
        raise HTTPException(400, "Rating must be between 1 and 5.")
    db.add(models.Review(
        item_id=item_id,
        author_name=clean(author_name, "Name", 120, 2),
        rating=rating,
        comment=clean(comment, "Review", 1500, 3),
    ))
    db.commit()
    return redirect(f"/item/{item_id}#reviews", "Thanks for your review.")


# --------------------------------------------------------------------------- guides
@app.get("/guides", response_class=HTMLResponse)
def guides_page(request: Request, db: Session = Depends(get_db)):
    guides = (
        db.query(models.Guide).filter(models.Guide.is_verified.is_(True))
        .order_by(models.Guide.points.desc(), models.Guide.rating.desc()).all()
    )
    return render(
        request, "guides.html", {"guides": guides, "today": date.today().isoformat()}
    )


@app.post("/register-guide", dependencies=[Depends(rate_limit(3, 300, "guide"))])
async def register_guide(
    background: BackgroundTasks,
    full_name: str = Form(...),
    city: str = Form(...),
    languages: str = Form(...),
    experience_years: int = Form(...),
    bio: str = Form(...),
    price_per_day: float = Form(...),
    profile_image: UploadFile = File(...),
    certificate: UploadFile = File(...),
    bot_check: str = Form(""),
    db: Session = Depends(get_db),
):
    check_honeypot(bot_check)
    full_name = clean(full_name, "Full name", 120, 2)
    city = clean(city, "City", 120, 2)
    languages = clean(languages, "Languages", 200, 2)
    bio = clean(bio, "Bio", 2000, 10)
    if not 0 <= experience_years <= 70:
        raise HTTPException(400, "Experience must be between 0 and 70 years.")
    if not 1 <= price_per_day <= 100000:
        raise HTTPException(400, "Enter a realistic price per day.")

    profile_url = await save_image(profile_image)
    certificate_url = await save_image(certificate)

    db.add(models.Guide(
        full_name=full_name, city=city, languages=languages,
        experience_years=experience_years, bio=bio, price_per_day=price_per_day,
        profile_image_url=profile_url, certificate_url=certificate_url,
        is_verified=False, rating=0.0, points=100, completed_tours=0, badge="Newcomer",
    ))
    db.commit()
    background.add_task(
        send_telegram,
        f"New guide application\n{full_name}, {city}\nLanguages: {languages}\n"
        f"Experience: {experience_years} years\nRate: ${price_per_day:,.0f}/day\nReview it in /admin",
    )
    return redirect("/guides", "Application sent. We'll review your certificate and publish your profile.")


@app.post("/guides/{guide_id}/book", dependencies=[Depends(rate_limit(5, 60, "gbook"))])
def book_guide(
    guide_id: int,
    background: BackgroundTasks,
    customer_name: str = Form(...),
    phone: str = Form(...),
    booking_date: str = Form(..., alias="date"),
    bot_check: str = Form(""),
    db: Session = Depends(get_db),
):
    check_honeypot(bot_check)
    guide = db.get(models.Guide, guide_id)
    if not guide or not guide.is_verified:
        raise HTTPException(404, "This guide isn't available.")
    name = clean(customer_name, "Name", 120, 2)
    phone = clean_phone(phone)
    when = parse_future_date(booking_date)
    db.add(models.GuideBooking(guide_id=guide_id, customer_name=name, phone=phone, date=when))
    db.commit()
    background.add_task(
        send_telegram,
        f"New guide booking\n{guide.full_name} ({guide.city})\nCustomer: {name}\n"
        f"Phone: {phone}\nDate: {when}\nRate: ${guide.price_per_day:,.0f}/day",
    )
    return redirect("/guides", f"Request sent to {guide.full_name}. We'll call you to confirm.")


# --------------------------------------------------------------------------- travel feed
@app.post("/upload-post", dependencies=[Depends(rate_limit(5, 300, "post"))])
async def upload_post(
    image_file: UploadFile = File(...),
    title: str = Form(...),
    location: str = Form(...),
    author_name: str = Form(...),
    hashtags: str = Form(""),
    bot_check: str = Form(""),
    db: Session = Depends(get_db),
):
    check_honeypot(bot_check)
    title = clean(title, "Title", 200, 2)
    location = clean(location, "Location", 120, 2)
    author = clean(author_name, "Name", 120, 2)
    image_url = await save_image(image_file)
    db.add(models.TravelPost(
        title=title, image_url=image_url, location=location,
        author_name=author, hashtags=normalize_tags(hashtags), like_count=0,
    ))
    db.commit()
    return redirect("/feed", "Your photo is live in the feed.")


@app.post("/post/{post_id}/like", dependencies=[Depends(rate_limit(30, 60, "like"))])
def like_post(post_id: int, db: Session = Depends(get_db)):
    updated = (
        db.query(models.TravelPost).filter(models.TravelPost.id == post_id)
        .update({models.TravelPost.like_count: models.TravelPost.like_count + 1})
    )
    if not updated:
        db.rollback()
        raise HTTPException(404, "Post not found.")
    db.commit()
    post = db.get(models.TravelPost, post_id)
    return {"like_count": post.like_count}


@app.post("/post/{post_id}/comment", dependencies=[Depends(rate_limit(8, 60, "comment"))])
def comment_post(
    post_id: int,
    author_name: str = Form(...),
    comment: str = Form(...),
    bot_check: str = Form(""),
    db: Session = Depends(get_db),
):
    check_honeypot(bot_check)
    if not db.get(models.TravelPost, post_id):
        raise HTTPException(404, "Post not found.")
    author = clean(author_name, "Name", 120, 2)
    text = clean(comment, "Comment", 500, 1)
    row = models.PostComment(post_id=post_id, author_name=author, comment=text)
    db.add(row)
    db.commit()
    count = db.query(func.count(models.PostComment.id)).filter(models.PostComment.post_id == post_id).scalar()
    return {"author_name": author, "comment": text, "comment_count": count}


# --------------------------------------------------------------------------- SEO
@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return RedirectResponse("/static/favicon.svg", status_code=301)


@app.get("/robots.txt", response_class=PlainTextResponse, include_in_schema=False)
def robots(request: Request):
    base = SITE_URL or str(request.base_url).rstrip("/")
    return f"User-agent: *\nDisallow: /admin\nSitemap: {base}/sitemap.xml\n"


@app.get("/sitemap.xml", include_in_schema=False)
def sitemap(request: Request, db: Session = Depends(get_db)):
    base = SITE_URL or str(request.base_url).rstrip("/")
    paths = ["/", "/trips", "/feed", "/guides"] + [f"/item/{i}" for (i,) in db.query(models.TourItem.id).all()]
    body = "".join(f"<url><loc>{html.escape(base + p)}</loc></url>" for p in paths)
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>'
    return Response(xml, media_type="application/xml")


# --------------------------------------------------------------------------- admin
STATUSES = ("pending", "confirmed", "completed", "cancelled")
REVENUE_STATUSES = ("confirmed", "completed")


def make_admin_token() -> str:
    return hmac.new(ADMIN_PASSWORD.encode(), b"susambil-admin", hashlib.sha256).hexdigest()


def is_admin(token: Optional[str]) -> bool:
    return bool(token) and secrets.compare_digest(token, make_admin_token())


def badge_for(tours: int) -> str:
    if tours >= 100:
        return "Master Guide"
    if tours >= 25:
        return "Silk Road Expert"
    if tours >= 5:
        return "Rising Guide"
    return "Verified Guide"


def dashboard_context(db: Session) -> dict:
    B, GB, T, G = models.Booking, models.GuideBooking, models.TourItem, models.Guide
    item_revenue = (
        db.query(func.coalesce(func.sum(T.price), 0.0)).select_from(B)
        .join(T, B.item_id == T.id).filter(B.status.in_(REVENUE_STATUSES)).scalar()
    )
    guide_revenue = (
        db.query(func.coalesce(func.sum(G.price_per_day), 0.0)).select_from(GB)
        .join(G, GB.guide_id == G.id).filter(GB.status.in_(REVENUE_STATUSES)).scalar()
    )
    item_count = db.query(func.count(B.id)).scalar()
    guide_count = db.query(func.count(GB.id)).scalar()
    pending_bookings = (
        db.query(func.count(B.id)).filter(B.status == "pending").scalar()
        + db.query(func.count(GB.id)).filter(GB.status == "pending").scalar()
    )

    epoch = datetime(1970, 1, 1)
    rows = []
    for b, item in db.query(B, T).join(T, B.item_id == T.id).order_by(B.id.desc()).limit(25).all():
        rows.append({"type": "item", "id": b.id, "kind": item.item_type, "name": item.title,
                     "customer": b.customer_name, "phone": b.phone, "date": b.date,
                     "amount": item.price, "status": b.status, "created": b.created_at or epoch})
    for b, guide in db.query(GB, G).join(G, GB.guide_id == G.id).order_by(GB.id.desc()).limit(25).all():
        rows.append({"type": "guide", "id": b.id, "kind": "guide", "name": guide.full_name,
                     "customer": b.customer_name, "phone": b.phone, "date": b.date,
                     "amount": guide.price_per_day, "status": b.status, "created": b.created_at or epoch})
    rows.sort(key=lambda r: r["created"], reverse=True)

    return {
        "authed": True,
        "revenue": item_revenue + guide_revenue,
        "total_bookings": item_count + guide_count,
        "item_bookings": item_count,
        "guide_bookings": guide_count,
        "pending_bookings": pending_bookings,
        "pending_guides": db.query(G).filter(G.is_verified.is_(False)).order_by(G.id).all(),
        "recent": rows[:30],
        "items": db.query(T).order_by(T.id.desc()).all(),
        "posts": db.query(models.TravelPost).order_by(models.TravelPost.id.desc()).limit(12).all(),
        "item_types": ITEM_TYPES,
        "statuses": STATUSES,
    }


def form_int(form, key: str) -> int:
    try:
        return int(form.get(key))
    except (TypeError, ValueError):
        raise HTTPException(400, "Invalid request.")


async def read_item_form(form) -> dict:
    item_type = str(form.get("item_type") or "")
    if item_type not in ITEM_TYPES:
        raise HTTPException(400, "Choose a valid type.")
    try:
        price = float(form.get("price"))
    except (TypeError, ValueError):
        raise HTTPException(400, "Enter a valid price.")
    if price <= 0:
        raise HTTPException(400, "Price must be above zero.")

    upload = form.get("image_file")
    if upload is not None and getattr(upload, "filename", ""):
        image_url = await save_image(upload)
    else:
        image_url = str(form.get("image_url") or "").strip()
        if not re.match(r"^(https?://|/static/)", image_url) or len(image_url) > 500:
            raise HTTPException(400, "Upload an image or paste a valid image link.")
    return {
        "title": clean(str(form.get("title") or ""), "Title", 200, 2),
        "item_type": item_type,
        "location": clean(str(form.get("location") or ""), "Location", 120, 2),
        "description": clean(str(form.get("description") or ""), "Description", 5000, 10),
        "price": price,
        "image_url": image_url,
        "duration": str(form.get("duration") or "").strip()[:80] or None,
    }


@app.get("/admin", response_class=HTMLResponse)
def admin_get(request: Request, admin_token: Optional[str] = Cookie(None), db: Session = Depends(get_db)):
    if not is_admin(admin_token):
        return render(request, "admin.html", {"authed": False, "error": None})
    return render(request, "admin.html", dashboard_context(db))


@app.post("/admin")
async def admin_post(
    request: Request,
    admin_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    form = await request.form()
    action = (form.get("action") or "").strip()

    if action == "login":
        hit(request, "admin-login", 5, 300)
        supplied = str(form.get("password") or "")
        if secrets.compare_digest(supplied.encode(), ADMIN_PASSWORD.encode()):
            resp = redirect("/admin")
            resp.set_cookie(
                "admin_token", make_admin_token(), httponly=True, samesite="lax",
                secure=request.url.scheme == "https", max_age=8 * 3600,
            )
            return resp
        return render(request, "admin.html", {"authed": False, "error": "Wrong password."}, status_code=401)

    if not is_admin(admin_token):
        raise HTTPException(403, "Sign in to use the admin panel.")

    if action == "logout":
        resp = redirect("/admin")
        resp.delete_cookie("admin_token")
        return resp

    if action in ("approve_guide", "reject_guide"):
        guide = db.get(models.Guide, form_int(form, "guide_id"))
        if not guide:
            raise HTTPException(404, "Guide not found.")
        if action == "approve_guide":
            guide.is_verified = True
            guide.badge = badge_for(guide.completed_tours)
            db.commit()
            return redirect("/admin", f"{guide.full_name} is now verified and visible.")
        name = guide.full_name
        db.delete(guide)
        db.commit()
        return redirect("/admin", f"Application from {name} removed.")

    if action == "set_booking_status":
        status = str(form.get("status") or "")
        kind = str(form.get("kind") or "")
        if status not in STATUSES or kind not in ("item", "guide"):
            raise HTTPException(400, "Invalid request.")
        row = db.get(models.Booking if kind == "item" else models.GuideBooking, form_int(form, "booking_id"))
        if not row:
            raise HTTPException(404, "Booking not found.")
        if row.status == "completed" and status != "completed":
            raise HTTPException(400, "A completed booking can't be changed.")
        if status == "completed" and row.status != "completed" and kind == "guide":
            guide = row.guide  # gamification: every finished tour earns points and can raise the badge
            guide.completed_tours += 1
            guide.points += 25
            guide.badge = badge_for(guide.completed_tours)
        row.status = status
        db.commit()
        return redirect("/admin#bookings", f"Booking marked as {status}.")

    if action == "add_item":
        db.add(models.TourItem(**await read_item_form(form)))
        db.commit()
        return redirect("/admin#listings", "Listing added.")

    if action == "edit_item":
        item = db.get(models.TourItem, form_int(form, "item_id"))
        if not item:
            raise HTTPException(404, "Listing not found.")
        for key, value in (await read_item_form(form)).items():
            setattr(item, key, value)
        db.commit()
        return redirect("/admin#listings", "Listing updated.")

    if action == "delete_item":
        item = db.get(models.TourItem, form_int(form, "item_id"))
        if not item:
            raise HTTPException(404, "Listing not found.")
        if db.query(func.count(models.Booking.id)).filter(models.Booking.item_id == item.id).scalar():
            raise HTTPException(400, "This listing has bookings. Edit it instead of deleting it.")
        db.delete(item)
        db.commit()
        return redirect("/admin#listings", "Listing deleted.")

    if action == "delete_post":
        post = db.get(models.TravelPost, form_int(form, "post_id"))
        if not post:
            raise HTTPException(404, "Post not found.")
        db.delete(post)
        db.commit()
        return redirect("/admin#feed", "Post removed from the feed.")

    raise HTTPException(400, "Unknown action.")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
