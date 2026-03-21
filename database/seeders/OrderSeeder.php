<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productIds = Product::pluck('id');

        Order::factory()->count(30)->create()->each(function (Order $order) use ($productIds) {
            // 商品をランダムに1〜3件選んで紐付け
            $productsToAttach = $productIds->random(rand(1, 3))
                ->mapWithKeys(fn($id) => [
                    $id => ['quantity' => rand(1, 20)],
                ])->all();

            $order->products()->attach($productsToAttach);
        });
    }
}
