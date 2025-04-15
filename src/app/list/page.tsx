"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/cartContext";

type ProductType = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviews: number;
};

export default function ProductPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filtered, setFiltered] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const { handleCart } = useCart();

  const searchQuery = searchParams.get("name")?.toLowerCase() || "";

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        const matched = data.products.filter((product: ProductType) =>
          product.title.toLowerCase().includes(searchQuery)
        );
        setFiltered(matched);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, [searchQuery]);

  return (
    <div className="mt-4 p-8 pb-20">
      <h3 className="text-(--main) pl-3 pb-2">All Products</h3>
      <hr />
      {error && <p className="text-red-600">{error}</p>}
      {!(filtered.length === 0) ? (
        <div className="grid grid-cols-4 gap-4 mt-3">
          {filtered.map((item) => (
            <div
              className="flex flex-col gap-3 border p-5 rounded-lg overflow-hidden"
              key={item.id}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="bg-slate-300 rounded-md w-full h-60 object-cover"
              />
              <h3 className="font-bold text-center h-12">{item.title}</h3>
              {/* <p>{item.description}</p> */}
              <p>M.R.P: ${item.price}</p>
              <p>
                {item.rating}
                {/* ({item.reviews.length}) */}
              </p>
              <button
                onClick={() => handleCart(item)}
                className="border border-(--main) text-(--main) font-bold rounded-md py-2"
              >
                {" "}
                Add to cart
              </button>
            </div>
          ))}
        </div>  
      ) : (
        <p className="pl-3 pt-4">No products found for "{searchQuery}"</p>
      )}
    </div>
  );
}
  