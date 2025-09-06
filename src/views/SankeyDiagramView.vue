<template>
  <div class="sankey-diagram-container">
    <div class="header-section">
      <h1>桑基图可视化</h1>
      <p>这个界面将用于展示桑基图，目前暂时保留空白</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SankeyDiagramView',
  data() {
    return {
      // 未来可以在这里添加桑基图相关的数据
    }
  },
  
  mounted() {
    // 未来可以在这里初始化桑基图组件
    console.log('桑基图界面已加载');
  },
  
  methods: {
    // 未来可以在这里添加桑基图相关的方法
  }
}
</script>

<style scoped>
.sankey-diagram-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  max-width: 800px;
}

.header-section h1 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2.5rem;
}

.header-section p {
  color: #666;
  font-size: 1.2rem;
  line-height: 1.6;
}

.content-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

.placeholder-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.6;
}

.placeholder-card h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.placeholder-card > p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
  line-height: 1.6;
}

.feature-list {
  text-align: left;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.feature-list h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.feature-list ul {
  list-style: none;
  padding: 0;
}

.feature-list li {
  color: #555;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
  font-size: 1rem;
}

.feature-list li::before {
  content: "✨";
  position: absolute;
  left: 0;
  top: 0;
}

.status-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.status-badge {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #8b4513;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-info p {
  color: #666;
  margin: 0;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sankey-diagram-container {
    padding: 15px;
  }
  
  .header-section h1 {
    font-size: 2rem;
  }
  
  .header-section p {
    font-size: 1rem;
  }
  
  .placeholder-card {
    padding: 30px 20px;
  }
  
  .placeholder-card h2 {
    font-size: 1.5rem;
  }
  
  .placeholder-icon {
    font-size: 3rem;
  }
  
  .feature-list {
    padding: 15px;
  }
  
  .feature-list h3 {
    font-size: 1.2rem;
  }
  
  .feature-list li {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header-section h1 {
    font-size: 1.8rem;
  }
  
  .placeholder-card {
    padding: 25px 15px;
  }
  
  .placeholder-card h2 {
    font-size: 1.3rem;
  }
  
  .placeholder-icon {
    font-size: 2.5rem;
  }
}

/* 增加一些动画效果 */
.placeholder-card {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.placeholder-icon {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.status-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
