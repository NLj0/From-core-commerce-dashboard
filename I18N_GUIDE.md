# 🌍 دليل تعدد اللغات (i18n) - Dashboard

## ✅ ما تم إنجازه

تم تطبيق نظام **تعدد اللغات (Internationalization)** بالكامل باستخدام **Context API + Cookies** بدلاً من `next-intl`.

### المميزات:
- ✅ **دعم لغتين**: العربية (RTL) والإنجليزية (LTR)
- ✅ **تبديل فوري**: تغيير اللغة بدون إعادة تحميل الصفحة
- ✅ **حفظ تلقائي**: اللغة المختارة تُحفظ في Cookies
- ✅ **كشف تلقائي**: اكتشاف لغة المتصفح عند أول زيارة
- ✅ **دعم RTL/LTR**: تبديل تلقائي لاتجاه النص والتصميم
- ✅ **ملف واحد لكل صفحة**: لا حاجة لتكرار الملفات
- ✅ **SEO محسّن**: دعم meta tags للغات المختلفة

---

## 📁 الهيكل النهائي

```
dashboard-v1/
└── From-core-commerce-dashboard/
    ├── app/
    │   ├── layout.tsx              ← Root Layout + LanguageProvider
    │   ├── page.tsx                ← الصفحة الرئيسية (مع ترجمة)
    │   ├── categories/
    │   ├── products/
    │   ├── orders/
    │   └── ...
    │
    ├── providers/
    │   └── language-provider.tsx   ← Context للغة
    │
    ├── components/
    │   ├── language-switcher.tsx   ← مبدل اللغة
    │   ├── dashboard-header.tsx    ← مُحدَّث (يحتوي على LanguageSwitcher)
    │   └── ...
    │
    ├── messages/
    │   ├── en.json                 ← الترجمات الإنجليزية
    │   └── ar.json                 ← الترجمات العربية
    │
    └── app/globals.css             ← دعم RTL/LTR في CSS
```

---

## 🚀 كيفية الاستخدام

### 1️⃣ في أي صفحة جديدة:

```typescript
"use client"

import { useLanguage } from "@/providers/language-provider"

export default function MyPage() {
  const { t, dir } = useLanguage()

  return (
    <div dir={dir}>
      <h1>{t("myPage.title")}</h1>
      <p>{t("myPage.description")}</p>
    </div>
  )
}
```

### 2️⃣ إضافة ترجمات جديدة:

#### في `messages/en.json`:
```json
{
  "myPage": {
    "title": "My Page",
    "description": "This is my page description"
  }
}
```

#### في `messages/ar.json`:
```json
{
  "myPage": {
    "title": "صفحتي",
    "description": "هذا وصف صفحتي"
  }
}
```

### 3️⃣ الوصول للغة الحالية:

```typescript
const { locale, setLocale, t, dir } = useLanguage()

// locale: "en" | "ar"
// setLocale: دالة لتغيير اللغة
// t: دالة الترجمة
// dir: "ltr" | "rtl"
```

### 4️⃣ تغيير اللغة برمجياً:

```typescript
const { setLocale } = useLanguage()

// تغيير للعربية
setLocale("ar")

// تغيير للإنجليزية
setLocale("en")
```

---

## 🎨 دعم RTL

تم إضافة دعم كامل للـ RTL في `app/globals.css`:

```css
[dir="rtl"] .mr-2 {
  @apply ml-2 mr-0;
}

[dir="rtl"] .text-left {
  @apply text-right;
}

/* والمزيد... */
```

---

## 📝 أمثلة على الصفحات المُحدَّثة

### ✅ الصفحة الرئيسية (`app/page.tsx`)
- تم تحديثها بالكامل
- تدعم تبديل اللغة الفوري
- اتجاه النص يتغير تلقائياً (RTL/LTR)

### ✅ الهيدر (`components/dashboard-header.tsx`)
- يحتوي على Language Switcher
- الإشعارات والقوائم جاهزة للترجمة

---

