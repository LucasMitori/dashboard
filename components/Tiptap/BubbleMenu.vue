<script setup lang="ts">

import { Editor, BubbleMenu } from "@tiptap/vue-3";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { Editor as CoreEditor } from "@tiptap/core";
    
    interface TextAction {
        name: string;
        label: string;
        icon: string;
        command: () => void;
    }
    
    const props = defineProps<{
        editor?: Editor;
    }>();
    
    const shouldShow = (props: {
        editor: CoreEditor;
        view: EditorView;
        state: EditorState;
        oldState?: EditorState;
        from: number;
        to: number;
    }) => {
        const { state } = props;
        const { selection } = state;
        const { empty } = selection;
        return !empty;
    };
    
    const textActions: TextAction[] = [
        {
        name: "bold",
        label: "Bold",
        icon: "mdi-format-bold",
        command: () => props.editor?.chain().focus().toggleBold().run(),
        },
        {
        name: "italic",
        label: "Italic",
        icon: "mdi-format-italic",
        command: () => props.editor?.chain().focus().toggleItalic().run(),
        },
        {
        name: "strike",
        label: "Strikethrough",
        icon: "mdi-format-strikethrough",
        command: () => props.editor?.chain().focus().toggleStrike().run(),
        },
        {
        name: "bulletList",
        label: "Bullet List",
        icon: "mdi-format-list-bulleted",
        command: () => props.editor?.chain().focus().toggleBulletList().run(),
        },
        {
        name: "orderedList",
        label: "Numbered List",
        icon: "mdi-format-list-numbered",
        command: () => props.editor?.chain().focus().toggleOrderedList().run(),
        },
        {
        name: "codeBlock",
        label: "Code Block",
        icon: "mdi-code-tags",
        command: () => props.editor?.chain().focus().toggleCodeBlock().run(),
        },
        {
        name: "blockquote",
        label: "Quote",
        icon: "mdi-format-quote-close",
        command: () => props.editor?.chain().focus().toggleBlockquote().run(),
        },
    ];
    
    const colors = [
        { title: "Default", value: "inherit" },
        { title: "Gray", value: "#6B7280" },
        { title: "Brown", value: "#92400E" },
        { title: "Orange", value: "#EA580C" },
        { title: "Yellow", value: "#CA8A04" },
        { title: "Green", value: "#16A34A" },
        { title: "Blue", value: "#2563EB" },
        { title: "Purple", value: "#9333EA" },
        { title: "Pink", value: "#DB2777" },
        { title: "Red", value: "#DC2626" },
    ];
    
    const setTextColor = (color: string) => {
        props.editor?.chain().focus().setColor(color).run();
    };
</script>

<template>
    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
      :should-show="shouldShow"
      class="flex bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2.5"
    >
        <div
            style="overflow-x: auto; display: flex; gap: 8px; width: 250px; white-space: nowrap; padding: 10px"
        >
            <div
            v-for="action in textActions"
            :key="action.name"
            style="display: inline-block;"
            >
            <v-btn
                icon
                :color="editor.isActive(action.name) ? 'primary' : ''"
                @click="action.command()"
                :title="action.label"
                size="small"
            >
                <v-icon :icon="action.icon" class="h-5 w-5"></v-icon>
            </v-btn>
            </div>
            <v-menu
            transition="slide-x-transition"
            >
            <template v-slot:activator="{ props }">
                <v-btn
                v-bind="props"
                icon
                size="small"
                title="Text Color"
                style="margin: 0px 5px"
                >
                <v-icon icon="mdi-palette" class="h-5 w-5"></v-icon>
                </v-btn>
            </template>
            
            <v-list>
                <v-list-item
                v-for="(item, i) in colors"
                :key="i"
                @click="setTextColor(item.value)"
                >
            
                <template v-slot:prepend>
                    <div 
                        :style="{
                            backgroundColor: item.value, 
                            width: '16px', 
                            height: '16px',
                            borderRadius: '50%',
                            border: '0.3px solid black',
                            marginRight: '5px',
                        }"
                    
                    ></div>
                </template>
            
                <v-list-item-title
                    :style="{ color: item.value }"
                >
                    {{ item.title }}
                </v-list-item-title>
                </v-list-item>
            </v-list>
            </v-menu>
        </div>
    </bubble-menu>
</template>
  
<style lang="css" scoped>

/* Firefox (uncomment to work in Firefox, although other properties will not work!)  */
/** {
  scrollbar-width: thin;
  scrollbar-color: #397524 #DFE9EB;
}*/

/* Chrome, Edge and Safari */
*::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }
  *::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: #DFE9EB;
  }
  
  *::-webkit-scrollbar-track:hover {
    background-color: #B8C0C2;
  }
  
  *::-webkit-scrollbar-track:active {
    background-color: #B8C0C2;
  }
  
  *::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #104666;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background-color: #4dacbf;
  }
  
  *::-webkit-scrollbar-thumb:active {
    background-color: #6bbcca;
  }
  
</style>