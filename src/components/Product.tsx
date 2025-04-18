"use client";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";

type ReviewType = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type ProductType = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviews: ReviewType[];
  quantity: number;
};

export default function Product() {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("lowToHigh");
  const { handleCart } = useCart();

  const sortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortType(value);

    const sorted = [...product].sort((a, b) =>
      value === "lowToHigh" ? a.price - b.price : b.price - a.price
    );
    setProduct(sorted);
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch recipes. Please try again later.");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProduct(data.products);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* <p className="text-(--main) pl-3 pb-2">All Products</p>
      <hr /> */}
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Spinner />
        </div>
      ) : (
        <div className="p-8 pb-20">
          <div className="flex justify-end mb-4">
            <select
              value={sortType}
              onChange={sortChange}
              className="border px-3 py-2 rounded"
            >
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-3">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {product.map((item) => (
              <div
                className="flex flex-col gap-3 shadow-2xl p-5 rounded-lg overflow-hidden"
                key={item.id}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="bg-slate-300 rounded-md w-full h-60 object-cover"
                />
                <Link href={`/details/${item.id}`}>
                  <h3 className="font-bold text-center h-12">{item.title}</h3>
                </Link>
                {/* <p>{item.description}</p> */}
                <p className="font-bold">M.R.P: ${item.price}</p>
                <p>{item.rating}⭐</p>
                <button
                  onClick={() => handleCart(item)}
                  className="border border-(--main) text-(--main) font-bold rounded-md py-2 hover:bg-(--main) hover:text-white"
                >
                  {" "}
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
