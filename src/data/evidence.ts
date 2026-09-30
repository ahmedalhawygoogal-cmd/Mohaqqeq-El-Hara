/**
 * Evidence Registry for "محقق الحارة"
 */

export interface EvidenceItem {
  id: string;
  name: string;
  category: 'وثيقة' | 'أثر مادي' | 'تسجيل صوتي' | 'أداة جريمة';
  locationFound: string;
  locationId: string;
  foundAtStart?: boolean;
  status: 'غير مكتمل' | 'مشبوه' | 'مؤكد';
  shortDescription: string;
  fullDescription: string;
  forensicAnalysis: string;
  connectedCharacterIds: string[];
  connectedLocationIds: string[];
  relatedPuzzleId?: 'puzzle-forensic' | 'puzzle-cassette' | 'puzzle-timeline';
  isDecisiveForAccusation?: boolean;
  iconType: 'document' | 'key' | 'lock' | 'audio' | 'glove' | 'receipt' | 'stamp' | 'blueprint';
  unlockedAtHotspotId?: string;
  deductionKeywords: string[];
}

export const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'ev-broken-lock',
    name: 'القفل المكسور من الداخل',
    category: 'أثر مادي',
    locationFound: 'باب بيت أمينة الخارجي',
    locationId: 'loc-amina-house',
    status: 'مؤكد',
    shortDescription: 'كالون حديدي قديم محطم، وشظايا الخشب متناثرة باتجاه الخارج.',
    fullDescription: 'قفل حديدي ثقيل مثبت على الباب الخشبي لشقة أمينة. أظهرت المعاينة الفاحصة أن ألياف الخشب المكسور مشوهة باتجاه ممر الدرج (الخارج)، مما يثبت بشكل قاطع أن القوة الدافعة أو العتلة استُخدمت من داخل الغرفة وليس من خارجها.',
    forensicAnalysis: 'دليل مادي حاسم: ينفي فرضية الاقتحام الخارجي العنيف العشوائي، ويثبت وجود تمويه متقن نُفذ بأيدي شخص كان متواجداً داخل الغرفة قبل إغلاقها.',
    connectedCharacterIds: ['char-salma', 'char-aqqad'],
    connectedLocationIds: ['loc-amina-house'],
    relatedPuzzleId: 'puzzle-timeline',
    isDecisiveForAccusation: true,
    iconType: 'lock',
    unlockedAtHotspotId: 'hs-amina-door',
    deductionKeywords: ['تمويه داخلي', 'اقتحام مصطنع', 'براءة الكسر الخارجي']
  },
  {
    id: 'ev-torn-notebook',
    name: 'الصفحة الممزقة من المفكرة',
    category: 'وثيقة',
    locationFound: 'مكتب أمينة الخشبي',
    locationId: 'loc-amina-house',
    status: 'غير مكتمل',
    shortDescription: 'دفتر جلدي متبقٍ منه ورقة تحمل آثار ضغط حادة بدون حبر ظاهر.',
    fullDescription: 'مفكرة يوميات جلدية موضوعة على مكتب أمينة. الصفحة العلوية انتُزعت حديثاً بحافة مشرشرة، ولكن الورقة التالية احتفظت بانطباعات دقيقة ضغطها سن قلم الرصاص عند كتابة الملاحظة الأخيرة.',
    forensicAnalysis: 'يتطلب المستند فحصاً جنائياً دقيقاً بزوايا ضوئية مائلة وأدوات تظليل لكشف الكتابة الغائرة المستترة تحت الألياف الورقية.',
    connectedCharacterIds: ['char-salma', 'char-aqqad'],
    connectedLocationIds: ['loc-amina-house', 'loc-office'],
    relatedPuzzleId: 'puzzle-forensic',
    iconType: 'document',
    unlockedAtHotspotId: 'hs-amina-desk',
    deductionKeywords: ['رسالة سرية', 'كتابة غائرة', 'فحص مجهري']
  },
  {
    id: 'ev-indented-writing',
    name: 'الكتابة الغائرة المكتشفة',
    category: 'وثيقة',
    locationFound: 'طاولة الفحص الجنائي بمكتب يونس',
    locationId: 'loc-office',
    status: 'مؤكد',
    shortDescription: 'نص سري تم إظهاره تحت الضوء المائل يكشف موعداً حاسماً.',
    fullDescription: 'بعد تسليط الإضاءة المائلة بزاوية حادة في المختبر، ظهر النص التالي بوضوح تام: "الخميس 9:30 مساءً... حسن العقاد هددني بإلغاء إثبات الملكية إذا لم أسلّم السند. سلمى معي ولديها نسخة من مفتاح الحارة... سأغادر قبل أن يأتوا."',
    forensicAnalysis: 'يثبت هذا الدليل معرفة سلمى الكاملة بنية أمينة، ويوضح سبب وجود سلمى في مسرح الحدث، كما يحدد موعد التهديد الحقيقي الصادر عن حسن العقاد.',
    connectedCharacterIds: ['char-salma', 'char-aqqad'],
    connectedLocationIds: ['loc-amina-house', 'loc-office'],
    relatedPuzzleId: 'puzzle-forensic',
    isDecisiveForAccusation: true,
    iconType: 'document',
    deductionKeywords: ['اعتراف مكتوب', 'تهديد العقاد', 'تحالف سلمى وأمينة']
  },
  {
    id: 'ev-duplicate-key',
    name: 'المفتاح النحاسي المكرر',
    category: 'أداة جريمة',
    locationFound: 'ملزمة الورشة القديمة (فادي)',
    locationId: 'loc-workshop',
    status: 'مشبوه',
    shortDescription: 'نسخة حديثة الصنع تطابق أسنان كالون بيت أمينة الأثري.',
    fullDescription: 'مفتاح نحاسي مطروق يدوياً، تظهر عليه برادة نحاسية لامعة تؤكد أنه صُنع خلال اليومين الماضيين. تصميمه الخاص يطابق بدقة الأربعة ريش النادرة لقفل شقة أمينة.',
    forensicAnalysis: 'يؤكد أن هناك طرفاً امتلك وسيلة دخول مشروعة ظاهرياً إلى الشقة دون الحاجة إلى تكسير الباب، مما يعزز فرضية أن كسر الباب كان خدعة متأخرة!',
    connectedCharacterIds: ['char-fadi', 'char-aqqad'],
    connectedLocationIds: ['loc-workshop', 'loc-amina-house'],
    relatedPuzzleId: 'puzzle-timeline',
    isDecisiveForAccusation: true,
    iconType: 'key',
    unlockedAtHotspotId: 'hs-workshop-bench',
    deductionKeywords: ['مفتاح مصطنع', 'دخول سري', 'تواطؤ الورشة']
  },
  {
    id: 'ev-cassette-recorder',
    name: 'جهاز تسجيل الكاسيت وشريط المقهى',
    category: 'تسجيل صوتي',
    locationFound: 'منضدة الإلكترونيات بالورشة القديمة',
    locationId: 'loc-workshop',
    status: 'مشبوه',
    shortDescription: 'شريط كاسيت يحمل ملصق "جلسة المقهى - الخميس 8:30م".',
    fullDescription: 'شريط تسجيل صوتي ممغنط طراز كاسيت 60 دقيقة. يحوي تسجيلاً لأصوات مقهى السرايا وأغنية لأم كلثوم مع حوار يدعي حسن العقاد أنه كان يديره وقت الحادثة لإثبات براءته.',
    forensicAnalysis: 'الفحص الميكانيكي للشريط يظهر شقوقاً دقيقة وآثار لصق مغناطيسي (Tape Splicing)، مما يرجح إعادة ترتيب المقاطع الصوتية بصورة مفتعلة لتلفيق حجة غياب.',
    connectedCharacterIds: ['char-fadi', 'char-aqqad', 'char-huda'],
    connectedLocationIds: ['loc-workshop', 'loc-cafe', 'loc-office'],
    relatedPuzzleId: 'puzzle-cassette',
    iconType: 'audio',
    unlockedAtHotspotId: 'hs-workshop-tape-rig',
    deductionKeywords: ['تسجيل مشبوه', 'مونتاج تناظري', 'حجة غياب مفتعلة']
  },
  {
    id: 'ev-cassette-timeline',
    name: 'التناقض الزمني في شريط الكاسيت',
    category: 'تسجيل صوتي',
    locationFound: 'وحدة الفحص الصوتي بمكتب يونس',
    locationId: 'loc-office',
    status: 'مؤكد',
    shortDescription: 'نشرة أخبار العاشرة والربع تسبق مقطع الثامنة والنصف في التسجيل!',
    fullDescription: 'عند تدقيق خلفية التسجيل ومقارنة البث، يسمع المحقق صوت مذيع إذاعة الشرق الأوسط وهو يعلن موجز أخبار الساعة 10:15م الاستثنائي بالتزامن مع صوت كؤوس الشاي، بينما يزعم حسن أن هذا المقطع سُجل في 8:30م! كما تدق ساعة كنيسة مار جرجس المجاورة 10 دقات واضحة في الخلفية.',
    forensicAnalysis: 'برهان جنائي دامغ ينسف حجة غياب حسن العقاد، ويثبت أنه قام بدبلجة الشريط بالتعاون مع فادي للتغطية على غيابه بين 9:35م و 10:10م.',
    connectedCharacterIds: ['char-aqqad', 'char-fadi', 'char-huda'],
    connectedLocationIds: ['loc-cafe', 'loc-workshop'],
    relatedPuzzleId: 'puzzle-cassette',
    isDecisiveForAccusation: true,
    iconType: 'audio',
    deductionKeywords: ['سقوط حجة الغياب', 'تزييف التوقيت', 'التسجيل المدبلج']
  },
  {
    id: 'ev-blue-glove',
    name: 'القفاز الأزرق المشبوه',
    category: 'أثر مادي',
    locationFound: 'شرفة بيت أمينة وسلّم الحريق',
    locationId: 'loc-amina-house',
    status: 'مشبوه',
    shortDescription: 'فردة قفاز مطاطي أزرق ملوثة بآثار ألوان زيتية وشظايا خشب.',
    fullDescription: 'قفاز عمل مطاطي سميك لونه أزرق بترولي عُثر عليه عالقاً بين مسامير إطار الشرفة المطلة على سلم الحريق الخلفي. يحمل لطخات من لون أزرق بروسي (Prussian Blue) يشبه أصباغ ورش الرسم.',
    forensicAnalysis: 'التحليل المخبري يربط القفاز بأدوات مرسم سلمى، مما يؤكد أنها كانت حاضرة في الغرفة وشاركت في العملية التي تمت قبل مغادرة أمينة.',
    connectedCharacterIds: ['char-salma'],
    connectedLocationIds: ['loc-amina-house', 'loc-cafe'],
    relatedPuzzleId: 'puzzle-timeline',
    iconType: 'glove',
    unlockedAtHotspotId: 'hs-amina-window',
    deductionKeywords: ['أثر الرسامة', 'سلم الحريق', 'مشاركة سلمى']
  },
  {
    id: 'ev-delivery-note',
    name: 'إيصال التوصيل الخاص بنونو',
    category: 'وثيقة',
    locationFound: 'طاولة ركن مقهى السرايا',
    locationId: 'loc-cafe',
    status: 'مؤكد',
    shortDescription: 'إيصال تسليم طرد صادر من أمينة وموجه لدكان العم.',
    fullDescription: 'وصل استلام ورقي مؤرخ بساعة مبكرة من مساء الخميس (8:45م)، يفيد بتسليم صندوق مغلق بالأختام الشمعية من أمينة إلى فتى التوصيل نونو ليودعه أمانة مغلقة في الدكان.',
    forensicAnalysis: 'يثبت هذا الوصل أن أمينة لم تُفاجأ بالسرقة، بل خططت مسبقاً لتأمين وثائقها الحقيقية ونقلها خارج البيت قبل وقوع أي اعتداء.',
    connectedCharacterIds: ['char-nono', 'char-salma'],
    connectedLocationIds: ['loc-cafe', 'loc-store'],
    relatedPuzzleId: 'puzzle-timeline',
    iconType: 'receipt',
    unlockedAtHotspotId: 'hs-cafe-corner-table',
    deductionKeywords: ['أمانة الدكان', 'تهريب الوثائق', 'تدبير مسبق']
  },
  {
    id: 'ev-altered-document',
    name: 'مسودة السند العقاري المعدل',
    category: 'وثيقة',
    locationFound: 'مدخل مكتب الوساطة الخلفي لحسن العقاد',
    locationId: 'loc-alley',
    status: 'مؤكد',
    shortDescription: 'عقد استيلاء غير مكتمل يحمل توقيعاً مقلداً ومحو كيميائي.',
    fullDescription: 'أوراق رسمية تابعة للشهر العقاري مسحوبة من سلة مهملات حسن العقاد، تتضمن تعديلاً في حدود بيت أمينة التراثي لإدخاله ضمن مشروع هدم وتطوير تجاري، مع ملاحظة جانبية بخط العقاد: "لا يمكن التوثيق بدون السند الأصلي المختوم سنة 1928".',
    forensicAnalysis: 'دليل الدافع الرئيسي: يثبت مصلحة حسن العقاد المباشرة والقصوى في الاستيلاء على السند الأصلي مهما كلف الأمر لتنفيذ صفقته الكبرى.',
    connectedCharacterIds: ['char-aqqad'],
    connectedLocationIds: ['loc-alley'],
    relatedPuzzleId: 'puzzle-timeline',
    isDecisiveForAccusation: true,
    iconType: 'stamp',
    unlockedAtHotspotId: 'hs-alley-briefcase',
    deductionKeywords: ['الدافع المالي', 'مشروع الهدم', 'تزوير العقود']
  },
  {
    id: 'ev-original-deed',
    name: 'سند الملكية الأصلي (المحمي)',
    category: 'وثيقة',
    locationFound: 'صندوق الأمانات السري بدكان العم',
    locationId: 'loc-store',
    status: 'مؤكد',
    shortDescription: 'الحجة التاريخية الأصلية لبيت السرايا بختم المحكمة الشرعية.',
    fullDescription: 'حجة شرعية تاريخية كبرى مذهبة ومكتوبة بخط الثلث العثماني، تعود لعام 1928 تثبت ملكية عائلة أمينة الخالصة لبيت السرايا وتمنع هدمه أو بيعه لأغراض المضاربة العقارية.',
    forensicAnalysis: 'وجود السند سالماً في حوزة نونو يثبت أن السند الذي سرقه حسن العقاد من الخزنة ليلة الاقتحام لم يكن سوى نسخة مكررة غير معتمدة!',
    connectedCharacterIds: ['char-nono', 'char-salma', 'char-aqqad'],
    connectedLocationIds: ['loc-store'],
    relatedPuzzleId: 'puzzle-timeline',
    isDecisiveForAccusation: true,
    iconType: 'document',
    deductionKeywords: ['السند الحقيقي', 'فشل السرقة', 'نجاة الإرث']
  }
];
