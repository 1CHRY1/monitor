<template>
  <div class="layout">
    <header-component></header-component>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderComponent from "./Header.vue";
export default defineComponent({
  components: { HeaderComponent },
  setup() {},
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}
</style>