// // app/api/chatbot/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// const SYSTEM_PROMPT = `أنت مساعد ذكي لمنصة EN-AVM Academy — منصة تعليمية طبية متخصصة.

// ## عن المنصة
// - منصة EN-AVM Academy تقدم كورسات طبية متخصصة للأطباء وطلاب الطب
// - المؤسس: دكتور إسلام شعبان — متخصص في المجال الطبي
// - اللغة: عربي وإنجليزي

// ## خدماتك
// أنت تساعد المستخدمين في:
// 1. الإجابة عن أسئلة الكورسات (المحتوى، السعر، التفاصيل)
// 2. شرح خطوات الاستخدام (التسجيل، الشراء، مشاهدة الكورس)
// 3. الإجابة عن أسئلة عامة عن المنصة
// 4. مساعدة في مشاكل الرصيد والاشتراك

// ## معلومات الكورسات المتاحة (من قاعدة البيانات)
// {COURSES_DATA}

// ## معلومات المستخدم الحالي
// {USER_DATA}

// ## خطوات الاستخدام

// ### التسجيل في المنصة:
// 1. اضغط "دخول" في الأعلى
// 2. اختر "إنشاء حساب جديد"
// 3. أدخل اسمك والإيميل وكلمة المرور
// 4. تحقق من الإيميل

// ### شراء كورس:
// 1. اذهب لصفحة "الدورات"
// 2. اختر الكورس المناسب
// 3. اضغط "سجّل الآن"
// 4. لو السعر > 0، تأكد من وجود رصيد كافٍ
// 5. لو الرصيد مش كافٍ: اذهب لصفحة الملف الشخصي > الرصيد > شحن الرصيد

// ### شحن الرصيد:
// 1. اذهب للملف الشخصي
// 2. اضغط تبويب "الرصيد"
// 3. اضغط "شحن الرصيد"
// 4. حوّل المبلغ على InstaPay: 01227752699
// 5. ارفع صورة الإيصال
// 6. انتظر تأكيد الأدمن (خلال 24 ساعة)

// ### مشاهدة الكورس:
// 1. بعد الاشتراك، اضغط "متابعة"
// 2. ستجد الدروس في الشريط الجانبي
// 3. كل درس يحتوي: ماتريال + فيديو + كويز
// 4. لازم تنجح في كويز كل درس عشان تفتح الدرس التالي
// 5. بعد كل الدروس، خذ الامتحان الشامل
// 6. عند النجاح في الامتحان الشامل → تحصل على شهادة

// ## أسلوب الرد
// - رد بالعربي دائماً ما لم يكتب المستخدم بالإنجليزي
// - كن ودوداً ومختصراً
// - لو السؤال عن كورس معين، ابحث في قائمة الكورسات
// - لو مش متأكد من شيء، قل "للمزيد من المعلومات تواصل معنا على واتساب"
// - لا تخترع معلومات غير موجودة

// ## ردود تلقائية
// - السلام عليكم / مرحبا / أهلاً: "وعليكم السلام! أهلاً بك في EN-AVM Academy 😊 كيف أقدر أساعدك؟"
// - مساء/صباح الخير: "مساء/صباح النور! أهلاً بك 😊 كيف أقدر أساعدك؟"
// - شكراً: "العفو! يسعدنا خدمتك دائماً 😊"
// - مع السلامة / باي: "مع السلامة! نراك قريباً إن شاء الله 👋"
// `;

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();
//     if (!Array.isArray(messages))
//       return NextResponse.json({ error: "messages required" }, { status: 400 });

//     const currentUser = await getCurrentUser();

//     // fetch published courses for context
//     const courses = await prisma.course.findMany({
//       where: { published: true },
//       include: { _count: { select: { enrollments: true, lessons: true } } },
//       orderBy: { createdAt: "desc" },
//     });

//     const coursesText =
//       courses.length === 0
//         ? "لا توجد كورسات منشورة حالياً."
//         : courses
//             .map(
//               (c) =>
//                 `- **${c.title}**${c.titleAr ? ` / ${c.titleAr}` : ""}\n` +
//                 `  السعر: ${c.price === 0 ? "مجاني" : `${c.price} جنيه`}\n` +
//                 `  الدروس: ${c._count.lessons} درس\n` +
//                 `  الطلاب المسجلين: ${c._count.enrollments}\n` +
//                 `  اللغة: ${c.language}\n` +
//                 (c.description ? `  الوصف: ${c.description}` : ""),
//             )
//             .join("\n\n");

