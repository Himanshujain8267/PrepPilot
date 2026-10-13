import mongoose from "mongoose";
const connectDb = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL?.trim();

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not configured in server/.env");
        }

        await mongoose.connect(mongoUrl);
        console.log("Database Connected");
    } catch (error) {
        console.error("Database Error:", error.message);
        throw error;
    }
}
export default connectDb