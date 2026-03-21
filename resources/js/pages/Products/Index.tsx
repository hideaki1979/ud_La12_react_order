import { Head, Link, router } from "@inertiajs/react";
import { decode } from "html-entities";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { create, destroy, edit } from "@/actions/App/Http/Controllers/ProductController";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";

interface Product {
    id: number;
    name: string;
    code: string;
    price: number;
    tax: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProductProps {
    products: {
        data: Product[];
        links: PaginationLink[];
    }
    search_str: string;
    successMessage?: string;
}

export default function Products({ products, search_str, successMessage }: ProductProps) {
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleDelete = () => {
        if (productToDelete) {
            router.delete(destroy.url(productToDelete.id));
            setProductToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: '商品一覧', href: '/products' }]}>
            <Head title="商品一覧" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>商品一覧</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="m-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardContent>
                            {/* 商品登録リンク */}
                            <div className="mb-4 flex">
                                <Button asChild>
                                    <Link href={create.url()}>
                                        <PlusCircle size={16} /> 商品登録
                                    </Link>
                                </Button>
                            </div>

                            {/* 商品名検索 */}
                            <form
                                action={(formData: FormData) => {
                                    const search = formData.get("name") as string;
                                    router.get("/products", { search_str: search }, { preserveState: true, replace: true });
                                }}
                                className="mb-4 flex gap-2"
                            >
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="商品名で検索"
                                    className="max-w-sm"
                                    defaultValue={search_str}
                                />
                                <Button type="submit" variant="outline">検索</Button>
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
                                        <TableHead className="w-48">商品</TableHead>
                                        <TableHead className="w-28">コード</TableHead>
                                        <TableHead className="w-28 text-center">価格</TableHead>
                                        <TableHead className="w-28 text-center">税率</TableHead>
                                        <TableHead className="w-28 text-center"></TableHead>
                                        <TableHead className="w-28 text-center"></TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {products.data.map((product) => {
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="text-center">{product.id}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell className="text-center">{product.code}</TableCell>
                                                <TableCell className="text-right">{product.price}円</TableCell>
                                                <TableCell className="text-right">{product.tax}%</TableCell>
                                                <TableCell className="text-center">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={edit.url(product.id)}>
                                                            <Pencil size={16} />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => setProductToDelete(product)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            {/* ページネーション */}
                            <Pagination className="my-4">
                                <PaginationContent>

                                    {products.links.map((link, index) => (
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
            <AlertDialog open={productToDelete !== null} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>削除確認</AlertDialogTitle>
                        <AlertDialogDescription>
                            {productToDelete?.name}を削除しますか？この操作は元に戻せません。
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
