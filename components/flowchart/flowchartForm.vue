<script setup>
  import { ref } from 'vue';
  import { initialEdges, initialNodes } from '../flowchart/initial-elements'
import { MarkerType } from '@vue-flow/core';

  const nodes = ref(initialNodes);
  const selectedInputCount = ref('');
  const selectedConnectionType = ref('');
  const selectedSecondInputCount = ref('');
  const nodesTypes = ["input", "output", "default"];
  const connectionTypes = ["connection", "default"];
  const updatedTypeNode = ref('');
  const selectedTypes = ref('');
  const connectionComment = ref('');


  const inputId = computed(() => {
    return nodes.value.map(element => element.id);
  });

  function clear() {

    for (let i = 1; i <= selectedInputCount.value; i++) {
      state[`label${i}`] = '';
      state[`type${i}`] = '';
      state[`type${i}`] = '';
      state[`secondType${i}`] = '';
    }
  }

const updateElementConnection = async () => {
  const formData = {
    selectedInputCount: selectedInputCount.value,
    selectedConnectionType: selectedConnectionType.value,
    selectedSecondInputCount: selectedSecondInputCount.value,
  };

  console.log('Form Data:', formData);

  if (formData.selectedConnectionType === 'connection') {

    const connectionId = `e${formData.selectedInputCount}-${formData.selectedSecondInputCount}`;

    const connection = {
      id: connectionId,
      source: formData.selectedInputCount,
      target: formData.selectedSecondInputCount,
      animated: true,
      label: connectionComment.value,
      markedEnd: MarkerType.ArrowClosed,
      style: {
        stroke: 'orange',
      },
      labelBgStyle: {
        fill: 'orange',
      },
    };

    console.log('Connection Object:', connection);

    initialEdges.value.push(connection)

    console.log("After connected:", initialNodes)

  }
};

const updateElement = () => {
  const nodeNewId = updatedTypeNode.value;
  const nodeId = selectedNodeData.value.id;
  const nodeType = selectedTypes.value;

  const nodeToUpdate = initialNodes.value.find(node => node.id === nodeId);
  
  if (nodeToUpdate) {
    nodeToUpdate.id = nodeNewId;
    nodeToUpdate.label = nodeNewId;
    nodeToUpdate.type = nodeType;

    initialNodes.value = initialNodes.value.map(node => {
      if (node.id === nodeId) {
        return { ...node, id: nodeNewId, label: nodeNewId, type: nodeType };
      }
      return node;
    });
  } else {
    console.log("Node not found")
  }
};

const updateSecondElement = () => {
  const nodeNewId = updatedTypeNode.value;
  const nodeId = selectedSecondNodeData.value.id;
  const nodeType = selectedTypes.value;

  const nodeToUpdate = initialNodes.value.find(node => node.id === nodeId);
  
  if (nodeToUpdate) {
    nodeToUpdate.id = nodeNewId;
    nodeToUpdate.label = nodeNewId;
    nodeToUpdate.type = nodeType;

    initialNodes.value = initialNodes.value.map(node => {
      if (node.id === nodeId) {
        return { ...node, id: nodeNewId, label: nodeNewId, type: nodeType };
      }
      return node;
    });
  } else {
    console.log("Node not found")
  }
};


const deleteElement = () => {
  const nodeIdToDelete = selectedNodeData.value.id;
  const index = initialNodes.value.findIndex(node => node.id === nodeIdToDelete);
  if (index !== -1) {
    initialNodes.value.splice(index, 1);
    console.log(`Node with id ${nodeIdToDelete} deleted successfully.`);
  } else {
    console.log(`Node with id ${nodeIdToDelete} not found.`);
  }
};


const deleteSecondElement = () => {
  const nodeIdToDelete = selectedSecondNodeData.value.id;
  const index = initialNodes.value.findIndex(node => node.id === nodeIdToDelete);
  if (index !== -1) {
    initialNodes.value.splice(index, 1);
    console.log(`Node with id ${nodeIdToDelete} deleted successfully.`);
  } else {
    console.log(`Node with id ${nodeIdToDelete} not found.`);
  }
};

const filteredSecondInputIds = computed(() => {
  return inputId.value.filter(id => id !== selectedInputCount.value);
});

const selectedNodeData = computed(() => {
  const nodeId = selectedInputCount.value;
  return initialNodes.value.find(node => node.id === nodeId);
});

const selectedSecondNodeData = computed(() => {
  const nodeId = selectedSecondInputCount.value;
  return initialNodes.value.find(node => node.id === nodeId);
});

// const availableNodeTypes = computed(() => {
//   const selectedType = selectedNodeData.value ? selectedNodeData.value.type : null;
//   return nodesTypes.filter(type => type !== selectedType);
// });

