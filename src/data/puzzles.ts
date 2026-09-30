/**
 * Puzzles Registry for "محقق الحارة"
 */

export interface ForensicPuzzleData {
  id: 'puzzle-forensic';
  title: string;
  instructions: string;
  targetAngle: number; // e.g., 42 degrees
  angleTolerance: number; // +/- 8 degrees
  targetPencilShade: number; // 0-100%, sweet spot 60-80%
  secretMessage: string;
  clueDiscoveredEvidenceId: string;
  hints: string[];
}

export interface CassetteSegment {
  id: string;
  timeRange: string;
  nominalTime: string;
  actualEvent: string;
  audioDescription: string;
  waveformType: 'calm' | 'radio' | 'noise' | 'splice' | 'chime';
  isAnomaly: boolean;
  explanation: string;
}

export interface CassettePuzzleData {
  id: 'puzzle-cassette';
  title: string;
  instructions: string;
  segments: CassetteSegment[];
  correctAnomalyIds: string[]; // Segments that player must flag as spliced / contradictory
  resolutionEvidenceId: string;
  hints: string[];
}

export interface TimelineSlot {
  time: string; // e.g., "08:00 م"
  timeOrder: number;
  label: string;
  correctEventId: string;
  hint: string;
}

export interface TimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  actor: string;
  description: string;
  connectedEvidenceIds: string[];
}

export interface DeductionHypothesis {
  id: string;
  category: 'culprit' | 'method' | 'motive' | 'deed_location';
  title: string;
  description: string;
  isCorrect: boolean;
  requiredEvidenceIds: string[];
  confidenceScore: number;
}

export interface TimelinePuzzleData {
  id: 'puzzle-timeline';
  title: 'لوحة الاستنتاج والخط الزمني المترابط';
  instructions: 'قم بترتيب التسلسل الحقيقي للأحداث ليلة الخميس من 8:00م حتى 11:30م، واربط الفاعل والوسيلة والدافع بالأدلة الملموسة.';
  slots: TimelineSlot[];
  events: TimelineEvent[];
  hypotheses: DeductionHypothesis[];
}

export const PUZZLE_FORENSIC: ForensicPuzzleData = {
  id: 'puzzle-forensic',
  title: 'المختبر الجنائي: فحص الكتابة الغائرة في المفكرة',
  instructions: 'قم بتحريك زاوية تسليط الضوء الجانبي واستخدام مسحوق الرصاص لتظليل انبعاجات ألياف الورقة وقراءة الرسالة السرية المحفورة.',
  targetAngle: 45,
  angleTolerance: 10,
  targetPencilShade: 75,
  secretMessage: 'الخميس 9:30 مساءً... حسن العقاد هددني بإلغاء إثبات الملكية إذا لم أسلّم السند. سلمى معي ولديها نسخة من مفتاح الحارة... سأغادر قبل أن يأتوا.',
  clueDiscoveredEvidenceId: 'ev-indented-writing',
  hints: [
    'الإضاءة العمودية المباشرة تمحو الظلال الدقيقة؛ اضبط المؤشر بين زاوية 38° و 52° لتوليد ظلال مائلة.',
    'حرّك شريط تظليل الكربون للوصول لدرجة وضوح تتراوح بين 65% و 85% لتظهر الكلمات المطبوعة بوضوح تام.'
  ]
};

