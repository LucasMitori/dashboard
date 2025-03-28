<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
    VueFlow,
    useVueFlow,
    Panel,
    type Node,
    type Edge,
    type Connection,
    type NodeComponent,
} from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import Icon from "~/components/flowchart/Icon.vue";
import starNode from "~/components/flowchart/nodesTypes/starNode.vue";
import circleNode from "~/components/flowchart/nodesTypes/circleNode.vue";
import pentagonNode from "~/components/flowchart/nodesTypes/pentagonNode.vue";
import HexagonNode from "~/components/flowchart/nodesTypes/hexagonNode.vue";
import TransitionEdge from "~/components/flowchart/TransitionEdge.vue";
import StartNode from "~/components/flowchart/nodesTypes/StartNode.vue";
import QuestionNode from "~/components/flowchart/nodesTypes/QuestionNode.vue";
import AnswerNode from "~/components/flowchart/nodesTypes/AnswerNode.vue";
import NegativeNode from "~/components/flowchart/nodesTypes/NegativeNode.vue";
import PositiveNode from "~/components/flowchart/nodesTypes/PositiveNode.vue";
import ActionNode from "~/components/flowchart/nodesTypes/ActionNode.vue";
import EndNode from "~/components/flowchart/nodesTypes/EndNode.vue";
import DecisionNode from "~/components/flowchart/nodesTypes/DecisionNode.vue";
import DocumentNode from "~/components/flowchart/nodesTypes/DocumentNode.vue";
import MultipleNode from "~/components/flowchart/nodesTypes/MultipleNode.vue";
import ApiNodeInput from "~/components/flowchart/node/ApiNodeInput.vue";
import ApiConnectNodeInput from "~/components/flowchart/node/ApiConnectNodeInput.vue";
import "@vue-flow/core/dist/style.css";

definePageMeta({
    title: "FlowChart",
    submenu: true,
});

const route = useRoute();

useHead({
    title: `Dashboard`,
    meta: [{ property: "og:title", content: `Dashboard` }],
});

type FilteredNode = {
    id: string;
    name: string;
    type: string;
    formattedTitle: string;
};

const {
    onNodeDragStop,
    addNodes,
    setViewport,
    toObject,
    screenToFlowCoordinate,
    updateNode,
} = useVueFlow();
const showEditDialog = ref(false);
const showEditEdgeDialog = ref(false);
// const selectedNode = ref<Node | null>(null);
const selectedNode: Ref<Node | null> = ref(null);
const selectedEdge = ref<Edge | null>(null);
const nodeName = ref("");
const nodeType = ref("");
const edgeName = ref("");
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
const dark = ref(false);
const draggedType = ref<string | null>(null);
const isDragOver = ref(false);
const isDragging = ref(false);
let idCounter = 0;
const selectedNodeForConnection = ref<FilteredNode | null>(null);
const connectionLabel = ref("");
const connectionType = ref<string>("default");
const connectionColor = ref<string>("black");
const animateConnection = ref<boolean>(false);
const tab = ref(null);
const navTab = ref(null);
const nodeSwitchInput = ref(false);
const nodeOptionMoh = ref(false);
const nodeAudioInput = ref("");
const nodeDescription = ref("");
// const apiInputData = ref<{ [key: string]: any }>({});
const apiInputData = ref<Record<string, unknown>>({});
const { t: $t } = useI18n();
const nodeTimeoutTime = ref(0);
const nodeTimeoutAttempts = ref(0);
const apiInput = {
    type: "api",
    name: "example_name",
    label: $t("example_name"),
    plcaeholder: $t("example_name"),
    required: true,
    loading: false,
    multiple: false,
    itemUrl: "/url for api options/",
    itemText: "description",
    itemValue: "id",
};

const apiConnect = {
    type: "apiConnect",
    name: "api_name_app_first",
    firstName: "api_name_app_first",
    firstLabel: $t("api_name_app_first"),
    firstPlaceholder: $t("api_name_app_first"),
    secondName: "api_name_app_second",
    secondLabel: $t("api_name_app_second"),
    secondPlaceholder: $t("api_name_app_second"),
    required: true,
    loading: false,
    multiple: false,
    options: [
        {
            value: "options",
            label: $t("options"),
            path: "/url for api options/",
        },
        { value: "options", label: $t("options"), path: "" },
        { value: "options", label: $t("options"), path: "" },
    ],
};

