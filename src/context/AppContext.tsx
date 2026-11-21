import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Currency, 
  UserProfile, 
  UserRole, 
  BookingRequest, 
  SavedItinerary,
  Destination,
  Guide
} from '../types';
import { getTranslation } from '../i18n/translations';
import { DESTINATIONS, GUIDES } from '../data/mockData';
import { storageService } from '../lib/supabase';
import confetti from 'canvas-confetti';

export type AppPage = 
  | 'home' 
  | 'destinations' 
  | 'transport' 
  | 'hotels' 
  | 'tours' 
  | 'guides' 
  | 'planner' 
  | 'budget' 
  | 'hidden' 
  | 'about' 
  | 'dashboard' 
  | 'partner' 
  | 'admin';

export interface BookingModalData {
  itemType: BookingRequest['item_type'];
  itemId: string;
  itemTitle: string;
  priceUsd: number;
  startDate?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchRole: (role: UserRole) => void;
  t: (key: string) => string;
  formatPrice: (usdAmount: number) => string;
  
  // Bookings
  bookings: BookingRequest[];
  createBooking: (booking: Omit<BookingRequest, 'id' | 'created_at'>) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  // Itineraries
  savedItineraries: SavedItinerary[];
  saveItinerary: (itinerary: Omit<SavedItinerary, 'id' | 'created_at'>) => void;
  
  // Modals & Auth Flow
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalPrompt: string | null;
  authModalTab: 'login' | 'register' | 'admin';
  openAuthModal: (options?: { prompt?: string; tab?: 'login' | 'register' | 'admin'; pendingBooking?: BookingModalData }) => void;
  closeAuthModal: () => void;
  
  bookingModalOpen: boolean;
  bookingModalData: BookingModalData | null;
  openBookingModal: (data: BookingModalData) => void;
  closeBookingModal: () => void;
  
  // Auth Operations
  login: (email: string, name?: string) => boolean;
  loginAdmin: (loginStr: string, passStr: string) => boolean;
  registerUser: (data: { full_name: string; email: string; phone?: string; role?: UserRole }) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Dynamic Data & Admin Management
  destinations: Destination[];
  addDestination: (dest: Destination) => void;
  guides: Guide[];
  updateGuideStatus: (guideId: string, status: 'approved' | 'pending' | 'suspended', isVerified?: boolean) => void;
  addGuide: (guide: Guide) => void;
  
