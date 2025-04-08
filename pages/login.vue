<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "#imports";

useHead({
    title: "Login",
    meta: [
        {
            name: "description",
            content: "Login page for the Maruth dashboard",
        },
    ],
});

definePageMeta({
    layout: "auth",
    auth: false,
});

const router = useRouter();
const username = ref("");
const password = ref("");
const isAnimating = ref(false);
const unlockOnTop = ref(false);

const login = async () => {
    // Simple check for username and password instead of an API call
    if (username.value === "admin" && password.value === "1234") {
        // Start animation on successful login
        isAnimating.value = true;
        setTimeout(() => {
            unlockOnTop.value = true;
        }, 750);
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    } else {
        alert("Invalid credentials or login error");
        console.error("Invalid login attempt with username:", username.value);
    }
};
</script>

<template>
    <v-container class="login-container">
        <div class="split-screen" :class="{ animate: isAnimating }">
            <div class="left">
                <img src="/img/left.png" alt="Logo" class="panel-logo" />
            </div>
            <div class="right">
                <img src="/img/right.png" alt="Logo" class="panel-logo" />
            </div>
        </div>

        <v-card class="login-card" elevation="10">
            <v-card-title class="text-center">Welcome Back</v-card-title>
            <v-card-subtitle class="text-center">
                Sign in to continue
            </v-card-subtitle>
            <v-card-text>
                <v-form @submit.prevent="login">
                    <v-text-field
                        v-model="username"
                        label="Username"
                        required
                        variant="outlined"
                    />
                    <v-text-field
                        v-model="password"
                        label="Password"
                        type="password"
                        required
                        variant="outlined"
                    />
                    <v-btn block color="primary" type="submit">Login</v-btn>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn small color="secondary" class="mr-2">Register</v-btn>
                <v-btn small color="info">Login with Google</v-btn>
            </v-card-actions>
        </v-card>

        <div
            v-if="isAnimating"
            class="unlock-animation"
            :style="{ zIndex: unlockOnTop ? 3 : 1 }"
        >
            <div class="unlock-circle">
                <v-icon size="48" color="white">mdi-lock-open</v-icon>
            </div>
        </div>
    </v-container>
</template>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
}

/* Split-screen panels */
.split-screen {
    position: absolute;
    width: 100vw;
    height: 100%;
    display: flex;
    z-index: 0;
}
.left,
.right {
    flex: 1;
    background-color: #e0e0e0;
    transition: transform 1.5s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Slide panels apart */
.animate .left {
    transform: translateX(-100%);
}
.animate .right {
    transform: translateX(100%);
}

/* Centered login card styling */
.login-card {
    width: 500px;
    height: 400px;
    z-index: 2;
    border-radius: 20px;
}

/* Logos in panels */
.panel-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
}

/* Unlock animation element */
.unlock-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: unlockUp 1.5s forwards;
}

/* Circle containing the unlock icon */
.unlock-circle {
    width: 100px;
    height: 100px;
    background-color: #104666;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    animation: pulse 1.5s infinite;
    z-index: 100;
}

/* Keyframes for upward movement */
@keyframes unlockUp {
    0% {
        transform: translate(-50%, -50%);
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        transform: translate(-50%, calc(-50% - 350px));
        opacity: 0;
    }
}

/* Keyframes for pulse effect */
@keyframes pulse {
    0% {
        transform: scale(0.9);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(0.9);
    }
}
</style>

<!-- <script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { useHead } from "#imports";

useHead({
    title: "Login",
    meta: [
        {
            name: "description",
            content: "Login page for the Maruth dashboard",
        },
    ],
});

definePageMeta({
    layout: "auth",
    auth: false,
});

const router = useRouter();
const username = ref("");
const password = ref("");
const auth = useAuthStore();
const isAnimating = ref(false);
const unlockOnTop = ref(false);

const login = async () => {
    try {
        // Call the login action in your auth store which uses your API endpoint
        await auth.login(username.value, password.value);

        // Start animation on successful login
        isAnimating.value = true;
        setTimeout(() => {
            unlockOnTop.value = true;
        }, 750);
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    } catch (error) {
        alert("Invalid credentials or login error");
        console.error(error);
    }
};
</script>

<template>
    <v-container class="login-container">
        <div class="split-screen" :class="{ animate: isAnimating }">
            <div class="left">
                <img src="/img/left.png" alt="Logo" class="panel-logo" />
            </div>
            <div class="right">
                <img src="/img/right.png" alt="Logo" class="panel-logo" />
            </div>
        </div>

        <v-card class="login-card" elevation="10">
            <v-card-title class="text-center">Welcome Back</v-card-title>
            <v-card-subtitle class="text-center">
                Sign in to continue
            </v-card-subtitle>
            <v-card-text>
                <v-form @submit.prevent="login">
                    <v-text-field
                        v-model="username"
                        label="Username"
                        required
                        variant="outlined"
                    />
                    <v-text-field
                        v-model="password"
                        label="Password"
                        type="password"
                        required
                        variant="outlined"
                    />
                    <v-btn block color="primary" type="submit">Login</v-btn>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn small color="secondary" class="mr-2">Register</v-btn>
                <v-btn small color="info">Login with Google</v-btn>
            </v-card-actions>
        </v-card>

        <div
            v-if="isAnimating"
            class="unlock-animation"
            :style="{ zIndex: unlockOnTop ? 3 : 1 }"
        >
            <div class="unlock-circle">
                <v-icon size="48" color="white">mdi-lock-open</v-icon>
            </div>
        </div>
    </v-container>
</template>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
}

/* Split-screen panels */
.split-screen {
    position: absolute;
    width: 100vw;
    height: 100%;
    display: flex;
    z-index: 0;
}
.left,
.right {
    flex: 1;
    background-color: #e0e0e0;
    transition: transform 1.5s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Slide panels apart */
.animate .left {
    transform: translateX(-100%);
}
.animate .right {
    transform: translateX(100%);
}

/* Centered login card styling */
.login-card {
    width: 500px;
    height: 400px;
    z-index: 2;
    border-radius: 20px;
}

/* Logos in panels */
.panel-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
}

/* Unlock animation element */
.unlock-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* z-index is dynamically bound: initially 1 (behind card), then 3 */
    animation: unlockUp 1.5s forwards;
}

/* Circle containing the unlock icon */
.unlock-circle {
    width: 100px;
    height: 100px;
    background-color: #104666;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    animation: pulse 1.5s infinite;
    z-index: 100;
}

/* Keyframes for upward movement */
@keyframes unlockUp {
    0% {
        transform: translate(-50%, -50%);
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        transform: translate(-50%, calc(-50% - 350px));
        opacity: 0;
    }
}

/* Keyframes for pulse effect */
@keyframes pulse {
    0% {
        transform: scale(0.9);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(0.9);
    }
}
</style> -->
