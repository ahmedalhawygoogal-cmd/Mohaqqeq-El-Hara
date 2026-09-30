/**
 * Characters Registry for "محقق الحارة"
 * Dignified typographic character dossiers with no avatar/cartoon figures.
 */

export interface CharacterData {
  id: string;
  name: string;
  role: string;
  dossierCode: string; // e.g. "شاهد-01 / الجمالية"
  status: 'active' | 'future';
  locationId: string;
  portraitUrl?: string;
  tagline: string;
  description: string;
  personality: string;
  suspicionLevel: 'منخفض' | 'متوسط' | 'مرتفع' | 'رئيسي';
  initialTrust: number; // 0-100
  alibi: string;
  knownSecrets: string[];
  evidenceReactions: Record<string, string>; // Evidence ID -> Dialogue snippet or reaction
}

export const CHARACTERS: CharacterData[] = [
  {
    id: 'char-younes',
    name: 'المحقق يونس',
    role: 'المحقق الجنائي المستقل — محقق الحارة',
    dossierCode: 'محقق-01 / ملف القضية',
    status: 'active',
    locationId: 'loc-office',
    portraitUrl: '/src/assets/images/portrait_younes_1790756516169.jpg',
    tagline: '«كل دليل له حكاية... والأزقة لا تنسى من عبرها.»',
    description: 'محقق هادئ وصارم وحاد الملاحظة، نشأ في أزقة القاهرة القديمة ويعرف عائلاتها وطباعها. يعتمد على المنطق الاستدلالي والفحص الجنائي الدقيق للأشياء الصامتة.',
    personality: 'هادئ، صارم، متأمل، يبحث عن الدليل المادي الصامت قبل تصديق الكلمات المنطوقة.',
    suspicionLevel: 'منخفض',
    initialTrust: 100,
    alibi: 'كان في مكتبه يراجع ملفات الأرشيف حتى جاءه بلاغ الحادثة في 11:30 مساءً.',
    knownSecrets: [
      'يعرف تاريخ ملكية بيت أمينة وأهميته التراثية للحارة بأكملها.'
    ],
    evidenceReactions: {}
  },
  {
    id: 'char-salma',
    name: 'سلمى',
    role: 'رسامة تشكيلية وشاهدة أساسية (صديقة أمينة المقربة)',
    dossierCode: 'شاهد-02 / حي السرايا',
    status: 'active',
    locationId: 'loc-cafe',
    portraitUrl: '/src/assets/images/portrait_salma_1790756452176.jpg',
    tagline: '«أمينة لم تكن خائفة من اللصوص... كانت خائفة ممن يرتدون ربطات العنق!»',
    description: 'فنانة شابة تسكن بجوار أمينة، تقضي ساعات طويلة ترسم تفاصيل عمارة الحارة وزوايا مقهى السرايا. تتحدث بحذر وتبدو متوترة عند سؤالها عن موعد ليلة الحادث.',
    personality: 'عاطفية، وفية لأمينة لدرجة التضحية، ولكنها ترتبك بسرعة عند مواجهتها بالحقائق المادية.',
    suspicionLevel: 'متوسط',
    initialTrust: 65,
    alibi: 'تدعي أنها كانت ترسم في مقهى السرايا طوال المساء منذ الثامنة والنصف وحتى الحادية عشرة.',
    knownSecrets: [
      'ساعدت أمينة على التسلل ليلاً لحمايتها من تهديدات حسن العقاد.',
      'ارتدت قفازاً أزرق وكسرت قفل الباب من الداخل لإرباك حسن وتأخير ملاحقته لأمينة!'
    ],
    evidenceReactions: {
      'ev-blue-glove': 'ترتبك وتخفي يديها تحت الطاولة حين ترى القفاز الأزرق المشبوه.',
      'ev-indented-writing': 'تتسع عيناها ذهولاً عند قراءة عبارة المفكرة: "سلمى معي ولديها مفتاح الحارة... سأغادر قبل أن يأتوا."',
      'ev-broken-lock': 'تصمت للحظة عندما تدرك أنك كشفت حقيقة كسر القفل من الداخل.'
    }
  },
  {
    id: 'char-fadi',
    name: 'فادي',
    role: 'خبير الأقفال والميكانيكا وهندسة الصوت التناظرية',
    dossierCode: 'شاهد-03 / الورشة الحرفية',
    status: 'active',
    locationId: 'loc-workshop',
    portraitUrl: '/src/assets/images/portrait_fadi_1790756466917.jpg',
    tagline: '«كل قفل وله ثغرة... وكل شريط ممكن ينقص ويتركب من جديد!»',
    description: 'شاب في الثلاثينيات ذو أصابع خشنة ودقة متناهية. يدير ورشة الخراطة والأقفال. يتقاضى أموالاً لإصلاح الأجهزة ونسخ المفاتيح القديمة دون أن يسأل زبائنه عن التفاصيل.',
    personality: 'عملي، متردد، يخشى الوقوع في المشاكل مع الشرطة أو مع كبار المنطقة.',
    suspicionLevel: 'مرتفع',
    initialTrust: 40,
    alibi: 'يدعي أنه كان يعمل في ورشته حتى منتصف الليل لإصلاح مسجلات الراديو.',
    knownSecrets: [
      'صنع مفتاحاً مكرراً لكالون بيت أمينة بعد أن أحضر له حسن العقاد قالباً شمعياً.',
      'قام بتقطيع ومونتاج شريط الكاسيت لحسن العقاد ليبدو كأنه تسجيل مستمر للمقهى.'
    ],
    evidenceReactions: {
      'ev-duplicate-key': 'يتراجع للخلف ويسقط مبرد المفاتيح من يده عند رؤية المفتاح النحاسي المنسوخ.',
      'ev-cassette-recorder': 'يعترف بضيق أنه استلم الشريط وقام بعمل مونتاج صوتي بطلب خاص ومدفوع الثمن.'
    }
  },
  {
    id: 'char-huda',
    name: 'المعلمة هدى',
    role: 'صاحبة مقهى السرايا وذاكرة الحارة الحية',
    dossierCode: 'شاهد-04 / مقهى السرايا',
    status: 'active',
    locationId: 'loc-cafe',
    portraitUrl: '/src/assets/images/portrait_huda_1790756478090.jpg',
    tagline: '«اللي ما يشوفش من الغربال في قهوة السرايا... يبقى أعمى!»',
    description: 'سيدة خمسينية حكيمة ومهابة الجانب. تجلس على كرسي خيزران عريض تتابع حركة الزقاق وتعرف مواعيد كل شخص وحركاته بدقة متناهية.',
    personality: 'صريحة، ذات هيبة، تكره المراوغة، حريصة على أمان الحارة وأهلها.',
    suspicionLevel: 'منخفض',
    initialTrust: 80,
    alibi: 'تدير المقهى أمام عشرات الشهود طوال المساء دون انقطاع.',
    knownSecrets: [
      'شاهدت حسن العقاد يتسلل للزقاق الخلفي الساعة 9:35م ويعود مضطرباً بعد العاشرة.',
      'تتذكر أن نشرة الأخبار أذيعت في العاشرة والربع بينما كان حسن يدعي أنه يسمع أم كلثوم.'
    ],
    evidenceReactions: {
      'ev-cassette-recorder': 'تضحك بتهكم: "شريط تسجيل؟ حسن كان خارج المقهى في الزقاق وقتها يا سي يونس!"',
      'ev-delivery-note': 'تؤكد أن نونو كان يحمل أمانة خاصة من أمينة قبل أن يختفي أثرها.'
    }
  },
  {
    id: 'char-nono',
    name: 'نونو',
    role: 'فتى التوصيل وخدمات الدكان',
    dossierCode: 'شاهد-05 / دكان الأمانات',
    status: 'active',
    locationId: 'loc-store',
    portraitUrl: '/src/assets/images/portrait_nono_1790756491051.jpg',
    tagline: '«أنا بوصل الطلبات وأمشي في حالي... بس عيني بتلقط كل حاجة.»',
    description: 'شاب صغير نحيل وخفيف الحركة، يركب دراجة عتيقة بصندوق خشبي أمامي. موثوق لدى بيوت الحارة ومكلف بتوصيل الأمانات والطرود الحساسة.',
    personality: 'خائف، حذر، لكنه يتحدث بأمانة إذا شعر بالأمان والثقة مع المحقق.',
    suspicionLevel: 'منخفض',
    initialTrust: 70,
    alibi: 'كان يوزع طلبات البقالة حتى العاشرة مساءً، ثم قام بتسليم طرد خاص.',
    knownSecrets: [
      'أمينة سلمته حقيبة أوراقها الشخصية وسند الملكية الاحتياطي لإخفائه في دكان العم.',
      'رأى رجلاً ببدلة أنيقة يتسلل إلى سلم حريق بيت أمينة في تمام العاشرة إلا ربعاً.'
    ],
    evidenceReactions: {
      'ev-delivery-note': 'يرتعش صوته ثم يعترف: "الست أمينة طلبت مني أحفظ المظروف وما أسلّمهوش إلا للمحقق يونس!"',
      'ev-blue-glove': 'يؤكد أنه رأى سلمى تلبس قفازات عمل مماثلة أثناء مساعدتها لأمينة في نقل اللوحات.'
    }
  },
  {
    id: 'char-aqqad',
    name: 'حسن العقاد',
    role: 'الوسيط العقاري ورجل الأعمال الطامح (المشتبه به الرئيسي)',
    dossierCode: 'مشتبه-01 / مكتب الاستثمار',
    status: 'active',
    locationId: 'loc-alley',
    portraitUrl: '/src/assets/images/portrait_aqqad_1790756502328.jpg',
    tagline: '«العقارات هي لغة العصر يا أستاذ يونس... والورق القديم لا يوقف قطار الاستثمار.»',
    description: 'رجل أعمال أنيق المظهر يرتدي بدلة رمادية فاخرة وحذاء إيطالياً براقاً. يدير مكتب استثمارات عقارية ويحاول منذ شهور إقناع أمينة ببيع بيت السرايا لمستثمر خارجي.',
    personality: 'واثق من نفسه، مراوغ، ذو نبرة متغطرسة، يتظاهر بالقانونية والهدوء عند الاستجواب.',
    suspicionLevel: 'رئيسي',
    initialTrust: 25,
    alibi: 'يدعي أنه قضى ليلته بالكامل في مقهى السرايا يستمع لأغاني الراديو ولديه تسجيل كاسيت للجلسة.',
    knownSecrets: [
      'طلب من فادي صنع نسخة مفتاح بعد أن رفضت أمينة بيع البيت.',
      'اقتحم الغرفة في 9:40م فوجدها خالية واستولى على سند الملكية الأصلي من الخزنة المفتوحة.',
      'زور مسودة توكيل عقاري تمهيداً لتقديمها إلى الشهر العقاري.'
    ],
    evidenceReactions: {
      'ev-duplicate-key': 'يتغير لون وجهه ويحاول التملص مدعياً أن فادي يكذب أو يتجنى عليه.',
      'ev-cassette-timeline': 'يرتبك بشدة عندما تواجهه بالتناقض الزمني في شريط الكاسيت ونشرة 10:15م.',
      'ev-original-deed': 'يفقد رباطة جأشه تماماً حين يعلم أن السند الحقيقي لم يكن الذي سرقه بل نسخة مودعة بأمانة!'
    }
  },
  // Future locked characters for roadmap showcase
  {
    id: 'char-ragab',
    name: 'المعلم رجب',
    role: 'صاحب ورش النجارة القديمة',
    dossierCode: 'شاهد-06 / الورشة',
    status: 'future',
    locationId: 'loc-workshop',
    tagline: 'شاهد في القضية 03: الحريق الذي لم يبدأ.',
    description: 'شخصية قادمة في قضايا الموسم.',
    personality: 'صارم ومحارب.',
    suspicionLevel: 'متوسط',
    initialTrust: 50,
    alibi: 'غير متاح حالياً.',
    knownSecrets: [],
    evidenceReactions: {}
  },
  {
    id: 'char-hazem',
    name: 'الضابط حازم',
    role: 'مفتش مباحث قسم الجمالية',
    dossierCode: 'رسمي-02 / القسم',
    status: 'future',
    locationId: 'loc-office',
    tagline: 'رجل القانون الحذر في قضايا الموسم.',
    description: 'شخصية قادمة.',
    personality: 'نظامي ومتحفظ.',
    suspicionLevel: 'منخفض',
    initialTrust: 60,
    alibi: 'غير متاح حالياً.',
    knownSecrets: [],
    evidenceReactions: {}
  }
];
