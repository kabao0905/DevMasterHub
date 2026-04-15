// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Application Logic v3 (Auth + Career Advisor)
// ═══════════════════════════════════════════════════════════════

const App = (() => {
  // ─── State ───
  let currentView = 'auth';
  let currentTech = null;
  let currentLevel = null;
  let currentLesson = null;
  let progress = {};
  let searchQuery = '';
  let activeTab = 'theory';
  let aiEnabled = false;
  let isAuthenticated = false;
  let currentUserProfile = null;

  // Quiz/Exercise caches per lesson
  const quizCache = {};    // key: "techId.levelId.lessonId" -> { questions, answers, submitted }
  const exerciseCache = {}; // key: same -> { aiExercises, userAnswer, feedback }
  const lessonChatCache = {}; // key: "techId.levelId.lessonId" -> { messages: [{role, content}], sending: false }

  // ─── Project Lab State ───
  let projectSelectedLevel = null;
  let projectIdea = null;
  let projectChatHistory = [];  // [{role, content}]
  let projectChatSending = false;
  let projectFiles = [{ name: 'main.js', lang: 'javascript', code: '' }];
  let projectActiveFileIdx = 0;
  let projectReview = null;
  let projectTopic = '';
  let projectTopicLevel = null;  // null = auto (AI decides based on topic)
  let savedIdeas = [];  // [{id, idea, savedAt, source, topic, level}]

  // ─── Career Advisor State ───
  let careerChatHistory = [];
  let careerChatSending = false;
  let careerJobResults = [];
  let careerLastSearchKeyword = '';

  // ─── My Projects State ───
  let myProjectsList = [];
  let selectedProjectView = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ─── Initialization ───
  function init() {
    bindEvents();
    setupMobileSidebar();

    // Check AI availability
    if (typeof AIService !== 'undefined') {
      AIService.checkHealth().then(h => {
        aiEnabled = h.aiEnabled;
      }).catch(() => {});
    }

    // ─── Auth Check ───
    if (typeof AuthService !== 'undefined' && AuthService.init()) {
      AuthService.onAuthChange(async (event, user) => {
        if (user) {
          isAuthenticated = true;
          currentUserProfile = await AuthService.getProfile();
          // Load data from Supabase
          progress = await AuthService.loadProgress();
          const ideas = await AuthService.loadSavedIdeas();
          if (ideas.length > 0) savedIdeas = ideas;
          renderSidebar();
          if (currentView === 'auth') navigateTo('dashboard');
          updateStats();
        } else {
          isAuthenticated = false;
          currentUserProfile = null;
          progress = {};
          savedIdeas = [];
          navigateTo('auth');
        }
      });
      // Check existing session
      AuthService.getSession().then(session => {
        if (!session) {
          navigateTo('auth');
          renderAuthScreen($('#main-content'));
        }
      });
    } else {
      // Auth not available — show auth screen anyway
      navigateTo('auth');
      renderAuthScreen($('#main-content'));
    }

    window.addEventListener('popstate', (e) => {
      if (e.state) restoreState(e.state);
    });
  }

  function setupMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuBtn || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
      menuBtn.textContent = '✕';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      menuBtn.textContent = '☰';
    }

    menuBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking a nav item on mobile
    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-item') && window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  }

  // ─── Progress (Supabase) ───
  function loadProgress() {
    // Progress loaded via AuthService in init
  }

  function saveProgress() {
    if (isAuthenticated && AuthService.isConfigured()) {
      AuthService.saveProgress(progress).catch(e => console.warn('[Progress] Save error:', e));
    }
  }

  // ─── Saved Ideas (Supabase) ───
  function loadSavedIdeas() {
    // Loaded via AuthService in init
  }

  function persistSavedIdeas() {
    // Saved per-idea via Supabase
  }

  function saveCurrentIdea() {
    if (!projectIdea) return;
    // Check duplicate
    const exists = savedIdeas.some(s => s.idea.name === projectIdea.name && s.idea.description === projectIdea.description);
    if (exists) {
      alert('💡 Idea này đã được lưu trước đó rồi!');
      return;
    }
    const saved = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      idea: { ...projectIdea },
      savedAt: new Date().toISOString(),
      source: currentView === 'project-topic' ? 'topic' : 'level',
      topic: projectTopic || null,
      level: projectSelectedLevel || projectTopicLevel || null
    };
    savedIdeas.unshift(saved);
    if (isAuthenticated) AuthService.saveIdea(saved).catch(e => console.warn('[Ideas] Save error:', e));
    // Visual feedback
    const btn = document.querySelector('.btn-save-idea');
    if (btn) {
      btn.innerHTML = '<span class="btn-ai-icon">✅</span> Đã lưu!';
      btn.classList.add('saved');
      setTimeout(() => {
        btn.innerHTML = '<span class="btn-ai-icon">💾</span> Lưu Idea';
        btn.classList.remove('saved');
      }, 2000);
    }
  }

  function deleteSavedIdea(id) {
    savedIdeas = savedIdeas.filter(s => s.id !== id);
    if (isAuthenticated) AuthService.deleteIdea(id).catch(e => console.warn('[Ideas] Delete error:', e));
    render();
  }

  function loadSavedIdeaToWork(id) {
    const saved = savedIdeas.find(s => s.id === id);
    if (!saved) return;
    resetProjectState();
    projectIdea = { ...saved.idea };
    if (saved.source === 'topic') {
      projectTopic = saved.topic || '';
      projectTopicLevel = saved.level || null;
      navigateTo('project-topic');
    } else {
      projectSelectedLevel = saved.level || saved.idea.difficulty || 'mid';
      navigateTo('project-level');
    }
  }

  function toggleLessonComplete(techId, levelId, lessonId) {
    const key = `${techId}.${levelId}.${lessonId}`;
    progress[key] = !progress[key];
    saveProgress();
    if (isAuthenticated) {
      AuthService.markLessonComplete(techId, levelId, lessonId, progress[key]).catch(e => console.warn('[Progress] Mark error:', e));
    }
    updateStats();
    return progress[key];
  }

  function isLessonComplete(techId, levelId, lessonId) {
    return !!progress[`${techId}.${levelId}.${lessonId}`];
  }

  function getTechProgress(techId) {
    const tech = CURRICULUM[techId];
    if (!tech || !Array.isArray(tech.levels)) return { completed: 0, total: 0, percent: 0 };
    let completed = 0, total = 0;
    tech.levels.forEach(level => {
      if (!level.lessons) return;
      level.lessons.forEach(lesson => {
        total++;
        if (isLessonComplete(techId, level.id, lesson.id)) completed++;
      });
    });
    return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
  }

  function getLevelProgress(techId, levelId) {
    const tech = CURRICULUM[techId];
    if (!tech || !Array.isArray(tech.levels)) return { completed: 0, total: 0, percent: 0 };
    const level = tech.levels.find(l => l.id === levelId);
    if (!level) return { completed: 0, total: 0, percent: 0 };
    let completed = 0;
    level.lessons.forEach(lesson => {
      if (isLessonComplete(techId, level.id, lesson.id)) completed++;
    });
    return { completed, total: level.lessons.length, percent: level.lessons.length ? Math.round((completed / level.lessons.length) * 100) : 0 };
  }

  function getOverallProgress() {
    let completed = 0, total = 0;
    Object.keys(CURRICULUM).forEach(techId => {
      const p = getTechProgress(techId);
      completed += p.completed;
      total += p.total;
    });
    return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
  }

  // ─── Navigation ───
  function navigateTo(view, data = {}) {
    currentView = view;
    if (data.tech !== undefined) currentTech = data.tech;
    if (data.level !== undefined) currentLevel = data.level;
    if (data.lesson !== undefined) currentLesson = data.lesson;
    if (view === 'lesson') activeTab = 'theory';

    const hash = `#${view}${data.tech ? '/' + data.tech : ''}${data.level ? '/' + data.level : ''}${data.lesson ? '/' + data.lesson : ''}`;
    history.pushState({ view, ...data }, '', hash);
    render();
    updateSidebarActive();

    // Auto-close mobile sidebar AFTER render completes
    requestAnimationFrame(() => closeMobileSidebar());
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuBtn = document.getElementById('mobile-menu-toggle');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    if (menuBtn) menuBtn.textContent = '☰';
  }

  function restoreState(state) {
    currentView = state.view || 'dashboard';
    currentTech = state.tech || null;
    currentLevel = state.level || null;
    currentLesson = state.lesson || null;
    render();
    updateSidebarActive();
  }

  // ─── Render Router ───
  function render() {
    const main = $('#main-content');
    if (!main) return;

    main.style.opacity = '0';
    main.style.transform = 'translateY(8px)';
    const renderId = Date.now();
    window._lastRenderId = renderId;

    setTimeout(() => {
      if (window._lastRenderId !== renderId) return;
      switch (currentView) {
        case 'auth': renderAuthScreen(main); break;
        case 'dashboard': renderDashboard(main); break;
        case 'roadmap': renderRoadmap(main); break;
        case 'lesson': renderLesson(main); break;
        case 'project': renderProjectHub(main); break;
        case 'project-level': renderProjectByLevel(main); break;
        case 'project-topic': renderProjectByTopic(main); break;
        case 'saved-ideas': renderSavedIdeas(main); break;
        case 'career': renderCareerAdvisor(main); break;
        case 'my-projects': renderMyProjects(main); break;
        default: if (isAuthenticated) renderDashboard(main); else renderAuthScreen(main);
      }
      requestAnimationFrame(() => {
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
      });
      if (typeof Prism !== 'undefined') Prism.highlightAll();
    }, 120);
  }

  // ═══════════════════════════════════════
  // DASHBOARD VIEW
  // ═══════════════════════════════════════
  function renderDashboard(container) {

    const overall = getOverallProgress();
    const categories = { language: [], frontend: [], backend: [], tool: [] };
    const catNames = { language: '💻 Ngôn ngữ lập trình', frontend: '🎨 Frontend', backend: '⚙️ Backend', tool: '🔧 Tools & DevOps' };

    Object.values(CURRICULUM).forEach(tech => {
      const cat = tech.category || 'tool';
      if (categories[cat]) categories[cat].push(tech);
    });



    let html = `
      <div class="dashboard-header">
        <div>
          <h1 class="view-title">🚀 Dashboard</h1>
          <p class="view-subtitle">Lộ trình học lập trình từ Newbie đến Master</p>
        </div>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" placeholder="Tìm kiếm bài học..." value="${searchQuery}" autocomplete="off" />
          ${searchQuery ? '<button class="search-clear" id="search-clear">✕</button>' : ''}
        </div>
      </div>

      <div class="overall-stats">
        <div class="stat-card glass-card"><div class="stat-icon">📚</div><div class="stat-info"><div class="stat-number">${Object.keys(CURRICULUM).length}</div><div class="stat-label">Công nghệ</div></div></div>
        <div class="stat-card glass-card"><div class="stat-icon">📝</div><div class="stat-info"><div class="stat-number">${overall.total}</div><div class="stat-label">Bài học</div></div></div>
        <div class="stat-card glass-card"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-number">${overall.completed}</div><div class="stat-label">Hoàn thành</div></div></div>
        <div class="stat-card glass-card"><div class="stat-icon">📊</div><div class="stat-info"><div class="stat-number">${overall.percent}%</div><div class="stat-label">Tiến độ</div></div></div>
      </div>

      <div class="progress-bar-overall">
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${overall.percent}%"></div></div>
        <span class="progress-text">${overall.completed}/${overall.total} bài học</span>
      </div>
    `;

    if (searchQuery.trim()) {
      html += renderSearchResults(searchQuery);
    } else {
      Object.entries(categories).forEach(([catKey, techs]) => {
        if (!techs.length) return;
        html += `<div class="category-section"><h2 class="category-title">${catNames[catKey]}</h2><div class="tech-grid">${techs.map(renderTechCard).join('')}</div></div>`;
      });
    }

    container.innerHTML = html;
    bindDashboardEvents();
  }

  function renderTechCard(tech) {
    try {
      const p = getTechProgress(tech.id);
      const levelsCount = Array.isArray(tech.levels) ? tech.levels.length : 0;
      return `
        <div class="tech-card glass-card" onclick="App.openRoadmap('${tech.id}')">
          <div class="tech-card-header" style="background:${tech.gradient || 'linear-gradient(135deg,#667,#445)'}">
            <span class="tech-icon">${tech.icon || '📦'}</span>
            <span class="tech-badge">${levelsCount} cấp độ</span>
          </div>
          <div class="tech-card-body">
            <h3 class="tech-name">${tech.name}</h3>
            <p class="tech-desc">${tech.description || ''}</p>
            <div class="tech-progress">
              <div class="progress-bar-track small"><div class="progress-bar-fill" style="width:${p.percent}%;background:${tech.gradient || ''}"></div></div>
              <span class="progress-label">${p.percent}% · ${p.completed}/${p.total}</span>
            </div>
          </div>
        </div>`;
    } catch(e) {
      console.warn('[TechCard] render error:', tech?.id);
      return '';
    }
  }

  function renderSearchResults(query) {
    const q = query.toLowerCase().trim();
    const results = [];
    Object.values(CURRICULUM).forEach(tech => {
      if (!Array.isArray(tech.levels)) return;
      tech.levels.forEach(level => {
        if (!level.lessons) return;
        level.lessons.forEach(lesson => {
          if (lesson.title.toLowerCase().includes(q) || (lesson.theory && lesson.theory.toLowerCase().includes(q))) {
            results.push({ tech, level, lesson });
          }
        });
      });
    });

    if (!results.length) {
      return `<div class="search-empty"><span class="empty-icon">🔍</span><p>Không tìm thấy kết quả cho "<strong>${query}</strong>"</p></div>`;
    }

    return `
      <div class="search-results">
        <p class="search-count">Tìm thấy <strong>${results.length}</strong> kết quả</p>
        <div class="search-list">
          ${results.map(r => `
            <div class="search-item glass-card" onclick="App.openLesson('${r.tech.id}','${r.level.id}','${r.lesson.id}')">
              <span class="search-item-icon" style="background:${r.tech.gradient}">${r.tech.icon}</span>
              <div class="search-item-info"><h4>${r.lesson.title}</h4><span class="search-item-path">${r.tech.name} → ${r.level.name}</span></div>
              <span class="badge badge-${r.level.id}">${r.level.name}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ═══════════════════════════════════════
  // ROADMAP VIEW
  // ═══════════════════════════════════════
  function renderRoadmap(container) {
    const tech = CURRICULUM[currentTech];
    if (!tech) { navigateTo('dashboard'); return; }
    const p = getTechProgress(tech.id);

    let html = `
      <div class="roadmap-header">
        <button class="btn-back" onclick="App.goBack()">← Quay lại</button>
        <div class="roadmap-title-row">
          <span class="roadmap-icon" style="background:${tech.gradient}">${tech.icon}</span>
          <div><h1 class="view-title">${tech.name}</h1><p class="view-subtitle">${tech.description}</p></div>
        </div>
        <div class="tech-progress-bar">
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${p.percent}%;background:${tech.gradient}"></div></div>
          <span class="progress-text">${p.completed}/${p.total} bài học · ${p.percent}%</span>
        </div>
      </div>
      <div class="roadmap-timeline">`;

    tech.levels.forEach((level, idx) => {
      const lp = getLevelProgress(tech.id, level.id);
      const isComplete = lp.percent === 100;
      const isActive = lp.percent > 0 && lp.percent < 100;

      html += `
        <div class="timeline-node ${isComplete ? 'completed' : isActive ? 'active' : ''}">
          <div class="timeline-connector">
            <div class="timeline-dot" style="${isComplete || isActive ? 'background:' + tech.gradient : ''}">${isComplete ? '✓' : idx + 1}</div>
            ${idx < tech.levels.length - 1 ? '<div class="timeline-line"></div>' : ''}
          </div>
          <div class="timeline-content glass-card">
            <div class="timeline-header">
              <div><span class="badge badge-${level.badge || level.id}">${level.name}</span><h3 class="timeline-title">${level.desc || level.name}</h3></div>
              <span class="timeline-progress">${lp.completed}/${lp.total}</span>
            </div>
            <div class="lesson-list">
              ${level.lessons.map(lesson => {
                const done = isLessonComplete(tech.id, level.id, lesson.id);
                return `<div class="lesson-item ${done ? 'done' : ''}" onclick="App.openLesson('${tech.id}','${level.id}','${lesson.id}')">
                  <span class="lesson-check">${done ? '✅' : '⬜'}</span>
                  <span class="lesson-title">${lesson.title}</span>
                  <span class="lesson-arrow">→</span>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>`;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ═══════════════════════════════════════
  // LESSON VIEW (4 TABS)
  // ═══════════════════════════════════════
  function renderLesson(container) {
    const tech = CURRICULUM[currentTech];
    if (!tech) { navigateTo('dashboard'); return; }
    const level = tech.levels.find(l => l.id === currentLevel);
    if (!level) { navigateTo('roadmap', { tech: currentTech }); return; }
    const lesson = level.lessons.find(ls => ls.id === currentLesson);
    if (!lesson) { navigateTo('roadmap', { tech: currentTech }); return; }

    const done = isLessonComplete(tech.id, level.id, lesson.id);
    const lessonKey = `${tech.id}.${level.id}.${lesson.id}`;

    // Find prev/next
    const allLessons = [];
    tech.levels.forEach(lv => lv.lessons.forEach(ls => allLessons.push({ level: lv, lesson: ls })));
    const idx = allLessons.findIndex(x => x.level.id === level.id && x.lesson.id === lesson.id);
    const prev = idx > 0 ? allLessons[idx - 1] : null;
    const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

    const tabs = [
      { id: 'theory', icon: '📖', label: 'Lý thuyết' },
      { id: 'code', icon: '💻', label: 'Code' },
      { id: 'quiz', icon: '🎯', label: 'Quiz' },
      { id: 'exercise', icon: '🏋️', label: 'Bài tập' }
    ];

    let html = `
      <div class="lesson-view">
        <div class="breadcrumb">
          <span class="crumb" onclick="App.goToDashboard()">Dashboard</span>
          <span class="crumb-sep">›</span>
          <span class="crumb" onclick="App.openRoadmap('${tech.id}')">${tech.icon} ${tech.name}</span>
          <span class="crumb-sep">›</span>
          <span class="crumb active">${level.name}</span>
        </div>

        <div class="lesson-header" style="border-left:4px solid ${tech.color}">
          <div class="lesson-header-top">
            <span class="badge badge-${level.badge || level.id}">${level.name}</span>
            <button class="btn-complete ${done ? 'completed' : ''}" onclick="App.markComplete('${tech.id}','${level.id}','${lesson.id}')" id="btn-complete">
              ${done ? '✅ Hoàn thành' : '⬜ Đánh dấu hoàn thành'}
            </button>
          </div>
          <h1 class="lesson-main-title">${lesson.title}</h1>
        </div>

        <!-- TAB BAR -->
        <div class="lesson-tabs" id="lesson-tabs">
          ${tabs.map(t => `<button class="tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}" onclick="App.switchTab('${t.id}')">${t.icon} ${t.label}</button>`).join('')}
        </div>

        <!-- TAB CONTENT -->
        <div class="tab-panels">
          <!-- THEORY TAB -->
          <div class="tab-panel ${activeTab === 'theory' ? 'active' : ''}" id="panel-theory">
            <div class="lesson-section glass-card">
              <h2 class="section-title">📖 Lý thuyết</h2>
              <div class="theory-content">${lesson.theory || '<em>Chưa có nội dung</em>'}</div>
            </div>
            ${lesson.keyPoints && lesson.keyPoints.length ? `
              <div class="lesson-section glass-card">
                <h2 class="section-title">🔑 Điểm chính</h2>
                <ul class="key-points">${lesson.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
              </div>` : ''}
            ${renderLessonChatBox(lessonKey, 'theory')}
          </div>

          <!-- CODE TAB -->
          <div class="tab-panel ${activeTab === 'code' ? 'active' : ''}" id="panel-code">
            ${lesson.code ? `
              <div class="lesson-section glass-card">
                <div class="section-header">
                  <h2 class="section-title">💻 Code Example</h2>
                  <button class="btn-copy" onclick="App.copyCode(this)" data-code="${encodeURIComponent(lesson.code)}">📋 Copy</button>
                </div>
                <pre class="code-block"><code class="language-${lesson.lang || 'javascript'}">${escapeHtml(lesson.code)}</code></pre>
              </div>` : '<div class="lesson-section glass-card"><p class="empty-hint">Chưa có code example cho bài này.</p></div>'}
            ${renderLessonChatBox(lessonKey, 'code')}
          </div>

          <!-- QUIZ TAB -->
          <div class="tab-panel ${activeTab === 'quiz' ? 'active' : ''}" id="panel-quiz">
            <div id="quiz-container" data-key="${lessonKey}">
              ${renderQuizContent(lessonKey, tech, level, lesson)}
            </div>
            ${renderLessonChatBox(lessonKey, 'quiz')}
          </div>

          <!-- EXERCISE TAB -->
          <div class="tab-panel ${activeTab === 'exercise' ? 'active' : ''}" id="panel-exercise">
            <div id="exercise-container" data-key="${lessonKey}">
              ${renderExerciseContent(lessonKey, tech, level, lesson)}
            </div>
            ${renderLessonChatBox(lessonKey, 'exercise')}
          </div>
        </div>

        <!-- LESSON NAV -->
        <div class="lesson-nav">
          ${prev ? `<button class="btn-nav btn-prev" onclick="App.openLesson('${tech.id}','${prev.level.id}','${prev.lesson.id}')">← ${prev.lesson.title}</button>` : '<div></div>'}
          ${next ? `<button class="btn-nav btn-next" onclick="App.openLesson('${tech.id}','${next.level.id}','${next.lesson.id}')">${next.lesson.title} →</button>` : '<div></div>'}
        </div>
      </div>`;

    container.innerHTML = html;

    // Attach code editor enhancement to exercise textarea
    if (activeTab === 'exercise') {
      setTimeout(attachEditorToCurrentTextarea, 50);
    }
  }

  // ═══════════════════════════════════════
  // QUIZ SECTION
  // ═══════════════════════════════════════
  function renderQuizContent(lessonKey, tech, level, lesson) {
    const cache = quizCache[lessonKey];

    // No quiz generated yet
    if (!cache || !cache.questions || !cache.questions.length) {
      return `
        <div class="lesson-section glass-card quiz-intro">
          <div class="quiz-intro-content">
            <span class="quiz-intro-icon">🎯</span>
            <h3>Quiz — Kiểm tra kiến thức</h3>
            <p>AI sẽ tạo câu hỏi trắc nghiệm random dựa trên nội dung bài học "${lesson.title}"</p>
            ${aiEnabled ? `
              <button class="btn-ai btn-generate-quiz" onclick="App.generateQuiz('${lessonKey}')">
                <span class="btn-ai-icon">🤖</span> Tạo Quiz với AI
              </button>` : `
              <div class="ai-disabled-notice">
                <p>⚠️ AI chưa được kích hoạt. Thêm <code>CLAUDE_API_KEY</code> vào file <code>.env</code> và restart server.</p>
              </div>`}
          </div>
        </div>`;
    }

    // Quiz generated - render questions
    const { questions, answers, submitted, score } = cache;
    let html = '';

    // Score banner (if submitted)
    if (submitted) {
      const pct = Math.round((score / questions.length) * 100);
      const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
      html += `
        <div class="quiz-score glass-card ${pct >= 80 ? 'score-high' : pct >= 50 ? 'score-mid' : 'score-low'}">
          <span class="score-emoji">${emoji}</span>
          <div class="score-info">
            <div class="score-number">${score}/${questions.length}</div>
            <div class="score-label">${pct}% — ${pct >= 80 ? 'Xuất sắc!' : pct >= 50 ? 'Khá tốt!' : 'Cần ôn lại!'}</div>
          </div>
          <button class="btn-ai btn-retry" onclick="App.generateQuiz('${lessonKey}')">
            <span class="btn-ai-icon">🔄</span> Quiz mới
          </button>
        </div>`;
    }

    // Questions
    questions.forEach((q, qi) => {
      const userAnswer = answers[qi];
      const isAnswered = userAnswer !== undefined;
      const isCorrect = isAnswered && userAnswer === q.correct;

      // Process question text: extract inline code blocks (```...```) if present
      let questionHtml = escapeHtml(q.question);
      // Replace ```lang\n...\n``` or ```...``` patterns with styled code blocks
      questionHtml = questionHtml.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="q-code-block"><code>${code.trim()}</code></pre>`;
      });
      // Replace inline `code` with styled span
      questionHtml = questionHtml.replace(/`([^`]+)`/g, '<code class="q-inline-code">$1</code>');

      // Process options: handle code in options too
      const renderOption = (opt) => {
        let optHtml = escapeHtml(opt);
        optHtml = optHtml.replace(/`([^`]+)`/g, '<code class="q-inline-code">$1</code>');
        return optHtml;
      };

      html += `
        <div class="quiz-question glass-card ${submitted ? (isCorrect ? 'q-correct' : 'q-wrong') : ''}">
          <div class="q-header">
            <span class="q-number">Câu ${qi + 1}</span>
            ${submitted ? `<span class="q-result ${isCorrect ? 'correct' : 'wrong'}">${isCorrect ? '✅ Đúng' : '❌ Sai'}</span>` : ''}
          </div>
          <div class="q-text">${questionHtml}</div>
          ${q.code ? `<pre class="q-code-block"><code>${escapeHtml(q.code)}</code></pre>` : ''}
          <div class="q-options">
            ${q.options.map((opt, oi) => {
              let cls = 'q-option';
              if (submitted) {
                if (oi === q.correct) cls += ' option-correct';
                else if (oi === userAnswer && oi !== q.correct) cls += ' option-wrong';
              } else if (userAnswer === oi) {
                cls += ' option-selected';
              }
              return `<button class="${cls}" onclick="App.selectAnswer('${lessonKey}',${qi},${oi})" ${submitted ? 'disabled' : ''}>
                <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
                <span class="option-text">${renderOption(opt)}</span>
              </button>`;
            }).join('')}
          </div>
          ${submitted && q.explanation ? `<div class="q-explanation"><strong>💡 Giải thích:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
        </div>`;
    });

    // Submit / New Quiz buttons
    if (!submitted) {
      const allAnswered = questions.every((_, i) => answers[i] !== undefined);
      html += `
        <div class="quiz-actions">
          <button class="btn-ai btn-submit-quiz ${allAnswered ? '' : 'disabled'}" onclick="App.submitQuiz('${lessonKey}')" ${allAnswered ? '' : 'disabled'}>
            ✅ Nộp bài (${Object.keys(answers).length}/${questions.length})
          </button>
        </div>`;
    }

    return html;
  }

  // ═══════════════════════════════════════
  // EXERCISE SECTION
  // ═══════════════════════════════════════
  function renderExerciseContent(lessonKey, tech, level, lesson) {
    const cache = exerciseCache[lessonKey] || {};
    const userAnswer = cache.userAnswer || '';
    const feedback = cache.feedback || null;
    const aiExercises = cache.aiExercises || [];
    const activeExIdx = cache.activeExIdx || 0;
    const showHints = cache.showHints || false;
    const showSolution = cache.showSolution || false;

    // Determine which exercise to show
    let currentExercise;
    if (activeExIdx === 0) {
      // Original exercise
      currentExercise = {
        title: 'Bài tập gốc',
        description: lesson.exercise || 'Chưa có bài tập cho bài này.',
        hints: [],
        solution: null
      };
    } else {
      currentExercise = aiExercises[activeExIdx - 1] || null;
    }

    let html = '';

    // Exercise selector tabs
    if (aiExercises.length > 0) {
      html += `
        <div class="exercise-tabs">
          <button class="ex-tab ${activeExIdx === 0 ? 'active' : ''}" onclick="App.switchExercise('${lessonKey}', 0)">📝 Bài gốc</button>
          ${aiExercises.map((ex, i) => `
            <button class="ex-tab ${activeExIdx === i + 1 ? 'active' : ''}" onclick="App.switchExercise('${lessonKey}', ${i + 1})">🤖 AI #${i + 1}</button>
          `).join('')}
        </div>`;
    }

    if (!currentExercise) {
      html += '<div class="lesson-section glass-card"><p>Không có bài tập.</p></div>';
      return html;
    }

    // Exercise description
    html += `
      <div class="lesson-section glass-card exercise-section">
        <h2 class="section-title">📋 ${currentExercise.title}</h2>
        <div class="exercise-description">${currentExercise.description}</div>

        ${currentExercise.sampleInput ? `<div class="exercise-io"><strong>Input mẫu:</strong><pre>${escapeHtml(currentExercise.sampleInput)}</pre></div>` : ''}
        ${currentExercise.expectedOutput ? `<div class="exercise-io"><strong>Output mong đợi:</strong><pre>${escapeHtml(currentExercise.expectedOutput)}</pre></div>` : ''}

        ${currentExercise.hints && currentExercise.hints.length ? `
          <button class="btn-hints" onclick="App.toggleHints('${lessonKey}')">
            ${showHints ? '🙈 Ẩn gợi ý' : '💡 Xem gợi ý'} (${currentExercise.hints.length})
          </button>
          ${showHints ? `<div class="hints-list">${currentExercise.hints.map((h, i) => `<div class="hint-item">💡 ${h}</div>`).join('')}</div>` : ''}
        ` : ''}
      </div>`;

    // Answer input
    html += `
      <div class="lesson-section glass-card">
        <h2 class="section-title">✍️ Đáp án của bạn</h2>
        <textarea class="answer-editor" id="answer-editor" placeholder="Viết code hoặc đáp án ở đây..." spellcheck="false">${escapeHtml(userAnswer)}</textarea>
        <div class="answer-actions">
          ${aiEnabled ? `
            <button class="btn-ai btn-check" onclick="App.checkAnswer('${lessonKey}')" id="btn-check-answer">
              <span class="btn-ai-icon">🤖</span> AI Chấm bài
            </button>` : ''}
          <button class="btn-clear-answer" onclick="App.clearAnswer('${lessonKey}')">🗑️ Xóa</button>
        </div>
      </div>`;

    // AI Feedback
    if (feedback) {
      const statusColors = { correct: '#2ecc71', partial: '#f1c40f', incorrect: '#e74c3c' };
      html += `
        <div class="lesson-section glass-card feedback-section" style="border-left:4px solid ${statusColors[feedback.status] || '#58a6ff'}">
          <div class="feedback-header">
            <h2 class="section-title">${feedback.status === 'correct' ? '🎉' : feedback.status === 'partial' ? '👍' : '💪'} Kết quả: ${feedback.score}/100</h2>
            <div class="feedback-score-bar">
              <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${feedback.score}%;background:${statusColors[feedback.status] || '#58a6ff'}"></div></div>
            </div>
          </div>
          <div class="feedback-body">
            <p class="feedback-text">${feedback.feedback || ''}</p>
            ${feedback.errors && feedback.errors.length ? `<div class="feedback-errors"><strong>❌ Lỗi:</strong><ul>${feedback.errors.map(e => `<li>${e}</li>`).join('')}</ul></div>` : ''}
            ${feedback.suggestions && feedback.suggestions.length ? `<div class="feedback-suggestions"><strong>💡 Gợi ý:</strong><ul>${feedback.suggestions.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
            ${feedback.correctedCode ? `
              <div class="feedback-code">
                <strong>✅ Code đã sửa:</strong>
                <pre class="code-block"><code>${escapeHtml(feedback.correctedCode)}</code></pre>
              </div>` : ''}
          </div>
        </div>`;
    }

    // Solution (for AI exercises)
    if (currentExercise.solution) {
      html += `
        <div class="lesson-section glass-card">
          <button class="btn-hints" onclick="App.toggleSolution('${lessonKey}')">
            ${showSolution ? '🙈 Ẩn solution' : '👀 Xem solution mẫu'}
          </button>
          ${showSolution ? `<pre class="code-block" style="margin-top:12px"><code class="language-${currentExercise.solutionLang || 'javascript'}">${escapeHtml(currentExercise.solution)}</code></pre>` : ''}
        </div>`;
    }

    // AI Generate button
    html += `
      <div class="exercise-ai-actions">
        ${aiEnabled ? `
          <button class="btn-ai btn-generate-exercise" onclick="App.generateExercise('${lessonKey}')">
            <span class="btn-ai-icon">🤖</span> AI tạo bài tập mới
          </button>` : ''}
      </div>`;

    return html;
  }

  // ═══════════════════════════════════════
  // QUIZ ACTIONS
  // ═══════════════════════════════════════
  async function generateQuiz(lessonKey) {
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);

    // Show loading
    const container = $('#quiz-container');
    if (container) {
      container.innerHTML = `
        <div class="ai-loading glass-card">
          <div class="loading-spinner"></div>
          <p>🤖 AI đang tạo quiz...</p>
          <p class="loading-hint">Đang phân tích nội dung bài "${lesson.title}"</p>
        </div>`;
    }

    try {
      const questions = await AIService.generateQuiz(tech.name, level.name, lesson.title, lesson.theory, 4);
      quizCache[lessonKey] = { questions, answers: {}, submitted: false, score: 0 };
      if (container) container.innerHTML = renderQuizContent(lessonKey, tech, level, lesson);
    } catch (err) {
      if (container) {
        container.innerHTML = `
          <div class="ai-error glass-card">
            <span class="error-icon">⚠️</span>
            <p>Lỗi tạo quiz: ${err.message}</p>
            <button class="btn-ai" onclick="App.generateQuiz('${lessonKey}')">Thử lại</button>
          </div>`;
      }
    }
  }

  function selectAnswer(lessonKey, questionIdx, optionIdx) {
    const cache = quizCache[lessonKey];
    if (!cache || cache.submitted) return;
    cache.answers[questionIdx] = optionIdx;

    // Re-render quiz
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);
    const container = $('#quiz-container');
    if (container) container.innerHTML = renderQuizContent(lessonKey, tech, level, lesson);
  }

  function submitQuiz(lessonKey) {
    const cache = quizCache[lessonKey];
    if (!cache) return;
    cache.submitted = true;
    cache.score = cache.questions.reduce((sum, q, i) => sum + (cache.answers[i] === q.correct ? 1 : 0), 0);

    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);
    const container = $('#quiz-container');
    if (container) container.innerHTML = renderQuizContent(lessonKey, tech, level, lesson);
  }

  // ═══════════════════════════════════════
  // EXERCISE ACTIONS
  // ═══════════════════════════════════════
  async function generateExercise(lessonKey) {
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);

    if (!exerciseCache[lessonKey]) {
      exerciseCache[lessonKey] = { userAnswer: '', feedback: null, aiExercises: [], activeExIdx: 0 };
    }

    const container = $('#exercise-container');
    if (container) {
      container.innerHTML = `
        <div class="ai-loading glass-card">
          <div class="loading-spinner"></div>
          <p>🤖 AI đang tạo bài tập mới...</p>
        </div>`;
    }

    try {
      const existing = lesson.exercise || '';
      const newEx = await AIService.generateExercise(tech.name, level.name, lesson.title, lesson.theory, existing);
      // Validate AI response — ensure required fields exist
      if (!newEx || typeof newEx !== 'object') throw new Error('AI trả kết quả không hợp lệ');
      newEx.title = newEx.title || `Bài tập AI: ${lesson.title}`;
      newEx.description = newEx.description || newEx.content || newEx.task || newEx.exercise || 'Không có mô tả.';
      if (!newEx.hints) newEx.hints = [];
      exerciseCache[lessonKey].aiExercises.push(newEx);
      exerciseCache[lessonKey].activeExIdx = exerciseCache[lessonKey].aiExercises.length;
      exerciseCache[lessonKey].feedback = null;
      exerciseCache[lessonKey].userAnswer = '';
      if (container) container.innerHTML = renderExerciseContent(lessonKey, tech, level, lesson);
      if (typeof Prism !== 'undefined') Prism.highlightAll();
    } catch (err) {
      if (container) {
        container.innerHTML = `
          <div class="ai-error glass-card">
            <span class="error-icon">⚠️</span>
            <p>Lỗi tạo bài tập: ${err.message}</p>
            <button class="btn-ai" onclick="App.generateExercise('${lessonKey}')">Thử lại</button>
          </div>`;
      }
    }
  }

  async function checkAnswer(lessonKey) {
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);

    if (!exerciseCache[lessonKey]) {
      exerciseCache[lessonKey] = { userAnswer: '', feedback: null, aiExercises: [], activeExIdx: 0 };
    }

    // Save current textarea content
    const editor = $('#answer-editor');
    if (editor) exerciseCache[lessonKey].userAnswer = editor.value;

    const userCode = exerciseCache[lessonKey].userAnswer;
    if (!userCode.trim()) return;

    const btn = $('#btn-check-answer');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="loading-spinner-inline"></span> Đang chấm...';
    }

    try {
      // Get current exercise description
      const idx = exerciseCache[lessonKey].activeExIdx;
      let exDesc;
      if (idx === 0) {
        exDesc = lesson.exercise || '';
      } else {
        exDesc = exerciseCache[lessonKey].aiExercises[idx - 1]?.description || '';
      }

      const feedback = await AIService.checkAnswer(tech.name, exDesc, userCode, lesson.lang);
      exerciseCache[lessonKey].feedback = feedback;

      const container = $('#exercise-container');
      if (container) container.innerHTML = renderExerciseContent(lessonKey, tech, level, lesson);
      if (typeof Prism !== 'undefined') Prism.highlightAll();
      setTimeout(attachEditorToCurrentTextarea, 50);
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-ai-icon">🤖</span> AI Chấm bài';
      }
      alert('Lỗi chấm bài: ' + err.message);
    }
  }

  function switchExercise(lessonKey, idx) {
    if (!exerciseCache[lessonKey]) return;
    // Save current answer
    const editor = $('#answer-editor');
    if (editor) exerciseCache[lessonKey].userAnswer = editor.value;

    exerciseCache[lessonKey].activeExIdx = idx;
    exerciseCache[lessonKey].userAnswer = '';
    exerciseCache[lessonKey].feedback = null;
    exerciseCache[lessonKey].showHints = false;
    exerciseCache[lessonKey].showSolution = false;

    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);
    const container = $('#exercise-container');
    if (container) container.innerHTML = renderExerciseContent(lessonKey, tech, level, lesson);
    setTimeout(attachEditorToCurrentTextarea, 50);
  }

  function clearAnswer(lessonKey) {
    if (!exerciseCache[lessonKey]) exerciseCache[lessonKey] = { userAnswer: '', feedback: null, aiExercises: [], activeExIdx: 0 };
    exerciseCache[lessonKey].userAnswer = '';
    exerciseCache[lessonKey].feedback = null;
    const editor = $('#answer-editor');
    if (editor) editor.value = '';
    const container = $('#exercise-container');
    if (container) {
      const [techId, levelId, lessonId] = lessonKey.split('.');
      const tech = CURRICULUM[techId];
      const level = tech.levels.find(l => l.id === levelId);
      const lesson = level.lessons.find(ls => ls.id === lessonId);
      container.innerHTML = renderExerciseContent(lessonKey, tech, level, lesson);
      setTimeout(attachEditorToCurrentTextarea, 50);
    }
  }

  function toggleHints(lessonKey) {
    if (!exerciseCache[lessonKey]) exerciseCache[lessonKey] = { userAnswer: '', feedback: null, aiExercises: [], activeExIdx: 0, showHints: false };
    const editor = $('#answer-editor');
    if (editor) exerciseCache[lessonKey].userAnswer = editor.value;
    exerciseCache[lessonKey].showHints = !exerciseCache[lessonKey].showHints;
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);
    const container = $('#exercise-container');
    if (container) container.innerHTML = renderExerciseContent(lessonKey, tech, level, lesson);
    setTimeout(attachEditorToCurrentTextarea, 50);
  }

  function toggleSolution(lessonKey) {
    if (!exerciseCache[lessonKey]) return;
    const editor = $('#answer-editor');
    if (editor) exerciseCache[lessonKey].userAnswer = editor.value;
    exerciseCache[lessonKey].showSolution = !exerciseCache[lessonKey].showSolution;
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);
    const container = $('#exercise-container');
    if (container) container.innerHTML = renderExerciseContent(lessonKey, tech, level, lesson);
    if (typeof Prism !== 'undefined') Prism.highlightAll();
    setTimeout(attachEditorToCurrentTextarea, 50);
  }

  // ═══════════════════════════════════════
  // LESSON AI CHAT (Theory/Quiz/Exercise)
  // ═══════════════════════════════════════
  function renderLessonChatBox(lessonKey, tabId) {
    const cache = lessonChatCache[lessonKey];
    const messages = cache ? cache.messages : [];
    const sending = cache ? cache.sending : false;
    const chatId = `lesson-chat-${tabId}`;

    const tabEmojis = { theory: '📖', code: '💻', quiz: '🎯', exercise: '🏋️' };
    const tabLabels = { theory: 'lý thuyết', code: 'code', quiz: 'quiz', exercise: 'bài tập' };

    const messagesHtml = messages.map(m => {
      if (m.role === 'user') {
        return `<div class="lchat-msg lchat-user"><div class="lchat-bubble lchat-bubble-user">${escapeHtml(m.content)}</div></div>`;
      } else {
        return `<div class="lchat-msg lchat-ai"><div class="lchat-avatar">🤖</div><div class="lchat-bubble lchat-bubble-ai">${formatLessonChatMessage(m.content)}</div></div>`;
      }
    }).join('');

    return `
      <div class="lesson-chat-section glass-card" id="${chatId}">
        <div class="lchat-header" onclick="App.toggleLessonChat('${chatId}')">
          <h3>🤖 Hỏi AI về ${tabLabels[tabId] || 'bài học'}</h3>
          <span class="lchat-toggle" id="${chatId}-toggle">▼</span>
        </div>
        <div class="lchat-body" id="${chatId}-body">
          <div class="lchat-messages" id="${chatId}-messages">
            ${messages.length === 0 ? `
              <div class="lchat-welcome">
                <p>💡 Hỏi AI bất cứ điều gì về phần <strong>${tabLabels[tabId]}</strong> này!</p>
                <div class="lchat-suggestions">
                  <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}','Giải thích đơn giản phần này cho mình')">Giải thích đơn giản</button>
                  <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}','Cho mình thêm ví dụ')">Thêm ví dụ</button>
                  <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}','Phần nào quan trọng nhất?')">Phần quan trọng nhất?</button>
                </div>
              </div>` : messagesHtml}
          </div>
          <div class="lchat-input-row">
            <textarea class="lchat-input" id="${chatId}-input" placeholder="Hỏi AI về ${tabLabels[tabId]}..." rows="1" 
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();App.sendLessonChat('${lessonKey}','${tabId}')}"
              ${sending ? 'disabled' : ''}></textarea>
            <button class="lchat-send-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}')" ${sending ? 'disabled' : ''}>
              ${sending ? '<span class="lchat-spinner"></span>' : '➤'}
            </button>
          </div>
          ${messages.length > 0 ? `<button class="lchat-clear-btn" onclick="App.clearLessonChat('${lessonKey}','${tabId}')">🗑️ Xóa hội thoại</button>` : ''}
        </div>
      </div>`;
  }

  function formatLessonChatMessage(text) {
    if (!text) return '';
    let html = text;
    // Code blocks ```lang ... ```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="lchat-code"><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
    });
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="lchat-inline-code">$1</code>');
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function toggleLessonChat(chatId) {
    const body = document.getElementById(`${chatId}-body`);
    const toggle = document.getElementById(`${chatId}-toggle`);
    if (body && toggle) {
      body.classList.toggle('collapsed');
      toggle.textContent = body.classList.contains('collapsed') ? '▶' : '▼';
    }
  }

  async function sendLessonChat(lessonKey, tabId, prefillMsg) {
    const chatId = `lesson-chat-${tabId}`;
    const inputEl = document.getElementById(`${chatId}-input`);
    const userMessage = prefillMsg || (inputEl ? inputEl.value.trim() : '');
    if (!userMessage) return;

    // Init cache
    if (!lessonChatCache[lessonKey]) {
      lessonChatCache[lessonKey] = { messages: [], sending: false };
    }
    const cache = lessonChatCache[lessonKey];
    if (cache.sending) return;

    // Add user message
    cache.messages.push({ role: 'user', content: userMessage });
    cache.sending = true;

    // Re-render chat messages (optimistic)
    const messagesEl = document.getElementById(`${chatId}-messages`);
    if (messagesEl) {
      messagesEl.innerHTML = cache.messages.map(m => {
        if (m.role === 'user') {
          return `<div class="lchat-msg lchat-user"><div class="lchat-bubble lchat-bubble-user">${escapeHtml(m.content)}</div></div>`;
        } else {
          return `<div class="lchat-msg lchat-ai"><div class="lchat-avatar">🤖</div><div class="lchat-bubble lchat-bubble-ai">${formatLessonChatMessage(m.content)}</div></div>`;
        }
      }).join('') + `<div class="lchat-msg lchat-ai"><div class="lchat-avatar">🤖</div><div class="lchat-bubble lchat-bubble-ai lchat-typing">Đang suy nghĩ<span class="dot-anim">...</span></div></div>`;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    if (inputEl) { inputEl.value = ''; inputEl.disabled = true; }

    // Build lesson context — include FULL content the student is currently seeing
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = window.DATA?.find(t => t.id === techId);
    const level = tech?.levels?.find(l => l.id === levelId);
    const lesson = level?.lessons?.find(l => l.id === lessonId);
    const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    let lessonContext = `Công nghệ: ${tech?.name || techId}\nCấp độ: ${level?.name || levelId}\nBài học: ${lesson?.title || lessonId}`;

    // ──── PRIMARY CONTEXT: What the student is CURRENTLY looking at ────
    if (tabId === 'exercise') {
      const eCache = exerciseCache[lessonKey];
      const currentEx = eCache?.activeExIdx > 0 ? eCache.aiExercises[eCache.activeExIdx - 1] : null;
      if (currentEx) {
        lessonContext += `\n\n★★★ BÀI TẬP MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\nTiêu đề: ${currentEx.title}\nMô tả chi tiết: ${currentEx.description}`;
        if (currentEx.hints?.length) lessonContext += `\nGợi ý: ${currentEx.hints.join(', ')}`;
      } else if (lesson?.exercise) {
        lessonContext += `\n\n★★★ BÀI TẬP GỐC MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n${stripHtml(lesson.exercise).substring(0, 1500)}`;
      }
      if (eCache?.userAnswer) {
        lessonContext += `\n\n=== CODE HỌC VIÊN ĐÃ VIẾT ===\n${eCache.userAnswer.substring(0, 1500)}`;
      }
      // Theory as background only
      if (lesson?.theory) {
        lessonContext += `\n\n--- Lý thuyết tham khảo (phụ) ---\n${stripHtml(lesson.theory).substring(0, 1000)}`;
      }
    } else if (tabId === 'quiz') {
      const qCache = quizCache[lessonKey];
      if (qCache?.questions?.length) {
        lessonContext += `\n\n★★★ CÂU HỎI QUIZ MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n${qCache.questions.map((q, i) => {
          let qText = `Câu ${i + 1}: ${q.question || q.q}`;
          if (q.options) qText += '\n' + q.options.map((o, j) => `  ${String.fromCharCode(65 + j)}. ${o}`).join('\n');
          return qText;
        }).join('\n\n')}`;
      }
      // Theory as background
      if (lesson?.theory) {
        lessonContext += `\n\n--- Lý thuyết tham khảo (phụ) ---\n${stripHtml(lesson.theory).substring(0, 1000)}`;
      }
    } else if (tabId === 'code') {
      if (lesson?.code) {
        lessonContext += `\n\n★★★ CODE EXAMPLE MÀ HỌC VIÊN ĐANG XEM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n\`\`\`${lesson.lang || 'javascript'}\n${lesson.code}\n\`\`\``;
      }
      if (lesson?.theory) {
        lessonContext += `\n\n--- Lý thuyết tham khảo (phụ) ---\n${stripHtml(lesson.theory).substring(0, 1500)}`;
      }
    } else {
      // Theory tab — theory IS the primary content
      if (lesson?.theory) {
        lessonContext += `\n\n★★★ NỘI DUNG LÝ THUYẾT (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n${stripHtml(lesson.theory).substring(0, 3000)}`;
      }
      if (lesson?.keyPoints?.length) {
        lessonContext += `\n\n=== ĐIỂM CHÍNH ===\n${lesson.keyPoints.map((kp, i) => `${i + 1}. ${stripHtml(kp)}`).join('\n')}`;
      }
    }

    try {
      const aiResponse = await AIService.chatAboutLesson(lessonContext, cache.messages.slice(0, -1), userMessage, tabId);
      cache.messages.push({ role: 'assistant', content: aiResponse });
    } catch (err) {
      cache.messages.push({ role: 'assistant', content: `⚠️ Lỗi: ${err.message}. Thử lại nhé!` });
    }

    cache.sending = false;

    // Re-render
    if (messagesEl) {
      messagesEl.innerHTML = cache.messages.map(m => {
        if (m.role === 'user') {
          return `<div class="lchat-msg lchat-user"><div class="lchat-bubble lchat-bubble-user">${escapeHtml(m.content)}</div></div>`;
        } else {
          return `<div class="lchat-msg lchat-ai"><div class="lchat-avatar">🤖</div><div class="lchat-bubble lchat-bubble-ai">${formatLessonChatMessage(m.content)}</div></div>`;
        }
      }).join('');
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    if (inputEl) inputEl.disabled = false;
    if (typeof Prism !== 'undefined') Prism.highlightAll();
  }

  function clearLessonChat(lessonKey, tabId) {
    delete lessonChatCache[lessonKey];
    const chatId = `lesson-chat-${tabId}`;
    const messagesEl = document.getElementById(`${chatId}-messages`);
    if (messagesEl) {
      messagesEl.innerHTML = `
        <div class="lchat-welcome">
          <p>💡 Hỏi AI bất cứ điều gì!</p>
          <div class="lchat-suggestions">
            <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}','Giải thích đơn giản phần này cho mình')">Giải thích đơn giản</button>
            <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}','Cho mình thêm ví dụ')">Thêm ví dụ</button>
          </div>
        </div>`;
    }
    // Remove clear button
    const clearBtn = document.querySelector(`#${chatId} .lchat-clear-btn`);
    if (clearBtn) clearBtn.remove();
  }

  // ═══════════════════════════════════════
  // TAB SWITCHING
  // ═══════════════════════════════════════
  function switchTab(tabId) {
    activeTab = tabId;
    // Save answer textarea if switching away from exercise
    const editor = $('#answer-editor');
    if (editor) {
      const key = $('#exercise-container')?.dataset.key;
      if (key) {
        if (!exerciseCache[key]) exerciseCache[key] = { userAnswer: '', feedback: null, aiExercises: [], activeExIdx: 0 };
        exerciseCache[key].userAnswer = editor.value;
      }
    }

    // Update tab buttons
    $$('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    // Update panels
    $$('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tabId}`));

    if (typeof Prism !== 'undefined') Prism.highlightAll();

    // Attach code editor when exercise tab is shown
    if (tabId === 'exercise') {
      setTimeout(attachEditorToCurrentTextarea, 50);
    }
  }

  // ═══════════════════════════════════════
  // SIDEBAR
  // ═══════════════════════════════════════
  function renderSidebar() {
    const nav = $('#sidebar-nav');
    if (!nav) return;
    if (!isAuthenticated) { nav.innerHTML = ''; return; }

    const displayName = currentUserProfile?.display_name || currentUserProfile?.username || 'User';

    let html = `
      <div class="sidebar-user-section">
        <div class="sidebar-user-avatar">${displayName.charAt(0).toUpperCase()}</div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">${displayName}</span>
          <button class="sidebar-logout-btn" onclick="App.logout()" title="Đăng xuất">↗</button>
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-item" data-view="dashboard" onclick="App.goToDashboard()">
        <span class="sidebar-icon">🏠</span><span class="sidebar-text">Dashboard</span>
      </div>
      <div class="sidebar-item" data-view="project" onclick="App.goToProject()">
        <span class="sidebar-icon">🚀</span><span class="sidebar-text">Project Lab</span>
      </div>
      <div class="sidebar-item" data-view="my-projects" onclick="App.goToMyProjects()">
        <span class="sidebar-icon">📁</span><span class="sidebar-text">My Projects</span>
      </div>
      <div class="sidebar-item" data-view="career" onclick="App.goToCareer()">
        <span class="sidebar-icon">💼</span><span class="sidebar-text">Tư vấn Việc làm</span>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-section-title">Công nghệ</div>`;

    Object.values(CURRICULUM).forEach(tech => {
      const p = getTechProgress(tech.id);
      html += `
        <div class="sidebar-item" data-tech="${tech.id}" onclick="App.openRoadmap('${tech.id}')">
          <span class="sidebar-icon">${tech.icon}</span>
          <span class="sidebar-text">${tech.name}</span>
          ${p.percent > 0 ? `<span class="sidebar-progress" style="color:${tech.color}">${p.percent}%</span>` : ''}
        </div>`;
    });

    // AI Status indicator
    html += `
      <div class="sidebar-divider"></div>
      <div class="sidebar-item ai-status">
        <span class="sidebar-icon">${aiEnabled ? '🤖' : '⚠️'}</span>
        <span class="sidebar-text">${aiEnabled ? 'AI: Claude' : 'AI: Offline'}</span>
        <span class="sidebar-progress" style="color:${aiEnabled ? '#2ecc71' : '#e74c3c'}">${aiEnabled ? '●' : '●'}</span>
      </div>`;

    nav.innerHTML = html;
  }

  function updateSidebarActive() {
    $$('.sidebar-item').forEach(item => {
      item.classList.remove('active');
      if (currentView === 'dashboard' && item.dataset.view === 'dashboard') item.classList.add('active');
      else if ((currentView === 'project' || currentView === 'project-level' || currentView === 'project-topic' || currentView === 'saved-ideas') && item.dataset.view === 'project') item.classList.add('active');
      else if (currentView === 'career' && item.dataset.view === 'career') item.classList.add('active');
      else if (currentView === 'my-projects' && item.dataset.view === 'my-projects') item.classList.add('active');
      else if (item.dataset.tech === currentTech) item.classList.add('active');
    });
  }

  function updateStats() { renderSidebar(); }

  // ═══════════════════════════════════════
  // EVENTS
  // ═══════════════════════════════════════
  function bindEvents() {
    const toggleBtn = $('#sidebar-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
      const sidebar = $('#sidebar');
      const menuBtn = $('#mobile-menu-toggle');
      const mainContent = document.querySelector('.main-content');
      if (!sidebar) return;
      sidebar.classList.toggle('collapsed');
      // Show/hide hamburger on desktop when sidebar collapses
      if (sidebar.classList.contains('collapsed')) {
        if (menuBtn) menuBtn.style.display = 'flex';
        mainContent.style.marginLeft = '0';
        mainContent.style.paddingTop = '64px';
      } else {
        // Only hide menu btn on desktop (>1024px)
        if (window.innerWidth > 1024 && menuBtn) menuBtn.style.display = '';
        mainContent.style.marginLeft = '';
        mainContent.style.paddingTop = '';
      }
    });

    // Mobile menu button opens collapsed/hidden sidebar
    const mobileToggle = $('#mobile-menu-toggle');
    if (mobileToggle) mobileToggle.addEventListener('click', () => {
      const sidebar = $('#sidebar');
      const mainContent = document.querySelector('.main-content');
      if (!sidebar) return;
      // On desktop: just uncollapse
      if (window.innerWidth > 1024) {
        sidebar.classList.remove('collapsed');
        mobileToggle.style.display = '';
        mainContent.style.marginLeft = '';
        mainContent.style.paddingTop = '';
      }
      // Mobile handled by setupMobileSidebar()
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        const input = $('#search-input');
        if (input) input.focus(); else navigateTo('dashboard');
      }
      if (e.key === 'Escape') {
        if (document.activeElement?.tagName === 'INPUT') { document.activeElement.blur(); return; }
        if (document.activeElement?.tagName === 'TEXTAREA') { document.activeElement.blur(); return; }
        if (currentView === 'lesson') navigateTo('roadmap', { tech: currentTech });
        else if (currentView === 'roadmap') navigateTo('dashboard');
      }
    });
  }

  function bindDashboardEvents() {
    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearTimeout(searchInput._timer);
        searchInput._timer = setTimeout(() => render(), 250);
      });
    }
    const clearBtn = $('#search-clear');
    if (clearBtn) clearBtn.addEventListener('click', () => { searchQuery = ''; render(); });
  }

  // ═══════════════════════════════════════
  // MINI CODE EDITOR (Tab, Auto-close, etc.)
  // ═══════════════════════════════════════
  const PAIRS = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'", '`': '`' };
  const CLOSE_CHARS = new Set([')', '}', ']', '"', "'", '`']);

  function enhanceCodeEditor(textarea) {
    if (!textarea || textarea._enhanced) return;
    textarea._enhanced = true;

    textarea.addEventListener('keydown', (e) => {
      const { selectionStart: start, selectionEnd: end, value } = textarea;
      const selected = value.substring(start, end);

      // ─── TAB → insert 2 spaces ───
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab: outdent current line
          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          const line = value.substring(lineStart, end);
          const stripped = line.replace(/^ {1,2}/, '');
          const removed = line.length - stripped.length;
          textarea.value = value.substring(0, lineStart) + stripped + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start - removed;
        } else {
          // Tab: insert 2 spaces
          insertText(textarea, '  ');
        }
        return;
      }

      // ─── AUTO-CLOSE BRACKETS ───
      if (PAIRS[e.key]) {
        e.preventDefault();
        const open = e.key;
        const close = PAIRS[open];
        if (selected.length > 0) {
          // Wrap selection
          textarea.value = value.substring(0, start) + open + selected + close + value.substring(end);
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        } else {
          // For quotes: skip if same char is next
          if ((open === '"' || open === "'" || open === '`') && value[start] === open) {
            e.preventDefault();
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          } else {
            insertText(textarea, open + close);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          }
        }
        return;
      }

      // ─── SKIP CLOSING BRACKET if already there ───
      if (CLOSE_CHARS.has(e.key) && value[start] === e.key && start === end) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        return;
      }

      // ─── ENTER: auto-indent ───
      if (e.key === 'Enter') {
        e.preventDefault();
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = value.substring(lineStart, start);
        const indent = currentLine.match(/^(\s*)/)[1]; // preserve indent
        const charBefore = value[start - 1];
        const charAfter = value[start];

        if (charBefore === '{' && charAfter === '}') {
          // Enter between {} → expand with indent
          insertText(textarea, '\n' + indent + '  \n' + indent);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + 2;
        } else if (charBefore === '(' && charAfter === ')') {
          // Enter between () → expand
          insertText(textarea, '\n' + indent + '  \n' + indent);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + 2;
        } else if (charBefore === '{' || charBefore === ':') {
          // After { or : → add extra indent
          insertText(textarea, '\n' + indent + '  ');
        } else {
          // Normal enter → keep indent
          insertText(textarea, '\n' + indent);
        }
        return;
      }

      // ─── BACKSPACE: delete pair ───
      if (e.key === 'Backspace' && start === end && start > 0) {
        const charBefore = value[start - 1];
        const charAfter = value[start];
        if (PAIRS[charBefore] && PAIRS[charBefore] === charAfter) {
          e.preventDefault();
          textarea.value = value.substring(0, start - 1) + value.substring(start + 1);
          textarea.selectionStart = textarea.selectionEnd = start - 1;
          textarea.dispatchEvent(new Event('input'));
        }
      }
    });
  }

  // Insert text at cursor using execCommand for undo support, fallback to manual
  function insertText(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // Try execCommand for undo stack
    if (document.execCommand) {
      textarea.focus();
      document.execCommand('insertText', false, text);
    } else {
      const value = textarea.value;
      textarea.value = value.substring(0, start) + text + value.substring(end);
    }
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.dispatchEvent(new Event('input'));
  }

  // Auto-attach editor enhancement to any answer-editor that appears
  function attachEditorToCurrentTextarea() {
    const editor = $('#answer-editor');
    if (editor) enhanceCodeEditor(editor);
  }

  // ═══════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════
  function escapeHtml(str) {
    if (!str) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, c => map[c]);
  }

  function copyCode(btn) {
    const code = decodeURIComponent(btn.dataset.code);
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
    });
  }

  // ═══════════════════════════════════════
  // PROJECT LAB — RENDER FUNCTIONS
  // ═══════════════════════════════════════

  // ── Shared: Render idea panel ──
  function renderIdeaPanel(idea) {
    if (!idea) return '';
    const diffColors = { newbie: '#2ecc71', junior: '#3498db', mid: '#f1c40f', senior: '#e74c3c', master: '#f093fb' };
    const diffColor = diffColors[idea.difficulty] || diffColors.mid;

    return `
      <div class="project-idea-panel glass-card difficulty-${idea.difficulty || 'mid'}">
        <div class="idea-header">
          <h2 class="idea-title">${escapeHtml(idea.name)}</h2>
          <div class="idea-meta">
            <span class="idea-tag tag-diff badge badge-${idea.difficulty || 'mid'}">${idea.difficulty || 'mid'}</span>
            ${idea.estimatedTime ? `<span class="idea-tag tag-time">⏰ ${escapeHtml(idea.estimatedTime)}</span>` : ''}
          </div>
        </div>
        <p class="idea-description">${escapeHtml(idea.description)}</p>

        ${idea.techStack && idea.techStack.length ? `
          <div class="idea-section">
            <div class="idea-section-title">🛠️ Tech Stack</div>
            <div class="idea-tech-stack">${idea.techStack.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}</div>
          </div>` : ''}

        ${idea.requirements && idea.requirements.length ? `
          <div class="idea-section">
            <div class="idea-section-title">📋 Yêu cầu</div>
            <ul class="idea-list">${idea.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
          </div>` : ''}

        ${idea.steps && idea.steps.length ? `
          <div class="idea-section">
            <div class="idea-section-title">📝 Các bước thực hiện</div>
            <ul class="idea-list steps">${idea.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
          </div>` : ''}

        ${idea.bonusFeatures && idea.bonusFeatures.length ? `
          <div class="idea-section">
            <div class="idea-section-title">⭐ Bonus Features</div>
            <ul class="idea-list">${idea.bonusFeatures.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
          </div>` : ''}
      </div>`;
  }

  // ── Render Save Idea button ──
  function renderSaveButton() {
    return `<button class="btn-ai btn-save-idea" onclick="App.saveCurrentIdea()">
      <span class="btn-ai-icon">💾</span> Lưu Idea
    </button>`;
  }

  // ── Shared: Render chat panel ──
  function renderChatPanel() {
    return `
      <div class="project-chat-section">
        <div class="chat-container">
          <div class="chat-header">💬 Chat với AI Mentor</div>
          <div class="chat-messages" id="project-chat-messages">
            ${projectChatHistory.length === 0
              ? '<div class="chat-empty">Hỏi AI bất cứ điều gì về project này...</div>'
              : projectChatHistory.map(msg => {
                  const isUser = msg.role === 'user';
                  let content = escapeHtml(msg.content);
                  // Basic markdown: code blocks
                  content = content.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => `<pre><code>${code.trim()}</code></pre>`);
                  content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
                  // Bold
                  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                  // Line breaks
                  content = content.replace(/\n/g, '<br>');
                  return `
                    <div class="chat-message ${isUser ? 'user-msg' : 'ai-msg'}">
                      <div class="chat-avatar">${isUser ? '👤' : '🤖'}</div>
                      <div class="chat-bubble">${content}</div>
                    </div>`;
                }).join('')}
            ${projectChatSending ? `
              <div class="chat-message ai-msg">
                <div class="chat-avatar">🤖</div>
                <div class="chat-bubble"><div class="chat-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>
              </div>` : ''}
          </div>
          <div class="chat-input-row">
            <input type="text" class="chat-input" id="project-chat-input" placeholder="Hỏi về project..." autocomplete="off" onkeydown="if(event.key==='Enter')App.sendProjectChat()" />
            <button class="btn-chat-send" onclick="App.sendProjectChat()" ${projectChatSending ? 'disabled' : ''}>➤</button>
          </div>
        </div>
      </div>`;
  }

  // ── Shared: Render submit panel ──
  function renderSubmitPanel() {
    const statusLabels = { excellent: '🎉 Xuất sắc!', good: '👍 Tốt!', partial: '💪 Cần cải thiện', needs_work: '📝 Cần làm lại' };
    const statusColors = { excellent: '#2ecc71', good: '#43e97b', partial: '#f1c40f', needs_work: '#e74c3c' };
    const langOptions = [
      { val: 'javascript', label: 'JavaScript' }, { val: 'python', label: 'Python' },
      { val: 'java', label: 'Java' }, { val: 'cpp', label: 'C++' },
      { val: 'csharp', label: 'C#' }, { val: 'go', label: 'Go' },
      { val: 'rust', label: 'Rust' }, { val: 'php', label: 'PHP' },
      { val: 'html', label: 'HTML/CSS' }, { val: 'css', label: 'CSS' },
      { val: 'typescript', label: 'TypeScript' }, { val: 'json', label: 'JSON' }
    ];

    const activeFile = projectFiles[projectActiveFileIdx] || projectFiles[0];
    const fileIcons = { javascript: '📜', typescript: '🔷', python: '🐍', java: '☕', cpp: '⚡', csharp: '🟣', go: '🔵', rust: '🦀', php: '🐘', html: '🌐', css: '🎨', json: '📋' };
    const getIcon = (lang) => fileIcons[lang] || '📄';
    const totalLines = projectFiles.reduce((s, f) => s + (f.code ? f.code.split('\n').length : 0), 0);
    const totalChars = projectFiles.reduce((s, f) => s + (f.code ? f.code.length : 0), 0);

    let html = `
      <div class="project-submit-section">
        <div class="lesson-section glass-card">
          <h2 class="section-title">📤 Nộp Project</h2>
          <p class="submit-hint">Thêm tất cả các file trong project để AI đánh giá toàn diện</p>

          <div class="file-tabs-bar">
            <div class="file-tabs-list">
              ${projectFiles.map((f, i) => `
                <div class="file-tab ${i === projectActiveFileIdx ? 'active' : ''}" onclick="App.switchProjectFile(${i})">
                  <span class="file-tab-icon">${getIcon(f.lang)}</span>
                  <span class="file-tab-name">${escapeHtml(f.name)}</span>
                  ${projectFiles.length > 1 ? `<span class="file-tab-close" onclick="event.stopPropagation();App.removeProjectFile(${i})" title="Xóa file">×</span>` : ''}
                </div>`).join('')}
            </div>
            <button class="btn-add-file" onclick="App.addProjectFile()" title="Thêm file">+ Thêm file</button>
          </div>

          <div class="file-editor-header">
            <input type="text" class="file-name-input" id="file-name-input" value="${escapeHtml(activeFile.name)}" onchange="App.renameProjectFile(this.value)" placeholder="Tên file..." />
            <select class="project-lang-select" id="project-lang" onchange="App.setProjectFileLang(this.value)">
              ${langOptions.map(l => `<option value="${l.val}" ${activeFile.lang === l.val ? 'selected' : ''}>${l.label}</option>`).join('')}
            </select>
          </div>

          <textarea class="answer-editor" id="project-code-editor" placeholder="Paste code file ${escapeHtml(activeFile.name)} ở đây..." spellcheck="false">${escapeHtml(activeFile.code)}</textarea>

          <div class="file-stats">
            <span>📁 ${projectFiles.length} file${projectFiles.length > 1 ? 's' : ''}</span>
            <span>📝 ${totalLines} dòng code</span>
            <span>${totalChars > 400000 ? '⚠️ Rất lớn - AI sẽ rút gọn tự động' : totalChars > 200000 ? '📦 File lớn' : '✅ OK'}</span>
          </div>

          <div class="answer-actions">
            ${aiEnabled ? `
              <button class="btn-ai btn-check" onclick="App.submitProject()" id="btn-submit-project">
                <span class="btn-ai-icon">🤖</span> AI Chấm Project (${projectFiles.length} file)
              </button>` : ''}
            <button class="btn-clear-answer" onclick="App.clearAllProjectFiles()">🗑️ Xóa tất cả</button>
          </div>
        </div>
      </div>`;

    if (projectReview) {
      const r = projectReview;
      const color = statusColors[r.status] || '#58a6ff';
      html += `
        <div class="project-feedback glass-card" style="border-left:4px solid ${color}">
          <div class="idea-header">
            <h2 class="idea-title">${statusLabels[r.status] || 'Kết quả'} — ${r.score}/100</h2>
          </div>
          <div class="feedback-score-bar" style="margin-bottom:20px">
            <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${r.score}%;background:${color}"></div></div>
          </div>
          ${r.summary ? `<div class="feedback-summary-text">${escapeHtml(r.summary)}</div>` : ''}
          ${r.criteria && r.criteria.length ? `
            <div class="criteria-grid">
              ${r.criteria.map(c => `
                <div class="criteria-card">
                  <div class="criteria-name">${escapeHtml(c.name)}</div>
                  <div class="criteria-score ${c.score >= 15 ? 'score-high' : c.score >= 10 ? 'score-mid' : 'score-low'}">${c.score}/20</div>
                  <div class="criteria-comment">${escapeHtml(c.comment)}</div>
                </div>`).join('')}
            </div>` : ''}
          ${r.perFileReviews && r.perFileReviews.length ? `
            <div class="feedback-list-section per-file-scores">
              <h4>📁 Điểm từng file</h4>
              <div class="per-file-grid">
                ${r.perFileReviews.map(pf => {
                  const pfColor = pf.score >= 80 ? '#2ecc71' : pf.score >= 60 ? '#f1c40f' : pf.score >= 40 ? '#e67e22' : '#e74c3c';
                  return `
                  <div class="per-file-card">
                    <div class="per-file-header">
                      <span class="per-file-name">${escapeHtml(pf.fileName)}</span>
                      <span class="per-file-score" style="color:${pfColor}">${pf.score}/100</span>
                    </div>
                    <div class="progress-bar-track" style="height:4px;margin:6px 0">
                      <div class="progress-bar-fill" style="width:${pf.score}%;background:${pfColor}"></div>
                    </div>
                    <div class="per-file-summary">${escapeHtml(pf.summary || '')}</div>
                  </div>`;
                }).join('')}
              </div>
            </div>` : ''}
          ${r.structureReview ? (() => {
            const sr = r.structureReview;
            const srColor = (sr.structureScore || 0) >= 80 ? '#2ecc71' : (sr.structureScore || 0) >= 60 ? '#f1c40f' : (sr.structureScore || 0) >= 40 ? '#e67e22' : '#e74c3c';
            return `
            <div class="feedback-list-section structure-review-section">
              <h4>🏗️ Tier 1: Cấu trúc Project — <span style="color:${srColor}">${sr.structureScore || 0}/100</span></h4>
              <div class="structure-grid">
                <div class="structure-item"><strong>📛 Đặt tên:</strong> ${escapeHtml(sr.naming || 'N/A')}</div>
                <div class="structure-item"><strong>📁 Tổ chức:</strong> ${escapeHtml(sr.organization || 'N/A')}</div>
                <div class="structure-item"><strong>✅ Đầy đủ:</strong> ${escapeHtml(sr.completeness || 'N/A')}</div>
                ${(sr.missingFiles || []).length > 0 ? `<div class="structure-item"><strong>❌ Thiếu:</strong> ${sr.missingFiles.map(f => escapeHtml(f)).join(', ')}</div>` : ''}
                ${(sr.suggestions || []).length > 0 ? `<div class="structure-item"><strong>💡 Gợi ý:</strong><ul>${sr.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>` : ''}
              </div>
            </div>`;
          })() : ''}
          ${r.moduleReviews && r.moduleReviews.length ? `
            <div class="feedback-list-section module-reviews-section">
              <h4>🤖 Tier 2: Đánh giá theo Module</h4>
              <div class="module-grid">
                ${r.moduleReviews.map(m => {
                  const mColor = (m.score || 0) >= 80 ? '#2ecc71' : (m.score || 0) >= 60 ? '#f1c40f' : (m.score || 0) >= 40 ? '#e67e22' : '#e74c3c';
                  return `
                  <details class="module-card" open>
                    <summary class="module-header">
                      <span class="module-label">${m.moduleLabel || m.moduleId}</span>
                      <span class="module-score" style="color:${mColor}">${m.score || 0}/100</span>
                      <span class="module-metrics">Q:${m.codeQuality || 0} L:${m.logic || 0} E:${m.errorHandling || 0} R:${m.relevance || 0}</span>
                    </summary>
                    <div class="module-body">
                      <p class="module-summary">${escapeHtml(m.summary || '')}</p>
                      ${(m.fileScores || []).length > 0 ? `<div class="module-files">${m.fileScores.map(fs => {
                        const fsColor = (fs.score || 0) >= 80 ? '#2ecc71' : (fs.score || 0) >= 60 ? '#f1c40f' : '#e74c3c';
                        return `<span class="module-file-chip"><span>${escapeHtml(fs.file)}</span> <span style="color:${fsColor}">${fs.score}</span></span>`;
                      }).join('')}</div>` : ''}
                      ${(m.issues || []).length > 0 ? `<div class="module-issues"><strong>⚠️ Issues:</strong> ${m.issues.map(i => escapeHtml(i)).join(' • ')}</div>` : ''}
                      ${(m.positives || []).length > 0 ? `<div class="module-positives"><strong>✅ Good:</strong> ${m.positives.map(p => escapeHtml(p)).join(' • ')}</div>` : ''}
                    </div>
                  </details>`;
                }).join('')}
              </div>
            </div>` : ''}
          ${r.localAnalysis ? (() => {
            const la = r.localAnalysis;
            const laColor = la.avgScore >= 80 ? '#2ecc71' : la.avgScore >= 60 ? '#f1c40f' : la.avgScore >= 40 ? '#e67e22' : '#e74c3c';
            return `
            <div class="feedback-list-section local-analysis-section">
              <h4>🔍 Static Analysis (miễn phí, không tốn token)</h4>
              <div class="local-analysis-summary">
                <div class="la-score-badge" style="border-color:${laColor}">
                  <span class="la-score-num" style="color:${laColor}">${la.avgScore}</span>
                  <span class="la-score-label">Lint Score</span>
                </div>
                <div class="la-stats">
                  <span class="la-stat la-errors">${la.totalErrors > 0 ? '🔴' : '✅'} ${la.totalErrors} Errors</span>
                  <span class="la-stat la-warnings">${la.totalWarnings > 0 ? '🟡' : '✅'} ${la.totalWarnings} Warnings</span>
                  <span class="la-stat la-info">ℹ️ ${la.totalIssues - la.totalErrors - la.totalWarnings} Info</span>
                </div>
              </div>
              ${la.files.filter(f => f.issues.length > 0).map(f => `
                <details class="la-file-detail">
                  <summary>
                    <span class="la-file-name">${escapeHtml(f.fileName)}</span>
                    <span class="la-file-grade grade-${f.grade}">${f.grade}</span>
                    <span class="la-file-score">${f.score}/100</span>
                    <span class="la-file-counts">${f.errorCount > 0 ? `<span class="la-err-badge">${f.errorCount}E</span>` : ''}${f.warnCount > 0 ? `<span class="la-warn-badge">${f.warnCount}W</span>` : ''}</span>
                  </summary>
                  <ul class="la-issues-list">
                    ${f.issues.map(iss => `<li class="la-issue la-issue-${iss.severity}">${iss.line ? `<span class="la-line">L${iss.line}</span>` : ''} ${escapeHtml(iss.message)}</li>`).join('')}
                  </ul>
                </details>
              `).join('')}
              ${la.files.every(f => f.issues.length === 0) ? '<p style="color:#2ecc71;margin-top:8px">✅ Không phát hiện vấn đề nào! Code rất sạch.</p>' : ''}
            </div>`;
          })() : ''}
          ${r.strengths && r.strengths.length ? `
            <div class="feedback-list-section strengths">
              <h4>✅ Điểm mạnh</h4>
              <ul>${r.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
            </div>` : ''}
          ${r.improvements && r.improvements.length ? `
            <div class="feedback-list-section improvements">
              <h4>⚡ Cần cải thiện</h4>
              <ul>${r.improvements.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
            </div>` : ''}
          ${r.tips && r.tips.length ? `
            <div class="feedback-list-section tips">
              <h4>💡 Gợi ý nâng cao</h4>
              <ul>${r.tips.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
            </div>` : ''}
        </div>`;
    }

    return html;
  }

  function getFileIcon(lang) {
    const icons = { javascript: '📜', typescript: '🔷', python: '🐍', java: '☕', cpp: '⚡', csharp: '🟣', go: '🔵', rust: '🦀', php: '🐘', html: '🌐', css: '🎨', json: '📋' };
    return icons[lang] || '📄';
  }


  // ── PROJECT HUB (main page — 2 cards) ──
  function renderProjectHub(container) {
    container.innerHTML = `
      <div class="project-hub">
        <div class="project-hub-header">
          <h1 class="view-title">🚀 Project Lab</h1>
          <p class="view-subtitle">Thực hành qua project thực tế. AI sẽ gợi ý idea, hướng dẫn, và chấm điểm project của bạn.</p>
        </div>
        <div class="project-hub-cards">
          <div class="project-hub-card card-level glass-card" onclick="App.goToProjectLevel()">
            <span class="card-emoji">📊</span>
            <h3>Theo Cấp Độ</h3>
            <p>Chọn mức Newbie → Master. AI sẽ gợi ý project phù hợp với trình độ của bạn.</p>
            <span class="card-cta">Bắt đầu →</span>
          </div>
          <div class="project-hub-card card-topic glass-card" onclick="App.goToProjectTopic()">
            <span class="card-emoji">📝</span>
            <h3>Theo Chủ Đề</h3>
            <p>Nhập chủ đề bạn muốn (game, web, API...). AI sẽ thiết kế project theo ý bạn.</p>
            <span class="card-cta">Bắt đầu →</span>
          </div>
          <div class="project-hub-card card-saved glass-card" onclick="App.goToSavedIdeas()">
            <span class="card-emoji">📂</span>
            <h3>Idea Đã Lưu</h3>
            <p>Xem lại các idea đã bookmark. ${savedIdeas.length > 0 ? `Bạn có <strong>${savedIdeas.length}</strong> idea đã lưu.` : 'Chưa có idea nào được lưu.'}</p>
            <span class="card-cta">${savedIdeas.length > 0 ? `Xem ${savedIdeas.length} idea →` : 'Chưa có idea'}</span>
          </div>
        </div>
      </div>`;
  }

  // ── PROJECT BY LEVEL ──
  function renderProjectByLevel(container) {
    const levels = [
      { id: 'newbie', name: 'Newbie', emoji: '🌱', desc: 'Cơ bản' },
      { id: 'junior', name: 'Junior', emoji: '🌿', desc: 'Nền tảng' },
      { id: 'mid', name: 'Mid', emoji: '🌳', desc: 'Trung cấp' },
      { id: 'senior', name: 'Senior', emoji: '🔥', desc: 'Nâng cao' },
      { id: 'master', name: 'Master', emoji: '👑', desc: 'Chuyên gia' }
    ];

    let html = `
      <div class="project-level-view">
        <button class="btn-back" onclick="App.goToProject()">← Quay lại Project Lab</button>
        <h1 class="view-title" style="margin-bottom:8px">📊 Project theo Cấp Độ</h1>
        <p class="view-subtitle" style="margin-bottom:28px">Chọn cấp độ để nhận idea project phù hợp</p>

        <div class="level-grid">
          ${levels.map(lv => `
            <div class="level-card level-card-${lv.id} ${projectSelectedLevel === lv.id ? 'active' : ''}" onclick="App.selectProjectLevel('${lv.id}')">
              <span class="level-emoji">${lv.emoji}</span>
              <div class="level-name">${lv.name}</div>
              <div class="level-desc">${lv.desc}</div>
            </div>`).join('')}
        </div>

        <div id="project-level-content">`;

    if (projectSelectedLevel) {
      if (projectIdea) {
        html += renderIdeaPanel(projectIdea);
        html += `<div class="idea-actions" style="margin-bottom:24px">
          <button class="btn-ai btn-retry" onclick="App.generateProjectByLevel()">
            <span class="btn-ai-icon">🔄</span> Idea mới
          </button>
          ${renderSaveButton()}
        </div>`;
        html += renderChatPanel();
        html += renderSubmitPanel();
      } else {
        html += `
          <div class="lesson-section glass-card" style="text-align:center;padding:48px">
            <span style="font-size:48px;display:block;margin-bottom:16px">🎯</span>
            <h3 style="margin-bottom:8px">Sẵn sàng!</h3>
            <p style="color:var(--text-secondary);margin-bottom:24px">Nhấn button bên dưới để AI tạo idea project cấp <strong>${projectSelectedLevel}</strong></p>
            ${aiEnabled ? `
              <button class="btn-ai btn-generate-quiz" onclick="App.generateProjectByLevel()">
                <span class="btn-ai-icon">🤖</span> Tạo Project Idea
              </button>` : `
              <div class="ai-disabled-notice"><p>⚠️ AI chưa được kích hoạt.</p></div>`}
          </div>`;
      }
    }

    html += '</div></div>';
    container.innerHTML = html;
    scrollChatToBottom();
    attachEditorToProjectCode();
  }

  // ── PROJECT BY TOPIC ──
  function renderProjectByTopic(container) {
    const suggestions = ['🎮 Game', '🌐 Website', '📱 Mobile App', '🤖 Chatbot', '📊 Dashboard', '🛒 E-commerce', '📝 Todo App', '🎵 Music Player', '☁️ Weather App', '💬 Social Media'];
    const topicLevels = [
      { id: null, name: 'Tự động', emoji: '🎯', desc: 'AI tự chọn' },
      { id: 'newbie', name: 'Newbie', emoji: '🌱', desc: 'Cơ bản' },
      { id: 'junior', name: 'Junior', emoji: '🌿', desc: 'Nền tảng' },
      { id: 'mid', name: 'Mid', emoji: '🌳', desc: 'Trung cấp' },
      { id: 'senior', name: 'Senior', emoji: '🔥', desc: 'Nâng cao' },
      { id: 'master', name: 'Master', emoji: '👑', desc: 'Chuyên gia' }
    ];

    let html = `
      <div class="project-topic-view">
        <button class="btn-back" onclick="App.goToProject()">← Quay lại Project Lab</button>
        <h1 class="view-title" style="margin-bottom:8px">📝 Project theo Chủ Đề</h1>
        <p class="view-subtitle" style="margin-bottom:28px">Nhập chủ đề bạn muốn, AI sẽ thiết kế project cho bạn</p>

        <div class="topic-input-section">
          <input type="text" class="topic-input" id="topic-input" placeholder="VD: Game rắn săn mồi, Blog cá nhân, API quản lý sinh viên..." value="${escapeHtml(projectTopic)}" onkeydown="if(event.key==='Enter')App.generateProjectByTopic()" />
          ${aiEnabled ? `
            <button class="btn-ai btn-topic-generate" onclick="App.generateProjectByTopic()">
              <span class="btn-ai-icon">🤖</span> Tạo Idea
            </button>` : ''}
        </div>

        <div class="topic-suggestions">
          ${suggestions.map(s => `<button class="topic-chip" onclick="App.setTopic('${s.substring(2)}')">${s}</button>`).join('')}
        </div>

        <div class="topic-level-selector">
          <span class="topic-level-label">Cấp độ:</span>
          ${topicLevels.map(lv => `
            <button class="topic-level-pill ${projectTopicLevel === lv.id ? 'active' : ''}" onclick="App.setTopicLevel(${lv.id ? "'" + lv.id + "'" : 'null'})">
              <span class="pill-emoji">${lv.emoji}</span> ${lv.name}
            </button>`).join('')}
        </div>

        <div id="project-topic-content">`;

    if (projectIdea) {
      html += renderIdeaPanel(projectIdea);
      html += `<div class="idea-actions" style="margin-bottom:24px">
        <button class="btn-ai btn-retry" onclick="App.generateProjectByTopic()">
          <span class="btn-ai-icon">🔄</span> Idea mới
        </button>
        ${renderSaveButton()}
      </div>`;
      html += renderChatPanel();
      html += renderSubmitPanel();
    }

    html += '</div></div>';
    container.innerHTML = html;
    scrollChatToBottom();
    attachEditorToProjectCode();
  }

  // ── SAVED IDEAS VIEW ──
  function renderSavedIdeas(container) {
    const diffColors = { newbie: '#2ecc71', junior: '#3498db', mid: '#f1c40f', senior: '#e74c3c', master: '#f093fb' };

    let html = `
      <div class="saved-ideas-view">
        <button class="btn-back" onclick="App.goToProject()">← Quay lại Project Lab</button>
        <h1 class="view-title" style="margin-bottom:8px">📂 Idea Đã Lưu</h1>
        <p class="view-subtitle" style="margin-bottom:28px">Các project idea bạn đã bookmark để quay lại làm sau</p>`;

    if (savedIdeas.length === 0) {
      html += `
        <div class="lesson-section glass-card" style="text-align:center;padding:48px">
          <span style="font-size:48px;display:block;margin-bottom:16px">📭</span>
          <h3 style="margin-bottom:8px">Chưa có idea nào được lưu</h3>
          <p style="color:var(--text-secondary);margin-bottom:24px">Tạo project idea rồi nhấn nút "💾 Lưu Idea" để bookmark lại nhé!</p>
          <button class="btn-ai" onclick="App.goToProjectTopic()">
            <span class="btn-ai-icon">📝</span> Tạo Idea theo chủ đề
          </button>
        </div>`;
    } else {
      html += `<div class="saved-ideas-grid">`;
      savedIdeas.forEach(saved => {
        const idea = saved.idea;
        const date = new Date(saved.savedAt);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const diffColor = diffColors[idea.difficulty] || diffColors.mid;
        const sourceLabel = saved.source === 'topic' ? `📝 ${saved.topic || 'Chủ đề'}` : `📊 ${saved.level || idea.difficulty}`;

        html += `
          <div class="saved-idea-card glass-card difficulty-${idea.difficulty || 'mid'}">
            <div class="saved-idea-header">
              <h3 class="saved-idea-title">${escapeHtml(idea.name)}</h3>
              <div class="saved-idea-badges">
                <span class="idea-tag tag-diff badge badge-${idea.difficulty || 'mid'}">${(idea.difficulty || 'mid').toUpperCase()}</span>
                ${idea.estimatedTime ? `<span class="idea-tag tag-time">⏰ ${escapeHtml(idea.estimatedTime)}</span>` : ''}
              </div>
            </div>
            <p class="saved-idea-desc">${escapeHtml(idea.description)}</p>
            ${idea.techStack && idea.techStack.length ? `
              <div class="saved-idea-tech">${idea.techStack.slice(0, 5).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}${idea.techStack.length > 5 ? `<span class="tech-tag">+${idea.techStack.length - 5}</span>` : ''}</div>` : ''}
            <div class="saved-idea-footer">
              <div class="saved-idea-meta">
                <span class="saved-idea-date">📅 ${dateStr} ${timeStr}</span>
                <span class="saved-idea-source">${sourceLabel}</span>
              </div>
              <div class="saved-idea-actions">
                <button class="btn-ai btn-load-idea" onclick="App.loadSavedIdea('${saved.id}')">
                  <span class="btn-ai-icon">▶️</span> Bắt đầu làm
                </button>
                <button class="btn-delete-idea" onclick="if(confirm('Xóa idea này?')) App.deleteSavedIdea('${saved.id}')">
                  🗑️
                </button>
              </div>
            </div>
          </div>`;
      });
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  // ═══════════════════════════════════════
  // PROJECT LAB — ACTIONS
  // ═══════════════════════════════════════

  function resetProjectState() {
    projectIdea = null;
    projectChatHistory = [];
    projectChatSending = false;
    projectFiles = [{ name: 'main.js', lang: 'javascript', code: '' }];
    projectActiveFileIdx = 0;
    projectReview = null;
  }

  function selectProjectLevel(level) {
    if (projectSelectedLevel !== level) {
      projectSelectedLevel = level;
      resetProjectState();
    }
    render();
  }

  async function generateProjectByLevel() {
    if (!projectSelectedLevel) return;
    resetProjectState();

    // Render loading directly (bypass render()'s 120ms setTimeout)
    const main = document.getElementById('main-content');
    if (main) {
      const levels = [
        { id: 'newbie', name: 'Newbie', emoji: '🌱', desc: 'Cơ bản' },
        { id: 'junior', name: 'Junior', emoji: '🌿', desc: 'Nền tảng' },
        { id: 'mid', name: 'Mid', emoji: '🌳', desc: 'Trung cấp' },
        { id: 'senior', name: 'Senior', emoji: '🔥', desc: 'Nâng cao' },
        { id: 'master', name: 'Master', emoji: '👑', desc: 'Chuyên gia' }
      ];
      main.style.opacity = '1';
      main.style.transform = 'none';
      main.innerHTML = `
        <div class="project-level-view">
          <button class="btn-back" onclick="App.goToProject()">← Quay lại Project Lab</button>
          <h1 class="view-title" style="margin-bottom:8px">📊 Project theo Cấp Độ</h1>
          <p class="view-subtitle" style="margin-bottom:28px">Chọn cấp độ để nhận idea project phù hợp</p>
          <div class="level-grid">
            ${levels.map(lv => `
              <div class="level-card level-card-${lv.id} ${projectSelectedLevel === lv.id ? 'active' : ''}" onclick="App.selectProjectLevel('${lv.id}')">
                <span class="level-emoji">${lv.emoji}</span>
                <div class="level-name">${lv.name}</div>
                <div class="level-desc">${lv.desc}</div>
              </div>`).join('')}
          </div>
          <div class="ai-loading glass-card">
            <div class="loading-spinner"></div>
            <p>🤖 AI đang tạo idea project cấp <strong>${projectSelectedLevel}</strong>...</p>
          </div>
        </div>`;
    }

    try {
      projectIdea = await AIService.generateProjectIdea(projectSelectedLevel);
      render();
    } catch (err) {
      const main2 = document.getElementById('main-content');
      if (main2) {
        const errorDiv = main2.querySelector('.ai-loading');
        if (errorDiv) {
          errorDiv.className = 'ai-error glass-card';
          errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <p>Lỗi: ${err.message}</p>
            <button class="btn-ai" onclick="App.generateProjectByLevel()">Thử lại</button>`;
        }
      }
    }
  }

  async function generateProjectByTopic() {
    const input = document.getElementById('topic-input');
    if (input) projectTopic = input.value;
    if (!projectTopic.trim()) return;

    resetProjectState();

    const suggestions = ['🎮 Game', '🌐 Website', '📱 Mobile App', '🤖 Chatbot', '📊 Dashboard', '🛒 E-commerce', '📝 Todo App', '🎵 Music Player', '☁️ Weather App', '💬 Social Media'];

    // Render loading directly (bypass render()'s 120ms setTimeout)
    const main = document.getElementById('main-content');
    if (main) {
      main.style.opacity = '1';
      main.style.transform = 'none';
      main.innerHTML = `
        <div class="project-topic-view">
          <button class="btn-back" onclick="App.goToProject()">← Quay lại Project Lab</button>
          <h1 class="view-title" style="margin-bottom:8px">📝 Project theo Chủ Đề</h1>
          <p class="view-subtitle" style="margin-bottom:28px">Nhập chủ đề bạn muốn, AI sẽ thiết kế project cho bạn</p>
          <div class="topic-input-section">
            <input type="text" class="topic-input" id="topic-input" placeholder="VD: Game rắn săn mồi, Blog cá nhân..." value="${escapeHtml(projectTopic)}" onkeydown="if(event.key==='Enter')App.generateProjectByTopic()" />
            <button class="btn-ai btn-topic-generate" onclick="App.generateProjectByTopic()" disabled>
              <span class="loading-spinner-inline"></span> Đang tạo...
            </button>
          </div>
          <div class="topic-suggestions">
            ${suggestions.map(s => `<button class="topic-chip" onclick="App.setTopic('${s.substring(2)}')">${s}</button>`).join('')}
          </div>
          <div class="ai-loading glass-card">
            <div class="loading-spinner"></div>
            <p>🤖 AI đang tạo idea cho chủ đề "<strong>${escapeHtml(projectTopic)}</strong>"...</p>
          </div>
        </div>`;
    }

    try {
      projectIdea = await AIService.generateProjectIdea(projectTopicLevel, projectTopic);
      render();
    } catch (err) {
      const main2 = document.getElementById('main-content');
      if (main2) {
        const errorDiv = main2.querySelector('.ai-loading');
        if (errorDiv) {
          errorDiv.className = 'ai-error glass-card';
          errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <p>Lỗi: ${err.message}</p>
            <button class="btn-ai" onclick="App.generateProjectByTopic()">Thử lại</button>`;
        }
      }
    }
  }

  function setTopic(topic) {
    projectTopic = topic;
    const input = document.getElementById('topic-input');
    if (input) input.value = topic;
  }

  function setTopicLevel(level) {
    projectTopicLevel = level;
    render();
  }

  async function sendProjectChat() {
    const input = document.getElementById('project-chat-input');
    if (!input || !input.value.trim() || !projectIdea) return;

    const userMsg = input.value.trim();
    projectChatHistory.push({ role: 'user', content: userMsg });
    projectChatSending = true;
    input.value = '';
    refreshChatUI();

    try {
      // Include user's code files in context so AI can see them
      saveCurrentFileCode();
      const codeContext = projectFiles
        .filter(f => f.code.trim())
        .map(f => {
          let code = f.code;
          // Smart truncate: keep beginning + end for large files
          if (code.length > 8000) {
            const half = 3800;
            code = code.slice(0, half) + '\n\n// ... (middle section omitted for brevity) ...\n\n' + code.slice(-half);
          }
          return `\n--- File: ${f.name} (${f.language}, ${f.code.split('\\n').length} lines) ---\n${code}`;
        }).join('\n');
      const context = `Project: ${projectIdea.name}\nMô tả: ${projectIdea.description}\nYêu cầu: ${(projectIdea.requirements || []).join(', ')}${codeContext ? '\n\n📁 Code hiện tại của học viên:' + codeContext : ''}`;
      const reply = await AIService.chatAboutProject(context, projectChatHistory.slice(0, -1), userMsg);
      projectChatHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
      projectChatHistory.push({ role: 'assistant', content: `⚠️ Lỗi: ${err.message}` });
    }

    projectChatSending = false;
    refreshChatUI();
  }

  function refreshChatUI() {
    const messagesEl = document.getElementById('project-chat-messages');
    if (!messagesEl) return;

    let html = '';
    if (projectChatHistory.length === 0 && !projectChatSending) {
      html = '<div class="chat-empty">Hỏi AI bất cứ điều gì về project này...</div>';
    } else {
      html = projectChatHistory.map(msg => {
        const isUser = msg.role === 'user';
        let content = escapeHtml(msg.content);
        content = content.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => `<pre><code>${code.trim()}</code></pre>`);
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\n/g, '<br>');
        return `
          <div class="chat-message ${isUser ? 'user-msg' : 'ai-msg'}">
            <div class="chat-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="chat-bubble">${content}</div>
          </div>`;
      }).join('');

      if (projectChatSending) {
        html += `
          <div class="chat-message ai-msg">
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble"><div class="chat-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>
          </div>`;
      }
    }

    messagesEl.innerHTML = html;
    scrollChatToBottom();

    // Update send button
    const sendBtn = messagesEl.closest('.chat-container')?.querySelector('.btn-chat-send');
    if (sendBtn) sendBtn.disabled = projectChatSending;
  }

  function scrollChatToBottom() {
    const el = document.getElementById('project-chat-messages');
    if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
  }

  async function submitProject() {
    // Save current editor content first
    saveCurrentFileCode();

    const hasCode = projectFiles.some(f => f.code.trim());
    if (!hasCode || !projectIdea) return;

    const btn = document.getElementById('btn-submit-project');
    const codeFileCount = projectFiles.filter(f => f.code.trim()).length;

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="loading-spinner-inline"></span> Đang chấm file 1/${codeFileCount}...`;
    }

    try {
      // Progress callback updates button text in real-time
      const onProgress = (current, total, stepMsg) => {
        if (btn) {
          if (stepMsg.startsWith('🔍') || stepMsg.startsWith('📊') || stepMsg.startsWith('🤖')) {
            btn.innerHTML = `<span class="loading-spinner-inline"></span> ${stepMsg}`;
          } else {
            btn.innerHTML = `<span class="loading-spinner-inline"></span> Đang chấm ${current}/${total}: ${stepMsg}`;
          }
        }
      };

      projectReview = await AIService.reviewProject(projectIdea, projectFiles, onProgress);
      
      // Save submission to Supabase
      if (isAuthenticated && projectReview) {
        const review = projectReview;
        const submission = {
          project_name: projectIdea.name || 'Unnamed',
          project_description: projectIdea.description || '',
          difficulty_level: projectSelectedLevel || projectTopicLevel || 'mid',
          topic: projectTopic || currentTech || '',
          files: projectFiles.map(f => ({ name: f.name, lang: f.lang, code: f.code })),
          review: review,
          score_overall: review.summary?.overallScore || null,
          score_code_quality: review.summary?.codeQuality || null,
          score_functionality: review.summary?.functionality || null,
          score_best_practices: review.summary?.bestPractices || null,
          score_creativity: review.summary?.creativity || null,
          ai_feedback: review.summary?.overallFeedback || '',
          ai_strengths: review.summary?.strengths || [],
          ai_improvements: review.summary?.improvements || [],
          languages_used: [...new Set(projectFiles.map(f => f.lang).filter(Boolean))]
        };
        AuthService.saveProjectSubmission(submission).catch(e => console.warn('[Project] Save error:', e));
      }
      render();
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="btn-ai-icon">🤖</span> AI Chấm Project (${projectFiles.length} file)`;
      }
      alert('Lỗi chấm project: ' + err.message);
    }
  }

  function saveCurrentFileCode() {
    const editor = document.getElementById('project-code-editor');
    if (editor && projectFiles[projectActiveFileIdx]) {
      projectFiles[projectActiveFileIdx].code = editor.value;
    }
  }

  function switchProjectFile(idx) {
    if (idx < 0 || idx >= projectFiles.length) return;
    saveCurrentFileCode();
    projectActiveFileIdx = idx;
    // Update UI without full re-render
    const editor = document.getElementById('project-code-editor');
    const nameInput = document.getElementById('file-name-input');
    const langSelect = document.getElementById('project-lang');
    const activeFile = projectFiles[idx];
    if (editor) { editor.value = activeFile.code; editor.placeholder = `Paste code file ${activeFile.name} ở đây...`; }
    if (nameInput) nameInput.value = activeFile.name;
    if (langSelect) langSelect.value = activeFile.lang;
    // Update tab styles
    document.querySelectorAll('.file-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
    });
    attachEditorToProjectCode();
  }

  function addProjectFile() {
    saveCurrentFileCode();
    const count = projectFiles.length + 1;
    const ext = { javascript: 'js', python: 'py', java: 'java', cpp: 'cpp', csharp: 'cs', go: 'go', rust: 'rs', php: 'php', html: 'html', css: 'css', typescript: 'ts', json: 'json' };
    const defaultLang = projectFiles[projectActiveFileIdx]?.lang || 'javascript';
    projectFiles.push({ name: `file${count}.${ext[defaultLang] || 'js'}`, lang: defaultLang, code: '' });
    projectActiveFileIdx = projectFiles.length - 1;
    render();
  }

  function removeProjectFile(idx) {
    if (projectFiles.length <= 1) return;
    saveCurrentFileCode();
    projectFiles.splice(idx, 1);
    if (projectActiveFileIdx >= projectFiles.length) projectActiveFileIdx = projectFiles.length - 1;
    render();
  }

  function renameProjectFile(newName) {
    if (!newName.trim()) return;
    projectFiles[projectActiveFileIdx].name = newName.trim();
    // Auto-detect language from extension
    const extMap = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp', cs: 'csharp', go: 'go', rs: 'rust', php: 'php', html: 'html', css: 'css', json: 'json' };
    const ext = newName.split('.').pop().toLowerCase();
    if (extMap[ext]) {
      projectFiles[projectActiveFileIdx].lang = extMap[ext];
      const langSelect = document.getElementById('project-lang');
      if (langSelect) langSelect.value = extMap[ext];
    }
    // Update tab name
    const tabs = document.querySelectorAll('.file-tab-name');
    if (tabs[projectActiveFileIdx]) tabs[projectActiveFileIdx].textContent = newName.trim();
  }

  function setProjectFileLang(lang) {
    projectFiles[projectActiveFileIdx].lang = lang;
    // Update tab icon
    const tabs = document.querySelectorAll('.file-tab-icon');
    if (tabs[projectActiveFileIdx]) tabs[projectActiveFileIdx].textContent = getFileIcon(lang);
  }

  function clearAllProjectFiles() {
    projectFiles = [{ name: 'main.js', lang: 'javascript', code: '' }];
    projectActiveFileIdx = 0;
    projectReview = null;
    render();
  }

  function attachEditorToProjectCode() {
    setTimeout(() => {
      const editor = document.getElementById('project-code-editor');
      if (editor) enhanceCodeEditor(editor);
    }, 50);
  }

  // ─── Public API ───
  // ═══════════════════════════════════════
  // AUTH SCREEN
  // ═══════════════════════════════════════
  function renderAuthScreen(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-logo">🚀</div>
          <h1 class="auth-title">DevMaster Hub</h1>
          <p class="auth-subtitle">Nền tảng học lập trình từ Newbie đến Master</p>
          <div class="auth-tabs">
            <button class="auth-tab active" onclick="App.switchAuthTab('login')" id="tab-login">Đăng nhập</button>
            <button class="auth-tab" onclick="App.switchAuthTab('register')" id="tab-register">Đăng ký</button>
          </div>
          <form class="auth-form" id="auth-form" onsubmit="return App.handleAuth(event)">
            <div class="auth-field">
              <label>Tên đăng nhập</label>
              <input type="text" id="auth-username" placeholder="vd: devmaster2025" required autocomplete="username" />
            </div>
            <div class="auth-field">
              <label>Mật khẩu</label>
              <input type="password" id="auth-password" placeholder="Ít nhất 6 ký tự" required autocomplete="current-password" />
            </div>
            <div class="auth-field auth-confirm-field" id="confirm-field" style="display:none">
              <label>Nhập lại mật khẩu</label>
              <input type="password" id="auth-password2" placeholder="Nhập lại mật khẩu" autocomplete="new-password" />
            </div>
            <div class="auth-error" id="auth-error"></div>
            <button type="submit" class="auth-submit-btn" id="auth-submit-btn">Đăng nhập</button>
          </form>
        </div>
      </div>`;
  }

  let authMode = 'login';
  function switchAuthTab(mode) {
    authMode = mode;
    document.getElementById('tab-login')?.classList.toggle('active', mode === 'login');
    document.getElementById('tab-register')?.classList.toggle('active', mode === 'register');
    document.getElementById('confirm-field').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('auth-submit-btn').textContent = mode === 'login' ? 'Đăng nhập' : 'Đăng ký';
    document.getElementById('auth-error').textContent = '';
  }

  async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('auth-username')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    const password2 = document.getElementById('auth-password2')?.value;
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-submit-btn');
    
    if (!username || !password) { errorEl.textContent = 'Vui lòng điền đầy đủ thông tin'; return false; }

    if (authMode === 'register') {
      if (password !== password2) { errorEl.textContent = 'Mật khẩu không khớp'; return false; }
    }

    btn.disabled = true;
    btn.textContent = authMode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...';
    errorEl.textContent = '';

    try {
      if (authMode === 'register') {
        await AuthService.register(username, password);
      } else {
        await AuthService.login(username, password);
      }
    } catch (err) {
      errorEl.textContent = err.message;
      btn.disabled = false;
      btn.textContent = authMode === 'login' ? 'Đăng nhập' : 'Đăng ký';
    }
    return false;
  }

  async function logout() {
    if (confirm('Bạn muốn đăng xuất?')) {
      await AuthService.logout();
    }
  }

  // ═══════════════════════════════════════
  // CAREER ADVISOR VIEW
  // ═══════════════════════════════════════
  function renderCareerAdvisor(container) {
    const searchKeyword = careerLastSearchKeyword;
    const vnKeyword = encodeURIComponent(careerLastSearchKeyword);
    const chatHtml = careerChatHistory.map(msg => {
      const cls = msg.role === 'user' ? 'career-msg-user' : 'career-msg-ai';
      const icon = msg.role === 'user' ? '👤' : '💼';
      const content = msg.role === 'assistant' ? formatMarkdown(msg.content) : escapeHtml(msg.content);
      return `<div class="career-msg ${cls}"><span class="career-msg-icon">${icon}</span><div class="career-msg-content">${content}</div></div>`;
    }).join('');

    // Build job results (JSearch API — VN + Remote combined)
    const jobsHtml = careerJobResults.length > 0 ? `
      <div class="career-jobs-section">
        <h3>🔍 Việc làm — "${escapeHtml(searchKeyword)}"</h3>
        <div class="career-jobs-grid">
          ${careerJobResults.map(job => {
            const isRemote = job.is_remote;
            const locationFlag = (job.location || '').toLowerCase().includes('vietnam') || (job.location || '').toLowerCase().includes('vn') ? '🇻🇳' : (isRemote ? '🌍' : '📍');
            const typeLabel = job.employment_type === 'FULLTIME' ? 'Full-time' : 
                              job.employment_type === 'PARTTIME' ? 'Part-time' :
                              job.employment_type === 'CONTRACTOR' ? 'Contract' :
                              job.employment_type === 'INTERN' ? 'Intern' : (job.employment_type || '');
            return `
            <a href="${job.url}" target="_blank" class="career-job-card">
              <div class="career-job-header">
                ${job.company_logo ? `<img src="${job.company_logo}" alt="" class="career-job-logo" onerror="this.style.display='none'"/>` : '<div class="career-job-logo-placeholder">🏢</div>'}
                <div>
                  <div class="career-job-company">${escapeHtml(job.company_name)}</div>
                  <div class="career-job-source">${escapeHtml(job.source || 'JSearch')}</div>
                </div>
              </div>
              <div class="career-job-title">${escapeHtml(job.title)}</div>
              <div class="career-job-meta">
                <span>${locationFlag} ${escapeHtml(job.location || 'Remote')}</span>
                ${typeLabel ? `<span>⏰ ${typeLabel}</span>` : ''}
                ${job.salary ? `<span>💰 ${escapeHtml(job.salary)}</span>` : ''}
              </div>
              <div class="career-job-tags">${(job.tags || []).filter(t => t).slice(0, 3).map(t => `<span class="career-job-tag">${escapeHtml(t)}</span>`).join('')}</div>
            </a>`;
          }).join('')}
        </div>
        <div class="career-vn-extra">
          <p>🔎 Tìm thêm trên:</p>
          <div class="career-vn-grid">
            <a href="https://topdev.vn/viec-lam-it/${vnKeyword}" target="_blank" class="career-vn-link"><span class="career-vn-icon">🟢</span><div><div class="career-vn-name">TopDev</div></div></a>
            <a href="https://itviec.com/it-jobs/${vnKeyword}" target="_blank" class="career-vn-link"><span class="career-vn-icon">🔴</span><div><div class="career-vn-name">ITviec</div></div></a>
            <a href="https://vietnamworks.com/tim-viec-lam/${vnKeyword}" target="_blank" class="career-vn-link"><span class="career-vn-icon">🔵</span><div><div class="career-vn-name">VietnamWorks</div></div></a>
            <a href="https://www.linkedin.com/jobs/search/?keywords=${vnKeyword}&location=Vietnam" target="_blank" class="career-vn-link"><span class="career-vn-icon">💼</span><div><div class="career-vn-name">LinkedIn VN</div></div></a>
          </div>
        </div>
      </div>
    ` : (searchKeyword ? `
      <div class="career-jobs-section">
        <h3>🔍 Không tìm thấy kết quả cho "${escapeHtml(searchKeyword)}"</h3>
        <div class="career-vn-extra">
          <p>🔎 Thử tìm trên:</p>
          <div class="career-vn-grid">
            <a href="https://topdev.vn/viec-lam-it/${vnKeyword}" target="_blank" class="career-vn-link"><span class="career-vn-icon">🟢</span><div><div class="career-vn-name">TopDev</div></div></a>
            <a href="https://itviec.com/it-jobs/${vnKeyword}" target="_blank" class="career-vn-link"><span class="career-vn-icon">🔴</span><div><div class="career-vn-name">ITviec</div></div></a>
            <a href="https://vietnamworks.com/tim-viec-lam/${vnKeyword}" target="_blank" class="career-vn-link"><span class="career-vn-icon">🔵</span><div><div class="career-vn-name">VietnamWorks</div></div></a>
            <a href="https://www.linkedin.com/jobs/search/?keywords=${vnKeyword}&location=Vietnam" target="_blank" class="career-vn-link"><span class="career-vn-icon">💼</span><div><div class="career-vn-name">LinkedIn VN</div></div></a>
          </div>
        </div>
      </div>
    ` : '');

    container.innerHTML = `
      <div class="career-container">
        <div class="view-breadcrumb">Dashboard › 💼 Tư vấn Việc làm</div>
        <div class="career-header">
          <h1 class="view-title">💼 AI Career Advisor</h1>
          <p class="view-subtitle">AI phân tích trình độ của bạn và tư vấn nghề nghiệp phù hợp</p>
          <div class="career-actions">
            <button class="btn-career-search" onclick="App.searchCareerJobs()">🔍 Tìm việc làm</button>
            <button class="btn-career-clear" onclick="App.clearCareerChat()">🗑️ Xóa chat</button>
          </div>
        </div>
        <div class="career-chat" id="career-chat">
          ${chatHtml || '<div class="career-empty"><p>💬 Chào bạn! Tui là AI Career Advisor. Hãy kể cho tui nghe về mong muốn nghề nghiệp của bạn nhé!</p></div>'}
          ${careerChatSending ? '<div class="career-msg career-msg-ai"><span class="career-msg-icon">💼</span><div class="career-msg-content career-typing">Đang suy nghĩ<span class="typing-dots">...</span></div></div>' : ''}
          ${jobsHtml}
        </div>
        <div class="career-input-area">
          <textarea id="career-input" placeholder="Gõ câu hỏi hoặc kể về mong muốn nghề nghiệp..." rows="2" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();App.sendCareerMessage();}"></textarea>
          <button class="btn-career-send" onclick="App.sendCareerMessage()" ${careerChatSending ? 'disabled' : ''}>Gửi ➤</button>
        </div>
      </div>`;

    // Auto-scroll chat
    const chatEl = document.getElementById('career-chat');
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;

    // Load saved chat on first render
    if (careerChatHistory.length === 0 && isAuthenticated) {
      CareerAdvisor.loadChat().then(msgs => {
        if (currentView !== 'career') return;
        if (msgs.length > 0) {
          careerChatHistory = msgs;
          renderCareerAdvisor(container);
        }
      });
    }
  }

  async function sendCareerMessage() {
    const input = document.getElementById('career-input');
    const msg = input?.value?.trim();
    if (!msg || careerChatSending) return;
    input.value = '';
    careerChatSending = true;
    careerChatHistory.push({ role: 'user', content: msg });
    render();

    try {
      const result = await CareerAdvisor.sendMessage(msg);
      // result can be { text, jobs, searchKeyword } or a plain string (backwards compat)
      const replyText = typeof result === 'object' ? result.text : result;
      const autoJobs = typeof result === 'object' ? result.jobs : null;
      const keyword = typeof result === 'object' ? result.searchKeyword : '';
      careerChatHistory.push({ role: 'assistant', content: replyText });
      // Auto-populate job cards if AI triggered a search
      if (autoJobs && autoJobs.length > 0) {
        careerJobResults = autoJobs;
      }
      // Track search keyword for VN job board links (show even if no remote results)
      if (keyword) {
        careerLastSearchKeyword = keyword;
        if (!autoJobs || autoJobs.length === 0) {
          careerJobResults = []; // Reset but keep keyword for VN links
        }
      }
      // Save chat history (app.js is the single source of truth)
      try { await AuthService.saveCareerChat(careerChatHistory); } catch (e) {}
    } catch (err) {
      careerChatHistory.push({ role: 'assistant', content: '❌ Lỗi: ' + err.message });
    }
    careerChatSending = false;
    render();
  }

  async function searchCareerJobs() {
    const query = prompt('Tìm việc gì? (vd: React developer, Python backend)');
    if (!query) return;
    try {
      const jobs = await CareerAdvisor.searchJobs(query);
      careerJobResults = jobs;
      careerLastSearchKeyword = query;
      render();
    } catch (err) {
      alert('Lỗi tìm kiếm: ' + err.message);
    }
  }

  async function clearCareerChat() {
    if (!confirm('Xóa toàn bộ lịch sử chat tư vấn?')) return;
    careerChatHistory = [];
    careerJobResults = [];
    careerLastSearchKeyword = '';
    await CareerAdvisor.clearChat();
    render();
  }

  // ═══════════════════════════════════════
  // MY PROJECTS VIEW
  // ═══════════════════════════════════════
  function renderMyProjects(container) {
    if (selectedProjectView) {
      renderProjectDetail(container, selectedProjectView);
      return;
    }

    const listHtml = myProjectsList.length > 0 ? myProjectsList.map(p => `
      <div class="myproject-card" onclick="App.viewProject(${p.id})">
        <div class="myproject-score">${p.score_overall || '?'}<span>/100</span></div>
        <div class="myproject-info">
          <h3>${escapeHtml(p.project_name)}</h3>
          <p>${escapeHtml(p.project_description || '')}</p>
          <div class="myproject-meta">
            <span>📅 ${new Date(p.submitted_at).toLocaleDateString('vi')}</span>
            <span>🎯 ${p.difficulty_level || 'N/A'}</span>
            <span>💻 ${(p.languages_used || []).join(', ') || 'N/A'}</span>
          </div>
        </div>
      </div>`).join('') : '<div class="career-empty"><p>📁 Chưa có project nào được nộp. Hãy vào Project Lab để bắt đầu!</p></div>';

    container.innerHTML = `
      <div class="myprojects-container">
        <div class="view-breadcrumb">Dashboard › 📁 My Projects</div>
        <h1 class="view-title">📁 My Projects</h1>
        <p class="view-subtitle">Xem lại tất cả project đã nộp và kết quả AI review</p>
        <div class="myprojects-list">${listHtml}</div>
      </div>`;

    // Load projects if empty
    if (myProjectsList.length === 0 && isAuthenticated) {
      AuthService.getProjectSubmissions().then(projects => {
        if (currentView !== 'my-projects') return;
        myProjectsList = projects;
        renderMyProjects(container);
      });
    }
  }

  function renderProjectDetail(container, project) {
    const filesHtml = (project.files || []).map((f, i) => `
      <div class="myproject-file">
        <div class="myproject-file-header">${escapeHtml(f.name)} <span class="myproject-file-lang">${f.lang || 'text'}</span></div>
        <pre class="code-block"><code class="language-${f.lang || 'javascript'}">${escapeHtml(f.code || '')}</code></pre>
      </div>`).join('');

    container.innerHTML = `
      <div class="myprojects-container">
        <div class="view-breadcrumb">
          <a onclick="App.goToMyProjects()" style="cursor:pointer;color:var(--accent)">My Projects</a> › ${escapeHtml(project.project_name)}
        </div>
        <button class="btn-back" onclick="App.goToMyProjects()">← Quay lại</button>
        <h1 class="view-title">${escapeHtml(project.project_name)}</h1>
        <p class="view-subtitle">${escapeHtml(project.project_description || '')}</p>
        <div class="myproject-scores">
          <div class="myproject-score-item"><span class="score-label">Overall</span><span class="score-value">${project.score_overall || '?'}</span></div>
          <div class="myproject-score-item"><span class="score-label">Code Quality</span><span class="score-value">${project.score_code_quality || '?'}</span></div>
          <div class="myproject-score-item"><span class="score-label">Functionality</span><span class="score-value">${project.score_functionality || '?'}</span></div>
          <div class="myproject-score-item"><span class="score-label">Best Practices</span><span class="score-value">${project.score_best_practices || '?'}</span></div>
          <div class="myproject-score-item"><span class="score-label">Creativity</span><span class="score-value">${project.score_creativity || '?'}</span></div>
        </div>
        ${project.ai_feedback ? `<div class="myproject-feedback"><h3>💬 AI Feedback</h3><p>${formatMarkdown(project.ai_feedback)}</p></div>` : ''}
        ${(project.ai_strengths || []).length > 0 ? `<div class="myproject-strengths"><h3>💪 Điểm mạnh</h3><ul>${project.ai_strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>` : ''}
        ${(project.ai_improvements || []).length > 0 ? `<div class="myproject-improve"><h3>📈 Cần cải thiện</h3><ul>${project.ai_improvements.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>` : ''}
        <div class="myproject-files"><h3>📄 Code Files</h3>${filesHtml}</div>
      </div>`;
    if (typeof Prism !== 'undefined') Prism.highlightAll();
  }

  function viewProject(id) {
    selectedProjectView = myProjectsList.find(p => p.id === id) || null;
    render();
  }

  // ─── Helpers ───
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  return {
    init,
    goToDashboard: () => navigateTo('dashboard'),
    goToProject: () => { resetProjectState(); projectSelectedLevel = null; projectTopic = ''; navigateTo('project'); },
    goToProjectLevel: () => { resetProjectState(); projectSelectedLevel = null; navigateTo('project-level'); },
    goToProjectTopic: () => { resetProjectState(); navigateTo('project-topic'); },
    goToCareer: () => navigateTo('career'),
    goToMyProjects: () => { selectedProjectView = null; navigateTo('my-projects'); },
    openRoadmap: (techId) => navigateTo('roadmap', { tech: techId }),
    openLesson: (techId, levelId, lessonId) => navigateTo('lesson', { tech: techId, level: levelId, lesson: lessonId }),
    goBack: () => {
      if (currentView === 'lesson') navigateTo('roadmap', { tech: currentTech });
      else if (currentView === 'project-level' || currentView === 'project-topic') navigateTo('project');
      else navigateTo('dashboard');
    },
    markComplete: (techId, levelId, lessonId) => {
      const done = toggleLessonComplete(techId, levelId, lessonId);
      const btn = document.getElementById('btn-complete');
      if (btn) { btn.className = `btn-complete ${done ? 'completed' : ''}`; btn.innerHTML = done ? '✅ Hoàn thành' : '⬜ Đánh dấu hoàn thành'; }
      renderSidebar();
    },
    switchTab,
    copyCode,
    generateQuiz,
    selectAnswer,
    submitQuiz,
    generateExercise,
    checkAnswer,
    switchExercise,
    clearAnswer,
    toggleHints,
    toggleSolution,
    // Lesson Chat
    sendLessonChat,
    clearLessonChat,
    toggleLessonChat,
    // Auth
    switchAuthTab,
    handleAuth,
    logout,
    // Career Advisor
    sendCareerMessage,
    searchCareerJobs,
    clearCareerChat,
    // My Projects
    viewProject,
    // Project Lab
    selectProjectLevel,
    generateProjectByLevel,
    generateProjectByTopic,
    setTopic,
    setTopicLevel,
    sendProjectChat,
    submitProject,
    switchProjectFile,
    addProjectFile,
    removeProjectFile,
    renameProjectFile,
    setProjectFileLang,
    clearAllProjectFiles,
    // Saved Ideas
    saveCurrentIdea,
    goToSavedIdeas: () => navigateTo('saved-ideas'),
    loadSavedIdea: loadSavedIdeaToWork,
    deleteSavedIdea
  };
})();

window.App = App;
document.addEventListener('DOMContentLoaded', App.init);
