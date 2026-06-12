/**
 * Central mock content for CyberXi Savvy.
 * All screens import from here so the demo stays consistent.
 * Types are exported so route screens can be strongly typed.
 */
import type { LucideIcon } from 'lucide-react'
import {
  Shield, Fish, MessageSquareWarning, PhoneCall, CreditCard, Users,
  Brain, Lock, GraduationCap, Trophy, Sparkles, ShieldCheck, KeyRound,
  Bug, Eye, BadgeCheck, Crown, Star, Award,
} from 'lucide-react'

export const USER = {
  name: 'سيف ماجد',
  nameEn: 'Saif Majed',
  role: 'محلّل أول · إدارة التحول الرقمي',
  department: 'التحول الرقمي',
  avatarInitials: 'سم',
  level: 7,
  levelTitle: 'CyberXi Savvy Defender',
  xp: 4820,
  xpToNext: 6000,
  streakDays: 14,
  rank: 3,
  certReadiness: 82,
}

export interface Score { key: string; label: string; value: number; color: 'cyber' | 'savvy' | 'gold' | 'violet' }
export const SCORES: Score[] = [
  { key: 'learning', label: 'درجة التعلّم', value: 88, color: 'cyber' },
  { key: 'awareness', label: 'درجة الوعي', value: 84, color: 'savvy' },
  { key: 'ai', label: 'أمان الذكاء الاصطناعي', value: 76, color: 'violet' },
  { key: 'privacy', label: 'حماية الخصوصية', value: 80, color: 'cyber' },
  { key: 'data', label: 'حماية البيانات', value: 79, color: 'savvy' },
]
export const OVERALL_SCORE = 82

export interface CertStat { label: string; done: number; total: number; icon: LucideIcon }
export const CERT_STATS: CertStat[] = [
  { label: 'الوحدات المكتملة', done: 18, total: 24, icon: GraduationCap },
  { label: 'الفيديوهات المُشاهَدة', done: 42, total: 56, icon: Sparkles },
  { label: 'الاختبارات الناجحة', done: 11, total: 14, icon: BadgeCheck },
  { label: 'التحديات المكتملة', done: 7, total: 10, icon: Trophy },
]

export interface JourneyStage {
  id: number; code: string; title: string; titleEn: string
  desc: string; icon: LucideIcon; status: 'done' | 'active' | 'locked'
  savvy: string
}
export const JOURNEY: JourneyStage[] = [
  { id: 1, code: 'FUND', title: 'أساسيات الأمن السيبراني', titleEn: 'Cybersecurity Fundamentals', icon: Shield, status: 'done',
    desc: 'كلمات المرور · المصادقة الثنائية · أمن الأجهزة · التصفح الآمن', savvy: 'بداية موفّقة — أتقنت الأساسيات وأنت جاهز للمرحلة التالية.' },
  { id: 2, code: 'PHISH', title: 'التصيّد والاحتيال الإلكتروني', titleEn: 'Phishing & Online Scams', icon: Fish, status: 'done',
    desc: 'تصيّد البريد · التصيّد الموجّه · BEC · أمثلة حقيقية', savvy: 'ممتاز! صرت تكشف رسائل التصيّد قبل ما تنخدع.' },
  { id: 3, code: 'SMSVISH', title: 'التصيّد النصّي والصوتي', titleEn: 'Smishing & Vishing', icon: PhoneCall, status: 'active',
    desc: 'رسائل SMS الاحتيالية · سرقة OTP · انتحال المكالمات', savvy: 'أنت الآن في قلب الرحلة — ركّز على علامات المكالمات المزيّفة.' },
  { id: 4, code: 'SOCENG', title: 'الهندسة الاجتماعية', titleEn: 'Social Engineering', icon: Users, status: 'locked',
    desc: 'التلاعب · استغلال الثقة · جمع المعلومات · الهجمات النفسية', savvy: 'استعد — هنا نتعلّم كيف يخترق المهاجمون العقول لا الأجهزة.' },
  { id: 5, code: 'PRIV', title: 'حماية البيانات والخصوصية', titleEn: 'Data Protection & Privacy', icon: Lock, status: 'locked',
    desc: 'التعامل الآمن مع البيانات · PDPL · حوكمة الخصوصية', savvy: 'بياناتك ثروة — تعلّم كيف تحرسها وفق نظام PDPL.' },
  { id: 6, code: 'AISEC', title: 'أمن الذكاء الاصطناعي', titleEn: 'AI Security & Responsible Use', icon: Brain, status: 'locked',
    desc: 'الاستخدام الآمن · حوكمة الـAI · تسريب البيانات · أمان الـPrompt', savvy: 'المستقبل هنا — استخدم الذكاء الاصطناعي بقوة ومسؤولية.' },
  { id: 7, code: 'ACADEMY', title: 'أكاديمية منتجات CyberXi', titleEn: 'CyberXi Products Academy', icon: GraduationCap, status: 'locked',
    desc: 'PenTestHuB · CodeLens · أداة إدارة PDPL', savvy: 'اكتشف أدوات سايبر اكس التي تحمي المؤسسات الكبرى.' },
  { id: 8, code: 'FINAL', title: 'التقييم النهائي', titleEn: 'Final Assessment', icon: ShieldCheck, status: 'locked',
    desc: 'اختبار شامل · درجة النجاح ٨٠٪', savvy: 'تبقّى تحدٍّ أخير واحد قبل الشهادة. أنت قادر!' },
  { id: 9, code: 'CERT', title: 'شهادة CyberXi Savvy', titleEn: 'CyberXi Savvy AI Service Certificate', icon: Award, status: 'locked',
    desc: 'الشهادة المعتمدة · صلاحية ١٢ شهراً', savvy: 'مبروك مقدّماً — وجهتك النهائية: بطل سيبراني معتمد 🛡️' },
]

