"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

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

type CartContextType = {
  cart: ProductType[];
  handleCart: (item: ProductType) => void;
  deleteCartItem: (item: ProductType) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ProductType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart]);

  const handleCart = (item: ProductType) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateItemQuantity(item.id, existingItem.quantity + 1);
      toast("Item quantity updated!");
      return;
    }
    const isAuth = localStorage.getItem("isLogged");
    if (!isAuth) {
      toast.success("Item added to cart!");
      router.push("/login");
    } else {
      console.log(item);
      console.log(cart);
      const newItem = { ...item, quantity: 1 };
      setCart((prev) => [...prev, newItem]);
      toast.success("Item added to cart!");
    }
  };
  const deleteCartItem = (item: ProductType) => {
    setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
  };

  const updateItemQuantity = (itemId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  return (
    <cartContext.Provider
      value={{ cart, handleCart, deleteCartItem, updateItemQuantity }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
