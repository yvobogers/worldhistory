<script setup lang="ts">
// No imports needed for basic router setup
</script>

<template>
  <div class="app-container">
    <header>
      <h1>World History Timeline</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.app-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  width: 100%;
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
  z-index: 1000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
}

main {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
