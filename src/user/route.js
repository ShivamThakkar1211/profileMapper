const { default: dbConnect } = require("@/helpers/dbConnect");
const { default: User } = require("@/models/User");
const { NextResponse } = require("next/server");


export async function POST(request) {
  const { email, name, image } = await request.json();
  await dbConnect();
  await User.create({ email, name, image });
    return NextResponse.redirect({message:"User created successfully",status:200})}