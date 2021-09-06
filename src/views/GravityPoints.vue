<template>
  <div class="relative min-h-screen">
    <div class="gravity-points w-screen h-screen flex-center bg-black-1"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import p5 from "p5";
import sketch from "@/scenes/gravityPoints";

export default defineComponent({
  name: "GravityPoints",
  setup() {
    const start = () => {
      new p5(sketch, document.querySelector(".gravity-points") as HTMLElement);
    };
    onMounted(() => {
      start();
    });
  },
});
</script>

<style lang="scss" scoped></style>
