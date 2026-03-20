<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => $this->faker->numberBetween($min = 1, $max = 3),
            'product_id1' => $this->faker->numberBetween($min = 1, $max = 10),
            'num1' => $this->faker->numberBetween($min = 1, $max = 20),
            'product_id2' => $this->faker->numberBetween($min = 1, $max = 10),
            'num2' => $this->faker->numberBetween($min = 1, $max = 20),
            'product_id3' => $this->faker->numberBetween($min = 1, $max = 10),
            'num3' => $this->faker->numberBetween($min = 1, $max = 20),
            'orderday' => date('Y-m-d H:i:s'),
        ];
    }
}