  // Toast Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Exchange rates relative to 1 USD
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  UZS: 12850,
  EUR: 0.92,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('susambil_lang') as Language;
      return saved || 'uz';
    } catch {
      return 'uz';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('susambil_lang', lang);
    } catch {}
  };

  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('susambil_curr') as Currency;
      return saved || 'USD';
    } catch {
      return 'USD';
    }
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('susambil_curr', curr);
    } catch {}
  };
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => storageService.getUser());
  const [bookings, setBookings] = useState<BookingRequest[]>(() => storageService.getBookings());
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>(() => storageService.getSavedItineraries());

  // Dynamic Destinations & Guides state
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const saved = localStorage.getItem('susambil_destinations');
      return saved ? JSON.parse(saved) : DESTINATIONS;
    } catch {
      return DESTINATIONS;
    }
  });

  const [guides, setGuides] = useState<Guide[]>(() => {
    try {
      const saved = localStorage.getItem('susambil_guides');
      return saved ? JSON.parse(saved) : GUIDES;
    } catch {
      return GUIDES;
    }
  });

  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState<string | null>(null);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'admin'>('login');
  const [pendingBookingData, setPendingBookingData] = useState<BookingModalData | null>(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalData, setBookingModalData] = useState<BookingModalData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with storage
  useEffect(() => {
    storageService.setUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('susambil_destinations', JSON.stringify(destinations));
    } catch (e) {
      console.warn(e);
    }
  }, [destinations]);

  useEffect(() => {
    try {
      localStorage.setItem('susambil_guides', JSON.stringify(guides));
    } catch (e) {
      console.warn(e);
    }
  }, [guides]);

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const formatPrice = (usdAmount: number): string => {
    const rate = EXCHANGE_RATES[currency];
    const converted = usdAmount * rate;
    
    if (currency === 'UZS') {
      return new Intl.NumberFormat(language === 'uz' ? 'uz-UZ' : 'ru-RU', {
        maximumFractionDigits: 0
      }).format(Math.round(converted)) + ' UZS';
    } else if (currency === 'EUR') {
      return '€' + Math.round(converted);
    } else {
      return '$' + Math.round(converted);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth Operations
  const openAuthModal = (options?: { prompt?: string; tab?: 'login' | 'register' | 'admin'; pendingBooking?: BookingModalData }) => {
    if (options?.prompt) setAuthModalPrompt(options.prompt);
    else setAuthModalPrompt(null);

    if (options?.tab) setAuthModalTab(options.tab);
    else setAuthModalTab('login');

    if (options?.pendingBooking) setPendingBookingData(options.pendingBooking);

    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalPrompt(null);
  };

  const login = (email: string, name?: string): boolean => {
    const user: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      full_name: name || (email.split('@')[0].toUpperCase()),
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'traveler',
      country: 'O‘zbekiston',
    };
    setCurrentUser(user);
    closeAuthModal();
    showToast(`Xush kelibsiz, ${user.full_name}!`);

    // If user was trying to book, continue booking automatically
    if (pendingBookingData) {
      setTimeout(() => {
        setBookingModalData(pendingBookingData);
        setBookingModalOpen(true);
        setPendingBookingData(null);
      }, 400);
    }
    return true;
  };

  const loginAdmin = (loginStr: string, passStr: string): boolean => {
    if (loginStr.trim() === 'Susambil' && passStr.trim() === 'Hakuna273') {
      const adminProfile: UserProfile = {
        id: 'admin-master',
        email: 'admin@susambil.uz',
        full_name: 'Bosh Administrator (Susambil HQ)',
        role: 'admin',
        country: 'O‘zbekiston',
        phone: '+998 71 200-00-11',
      };
      setCurrentUser(adminProfile);
      closeAuthModal();
      setCurrentPage('admin');
      showToast('Admin konsoliga muvaffaqiyatli kirdingiz!');
      return true;
    }
    showToast('Xatolik: Admin login yoki parol noto‘g‘ri!');
    return false;
  };

  const registerUser = (data: { full_name: string; email: string; phone?: string; role?: UserRole }): boolean => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role || 'traveler',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      country: 'O‘zbekiston',
    };
    setCurrentUser(newUser);
    closeAuthModal();
    showToast(`Ro‘yxatdan o‘tdingiz! Xush kelibsiz, ${newUser.full_name}!`);

    if (pendingBookingData) {
      setTimeout(() => {
        setBookingModalData(pendingBookingData);
        setBookingModalOpen(true);
        setPendingBookingData(null);
      }, 400);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Tizimdan chiqdingiz');
    if (currentPage === 'dashboard' || currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    storageService.setUser(updated);
    showToast('Profil ma‘lumotlari saqlandi!');
  };

  const switchRole = (role: UserRole) => {
    let mockProfile: UserProfile;
    if (role === 'admin') {
      mockProfile = {
        id: 'admin-001',
        email: 'admin@susambil.uz',
        full_name: 'Admin Nazoratchi (Susambil)',
        role: 'admin',
        country: 'Uzbekistan',
        phone: '+998 71 200-00-11'
      };
      setCurrentPage('admin');
    } else if (role === 'partner') {
      mockProfile = {
        id: 'partner-001',
        email: 'partner@susambil.uz',
        full_name: 'Jasur Saidov (Mehmonxona & Transfer Hamkor)',
        role: 'partner',
        country: 'Uzbekistan',
        phone: '+998 90 123-45-67'
      };
      setCurrentPage('partner');
    } else if (role === 'guide') {
      mockProfile = {
        id: 'guide-001',
        email: 'rustam.guide@susambil.uz',
        full_name: 'Rustam Qosimov (Gid)',
        role: 'guide',
        country: 'Uzbekistan',
        phone: '+998 90 123-45-67'
      };
      setCurrentPage('guides');
    } else {
      mockProfile = {
        id: 'user-traveler-1',
        email: 'traveler@susambil.uz',
        full_name: 'Sardor Rahimiy',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'traveler',
        country: 'O‘zbekiston',
        phone: '+998 90 987-65-43'
      };
      setCurrentPage('dashboard');
    }
    setCurrentUser(mockProfile);
    showToast(`Rol o‘zgartirildi: ${role.toUpperCase()}`);
  };

  const createBooking = (bookingData: Omit<BookingRequest, 'id' | 'created_at'>) => {
    storageService.addBooking(bookingData);
    setBookings(storageService.getBookings());
    closeBookingModal();
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    showToast('Buyurtma so‘rovi muvaffaqiyatli qabul qilindi!');
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    const updated = storageService.updateBookingStatus(id, status);
    setBookings(updated);
    showToast(`Buyurtma #${id} holati yangilandi: ${status}`);
  };

  const toggleFavorite = (id: string) => {
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const saveItinerary = (itineraryData: Omit<SavedItinerary, 'id' | 'created_at'>) => {
    storageService.saveItinerary(itineraryData);
    setSavedItineraries(storageService.getSavedItineraries());
    showToast('Marshrut saqlandi!');
  };

  // Booking Auth Gate:
  // If guest clicks "Bron qilish", ask them to sign in or register first!
  const openBookingModal = (data: BookingModalData) => {
    if (!currentUser) {
      openAuthModal({
        prompt: 'Bron qilishni davom ettirish uchun profilingizga kiring yoki ro‘yxatdan o‘ting!',
        pendingBooking: data,
      });
      return;
    }
    setBookingModalData(data);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setBookingModalData(null);
  };

  // Admin dynamic updates
  const addDestination = (newDest: Destination) => {
    setDestinations((prev) => [newDest, ...prev]);
    showToast(`Yangi manzil "${newDest.name.uz || newDest.name.en}" qo‘shildi!`);
  };

  const updateGuideStatus = (guideId: string, status: 'approved' | 'pending' | 'suspended', isVerified: boolean = true) => {
    setGuides((prev) =>
      prev.map((g) =>
        g.id === guideId
          ? { ...g, status, is_verified: status === 'approved' ? isVerified : false }
          : g
      )
    );
    showToast(`Gid holati muvaffaqiyatli yangilandi: ${status}`);
  };

  const addGuide = (newGuide: Guide) => {
    setGuides((prev) => [newGuide, ...prev]);
    showToast(`Yangi gid "${newGuide.name}" muvaffaqiyatli qo‘shildi!`);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        currentPage,
        setCurrentPage,
        currentUser,
        setCurrentUser,
        switchRole,
        t,
        formatPrice,
        bookings,
        createBooking,
        updateBookingStatus,
        favorites,
        toggleFavorite,
        isFavorite,
        savedItineraries,
        saveItinerary,
        authModalOpen,
        setAuthModalOpen,
        authModalPrompt,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        bookingModalOpen,
        bookingModalData,
        openBookingModal,
        closeBookingModal,
        login,
        loginAdmin,
        registerUser,
        logout,
        updateUserProfile,
        destinations,
        addDestination,
        guides,
        updateGuideStatus,
        addGuide,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
