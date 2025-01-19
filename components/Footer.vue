<script setup lang="ts">
const variable = ref("");
</script>

<template>
  <v-footer
    :app="true"
    density="comfortable"
    :elevation="3"
    class="d-flex flex-wrap py-3 custom-footer"
  >
    <div class="flex-1-0"></div>
    <div>
      <a href="https://google.com" class="ma-0 pa-0">
        <img src="public/img/logo.png" style="height: 15px" />
      </a>
    </div>
  </v-footer>
</template>

<style lang="css" scoped></style>
