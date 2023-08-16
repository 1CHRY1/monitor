<template>
  <div class="home">
    <img-component></img-component>
    <introduce-component></introduce-component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImgComponent from "@/components/home/ImgComponent.vue";
import IntroduceComponent from "@/components/home/IntroduceComponent.vue";
export default defineComponent({
  components: { ImgComponent, IntroduceComponent },
  setup() {},
});
</script>
