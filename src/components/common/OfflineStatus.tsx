import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export const OfflineStatus: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce print:hidden">
      {isOffline ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700">
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          <div>
            <span className="font-bold block">Oflayn rejim faol</span>
            <span className="text-[10px] text-slate-300">Saqlangan marshrutlaringiz mavjud</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>Internet aloqasi tiklandi</span>
        </div>
      )}
    </div>
  );
};
