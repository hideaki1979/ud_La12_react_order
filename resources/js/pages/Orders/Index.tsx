import { Head, Link, router } from "@inertiajs/react";
import { decode } from "html-entities";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
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
    };
}

interface Order {
    id: number;
    customer_id: number;
    order_day: string;
    customer: Customer;
    products: Product[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface OrderProps {
    orders: {
        data: Order[];
        links: PaginationLink[];
    };
    search_str: string | null;
    search_product_name: string | null;
    search_product_code: string | null;
    successMessage?: string;
}

export default function Orders({ orders, search_str, search_product_name, search_product_code, successMessage }: OrderProps) {
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    const handleDelete = () => {
        if (orderToDelete) {
            router.delete(`/orders/${orderToDelete.id}`);
            setOrderToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: '注文一覧', href: '/orders' }]}>
            <Head title="注文一覧" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>注文一覧</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="m-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardContent>
                            {/* 注文登録リンク */}
                            <div className="mb-4 flex">
                                <Button asChild>
                                    <Link href="/orders/create">
                                        <PlusCircle size={16} /> 注文登録
                                    </Link>
                                </Button>
                            </div>

                            {/* 顧客名検索 */}
                            <form
                                action={(formData: FormData) => {
                                    router.get("/orders", {
                                        search_str: formData.get("customer_name") as string,
                                        search_product_name: formData.get("product_name") as string,
                                        search_product_code: formData.get("product_code") as string,
                                    }, { preserveState: true, replace: true });
                                }}
                                className="mb-4 flex gap-2 items-end"
                            >
                                <Input
                                    type="text"
                                    name="customer_name"
                                    placeholder="顧客名で検索"
                                    className="max-w-48"
                                    defaultValue={search_str ?? ""}
                                />
                                <Input
                                    type="text"
                                    name="product_name"
                                    placeholder="商品名で検索"
                                    className="max-w-48"
                                    defaultValue={search_product_name ?? ""}
                                />
                                <Input
                                    type="text"
                                    name="product_code"
                                    placeholder="商品コード"
                                    className="max-w-48"
                                    defaultValue={search_product_code ?? ""}
                                />
                                <Button type="submit" variant="outline">
                                    検索
                                </Button>
                            </form>

                            {successMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded m-4">
                                    {successMessage}
                                </div>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">ID</TableHead>
                                        <TableHead className="w-48">顧客名</TableHead>
                                        <TableHead>商品情報</TableHead>
                                        <TableHead className="w-36">注文日</TableHead>
                                        <TableHead className="w-28 text-center"></TableHead>
                                        <TableHead className="w-28 text-center"></TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="text-center">{order.id}</TableCell>
                                                <TableCell>{order.customer.name}</TableCell>
                                                <TableCell>
                                                    <ul className="list-disc list-inside text-sm">
                                                        {order.products.map((product) => (
                                                            <li key={product.id}>
                                                                {product.name} ({product.code})
                                                                &nbsp;単価: {product.price.toLocaleString()}円
                                                                &nbsp;× {product.pivot.quantity}個
                                                                &nbsp;（小計： {(product.price * product.pivot.quantity).toLocaleString()}円）
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                <TableCell>{order.order_day}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        aria-label={`注文ID ${order.id} を編集`}
                                                    >
                                                        <Link href={`/orders/${order.id}/edit`}>
                                                            <Pencil size={16} />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        aria-label={`注文ID ${order.id} を編集`}
                                                        onClick={() => setOrderToDelete(order)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                注文が見つかりませんでした。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* ページネーション */}
                            <Pagination>
                                <PaginationContent>
                                    {orders.links.map((link, index) => (
                                        <PaginationItem key={index}>
                                            <Button
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                asChild={!!link.url}
                                            >
                                                {link.url ? (
                                                    <Link href={link.url}>
                                                        {decode(link.label)}
                                                    </Link>
                                                ) : (
                                                    <span>
                                                        {decode(link.label)}
                                                    </span>
                                                )}

                                            </Button>
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 削除確認ダイアログ */}
            <AlertDialog
                open={orderToDelete !== null}
                onOpenChange={(open) => !open && setOrderToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>削除確認</AlertDialogTitle>
                        <AlertDialogDescription>
                            注文ID: {orderToDelete?.id}を削除しますか？この操作は元に戻せません。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            削除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    )
}

