"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: "",
    rating: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      // console.log("Status:", res.status, res.statusText);
      // console.log("Fetched Data:", res.data);
      setProducts(res.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/product/${editingId}` : "/api/product";

    const formattedForm = {
      ...form,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating),
    };
    console.log(form);
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedForm),
    });

    setForm({
      title: "",
      price: "",
      description: "",
      thumbnail: "",
      rating: "",
    });
    setEditingId(null);
    toast.success("Product updated successfully");
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      thumbnail: product.thumbnail || "",
      rating: product.rating?.toString() || "",
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
    try {
      await fetch(`/api/product/${id}`, { method: "DELETE" });
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-center bg-black font-bold text-white py-4 text-3xl rounded-xl mb-6 shadow-md">
        Admin Panel
      </h1>
      <div className="flex justify-between items-center gap-5 w-[100%]">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4 mb-10 w-[100%]"
        >
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          {["title", "price", "description", "thumbnail", "rating"].map(
            (field) => (
              <div className="flex flex-col" key={field}>
                <label
                  htmlFor={field}
                  className="mb-1 text-sm font-medium text-gray-700 capitalize"
                >
                  {field}
                </label>
                <input
                  id={field}
                  type={
                    field === "price"
                      ? "number"
                      : field === "rating"
                      ? "number"
                      : field === "thumbnail"
                      ? "url"
                      : "text"
                  }
                  placeholder={
                    field === "title"
                      ? "Product Name"
                      : field === "price"
                      ? "0.00"
                      : field === "rating"
                      ? "0.0"
                      : field === "thumbnail"
                      ? "https://example.com/image.jpg"
                      : `Enter ${field}`
                  }
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            {editingId ? "Update" : "Add"} Product
          </button>
        </form>

        <div className="max-w-6xl mx-auto p-4 w-[100%] overflow-auto scroll-auto h-screen">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Product List
          </h2>

          {products.length === 0 ? (
            <p className="text-center text-gray-600">No products available.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between hover:shadow-lg"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold text-blue-700 mb-4">
                        ${product.price}
                      </p>
                      <p className="font-semibold text-blue-700 mb-4">
                        {product.rating}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full text-(--main) transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
