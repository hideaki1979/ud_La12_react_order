<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Response;

class OrderPdfController extends Controller
{
    use AuthorizesRequests;

    /**
     * Handle the incoming request.
     */
    public function __invoke(Order $order): Response
    {
        $this->authorize('view', $order);
        $order->load(['customer', 'products']);

        $pdf = Pdf::loadView('pdf.order', ['order' => $order]);

        return $pdf->download("order-{$order->id}.pdf");
    }
}
