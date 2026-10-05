import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart, type CartLine } from "@/hooks/use-cart";

const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;

const CartRow = ({ line }: { line: CartLine }) => {
  const { setCart, removeFromCart } = useCart();
  const { item, count } = line;

  const updateCount = (value: number) =>
    setCart(
      item,
      Math.min(Math.max(Number.isNaN(value) ? 0 : value, 0), item.stockCount),
    );

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-row items-center justify-start gap-4 w-full">
          <img
            src={item.image}
            alt={item.title}
            className="size-20 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold">{item.title}</p>
            <p className="text-muted-foreground">{item.description}</p>
            <p className="text-muted-foreground">
              {formatPrice(item.cost)} each
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center min-w-27 md:min-w-26 gap-1">
            <Input
              type="number"
              min={0}
              max={item.stockCount}
              value={count}
              onChange={(e) => updateCount(e.target.valueAsNumber)}
              aria-label={`${item.title} quantity`}
              className="w-[calc(3ch+2rem)] px-1.5"
            />
            <span className="text-sm text-muted-foreground">
              / {item.stockCount}
            </span>
          </div>
          <span className="min-w-14 text-right font-semibold">
            {formatPrice(item.cost * count)}
          </span>
        </div>
        <Button
          variant="destructive"
          className="w-full sm:w-fit"
          onClick={() => removeFromCart(item)}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
};

const CartItems = () => {
  const { uniqueItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {uniqueItems.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        uniqueItems.map((line) => <CartRow key={line.item.id} line={line} />)
      )}
      <Button
        className="self-start bg-green-600 w-full md:w-fit text-white hover:bg-green-700"
        onClick={() => navigate("/shop")}
      >
        Add more to cart
      </Button>
    </div>
  );
};

const CartSummary = () => {
  const { uniqueItems, totalCount } = useCart();

  const totalPrice = uniqueItems.reduce(
    (sum, line) => sum + line.item.cost * line.count,
    0,
  );

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {uniqueItems.map(({ item, count }) => (
          <div key={item.id} className="flex justify-between gap-2">
            <span>
              {item.title} × {count}
            </span>
            <span>{formatPrice(item.cost * count)}</span>
          </div>
        ))}
        <p className="text-muted-foreground">{totalCount} items</p>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4 pb-4">
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <Button
          onClick={() =>
            alert(`Payment of ${formatPrice(totalPrice)} received!`)
          }
          disabled={totalCount === 0}
        >
          Pay now
        </Button>
      </CardFooter>
    </Card>
  );
};

const Cart = () => (
  <div className="flex w-full flex-col gap-4">
    <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <CartItems />
      </div>
      <CartSummary />
    </div>
  </div>
);

export default Cart;