export const PUZZLE_CASSETTE: CassettePuzzleData = {
  id: 'puzzle-cassette',
  title: 'وحدة الفحص الصوتي: كشف التناقض الزمني في شريط الكاسيت',
  instructions: 'استمع إلى مقاطع الشريط المسجل، وقم بتدقيق الأصوات الخلفية لمقارنة تسلسل البث الإذاعي وساعة الكنيسة مع توقيت الجلسة المزعوم.',
  correctAnomalyIds: ['seg-3', 'seg-4'],
  resolutionEvidenceId: 'ev-cassette-timeline',
  hints: [
    'المقطع الثالث يدعي أنه في 8:30م لكن صوت ناقوس الكنيسة يدق 10 مرات متتالية، وهي دقات الساعة العاشرة تماماً!',
    'المقطع الرابع يتضمن نشرة طوارئ السيول التي أعلنت عنها الإذاعة بعد العاشرة والربع ليلاً، مما يثبت التلاعب بالترتيب الزمني.'
  ],
  segments: [
    {
      id: 'seg-1',
      timeRange: '00:00 - 01:15',
      nominalTime: '8:15 مساءً',
      actualEvent: 'دخول حسن العقاد مقهى السرايا وطلب الشاي الخفيف',
      audioDescription: 'صوت خشخشة كاسات شاي، سلام بصوت هدى: "يا مرحب يا سي حسن، شاي خفيف زي العادة؟"، وأغنية أم كلثوم تبدأ بهدوء.',
      waveformType: 'calm',
      isAnomaly: false,
      explanation: 'تسجيل أصلي طبيعي يوافق توقيت بداية وصول العقاد إلى المقهى.'
    },
    {
      id: 'seg-2',
      timeRange: '01:15 - 02:40',
      nominalTime: '8:45 مساءً',
      actualEvent: 'حوار اعتيادي مع زبائن المقهى حول أسعار الحبوب',
      audioDescription: 'أصوات نرد طاولة الزهر، ضحكات زبائن، الراديو يبث فاصل إعلاني قديم للمياه الغازية.',
      waveformType: 'noise',
      isAnomaly: false,
      explanation: 'أجواء عامة طبيعية تؤكد وجوده خلال هذه الفترة.'
    },
    {
      id: 'seg-3',
      timeRange: '02:40 - 04:10',
      nominalTime: '8:30 مساءً (مزعوم)',
      actualEvent: 'تسجيل مدبلج يحوي دقات ساعة العاشرة وقطع في الشريط المغناطيسي',
      audioDescription: 'طنين كهربائي ناتج عن قطع ولصق يدوي (Splice)، تليه دقات جرس برونزية ثقيلة تدق (1... 2... 3... حتى 10 دقات كاملة!) بينما يدعي العقاد أنه الثامنة والنصف!',
      waveformType: 'chime',
      isAnomaly: true,
      explanation: 'تناقض حاسم: دقات جرس الكنيسة تثبت أن هذا المقطع سُجل في تمام الساعة العاشرة تماماً وليس في الثامنة والنصف!'
    },
    {
      id: 'seg-4',
      timeRange: '04:10 - 05:30',
      nominalTime: '9:00 مساءً (مزعوم)',
      actualEvent: 'بث إذاعي استثنائي لنشرة طوارئ العاشرة والربع',
      audioDescription: 'صوت المذيع يقاطع: "هنا القاهرة... نلفت عناية السادة المسافرين على طريق الصعيد لانقطاع الحركة بسبب هطول أمطار غزيرة وسيول في العاشرة وخمس عشرة دقيقة".',
      waveformType: 'radio',
      isAnomaly: true,
      explanation: 'تناقض قاطع: نشرة 10:15م الاستثنائية وُضعت عمداً قبل مقاطع أخرى لتغطية فترة غياب العقاد أثناء اقتحام بيت أمينة!'
    }
  ]
};

