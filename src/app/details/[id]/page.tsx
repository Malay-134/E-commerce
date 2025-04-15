"use client";
import Product from "@/components/Product";
import { useCart } from "@/context/cartContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ReviewType = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type ProductType = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviews: ReviewType[];
  quantity: number;
};

export default function ProductDetails() {
  const { id } = useParams();
  const { handleCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product details.");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        console.log(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching product details:", err);
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Loading...</p>;
  return (
    <div className="flex gap-3 p-8">
      <div>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-[90%] border border-(--main) max-w-lg h-80 object-cover rounded-lg"
        />
      </div>
      <div className="flex-col gap-3">
        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
        <p className="mt-4">{product.description}</p>
        <p className="mt-2 font-bold">Price: ${product.price}</p>
        <p className="mt-1">Rating: {product.rating}</p>
        <ul>
          {product.reviews.slice(0, 2).map((review, index) => (
            <li key={index}>
              "{review.comment}" — {review.reviewerName}
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleCart(product)}
          className="border border-(--main) text-(--main) px-3 py-2 font-bold rounded-md mt-1"
        >
          {" "}
          Add to cart
        </button>
      </div>
    </div>
  );
}