export interface Center {
  id: string; title: string; titleEn: string; icon: LucideIcon
  color: 'cyber' | 'savvy' | 'violet' | 'gold' | 'danger'
  count: number; progress: number; topics: string[]
}
export const CENTERS: Center[] = [
  { id: 'fundamentals', title: 'أساسيات الأمن السيبراني', titleEn: 'Cybersecurity Fundamentals', icon: KeyRound, color: 'cyber', count: 12, progress: 100,
    topics: ['كلمات المرور', 'المصادقة الثنائية', 'أمن الأجهزة', 'التصفح الآمن'] },
  { id: 'phishing', title: 'مركز التصيّد', titleEn: 'Phishing Center', icon: Fish, color: 'cyber', count: 9, progress: 86,
    topics: ['تصيّد البريد', 'التصيّد الموجّه', 'Clone Phishing', 'BEC'] },
  { id: 'smishing', title: 'مركز التصيّد النصّي', titleEn: 'Smishing Center', icon: MessageSquareWarning, color: 'savvy', count: 6, progress: 60,
    topics: ['رسائل SMS الاحتيالية', 'سرقة OTP', 'الاحتيال عبر الجوال'] },
  { id: 'vishing', title: 'مركز التصيّد الصوتي', titleEn: 'Vishing Center', icon: PhoneCall, color: 'savvy', count: 5, progress: 40,
    topics: ['الاحتيال الصوتي', 'مكالمات الدعم المزيّفة', 'انتحال البنوك'] },
  { id: 'fraud', title: 'مركز الاحتيال والنصب', titleEn: 'Fraud & Scam Center', icon: CreditCard, color: 'danger', count: 10, progress: 30,
    topics: ['الاحتيال البنكي', 'الاحتيال الاستثماري', 'نصب التوظيف', 'نصب التسوّق'] },
  { id: 'social', title: 'مركز الهندسة الاجتماعية', titleEn: 'Social Engineering Center', icon: Users, color: 'violet', count: 8, progress: 20,
    topics: ['التلاعب', 'استغلال الثقة', 'جمع المعلومات', 'الهجمات النفسية'] },
  { id: 'ai', title: 'مركز أمن الذكاء الاصطناعي', titleEn: 'AI Security Center', icon: Brain, color: 'violet', count: 11, progress: 15,
    topics: ['الاستخدام الآمن', 'الذكاء المسؤول', 'أمان الـPrompt', 'تسريب البيانات', 'حوكمة الـAI'] },
]

