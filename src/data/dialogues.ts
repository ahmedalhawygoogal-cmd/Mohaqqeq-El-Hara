/**
 * Dialogue Registry for "محقق الحارة"
 */

export interface DialogueChoice {
  id: string;
  text: string;
  requiredEvidenceId?: string; // Only visible or unlocked if player holds this evidence
  requiredKnowledgeFlag?: string; // Prerequisite dialogue flag
  leadsToNodeId: string;
  trustImpact?: number; // Changes witness trust score
  suspicionImpact?: number; // Changes suspect suspicion
  unlocksEvidenceId?: string; // Directly gives or reveals an evidence item
  setsFlag?: string;
  tone?: 'هادئ' | 'محاصر' | 'استدراج' | 'مواجهة حاسمة';
}

export interface DialogueNode {
  id: string;
  speaker: string;
  characterId: string;
  mood: 'طبيعي' | 'متردد' | 'غاضب' | 'مذعور' | 'متعجرف' | 'معترف';
  speech: string;
  choices: DialogueChoice[];
  contradictionAlert?: string; // Flashes when witness trips on facts
  unlocksEvidenceId?: string;
}

export interface CharacterDialogueTree {
  characterId: string;
  initialNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export const DIALOGUES: Record<string, CharacterDialogueTree> = {
  // 1. Salma at the Café
  'char-salma': {
    characterId: 'char-salma',
    initialNodeId: 'salma-root',
    nodes: {
      'salma-root': {
        id: 'salma-root',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'متردد',
        speech: 'أهلاً يا محقق يونس... الحارة كلها مقلوبة منذ الصباح. أرجوك قل لي، هل وجدتم أي أثر لأمينة؟ قلبي لا يطمئن أبداً.',
        choices: [
          {
            id: 'c-salma-1',
            text: 'أين كنتِ بالتحديد مساء الخميس بين الثامنة والحادية عشرة ليلاً؟',
            leadsToNodeId: 'salma-alibi-claim',
            tone: 'هادئ'
          },
          {
            id: 'c-salma-2',
            text: 'هل تحدثتِ مع أمينة قبل الحادثة؟ بدت وكأنها كانت تتوقع مكروهاً.',
            leadsToNodeId: 'salma-talk-before',
            tone: 'استدراج'
          },
          {
            id: 'c-salma-show-glove',
            text: 'وجدنا هذا القفاز الأزرق ملوثاً بألوان زيتية في شرفة أمينة... هل يبدو مألوفاً لكِ؟',
            requiredEvidenceId: 'ev-blue-glove',
            leadsToNodeId: 'salma-confront-glove',
            tone: 'مواجهة حاسمة',
            trustImpact: -10,
            setsFlag: 'salma_glove_confronted'
          },
          {
            id: 'c-salma-show-indent',
            text: 'فحصنا ورقة المفكرة بالضوء المائل: أمينة كتبت نصاً صريحاً أنكِ كنتِ معها ولديكِ مفتاح الحارة!',
            requiredEvidenceId: 'ev-indented-writing',
            leadsToNodeId: 'salma-full-confession',
            tone: 'مواجهة حاسمة',
            setsFlag: 'salma_fully_confessed'
          }
        ]
      },
      'salma-alibi-claim': {
        id: 'salma-alibi-claim',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'طبيعي',
        speech: 'كنت هنا في مقهى السرايا... أرسم بالفرشاة اسطح الزقاق. المعلمة هدى يمكنها أن تشهد أنني لم أتحرك من مقعدي إلا لدقائق معدودة لغسل الفرشاة.',
        choices: [
          {
            id: 'c-salma-doubt-alibi',
            text: 'هدى ذكرت أنكِ اختفيتِ لأكثر من نصف ساعة وقت العاصفة المطرية.',
            leadsToNodeId: 'salma-defensive',
            tone: 'محاصر',
            trustImpact: -5
          },
          {
            id: 'c-salma-back-1',
            text: 'دعيني أسألك عن شيء آخر.',
            leadsToNodeId: 'salma-root',
            tone: 'هادئ'
          }
        ]
      },
      'salma-defensive': {
        id: 'salma-defensive',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'مذعور',
        speech: 'ذهبت فقط لإحضار أنابيب ألوان زيتية إضافية من بيتي الملاصق لبيت أمينة! لماذا تطاردني بهذه الأسئلة يا يونس؟ لست أنا من يريد هدم الحارة ولا من يطارد أمينة بالعقود المزورة!',
        contradictionAlert: 'تناقض واضح: تذكرت فجأة خروجها بعد أن ادعت عدم مغادرة مقعدها!',
        choices: [
          {
            id: 'c-salma-who-harassed',
            text: 'من كان يطارد أمينة بالعقود المزورة؟ سمّي الأشياء بأسمائها يا سلمى!',
            leadsToNodeId: 'salma-blame-aqqad',
            tone: 'محاصر',
            setsFlag: 'knows_aqqad_harassment'
          },
          {
            id: 'c-salma-back-2',
            text: 'حسناً، لنهدأ ونتحدث بعقلانية.',
            leadsToNodeId: 'salma-root',
            tone: 'هادئ'
          }
        ]
      },
      'salma-blame-aqqad': {
        id: 'salma-blame-aqqad',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'غاضب',
        speech: 'حسن العقاد! ذلك الثعبان ذو البدلة الإيطالية! جاءها ثلاث مرات هذا الأسبوع ومعه مسودات مشبوهة، وكان يهددها بنزع يدها عن الوقف التاريخي. أمينة كانت مرتعبة وقالت لي إنها لن تسمح له بوضع يده على السند الأصلي مهما كلف الثمن!',
        choices: [
          {
            id: 'c-salma-where-deed',
            text: 'وأين السند الأصلي الآن؟',
            leadsToNodeId: 'salma-hint-store',
            tone: 'استدراج'
          },
          {
            id: 'c-salma-back-3',
            text: 'سأتحقق من أمر العقاد.',
            leadsToNodeId: 'salma-root',
            tone: 'هادئ'
          }
        ]
      },
      'salma-hint-store': {
        id: 'salma-hint-store',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'متردد',
        speech: 'أمينة ذكية جداً... لم تترك السند الحقيقي في الخزنة حين شعرت بالخطر. اسأل نونو في دكان العم، هو الصندوق الأسود لكل أمانات الحارة.',
        choices: [
          {
            id: 'c-salma-back-4',
            text: 'معلومة قيّمة يا سلمى. شكراً لكِ.',
            leadsToNodeId: 'salma-root',
            tone: 'هادئ',
            trustImpact: 10
          }
        ]
      },
      'salma-confront-glove': {
        id: 'salma-confront-glove',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'مذعور',
        speech: '(تتلعثم وتخفي يديها)... هذا... هذا قفازي نعم! لكنني لم أسرق شيئاً! أقسم لك يا يونس، أمينة صديقة طفولتي، كيف أؤذيها؟',
        choices: [
          {
            id: 'c-salma-press-glove',
            text: 'ماذا كنتِ تفعلين عند نافذة شرفتها في تلك الليلة الماطرة؟',
            leadsToNodeId: 'salma-half-truth',
            tone: 'محاصر'
          }
        ]
      },
      'salma-half-truth': {
        id: 'salma-half-truth',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'متردد',
        speech: 'كنت أساعدها على توضيب حقيبتها الصغيرة... أخبرتني أنها ستغادر الحارة إلى مكان آمن عند أقاربها في القناطر ريثما تُبطل مناورات العقاد القضائية. غادرتْ هي عبر السطح وأنا نزلت عبر سلم الزقاق.',
        choices: [
          {
            id: 'c-salma-who-broke-door',
            text: 'ومن كسر قفل الباب من الداخل إلى الخارج؟ لا تكذبي، الخشب مكسور من الداخل!',
            requiredEvidenceId: 'ev-broken-lock',
            leadsToNodeId: 'salma-break-door-admission',
            tone: 'مواجهة حاسمة'
          }
        ]
      },
      'salma-break-door-admission': {
        id: 'salma-break-door-admission',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'معترف',
        speech: '(تبكي بحرقة)... أنا من فعلت ذلك يا يونس! ضربت القفل بماسورة حديدية من الداخل قبل أن أنزل من الشرفة! أمينة طلبت مني ذلك لكي يظن الجميع أن لصوصاً مجهولين هاجموا البيت، فيتشتت العقاد وتكسب هي وقتاً للوصول للقناطر بأمان!',
        choices: [
          {
            id: 'c-salma-finish-confess',
            text: 'والسند الذي سرقه العقاد إذن؟',
            leadsToNodeId: 'salma-full-confession',
            tone: 'هادئ'
          }
        ]
      },
      'salma-full-confession': {
        id: 'salma-full-confession',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'معترف',
        speech: 'أمينة وضعت نسخة طبق الأصل من السند في الخزنة، وتركتها طعماً لمن يقتحم البيت، بينما السند الشرعي الحقيقي أودعته في أمانة مختومة عند نونو! العقاد حصل على المفتاح من فادي واقتحم بعد خروجنا وسرق النسخة ظناً منه أنها الأصل! أرجوك يا يونس، احمِ أمينة والحارة من بطش هذا الرجل!',
        choices: [
          {
            id: 'c-salma-calm-her',
            text: 'اطمئني يا سلمى، الحقائق باتت مكتملة أمامي الآن وسأضع حداً للعقاد.',
            leadsToNodeId: 'salma-root',
            tone: 'هادئ',
            trustImpact: 25
          }
        ]
      },
      'salma-talk-before': {
        id: 'salma-talk-before',
        speaker: 'سلمى',
        characterId: 'char-salma',
        mood: 'طبيعي',
        speech: 'كانت متوترة جداً... قالت لي إن رجلاً مجهولاً كان يراقب نوافذ بيتها بالمناظير، وأنها سمعت أصوات خطوات على السلم الخشبي ليلاً.',
        choices: [
          {
            id: 'c-salma-back-5',
            text: 'فهمت. سأواصل البحث.',
            leadsToNodeId: 'salma-root',
            tone: 'هادئ'
          }
        ]
      }
    }
  },

  // 2. Fadi at the Workshop
  'char-fadi': {
    characterId: 'char-fadi',
    initialNodeId: 'fadi-root',
    nodes: {
      'fadi-root': {
        id: 'fadi-root',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'طبيعي',
        speech: 'يا هلا يا سي يونس. ورشتي ورشة شرف، أصلح المسجلات وأخرط قطع الغيار. إن كان عندك جهاز عطلان فمرحباً بك.',
        choices: [
          {
            id: 'c-fadi-ask-locks',
            text: 'هل صنعت مؤخراً أي مفاتيح خاصة لأقفال قديمة ذات أربع ريش؟',
            leadsToNodeId: 'fadi-deny-key',
            tone: 'استدراج'
          },
          {
            id: 'c-fadi-show-key',
            text: 'هذا المفتاح النحاسي المنسوخ وجدناه على ملزمتك وبرادة النحاس ما تزال دافئة!',
            requiredEvidenceId: 'ev-duplicate-key',
            leadsToNodeId: 'fadi-confront-key',
            tone: 'مواجهة حاسمة',
            suspicionImpact: 20
          },
          {
            id: 'c-fadi-show-tape',
            text: 'شريط الكاسيت هذا عليه آثار تقطيع ولصق احترافي لا يتقنه في الحارة إلا أنت!',
            requiredEvidenceId: 'ev-cassette-recorder',
            leadsToNodeId: 'fadi-confront-tape',
            tone: 'مواجهة حاسمة',
            suspicionImpact: 25
          },
          {
            id: 'c-fadi-general',
            text: 'ماذا رأيت ليلة الخميس في الزقاق الخلفي؟',
            leadsToNodeId: 'fadi-general-statement',
            tone: 'هادئ'
          }
        ]
      },
      'fadi-deny-key': {
        id: 'fadi-deny-key',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'متردد',
        speech: 'أنا؟ لا والله، معظم شغلي مفاتيح شقق عادية وسيارات نقل. الأقفال القديمة نادرة وما حدش بيطلبها إلا بالاسم.',
        choices: [
          {
            id: 'c-fadi-back-1',
            text: 'حسناً، سألقي نظرة على طاولة عملك بنفسي.',
            leadsToNodeId: 'fadi-root',
            tone: 'هادئ'
          }
        ]
      },
      'fadi-confront-key': {
        id: 'fadi-confront-key',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'مذعور',
        speech: '(يبتلع ريقه بارتباك)... اسمعني يا يونس، أنا مجرد صنايعي بأكل عيش! جاءني حسن العقاد قبل ثلاثة أيام ومعه بصمة شمعية لقفل كالون وقال إنه فقد مفتاح شقة مستأجر عنده ويريد نسخة سريعة ودفع لي 500 جنيه نقداً!',
        contradictionAlert: 'اعتراف بتصنيع المفتاح المكرر لحسن العقاد بمقابل مالي!',
        choices: [
          {
            id: 'c-fadi-press-key-deal',
            text: 'وهل أعطيته المفتاح ليلة الخميس؟',
            leadsToNodeId: 'fadi-key-delivery-time',
            tone: 'محاصر'
          }
        ]
      },
      'fadi-key-delivery-time': {
        id: 'fadi-key-delivery-time',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'معترف',
        speech: 'نعم... مرّ عليّ العقاد في الثامنة والنصف مساءً وهو في طريقه للمقهى وأخذ النسخة النهائية ووضعها في جيب سترته الداخلية وقال لي بالحرف: "انسى أنك شفتني النهاردة"!',
        choices: [
          {
            id: 'c-fadi-what-about-tape',
            text: 'وما قصة شريط الكاسيت إذن؟',
            leadsToNodeId: 'fadi-tape-full-truth',
            tone: 'محاصر'
          },
          {
            id: 'c-fadi-back-2',
            text: 'اعترافك هذا قد ينجيك من تهمة الشروع في السرقة يا فادي.',
            leadsToNodeId: 'fadi-root',
            tone: 'هادئ'
          }
        ]
      },
      'fadi-confront-tape': {
        id: 'fadi-confront-tape',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'مذعور',
        speech: 'الشريط؟... أرجوك يا يونس، لا تورطني مع النيابة! العقاد أحضر مسجل صوت صغير كان قد وضعه على طاولة المقهى يسجل الراديو وضجيج الزبائن، وطلب مني قص مقطع نشرة الأخبار وتركيبه بطريقة معينة ليثبت أنه كان جالساً في المقهى طوال الوقت!',
        choices: [
          {
            id: 'c-fadi-tape-truth-unlock',
            text: 'كيف قمت بالتلاعب بالتسجيل بالضبط؟',
            leadsToNodeId: 'fadi-tape-full-truth',
            tone: 'محاصر'
          }
        ]
      },
      'fadi-tape-full-truth': {
        id: 'fadi-tape-full-truth',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'معترف',
        speech: 'قصصت شريط أغنية أم كلثوم التي أذيعت في العاشرة ووضعتها في موضع الثامنة والنصف، وكررت صوت أكواب الشاي! لكنني ارتكبت خطأ غير مقصود... صوت دقات ساعة الكنيسة ونشرة الأخبار الاستثنائية تداخل مع صوت الموسيقى! من يفحص الشريط بمكبر ترددات سيكتشف التزوير فوراً!',
        unlocksEvidenceId: 'ev-cassette-timeline',
        choices: [
          {
            id: 'c-fadi-back-3',
            text: 'هذا ما أردت سماعه بالضبط.',
            leadsToNodeId: 'fadi-root',
            tone: 'هادئ',
            trustImpact: 20
          }
        ]
      },
      'fadi-general-statement': {
        id: 'fadi-general-statement',
        speaker: 'فادي',
        characterId: 'char-fadi',
        mood: 'طبيعي',
        speech: 'كان الجو ممطراً والرعد يدوي بين الحين والآخر. شفت سيارة بيجو كحلية تركن قرب المصباح، وسمعت خبط حديد في الزقاق حوالي العاشرة إلا ربعاً.',
        choices: [
          {
            id: 'c-fadi-back-4',
            text: 'شكراً يا فادي.',
            leadsToNodeId: 'fadi-root',
            tone: 'هادئ'
          }
        ]
      }
    }
  },

  // 3. Huda at the Café
  'char-huda': {
    characterId: 'char-huda',
    initialNodeId: 'huda-root',
    nodes: {
      'huda-root': {
        id: 'huda-root',
        speaker: 'المعلمة هدى',
        characterId: 'char-huda',
        mood: 'طبيعي',
        speech: 'شرفت يا سي يونس... تشرب شاي مظبوط في الخمسينة؟ الحارة قلبي واكلني عليها من ليلة الخميس المشؤومة دي.',
        choices: [
          {
            id: 'c-huda-ask-aqqad-movements',
            text: 'يا معلمة هدى، متى جاء حسن العقاد المقهى ومتى غادر بالتحديد؟',
            leadsToNodeId: 'huda-timeline-aqqad',
            tone: 'هادئ'
          },
          {
            id: 'c-huda-ask-salma-movements',
            text: 'وسلمى الرسامة، هل كانت هنا طوال الأمسية كما تدعي؟',
            leadsToNodeId: 'huda-timeline-salma',
            tone: 'هادئ'
          },
          {
            id: 'c-huda-radio-broadcast',
            text: 'هل تذكرين متى أذيعت نشرة الأخبار الاستثنائية على راديو المقهى تلك الليلة؟',
            leadsToNodeId: 'huda-radio-detail',
            tone: 'استدراج'
          }
        ]
      },
      'huda-timeline-aqqad': {
        id: 'huda-timeline-aqqad',
        speaker: 'المعلمة هدى',
        characterId: 'char-huda',
        mood: 'غاضب',
        speech: 'حسن العقاد دخل عندي الساعة 8:20م، قعد في الصالة الخارجية وطلب شاي، وكان حاطط جهاز كاسيت صغير على الطاولة. في تمام 9:30م قام يدخل الممر وقال إنه رايح الحمام... غاب فوق 45 دقيقة ورجع في 10:15م وشه أصفر وجزمته مليانة طين ومطر!',
        contradictionAlert: 'شهادة حاسمة تسقط ادعاء العقاد بالجلوس المستمر في المقهى!',
        choices: [
          {
            id: 'c-huda-did-he-carry-anything',
            text: 'هل كان يحمل أي شيء حين عاد للمقهى؟',
            leadsToNodeId: 'huda-aqqad-envelope',
            tone: 'محاصر'
          },
          {
            id: 'c-huda-back-1',
            text: 'هذا يطابق الفجوة الزمنية المسجلة في دفتر الحسابات.',
            leadsToNodeId: 'huda-root',
            tone: 'هادئ'
          }
        ]
      },
      'huda-aqqad-envelope': {
        id: 'huda-aqqad-envelope',
        speaker: 'المعلمة هدى',
        characterId: 'char-huda',
        mood: 'طبيعي',
        speech: 'نعم! كان حاطط تحت باطه ملف كرتوني أزرق عليه شمع أحمر، وطلب شاي على عجل وكان بيبص في ساعته كل ثانية وكأنه مستني حد يصرخ في الحارة!',
        choices: [
          {
            id: 'c-huda-back-2',
            text: 'الملف الكرتوني هو غلاف سند الملكية الأصلي المسروق!',
            leadsToNodeId: 'huda-root',
            tone: 'مواجهة حاسمة'
          }
        ]
      },
      'huda-timeline-salma': {
        id: 'huda-timeline-salma',
        speaker: 'المعلمة هدى',
        characterId: 'char-huda',
        mood: 'طبيعي',
        speech: 'سلمى غلبانة وبتحب أمينة زي أختها... قعدت ترسم، بس في حدود التسعة والربع قامت مضطربة جداً ومسكت شنطتها وخرجت في اتجاه بيت أمينة، ورجعت المقهى قبل العشرة بشوية ويديها كانت بترتعش.',
        choices: [
          {
            id: 'c-huda-back-3',
            text: 'هذا يفسر وجود القفاز الأزرق في مسرح الواقعة.',
            leadsToNodeId: 'huda-root',
            tone: 'هادئ'
          }
        ]
      },
      'huda-radio-detail': {
        id: 'huda-radio-detail',
        speaker: 'المعلمة هدى',
        characterId: 'char-huda',
        mood: 'طبيعي',
        speech: 'طبعاً فاكرة! الراديو كان شغّال على إذاعة الشرق الأوسط، والمذيع قطع البرنامج في تمام 10:15م ليعلن عن أمطار وسيول في طريق الصعيد الزراعي. وقتها كان حسن العقاد راجع يقعد على كرسيه وبيشرب الشاي التاني.',
        choices: [
          {
            id: 'c-huda-back-4',
            text: 'ممتاز! هذا يثبت التناقض الزمني في شريط الكاسيت المزيف.',
            leadsToNodeId: 'huda-root',
            tone: 'هادئ'
          }
        ]
      }
    }
  },

  // 4. Hassan Al-Aqqad at the Alley or Office
  'char-aqqad': {
    characterId: 'char-aqqad',
    initialNodeId: 'aqqad-root',
    nodes: {
      'aqqad-root': {
        id: 'aqqad-root',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'متعجرف',
        speech: 'أهلاً يا محقق يونس... ما زلت تضيع وقتك في أزقة الحارة؟ سمعت عن حادثة بيت أمينة، سرقة مؤسفة حقاً في حي عشوائي مليء باللصوص.',
        choices: [
          {
            id: 'c-aqqad-ask-alibi',
            text: 'ما هي حجة غيابك ليلة الخميس بين التاسعة والعاشرة والنصف ليلاً؟',
            leadsToNodeId: 'aqqad-claim-cafe',
            tone: 'هادئ'
          },
          {
            id: 'c-aqqad-confront-deed',
            text: 'عثرنا في سلة مهملاتك على مسودة تعديل لحدود بيت أمينة بالشهر العقاري!',
            requiredEvidenceId: 'ev-altered-document',
            leadsToNodeId: 'aqqad-defend-contract',
            tone: 'محاصر',
            suspicionImpact: 20
          },
          {
            id: 'c-aqqad-confront-key',
            text: 'فادي اعترف بصناعة مفتاح نحاسي مكرر لكالون بيت أمينة بأمرك وبمقابل مالي!',
            requiredEvidenceId: 'ev-duplicate-key',
            leadsToNodeId: 'aqqad-deny-fadi',
            tone: 'مواجهة حاسمة',
            suspicionImpact: 30
          },
          {
            id: 'c-aqqad-confront-tape-break',
            text: 'شريط الكاسيت الذي تقدمه كدليل تم فصحه: نشرة العاشرة والربع ركبت قبل موعدها وساعة الكنيسة كشفت دبلجتك!',
            requiredEvidenceId: 'ev-cassette-timeline',
            leadsToNodeId: 'aqqad-breakdown',
            tone: 'مواجهة حاسمة',
            suspicionImpact: 40
          }
        ]
      },
      'aqqad-claim-cafe': {
        id: 'aqqad-claim-cafe',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'متعجرف',
        speech: 'حجة غيابي حديدية يا حضرة المحقق! قضيت الأمسية كاملة في مقهى السرايا بين الناس، ولأنني رجل أعمال يحب توثيق يومياته، كان مسجل الكاسيت يسجل الجلسة والموسيقى كاملة! اسأل من تشاء.',
        choices: [
          {
            id: 'c-aqqad-huda-contradict',
            text: 'هدى شهدت بأنك اختفيت لأكثر من 45 دقيقة ورجعت بحذاء طيني وملف تحت إبطك!',
            leadsToNodeId: 'aqqad-explain-mud',
            tone: 'محاصر'
          },
          {
            id: 'c-aqqad-back-1',
            text: 'سنفحص هذا التسجيل بدقة يا سيد عقاد.',
            leadsToNodeId: 'aqqad-root',
            tone: 'هادئ'
          }
        ]
      },
      'aqqad-explain-mud': {
        id: 'aqqad-explain-mud',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'غاضب',
        speech: 'هدى امرأة عجوز تخرف! دخلت إلى الحمام في مؤخرة الممر، وحذائي تلطخ بماء المزراب! هل أصبح دخول الحمام جريمة تستوجب استجواب المحققين؟',
        contradictionAlert: 'ارتباك وغضب حاد عند ذكر غيابه ومداسه الطيني!',
        choices: [
          {
            id: 'c-aqqad-back-2',
            text: 'الطين كان من الزقاق ومزراب شرفة أمينة، وليس من حمام المقهى.',
            leadsToNodeId: 'aqqad-root',
            tone: 'محاصر'
          }
        ]
      },
      'aqqad-defend-contract': {
        id: 'aqqad-defend-contract',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'متعجرف',
        speech: 'تلك مسودة عرض استثماري مشروع! المستثمرون يريدون إقامة مركز تجاري حديث ينعش الحارة. كنت أحاول مساعدة أمينة بتقديم عرض مالي ضخم، والمسودة كانت مجرد دراسة جدوى عقارية مهملة.',
        choices: [
          {
            id: 'c-aqqad-back-3',
            text: 'دراسة جدوى عليها توقيع مزور بخط يدك؟ سنرى رأي النيابة في ذلك.',
            leadsToNodeId: 'aqqad-root',
            tone: 'محاصر'
          }
        ]
      },
      'aqqad-deny-fadi': {
        id: 'aqqad-deny-fadi',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'غاضب',
        speech: 'فادي؟ ذلك الميكانيكي الحافي يرمي بلاويه عليّ ليداري سرقاته؟! سأرفع عليه دعوى تشهير وبلاغ كاذب! أنا لم أطلب منه مفتاحاً لأي بيت في الحارة!',
        contradictionAlert: 'إنكار كاذب بالرغم من مطابقة البصمة والشهادة المادية.',
        choices: [
          {
            id: 'c-aqqad-back-4',
            text: 'فادي احتفظ بالبصمة الشمعية وأقواله مثبتة يا عقاد.',
            leadsToNodeId: 'aqqad-root',
            tone: 'محاصر'
          }
        ]
      },
      'aqqad-breakdown': {
        id: 'aqqad-breakdown',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'مذعور',
        speech: '(شاحب الوجه وتتساقط قطرات العرق على جبينه)... أنت... كيف فككت الشريط؟! اسمعني يا يونس، أمينة لم تكن هناك حين دخلت! الشقة كانت خالية بالفعل والباب كان مهشماً من الداخل! أنا فقط أخذت الملف من الخزنة المفتوحة! هذا حقي، الأرض يجب أن تُباع ولا تبقى رهينة وقف ميت منذ سبعين سنة!',
        contradictionAlert: 'اعتراف كامل بالدخول والاستيلاء على ملف الملكية من الخزنة!',
        choices: [
          {
            id: 'c-aqqad-truth-bomb',
            text: 'الملف الذي سرقته كان مجرد صورة بديلة طعماً لك... السند الأصلي محفوظ في يد العدالة!',
            leadsToNodeId: 'aqqad-final-defeat',
            tone: 'مواجهة حاسمة'
          }
        ]
      },
      'aqqad-final-defeat': {
        id: 'aqqad-final-defeat',
        speaker: 'حسن العقاد',
        characterId: 'char-aqqad',
        mood: 'معترف',
        speech: 'ماذا؟! مستحيل... خدعتني تلك الرسامة وأمينة؟! لقد دمرتم كل شيء... كل ملايين الصفقة تبخرت في ليلة واحدة!',
        choices: [
          {
            id: 'c-aqqad-conclude',
            text: 'انتهت اللعبة يا حسن. جهز نفسك للمحاكمة.',
            leadsToNodeId: 'aqqad-root',
            tone: 'هادئ'
          }
        ]
      }
    }
  },

  // 5. Nono at the Store
  'char-nono': {
    characterId: 'char-nono',
    initialNodeId: 'nono-root',
    nodes: {
      'nono-root': {
        id: 'nono-root',
        speaker: 'نونو',
        characterId: 'char-nono',
        mood: 'طبيعي',
        speech: 'أهلاً يا سي يونس... تؤمرني بأي طلبية أوصلها؟ الحارة بتغلي والكل بيتكلم عن بيت الست أمينة.',
        choices: [
          {
            id: 'c-nono-ask-box',
            text: 'رأينا إيصال تسليم باسمك في مقهى السرايا... ماذا سلمتك أمينة ليلة الخميس؟',
            requiredEvidenceId: 'ev-delivery-note',
            leadsToNodeId: 'nono-reveal-safe-box',
            tone: 'استدراج'
          },
          {
            id: 'c-nono-ask-movement',
            text: 'من رأيته يمر في الزقاق الخلفي وقت العاصفة؟',
            leadsToNodeId: 'nono-saw-aqqad',
            tone: 'هادئ'
          }
        ]
      },
      'nono-reveal-safe-box': {
        id: 'nono-reveal-safe-box',
        speaker: 'نونو',
        characterId: 'char-nono',
        mood: 'معترف',
        speech: 'الست أمينة مؤدبة وبتعطف عليّ دايماً... نادتني المغرب وقالت لي: "يا نونو، خد المظروف ده وخبيه في قاع صندوق أمانات الدكان، وما تديهوش لأي مخلوق إلا لو جالك المحقق يونس شخصياً". وها هو المظروف يا سي يونس!',
        unlocksEvidenceId: 'ev-original-deed',
        choices: [
          {
            id: 'c-nono-take-deed',
            text: 'بارك الله في أمانتك يا نونو. لقد أنقذت تاريخ الحارة بالكامل!',
            leadsToNodeId: 'nono-root',
            tone: 'هادئ',
            trustImpact: 20
          }
        ]
      },
      'nono-saw-aqqad': {
        id: 'nono-saw-aqqad',
        speaker: 'نونو',
        characterId: 'char-nono',
        mood: 'طبيعي',
        speech: 'شفت الأستاذ حسن العقاد طالع سلّم الحريق الخلفي لبيت أمينة حوالي الساعة عشرة إلا ربع، وكان بيتسحب بخفة ومعه مصباح قلم صغير، وبعد ربع ساعة نزل يجري وعبايته تحت باطه ملف كبير!',
        choices: [
          {
            id: 'c-nono-back-1',
            text: 'شهادة في منتهى الأهمية يا نونو.',
            leadsToNodeId: 'nono-root',
            tone: 'هادئ'
          }
        ]
      }
    }
  }
};