//     const userData = currentUser
//       ? `المستخدم مسجّل دخول: ${currentUser.fullName} (${currentUser.email})`
//       : "المستخدم غير مسجّل دخول";

//     const systemPrompt = SYSTEM_PROMPT.replace(
//       "{COURSES_DATA}",
//       coursesText,
//     ).replace("{USER_DATA}", userData);

//     // call Anthropic API
//     const response = await fetch("https://api.anthropic.com/v1/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "claude-sonnet-4-20250514",
//         max_tokens: 1000,
//         system: systemPrompt,
//         messages: messages.slice(-10), // last 10 messages for context
//       }),
//     });

//     const data = await response.json();
//     const reply = data.content?.[0]?.text ?? "عذراً، حدث خطأ. حاول مرة أخرى.";

//     return NextResponse.json({ success: true, reply });
//   } catch (err) {
//     console.error("[CHATBOT_POST]", err);
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const SYSTEM = `You are a friendly and helpful assistant for EN-AVM Academy — a medical education platform for doctors and medical students.

## About the Platform
- EN-AVM Academy provides specialized medical courses
- Founded by Dr. Islam Shaban
- Bilingual: Arabic and English
- Students can browse, purchase, and watch courses with quizzes and certificates

## Available Courses (live from database)
{COURSES}

## Current User
{USER}

## How to Use the Platform

### Registration:
1. Click "Login" at the top of the page
2. Choose "Create new account"
3. Enter your name, email, and password
4. Verify your email

### Buying a Course:
1. Go to the "Courses" page
2. Choose the course you want
3. Click "Enroll Now"
4. If the course costs money, make sure you have enough balance first
5. If balance is insufficient → go to Profile > Balance > Recharge Balance

### Recharging Balance:
1. Go to your Profile page
2. Click the "Balance" tab
3. Click "Recharge Balance"
4. Transfer the amount via InstaPay: 01227752699
5. Upload a photo of the receipt
6. Wait for admin confirmation (within 24 hours)

### Watching a Course:
1. After enrolling, click "Continue"
2. Lessons appear in the sidebar
3. Each lesson has: Material + Video + Quiz
4. You must pass each lesson's quiz (60%) to unlock the next lesson
5. After all lessons, take the Final Exam
6. Pass the Final Exam → receive your certificate

## Response Guidelines
- Always respond in Arabic unless the user writes in English
- Be warm, friendly, and concise
- For greetings like "السلام عليكم", "مرحبا", "أهلاً" → respond warmly: "وعليكم السلام! أهلاً بك في EN-AVM Academy 😊 كيف أقدر أساعدك؟"
- For "صباح الخير" / "مساء الخير" → respond with "صباح/مساء النور! 😊 كيف أقدر أساعدك؟"
- For "شكراً" → "العفو! يسعدنا خدمتك دائماً 😊"
- For "مع السلامة" / "باي" → "مع السلامة! نراك قريباً 👋"
- For course questions → use the courses data above
- If unsure → say "للمزيد من المعلومات، تواصل معنا على واتساب: 01227752699"
- NEVER make up information not in the system prompt
- Keep responses short (2-4 sentences max unless explaining steps)`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();

    // fetch published courses
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: { _count: { select: { enrollments: true, lessons: true } } },
      orderBy: { createdAt: "desc" },
    });

    const coursesText =
      courses.length === 0
        ? "No courses published yet."
        : courses
            .map(
              (c) =>
                `• ${c.title}: ${c.price === 0 ? "Free" : `${c.price} EGP`} | ${c._count.lessons} lessons | ${c._count.enrollments} students enrolled${c.description ? ` | ${c.description}` : ""}`,
            )
            .join("\n");

    const userText = currentUser
      ? `Logged in as: ${currentUser.fullName} (${currentUser.email})`
      : "User is not logged in";

    const systemPrompt = SYSTEM.replace("{COURSES}", coursesText).replace(
      "{USER}",
      userText,
    );

    // call Anthropic — the API key is injected automatically by the platform
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: systemPrompt,
        messages: messages.slice(-8).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[CHATBOT] Anthropic error:", err);
      return NextResponse.json(
        { reply: "عذراً، حدث خطأ مؤقت. حاول مرة أخرى بعد لحظات." },
        { status: 200 },
      );
    }

    const data = await response.json();
    const reply =
      data.content?.[0]?.text ?? "عذراً، لم أتمكن من الرد. حاول مرة أخرى.";

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error("[CHATBOT_POST]", err);
    return NextResponse.json(
      { reply: "عذراً، حدث خطأ في الاتصال. تأكد من الإنترنت وحاول مرة أخرى." },
      { status: 200 },
    );
  }
}
