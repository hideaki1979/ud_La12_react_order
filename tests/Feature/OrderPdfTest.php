<?php

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Dompdf\Dompdf;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('authenticated users can download an order pdf with the Japanese font', function () {
    $user = User::factory()->create();
    $customer = Customer::query()->create([
        'name' => '山田 太郎',
    ]);
    $order = Order::query()->create([
        'customer_id' => $customer->id,
        'order_day' => '2026-04-10',
    ]);
    $product = Product::query()->create([
        'name' => 'テスト商品',
        'code' => 'P001',
        'price' => 1200,
        'tax' => 10,
    ]);

    $order->products()->attach($product, ['quantity' => 2]);

    actingAs($user);

    $response = get(route('orders.pdf', $order));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');

    $dompdf = app(Dompdf::class);
    $fontFamilies = $dompdf->getFontMetrics()->getFontFamilies();

    expect($fontFamilies)->toHaveKey('ipaexg');
    expect($fontFamilies['ipaexg'])->toHaveKeys(['normal', 'bold']);
});
