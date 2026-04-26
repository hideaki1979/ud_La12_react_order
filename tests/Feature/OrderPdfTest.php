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
    $customer = Customer::factory()->create(['name' => '山田 太郎']);
    $order = Order::factory()->create([
        'customer_id' => $customer->id,
        'order_day' => '2026-04-10',
    ]);
    $product = Product::factory()->create([
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
    expect($fontFamilies['ipaexg'])->toHaveKey('normal');
});

test('order pdf uses the same embedded Japanese font for static and database text', function () {
    $customer = Customer::factory()->create(['name' => 'A商事']);
    $order = Order::factory()->create([
        'customer_id' => $customer->id,
        'order_day' => '2026-04-10',
    ]);
    $product = Product::factory()->create([
        'name' => 'テストP001商品',
        'code' => 'PX-001',
        'price' => 1200,
        'tax' => 10,
    ]);

    $order->products()->attach($product, ['quantity' => 2]);

    $html = view('pdf.order', [
        'order' => $order->load(['customer', 'products']),
    ])->render();

    expect($html)
        ->toContain('@font-face')
        ->toContain(storage_path('fonts/ipaexg.ttf'))
        ->toContain('font-family: \'ipaexg\', sans-serif;')
        ->toContain('注文ID')
        ->toContain('A商事')
        ->toContain('テストP001商品')
        ->toContain('<td>PX-001</td>')
        ->toContain('<td class="text-right">1,200円</td>')
        ->toContain('<td class="text-right">2</td>')
        ->toContain('<td class="text-right">2,400円</td>');
});

test('guests are redirected to login when downloading an order pdf', function () {
    $customer = Customer::factory()->create();
    $order = Order::factory()->create([
        'customer_id' => $customer->id,
        'order_day' => '2026-04-10',
    ]);

    $response = get(route('orders.pdf', $order));

    $response->assertRedirect(route('login'));
});
