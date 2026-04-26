<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use RuntimeException;

class OrderPdfController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Order $order): Response
    {
        $order->load(['customer', 'products']);

        $pdf = Pdf::setOption('defaultFont', 'ipaexg');
        $fontMetrics = $pdf->getDomPDF()->getFontMetrics();
        $fontPath = 'file://'.storage_path('fonts/ipaexg.ttf');
        $normalFontRegistered = $fontMetrics->registerFont(
            ['family' => 'ipaexg', 'style' => 'normal', 'weight' => 'normal'],
            $fontPath
        );
        $boldFontRegistered = $fontMetrics->registerFont(
            ['family' => 'ipaexg', 'style' => 'normal', 'weight' => 'bold'],
            $fontPath
        );

        if (! $normalFontRegistered || ! $boldFontRegistered) {
            throw new RuntimeException('Japanese PDF font could not be registered.');
        }

        $pdf->loadView('pdf.order', ['order' => $order]);

        return $pdf->download("order-{$order->id}.pdf");
    }
}
