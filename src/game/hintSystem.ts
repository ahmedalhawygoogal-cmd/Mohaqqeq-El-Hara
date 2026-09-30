/**
 * Dynamic Progressive Context-Aware Hint System for "محقق الحارة"
 */

import { ScreenMode, GameSaveState } from './gameState';

export interface ProgressiveHint {
  level: 1 | 2 | 3;
  levelTitle: string;
  hintText: string;
}

export interface ContextHintConfig {
  contextId: string;
  title: string;
  hints: ProgressiveHint[];
}

export const CONTEXT_HINTS: Record<string, ContextHintConfig> = {
  // Puzzle 1: Forensic Lab
  'puzzle-forensic': {
    contextId: 'puzzle-forensic',
    title: 'المختبر الجنائي — كشف كتابة المفكرة الغائرة',
    hints: [
      {
        level: 1,
        levelTitle: 'المستوى 1: توجيه استدلالي عام',
        hintText: 'الضوء العمودي المباشر يُلغي الظلال ويجعل السطح يبدو مستوياً تماماً. تحتاج لتسليط الضوء من زاوية جانبية مائلة لتوليد ظلال واضحة في الحفر والشقوق.'
      },
      {
        level: 2,
        levelTitle: 'المستوى 2: ضبط المدى الجنائي',
        hintText: 'حرّك مؤشر زاوية المصباح المائل ليكون بين 38° و 52°، ثم ارفع تظليل مسحوق الجرافيت فوق 65% لإبراز مواضع الضغط المجهري.'
      },
      {
        level: 3,
        levelTitle: 'المستوى 3: كشف الحل الحاسم',
        hintText: 'اضبط الزاوية عند 45° بالضبط، واجعل نسبة التظليل 75%، وسيظهر النص السري بالكامل: "الخميس 9:30 مساءً... حسن العقاد هددني... سلمى معي ولديها نسخة من مفتاح الحارة...".'
      }
    ]
  },

  // Puzzle 2: Cassette Investigation
  'puzzle-cassette': {
    contextId: 'puzzle-cassette',
    title: 'وحدة الفحص الصوتي — كشف تلاعب شريط الكاسيت',
    hints: [
      {
        level: 1,
        levelTitle: 'المستوى 1: توجيه استدلالي عام',
        hintText: 'العقاد يدعي أنه جلس في المقهى طوال المساء دون انقطاع. استمع بدقة للأصوات البعيدة وراء صوت أم كلثوم والشاي: هل تتطابق الأصوات مع الوقت المزعوم؟'
      },
      {
        level: 2,
        levelTitle: 'المستوى 2: ملاحظة مادية محددة',
        hintText: 'ركّز في المقطعين 3 و 4: المقطع 3 يدعي أنه 8:30م بينما يحوي ناقوس كنيسة مار جرجس، والمقطع 4 يحوي إذاعة مصرية استثنائية.'
      },
      {
        level: 3,
        levelTitle: 'المستوى 3: كشف الحل الحاسم',
        hintText: 'حدد المقطع الثالث (ساعة الكنيسة تدق 10 مرات كاملة وهي العاشرة تماماً!) والمقطع الرابع (نشرة طوارئ السيول أذيعت في 10:15م ووضعت مبكراً للتغطية على غياب العقاد أثناء السرقة).'
      }
    ]
  },

  // Puzzle 3 & Deduction Board
  'deduction-board': {
    contextId: 'deduction-board',
    title: 'لوحة الاستنتاج — بناء الاتهام المتماسك',
    hints: [
      {
        level: 1,
        levelTitle: 'المستوى 1: توجيه استدلالي عام',
        hintText: 'تذكر أن كسر كالون الباب كان من الداخل إلى الخارج! هل كان الاقتحام فعلاً هجوماً من لصوص، أم مساعدة لخروج أمينة قبل وصول المستثمر؟'
      },
      {
        level: 2,
        levelTitle: 'المستوى 2: ربط الأدلة المتصلة',
        hintText: 'الفاعل الحقيقي هو حسن العقاد، دخل بالمفتاح المنسوخ الذي اشتراه من فادي. الدافع هو الاستيلاء على أرض الوقف. والسند الأصلي أودعته أمينة لدى نونو بالدكان.'
      },
      {
        level: 3,
        levelTitle: 'المستوى 3: كشف الحل الحاسم',
        hintText: 'اختر: الفاعل = حسن العقاد · الطريقة = مفتاح مكرر مع تمويه داخلي نسقته سلمى · الدافع = صفقة استثمار الوقف · السند = محفوظ بأمان في دكان العم مع نونو.'
      }
    ]
  },

  // General Alley Investigation
  'general-investigation': {
    contextId: 'general-investigation',
    title: 'التحريات الميدانية في حارة السرايا',
    hints: [
      {
        level: 1,
        levelTitle: 'المستوى 1: تفتيش مسرح الجريمة',
        hintText: 'تأكد من فحص بؤر تفتيش "بيت أمينة" الثلاث: قفل الباب المكسور، المفكرة على المكتب، والنافذة الخلفية المطلة على الزقاق.'
      },
      {
        level: 2,
        levelTitle: 'المستوى 2: استجواب الشهود المحوريين',
        hintText: 'توجه إلى مقهى السرايا واستجوب سلمى، ثم واجهها بالقفاز الأزرق. زر الورشة القديمة وفتش ملزمة فادي لتحريز المفتاح النحاسي.'
      },
      {
        level: 3,
        levelTitle: 'المستوى 3: الخطوات المتبقية للحسم',
        hintText: 'قم بفحص ورقة المفكرة في المختبر الجنائي، ثم افحص شريط الكاسيت من الورشة في وحدة الصوت، واطلب من نونو في دكان العم تسليم صندوق الأمانات.'
      }
    ]
  }
};

export function getHintsForCurrentState(
  screen: ScreenMode, 
  gameState: GameSaveState
): ContextHintConfig {
  if (screen === 'puzzle-forensic') {
    return CONTEXT_HINTS['puzzle-forensic'];
  }
  if (screen === 'puzzle-cassette') {
    return CONTEXT_HINTS['puzzle-cassette'];
  }
  if (screen === 'deduction-board' || screen === 'puzzle-timeline' || screen === 'accusation') {
    return CONTEXT_HINTS['deduction-board'];
  }
  return CONTEXT_HINTS['general-investigation'];
}
