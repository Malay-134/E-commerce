"use client";
import { getObjectIdFromNumber } from "@/utils/objectId";
import axios from "axios";
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
  _id: string;
  id: string;
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
  updateItemQuantity: (itemId: string, quantity: number) => void;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ProductType[]>([]);
  const router = useRouter();

  const fetchCart = async () => {
    //   const res = await fetch('/api/cart', {});
    //   const cartData = await res.json();
    //   setCart(cartData.cart);
    // };
    try {
      const res = await axios.get("/api/cart");
      console.log("RES", res);
      const cartData = res.data.cart;
      setCart(cartData);
      console.log("Cartdata", cartData);
      // console.log("response", res.data.cart);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const handleCart = async (item: ProductType) => {
    try {
      const isAuth = localStorage.getItem("isLogged");
      if (!isAuth) {
        toast.error("Please login to add items.");
        router.push("/login");
        return;
      }

      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;

      await axios.post("/api/cart", {
        productId: item._id,
        quantity,
      });
      console.log(item.id);
      if (existingItem) {
        updateItemQuantity(item.id, quantity);
      } else {
        const newItem = { ...item, quantity };
        setCart((prev) => [...prev, newItem]);
      }

      toast.success("Item added to cart!");
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error(err);
    }
  };
  // const handleCart = (item: ProductType) => {
  //   const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  //   if (existingItem) {
  //     updateItemQuantity(item.id, existingItem.quantity + 1);
  //     toast("Item quantity updated!");
  //     return;
  //   }
  //   const isAuth = localStorage.getItem("isLogged");
  //   if (!isAuth) {
  //     toast.success("Item added to cart!");
  //     router.push("/login");
  //   } else {
  //     console.log(item);
  //     console.log(cart);
  //     const newItem = { ...item, quantity: 1 };
  //     setCart((prev) => [...prev, newItem]);
  //     toast.success("Item added to cart!");
  //   }
  // };

  const deleteCartItem = async (itemId: ProductType) => {
    try {
      await axios.delete(`/api/cart?productId=${itemId.id}`);
      console.log("itemId.id", itemId.id);
      // console.log("itemId", itemId);
      // console.log(getObjectIdFromNumber(Number(itemId.id)));
      setCart((prev) => prev.filter((item) => item.id !== itemId.id));
      toast.success("Item removed!");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error(err);
    }
  };

  // const deleteCartItem = (item: ProductType) => {
  //   setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
  // };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  // const updateItemQuantity = (itemId: string, quantity: number) => {
  //   setCart((prev) =>
  //     prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
  //   );
  // };

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