## 🔧 الخطوات التالية (اختياري)

لتطبيق الترجمة على باقي الصفحات:

### 1. صفحة المنتجات (`app/products/page.tsx`):
```typescript
"use client"
import { useLanguage } from "@/providers/language-provider"

export default function ProductsPage() {
  const { t, dir } = useLanguage()
  
  return (
    <div dir={dir}>
      <h1>{t("products.title")}</h1>
      <p>{t("products.subtitle")}</p>
      {/* ... */}
    </div>
  )
}
```

### 2. الـ Sidebar (`components/dashboard-sidebar.tsx`):
```typescript
"use client"
import { useLanguage } from "@/providers/language-provider"

export function DashboardSidebar() {
  const { t } = useLanguage()
  
  return (
    <nav>
      <Link href="/">{t("navigation.dashboard")}</Link>
      <Link href="/products">{t("navigation.products")}</Link>
      {/* ... */}
    </nav>
  )
}
```

---

## 📊 ملفات الترجمة

جميع الترجمات موجودة في مجلد `messages/`:

- **`en.json`**: الترجمات الإنجليزية (كاملة)
- **`ar.json`**: الترجمات العربية (كاملة)

الأقسام المتوفرة:
- ✅ `common`: كلمات عامة (حفظ، إلغاء، بحث، إلخ)
- ✅ `navigation`: قائمة التنقل
- ✅ `dashboard`: لوحة التحكم
- ✅ `products`: المنتجات
- ✅ `categories`: الفئات
- ✅ `orders`: الطلبات
- ✅ `customers`: العملاء
- ✅ `reviews`: التقييمات
- ✅ `coupons`: القسائم
- ✅ `emails`: التسويق عبر البريد
- ✅ `settings`: الإعدادات
- ✅ `validation`: رسائل التحقق
- ✅ `messages`: رسائل النجاح/الخطأ
- ✅ `language`: خيارات اللغة

---

## 🌐 SEO للغات المختلفة

لتحسين SEO لكل لغة، أضف في أي صفحة:

```typescript
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | StoreAdmin"
  },
  description: "E-commerce dashboard",
  alternates: {
    languages: {
      'en': '/en',
      'ar': '/ar',
    }
  },
  openGraph: {
    locale: "en_US",
    alternateLocale: ["ar_SA"],
  }
}
```

---

## 📱 تجربة المستخدم

### تغيير اللغة:
1. اضغط على أيقونة 🌐 في الهيدر
2. اختر اللغة (English 🇬🇧 / العربية 🇸🇦)
3. الصفحة تتحدث فوراً بدون reload
4. اللغة تُحفظ تلقائياً في الـ Cookie

### أول زيارة:
- النظام يكتشف لغة المتصفح تلقائياً
- إذا كان المتصفح بالعربية → يفتح باللغة العربية
- إذا كان بأي لغة أخرى → يفتح بالإنجليزية

---

## 🛠️ الحزم المستخدمة

```json
{
  "js-cookie": "^3.0.5",
  "@types/js-cookie": "^3.0.6"
}
```

لم نستخدم `next-intl` لتجنب التعقيد والمشاكل مع الهيكل الحالي.

---

## ✨ النتيجة النهائية

- ✅ **ملف واحد لكل صفحة** (لا حاجة لتكرار)
- ✅ **تبديل فوري بدون reload**
- ✅ **RTL/LTR تلقائي**
- ✅ **ترجمات منفصلة وسهلة التعديل**
- ✅ **حفظ تلقائي للغة المختارة**
- ✅ **كشف تلقائي من المتصفح**
- ✅ **دعم SEO كامل**

---

## 📞 ملاحظات

- جميع الترجمات جاهزة في `messages/en.json` و `messages/ar.json`
- الصفحة الرئيسية تم تحديثها كمثال كامل
- باقي الصفحات تحتاج فقط إضافة `useLanguage()` واستبدال النصوص بـ `t("key")`
- دعم RTL كامل في CSS

---

**🎉 تم بحمد الله!**
