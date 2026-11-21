import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Info, X } from 'lucide-react';

export const DemoNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200/60 py-2 px-4 sm:px-8 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Demo rejim:</strong> Temir yo'l va aviakompaniya API larini ulagandan so'ng to'lov va real bron faol bo'ladi. Hozir demo ma'lumotlar ko'rsatilmoqda.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500 hover:text-amber-800 flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
