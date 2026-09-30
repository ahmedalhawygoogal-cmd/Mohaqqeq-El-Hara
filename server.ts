/**
 * Express Server for "محقق الحارة"
 * Integrates Gemini API via @google/genai SDK for free-form character interrogation.
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Character persona definitions for realistic Egyptian noir roleplay
const CHARACTER_PERSONAS: Record<string, {
  name: string;
  role: string;
  dialect: string;
  background: string;
  hiddenTruth: string;
  coreFear: string;
}> = {
  'char-younes': {
    name: 'المحقق يونس',
    role: 'المحقق الجنائي المستقل — محقق الحارة',
    dialect: 'مصرية رصينة، هادئة، تجمع بين حكمة ابن البلد ودقة المحقق الجنائي المتمرس.',
    background: 'محقق ابن البلد، هدفه كشف الحقيقة وحماية أهالي حي السرايا وتراثه من أطماع سماسرة العقارات.',
    hiddenTruth: 'يعلم أن كل دليل مادي صامت يحمل حكاية لا تكذب.',
    coreFear: 'أن يفلت الجاني الحقيقي أو يُظلم بريء.'
  },
  'char-salma': {
    name: 'سلمى',
    role: 'رسامة تشكيلية وشاهدة أساسية وصديقة أمينة',
    dialect: 'مصرية قاهرية هادئة وحذرة، تظهر توتراً عند محاصرتها وتدافع بشدة عن أمينة.',
    background: 'صديقة أمينة المقربة. ساعدتها على الهرب لحمايتها من تهديد حسن العقاد. ارتدت قفازاً أزرق وكسرت قفل الباب من الداخل لإرباك العقاد وتأخير ملاحقته لأمينة.',
    hiddenTruth: 'تعرف أن السند الأصلي ليس في البيت، بل أودعته أمينة في صندوق أمانات دكان العم مع نونو.',
    coreFear: 'تخشى أن يُكتشف مخبأ أمينة في القناطر، أو أن تُتهم بالسرقة بسبب القفاز وكسر الباب.'
  },
  'char-fadi': {
    name: 'فادي',
    role: 'خبير الأقفال والميكانيكا وهندسة الصوت بالورشة',
    dialect: 'مصرية حِرَفية واقعية ومترددة، يحاول التملص من المسؤولية إذا شعر بالخطر الجنائي.',
    background: 'صنع نسخة مفتاح نحاسية لكالون بيت أمينة بأمر من حسن العقاد بمقابل 500 جنيه. كما قام بعمل مونتاج ودبلجة لشريط الكاسيت لإخفاء غياب العقاد أثناء الجريمة.',
    hiddenTruth: 'يحتفظ ببرادة النحاس وبقايا الشريط اللاصق في الورشة، ويعلم أن تسجيل نشرة الأخبار كان مفبركاً.',
    coreFear: 'يخشى السجن بتهمة الشروع في السرقة وتزوير الأدلة الجنائية.'
  },
  'char-huda': {
    name: 'المعلمة هدى',
    role: 'صاحبة مقهى السرايا وذاكرة الحارة',
    dialect: 'مصرية شعبية بلدية ذات هيبة وقوة، كلامها صريح ومباشر ولا تخشى أحداً.',
    background: 'تدير مقهى السرايا وتعرف مواعيد كل زبون بالدقيقة. رأت حسن العقاد يغادر المقهى في 9:30م ويعود في 10:15م بحذاء ملوث بالطين.',
    hiddenTruth: 'تعلم أن نشرة الأخبار الاستثنائية أذيعت في 10:15م، وأن غياب العقاد يطابق وقت كسر واقتحام بيت أمينة.',
    coreFear: 'حريصة على أمان الحارة وشرفها، وتكره محاولات هدم العقارات التراثية.'
  },
  'char-nono': {
    name: 'نونو',
    role: 'فتى التوصيل وخدمات الدكان',
    dialect: 'مصرية شعبية شابة ومهذبة، صوته يعكس القلق والأمانة.',
    background: 'أودعت أمينة لديه صندوق الأمانات الشمعي المحتوي على سند الملكية الأصلي لعام 1928، وأمرته بعدم تسليمه إلا للمحقق يونس شخصياً. شاهد العقاد يتسلل للزقاق.',
    hiddenTruth: 'السند الشرعي الحقيقي سليم ومخبأ في قاع صندوق البضائع بدكان العم.',
    coreFear: 'يخاف من بطش حسن العقاد ورجاله إذا علموا أنه يحمل السند الحقيقي.'
  },
  'char-aqqad': {
    name: 'حسن العقاد',
    role: 'الوسيط العقاري ورجل الأعمال الطامح (المشتبه به الرئيسي)',
    dialect: 'مصرية راقية متغطرسة ومراوغة، يستخدم مصطلحات الاستثمار والقانون، وسريع الغضب عند محاصرته بالأدلة.',
    background: 'خطط للاستيلاء على بيت الوقف لهدمه. اشترى مفتاحاً مكرراً من فادي، واقتحم الشقة في 9:40م وسرق الملف من الخزنة المفتوحة، ودبلج شريط الكاسيت مع فادي لتلفيق حجة غياب.',
    hiddenTruth: 'لا يعلم في البداية أن الملف الذي سرقه لم يكن سوى نسخة مكررة وليس السند الأصلي الشرعي!',
    coreFear: 'يخشى كشف التناقض الزمني في شريط الكاسيت، ومسودة العقد المزور، والقبض عليه وسقوط صفقة الملايين.'
  },
  'char-ragab': {
    name: 'المعلم رجب',
    role: 'نجار الورشة القديمة وصديق فادي',
    dialect: 'مصرية شعبية متزنة ووقورة.',
    background: 'يعمل في الورشة ويشهد على تردد حسن العقاد وساعات عمل فادي المتأخرة.',
    hiddenTruth: 'رأى فادي ينسخ مفاتيح مشبوهة بعد منتصف الليل.',
    coreFear: 'أن تتأثر سمعة الورشة بالجرائم.'
  },
  'char-hazem': {
    name: 'الضابط حازم',
    role: 'مفتش المباحث',
    dialect: 'مصرية نظامية حازمة.',
    background: 'يراقب الحارة وينتظر الأدلة المادية الحاسمة قبل القبض على العقاد.',
    hiddenTruth: 'لديه بلاغات سابقة ضد العقاد في قضايا عقود مشبوهة.',
    coreFear: 'أن يهرب العقاد خارج البلاد قبل صدور أمر النيابة.'
  }
};

// API Route for multi-turn character interrogation
app.post('/api/chat', async (req: Request, res: Response) => {
  const { 
    characterId = 'char-salma', 
    message = '', 
    conversationHistory = [], 
    trustLevel = 50, 
    suspicionLevel = 30,
    collectedEvidenceIds = []
  } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.json({ reply: 'تفضل يا سي يونس، أنا سامعك... قل لي بتسأل عن إيه بالتحديد؟' });
  }

  // Fallback to a default persona if not found
  const persona = CHARACTER_PERSONAS[characterId] || {
    name: 'أحد أهالي الحارة',
    role: 'شاهد من حي السرايا',
    dialect: 'مصرية شعبية حذرة وودودة.',
    background: 'من سكان حي السرايا العتيق.',
    hiddenTruth: 'يعلم أن ليلة الحادث كانت مليئة بالتحركات المريبة في الزقاق.',
    coreFear: 'المشاكل والشرطة.'
  };

  const systemInstruction = `
أنت تلعب دور شخصية "${persona.name}" (${persona.role}) في لعبة تحقيق جنائية تفاعلية تدور في حي السرايا العتيق بالقاهرة عام 1994 بعنوان "محقق الحارة".
أنت تتحدث باللهجة المصرية الطبيعية الأصيلة الملائمة لشخصيتك.
صفاتك وخلفيتك:
- اللهجة والأسلوب: ${persona.dialect}
- خلفيتك وسرك: ${persona.background}
- الحقيقة التي تعرفها: ${persona.hiddenTruth}
- نقطة ضعفك ومخاوفك: ${persona.coreFear}

محددات التفاعل الحالية مع المحقق يونس:
- مستوى ثقتك في المحقق حالياً: ${trustLevel}%
- مستوى الشبهة أو الحصار الجنائي عليك: ${suspicionLevel}%
- الأدلة التي يحملها المحقق يونس حالياً: ${JSON.stringify(collectedEvidenceIds)}

قواعد الأداء:
1. لا تعترف بكل شيء مباشرة! تصرّف كإنسان حقيقي يحمي نفسه أو أصدقاءه.
2. إذا كانت ثقتك عالية (>70%)، كن أكثر تعاوناً وأفصح عن تفاصيل وتلميحات هامة.
3. إذا كانت الريبة عالية جداً (>75%) أو حاصرك المحقق بأدلة قاطعة، ارتبك وتناقض أو اعترف بالضغط.
4. إذا كنت حسن العقاد، تصرف بغطرسة وتحدث عن الاستثمار والقانون وحجة غيابك في المقهى، ولا تنهار إلا إذا واجهك بشريط الكاسيت أو المفتاح.
5. حافظ على إجابات واقعية وموجزة ومثيرة للاهتمام (بين 2 إلى 4 جمل عادة).
`;

  try {
    if (genAI) {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const turn of conversationHistory) {
        contents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 250,
        }
      });

      const replyText = response.text || '...';
      return res.json({ reply: replyText });
    } else {
      const replyText = generateLocalInCharacterReply(characterId, message, trustLevel, suspicionLevel);
      return res.json({ reply: replyText });
    }
  } catch (error) {
    console.error('Gemini API interrogation error:', error);
    const replyText = generateLocalInCharacterReply(characterId, message, trustLevel, suspicionLevel);
    return res.json({ reply: replyText });
  }
});

function generateLocalInCharacterReply(
  characterId: string, 
  userText: string, 
  trust: number, 
  suspicion: number
): string {
  const lower = userText.toLowerCase();

  if (characterId === 'char-salma') {
    if (lower.includes('قفاز') || lower.includes('شرفة') || lower.includes('أزرق')) {
      return 'أرجوك يا سي يونس... القفاز ده بتاعي نعم، بس والله ما قصدت أضر أمينة، كنت بساعدها تخرج من الشباك قبل ما العقاد ورجالته يوصلوا!';
    }
    if (lower.includes('سند') || lower.includes('عقد') || lower.includes('أمانة')) {
      return 'أمينة كانت حريصة جداً، وما سابتش السند الأصلي في البيت... اسأل نونو في دكان العم، هو اللي استلم الأمانة المغلقة.';
    }
    if (trust > 70) {
      return 'أنا واثقة فيك يا يونس... أمينة في مكان آمن في القناطر الخيرية، والباب كسرناه من جوة عشان العقاد يفتكر إن في لصوص سبقوه!';
    }
    return 'يا محقق يونس، أنا على أعصابي من الصبح... قل لي بس، هل لقيتوا أي خيط يوصلنا لأمينة؟';
  }

  if (characterId === 'char-fadi') {
    if (lower.includes('مفتاح') || lower.includes('كالون') || lower.includes('نحاس')) {
      return 'يا سي يونس، أنا مجرد صنايعي! العقاد جاب لي بصمة شمع ودفع لي 500 جنيه وقال ده مفتاح شقته... والله ما كنت أعرف إنه ناوي على سرقة!';
    }
    if (lower.includes('كاسيت') || lower.includes('شريط') || lower.includes('راديو')) {
      return 'الشريط هو اللي طلبه مني! قصيت حتة من نشرة الأخبار وركبتها، بس دقات جرس الكنيسة فضلت في الخلفية وكشفت التوقيت الحقيقي!';
    }
    return 'ورشتي مفتوحة للكل يا سي يونس، وأنا راجل على باب الله وبصلح أجهزة وماليش في المشاكل.';
  }

  if (characterId === 'char-huda') {
    if (lower.includes('عقاد') || lower.includes('مقهى') || lower.includes('شاي')) {
      return 'حسن العقاد قعد هنا من 8:20، بس اختفى في الزقاق أكتر من 45 دقيقة ورجع في 10:15 وجزمته مليانة طين وشايل ملف أزرق!';
    }
    return 'يا يونس يا ابني، قهوة السرايا عينها ما بتنامش... اللي شفته ليلة الخميس إن في حركة مش مظبوطة كانت بتحصل في الزقاق الخلفي.';
  }

  if (characterId === 'char-nono') {
    if (lower.includes('أمانة') || lower.includes('مظروف') || lower.includes('صندوق') || lower.includes('سند')) {
      return 'الست أمينة سلّمتني الصندوق وقالت لي: "يا نونو، ده شرف الحارة كلها، ما تسلمهوش إلا للمحقق يونس لما يطلب السند بنفسه"! وها هو الصندوق بالأختام الشمعية يا سي يونس.';
    }
    return 'أنا بوصل الطلبيات في الحارة وعيني بتلقط كل حاجة... وشفت العقاد طالع سلم الحريق ليلة المطر ومعه كشاف قلم.';
  }

  if (characterId === 'char-aqqad') {
    if (lower.includes('مفتاح') || lower.includes('سرقة') || lower.includes('تزوير')) {
      return 'كلامك ده اتهام باطل لا أساس له من الصحة! أنا رجل أعمال محترم وسأقاضي كل من يمس سمعتي الاستثمارية!';
    }
    if (lower.includes('كاسيت') || lower.includes('راديو') || lower.includes('كنيسة')) {
      return 'إيه؟! الكاسيت... أنت مين قالك على الشريط؟! دي جلسة خاصة ومسجلة في المقهى ومفيهاش أي غلط!';
    }
    return 'الحارة دي لازم تدخل عصر التطوير الحديث يا أستاذ يونس... والورق القديم بتاع الوقف لن يوقف مسيرة الاستثمار!';
  }

  if (characterId === 'char-younes') {
    return 'كل دليل نربطه بعناية يقرّبنا من كشف خيوط المؤامرة... راجع الدفتر وتفقد مسرح الجريمة، فالأشياء الصامتة لا تكذب أبداً.';
  }

  if (characterId === 'char-ragab') {
    return 'الورشة هنا بتشوف أشكال وألوان... فادي شاطر بس ساعات بيغريه القرش، وحسن العقاد كان بيلف حواليه كتير الأيام دي.';
  }

  if (characterId === 'char-hazem') {
    return 'إحنا في انتظار تقريرك يا حضرة المحقق... هات لنا الدليل المادي القاطع على التزوير أو السرقة وقوة القسم كلها في خدمتك.';
  }

  return 'أنا مستعد للتعاون معك يا حضرة المحقق في حدود ما أعلمه عن تلك الليلة.';
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
