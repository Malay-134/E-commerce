"use client";
import { useCart } from "@/context/cartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, deleteCartItem, updateItemQuantity } = useCart();

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 pb-20">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link className="text-blue-500" href="/">
            Go shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="grid gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center border p-4 rounded-lg gap-4"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-gray-500">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.id,
                          item.quantity > 1 ? item.quantity - 1 : 1
                        )
                      }
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteCartItem(item)}
                      className="text-red-500 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-6">
            <h2 className="text-xl font-bold">
              Total: ${totalAmount.toFixed(2)}
            </h2>
            <button className="mt-4 px-6 py-2 bg-(--main) text-white rounded font-bold">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
