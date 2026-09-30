import React from 'react';
import { CASES } from '../data/cases';
import { soundManager } from '../game/soundSystem';
import { 
  FolderLock, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ArrowLeft, 
  Play, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface IntroScreenProps {
  hasExistingSave: boolean;
  onStartNew: () => void;
  onContinue: () => void;
  onReset: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  hasExistingSave,
  onStartNew,
  onContinue,
  onReset
}) => {
  const activeCase = CASES[0]; // Case 01: الغرفة المقفولة

  const handleStart = () => {
    soundManager.notifyUserInteraction();
    soundManager.playSoundEffect('paper');
    soundManager.startBackgroundAudio();
    onStartNew();
  };

  const handleContinue = () => {
    soundManager.notifyUserInteraction();
    soundManager.playSoundEffect('paper');
    soundManager.startBackgroundAudio();
    onContinue();
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center p-4 sm:p-8 bg-[#0c0a09] overflow-hidden">
      {/* Background Noir Lighting Gradient & Vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_30%,#3d2817_0%,transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,5,4,0.9)_100%)]" />

      {/* Main Case Envelope / Dossier */}
      <div className="relative max-w-4xl w-full bg-[#181310] border border-[#3d2f23] rounded-lg shadow-2xl p-6 sm:p-10 z-10 text-right overflow-hidden">
        
        {/* Top Confidential Stamp and Watermark */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30241b] pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#a62b21] border border-[#a62b21]/60 px-2 py-0.5 text-xs font-bold tracking-wider rounded rotate-[-2deg] inline-block">
                ملف جنائي رقم 01 / 1994
              </span>
              <span className="text-xs text-[#8c7a68]">
                مكتب تحريات حارة السرايا
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-arabic font-extrabold text-[#e5a744] tracking-tight">
              محقق الحارة
            </h1>
            <p className="text-sm sm:text-base text-[#a3907e] font-serif-arabic italic mt-1">
              «كل دليل له حكاية... والأزقة لا تنسى من عبرها.»
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-r border-[#30241b] pt-3 sm:pt-0 sm:pr-6 text-xs text-[#8c7a68] space-y-1">
            <div className="flex items-center gap-1.5 text-[#d4973b]">
              <FolderLock className="w-4 h-4" />
              <span className="font-bold text-sm">القضية: {activeCase.title}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeCase.dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>الزمن المقدر: {activeCase.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Narrative Briefing */}
        <div className="space-y-4 mb-8 text-[#d6c5b2] text-sm sm:text-base leading-relaxed bg-[#110e0c] p-5 sm:p-6 rounded border border-[#2b211a]">
          <div className="flex items-center gap-2 text-[#e5a744] font-bold text-sm border-b border-[#2b211a] pb-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#d4973b]" />
            <span>{activeCase.briefing.title}</span>
          </div>
          <p>
            {activeCase.briefing.paragraph1}
          </p>
          <p>
            {activeCase.briefing.paragraph2}
          </p>

          <div className="mt-4 pt-4 border-t border-[#261d17]">
            <span className="text-xs font-bold text-[#c9832b] block mb-2">
              الأسئلة الجنائية المفتوحة أمامك:
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#b8a692]">
              {activeCase.briefing.keyQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#d4973b] font-bold font-serif-arabic">0{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions / CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2d221a]">
          
          <div className="text-xs text-[#827160]">
            <span>التخزين التلقائي نشط في المتصفح</span>
            <span className="mx-1.5">·</span>
            <span>نظام الفحص الجنائي والمختبر الصوتي جاهزان</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {hasExistingSave && (
              <button
                onClick={handleContinue}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] font-bold text-sm shadow-lg shadow-[#c9832b]/15 transition-all focus:ring-2 focus:ring-[#e5a744]"
              >
                <Play className="w-4 h-4" />
                <span>متابعة التحقيق الجاري</span>
              </button>
            )}

            <button
              onClick={handleStart}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-bold transition-all ${
                hasExistingSave 
                  ? 'bg-[#261e18] hover:bg-[#332820] text-[#ebdcc6] border border-[#423326]' 
                  : 'bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] shadow-lg shadow-[#c9832b]/15 focus:ring-2 focus:ring-[#e5a744]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{hasExistingSave ? 'بدء تحقيق جديد كلياً' : 'ابدأ التحقيق في الغرفة المقفولة'}</span>
            </button>

            {hasExistingSave && (
              <button
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  onReset();
                }}
                className="px-3 py-3 rounded bg-transparent hover:bg-[#201915] text-[#857362] hover:text-[#b84e44] text-xs transition-colors"
                title="مسح السجل المخزن"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
