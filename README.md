# لوحة تحكم للتجارة الإلكترونية

لوحة تحكم متكاملة لإدارة متجر إلكتروني، مبنية باستخدام Next.js وتتميز بواجهة مستخدم عصرية وسهلة الاستخدام.

## المميزات الرئيسية

- **تصميم متجاوب**: يعمل بشكل مثالي على جميع أحجام الشاشات.
- **وضع الألوان الداكن/الفاتح**: يدعم التبديل بين الوضعين حسب تفضيل المستخدم.
- **لوحة معلومات تحليلية**: رسوم بيانية وإحصائيات لتتبع أداء المتجر.
- **إدارة المنتجات**: إضافة، تعديل، وحذف المنتجات بسهولة.
- **إدارة الطلبات**: عرض ومتابعة الطلبات مع تفاصيل كاملة.
- **إدارة العملاء**: تتبع معلومات العملاء وسجل مشترياتهم.
- **إدارة الفئات**: تنظيم المنتجات في فئات وأقسام.
- **إدارة الكوبونات**: إنشاء وإدارة عروض وخصومات.
- **إدارة التقييمات**: عرض والرد على تقييمات العملاء.
- **حملات البريد الإلكتروني**: إنشاء وإدارة حملات تسويقية عبر البريد الإلكتروني.
- **إعدادات المتجر**: تخصيص إعدادات المتجر والموقع.

## التقنيات المستخدمة

- **Next.js**: إطار عمل React للتطبيقات الويب.
- **Tailwind CSS**: لتصميم واجهة المستخدم.
- **Shadcn UI**: مكونات واجهة مستخدم قابلة للتخصيص.
- **Recharts**: مكتبة لإنشاء الرسوم البيانية.
- **Prisma**: ORM للتعامل مع قاعدة البيانات.
- **SQLite**: قاعدة بيانات للتطوير (قابلة للتبديل إلى PostgreSQL للإنتاج).

## هيكل المشروع

\`\`\`
app/                  # مكونات صفحات التطبيق
  page.tsx            # الصفحة الرئيسية (لوحة المعلومات)
  categories/         # إدارة الفئات
  coupons/            # إدارة الكوبونات
  customers/          # إدارة العملاء
  emails/             # إدارة حملات البريد الإلكتروني
  orders/             # إدارة الطلبات
  products/           # إدارة المنتجات
  reviews/            # إدارة التقييمات
  settings/           # إعدادات المتجر
components/           # مكونات واجهة المستخدم المشتركة
  ui/                 # مكونات أساسية (أزرار، حقول إدخال، إلخ)
lib/                  # وظائف وأدوات مساعدة
public/               # ملفات عامة (صور، أيقونات)
styles/               # أنماط CSS
\`\`\`

## متطلبات التشغيل

- Node.js (الإصدار 18.0.0 أو أحدث)
- مدير حزم PNPM

## بدء الاستخدام

1. **تثبيت التبعيات**:
   \`\`\`bash
   pnpm install
   \`\`\`

2. **إعداد قاعدة البيانات**:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   \`\`\`

3. **تشغيل خادم التطوير**:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. **الوصول للتطبيق**:
   افتح متصفحك على الرابط http://localhost:3000

## التخصيص

يمكن تخصيص ألوان وسمات التطبيق من خلال تعديل ملف `app/globals.css` الذي يحتوي على متغيرات CSS للألوان والحجم والخطوط.

## المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. انسخ المستودع (Fork)
2. أنشئ فرعًا جديدًا (Branch)
3. قم بالتعديلات المطلوبة
4. أرسل طلب سحب (Pull Request)

<!-- ## الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE) -->

---

# E-Commerce Dashboard

A comprehensive dashboard for managing an e-commerce store, built with Next.js and featuring a modern, user-friendly interface.

## Key Features

- **Responsive Design**: Works perfectly on all screen sizes.
- **Dark/Light Mode**: Supports switching between modes based on user preference.
- **Analytics Dashboard**: Charts and statistics to track store performance.
- **Product Management**: Easily add, edit, and delete products.
- **Order Management**: View and track orders with complete details.
- **Customer Management**: Track customer information and purchase history.
- **Category Management**: Organize products into categories and sections.
- **Coupon Management**: Create and manage offers and discounts.
- **Review Management**: View and respond to customer reviews.
- **Email Campaigns**: Create and manage marketing campaigns via email.
- **Store Settings**: Customize store and site settings.

## Technologies Used

- **Next.js**: React framework for web applications.
- **Tailwind CSS**: For designing the user interface.
- **Shadcn UI**: Customizable UI components.
- **Recharts**: Library for creating charts.
- **Prisma**: ORM for database operations.
- **SQLite**: Development database (switchable to PostgreSQL for production).

## Project Structure

\`\`\`
app/                  # Application page components
  page.tsx            # Main page (dashboard)
  categories/         # Category management
  coupons/            # Coupon management
  customers/          # Customer management
  emails/             # Email campaign management
  orders/             # Order management
  products/           # Product management
  reviews/            # Review management
  settings/           # Store settings
components/           # Shared UI components
  ui/                 # Basic components (buttons, input fields, etc.)
lib/                  # Helper functions and tools
public/               # Public files (images, icons)
styles/               # CSS styles
\`\`\`

## Requirements

- Node.js (version 18.0.0 or newer)
- PNPM package manager

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Setup database**:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. **Access the application**:
   Open your browser at http://localhost:3000

## Customization

You can customize the application's colors and themes by modifying the `app/globals.css` file which contains CSS variables for colors, sizes, and fonts.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

<!-- ## License

This project is licensed under the [MIT License](LICENSE) -->
