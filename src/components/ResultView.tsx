import React from 'react';
import { EndingType, GameSaveState } from '../game/gameState';
import { EVIDENCE_ITEMS } from '../data/evidence';
import { CASES } from '../data/cases';
import { soundManager } from '../game/soundSystem';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  BookOpen, 
  Sparkles, 
  Users, 
  Award,
  Scroll
} from 'lucide-react';

interface ResultViewProps {
  ending: EndingType;
  gameState: GameSaveState;
  onRestartNewGame: () => void;
  onReviewNotebook: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  ending,
  gameState,
  onRestartNewGame,
  onReviewNotebook
}) => {
  const activeCase = CASES[0];
  const collectedCount = gameState.collectedEvidenceIds.length;
  const totalCount = EVIDENCE_ITEMS.length;

  const getEndingDetails = () => {
    switch (ending) {
      case 'full-truth':
        return {
          title: 'النهاية 01: الحقيقة الكاملة',
          subtitle: 'سقوط العقاد بالبرهان القاطع وإدانة شبكة التزوير',
          badgeColor: 'bg-[#182619] text-[#78d68d] border-[#294d2c]',
          isSuccess: true,
          verdict: 'نجاح استثنائي: أثبت المحقق يونس بالأدلة الملموسة والمختبر الصوتي والجنائي أن كسر الباب كان تمويهاً داخلياً لحماية أمينة، وأن حسن العقاد استولى على الملف باستخدام مفتاح مكرر من فادي، ودبلج شريط الكاسيت لإخفاء غيابه.',
          discovered: [
            'كشف تزييف مسرح الجريمة: كسر كالون الباب من الداخل وليس من الخارج.',
            'تحليل انبعاجات المفكرة بالضوء المائل وإثبات رسالة الموعد السري والتهديد.',
            'تفكيك حجة غياب الكاسيت عبر رصد دقات ساعة الكنيسة ونشرة أخبار العاشرة والربع.',
            'العثور على السند الأصلي الحقيقي محفوظاً بأمان في دكان العم مع نونو.'
          ],
          characterFates: [
            { name: 'حسن العقاد', fate: 'أُحيل لمحكمة الجنايات بتهمة الشروع في الاستيلاء بالتزوير والسرقة وتم حبسه احتياطياً.' },
            { name: 'فادي', fate: 'اعترف بتعاونه في صنع المفتاح والشريط وخضع للتحقيق كشاهد ملك بموجب تعاونه مع يونس.' },
            { name: 'أمينة', fate: 'عادت لحارتها مرفوعة الرأس وتثبّت وقف بيت السرايا نهائياً بحكم قضائي بات.' },
            { name: 'سلمى', fate: 'استعادت طمأنينتها وكرّست لوحاتها لتوثيق أزقة الحارة وتاريخها التراثي.' }
          ]
        };

      case 'protected-truth':
        return {
          title: 'النهاية 02: الحقيقة المحمية',
          subtitle: 'انتصار العدالة مع صيانة أمان أمينة وكرامة الأصدقاء',
          badgeColor: 'bg-[#15232d] text-[#79b9e6] border-[#25445c]',
          isSuccess: true,
          verdict: 'حكمة استقصائية نبيلة: اختار المحقق يونس إدانة العقاد قانونياً دون كشف تفاصيل خطة هروب أمينة أو تجريم سلمى بتهمة كسر الباب. سقط الجاني وظلت الحارة آمنة ومترابطة.',
          discovered: [
            'إسقاط حجة غياب العقاد بالأدلة المادية المسجلة والمفتاح المصطنع.',
            'إبقاء أمر كسر القفل الداخلي ومخبأ أمينة في القناطر سراً بين يونس وسلمى.',
            'تسليم السند التاريخي للمحكمة الشرعية مباشرة لحماية العقار من أي مضاربات قادمة.'
          ],
          characterFates: [
            { name: 'حسن العقاد', fate: 'أُدين بالسرقة والتزوير وفقد ترخيص وساطته العقارية للأبد.' },
            { name: 'سلمى وأمينة', fate: 'ظلت صداقتهما العميقة رمزاً للوفاء، ولم تطلهما أية مساءلة قضائية.' },
            { name: 'نونو', fate: 'كوفئ من أهالي الحارة على أمانته وحفظه للسند التاريخي.' }
          ]
        };

      case 'alley-speaks':
        return {
          title: 'النهاية 03: الحارة تتكلم',
          subtitle: 'المواجهة الشعبية الكبرى في مقهى السرايا',
          badgeColor: 'bg-[#2b1f13] text-[#f0ba67] border-[#5e4121]',
          isSuccess: true,
          verdict: 'عدالة أهل البلد: بدلاً من الاكتفاء بالمسار الورقي البيروقراطي، واجه يونس حسن العقاد بكل أدلته أمام حشد كبار وتجار الحارة في مقهى السرايا. انهار العقاد علناً واعترف أمام الشهود قبل تسليمه للشرطة مصفداً!',
          discovered: [
            'تشغيل شريط الكاسيت المفضوح علناً في المقهى أمام هدى والزبائن.',
            'اعتراف فادي المباشر بحضور أهل الحارة بصناعته للمفتاح المكرر.',
            'إعادة السند الأصلي لأمينة في احتفال شعبي مهيب بالحي القديم.'
          ],
          characterFates: [
            { name: 'حسن العقاد', fate: 'خرج من الحارة مطأطأ الرأس تحت حراسة الشرطة محاطاً بلعنات الأهالي.' },
            { name: 'المعلمة هدى', fate: 'علقت صورة للسند المحمي في صدر المقهى تخليداً لصمود الحارة.' },
            { name: 'المحقق يونس', fate: 'أصبح اسمه على كل لسان كملاذ لأهل الحارة عند اشتداد المحن.' }
          ]
        };

      case 'fragile-deduction':
        return {
          title: 'استنتاج هش بسبب نقص الأدلة المادية',
          subtitle: 'ثغرات في ملف التحقيق استغلها دفاع المتهم',
          badgeColor: 'bg-[#332212] text-[#fed09a] border-[#5e3e1f]',
          isSuccess: false,
          verdict: 'لم تكن الأدلة التي قدمتها كافية لإثبات التهمة بما لا يدع مجالاً للشك. استغل محامي حسن العقاد عدم حل لغز شريط الكاسيت أو غياب السند الحقيقي، وتم الإفراج عنه بكفالة مالية بسبب الشك، مما يعرّض بيت السرايا لمخاطر جديدة.',
          discovered: [
            'أشرت إلى الفاعل الصحيح، لكن افتقارك للأدلة الفنية الحاسمة أضعف موقف النيابة.',
            'لم يتم فك لغز كسر الباب الداخلي أو تفنيد التناقض الزمني في شريط الكاسيت بالشكل المطلوب.'
          ],
          characterFates: [
            { name: 'حسن العقاد', fate: 'أُخلي سبيله بكفالة مالية وواصل محاولاته للضغط على أمينة.' },
            { name: 'أمينة', fate: 'ما تزال مختبئة في قلق دائم بانتظار أدلة تقطع دابر التهديد.' }
          ]
        };

      case 'wrong-accusation':
      default:
        return {
          title: 'اتهام خاطئ وتضليل للعدالة',
          subtitle: 'إدانة بريء وإفلات الجاني الحقيقي',
          badgeColor: 'bg-[#3b1512] text-[#ff8e82] border-[#7d2219]',
          isSuccess: false,
          verdict: 'اتجه اتهامك لشخص بريء كفادي أو سلمى بدلاً من المخطط الفعلي. هذا التضليل أتاح لحسن العقاد متسعاً من الوقت لتهريب المستندات وتثبيت سيطرته على أرض بيت السرايا، بينما توترت الثقة في الحارة.',
          discovered: [
            'الوقوع في فخ التمويه الخارجي دون الالتفات إلى المستفيد الحقيقي وصاحب المصلحة الكبرى.',
            'تجاهل بصمات الحذاء الإيطالي ومسودة التوكيل بالشهر العقاري.'
          ],
          characterFates: [
            { name: 'المتهم المظلوم', fate: 'خضع لتحقيقات مرهقة قبل أن تتبين براءته بعد فوات الأوان.' },
            { name: 'حسن العقاد', fate: 'استغل انشغال المحقق وأتم بيع العقار لشركة استثمارية أجنبية.' }
          ]
        };
    }
  };

  const details = getEndingDetails();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      <div className="bg-[#181310] border border-[#423223] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* Header Title */}
        <div className="border-b border-[#2d2219] pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${details.badgeColor}`}>
              {details.title}
            </span>
            <span className="text-xs text-[#8c7866] font-mono">
              تقرير ختام القضية 01
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif-arabic font-extrabold text-[#e5a744]">
            {details.subtitle}
          </h2>
        </div>

        {/* Verdict Box */}
        <div className="bg-[#120e0b] border border-[#2b211a] p-5 rounded-xl space-y-2 text-sm text-[#ebdcc6] leading-relaxed">
          <span className="font-bold text-[#e5a744] flex items-center gap-2">
            <Scroll className="w-4 h-4" />
            <span>حكم محكمة التحريات ومنطوق النتيجة:</span>
          </span>
          <p>{details.verdict}</p>
        </div>

        {/* Discoveries and Evidence Review */}
        <div className="space-y-3">
          <h4 className="font-serif-arabic font-bold text-base text-[#e5a744] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4973b]" />
            <span>حقائق تم الكشف عنها في ملف القضية:</span>
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#cebeac]">
            {details.discovered.map((d, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#14100c] p-3 rounded border border-[#241a12]">
                <span className="text-[#c9832b] font-bold">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Character Fates */}
        <div className="space-y-3">
          <h4 className="font-serif-arabic font-bold text-base text-[#e5a744] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#d4973b]" />
            <span>مصير أطراف القضية بعد صدور الحكم:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {details.characterFates.map((f, idx) => (
              <div key={idx} className="bg-[#14100c] p-3 rounded-lg border border-[#241a12]">
                <strong className="text-[#ebdcc6] block mb-1">{f.name}:</strong>
                <span className="text-[#a69380] leading-relaxed">{f.fate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score & Collection Stats */}
        <div className="bg-[#14100c] border border-[#261d15] p-4 rounded-xl flex items-center justify-between text-xs text-[#a69380]">
          <div>
            حصيلة الأدلة المحرزة: <strong className="text-[#e5a744]">{collectedCount}</strong> من أصل {totalCount} أدلة
          </div>
          <div>
            الألغاز المحلولة: <strong className="text-[#e5a744]">{gameState.completedPuzzleIds.length}</strong> / 3
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#292017]">
          <button
            onClick={() => {
              soundManager.playSoundEffect('paper');
              onReviewNotebook();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#241a13] hover:bg-[#302319] text-[#ebdcc6] text-xs font-bold border border-[#3b2d20] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#d4973b]" />
            <span>مراجعة دفتر القضية والأدلة</span>
          </button>

          <button
            onClick={() => {
              soundManager.playSoundEffect('click');
              onRestartNewGame();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded bg-[#c9832b] hover:bg-[#e09838] text-[#120f0d] font-bold text-xs sm:text-sm shadow-lg shadow-[#c9832b]/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بدء تحقيق جديد في القضية</span>
          </button>
        </div>

      </div>
    </div>
  );
};
