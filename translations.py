"""Languages, UI translations and currency conversion for Susambil.

Prices are stored in USD. Everything else is converted at display time.
Missing translations fall back to English, so new keys can be added safely.
"""
import os
import threading
import time

import requests

DEFAULT_LANG = "en"

# code: native name, English name, flag, right-to-left, default currency
LANGUAGES = {
    "uz": {"name": "O‘zbekcha", "en": "Uzbek", "flag": "🇺🇿", "rtl": False, "cur": "UZS"},
    "ru": {"name": "Русский", "en": "Russian", "flag": "🇷🇺", "rtl": False, "cur": "RUB"},
    "en": {"name": "English", "en": "English", "flag": "🇬🇧", "rtl": False, "cur": "USD"},
    "kk": {"name": "Қазақша", "en": "Kazakh", "flag": "🇰🇿", "rtl": False, "cur": "KZT"},
    "ky": {"name": "Кыргызча", "en": "Kyrgyz", "flag": "🇰🇬", "rtl": False, "cur": "KGS"},
    "tg": {"name": "Тоҷикӣ", "en": "Tajik", "flag": "🇹🇯", "rtl": False, "cur": "TJS"},
    "tk": {"name": "Türkmençe", "en": "Turkmen", "flag": "🇹🇲", "rtl": False, "cur": "TMT"},
    "tr": {"name": "Türkçe", "en": "Turkish", "flag": "🇹🇷", "rtl": False, "cur": "TRY"},
    "zh": {"name": "中文", "en": "Chinese", "flag": "🇨🇳", "rtl": False, "cur": "CNY"},
    "ar": {"name": "العربية", "en": "Arabic", "flag": "🇸🇦", "rtl": True, "cur": "USD"},
    "fa": {"name": "فارسی", "en": "Persian", "flag": "🇮🇷", "rtl": True, "cur": "USD"},
    "ko": {"name": "한국어", "en": "Korean", "flag": "🇰🇷", "rtl": False, "cur": "KRW"},
    "ja": {"name": "日本語", "en": "Japanese", "flag": "🇯🇵", "rtl": False, "cur": "JPY"},
    "de": {"name": "Deutsch", "en": "German", "flag": "🇩🇪", "rtl": False, "cur": "EUR"},
    "fr": {"name": "Français", "en": "French", "flag": "🇫🇷", "rtl": False, "cur": "EUR"},
}
LANGUAGE_LIST = list(LANGUAGES.items())
LANG_CODES = list(LANGUAGES)

KEYS = (
    "nav_trips", "nav_feed", "nav_guides", "hero_title", "hero_sub", "search_ph", "search_btn",
    "tab_all", "tab_hotel", "tab_transport", "tab_experience", "feed_title", "feed_sub",
    "share_photo", "post_photo", "comments", "book_now", "your_name", "phone", "date",
    "send_request", "guides_title", "become_guide", "no_results", "reviews", "write_review",
    "post_review", "language", "currency", "find_language", "apply", "about", "per_day",
)

