export type Language = 
  | 'uz' // O'zbek
  | 'tg' // Tojik
  | 'kk' // Qozoq
  | 'ky' // Qirg'iz
  | 'tk' // Turkman
  | 'en' // English
  | 'ru' // Русский
  | 'fr' // Français
  | 'zh' // 中文
  | 'ja' // 日本語
  | 'ko' // 한국어
  | 'de' // Deutsch
  | 'tr' // Türkçe
  | 'ar' // العربية
  | 'es'; // Español

export type Currency = 'USD' | 'UZS' | 'EUR';

export type UserRole = 'traveler' | 'guide' | 'partner' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  country?: string;
  bio?: string;
}

export type DestinationRegion = 'silk_road' | 'mountains' | 'oasis' | 'hidden_valley' | 'desert';

export type LocalizedString = Partial<Record<Language, string>> & { uz: string; en: string };
export type LocalizedStringArray = Partial<Record<Language, string[]>> & { uz: string[]; en: string[] };

export interface Destination {
  id: string;
  slug: string;
  name: LocalizedString;
  region: DestinationRegion;
  tagline: LocalizedString;
  description: LocalizedString;
  image_url: string;
  gallery: string[];
  best_season: string;
  must_see: LocalizedStringArray;
  local_food: LocalizedStringArray;
  estimated_daily_cost_usd: number;
  is_hidden_gem?: boolean;
  latitude: number;
  longitude: number;
}

export type AccommodationType = 'boutique_hotel' | 'madrassah_hotel' | 'guesthouse' | 'hostel' | 'yurt_camp';

export interface Accommodation {
  id: string;
  name: LocalizedString;
  type: AccommodationType;
  city: string;
  address: string;
  description: LocalizedString;
  price_per_night_usd: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  gallery: string[];
  amenities: string[];
  is_featured?: boolean;
  partner_name?: string;
}

export type TransportType = 'train' | 'flight' | 'bus' | 'transfer' | 'car_rental';

export interface TransportRoute {
  id: string;
  type: TransportType;
  carrier: string;
  carrier_code?: string;
  origin_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price_usd: number;
  price_uzs: number;
  class_options: {
    name: string;
    price_usd: number;
    features: string[];
  }[];
  vehicle_type?: string;
  frequency: string;
  demo_api_source: string;
}

export type TourCategory = 'historical' | 'ecotourism' | 'gastronomic' | 'adventure' | 'workshops';

export interface Tour {
  id: string;
  title: LocalizedString;
  category: TourCategory;
  city: string;
  duration_days: number;
  duration_label: LocalizedString;
  price_usd: number;
  rating: number;
  reviews_count: number;
  group_size: string;
  language_codes: string[];
  image_url: string;
  gallery: string[];
  overview: LocalizedString;
  itinerary: {
    day: number;
    title: LocalizedString;
    description: LocalizedString;
  }[];
  included: LocalizedStringArray;
  not_included: LocalizedStringArray;
}

export interface Guide {
  id: string;
  user_id?: string;
  name: string;
  photo_url: string;
  city: string;
  languages: string[];
  experience_years: number;
  daily_rate_usd: number;
  rating: number;
  reviews_count: number;
  specialization: string[];
  bio: LocalizedString;
  is_verified: boolean;
  status?: 'approved' | 'pending' | 'suspended';
  phone?: string;
  email?: string;
}

export interface BookingRequest {
  id: string;
  user_id: string;
  item_type: 'accommodation' | 'hotel' | 'transport' | 'tour' | 'guide';
  item_id: string;
  item_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date?: string;
  guests_count: number;
  total_price_usd: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at?: string;
  is_demo?: boolean;
}

export interface SavedItinerary {
  id: string;
  user_id: string;
  title: string;
  duration_days: number;
  budget_level: 'budget' | 'standard' | 'luxury';
  total_cost_usd: number;
  days: CustomItineraryDay[];
  created_at: string;
}

export interface CustomItineraryDay {
  day_number: number;
  city: string;
  morning: string;
  afternoon: string;
  evening: string;
  hotel_suggestion?: string;
  transport_note?: string;
  est_budget_usd: number;
}
