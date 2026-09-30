import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg border border-amber-600/40 bg-[#1a1410]/95 px-4 py-2.5 text-xs text-amber-200 shadow-2xl backdrop-blur-md transition-all animate-bounce"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
        <WifiOff className="h-3.5 w-3.5" />
      </div>
      <div>
        <span className="font-bold text-amber-400">وضع عدم الاتصال: </span>
        <span>التحقيق متاح محلياً وتعمل كافة الألغاز والصوتيات دون انقطاع.</span>
      </div>
    </div>
  );
};
