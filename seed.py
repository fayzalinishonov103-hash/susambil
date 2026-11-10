"""Creates the tables and fills the site with sample data.

Safe to run again: it only adds sample items that are not in the database yet
(matched by title / name), so nothing is duplicated and nothing is deleted.
Sample items have no photo; the site shows an illustration until you add a real one.
"""
from pathlib import Path

import models
from models import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)
models.ensure_columns()
(Path(__file__).resolve().parent / "static" / "uploads").mkdir(parents=True, exist_ok=True)

# (title, type, location, price in USD, duration, description)
ITEMS = [
    ("Silk Road Boutique Hotel", "hotel", "Tashkent", 85, "Per night",
     "A quiet courtyard hotel ten minutes from Chorsu Bazaar. Hand-painted ceilings, breakfast under the grape trellis and airport pickup at any hour."),
    ("Tashkent City Sky Suites", "hotel", "Tashkent", 120, "Per night",
     "Modern suites on the upper floors of a central tower, with a rooftop pool, a gym and the metro a few minutes away."),
    ("Registan View Hotel", "hotel", "Samarkand", 70, "Per night",
     "Family-run hotel with a roof terrace that looks straight at the Registan. Breakfast included, guides can be arranged at the desk."),
    ("Kalyan Courtyard Guesthouse", "hotel", "Bukhara", 45, "Per night",
     "A restored merchant house in old Bukhara with six rooms around a shaded courtyard, two minutes on foot from the Kalyan minaret."),
    ("Itchan Kala Heritage Inn", "hotel", "Khiva", 55, "Per night",
     "Stay inside the walls of Khiva. Carved wooden columns, a terrace for sunset and a kitchen that serves local dishes."),

    ("Airport Transfer, Tashkent", "taxi", "Tashkent", 12, "30 min",
     "Meet-and-greet pickup from Tashkent airport to any hotel in the city. Fixed price, sedan for up to 3 passengers, flight tracked for delays."),
    ("Samarkand City Taxi, Full Day", "taxi", "Samarkand", 40, "8 hours",
     "A driver and a comfortable car for the whole day in Samarkand. Stops at the Registan, Gur-e-Amir, Shah-i-Zinda and the bazaar."),
    ("Private Transfer Tashkent to Samarkand", "taxi", "Tashkent to Samarkand", 90, "3.5 hours",
     "Door-to-door ride by car, with a photo stop on the way. Up to 3 passengers and luggage, water on board."),
    ("Minivan Transfer Samarkand to Bukhara", "taxi", "Samarkand to Bukhara", 80, "3 hours",
     "Spacious minivan for groups of up to 7 people. Pickup from your hotel and drop-off at your guesthouse."),

    ("Afrosiyob High-Speed Train", "transport", "Tashkent to Samarkand", 28, "2 h 10 min",
     "Comfort-class seat on the Afrosiyob express. Air conditioning, power sockets and a snack cart."),
    ("Sharq Train to Bukhara", "transport", "Samarkand to Bukhara", 14, "1 h 50 min",
     "Relaxed daytime train between Samarkand and Bukhara. Buy your ticket on the official railway site, we show you the schedule."),
    ("Uzbekistan Airways Domestic Flight", "transport", "Tashkent to Khiva (Urgench)", 65, "1 h 40 min",
     "One-way economy flight from Tashkent to Urgench, the gateway to Khiva. A shuttle to Khiva meets every arrival."),

    ("Samarkand: Registan and Shah-i-Zinda Walk", "experience", "Samarkand", 45, "5 hours",
     "A guided walk through the Registan, Gur-e-Amir and the blue-tiled Shah-i-Zinda, finishing with plov in the old town."),
    ("Khiva: Itchan Kala Sunset Tour", "experience", "Khiva", 38, "3 hours",
     "Climb the Islam Khoja minaret, wander the walled city and watch the walls turn gold from the Kuhna Ark viewpoint."),
    ("Tashkent Plov Master Class", "experience", "Tashkent", 25, "3 hours",
     "Cook the national dish with a local chef: market visit, cauldron cooking and a long lunch with everything you made."),
    ("Bukhara Ceramics and Silk Workshop", "experience", "Bukhara", 30, "2 hours",
     "Try a potter's wheel and watch a silk weaver at work in a family workshop. You take your own piece home."),

    ("Silk Road Classic: Samarkand, Bukhara, Khiva", "trip", "Samarkand, Bukhara, Khiva", 520, "5 days",
     "The great cities in one route: train and car transfers, hotels, entrance tickets and a local guide in every city."),
    ("Tashkent Highlights Day Tour", "trip", "Tashkent", 60, "1 day",
     "Old and new Tashkent in one day: Chorsu Bazaar, Khast Imam, the metro stations and a lunch stop."),
    ("Nurata Mountains and Yurt Camp", "trip", "Nurata", 110, "2 days",
     "Drive into the Nurata hills, ride camels at Aydarkul lake and sleep in a yurt under the stars."),
    ("Fergana Valley Crafts Route", "trip", "Fergana", 240, "3 days",
     "Silk in Margilan, ceramics in Rishtan and the markets of Kokand, with a local driver and guide."),
]

