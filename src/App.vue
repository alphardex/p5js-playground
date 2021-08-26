<template>
  <router-view />
</template>

<script lang="ts">
import "@alphardex/aqua.css/dist/aqua.sp.min.css";
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style lang="scss">
body {
  min-height: 100vh;
  margin: 0;
  background: white;
}

// colors

:root {
  --black-color-1: #464343;
}

// mixins

@mixin sp-layout {
  @media screen and (max-width: 750px) {
    @content;
  }
}

@mixin pc-layout {
  @media screen and (min-width: 751px) {
    @content;
  }
}

@mixin iphone-x-below-layout {
  @media screen and (max-height: 723px) {
    @content;
  }
}

.sp-only {
  @include pc-layout {
    display: none;
  }
}

.pc-only {
  @include sp-layout {
    display: none;
  }
}

// reset

* {
  border-width: 0;
  -webkit-tap-highlight-color: transparent;
}

a {
  color: currentColor;
  text-decoration: none;
}

p {
  margin: 0;
}

ul,
ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

// sweetalert2

.alert-title {
  font-weight: normal !important;
}

@include sp-layout {
  body {
    font-size: 4vw;
  }

  .alert-title {
    font-size: 3.8vw !important;
  }

  .alert-popup {
    max-width: 72vw !important;
  }
}

// utils

$colors: "red", "orange", "yellow", "green", "blue", "purple", "brown", "black",
  "white";
@each $c in $colors {
  @for $i from 1 through 8 {
    .text-#{$c}-#{$i} {
      color: var(--#{$c}-color-#{$i});
    }

    .bg-#{$c}-#{$i} {
      background: var(--#{$c}-color-#{$i});
    }

    .border-#{$c}-#{$i} {
      border-color: var(--#{$c}-color-#{$i});
    }
  }
}
</style>
