export type ContentField = {
  key: string;
  label: string;
  multiline?: boolean;
};

export type ContentSection = {
  id: string;
  label: string;
  fields: ContentField[];
};

/** Editable homepage copy — keys map to SiteContent rows */
export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: "hero",
    label: "القسم الرئيسي",
    fields: [
      { key: "hero.title", label: "العنوان" },
      { key: "hero.subtitle", label: "العنوان الفرعي" },
    ],
  },
  {
    id: "story",
    label: "قصتنا",
    fields: [
      { key: "story.title", label: "عنوان القسم" },
      { key: "story.paragraph1", label: "الفقرة الأولى", multiline: true },
      { key: "story.paragraph2", label: "الفقرة الثانية", multiline: true },
      { key: "story.card1.title", label: "بطاقة ١ — العنوان" },
      { key: "story.card1.text", label: "بطاقة ١ — النص", multiline: true },
      { key: "story.card2.title", label: "بطاقة ٢ — العنوان" },
      { key: "story.card2.text", label: "بطاقة ٢ — النص", multiline: true },
      { key: "story.card3.title", label: "بطاقة ٣ — العنوان" },
      { key: "story.card3.text", label: "بطاقة ٣ — النص", multiline: true },
    ],
  },
  {
    id: "services",
    label: "خدماتنا",
    fields: [
      { key: "services.title", label: "عنوان القسم" },
      { key: "services.intro", label: "المقدمة", multiline: true },
      { key: "services.card1.title", label: "بطاقة ١ — العنوان" },
      { key: "services.card1.text", label: "بطاقة ١ — النص", multiline: true },
      { key: "services.card2.title", label: "بطاقة ٢ — العنوان" },
      { key: "services.card2.text", label: "بطاقة ٢ — النص", multiline: true },
      { key: "services.card3.title", label: "بطاقة ٣ — العنوان" },
      { key: "services.card3.text", label: "بطاقة ٣ — النص", multiline: true },
    ],
  },
  {
    id: "shop",
    label: "المتجر",
    fields: [
      { key: "shop.title", label: "عنوان القسم" },
      { key: "shop.subtitle", label: "الوصف", multiline: true },
    ],
  },
  {
    id: "offer",
    label: "العرض الخاص",
    fields: [
      { key: "offer.headline", label: "العنوان الكبير (الخصم)" },
      { key: "offer.title", label: "عنوان العرض" },
      { key: "offer.subtitle", label: "الوصف" },
      { key: "offer.emailPlaceholder", label: "نص حقل البريد" },
      { key: "offer.button", label: "نص الزر" },
      { key: "offer.success", label: "رسالة النجاح", multiline: true },
    ],
  },
  {
    id: "contact",
    label: "تواصل معنا",
    fields: [
      { key: "contact.title", label: "عنوان القسم" },
      { key: "contact.subtitle", label: "الوصف", multiline: true },
      { key: "contact.formNote", label: "ملاحظة النموذج", multiline: true },
      { key: "contact.addressLabel", label: "تسمية العنوان" },
      { key: "contact.address", label: "العنوان", multiline: true },
      { key: "contact.phoneLabel", label: "تسمية الهاتف" },
      { key: "contact.phone", label: "الهاتف" },
      { key: "contact.emailLabel", label: "تسمية البريد" },
      { key: "contact.email", label: "البريد الإلكتروني" },
    ],
  },
  {
    id: "footer",
    label: "التذييل",
    fields: [
      { key: "footer.brand", label: "اسم العلامة" },
      { key: "footer.tagline", label: "الشعار القصير" },
      { key: "footer.blurb", label: "الوصف", multiline: true },
      { key: "footer.hoursTitle", label: "عنوان ساعات العمل" },
      { key: "footer.hours1", label: "ساعات العمل — سطر ١" },
      { key: "footer.hours2", label: "ساعات العمل — سطر ٢" },
      { key: "footer.hours3", label: "ساعات العمل — سطر ٣" },
      { key: "footer.copyright", label: "حقوق النشر (بدون السنة)" },
    ],
  },
];

/** Media URLs stored in SiteContent (logo + hero videos) */
export const MEDIA_CONTENT_KEYS = [
  "brand.logoUrl",
  "hero.video1",
  "hero.video2",
  "hero.video3",
] as const;