export interface Product {
  id: string; name: string; tagline: string; icon: LucideIcon
  color: 'cyber' | 'savvy' | 'violet'; teaches: string[]; modules: number
}
export const PRODUCTS: Product[] = [
  { id: 'pentesthub', name: 'PenTestHuB', tagline: 'اختبار الاختراق وإدارة الثغرات', icon: Bug, color: 'cyber', modules: 6,
    teaches: ['اختبار الاختراق', 'إدارة الثغرات', 'معالجة المخاطر'] },
  { id: 'codelens', name: 'CodeLens', tagline: 'مراجعة الشيفرة بالذكاء الاصطناعي', icon: Eye, color: 'savvy', modules: 5,
    teaches: ['مراجعة الكود بالـAI', 'التطوير الآمن', 'اكتشاف الثغرات', 'تقليل الإيجابيات الكاذبة'] },
  { id: 'pdpl', name: 'PDPL Management', tagline: 'إدارة الامتثال والخصوصية', icon: Lock, color: 'violet', modules: 4,
    teaches: ['نظام PDPL السعودي', 'حماية البيانات', 'حوكمة الخصوصية', 'إدارة الامتثال'] },
]

export interface Badge { id: string; name: string; icon: LucideIcon; earned: boolean; color: 'cyber' | 'savvy' | 'gold' | 'violet' }
export const BADGES: Badge[] = [
  { id: 'rookie', name: 'Cyber Rookie', icon: Star, earned: true, color: 'cyber' },
  { id: 'defender', name: 'Cyber Defender', icon: Shield, earned: true, color: 'savvy' },
  { id: 'aiguardian', name: 'AI Guardian', icon: Brain, earned: true, color: 'violet' },
  { id: 'privacy', name: 'Privacy Champion', icon: Lock, earned: false, color: 'cyber' },
  { id: 'expert', name: 'CyberXi Savvy Expert', icon: Crown, earned: false, color: 'gold' },
]

export interface LeaderRow { rank: number; name: string; dept: string; xp: number; me?: boolean }
export const LEADERBOARD: LeaderRow[] = [
  { rank: 1, name: 'لولوة الدوسري', dept: 'الأمن المعلوماتي', xp: 6240 },
  { rank: 2, name: 'بدر السماري', dept: 'العمليات', xp: 5310 },
  { rank: 3, name: 'سيف ماجد', dept: 'التحول الرقمي', xp: 4820, me: true },
  { rank: 4, name: 'هبة العتيبي', dept: 'الموارد البشرية', xp: 4110 },
  { rank: 5, name: 'سعد القحطاني', dept: 'المالية', xp: 3990 },
]

export interface SavvyQ { q: string; lang: 'ar' | 'en' }
export const SAVVY_SUGGESTIONS: SavvyQ[] = [
  { q: 'كيف أعرف أن الرسالة احتيالية؟', lang: 'ar' },
  { q: 'ما الفرق بين Phishing و Smishing؟', lang: 'ar' },
  { q: 'هل يمكنني مشاركة ملف الشركة مع أدوات الذكاء الاصطناعي؟', lang: 'ar' },
  { q: 'كيف أحمي بياناتي؟', lang: 'ar' },
  { q: 'اشرح لي PDPL بطريقة بسيطة', lang: 'ar' },
  { q: 'What data should never be shared with AI tools?', lang: 'en' },
]

/** Canned Mr. Savvy answers (demo copilot, grounded tone). */
export const SAVVY_ANSWERS: Record<string, string> = {
  'كيف أعرف أن الرسالة احتيالية؟':
    'انتبه لأربع علامات: الاستعجال والتهديد ("حسابك سيُغلق خلال ٢٤ ساعة")، طلب بيانات حسّاسة كرمز التحقق، رابط لا يطابق النطاق الرسمي، وأخطاء لغوية أو تحية عامة. عند الشك: لا تضغط الرابط، وادخل الموقع بنفسك عبر التطبيق الرسمي.',
  'ما الفرق بين Phishing و Smishing؟':
    'كلاهما تصيّد احتيالي، والفرق في القناة: Phishing عبر البريد الإلكتروني، وSmishing عبر الرسائل النصية SMS. الهدف واحد — خداعك لتسليم بياناتك — والدفاع واحد: لا تثق بالروابط الواردة، وتحقّق من الجهة عبر قناتها الرسمية.',
  'هل يمكنني مشاركة ملف الشركة مع أدوات الذكاء الاصطناعي؟':
    'القاعدة: لا ترفع مستندات الشركة السرّية أو بيانات العملاء أو الأكواد الداخلية إلى أدوات ذكاء اصطناعي عامة. استخدم فقط الأدوات المعتمدة من المؤسسة، وراجع سياسة الذكاء الاصطناعي قبل أي مشاركة. عند الشك — لا تشارك.',
  'كيف أحمي بياناتي؟':
    'فعّل المصادقة الثنائية، استخدم كلمة مرور فريدة لكل حساب، حدّث أجهزتك أولاً بأول، تجنّب الواي فاي العام للعمليات الحسّاسة، وراجع صلاحيات تطبيقاتك. وداخل العمل: التزم بتصنيف البيانات وسياسة التعامل معها وفق PDPL.',
  'اشرح لي PDPL بطريقة بسيطة':
    'نظام حماية البيانات الشخصية (PDPL) هو القانون السعودي الذي ينظّم جمع واستخدام ومشاركة البيانات الشخصية. باختصار: لا تجمع بيانات أكثر من حاجتك، استخدمها للغرض المعلن فقط، احمِها جيداً، واحترم حق الشخص في معرفة بياناته والتحكّم بها.',
  'What data should never be shared with AI tools?':
    'Never share: company secrets, customer or employee personal data, credentials and API keys, internal source code, financial records, or anything classified confidential. Use only enterprise-approved AI tools, and when in doubt — do not paste it.',
}

