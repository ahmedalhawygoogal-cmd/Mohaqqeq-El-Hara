import React, { useState, useEffect } from 'react';
import { PUZZLE_TIMELINE, TimelineSlot, TimelineEvent, DeductionHypothesis } from '../data/puzzles';
import { EVIDENCE_ITEMS, EvidenceItem } from '../data/evidence';
import { CONTEXT_HINTS } from '../game/hintSystem';
import { GameSaveState, ScreenMode } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { 
  GitMerge, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Gavel, 
  ArrowLeft,
  Check,
  Sparkles,
  Link2,
  Lightbulb
} from 'lucide-react';

interface DeductionBoardProps {
  gameState: GameSaveState;
  onUpdateConnections: (connections: {
    culpritHypothesisId?: string;
    methodHypothesisId?: string;
    motiveHypothesisId?: string;
    deedHypothesisId?: string;
    selectedEvidenceIds: string[];
  }) => void;
  onUpdateTimeline: (assignments: Record<string, string>) => void;
  onNavigate: (screen: ScreenMode) => void;
}

export const DeductionBoard: React.FC<DeductionBoardProps> = ({
  gameState,
  onUpdateConnections,
  onUpdateTimeline,
  onNavigate
}) => {
  const [selectedCulprit, setSelectedCulprit] = useState<string | undefined>(
    gameState.deductionConnections.culpritHypothesisId
  );
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>(
    gameState.deductionConnections.methodHypothesisId
  );
  const [selectedMotive, setSelectedMotive] = useState<string | undefined>(
    gameState.deductionConnections.motiveHypothesisId
  );
  const [selectedDeed, setSelectedDeed] = useState<string | undefined>(
    gameState.deductionConnections.deedHypothesisId
  );

  const [activeTab, setActiveTab] = useState<'board' | 'timeline'>('board');
  const [timelineSlots, setTimelineSlots] = useState<Record<string, string>>(
    gameState.timelineAssignments || {}
  );

  // Progressive Hint System State
  const [hintTier, setHintTier] = useState<number>(1);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [stuckSeconds, setStuckSeconds] = useState<number>(0);
  const [isStuckPromptVisible, setIsStuckPromptVisible] = useState<boolean>(false);

  const boardHints = CONTEXT_HINTS['deduction-board'].hints;

  useEffect(() => {
    const timer = setInterval(() => {
      setStuckSeconds(prev => {
        const next = prev + 1;
        if (next >= 40 && !isStuckPromptVisible) {
          setIsStuckPromptVisible(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isStuckPromptVisible]);

  const collectedEvidence = EVIDENCE_ITEMS.filter(ev => 
    gameState.collectedEvidenceIds.includes(ev.id)
  );

  const handleSelectCulprit = (id: string) => {
    soundManager.playSoundEffect('click');
    setSelectedCulprit(id);
    onUpdateConnections({
      culpritHypothesisId: id,
      methodHypothesisId: selectedMethod,
      motiveHypothesisId: selectedMotive,
      deedHypothesisId: selectedDeed,
      selectedEvidenceIds: gameState.deductionConnections.selectedEvidenceIds
    });
  };

  const handleSelectMethod = (id: string) => {
    soundManager.playSoundEffect('click');
    setSelectedMethod(id);
    onUpdateConnections({
      culpritHypothesisId: selectedCulprit,
      methodHypothesisId: id,
      motiveHypothesisId: selectedMotive,
      deedHypothesisId: selectedDeed,
      selectedEvidenceIds: gameState.deductionConnections.selectedEvidenceIds
    });
  };

  const handleSelectMotive = (id: string) => {
    soundManager.playSoundEffect('click');
    setSelectedMotive(id);
    onUpdateConnections({
      culpritHypothesisId: selectedCulprit,
      methodHypothesisId: selectedMethod,
      motiveHypothesisId: id,
      deedHypothesisId: selectedDeed,
      selectedEvidenceIds: gameState.deductionConnections.selectedEvidenceIds
    });
  };

  const handleSelectDeed = (id: string) => {
    soundManager.playSoundEffect('click');
    setSelectedDeed(id);
    onUpdateConnections({
      culpritHypothesisId: selectedCulprit,
      methodHypothesisId: selectedMethod,
      motiveHypothesisId: selectedMotive,
      deedHypothesisId: id,
      selectedEvidenceIds: gameState.deductionConnections.selectedEvidenceIds
    });
  };

  const handleAssignTimelineSlot = (slotTime: string, eventId: string) => {
    soundManager.playSoundEffect('paper');
    const updated = { ...timelineSlots, [slotTime]: eventId };
    setTimelineSlots(updated);
    onUpdateTimeline(updated);
  };

  const getStatusBadge = (status: 'مؤكدة' | 'محتملة' | 'غير مدعومة') => {
    switch (status) {
      case 'مؤكدة':
        return 'bg-[#182619] text-[#78d68d] border-[#294d2c]';
      case 'محتملة':
        return 'bg-[#332212] text-[#fed09a] border-[#5e3e1f]';
      default:
        return 'bg-[#221b16] text-[#8c7a68] border-[#382b20]';
    }
  };

  const culpritOptions = [
    {
      id: 'hyp-culprit-aqqad',
      title: 'حسن العقاد (الوسيط العقاري)',
      desc: 'دبر الحصول على مفتاح مكرر واقتحم الشقة وسرق السند ودبلج شريط الكاسيت لتلفيق غيابه.',
      requiredIds: ['ev-duplicate-key', 'ev-cassette-timeline', 'ev-altered-document']
    },
    {
      id: 'hyp-culprit-salma',
      title: 'سلمى (الرسامة التشكيلية)',
      desc: 'كانت في موقع الجريمة وتركت قفازاً أزرق وكسرت القفل من الداخل.',
      requiredIds: ['ev-blue-glove', 'ev-broken-lock']
    },
    {
      id: 'hyp-culprit-fadi',
      title: 'فادي (خبير الأقفال)',
      desc: 'صنع المفتاح المكرر واستخدم مهارته في التسلل للشقة لسرقة الذهب.',
      requiredIds: ['ev-duplicate-key']
    }
  ];

  const methodOptions = [
    {
      id: 'hyp-method-staged-and-key',
      title: 'دخول بمفتاح مكرر بعد تمويه داخلي نسقته سلمى',
      desc: 'الباب كُسر من الداخل لتمكين أمينة من الهروب، والعقاد دخل بالمفتاح المكرر وسرق الملف.',
      requiredIds: ['ev-broken-lock', 'ev-indented-writing', 'ev-duplicate-key']
    },
    {
      id: 'hyp-method-violent-burglary',
      title: 'اقتحام خارجي عنيف بواسطة لصوص مجهولين',
      desc: 'الباب خُلع بالقوة العشوائية من الخارج وسُرقت الخزنة بالكامل.',
      requiredIds: []
    }
  ];

  const motiveOptions = [
    {
      id: 'hyp-motive-estate-deal',
      title: 'الاستيلاء على سند الوقف لهدم البيت وبناء مجمع استثماري',
      desc: 'استغلال غياب أمينة للاستيلاء على السند الأصلي وتقديم توكيل مزور.',
      requiredIds: ['ev-altered-document', 'ev-original-deed']
    },
    {
      id: 'hyp-motive-theft-money',
      title: 'سرقة مجوهرات وأموال سائلة من خزنة الحائط فقط',
      desc: 'دافع مالي بسيط يتعلق بالسرقة المباشرة للمال.',
      requiredIds: []
    }
  ];

  const deedOptions = [
    {
      id: 'hyp-deed-saved-nono',
      title: 'السند الأصلي الحقيقي محفوظ في دكان العم مع نونو',
      desc: 'أمينة تركت نسخة غير أصلية كطعم في الخزنة، وأودعت السند الحقيقي لدى نونو.',
      requiredIds: ['ev-delivery-note', 'ev-original-deed']
    },
    {
      id: 'hyp-deed-lost-with-aqqad',
      title: 'السند الأصلي ضاع تماماً في حوزة حسن العقاد',
      desc: 'الملف المسروق هو السند التاريخي الوحيد ولا توجد أمانات أخرى.',
      requiredIds: []
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right">
      
      {/* Header with Hint Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#2d2219] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-[#e5a744]" />
            <h2 className="text-2xl sm:text-3xl font-serif-arabic font-bold text-[#e5a744]">
              لوحة الاستنتاج وربط الخيوط الجنائية
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#a89682] mt-1">
            اربط الأدلة المادية وشهادات الشهود لبناء نظريتك المتماسكة قبل التوجه إلى شاشة الاتهام النهائي.
          </p>
        </div>

        {/* View Switcher & Hint Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-[#1a1512] rounded-lg border border-[#33271e]">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'board' ? 'bg-[#2e241d] text-[#e5a744]' : 'text-[#8c7a68]'
              }`}
            >
              عناصر الاتهام
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'timeline' ? 'bg-[#2e241d] text-[#e5a744]' : 'text-[#8c7a68]'
              }`}
            >
              الخط الزمني (8:00م - 11:30م)
            </button>
          </div>

          {/* Hint Trigger */}
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

      {/* Dynamic Hint Banner Modal */}
      {showHintModal && (
        <div className="bg-[#241a12] border border-[#4a3625] rounded-xl p-4 mb-6 text-xs text-[#d6c5b2] space-y-3 animate-in fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-[#38281a] pb-2">
            <span className="font-bold text-sm text-[#e5a744] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>نظام التلميحات المتدرجة — {boardHints[hintTier - 1]?.levelTitle}</span>
            </span>
            <button
              onClick={() => setShowHintModal(false)}
              className="text-xs text-[#9d8975] hover:text-[#ebdcc6]"
            >
              إخفاء
            </button>
          </div>

          <p className="leading-relaxed text-[#ebdcc6] bg-[#18120c] p-3 rounded border border-[#2d1f14]">
            {boardHints[hintTier - 1]?.hintText}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#8c7866]">
              استخدم التلميحات عند تعثر العثور على الرابط بين الأدلة والشهادات.
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

      {activeTab === 'board' ? (
        <div className="space-y-6">
          
          {/* Main 4 Pillars of Deduction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Who is the Culprit? */}
            <div className="bg-[#15110e] border border-[#33261a] rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#261d15] pb-2">
                <span className="font-serif-arabic font-bold text-base text-[#e5a744]">
                  1. من الفاعل الحقيقي؟ (المسؤول عن السرقة)
                </span>
                <span className="text-[11px] text-[#8c7866]">اختر الفاعل المدعوم بالأدلة</span>
              </div>

              <div className="space-y-2.5">
                {culpritOptions.map((opt) => {
                  const isSelected = selectedCulprit === opt.id;
                  const matchingCount = opt.requiredIds.filter(id => gameState.collectedEvidenceIds.includes(id)).length;
                  const status = opt.id === 'hyp-culprit-aqqad' && matchingCount >= 2 
                    ? 'مؤكدة' 
                    : matchingCount > 0 
                      ? 'محتملة' 
                      : 'غير مدعومة';

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectCulprit(opt.id)}
                      className={`w-full text-right p-3.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#261d15] border-[#c9832b] ring-2 ring-[#c9832b]/20'
                          : 'bg-[#120e0b] border-[#261d15] hover:border-[#3d2f22]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#ebdcc6]">{opt.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a69380] leading-relaxed mb-2">{opt.desc}</p>
                      <div className="text-[10px] text-[#7d6c5c]">
                        الأدلة الداعمة المحرزة: <strong className="text-[#e5a744]">{matchingCount}</strong> / {opt.requiredIds.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. How did it happen? */}
            <div className="bg-[#15110e] border border-[#33261a] rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#261d15] pb-2">
                <span className="font-serif-arabic font-bold text-base text-[#e5a744]">
                  2. كيف حدث الأمر؟ (طريقة التنفيذ ومسرح الباب)
                </span>
                <span className="text-[11px] text-[#8c7866]">تفسير كسر القفل والمفتاح</span>
              </div>

              <div className="space-y-2.5">
                {methodOptions.map((opt) => {
                  const isSelected = selectedMethod === opt.id;
                  const matchingCount = opt.requiredIds.filter(id => gameState.collectedEvidenceIds.includes(id)).length;
                  const status = opt.id === 'hyp-method-staged-and-key' && matchingCount >= 2 
                    ? 'مؤكدة' 
                    : matchingCount > 0 
                      ? 'محتملة' 
                      : 'غير مدعومة';

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectMethod(opt.id)}
                      className={`w-full text-right p-3.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#261d15] border-[#c9832b] ring-2 ring-[#c9832b]/20'
                          : 'bg-[#120e0b] border-[#261d15] hover:border-[#3d2f22]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#ebdcc6]">{opt.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a69380] leading-relaxed mb-2">{opt.desc}</p>
                      <div className="text-[10px] text-[#7d6c5c]">
                        الأدلة الداعمة المحرزة: <strong className="text-[#e5a744]">{matchingCount}</strong> / {opt.requiredIds.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. What is the Motive? */}
            <div className="bg-[#15110e] border border-[#33261a] rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#261d15] pb-2">
                <span className="font-serif-arabic font-bold text-base text-[#e5a744]">
                  3. ما هو الدافع الجنائي الحقيقي؟
                </span>
                <span className="text-[11px] text-[#8c7866]">السر خلف الاستهداف</span>
              </div>

              <div className="space-y-2.5">
                {motiveOptions.map((opt) => {
                  const isSelected = selectedMotive === opt.id;
                  const matchingCount = opt.requiredIds.filter(id => gameState.collectedEvidenceIds.includes(id)).length;
                  const status = opt.id === 'hyp-motive-estate-deal' && matchingCount >= 1 
                    ? 'مؤكدة' 
                    : 'غير مدعومة';

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectMotive(opt.id)}
                      className={`w-full text-right p-3.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#261d15] border-[#c9832b] ring-2 ring-[#c9832b]/20'
                          : 'bg-[#120e0b] border-[#261d15] hover:border-[#3d2f22]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#ebdcc6]">{opt.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a69380] leading-relaxed mb-2">{opt.desc}</p>
                      <div className="text-[10px] text-[#7d6c5c]">
                        الأدلة الداعمة المحرزة: <strong className="text-[#e5a744]">{matchingCount}</strong> / {opt.requiredIds.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Where is the Real Deed? */}
            <div className="bg-[#15110e] border border-[#33261a] rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#261d15] pb-2">
                <span className="font-serif-arabic font-bold text-base text-[#e5a744]">
                  4. مصير سند الملكية الأصلي (هل نجت الوثيقة؟)
                </span>
                <span className="text-[11px] text-[#8c7866]">حقيقة الملف المسروق</span>
              </div>

              <div className="space-y-2.5">
                {deedOptions.map((opt) => {
                  const isSelected = selectedDeed === opt.id;
                  const matchingCount = opt.requiredIds.filter(id => gameState.collectedEvidenceIds.includes(id)).length;
                  const status = opt.id === 'hyp-deed-saved-nono' && matchingCount >= 1 
                    ? 'مؤكدة' 
                    : 'غير مدعومة';

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectDeed(opt.id)}
                      className={`w-full text-right p-3.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#261d15] border-[#c9832b] ring-2 ring-[#c9832b]/20'
                          : 'bg-[#120e0b] border-[#261d15] hover:border-[#3d2f22]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#ebdcc6]">{opt.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-[#a69380] leading-relaxed mb-2">{opt.desc}</p>
                      <div className="text-[10px] text-[#7d6c5c]">
                        الأدلة الداعمة المحرزة: <strong className="text-[#e5a744]">{matchingCount}</strong> / {opt.requiredIds.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Accusation Transition Banner */}
          <div className="bg-[#18130f] border border-[#3d2f22] p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif-arabic font-bold text-base text-[#e5a744]">
                جاهز لتقديم الاتهام النهائي؟
              </h4>
              <p className="text-xs text-[#a69380] mt-0.5">
                إذا قمت بملء أركان النظرية واختبار الشهود، يمكنك الآن استدعاء النيابة وتوجيه الاتهام في قسم الشرطة.
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playSoundEffect('stinger');
                onNavigate('accusation');
              }}
              className="px-6 py-3 rounded bg-[#78221b] hover:bg-[#962b22] text-[#fdead8] font-bold text-sm shadow-lg border border-[#ab382d] transition-all flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>الانتقال لشاشة الاتهام النهائي</span>
            </button>
          </div>

        </div>
      ) : (
        /* TIMELINE TAB */
        <div className="space-y-6">
          <div className="bg-[#15110e] border border-[#33261a] rounded-xl p-5 space-y-4">
            <span className="text-xs text-[#a69380] block">
              قم بتعيين الحدث الحقيقي المناسب لكل توقيت زمني ليلة الخميس لفك لغز الغرفة المقفولة:
            </span>

            <div className="space-y-4">
              {PUZZLE_TIMELINE.slots.map((slot) => {
                const assignedEventId = timelineSlots[slot.time];
                const assignedEvent = PUZZLE_TIMELINE.events.find(e => e.id === assignedEventId);

                return (
                  <div key={slot.time} className="bg-[#100d0a] border border-[#261d15] rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#201811] pb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#e5a744]" />
                        <span className="font-mono font-bold text-sm text-[#e5a744]">{slot.time}</span>
                        <span className="text-xs text-[#ebdcc6]">— {slot.label}</span>
                      </div>
                      <span className="text-[10px] text-[#7d6b5a]">{slot.hint}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {PUZZLE_TIMELINE.events.map((evt) => (
                        <button
                          key={evt.id}
                          onClick={() => handleAssignTimelineSlot(slot.time, evt.id)}
                          className={`p-2.5 rounded text-right text-xs transition-all border ${
                            assignedEventId === evt.id
                              ? 'bg-[#2b2016] border-[#c9832b] text-[#ebdcc6] font-bold'
                              : 'bg-[#14100c] border-[#241a12] text-[#8c7866] hover:text-[#ebdcc6]'
                          }`}
                        >
                          <div className="font-bold">{evt.title}</div>
                          <div className="text-[10px] text-[#7d6b5a] mt-0.5">{evt.actor}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
