# VIS4Teens 项目重构说明

## 项目概述

该项目已重构为三个主要界面的可视化分析工具，专门用于青少年可视化教育研究数据的展示和分析。

## 界面功能

### 1. 数据展示界面 (`/data-display`)
- **位置**: `src/views/DataDisplayView.vue`
- **数据源**: `src/assets/data/codes.json`
- **功能**:
  - 左侧筛选和搜索面板
  - 支持按年份、研究领域、学科、国家、教学环境筛选
  - 关键词搜索（标题、作者、来源）
  - 右侧项目卡片展示
  - 分页功能
  - 响应式设计

### 2. 相关性矩阵界面 (`/correlation-matrix`)
- **位置**: `src/views/CorrelationMatrixView.vue`
- **数据源**: `src/assets/data/all_matrices.json`
- **功能**:
  - 选择任意两个类别生成相关性矩阵
  - 热力图可视化
  - 可调节单元格大小
  - 显示/隐藏数值
  - 统计信息展示
  - 图例说明
  - 矩阵转置支持

### 3. 桑基图界面 (`/sankey-diagram`)
- **位置**: `src/views/SankeyDiagramView.vue`
- **状态**: 占位界面，等待后续开发
- **功能**: 预留用于数据流向可视化

## 数据结构

### codes.json
包含项目信息的数组，每个项目包含：
- Id: 项目ID
- Title: 标题
- Authors: 作者
- Year: 年份
- Link: 链接
- Source: 来源
- Research areas: 研究领域数组
- Subjects: 学科数组
- Country: 国家数组
- Teaching environment: 教学环境数组
- 其他字段...

### all_matrices.json
包含多个相关性矩阵的数组，每个矩阵包含：
- x_category: X轴类别名称
- y_category: Y轴类别名称
- columns: 列标签数组
- index: 行标签数组
- data: 二维数据数组

## 技术栈

- **前端框架**: Vue 3
- **路由**: Vue Router 4
- **状态管理**: Vuex 4
- **样式**: CSS3 with Flexbox/Grid
- **构建工具**: Vue CLI

## 路由配置

```javascript
'/' -> 重定向到 '/data-display'
'/data-display' -> 数据展示界面
'/correlation-matrix' -> 相关性矩阵界面
'/sankey-diagram' -> 桑基图界面
```

## 导航栏

- 品牌名称: VIS4Teens
- 三个主要导航链接：数据展示、相关性矩阵、桑基图
- 响应式菜单支持

## 启动项目

```bash
npm install
npm run serve
```

## 文件结构

```
src/
├── assets/
│   ├── data/
│   │   ├── codes.json          # 项目数据
│   │   ├── all_matrices.json   # 矩阵数据
│   │   └── column_mapping2.json
│   └── logo.png
├── components/
│   └── NavBar.vue              # 导航栏组件
├── router/
│   └── index.js                # 路由配置
├── store/
│   └── index.js                # Vuex状态管理
├── views/
│   ├── DataDisplayView.vue     # 数据展示界面
│   ├── CorrelationMatrixView.vue # 相关性矩阵界面
│   └── SankeyDiagramView.vue   # 桑基图界面
├── App.vue                     # 根组件
└── main.js                     # 入口文件
```

## 特色功能

1. **高性能筛选**: 实时筛选数千条数据记录
2. **交互式矩阵**: 可缩放、可自定义的相关性矩阵
3. **响应式设计**: 支持桌面端和移动端
4. **数据可视化**: 热力图、标签云等可视化效果
5. **用户友好**: 直观的界面设计和操作流程

## 后续开发计划

1. 完善桑基图功能
2. 添加数据导出功能
3. 增加更多筛选选项
4. 优化性能和用户体验
5. 添加数据统计面板

