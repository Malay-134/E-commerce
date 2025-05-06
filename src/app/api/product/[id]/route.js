import connectToDatabase from "../../../../../lib/db";
import Product from "../../../../../models/Product";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return Response.json(updatedProduct);
  } catch (error) {
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(params.id);
    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
