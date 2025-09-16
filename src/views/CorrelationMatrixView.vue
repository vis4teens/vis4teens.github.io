<template>
  <div class="correlation-matrix-container">
    <div class="header-section">
      <h1>Correlation Matrix</h1>
    </div>

    <div class="controls-section">
      <div class="matrix-selector">
        <h3>Select Matrix Data</h3>
        <div class="selector-grid">
          <div class="selector-item">
            <label>X-axis Category (Rows):</label>
            <select v-model="selectedXCategory" @change="onXCategoryChange" class="category-select">
              <option value="">Please select...</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="selector-item">
            <label>Y-axis Category (Columns):</label>
            <select v-model="selectedYCategory" @change="onYCategoryChange" class="category-select">
              <option value="">Please select...</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="validation-section" v-if="selectedXCategory && selectedYCategory">
          <div v-if="selectedXCategory === selectedYCategory" class="warning">
            ⚠️ Please select two different categories
          </div>
          <div v-else-if="canGenerateMatrix" class="generate-section">
            <button @click="generateMatrix" class="generate-btn" :disabled="loading">
              {{ loading ? 'Generating...' : 'Generate Correlation Matrix' }}
            </button>
          </div>
        </div>
        
        
      </div>
    </div>

    <div class="matrix-display" v-if="currentMatrix">

      <div class="matrix-controls">
        <div class="display-options">
          <label>
            <input type="checkbox" v-model="showHeatmap" />
            Heatmap Display
          </label>
          <label>
            <input type="checkbox" v-model="showValues" />
            Show Values
          </label>
        </div>
        
        <div class="zoom-controls">
          <label>Zoom Level:</label>
          <input type="range" v-model="zoomLevel" min="0.5" max="2.0" step="0.1" />
          <span>{{ Math.round(zoomLevel * 100) }}%</span>
        </div>
      </div>

      <div class="matrix-wrapper">
        <div class="matrix-zoom-container" :style="{ 
          '--zoom-factor': zoomLevel,
          fontSize: (12 * zoomLevel) + 'px'
        }">
                     <table class="matrix-table">
           <thead>
             <!-- Secondary header row (only when needed on X-axis) -->
             <tr v-if="needsSecondaryHeader && secondaryHeaderData && isSecondaryHeaderOnXAxis">
               <th class="corner-cell secondary-corner"></th>
               <th 
                 v-for="group in secondaryHeaderData" 
                 :key="group.name"
                 class="secondary-header"
                 :colspan="group.span"
                 :title="group.name"
               >
                 {{ group.name }}
               </th>
               <th class="sum-header secondary-corner"> </th>
             </tr>
             <!-- Main header row -->
             <tr>
               <th class="corner-cell" :rowspan="needsSecondaryHeader && isSecondaryHeaderOnXAxis ? 2 : 1"></th>
               <!-- When secondary header is displayed on Y-axis, add an empty column to correspond to row grouping column -->
               <th 
                 v-if="needsSecondaryHeader && !isSecondaryHeaderOnXAxis"
                 class="col-header"
                 style="background-color: #e9ecef;"
               >
               </th>
               <th 
                 v-for="col in currentMatrix.columns" 
                 :key="col"
                 class="col-header"
                 :title="col"
               >
                 <div class="header-text">{{ col }}</div>
               </th>
               <th class="sum-header"> </th>
             </tr>
           </thead>
          <tbody>
            <tr 
              v-for="(row, rowIndex) in currentMatrix.index" 
              :key="row"
              class="matrix-row"
            >
              <!-- When secondary header is displayed on Y-axis, add grouping information before row title -->
              <th 
                v-if="needsSecondaryHeader && !isSecondaryHeaderOnXAxis && isNewGroupStart(rowIndex)"
                class="row-group-header"
                :rowspan="getRowGroup(rowIndex).span"
                :title="getRowGroup(rowIndex).name"
              >
                {{ getRowGroup(rowIndex).name }}
              </th>
              <th class="row-header" :title="row">
                {{ truncateText(row, 25) }}
              </th>
              <td 
                v-for="(col, colIndex) in currentMatrix.columns"
                :key="col"
                class="matrix-cell"
                :class="{ 'with-heatmap': showHeatmap }"
                :style="getCellStyle(currentMatrix.data[rowIndex][colIndex])"
                :title="`${row} - ${col}: ${currentMatrix.data[rowIndex][colIndex]}`"
                @click="openCellModal(row, col, currentMatrix.data[rowIndex][colIndex])"
              >
                <span v-if="showValues">
                  {{ currentMatrix.data[rowIndex][colIndex] }}
                </span>
              </td>
              <td 
                class="sum-cell row-sum"
                :style="getSumCellStyle(getRowSum(rowIndex), 'row')"
                :title="`${row} - Row Sum: ${getRowSum(rowIndex)}`"
              >
                <span v-if="showValues">
                  {{ getRowSum(rowIndex) }}
                </span>
              </td>
            </tr>
            <!-- Column sum row -->
            <tr class="sum-row">
              <th class="sum-header"> </th>
              <!-- When secondary header is displayed on Y-axis, add an empty column to correspond to row grouping column -->
              <td 
                v-if="needsSecondaryHeader && !isSecondaryHeaderOnXAxis"
                class="sum-cell"
                style="background-color: #e9ecef;"
              >
              </td>
              <td 
                v-for="(col, colIndex) in currentMatrix.columns"
                :key="col"
                class="sum-cell col-sum"
                :style="getSumCellStyle(getColumnSum(colIndex), 'column')"
                :title="`${col} - Column Sum: ${getColumnSum(colIndex)}`"
              >
                <span v-if="showValues">
                  {{ getColumnSum(colIndex) }}
                </span>
              </td>
              <td>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend" v-if="showHeatmap">
        <h4>Legend</h4>
        <div class="legend-scale">
          <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="statistics">
        <h4>Statistics</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <label>Total:</label>
            <span>{{ matrixStats.total }}</span>
          </div>
          <div class="stat-item">
            <label>Maximum:</label>
            <span>{{ matrixStats.max }}</span>
          </div>
          <div class="stat-item">
            <label>Minimum:</label>
            <span>{{ matrixStats.min }}</span>
          </div>
          <div class="stat-item">
            <label>Average:</label>
            <span>{{ matrixStats.average.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="no-data" v-else-if="!loading">
      <p>Please select two categories to generate correlation matrix</p>
    </div>

    <div class="loading" v-if="loading">
      <p>Generating matrix...</p>
    </div>

    <!-- Cell Details Modal -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Related Projects</h3>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-info">
            <p><strong>X-axis:</strong> {{ modalData.xCategory }}</p>
            <p><strong>Y-axis:</strong> {{ modalData.yCategory }}</p>
            <p><strong>Count:</strong> {{ modalData.count }} projects</p>
          </div>
          <div class="projects-list" v-if="filteredProjects.length > 0">
            <div 
              v-for="project in filteredProjects" 
              :key="project.Id"
              class="project-item"
            >
              <div class="project-title">
                {{ project.Title }} <span class="project-id">ID: {{ project.Id+1 }}</span>
              </div>
              <div class="project-meta">
                <span class="project-year">{{ project.Year }}</span>
                <span class="project-source">{{ project.Source }}</span>
                <a 
                  v-if="project.Link" 
                  :href="project.Link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="project-link"
                >
                  🔗 View Paper
                </a>
              </div>
            </div>
          </div>
          <div v-else class="no-projects">
            <p>No projects found for this combination.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CorrelationMatrixView',
  data() {
    return {
      availableMatrices: [],
      selectedXCategory: '',
      selectedYCategory: '',
      currentMatrix: null,
      loading: false,
      showHeatmap: true,
      showValues: true,
      zoomLevel: 1.0,
      // Modal related data
      showModal: false,
      modalData: {
        xCategory: '',
        yCategory: '',
        count: 0
      },
      filteredProjects: [],
      allProjects: [],
      // Manual column grouping - specify column range merging
      manualColumnGroups: {
        // Example: column grouping when X-axis is Visualization types
        'Visualization types': {
          'statistical chart': { start: 0, end: 8 },      // Columns 1-9
          'scientific visualization': { start: 9, end: 12 }, // Columns 10-13
          'diagram': { start: 13, end: 17 },              // Columns 14-18
          'map': { start: 18, end: 21 },                  // Columns 19-22
          'network/graph': { start: 22, end: 22 }         // Column 23
        },
        // Example: column grouping when X-axis is Theoretical underpinnings
        'Theoretical underpinnings': {
          'learning theory': { start: 0, end: 47 },       // Columns 1-48
          'cognitive theory': { start: 48, end: 56 },     // Columns 49-57
          'design theory': { start: 57, end: 62 }         // Columns 58-63
        }
      },
      // Fixed category options
      categories: [
        // 'Research areas',
        'Subjects', 
        'Country',
        'Education goals',
        'Visualization forms',
        'Tool types',
        'Teaching environment',
        'Teaching mode',
        'Non-lecturing activities',
        'Collaboration',
        'Evaluation metrics',
        'Other tested variables',
        'Visualization types',
        'Theoretical underpinnings'
      ]
    }
  },
  
    computed: {
    canGenerateMatrix() {
      return this.selectedXCategory && this.selectedYCategory && this.selectedXCategory !== this.selectedYCategory;
    },
    
    // Check if secondary header is needed
    needsSecondaryHeader() {
      if (!this.currentMatrix) return false;
      return this.currentMatrix.x_category === 'Visualization types' || 
             this.currentMatrix.y_category === 'Visualization types' ||
             this.currentMatrix.x_category === 'Theoretical underpinnings' || 
             this.currentMatrix.y_category === 'Theoretical underpinnings';
    },
    
    // Check if secondary header is displayed on X-axis
    isSecondaryHeaderOnXAxis() {
      if (!this.currentMatrix) return false;
      return this.currentMatrix.y_category === 'Visualization types' || 
             this.currentMatrix.y_category === 'Theoretical underpinnings';
    },
    
    // Get secondary header data
    secondaryHeaderData() {
      if (!this.needsSecondaryHeader || !this.currentMatrix) {
        console.log('Secondary header not needed or no matrix');
        return null;
      }
      
      // Check if X-axis or Y-axis needs secondary header
      const isXAxis = this.currentMatrix.y_category === 'Visualization types' || this.currentMatrix.y_category === 'Theoretical underpinnings';
      const category = isXAxis ? this.currentMatrix.y_category : this.currentMatrix.x_category;
      
      console.log('Category for secondary header:', category);
      console.log('Is X axis:', isXAxis);
      
      const columnGroups = this.manualColumnGroups[category];
      if (!columnGroups) {
        console.log('No column groups found for category:', category);
        return null;
      }
      
      // Select corresponding data based on axis
      // If Y-axis is the category that needs secondary header, then secondary header displays on X-axis (columns), need to group columns
      // If X-axis is the category that needs secondary header, then secondary header displays on Y-axis (rows), need to group rows
      const items = isXAxis ? this.currentMatrix.columns : this.currentMatrix.index;
      const totalItems = items.length;
      
      const headerGroups = [];
      
      // Generate groups based on manually marked column ranges
      for (const [groupName, range] of Object.entries(columnGroups)) {
        let { start, end } = range;
        
        console.log(`Processing group ${groupName}: start=${start}, end=${end}`);
        
        // Automatically adjust range to fit actual column count
        if (start >= totalItems) {
          console.log(`Group ${groupName} start index ${start} exceeds total items ${totalItems}, skipping`);
          continue;
        }
        
        // If end index exceeds range, adjust to last valid index
        if (end >= totalItems) {
          end = totalItems - 1;
          console.log(`Adjusted end index for group ${groupName} to ${end}`);
        }
        
        // Check if range is valid
        if (start >= 0 && end < totalItems && start <= end) {
          const span = end - start + 1;
          const groupItems = items.slice(start, end + 1);
          
          console.log(`Valid group ${groupName}: span=${span}, items=`, groupItems);
          
          headerGroups.push({
            name: groupName,
            items: groupItems,
            span: span,
            start: start,
            end: end
          });
        } else {
          console.log(`Invalid range for group ${groupName}: start=${start}, end=${end}, totalItems=${totalItems}`);
        }
      }
      
      // Sort by starting position
      headerGroups.sort((a, b) => a.start - b.start);
      
      console.log('Final header groups:', headerGroups);
      
      return headerGroups;
    },
    
    matrixStats() {
      if (!this.currentMatrix) return { total: 0, max: 0, min: 0, average: 0 };
      
      const allValues = this.currentMatrix.data.flat();
      const total = allValues.reduce((sum, val) => sum + val, 0);
      const max = Math.max(...allValues);
      const min = Math.min(...allValues);
      const average = total / allValues.length;
      
      return { total, max, min, average };
    },
    
    
    legendItems() {
      if (!this.showHeatmap || !this.currentMatrix) return [];
      
      const { min, max } = this.matrixStats;
      const range = max - min;
      const steps = 5;
      
      return Array.from({ length: steps }, (_, i) => {
        const value = min + (range * i) / (steps - 1);
        const intensity = i / (steps - 1);
        return {
          color: this.getHeatmapColor(value, min, max),
          label: value.toFixed(1)
        };
      });
    }
  },
  
  async mounted() {
    await this.loadMatrixData();
    await this.loadProjectsData();
  },
  
  methods: {
    async loadMatrixData() {
      try {
        this.loading = true;
        const response = await fetch('/src/assets/data/all_matrices.json');
        this.availableMatrices = await response.json();
      } catch (error) {
        console.error('Failed to load matrix data:', error);
        try {
          const matricesData = require('@/assets/data/all_matrices.json');
          this.availableMatrices = matricesData;
        } catch (localError) {
          console.error('Failed to load local matrix data:', localError);
        }
      } finally {
        this.loading = false;
      }
    },
    
    async loadProjectsData() {
      try {
        const response = await fetch('/src/assets/data/codes.json');
        this.allProjects = await response.json();
      } catch (error) {
        console.error('Failed to load projects data:', error);
        try {
          const projectsData = require('@/assets/data/codes.json');
          this.allProjects = projectsData;
        } catch (localError) {
          console.error('Failed to load local projects data:', localError);
        }
      }
    },
    
    onXCategoryChange() {
      this.currentMatrix = null;
    },
    
    onYCategoryChange() {
      this.currentMatrix = null;
    },
    
    generateMatrix() {
      if (!this.canGenerateMatrix) return;
      
      this.loading = true;
      
      // Simulate async processing
      setTimeout(() => {
        // First try forward matching (X-axis vs Y-axis)
        let matrix = this.findMatrix(this.selectedXCategory, this.selectedYCategory);
        
        if (matrix) {
          this.currentMatrix = matrix;
        } else {
          // If not found, try reverse matching (Y-axis vs X-axis)
          const reverseMatrix = this.findMatrix(this.selectedYCategory, this.selectedXCategory);
          if (reverseMatrix) {
            // Transpose matrix to match user-selected X/Y axis
            this.currentMatrix = this.transposeMatrix(reverseMatrix);
          } else {
            alert(`No correlation matrix data found between "${this.selectedXCategory}" and "${this.selectedYCategory}"`);
          }
        }
        this.loading = false;
      }, 500);
    },
    
    findMatrix(xCategory, yCategory) {
      return this.availableMatrices.find(matrix => 
        matrix.x_category === xCategory && matrix.y_category === yCategory
      );
    },
    
    transposeMatrix(matrix) {
      // Transpose matrix (swap rows and columns)
      const transposed = {
        x_category: matrix.y_category,
        y_category: matrix.x_category,
        columns: [...matrix.index],
        index: [...matrix.columns],
        data: []
      };
      
      // Transpose data
      for (let j = 0; j < matrix.data[0].length; j++) {
        const newRow = [];
        for (let i = 0; i < matrix.data.length; i++) {
          newRow.push(matrix.data[i][j]);
        }
        transposed.data.push(newRow);
      }
      
      return transposed;
    },
    
    getCellStyle(value) {
      const style = {};
      
      if (this.showHeatmap && this.currentMatrix) {
        const { min, max } = this.matrixStats;
        style.backgroundColor = this.getHeatmapColor(value, min, max);
        style.color = this.getTextColor(value, min, max);
      } else {
        style.backgroundColor = 'white';
        style.color = '#333';
      }
      
      return style;
    },
    
    getHeatmapColor(value, min, max) {
      if (max === min) return 'rgb(255, 255, 255)';
      
      const intensity = (value - min) / (max - min);
      
      // Use white to green (#00C3B5) gradient
      if (value === 0) {
        return 'white';
      } else {
        // From white (255,255,255) to green (0,195,181)
        const r = Math.round(255 - intensity * (255-109));
        const g = Math.round(255 - intensity * (255 - 174));
        const b = Math.round(255 - intensity * (255 - 194));
        return `rgb(${r}, ${g}, ${b})`;
      }
    },
    
    
    getTextColor(value, min, max) {
      if (max === min) return '#333';
      
      const intensity = (value - min) / (max - min);
      
      if (value === 0) {
        return '#666';
      } else if (intensity > 0.6) {
        return 'white';
      } else {
        return '#333';
      }
    },
    
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    
    // Calculate row sum
    getRowSum(rowIndex) {
      if (!this.currentMatrix) return 0;
      return this.currentMatrix.data[rowIndex].reduce((sum, val) => sum + val, 0);
    },
    
    // Calculate column sum
    getColumnSum(colIndex) {
      if (!this.currentMatrix) return 0;
      return this.currentMatrix.data.reduce((sum, row) => sum + row[colIndex], 0);
    },
    
    // Calculate total sum
    getTotalSum() {
      if (!this.currentMatrix) return 0;
      return this.currentMatrix.data.reduce((rowSum, row) => 
        rowSum + row.reduce((cellSum, val) => cellSum + val, 0), 0
      );
    },
    
    // Sum cell style
    getSumCellStyle(value, type) {
      const style = {
        backgroundColor: 'white',
        color: '#333'
      };
      
      return style;
    },
    
    // Get row's secondary group
    getRowGroup(rowIndex) {
      if (!this.needsSecondaryHeader || !this.secondaryHeaderData || this.isSecondaryHeaderOnXAxis) {
        return null;
      }
      
      // Find which group the row index belongs to
      for (const group of this.secondaryHeaderData) {
        if (rowIndex >= group.start && rowIndex <= group.end) {
          return group;
        }
      }
      return null;
    },
    
    // Check if it's the start of a new group
    isNewGroupStart(rowIndex) {
      if (!this.needsSecondaryHeader || !this.secondaryHeaderData || this.isSecondaryHeaderOnXAxis) {
        return false;
      }
      
      // Check if it's the first row of a group
      for (const group of this.secondaryHeaderData) {
        if (rowIndex === group.start) {
          return true;
        }
      }
      return false;
    },
    
    openCellModal(row, col, count) {
      if (count === 0) return; // Don't open modal for zero values
      
      this.modalData = {
        xCategory: this.currentMatrix.x_category,
        yCategory: this.currentMatrix.y_category,
        count: count
      };
      
      // Filter projects based on the clicked cell
      this.filteredProjects = this.filterProjectsByCell(row, col);
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.filteredProjects = [];
    },
    
    filterProjectsByCell(row, col) {
      if (!this.allProjects || this.allProjects.length === 0) {
        return [];
      }
      
      const xCategory = this.currentMatrix.x_category;
      const yCategory = this.currentMatrix.y_category;
      
      return this.allProjects.filter(project => {
        const hasXValue = this.projectHasValue(project, xCategory, row);
        const hasYValue = this.projectHasValue(project, yCategory, col);
        return hasXValue && hasYValue;
      });
    },
    
    projectHasValue(project, category, value) {
      // Handle different category types
      switch (category) {
        case 'Subjects':
          return project.Subjects && project.Subjects.includes(value);
        case 'Country':
          return project.Country && project.Country.includes(value);
        case 'Education goals':
          return project['Education goals'] && project['Education goals'].includes(value);
        case 'Visualization forms':
          return project['Visualization forms'] && project['Visualization forms'].includes(value);
        case 'Tool types':
          return project['Tool types'] && project['Tool types'].includes(value);
        case 'Teaching environment':
          return project['Teaching environment'] && project['Teaching environment'].includes(value);
        case 'Teaching mode':
          return project['Teaching mode'] && project['Teaching mode'].includes(value);
        case 'Non-lecturing activities':
          return project['Non-lecturing activities'] && project['Non-lecturing activities'].includes(value);
        case 'Collaboration':
          return project.Collaboration && project.Collaboration.includes(value);
        case 'Evaluation metrics':
          return project['Evaluation metrics'] && project['Evaluation metrics'].includes(value);
        case 'Other tested variables':
          return project['Other tested variables'] && project['Other tested variables'].includes(value);
        case 'Visualization types':
          return project['Visualization types'] && this.hasVisualizationType(project['Visualization types'], value);
        case 'Theoretical underpinnings':
          return project['Theoretical underpinnings'] && this.hasTheoreticalUnderpinning(project['Theoretical underpinnings'], value);
        default:
          return false;
      }
    },
    
    hasVisualizationType(visualizationTypes, value) {
      if (!visualizationTypes || typeof visualizationTypes !== 'object') return false;
      
      // Check if the value exists in any of the visualization type categories
      for (const category in visualizationTypes) {
        if (visualizationTypes[category] && visualizationTypes[category].includes(value)) {
          return true;
        }
      }
      return false;
    },
    
    hasTheoreticalUnderpinning(theoreticalUnderpinnings, value) {
      if (!theoreticalUnderpinnings || typeof theoreticalUnderpinnings !== 'object') return false;
      
      // Check if the value exists in any of the theoretical underpinning categories
      for (const category in theoreticalUnderpinnings) {
        if (theoreticalUnderpinnings[category] && theoreticalUnderpinnings[category].includes(value)) {
          return true;
        }
      }
      return false;
    }

  }
}
</script>

<style scoped>
.correlation-matrix-container {
  padding: 20px;
  max-width: 100%;
  background-color: #f8f9fa;
  min-height: calc(100vh - 72px);
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  color: #333;
  margin-bottom: 10px;
}

.header-section p {
  color: #666;
  font-size: 1.1rem;
}

.controls-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.matrix-selector h3 {
  margin-bottom: 15px;
  color: #333;
}

.selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.selector-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.category-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.validation-section {
  text-align: center;
  margin-top: 15px;
}

.generate-section {
  text-align: center;
}

.warning {
  color: #dc3545;
  font-weight: 500;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 10px;
}

.generate-btn {
  padding: 12px 24px;
  background-color: #51B0CA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.generate-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.generate-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.matrix-display {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.matrix-info {
  text-align: center;
  margin-bottom: 20px;
}

.matrix-info h3 {
  color: #333;
  margin-bottom: 5px;
}

.matrix-info p {
  color: #666;
  font-size: 14px;
}

.matrix-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.display-options {
  display: flex;
  gap: 20px;
}

.display-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.zoom-controls input[type="range"] {
  width: 100px;
}

.zoom-controls label {
  font-weight: 500;
  color: #333;
}



.matrix-wrapper {
  overflow: auto;
  max-height: 80vh;
  border: 1px solid #333;
  margin-bottom: 20px;
  background-color: white;
  position: relative;
}

.matrix-zoom-container {
  --zoom-factor: 1;
  display: inline-block;
  min-width: 100%;
}

.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
  background-color: white;
  min-width: 600px;
}