# (name, city, languages, years, price/day, rating, points, tours, badge, bio)
GUIDES = [
    ("Jasur Rakhimov", "Samarkand", "English, Russian, Uzbek, German", 9, 70, 4.9, 480, 132, "Silk Road Expert",
     "Licensed historian-guide born in Samarkand. Builds routes around the quiet corners of the old city."),
    ("Madina Yusupova", "Bukhara", "English, Russian, Uzbek, French", 6, 60, 4.8, 320, 74, "Trusted Guide",
     "Grew up in the old town of Bukhara and knows every courtyard, workshop and tea house worth visiting."),
    ("Aziz Karimov", "Khiva", "English, Russian, Uzbek, Turkish", 5, 55, 4.7, 210, 41, "Rising Guide",
     "Khiva local who loves sunrise walks on the city walls and stories about the caravan trade."),
    ("Dilnoza Rustamova", "Tashkent", "English, Russian, Uzbek, Chinese", 4, 50, 4.6, 150, 22, "Rising Guide",
     "Tashkent guide for first-time visitors: food markets, Soviet architecture and modern city life."),
]


def seed() -> None:
    db = SessionLocal()
    try:
        have = {t for (t,) in db.query(models.TourItem.title).all()}
        added = 0
        for title, kind, place, price, duration, text in ITEMS:
            if title not in have:
                db.add(models.TourItem(title=title, item_type=kind, location=place, price=price,
                                       duration=duration, description=text, image_url=""))
                added += 1

        names = {n for (n,) in db.query(models.Guide.full_name).all()}
        for name, city, langs, years, price, rating, points, tours, badge, bio in GUIDES:
            if name not in names:
                db.add(models.Guide(full_name=name, city=city, languages=langs, experience_years=years, bio=bio,
                                    price_per_day=price, profile_image_url="", certificate_url="", is_verified=True,
                                    rating=rating, points=points, completed_tours=tours, badge=badge))
                added += 1

        if db.query(models.TravelPost).count() == 0:
            pic = lambda s: f"https://picsum.photos/seed/{s}/900/900"
            db.add_all([
                models.TravelPost(title="Golden hour at the Registan", image_url=pic("post-registan"), location="Samarkand",
                                  author_name="Madina K.", hashtags="#samarkand #registan #silkroad", like_count=24),
                models.TravelPost(title="Lost in the walls of Khiva", image_url=pic("post-khiva"), location="Khiva",
                                  author_name="Daniel R.", hashtags="#khiva #uzbekistan #traveldiary", like_count=17),
            ])
            db.flush()
            first = db.query(models.TravelPost).order_by(models.TravelPost.id).first()
            db.add(models.PostComment(post_id=first.id, author_name="Aziz", comment="Best light of the day. Great shot!"))
            added += 2

        db.commit()
        print(f"Database ready. Added {added} sample record(s).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
