import React, { useState, useEffect } from 'react';
import { PUZZLE_CASSETTE, CassetteSegment } from '../../data/puzzles';
import { CONTEXT_HINTS } from '../../game/hintSystem';
import { soundManager } from '../../game/soundSystem';
import { 
  X, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Headphones,
  Sliders,
  HelpCircle,
  Lightbulb,
  Bell,
  Sparkles
} from 'lucide-react';

interface CassettePuzzleModalProps {
  onClose: () => void;
  onPuzzleSolved: (evidenceId: string) => void;
  isAlreadySolved: boolean;
}

export const CassettePuzzleModal: React.FC<CassettePuzzleModalProps> = ({
  onClose,
  onPuzzleSolved,
  isAlreadySolved
}) => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [flaggedAnomalyIds, setFlaggedAnomalyIds] = useState<string[]>(
    isAlreadySolved ? PUZZLE_CASSETTE.correctAnomalyIds : []
  );
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [audioFilterMode, setAudioFilterMode] = useState<'normal' | 'isolate' | 'enhance'>('normal');

  // Dynamic Hint System State
  const [hintTier, setHintTier] = useState<number>(1);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [stuckSeconds, setStuckSeconds] = useState<number>(0);
  const [isStuckPromptVisible, setIsStuckPromptVisible] = useState<boolean>(false);

  const cassetteHints = CONTEXT_HINTS['puzzle-cassette'].hints;
  const activeSegment: CassetteSegment = PUZZLE_CASSETTE.segments[activeSegmentIndex];

  // Stuck timer tracking
  useEffect(() => {
    if (isSolved) return;
    const timer = setInterval(() => {
      setStuckSeconds(prev => {
        const next = prev + 1;
        if (next >= 35 && !isStuckPromptVisible) {
          setIsStuckPromptVisible(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSolved, isStuckPromptVisible]);

  // Handle Audio Speech Playback for active segment
  const playSegmentAudioSpeech = (idx: number) => {
    soundManager.stopRadioSpeech();

    if (idx === 0) {
      // Segment 1: Radio host friendly opening
      soundManager.speakArabicRadio('هنا إذاعة الشرق الأوسط من القاهرة... مع أرق تحياتنا لمستمعينا الكرام في سهرة الخميس.');
    } else if (idx === 1) {
      // Segment 2: Cafe background chatter & radio commercial
      soundManager.speakArabicRadio('طلب شاي كشري في الخمسينة يا معلمة هدى... وأم كلثوم تشدو في خلفية المقهى.');
    } else if (idx === 2) {
      // Segment 3: The 10 Church Bell Chimes Anomaly!
      soundManager.playChurchBellChimes(10);
      setTimeout(() => {
        soundManager.speakArabicRadio('ناقوس كنيسة مار جرجس المجاورة يدق عشر دقات متتالية معلناً تمام الساعة العاشرة ليلاً!');
      }, 1500);
    } else if (idx === 3) {
      // Segment 4: The 10:15 PM Flood News Emergency Bulletin!
      soundManager.speakArabicRadio('هنا القاهرة... بيان عاجل من هيئة الأرصاد: سيول جارفة ومفاجئة تقطع طريق الصعيد الزراعي في تمام الساعة العاشرة وخمس عشرة دقيقة مساء اليوم!');
    }
  };

  const handlePlayPause = () => {
    soundManager.playSoundEffect('cassette_click');
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (nextState) {
      playSegmentAudioSpeech(activeSegmentIndex);
    } else {
      soundManager.stopRadioSpeech();
    }
  };

  const handleSelectSegment = (idx: number) => {
    soundManager.playSoundEffect('cassette_click');
    setActiveSegmentIndex(idx);
    setIsPlaying(true);
    playSegmentAudioSpeech(idx);
  };

  const handleToggleFlag = (segId: string) => {
    soundManager.playSoundEffect('click');
    setFlaggedAnomalyIds(prev => 
      prev.includes(segId) ? prev.filter(id => id !== segId) : [...prev, segId]
    );
  };

  const handleVerifyDeduction = () => {
    const hasAllCorrect = PUZZLE_CASSETTE.correctAnomalyIds.every(id => flaggedAnomalyIds.includes(id));
    const hasNoFalseFlags = flaggedAnomalyIds.every(id => PUZZLE_CASSETTE.correctAnomalyIds.includes(id));

    if (hasAllCorrect && hasNoFalseFlags && !isSolved) {
      soundManager.stopRadioSpeech();
      soundManager.playSoundEffect('success');
      setIsSolved(true);
      onPuzzleSolved(PUZZLE_CASSETTE.resolutionEvidenceId);
    } else {
      soundManager.playSoundEffect('stinger');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in">
      <div className="bg-[#181310] border border-[#4a392a] rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Header with Dynamic Hint Trigger */}
        <div className="bg-[#120e0b] border-b border-[#2d2219] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.stopRadioSpeech();
                soundManager.playSoundEffect('click');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#221a15] hover:bg-[#30251e] text-[#a69584] hover:text-[#ebdcc6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#e5a744]" />
                <h3 className="font-serif-arabic font-bold text-lg text-[#e5a744]">
                  وحدة التحليل الصوتي وبث الراديو التناظري
                </h3>
              </div>
              <p className="text-xs text-[#8c7866]">
                استمع إلى البث الإذاعي وساعة الكنيسة للتحقق من حجة غياب حسن العقاد
              </p>
            </div>
          </div>

          {/* Progressive Hint Button */}
          <div className="flex items-center gap-2">
            {isStuckPromptVisible && !isSolved && (
              <span className="hidden sm:inline text-[11px] text-[#e5a744] bg-[#2b1f15] border border-[#6b4c2b] px-2 py-0.5 rounded animate-pulse">
                هل تحتاج مساعدة؟
              </span>
            )}
            <button
              onClick={() => {
                soundManager.playSoundEffect('click');
                setShowHintModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2b1f14] hover:bg-[#3b2a1a] text-[#e5a744] text-xs font-bold border border-[#c9832b]/40 transition-colors shadow-sm"
            >
              <Lightbulb className="w-4 h-4 text-[#e5a744]" />
              <span>تلميح ({hintTier}/3)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progressive Hint Modal */}
        {showHintModal && (
          <div className="bg-[#241a12] border-b border-[#3b2b1d] p-4 text-xs text-[#d6c5b2] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#38281a] pb-2">
              <span className="font-bold text-sm text-[#e5a744] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>نظام التلميحات المتدرجة — {cassetteHints[hintTier - 1]?.levelTitle}</span>
              </span>
              <button
                onClick={() => setShowHintModal(false)}
                className="text-xs text-[#9d8975] hover:text-[#ebdcc6]"
              >
                إخفاء
              </button>
            </div>

            <p className="leading-relaxed text-[#ebdcc6] bg-[#18120c] p-3 rounded border border-[#2d1f14]">
              {cassetteHints[hintTier - 1]?.hintText}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8c7866]">
                تدرج التلميح يساعدك دون كشف كل شيء دفعة واحدة.
              </span>
              {hintTier < 3 && (
                <button
                  onClick={() => {
                    soundManager.playSoundEffect('paper');
                    setHintTier(prev => Math.min(3, prev + 1));
                  }}
                  className="px-3 py-1 rounded bg-[#382618] hover:bg-[#4a3320] text-[#e5a744] text-[11px] font-bold border border-[#634224] transition-colors"
                >
                  كشف تلميح أكثر دقة (المستوى {hintTier + 1})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Cassette Deck Visual Representation */}
          <div className="bg-[#100d0a] border-2 border-[#33261a] rounded-xl p-5 sm:p-6 shadow-inner relative flex flex-col justify-between">
            
            {/* Top Deck Info */}
            <div className="flex items-center justify-between border-b border-[#241a11] pb-3 mb-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#e5a744]">
                <Headphones className="w-4 h-4" />
                <span className="font-bold">كاسيت مسرح المقهى — استماع حي للبث الصوتي</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isPlaying ? 'bg-[#7a221a] text-[#ffd6d2] animate-pulse' : 'bg-[#221a14] text-[#8c7866]'
                }`}>
                  {isPlaying ? 'بث صوتي مباشر (RADIO ON)' : 'متوقف'}
                </span>
                <span className="text-[#a69380]">{activeSegment.timeRange}</span>
              </div>
            </div>

            {/* Simulated Animated Waveform Visualizer */}
            <div className="h-28 bg-[#090705] border border-[#2b1f14] rounded-lg p-3 flex items-center justify-center gap-1 sm:gap-1.5 overflow-hidden relative">
              {Array.from({ length: 36 }).map((_, i) => {
                const height = isPlaying 
                  ? Math.sin(i * 0.4 + activeSegmentIndex) * 40 + 50 
                  : 15;
                const isAnomalyWave = activeSegment.isAnomaly && i > 12 && i < 24;

                return (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isAnomalyWave
                        ? 'bg-[#d94b3d]'
                        : isPlaying
                          ? 'bg-[#c9832b]'
                          : 'bg-[#3b2d1f]'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}

              {activeSegment.isAnomaly && (
                <div className="absolute top-2 left-3 text-[10px] text-[#ff786b] font-mono bg-[#2b0e0b]/80 px-2 py-0.5 rounded border border-[#6b1e16]">
                  تحذير: رصد قطع مغناطيسي ولصق يدوي (Tape Splicing)!
                </div>
              )}
            </div>

            {/* Deck Mechanical Controls & Voice Player */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-[#241a11]">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] font-bold text-xs shadow-md transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'إيقاف الصوت' : 'تشغيل البث والكلام الصوتي'}</span>
                </button>

                <button
                  onClick={() => {
                    const prevIdx = activeSegmentIndex > 0 ? activeSegmentIndex - 1 : PUZZLE_CASSETTE.segments.length - 1;
                    handleSelectSegment(prevIdx);
                  }}
                  className="p-2 rounded bg-[#221a14] hover:bg-[#30251d] text-[#bda895] hover:text-[#ebdcc6] transition-colors"
                  title="المقطع السابق"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const nextIdx = activeSegmentIndex < PUZZLE_CASSETTE.segments.length - 1 ? activeSegmentIndex + 1 : 0;
                    handleSelectSegment(nextIdx);
                  }}
                  className="p-2 rounded bg-[#221a14] hover:bg-[#30251d] text-[#bda895] hover:text-[#ebdcc6] transition-colors"
                  title="المقطع التالي"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>

              {/* Audio Filter Switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#1a140f] rounded-lg border border-[#302419] text-xs">
                <span className="text-[10px] text-[#786756] px-1">المرشح التناظري:</span>
                <button
                  onClick={() => setAudioFilterMode('normal')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    audioFilterMode === 'normal' ? 'bg-[#2e2319] text-[#e5a744]' : 'text-[#8c7a68]'
                  }`}
                >
                  صوت الراديو
                </button>
                <button
                  onClick={() => setAudioFilterMode('isolate')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    audioFilterMode === 'isolate' ? 'bg-[#2e2319] text-[#e5a744]' : 'text-[#8c7a68]'
                  }`}
                >
                  عزل ساعة الكنيسة
                </button>
                <button
                  onClick={() => setAudioFilterMode('enhance')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    audioFilterMode === 'enhance' ? 'bg-[#2e2319] text-[#e5a744]' : 'text-[#8c7a68]'
                  }`}
                >
                  تضخيم النشرة الإذاعية
                </button>
              </div>

            </div>

          </div>

          {/* Active Segment Spoken Text & Audio Description */}
          <div className="bg-[#14100c] border border-[#2e2319] rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#241a11] pb-2">
              <span className="text-xs font-bold text-[#e5a744]">
                المقطع {activeSegmentIndex + 1}: التوقيت المزعوم للجلسة: {activeSegment.nominalTime}
              </span>
              <span className="text-xs text-[#a69380] font-mono">
                {activeSegment.timeRange}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#ebdcc6] block">
                محتوى الكلام الصوتي المذاع عبر الراديو:
              </span>
              <p className="text-xs sm:text-sm text-[#cebeac] leading-relaxed">
                {activeSegment.audioDescription}
              </p>
            </div>

            {/* Direct spoken broadcast quote */}
            <div className="bg-[#1a130e] border border-[#3b2b1d] p-3 rounded-lg text-xs font-serif-arabic text-[#e8d5bf] flex items-start gap-2">
              <Radio className="w-4 h-4 text-[#e5a744] shrink-0 mt-0.5" />
              <div>
                <strong>المنطوق الإذاعي المسجل:</strong>{' '}
                {activeSegmentIndex === 0 && '«هنا إذاعة الشرق الأوسط من القاهرة... مع أرق تحياتنا لمستمعينا الكرام في سهرة الخميس.»'}
                {activeSegmentIndex === 1 && '«حوار زبائن المقهى حول أسعار الغلال وصوت صك كاسات الشاي وأم كلثوم تشدو بالخلفية.»'}
                {activeSegmentIndex === 2 && '«صوت تشويش كهربائي ناتج عن قطع ولصق يدوي يتبعه 10 دقات متتالية لناقوس الكنيسة (الساعة العاشرة تماماً)!»'}
                {activeSegmentIndex === 3 && '«بيان عاجل من هيئة الأرصاد: سيول جارفة تقطع طريق الصعيد الزراعي في تمام الساعة العاشرة وخمس عشرة دقيقة مساء اليوم!»'}
              </div>
            </div>
          </div>

          {/* Segments Inspection List & Anomaly Toggles */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#c9832b] block">
              حدد المقاطع الصوتية التي تثبت التناقض الزمني والدبلجة لتفنيد حجة غياب العقاد:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PUZZLE_CASSETTE.segments.map((seg, idx) => {
                const isFlagged = flaggedAnomalyIds.includes(seg.id);
                const isCurrent = activeSegmentIndex === idx;

                return (
                  <div
                    key={seg.id}
                    className={`p-3.5 rounded-lg border text-right transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#201811] border-[#c9832b]'
                        : 'bg-[#14100c] border-[#2b2016]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <button
                          onClick={() => handleSelectSegment(idx)}
                          className="font-bold text-xs sm:text-sm text-[#ebdcc6] hover:text-[#e5a744] text-right"
                        >
                          مقطع {idx + 1}: {seg.nominalTime}
                        </button>
                        <span className="text-[10px] text-[#7d6b5a] font-mono">
                          {seg.timeRange}
                        </span>
                      </div>

                      <p className="text-xs text-[#9c8976] line-clamp-2 mb-3">
                        {seg.actualEvent}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#261d15]">
                      <button
                        onClick={() => handleSelectSegment(idx)}
                        className="text-[11px] text-[#c9832b] hover:underline flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>{isCurrent && isPlaying ? 'قيد الاستماع' : 'استمع للمقطع'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleFlag(seg.id)}
                        disabled={isSolved}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          isFlagged
                            ? 'bg-[#7a1f18] text-[#ffdcd9] border border-[#a12b20]'
                            : 'bg-[#1e1712] text-[#8c7866] border border-[#33261b] hover:text-[#e5a744]'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{isFlagged ? 'تم رصد تناقض' : 'تسجيل مشبوه؟'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solved Status */}
          {isSolved && (
            <div className="bg-[#18261a] border border-[#3b7849] p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-[#5cb870] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm text-[#7fd993] block">
                  تم كشف التناقض الزمني وسقوط حجة الغياب نهائياً!
                </span>
                <p className="text-xs text-[#d6eedc] leading-relaxed">
                  أثبت البث الصوتي أن ناقوس كنيسة مار جرجس دق 10 دقات كاملة في المقطع المزعوم أنه في 8:30م، ونشرة طوارئ العاشرة والربع ظهرت قبل موعدها! أُضيف دليل "التناقض الزمني في شريط الكاسيت" إلى ملف القضية كبرهان حاسم ضد حسن العقاد.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#120e0b] border-t border-[#2d2219] p-4 flex items-center justify-between">
          <div className="text-xs text-[#8c7866]">
            {flaggedAnomalyIds.length > 0 && !isSolved && (
              <span>المقاطع المشبوهة المحددة: {flaggedAnomalyIds.length} مقاطع</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isSolved ? (
              <button
                onClick={handleVerifyDeduction}
                className="px-5 py-2.5 rounded bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] text-xs font-bold shadow-md transition-colors"
              >
                تأكيد مطابقة التناقض الصوتي
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.stopRadioSpeech();
                  onClose();
                }}
                className="px-5 py-2.5 rounded bg-[#2b211a] hover:bg-[#382b21] text-[#ebdcc6] text-xs font-bold transition-colors"
              >
                إغلاق وحدة الصوت والعودة للتحقيق
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