export interface AdminMetric { label: string; value: string; sub: string; trend: 'up' | 'down' | 'flat' }
export const ADMIN_METRICS: AdminMetric[] = [
  { label: 'وعي المؤسسة', value: '٨١٪', sub: '+٦٪ هذا الربع', trend: 'up' },
  { label: 'إكمال التدريب', value: '٧٤٪', sub: '٤٢٠ من ٥٦٨ موظف', trend: 'up' },
  { label: 'مستخدمون عالي الخطورة', value: '٢٣', sub: '-٥ هذا الشهر', trend: 'down' },
  { label: 'الموظفون المعتمدون', value: '٣١٢', sub: '٥٥٪ من المؤسسة', trend: 'up' },
]
export interface DeptRow { dept: string; score: number; completion: number; risk: 'low' | 'med' | 'high' }
export const DEPARTMENTS: DeptRow[] = [
  { dept: 'الأمن المعلوماتي', score: 94, completion: 98, risk: 'low' },
  { dept: 'التحول الرقمي', score: 86, completion: 88, risk: 'low' },
  { dept: 'المالية', score: 78, completion: 81, risk: 'med' },
  { dept: 'الموارد البشرية', score: 72, completion: 76, risk: 'med' },
  { dept: 'العمليات', score: 64, completion: 59, risk: 'high' },
]

export const NAV = [
  { to: '/', label: 'الرئيسية', icon: 'Home' },
  { to: '/journey', label: 'رحلتي التعليمية', icon: 'Route' },
  { to: '/knowledge', label: 'مركز المعرفة', icon: 'BookOpen' },
  { to: '/videos', label: 'مكتبة الفيديو', icon: 'PlayCircle' },
  { to: '/quizzes', label: 'الاختبارات', icon: 'ListChecks' },
  { to: '/challenges', label: 'التحديات', icon: 'Target' },
  { to: '/simulations', label: 'المحاكاة', icon: 'Crosshair' },
  { to: '/savvy', label: 'اسأل مستر ساڤي', icon: 'Sparkles' },
  { to: '/products', label: 'منتجات CyberXi', icon: 'Boxes' },
  { to: '/certificate', label: 'الشهادات', icon: 'Award' },
  { to: '/admin', label: 'لوحة الإدارة', icon: 'LayoutDashboard' },
  { to: '/reports', label: 'التقارير', icon: 'BarChart3' },
  { to: '/settings', label: 'الإعدادات', icon: 'Settings' },
] as const

