@echo off
REM Script untuk membuat database dan mengisi data sampel di Windows

REM Konfigurasi MySQL
SET MYSQL_USER=root
SET MYSQL_PASSWORD=
SET MYSQL_HOST=localhost

REM Menampilkan banner
echo ===========================================
echo  Setup Database untuk Aplikasi Invoice Generator
echo ===========================================
echo.

REM Cek apakah mysql client tersedia dalam PATH
where mysql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo MySQL client tidak ditemukan. Pastikan MySQL sudah terinstal dan tersedia di PATH.
    goto :end
)

REM Membuat database dan tabel
echo Membuat database dan tabel...
if "%MYSQL_PASSWORD%"=="" (
    mysql -u%MYSQL_USER% -h%MYSQL_HOST% < invoice_app_schema.sql
) else (
    mysql -u%MYSQL_USER% -p%MYSQL_PASSWORD% -h%MYSQL_HOST% < invoice_app_schema.sql
)

if %ERRORLEVEL% NEQ 0 (
    echo Gagal membuat database dan tabel. Script berhenti.
    goto :end
)

REM Tanya user apakah ingin memasukkan data sampel
echo.
set /P insert_sample=Apakah Anda ingin memasukkan data sampel? (y/n): 
echo.

if /I "%insert_sample%"=="y" (
    echo Memasukkan data sampel...
    if "%MYSQL_PASSWORD%"=="" (
        mysql -u%MYSQL_USER% -h%MYSQL_HOST% < invoice_app_sample_data.sql
    ) else (
        mysql -u%MYSQL_USER% -p%MYSQL_PASSWORD% -h%MYSQL_HOST% < invoice_app_sample_data.sql
    )
    
    if %ERRORLEVEL% NEQ 0 (
        echo Gagal memasukkan data sampel.
    )
)

echo.
echo ===========================================
echo  Database Setup Selesai
echo ===========================================
echo.
echo Database invoice_app telah dibuat.
echo Pastikan untuk memperbarui file .env dengan DATABASE_URL yang benar:
echo DATABASE_URL="mysql://%MYSQL_USER%:%MYSQL_PASSWORD%@%MYSQL_HOST%:3306/invoice_app"
echo.
echo Kemudian jalankan: npx prisma generate
echo Diikuti dengan: npx prisma migrate dev --name init
echo ===========================================

:end
pause
