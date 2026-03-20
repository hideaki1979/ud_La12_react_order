<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            ['name' => 'A商店'],
            ['name' => 'B商店'],
            ['name' => 'C商店'],
        ];

        Customer::insert(
            collect($customers)->map(fn($customer) => $customer + [
                'created_at' => now(),
                'updated_at' => now(),
            ])->all()
        );
    }
}