.corner-cell {
  background-color: white;
  border-top: none;
  border-left: none;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  width: calc(150px * var(--zoom-factor));
  min-width: calc(150px * var(--zoom-factor));
  padding: calc(8px * var(--zoom-factor));
  /* font-weight: bold; */
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
}

.col-header {
  background-color: #f8f9fa;
  border-top: none;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  border-left: none;
  padding: calc(4px * var(--zoom-factor)) calc(2px * var(--zoom-factor));
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  min-width: calc(10px * var(--zoom-factor));
  max-width: calc(30px * var(--zoom-factor));
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Secondary header styles */
.secondary-header {
  background-color: #e9ecef;
  border-top: none;
  border-right: 1px solid #333;
  border-bottom: none;
  border-left: none;
  padding: calc(6px * var(--zoom-factor)) calc(4px * var(--zoom-factor));
  /* font-weight: bold; */
  text-align: center;
  vertical-align: middle;
  font-size: calc(11px * var(--zoom-factor));
  position: sticky;
  top: 0;
  z-index: 15;
}

.secondary-corner {
  background-color: white;
  border-top: none;
  border-left: none;
  border-right: 1px solid #333;
  border-bottom: none;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 25;
}

/* Row grouping header styles */
.row-group-header {
  background-color: #e9ecef;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: none;
  padding: calc(6px * var(--zoom-factor)) calc(4px * var(--zoom-factor));
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  font-size: calc(11px * var(--zoom-factor));
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-width: calc(30px * var(--zoom-factor));
  position: sticky;
  left: 0;
  z-index: 15;
}

.header-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  height: auto;
  min-height: calc(60px * var(--zoom-factor));
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  padding: calc(5px * var(--zoom-factor)) calc(2px * var(--zoom-factor));
  word-break: break-all;
  white-space: normal;
}

