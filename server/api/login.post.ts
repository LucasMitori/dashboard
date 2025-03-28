import { defineEventHandler, readBody } from "h3";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    const user = await User.findOne({ username });
    console.log("USER", user);
    if (user && user.password === password) {
        return {
            success: true,
            message: "Login successful",
            token: "dummy-token",
        };
    }
    return { success: false, message: "Invalid credentials" };
});
