import { Head, Link, useForm } from "@inertiajs/react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { create, index, store } from "@/actions/App/Http/Controllers/OrderController";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";

interface Customer {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    code: string;
    price: number;
    tax: number;
}

interface ProductRow {
    rowId: string;
    id: number | null;
    quantity: number | null;
}

interface OrderFormData {
    customer_id: number | null;
    order_day: string;
    products: ProductRow[];
}

interface CreaterOrderProps {
    customers: Customer[];
    products: Product[];
}

export default function CreateOrder({ customers, products }: CreaterOrderProps) {
    const [localToday] = useState(() =>
        new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
            .toISOString()
            .split("T")[0]
    );

    const { data, setData, submit, processing, errors } = useForm<OrderFormData>({
        customer_id: null,
        order_day: localToday,
        products: [{ rowId: crypto.randomUUID(), id: null, quantity: null }],
    });

    const addProductRow = () => {
        setData('products', [...data.products, { rowId: crypto.randomUUID(), id: null, quantity: null }]);
    };

    const removeProductRow = (index: number) => {
        setData('products', data.products.filter((_, i) => i !== index));
    };

    const updateProduct = (index: number, field: keyof ProductRow, value: number | null) => {
        const updated = [...data.products];
        updated[index] = { ...updated[index], [field]: value };
        setData('products', updated);
    };

    const getSelectedProduct = (productId: number | null): Product | undefined => {
        return products.find((p) => p.id === productId);
    }

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(store());
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: '注文一覧', href: index.url() },
                { title: '注文登録', href: create.url() }
            ]}
        >
            <Head title="注文登録" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>注文登録</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="m-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                {/* 顧客選択 */}
                                <div className="mb-4 max-w-md">
                                    <Label htmlFor="customer_id">
                                        顧客
                                    </Label>
                                    <Select
                                        value={data.customer_id !== null ? String(data.customer_id) : undefined}
                                        onValueChange={(value) => setData('customer_id', Number(value))}
                                    >
                                        <SelectTrigger id="customer_id">
                                            <SelectValue placeholder="顧客を選択してください" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={String(customer.id)}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.customer_id} />
                                </div>
                                {/* 注文日 */}
                                <div className="mb-4 max-w-xs">
                                    <Label htmlFor="order_day">注文日</Label>
                                    <Input
                                        id="order_day"
                                        type="date"
                                        value={data.order_day}
                                        onChange={(e) => setData('order_day', e.target.value)}
                                    />
                                    <InputError message={errors.order_day} />
                                </div>

                                {/* 商品選択 */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>商品</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addProductRow}>
                                            <PlusCircle size={16} /> 商品を追加
                                        </Button>
                                    </div>
                                    <InputError message={errors.products} />

                                    <div className="space-y-3">
                                        {data.products.map((row, idx) => {
                                            const selectProduct = getSelectedProduct(row.id);
                                            return (
                                                <div key={row.rowId} className="flex items-start gap-3 p-3 border rounded-md">
                                                    {/* 商品選択 */}
                                                    <div className="flex-1">
                                                        <Label htmlFor={`product-${idx}`}>商品名</Label>
                                                        <Select
                                                            value={row.id !== null ? String(row.id) : undefined}
                                                            onValueChange={(value) => updateProduct(idx, 'id', Number(value))}
                                                        >
                                                            <SelectTrigger id={`product-${idx}`}>
                                                                <SelectValue placeholder="商品を選択" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {products.map((product) => (
                                                                    <SelectItem key={product.id} value={String(product.id)}>
                                                                        {product.name} ({product.code}) - {product.price.toLocaleString()}円
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors[`products.${idx}.id`]} />
                                                    </div>

                                                    {/* 数量 */}
                                                    <div className="w-24">
                                                        <Label htmlFor={`quantity-${idx}`}>数量</Label>
                                                        <Input
                                                            id={`quantity-${idx}`}
                                                            type="number"
                                                            min={1}
                                                            value={row.quantity ?? ''}
                                                            onChange={(e) => updateProduct(idx, 'quantity', e.target.value === '' ? null : Number(e.target.value))}
                                                        />
                                                        <InputError message={errors[`products.${idx}.quantity`]} />
                                                    </div>
                                                    {/* 小計表示 */}
                                                    <div className="w-32 pt-6 text-sm text-right">
                                                        {selectProduct && row.quantity ? (
                                                            <span>{(selectProduct.price * row.quantity).toLocaleString()}円</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </div>

                                                    {/* 削除ボタン */}
                                                    <div className="pt-6">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={data.products.length <= 1}
                                                            onClick={() => removeProductRow(idx)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* 合計金額 */}
                                    <div className="mt-3 text-right text-sm font-semibold">
                                        合計： {data.products.reduce((sum, row) => {
                                            const product = getSelectedProduct(row.id);
                                            return sum + (product && row.quantity ? product.price * row.quantity : 0);
                                        }, 0).toLocaleString()}円
                                    </div>
                                </div>

                                {/* ボタン */}
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        登録
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={index.url()}>
                                            戻る
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </AppLayout>
    )
}
