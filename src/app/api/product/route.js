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
