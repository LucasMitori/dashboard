<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Calculator from "./calculator.vue";
import CallManager from "./callManager.vue";
import ChatSupport from "./chatSupport.vue";
import KnowledgeBase from "./knowledgeBase.vue";
import GlobalSearch from "./GlobalSearch.vue";

const icon = ref("mdi-fullscreen");
const calculatorModal = ref(false);
const callManagerModal = ref(false);
const chatSupportModal = ref(false);
const knowledgeBaseModal = ref(false);
const searchModal = ref(false);

const isDragging = ref(false);
const menuPosition = ref({
    x: window.innerWidth - 200,
    y: window.innerHeight - 230,
});
const isMenuOpen = ref(false);

const openCalculator = () => {
    calculatorModal.value = true;
};

const openCallManager = () => {
    callManagerModal.value = true;
};
const openChatSupport = () => {
    chatSupportModal.value = true;
};
const openKnowledgeBase = () => {
    knowledgeBaseModal.value = true;
};

const openSearch = (event: MouseEvent) => {
    event.stopPropagation();
    searchModal.value = true;
};

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement
            .requestFullscreen()
            .then(() => {
                icon.value = "mdi-fullscreen-exit";
            })
            .catch((err) => {
                console.error("Failed to enter fullscreen mode:", err);
            });
    } else {
        document
            .exitFullscreen()
            .then(() => {
                icon.value = "mdi-fullscreen";
            })
            .catch((err) => {
                console.error("Failed to exit fullscreen mode:", err);
            });
    }
};

const updatePosition = () => {
    menuPosition.value = {
        x: Math.min(menuPosition.value.x, window.innerWidth - 100),
        y: Math.min(menuPosition.value.y, window.innerHeight - 100),
    };
};

const startDrag = (event: MouseEvent) => {
    isDragging.value = true;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
};

const onDrag = (event: MouseEvent) => {
    if (isDragging.value) {
        menuPosition.value = {
            x: event.clientX - 40,
            y: event.clientY - 40,
        };
    }
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
};

onMounted(() => {
    window.addEventListener("resize", updatePosition);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updatePosition);
});
</script>

<template>
    <v-btn
        class="floating-menu"
        elevation="0"
        :style="{
            top: menuPosition.y + 'px',
            left: menuPosition.x + 'px',
            position: 'fixed',
        }"
        @mousedown="startDrag"
        @click="isMenuOpen = !isMenuOpen"
    >
        <nav class="menu">
            <input
                id="menu-open"
                type="checkbox"
                class="menu-open"
                name="menu-open"
            />
            <label class="menu-open-button" for="menu-open">
                <v-avatar rounded="0">
                    <v-icon>mdi-duck</v-icon>
                </v-avatar>
            </label>
            <button class="menu-item main-color" @click="openCalculator">
                <span class="mdi mdi-calculator-variant" />
            </button>
            <button class="menu-item main-color" @click="openCallManager">
                <span class="mdi mdi-phone" />
            </button>
            <button class="menu-item main-color" @click="openChatSupport">
                <span class="mdi mdi-chat" />
            </button>
            <button class="menu-item main-color" @click="openKnowledgeBase">
                <span class="mdi mdi-book-open-page-variant" />
            </button>
            <button class="menu-item main-color" @click="openSearch">
                <span class="mdi mdi-magnify" />
            </button>
            <button class="menu-item main-color" @click="toggleFullscreen">
                <span class="mdi" :class="icon" />
            </button>
        </nav>
    </v-btn>

    <Calculator v-model="calculatorModal" />
    <CallManager v-model="callManagerModal" />
    <ChatSupport v-model="chatSupportModal" />
    <KnowledgeBase v-model="knowledgeBaseModal" />
    <GlobalSearch v-model="searchModal" />
</template>

<style scoped>
.floating-menu {
    position: fixed;
    top: 78%;
    left: 76%;
    z-index: 1001;
}

.floating-menu-icon {
    color: black;
}

.menu-item,
.menu-open-button {
    overflow: hidden;
    outline: none;
    background: #2eab92;
    border-radius: 100%;
    width: 75px;
    height: 75px;
    margin-left: -40px;
    position: absolute;
    color: #ffffff;
    text-align: center;
    line-height: 75px;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-transition: -webkit-transform ease-out 200ms;
    transition: -webkit-transform ease-out 200ms;
    transition: transform ease-out 200ms;
    transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
}

.menu-open {
    display: none;
}

