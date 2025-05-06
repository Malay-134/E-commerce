import connectToDatabase from "../../../../lib/db";
import Product from "../../../../models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find();
    return Response.json(products);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching products", { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newProduct = await Product.create(body);
    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}