.row-header {
  background-color: #f8f9fa;
  border-left: none;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  border-top: none;
  padding: calc(8px * var(--zoom-factor)) calc(12px * var(--zoom-factor));
  font-weight: bold;
  text-align: left;
  vertical-align: middle;
  min-width: calc(150px * var(--zoom-factor));
  max-width: calc(200px * var(--zoom-factor));
  position: sticky;
  left: 0;
  z-index: 5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.matrix-cell {
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  border-top: none;
  border-left: none;
  padding: calc(6px * var(--zoom-factor));
  text-align: center;
  vertical-align: middle;
  font-size: calc(11px * var(--zoom-factor));
  font-weight: normal;
  width: calc(25px * var(--zoom-factor));
  height: calc(30px * var(--zoom-factor));
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
}

.matrix-cell:hover {
  background-color: #e9ecef !important;
  font-weight: bold;
}

/* Sum row and column styles */
  .sum-cell {
    background-color: white !important;
    color: #333 !important;
    border-right: none;
    border-bottom: none;
    border-top: none;
    border-left: none;
    padding: calc(6px * var(--zoom-factor));
    text-align: center;
    vertical-align: middle;
    font-size: calc(11px * var(--zoom-factor));
    width: calc(25px * var(--zoom-factor));
    height: calc(30px * var(--zoom-factor));
  }

.sum-row {
  background-color: white;
}

.row-sum {
  background-color: white !important;
  color: #333 !important;
}

.col-sum {
  background-color: white !important;
  color: #333 !important;
}

.total-sum {
  background-color: white !important;
  color: #333 !important;
  font-weight: 900;
  border: 3px solid #333;
}

.sum-cell:hover {
  background-color: #f8f9fa !important;
}

.legend {
  margin-bottom: 20px;
}

.legend h4 {
  margin-bottom: 10px;
  color: #333;
}

.legend-scale {
  display: flex;
  gap: 15px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 2px;
}

.statistics {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.statistics h4 {
  margin-bottom: 10px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
}

.stat-item label {
  font-weight: 500;
  color: #555;
}

.stat-item span {
  font-weight: bold;
  color: #333;
}

.no-data,
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .correlation-matrix-container {
    padding: 10px;
  }
  
  .selector-grid {
    grid-template-columns: 1fr;
  }
  
  .matrix-controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .display-options {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .legend-scale {
    flex-wrap: wrap;
  }
  
  .matrix-table {
    font-size: 10px;
  }
  
  .corner-cell,
  .row-header {
    min-width: 120px;
    padding: 6px 8px;
  }
  
  .col-header {
    min-width: 50px;
    padding: 6px 3px;
  }
  
  .header-text {
    min-height: 80px;
    padding: 3px 1px;
  }
  
  .matrix-cell {
    width: 35px;
    height: 30px;
    padding: 4px;
    font-size: 9px;
  }
  
  .sum-cell {
    width: 35px;
    height: 30px;
    padding: 4px;
    font-size: 9px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #51B0CA;
}

.modal-info p {
  margin: 5px 0;
  color: #555;
}

.projects-list {
  max-height: 400px;
  overflow-y: auto;
}

.project-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.project-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.project-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.project-id {
  background-color: #51B0CA;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.project-year {
  background-color: #FFBA00;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.project-source {
  background-color: #f8f9fa;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #e9ecef;
}

.project-link {
  color: #51B0CA;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.no-projects {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  
  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