export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  "brand.logoUrl": "/logo.png",
  "hero.video1": "/video-1.mp4",
  "hero.video2": "/video-2.mp4",
  "hero.video3": "/video-3.mp4",

  "hero.title": "هويلامو",
  "hero.subtitle": "قهوة مختصة",

  "story.title": "قصتنا",
  "story.paragraph1":
    "بدأت هويلامو كمحمصة حي صغيرة — مكان تلتقي فيه القهوة الجيدة بصباحات هادئة بلا استعجال. نختار حبوبنا بعناية، ونحضّر بإتقان، ونخبز المعجنات طازجة كل يوم.",
  "story.paragraph2":
    "اطلب مسبقاً عبر الإنترنت، ومرّ عندما يصبح طلبك جاهزاً، وادفع نقداً عند الكاونتر. نحن هنا للزبائن الدائمين، وللعاملين عن بُعد، ولكل من يحتاج كوباً دافئاً ووجهاً مرحّباً.",
  "story.card1.title": "أكواب بإتقان",
  "story.card1.text": "إسبريسو، وفلتر، وعروض موسمية.",
  "story.card2.title": "مصادر مدروسة",
  "story.card2.text": "حبوب من مزارع نثق بها ونعود إليها.",
  "story.card3.title": "المجتمع أولاً",
  "story.card3.text": "مكان دافئ للقاء أو العمل أو الاسترخاء.",

  "services.title": "خدماتنا",
  "services.intro":
    "من الكوب اليومي إلى التموين — هويلامو مبنية حول قهوة رائعة واستلام سهل.",
  "services.card1.title": "مشروبات مختصة",
  "services.card1.text":
    "إسبريسو، وبار تحضير، وشاي، وعروض موسمية تُحضَّر حسب الطلب.",
  "services.card2.title": "اطلب مسبقاً",
  "services.card2.text":
    "تصفّح المتجر، واطلب عبر الإنترنت، واستلم عندما يصبح جاهزاً.",
  "services.card3.title": "الدفع عند الاستلام",
  "services.card3.text":
    "ادفع نقداً عند الكاونتر حين تستلم طلبك — بسيط وسريع.",

  "shop.title": "المتجر",
  "shop.subtitle": "اطلب مسبقاً للاستلام — وادفع نقداً عند الكاونتر.",

  "offer.headline": "خصم ٢٠٪",
  "offer.title": "عرض خاص",
  "offer.subtitle": "لطلاب الأكاديمية العربية للعلوم والتكنولوجيا",
  "offer.emailPlaceholder": "بريدك الإلكتروني",
  "offer.button": "اشترك",
  "offer.success": "شكراً لك — سنتواصل معك بخصوص عرض الطلاب.",

  "contact.title": "تواصل معنا",
  "contact.subtitle": "أسئلة عن التموين أو ساعات العمل أو طلبك؟ تواصل معنا.",
  "contact.formNote":
    "نموذج تجريبي ولا يرسل بريداً بعد — استخدم بيانات التواصل على اليسار للتواصل معنا.",
  "contact.addressLabel": "العنوان",
  "contact.address": "١٢٣ شارع التحميص، حي القهوة",
  "contact.phoneLabel": "الهاتف",
  "contact.phone": "(555) 123-4567",
  "contact.emailLabel": "البريد الإلكتروني",
  "contact.email": "hello@hoilamo.coffee",

  "footer.brand": "هويلامو",
  "footer.tagline": "قهوة مختصة",
  "footer.blurb":
    "قهوة مصنوعة بعناية، وضيافة دافئة، ومكان للجلوس بهدوء. اطلب مسبقاً واستلم طلبك جاهزاً — وادفع نقداً عند الاستلام.",
  "footer.hoursTitle": "ساعات العمل",
  "footer.hours1": "الإثنين – الجمعة: ٧:٠٠ ص – ٦:٠٠ م",
  "footer.hours2": "السبت: ٨:٠٠ ص – ٥:٠٠ م",
  "footer.hours3": "الأحد: ٨:٠٠ ص – ٣:٠٠ م",
  "footer.copyright": "هويلامو. جميع الحقوق محفوظة.",
};

export function allContentKeys() {
  return [
    ...CONTENT_SECTIONS.flatMap((s) => s.fields.map((f) => f.key)),
    ...MEDIA_CONTENT_KEYS,
  ];
}

export type SiteContentMap = Record<string, string>;

export function t(content: SiteContentMap | null | undefined, key: string): string {
  if (!content) {
    return DEFAULT_SITE_CONTENT[key] ?? "";
  }
  return content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "";
}

export function getLogoUrl(content: SiteContentMap | null | undefined): string {
  const url = t(content, "brand.logoUrl").trim();
  return url || DEFAULT_SITE_CONTENT["brand.logoUrl"];
}

export function getHeroVideos(
  content: SiteContentMap | null | undefined
): string[] {
  const videos = [
    t(content, "hero.video1").trim(),
    t(content, "hero.video2").trim(),
    t(content, "hero.video3").trim(),
  ].filter(Boolean);

  return videos.length > 0
    ? videos
    : [
        DEFAULT_SITE_CONTENT["hero.video1"],
        DEFAULT_SITE_CONTENT["hero.video2"],
        DEFAULT_SITE_CONTENT["hero.video3"],
      ];
}
