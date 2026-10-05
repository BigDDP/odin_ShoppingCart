import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useItems, type Item } from "@/hooks/fetch";
import { useCart } from "@/hooks/use-cart";
import { clampCount, formatPrice } from "@/lib/cart";

export const ItemCard =({ item }: { item: Item }) => {
  const { uniqueItems, setCart } = useCart();

  const countInCart =
    uniqueItems.find((line) => line.item.id === item.id)?.count ?? 0;

  const remaining = item.stockCount - countInCart;

  const [quantity, setQuantity] = useState(Math.min(1, remaining));

  const updateQuantity = (count: number) =>
    setQuantity(clampCount(count, remaining));

  const addToCart = () => {
    setCart(item, countInCart + quantity);
    setQuantity(Math.min(1, remaining - quantity));
  };

  return (
    <Card className="w-full sm:w-64">
      <CardContent className="flex-1">
        <img
          src={item.image}
          alt={item.title}
          className="aspect-square w-full rounded-md object-cover"
        />
      </CardContent>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between gap-2">
        <span className="font-semibold">{formatPrice(item.cost)}</span>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            max={remaining}
            value={quantity}
            onChange={(e) => updateQuantity(e.target.valueAsNumber)}
            aria-label={`${item.title} quantity`}
            className="w-16"
          />
          <span className="text-sm text-muted-foreground">/ {remaining}</span>
        </div>
        <Button
          onClick={addToCart}
          disabled={quantity === 0 || remaining === 0}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

const Shop = () => {
  const { data, error, loading } = useItems();

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h1 className="text-4xl font-bold text-slate-900">Shop</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-destructive">{error.message}</p>}
      {data && (
        <div className="flex w-full flex-wrap justify-center gap-4">
          {Object.values(data).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
