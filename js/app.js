/* ============================================
   SDTM Academy - Main Application
   ============================================ */

const App = {
    levels: [],
    allModules: [],
    currentModuleId: null,
    progress: {},
    quizResults: {},

    /**
     * Initialize the application
     */
    init() {
        // Load level data
        this.levels = [LEVEL1_DATA, LEVEL2_DATA, LEVEL3_DATA, LEVEL4_DATA, LEVEL5_DATA, LEVEL6_DATA];

        // Build flat module list
        this.allModules = [];
        this.levels.forEach(level => {
            level.modules.forEach(mod => {
                this.allModules.push({
                    ...mod,
                    levelId: level.id,
                    levelTitle: level.title
                });
            });
        });

        // Load saved progress
        this.loadProgress();

        // Build sidebar
        this.buildSidebar();

        // Show dashboard
        this.showDashboard();

        // Apply dark mode if saved
        if (localStorage.getItem('sdtm-darkmode') === 'true') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Update global progress
        this.updateGlobalProgress();

        // Setup collapsible click handlers (delegated)
        document.addEventListener('click', (e) => {
            const header = e.target.closest('.collapsible-header');
            if (header) {
                header.parentElement.classList.toggle('open');
            }
        });
    },

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('sdtm-progress');
            if (saved) this.progress = JSON.parse(saved);
            const savedQuiz = localStorage.getItem('sdtm-quiz-results');
            if (savedQuiz) this.quizResults = JSON.parse(savedQuiz);
        } catch (e) {
            this.progress = {};
            this.quizResults = {};
        }
    },

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        localStorage.setItem('sdtm-progress', JSON.stringify(this.progress));
        localStorage.setItem('sdtm-quiz-results', JSON.stringify(this.quizResults));
    },

    /**
     * Mark a module as completed
     */
    completeModule(moduleId) {
        this.progress[moduleId] = { completed: true, completedAt: new Date().toISOString() };
        this.saveProgress();
        this.buildSidebar();
        this.updateGlobalProgress();
    },

    /**
     * Save quiz result
     */
    saveQuizResult(moduleId, result) {
        this.quizResults[moduleId] = {
            ...result,
            attemptedAt: new Date().toISOString()
        };
        this.saveProgress();
    },

    /**
     * Check if module is completed
     */
    isModuleCompleted(moduleId) {
        return this.progress[moduleId] && this.progress[moduleId].completed;
    },

    /**
     * Update global progress bar
     */
    updateGlobalProgress() {
        const total = this.allModules.length;
        const completed = this.allModules.filter(m => this.isModuleCompleted(m.id)).length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        const fill = document.getElementById('globalProgressFill');
        const text = document.getElementById('globalProgressText');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = `${pct}% 完了 (${completed}/${total})`;
    },

    /**
     * Build sidebar navigation
     */
    buildSidebar() {
        const nav = document.getElementById('sidebarNav');
        let html = '';

        this.levels.forEach(level => {
            const levelModules = level.modules;
            const completedCount = levelModules.filter(m => this.isModuleCompleted(m.id)).length;
            const isCurrentLevel = this.currentModuleId && levelModules.some(m => m.id === this.currentModuleId);

            html += `
                <div class="sidebar-level">
                    <div class="sidebar-level-header ${isCurrentLevel ? 'expanded' : ''}"
                         onclick="App.toggleLevel(this)">
                        <span>${level.icon} Level ${level.id}: ${level.title}</span>
                        <span style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:0.7rem;opacity:0.7;">${completedCount}/${levelModules.length}</span>
                            <span class="chevron">▶</span>
                        </span>
                    </div>
                    <div class="sidebar-modules ${isCurrentLevel ? 'expanded' : ''}">
            `;

            levelModules.forEach(mod => {
                const isCompleted = this.isModuleCompleted(mod.id);
                const isActive = this.currentModuleId === mod.id;

                html += `
                    <div class="sidebar-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}"
                         onclick="App.showModule(${mod.id})">
                        <span class="status-dot"></span>
                        <span>${mod.title}</span>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        nav.innerHTML = html;
    },

    /**
     * Toggle sidebar level expand/collapse
     */
    toggleLevel(header) {
        header.classList.toggle('expanded');
        const modules = header.nextElementSibling;
        modules.classList.toggle('expanded');
    },

    /**
     * Toggle sidebar on mobile
     */
    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    },

    /**
     * Show the dashboard view
     */
    showDashboard() {
        this.currentModuleId = null;
        this.showView('dashboardView');
        this.buildSidebar();

        const container = document.getElementById('dashboardView');
        const totalModules = this.allModules.length;
        const completedModules = this.allModules.filter(m => this.isModuleCompleted(m.id)).length;
        const totalQuizzes = Object.keys(this.quizResults).length;
        const avgScore = totalQuizzes > 0
            ? Math.round(Object.values(this.quizResults).reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
            : 0;

        let html = `
            <div class="fade-in">
                <div class="dashboard-hero">
                    <h2>SDTM Academy へようこそ</h2>
                    <p>臨床試験データの国際標準 SDTM を基礎からプロレベルまで学べる総合教育プラットフォームです。</p>
                </div>

                <div class="dashboard-grid">
                    <div class="stat-card">
                        <div class="stat-value">${completedModules}/${totalModules}</div>
                        <div class="stat-label">モジュール完了</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalQuizzes}</div>
                        <div class="stat-label">クイズ受験数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${avgScore}%</div>
                        <div class="stat-label">平均クイズスコア</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.getEstimatedTime()}</div>
                        <div class="stat-label">残り学習時間(目安)</div>
                    </div>
                </div>

                <h2 style="margin-bottom:20px;font-size:1.3rem;">学習コース</h2>
                <div class="dashboard-grid">
        `;

        this.levels.forEach(level => {
            const levelMods = level.modules;
            const completed = levelMods.filter(m => this.isModuleCompleted(m.id)).length;
            const pct = Math.round((completed / levelMods.length) * 100);

            html += `
                <div class="level-card level-${level.id}" onclick="App.showModule(${levelMods[0].id})">
                    <div class="level-card-header">
                        <div class="level-icon">${level.icon}</div>
                        <div>
                            <h3>Level ${level.id}: ${level.title}</h3>
                            <div class="level-desc">${level.description} (${levelMods.length}モジュール)</div>
                        </div>
                    </div>
                    <div class="level-progress">
                        <div class="level-progress-bar">
                            <div class="level-progress-fill" style="width:${pct}%"></div>
                        </div>
                        <div class="level-progress-text">${completed}/${levelMods.length} 完了 (${pct}%)</div>
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
    },

    /**
     * Get estimated remaining time
     */
    getEstimatedTime() {
        let totalMinutes = 0;
        this.allModules.forEach(m => {
            if (!this.isModuleCompleted(m.id)) {
                const match = m.duration.match(/(\d+)/);
                if (match) totalMinutes += parseInt(match[1]);
            }
        });
        if (totalMinutes === 0) return '完了！';
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return hours > 0 ? `約${hours}時間${mins}分` : `約${mins}分`;
    },

    /**
     * Show a specific module
     */
    showModule(moduleId) {
        const mod = this.allModules.find(m => m.id === moduleId);
        if (!mod) return;

        this.currentModuleId = moduleId;
        this.showView('moduleView');
        this.buildSidebar();

        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');

        const container = document.getElementById('moduleView');
        const level = this.levels.find(l => l.id === mod.levelId);
        const modIndex = this.allModules.findIndex(m => m.id === moduleId);
        const prevMod = modIndex > 0 ? this.allModules[modIndex - 1] : null;
        const nextMod = modIndex < this.allModules.length - 1 ? this.allModules[modIndex + 1] : null;

        let html = `
            <div class="fade-in">
                <div class="module-header">
                    <div class="module-breadcrumb">
                        <a onclick="App.showDashboard()">ダッシュボード</a>
                        &nbsp;/&nbsp;
                        <a onclick="App.showModule(${level.modules[0].id})">Level ${level.id}: ${level.title}</a>
                        &nbsp;/&nbsp;
                        ${mod.title}
                    </div>
                    <h1 class="module-title">${mod.title}</h1>
                    <div class="module-meta">
                        <span>⏱ ${mod.duration}</span>
                        <span>${this.isModuleCompleted(moduleId) ? '✅ 完了済み' : '📖 未完了'}</span>
                    </div>
                </div>
                <div class="module-body">
                    ${mod.content}
                </div>
                <div class="module-nav">
                    <div>
                        ${prevMod ? `
                            <button class="btn btn-outline" onclick="App.showModule(${prevMod.id})">
                                ← ${prevMod.title}
                            </button>
                        ` : ''}
                    </div>
                    <div style="display:flex;gap:12px;">
                        ${mod.quiz && mod.quiz.length > 0 ? `
                            <button class="btn btn-primary btn-lg" onclick="App.startQuiz(${moduleId})">
                                理解度チェック (${mod.quiz.length}問)
                            </button>
                        ` : `
                            <button class="btn btn-success btn-lg" onclick="App.completeModule(${moduleId}); App.goToNextModule(${moduleId});">
                                完了して次へ
                            </button>
                        `}
                    </div>
                    <div>
                        ${nextMod ? `
                            <button class="btn btn-outline" onclick="App.showModule(${nextMod.id})">
                                ${nextMod.title} →
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Scroll to top
        document.querySelector('.content').scrollTop = 0;

        // Re-highlight code blocks
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

        // Initialize exercises if any
        this.initModuleExercises(moduleId);
    },

    /**
     * Initialize interactive exercises for specific modules
     */
    initModuleExercises(moduleId) {
        // Module 104 - Variable roles exercise
        if (moduleId === 104 && document.getElementById('exercise-var-roles')) {
            Exercises.createClassificationExercise('exercise-var-roles', {
                title: '変数ロール分類演習',
                variables: [
                    { name: 'STUDYID', correctRole: 'Identifier' },
                    { name: 'USUBJID', correctRole: 'Identifier' },
                    { name: 'AETERM', correctRole: 'Topic' },
                    { name: 'AESEV', correctRole: 'Qualifier' },
                    { name: 'AESTDTC', correctRole: 'Timing' },
                    { name: 'DOMAIN', correctRole: 'Identifier' },
                    { name: 'AESEQ', correctRole: 'Identifier' },
                    { name: 'EPOCH', correctRole: 'Timing' }
                ],
                roles: ['Identifier', 'Topic', 'Qualifier', 'Timing', 'Rule']
            });
        }

        // Module 201 - DM mapping exercise
        if (moduleId === 201 && document.getElementById('exercise-dm-mapping')) {
            Exercises.createMappingExercise('exercise-dm-mapping', {
                title: 'DM変数マッピング演習',
                sourceLabel: 'CRFフィールド',
                targetLabel: 'SDTM変数',
                items: [
                    { source: '被験者番号', target: 'SUBJID' },
                    { source: '性別', target: 'SEX' },
                    { source: '生年月日', target: 'BRTHDTC' },
                    { source: '人種', target: 'RACE' },
                    { source: '同意取得日', target: 'RFICDTC' },
                    { source: '投与群', target: 'ARM' }
                ]
            });
        }

        // Module 202 - AE mapping exercise
        if (moduleId === 202 && document.getElementById('exercise-ae-mapping')) {
            Exercises.createMappingExercise('exercise-ae-mapping', {
                title: 'AE変数マッピング演習',
                sourceLabel: 'CRFフィールド',
                targetLabel: 'SDTM変数',
                items: [
                    { source: '有害事象名', target: 'AETERM' },
                    { source: '発現日', target: 'AESTDTC' },
                    { source: '転帰日', target: 'AEENDTC' },
                    { source: '重症度', target: 'AESEV' },
                    { source: '重篤性', target: 'AESER' },
                    { source: '因果関係', target: 'AEREL' },
                    { source: '処置', target: 'AEACN' }
                ]
            });
        }

        // Module 205 - VS mapping exercise
        if (moduleId === 205 && document.getElementById('exercise-vs-mapping')) {
            Exercises.createMappingExercise('exercise-vs-mapping', {
                title: 'VS変数マッピング演習',
                sourceLabel: 'CRFフィールド',
                targetLabel: 'SDTM変数',
                items: [
                    { source: '検査項目コード', target: 'VSTESTCD' },
                    { source: '測定値', target: 'VSORRES' },
                    { source: '測定単位', target: 'VSORRESU' },
                    { source: '測定日', target: 'VSDTC' },
                    { source: '測定部位', target: 'VSLOC' },
                    { source: '体位', target: 'VSPOS' }
                ]
            });
        }

        // Module 301 - SAS code exercise
        if (moduleId === 301 && document.getElementById('exercise-sas-code')) {
            Exercises.createCodeFillExercise('exercise-sas-code', {
                title: 'SAS SDTM プログラミング演習',
                language: 'SAS',
                codeTemplate: `data sdtm.dm;
  set raw.demog;

  STUDYID = "ABC-001";
  __b1__ = "DM";
  USUBJID = catx("-", STUDYID, SITEID, __b2__);

  /* 年齢計算 */
  AGE = __b3__(RFSTDTC, BRTHDTC, 'year');
  AGEU = "YEARS";

  keep STUDYID DOMAIN USUBJID SUBJID
       AGE AGEU SEX RACE ARM ARMCD;
run;`,
                blanks: [
                    { id: 'b1', answer: 'DOMAIN', hint: 'ドメイン変数' },
                    { id: 'b2', answer: 'SUBJID', hint: '被験者ID' },
                    { id: 'b3', answer: 'YRDIF', hint: '年差関数' }
                ]
            });
        }
    },

    /**
     * Start quiz for a module
     */
    startQuiz(moduleId) {
        const mod = this.allModules.find(m => m.id === moduleId);
        if (!mod || !mod.quiz) return;

        this.showView('quizView');
        Quiz.start(moduleId, mod.quiz);
    },

    /**
     * Navigate to the next module
     */
    goToNextModule(currentModuleId) {
        const idx = this.allModules.findIndex(m => m.id === currentModuleId);
        if (idx < this.allModules.length - 1) {
            this.showModule(this.allModules[idx + 1].id);
        } else {
            // All modules complete!
            this.showDashboard();
            this.showCompletionMessage();
        }
    },

    /**
     * Show completion celebration
     */
    showCompletionMessage() {
        const modal = document.getElementById('modalContent');
        const overlay = document.getElementById('modalOverlay');
        modal.innerHTML = `
            <h2>🎓 おめでとうございます！</h2>
            <div class="score-circle pass" style="font-size:2.5rem;">🏆</div>
            <p>
                全モジュールを完了しました！<br>
                あなたはSDTMの基礎から実践まで一通り学びました。<br>
                実際のプロジェクトで経験を積んで、SDTMのプロを目指しましょう！
            </p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="App.closeModal()">ダッシュボードへ</button>
            </div>
        `;
        overlay.style.display = 'flex';
    },

    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    },

    /**
     * Show/hide views
     */
    showView(viewId) {
        ['dashboardView', 'moduleView', 'quizView', 'referenceView'].forEach(id => {
            document.getElementById(id).style.display = id === viewId ? 'block' : 'none';
        });
    },

    /**
     * Switch code tabs (SAS/R)
     */
    switchCodeTab(button, lang) {
        const tabContainer = button.closest('.code-tabs');
        tabContainer.querySelectorAll('.code-tab-btn').forEach(btn => btn.classList.remove('active'));
        tabContainer.querySelectorAll('.code-tab-content').forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        tabContainer.querySelector(`.code-tab-content[data-lang="${lang}"]`).classList.add('active');

        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    },

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('sdtm-darkmode', 'false');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('sdtm-darkmode', 'true');
        }
    },

    /**
     * Reset all progress
     */
    resetProgress() {
        if (confirm('全ての学習進捗をリセットしますか？この操作は元に戻せません。')) {
            this.progress = {};
            this.quizResults = {};
            localStorage.removeItem('sdtm-progress');
            localStorage.removeItem('sdtm-quiz-results');
            this.buildSidebar();
            this.updateGlobalProgress();
            this.showDashboard();
        }
    },

    /**
     * Show SDTM variable reference
     */
    showReference() {
        this.showView('referenceView');
        this.buildSidebar();

        const container = document.getElementById('referenceView');

        // Build reference data from all domain modules
        const domains = [
            { code: 'DM', name: 'Demographics', vars: [
                { name: 'STUDYID', label: 'Study Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'DOMAIN', label: 'Domain Abbreviation', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'USUBJID', label: 'Unique Subject Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'SUBJID', label: 'Subject Identifier for the Study', type: 'Char', role: 'Topic', core: 'Req' },
                { name: 'RFSTDTC', label: 'Subject Reference Start Date/Time', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'RFENDTC', label: 'Subject Reference End Date/Time', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'RFXSTDTC', label: 'Date/Time of First Study Treatment', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'RFXENDTC', label: 'Date/Time of Last Study Treatment', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'RFICDTC', label: 'Date/Time of Informed Consent', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'DTHDTC', label: 'Date/Time of Death', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'DTHFL', label: 'Subject Death Flag', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'SITEID', label: 'Study Site Identifier', type: 'Char', role: 'Qualifier', core: 'Req' },
                { name: 'AGE', label: 'Age', type: 'Num', role: 'Qualifier', core: 'Exp' },
                { name: 'AGEU', label: 'Age Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'SEX', label: 'Sex', type: 'Char', role: 'Qualifier', core: 'Req' },
                { name: 'RACE', label: 'Race', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'ETHNIC', label: 'Ethnicity', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'ARMCD', label: 'Planned Arm Code', type: 'Char', role: 'Qualifier', core: 'Req' },
                { name: 'ARM', label: 'Description of Planned Arm', type: 'Char', role: 'Qualifier', core: 'Req' },
                { name: 'COUNTRY', label: 'Country', type: 'Char', role: 'Qualifier', core: 'Req' }
            ]},
            { code: 'AE', name: 'Adverse Events', vars: [
                { name: 'STUDYID', label: 'Study Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'DOMAIN', label: 'Domain Abbreviation', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'USUBJID', label: 'Unique Subject Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'AESEQ', label: 'Sequence Number', type: 'Num', role: 'Identifier', core: 'Req' },
                { name: 'AETERM', label: 'Reported Term for the Adverse Event', type: 'Char', role: 'Topic', core: 'Req' },
                { name: 'AEDECOD', label: 'Dictionary-Derived Term', type: 'Char', role: 'Synonym', core: 'Req' },
                { name: 'AEBODSYS', label: 'Body System or Organ Class', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'AESEV', label: 'Severity/Intensity', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'AESER', label: 'Serious Event', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'AEREL', label: 'Causality', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'AEACN', label: 'Action Taken with Study Treatment', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'AEOUT', label: 'Outcome of Adverse Event', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'AESTDTC', label: 'Start Date/Time of Adverse Event', type: 'Char', role: 'Timing', core: 'Exp' },
                { name: 'AEENDTC', label: 'End Date/Time of Adverse Event', type: 'Char', role: 'Timing', core: 'Exp' }
            ]},
            { code: 'VS', name: 'Vital Signs', vars: [
                { name: 'STUDYID', label: 'Study Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'DOMAIN', label: 'Domain Abbreviation', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'USUBJID', label: 'Unique Subject Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'VSSEQ', label: 'Sequence Number', type: 'Num', role: 'Identifier', core: 'Req' },
                { name: 'VSTESTCD', label: 'Vital Signs Test Short Name', type: 'Char', role: 'Topic', core: 'Req' },
                { name: 'VSTEST', label: 'Vital Signs Test Name', type: 'Char', role: 'Synonym', core: 'Req' },
                { name: 'VSORRES', label: 'Result or Finding in Original Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'VSORRESU', label: 'Original Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'VSSTRESC', label: 'Character Result/Finding in Std Format', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'VSSTRESN', label: 'Numeric Result/Finding in Std Units', type: 'Num', role: 'Qualifier', core: 'Exp' },
                { name: 'VSSTRESU', label: 'Standard Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'VSDTC', label: 'Date/Time of Measurements', type: 'Char', role: 'Timing', core: 'Exp' }
            ]},
            { code: 'LB', name: 'Laboratory Test Results', vars: [
                { name: 'STUDYID', label: 'Study Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'DOMAIN', label: 'Domain Abbreviation', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'USUBJID', label: 'Unique Subject Identifier', type: 'Char', role: 'Identifier', core: 'Req' },
                { name: 'LBSEQ', label: 'Sequence Number', type: 'Num', role: 'Identifier', core: 'Req' },
                { name: 'LBTESTCD', label: 'Lab Test Short Name', type: 'Char', role: 'Topic', core: 'Req' },
                { name: 'LBTEST', label: 'Lab Test Name', type: 'Char', role: 'Synonym', core: 'Req' },
                { name: 'LBORRES', label: 'Result or Finding in Original Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'LBORRESU', label: 'Original Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'LBSTRESC', label: 'Character Result/Finding in Std Format', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'LBSTRESN', label: 'Numeric Result/Finding in Std Units', type: 'Num', role: 'Qualifier', core: 'Exp' },
                { name: 'LBSTRESU', label: 'Standard Units', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'LBSTNRLO', label: 'Reference Range Lower Limit-Std Units', type: 'Num', role: 'Qualifier', core: 'Exp' },
                { name: 'LBSTNRHI', label: 'Reference Range Upper Limit-Std Units', type: 'Num', role: 'Qualifier', core: 'Exp' },
                { name: 'LBNRIND', label: 'Reference Range Indicator', type: 'Char', role: 'Qualifier', core: 'Exp' },
                { name: 'LBDTC', label: 'Date/Time of Specimen Collection', type: 'Char', role: 'Timing', core: 'Exp' }
            ]}
        ];

        let html = `
            <div class="fade-in">
                <h1 style="font-size:1.6rem;margin-bottom:8px;">SDTM変数リファレンス</h1>
                <p style="color:var(--text-secondary);margin-bottom:24px;">主要ドメインの変数一覧。検索・フィルター機能付き。</p>

                <div class="reference-search">
                    <input type="text" id="refSearchInput" placeholder="変数名またはラベルで検索..."
                           oninput="App.filterReference()">
                </div>

                <div class="reference-domain-filter" id="refDomainFilter">
                    <button class="ref-filter-btn active" onclick="App.filterRefDomain(this, 'ALL')">全て</button>
                    ${domains.map(d => `
                        <button class="ref-filter-btn" onclick="App.filterRefDomain(this, '${d.code}')">${d.code}</button>
                    `).join('')}
                </div>

                <div id="refTable">
        `;

        domains.forEach(domain => {
            html += `
                <div class="ref-domain-section" data-domain="${domain.code}">
                    <h2 style="font-size:1.2rem;margin:24px 0 12px;">${domain.code} - ${domain.name}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>変数名</th>
                                <th>ラベル</th>
                                <th>型</th>
                                <th>ロール</th>
                                <th>Core</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${domain.vars.map(v => `
                                <tr class="ref-var-row" data-var="${v.name.toLowerCase()}" data-label="${v.label.toLowerCase()}">
                                    <td><code>${v.name}</code></td>
                                    <td>${v.label}</td>
                                    <td>${v.type}</td>
                                    <td>${v.role}</td>
                                    <td>${v.core}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
    },

    /**
     * Filter reference table by search
     */
    filterReference() {
        const query = document.getElementById('refSearchInput').value.toLowerCase().trim();
        document.querySelectorAll('.ref-var-row').forEach(row => {
            const varName = row.getAttribute('data-var');
            const label = row.getAttribute('data-label');
            const match = !query || varName.includes(query) || label.includes(query);
            row.style.display = match ? '' : 'none';
        });
    },

    /**
     * Filter reference by domain
     */
    filterRefDomain(button, domain) {
        document.querySelectorAll('.ref-filter-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        document.querySelectorAll('.ref-domain-section').forEach(section => {
            if (domain === 'ALL' || section.getAttribute('data-domain') === domain) {
                section.style.display = '';
            } else {
                section.style.display = 'none';
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
