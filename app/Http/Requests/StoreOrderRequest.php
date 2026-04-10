<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'order_day' => 'required|date',
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function attributes()
    {
        return [
            'customer_id' => '顧客',
            'order_day' => '注文日',
            'products' => '商品',
            'products.*.id' => '商品ID',
            'products.*.quantity' => '数量',
        ];
    }

    public function messages()
    {
        return [
            'customer_id.required' => ':attributeを選択してください。',
            'customer_id.exists' => '選択された:attributeは無効です。',
            'order_day.required' => ':attributeを入力してください。',
            'order_day.date' => ':attributeは有効な日付を入力してください。',
            'products.required' => ':attributeを1つ以上追加してください。',
            'products.min' => ':attributeを1つ以上追加してください。',
            'products.*.id.required' => ':attributeを選択してください。',
            'products.*.id.exists' => '選択された:attributeは無効です。',
            'products.*.quantity.required' => ':attributeを入力してください。',
            'products.*.quantity.integer' => ':attributeは数値で入力してください。',
            'products.*.quantity.min' => ':attributeは:min以上で入力してください。',
        ];
    }
}
