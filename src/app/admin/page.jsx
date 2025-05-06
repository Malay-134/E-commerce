"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      console.log("Status:", res.status, res.statusText);
      console.log("Fetched Data:", res.data);
      setProducts(res.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
    // const res = await fetch("/api/products");
    // const data = await res.json();
    // setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/product/${editingId}` : "/api/product";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ title: "", price: "", description: "", thumbnail: "" });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/product/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Product</button>
      </form>

      <div>
        <h2>Product List</h2>
        {products.map((product) => (
          <div
            key={product._id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <p>
              <strong>{product.title}</strong> - ${product.price}
            </p>
            <img src={product.thumbnail} alt={product.title} width={100} />
            <p>{product.description}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button
              onClick={() => handleDelete(product._id)}
              style={{ marginLeft: 10 }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