_TR = {
    "en": ("Trips", "Travel feed", "Guides", "Book all of Uzbekistan in one place",
           "Hotels, trains, local guides and experiences in one app.", "Search by city", "Search",
           "All", "Hotels", "Transport", "Experiences", "Travel feed", "Photos from travelers on the road.",
           "Share a photo", "Post photo", "Comments", "Book now", "Your name", "Phone number", "Date",
           "Send request", "Verified local guides", "Become a guide", "Nothing matches that search yet.",
           "Reviews", "Write a review", "Post review", "Language", "Currency", "Find a language", "Apply",
           "About", "per day"),
    "uz": ("Sayohatlar", "Sayohat lentasi", "Gidlar", "O‘zbekistonni bitta joydan bron qiling",
           "Mehmonxona, poyezd, gid va tajribalar — bitta ilovada.", "Shahar bo‘yicha qidirish", "Qidirish",
           "Hammasi", "Mehmonxonalar", "Transport", "Tajribalar", "Sayohat lentasi", "Yo‘ldagi sayyohlardan suratlar.",
           "Surat ulashish", "Surat joylash", "Izohlar", "Hozir bron qilish", "Ismingiz", "Telefon raqam", "Sana",
           "So‘rov yuborish", "Tasdiqlangan mahalliy gidlar", "Gid bo‘lish", "Hozircha hech narsa topilmadi.",
           "Sharhlar", "Sharh yozish", "Sharhni joylash", "Til", "Valyuta", "Tilni qidiring", "Qo‘llash",
           "Haqida", "kuniga"),
    "ru": ("Поездки", "Лента путешествий", "Гиды", "Бронируйте весь Узбекистан в одном месте",
           "Отели, поезда, местные гиды и впечатления в одном приложении.", "Поиск по городу", "Найти",
           "Все", "Отели", "Транспорт", "Впечатления", "Лента путешествий", "Фото от путешественников в пути.",
           "Поделиться фото", "Опубликовать фото", "Комментарии", "Забронировать", "Ваше имя", "Номер телефона",
           "Дата", "Отправить запрос", "Проверенные местные гиды", "Стать гидом", "Пока ничего не найдено.",
           "Отзывы", "Написать отзыв", "Опубликовать отзыв", "Язык", "Валюта", "Найти язык", "Применить",
           "Описание", "в день"),
    "kk": ("Саяхаттар", "Саяхат таспасы", "Гидтер", "Өзбекстанды бір жерден брондаңыз",
           "Қонақүй, пойыз, жергілікті гидтер мен әсерлер — бір қосымшада.", "Қала бойынша іздеу", "Іздеу",
           "Барлығы", "Қонақүйлер", "Көлік", "Әсерлер", "Саяхат таспасы", "Жолдағы саяхатшылардың фотолары.",
           "Фото бөлісу", "Фото жариялау", "Пікірлер", "Брондау", "Атыңыз", "Телефон нөмірі", "Күні",
           "Сұраныс жіберу", "Тексерілген жергілікті гидтер", "Гид болу", "Әзірге ештеңе табылмады.",
           "Шолулар", "Шолу жазу", "Шолуды жариялау", "Тіл", "Валюта", "Тілді іздеу", "Қолдану",
           "Сипаттама", "күніне"),
    "ky": ("Саякаттар", "Саякат тасмасы", "Гиддер", "Өзбекстанды бир жерден брондоңуз",
           "Мейманкана, поезд, жергиликтүү гиддер жана таасирлер — бир колдонмодо.", "Шаар боюнча издөө", "Издөө",
           "Баары", "Мейманканалар", "Транспорт", "Таасирлер", "Саякат тасмасы", "Жолдогу саякатчылардын сүрөттөрү.",
           "Сүрөт бөлүшүү", "Сүрөт жарыялоо", "Комментарийлер", "Брондоо", "Атыңыз", "Телефон номери", "Күнү",
           "Суроо жөнөтүү", "Текшерилген жергиликтүү гиддер", "Гид болуу", "Азырынча эч нерсе табылган жок.",
           "Пикирлер", "Пикир жазуу", "Пикирди жарыялоо", "Тил", "Валюта", "Тилди издөө", "Колдонуу",
           "Сүрөттөмө", "күнүнө"),
    "tg": ("Сафарҳо", "Лентаи сайёҳӣ", "Роҳнамоҳо", "Узбекистонро аз як ҷо брон кунед",
           "Меҳмонхона, қатор, роҳнамоёни маҳаллӣ ва таҷрибаҳо — дар як барнома.", "Ҷустуҷӯ аз рӯи шаҳр", "Ҷустуҷӯ",
           "Ҳама", "Меҳмонхонаҳо", "Нақлиёт", "Таҷрибаҳо", "Лентаи сайёҳӣ", "Аксҳо аз сайёҳон дар роҳ.",
           "Мубодилаи акс", "Ҷойгир кардани акс", "Шарҳҳо", "Брон кардан", "Номи шумо", "Рақами телефон", "Сана",
           "Фиристодани дархост", "Роҳнамоёни маҳаллии тасдиқшуда", "Роҳнамо шудан", "Ҳоло чизе ёфт нашуд.",
           "Баррасиҳо", "Навиштани баррасӣ", "Ҷойгир кардани баррасӣ", "Забон", "Асъор", "Ҷустуҷӯи забон",
           "Татбиқ", "Тавсиф", "дар як рӯз"),
    "tk": ("Syýahatlar", "Syýahat lentasy", "Gidler", "Özbegistany bir ýerden bronlaň",
           "Myhmanhana, otly, ýerli gidler we täsirler — bir programmada.", "Şäher boýunça gözleg", "Gözle",
           "Hemmesi", "Myhmanhanalar", "Ulag", "Täsirler", "Syýahat lentasy", "Ýoldaky syýahatçylardan suratlar.",
           "Surat paýlaş", "Suraty ýerleşdir", "Teswirler", "Indi bronla", "Adyňyz", "Telefon belgisi", "Sene",
           "Haýyş ibermek", "Tassyklanan ýerli gidler", "Gid bolmak", "Entek hiç zat tapylmady.",
           "Syn-bahalar", "Syn ýaz", "Syny ýerleşdir", "Dil", "Walýuta", "Dil gözle", "Ulan", "Beýany", "gününe"),
    "tr": ("Geziler", "Gezi akışı", "Rehberler", "Tüm Özbekistan’ı tek yerden rezerve edin",
           "Oteller, trenler, yerel rehberler ve deneyimler tek uygulamada.", "Şehre göre ara", "Ara",
           "Tümü", "Oteller", "Ulaşım", "Deneyimler", "Gezi akışı", "Yoldaki gezginlerden fotoğraflar.",
           "Fotoğraf paylaş", "Fotoğrafı gönder", "Yorumlar", "Hemen rezerve et", "Adınız", "Telefon numarası",
           "Tarih", "Talep gönder", "Doğrulanmış yerel rehberler", "Rehber ol", "Henüz eşleşen sonuç yok.",
           "Değerlendirmeler", "Değerlendirme yaz", "Değerlendirmeyi gönder", "Dil", "Para birimi", "Dil ara",
           "Uygula", "Hakkında", "günlük"),
    "zh": ("旅行", "旅行动态", "导游", "一站式预订乌兹别克斯坦", "酒店、火车、本地导游和体验，尽在一个应用。",
           "按城市搜索", "搜索", "全部", "酒店", "交通", "体验", "旅行动态", "旅行者在路上的照片。", "分享照片",
           "发布照片", "评论", "立即预订", "您的姓名", "电话号码", "日期", "发送请求", "已验证的本地导游", "成为导游",
           "暂时没有匹配的结果。", "评价", "写评价", "发布评价", "语言", "货币", "查找语言", "应用", "简介", "每天"),
    "ar": ("الرحلات", "موجز السفر", "المرشدون", "احجز أوزبكستان كلها في مكان واحد",
           "فنادق وقطارات ومرشدون محليون وتجارب في تطبيق واحد.", "ابحث حسب المدينة", "بحث", "الكل", "فنادق",
           "النقل", "تجارب", "موجز السفر", "صور من المسافرين على الطريق.", "شارك صورة", "انشر الصورة", "التعليقات",
           "احجز الآن", "اسمك", "رقم الهاتف", "التاريخ", "أرسل الطلب", "مرشدون محليون موثّقون", "كن مرشدًا",
           "لا توجد نتائج مطابقة بعد.", "التقييمات", "اكتب تقييمًا", "انشر التقييم", "اللغة", "العملة",
           "ابحث عن لغة", "تطبيق", "نبذة", "في اليوم"),
    "fa": ("سفرها", "فید سفر", "راهنمایان", "همهٔ ازبکستان را یک‌جا رزرو کنید",
           "هتل، قطار، راهنمای محلی و تجربه‌ها در یک اپلیکیشن.", "جستجو بر اساس شهر", "جستجو", "همه", "هتل‌ها",
           "حمل‌ونقل", "تجربه‌ها", "فید سفر", "عکس‌هایی از مسافران در مسیر.", "اشتراک عکس", "ارسال عکس", "نظرات",
           "همین حالا رزرو کنید", "نام شما", "شماره تلفن", "تاریخ", "ارسال درخواست", "راهنمایان محلی تأییدشده",
           "راهنما شوید", "هنوز نتیجه‌ای پیدا نشد.", "بازخوردها", "نوشتن بازخورد", "ارسال بازخورد", "زبان", "ارز",
           "جستجوی زبان", "اعمال", "درباره", "در روز"),
    "ko": ("여행", "여행 피드", "가이드", "우즈베키스탄을 한 곳에서 예약하세요", "호텔, 기차, 현지 가이드, 체험을 하나의 앱에서.",
           "도시로 검색", "검색", "전체", "호텔", "교통", "체험", "여행 피드", "여행 중인 여행자들의 사진.", "사진 공유",
           "사진 올리기", "댓글", "지금 예약", "이름", "전화번호", "날짜", "요청 보내기", "검증된 현지 가이드", "가이드 되기",
           "아직 일치하는 결과가 없습니다.", "후기", "후기 쓰기", "후기 올리기", "언어", "통화", "언어 찾기", "적용", "소개", "1일"),
    "ja": ("旅行", "旅フィード", "ガイド", "ウズベキスタンをまとめて予約", "ホテル、列車、現地ガイド、体験をひとつのアプリで。",
           "都市で検索", "検索", "すべて", "ホテル", "交通", "体験", "旅フィード", "旅の途中の旅行者の写真。", "写真をシェア",
           "写真を投稿", "コメント", "今すぐ予約", "お名前", "電話番号", "日付", "リクエストを送信", "認証済みの現地ガイド",
           "ガイドになる", "一致する結果はまだありません。", "レビュー", "レビューを書く", "レビューを投稿", "言語", "通貨",
           "言語を探す", "適用", "概要", "1日あたり"),
    "de": ("Reisen", "Reise-Feed", "Guides", "Ganz Usbekistan an einem Ort buchen",
           "Hotels, Züge, lokale Guides und Erlebnisse in einer App.", "Nach Stadt suchen", "Suchen", "Alle",
           "Hotels", "Transport", "Erlebnisse", "Reise-Feed", "Fotos von Reisenden unterwegs.", "Foto teilen",
           "Foto posten", "Kommentare", "Jetzt buchen", "Ihr Name", "Telefonnummer", "Datum", "Anfrage senden",
           "Verifizierte lokale Guides", "Guide werden", "Noch keine passenden Ergebnisse.", "Bewertungen",
           "Bewertung schreiben", "Bewertung posten", "Sprache", "Währung", "Sprache suchen", "Anwenden",
           "Beschreibung", "pro Tag"),
    "fr": ("Voyages", "Fil de voyage", "Guides", "Réservez tout l’Ouzbékistan en un seul endroit",
           "Hôtels, trains, guides locaux et expériences dans une seule appli.", "Rechercher par ville",
           "Rechercher", "Tout", "Hôtels", "Transport", "Expériences", "Fil de voyage",
           "Photos de voyageurs en chemin.", "Partager une photo", "Publier la photo", "Commentaires", "Réserver",
           "Votre nom", "Numéro de téléphone", "Date", "Envoyer la demande", "Guides locaux vérifiés",
           "Devenir guide", "Aucun résultat pour l’instant.", "Avis", "Écrire un avis", "Publier l’avis",
           "Langue", "Devise", "Rechercher une langue", "Appliquer", "À propos", "par jour"),
}

