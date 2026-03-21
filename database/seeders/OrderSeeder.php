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
        Order::factory()->count(30)->create()->each(function (Order $order) {
            // 商品をランダムに1〜3件選んで紐付け
            $products = Product::inRandomOrder()->limit(rand(1, 3))->get();

            $attach = $products->mapWithKeys(fn($product) => [
                $product->id => ['quantity' => rand(1, 20)],
            ])->all();

            $order->products()->attach($attach);
        });
    }
}
