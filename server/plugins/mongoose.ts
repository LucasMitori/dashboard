// server/plugins/mongoose.ts
import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig();
    try {
        await mongoose.connect(config.MONGODB_URI as string);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
});
