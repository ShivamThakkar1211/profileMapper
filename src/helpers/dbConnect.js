import mongoose from 'mongoose';

// Create a connection object to track the connection state
const connection = {};

async function dbConnect() {
  // Check if we're already connected to the database
  if (connection.isConnected) {
    console.log('Database already connected');
    return; // Return early if already connected
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Set the connection state to connected
    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Graceful exit in case of a connection error
  }
}

export default dbConnect;
