import mongoose from "mongoose";

type ConnectionObject = {
    isConnected: number | null; // Explicit type
};

const connection: ConnectionObject = {
    isConnected: null,
};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const db = await mongoose.connect(uri);

        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error; // Let the caller handle the failure gracefully
    }
}

export default dbConnect;
