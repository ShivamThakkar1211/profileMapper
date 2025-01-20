import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect(); // Ensure database connection

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 });
  }

  try {
    // Search for users whose names match the query (case-insensitive)
    const users = await User.find({ name: { $regex: query, $options: "i" } });

    if (users.length > 0) {
      return new Response(JSON.stringify({ success: true, users }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, message: "No users found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
