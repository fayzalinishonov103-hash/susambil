import { createClient } from '@supabase/supabase-js';
import { BookingRequest, SavedItinerary, UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isLiveSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://mock.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Local Storage Fallback Keys
const STORAGE_KEYS = {
  USER: 'susambil_user_profile',
  BOOKINGS: 'susambil_bookings',
  FAVORITES: 'susambil_favorites',
  ITINERARIES: 'susambil_saved_itineraries',
  PARTNERS: 'susambil_partners',
};

// Initial Sample Bookings for MVP Demonstration
const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'bk-demo-001',
    user_id: 'user-traveler-1',
    item_type: 'transport',
    item_id: 'tr-afrosiyob-tash-sam',
    item_title: 'Afrosiyob #762 High-Speed Train: Tashkent → Samarkand (Business Class)',
    customer_name: 'Alexandre Dubois',
    customer_email: 'alexandre.dubois@traveler.fr',
    customer_phone: '+33 6 12 34 56 78',
    start_date: '2026-05-15',
    guests_count: 2,
    total_price_usd: 56,
    status: 'confirmed',
    special_requests: 'Window seats requested near the dining car.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    is_demo: true,
  },
  {
    id: 'bk-demo-002',
    user_id: 'user-traveler-1',
    item_type: 'hotel',
    item_id: 'acc-orient-star-khiva',
    item_title: 'Orient Star Khiva Hotel (Mohammed Amin Khan Madrassah)',
    customer_name: 'Alexandre Dubois',
    customer_email: 'alexandre.dubois@traveler.fr',
    customer_phone: '+33 6 12 34 56 78',
    start_date: '2026-05-18',
    end_date: '2026-05-21',
    guests_count: 2,
    total_price_usd: 255,
    status: 'pending',
    special_requests: 'Traditional upper floor room with courtyard view.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_demo: true,
  },
  {
    id: 'bk-demo-003',
    user_id: 'user-traveler-2',
    item_type: 'tour',
    item_id: 'tour-gastronomic-masterclass',
    item_title: 'Uzbek Culinary Masterclass & Plov Secrets',
    customer_name: 'Sophia Mueller',
    customer_email: 'sophia.m@berlin-travel.de',
    customer_phone: '+49 171 2345678',
    start_date: '2026-06-02',
    guests_count: 3,
    total_price_usd: 255,
    status: 'pending',
    special_requests: 'One traveler has a mild nut allergy.',
    created_at: new Date().toISOString(),
    is_demo: true,
  }
];

export const storageService = {
  // Profiles & Auth
  getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    // Default logged in demo traveler so the app is instantly rich with data
    const defaultUser: UserProfile = {
      id: 'user-traveler-1',
      email: 'traveler@susambil.uz',
      full_name: 'Alexandre Dubois',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'traveler',
      country: 'France',
      phone: '+33 6 12 34 56 78'
    };
    this.setUser(defaultUser);
    return defaultUser;
  },

  setUser(user: UserProfile | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  // Bookings
  getBookings(): BookingRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  },

  addBooking(booking: Omit<BookingRequest, 'id' | 'created_at'>): BookingRequest {
    const current = this.getBookings();
    const newBooking: BookingRequest = {
      ...booking,
      id: `bk-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_demo: true,
    };
    const updated = [newBooking, ...current];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return newBooking;
  },

  updateBookingStatus(bookingId: string, status: BookingRequest['status']): BookingRequest[] {
    const current = this.getBookings();
    const updated = current.map(b => b.id === bookingId ? { ...b, status } : b);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return updated;
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    const defaults = ['dest-samarkand', 'acc-orient-star-khiva', 'tour-golden-triangle'];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(defaults));
    return defaults;
  },

  toggleFavorite(id: string): string[] {
    const favs = this.getFavorites();
    const exists = favs.includes(id);
    const updated = exists ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  },

  // Itineraries
  getSavedItineraries(): SavedItinerary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  saveItinerary(itinerary: Omit<SavedItinerary, 'id' | 'created_at'>): SavedItinerary {
    const current = this.getSavedItineraries();
    const newItinerary: SavedItinerary = {
      ...itinerary,
      id: `itin-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newItinerary, ...current];
    localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(updated));
    return newItinerary;
  },

  // Partners
  getPartners() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [
      {
        id: 'pt-001',
        business_name: 'Bukhara Heritage Boutique Group',
        category: 'hotel',
        contact_person: 'Jasur Saidov',
        phone: '+998 90 123 45 67',
        email: 'info@bukhara-heritage.uz',
        city: 'Bukhara',
        status: 'approved',
        created_at: '2026-03-10'
      },
      {
        id: 'pt-002',
        business_name: 'Afrosiyob VIP Transfer Fleet',
        category: 'transport',
        contact_person: 'Sherzod Alimov',
        phone: '+998 93 987 65 43',
        email: 'fleet@afrosiyob-vip.uz',
        city: 'Samarkand',
        status: 'approved',
        created_at: '2026-04-01'
      }
    ];
  },

  addPartner(partner: Record<string, unknown>) {
    const current = this.getPartners();
    const newPartner = {
      ...partner,
      id: `pt-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [newPartner, ...current];
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(updated));
    return newPartner;
  }
};