const isButtonDisabled = computed(() => {
    return !selectedNodeData.value 
});

const isSecondButtonDisabled = computed(() => {
  return !selectedSecondNodeData.value;
});

</script>

<template>

    <v-form class="form-space">
      <v-card class="form-card">
        <h1 class="form-input-title">Conexão</h1>
        <v-row>
          <v-col cols="8">
            <v-select
              v-model="selectedInputCount"
              :items="inputId"
         
              label="Node"
              required
              clearable
              variant="outlined"
  
            ></v-select>
          </v-col>
          <v-col cols="4" style="padding-top: 20px;">
             <v-dialog
                transition="dialog-top-transition"
                width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="green"
                    v-bind="props"
                    prepend-icon="mdi-update"
                    class="update-btn"
                    :disabled="isButtonDisabled"
                  ></v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-toolbar
                      color="primary"
                      title="Atualize seu node"
                    ></v-toolbar>
                    <v-card-text style="width: 500px;">
                      <div class="text-h2 pa-12">
                        <form>
                         <v-text-field 
                            v-model="updatedTypeNode"
                            :placeholder="`Write here ${updatedTypeNode}`"
                            :label="`Node Id ${updatedTypeNode}`" 
                            variant="outlined"
                        ></v-text-field>
                          <v-select
                            v-model="selectedTypes"
                            :items="nodesTypes"
                            label="Node Type"
                            required
                            clearable
                            variant="outlined"
                          ></v-select>
                          <v-btn
                            prepend-icon="mdi-update"
                            @click="updateElement"
                          >
                            Atualizar
                          </v-btn>
                              <v-btn
                            prepend-icon="mdi-update"
                            @click="deleteElement"
                          >
                            Deletar
                          </v-btn>
                        </form>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        variant="text"
                        @click="isActive.value = false"
                      >Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="selectedConnectionType"
              label="Selecione a conexão"
              :items="connectionTypes"
              clearable
              required
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="connectionComment"
              label="Digite o nome da conexão"
              required
              clearable
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-select
              v-model="selectedSecondInputCount"
              :items="filteredSecondInputIds"
              label="Second Node"
              required
              clearable
              variant="outlined"
              :disabled="filteredSecondInputIds.length === 0"
              :error-messages="filteredSecondInputIds.length === 0 ? ['No options available'] : []"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-dialog
                transition="dialog-top-transition"
                width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="green"
                    v-bind="props"
                    prepend-icon="mdi-update"
                    class="update-btn"
                    :disabled="isSecondButtonDisabled"
                  ></v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-toolbar
                      color="primary"
                      title="Atualize seu node"
                    ></v-toolbar>
                    <v-card-text style="width: 500px;">
                      <div class="text-h2 pa-12">
                        <form>
                         <v-text-field 
                            v-model="updatedTypeNode"
                            :placeholder="`Write here ${updatedTypeNode}`"
                            :label="`Node Id ${updatedTypeNode}`" 
                            variant="outlined"
                        ></v-text-field>
                          <v-select
                            v-model="selectedTypes"
                            :items="nodesTypes"
                            label="Node Type"
                            required
                            clearable
                            variant="outlined"
                          ></v-select>
                          <v-btn
                            prepend-icon="mdi-update"
                            @click="updateSecondElement"
                          >
                            Atualizar
                          </v-btn>
                              <v-btn
                            prepend-icon="mdi-update"
                            @click="deleteSecondElement"
                          >
                            Deletar
                          </v-btn>
                        </form>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        variant="text"
                        @click="isActive.value = false"
                      >Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
          </v-col>
        </v-row>
      </v-card>
      
       <v-divider class="mt-12"></v-divider>
      <v-row style="padding: 0; margin: 0;">
        <v-col cols="6" class="form-button">
          <v-btn 
          @click="clear"
          variant="tonal"
          >
            Clear
          </v-btn>
        </v-col>
        <v-col cols="6" class="form-button">
          <v-btn class="me-4"
          :disabled="false" 
          @click="updateElementConnection"
          variant="tonal"
          color="primary"
          >
            Connect
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

</template>

<style scoped>
  .form-builder-title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }
  .crud-form-main {
    height: 75vh;
    padding:10px;
    overflow: auto;
  }
  .form-space {
    overflow: auto;
    padding: 0;
  }

  .form-card {
    margin-bottom: 20px;
    padding: 10px;
  }
  .form-input-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 20px;
    text-align: center;
  }
  .form-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    width: 90%;
  }

  .update-btn {
    margin: 0px;
    padding-left: 30px;
    text-align: center;
    width: 30px;
  }
  
  .vue-flow__node-custom {
    background: purple;
    color: white;
    border: 1px solid purple;
    border-radius: 4px;
    box-shadow: 0 0 0 1px purple;
    padding: 8px;
}

</style>