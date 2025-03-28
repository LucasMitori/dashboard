<script setup lang="ts">
  import { NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";
  
  const props = defineProps({
    node: Object,
    updateAttributes: Function,
    extension: Object,
  });
  
  const languages = computed(() =>
    props.extension?.options.lowlight.listLanguages() ?? []
  );
  
  const selectedLanguage = computed({
    get: () => props.node?.attrs.language || "auto",
    set: (language) => props.updateAttributes?.({ language }),
  });
  
  const selectLanguage = (language: string) => {
    selectedLanguage.value = language;
  };
  </script>
  
  <style scoped>
  .code-block pre {
    background-color: #fcf8f8cc;
    border-radius: 6px;
    margin: 1em 0;
    padding: 10px;
    overflow: hidden;
  }
  
  .code-block pre code {
    display: block;
    padding: 1em;
    overflow-x: auto;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
    line-height: 1.5;
    color: #24292e;
  }
  </style>

<template>
    <node-view-wrapper class="code-block relative">
      <div class="absolute right-2 top-2 z-10">
        <v-select
          v-model="selectedLanguage"
          :items="languages"
          @change="selectLanguage"
          label="Language"
          dense
          outlined
          hide-details
          style="width: 150px"
        />
      </div>
      <pre><code><node-view-content /></code></pre>
    </node-view-wrapper>
</template>
  