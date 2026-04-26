<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
        @font-face {
            font-family: 'ipaexg';
            font-style: normal;
            font-weight: normal;
            src: url('{{ storage_path('fonts/ipaexg.ttf') }}') format('truetype');
        }

        body {
            font-family: 'ipaexg', sans-serif;
            font-size: 12px;
            font-weight: normal;
            color: #333;
            letter-spacing: 0;
            word-spacing: 0;
        }

        h1 {
            font-size: 20px;
            font-weight: normal;
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
            margin-bottom: 20px;
        }

        .info-table {
            width: 100%;
            margin-bottom: 24px;
            table-layout: fixed;
        }

        .info-table td {
            padding: 4px 8px;
            word-wrap: break-word;
            vertical-align: top;
        }

        .info-table .label {
            color: #666;
            width: 120px;
        }

        table.products {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            table-layout: fixed;
        }

        table.products th {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            font-size: 11px;
            font-weight: normal;
            word-wrap: break-word;
        }

        table.products td {
            border: 1px solid #d1d5db;
            padding: 8px;
            word-wrap: break-word;
            vertical-align: middle;
            line-height: 1.5;
        }

        .text-right {
            text-align: right;
        }

        .total {
            text-align: right;
            font-size: 16px;
            font-weight: normal;
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
                <th style="width: 32%;">商品名</th>
                <th style="width: 18%;">商品コード</th>
                <th class="text-right" style="width: 16%;">単価</th>
                <th class="text-right" style="width: 12%;">数量</th>
                <th class="text-right" style="width: 22%;">小計</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->products as $product)
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->code }}</td>
                    <td class="text-right">{{ number_format($product->price) }}円</td>
                    <td class="text-right">{{ $product->pivot->quantity }}</td>
                    <td class="text-right">{{ number_format($product->price * $product->pivot->quantity) }}円</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">合計： {{ number_format($order->total_amount) }}円</div>
</body>

</html>
