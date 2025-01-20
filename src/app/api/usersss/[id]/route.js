import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  // Extract ID from the URL path by splitting on '/'
  const urlParts = req.nextUrl.pathname.split("/");

  // Assuming the ID is the last part of the URL path (e.g., '/api/users/123456')
  const id = urlParts[urlParts.length - 1]; 

  // Parse the request body
  const { name, age, location } = await req.json();

  // Log the extracted ID for debugging
  console.log("Extracted ID:", id);

  // Check if the extracted ID is valid
  if (!ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid User ID" }),
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnect();

    // Update the profile in the database
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(id) }, // Find the user by ID
      { $set: { name, age, location } }, // Update the name, age, and location
      { returnDocument: "after" } // Return the updated user object
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify(updatedUser), // Return the updated user data
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update profile" }),
      { status: 500 }
    );
  }
}
