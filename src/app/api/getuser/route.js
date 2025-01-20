import dbConnect from "@/helpers/dbConnect";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { db } = await dbConnect();
      const users = await db.collection("users").find().toArray();

      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
