import { Head, Link, } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { index, show } from "@/actions/App/Http/Controllers/OrderController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    pivot: {
        quantity: number;
    }
}

interface Order {
    id: number;
    customer_id: number | null;
    order_day: string;
    customer: Customer;
    products: Product[];
}

interface ShowProps {
    order: Order;
}

export default function Show({ order }: ShowProps) {

    const totalAmount = order.products.reduce(
        (sum, product) => sum + product.price * product.pivot.quantity, 0
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: '注文一覧', href: index.url() },
                { title: `注文詳細 #${order.id}`, href: show.url(order.id) }
            ]}
        >
            <Head title={`注文詳細 #${order.id}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>注文詳細 #{order.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">注文ID</p>
                                    <p>{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">顧客名</p>
                                    <p>{order.customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">注文日</p>
                                    <p>{order.order_day}</p>
                                </div>
                            </div>

                            <h3 className="mb-2 font-semibold">商品詳細</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>商品名</TableHead>
                                        <TableHead>商品コード</TableHead>
                                        <TableHead className="text-right">単価</TableHead>
                                        <TableHead className="text-right">数量</TableHead>
                                        <TableHead className="text-right">小計</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.code}</TableCell>
                                            <TableCell className="text-right">
                                                {product.price.toLocaleString()}円
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {product.pivot.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(product.price * product.pivot.quantity).toLocaleString()}円
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-4 flex justify-end">
                                <p className="text-lg font-semibold">
                                    合計： {totalAmount.toLocaleString()}円
                                </p>
                            </div>

                            <div className="mt-4">
                                <Button asChild variant="outline">
                                    <Link href={index.url()}>
                                        <ArrowLeft size={16} /> 一覧に戻る
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