const alertType = ref("success");
const alertTitle = ref("");
const alertText = ref("");
const showAlertFlag = ref(false);

const showAlert = ({
    type,
    title,
    text,
}: {
    type: string;
    title: string;
    text: string;
}) => {
    alertType.value = type;
    alertTitle.value = title;
    alertText.value = text;
    showAlertFlag.value = true;
};

// const initialNode = {
//   id: 'inicio', // unique identifier
//   type: 'inicio', // use the `inicio` node type as defined in `nodeTypes`
//   position: { x: 250, y: 150 }, // initial position on the canvas
//   data: { label: 'Início' },
// };

// onMounted(() => {
//   nodes.value = [initialNode];
// });

const nodeTypes: Record<string, NodeComponent> = {
    inicio: markRaw(StartNode) as NodeComponent,
    pergunta: markRaw(QuestionNode) as NodeComponent,
    resposta: markRaw(AnswerNode) as NodeComponent,
    negativa: markRaw(NegativeNode) as NodeComponent,
    positiva: markRaw(PositiveNode) as NodeComponent,
    acao: markRaw(ActionNode) as NodeComponent,
    final: markRaw(EndNode) as NodeComponent,
    decisao: markRaw(DecisionNode) as NodeComponent,
    documento: markRaw(DocumentNode) as NodeComponent,
    multiplo: markRaw(MultipleNode) as NodeComponent,
    star: markRaw(starNode) as NodeComponent,
    circle: markRaw(circleNode) as NodeComponent,
    pentagon: markRaw(pentagonNode) as NodeComponent,
    hexagon: markRaw(HexagonNode) as NodeComponent,
};

const availableNodes = ref([
    // { id: 1, type: 'input', label: 'Input Node', icon: 'mdi-arrow-right-bold-circle', color: '#3a8ff8' },
    // { id: 2, type: 'default', label: 'Default Node', icon: 'mdi-database', color: 'indigo' },
    // { id: 3, type: 'output', label: 'Output Node', icon: 'mdi-arrow-left-bold-circle', color: 'green' },
    {
        id: 5,
        type: "inicio",
        label: "Início",
        icon: "mdi-play-circle",
        color: "#1b8e5a",
        background: "#d4f8e8",
    },
    {
        id: 6,
        type: "pergunta",
        label: "Pergunta",
        icon: "mdi-help-circle",
        color: "#6559d1",
        background: "#d7d4f0",
    },
    {
        id: 7,
        type: "resposta",
        label: "Resposta",
        icon: "mdi-message-reply-text",
        color: "#c8a415",
        background: "#fff7d1",
    },
    {
        id: 8,
        type: "negativa",
        label: "Negativa",
        icon: "mdi-close-circle",
        color: "#990000",
        background: "#f4c2c2",
    },
    {
        id: 9,
        type: "positiva",
        label: "Positiva",
        icon: "mdi-check-circle",
        color: "007d5b",
        background: "#b2e0d4",
    },
    {
        id: 10,
        type: "acao",
        label: "Ação",
        icon: "mdi-run-fast",
        color: "#ff5722",
        background: "#ffccbc",
    },
    {
        id: 11,
        type: "final",
        label: "Final",
        icon: "mdi-stop-circle",
        color: "#333333",
        background: "#4a4a4a",
    },
    {
        id: 12,
        type: "decisao",
        label: "Decisão",
        icon: "mdi-gate",
        color: "#9B59B6",
        background: "#E1BEE7",
    },
    {
        id: 14,
        type: "documento",
        label: "Documento",
        icon: "mdi-file-document",
        color: "#FF1493",
        background: "#FFB6C1",
    },
    {
        id: 14,
        type: "multiplo",
        label: "Múltiplo",
        icon: "mdi-multiplication",
        color: "#0096C7",
        background: "#D0F0FD",
    },
    // { id: 7, type: 'hexagon', label: 'hexagon Node', icon: 'mdi-hexagon-outline', color: 'purple' },
]);

const connectionTypes = [
    { value: "default", label: "Default" },
    { value: "step", label: "Step" },
    { value: "smoothstep", label: "Smooth Step" },
    { value: "custom", label: "Custom" },
];

const connectionColors = [
    { value: "#e53935", label: "Red" },
    { value: "#388e3c", label: "Green" },
    { value: "#0288d1", label: "Teal" },
];

