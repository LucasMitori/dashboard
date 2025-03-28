<script setup lang="ts">
  import { ref, defineProps } from "vue";
  import { NodeViewWrapper } from "@tiptap/vue-3";
  import type { NodeViewProps } from "@tiptap/vue-3";

  const props = defineProps<{
    node: any; 
    updateAttributes: (attributes: Record<string, any>) => void;
    deleteNode: () => void;
    decorations?: any; 
    selected?: boolean; 
    view?: any;
    getPos?: () => number;
  } & NodeViewProps>();

  const inputText = ref("");
  const showAltText = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileUpload = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        props.updateAttributes({ src });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateText = () => {
    const key = showAltText.value ? "alt" : "caption";
    props.updateAttributes({ [key]: inputText.value });
  };

  const toggleAltText = () => {
    showAltText.value = !showAltText.value;
    inputText.value = showAltText.value ? props.node.attrs.alt || "" : props.node.attrs.caption || "";
  };
</script>

<template>
  <node-view-wrapper class="max-w-full w-full my-6">
    <div v-if="node.attrs.src" class="relative group">
        <div class="rounded-lg overflow-hidden">
          <img
            :src="node.attrs.src"
            :alt="node.attrs.alt"
            class="w-full h-auto object-cover !my-1"
          />
          <div
            class="image-actions absolute top-1 left-0 right-0 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800/10 flex items-center justify-end px-2 space-x-2"
          >
            <v-btn
              @click="toggleAltText"
              variant="outlined"
              class="text-black text-xs py-1"
            >
              <v-icon class="mr-1">{{ showAltText ? "mdi-text-short" : "mdi-text-recognition" }}</v-icon>
              {{ showAltText ? "Caption" : "Alt Text" }}
            </v-btn>
            <v-btn
              @click="deleteNode"
              variant="outlined"
              color="error"
              class="text-xs py-1"
            >
              Delete
            </v-btn>
          </div>
        </div>
  
        <v-text-field
          v-if="showAltText"
          v-model="inputText"
          label="Alt Text"
          class="mt-2"
          dense
          hide-details
          variant="outlined"
          @input="updateText"
        />
        <v-text-field
          v-else
          v-model="inputText"
          label="Caption"
          class="mt-2"
          dense
          hide-details
          variant="outlined"
          @input="updateText"
        />
      </div>
      
      <div v-else class="upload-placeholder">
        <v-btn
          @click="triggerFileInput"
          variant="outlined"
          class="w-full text-gray-500 py-2"
        >
          <v-icon left>mdi-image-plus</v-icon>
          <span class="text-sm">Click to upload an image</span>
        </v-btn>
    </div>
    <!-- <input
      type="file"
      accept="image/*"
      @change="handleFileUpload"
      ref="fileInput"
      class="hidden"
    />
    <div v-if="!node.attrs.src" class="upload-placeholder">
      <button
        @click="triggerFileInput"
        class="bg-gray-300/40 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm flex items-center justify-center w-full h-16 transition duration-150 ease-in-out"
      >
        <v-icon name="mdi-image-plus" class="w-6 h-6 mr-3 text-gray-400" />
        <span class="text-gray-500 text-sm">Click to upload an image</span>
      </button>
    </div>
    <div v-else class="relative group">
      <div class="rounded-lg overflow-hidden">
        <img
          :src="node.attrs.src"
          :alt="node.attrs.alt"
          class="w-full h-auto object-cover !my-1"
        />
        <div
          class="image-actions absolute top-1 left-0 right-0 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800/10 flex items-center justify-end px-2 space-x-2"
        >
          <button
            class="bg-gray-100/90 rounded shadow-xs h-6 px-3 text-black font-medium text-xs"
            @click="triggerFileInput"
          >
            Replace
          </button>
          <button
            class="bg-gray-800/90 rounded shadow-xs h-6 px-3 text-white font-medium text-xs"
            @click="deleteNode"
          >
            Delete
          </button>
        </div>
      </div>
      <div class="flex items-center relative">
        <input
          type="text"
          v-model="inputText"
          @input="updateText"
          :placeholder="showAltText ? 'Add alt text' : 'Add a caption'"
          class="w-full px-1 py-1 text-sm text-gray-700 bg-transparent focus:outline-none transition duration-150 ease-in-out placeholder-gray-400"
        />
        <button
          @click="toggleAltText"
          class="absolute right-0 bottom-1 bg-transparent text-gray-900 text-[10px] font-medium px-2 py-1 rounded transition duration-150 ease-in-out flex items-center"
        >
          <v-icon
            :name="showAltText ? 'mdi-text-short' : 'mdi-text-recognition'"
            class="size-3 mr-1"
          />
          {{ showAltText ? "Caption" : "Alt Text" }}
        </button>
      </div>
    </div> -->
  </node-view-wrapper>
</template>

<style lang="css">
.upload-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed #aaa;
  border-radius: 8px;
  background-color: #f8f8f8;
}

.upload-placeholder v-btn {
  background-color: #fff;
  border-radius: 8px;
}

.image-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 4px;
  border-radius: 4px;
}

</style>
