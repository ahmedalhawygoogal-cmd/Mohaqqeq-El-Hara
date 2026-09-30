/**
 * Case Registry for "محقق الحارة"
 */

export interface CaseData {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  synopsis: string;
  status: 'active' | 'locked';
  difficulty: 'متوسط' | 'صعب' | 'شديد التعقيد';
  estimatedTime: string;
  primaryLocation: string;
  victimOrSubject: string;
  dateStr: string;
  briefing: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    keyQuestions: string[];
  };
}

export const CASES: CaseData[] = [
  {
    id: 'case-01',
    code: 'CASE 01',
    title: 'الغرفة المقفولة',
    subtitle: 'اختفاء أمينة وسرقة سند الملكية الأصلي',
    synopsis: 'في ليلة ماطرة بحي السرايا العتيق، يُعثر على باب بيت أمينة مخلوعاً وغرفتها مبعثرة وسند الملكية التاريخي مفقوداً، بينما اختفت هي دون أثر. الشواهد الأولى تشير لاقتحام عنيف، لكن شظايا الخشب تحكي رواية أخرى.',
    status: 'active',
    difficulty: 'صعب',
    estimatedTime: '25-35 دقيقة',
    primaryLocation: 'بيت أمينة - حارة السرايا',
    victimOrSubject: 'أمينة عبد الخالق (معلمة وتملك وقف العائلة)',
    dateStr: 'ليلة الخميس - 14 أكتوبر 1994',
    briefing: {
      title: 'تقرير البلاغ الأولي - مكتب المحقق يونس',
      paragraph1: 'في تمام الساعة الحادية عشرة والنصف ليلاً، أبلغت هدى صاحبة المقهى عن ضجة وتكسير في الطابق العلوي لبيت أمينة المطل على الزقاق. عند وصولي، كان قفل الباب الحديدي محطماً ومبعثراً على الأرض، والغرفة الداخلية مقلوبة رأساً على عقب، وخزنة الحائط الخشبية مفتوحة بالكامل.',
      paragraph2: 'سند الملكية الأصلي لبيت السرايا—وهو العقار الأثمن في الحارة الذي تسعى عدة أطراف لشرائه وهدمه—قد اختفى. الأغرب أن أمينة نفسها لم تكن موجودة. الأهالي يعتقدون أن لصوصاً اقتحموا البيت واختطفوها، لكن طريقة كسر القفل وطبيعة الشظايا توحي بأن شيئاً ما زُيِّف في هذا المكان.',
      keyQuestions: [
        'هل كُسر باب الغرفة فعلاً من الخارج أم أن الاقتحام كان تمويهاً صُمم من الداخل؟',
        'ماذا كانت تخطط أمينة قبل اختفائها وما الرسالة السرية المكتوبة في مفكرتها؟',
        'كيف وصل الفاعل إلى الخزنة، وما حقيقة شريط الكاسيت الذي يقدّمه حسن العقاد كحجة غياب؟',
        'أين سند الملكية الأصلي الآن، وما السر الذي يخفيه الشهود في مقهى وورشة الحارة؟'
      ]
    }
  },
  {
    id: 'case-02',
    code: 'CASE 02',
    title: 'ليلة في المخزن',
    subtitle: 'شحنة الأدوية المغشوشة ومخزن البلدية',
    synopsis: 'حارس المستودع يُعثر عليه مقيداً وسط شحنة بدائل كيميائية مريبة، وخيوط التحقيق تمتد إلى دفاتر مستوصف الحارة.',
    status: 'locked',
    difficulty: 'متوسط',
    estimatedTime: '30 دقيقة',
    primaryLocation: 'مخزن البلدية',
    victimOrSubject: 'المعلم صابر',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة ضمن أرشيف محقق الحارة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-03',
    code: 'CASE 03',
    title: 'الحريق الذي لم يبدأ',
    subtitle: 'رماد مشبوه في ورشة النجارة',
    synopsis: 'رائحة كيروسين وفتيل لم يكتمل اشتعاله يثيران ريبة يونس قبل احتراق وثائق الوقف.',
    status: 'locked',
    difficulty: 'متوسط',
    estimatedTime: '30 دقيقة',
    primaryLocation: 'الورشة القديمة',
    victimOrSubject: 'ورشة المعلم رجب',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-04',
    code: 'CASE 04',
    title: 'الشاهد الذي غير صوته',
    subtitle: 'مكالمة هاتفية غامضة من كابينة الزقاق',
    synopsis: 'شاهد مجهول يبلغ عن جريمة قبل وقوعها بنصف ساعة، وتسجيل صوتي مشوه في بدالة الهاتف القديمة.',
    status: 'locked',
    difficulty: 'صعب',
    estimatedTime: '40 دقيقة',
    primaryLocation: 'كابينة هاتف الحارة',
    victimOrSubject: 'مجهول',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-05',
    code: 'CASE 05',
    title: 'الجثة في المقطوع',
    subtitle: 'ظلال الليل على الهويس النهري',
    synopsis: 'ملاّح نهري يكتشف سترة طافية تحمل أوراق مساحة نادرة تخص توسعة كورنيش النيل القديم.',
    status: 'locked',
    difficulty: 'شديد التعقيد',
    estimatedTime: '45 دقيقة',
    primaryLocation: 'المحطة النهرية',
    victimOrSubject: 'مهندس المساحة الإقليمي',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-06',
    code: 'CASE 06',
    title: 'بيت بال ورثة',
    subtitle: 'الوصية المقسمة بين خمسة إخوة أعداء',
    synopsis: 'تنازع على قصر عتيق ينتهي بتمزيق الصفحة الأخيرة من وصية الأب الممهورة بالختم العثماني.',
    status: 'locked',
    difficulty: 'صعب',
    estimatedTime: '35 دقيقة',
    primaryLocation: 'قصر الورثة',
    victimOrSubject: 'عائلة الألفي',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-07',
    code: 'CASE 07',
    title: 'سبع دقائق في المحطة',
    subtitle: 'حقيبة بديلة على رصيف قطار الصعيد',
    synopsis: 'تبادل حقائب مظلم يستغرق سبع دقائق أثناء توقف قطار البضائع، ومفتاح خزانة أمانات رقم 42.',
    status: 'locked',
    difficulty: 'متوسط',
    estimatedTime: '30 دقيقة',
    primaryLocation: 'محطة القطار القديمة',
    victimOrSubject: 'ساعي البريد',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-08',
    code: 'CASE 08',
    title: 'ممر البلدية',
    subtitle: 'تزوير سجلات الشهر العقاري الملحق',
    synopsis: 'موظف أرشيف البلدية يختفي وتختفي معه صفحات دفاتر العقود من عام 1978.',
    status: 'locked',
    difficulty: 'صعب',
    estimatedTime: '40 دقيقة',
    primaryLocation: 'أرشيف البلدية',
    victimOrSubject: 'عادل موظف السجلات',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-09',
    code: 'CASE 09',
    title: 'دفتر الدم',
    subtitle: 'مذكرات صيدلي الحارة المسمومة',
    synopsis: 'وصفة علاجية لم تُصرف تُعثر عليها ملطخة بحبر كيماوي نادر في درك المستوصف.',
    status: 'locked',
    difficulty: 'شديد التعقيد',
    estimatedTime: '45 دقيقة',
    primaryLocation: 'مستوصف الحارة',
    victimOrSubject: 'دكتور رمزي',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-10',
    code: 'CASE 10',
    title: 'آخر شاهد',
    subtitle: 'بائع الصحف الذي رأى كل شيء وصمت',
    synopsis: 'رجل مسن اعتاد الجلوس على رأس الزقاق يغلق كشكه فجأة بعد ليلة العاصفة دون تفسير.',
    status: 'locked',
    difficulty: 'صعب',
    estimatedTime: '35 دقيقة',
    primaryLocation: 'دكان العم يونس',
    victimOrSubject: 'العم يونس الكبير',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  },
  {
    id: 'case-11',
    code: 'CASE 11',
    title: 'الذين لا يعودون',
    subtitle: 'غرفة الأرشيف السرية تحت الهويس',
    synopsis: 'أنفاق الري التاريخية المنسية تكشف عن مؤامرة تمتد لعقود عبر تجار العقارات ونافذين في المدينة.',
    status: 'locked',
    difficulty: 'شديد التعقيد',
    estimatedTime: '50 دقيقة',
    primaryLocation: 'أنفاق الهويس القديم',
    victimOrSubject: 'شبكة السرايا',
    dateStr: 'ملف مغلق مؤقتاً',
    briefing: {
      title: 'ملف القضية القادمة',
      paragraph1: 'قضية قادمة.',
      paragraph2: 'لم يتم فتح هذا الملف الجنائي بعد.',
      keyQuestions: []
    }
  }
];
