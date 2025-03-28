<script setup>
import { computed, ref, watch } from 'vue'
import { TransitionPresets, useDebounceFn, useTransition } from '@vueuse/core'
import { getBezierPath, useVueFlow } from '@vue-flow/core'

// Define props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
  triggerTransition: {
    type: Boolean,
    default: false,
  },
})

const { id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style, triggerTransition } = toRefs(props);

const curve = ref(null);
const dot = ref(null);
const transform = ref({ x: 0, y: 0 });
const showDot = ref(false);

const { fitBounds, fitView, edges } = useVueFlow();

const path = computed(() =>
  getBezierPath({
    sourceX: sourceX.value,
    sourceY: sourceY.value,
    sourcePosition: sourcePosition.value,
    targetX: targetX.value,
    targetY: targetY.value,
    targetPosition: targetPosition.value,
  }),
);

function buildTransitionPath(startNodeId) {
  const path = [];
  let currentNodeId = startNodeId;

  while (currentNodeId !== 'output') {
    const connectedEdge = edges.value.find(edge => edge.source === currentNodeId);
    if (!connectedEdge) break;
    path.push(connectedEdge.id);
    currentNodeId = connectedEdge.target;
  }

  return path;
}

function triggerEdgeTransition(edge) {
  showDot.value = true;
  const totalLength = curve.value.getTotalLength();
  const initialPos = ref(0);
  let stopHandle;

  const output = useTransition(initialPos, {
    duration: Math.floor(totalLength / 2 / 100) * 1000,
    transition: TransitionPresets.easeOutCubic,
    onFinished: () => {
      stopHandle?.();
      showDot.value = false;
      fitView({ nodes: [edge.target], duration: 500 });
    },
  });

  transform.value = curve.value.getPointAtLength(output.value);
  const debouncedFitBounds = useDebounceFn(fitBounds, 1, { maxWait: 1 });
  debouncedFitBounds({
    width: 100,
    height: 200,
    x: transform.value.x - 100,
    y: transform.value.y - 100,
  });

  setTimeout(() => {
    initialPos.value = totalLength;
    stopHandle = watch(output, (next) => {
      if (!showDot.value) return;

      transform.value = curve.value.getPointAtLength(next);
      debouncedFitBounds({
        width: 100,
        height: 200,
        x: transform.value.x - 100,
        y: transform.value.y - 100,
      });
    });
  }, 500);
}

function startTransition() {
  showDot.value = true;

  const transitionPath = buildTransitionPath(source.value);

  transitionPath.forEach((edgeId, index) => {
    const edge = edges.value.find(e => e.id === edgeId);
    if (edge) {
      setTimeout(() => {
        triggerEdgeTransition(edge);
      }, index * 1500);
    }
  });
}

watch(triggerTransition, (newValue) => {
  if (newValue && !showDot.value) {
    startTransition();
  }
});
</script>

<template>
  <path 
    :id="id" 
    ref="curve" 
    :style="style" 
    class="vue-flow__edge-path" 
    :d="path[0]" 
    :marker-end="markerEnd" 
  />
  <Transition name="fade">
    <circle
      v-if="showDot"
      ref="dot"
      r="5"
      cy="0"
      cx="0"
      :transform="`translate(${transform.x}, ${transform.y})`"
      style="fill: #fdd023"
    />
  </Transition>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