TRANSLATIONS = {code: dict(zip(KEYS, values)) for code, values in _TR.items()}
for _code, _values in _TR.items():
    assert len(_values) == len(KEYS), f"{_code}: {len(_values)} strings, expected {len(KEYS)}"
assert set(TRANSLATIONS) == set(LANGUAGES), "every language needs a translation set"

# Newer keys. A language missing here falls back to English.
_EXTRA = {
    "prev": {"en": "Previous", "uz": "Oldingi", "ru": "Назад", "kk": "Алдыңғы", "ky": "Мурунку", "tg": "Қаблӣ",
             "tk": "Öňki", "tr": "Önceki", "zh": "上一页", "ar": "السابق", "fa": "قبلی", "ko": "이전", "ja": "前へ",
             "de": "Zurück", "fr": "Précédent"},
    "next": {"en": "Next", "uz": "Keyingi", "ru": "Вперёд", "kk": "Келесі", "ky": "Кийинки", "tg": "Баъдӣ",
             "tk": "Indiki", "tr": "Sonraki", "zh": "下一页", "ar": "التالي", "fa": "بعدی", "ko": "다음", "ja": "次へ",
             "de": "Weiter", "fr": "Suivant"},
}
for _key, _per_lang in _EXTRA.items():
    for _code, _text in _per_lang.items():
        TRANSLATIONS[_code][_key] = _text


