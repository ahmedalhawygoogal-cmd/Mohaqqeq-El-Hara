import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { EVIDENCE_ITEMS, EvidenceItem } from '../data/evidence';
import { GameSaveState, EndingType } from '../game/gameState';
import { soundManager } from '../game/soundSystem';
import { 
  Gavel, 
  AlertTriangle, 
  ShieldAlert, 
  FileCheck, 
  ArrowRight, 
  Check, 
  HelpCircle,
  FolderLock
} from 'lucide-react';

interface AccusationModalProps {
  gameState: GameSaveState;
  onCancel: () => void;
  onSubmitAccusation: (ending: EndingType) => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  gameState,
  onCancel,
  onSubmitAccusation
}) => {
  const [selectedCulprit, setSelectedCulprit] = useState<string>('char-aqqad');
  const [selectedMethod, setSelectedMethod] = useState<string>('duplicate_key_staged');
  const [selectedMotive, setSelectedMotive] = useState<string>('real_estate_theft');
  const [selectedDecisiveEvidenceId, setSelectedDecisiveEvidenceId] = useState<string>(
    gameState.collectedEvidenceIds.includes('ev-cassette-timeline') 
      ? 'ev-cassette-timeline' 
      : gameState.collectedEvidenceIds[0] || 'ev-broken-lock'
  );
  const [communityResolutionRoute, setCommunityResolutionRoute] = useState<'police' | 'protect_amina' | 'neighborhood_confront'>('police');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collectedEvidence = EVIDENCE_ITEMS.filter(ev => 
    gameState.collectedEvidenceIds.includes(ev.id)
  );

  const handleSubmit = () => {
    soundManager.playSoundEffect('stinger');
    setIsSubmitting(true);

    setTimeout(() => {
      // Evaluate ending based on choices and collected evidence
      // 1. Check if culprit is wrong:
      if (selectedCulprit !== 'char-aqqad') {
        onSubmitAccusation('wrong-accusation');
        return;
      }

      // 2. Check evidence depth for Hassan:
      const hasKeyEvidence = gameState.collectedEvidenceIds.includes('ev-duplicate-key');
      const hasBrokenLockEvidence = gameState.collectedEvidenceIds.includes('ev-broken-lock');
      const hasCassetteEvidence = gameState.collectedEvidenceIds.includes('ev-cassette-timeline');
      const hasIndentedEvidence = gameState.collectedEvidenceIds.includes('ev-indented-writing');
      const hasOriginalDeed = gameState.collectedEvidenceIds.includes('ev-original-deed');

      const coreProofCount = [hasKeyEvidence, hasBrokenLockEvidence, hasCassetteEvidence, hasIndentedEvidence, hasOriginalDeed]
        .filter(Boolean).length;

      // If proof is too thin (less than 3 decisive evidence items found)
      if (coreProofCount < 3) {
        onSubmitAccusation('fragile-deduction');
        return;
      }

      // If method is wrong (e.g. violent burglary from outside)
      if (selectedMethod !== 'duplicate_key_staged') {
        onSubmitAccusation('fragile-deduction');
        return;
      }

      // Player succeeded with full proof! Now branch into specific nuanced high-fidelity ending:
      if (communityResolutionRoute === 'protect_amina') {
        onSubmitAccusation('protected-truth');
      } else if (communityResolutionRoute === 'neighborhood_confront') {
        onSubmitAccusation('alley-speaks');
      } else {
        onSubmitAccusation('full-truth');
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      
      {/* Top Banner */}
      <div className="bg-[#1e1310] border-2 border-[#80251c] rounded-xl p-6 mb-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#5e1913] text-[#fcdad6]">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif-arabic font-extrabold text-[#f5d9c3]">
              توجيه قرار الاتهام النهائي
            </h2>
            <p className="text-xs sm:text-sm text-[#e0b5a8]">
              القضية 01: الغرفة المقفولة — استدعاء النيابة العامة وقسم شرطة الجمالية
            </p>
          </div>
        </div>

        {/* Solemn Required Warning */}
        <div className="bg-[#2e100c] border border-[#a83327] p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ff786b] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#ffd5d0] font-bold leading-relaxed">
            تأكد من أن نظريتك مدعومة بالأدلة. الاتهام قرار لا يمكن التراجع عنه في هذه القضية.
          </p>
        </div>
      </div>

      {/* Main Accusation Form */}
      <div className="bg-[#171310] border border-[#3b2d20] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Field 1: The Culprit */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#e5a744]">
            1. من هو المتهم الرئيسي المباشر أمام جهات التحقيق؟
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'char-aqqad', name: 'حسن العقاد', role: 'الوسيط العقاري', img: '/src/assets/images/portrait_aqqad_1790756502328.jpg' },
              { id: 'char-fadi', name: 'فادي', role: 'خبير الأقفال بالورشة', img: '/src/assets/images/portrait_fadi_1790756466917.jpg' },
              { id: 'char-salma', name: 'سلمى', role: 'الرسامة التشكيلية', img: '/src/assets/images/portrait_salma_1790756452176.jpg' }
            ].map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  setSelectedCulprit(c.id);
                }}
                className={`p-3 rounded-lg border text-right transition-all flex items-center gap-3 ${
                  selectedCulprit === c.id
                    ? 'bg-[#2b1f15] border-[#c9832b] text-[#ebdcc6] ring-2 ring-[#c9832b]/20 font-bold'
                    : 'bg-[#120e0b] border-[#292017] text-[#8c7866] hover:text-[#ebdcc6]'
                }`}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-[#d4973b]/50 shadow shrink-0"
                />
                <div>
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-[11px] text-[#7d6b5a]">{c.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: Method of Execution */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#e5a744]">
            2. كيف دخل الفاعل الغرفة، وما حقيقة كسر الباب؟
          </label>
          <div className="space-y-2">
            {[
              { 
                id: 'duplicate_key_staged', 
                label: 'الدخول بالمفتاح المنسوخ؛ والكسر كان تمويهاً داخلياً نسقته سلمى لمساعدة أمينة على التسلل' 
              },
              { 
                id: 'violent_force_burglary', 
                label: 'اقتحام خارجي عنيف بالقوة وتحطيم القفل من ممر الدرج بواسطة لصوص' 
              }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  setSelectedMethod(m.id);
                }}
                className={`w-full p-3 rounded-lg border text-right transition-all text-xs sm:text-sm ${
                  selectedMethod === m.id
                    ? 'bg-[#2b1f15] border-[#c9832b] text-[#ebdcc6] ring-2 ring-[#c9832b]/20 font-bold'
                    : 'bg-[#120e0b] border-[#292017] text-[#8c7866] hover:text-[#ebdcc6]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Field 3: Motive */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#e5a744]">
            3. ما هو الدافع الجنائي الحقيقي وراء الفعل؟
          </label>
          <div className="space-y-2">
            {[
              {
                id: 'real_estate_theft',
                label: 'الاستيلاء على سند الوقف التاريخي لإلغاء قيود الملكية وهدم بيت السرايا بملايين الجنيهات'
              },
              {
                id: 'simple_theft',
                label: 'سرقة مجوهرات وأموال سائلة من خزنة الحائط دون أهداف عقارية'
              }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  setSelectedMotive(m.id);
                }}
                className={`w-full p-3 rounded-lg border text-right transition-all text-xs sm:text-sm ${
                  selectedMotive === m.id
                    ? 'bg-[#2b1f15] border-[#c9832b] text-[#ebdcc6] ring-2 ring-[#c9832b]/20 font-bold'
                    : 'bg-[#120e0b] border-[#292017] text-[#8c7866] hover:text-[#ebdcc6]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Field 4: Decisive Evidence */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#e5a744]">
            4. ما هو الدليل الحاسم المادي الذي يسقط ادعاءات المتهم؟
          </label>
          {collectedEvidence.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {collectedEvidence.map(ev => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => {
                    soundManager.playSoundEffect('click');
                    setSelectedDecisiveEvidenceId(ev.id);
                  }}
                  className={`p-2.5 rounded-lg border text-right text-xs transition-all ${
                    selectedDecisiveEvidenceId === ev.id
                      ? 'bg-[#2b1f15] border-[#c9832b] text-[#ebdcc6] font-bold'
                      : 'bg-[#120e0b] border-[#292017] text-[#8c7866] hover:text-[#ebdcc6]'
                  }`}
                >
                  <div className="font-bold text-[#ebdcc6]">{ev.name}</div>
                  <div className="text-[10px] text-[#7d6b5a]">{ev.locationFound}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#110e0c] rounded text-xs text-[#b84e44]">
              تحذير: لم تجمع أي أدلة مادية حتى الآن! الاتهام بدون أدلة سيقود لفشل القضية فوراً.
            </div>
          )}
        </div>

        {/* Field 5: Moral Resolution Branch */}
        <div className="space-y-2 pt-2 border-t border-[#292017]">
          <label className="block text-sm font-bold text-[#e5a744]">
            5. قرار المحقق في مسار تسليم القضية (يحدد مصير أمينة وسلمى والحارة):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'police',
                title: 'إحالة رسمية كاملة للنيابة العامة',
                desc: 'القبض على حسن العقاد وفادي وتقديم كافة المضبوطات بما فيها تفاصيل هروب أمينة.'
              },
              {
                id: 'protect_amina',
                title: 'حماية مخبأ أمينة وسرية سلمى',
                desc: 'إدانة العقاد بالسرقة واسترداد السند دون فضح موقع أمينة السري أو تجريم سلمى.'
              },
              {
                id: 'neighborhood_confront',
                title: 'مواجهة علنية في مقهى الحارة',
                desc: 'فضح العقاد أمام أهالي ورجالات الحارة بمقهى السرايا قبل تسليمه للشرطة لردع المستثمرين.'
              }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  soundManager.playSoundEffect('click');
                  setCommunityResolutionRoute(r.id as any);
                }}
                className={`p-3 rounded-lg border text-right transition-all ${
                  communityResolutionRoute === r.id
                    ? 'bg-[#2b1f15] border-[#c9832b] text-[#ebdcc6] ring-2 ring-[#c9832b]/20 font-bold'
                    : 'bg-[#120e0b] border-[#292017] text-[#8c7866] hover:text-[#ebdcc6]'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-[#ebdcc6] mb-1">{r.title}</div>
                <div className="text-[11px] text-[#8c7a68] leading-relaxed">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#292017]">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-xs text-[#a69380] hover:text-[#ebdcc6] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لمراجعة الأدلة والخريطة</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#8a2219] hover:bg-[#a82d22] text-white font-bold text-sm shadow-xl shadow-[#8a2219]/25 transition-all flex items-center justify-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري قيد قرار الاتهام...' : 'تثبيت الاتهام وصدور الحكم'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
