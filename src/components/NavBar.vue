<template>
  <nav class="navbar">
    <div class="nav-brand">
      <!-- <router-link to="/" class="brand-link">VIS4Teens</router-link> -->
      <p class="brand-link">Data Visualization for Teenage Teaching</p>
      <button class="menu-toggle" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <div class="nav-links" :class="{ 'nav-open': isMenuOpen }">
      <router-link to="/data-display" class="nav-link" @click="closeMenu">Reasearch Papers</router-link>
      <router-link to="/correlation-matrix" class="nav-link" @click="closeMenu">Correlation Matrix</router-link>
      <!-- <router-link to="/sankey-diagram" class="nav-link" @click="closeMenu">Sankey Diagram</router-link> -->
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      currentImageIndex: 0,
      // isWiggling: false,
      isMenuOpen: false,
      images: [
        require('@/assets/logo.png'),
        require('@/assets/logo.png'),
        require('@/assets/logo.png'),
        require('@/assets/logo.png')
      ]
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentImageIndex]
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #51B0CA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* border-bottom: 2px solid #5c2e0a; */
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-link {
  text-decoration: none;
  color: #333;
  font-size: 1.6rem;
  font-weight: bold;
  font-family: Arial, serif;
  transition: color 0.3s ease;
}

.brand-link:hover {
  color: #5c2e0a;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: #333;
  transition: all 0.3s ease;
}

.menu-toggle.is-active span:first-child {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.is-active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.is-active span:last-child {
  transform: rotate(-45deg) translate(6px, -6px);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #2c1810;
  font-weight: 500;
  padding: 0.5rem 1rem;
  font-size: 1.2em;
  /* border-radius: 4px; */
  /* transition: all 0.3s ease; */
  font-family: Arial, serif;
}

/* .nav-link:hover {
  background-color: rgba(26, 15, 10, 0.1);
  
} */

.router-link-active {
  color: #1a0f0a !important;
  background-color: transparent;
  font-weight: bold;
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background-color: #1a0f0a;
}

.nav-image {
  width: 50px;
  height: 50px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 25px;
  border: 2px solid #5c2e0a;
}

.nav-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: top center;
}

/* @keyframes wiggle {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
  100% { transform: rotate(0deg); }
} */

/* .wiggle {
  animation: wiggle 0.5s ease-in-out;
} */

@media screen and (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-links {
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #51B0CA;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 0.5rem;
    z-index: 999;
    /* border-top: 1px solid #5c2e0a; */
  }

  .nav-links.nav-open {
    display: flex;
  }

  .nav-link {
    padding: 0.75rem 1rem;
    width: 100%;
    text-align: center;
  }

  .nav-image {
    width: 40px;
    height: 40px;
  }
}

@media screen and (max-width: 480px) {
  .navbar {
    padding: 1rem;
  }

  .brand-link {
    font-size: 1.3rem;
  }

  .nav-image {
    width: 35px;
    height: 35px;
  }
}
</style> 