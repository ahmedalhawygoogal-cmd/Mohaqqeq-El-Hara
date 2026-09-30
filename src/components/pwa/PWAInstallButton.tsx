import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, Smartphone, X, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already installed and running standalone, do not clutter UI
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  if (justInstalled) {
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-pulse ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span>تم تثبيت التطبيق بنجاح!</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 rounded-lg border border-amber-500/60 bg-gradient-to-r from-amber-700/80 to-amber-600/80 hover:from-amber-600 hover:to-amber-500 px-3.5 py-1.5 text-xs font-bold text-amber-50 shadow-md shadow-amber-950/40 transition active:scale-95 cursor-pointer ${className}`}
        title="تثبيت اللعبة كتطبيق على جهازك للتشغيل دون متصفح"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-amber-600/40 bg-[#1e1713] hover:bg-[#2a2019] px-3 py-1.5 text-xs font-semibold text-amber-300 transition active:scale-95 cursor-pointer ${className}`}
          title="تثبيت التطبيق على آيفون / آيباد"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>تثبيت PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-amber-500/40 bg-[#16120e] p-6 text-right text-stone-200 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-amber-200">تثبيت التطبيق على الآيفون</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-sm leading-relaxed">
                <div className="flex items-start gap-3 rounded-lg bg-[#221b16] p-3 border border-amber-900/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/30 font-bold text-amber-300">
                    1
                  </div>
                  <p className="text-stone-300">
                    اضغط على زر <strong className="text-amber-300">المشاركة (Share <Share2 className="inline w-3.5 h-3.5" />)</strong> في أسفل شريط متصفح سفاري (Safari).
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-[#221b16] p-3 border border-amber-900/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/30 font-bold text-amber-300">
                    2
                  </div>
                  <p className="text-stone-300">
                    مرر لأسفل في القائمة واختر <strong className="text-amber-300">إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-[#221b16] p-3 border border-amber-900/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/30 font-bold text-amber-300">
                    3
                  </div>
                  <p className="text-stone-300">
                    اضغط على <strong className="text-amber-300">إضافة (Add)</strong> في أعلى اليمين. سيظهر رمز "محقق الحارة" كتطبيق مستقل بجانب تطبيقاتك!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-2.5 text-center text-sm font-bold text-white shadow-lg transition"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser banner button so user can always initiate or see the option
  return (
    <button
      onClick={() => {
        alert?.('لتثبيت التطبيق على جهازك، اضغط على أيقونة التثبيت (Install) في شريط عنوان المتصفح أو قائمة الخيارات.');
      }}
      className={`hidden md:flex items-center gap-1.5 rounded-lg border border-amber-700/30 bg-[#1b1511] hover:bg-[#251d17] px-3 py-1.5 text-xs text-amber-300/80 hover:text-amber-200 transition ${className}`}
      title="تطبيق ويب تقدمي (PWA)"
    >
      <Download className="w-3.5 h-3.5 text-amber-500" />
      <span>تطبيق PWA</span>
    </button>
  );
};
