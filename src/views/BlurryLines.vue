<template>
  <div class="relative min-h-screen">
    <div class="blurry-lines w-screen h-screen flex-center bg-black-1"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import p5 from "p5";
import sketch from "@/scenes/blurryLines";

export default defineComponent({
  name: "BlurryLines",
  setup() {
    const start = () => {
      new p5(sketch, document.querySelector(".blurry-lines") as HTMLElement);
    };
    onMounted(() => {
      start();
    });
  },
});
</script>

<style lang="scss" scoped></style>
