<template>
  <div class="relative min-h-screen">
    <ul>
      <li>
        <router-link :to="{ name: 'IsometricWave' }">
          IsometricWave
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'BlurryLines' }">
          BlurryLines
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>

<style lang="scss" scoped></style>
