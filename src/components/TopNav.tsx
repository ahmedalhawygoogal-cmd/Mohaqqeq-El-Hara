import React, { useState } from 'react';
import { 
  Map, 
  BookOpen, 
  GitMerge, 
  Microscope, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Radio, 
  Gavel, 
  Search
} from 'lucide-react';
import { ScreenMode, GameSaveState } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface TopNavProps {
  gameState: GameSaveState;
  onNavigate: (screen: ScreenMode) => void;
  onResetGame: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ gameState, onNavigate, onResetGame }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleMute = () => {
    soundManager.notifyUserInteraction();
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
    if (isMuted && val > 0) {
      soundManager.toggleMute();
      setIsMuted(false);
    }
  };

  const evidenceCount = gameState.collectedEvidenceIds.length;
  const currentScreen = gameState.currentScreen;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#120f0d]/95 backdrop-blur-md border-b border-[#2d251f] text-[#ebdcc6] px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand & Slogan */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                soundManager.playSoundEffect('click');
                onNavigate(currentScreen === 'intro' ? 'map' : 'intro');
              }}
              className="text-right focus:outline-none group"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif-arabic text-xl sm:text-2xl font-bold tracking-tight text-[#e5a744] group-hover:text-[#f8c568] transition-colors">
                  محقق الحارة
                </span>
                <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded bg-[#28211b] text-[#a89682] border border-[#3d3228]">
                  القضية 01
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#9d8975] font-sans tracking-wide">
                كل دليل له حكاية.
              </p>
            </button>
          </div>

          {/* Quick Primary Nav Tabs */}
          {currentScreen !== 'intro' && currentScreen !== 'result' && (
            <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <button
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  onNavigate('map');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentScreen === 'map' || currentScreen === 'location'
                    ? 'bg-[#2b221a] text-[#e5a744] border border-[#d4973b]/40 shadow-sm'
                    : 'text-[#bfab96] hover:bg-[#1f1915] hover:text-[#f4ecd8]'
                }`}
                title="خريطة حي السرايا"
              >
                <Map className="w-4 h-4 text-[#d4973b]" />
                <span className="hidden sm:inline">الخريطة</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playSoundEffect('paper');
                  onNavigate('notebook');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium relative transition-all ${
                  currentScreen === 'notebook'
                    ? 'bg-[#2b221a] text-[#e5a744] border border-[#d4973b]/40 shadow-sm'
                    : 'text-[#bfab96] hover:bg-[#1f1915] hover:text-[#f4ecd8]'
                }`}
                title="دفتر التحريات والملاحظات"
              >
                <BookOpen className="w-4 h-4 text-[#d4973b]" />
                <span className="hidden sm:inline">الدفتر</span>
                {evidenceCount > 0 && (
                  <span className="bg-[#8b261e] text-[#fbf1e8] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {evidenceCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  soundManager.playSoundEffect('paper');
                  onNavigate('deduction-board');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentScreen === 'deduction-board'
                    ? 'bg-[#2b221a] text-[#e5a744] border border-[#d4973b]/40 shadow-sm'
                    : 'text-[#bfab96] hover:bg-[#1f1915] hover:text-[#f4ecd8]'
                }`}
                title="لوحة الاستنتاج وربط الخيوط"
              >
                <GitMerge className="w-4 h-4 text-[#d4973b]" />
                <span className="hidden sm:inline">لوحة الاستنتاج</span>
              </button>

              {/* Lab Fast Access if evidence exists */}
              <button
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  onNavigate('puzzle-forensic');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentScreen === 'puzzle-forensic'
                    ? 'bg-[#2b221a] text-[#e5a744] border border-[#d4973b]/40 shadow-sm'
                    : 'text-[#bfab96] hover:bg-[#1f1915] hover:text-[#f4ecd8]'
                }`}
                title="المختبر الجنائي وفحص الأوراق"
              >
                <Microscope className="w-4 h-4 text-[#d4973b]" />
                <span className="hidden md:inline">المختبر</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playSoundEffect('cassette_click');
                  onNavigate('puzzle-cassette');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentScreen === 'puzzle-cassette'
                    ? 'bg-[#2b221a] text-[#e5a744] border border-[#d4973b]/40 shadow-sm'
                    : 'text-[#bfab96] hover:bg-[#1f1915] hover:text-[#f4ecd8]'
                }`}
                title="وحدة فحص شريط الكاسيت"
              >
                <Radio className="w-4 h-4 text-[#d4973b]" />
                <span className="hidden md:inline">الكاسيت</span>
              </button>

              {/* High Stakes Accusation Button */}
              <button
                onClick={() => {
                  soundManager.playSoundEffect('stinger');
                  onNavigate('accusation');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-[#78221b] hover:bg-[#962b22] text-[#fdead8] border border-[#ab382d] shadow-sm transition-all ml-1"
                title="توجيه الاتهام النهائي وحسم القضية"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>الاتهام</span>
              </button>
            </nav>
          )}

          {/* Action Tools, PWA & Audio */}
          <div className="flex items-center gap-2">
            {/* In-App PWA Install Action */}
            <PWAInstallButton />

            {/* Audio Volume Controls Popover */}
            <div className="relative flex items-center">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className={`p-1.5 rounded flex items-center gap-1 transition-all ${
                  showVolumeSlider 
                    ? 'bg-[#2b221a] text-[#e5a744] border border-[#d4973b]/40' 
                    : isMuted 
                      ? 'text-[#ba4e45] hover:bg-[#201a16]' 
                      : 'text-[#a89682] hover:text-[#e5a744] hover:bg-[#201a16]'
                }`}
                title={isMuted ? 'موسيقى الخلفية مكتومة - اضغط للضبط' : `مستوى موسيقى الخلفية: ${Math.round(volume * 100)}%`}
                aria-label="التحكم بموسيقى الخلفية"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#ba4e45]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#d4973b]" />
                )}
                <span className="text-[11px] font-sans font-medium text-[#c7b5a1] hidden xs:inline">
                  {isMuted ? 'موسيقى مكتومة' : `موسيقى ${Math.round(volume * 100)}%`}
                </span>
              </button>

              {showVolumeSlider && (
                <div 
                  className="absolute left-0 top-full mt-2 bg-[#181310] border border-[#4a392a] rounded-lg p-3 shadow-2xl z-50 w-72 text-right animate-in fade-in"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-serif-arabic font-bold text-[#e5a744] block">
                        موسيقى التحقيق الخلفية
                      </span>
                      <span className="text-[10px] text-[#8e7c6b]">
                        (أصوات الراديو واللعبة تعمل دائماً)
                      </span>
                    </div>
                    <button
                      onClick={handleToggleMute}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                        isMuted 
                          ? 'bg-[#8b261e] border-[#a63027] text-white font-bold' 
                          : 'bg-[#221a15] border-[#382d24] text-[#c7b5a1] hover:text-white'
                      }`}
                    >
                      {isMuted ? 'تشغيل الأغنية' : 'كتم الأغنية'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-[#d4973b] cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#d4973b] w-9 text-left">
                      {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                    </span>
                  </div>

                  {/* Quick Volume Presets */}
                  <div className="flex items-center justify-between gap-1 mb-2 pt-2 border-t border-[#2e231b]">
                    <span className="text-[10px] text-[#8e7c6b]">تحديد سريع:</span>
                    <div className="flex gap-1">
                      {[0.3, 0.6, 0.85, 1.0].map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            setVolume(v);
                            soundManager.setVolume(v);
                            if (isMuted) {
                              soundManager.toggleMute();
                              setIsMuted(false);
                            }
                            soundManager.playSoundEffect('click');
                          }}
                          className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                            !isMuted && Math.abs(volume - v) < 0.05
                              ? 'bg-[#d4973b] text-black font-bold'
                              : 'bg-[#231b16] text-[#b3a18e] hover:bg-[#332820]'
                          }`}
                        >
                          {Math.round(v * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sound Test Button */}
                  <button
                    onClick={() => {
                      soundManager.playSoundEffect('clue');
                    }}
                    className="w-full mt-1 text-[11px] py-1 px-2 rounded bg-[#251d18] hover:bg-[#342821] border border-[#3e3025] text-[#e5a744] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>تجربة رنين دليل اللعبة (دائم ونقي)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reset Game Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded text-[#8a7765] hover:text-[#ba4e45] hover:bg-[#201a16] transition-colors"
              title="إعادة ضبط التحقيق من البداية"
              aria-label="إعادة ضبط التقدم"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#191512] border border-[#4a3a2d] rounded-lg max-w-md w-full p-6 text-right shadow-2xl">
            <h3 className="text-lg font-serif-arabic font-bold text-[#e5a744] mb-2">
              تأكيد إعادة ضبط التحقيق
            </h3>
            <p className="text-sm text-[#c7b5a1] leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف كل تقدمك المسجل وبدء قضية "الغرفة المقفولة" من البداية؟ لن يمكنك استرجاع الأدلة أو الملاحظات بعد ذلك.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded text-xs text-[#a89682] hover:bg-[#261f19] transition-colors"
              >
                إلغاء التراجع
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetGame();
                }}
                className="px-4 py-2 rounded text-xs font-bold bg-[#8b261e] hover:bg-[#a63027] text-white shadow-sm transition-colors"
              >
                نعم، ابدأ من جديد
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
