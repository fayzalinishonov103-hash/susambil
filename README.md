# Susambil

## Run on Windows (PowerShell)
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
    copy .env.example .env      (then open .env and set ADMIN_PASSWORD)
    python seed.py              (first time only: sample data)
    uvicorn main:app --reload

Open http://127.0.0.1:8000 and the admin panel at http://127.0.0.1:8000/admin

## Folders
    main.py  models.py  seed.py  translations.py
    templates/   HTML pages
    static/css/app.css   ready-made styles (rebuild: npm install, npm run build:css)
    static/uploads/      uploaded photos

## Deploy (Render/Railway)
Start command is in Procfile. Set ADMIN_PASSWORD, SITE_URL, DATABASE_URL (Postgres) and
CLOUDINARY_URL as environment variables; the container disk is wiped on every deploy.
