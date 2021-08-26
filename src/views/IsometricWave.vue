<template>
  <div class="relative min-h-screen">
    <div class="isometric-wave w-screen h-screen flex-center bg-black-1"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import p5 from "p5";
import sketch from "@/scenes/isometricWave";

export default defineComponent({
  name: "IsometricWave",
  setup() {
    const start = () => {
      new p5(sketch, document.querySelector(".isometric-wave") as HTMLElement);
    };
    onMounted(() => {
      start();
    });
  },
});
</script>

<style lang="scss" scoped></style>
