<template>
  <div id="app">
    <NavBar />
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  /* font-family: 'Arial', sans-serif; */
  font-family: 'Times New Roman', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.main-container {
  padding-top: 72px; /* 与导航栏高度相同 */
  min-height: calc(100vh - 72px);
}

/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  height: 100vh;
}

@media screen and (max-width: 480px) {
  .main-container {
    padding-top: 64px; /* 较小屏幕上导航栏高度减小 */
  }
}
/* @font-face {
  font-family: 'Trajan';
  src: url('./assets/fonts/TrajanusLTPro-Roman.OTF') format('opentype');
  font-weight: normal;
  font-style: normal;
} */
/* h1 {
  font-family: 'Playfair Display', serif; 
  font-weight: bold;
  font-size: 3rem;
  color: #2c3e50; 
  text-align: center;
  margin-bottom: 2rem; 
} */
</style>
