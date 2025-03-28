import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import type { Instance as TippyInstance } from "tippy.js";
import { Editor, type Range } from "@tiptap/core";
import CommandsList from "../CommandsList.vue";

export interface SuggestionItem {
    name: string;
    description: string;
    icon: string;
    command: (props: { editor: Editor; range: Range }) => void;
}

interface SuggestionProps {
    query: string;
    editor: Editor;
    range: Range;
    clientRect: () => DOMRect;
}

const items: SuggestionItem[] = [
    {
        name: "Text",
        description: "Just start writing with plain text.",
        icon: "mdi-text",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
        },
    },
    {
        name: "Heading 1",
        description: "Big section heading.",
        icon: "mdi-format-header-1",
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
        },
    },
    {
        name: "Heading 2",
        description: "Secondary heading.",
        icon: "mdi-format-header-2",
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
        },
    },
    {
        name: "Bold",
        description: "Make selected text bold.",
        icon: "mdi-format-bold",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBold().run();
        },
    },
    {
        name: "Italic",
        description: "Make selected text italic.",
        icon: "mdi-format-italic",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleItalic().run();
        },
    },
    {
        name: "Underline",
        description: "Underline selected text.",
        icon: "mdi-format-underline",
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleMark("underline")
                .run();
        },
    },
    {
        name: "Strikethrough",
        description: "Strike through selected text.",
        icon: "mdi-format-strikethrough",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleStrike().run();
        },
    },
    {
        name: "Link",
        description: "Insert a hyperlink.",
        icon: "mdi-link",
        command: ({ editor, range }) => {
            const url = prompt("Enter the URL:");
            if (url) {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setLink({ href: url })
                    .run();
            }
        },
    },
    {
        name: "Blockquote",
        description: "Insert a blockquote.",
        icon: "mdi-format-quote-close",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setBlockquote().run();
        },
    },
    {
        name: "Ordered List",
        description: "Create an ordered list.",
        icon: "mdi-format-list-numbered",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        name: "Unordered List",
        description: "Create an unordered list.",
        icon: "mdi-format-list-bulleted",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        name: "Code Block",
        description: "Insert a code block.",
        icon: "mdi-code-tags",
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("codeBlock")
                .run();
        },
    },
    {
        name: "Horizontal Rule",
        description: "Insert a horizontal rule.",
        icon: "mdi-minus",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
    },
    {
        name: "Image",
        description: "Insert an image.",
        icon: "mdi-image",
        command: ({ editor, range }) => {
            const url = prompt("Enter the image URL:");
            if (url) {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setImage({ src: url })
                    .run();
            }
        },
    },
    {
        name: "Undo",
        description: "Undo the last action.",
        icon: "mdi-undo",
        command: ({ editor }) => {
            editor.chain().focus().undo().run();
        },
    },
    {
        name: "Redo",
        description: "Redo the last undone action.",
        icon: "mdi-redo",
        command: ({ editor }) => {
            editor.chain().focus().redo().run();
        },
    },
    {
        name: "Clear Formatting",
        description: "Clear all formatting.",
        icon: "mdi-format-clear",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).unsetAllMarks().run();
        },
    },
    // Add more items as needed...
];

export const suggestion = {
    items: ({ query }: { query: string }): SuggestionItem[] => {
        return items.filter((item) =>
            item.name.toLowerCase().startsWith(query.toLowerCase())
        );
    },

    render: () => {
        let component: VueRenderer;
        let popup: TippyInstance;

        return {
            onStart: (props: SuggestionProps) => {
                component = new VueRenderer(CommandsList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                popup = tippy(document.body, {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element ?? "",
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                    popperOptions: {
                        modifiers: [
                            {
                                name: "preventOverflow",
                                options: {
                                    boundary: "viewport",
                                },
                            },
                        ],
                    },
                    onShow(instance) {
                        const popupElement = instance.popper;
                        popupElement.style.maxHeight = "300px";
                        popupElement.style.overflowY = "auto";
                    },
                });
            },

            onUpdate(props: SuggestionProps) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup.setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props: { event: KeyboardEvent }) {
                if (props.event.key === "Escape") {
                    popup.hide();
                    return true;
                }

                return component.ref?.onKeyDown(props.event);
            },

            onExit() {
                popup.destroy();
                component.destroy();
            },
        };
    },
};

export default suggestion;