# Homepage redesign strings: (key, English, Uzbek, Russian). Other languages fall back to English.
_NEW_ROWS = [
    ("pill", "Verified local guides, clear prices", "Tasdiqlangan mahalliy gidlar, aniq narxlar", "Проверенные гиды, понятные цены"),
    ("h1_pre", "Discover", "O‘zbekistonni", "Откройте"),
    ("h1_accent", "Uzbekistan", "kashf eting", "Узбекистан"),
    ("h1_post", "local guides", "mahalliy gidlar bilan kashf eting", "местными гидами"),
    ("where", "Where to?", "Qayerga?", "Куда?"),
    ("kind", "Type", "Turi", "Тип"),
    ("trust_1_t", "Verified guides", "Tasdiqlangan gidlar", "Проверенные гиды"),
    ("trust_1_d", "Certificates checked by our team", "Sertifikatlari jamoamiz tomonidan tekshiriladi", "Сертификаты проверяет наша команда"),
    ("trust_2_t", "Clear prices", "Aniq narxlar", "Понятные цены"),
    ("trust_2_d", "Price shown before you book", "Narx bron qilishdan oldin ko‘rinadi", "Цена видна до бронирования"),
    ("trust_3_t", "15 languages", "15 ta til", "15 языков"),
    ("trust_3_d", "And 12 currencies", "va 12 ta valyuta", "и 12 валют"),
    ("trust_4_t", "Personal confirmation", "Shaxsiy tasdiqlash", "Личное подтверждение"),
    ("trust_4_d", "We call you to confirm every booking", "Har bir bronni qo‘ng‘iroq qilib tasdiqlaymiz", "Мы звоним, чтобы подтвердить бронь"),
    ("cities_title", "Popular cities", "Mashhur shaharlar", "Популярные города"),
    ("n_guides", "guides", "gid", "гидов"),
    ("n_trips", "trips", "sayohat", "поездок"),
    ("n_photos", "photos", "surat", "фото"),
    ("tab_taxi", "Taxi", "Taksi", "Такси"),
    ("tab_trip", "Tours", "Turlar", "Туры"),
    ("top_guides", "Top guides", "Eng yaxshi gidlar", "Лучшие гиды"),
    ("view_all", "View all", "Hammasini ko‘rish", "Смотреть все"),
    ("trips_title", "Trips and stays", "Sayohat va turar joylar", "Поездки и жильё"),
    ("how_title", "How it works", "Bu qanday ishlaydi", "Как это работает"),
    ("step1_t", "Choose", "Tanlang", "Выберите"),
    ("step1_d", "Pick a guide, trip or stay", "Gid, sayohat yoki turar joyni tanlang", "Выберите гида, поездку или жильё"),
    ("step2_t", "Send a request", "So‘rov yuboring", "Отправьте запрос"),
    ("step2_d", "Choose a date and leave your phone number", "Sanani tanlab, telefon raqamingizni qoldiring", "Выберите дату и оставьте телефон"),
    ("step3_t", "Enjoy", "Sayohatdan zavqlaning", "Наслаждайтесь"),
    ("step3_d", "We confirm by phone and you meet your guide", "Biz qo‘ng‘iroq qilib tasdiqlaymiz va siz gid bilan uchrashasiz", "Мы подтверждаем по телефону, и вы встречаете гида"),
    ("cta_title", "Are you a guide?", "Siz gidmisiz?", "Вы гид?"),
    ("cta_text", "Join Susambil and get requests from travelers.", "Susambil’ga qo‘shiling va sayohatchilardan so‘rovlar oling.", "Присоединяйтесь к Susambil и получайте заявки от путешественников."),
    ("footer_text", "Susambil connects travelers with verified local guides, trips and stays across Uzbekistan.", "Susambil sayohatchilarni O‘zbekiston bo‘ylab tasdiqlangan mahalliy gidlar, sayohat va turar joylar bilan bog‘laydi.", "Susambil связывает путешественников с проверенными гидами, поездками и жильём по всему Узбекистану."),
]
for _key, _en, _uz, _ru in _NEW_ROWS:
    for _code, _text in (("en", _en), ("uz", _uz), ("ru", _ru)):
        TRANSLATIONS[_code][_key] = _text


