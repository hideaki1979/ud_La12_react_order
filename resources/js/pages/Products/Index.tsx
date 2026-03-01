import { Head, Link } from "@inertiajs/react";
import { PlusCircle } from "lucide-react";
import { create } from "@/actions/App/Http/Controllers/ProductController";
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
}

export default function Products({ products }: ProductProps) {
    return (
        <AppLayout breadcrumbs={[{ title: '商品一覧', href: '/products' }]}>
            <Head title="商品一覧" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">商品一覧</div>
                    </div>
                </div>

                <div className="m-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-2">
                        {/* 商品登録リンク */}
                        <div className="mt-4 mb-4 ml-4 flex">
                            <Link
                                href={create.url()}
                                className="px-4 py-2 bg-indigo-500 text-white border rounded-md font-semibold text-xs"
                            >
                                <PlusCircle size={16} /> 商品登録
                            </Link>
                        </div>
                        <table className="table-auto border border-gray-400 w-10/12 m-4 text-gray-800">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 w-12">ID</th>
                                    <th className="px-4 py-2 w-48">商品</th>
                                    <th className="px-4 py-2 w-28">コード</th>
                                    <th className="px-4 py-2 w-28 text-center">価格</th>
                                    <th className="px-4 py-2 w-28 text-center">税率</th>
                                    <th className="px-4 py-2"></th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.data.map((product) => {
                                    return (
                                        <tr key={product.id}>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{product.id}</td>
                                            <td className="border border-gray-400 px-4 py-2">{product.name}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{product.code}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-right">{product.price}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-right">{product.tax}%</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center"></td>
                                            <td className="border border-gray-400 px-4 py-2 text-center"></td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                        {/* ページネーション */}
                        <div className="flex justify-center my-4">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? "#"}
                                    className={`px-4 py-2 mx-2 border rounded ${link.active
                                        ? "bg-indigo-500 text-white"
                                        : "bg-white text-gray-700"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`
                                    }
                                >
                                    {link.label
                                        .replace("&laquo;", "«")
                                        .replace("&raquo;", "»")}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