.menu-item .mdi {
    font-size: 2rem;
}

.floating-menu.v-btn {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

.dark-background {
    background-color: #1e1e1e;
}

.calculator-title {
    font-weight: bold;
    font-size: 1.5rem;
    color: white;
}

.calculator {
    display: flex;
    flex-direction: column;
    color: white;
}

.calculator-display {
    width: 100%;
    height: 60px;
    text-align: right;
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: white;
    background-color: #333;
}

.calculator-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.button-row {
    display: flex;
    gap: 10px;
}

button,
.close-btn {
    height: 50px;
    font-size: 1.2rem;
    background-color: #ffd700;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover,
.close-btn:hover {
    background-color: #e6ac00;
}

.close-btn {
    align-self: flex-end;
    background-color: transparent;
}

.lines {
    width: 25px;
    height: 3px;
    background: #596778;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -12.5px;
    margin-top: -1.5px;
    -webkit-transition: -webkit-transform 200ms;
    transition: -webkit-transform 200ms;
    transition: transform 200ms;
    transition: transform 200ms, -webkit-transform 200ms;
}

.line-1 {
    -webkit-transform: translate3d(0, -8px, 0);
    transform: translate3d(0, -8px, 0);
}

.line-2 {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}

.line-3 {
    -webkit-transform: translate3d(0, 8px, 0);
    transform: translate3d(0, 8px, 0);
}

.menu-open:checked + .menu-open-button .line-1 {
    -webkit-transform: translate3d(0, 0, 0) rotate(45deg);
    transform: translate3d(0, 0, 0) rotate(45deg);
}

.menu-open:checked + .menu-open-button .line-2 {
    -webkit-transform: translate3d(0, 0, 0) scale(0.1, 1);
    transform: translate3d(0, 0, 0) scale(0.1, 1);
}

.menu-open:checked + .menu-open-button .line-3 {
    -webkit-transform: translate3d(0, 0, 0) rotate(-45deg);
    transform: translate3d(0, 0, 0) rotate(-45deg);
}

.menu {
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 80px;
    height: 80px;
    text-align: center;
    box-sizing: border-box;
    font-size: 26px;
}

/* .menu-item {
   transition: all 0.1s ease 0s;
} */

.menu-item:hover {
    background: #104666;
    color: #3290b1;
}

.menu-item:nth-child(3) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-item:nth-child(4) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-item:nth-child(5) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-item:nth-child(6) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-item:nth-child(7) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-item:nth-child(8) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-item:nth-child(9) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
}

.menu-open-button {
    overflow: hidden;
    outline: none;
    z-index: 2;
    -webkit-transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -webkit-transition-duration: 400ms;
    transition-duration: 400ms;
    -webkit-transform: scale(1.1, 1.1) translate3d(0, 0, 0);
    transform: scale(1.1, 1.1) translate3d(0, 0, 0);
    cursor: pointer;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
}

.menu-open-button:hover {
    -webkit-transform: scale(1.2, 1.2) translate3d(0, 0, 0);
    transform: scale(1.2, 1.2) translate3d(0, 0, 0);
}

.menu-open:checked + .menu-open-button {
    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
    -webkit-transform: scale(0.8, 0.8) translate3d(0, 0, 0);
    transform: scale(0.8, 0.8) translate3d(0, 0, 0);
}

.menu-open:checked ~ .menu-item {
    -webkit-transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
    transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
}

.menu-open:checked ~ .menu-item:nth-child(3) {
    transition-duration: 180ms;
    -webkit-transition-duration: 180ms;
    -webkit-transform: translate3d(0.08361px, -104.99997px, 0);
    transform: translate3d(0.08361px, -104.99997px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(4) {
    transition-duration: 280ms;
    -webkit-transition-duration: 280ms;
    -webkit-transform: translate3d(90.9466px, -52.47586px, 0);
    transform: translate3d(90.9466px, -52.47586px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(5) {
    transition-duration: 380ms;
    -webkit-transition-duration: 380ms;
    -webkit-transform: translate3d(90.9466px, 52.47586px, 0);
    transform: translate3d(90.9466px, 52.47586px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(6) {
    transition-duration: 480ms;
    -webkit-transition-duration: 480ms;
    -webkit-transform: translate3d(0.08361px, 104.99997px, 0);
    transform: translate3d(0.08361px, 104.99997px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(7) {
    transition-duration: 580ms;
    -webkit-transition-duration: 580ms;
    -webkit-transform: translate3d(-90.86291px, 52.62064px, 0);
    transform: translate3d(-90.86291px, 52.62064px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(8) {
    transition-duration: 680ms;
    -webkit-transition-duration: 680ms;
    -webkit-transform: translate3d(-91.03006px, -52.33095px, 0);
    transform: translate3d(-91.03006px, -52.33095px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(9) {
    transition-duration: 780ms;
    -webkit-transition-duration: 780ms;
    -webkit-transform: translate3d(-0.25084px, -104.9997px, 0);
    transform: translate3d(-0.25084px, -104.9997px, 0);
}

.main-color {
    background-color: #4dacbf;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.main-color:hover {
    color: #4dacbf;
    text-shadow: none;
}

.green {
    background-color: #70cc72;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.green:hover {
    color: #70cc72;
    text-shadow: none;
}

.red {
    background-color: #fe4365;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.red:hover {
    color: #fe4365;
    text-shadow: none;
}

.purple {
    background-color: #c49cde;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.purple:hover {
    color: #c49cde;
    text-shadow: none;
}

.orange {
    background-color: #fc913a;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.orange:hover {
    color: #fc913a;
    text-shadow: none;
}

.lightblue {
    background-color: #62c2e4;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
}

.lightblue:hover {
    color: #62c2e4;
    text-shadow: none;
}

.credit {
    margin: 24px 20px 120px 0;
    text-align: right;
    color: #eeeeee;
}

.credit a {
    padding: 8px 0;
    color: #c49cde;
    text-decoration: none;
    transition: all 0.3s ease 0s;
}

.credit a:hover {
    text-decoration: underline;
}

/* Calculator Stylish */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Courier New", Courier, monospace;
}

/* Add styles for the calculator modal */

.container {
    position: relative;
    min-width: 300px;
    min-height: 400px;
    padding: 40px 30px 30px;
    border-radius: 20px;
    box-shadow: 25px 25px 75px rgba(0, 0, 0, 0.25),
        10px 10px 70px rgba(0, 0, 0, 0.25),
        inset -5px -5px 15px rgba(0, 0, 0, 0.25),
        inset 5px 5px 15px rgba(0, 0, 0, 0.25);
}
.container span {
    color: #fff;
    position: relative;
    display: grid;
    width: 80px;
    place-items: center;
    margin: 8px;
    height: 80px;
    background: linear-gradient(180deg, #2f2f2f, #3f3f3f);
    box-shadow: inset -8px 0 8px rgba(0, 0, 0, 0.15),
        inset 0 -8px 8px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(0, 0, 0, 0.75),
        10px 20px 25px rgba(0, 0, 0, 0.4);
    user-select: none;
    cursor: pointer;
    font-weight: 400;
    border-radius: 10px;
}
.calculator span:active {
    filter: brightness(1.5);
}
.calculator span::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 4px;
    bottom: 14px;
    right: 12px;
    border-radius: 10px;
    background: linear-gradient(90deg, #2d2d2d, #4d4d4d);
    box-shadow: -5px -5px 15px rgba(0, 0, 0, 0.1),
        10px 5px 10px rgba(0, 0, 0, 0.15);
    border-left: 1px solid #0004;
    border-bottom: 1px solid #0004;
    border-top: 1px solid #0009;
}
.calculator span i {
    position: relative;
    font-style: normal;
    font-size: 1.5em;
    text-transform: uppercase;
}
.calculator {
    position: relative;
    display: grid;
}
.calculator .value {
    position: relative;
    grid-column: span 4;
    height: 100px;
    width: calc(100% - 20px);
    left: 10px;
    border: none;
    outline: none;
    background-color: #a7af7c;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.75);
    text-align: right;
    padding: 10px;
    font-size: 2em;
}
.calculator .clear {
    grid-column: span 2;
    width: 180px;
    background: #f00;
}
.calculator .clear::before {
    background: linear-gradient(90deg, #d20000, #ffffff5c);
    border-left: 1px solid #fff4;
    border-bottom: 1px solid #fff4;
    border-top: 1px solid #fff4;
}
.calculator .plus {
    grid-row: span 2;
    height: 180px;
}
.calculator .equal {
    background: #2196f3;
}
.calculator .equal::before {
    background: linear-gradient(90deg, #1479c9, #ffffff5c);
    border-left: 1px solid #fff4;
    border-bottom: 1px solid #fff4;
    border-top: 1px solid #fff4;
}
</style>