export const PUZZLE_TIMELINE: TimelinePuzzleData = {
  id: 'puzzle-timeline',
  title: 'لوحة الاستنتاج والخط الزمني المترابط',
  instructions: 'قم بترتيب التسلسل الحقيقي للأحداث ليلة الخميس من 8:00م حتى 11:30م، واربط الفاعل والوسيلة والدافع بالأدلة الملموسة.',
  slots: [
    {
      time: '08:30 م',
      timeOrder: 1,
      label: 'تسليم المفتاح المكرر وأمانة الدكان',
      correctEventId: 'evt-key-handoff',
      hint: 'فادي يسلم المفتاح المكرر للعقاد، وأمينة ترسل السند الحقيقي لنونو لحفظه.'
    },
    {
      time: '09:15 م',
      timeOrder: 2,
      label: 'خطة الهروب والتمويه الداخلي',
      correctEventId: 'evt-escape-staged',
      hint: 'سلمى تساعد أمينة على الخروج عبر السطح، وتكسر القفل من الداخل لتشتيت الفاعل.'
    },
    {
      time: '09:40 م',
      timeOrder: 3,
      label: 'اقتحام العقاد وسرقة الملف البديل',
      correctEventId: 'evt-aqqad-burglary',
      hint: 'حسن العقاد يغادر المقهى عبر الزقاق ويفتح الشقة بالمفتاح المكرر ويستولي على الملف.'
    },
    {
      time: '10:15 م',
      timeOrder: 4,
      label: 'العودة للمقهى وتلفيق حجة الغياب',
      correctEventId: 'evt-fake-alibi',
      hint: 'العقاد يعود للمقهى بحذاء ملوث بالطين، ويبدأ فادي في مونتاج شريط الكاسيت.'
    },
    {
      time: '11:30 م',
      timeOrder: 5,
      label: 'اكتشاف الواقعة وبلاغ الجريمة',
      correctEventId: 'evt-police-report',
      hint: 'هدى وأهالي الحارة يكتشفون الباب المفتوح ويطلبون المحقق يونس.'
    }
  ],
  events: [
    {
      id: 'evt-key-handoff',
      timeLabel: '08:30 م',
      title: 'استلام المفتاح المصطنع وتأمين السند',
      actor: 'فادي / أمينة / نونو',
      description: 'فادي يسلم حسن العقاد نسخة المفتاح النحاسي في ورشته، بينما تستشعر أمينة الخطر وتسلم صندوق الأمانة لنونو لحفظه في الدكان.',
      connectedEvidenceIds: ['ev-duplicate-key', 'ev-delivery-note']
    },
    {
      id: 'evt-escape-staged',
      timeLabel: '09:15 م',
      title: 'خروج أمينة وتمويه كسر القفل الداخلي',
      actor: 'سلمى / أمينة',
      description: 'أمينة تغادر عبر شرفة السطح باتجاه محطة السفر، وسلمى تكسر القفل بماسورة من الداخل وترتدي القفاز الأزرق للإيحاء بحدوث اقتحام خارجي.',
      connectedEvidenceIds: ['ev-broken-lock', 'ev-blue-glove', 'ev-indented-writing']
    },
    {
      id: 'evt-aqqad-burglary',
      timeLabel: '09:40 م',
      title: 'تسلل العقاد عبر الزقاق وسرقة الخزنة',
      actor: 'حسن العقاد',
      description: 'حسن العقاد يتسلل عبر الزقاق الخلفي بحذائه الإيطالي، ويفتح شقة أمينة بالمفتاح المكرر ويسرق السند الاحتياطي الموجود بالخزنة المفتوحة.',
      connectedEvidenceIds: ['ev-altered-document', 'ev-duplicate-key']
    },
    {
      id: 'evt-fake-alibi',
      timeLabel: '10:15 م',
      title: 'عودة العقاد ومونتاج شريط الكاسيت',
      actor: 'حسن العقاد / فادي',
      description: 'العقاد يعود لمقهى السرايا متوتراً وثيابه ملطخة بالطين، ويسلم فادي التسجيل لاحقاً لقص ودمج نشرة 10:15م لإخفاء فترة غيابه.',
      connectedEvidenceIds: ['ev-cassette-timeline', 'ev-cassette-recorder']
    },
    {
      id: 'evt-police-report',
      timeLabel: '11:30 م',
      title: 'إبلاغ المحقق يونس وبدء التحقيق الجنائي',
      actor: 'المعلمة هدى / المحقق يونس',
      description: 'هدى تلاحظ انقطاع حركة أمينة والباب المشوه، وتبلغ المحقق يونس الذي يبدأ في تحريز مسرح الواقعة واستجواب الشهود.',
      connectedEvidenceIds: ['ev-broken-lock']
    }
  ],
  hypotheses: [
    {
      id: 'hyp-culprit-aqqad',
      category: 'culprit',
      title: 'حسن العقاد هو المخطط وسارق سند الملكية',
      description: 'دبر الحصول على مفتاح مكرر من فادي، واقتحم الشقة مستغلاً غياب أمينة، وسرق السند لتنفيذ مخططه العقاري، ودبلج شريط الكاسيت لتلفيق غيابه.',
      isCorrect: true,
      requiredEvidenceIds: ['ev-duplicate-key', 'ev-cassette-timeline', 'ev-altered-document'],
      confidenceScore: 100
    },
    {
      id: 'hyp-culprit-fadi',
      category: 'culprit',
      title: 'فادي هو من اقتحم وسرق لصالحه الخاص',
      description: 'استخدم مهارته في الأقفال واقتحم البيت لسرقة الأموال، وحسن العقاد مجرد زبون عادي في الورشة.',
      isCorrect: false,
      requiredEvidenceIds: ['ev-duplicate-key'],
      confidenceScore: 30
    },
    {
      id: 'hyp-method-staged-and-key',
      category: 'method',
      title: 'دخول بالمفتاح المكرر بعد تمويه داخلي نسقته سلمى',
      description: 'الباب كُسر من الداخل على يد سلمى لتأمين هروب أمينة، والعقاد دخل بالمفتاح المكرر ووجد الغرفة خالية فاستولى على محتوى الخزنة.',
      isCorrect: true,
      requiredEvidenceIds: ['ev-broken-lock', 'ev-indented-writing', 'ev-duplicate-key'],
      confidenceScore: 100
    },
    {
      id: 'hyp-motive-estate-deal',
      category: 'motive',
      title: 'الاستيلاء على بيت الوقف وهدمه لإنشاء مجمع استثماري',
      description: 'إلغاء سند 1928 التاريخي وتقديم توكيل معدل ومزور للاستيلاء على أرض الحارة بمليارات الجنيهات.',
      isCorrect: true,
      requiredEvidenceIds: ['ev-altered-document', 'ev-original-deed'],
      confidenceScore: 100
    },
    {
      id: 'hyp-deed-saved-nono',
      category: 'deed_location',
      title: 'السند الأصلي الحقيقي محفوظ بأمان في دكان العم',
      description: 'أمينة استودعت السند الحقيقي لدى نونو قبل الحادث، والملف المسروق مع العقاد ليس إلا نسخة تمويهية!',
      isCorrect: true,
      requiredEvidenceIds: ['ev-delivery-note', 'ev-original-deed'],
      confidenceScore: 100
    }
  ]
};
