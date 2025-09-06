<template>
  <div class="data-display-container">
    <!-- Left filter area -->
    <div class="filter-panel">
      <h2>Filter and Search</h2>
      
      <!-- Search box -->
      <div class="search-section">
        <h3>Search Projects</h3>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="Search title, author or keywords..." 
          class="search-input"
        />
      </div>

      <!-- Filters -->
      <div class="filter-section">
        <h3>Filter Conditions</h3>
        
        <!-- Year filter -->
        <div class="filter-group">
          <label>Year Range:</label>
          <div class="year-range">
            <input v-model="yearRange.min" type="number" placeholder="1991" />
            -
            <input v-model="yearRange.max" type="number" placeholder="2024" />
          </div>
        </div>

        <!-- Research areas filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('researchAreas')">
            <label>Research areas ({{ selectedResearchAreas.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.researchAreas }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedResearchAreas.length > 0">
            <span v-for="area in selectedResearchAreas" :key="area" class="selected-tag">
              {{ area }}
              <button @click="removeFilter('selectedResearchAreas', area)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.researchAreas">
            <label v-for="area in researchAreas" :key="area" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="area" 
                v-model="selectedResearchAreas"
              />
              <span class="checkbox-text">{{ area }}</span>
            </label>
          </div>
        </div>

        <!-- Subjects filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('subjects')">
            <label>Subjects ({{ selectedSubjects.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.subjects }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedSubjects.length > 0">
            <span v-for="subject in selectedSubjects" :key="subject" class="selected-tag">
              {{ subject }}
              <button @click="removeFilter('selectedSubjects', subject)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.subjects">
            <label v-for="subject in subjects" :key="subject" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="subject" 
                v-model="selectedSubjects"
              />
              <span class="checkbox-text">{{ subject }}</span>
            </label>
          </div>
        </div>

        <!-- Country filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('countries')">
            <label>Country ({{ selectedCountries.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.countries }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedCountries.length > 0">
            <span v-for="country in selectedCountries" :key="country" class="selected-tag">
              {{ country }}
              <button @click="removeFilter('selectedCountries', country)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.countries">
            <label v-for="country in countries" :key="country" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="country" 
                v-model="selectedCountries"
              />
              <span class="checkbox-text">{{ country }}</span>
            </label>
          </div>
        </div>

        <!-- ===== VISUALIZATION APPLICATION ===== -->
        <div class="filter-section-divider">
          <h3>Visualization Application</h3>
        </div>

        <!-- Visualization types filter (sub-categories) -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('visualizationTypes')">
            <label>Visualization types ({{ selectedVisualizationTypes.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.visualizationTypes }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedVisualizationTypes.length > 0">
            <span v-for="type in selectedVisualizationTypes" :key="type" class="selected-tag">
              {{ type }}
              <button @click="removeFilter('selectedVisualizationTypes', type)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="nested-checkbox-group" v-show="expandedSections.visualizationTypes">
            <div v-for="(types, category) in visualizationTypesCategories" :key="category" class="nested-category">
              <h5 class="category-title">{{ category }}</h5>
              <div class="checkbox-subgroup">
                <label v-for="type in types" :key="type" class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :value="type" 
                    v-model="selectedVisualizationTypes"
                  />
                  <span class="checkbox-text">{{ type }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Visualization forms filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('visualizationForms')">
            <label>Visualization forms ({{ selectedVisualizationForms.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.visualizationForms }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedVisualizationForms.length > 0">
            <span v-for="form in selectedVisualizationForms" :key="form" class="selected-tag">
              {{ form }}
              <button @click="removeFilter('selectedVisualizationForms', form)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.visualizationForms">
            <label v-for="form in visualizationForms" :key="form" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="form" 
                v-model="selectedVisualizationForms"
              />
              <span class="checkbox-text">{{ form }}</span>
            </label>
          </div>
        </div>

        <!-- Tool types filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('toolTypes')">
            <label>Tool types ({{ selectedToolTypes.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.toolTypes }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedToolTypes.length > 0">
            <span v-for="type in selectedToolTypes" :key="type" class="selected-tag">
              {{ type }}
              <button @click="removeFilter('selectedToolTypes', type)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.toolTypes">
            <label v-for="type in toolTypes" :key="type" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="type" 
                v-model="selectedToolTypes"
              />
              <span class="checkbox-text">{{ type }}</span>
            </label>
          </div>
        </div>

        <!-- Education goals filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('educationGoals')">
            <label>Education goals ({{ selectedEducationGoals.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.educationGoals }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedEducationGoals.length > 0">
            <span v-for="goal in selectedEducationGoals" :key="goal" class="selected-tag">
              {{ goal }}
              <button @click="removeFilter('selectedEducationGoals', goal)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.educationGoals">
            <label v-for="goal in educationGoals" :key="goal" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="goal" 
                v-model="selectedEducationGoals"
              />
              <span class="checkbox-text">{{ goal }}</span>
            </label>
          </div>
        </div>

        <!-- ===== PEDAGOGY ===== -->
        <div class="filter-section-divider">
          <h3>Pedagogy</h3>
        </div>

        <!-- Teaching environment filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('teachingEnvironments')">
            <label>Teaching environment ({{ selectedTeachingEnvironments.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.teachingEnvironments }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedTeachingEnvironments.length > 0">
            <span v-for="env in selectedTeachingEnvironments" :key="env" class="selected-tag">
              {{ env }}
              <button @click="removeFilter('selectedTeachingEnvironments', env)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.teachingEnvironments">
            <label v-for="env in teachingEnvironments" :key="env" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="env" 
                v-model="selectedTeachingEnvironments"
              />
              <span class="checkbox-text">{{ env }}</span>
            </label>
          </div>
        </div>

        <!-- Teaching mode filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('teachingModes')">
            <label>Teaching mode ({{ selectedTeachingModes.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.teachingModes }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedTeachingModes.length > 0">
            <span v-for="mode in selectedTeachingModes" :key="mode" class="selected-tag">
              {{ mode }}
              <button @click="removeFilter('selectedTeachingModes', mode)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.teachingModes">
            <label v-for="mode in teachingModes" :key="mode" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="mode" 
                v-model="selectedTeachingModes"
              />
              <span class="checkbox-text">{{ mode }}</span>
            </label>
          </div>
        </div>

        <!-- Non-lecturing activities filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('nonLecturingActivities')">
            <label>Non-lecturing activities ({{ selectedNonLecturingActivities.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.nonLecturingActivities }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedNonLecturingActivities.length > 0">
            <span v-for="activity in selectedNonLecturingActivities" :key="activity" class="selected-tag">
              {{ activity }}
              <button @click="removeFilter('selectedNonLecturingActivities', activity)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.nonLecturingActivities">
            <label v-for="activity in nonLecturingActivities" :key="activity" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="activity" 
                v-model="selectedNonLecturingActivities"
              />
              <span class="checkbox-text">{{ activity }}</span>
            </label>
          </div>
        </div>

        <!-- Collaboration filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('collaboration')">
            <label>Collaboration ({{ selectedCollaboration.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.collaboration }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedCollaboration.length > 0">
            <span v-for="collab in selectedCollaboration" :key="collab" class="selected-tag">
              {{ collab }}
              <button @click="removeFilter('selectedCollaboration', collab)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.collaboration">
            <label v-for="collab in collaboration" :key="collab" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="collab" 
                v-model="selectedCollaboration"
              />
              <span class="checkbox-text">{{ collab }}</span>
            </label>
          </div>
        </div>

        <!-- Theoretical underpinnings filter (sub-categories) -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('theoreticalUnderpinnings')">
            <label>Theoretical underpinnings ({{ selectedTheoreticalUnderpinnings.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.theoreticalUnderpinnings }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedTheoreticalUnderpinnings.length > 0">
            <span v-for="theory in selectedTheoreticalUnderpinnings" :key="theory" class="selected-tag">
              {{ theory }}
              <button @click="removeFilter('selectedTheoreticalUnderpinnings', theory)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="nested-checkbox-group" v-show="expandedSections.theoreticalUnderpinnings">
            <div v-for="(theories, category) in theoreticalUnderpinningsCategories" :key="category" class="nested-category">
              <h5 class="category-title">{{ category }}</h5>
              <div class="checkbox-subgroup">
                <label v-for="theory in theories" :key="theory" class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :value="theory" 
                    v-model="selectedTheoreticalUnderpinnings"
                  />
                  <span class="checkbox-text">{{ theory }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== EFFECTS ===== -->
        <div class="filter-section-divider">
          <h3>Effects</h3>
        </div>

        <!-- Evaluation metrics filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('evaluationMetrics')">
            <label>Evaluation metrics ({{ selectedEvaluationMetrics.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.evaluationMetrics }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedEvaluationMetrics.length > 0">
            <span v-for="metric in selectedEvaluationMetrics" :key="metric" class="selected-tag">
              {{ metric }}
              <button @click="removeFilter('selectedEvaluationMetrics', metric)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.evaluationMetrics">
            <label v-for="metric in evaluationMetrics" :key="metric" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="metric" 
                v-model="selectedEvaluationMetrics"
              />
              <span class="checkbox-text">{{ metric }}</span>
            </label>
          </div>
        </div>

        <!-- Other tested variables filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('otherTestedVariables')">
            <label>Other tested variables ({{ selectedOtherTestedVariables.length }})</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.otherTestedVariables }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedOtherTestedVariables.length > 0">
            <span v-for="variable in selectedOtherTestedVariables" :key="variable" class="selected-tag">
              {{ variable }}
              <button @click="removeFilter('selectedOtherTestedVariables', variable)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="checkbox-group" v-show="expandedSections.otherTestedVariables">
            <label v-for="variable in otherTestedVariables" :key="variable" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="variable" 
                v-model="selectedOtherTestedVariables"
              />
              <span class="checkbox-text">{{ variable }}</span>
            </label>
          </div>
        </div>

        <div class="filter-actions">
          <button @click="clearAllFilters" class="clear-button">Clear All</button>
          <button @click="resetFilters" class="reset-button">Reset Filters</button>
        </div>
      </div>
    </div>

    <!-- Right project display area -->
    <div class="display-panel">
      <div class="display-header">
        <h2>Project List</h2>
        <div class="results-info">
          Found {{ filteredProjects.length }} projects
        </div>
      </div>

      <div class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.Id"
          class="project-card"
        >
          <!-- Title and link -->
          <div class="project-title-container">
            <h3 class="project-title">{{ truncateTitle(project.Title) }}</h3>
            <a 
              v-if="project.Link" 
              :href="project.Link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="external-link-icon"
              title="View Original"
            >
              🔗
            </a>
          </div>
          
          <!-- Year, source and publication type -->
          <div class="project-meta">
            <!-- {{ project.Year }} {{ project.Source }} {{ project['Publication type'] }} -->
            <span class="project-year">{{ project.Year }}</span>
            
            <span class="project-pub-type">{{ project['Publication type'] }}</span>
            <span class="project-source">{{ project.Source }}</span>
          </div>
          
          <!-- Explore more button -->
          <button 
            @click="openProjectDetails(project)" 
            class="explore-button"
          >
            EXPLORE MORE
          </button>
        </div>
      </div>
    </div>

    <!-- Detail sidebar -->
    <div class="detail-sidebar" :class="{ 'open': sidebarOpen }">
      <div class="sidebar-header">
        <h3>Project Details</h3>
        <button @click="closeSidebar" class="close-button">×</button>
      </div>
      
      <div class="sidebar-content" v-if="selectedProject">
        <!-- Basic Information -->
        <div class="detail-section">
          <h4>Basic Information</h4>
          <div class="detail-item">
            <label>Title:</label>
            <p>{{ selectedProject.Title }}</p>
          </div>
          <div class="detail-item">
            <label>Authors:</label>
            <p>{{ selectedProject.Authors }}</p>
          </div>
          <div class="detail-item">
            <label>Year:</label>
            <p>{{ selectedProject.Year }}</p>
          </div>
          <div class="detail-item">
            <label>Source:</label>
            <p>{{ selectedProject.Source }}</p>
          </div>
          <div class="detail-item">
            <label>Publication Type:</label>
            <p>{{ selectedProject['Publication type'] }}</p>
          </div>
          <div class="detail-item">
            <label>Research Areas:</label>
            <div class="tags-container">
              <span v-for="area in selectedProject['Research areas']" :key="area" class="detail-tag">
                {{ area }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject.Link">
            <label>Link:</label>
            <a :href="selectedProject.Link" target="_blank" rel="noopener noreferrer">
              View Original 🔗
            </a>
          </div>
        </div>

        <!-- Research Information -->
        <div class="detail-section">
          <h4>Research Information</h4>
          
          <div class="detail-item">
            <label>Subjects:</label>
            <div class="tags-container">
              <span v-for="subject in selectedProject.Subjects" :key="subject" class="detail-tag">
                {{ subject }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Country:</label>
            <div class="tags-container">
              <span v-for="country in selectedProject.Country" :key="country" class="detail-tag">
                {{ country }}
              </span>
            </div>
          </div>
        </div>

        <!-- Visualization Application -->
        <div class="detail-section">
          <h4>Visualization Application</h4>
          <div class="detail-item">
            <label>Visualization Types:</label>
            <div class="visualization-types">
              <div v-for="(types, category) in selectedProject['Visualization types']" :key="category">
                <h5>{{ category }}:</h5>
                <div class="tags-container">
                  <span v-for="type in types" :key="type" class="detail-tag">
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-item">
            <label>Visualization Forms:</label>
            <div class="tags-container">
              <span v-for="form in selectedProject['Visualization forms']" :key="form" class="detail-tag">
                {{ form }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Tool Types:</label>
            <div class="tags-container">
              <span v-for="tool in selectedProject['Tool types']" :key="tool" class="detail-tag">
                {{ tool }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Education Goals:</label>
            <div class="tags-container">
              <span v-for="goal in selectedProject['Education goals']" :key="goal" class="detail-tag">
                {{ goal }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pedagogy -->
        <div class="detail-section">
          <h4>Pedagogy</h4>
          <div class="detail-item">
            <label>Teaching Environment:</label>
            <div class="tags-container">
              <span v-for="env in selectedProject['Teaching environment']" :key="env" class="detail-tag">
                {{ env }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Teaching Mode:</label>
            <div class="tags-container">
              <span v-for="mode in selectedProject['Teaching mode']" :key="mode" class="detail-tag">
                {{ mode }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Non-lecturing Activities:</label>
            <div class="tags-container">
              <span v-for="activity in selectedProject['Non-lecturing activities']" :key="activity" class="detail-tag">
                {{ activity }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Collaboration:</label>
            <div class="tags-container">
              <span v-for="collab in selectedProject.Collaboration" :key="collab" class="detail-tag">
                {{ collab }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <label>Theoretical underpinnings:</label>
            <div class="visualization-types">
              <div v-for="(types, category) in selectedProject['Theoretical underpinnings']" :key="category">
                <h5>{{ category }}:</h5>
                <div class="tags-container">
                  <span v-for="type in types" :key="type" class="detail-tag">
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Effects -->
        <div class="detail-section">
          <h4>Effects</h4>
          <div class="detail-item">
            <label>Evaluation Metrics:</label>
            <div class="tags-container">
              <span v-for="metric in selectedProject['Evaluation metrics']" :key="metric" class="detail-tag">
                {{ metric }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject['Other tested variables'] && selectedProject['Other tested variables'].length > 0">
            <label>Other Tested Variables:</label>
            <div class="tags-container">
              <span v-for="variable in selectedProject['Other tested variables']" :key="variable" class="detail-tag">
                {{ variable }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div class="sidebar-overlay" :class="{ 'active': sidebarOpen }" @click="closeSidebar"></div>
  </div>
</template>

<script>
export default {
  name: 'DataDisplayView',
  data() {
    return {
      projects: [],
      searchKeyword: '',
      yearRange: {
        min: null,
        max: null
      },
      selectedResearchAreas: [],
      selectedSubjects: [],
      selectedCountries: [],
      selectedEducationGoals: [],
      selectedVisualizationForms: [],
      selectedToolTypes: [],
      selectedTeachingEnvironments: [],
      selectedTeachingModes: [],
      selectedNonLecturingActivities: [],
      selectedCollaboration: [],
      selectedEvaluationMetrics: [],
      selectedOtherTestedVariables: [],
      selectedVisualizationTypes: [],
      selectedTheoreticalUnderpinnings: [],
      
      // Filter options
      researchAreas: [],
      subjects: [],
      countries: [],
      educationGoals: [],
      visualizationForms: [],
      toolTypes: [],
      teachingEnvironments: [],
      teachingModes: [],
      nonLecturingActivities: [],
      collaboration: [],
      evaluationMetrics: [],
      otherTestedVariables: [],
      visualizationTypesCategories: {},
      theoreticalUnderpinningsCategories: {},
      
      // Sidebar related
      sidebarOpen: false,
      selectedProject: null,
      
      // Collapse state
      expandedSections: {
        researchAreas: false,
        subjects: false,
        countries: false,
        educationGoals: false,
        visualizationForms: false,
        toolTypes: false,
        teachingEnvironments: false,
        teachingModes: false,
        nonLecturingActivities: false,
        collaboration: false,
        evaluationMetrics: false,
        otherTestedVariables: false,
        visualizationTypes: false,
        theoreticalUnderpinnings: false
      }
    }
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects;

      // Search keyword filter
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(project => 
          project.Title.toLowerCase().includes(keyword) ||
          project.Authors.toLowerCase().includes(keyword) ||
          project.Source.toLowerCase().includes(keyword)
        );
      }

      // Year filter
      if (this.yearRange.min) {
        filtered = filtered.filter(project => project.Year >= this.yearRange.min);
      }
      if (this.yearRange.max) {
        filtered = filtered.filter(project => project.Year <= this.yearRange.max);
      }

      // Research areas filter (multi-select)
      if (this.selectedResearchAreas.length > 0) {
        filtered = filtered.filter(project => 
          project['Research areas'] && project['Research areas'].some(area =>
            this.selectedResearchAreas.includes(area)
          )
        );
      }

      // Subjects filter (multi-select)
      if (this.selectedSubjects.length > 0) {
        filtered = filtered.filter(project => 
          project.Subjects && project.Subjects.some(subject =>
            this.selectedSubjects.includes(subject)
          )
        );
      }

      // Country filter (multi-select)
      if (this.selectedCountries.length > 0) {
        filtered = filtered.filter(project => 
          project.Country && project.Country.some(country =>
            this.selectedCountries.includes(country)
          )
        );
      }

      // Teaching environment filter (multi-select)
      if (this.selectedTeachingEnvironments.length > 0) {
        filtered = filtered.filter(project => 
          project['Teaching environment'] && project['Teaching environment'].some(env =>
            this.selectedTeachingEnvironments.includes(env)
          )
        );
      }

      // Teaching mode filter (multi-select)
      if (this.selectedTeachingModes.length > 0) {
        filtered = filtered.filter(project => 
          project['Teaching mode'] && project['Teaching mode'].some(mode =>
            this.selectedTeachingModes.includes(mode)
          )
        );
      }

      // Education goals filter (multi-select)
      if (this.selectedEducationGoals.length > 0) {
        filtered = filtered.filter(project => 
          project['Education goals'] && project['Education goals'].some(goals =>
            this.selectedEducationGoals.includes(goals)
          )
        );
      }

      // Visualization forms filter (multi-select)
      if (this.selectedVisualizationForms.length > 0) {
        filtered = filtered.filter(project => 
          project['Visualization forms'] && project['Visualization forms'].some(form =>
            this.selectedVisualizationForms.includes(form)
          )
        );
      }

      // Tool types filter (multi-select)
      if (this.selectedToolTypes.length > 0) {
        filtered = filtered.filter(project => 
          project['Tool types'] && project['Tool types'].some(type =>
            this.selectedToolTypes.includes(type)
          )
        );
      }

      // Non-lecturing activities filter (multi-select)
      if (this.selectedNonLecturingActivities.length > 0) {
        filtered = filtered.filter(project => 
          project['Non-lecturing activities'] && project['Non-lecturing activities'].some(activity =>
            this.selectedNonLecturingActivities.includes(activity)
          )
        );
      }

      // Collaboration filter (multi-select)
      if (this.selectedCollaboration.length > 0) {
        filtered = filtered.filter(project => 
          project.Collaboration && project.Collaboration.some(collab =>
            this.selectedCollaboration.includes(collab)
          )
        );
      }

      // Evaluation metrics filter (multi-select)
      if (this.selectedEvaluationMetrics.length > 0) {
        filtered = filtered.filter(project => 
          project['Evaluation metrics'] && project['Evaluation metrics'].some(metric =>
            this.selectedEvaluationMetrics.includes(metric)
          )
        );
      }

      // Other tested variables filter (multi-select)
      if (this.selectedOtherTestedVariables.length > 0) {
        filtered = filtered.filter(project => 
          project['Other tested variables'] && project['Other tested variables'].some(variable =>
            this.selectedOtherTestedVariables.includes(variable)
          )
        );
      }

      // Visualization types filter (multi-select, sub-categories)
      if (this.selectedVisualizationTypes.length > 0) {
        filtered = filtered.filter(project => {
          if (!project['Visualization types']) return false;
          
          // Check values under all categories
          for (const category in project['Visualization types']) {
            if (project['Visualization types'][category] && 
                project['Visualization types'][category].some(type =>
                  this.selectedVisualizationTypes.includes(type)
                )) {
              return true;
            }
          }
          return false;
        });
      }

      // Theoretical underpinnings filter (multi-select, sub-categories)
      if (this.selectedTheoreticalUnderpinnings.length > 0) {
        filtered = filtered.filter(project => {
          if (!project['Theoretical underpinnings']) return false;
          
          // Check values under all categories
          for (const category in project['Theoretical underpinnings']) {
            if (project['Theoretical underpinnings'][category] && 
                project['Theoretical underpinnings'][category].some(theory =>
                  this.selectedTheoreticalUnderpinnings.includes(theory)
                )) {
              return true;
            }
          }
          return false;
        });
      }

      return filtered;
    }
  },
  
  async mounted() {
    await this.loadData();
    this.extractFilterOptions();
  },
  
  methods: {
    async loadData() {
      try {
        const response = await fetch('/src/assets/data/codes.json');
        this.projects = await response.json();
      } catch (error) {
        console.error('Failed to load data:', error);
        // Try loading from local file
        try {
          const codesData = require('@/assets/data/codes.json');
          this.projects = codesData;
        } catch (localError) {
          console.error('Failed to load local data:', localError);
        }
      }
    },
    
    extractFilterOptions() {
      // Extract all possible filter options
      const researchAreasSet = new Set();
      const subjectsSet = new Set();
      const countriesSet = new Set();
      const educationGoalsSet = new Set();
      const visualizationFormsSet = new Set();
      const toolTypesSet = new Set();
      const teachingEnvironmentsSet = new Set();
      const teachingModesSet = new Set();
      const nonLecturingActivitiesSet = new Set();
      const collaborationSet = new Set();
      const evaluationMetricsSet = new Set();
      const otherTestedVariablesSet = new Set();
      
      // Objects for storing sub-categories
      const visualizationTypesMap = {};
      const theoreticalUnderpinningsMap = {};
      
      this.projects.forEach(project => {
        // 研究领域
        if (project['Research areas']) {
          project['Research areas'].forEach(area => researchAreasSet.add(area));
        }
        
        // 学科
        if (project.Subjects) {
          project.Subjects.forEach(subject => subjectsSet.add(subject));
        }
        
        // 国家
        if (project.Country) {
          project.Country.forEach(country => countriesSet.add(country));
        }
        
        // 教育目标
        if (project['Education goals']) {
          project['Education goals'].forEach(goal => educationGoalsSet.add(goal));
        }
        
        // 可视化形式
        if (project['Visualization forms']) {
          project['Visualization forms'].forEach(form => visualizationFormsSet.add(form));
        }
        
        // 工具类型
        if (project['Tool types']) {
          project['Tool types'].forEach(type => toolTypesSet.add(type));
        }
        
        // 教学环境
        if (project['Teaching environment']) {
          project['Teaching environment'].forEach(env => teachingEnvironmentsSet.add(env));
        }
        
        // 教学模式
        if (project['Teaching mode']) {
          project['Teaching mode'].forEach(mode => teachingModesSet.add(mode));
        }
        
        // 非讲授活动
        if (project['Non-lecturing activities']) {
          project['Non-lecturing activities'].forEach(activity => nonLecturingActivitiesSet.add(activity));
        }
        
        // 协作
        if (project.Collaboration) {
          project.Collaboration.forEach(collab => collaborationSet.add(collab));
        }
        
        // 评估指标
        if (project['Evaluation metrics']) {
          project['Evaluation metrics'].forEach(metric => evaluationMetricsSet.add(metric));
        }
        
        // 其他测试变量
        if (project['Other tested variables']) {
          project['Other tested variables'].forEach(variable => {
            if (variable && variable.trim()) { // 过滤空值
              otherTestedVariablesSet.add(variable);
            }
          });
        }
        
        // 可视化类型（二级分类）
        if (project['Visualization types']) {
          Object.keys(project['Visualization types']).forEach(category => {
            if (!visualizationTypesMap[category]) {
              visualizationTypesMap[category] = new Set();
            }
            if (project['Visualization types'][category]) {
              project['Visualization types'][category].forEach(type => {
                if (type && type.trim()) { // 过滤空值
                  visualizationTypesMap[category].add(type);
                }
              });
            }
          });
        }
        
        // Theoretical underpinnings (sub-categories)
        if (project['Theoretical underpinnings']) {
          Object.keys(project['Theoretical underpinnings']).forEach(category => {
            if (!theoreticalUnderpinningsMap[category]) {
              theoreticalUnderpinningsMap[category] = new Set();
            }
            if (project['Theoretical underpinnings'][category]) {
              project['Theoretical underpinnings'][category].forEach(theory => {
                if (theory && theory.trim()) { // Filter empty values
                  theoreticalUnderpinningsMap[category].add(theory);
                }
              });
            }
          });
        }
      });
      
      // Convert to sorted arrays
      this.researchAreas = Array.from(researchAreasSet).sort();
      this.subjects = Array.from(subjectsSet).sort();
      this.countries = Array.from(countriesSet).sort();
      this.educationGoals = Array.from(educationGoalsSet).sort();
      this.visualizationForms = Array.from(visualizationFormsSet).sort();
      this.toolTypes = Array.from(toolTypesSet).sort();
      this.teachingEnvironments = Array.from(teachingEnvironmentsSet).sort();
      this.teachingModes = Array.from(teachingModesSet).sort();
      this.nonLecturingActivities = Array.from(nonLecturingActivitiesSet).sort();
      this.collaboration = Array.from(collaborationSet).sort();
      this.evaluationMetrics = Array.from(evaluationMetricsSet).sort();
      this.otherTestedVariables = Array.from(otherTestedVariablesSet).sort();
      
      // 转换二级分类为排序对象
      this.visualizationTypesCategories = {};
      Object.keys(visualizationTypesMap).forEach(category => {
        this.visualizationTypesCategories[category] = Array.from(visualizationTypesMap[category]).sort();
      });
      
      this.theoreticalUnderpinningsCategories = {};
      Object.keys(theoreticalUnderpinningsMap).forEach(category => {
        this.theoreticalUnderpinningsCategories[category] = Array.from(theoreticalUnderpinningsMap[category]).sort();
      });
    },
    
    resetFilters() {
      this.searchKeyword = '';
      this.yearRange = { min: null, max: null };
      this.selectedResearchAreas = [];
      this.selectedSubjects = [];
      this.selectedCountries = [];
      this.selectedEducationGoals = [];
      this.selectedVisualizationForms = [];
      this.selectedToolTypes = [];
      this.selectedTeachingEnvironments = [];
      this.selectedTeachingModes = [];
      this.selectedNonLecturingActivities = [];
      this.selectedCollaboration = [];
      this.selectedEvaluationMetrics = [];
      this.selectedOtherTestedVariables = [];
      this.selectedVisualizationTypes = [];
      this.selectedTheoreticalUnderpinnings = [];
    },
    
    // 新增方法
    truncateTitle(title) {
      if (title.length <= 120) return title;
      return title.substring(0, 120) + '...';
    },
    
    openProjectDetails(project) {
      this.selectedProject = project;
      this.sidebarOpen = true;
    },
    
    closeSidebar() {
      this.sidebarOpen = false;
      setTimeout(() => {
        this.selectedProject = null;
      }, 300);
    },
    
    // 折叠/展开筛选区域
    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section];
    },
    
    // 移除单个筛选项
    removeFilter(filterType, value) {
      const index = this[filterType].indexOf(value);
      if (index > -1) {
        this[filterType].splice(index, 1);
      }
    },
    
    // 清除所有筛选
    clearAllFilters() {
      this.selectedResearchAreas = [];
      this.selectedSubjects = [];
      this.selectedCountries = [];
      this.selectedEducationGoals = [];
      this.selectedVisualizationForms = [];
      this.selectedToolTypes = [];
      this.selectedTeachingEnvironments = [];
      this.selectedTeachingModes = [];
      this.selectedNonLecturingActivities = [];
      this.selectedCollaboration = [];
      this.selectedEvaluationMetrics = [];
      this.selectedOtherTestedVariables = [];
      this.selectedVisualizationTypes = [];
      this.selectedTheoreticalUnderpinnings = [];
    }
  }
}
</script>

<style scoped>
.data-display-container {
  display: flex;
  height: calc(100vh - 72px);
  background-color: #f8f9fa;
  position: relative;
}

.filter-panel {
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.filter-panel h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.search-section {
  margin-bottom: 30px;
}

.search-section h3 {
  margin-bottom: 10px;
  color: #555;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-section h3 {
  margin-bottom: 15px;
  color: #555;
  font-size: 1.1rem;
}

.filter-group {
  margin-bottom: 25px;
}

/* 筛选组标题样式 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.filter-header:hover {
  background-color: #e9ecef;
}

.filter-header label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  margin: 0;
}

.toggle-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.year-range {
  display: flex;
  align-items: center;
  gap: 10px;
  
}

.year-range input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width:20px;
}

/* 已选择标签样式 */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
  padding: 8px 0;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  background-color: #8456A1;
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove-tag:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 复选框组样式 */
.checkbox-group {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  background-color: #fafafa;
  margin-bottom: 10px;
}

/* 嵌套复选框组样式（二级分类） */
.nested-checkbox-group {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
  margin-bottom: 10px;
}

.nested-category {
  border-bottom: 1px solid #e9ecef;
  padding: 8px;
}

.nested-category:last-child {
  border-bottom: none;
}

.category-title {
  color: #495057;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px 0;
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 3px;
  text-transform: capitalize;
}

.checkbox-subgroup {
  padding-left: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #555;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.1);
}

.checkbox-text {
  line-height: 1.3;
}

.checkbox-label:hover {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
}

/* 筛选区域分隔符 */
.filter-section-divider {
  margin: 30px 0 20px 0;
  padding: 15px 0 10px 0;
  border-top: 2px solid #8456A1;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  position: relative;
}

.filter-section-divider h3 {
  margin: 0;
  color: #8456A1;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 筛选操作按钮 */
.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.clear-button {
  flex: 1;
  padding: 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clear-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.reset-button {
  flex: 1;
  padding: 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.reset-button:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.display-panel {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.display-header h2 {
  color: #333;
  font-size: 1.5rem;
}

.results-info {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* 3列网格布局 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.project-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 200px;
}

.project-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 标题容器 */
.project-title-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 1px;
  flex: 1;
}

.project-title {
  flex: 1;
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.external-link-icon {
  font-size: 16px;
  text-decoration: none;
  color: #8456A1;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.external-link-icon:hover {
  background-color: #e3f2fd;
  transform: scale(1.1);
}

/* 元数据区域 */
.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  align-items: center;
}

.project-year {
  background-color: #8456A1;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.project-source {
  background-color: #f8f9fa;
  color: #495057;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid #e9ecef;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-pub-type {
  background-color: #28a745;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
}

/* 探索按钮 */
.explore-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  margin-top: auto;
}

.explore-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 侧边栏样式 */
.detail-sidebar {
  position: fixed;
  top: 72px;
  right: -500px;
  width: 500px;
  height: calc(100vh - 72px);
  background-color: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.detail-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.sidebar-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
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
}

.close-button:hover {
  background-color: #e9ecef;
  color: #333;
}

.sidebar-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  border-left: 4px solid #8456A1;
  padding-left: 10px;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
  font-size: 14px;
}

.detail-item p {
  margin: 0;
  color: #333;
  line-height: 1.5;
  font-size: 14px;
}

.detail-item a {
  color: #8456A1;
  text-decoration: none;
  font-weight: 500;
}

.detail-item a:hover {
  text-decoration: underline;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-tag {
  background-color: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  border: 1px solid #e9ecef;
  font-weight: 500;
}

.visualization-types h5 {
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
  margin-top: 12px;
  font-weight: 600;
}

/* 遮罩层 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-sidebar {
    width: 450px;
    right: -450px;
  }
}

@media (max-width: 768px) {
  .data-display-container {
    flex-direction: column;
    height: auto;
  }
  
  .filter-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .display-panel {
    padding: 15px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .project-card {
    height: auto;
    min-height: 200px;
  }
  
  .detail-sidebar {
    width: 100%;
    right: -100%;
  }
  
  .detail-sidebar.open {
    right: 0;
  }
}

@media (max-width: 480px) {
  .project-title {
    font-size: 14px;
  }
  
  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .sidebar-content {
    padding: 15px;
  }
}
</style>
