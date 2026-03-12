import { Head, Link, useForm } from '@inertiajs/react';
import { Select } from '@radix-ui/react-select';
import type { SubmitEvent } from 'react';
import { store } from '@/actions/App/Http/Controllers/ProductController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/products';

// 税率オプションの定義
const taxes = [
    { id: 10, name: '10%' },
    { id: 8, name: '8%' },
    { id: 0, name: '非課税' },
];

interface ProductFormData {
    name: string;
    code: string;
    price: number;
    tax: number | null;
}

export default function CreateProduct() {
    const { data, setData, post, processing, errors, reset } = useForm<ProductFormData>({
        name: '',
        code: '',
        price: 0,
        tax: null,
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store.url(), {
            onSuccess: () => reset('name', 'code', 'price', 'tax'),
        })
    }

    return (
        <AppLayout>
            <Head title='商品登録' />
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>商品登録</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="m-4 max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-4'>
                                    <Label htmlFor='name'>商品名</Label>
                                    <Input
                                        id='name'
                                        className='max-w-md'
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div className='mb-4'>
                                    <Label htmlFor='name'>コード</Label>
                                    <Input
                                        id='code'
                                        className='max-w-xs'
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                                </div>
                                <div className='mb-4'>
                                    <Label htmlFor='price'>価格</Label>
                                    <Input
                                        id='price'
                                        type='number'
                                        className='max-w-xs'
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>
                                <div className='mb-4 max-w-50'>
                                    <Label htmlFor='tax'>税率</Label>
                                    <Select
                                        value={data.tax !== null ? String(data.tax) : undefined}
                                        onValueChange={(value) => setData('tax', Number(value))}
                                    >
                                        <SelectTrigger id='tax'>
                                            <SelectValue placeholder="税率を選択してください" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {taxes.map((tax) => (
                                                <SelectItem key={tax.id} value={String(tax.id)}>
                                                    {tax.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.tax && <p className="text-red-500 text-sm mt-1">{errors.tax}</p>}
                                </div>

                                <div className='flex gap-2'>
                                    <Button type='submit' disabled={processing}>
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
    );
}

