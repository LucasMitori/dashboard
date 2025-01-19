<script setup lang="ts">
const login = () => {
  // Add your login logic here
};
</script>

<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-form>
            <v-text-field label="Username" />
            <v-text-field label="Password" type="password" />
            <v-btn @click="login">Login</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
