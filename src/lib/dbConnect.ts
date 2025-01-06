import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const connectDatabase = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Already connected with Database.")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "");
        connection.isConnected = db.connections[0].readyState
        console.log("Connected Successfully....");
    } catch (error) {
        console.log(error+"Database connection error");
        process.exit(1);
    }
}

export default connectDatabase;