const listItems = ref([
    {
        icon: "mdi-cog",
        title: "Settings",
        to: "/flowchart/settings",
    },
]);

const filteredAvailableNodes = computed<FilteredNode[]>(() => {
    return nodes.value
        .filter((node) => node.id !== selectedNode.value?.id)
        .map((node) => ({
            id: node.id,
            name: typeof node.data.label === "string" ? node.data.label : "",
            type: node.type ?? "",
            formattedTitle: `${node.data.label} - (${$t("type")} ${
                node.type ?? ""
            })`,
        }));
});
function closeDialog() {
    showEditDialog.value = false;
}

function getId() {
    return `dndnode_${idCounter++}`;
}

watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? "none" : "";
});

function onDragStart(event: DragEvent, type: string) {
    //   console.log('Drag started with type:', type);

    if (event.dataTransfer) {
        event.dataTransfer.setData("application/vueflow", type);
        event.dataTransfer.effectAllowed = "move";
    }

    draggedType.value = type;
    isDragging.value = true;
    document.addEventListener("drop", onDragEnd);
}

function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (draggedType.value) {
        isDragOver.value = true;

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }
    }
}

function onDragLeave() {
    isDragOver.value = false;
}

function onDragEnd() {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    document.removeEventListener("drop", onDragEnd);
}

function onDrop(event: DragEvent) {
    const position = screenToFlowCoordinate({
        x: event.clientX,
        y: event.clientY,
    });
    const nodeType = draggedType.value || "default";
    const nodeId = getId();

    const newNode = {
        id: nodeId,
        type: nodeType,
        position,
        data: { label: `Node ${nodeId.split("_")[1]}` },
        label: `Node ${nodeId.split("_")[1]}`,
        connectable: true,
        draggable: true,
    };

    addNodes([newNode]);

    nodes.value = [...nodes.value, newNode];
}

// onPaneReady(({ fitView }) => {
//   fitView();
// });

// onInit(() => {
//   fitView({ nodes: ['inicio'] });
// });

function onNodeClick({ node }: { node: Node }) {
    // console.log('Node clicked:', node);

    selectedNode.value = node;
    nodeName.value = typeof node.label === "string" ? node.label : "";
    nodeType.value = node.type ?? "";
    apiInputData.value = {};

    showEditDialog.value = true;

    // console.log('Current nodes:', nodes.value);
    // console.log("Selected node:", selectedNode.value);
}

function onEdgeClick({ edge }: { edge: Edge }) {
    //   console.log('Edge clicked:', edge);

    selectedEdge.value = edge;
    edgeName.value = typeof edge.label === "string" ? edge.label : "";
    connectionType.value = edge.type || "default";
    connectionColor.value =
        (edge.style as { stroke?: string })?.stroke || "black";
    animateConnection.value = edge.animated || false;

    showEditEdgeDialog.value = true;
}

