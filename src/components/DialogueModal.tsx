import React, { useState, useEffect, useRef } from 'react';
import { CHARACTERS, CharacterData } from '../data/characters';
import { DIALOGUES, DialogueNode, DialogueChoice } from '../data/dialogues';
import { EVIDENCE_ITEMS, EvidenceItem } from '../data/evidence';
import { GameSaveState } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { 
  X, 
  MessageSquare, 
  AlertTriangle, 
  Sparkles, 
  FolderSearch, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  HelpCircle,
  FileText
} from 'lucide-react';

interface DialogueModalProps {
  characterId: string;
  gameState: GameSaveState;
  onClose: () => void;
  onChoiceSelected: (choice: DialogueChoice, nextNodeId: string) => void;
  onEvidencePresented: (evidenceId: string) => void;
  onUpdateCharacterTrustSuspicion?: (charId: string, trustDelta: number, suspicionDelta: number) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  sender: string;
  text: string;
  timestamp: string;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  characterId,
  gameState,
  onClose,
  onChoiceSelected,
  onEvidencePresented,
  onUpdateCharacterTrustSuspicion
}) => {
  const character = CHARACTERS.find(c => c.id === characterId) || CHARACTERS[1];
  const tree = DIALOGUES[characterId];

  const [activeTab, setActiveTab] = useState<'branching' | 'ai_chat'>('branching');
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    tree ? tree.initialNodeId : 'salma-root'
  );
  const [history, setHistory] = useState<Array<{ speaker: string; text: string; choiceText?: string }>>([]);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);

  // Free-form AI Chat State
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      role: 'model',
      sender: character.name,
      text: character.tagline + ' تفضل يا حضرة المحقق، اسألني عمّا تريد وسأجيبك بما أعرفه.',
      timestamp: 'الآن'
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    soundManager.setLowVolumeMode(true);
    return () => {
      soundManager.setLowVolumeMode(false);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'ai_chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages, activeTab]);

  const trust = gameState.characterTrust[character.id] ?? character.initialTrust;
  const suspicion = gameState.characterSuspicion[character.id] ?? 30;

  // Determine relationship status badge
  const getRelationshipStatus = () => {
    if (suspicion >= 80) return { label: 'محاصر بالاعتراف الجنائي', color: 'bg-[#7a1f18] text-[#ffd6d3] border-[#a1281e]' };
    if (suspicion >= 60) return { label: 'موضع ريبة شديدة', color: 'bg-[#5c3112] text-[#fcd29d] border-[#7d4319]' };
    if (trust >= 75) return { label: 'حليف موثوق ومتعاون', color: 'bg-[#182619] text-[#78d68d] border-[#294d2c]' };
    if (trust >= 50) return { label: 'شاهد متعاون بحذر', color: 'bg-[#261f18] text-[#e5a744] border-[#4a392b]' };
    return { label: 'حذر ومتحفظ', color: 'bg-[#1d1712] text-[#a69584] border-[#33261c]' };
  };

  const relationship = getRelationshipStatus();

  const currentNode: DialogueNode = tree?.nodes[currentNodeId] || {
    id: 'fallback',
    speaker: character.name,
    characterId: character.id,
    mood: 'طبيعي',
    speech: 'ليس لدي ما أضيفه في هذا الوقت يا محقق.',
    choices: []
  };

  const handleChoose = (choice: DialogueChoice) => {
    soundManager.playSoundEffect('paper');
    setHistory(prev => [
      ...prev,
      { speaker: character.name, text: currentNode.speech, choiceText: choice.text }
    ]);

    if (choice.suspicionImpact && choice.suspicionImpact > 15) {
      soundManager.playSoundEffect('stinger');
    }

    setCurrentNodeId(choice.leadsToNodeId);
    onChoiceSelected(choice, choice.leadsToNodeId);
  };

  const handlePresentEvidence = (ev: EvidenceItem) => {
    soundManager.playSoundEffect('clue');
    setShowEvidenceDrawer(false);
    onEvidencePresented(ev.id);

    const matchingChoice = currentNode.choices.find(c => c.requiredEvidenceId === ev.id);
    if (matchingChoice) {
      handleChoose(matchingChoice);
    } else {
      const reactionText = character.evidenceReactions[ev.id];
      if (reactionText) {
        setHistory(prev => [
          ...prev,
          { 
            speaker: 'المحقق يونس', 
            text: `(يقدم الدليل: ${ev.name})، انظر إلى هذا... ما قولك فيه؟` 
          },
          {
            speaker: character.name,
            text: reactionText
          }
        ]);
      }
    }
  };

  const getLocalCharacterReply = (charId: string, text: string, trustLevel: number, suspLevel: number): string => {
    const lower = text.toLowerCase();
    if (charId === 'char-salma') {
      if (lower.includes('قفاز') || lower.includes('أزرق') || lower.includes('شرفة') || lower.includes('نافذة')) {
        return 'أرجوك يا سي يونس... القفاز ده بتاعي نعم، بس والله ما قصدت أضر أمينة! كنت بساعدها تخرج من الشباك قبل ما العقاد ورجالته يوصلوا!';
      }
      if (lower.includes('سند') || lower.includes('عقد') || lower.includes('أمانة') || lower.includes('ورق')) {
        return 'أمينة كانت حريصة جداً وذكية، وما سابتش السند الأصلي في البيت... اسأل نونو في دكان العم، هو اللي استلم الأمانة المغلقة بالشمع الأحمر.';
      }
      if (lower.includes('مفتاح') || lower.includes('قفل') || lower.includes('باب')) {
        return 'الباب انكسر من جوة يا سي يونس... كسرناه بحديدة عشان العقاد لما يجي يفتكر إن في لصوص سبقوه، وتكسب أمينة وقت للهروب!';
      }
      if (trustLevel > 70) {
        return 'أنا واثقة فيك يا يونس... أمينة في مكان آمن في القناطر الخيرية عند خالتها، والكل كان متآمر على بيت الوقف عشان يتهد.';
      }
      return 'يا محقق يونس، أنا على أعصابي من الصبح... قل لي بس، هل لقيتوا أي خيط يوصلنا لأمينة أو يكشف العقاد؟';
    }

    if (charId === 'char-fadi') {
      if (lower.includes('مفتاح') || lower.includes('كالون') || lower.includes('نحاس') || lower.includes('نسخة')) {
        return 'يا سي يونس، أنا مجرد صنايعي! العقاد جاب لي بصمة شمع ودفع لي 500 جنيه وقال ده مفتاح شقته ضاع... والله ما كنت أعرف إنه ناوي على سرقة!';
      }
      if (lower.includes('كاسيت') || lower.includes('شريط') || lower.includes('راديو') || lower.includes('تسجيل') || lower.includes('مونتاج')) {
        return 'الشريط هو اللي طلبه مني! قصيت حتة من نشرة الأخبار وركبتها على صوت الراديو، بس دقات جرس الكنيسة في الخلفية فضلت وفضحت المعاد الحقيقي!';
      }
      return 'ورشتي مفتوحة للكل يا سي يونس، وأنا راجل على باب الله بصلح أجهزة ومفاتيح وماليش في مشاكل الكبار.';
    }

    if (charId === 'char-huda') {
      if (lower.includes('عقاد') || lower.includes('مقهى') || lower.includes('شاي') || lower.includes('حذاء') || lower.includes('طين')) {
        return 'حسن العقاد قعد هنا من 8:20، بس اختفى في الزقاق أكتر من 45 دقيقة ورجع في 10:15 وجزمته مليانة طين وشايل دوسيه أزرق!';
      }
      if (lower.includes('كاسيت') || lower.includes('شريط') || lower.includes('راديو') || lower.includes('أم كلثوم')) {
        return 'الراديو كان شغال على أم كلثوم فعلاً، بس نشرة السيول الاستثنائية أذيعت 10:15 بالدقيقة يا سي يونس، وكلام العقاد كذب صريح!';
      }
      return 'يا يونس يا ابني، قهوة السرايا عينها ما بتنامش... اللي شفته ليلة الخميس إن في حركة مش مظبوطة كانت بتترتب لبيت أمينة.';
    }

    if (charId === 'char-nono') {
      if (lower.includes('أمانة') || lower.includes('مظروف') || lower.includes('صندوق') || lower.includes('سند') || lower.includes('شمع')) {
        return 'الست أمينة سلّمتني الصندوق وقالت لي: "يا نونو، ده شرف الحارة كلها، ما تسلمهوش إلا للمحقق يونس لما يطلب السند بنفسه"! والصندوق في الحفظ والصون يا سي يونس.';
      }
      return 'أنا بوصل الطلبيات في الحارة وعيني بتلقط كل حاجة... وشفت العقاد طالع سلم الحريق ليلة المطر ومعه كشاف قلم وبدلة رمادية.';
    }

    if (charId === 'char-aqqad') {
      if (lower.includes('مفتاح') || lower.includes('سرقة') || lower.includes('تزوير') || lower.includes('فادي')) {
        return 'كلامك ده اتهام باطل لا أساس له من الصحة! أنا رجل أعمال محترم وسأقاضي كل من يمس سمعتي الاستثمارية!';
      }
      if (lower.includes('كاسيت') || lower.includes('شريط') || lower.includes('راديو') || lower.includes('كنيسة') || lower.includes('نشرة')) {
        return 'إيه؟! الكاسيت... أنت مين قالك على الشريط؟! دي جلسة خاصة ومسجلة في المقهى ومفيهاش أي غلط قانوني!';
      }
      return 'الحارة دي لازم تدخل عصر التطوير الحديث يا أستاذ يونس... والورق القديم بتاع الوقف لن يوقف مسيرة الاستثمار!';
    }

    if (charId === 'char-younes') {
      return 'كل دليل نربطه بعناية يقرّبنا من كشف خيوط المؤامرة... راجع الدفتر وتفقد مسرح الجريمة، فالأشياء الصامتة لا تكذب أبداً.';
    }

    return 'أنا مستعد للتعاون معك يا حضرة المحقق في حدود ما أعلمه عن تلك الليلة.';
  };

  // Free-form AI Chat Send (Completely resilient)
  const handleSendAiMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isAiLoading) return;

    soundManager.playSoundEffect('click');
    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      sender: 'المحقق يونس',
      text: userText,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, newMsg]);
    setIsAiLoading(true);

    let replyText = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          message: userText,
          conversationHistory: aiChatMessages.map(m => ({ role: m.role, text: m.text })),
          trustLevel: trust,
          suspicionLevel: suspicion,
          collectedEvidenceIds: gameState.collectedEvidenceIds
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          replyText = data.reply;
        }
      }
    } catch {
      // Fetch or network failure gracefully caught
    }

    // If server was offline or failed to respond, fallback to rich in-character generator
    if (!replyText) {
      replyText = getLocalCharacterReply(character.id, userText, trust, suspicion);
    }

    soundManager.playSoundEffect('paper');
    const replyMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      sender: character.name,
      text: replyText,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, replyMsg]);

    // If user pressured effectively or confronted with evidence keywords, shift trust/suspicion slightly
    const lower = userText.toLowerCase();
    if (lower.includes('مفتاح') || lower.includes('شريط') || lower.includes('قفاز') || lower.includes('سند')) {
      soundManager.playSoundEffect('clue');
      if (onUpdateCharacterTrustSuspicion) {
        onUpdateCharacterTrustSuspicion(character.id, 5, 8);
      }
    }

    setIsAiLoading(false);
  };

  const availableEvidence = EVIDENCE_ITEMS.filter(ev => 
    gameState.collectedEvidenceIds.includes(ev.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in">
      <div className="bg-[#181310] border border-[#423223] rounded-xl max-w-4xl w-full h-[92vh] max-h-[780px] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Top Header: Dignified Typographic Character Card (NO CARTOON) */}
        <div className="bg-[#120e0b] border-b border-[#2d2219] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playSoundEffect('click');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#221a15] hover:bg-[#30251e] text-[#a69584] hover:text-[#ebdcc6] transition-colors"
              aria-label="إغلاق الاستجواب"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Character Portrait & Dossier Header */}
            <div className="flex items-center gap-3">
              {character.portraitUrl && (
                <img
                  src={character.portraitUrl}
                  alt={character.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#d4973b]/80 shadow-md shrink-0"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#a89582] border border-[#3b2e23] px-2 py-0.5 rounded bg-[#1c1611]">
                    {character.dossierCode}
                  </span>
                  <h3 className="font-serif-arabic font-extrabold text-lg sm:text-xl text-[#e5a744]">
                    {character.name}
                  </h3>
                </div>
                <p className="text-xs text-[#9c8976] mt-0.5">{character.role}</p>
              </div>
            </div>
          </div>

          {/* Relationship Metrics & Status Badge */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded border ${relationship.color}`}>
              {relationship.label}
            </span>
            <div className="hidden sm:flex items-center gap-2 bg-[#1b1510] px-2.5 py-1 rounded border border-[#2d221a]">
              <span className="text-[#8c7866]">الثقة: <strong className="text-[#e5a744]">{trust}%</strong></span>
              <span className="text-[#8c7866]">· الريبة: <strong className="text-[#c75549]">{suspicion}%</strong></span>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="bg-[#14100c] border-b border-[#2b2017] px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('branching')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'branching'
                  ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                  : 'text-[#9c8976] hover:text-[#ebdcc6]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>الاستجواب التوثيقي ومواجهة الأدلة</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === 'ai_chat'
                  ? 'bg-[#2b2118] text-[#e5a744] border border-[#c9832b]/40 shadow-sm'
                  : 'text-[#9c8976] hover:text-[#ebdcc6]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#e5a744]" />
              <span>استجواب حر ومباشر (AI)</span>
              <span className="text-[9px] bg-[#78221b] text-[#fcdbd7] px-1.5 py-0.2 rounded font-mono">
                تفاعلي
              </span>
            </button>
          </div>

          <span className="text-[11px] text-[#7d6b5a] hidden sm:inline">
            حجة الغياب: {character.alibi}
          </span>
        </div>

        {/* TAB 1: Branching Dialogue Mode */}
        {activeTab === 'branching' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Scrollable History & Current Speech */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {/* Character Tagline */}
              <div className="bg-[#120f0d] border border-[#2b211a] p-3 rounded text-xs text-[#a69584] flex items-center justify-between">
                <span>{character.tagline}</span>
                <span className="text-[#8c7866] font-mono text-[11px]">مستوى الشبهة: {character.suspicionLevel}</span>
              </div>

              {/* Past History */}
              {history.length > 0 && (
                <div className="space-y-3 opacity-75 border-b border-[#261d16] pb-4">
                  {history.map((h, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      {h.choiceText && (
                        <div className="flex items-center gap-2 text-[#c9832b] font-medium mr-2">
                          <ChevronRight className="w-3 h-3 rotate-180" />
                          <span>المحقق يونس: {h.choiceText}</span>
                        </div>
                      )}
                      <div className="bg-[#120e0c] p-3 rounded text-[#bda995] mr-4 border-r-2 border-[#423326]">
                        <strong>{h.speaker}:</strong> {h.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contradiction Alert */}
              {currentNode.contradictionAlert && (
                <div className="bg-[#381614] border border-[#8f2b23] p-3.5 rounded-lg flex items-start gap-3 animate-in shake">
                  <AlertTriangle className="w-5 h-5 text-[#f06e62] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-[#f28e85] block">
                      كشف تناقض في إفادة الشاهد!
                    </span>
                    <p className="text-xs text-[#ebd5d2] mt-0.5">
                      {currentNode.contradictionAlert}
                    </p>
                  </div>
                </div>
              )}

              {/* Current Speech */}
              <div className="bg-[#1c1612] border-2 border-[#473628] rounded-xl p-4 sm:p-5 shadow-lg relative flex items-start gap-3 sm:gap-4">
                {character.portraitUrl && (
                  <img
                    src={character.portraitUrl}
                    alt={character.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border-2 border-[#d4973b]/70 shadow-lg shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif-arabic font-bold text-base text-[#e5a744]">
                      {currentNode.speaker}:
                    </span>
                    <span className="text-[10px] text-[#8c7866] font-mono">
                      إفادة رسمية مسجلة
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#f0e3d3] leading-relaxed font-sans">
                    {currentNode.speech}
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Choices & Evidence Drawer */}
            <div className="bg-[#130f0c] border-t border-[#2d2219] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#c9832b]">حدد سؤال التحقيق أو واجهه بالأدلة:</span>
                <button
                  onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2b2016] hover:bg-[#3d2e20] text-[#e5a744] text-xs font-bold border border-[#d4973b]/40 transition-colors"
                >
                  <FolderSearch className="w-3.5 h-3.5" />
                  <span>مواجهة بأحد الأدلة المحرزة ({availableEvidence.length})</span>
                </button>
              </div>

              {/* Evidence Drawer */}
              {showEvidenceDrawer && (
                <div className="bg-[#171310] border border-[#3b2d20] rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  <span className="text-[11px] text-[#9c8976] block mb-1">
                    اختر دليلاً لعرضه على {character.name}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableEvidence.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => handlePresentEvidence(ev)}
                        className="flex items-center justify-between text-right p-2 rounded bg-[#211a14] hover:bg-[#2e241c] border border-[#33271d] text-xs transition-colors"
                      >
                        <span className="font-bold text-[#ebdcc6]">{ev.name}</span>
                        <span className="text-[10px] text-[#e5a744]">مواجهة</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Choices */}
              <div className="space-y-2">
                {currentNode.choices.length > 0 ? (
                  currentNode.choices.map((choice) => {
                    const isEvidenceLocked = choice.requiredEvidenceId && 
                      !gameState.collectedEvidenceIds.includes(choice.requiredEvidenceId);

                    if (isEvidenceLocked) return null;

                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleChoose(choice)}
                        className="w-full flex items-center justify-between text-right p-3 rounded-lg bg-[#1a1511] hover:bg-[#28201a] border border-[#382b1f] hover:border-[#c9832b] text-xs sm:text-sm text-[#ebdcc6] transition-all group"
                      >
                        <span className="font-medium group-hover:text-[#e5a744] transition-colors leading-relaxed">
                          {choice.text}
                        </span>
                        {choice.tone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 mr-3 bg-[#241b14] text-[#d4973b] border-[#473423]">
                            {choice.tone}
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <button
                    onClick={() => {
                      soundManager.playSoundEffect('click');
                      onClose();
                    }}
                    className="w-full py-2.5 rounded bg-[#2b211a] hover:bg-[#382b21] text-[#ebdcc6] text-xs font-bold transition-colors"
                  >
                    إنهاء الاستجواب والعودة للموقع
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Multi-turn Free-Form AI Chat Mode */}
        {activeTab === 'ai_chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Scrollable Chat History Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="bg-[#120f0d] border border-[#2b211a] p-3 rounded text-xs text-[#a69584] flex items-center justify-between">
                <span>
                  <strong>نظام الاستجواب المباشر:</strong> يمكنك توجيه أي سؤال بحرية للشاهد، وسيرد وفقاً لصفاته وأسراره ونبرته المصرية.
                </span>
                <span className="text-[#e5a744] font-bold font-mono">Gemini AI</span>
              </div>

              {aiChatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <img
                      src={isUser ? '/src/assets/images/portrait_younes_1790756516169.jpg' : (character.portraitUrl || '')}
                      alt={msg.sender}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-[#d4973b]/60 shadow shrink-0 mt-1"
                    />

                    <div className={`flex flex-col max-w-[82%] ${isUser ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8c7866] mb-1 px-1">
                        <span className="font-bold text-[#e5a744]">{msg.sender}</span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-md ${
                          isUser
                            ? 'bg-[#2b2016] text-[#ebdcc6] border border-[#4a392b] rounded-tr-none'
                            : 'bg-[#18130f] text-[#f2e2d0] border border-[#3b2d20] rounded-tl-none font-serif-arabic'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div className="flex flex-col items-end">
                  <div className="text-[11px] text-[#8c7866] mb-1">
                    {character.name} يفكر في الإجابة...
                  </div>
                  <div className="bg-[#18130f] border border-[#3b2d20] p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#e5a744] animate-ping" />
                    <span className="text-xs text-[#bda995]">يكتب إفادته...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Arabic Question Suggestions */}
            <div className="px-4 py-2 bg-[#120e0c] border-t border-[#241a12] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-[#7d6b5a] shrink-0 font-bold">اقتراحات:</span>
              {[
                'أين كنت ليلة الخميس في تمام التاسعة مساءً؟',
                'ماذا تعرف عن سند ملكية بيت أمينة؟',
                'من رأيته يتسلل عبر الزقاق وقت المطر؟',
                'لماذا تتهرب من الإجابة عن المفتاح المكرر؟'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-2.5 py-1 rounded bg-[#1c1611] hover:bg-[#282018] text-[#c9b7a2] hover:text-[#e5a744] border border-[#30251c] whitespace-nowrap transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* AI Chat Input Bar */}
            <form
              onSubmit={handleSendAiMessage}
              className="bg-[#14100c] border-t border-[#2d2219] p-3 sm:p-4 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`وجّه سؤالك إلى ${character.name} مباشرة...`}
                className="flex-1 bg-[#1a1511] border border-[#382b1f] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#ebdcc6] placeholder-[#7d6c5c] focus:outline-none focus:border-[#c9832b]"
              />

              <button
                type="submit"
                disabled={isAiLoading || !inputMessage.trim()}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  !isAiLoading && inputMessage.trim()
                    ? 'bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] shadow-md cursor-pointer'
                    : 'bg-[#221b15] text-[#6b584a] cursor-not-allowed border border-[#30251c]'
                }`}
              >
                <Send className="w-4 h-4 rotate-180" />
                <span className="hidden sm:inline">إرسال السؤال</span>
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
