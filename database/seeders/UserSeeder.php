<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->create([
            "name" => "Pipecraft",
            "email" => "aku@admin.com",
            "password" => bcrypt("123"),
            "image" => "/avatar.png",
            "role" => "admin",
        ]);
    }
}
