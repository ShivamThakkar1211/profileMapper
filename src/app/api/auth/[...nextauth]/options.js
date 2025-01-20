import dbConnect from '@/helpers/dbConnect';
import User from '@/models/User';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        const { name, email } = user;

        try {
          await dbConnect();

          // Check if the user exists
          let existingUser = await User.findOne({ email });
          // const adminEmail = process.env.ADMIN_EMAIL;
          // Create a new user if it doesn't exist
          if (!existingUser) {
            // You can set 'isAdmin' based on your condition, e.g., environment variable
            const isAdmin = process.env.ADMIN_EMAILS?.split(',').includes(email); // Example of setting admin users
            await User.create({ name, email, isAdmin });
            console.log('New user created:', name);
          } else {
            console.log('User already exists:', name);
          }

          return true; // Allow sign-in
        } catch (error) {
          console.error('Error during database operation:', error);
          return false; // Deny sign-in
        }
      }

      return false; // Deny sign-in for unsupported providers
    },
    async session({ session, token }) {
      // Add 'isAdmin' to the session object from the token
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.isAdmin = user.isAdmin; // Set the admin status in the session
      }

      return session;
    },
  },
};