function saveNodeChanges() {
    if (!selectedNode.value) return;

    const nodeIndex = nodes.value.findIndex(
        (node) => node.id === selectedNode.value?.id
    );

    const commonDetails = {
        label: nodeName.value,
    };

    const inicioDetails = {
        ...commonDetails,
        data: {
            label: nodeName.value,
            nodeDetails: {
                active: nodeSwitchInput.value,
                description: nodeAudioInput.value,
                timeout_time: nodeTimeoutTime.value,
                timeout_attempts: nodeTimeoutAttempts.value,
                option_exten_dial: nodeOptionMoh.value,
                dataArray: apiInputData.value,
            },
        },
        type: nodeType.value,
    };

    const otherDetails = {
        ...commonDetails,
        data: {
            label: nodeName.value,
            nodeDetails: {
                audioInput: nodeSwitchInput.value,
                description: nodeAudioInput.value,
                dataArray: apiInputData.value,
            },
        },
        type: nodeType.value,
    };

    const updatedNodeData =
        selectedNode.value.type === "inicio" ? inicioDetails : otherDetails;

    if (nodeIndex !== -1) {
        nodes.value[nodeIndex] = {
            ...nodes.value[nodeIndex],
            ...updatedNodeData,
        };
    }

    updateNode(selectedNode.value.id, (node) => ({
        ...node,
        ...updatedNodeData,
    }));

    if (selectedNodeForConnection.value) {
        const targetNodeId = selectedNodeForConnection.value.id;
        const edgeId = `e-${selectedNode.value.id}-${targetNodeId}`;

        const existingEdges = edges.value.filter(
            (edge) => edge.source === selectedNode.value!.id
        );
        // const isTopUsed = existingEdges.some(edge => edge.sourceHandle === 'top');
        const isLeftUsed = existingEdges.some(
            (edge) => edge.sourceHandle === "left"
        );
        const isBottomUsed = existingEdges.some(
            (edge) => edge.sourceHandle === "bottom"
        );
        const isRightUsed = existingEdges.some(
            (edge) => edge.sourceHandle === "right"
        );

        let sourceHandle = null;

        if (selectedNode.value.type === "multiplo") {
            sourceHandle = "bottom";
        } else if (selectedNode.value.type === "pergunta") {
            sourceHandle = !isLeftUsed ? "left" : !isRightUsed ? "right" : null;
        } else if (
            selectedNode.value.type === "resposta" ||
            selectedNode.value.type === "inicio" ||
            selectedNode.value.type === "negativa" ||
            selectedNode.value.type === "acao" ||
            selectedNode.value.type === "positiva" ||
            selectedNode.value.type === "documento"
        ) {
            sourceHandle = !isBottomUsed ? "bottom" : null;
        } else if (selectedNode.value.type === "decisao") {
            sourceHandle = !isLeftUsed
                ? "left"
                : !isRightUsed
                ? "right"
                : !isBottomUsed
                ? "bottom"
                : null;
        }

        if (!sourceHandle) {
            showAlert({
                type: "error",
                title: "Error",
                text: "All handles for the node type are already in use.",
            });
            console.warn("All handles for the node type are already in use.");
            return;
        }

        const newEdge: Edge = {
            id: edgeId,
            source: selectedNode.value.id,
            target: targetNodeId,
            type: connectionType.value || "default",
            animated: animateConnection.value,
            style: {
                stroke: connectionColor.value || "black",
            },
            label:
                connectionLabel.value ||
                `${connectionType.value || "default"} edge`,
            sourceHandle,
        };

        const existingEdgeIndex = edges.value.findIndex(
            (edge) => edge.id === edgeId
        );
        if (existingEdgeIndex !== -1) {
            edges.value[existingEdgeIndex] = newEdge;
        } else {
            edges.value.push(newEdge);
        }
    } else {
        console.warn("No target node selected for connection.");
    }

    showAlert({
        type: "success",
        title: "Success",
        text: "Node salvo com sucesso",
    });

    showEditDialog.value = false;

    console.log(
        "Updated node:",
        selectedNode.value.id,
        "with new data:",
        updatedNodeData
    );
    console.log("Updated edges:", edges.value);
}

function saveEdgeChanges() {
    if (selectedEdge.value) {
        const updatedEdge = {
            ...selectedEdge.value,
            label: edgeName.value,
            type: connectionType.value || "default",
            animated: animateConnection.value,
            style: {
                stroke: connectionColor.value || "black",
            },
        };

        const existingEdgeIndex = selectedEdge.value
            ? edges.value.findIndex(
                  (edge) => edge.id === selectedEdge.value!.id
              )
            : -1;

        if (existingEdgeIndex !== -1) {
            edges.value = [
                ...edges.value.slice(0, existingEdgeIndex),
                updatedEdge,
                ...edges.value.slice(existingEdgeIndex + 1),
            ];
        } else {
            console.warn("Edge not found for update.");
        }

        showEditEdgeDialog.value = false;

        console.log("Updated edge:", updatedEdge);
        console.log("Updated edges list:", edges.value);
    }
}

function deleteNode() {
    if (selectedNode.value) {
        nodes.value = nodes.value.filter(
            (node) => node.id !== selectedNode.value!.id
        );
        showEditDialog.value = false;
    }
}

function deleteEdge() {
    if (selectedEdge.value) {
        edges.value = edges.value.filter(
            (edge) => edge.id !== selectedEdge.value!.id
        );
        showEditEdgeDialog.value = false;
    }
}

function closeEditEdgeDialog() {
    showEditEdgeDialog.value = false;
}

onNodeDragStop(({ event: _event, nodes: _nodes, node: _node }) => {
    console.log("Node Drag Stop", { _event, _nodes, _node });
});

function onConnect(connection: Connection) {
    //   console.log('Connection made:', connection);

    const newEdge = {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
    };

    edges.value.push(newEdge);

    //   console.log('Updated edges array:', edges.value);
}

