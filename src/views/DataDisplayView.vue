<template>
  <div class="data-display-container">
    <!-- Left filter area -->
    <div class="filter-panel" :style="{ width: filterPanelWidth + 'px' }">
      <h2>Filter and Search</h2>
      
      <!-- Search box -->
      <div class="search-section">
        <!-- <h3>Search Projects</h3> -->
        <!-- <div class="filter-header">
            <label>Search Projects</label>
          </div> -->
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="Search title, author or keywords..." 
          class="search-input"
        />
      </div>

      <!-- Filters -->
      <div class="filter-section">
        <!-- <h3>Filter Conditions</h3> -->
        <div class="filter-section-divider">
          <h3>Basic Information</h3>
        </div>
        <!-- Year filter -->
        <div class="filter-group">
          <div class="filter-header">
            <label>Year Range</label>
          </div>
          <div class="year-range">
            <input v-model="yearRange.min" type="number" placeholder="1991" />
            -
            <input v-model="yearRange.max" type="number" placeholder="2024" />
          </div>
        </div>

        <!-- Research areas filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('researchAreas')">
            <label>Research areas</label>
            <!-- <label>Research areas ({{ selectedResearchAreas.length }})</label> -->
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
              <span class="checkbox-text">{{ area }} ({{ researchAreasCounts[area] || 0 }})</span>
            </label>
          </div>
        </div>
        <div class="filter-section-divider">
          <h3>Teaching Context</h3>
        </div>
        <!-- Subjects filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('subjects')">
            <label>Subjects</label>
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
              <span class="checkbox-text">{{ subject }} ({{ subjectsCounts[subject] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Country filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('countries')">
            <label>Country</label>
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
              <span class="checkbox-text">{{ country }} ({{ countriesCounts[country] || 0 }})</span>
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
            <label>Visualization types</label>
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
                  <span class="checkbox-text">{{ type }} ({{ (visualizationTypesCounts[category] && visualizationTypesCounts[category][type]) || 0 }})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Visualization forms filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('visualizationForms')">
            <label>Visualization forms</label>
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
              <span class="checkbox-text">{{ form }} ({{ visualizationFormsCounts[form] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Tool types filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('toolTypes')">
            <label>Tool types</label>
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
              <span class="checkbox-text">{{ type }} ({{ toolTypesCounts[type] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Education goals filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('educationGoals')">
            <label>Education goals</label>
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
              <span class="checkbox-text">{{ goal }} ({{ educationGoalsCounts[goal] || 0 }})</span>
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
            <label>Teaching environment</label>
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
              <span class="checkbox-text">{{ env }} ({{ teachingEnvironmentsCounts[env] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Teaching mode filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('teachingModes')">
            <label>Teaching mode</label>
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
              <span class="checkbox-text">{{ mode }} ({{ teachingModesCounts[mode] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Non-lecturing activities filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('nonLecturingActivities')">
            <label>Non-lecturing activities</label>
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
              <span class="checkbox-text">{{ activity }} ({{ nonLecturingActivitiesCounts[activity] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Collaboration filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('collaboration')">
            <label>Collaboration</label>
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
              <span class="checkbox-text">{{ collab }} ({{ collaborationCounts[collab] || 0 }})</span>
            </label>
          </div>
        </div>

        <!-- Theoretical underpinnings filter (sub-categories) -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('theoreticalUnderpinnings')">
            <label>Theoretical underpinnings</label>
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
                  <span class="checkbox-text">{{ theory }} ({{ (theoreticalUnderpinningsCounts[category] && theoreticalUnderpinningsCounts[category][theory]) || 0 }})</span>
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
            <label>Evaluation metrics</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.evaluationMetrics }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedEvaluationMetrics.length > 0">
            <span v-for="metric in selectedEvaluationMetrics" :key="metric" class="selected-tag">
              {{ metric }}
              <button @click="removeFilter('selectedEvaluationMetrics', metric)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="nested-checkbox-group" v-show="expandedSections.evaluationMetrics">
            <div v-for="(metrics, category) in evaluationMetricsCategories" :key="category" class="nested-category">
              <h5 class="category-title">{{ formatEvaluationCategory(category) }}</h5>
              <div class="checkbox-subgroup">
                <label v-for="metric in metrics" :key="metric" class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :value="metric" 
                    v-model="selectedEvaluationMetrics"
                  />
                  <span class="checkbox-text">{{ metric }} ({{ (evaluationMetricsCategoryCounts[category] && evaluationMetricsCategoryCounts[category][metric]) || 0 }})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Other tested variables filter -->
        <div class="filter-group">
          <div class="filter-header" @click="toggleSection('otherTestedVariables')">
            <label>Other tested variables</label>
            <span class="toggle-icon" :class="{ 'expanded': expandedSections.otherTestedVariables }">▼</span>
          </div>
          <div class="selected-tags" v-if="selectedOtherTestedVariables.length > 0">
            <span v-for="variable in selectedOtherTestedVariables" :key="variable" class="selected-tag">
              {{ variable }}
              <button @click="removeFilter('selectedOtherTestedVariables', variable)" class="remove-tag">×</button>
            </span>
          </div>
          <div class="nested-checkbox-group" v-show="expandedSections.otherTestedVariables">
            <div v-for="(variables, category) in otherTestedVariablesCategories" :key="category" class="nested-category">
              <h5 class="category-title">{{ category }}</h5>
              <div class="checkbox-subgroup">
                <label v-for="variable in variables" :key="variable" class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :value="variable" 
                    v-model="selectedOtherTestedVariables"
                  />
                  <span class="checkbox-text">{{ variable }} ({{ (otherTestedVariablesCategoryCounts[category] && otherTestedVariablesCategoryCounts[category][variable]) || 0 }})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <button @click="clearAllFilters" class="clear-button">Clear All</button>
          <button @click="resetFilters" class="reset-button">Reset Filters</button>
        </div>
      </div>
      <div class="filter-resizer" @mousedown="startResize"></div>
    </div>

    <!-- Right project display area -->
    <div class="display-panel">
      <div class="display-header">
        <h2>Paper List</h2>
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
            <span>ID:{{project.Id+1}}</span>
          </div>
          
          <!-- Year, source and publication type -->
          <div class="project-meta">
            <!-- {{ project.Year }} {{ project.Source }} {{ project['Publication type'] }} -->
            <span class="project-year">{{ project.Year }}</span>
            
            <!-- <span class="project-pub-type">{{ project['Publication type'] }}</span> -->
            <span class="project-source">{{ project.Source }}</span>
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
          <div class="detail-item" v-if="selectedProject['Research areas'] && selectedProject['Research areas'].length > 0">
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

        <!-- Teaching context -->
        <div class="detail-section">
          <h4>Teaching context</h4>
          
          <div class="detail-item" v-if="selectedProject.Subjects && selectedProject.Subjects.length > 0">
            <label>Subjects:</label>
            <div class="tags-container">
              <span v-for="subject in selectedProject.Subjects" :key="subject" class="detail-tag">
                {{ subject }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject.Country && selectedProject.Country.length > 0">
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
                <h5 v-if="types.length > 0">{{ category }}:</h5>
                <div class="tags-container">
                  <span v-for="type in types" :key="type" class="detail-tag">
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject['Visualization forms'] && selectedProject['Visualization forms'].length > 0">
            <label>Visualization Forms:</label>
            <div class="tags-container">
              <span v-for="form in selectedProject['Visualization forms']" :key="form" class="detail-tag">
                {{ form }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject['Tool types'] && selectedProject['Tool types'].length > 0">
            <label>Tool Types:</label>
            <div class="tags-container">
              <span v-for="tool in selectedProject['Tool types']" :key="tool" class="detail-tag">
                {{ tool }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject['Education goals'] && selectedProject['Education goals'].length > 0">
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
          <div class="detail-item" v-if="selectedProject['Teaching environment'] && selectedProject['Teaching environment'].length > 0">
            <label>Teaching Environment:</label>
            <div class="tags-container">
              <span v-for="env in selectedProject['Teaching environment']" :key="env" class="detail-tag">
                {{ env }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject['Teaching mode'] && selectedProject['Teaching mode'].length > 0">
            <label>Teaching Mode:</label>
            <div class="tags-container">
              <span v-for="mode in selectedProject['Teaching mode']" :key="mode" class="detail-tag">
                {{ mode }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject['Non-lecturing activities'] && selectedProject['Non-lecturing activities'].length > 0">
            <label>Non-lecturing Activities:</label>
            <div class="tags-container">
              <span v-for="activity in selectedProject['Non-lecturing activities']" :key="activity" class="detail-tag">
                {{ activity }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="selectedProject.Collaboration && selectedProject.Collaboration.length > 0">
            <label>Collaboration:</label>
            <div class="tags-container">
              <span v-for="collab in selectedProject.Collaboration" :key="collab" class="detail-tag">
                {{ collab }}
              </span>
            </div>
          </div>
          <div class="detail-item" v-if="hasTheoreticalUnderpinnings">
            <label>Theoretical underpinnings:</label>
            <div class="visualization-types">
              <div v-for="(types, category) in selectedProject['Theoretical underpinnings']" :key="category">
                <h5 v-if="types.length > 0">{{ category }}:</h5>
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
          <div class="detail-item" v-if="selectedProject['Evaluation metrics'] && selectedProject['Evaluation metrics'].length > 0">
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
import columnMapping from '@/assets/data/column_mapping2.json';

export default {
  name: 'DataDisplayView',
  data() {
    return {
      projects: [],
      searchKeyword: '',
      yearRange: {
        min: 1991,
        max: 2024
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
      researchAreasCounts: {},
      subjects: [],
      subjectsCounts: {},
      countries: [],
      countriesCounts: {},
      educationGoals: [],
      educationGoalsCounts: {},
      visualizationForms: [],
      visualizationFormsCounts: {},
      toolTypes: [],
      toolTypesCounts: {},
      teachingEnvironments: [],
      teachingEnvironmentsCounts: {},
      teachingModes: [],
      teachingModesCounts: {},
      nonLecturingActivities: [],
      nonLecturingActivitiesCounts: {},
      collaboration: [],
      collaborationCounts: {},
      evaluationMetrics: [],
      evaluationMetricsCounts: {},
      evaluationMetricsCategories: {},
      evaluationMetricsCategoryCounts: {},
      otherTestedVariables: [],
      otherTestedVariablesCounts: {},
      otherTestedVariablesCategories: {},
      otherTestedVariablesCategoryCounts: {},
      visualizationTypesCategories: {},
      visualizationTypesCounts: {},
      theoreticalUnderpinningsCategories: {},
      theoreticalUnderpinningsCounts: {},
      
      // Sidebar related
      sidebarOpen: false,
      selectedProject: null,

      // Filter panel resize
      filterPanelWidth: 300,
      isResizingFilter: false,
      resizeStartX: 0,
      resizeStartWidth: 300,
      
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
    hasTheoreticalUnderpinnings() {
      if (!this.selectedProject || !this.selectedProject['Theoretical underpinnings']) {
        return false;
      }
      const theories = this.selectedProject['Theoretical underpinnings'];
      // 检查是否有任何子类包含数据
      return Object.values(theories).some(category =>category.length > 0);
    },
    
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
    window.addEventListener('mousemove', this.onResizeMove);
    window.addEventListener('mouseup', this.stopResize);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onResizeMove);
    window.removeEventListener('mouseup', this.stopResize);
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

      const researchAreasCounts = {};
      const subjectsCounts = {};
      const countriesCounts = {};
      const educationGoalsCounts = {};
      const visualizationFormsCounts = {};
      const toolTypesCounts = {};
      const teachingEnvironmentsCounts = {};
      const teachingModesCounts = {};
      const nonLecturingActivitiesCounts = {};
      const collaborationCounts = {};
      const evaluationMetricsCounts = {};
      const otherTestedVariablesCounts = {};
      const evaluationMetricsCategoryCounts = {};
      const otherTestedVariablesCategoryCounts = {};
      
      // Objects for storing sub-categories
      const visualizationTypesMap = {};
      const theoreticalUnderpinningsMap = {};
      const visualizationTypesCounts = {};
      const theoreticalUnderpinningsCounts = {};

      const evaluationMetricsCategories = {};
      const otherTestedVariablesCategories = {};
      const evaluationMetricToCategory = new Map();
      const otherTestedVariableToCategory = new Map();

      const evaluationMapping = columnMapping['Evaluation metrics'] || {};
      Object.keys(evaluationMapping).forEach(category => {
        evaluationMetricsCategories[category] = [...evaluationMapping[category]];
        evaluationMetricsCategoryCounts[category] = {};
        evaluationMapping[category].forEach(metric => {
          evaluationMetricToCategory.set(metric, category);
        });
      });

      const otherTestedMapping = columnMapping['Other tested variables'] || {};
      Object.keys(otherTestedMapping).forEach(category => {
        otherTestedVariablesCategories[category] = [...otherTestedMapping[category]];
        otherTestedVariablesCategoryCounts[category] = {};
        otherTestedMapping[category].forEach(variable => {
          otherTestedVariableToCategory.set(variable, category);
        });
      });

      const incrementCount = (map, key) => {
        map[key] = (map[key] || 0) + 1;
      };
      
      this.projects.forEach(project => {
        // 研究领域
        if (project['Research areas']) {
          project['Research areas'].forEach(area => researchAreasSet.add(area));
          project['Research areas'].forEach(area => incrementCount(researchAreasCounts, area));
        }
        
        // 学科
        if (project.Subjects) {
          project.Subjects.forEach(subject => subjectsSet.add(subject));
          project.Subjects.forEach(subject => incrementCount(subjectsCounts, subject));
        }
        
        // 国家
        if (project.Country) {
          project.Country.forEach(country => countriesSet.add(country));
          project.Country.forEach(country => incrementCount(countriesCounts, country));
        }
        
        // 教育目标
        if (project['Education goals']) {
          project['Education goals'].forEach(goal => educationGoalsSet.add(goal));
          project['Education goals'].forEach(goal => incrementCount(educationGoalsCounts, goal));
        }
        
        // 可视化形式
        if (project['Visualization forms']) {
          project['Visualization forms'].forEach(form => visualizationFormsSet.add(form));
          project['Visualization forms'].forEach(form => incrementCount(visualizationFormsCounts, form));
        }
        
        // 工具类型
        if (project['Tool types']) {
          project['Tool types'].forEach(type => toolTypesSet.add(type));
          project['Tool types'].forEach(type => incrementCount(toolTypesCounts, type));
        }
        
        // 教学环境
        if (project['Teaching environment']) {
          project['Teaching environment'].forEach(env => teachingEnvironmentsSet.add(env));
          project['Teaching environment'].forEach(env => incrementCount(teachingEnvironmentsCounts, env));
        }
        
        // 教学模式
        if (project['Teaching mode']) {
          project['Teaching mode'].forEach(mode => teachingModesSet.add(mode));
          project['Teaching mode'].forEach(mode => incrementCount(teachingModesCounts, mode));
        }
        
        // 非讲授活动
        if (project['Non-lecturing activities']) {
          project['Non-lecturing activities'].forEach(activity => nonLecturingActivitiesSet.add(activity));
          project['Non-lecturing activities'].forEach(activity => incrementCount(nonLecturingActivitiesCounts, activity));
        }
        
        // 协作
        if (project.Collaboration) {
          project.Collaboration.forEach(collab => collaborationSet.add(collab));
          project.Collaboration.forEach(collab => incrementCount(collaborationCounts, collab));
        }
        
        // 评估指标
        if (project['Evaluation metrics']) {
          project['Evaluation metrics'].forEach(metric => evaluationMetricsSet.add(metric));
          project['Evaluation metrics'].forEach(metric => incrementCount(evaluationMetricsCounts, metric));
          project['Evaluation metrics'].forEach(metric => {
            const category = evaluationMetricToCategory.get(metric);
            if (category) {
              incrementCount(evaluationMetricsCategoryCounts[category], metric);
            }
          });
        }
        
        // 其他测试变量
        if (project['Other tested variables']) {
          project['Other tested variables'].forEach(variable => {
            if (variable && variable.trim()) { // 过滤空值
              otherTestedVariablesSet.add(variable);
              incrementCount(otherTestedVariablesCounts, variable);
              const category = otherTestedVariableToCategory.get(variable);
              if (category) {
                incrementCount(otherTestedVariablesCategoryCounts[category], variable);
              }
            }
          });
        }
        
        // 可视化类型（二级分类）
        if (project['Visualization types']) {
          Object.keys(project['Visualization types']).forEach(category => {
            if (!visualizationTypesMap[category]) {
              visualizationTypesMap[category] = new Set();
            }
            if (!visualizationTypesCounts[category]) {
              visualizationTypesCounts[category] = {};
            }
            if (project['Visualization types'][category]) {
              project['Visualization types'][category].forEach(type => {
                if (type && type.trim()) { // 过滤空值
                  visualizationTypesMap[category].add(type);
                  incrementCount(visualizationTypesCounts[category], type);
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
            if (!theoreticalUnderpinningsCounts[category]) {
              theoreticalUnderpinningsCounts[category] = {};
            }
            if (project['Theoretical underpinnings'][category]) {
              project['Theoretical underpinnings'][category].forEach(theory => {
                if (theory && theory.trim()) { // Filter empty values
                  theoreticalUnderpinningsMap[category].add(theory);
                  incrementCount(theoreticalUnderpinningsCounts[category], theory);
                }
              });
            }
          });
        }
      });
      
      // Convert to sorted arrays
      const sortByCountThenName = (items, counts) => (
        items.sort((a, b) => {
          const countDiff = (counts[b] || 0) - (counts[a] || 0);
          if (countDiff !== 0) return countDiff;
          return a.localeCompare(b);
        })
      );

      this.researchAreas = sortByCountThenName(Array.from(researchAreasSet), researchAreasCounts);
      this.subjects = sortByCountThenName(Array.from(subjectsSet), subjectsCounts);
      this.countries = sortByCountThenName(Array.from(countriesSet), countriesCounts);
      this.educationGoals = sortByCountThenName(Array.from(educationGoalsSet), educationGoalsCounts);
      this.visualizationForms = sortByCountThenName(Array.from(visualizationFormsSet), visualizationFormsCounts);
      this.toolTypes = sortByCountThenName(Array.from(toolTypesSet), toolTypesCounts);
      this.teachingEnvironments = sortByCountThenName(Array.from(teachingEnvironmentsSet), teachingEnvironmentsCounts);
      this.teachingModes = sortByCountThenName(Array.from(teachingModesSet), teachingModesCounts);
      this.nonLecturingActivities = sortByCountThenName(Array.from(nonLecturingActivitiesSet), nonLecturingActivitiesCounts);
      this.collaboration = sortByCountThenName(Array.from(collaborationSet), collaborationCounts);
      this.evaluationMetrics = sortByCountThenName(Array.from(evaluationMetricsSet), evaluationMetricsCounts);
      this.otherTestedVariables = sortByCountThenName(Array.from(otherTestedVariablesSet), otherTestedVariablesCounts);

      this.evaluationMetricsCategories = evaluationMetricsCategories;
      this.otherTestedVariablesCategories = otherTestedVariablesCategories;
      
      // 转换二级分类为排序对象
      this.visualizationTypesCategories = {};
      Object.keys(visualizationTypesMap).forEach(category => {
        this.visualizationTypesCategories[category] = sortByCountThenName(
          Array.from(visualizationTypesMap[category]),
          visualizationTypesCounts[category]
        );
      });

      this.theoreticalUnderpinningsCategories = {};
      Object.keys(theoreticalUnderpinningsMap).forEach(category => {
        this.theoreticalUnderpinningsCategories[category] = sortByCountThenName(
          Array.from(theoreticalUnderpinningsMap[category]),
          theoreticalUnderpinningsCounts[category]
        );
      });

      Object.keys(evaluationMetricsCategories).forEach(category => {
        evaluationMetricsCategories[category] = sortByCountThenName(
          Array.from(evaluationMetricsCategories[category]),
          evaluationMetricsCategoryCounts[category]
        );
      });

      Object.keys(otherTestedVariablesCategories).forEach(category => {
        otherTestedVariablesCategories[category] = sortByCountThenName(
          Array.from(otherTestedVariablesCategories[category]),
          otherTestedVariablesCategoryCounts[category]
        );
      });

      this.researchAreasCounts = researchAreasCounts;
      this.subjectsCounts = subjectsCounts;
      this.countriesCounts = countriesCounts;
      this.educationGoalsCounts = educationGoalsCounts;
      this.visualizationFormsCounts = visualizationFormsCounts;
      this.toolTypesCounts = toolTypesCounts;
      this.teachingEnvironmentsCounts = teachingEnvironmentsCounts;
      this.teachingModesCounts = teachingModesCounts;
      this.nonLecturingActivitiesCounts = nonLecturingActivitiesCounts;
      this.collaborationCounts = collaborationCounts;
      this.evaluationMetricsCounts = evaluationMetricsCounts;
      this.otherTestedVariablesCounts = otherTestedVariablesCounts;
      this.evaluationMetricsCategoryCounts = evaluationMetricsCategoryCounts;
      this.otherTestedVariablesCategoryCounts = otherTestedVariablesCategoryCounts;
      this.visualizationTypesCounts = visualizationTypesCounts;
      this.theoreticalUnderpinningsCounts = theoreticalUnderpinningsCounts;
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

    formatEvaluationCategory(category) {
      if (category === 'no formal evaluation') return 'no';
      return category;
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
    },
    startResize(event) {
      this.isResizingFilter = true;
      this.resizeStartX = event.clientX;
      this.resizeStartWidth = this.filterPanelWidth;
    },
    onResizeMove(event) {
      if (!this.isResizingFilter) return;
      const delta = event.clientX - this.resizeStartX;
      const nextWidth = this.resizeStartWidth + delta;
      const minWidth = 220;
      const maxWidth = 520;
      this.filterPanelWidth = Math.min(maxWidth, Math.max(minWidth, nextWidth));
    },
    stopResize() {
      if (!this.isResizingFilter) return;
      this.isResizingFilter = false;
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
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 20px 20px 20px 32px;
  overflow-y: auto;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  position: relative;
  min-width: 220px;
  max-width: 520px;
}

.filter-resizer {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
}

.filter-resizer:hover {
  background: rgba(81, 176, 202, 0.2);
}

.filter-panel h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.2em;
}

.search-section {
  margin-bottom: 30px;
}

.search-section h3 {
  margin-bottom: 10px;
  color: #555;
  font-size: 1.2rem;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
}

.filter-section h3 {
  margin-bottom: 15px;
  color: #555;
  font-size: 1.2rem;
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
  font-size: 15px;
  cursor: pointer;
  margin: 0;
}

.toggle-icon {
  font-size: 13px;
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
  font-size: 15px;
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
  background-color: #51B0CA;
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  gap: 4px;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  font-size: 15px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  padding: 0 0 0 15px;
  border-left: 4px solid #51B0CA;
  position: relative;
}

.filter-section-divider h3 {
  margin: 0;
  color: #51B0CA;
  font-size: 1.2em;
  font-weight: normal;
  text-align: left;
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
  font-size: 15px;
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
  font-size: 15px;
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
  font-size: 1.2em;
}

.results-info {
  color: #666;
  font-size: 15px;
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
  font-size: 17px;
  line-height: 1.4;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.external-link-icon {
  font-size: 15px;
  text-decoration: none;
  color: #51B0CA;
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
  background-color: #FFBA00;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}

.project-source {
  background-color: #f8f9fa;
  color: #495057;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e9ecef;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-pub-type {
  background-color: #28a745;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

/* 探索按钮 */
.explore-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #70d3b4 0%, #51B0CA 100%);
  color: white;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
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
  font-size: 1.4rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 25px;
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
  font-size: 1.2rem;
  font-weight: 600;
  border-left: 4px solid #51B0CA;
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
  font-size: 15px;
}

.detail-item p {
  margin: 0;
  color: #333;
  line-height: 1.5;
  font-size: 15px;
}

.detail-item a {
  color: #51B0CA;
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
  font-size: 13px;
  border: 1px solid #e9ecef;
  font-weight: 500;
}

.visualization-types h5 {
  color: #666;
  font-size: 14px;
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

  .filter-resizer {
    display: none;
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
    font-size: 15px;
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
