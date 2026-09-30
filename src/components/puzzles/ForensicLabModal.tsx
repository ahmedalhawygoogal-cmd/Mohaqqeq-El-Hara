import React, { useState, useEffect } from 'react';
import { PUZZLE_FORENSIC } from '../../data/puzzles';
import { CONTEXT_HINTS } from '../../game/hintSystem';
import { soundManager } from '../../game/soundSystem';
import { 
  X, 
  Microscope, 
  Sun, 
  Pencil, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';

interface ForensicLabModalProps {
  onClose: () => void;
  onPuzzleSolved: (evidenceId: string) => void;
  isAlreadySolved: boolean;
}

export const ForensicLabModal: React.FC<ForensicLabModalProps> = ({
  onClose,
  onPuzzleSolved,
  isAlreadySolved
}) => {
  const [angle, setAngle] = useState<number>(isAlreadySolved ? 45 : 15);
  const [pencilShade, setPencilShade] = useState<number>(isAlreadySolved ? 75 : 20);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);

  // Progressive Hint System State
  const [hintTier, setHintTier] = useState<number>(1);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [stuckSeconds, setStuckSeconds] = useState<number>(0);
  const [isStuckPromptVisible, setIsStuckPromptVisible] = useState<boolean>(false);

  const forensicHints = CONTEXT_HINTS['puzzle-forensic'].hints;

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

  // Check if angle is in tolerance (38° - 52°) and pencil shading is (65% - 85%)
  const isAngleCorrect = Math.abs(angle - PUZZLE_FORENSIC.targetAngle) <= PUZZLE_FORENSIC.angleTolerance;
  const isShadingCorrect = pencilShade >= 65 && pencilShade <= 85;
  const canReadSecret = isAngleCorrect && isShadingCorrect;

  const handleApplyVerification = () => {
    if (canReadSecret && !isSolved) {
      soundManager.playSoundEffect('success');
      setIsSolved(true);
      onPuzzleSolved(PUZZLE_FORENSIC.clueDiscoveredEvidenceId);
    } else if (!canReadSecret) {
      soundManager.playSoundEffect('stinger');
    }
  };

  const textVisibility = canReadSecret ? 1 : Math.max(0.1, (1 - Math.abs(angle - 45) / 45) * (pencilShade / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in">
      <div className="bg-[#181310] border border-[#4a392a] rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Header with Hint Button */}
        <div className="bg-[#120e0b] border-b border-[#2d2219] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playSoundEffect('click');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#221a15] hover:bg-[#30251e] text-[#a69584] hover:text-[#ebdcc6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-[#e5a744]" />
                <h3 className="font-serif-arabic font-bold text-lg text-[#e5a744]">
                  طاولة الفحص الجنائي: كشف الكتابة الغائرة
                </h3>
              </div>
              <p className="text-xs text-[#8c7866]">
                تحليل ألياف الورق بالمفكرة تحت زاوية إضاءة مائلة ومسحوق الجرافيت
              </p>
            </div>
          </div>

          {/* Hint Trigger Button */}
          <div className="flex items-center gap-2">
            {isStuckPromptVisible && !isSolved && (
              <span className="hidden sm:inline text-[11px] text-[#e5a744] bg-[#2b1f15] border border-[#6b4c2b] px-2 py-0.5 rounded animate-pulse">
                هل تحتاج تلميح؟
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

        {/* Dynamic Progressive Hint Banner Modal */}
        {showHintModal && (
          <div className="bg-[#241a12] border-b border-[#3b2b1d] p-4 text-xs text-[#d6c5b2] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#38281a] pb-2">
              <span className="font-bold text-sm text-[#e5a744] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>نظام التلميحات المتدرجة — {forensicHints[hintTier - 1]?.levelTitle}</span>
              </span>
              <button
                onClick={() => setShowHintModal(false)}
                className="text-xs text-[#9d8975] hover:text-[#ebdcc6]"
              >
                إخفاء
              </button>
            </div>

            <p className="leading-relaxed text-[#ebdcc6] bg-[#18120c] p-3 rounded border border-[#2d1f14]">
              {forensicHints[hintTier - 1]?.hintText}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8c7866]">
                تدرج التلميح يساعدك دون حرق الحل بالكامل.
              </span>
              {hintTier < 3 && (
                <button
                  onClick={() => {
                    soundManager.playSoundEffect('paper');
                    setHintTier(prev => Math.min(3, prev + 1));
                  }}
                  className="px-3 py-1 rounded bg-[#382618] hover:bg-[#4a3320] text-[#e5a744] text-[11px] font-bold border border-[#634224] transition-colors"
                >
                  كشف تلميح أكثر تحديداً (المستوى {hintTier + 1})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content & Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Interactive Document Display Board */}
          <div className="bg-[#0f0c0a] border-2 border-[#382a1d] rounded-xl p-6 sm:p-10 shadow-inner relative flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
            
            {/* Dynamic Angled Light Projection Effect */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `linear-gradient(${angle * 2}deg, rgba(229, 167, 68, ${0.1 + (angle / 90) * 0.25}) 0%, transparent 65%)`
              }}
            />

            {/* Vintage Torn Notebook Page Canvas */}
            <div 
              className="relative max-w-lg w-full bg-[#f4ecd8] text-[#1c1815] p-6 sm:p-8 rounded shadow-2xl transition-all duration-300 border-r-4 border-dashed border-[#b89f82]"
              style={{
                filter: `contrast(${100 + pencilShade * 0.5}%) brightness(${100 - pencilShade * 0.2}%)`
              }}
            >
              {/* Notebook Header Lines */}
              <div className="border-b border-[#bda68d]/60 pb-2 mb-4 flex items-center justify-between text-[11px] text-[#786551] font-mono">
                <span>مفكرة أمينة عبد الخالق — صفحة 48</span>
                <span>تاريخ: 14 أكتوبر 1994</span>
              </div>

              {/* Indented Secret Text Area */}
              <div className="min-h-[100px] flex items-center justify-center text-center p-3">
                <p 
                  className="font-serif-arabic text-base sm:text-lg font-bold leading-relaxed transition-opacity duration-300 select-none"
                  style={{
                    opacity: canReadSecret ? 1 : Math.min(0.25, textVisibility),
                    color: canReadSecret ? '#171310' : '#8c7b69',
                    textShadow: canReadSecret 
                      ? '1px 1px 2px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,255,255,0.7)' 
                      : 'none'
                  }}
                >
                  {canReadSecret 
                    ? PUZZLE_FORENSIC.secretMessage
                    : '░░░░░ انبعاجات غير مقروءة في ألياف الورق... اضبط زاوية المصباح ومسحوق التظليل ░░░░░'}
                </p>
              </div>

              {/* Carbon Powder Dust Texture */}
              <div 
                className="absolute inset-0 pointer-events-none rounded transition-opacity duration-200"
                style={{
                  backgroundColor: 'rgba(50, 45, 40, 0.65)',
                  opacity: (pencilShade / 100) * 0.4
                }}
              />
            </div>

            {/* Light Angle Visual Indicator */}
            <div className="absolute bottom-3 left-4 text-xs font-mono text-[#8a7663] bg-[#14100c]/80 px-2 py-1 rounded">
              زاوية الإشعاع: <span className="text-[#e5a744] font-bold">{angle}°</span> · التظليل: <span className="text-[#e5a744] font-bold">{pencilShade}%</span>
            </div>

          </div>

          {/* Interactive Inspection Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#14100c] p-4 rounded-lg border border-[#2b2118]">
            
            {/* Slider 1: Angled Light */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#e5a744] flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  <span>زاوية تسليط الضوء المائل (0° - 90°):</span>
                </span>
                <span className="font-mono text-xs text-[#ebdcc6]">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={angle}
                disabled={isSolved}
                onChange={(e) => {
                  soundManager.playSoundEffect('click');
                  setAngle(parseInt(e.target.value));
                }}
                className="w-full accent-[#c9832b] cursor-pointer"
              />
              <span className="text-[10px] text-[#806f5f] block">
                {isAngleCorrect ? '✓ زاوية مثالية لتوليد الظلال في شقوق الورق' : 'حرك حتى تنعكس الظلال الجانبية بحدة'}
              </span>
            </div>

            {/* Slider 2: Pencil Carbon Rubbing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#e5a744] flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5" />
                  <span>تظليل مسحوق الجرافيت والرصاص:</span>
                </span>
                <span className="font-mono text-xs text-[#ebdcc6]">{pencilShade}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pencilShade}
                disabled={isSolved}
                onChange={(e) => {
                  soundManager.playSoundEffect('click');
                  setPencilShade(parseInt(e.target.value));
                }}
                className="w-full accent-[#c9832b] cursor-pointer"
              />
              <span className="text-[10px] text-[#806f5f] block">
                {isShadingCorrect ? '✓ توازن دقيق يكشف الحروف دون تعتيم الورقة' : 'استخدم التظليل لإبراز مواضع الضغط المجهري'}
              </span>
            </div>

          </div>

          {/* Solved Status and Deduction */}
          {isSolved && (
            <div className="bg-[#18261a] border border-[#3b7849] p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-[#5cb870] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm text-[#7fd993] block">
                  اكتمل الفحص الجنائي بنجاح!
                </span>
                <p className="text-xs text-[#d6eedc] leading-relaxed">
                  تمت قراءة الرسالة وتأكيد أن سلمى كانت مع أمينة وتملك مفتاحاً، وأن حسن العقاد وجّه تهديداً مباشراً قبل الواقعة بساعات! أُضيف دليل "الكتابة الغائرة المكتشفة" رسمياً إلى ملف القضية.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="bg-[#120e0b] border-t border-[#2d2219] p-4 flex items-center justify-between">
          <div className="text-xs text-[#8c7866]">
            {canReadSecret && !isSolved && (
              <span className="text-[#e5a744] font-bold">
                النص واضح الآن! انقر لاعتماد النتيجة الجنائية.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isSolved ? (
              <button
                onClick={handleApplyVerification}
                disabled={!canReadSecret}
                className={`px-5 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                  canReadSecret
                    ? 'bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] shadow-lg shadow-[#c9832b]/20 cursor-pointer'
                    : 'bg-[#221b15] text-[#6b594b] cursor-not-allowed border border-[#30251c]'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>اعتماد وقيد الدليل في الدفتر</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded bg-[#2b211a] hover:bg-[#382b21] text-[#ebdcc6] text-xs font-bold transition-colors"
              >
                إغلاق المختبر ومواصلة التحقيق
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
