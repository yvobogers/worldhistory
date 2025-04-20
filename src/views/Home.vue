<script setup lang="ts">
import HistoricalTimeline from '@/components/HistoricalTimeline.vue'

defineOptions({
  name: 'HomeView',
})
</script>

<template>
  <div class="home-view">
    <HistoricalTimeline />
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