function logToObject() {
    console.log(toObject());
}

function resetTransform() {
    setViewport({ x: 0, y: 0, zoom: 1 });
}

function toggleDarkMode() {
    dark.value = !dark.value;
}

const isHidden = ref(false);

watch(isHidden, () => {
    nodes.value = nodes.value.map((node) => ({
        ...node,
        hidden: isHidden.value,
    }));
    edges.value = edges.value.map((edge) => ({
        ...edge,
        hidden: isHidden.value,
    }));
});

watch(
    nodes,
    (newNodes) => {
        console.log("Nodes array changed:", newNodes);
    },
    { deep: true }
);

// watch(edges, (newEdges) => {
//   console.log('Edges array changed:', newEdges);
// }, { deep: true });

function exportFlowchart() {
    const flowchartData = toObject();
    console.log("Exported flowchart data:", flowchartData);

    const json = JSON.stringify(flowchartData, null, 2);
    console.log("JSON:", json);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importFlowchart(file: File | null) {
    if (!(file instanceof File)) {
        console.error("Invalid file type. Please select a JSON file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string | null;

        if (result) {
            try {
                const parsedData = JSON.parse(result);

                if (parsedData.nodes && parsedData.edges) {
                    nodes.value = parsedData.nodes;
                    edges.value = parsedData.edges;
                    //   console.log("Imported flowchart data:", parsedData);
                } else {
                    console.error(
                        "Invalid file format: JSON must contain 'nodes' and 'edges'."
                    );
                }
            } catch (error) {
                console.error("Failed to import flowchart:", error);
            }
        } else {
            console.error("File read result is null.");
        }
    };

    reader.readAsText(file);
}

const isTransitionTriggered = ref(false);

function triggerTransition() {
    isTransitionTriggered.value = true;

    setTimeout(() => {
        isTransitionTriggered.value = false;
    }, 1000);
}

const updateApiInput = (key: string, value: unknown) => {
    apiInputData.value[key] = value;
    //   console.log(`Updated ${key}:`, value);
};

function clearNodes() {
    nodes.value = [];
}

function clearEdges() {
    edges.value = [];
}
</script>

<template>
    <v-container class="main-flowchart">
        <v-row style="height: 80vh; width: 100%; padding: 10px">
            <v-navigation-drawer color="primary" theme="dark" permanent>
                <v-list color="transparent" density="compact" nav>
                    <!-- <v-list-item class="flowchart-settings">
                    <template v-slot:prepend>
                      <v-icon color="#E0FBFC">mdi-sitemap-outline</v-icon>
                    </template>
                    <v-list-item-title class="flowchart-title">Flowchart Settings</v-list-item-title>
                  </v-list-item>
                  
              <v-divider inset /> -->

                    <v-list-item class="mb-2 mt-5">
                        <v-tabs
                            v-model="navTab"
                            align-tabs="center"
                            color="#FFD700"
                            height="60"
                            slider-color="#6bbcca"
                        >
                            <v-tab value="tab-node">Node</v-tab>
                            <v-tab value="tab-pages">Pages</v-tab>
                        </v-tabs>

                        <v-tabs-window v-model="navTab">
                            <v-tabs-window-item
                                id="tabs-window"
                                value="tab-node"
                                class="pa-1 mt-2"
                            >
                                <div class="d-flex flex-column">
                                    <div class="text-h7 mb-4">
                                        Nodes to Drag and Drop
                                    </div>

                                    <div
                                        class="d-flex justify-space-between align-center flex-wrap"
                                    >
                                        <template
                                            v-for="node in availableNodes"
                                            :key="node.id"
                                        >
                                            <div
                                                class="vue-flow__node-input text-center pa-2"
                                                :style="{
                                                    cursor: 'pointer',
                                                    border: `2px solid ${node.color}`,
                                                    borderRadius: '8px',
                                                    width: '100%',
                                                    height: '40px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    margin: '5px',
                                                    backgroundColor:
                                                        node.background,
                                                }"
                                                :draggable="true"
                                                @dragstart="
                                                    (event) =>
                                                        onDragStart(
                                                            event,
                                                            node.type
                                                        )
                                                "
                                            >
                                                <v-icon
                                                    :color="
                                                        node.color === '#333333'
                                                            ? 'white'
                                                            : node.color
                                                    "
                                                    class="mr-2"
                                                    >{{ node.icon }}</v-icon
                                                >
                                                <div
                                                    class="text-h6"
                                                    :style="{
                                                        color:
                                                            node.color ===
                                                            '#333333'
                                                                ? 'white'
                                                                : '#4a4a4a',
                                                    }"
                                                >
                                                    {{ node.label }}
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                    <v-file-input
                                        label="Import Flowchart"
                                        color="primary"
                                        prepend-icon="mdi-import"
                                        accept=".json"
                                        variant="outlined"
                                        outlined
                                        class="mt-4"
                                        @update:model-value="
                                            (file) =>
                                                importFlowchart(
                                                    Array.isArray(file)
                                                        ? file[0]
                                                        : file
                                                )
                                        "
                                    />

                                    <v-btn
                                        class="mt-4"
                                        color="primary"
                                        elevation="2"
                                        outlined
                                        style="font-weight: bold"
                                        @click="exportFlowchart"
                                    >
                                        <v-icon left class="mr-2" color="black"
                                            >mdi-export</v-icon
                                        >
                                        Export
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <v-tabs-window-item
                                id="tabs-window"
                                value="tab-pages"
                                class="pa-5"
                            >
                                <v-divider inset />

                                <v-list-item
                                    v-for="(item, index) in listItems.slice(
                                        0,
                                        3
                                    )"
                                    :key="index"
                                    :prepend-icon="item.icon"
                                    :title="item.title"
                                    :to="item.to"
                                    class="mt-5"
                                    style="font-size: 20px"
                                />
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-list-item>
                </v-list>

                <template #append>
                    <div class="pa-2">
                        <v-btn block @click="triggerTransition">Teste</v-btn>
                    </div>
                </template>
            </v-navigation-drawer>

            <v-col cols="12" class="dndflow ma-0 pa-0" @drop="onDrop">
                <v-card class="elevation-2">
                    <v-card-title>
                        <v-row
                            justify="space-between"
                            align="center"
                            style="width: 100%"
                        >
                            <v-col cols="auto">
                                <span class="text-h5">Flowchart Builder</span>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn
                                    color="error"
                                    elevation="2"
                                    outlined
                                    style="font-weight: bold"
                                    @click="clearNodes"
                                >
                                    <v-icon left class="mr-2" color="white"
                                        >mdi-eraser</v-icon
                                    >
                                    Nodes
                                </v-btn>
                                <v-btn
                                    color="warning"
                                    elevation="2"
                                    outlined
                                    style="font-weight: bold; margin-left: 8px"
                                    @click="clearEdges"
                                >
                                    <v-icon left class="mr-2" color="black"
                                        >mdi-eraser</v-icon
                                    >
                                    Edges
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-divider />

                    <v-card-text class="pa-4" style="height: 80vh">
                        <VueFlow
                            :nodes="nodes"
                            :edges="edges"
                            :class="{ dark }"
                            class="basicflow"
                            :default-viewport="{ zoom: 1.5 }"
                            :min-zoom="0.2"
                            :max-zoom="4"
                            :node-types="nodeTypes"
                            @connect="onConnect"
                            @dragover="onDragOver"
                            @dragleave="onDragLeave"
                            @node-click="onNodeClick"
                            @edge-click="onEdgeClick"
                        >
                            <Background
                                :gap="20"
                                pattern-color="#BDBDBD"
                                :style="{
                                    backgroundColor: isDragging
                                        ? 'rgba(0, 0, 0, 0.1)'
                                        : 'transparent',
                                    borderColor: isDragging
                                        ? 'rgba(0, 0, 0, 0.2)'
                                        : 'transparent',
                                    transition:
                                        'background-color 0.2s, border-color 0.2s',
                                }"
                            />
                            <MiniMap />

                            <Controls position="top-right">
                                <ControlButton
                                    title="Reset Transform"
                                    @click="resetTransform"
                                >
                                    <Icon name="reset" />
                                </ControlButton>
                                <ControlButton
                                    title="Toggle Dark Mode"
                                    @click="toggleDarkMode"
                                >
                                    <Icon v-if="dark" name="sun" />
                                    <Icon v-else name="moon" />
                                </ControlButton>
                                <ControlButton
                                    title="Log toObject"
                                    @click="logToObject"
                                >
                                    <Icon name="log" />
                                </ControlButton>
                            </Controls>

                            <Panel position="bottom-left">
                                <div>
                                    <label for="ishidden">
                                        hidden
                                        <input
                                            id="ishidden"
                                            v-model="isHidden"
                                            type="checkbox"
                                        />
                                    </label>
                                </div>
                            </Panel>

                            <template #edge-custom="props">
                                <TransitionEdge
                                    v-bind="props"
                                    :trigger-transition="isTransitionTriggered"
                                    :source="props.source"
                                    :target="props.target"
                                />
                            </template>
                        </VueFlow>
                    </v-card-text>
                </v-card>

                <v-dialog v-model="showEditDialog" max-width="550px">
                    <v-card>
                        <v-card-title>Edit Node</v-card-title>
                        <v-card-text>
                            <v-tabs
                                v-model="tab"
                                align-tabs="center"
                                color="black"
                                height="60"
                                slider-color="#f78166"
                            >
                                <v-tab value="tab-1">Edit Node</v-tab>
                                <v-tab value="tab-2">Settings</v-tab>
                            </v-tabs>

                            <v-tabs-window v-model="tab">
                                <v-tabs-window-item
                                    id="tabs-window"
                                    value="tab-1"
                                    class="pa-5"
                                >
                                    <v-text-field
                                        v-model="nodeName"
                                        label="Node Name"
                                        variant="outlined"
                                    />

                                    <v-autocomplete
                                        v-model="selectedNodeForConnection"
                                        :items="filteredAvailableNodes"
                                        item-title="formattedTitle"
                                        item-value="id"
                                        return-object
                                        label="Connect to Node"
                                        :disabled="nodes.length <= 1"
                                        variant="outlined"
                                        chips
                                        closable-chips
                                    />
                                    <v-text-field
                                        v-model="connectionLabel"
                                        label="Connection Label"
                                        :disabled="!selectedNodeForConnection"
                                        variant="outlined"
                                    />
                                    <v-autocomplete
                                        v-model="connectionType"
                                        :items="connectionTypes"
                                        item-title="label"
                                        item-value="value"
                                        label="Connection Type"
                                        variant="outlined"
                                        chips
                                        closable-chips
                                    />
                                    <v-autocomplete
                                        v-model="connectionColor"
                                        :items="connectionColors"
                                        item-title="label"
                                        item-value="value"
                                        label="Connection Color"
                                        variant="outlined"
                                        chips
                                        closable-chips
                                    />
                                    <v-switch
                                        v-model="animateConnection"
                                        label="Animate Connection"
                                        inset
                                        :color="
                                            animateConnection ? 'green' : 'red'
                                        "
                                        name="animateConnection"
                                    />
                                </v-tabs-window-item>

                                <v-tabs-window-item
                                    id="tabs-window"
                                    value="tab-2"
                                    class="pa-5"
                                >
                                    <template
                                        v-if="
                                            selectedNode &&
                                            selectedNode.type === 'inicio'
                                        "
                                    >
                                        <v-switch
                                            v-model="nodeSwitchInput"
                                            label="Ativo"
                                            :color="
                                                nodeSwitchInput
                                                    ? 'green'
                                                    : 'red'
                                            "
                                            inset
                                            name="active"
                                        />
                                        <v-text-field
                                            v-model="nodeAudioInput"
                                            label="Description"
                                            variant="outlined"
                                        />
                                        <!-- <ApiNodeInput
                                            :field="apiInput"
                                            :multiple="false"
                                            @update:model-value="
                                                (value) =>
                                                    updateApiInput(
                                                        'example_name',
                                                        value
                                                    )
                                            "
                                        /> -->
                                        <v-row>
                                            <v-col cols="6">
                                                <v-number-input
                                                    v-model="nodeTimeoutTime"
                                                    :label="
                                                        $t('timeout_example')
                                                    "
                                                    :placeholder="
                                                        $t('timeout_example')
                                                    "
                                                    required
                                                    :min="0"
                                                    control-variant="split"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </v-col>
                                            <v-col cols="6">
                                                <v-number-input
                                                    v-model="
                                                        nodeTimeoutAttempts
                                                    "
                                                    :label="
                                                        $t('timeout_example')
                                                    "
                                                    :placeholder="
                                                        $t('timeout_example')
                                                    "
                                                    required
                                                    :min="0"
                                                    control-variant="split"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-switch
                                            v-model="nodeOptionMoh"
                                            :label="$t('options')"
                                            :name="$t('options')"
                                            inset
                                            :color="
                                                nodeOptionMoh ? 'green' : 'red'
                                            "
                                        />
                                    </template>
                                    <template v-else>
                                        <v-switch
                                            v-model="nodeSwitchInput"
                                            label="Audio Input"
                                            inset
                                            name="audio-input"
                                            :color="
                                                nodeSwitchInput
                                                    ? 'green'
                                                    : 'red'
                                            "
                                        />
                                        <v-text-field
                                            v-model="nodeAudioInput"
                                            label="Description"
                                            variant="outlined"
                                        />
                                        <v-textarea
                                            v-model="nodeDescription"
                                            label="Description"
                                            variant="outlined"
                                            rows="4"
                                            prepend-icon="mdi-text-long"
                                            color="deep-purple-accent-4"
                                            no-resize
                                        />
                                        <ApiConnectNodeInput
                                            :field="apiConnect"
                                            :multiple="false"
                                            @update:model-value="
                                                (value) => {
                                                    updateApiInput(
                                                        'api_name_app_first',
                                                        value.api_name_app_first
                                                    );
                                                    updateApiInput(
                                                        'api_name_app_second',
                                                        value.api_name_app_second
                                                    );
                                                }
                                            "
                                        />

                                        <!-- <ApiNodeInput
                                            :field="apiInput"
                                            :multiple="false"
                                            @update:model-value="
                                                (value) =>
                                                    updateApiInput(
                                                        'options',
                                                        value
                                                    )
                                            "
                                        /> -->
                                    </template>
                                </v-tabs-window-item>
                            </v-tabs-window>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="red" @click="deleteNode"
                                >Delete</v-btn
                            >
                            <v-spacer />
                            <v-btn color="grey" @click="closeDialog"
                                >Cancel</v-btn
                            >
                            <v-btn color="blue" @click="saveNodeChanges"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="showEditEdgeDialog" max-width="500px">
                    <v-card>
                        <v-card-title>Edit Edge</v-card-title>
                        <v-card-text>
                            <v-text-field
                                v-model="edgeName"
                                label="Edge Label"
                                variant="outlined"
                            />

                            <v-autocomplete
                                v-model="connectionType"
                                :items="connectionTypes"
                                item-title="label"
                                item-value="value"
                                label="Connection Type"
                                variant="outlined"
                                chips
                                closable-chips
                            />
                            <v-autocomplete
                                v-model="connectionColor"
                                :items="connectionColors"
                                item-title="label"
                                item-value="value"
                                label="Connection Color"
                                variant="outlined"
                                chips
                                closable-chips
                            />
                            <v-switch
                                v-model="animateConnection"
                                label="Animate Connection"
                                name="animateConnection"
                                inset
                                :color="animateConnection ? 'green' : 'red'"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="red" @click="deleteEdge"
                                >Delete</v-btn
                            >
                            <v-spacer />
                            <v-btn color="grey" @click="closeEditEdgeDialog"
                                >Cancel</v-btn
                            >
                            <v-btn color="blue" @click="saveEdgeChanges"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>

            <v-snackbar
                v-model="showAlertFlag"
                :timeout="4000"
                color="primary"
                location="top"
            >
                <span class="text-alert">
                    <v-icon size="small" class="me-2">
                        mdi-alert-circle-check
                    </v-icon>
                    {{ alertText }}
                </span>
            </v-snackbar>
        </v-row>
    </v-container>
</template>

<style scoped>
.basicflow1 {
    background-color: #1a192b;
}

.main-flowchart {
    margin: 0px;
    overflow: auto;
    height: 100%;
    width: 100%;
}

.container-flowchart {
    background-color: rebeccapurple;
}

.inputs-flowchart {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    height: 120px;
}

.nodes {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}

.dndflow {
    height: 70%;
    width: 50%;

    border-radius: 8px;
    padding: 20px;
}

.vue-flow__node-custom {
    background: purple;
    color: white;
    border: 1px solid purple;
    border-radius: 4px;
    box-shadow: 0 0 0 1px purple;
    padding: 8px;
}

.node-menu {
    max-height: 100%;
    overflow-y: auto;
}

.draggable-node-card {
    cursor: grab;
    transition: box-shadow 0.2s;
}
.draggable-node-card:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.flowchart-title {
    font-size: 18px;
    font-weight: bold;
    color: #ffdd99;
}
</style>