def translate(lang: str, key: str) -> str:
    return TRANSLATIONS.get(lang, {}).get(key) or TRANSLATIONS[DEFAULT_LANG].get(key, key)


def parse_accept_language(header: str) -> str:
    """Pick the best supported language from an Accept-Language header."""
    candidates = []
    for part in (header or "").split(","):
        piece = part.strip().split(";")
        code = piece[0].strip().lower().split("-")[0]
        q = 1.0
        for extra in piece[1:]:
            if extra.strip().startswith("q="):
                try:
                    q = float(extra.strip()[2:])
                except ValueError:
                    q = 0.0
        if code:
            candidates.append((q, code))
    for _, code in sorted(candidates, key=lambda c: -c[0]):
        if code in LANGUAGES:
            return code
    return DEFAULT_LANG


# --------------------------------------------------------------------------- currency
CURRENCIES = ["USD", "UZS", "EUR", "RUB", "KZT", "KGS", "TJS", "TMT", "CNY", "TRY", "KRW", "JPY"]
SYMBOLS = {"USD": "$", "EUR": "€"}

# Approximate fallback (units per 1 USD), used until live rates load or if the API is unreachable.
_rates = {"USD": 1.0, "UZS": 12500.0, "EUR": 0.92, "RUB": 90.0, "KZT": 500.0, "KGS": 87.0,
          "TJS": 10.0, "TMT": 3.5, "CNY": 7.2, "TRY": 40.0, "KRW": 1400.0, "JPY": 150.0}
