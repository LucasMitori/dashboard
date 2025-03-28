<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Commands from "~/components/Tiptap/extensions/Commands";
import suggestion from "~/components/Tiptap/extensions/Suggestion";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import ImageUploadNode from "~/components/Tiptap/extensions/ImageUpload";

const props = defineProps({
    content: {
        type: String,
        default: "",
        required: true,
    },
    replyMode: {
        type: Boolean,
        default: false,
    },
    ForwardMode: {
        type: Boolean,
        default: false,
    },
});

const emailContent = ref("");
const editor = useEditor({
    content: emailContent.value,
    extensions: [
        StarterKit,
        TextStyle,
        Color,
        Underline,
        Link,
        Image,
        ImageUploadNode,
        Placeholder.configure({
            placeholder: 'Type "/" for commands',
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"],
            defaultAlignment: "left",
        }),
        Commands.configure({
            suggestion,
        }),
    ],
    editorProps: {
        attributes: {
            class: "text-gray-800 focus:outline-none w-full h-full",
        },
    },
});

const updateEmailContent = () => {
    if (props.replyMode) {
        emailContent.value = "";
    } else {
        emailContent.value = props.content;
    }

    editor.value?.commands.setContent(emailContent.value);
};

onMounted(() => {
    updateEmailContent();
});

watch(
    [() => props.replyMode, () => props.ForwardMode, () => props.content],
    () => {
        updateEmailContent();
    }
);

onBeforeUnmount(() => {
    editor.value?.destroy();
});

const insertImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = () => {
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result as string;
                editor.value
                    ?.chain()
                    .focus()
                    .insertContent(`<image-upload src="${imageUrl}" />`)
                    .run();
            };
            reader.readAsDataURL(file);
        }
    };

    fileInput.click();
};
</script>

<template>
    <v-row align="center" justify="end" class="my-3 px-3">
        <v-btn
            prepend-icon="mdi-image-plus"
            @click="insertImage"
            variant="outlined"
        >
            Upload Image
        </v-btn>
    </v-row>

    <editor-content :editor="editor" class="editor-content" />

    <tiptap-bubble-menu :editor="editor" v-if="editor" />
</template>

<style lang="css">
.editor-content {
    width: 100%;
    min-height: 280px;
    padding: 10px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: left;
    vertical-align: top;
}

.editor-content:empty::before {
    content: attr(data-placeholder);
    color: #aaa;
    display: block;
    padding-left: 5px;
}

p.is-editor-empty:first-child::before {
    color: var(--gray-4);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

.tiptap pre {
    background-color: #fcf8f8cc;
    border-radius: 6px;
    margin: 1em 0;
    padding: 10px;
    overflow: hidden;
}

.tiptap pre code {
    display: block;
    padding: 1em;
    overflow-x: auto;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
    line-height: 1.5;
    color: #24292e;
}

.hljs-comment,
.hljs-quote {
    color: #6a737d;
    font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag {
    color: #d73a49;
}

.hljs-string,
.hljs-attr,
.hljs-variable,
.hljs-template-variable {
    color: #032f62;
}

/* more syntax highlighting styles */
</style>
