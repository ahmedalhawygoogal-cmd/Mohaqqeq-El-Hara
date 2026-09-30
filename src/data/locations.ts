/**
 * Locations Registry for "محقق الحارة"
 */

export interface Hotspot {
  id: string;
  name: string;
  category: 'دليل' | 'ملاحظة' | 'وثيقة' | 'أثر جنائي';
  coords: { x: number; y: number }; // Percentage 0-100 for responsive positioning
  description: string;
  investigationText: string;
  revealsEvidenceId?: string;
  requiresClueId?: string; // Optional prerequisite
  iconType: 'magnifier' | 'lock' | 'document' | 'audio' | 'footprint' | 'sparkle';
  completedText?: string;
}

export interface LocationData {
  id: string;
  title: string;
  subtitle: string;
  type: 'active' | 'locked';
  atmosphere: string;
  soundCue?: string;
  mapCoordinates: { x: number; y: number }; // Position on interactive neighborhood map
  description: string;
  visualTheme: {
    ambientColor: string;
    lighting: string;
    bgPattern: string;
    bannerIcon: string;
  };
  characterIds: string[];
  hotspots: Hotspot[];
  notes: string[];
}

export const LOCATIONS: LocationData[] = [
  {
    id: 'loc-office',
    title: 'مكتب يونس',
    subtitle: 'مقر التحريات الخاصة — زاوية حارة السرايا',
    type: 'active',
    atmosphere: 'مكتب هادئ تفوح منه رائحة القهوة السادة والورق القديم، مصباح مكتبي كهرماني يلقي ظلالاً هادئة على الخرائط المعلقة.',
    mapCoordinates: { x: 18, y: 35 },
    description: 'غرفة عتيقة بجدران خشبية داكنة، تتكدس فيها ملفات قضايا أهالي الحارة، وجهاز تشغيل أشرطة قديم، ومجهر فحص جنائي بسيط فوق طاولة الفحص.',
    visualTheme: {
      ambientColor: 'rgba(212, 151, 59, 0.08)',
      lighting: 'كهرماني خافت',
      bgPattern: 'office',
      bannerIcon: 'Building2'
    },
    characterIds: ['char-younes'],
    notes: [
      'هنا تبدأ خيوط كل قضية وتلتقي استنتاجات يونس.',
      'طاولة الفحص تتيح فحص الوثائق واستخدام الضوء المائل.',
      'جهاز الكاسيت متاح لتشغيل الأشرطة المسجلة والتدقيق في الترددات.'
    ],
    hotspots: [
      {
        id: 'hs-office-desk',
        name: 'مكتب المحقق وطاولة الفحص',
        category: 'وثيقة',
        coords: { x: 45, y: 55 },
        description: 'مكتب عريض عليه مصباح زاوية قابل للتحريك وعدسة مكبرة وأدوات رفع البصمات ومسطرة قياس دقيقة.',
        investigationText: 'طاولة الفحص الجنائي مجهزة بمصباح مائل لكشف الآثار الخفية على الورق والمستندات. يمكنك استخدامها في أي وقت لفحص أي ورقة يتم العثور عليها.',
        iconType: 'document'
      },
      {
        id: 'hs-office-cassette-deck',
        name: 'جهاز تسجيل وتشغيل الكاسيت',
        category: 'ملاحظة',
        coords: { x: 75, y: 48 },
        description: 'مشغل أشرطة كاسيت ياباني قديم متصل بسماعات رأس ومؤشر لقياس ترددات الصوت التناظرية.',
        investigationText: 'جهاز التسجيل جاهز لتشغيل وفحص أي شريط صوتي يُعثر عليه في مسرح الواقعة للتدقيق في الأصوات الخلفية وضبط التوقيت.',
        iconType: 'audio'
      },
      {
        id: 'hs-office-caseboard',
        name: 'لوحة الخيوط الجدارية',
        category: 'ملاحظة',
        coords: { x: 22, y: 30 },
        description: 'لوحة فلينية كبيرة مشدودة بخيوط حمراء تربط صور المشتبه بهم ومواقع الحارة والتسلسل الزمني للأحداث.',
        investigationText: 'كل دليل أو شهادة تجمعها في الحارة تُسجل وتُتاح للمطابقة في لوحة الاستنتاج لتقرير هوية الفاعل وكيفية تنفيذ الفعل والدافع.',
        iconType: 'sparkle'
      }
    ]
  },
  {
    id: 'loc-amina-house',
    title: 'بيت أمينة',
    subtitle: 'مسرح الواقعة — الطابق الثاني المطل على الزقاق',
    type: 'active',
    atmosphere: 'سكون ثقيل، نافذة مواربة يدخل منها هواء بارد، وأثاث مبعثر يوحي ببحث محموم وسريع.',
    mapCoordinates: { x: 48, y: 22 },
    description: 'شقة أمينة التاريخية القديمة. الباب الخارجي الخشبي يحمل آثار تحطيم عنيفة عند موضع القفل، والمكتب مبعثر، ودولاب الأوراق مفتوح على مصراعيه.',
    visualTheme: {
      ambientColor: 'rgba(40, 50, 70, 0.12)',
      lighting: 'ضوء قمر أزرق بارد يتداخل مع مصباح زيتي',
      bgPattern: 'crime-scene',
      bannerIcon: 'Home'
    },
    characterIds: [],
    notes: [
      'أمينة اختفت تماماً دون أن تأخذ حقيبتها أو معطفها الشتوي.',
      'كسر الباب يبدو غريباً لمن يدقق في اتجاه تناثر الشظايا الخشبية.',
      'الخزنة كانت تحوي سند الملكية الأصلي لبيت وقف العائلة.'
    ],
    hotspots: [
      {
        id: 'hs-amina-door',
        name: 'قفل الباب الخشبي المحطم',
        category: 'أثر جنائي',
        coords: { x: 25, y: 42 },
        description: 'كالون الباب الحديدي مكسور، وحافة الخشب مشروخة بعنف.',
        investigationText: 'تدقيق جنائي دقيق: شظايا الخشب وشقوق الإطار مندفعة إلى الخارج باتجاه الممر وليس إلى الداخل! هذا يعني أن الضربة أو الضغط الذي حطم القفل جاء من "داخل الغرفة" ليُوحي بحدوث اقتحام خارجي تمويهي!',
        revealsEvidenceId: 'ev-broken-lock',
        iconType: 'lock',
        completedText: 'تم توثيق كسر القفل الداخلي: تمويه متقن للإيحاء بالاقتحام الخارجي.'
      },
      {
        id: 'hs-amina-desk',
        name: 'مفكرة المكتب وأوراق مبعثرة',
        category: 'وثيقة',
        coords: { x: 58, y: 62 },
        description: 'مكتب خشبي عتيق عليه قلم رصاص ومحبرة ومفكرة جلدية تم تمزيق صفحتها العلوية بعجلة.',
        investigationText: 'الصفحة العلوية من المفكرة انتُزعت حديثاً! لكن الصفحة التالية تحتها تحمل انطباعات حادة وكتابة غائرة ضغطها سن القلم بشدة. تحتاج هذه الورقة فحصاً ضوئياً مائلاً في المختبر لكشف محتواها السري.',
        revealsEvidenceId: 'ev-torn-notebook',
        iconType: 'document',
        completedText: 'عُثر على الورقة ذات الكتابة الغائرة المحفورة. بانتظار الفحص الجنائي في المختبر.'
      },
      {
        id: 'hs-amina-window',
        name: 'النافذة الخلفية المطلة على السطح والزقاق',
        category: 'دليل',
        coords: { x: 82, y: 35 },
        description: 'نافذة خشبية تؤدي إلى شرفة صغيرة وسلّم حريق قديم ينحدر نحو زقاق السرايا.',
        investigationText: 'على حافة الإطار الخارجي توجد خيوط صوفية زرقاء داكنة وبقايا قفاز عمل مطاطي محشور بين مسامير الخشب، يبدو أن شخصاً تسلل أو هرب من هذه الشرفة أثناء المطر.',
        revealsEvidenceId: 'ev-blue-glove',
        iconType: 'footprint',
        completedText: 'تم العثور على القفاز الأزرق المشبوه عند إطار النافذة الخلفية.'
      }
    ]
  },
  {
    id: 'loc-cafe',
    title: 'مقهى السرايا',
    subtitle: 'ملتقى أهل الحارة ومركز الأخبار والشائعات',
    type: 'active',
    atmosphere: 'طنين أجهزة الراديو القديمة، صوت كاسات الشاي الساخنة، ونظرات حذرة تتابع كل داخل وخارج.',
    mapCoordinates: { x: 42, y: 68 },
    description: 'مقهى بلدي عتيق يملكه المعلمة هدى. هنا يجلس تجار الحارة وعمالها، وتتردد سلمى الرسامة، كما يقضي حسن العقاد أمسياته واضعاً ساقاً على ساق.',
    visualTheme: {
      ambientColor: 'rgba(214, 138, 45, 0.15)',
      lighting: 'مصابيح سقف صفراء دافئة ودخان المعسل',
      bgPattern: 'cafe',
      bannerIcon: 'Coffee'
    },
    characterIds: ['char-huda', 'char-salma'],
    notes: [
      'هدى تحفظ مواعيد رواد المقهى بالدقيقة.',
      'سلمى تجلس في الركن الهادئ وتبدو قلقة للغاية وترسم أزقة الحارة بتوتر.',
      'حسن العقاد شوهد هنا ليلة الحادث حتى وقت متأخر مدعياً أنه لم يغادر مقعده.'
    ],
    hotspots: [
      {
        id: 'hs-cafe-counter',
        name: 'دفتر حسابات المقهى وطاولة الشاي',
        category: 'ملاحظة',
        coords: { x: 30, y: 55 },
        description: 'مكان وقوف هدى حيث تدير المقهى وتتابع حركة الزبائن في الشارع والزقاق.',
        investigationText: 'دفتر طلبات المقهى ليوم الخميس يُسجل طلب حسن العقاد لشاي كشري في تمام 8:20م، وطلب شاي آخر في 10:15م، مع فجوة زمنية تزيد عن ساعة ونصف بين الطلبين!',
        iconType: 'document'
      },
      {
        id: 'hs-cafe-corner-table',
        name: 'طاولة الركن (مقعد سلمى)',
        category: 'دليل',
        coords: { x: 72, y: 70 },
        description: 'طاولة صغيرة خشبية متوارية خلف عمود المقهى، بجوارها علبة ألوان مائية ودفتر اسكتشات.',
        investigationText: 'على الطاولة إيصال توصيل مطوي بعجلة يحمل تاريخ مساء الواقعة وعنوان بيت أمينة مع توقيع مبدئي.',
        revealsEvidenceId: 'ev-delivery-note',
        iconType: 'document',
        completedText: 'تم تحريز إيصال التوصيل المشبوه المسجل باسم نونو عامل التوصيل.'
      }
    ]
  },
  {
    id: 'loc-workshop',
    title: 'الورشة القديمة',
    subtitle: 'ورشة الخراطة والأقفال والكهرباء التناظرية',
    type: 'active',
    atmosphere: 'رائحة شحم الآلات وبرادة النحاس والحديد، وأدوات ومفاتيح معلقة على جدران رمادية.',
    mapCoordinates: { x: 75, y: 45 },
    description: 'ورشة فادي ميكانيكي الحارة وخبير الأقفال العتيقة ومعدات الصوت. طاولة العمل مكدسة بأسلاك ومفاتيح خام وأجهزة إلكترونية مفككة.',
    visualTheme: {
      ambientColor: 'rgba(80, 90, 85, 0.12)',
      lighting: 'نيون أبيض شاحب مع مصباح طاولة مرن',
      bgPattern: 'workshop',
      bannerIcon: 'Wrench'
    },
    characterIds: ['char-fadi'],
    notes: [
      'فادي قادر على نسخ أي قفل في الحارة خلال دقائق معدودة.',
      'شوهدت سيارة حسن العقاد تقف أمام الورشة قبل يومين من الحادثة.',
      'توجد آثار برادة نحاس حديثة على مبرد الأقفال اليدوي.'
    ],
    hotspots: [
      {
        id: 'hs-workshop-bench',
        name: 'طاولة نسخ المفاتيح وقالب النحاس',
        category: 'دليل',
        coords: { x: 42, y: 58 },
        description: 'ملزمة حديدية مثبتة على الطاولة، حولها برادة نحاس براقة جديدة تشير لصناعة مفتاح قبل ساعات.',
        investigationText: 'فحص مبرد المفاتيح يكشف عن قطعة مفتاح نحاسي مكرر غير مكتمل التطابق، يحمل أسنان كالون بيت أمينة التاريخي ذي الأربع ريشات النادرة!',
        revealsEvidenceId: 'ev-duplicate-key',
        iconType: 'lock',
        completedText: 'تم تحريز المفتاح المكرر المصنوع حديثاً لكالون بيت أمينة.'
      },
      {
        id: 'hs-workshop-tape-rig',
        name: 'منضدة إصلاح المسجلات الصوتية',
        category: 'دليل',
        coords: { x: 78, y: 40 },
        description: 'أشرطة كاسيت مفككة وشريط لاصق مقصص ومقصات دقيقة لتقطيع الأشرطة الممغنطة (Splicing).',
        investigationText: 'على المنضدة شريط كاسيت يحمل ملصقاً مكتوباً عليه بخط اليد: "تسجيل جلسة المقهى - الخميس 8:30م". الفحص الأولي يظهر آثار قص ولصق في الشريط المغناطيسي!',
        revealsEvidenceId: 'ev-cassette-recorder',
        iconType: 'audio',
        completedText: 'تم العثور على شريط الكاسيت المشبوه وجهاز التسجيل المتلاعب به.'
      }
    ]
  },
  {
    id: 'loc-store',
    title: 'دكان العم',
    subtitle: 'دكان البقالة والأمانات على ناصية الحارة',
    type: 'active',
    atmosphere: 'أرفف خشبية محملة بالبضائع والجرائد اليومية وصناديق قديمة، وهدوء يقطعه صوت مروحة سقف بطيئة.',
    mapCoordinates: { x: 25, y: 78 },
    description: 'دكان قديم يديره نونو الفتى النشط الذي يوزع البضائع والرسائل بين أرجاء حي السرايا، ويعرف خبايا الداخلين والخارجين من البيوت.',
    visualTheme: {
      ambientColor: 'rgba(160, 120, 60, 0.1)',
      lighting: 'مصباح معلق مغطى بالورق',
      bgPattern: 'store',
      bannerIcon: 'ShoppingBag'
    },
    characterIds: ['char-nono'],
    notes: [
      'نونو يوصل الطلبات يومياً لبيت أمينة ومكتب حسن العقاد.',
      'يحمل حقيبة قماشية عريضة كانت معه ليلة الحادث.',
      'رأى شخصاً يتسلل عبر الزقاق في حوالي العاشرة إلا ربعاً.'
    ],
    hotspots: [
      {
        id: 'hs-store-crates',
        name: 'صناديق التوصيل وحقيبة البريد',
        category: 'ملاحظة',
        coords: { x: 50, y: 65 },
        description: 'صناديق كرتونية مصفوفة أمام الدكان تحمل بضائع جاهزة للتسليم صباحاً.',
        investigationText: 'فحص صناديق نونو يظهر مظروفاً كبيراً من الورق المقوى الأصفر خُط عليه بخط أمينة: "أمانة سرية خاصة حتى صباح الأحد - لا تُفتح".',
        iconType: 'document'
      },
      {
        id: 'hs-store-newspaper-stack',
        name: 'كومة الصحف المسائية الصادرة ليلة الحادث',
        category: 'وثيقة',
        coords: { x: 75, y: 55 },
        description: 'جرائد مسائية ترصد جدول بث الإذاعة وبرامج مساء الخميس وتوقيت النشرات.',
        investigationText: 'جريدة "المساء": تُظهر أن إذاعة الشرق الأوسط نقلت موجز الأنباء الاستثنائي ليلة الخميس في تمام 10:15م بعد انتهاء برنامج الأغاني، وهو تفصيل محوري لمقارنة شريط التسجيل.',
        iconType: 'document'
      }
    ]
  },
  {
    id: 'loc-alley',
    title: 'زقاق السرايا',
    subtitle: 'الممر الحجري الضيق الرابط بين المقهى وبيت أمينة',
    type: 'active',
    atmosphere: 'ظلام رطب يتخلله ضوء مصباح حائط خافت، وأسلاك كهرباء متدلية بين واجهات المباني القديمة المتلاصقة.',
    mapCoordinates: { x: 62, y: 70 },
    description: 'زقاق مرصوف بالحجر البازلتي الأملس، يصل خلفية المقهى بسلّم الحريق المؤدي لشقة أمينة ومدخل مكتب الوساطة العقارية لحسن العقاد.',
    visualTheme: {
      ambientColor: 'rgba(30, 35, 45, 0.15)',
      lighting: 'مصباح شارع أصفر وحيد وظلال ممتدة',
      bgPattern: 'alley',
      bannerIcon: 'Compass'
    },
    characterIds: ['char-aqqad'],
    notes: [
      'الزقاق يوفر طريقاً خفياً للوصول لشقة أمينة دون المرور من الشارع الرئيسي.',
      'حسن العقاد يتواجد هنا أحياناً يراقب واجهات العقارات بعيون متفحصة.',
      'أرضية الزقاق تحتفظ بآثار أقدام طينية بسبب مطر ليلة الخميس.'
    ],
    hotspots: [
      {
        id: 'hs-alley-fire-escape',
        name: 'قاعدة سلم الهروب الحديدي والمزاريب',
        category: 'أثر جنائي',
        coords: { x: 38, y: 50 },
        description: 'درجات حديدية صدئة تنحدر من شرفة أمينة نحو أرضية الزقاق.',
        investigationText: 'على الطين الرطب أسفل السلم توجد طبعة حذاء إيطالي جلدي ناعم مقاس 43، تختلف تماماً عن أحذية العمال أو حذاء أمينة الرياضي الخفيف.',
        iconType: 'footprint'
      },
      {
        id: 'hs-alley-briefcase',
        name: 'مدخل مكتب العقارات الخلفي (حسن العقاد)',
        category: 'وثيقة',
        coords: { x: 72, y: 65 },
        description: 'باب حديدي صغير يؤدي للمكتب الخلفي للوسيط العقاري حسن العقاد.',
        investigationText: 'في سلة المهملات المعدنية بجانب الباب توجد مسودة عقد شراء عقاري معدلة تحمل طمساً متعمداً وتوقيعاً مزوراً باسم أمينة عبد الخالق تم التراجع عنه لصالح البحث عن "السند الأصلي"!',
        revealsEvidenceId: 'ev-altered-document',
        iconType: 'document',
        completedText: 'تم تحريز مسودة العقد المشبوهة التي تثبت مسعى حسن العقاد للاستيلاء على بيت الوقف.'
      }
    ]
  },
  // Future locked locations for roadmap display
  {
    id: 'loc-river-station',
    title: 'المحطة النهرية',
    subtitle: 'رصيف مراكب النيل وهويس المياه العتيق',
    type: 'locked',
    atmosphere: 'ضباب نهري ليلى وهدير مياه الهويس خلف بوابات الحجز الحديدية.',
    mapCoordinates: { x: 88, y: 20 },
    description: 'محطة المراكب النهرية التي ترسو عندها سفن الشحن الصغيرة القادمة من جنوب الوادي.',
    visualTheme: {
      ambientColor: 'rgba(20, 40, 50, 0.2)',
      lighting: 'أضواء مراكب صفراء شاحبة',
      bgPattern: 'river',
      bannerIcon: 'Anchor'
    },
    characterIds: [],
    hotspots: [],
    notes: ['موقع مرتقب ضمن القضية 05: الجثة في المقطوع.']
  },
  {
    id: 'loc-registry-archive',
    title: 'مكتب توثيق الشهر العقاري',
    subtitle: 'أرشيف دفاتر الملكية والقرارات المساحية',
    type: 'locked',
    atmosphere: 'ممرات طويلة بين خزائن حديدية مصفحة تعود لحقبة مطلع القرن العشرين.',
    mapCoordinates: { x: 82, y: 82 },
    description: 'المكتب الحكومي المخصص لحفظ أصول حجج الأوقاف وسندات التمليك التاريخية للمدينة القديمة.',
    visualTheme: {
      ambientColor: 'rgba(50, 45, 35, 0.2)',
      lighting: 'نيون حكومي أصفر',
      bgPattern: 'archive',
      bannerIcon: 'FolderLock'
    },
    characterIds: [],
    hotspots: [],
    notes: ['موقع مرتقب ضمن القضية 08: ممر البلدية.']
  },
  {
    id: 'loc-abandoned-mill',
    title: 'مطحنة الورق المهجورة',
    subtitle: 'المصنع القديم على أطراف حي السرايا',
    type: 'locked',
    atmosphere: 'آلات خرسانية صامتة وجدران حجرية مكسوة باللبلاب الجاف وخيوط العنكبوت.',
    mapCoordinates: { x: 12, y: 15 },
    description: 'مطحنة ورق تاريخية مهجورة كانت تستخدم قديماً في صناعة الورق المقوى الخاص بالدفاتر الرسمية.',
    visualTheme: {
      ambientColor: 'rgba(40, 35, 30, 0.2)',
      lighting: 'عتمة دامسة',
      bgPattern: 'mill',
      bannerIcon: 'Factory'
    },
    characterIds: [],
    hotspots: [],
    notes: ['موقع مرتقب ضمن القضية 11: الذين لا يعودون.']
  },
  {
    id: 'loc-clinic',
    title: 'مستوصف الحارة',
    subtitle: 'عيادة وصيدلية دكتور رمزي الشعبية',
    type: 'locked',
    atmosphere: 'رائحة مطهرات وشاش طبي وخزانات أدوية زجاجية مصبوغة باللون الأخضر.',
    mapCoordinates: { x: 15, y: 60 },
    description: 'المستوصف الخيري الذي يستقبل مرضى حي السرايا ويسجل تقارير الإصابات الأولية.',
    visualTheme: {
      ambientColor: 'rgba(30, 60, 50, 0.2)',
      lighting: 'أبيض سريري',
      bgPattern: 'clinic',
      bannerIcon: 'Cross'
    },
    characterIds: [],
    hotspots: [],
    notes: ['موقع مرتقب ضمن القضية 09: دفتر الدم.']
  }
];
