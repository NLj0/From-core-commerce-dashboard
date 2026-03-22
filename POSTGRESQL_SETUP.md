# 🐘 PostgreSQL Setup Guide for Windows

## طريقة 1: تثبيت PostgreSQL مباشرة

### 1. تحميل PostgreSQL:
- اذهب إلى: https://www.postgresql.org/download/windows/
- حمل أحدث إصدار (PostgreSQL 16.x)
- شغل ملف التثبيت (.exe)

### 2. خطوات التثبيت:
1. شغل المثبت كمسؤول (Run as administrator)
2. اختر مجلد التثبيت (افتراضي: C:\Program Files\PostgreSQL\16)
3. اختر المكونات المطلوبة:
   ✅ PostgreSQL Server
   ✅ pgAdmin 4 (واجهة إدارة)
   ✅ Stack Builder
   ✅ Command Line Tools
4. اختر مجلد البيانات (افتراضي: C:\Program Files\PostgreSQL\16\data)
5. **مهم جداً**: اختر كلمة مرور قوية للمستخدم postgres
6. اختر Port (افتراضي: 5432)
7. اختر Locale (افتراضي: [Default locale])
8. اكمل التثبيت

### 3. إنشاء قاعدة البيانات:
بعد التثبيت، افتح Command Prompt كمسؤول وشغل:

```cmd
# الدخول إلى PostgreSQL
psql -U postgres -h localhost

# إنشاء قاعدة البيانات
CREATE DATABASE commerce_dashboard;

# إنشاء مستخدم جديد (اختياري)
CREATE USER commerce_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE commerce_dashboard TO commerce_user;

# خروج
\q
```

## طريقة 2: استخدام Docker (أسهل)

### 1. تثبيت Docker Desktop:
- حمل من: https://www.docker.com/products/docker-desktop/
- ثبت وشغل Docker Desktop

### 2. تشغيل PostgreSQL بـ Docker:
```cmd
docker run --name postgres-commerce -e POSTGRES_DB=commerce_dashboard -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16
```

## طريقة 3: استخدام Supabase (Cloud PostgreSQL)

### 1. إنشاء حساب مجاني:
- اذهب إلى: https://supabase.com
- سجل دخول وأنشئ مشروع جديد

### 2. الحصول على Connection String:
- من لوحة التحكم > Settings > Database
- انسخ Connection String

---

## ⚙️ تحديث إعدادات المشروع

بعد تثبيت PostgreSQL، حدث ملف .env:

```env
# إذا استخدمت التثبيت المباشر
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/commerce_dashboard"

# إذا استخدمت Docker
DATABASE_URL="postgresql://postgres:password@localhost:5432/commerce_dashboard"

# إذا استخدمت Supabase
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
```

## 🚀 تطبيق التغييرات:

```cmd
# تحديث Prisma Client
npx prisma generate

# إنشاء وتطبيق Migrations
npx prisma migrate dev --name init-postgresql

# تشغيل Seeding
npx prisma db seed

# تشغيل المشروع
npm run dev
```

## 🔧 اختبار الاتصال:

```cmd
# اختبار اتصال قاعدة البيانات
npx prisma db push

# فتح Prisma Studio لمشاهدة البيانات
npx prisma studio
```

## 🆘 حل المشاكل الشائعة:

### مشكلة: "database does not exist"
```sql
CREATE DATABASE commerce_dashboard;
```

### مشكلة: "password authentication failed"
- تأكد من كلمة المرور في DATABASE_URL
- تأكد من تشغيل PostgreSQL service

### مشكلة: "connect ECONNREFUSED"
- تأكد من تشغيل PostgreSQL على port 5432
- تحقق من Windows Firewall settings
