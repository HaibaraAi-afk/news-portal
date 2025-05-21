<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id(); // Primary key (big integer, auto increment)
            $table->string('title'); // Judul berita
            $table->text('content'); // Isi berita
            $table->string('image')->nullable(); // Gambar berita (opsional)
            $table->string('caption')->nullable(); // Keterangan gambar (opsional)
            $table->enum('category', ['Nasional', 'Politik', 'Kesehatan', 'Olahraga', 'Ekonomi', 'Sains', 'Hukum'])->default('Nasional'); // Kategori berita
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade'); // Relasi ke tabel users
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null'); // Relasi ke tabel users
            $table->timestamp('published_at')->nullable(); // Waktu publikasi
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');
            $table->timestamps(); // Kolom created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
