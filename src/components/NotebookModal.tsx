import React, { useState } from 'react';
import { CASES } from '../data/cases';
import { EVIDENCE_ITEMS, EvidenceItem } from '../data/evidence';
import { CHARACTERS, CharacterData } from '../data/characters';
import { LOCATIONS, LocationData } from '../data/locations';
import { GameSaveState } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { 
  X, 
  BookOpen, 
  FileText, 
  Users, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  FolderLock,
  Search,
  Sparkles
} from 'lucide-react';

interface NotebookModalProps {
  gameState: GameSaveState;
  onClose: () => void;
  onSelectEvidence?: (evidenceId: string) => void;
  onSelectCharacter?: (charId: string) => void;
}

type TabType = 'summary' | 'evidence' | 'characters' | 'locations' | 'timeline' | 'questions' | 'theories';

export const NotebookModal: React.FC<NotebookModalProps> = ({
  gameState,
  onClose,
  onSelectEvidence,
  onSelectCharacter
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'confirmed' | 'suspicious'>('all');
  const activeCase = CASES[0];

  const handleTabChange = (tab: TabType) => {
    soundManager.playSoundEffect('paper');
    setActiveTab(tab);
  };

  const collectedEvidence = EVIDENCE_ITEMS.filter(ev => 
    gameState.collectedEvidenceIds.includes(ev.id)
  );

  const displayedEvidence = collectedEvidence.filter(ev => {
    if (evidenceFilter === 'confirmed') return ev.status === 'مؤكد';
    if (evidenceFilter === 'suspicious') return ev.status === 'مشبوه' || ev.status === 'غير مكتمل';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#181310] border border-[#4a392a] rounded-xl max-w-5xl w-full h-[90vh] max-h-[800px] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Notebook Top Title Bar */}
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
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#e5a744]" />
              <div>
                <h3 className="font-serif-arabic font-bold text-lg text-[#e5a744]">
                  دفتر تحريات المحقق يونس
                </h3>
                <p className="text-[11px] text-[#8c7866]">
                  قيد الملاحظات، استجوابات الشهود، وسجل الأدلة الجنائية
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#a69380] font-mono">
            الأدلة المحرزة: <strong className="text-[#e5a744]">{collectedEvidence.length}</strong> / {EVIDENCE_ITEMS.length}
          </div>
        </div>

        {/* Notebook Tabs Bar */}
        <div className="bg-[#14100c] border-b border-[#2b2017] px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleTabChange('summary')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            ملخص القضية
          </button>

          <button
            onClick={() => handleTabChange('evidence')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            <span>الأدلة الجنائية</span>
            <span className="bg-[#8b261e] text-[#fbf1e8] text-[10px] px-1.5 py-0.2 rounded-full">
              {collectedEvidence.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('characters')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'characters'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            الشخصيات والشهود
          </button>

          <button
            onClick={() => handleTabChange('locations')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'locations'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            الأماكن والمعاينات
          </button>

          <button
            onClick={() => handleTabChange('timeline')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            الخط الزمني
          </button>

          <button
            onClick={() => handleTabChange('questions')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            الأسئلة المفتوحة
          </button>

          <button
            onClick={() => handleTabChange('theories')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'theories'
                ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                : 'text-[#9c8976] hover:text-[#ebdcc6]'
            }`}
          >
            النظريات والاستنتاجات
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-parchment">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-[#120e0b] border border-[#2b2119] p-5 rounded-xl">
                <span className="text-xs text-[#a62b21] font-bold border border-[#a62b21]/40 px-2 py-0.5 rounded inline-block mb-2">
                  {activeCase.code}
                </span>
                <h4 className="text-2xl font-serif-arabic font-bold text-[#e5a744] mb-1">
                  {activeCase.title} — {activeCase.subtitle}
                </h4>
                <p className="text-xs text-[#8c7866] mb-4">
                  تاريخ الواقعة: {activeCase.dateStr} · الموقع: {activeCase.primaryLocation}
                </p>

                <p className="text-sm text-[#cebeac] leading-relaxed mb-4">
                  {activeCase.synopsis}
                </p>

                <div className="bg-[#18130f] p-4 rounded-lg border border-[#33261a] text-xs text-[#bda995] space-y-2">
                  <strong className="text-[#e5a744] block">بيانات المجني عليه / المحور:</strong>
                  <p>{activeCase.victimOrSubject}</p>
                </div>
              </div>

              {/* Investigation Progress Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#120e0b] p-3 rounded-lg border border-[#2b2119] text-center">
                  <span className="text-[11px] text-[#8c7866] block">الأدلة المجمعة</span>
                  <span className="text-xl font-bold font-mono text-[#e5a744]">
                    {collectedEvidence.length} / {EVIDENCE_ITEMS.length}
                  </span>
                </div>
                <div className="bg-[#120e0b] p-3 rounded-lg border border-[#2b2119] text-center">
                  <span className="text-[11px] text-[#8c7866] block">المواقع التي زرتها</span>
                  <span className="text-xl font-bold font-mono text-[#e5a744]">
                    {gameState.visitedLocationIds.length} / 6
                  </span>
                </div>
                <div className="bg-[#120e0b] p-3 rounded-lg border border-[#2b2119] text-center">
                  <span className="text-[11px] text-[#8c7866] block">البؤر المفحوصة</span>
                  <span className="text-xl font-bold font-mono text-[#e5a744]">
                    {gameState.inspectedHotspotIds.length}
                  </span>
                </div>
                <div className="bg-[#120e0b] p-3 rounded-lg border border-[#2b2119] text-center">
                  <span className="text-[11px] text-[#8c7866] block">الألغاز المحلولة</span>
                  <span className="text-xl font-bold font-mono text-[#e5a744]">
                    {gameState.completedPuzzleIds.length} / 3
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              
              {/* Evidence Filter */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#2b2016] pb-3">
                <span className="text-xs text-[#a69380]">
                  عرض الأدلة المحرزة وتفاصيل فحصها المخبري:
                </span>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setEvidenceFilter('all')}
                    className={`px-2.5 py-1 rounded ${
                      evidenceFilter === 'all' ? 'bg-[#2b2118] text-[#e5a744]' : 'text-[#8c7866]'
                    }`}
                  >
                    الكل ({collectedEvidence.length})
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('confirmed')}
                    className={`px-2.5 py-1 rounded ${
                      evidenceFilter === 'confirmed' ? 'bg-[#2b2118] text-[#e5a744]' : 'text-[#8c7866]'
                    }`}
                  >
                    أدلة مؤكدة
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('suspicious')}
                    className={`px-2.5 py-1 rounded ${
                      evidenceFilter === 'suspicious' ? 'bg-[#2b2118] text-[#e5a744]' : 'text-[#8c7866]'
                    }`}
                  >
                    أدلة قيد الفحص
                  </button>
                </div>
              </div>

              {displayedEvidence.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-[#120e0b] border border-[#2e2319] hover:border-[#c9832b]/60 rounded-xl p-4 transition-all shadow-md text-right space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-1 ${
                            ev.status === 'مؤكد'
                              ? 'bg-[#182619] text-[#78d68d] border-[#294d2c]'
                              : 'bg-[#332212] text-[#fed09a] border-[#5e3e1f]'
                          }`}>
                            {ev.status} · {ev.category}
                          </span>
                          <h5 className="font-bold text-base text-[#ebdcc6]">
                            {ev.name}
                          </h5>
                          <span className="text-[11px] text-[#8c7866] block">
                            موقع التحريز: {ev.locationFound}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#cebeac] leading-relaxed">
                        {ev.fullDescription}
                      </p>

                      <div className="bg-[#18130f] p-2.5 rounded border border-[#281e15] text-[11px] text-[#bda894]">
                        <strong className="text-[#e5a744] block mb-0.5">التحليل الجنائي:</strong>
                        <p>{ev.forensicAnalysis}</p>
                      </div>

                      <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                        {ev.deductionKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#1c1611] text-[#9c8976]">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-[#7d6b5a] text-sm">
                  لم يتم تحريز أدلة تطابق هذا التصنيف بعد. تفقّد مسرح الواقعة وبؤر التفتيش في الحارة.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHARACTERS */}
          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHARACTERS.map((char) => {
                const trust = gameState.characterTrust[char.id] ?? char.initialTrust;
                const suspicion = gameState.characterSuspicion[char.id] ?? 30;

                return (
                  <div
                    key={char.id}
                    className="bg-[#120e0b] border border-[#2e2319] rounded-xl p-4 text-right space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {char.portraitUrl && (
                          <img
                            src={char.portraitUrl}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#d4973b]/60 shadow shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] text-[#9c8976] border border-[#30251c] px-1.5 py-0.2 rounded bg-[#16120e] font-mono">
                              {char.dossierCode}
                            </span>
                            <h5 className="font-serif-arabic font-extrabold text-base text-[#ebdcc6]">
                              {char.name}
                            </h5>
                          </div>
                          <span className="text-xs text-[#9d8975] block">
                            {char.role}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                        char.status === 'active' 
                          ? 'bg-[#2b2118] text-[#e5a744]' 
                          : 'bg-[#1b1713] text-[#6b5b4e]'
                      }`}>
                        {char.status === 'active' ? 'نشط في القضية' : 'قريبًا'}
                      </span>
                    </div>

                    <p className="text-xs text-[#cebeac] italic">
                      {char.tagline}
                    </p>

                    <div className="bg-[#18130f] p-2.5 rounded border border-[#261d15] text-xs text-[#bda894] space-y-1">
                      <div><strong>حجة الغياب:</strong> {char.alibi}</div>
                      <div><strong>السمات:</strong> {char.personality}</div>
                    </div>

                    {char.status === 'active' && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#241a12]">
                        <span className="text-[#a69380]">الثقة: <strong className="text-[#e5a744]">{trust}%</strong></span>
                        <span className="text-[#a69380]">مستوى الشبهة: <strong className="text-[#c75549]">{suspicion}%</strong></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LOCATIONS.map((loc) => {
                const isVisited = gameState.visitedLocationIds.includes(loc.id);

                return (
                  <div
                    key={loc.id}
                    className="bg-[#120e0b] border border-[#2e2319] rounded-xl p-4 text-right space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-base text-[#ebdcc6]">
                        {loc.title}
                      </h5>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        isVisited ? 'bg-[#182619] text-[#78d68d]' : 'bg-[#201a14] text-[#8c7866]'
                      }`}>
                        {isVisited ? 'تمت المعاينة' : loc.type === 'active' ? 'غير مزور بعد' : 'قريبًا'}
                      </span>
                    </div>
                    <p className="text-xs text-[#9d8975]">{loc.subtitle}</p>
                    <p className="text-xs text-[#cebeac] leading-relaxed">{loc.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="max-w-2xl space-y-4">
              <span className="text-xs text-[#a69380] block">
                التسلسل التقديري لأحداث ليلة الخميس المشؤومة:
              </span>

              <div className="relative border-r-2 border-[#382b1f] pr-6 space-y-6 mr-2">
                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-[#c9832b]" />
                  <span className="text-xs font-mono font-bold text-[#e5a744]">08:20 مساءً</span>
                  <h6 className="font-bold text-sm text-[#ebdcc6] mt-0.5">دخول حسن العقاد مقهى السرايا</h6>
                  <p className="text-xs text-[#cebeac] mt-1">
                    طلب شاي خفيف ووضع مسجل الكاسيت الصغير على الطاولة أمام الزبائن لتسجيل جلسة المقهى.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-[#c9832b]" />
                  <span className="text-xs font-mono font-bold text-[#e5a744]">08:45 مساءً</span>
                  <h6 className="font-bold text-sm text-[#ebdcc6] mt-0.5">تأمين السند الأصلي لدى نونو</h6>
                  <p className="text-xs text-[#cebeac] mt-1">
                    أمينة ترسل صندوق الأمانات الشمعي المحتوي على السند الشرعي لنونو لحفظه بالدكان.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-[#c9832b]" />
                  <span className="text-xs font-mono font-bold text-[#e5a744]">09:15 - 09:30 مساءً</span>
                  <h6 className="font-bold text-sm text-[#ebdcc6] mt-0.5">خطة الهروب والتمويه الداخلي للباب</h6>
                  <p className="text-xs text-[#cebeac] mt-1">
                    سلمى تساعد أمينة على التسلل عبر السطح، وتكسر القفل من الداخل لخلق مشهد اقتحام وهمي.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-[#c9832b]" />
                  <span className="text-xs font-mono font-bold text-[#e5a744]">09:40 مساءً</span>
                  <h6 className="font-bold text-sm text-[#ebdcc6] mt-0.5">اقتحام العقاد وسرقة الملف البديل</h6>
                  <p className="text-xs text-[#cebeac] mt-1">
                    العقاد يدخل شقة أمينة بالمفتاح المنسوخ من فادي، ويستولي على الملف الموجود بالخزنة المفتوحة.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-[#c9832b]" />
                  <span className="text-xs font-mono font-bold text-[#e5a744]">10:15 مساءً</span>
                  <h6 className="font-bold text-sm text-[#ebdcc6] mt-0.5">عودة العقاد ونشرة الطوارئ</h6>
                  <p className="text-xs text-[#cebeac] mt-1">
                    العقاد يعود للمقهى بحذاء ملوث بالطين، ونشرة طوارئ السيول تذاع على راديو المقهى.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="max-w-2xl space-y-3">
              <span className="text-xs text-[#a69380] block mb-2">
                الأسئلة الحيوية التي تحسم مجرى التحقيق الجنائي:
              </span>

              {activeCase.briefing.keyQuestions.map((q, idx) => {
                const isAnswered = (idx === 0 && gameState.collectedEvidenceIds.includes('ev-broken-lock')) ||
                  (idx === 1 && gameState.collectedEvidenceIds.includes('ev-indented-writing')) ||
                  (idx === 2 && gameState.collectedEvidenceIds.includes('ev-cassette-timeline')) ||
                  (idx === 3 && gameState.collectedEvidenceIds.includes('ev-original-deed'));

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                      isAnswered
                        ? 'bg-[#182619] border-[#294d2c]'
                        : 'bg-[#14100c] border-[#2b2016]'
                    }`}
                  >
                    {isAnswered ? (
                      <CheckCircle2 className="w-5 h-5 text-[#5cb870] shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-[#c9832b] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs sm:text-sm font-medium ${isAnswered ? 'text-[#d6eedc]' : 'text-[#ebdcc6]'}`}>
                        {q}
                      </p>
                      <span className="text-[10px] text-[#8c7866] mt-1 block">
                        {isAnswered ? '✓ تم التوصل إلى حل هذا التساؤل الجنائي' : 'قيد التحري والبحث الميداني'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 7: THEORIES */}
          {activeTab === 'theories' && (
            <div className="max-w-2xl space-y-4">
              <span className="text-xs text-[#a69380] block">
                النظريات الاستدلالية المطروحة في مسار التحقيق:
              </span>

              <div className="bg-[#120e0b] border border-[#2e2319] p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#e5a744] font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>النظرية 1: الاقتحام الداخلي المصطنع لحماية أمينة</span>
                </div>
                <p className="text-xs text-[#cebeac] leading-relaxed">
                  كسر الباب من الداخل والقفاز الأزرق يشيران إلى أن سلمى وأمينة افتعلتا الاقتحام لمنح أمينة وقتاً كافياً للهروب خارج الحي، بينما استغل العقاد الفرصة لاحقاً وسرق ما كان يظنه السند الأصلي.
                </p>
              </div>

              <div className="bg-[#120e0b] border border-[#2e2319] p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#e5a744] font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>النظرية 2: مؤامرة التوكيل العقاري وشراء الذمم</span>
                </div>
                <p className="text-xs text-[#cebeac] leading-relaxed">
                  حسن العقاد دفع أموالاً لفادي لصناعة مفتاح مكرر ودبلجة شريط الكاسيت، ومسودة العقد المعدل تثبت رغبته في الاستيلاء على أرض الوقف مهما كلف الأمر.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Notebook Bottom Footer */}
        <div className="bg-[#120e0b] border-t border-[#2d2219] p-3 text-xs text-[#8c7866] flex items-center justify-between">
          <span>يتم تحديث الدفتر تلقائياً عند فحص أي أثر أو استجواب شاهد</span>
          <span className="font-serif-arabic text-[#e5a744]">محقق الحارة — 1994</span>
        </div>

      </div>
    </div>
  );
};
