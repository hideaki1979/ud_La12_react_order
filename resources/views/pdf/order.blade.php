<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'ipaexg', sans-serif;
            font-size: 12px;
            color: #333;
        }

        h1 {
            font-size: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
            margin-bottom: 20px;
        }

        .info-table {
            width: 100%;
            margin-bottom: 24px;
        }

        .info-table td {
            padding: 4px 8px;
        }

        .info-table .label {
            color: #666;
            width: 100px;
        }

        table.products {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        table.products th {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            font-size: 11px;
        }

        table.products td {
            border: 1px solid #d1d5db;
            padding: 8px;
        }

        .text-right {
            text-align: right;
        }

        .total {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            margin-top: 12px;
        }
    </style>
</head>

<body>
    <h1>注文明細書</h1>

    <table class="info-table">
        <tr>
            <td class="label">注文ID</td>
            <td>{{ $order->id }}</td>
        </tr>
        <tr>
            <td class="label">顧客名</td>
            <td>{{ $order->customer->name }}</td>
        </tr>
        <tr>
            <td class="label">注文日</td>
            <td>{{ $order->order_day }}</td>
        </tr>
    </table>

    <table class="products">
        <thead>
            <tr>
                <th>商品名</th>
                <th>商品コード</th>
                <th class="text-right">単価</th>
                <th class="text-right">数量</th>
                <th class="text-right">小計</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach ($order->products as $product)
                @php
                    $subtotal = $product->price * $product->pivot->quantity;
                    $total += $subtotal;
                @endphp
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->code }}</td>
                    <td class="text-right">{{ number_format($product->price) }}円</td>
                    <td class="text-right">{{ $product->pivot->quantity }}</td>
                    <td class="text-right">{{ number_format($subtotal) }}円</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">合計： {{ number_format($total) }}円</div>
</body>

</html>
