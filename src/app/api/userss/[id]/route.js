import dbConnect from '@/helpers/dbConnect';
import User from '@/models/User'; // Ensure the User model is correctly imported
import { Types } from 'mongoose';

export async function DELETE(req, { params }) {
    const { id } = params;

    console.log('Params received:', params); // Debugging params
    console.log('Received ID for deletion:', id); // Debugging ID

    // Validate the `id`
    if (!Types.ObjectId.isValid(id)) {
        console.error('Invalid ID format:', id);
        return new Response(JSON.stringify({ error: 'Invalid ID format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await dbConnect();
        console.log('Database connection established');

        // Perform deletion
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            console.warn(`No user found with ID: ${id}`);
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('User deleted successfully:', result);
        return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
