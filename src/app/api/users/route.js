import { MongoClient } from "mongodb";

// MongoDB connection URI
const MONGO_URI = process.env.MONGODB_URI;

// MongoDB database name
const DATABASE_NAME = "users";

// Create a MongoDB client instance
const client = new MongoClient(MONGO_URI);

async function connectToDatabase() {
  if (!client.isConnected) {
    await client.connect();
  }
  const db = client.db(DATABASE_NAME);
  return db;
}

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const users = await usersCollection.find().toArray();
    return new Response(JSON.stringify({ success: true, data: users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const body = await req.json();
    const { name, age, location, latitude, longitude, email } = body;

    // Validate input fields
    if (!name || !age || !latitude || !longitude || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid input data. All fields are required.",
        }),
        { status: 400 }
      );
    }

    // Check if the email already exists in the database
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email already exists.",
        }),
        { status: 400 }
      );
    }

    // Prepare the new user object
    const newUser = {
      name,
      age: parseInt(age, 10),
      location,
      latitude,
      longitude,
      email,  // Ensure email is part of the new user object
      createdAt: new Date(),
    };

    // Insert the new user into the collection
    const result = await usersCollection.insertOne(newUser);
    return new Response(
      JSON.stringify({
        success: true,
        message: "User added successfully",
        data: result,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
