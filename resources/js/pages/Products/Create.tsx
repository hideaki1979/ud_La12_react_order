import { Head, Link, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import { create, store } from '@/actions/App/Http/Controllers/ProductController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    price: number | null;
    tax: number | null;
}

export default function CreateProduct() {
    const { data, setData, submit, processing, errors, reset } = useForm<ProductFormData>({
        name: '',
        code: '',
        price: null,
        tax: null,
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(store(), {
            onSuccess: () => reset('name', 'code', 'price', 'tax'),
        })
    }

    return (
        <AppLayout breadcrumbs={[
            { title: '商品一覧', href: index.url() },
            { title: '商品登録', href: create.url() },
        ]}>
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
                                    <InputError message={errors.name} />
                                </div>
                                <div className='mb-4'>
                                    <Label htmlFor='code'>コード</Label>
                                    <Input
                                        id='code'
                                        className='max-w-xs'
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    <InputError message={errors.code} />
                                </div>
                                <div className='mb-4'>
                                    <Label htmlFor='price'>価格</Label>
                                    <Input
                                        id='price'
                                        type='number'
                                        className='max-w-xs'
                                        value={data.price ?? ''}
                                        onChange={(e) => setData('price', e.target.value === '' ? null : Number(e.target.value))}
                                    />
                                    <InputError message={errors.price} />
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
                                    <InputError message={errors.tax} />
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