RATES_TTL = 6 * 3600
_rates_ts = 0.0
_refreshing = False
_lock = threading.Lock()


def _refresh_rates() -> None:
    global _rates_ts, _refreshing
    ok = False
    try:
        data = requests.get("https://open.er-api.com/v6/latest/USD", timeout=6).json()
        if data.get("result") == "success":
            with _lock:
                for code in CURRENCIES:
                    if code in data["rates"]:
                        _rates[code] = float(data["rates"][code])
            ok = True
    except Exception:
        pass
    with _lock:
        # On failure retry in 10 minutes instead of hammering the API.
        _rates_ts = time.time() if ok else time.time() - RATES_TTL + 600
        _refreshing = False


def get_rate(code: str) -> float:
    global _refreshing
    if os.getenv("LIVE_RATES", "1") != "0" and time.time() - _rates_ts > RATES_TTL:
        with _lock:
            start = not _refreshing
            _refreshing = True
        if start:
            threading.Thread(target=_refresh_rates, daemon=True).start()
    return _rates.get(code, 1.0)


def money(usd: float, code: str) -> str:
    value = usd * get_rate(code)
    if code == "UZS":
        value = round(value / 1000) * 1000
    number = f"{value:,.0f}".replace(",", "\u00a0")
    return f"{SYMBOLS[code]}{number}" if code in SYMBOLS else f"{number}\u00a0{code}"
