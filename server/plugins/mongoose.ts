import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig();

    if (!config.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in runtime config");
        return;
    }

    try {
        await mongoose.connect(config.MONGODB_URI as string);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
});
