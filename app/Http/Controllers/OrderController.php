<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderIndexRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(OrderIndexRequest $request): Response
    {
        $search_str = $request->validated('search_str') ?? '';
        $search_product_name = $request->validated('search_product_name') ?? '';
        $search_product_code = $request->validated('search_product_code') ?? '';

        $orders = Order::query()
            ->with(['customer', 'products'])
            ->when($search_str, function ($query, $search) {
                $escaped_search = $this->escapeLike($search);
                $query->whereHas('customer', function ($q) use ($escaped_search) {
                    $q->where('name', 'LIKE', '%' . $escaped_search . '%');
                });
            })
            ->when($search_product_name, function ($query, $search) {
                $escaped = $this->escapeLike($search);
                $query->whereHas('products', function ($q) use ($escaped) {
                    $q->where('name', 'LIKE', '%' . $escaped . '%');
                });
            })
            ->when($search_product_code, function ($query, $search) {
                $escaped = $this->escapeLike($search);
                $query->whereHas('products', function ($q) use ($escaped) {
                    $q->where('code', 'LIKE', '%' . $escaped . '%');
                });
            })
            ->orderBy('id', 'desc')
            ->paginate(config('pagination.orders_per_page', 5))
            ->withQueryString();

        return Inertia::render(
            'Orders/Index',
            [
                'orders' => $orders,
                'search_str' => $search_str,
                'search_product_name' => $search_product_name,
                'search_product_code' => $search_product_code,
            ],
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }
}