export interface QuizQuestion { q: string; options: string[]; correct: number; explain: string }
export interface QuizDef { id: string; title: string; questions: QuizQuestion[] }
export const QUIZ_BANK: Record<string, QuizDef> = {
  fundamentals: {
    id: 'fundamentals', title: 'أساسيات الأمن السيبراني',
    questions: [
      { q: 'أي كلمة مرور هي الأقوى؟', options: ['Saif1990', '123456789', 'قهوة-نجد-تطير-77', 'password'], correct: 2,
        explain: 'العبارات الطويلة الفريدة أقوى بكثير من الكلمات القصيرة أو المعلومات الشخصية.' },
      { q: 'ما فائدة المصادقة الثنائية (2FA)؟', options: ['تسريع الدخول', 'طبقة حماية ثانية بعد كلمة المرور', 'إلغاء كلمة المرور', 'تشفير الجهاز'], correct: 1,
        explain: 'المصادقة الثنائية تضيف عاملاً ثانياً (جوالك) فيبقى حسابك محمياً حتى لو سُربت كلمة المرور.' },
      { q: 'وصلك تحديث للنظام — ماذا تفعل؟', options: ['أؤجّله شهراً', 'أتجاهله', 'أثبّته بأسرع وقت', 'أعطّل التحديثات'], correct: 2,
        explain: 'التحديثات تسدّ ثغرات معروفة يستغلّها المهاجمون — ثبّتها فوراً.' },
      { q: 'هل تشارك رمز التحقق (OTP) مع موظف البنك؟', options: ['نعم إن طلبه', 'فقط نصفه', 'لا أبداً', 'عبر الإيميل فقط'], correct: 2,
        explain: 'رمز التحقق سرّي — لا جهة رسمية تطلبه منك إطلاقاً.' },
    ],
  },
  phishing: {
    id: 'phishing', title: 'كشف التصيّد الاحتيالي',
    questions: [
      { q: 'رسالة: "حسابك سيُغلق خلال ٢٤ ساعة، اضغط الرابط" — هذه على الأرجح…', options: ['إشعار رسمي', 'تصيّد احتيالي', 'تحديث أمني', 'عرض تسويقي'], correct: 1,
        explain: 'الاستعجال والتهديد بمهلة قصيرة من أشهر أساليب التصيّد.' },
      { q: 'كيف تتحقق من رابط مشبوه قبل الضغط؟', options: ['أضغطه بسرعة', 'أمرّر المؤشر لمعاينة الوجهة', 'أعيد إرساله للأصدقاء', 'أثق بالمرسِل'], correct: 1,
        explain: 'معاينة الرابط تكشف النطاقات المزيّفة قبل أن تقع في الفخّ.' },
      { q: 'ما هو هجوم BEC؟', options: ['فيروس فدية', 'اختراق بريد الأعمال لانتحال مسؤول', 'هجوم حجب خدمة', 'تصيّد صوتي'], correct: 1,
        explain: 'Business Email Compromise = انتحال بريد مسؤول لخداع الموظفين مالياً.' },
      { q: 'أفضل تصرّف عند الشك في رسالة باسم البنك؟', options: ['أرد عليها', 'أتصل عبر رقم البنك الرسمي', 'أضغط الرابط للتأكد', 'أتجاهلها فقط'], correct: 1,
        explain: 'تحقّق دائماً عبر القناة الرسمية المعلنة، لا عبر الرسالة نفسها.' },
    ],
  },
  smsvish: {
    id: 'smsvish', title: 'التصيّد النصّي والصوتي',
    questions: [
      { q: 'اتصل بك "الدعم الفني" وطلب رمز التحقق — ماذا تفعل؟', options: ['أعطيه الرمز', 'أرفض وأنهي المكالمة', 'أعطيه نصف الرمز', 'أعاود الاتصال به'], correct: 1,
        explain: 'الدعم الحقيقي لا يطلب رمز التحقق أبداً — ارفض فوراً.' },
      { q: 'Smishing يعني التصيّد عبر…', options: ['البريد', 'الرسائل النصية SMS', 'المكالمات', 'وسائل التواصل'], correct: 1,
        explain: 'Smishing = تصيّد عبر رسائل SMS.' },
      { q: 'رسالة SMS فيها رابط لـ "استلام شحنتك المعلّقة" لم تطلبها…', options: ['أضغط الرابط', 'أتجاهل وأتحقق من شركة الشحن مباشرة', 'أرسل بياناتي', 'أتصل بالرقم في الرسالة'], correct: 1,
        explain: 'الروابط في رسائل غير متوقعة فخّ — تحقّق عبر القناة الرسمية.' },
    ],
  },
}

export const CERTIFICATE = {
  holder: 'سيف ماجد متبولي',
  holderEn: 'Saif Majed Mutbouli',
  title: 'CyberXi Savvy AI Service Certificate',
  titleAr: 'شهادة خدمة الذكاء الاصطناعي من CyberXi Savvy',
  score: 91,
  serial: 'CXS-2026-04820',
  issue: '2026-06-12',
  expiry: '2027-06-12',
  skills: ['التصيّد والاحتيال', 'الهندسة الاجتماعية', 'حماية البيانات', 'أمن الذكاء الاصطناعي', 'الاستخدام المسؤول'],
}
