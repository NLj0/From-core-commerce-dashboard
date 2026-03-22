@echo off
:start
cls
echo.
echo ==========================================
echo    🚀 Commerce Dashboard Quick Start     
echo ==========================================
echo.

echo Choose from the menu:
echo.
echo [1] Complete setup from scratch
echo [2] Setup database only  
echo [3] Run project
echo [4] Test connection
echo [5] Show system info
echo [0] Exit
echo.

set /p choice=Choose option number: 

if "%choice%"=="1" (
    echo.
    echo ==========================================
    echo    🚀 Complete Setup from Scratch
    echo ==========================================
    echo.
    
    REM Step 1: Install dependencies
    echo [1/4] Installing dependencies...
    call pnpm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        goto end
    )
    echo ✅ Dependencies installed
    echo.
    
    REM Step 2: Generate Prisma Client
    echo [2/4] Generating Prisma Client...
    call npx prisma generate
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to generate Prisma Client
        pause
        goto end
    )
    echo ✅ Prisma Client generated
    echo.
    
    REM Step 3: Run migrations
    echo [3/4] Running database migrations...
    call npx prisma migrate deploy
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to run migrations
        pause
        goto end
    )
    echo ✅ Migrations completed
    echo.
    
    REM Step 4: Seed database
    echo [4/4] Seeding database with sample data...
    call npx prisma db seed
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to seed database
        pause
        goto end
    )
    echo ✅ Database seeded
    echo.
    
    echo ==========================================
    echo ✅ Setup completed successfully!
    echo ==========================================
    echo.
    echo You can now run option [3] to start the project
    echo.
    pause
    goto end
)

if "%choice%"=="2" (
    echo.
    echo ==========================================
    echo    📊 Database Setup Only
    echo ==========================================
    echo.
    
    REM Step 1: Generate Prisma Client
    echo [1/3] Generating Prisma Client...
    call npx prisma generate
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to generate Prisma Client
        pause
        goto end
    )
    echo ✅ Prisma Client generated
    echo.
    
    REM Step 2: Run migrations
    echo [2/3] Running database migrations...
    call npx prisma migrate deploy
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to run migrations
        pause
        goto end
    )
    echo ✅ Migrations completed
    echo.
    
    REM Step 3: Seed database
    echo [3/3] Seeding database with sample data...
    call npx prisma db seed
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to seed database
        pause
        goto end
    )
    echo ✅ Database seeded
    echo.
    
    echo ==========================================
    echo ✅ Database setup completed!
    echo ==========================================
    echo.
    pause
    goto end
)

if "%choice%"=="3" (
    echo.
    echo 🚀 Starting project...
    echo.
    echo Opening http://localhost:3000
    echo Press Ctrl+C to stop the server
    echo.
    call npm run dev
    goto end
)

if "%choice%"=="4" (
    echo.
    echo 🧪 Testing connection...
    echo.
    echo Checking PostgreSQL Service...
    sc query postgresql-x64-18 | find "RUNNING" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ PostgreSQL Service is running
    ) else (
        echo ❌ PostgreSQL Service is not running
    )
    
    echo.
    echo Testing database connection...
    set PGPASSWORD=Ad100200300
    "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -d commerce_dashboard -c "SELECT current_database();" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Database connection successful
    ) else (
        echo ❌ Database connection failed
    )
    
    echo.
    echo Testing Prisma Client...
    npx prisma version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Prisma is working
    ) else (
        echo ❌ Prisma issue
    )
    
    pause
    goto end
)

if "%choice%"=="5" (
    echo.
    echo ==========================================
    echo              System Information           
    echo ==========================================
    echo.
    
    echo 🐘 PostgreSQL:
    if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" (
        echo    ✅ Installed - Version 18
        echo    📍 Port: 5433
        echo    👤 User: postgres
        echo    🗄️  Database: commerce_dashboard
    ) else (
        echo    ❌ Not installed
    )
    
    echo.
    echo 📦 Node.js:
    node --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo    ✅ Installed - Version: 
        node --version
    ) else (
        echo    ❌ Not installed
    )
    
    echo.
    echo 🚀 Project:
    if exist "package.json" (
        echo    ✅ Project files exist
        echo    📁 Directory: %CD%
    ) else (
        echo    ❌ Project files not found
    )
    
    if exist ".env" (
        echo    ✅ Environment file exists
    ) else (
        echo    ❌ Environment file not found
    )
    
    if exist "node_modules" (
        echo    ✅ Dependencies installed
    ) else (
        echo    ❌ Dependencies not installed
    )
    
    echo.
    echo 🌐 URLs:
    echo    - Website: http://localhost:3000
    echo    - Products: http://localhost:3000/products
    echo    - API: http://localhost:3000/api/products
    echo.
    echo 🔧 Database Tools:
    echo    - pgAdmin: Search for pgAdmin 4 in Start Menu
    echo    - Port: 5433
    echo    - Username: postgres
    echo    - Password: Ad100200300
    echo.
    
    pause
    goto end
)

if "%choice%"=="0" (
    echo.
    echo Thank you for using Commerce Dashboard! 👋
    exit /b
)

echo.
echo ❌ Invalid option, please try again
pause
goto start

:end
echo.
echo.
echo Press any key to return to main menu...
pause >nul
goto start