import React, { useState, useEffect } from 'react';
import { LocationData, Hotspot } from '../data/locations';
import { CHARACTERS, CharacterData } from '../data/characters';
import { EVIDENCE_ITEMS, EvidenceItem } from '../data/evidence';
import { CONTEXT_HINTS } from '../game/hintSystem';
import { GameSaveState, ScreenMode } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  Lock, 
  Radio, 
  Microscope,
  BookOpen,
  MapPin,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface LocationSceneProps {
  location: LocationData;
  gameState: GameSaveState;
  onBackToMap: () => void;
  onInspectHotspot: (hotspot: Hotspot) => void;
  onTalkToCharacter: (charId: string) => void;
  onNavigate: (screen: ScreenMode) => void;
}

export const LocationScene: React.FC<LocationSceneProps> = ({
  location,
  gameState,
  onBackToMap,
  onInspectHotspot,
  onTalkToCharacter,
  onNavigate
}) => {
  const [activeModalHotspot, setActiveModalHotspot] = useState<Hotspot | null>(null);
  const [discoveredEvidence, setDiscoveredEvidence] = useState<EvidenceItem | null>(null);

  // Dynamic Hint State
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [hintTier, setHintTier] = useState<number>(1);
  const [stuckSeconds, setStuckSeconds] = useState<number>(0);
  const [isStuckPromptVisible, setIsStuckPromptVisible] = useState<boolean>(false);

  const sceneHints = CONTEXT_HINTS['general-investigation'].hints;

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

  const charactersPresent = CHARACTERS.filter(c => location.characterIds.includes(c.id));

  const handleHotspotClick = (hs: Hotspot) => {
    soundManager.playSoundEffect('click');
    onInspectHotspot(hs);
    setActiveModalHotspot(hs);

    if (hs.revealsEvidenceId && !gameState.collectedEvidenceIds.includes(hs.revealsEvidenceId)) {
      const ev = EVIDENCE_ITEMS.find(e => e.id === hs.revealsEvidenceId);
      if (ev) {
        soundManager.playSoundEffect('clue');
        setDiscoveredEvidence(ev);
      }
    } else {
      soundManager.playSoundEffect('paper');
    }
  };

  const getSceneBackgroundTheme = () => {
    switch (location.id) {
      case 'loc-amina-house':
        return 'from-[#141822] via-[#0d1017] to-[#08090d] border-[#29364a]/50';
      case 'loc-cafe':
        return 'from-[#22180e] via-[#161009] to-[#0c0906] border-[#4a341e]/50';
      case 'loc-workshop':
        return 'from-[#191d1b] via-[#111413] to-[#090b0a] border-[#313b37]/50';
      case 'loc-store':
        return 'from-[#211a12] via-[#17110c] to-[#0d0906] border-[#483726]/50';
      case 'loc-alley':
        return 'from-[#15171c] via-[#0f1115] to-[#07080a] border-[#292e38]/50';
      default: // office
        return 'from-[#201811] via-[#140f0b] to-[#0a0705] border-[#423122]/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right">
      
      {/* Top Location Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-[#2d241c] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playSoundEffect('click');
              onBackToMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1f1914] hover:bg-[#2b221a] text-[#c9b8a3] hover:text-[#e5a744] text-xs font-bold transition-all border border-[#382b20]"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للخريطة</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif-arabic font-bold text-[#e5a744]">
                {location.title}
              </h2>
              <span className="text-xs text-[#8c7967] font-mono">
                {location.visualTheme.lighting}
              </span>
            </div>
            <p className="text-xs text-[#a6937e]">
              {location.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Tools & Hint Access */}
        <div className="flex items-center gap-2 flex-wrap">
          {gameState.collectedEvidenceIds.includes('ev-torn-notebook') && (
            <button
              onClick={() => onNavigate('puzzle-forensic')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2b2016] hover:bg-[#3d2d1f] text-[#e5a744] text-xs border border-[#c9832b]/40 shadow-sm transition-colors"
              title="فحص الكتابة الغائرة تحت الضوء المائل"
            >
              <Microscope className="w-3.5 h-3.5 text-[#e5a744]" />
              <span className="font-bold">فحص الورقة بالمختبر</span>
            </button>
          )}

          {gameState.collectedEvidenceIds.includes('ev-cassette-recorder') && (
            <button
              onClick={() => onNavigate('puzzle-cassette')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2b2016] hover:bg-[#3d2d1f] text-[#e5a744] text-xs border border-[#c9832b]/40 shadow-sm transition-colors"
              title="فحص شريط الكاسيت التناظري"
            >
              <Radio className="w-3.5 h-3.5 text-[#e5a744]" />
              <span className="font-bold">فحص الكاسيت الصوتي</span>
            </button>
          )}

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

      {/* Dynamic Hint Modal */}
      {showHintModal && (
        <div className="bg-[#241a12] border border-[#4a3625] rounded-xl p-4 mb-4 text-xs text-[#d6c5b2] space-y-3 animate-in fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-[#38281a] pb-2">
            <span className="font-bold text-sm text-[#e5a744] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>نظام التلميحات المتدرجة — {sceneHints[hintTier - 1]?.levelTitle}</span>
            </span>
            <button
              onClick={() => setShowHintModal(false)}
              className="text-xs text-[#9d8975] hover:text-[#ebdcc6]"
            >
              إخفاء
            </button>
          </div>

          <p className="leading-relaxed text-[#ebdcc6] bg-[#18120c] p-3 rounded border border-[#2d1f14]">
            {sceneHints[hintTier - 1]?.hintText}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#8c7866]">
              تلميحات تساعدك على متابعة التحقيق دون تعطل.
            </span>
            {hintTier < 3 && (
              <button
                onClick={() => {
                  soundManager.playSoundEffect('paper');
                  setHintTier(prev => Math.min(3, prev + 1));
                }}
                className="px-3 py-1 rounded bg-[#382618] hover:bg-[#4a3320] text-[#e5a744] text-[11px] font-bold border border-[#634224] transition-colors"
              >
                كشف تلميح تالي (المستوى {hintTier + 1})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Investigation Scene Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Scene Canvas */}
        <div className={`lg:col-span-8 bg-gradient-to-b ${getSceneBackgroundTheme()} border rounded-xl p-6 sm:p-8 shadow-2xl relative min-h-[460px] sm:min-h-[520px] overflow-hidden flex flex-col justify-between`}>
          
          {/* Ambient Scene Lighting & Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_50%_40%,rgba(229,167,68,0.25)_0%,transparent_70%)]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,4,3,0.85)_100%)]" />

          {/* Scene Environment Text Header */}
          <div className="relative z-10 bg-[#0e0c0a]/80 backdrop-blur-sm border border-[#2b211a] rounded p-3 text-xs text-[#cebeac] max-w-xl">
            <span className="font-bold text-[#e5a744] block mb-0.5">وصف البيئة والأجواء:</span>
            <p className="leading-relaxed">{location.atmosphere}</p>
          </div>

          {/* Hotspot Markers Spread Across The Scene */}
          <div className="relative w-full h-[280px] sm:h-[340px] my-auto">
            {location.hotspots.map((hs) => {
              const isInspected = gameState.inspectedHotspotIds.includes(hs.id);

              return (
                <div
                  key={hs.id}
                  style={{
                    position: 'absolute',
                    top: `${hs.coords.y}%`,
                    right: `${hs.coords.x}%`,
                    transform: 'translate(50%, -50%)'
                  }}
                  className="z-20"
                >
                  <button
                    onClick={() => handleHotspotClick(hs)}
                    className="group relative flex items-center justify-center focus:outline-none"
                    aria-label={hs.name}
                  >
                    {!isInspected && (
                      <span className="absolute w-8 h-8 rounded-full bg-[#e5a744]/30 animate-ping pointer-events-none" />
                    )}

                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-xl ${
                        isInspected
                          ? 'bg-[#1a1511]/90 text-[#7d6e5f] border-[#382b20] hover:border-[#c9832b]'
                          : 'bg-[#c9832b] text-[#120f0d] border-[#fed999] hover:scale-110 ring-4 ring-[#c9832b]/25'
                      }`}
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="absolute -bottom-8 whitespace-nowrap bg-[#120f0d] border border-[#3d2f23] text-xs px-2 py-0.5 rounded shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className={isInspected ? 'text-[#a89785]' : 'text-[#f5e3ce] font-bold'}>
                        {hs.name}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Scene Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#8c7866] pt-3 border-t border-[#2d221a]">
            <span>انقر فوق بؤر التفتيش المضيئة لمعاينة الأدلة المادية في المكان</span>
            <span className="font-mono text-[#e5a744]">
              {location.hotspots.filter(h => gameState.inspectedHotspotIds.includes(h.id)).length} / {location.hotspots.length} بؤرة مفحوصة
            </span>
          </div>

        </div>

        {/* Sidebar: Present Characters - Pure Typographic Dossiers (NO CARTOON) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-[#171310] border border-[#3b2d21] rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2d2219] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#e5a744]" />
                <h3 className="font-serif-arabic font-bold text-base text-[#e5a744]">
                  الشخصيات الحاضرة بالمشهد
                </h3>
              </div>
              <span className="text-xs text-[#8c7866]">
                {charactersPresent.length} شخصيات
              </span>
            </div>

            {charactersPresent.length > 0 ? (
              <div className="space-y-3">
                {charactersPresent.map((char) => {
                  const trust = gameState.characterTrust[char.id] ?? char.initialTrust;
                  const suspicion = gameState.characterSuspicion[char.id] ?? 30;

                  return (
                    <div 
                      key={char.id}
                      className="bg-[#110e0c] border border-[#2b211a] rounded-lg p-3.5 transition-all hover:border-[#c9832b]/50"
                    >
                      {/* Dignified Header with Portrait */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          {char.portraitUrl && (
                            <img
                              src={char.portraitUrl}
                              alt={char.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-full object-cover border border-[#d4973b]/60 shadow shrink-0"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9px] text-[#9c8976] border border-[#30251c] px-1.5 py-0.2 rounded bg-[#16120e] font-mono">
                                {char.dossierCode}
                              </span>
                              <h4 className="font-serif-arabic font-extrabold text-base text-[#ebdcc6]">
                                {char.name}
                              </h4>
                            </div>
                            <span className="text-[11px] text-[#9d8975] block">
                              {char.role}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                          char.suspicionLevel === 'رئيسي' 
                            ? 'bg-[#7a1f18] text-[#f7d6d3]' 
                            : char.suspicionLevel === 'مرتفع' 
                              ? 'bg-[#633b14] text-[#fed09a]'
                              : 'bg-[#221b16] text-[#b39f8d]'
                        }`}>
                          شبهة {char.suspicionLevel}
                        </span>
                      </div>

                      <p className="text-xs text-[#bfad99] italic line-clamp-2 mb-3 font-serif-arabic">
                        {char.tagline}
                      </p>

                      <div className="flex items-center justify-between gap-3 text-[11px] text-[#8c7a68] mb-3 font-mono">
                        <span>الثقة: <strong className="text-[#e5a744]">{trust}%</strong></span>
                        <span>الريبة: <strong className="text-[#c75549]">{suspicion}%</strong></span>
                      </div>

                      <button
                        onClick={() => {
                          soundManager.playSoundEffect('paper');
                          onTalkToCharacter(char.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#2b211a] hover:bg-[#c9832b] text-[#ebdcc6] hover:text-[#120f0d] text-xs font-bold transition-all border border-[#423225] hover:border-[#c9832b]"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>بدء استجواب الشاهد (موجه أو حر بالـ AI)</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-[#110e0c] rounded text-center text-xs text-[#8c7866]">
                لا يتواجد شهود في هذا المكان حالياً. ركّز على تفتيش الآثار المادية في مسرح الواقعة.
              </div>
            )}
          </div>

          {/* Location Investigative Notes */}
          <div className="bg-[#171310] border border-[#3b2d21] rounded-xl p-5 shadow-xl">
            <h3 className="font-serif-arabic font-bold text-sm text-[#e5a744] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4973b]" />
              <span>ملاحظات التحريات عن الموقع</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#bdae9c] leading-relaxed">
              {location.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#c9832b] font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Hotspot Inspection Modal */}
      {activeModalHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#191512] border border-[#4a392b] rounded-xl max-w-lg w-full p-6 text-right shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-[#2e231a] pb-3 mb-4">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#332519] text-[#e5a744] border border-[#5c4028]">
                فحص جنائي: {activeModalHotspot.category}
              </span>
              <h3 className="text-lg font-serif-arabic font-bold text-[#e5a744]">
                {activeModalHotspot.name}
              </h3>
            </div>

            <p className="text-xs text-[#a3907e] mb-3 leading-relaxed">
              {activeModalHotspot.description}
            </p>

            <div className="bg-[#110e0c] p-4 rounded-lg border border-[#2b211a] text-sm text-[#ded0be] leading-relaxed mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4973b] mb-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>نتيجة المعاينة الميدانية الدقيقة:</span>
              </div>
              <p>{activeModalHotspot.investigationText}</p>
            </div>

            {discoveredEvidence && (
              <div className="bg-[#241c14] border border-[#d4973b]/60 p-3.5 rounded-lg mb-6 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#e5a744] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#e5a744] block">
                    تم تحريز دليل جنائي جديد ومضاف للدفتر!
                  </span>
                  <p className="text-xs text-[#e0cfbe] font-bold mt-0.5">
                    {discoveredEvidence.name}
                  </p>
                  <p className="text-[11px] text-[#a89582] mt-0.5">
                    {discoveredEvidence.shortDescription}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  setActiveModalHotspot(null);
                  setDiscoveredEvidence(null);
                }}
                className="px-5 py-2 rounded bg-[#c9832b] hover:bg-[#df9739] text-[#120f0d] text-xs font-bold shadow-md transition-colors"
              >
                إغلاق وتسجيل الملاحظة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
