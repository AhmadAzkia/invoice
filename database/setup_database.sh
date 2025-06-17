#!/bin/bash
# Script untuk membuat database dan mengisi data sampel

# Konfigurasi MySQL
MYSQL_USER="root"
MYSQL_PASSWORD=""  # Kosong untuk default, isi jika Anda memiliki password
MYSQL_HOST="localhost"

# Menampilkan banner
echo "===========================================" 
echo " Setup Database untuk Aplikasi Invoice Generator"
echo "===========================================" 
echo

# Cek apakah mysql client tersedia
if ! command -v mysql &> /dev/null; then
    echo "MySQL client tidak ditemukan. Pastikan MySQL sudah terinstal dan tersedia di PATH."
    exit 1
fi

# Fungsi untuk mengeksekusi file SQL
execute_sql_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo "Mengeksekusi file: $file"
        if [ -z "$MYSQL_PASSWORD" ]; then
            mysql -u "$MYSQL_USER" -h "$MYSQL_HOST" < "$file"
        else
            mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -h "$MYSQL_HOST" < "$file"
        fi
        
        if [ $? -eq 0 ]; then
            echo "Berhasil mengeksekusi $file"
            return 0
        else
            echo "Gagal mengeksekusi $file"
            return 1
        fi
    else
        echo "File tidak ditemukan: $file"
        return 1
    fi
}

# Membuat database dan tabel
echo "Membuat database dan tabel..."
execute_sql_file "invoice_app_schema.sql"
if [ $? -ne 0 ]; then
    echo "Gagal membuat database dan tabel. Script berhenti."
    exit 1
fi

# Tanya user apakah ingin memasukkan data sampel
echo
read -p "Apakah Anda ingin memasukkan data sampel? (y/n): " insert_sample
echo

if [[ "$insert_sample" = "y" || "$insert_sample" = "Y" ]]; then
    echo "Memasukkan data sampel..."
    execute_sql_file "invoice_app_sample_data.sql"
    if [ $? -ne 0 ]; then
        echo "Gagal memasukkan data sampel."
    fi
fi

echo
echo "===========================================" 
echo " Database Setup Selesai"
echo "===========================================" 
echo
echo "Database invoice_app telah dibuat."
echo "Pastikan untuk memperbarui file .env dengan DATABASE_URL yang benar:"
echo "DATABASE_URL=\"mysql://$MYSQL_USER:$MYSQL_PASSWORD@$MYSQL_HOST:3306/invoice_app\""
echo
echo "Kemudian jalankan: npx prisma generate"
echo "Diikuti dengan: npx prisma migrate dev --name init"
echo "===========================================" 
