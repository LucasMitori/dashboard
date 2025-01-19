<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    const isAuthenticated = false;
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
    isLoading.value = false;
  }, 2000);
});

const router = useRouter();
</script>

<template>
  <v-container
    fluid
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </v-container>
</template>

<style scoped>
/* You can customize the styling if needed */
</style>
