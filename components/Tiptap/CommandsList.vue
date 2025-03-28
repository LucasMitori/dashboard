<script setup lang="ts">
import type { SuggestionItem } from "./extensions/Suggestion";

interface Props {
  items: SuggestionItem[];
  command: (item: SuggestionItem) => void;
}

const props = defineProps<Props>();

const selectedIndex = ref(0);
const containerRef = ref<HTMLElement | null>(null);
const itemRefs = ref<(HTMLElement | null)[]>([]);

const setItemRef = (el: HTMLElement | null, index: number) => {
  itemRefs.value[index] = el;
//   console.log("Item refs:", itemRefs.value);
};


const selectItem = (index: number) => {
  props.command(props.items[index]);
};

const scrollToSelected = () => {
  nextTick(() => {
    const selectedElement = itemRefs.value[selectedIndex.value];
    const container = containerRef.value;

    if (selectedElement && container) {
      const elementTop = selectedElement.offsetTop;
      const elementHeight = selectedElement.offsetHeight;
      const containerHeight = container.clientHeight;

    //   console.log("Element positions:", { elementTop, elementHeight, containerHeight });

      if (elementTop < container.scrollTop) {
        container.scrollTop = elementTop;
      } else if (elementTop + elementHeight > container.scrollTop + containerHeight) {
        container.scrollTop = elementTop + elementHeight - containerHeight;
      }
    }
  });
};

const onKeyDown = (event: KeyboardEvent): boolean => {
  if (event.key === "ArrowUp") {
    selectedIndex.value =
      (selectedIndex.value - 1 + props.items.length) % props.items.length;
    // console.log("Arrow Up Pressed:", selectedIndex.value);
    scrollToSelected();
    return true;
  }
  if (event.key === "ArrowDown") {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
    // console.log("Arrow Down Pressed:", selectedIndex.value);
    scrollToSelected();
    return true;
  }
  if (event.key === "Enter") {
    selectItem(selectedIndex.value);
    return true;
  }
  return false;
};

// watch(selectedIndex, (newIndex) => {
//   console.log("Selected index changed:", newIndex);
// });

defineExpose({
  onKeyDown,
});
</script>


<template>
  <div
    ref="containerRef"
    class="bg-white max-h-80 overflow-y-auto overflow-x-hidden border border-gray-200 shadow-lg rounded-lg py-2 w-64"
    >
    <div class="px-3 py-2 text-sm text-gray-500 font-medium">Available Commands</div>
    <v-list lines="one" density="comfortable">
        <v-list-item
            v-for="(item, index) in items"
            :key="item.name"
            :ref="(el) => setItemRef(el as HTMLElement | null, index)"
            :class="{ 'bg-gray-300': index === selectedIndex }"
            class="cursor-pointer"
            @click="selectItem(index)"
        >
      
        <template #prepend>
          <v-avatar color="grey-lighten-3" size="32">
            <v-icon :icon="item.icon" class="text-gray-600" />
          </v-avatar>
        </template>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle class="text-gray-500">{{ item.description }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<style lang="css">

.bg-gray-100 {
    background-color: #f3f4f6;
  }
  
  .v-list-item.bg-gray-100 {
    border-left: 4px solid #3f51b5;
  }

  .v-list-item.bg-gray-300 {
    background-color: #e0e0e0;
    border-left: 4px solid #3f51b5;
  }
  
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