const App = (() => {

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

  const quizCache = {};
  const exerciseCache = {};
  const lessonChatCache = {};

  let projectSelectedLevel = null;
  let projectIdea = null;
  let projectChatHistory = [];
  let projectChatSending = false;
  let projectFiles = [{ name: 'main.js', lang: 'javascript', code: '' }];
  let projectActiveFileIdx = 0;
  let projectReview = null;
  let projectTopic = '';
  let projectTopicLevel = null;
  let savedIdeas = [];

  let careerChatHistory = [];
  let careerChatSending = false;
  let careerJobResults = [];
  let careerLastSearchKeyword = '';
  let careerDraftInput = '';
  let careerJobsCollapsed = true;

  let myProjectsList = [];
  let selectedProjectView = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function init() {
    bindEvents();
    setupMobileSidebar();

    if (typeof AIService !== 'undefined') {
      AIService.checkHealth().then(h => {
        aiEnabled = h.aiEnabled;
      }).catch(() => {});
    }

    const initialRoute = parseCurrentUrl();
    currentView = initialRoute.view;
    if (initialRoute.tech) currentTech = initialRoute.tech;
    if (initialRoute.level) currentLevel = initialRoute.level;
    if (initialRoute.lesson) currentLesson = initialRoute.lesson;

    try {
      const cachedProgress = localStorage.getItem('devmaster_hub_progress_cache');
      if (cachedProgress) progress = JSON.parse(cachedProgress);
      const cachedProfile = localStorage.getItem('devmaster_hub_profile_cache');
      if (cachedProfile) {
        currentUserProfile = JSON.parse(cachedProfile);
        isAuthenticated = true;
      }
      const cachedIdeas = localStorage.getItem('devmaster_hub_ideas_cache');
      if (cachedIdeas) savedIdeas = JSON.parse(cachedIdeas);
    } catch(e) {}

    let initialAuthResolved = false;

    if (typeof AuthService !== 'undefined' && AuthService.init()) {
      AuthService.onAuthChange(async (event, user) => {
        if (user) {
          isAuthenticated = true;

          try {
            currentUserProfile = await AuthService.getProfile();
            localStorage.setItem('devmaster_hub_profile_cache', JSON.stringify(currentUserProfile));
            progress = await AuthService.loadProgress();
            localStorage.setItem('devmaster_hub_progress_cache', JSON.stringify(progress));
            const ideas = await AuthService.loadSavedIdeas();
            if (ideas && ideas.length > 0) {
              savedIdeas = ideas;
              localStorage.setItem('devmaster_hub_ideas_cache', JSON.stringify(savedIdeas));
            }
          } catch(e) {
            console.warn('[Auth Sync]', e);
          }

          renderSidebar();

          if (!initialAuthResolved) {
            initialAuthResolved = true;
            if (currentView === 'auth') {
              const target = (initialRoute.view && initialRoute.view !== 'auth') ? initialRoute : { view: 'dashboard' };
              navigateTo(target.view, target);
            } else {
              restoreState(initialRoute);
            }
          } else {

            updateStats();
          }
        } else {
          isAuthenticated = false;
          currentUserProfile = null;
          progress = {};
          savedIdeas = [];
          try {
            localStorage.removeItem('devmaster_hub_profile_cache');
            localStorage.removeItem('devmaster_hub_progress_cache');
            localStorage.removeItem('devmaster_hub_ideas_cache');
          } catch(e) {}

          if (!initialAuthResolved || currentView !== 'auth') {
            initialAuthResolved = true;
            navigateTo('auth');
          }
        }
      });

      AuthService.getSession().then(session => {
        if (!session && !initialAuthResolved) {
          initialAuthResolved = true;
          isAuthenticated = false;
          navigateTo('auth');
        }
      });
    } else {
      navigateTo('auth');
    }

    window.addEventListener('popstate', (e) => {
      if (e.state) restoreState(e.state);
      else restoreState(parseCurrentUrl());
    });
  }

  function setupMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const mainContent = document.querySelector('.main-content');

    if (!menuBtn || !sidebar) return;

    function openMobileSidebar() {
      sidebar.classList.add('open');
      if (overlay && window.innerWidth <= 768) overlay.classList.add('active');
      menuBtn.textContent = '✕';
    }

    function closeMobileSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      menuBtn.textContent = '☰';
    }

    menuBtn.addEventListener('click', () => {
      if (window.innerWidth > 768) {

        sidebar.classList.toggle('collapsed');
        if (overlay) overlay.classList.remove('active');
        if (sidebar.classList.contains('collapsed')) {
          menuBtn.style.display = 'flex';
          if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.paddingTop = '64px';
          }
        } else {
          if (window.innerWidth > 1024) menuBtn.style.display = '';
          if (mainContent) {
            mainContent.style.marginLeft = '';
            mainContent.style.paddingTop = '';
          }
        }
      } else {

        if (sidebar.classList.contains('open')) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMobileSidebar);
    }

    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-item') && window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  }

  function loadProgress() {

  }

  function saveProgress() {
    try {
      localStorage.setItem('devmaster_hub_progress_cache', JSON.stringify(progress));
    } catch(e) {}
    if (isAuthenticated && AuthService.isConfigured()) {
      AuthService.saveProgress(progress).catch(e => console.warn('[Progress] Save error:', e));
    }
  }

  function loadSavedIdeas() {

  }

  function persistSavedIdeas() {

  }

  function saveCurrentIdea() {
    if (!projectIdea) return;

    const exists = savedIdeas.some(s => s.idea.name === projectIdea.name && s.idea.description === projectIdea.description);
    if (exists) {
      alert(I18n.t('ideaAlreadySaved'));
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

    const btn = document.querySelector('.btn-save-idea');
    if (btn) {
      btn.innerHTML = '<span class="btn-ai-icon">✅</span> ' + I18n.t('ideaSavedShort');
      btn.classList.add('saved');
      setTimeout(() => {
        btn.innerHTML = '<span class="btn-ai-icon">💾</span> ' + (typeof I18n !== 'undefined' ? I18n.t('saveIdeaBtn') : 'Lưu Idea');
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

  function parseCurrentUrl() {
    let path = window.location.pathname || '/';
    const hash = window.location.hash || '';

    if (hash && hash.startsWith('#')) {
      const cleanHash = hash.replace(/^#\/?/, '');
      if (cleanHash) {
        path = '/' + cleanHash;
        history.replaceState(null, '', path);
      }
    }

    const segments = path.split('/').filter(Boolean);
    const primary = segments[0] || 'dashboard';

    if (primary === 'roadmap') {
      return { view: 'roadmap', tech: segments[1] || null, level: segments[2] || null };
    } else if (primary === 'lesson') {
      return { view: 'lesson', tech: segments[1] || null, level: segments[2] || null, lesson: segments[3] || null };
    } else if (primary === 'challenge') {
      return { view: 'challenge' };
    } else if (primary === 'career') {
      return { view: 'career' };
    } else if (primary === 'project') {
      return { view: 'project' };
    } else if (primary === 'project-level') {
      return { view: 'project-level', level: segments[1] || null };
    } else if (primary === 'project-topic') {
      return { view: 'project-topic', topic: segments[1] || null };
    } else if (primary === 'saved-ideas') {
      return { view: 'saved-ideas' };
    } else if (primary === 'my-projects') {
      return { view: 'my-projects' };
    } else if (primary === 'auth') {
      return { view: 'auth' };
    }
    return { view: 'dashboard' };
  }

  function navigateTo(view, data = {}) {
    currentView = view;
    if (data.tech !== undefined) {
      currentTech = data.tech;
    } else if (view === 'dashboard' || view === 'project' || view === 'career' || view === 'my-projects' || view === 'saved-ideas' || view === 'project-level' || view === 'project-topic') {
      currentTech = null;
    }
    if (data.level !== undefined) currentLevel = data.level;
    if (data.lesson !== undefined) currentLesson = data.lesson;
    if (view === 'lesson') activeTab = 'theory';

    let path = `/${view}`;
    if (view === 'dashboard') {
      path = '/';
    } else if (view === 'roadmap' && data.tech) {
      path = `/roadmap/${data.tech}${data.level ? '/' + data.level : ''}`;
    } else if (view === 'lesson' && data.tech && data.level && data.lesson) {
      path = `/lesson/${data.tech}/${data.level}/${data.lesson}`;
    } else if (view === 'project-level' && data.level) {
      path = `/project-level/${data.level}`;
    } else if (view === 'project-topic' && data.topic) {
      path = `/project-topic/${data.topic}`;
    }

    history.pushState({ view, ...data }, '', path);
    render();
    updateSidebarActive();

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
    if (!state) state = parseCurrentUrl();
    currentView = state.view || 'dashboard';
    currentTech = state.tech || null;
    currentLevel = state.level || null;
    currentLesson = state.lesson || null;
    render();
    updateSidebarActive();
  }

  function render(instant = false) {
    const main = $('#main-content');
    if (!main) return;

    const executeViewRender = () => {
      switch (currentView) {
        case 'auth': renderAuthScreen(main); break;
        case 'dashboard': renderDashboard(main); break;
        case 'roadmap': renderRoadmap(main); break;
        case 'lesson': renderLesson(main); break;
        case 'project': renderProjectHub(main); break;
        case 'project-level': renderProjectByLevel(main); break;
        case 'project-topic': renderProjectByTopic(main); break;
        case 'saved-ideas': renderSavedIdeas(main); break;
        case 'challenge': renderChallenge(main); break;
      case 'career': renderCareerAdvisor(main); break;
        case 'my-projects': renderMyProjects(main); break;
        default: if (isAuthenticated) renderDashboard(main); else renderAuthScreen(main);
      }
      if (typeof Prism !== 'undefined') Prism.highlightAll();
      if (currentView === 'challenge' && typeof CyberTerminal !== 'undefined') {
        setTimeout(() => CyberTerminal.renderStudio('challenge-terminal-mount', { challenges: true }), 50);
      }
      if (currentView === 'lesson' && currentTech === 'cybersecurity' && activeTab === 'exercise' && typeof CyberTerminal !== 'undefined') {
        setTimeout(() => CyberTerminal.renderStudio('lesson-cyber-terminal-mount', { challenges: false }), 50);
      }
      updateDynamicSchemaOrg();
    };

    if (instant) {
      executeViewRender();
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
      return;
    }

    const renderId = Date.now();
    window._lastRenderId = renderId;

    executeViewRender();
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';
  }

  function updateDynamicSchemaOrg() {
    try {
      const baseUrl = 'https://devmaster-hub.onrender.com';
      const schemaTag = document.getElementById('dynamic-schema-ld');
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      const descMeta = document.querySelector('meta[name="description"]');
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');

      let pageTitle = 'DevMaster Hub — Nền Tảng Học Lập Trình Toàn Diện Từ Newbie Đến Senior';
      let pageDesc = 'Nền tảng học lập trình thực chiến với 20+ lộ trình chuyên sâu: Python, JavaScript, React, Node.js, Java, C++, C#, Go, Rust, DevOps, SQL. Tích hợp trình chạy code, trắc nghiệm và Gia sư AI kèm 1-1.';
      let currentUrl = baseUrl + '/';
      let schemaData = null;

      if (currentView === 'lesson' && currentTech && currentLevel && currentLesson) {
        const tech = CURRICULUM[currentTech];
        const level = tech?.levels?.find(l => l.id === currentLevel);
        const lesson = level?.lessons?.find(ls => ls.id === currentLesson);

        if (tech && level && lesson) {
          const tabName = activeTab === 'theory' ? I18n.t('tabTheory') : activeTab === 'code' ? I18n.t('tabCode') : activeTab === 'quiz' ? I18n.t('tabQuiz') : I18n.t('tabExercise');
          pageTitle = `${lesson.title} (${tabName}) — ${tech.name} | DevMaster Hub`;
          pageDesc = lesson.theory ? lesson.theory.replace(/<[^>]*>?/gm, '').substring(0, 155) + '...' : `Học bài ${lesson.title} trong lộ trình ${tech.name} (${level.name}) trên DevMaster Hub.`;
          currentUrl = `${baseUrl}/lesson/${tech.id}/${level.id}/${lesson.id}`;

          const breadcrumbs = [
            { "@type": "ListItem", "position": 1, "name": (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Home' : 'Trang chủ'), "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": tech.name, "item": `${baseUrl}/roadmap/${tech.id}` },
            { "@type": "ListItem", "position": 3, "name": level.name, "item": `${baseUrl}/roadmap/${tech.id}/${level.id}` },
            { "@type": "ListItem", "position": 4, "name": lesson.title, "item": currentUrl }
          ];

          const schemaGraph = [
            {
              "@type": "BreadcrumbList",
              "itemListElement": breadcrumbs
            },
            {
              "@type": "LearningResource",
              "@id": currentUrl,
              "name": lesson.title,
              "description": pageDesc,
              "learningResourceType": activeTab === 'quiz' ? 'Assessment' : activeTab === 'exercise' ? 'Hands-on Exercise' : 'Interactive Lesson',
              "educationalLevel": level.name,
              "inLanguage": "vi",
              "isPartOf": {
                "@type": "Course",
                "name": (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? `${tech.name} Mastery Course` : `Khóa học ${tech.name} Mastery`),
                "url": `${baseUrl}/roadmap/${tech.id}`,
                "image": `${baseUrl}/assets/og-image.svg`,
                "provider": {
                  "@type": "EducationalOrganization",
                  "name": "DevMaster Hub",
                  "url": baseUrl
                },
                "offers": {
                  "@type": "Offer",
                  "category": "Free",
                  "price": "0",
                  "priceCurrency": "VND",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2030-12-31"
                }
              }
            }
          ];

          if (activeTab === 'quiz' && lesson.quiz && lesson.quiz.length) {
            schemaGraph.push({
              "@type": "Quiz",
              "name": (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? `Quiz Challenge: ${lesson.title}` : `Bài kiểm tra trắc nghiệm: ${lesson.title}`),
              "educationalLevel": level.name,
              "learningResourceType": "Quiz",
              "about": tech.name,
              "hasPart": lesson.quiz.map((q, qIdx) => ({
                "@type": "Question",
                "name": q.question,
                "position": qIdx + 1,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": q.options ? q.options[q.answer] : "Đáp án đúng sau khi nộp bài"
                }
              }))
            });
          }

          if (activeTab === 'code' && lesson.code) {
            schemaGraph.push({
              "@type": "SoftwareSourceCode",
              "name": (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? `Code Example: ${lesson.title}` : `Mã nguồn mẫu: ${lesson.title}`),
              "programmingLanguage": lesson.lang || tech.name,
              "codeSampleType": "full snippet",
              "text": lesson.code
            });
          }

          schemaData = {
            "@context": "https://schema.org",
            "@graph": schemaGraph
          };
        }
      } else if (currentView === 'roadmap' && currentTech) {
        const tech = CURRICULUM[currentTech];
        if (tech) {
          pageTitle = (typeof I18n !== 'undefined' && I18n.getLang() === 'en') ? `${tech.name} Mastery Roadmap | DevMaster Hub` : `${tech.name} Mastery Roadmap — Lộ Trình Học Lập Trình | DevMaster Hub`;
          pageDesc = (typeof I18n !== 'undefined' && I18n.getLang() === 'en') ? `Comprehensive ${tech.name} roadmap from basic to advanced: theory, practice, live code editor, and 1-on-1 AI Tutor.` : `Lộ trình học ${tech.name} toàn diện từ cơ bản đến nâng cao: lý thuyết, bài tập thực hành, code editor trực tuyến và AI gia sư kèm 1-1.`;
          currentUrl = `${baseUrl}/roadmap/${tech.id}`;

          schemaData = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Home' : 'Trang chủ'), "item": baseUrl },
                  { "@type": "ListItem", "position": 2, "name": `Lộ trình ${tech.name}`, "item": currentUrl }
                ]
              },
              {
                "@type": "Course",
                "@id": currentUrl,
                "name": (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? `${tech.name} Mastery Course & Roadmap` : `Khóa học & Lộ trình ${tech.name} Mastery`),
                "description": pageDesc,
                "url": currentUrl,
                "image": `${baseUrl}/assets/og-image.svg`,
                "provider": {
                  "@type": "EducationalOrganization",
                  "name": "DevMaster Hub",
                  "url": baseUrl
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "120",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "offers": {
                  "@type": "Offer",
                  "category": "Free",
                  "price": "0",
                  "priceCurrency": "VND",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2030-12-31"
                },
                "educationalLevel": "Beginner to Advanced",
                "inLanguage": "vi",
                "teaches": tech.name,
                "hasCourseInstance": tech.levels?.map((lv, lvIdx) => ({
                  "@type": "CourseInstance",
                  "name": lv.name,
                  "position": lvIdx + 1,
                  "courseMode": "online",
                  "instructor": {
                    "@type": "Organization",
                    "name": "DevMaster Hub Team"
                  },
                  "description": `${lv.lessons?.length || 0} bài học chuyên sâu về ${tech.name}`
                })) || []
              }
            ]
          };
        }
      } else if (currentView === 'career') {
        pageTitle = (typeof I18n !== 'undefined' && I18n.getLang() === 'en') ? 'AI Career Advisor — Tech Career Guidance | DevMaster Hub' : 'AI Career Advisor — Định Hướng & Cố Vấn Sự Nghiệp Lập Trình | DevMaster Hub';
        pageDesc = (typeof I18n !== 'undefined' && I18n.getLang() === 'en') ? 'AI-powered IT career advisor, skills roadmap recommendations, job matching, and tech learning mentor.' : 'Công cụ AI tư vấn định hướng nghề nghiệp IT, đề xuất lộ trình kỹ năng, việc làm và cố vấn học tập công nghệ thông tin.';
        currentUrl = `${baseUrl}/career`;
      } else if (currentView === 'project' || currentView === 'project-level' || currentView === 'project-topic') {
        pageTitle = (typeof I18n !== 'undefined' && I18n.getLang() === 'en') ? 'Project Lab — Practical Coding & Real-World Projects | DevMaster Hub' : 'Project Lab — Không Gian Thực Chiến & Làm Dự Án Thực Tế | DevMaster Hub';
        pageDesc = (typeof I18n !== 'undefined' && I18n.getLang() === 'en') ? 'Practical coding space for real-world projects with an AI Mentor to help review code, debug, and guide software architecture.' : 'Không gian thực hành code dự án thực tế với AI Mentor hỗ trợ review code, debug và hướng dẫn kiến trúc phần mềm.';
        currentUrl = `${baseUrl}/project`;
      }

      document.title = pageTitle;
      if (descMeta) descMeta.setAttribute('content', pageDesc);
      if (ogDescMeta) ogDescMeta.setAttribute('content', pageDesc);
      if (ogTitleMeta) ogTitleMeta.setAttribute('content', pageTitle);
      if (canonicalTag) canonicalTag.setAttribute('href', currentUrl);

      if (schemaTag) {
        schemaTag.textContent = schemaData ? JSON.stringify(schemaData, null, 2) : '';
      }
    } catch (err) {
      console.warn('[Schema.org] Failed to update dynamic schema:', err);
    }
  }

  function renderDashboard(container) {
    const overall = getOverallProgress();
    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const categories = { language: [], frontend: [], backend: [], mobile: [], tool: [] };
    const catNames = {
      language: typeof I18n !== 'undefined' ? I18n.t('catLanguages') : (typeof I18n !== 'undefined' ? I18n.t('catLanguages') : '💻 Ngôn ngữ lập trình'),
      frontend: typeof I18n !== 'undefined' ? I18n.t('catFrontend') : '🎨 Frontend Development',
      backend: typeof I18n !== 'undefined' ? I18n.t('catBackend') : '⚙️ Backend & API',
      mobile: typeof I18n !== 'undefined' ? I18n.t('catMobile') : '📱 Mobile Development',
      tool: typeof I18n !== 'undefined' ? I18n.t('catTools') : '🔧 Tools & DevOps'
    };

    Object.values(CURRICULUM).forEach(tech => {
      let cat = (tech.category || '').toLowerCase();
      if (tech.id === 'dart' || tech.id === 'flutter') cat = 'mobile';
      else if (cat === 'framework') cat = 'frontend';
      else if (cat === 'database') cat = 'backend';
      else if (cat === 'devops' || cat === 'cloud') cat = 'tool';

      if (!categories[cat]) cat = 'language';
      categories[cat].push(tech);
    });

    let html = `
      <div class="dashboard-header">
        <div>
          <h1 class="view-title">${typeof I18n !== 'undefined' ? I18n.t('dashboardTitle') : '🚀 Dashboard'}</h1>
          <p class="view-subtitle">${typeof I18n !== 'undefined' ? I18n.t('dashboardSubtitle') : 'Lộ trình học lập trình từ Newbie đến Master'}</p>
        </div>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" placeholder="${typeof I18n !== 'undefined' ? I18n.t('searchPlaceholder') : 'Tìm kiếm bài học...'}" value="${searchQuery}" autocomplete="off" />
          ${searchQuery ? '<button class="search-clear" id="search-clear">✕</button>' : ''}
        </div>
      </div>

      <div class="overall-stats">
        <div class="stat-card glass-card"><div class="stat-icon">📚</div><div class="stat-info"><div class="stat-number">${Object.keys(CURRICULUM).length}</div><div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('statTech') : 'Công nghệ'}</div></div></div>
        <div class="stat-card glass-card"><div class="stat-icon">📝</div><div class="stat-info"><div class="stat-number">${overall.total}</div><div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('statLessons') : 'Bài học'}</div></div></div>
        <div class="stat-card glass-card"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-number">${overall.completed}</div><div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('statCompleted') : 'Hoàn thành'}</div></div></div>
        <div class="stat-card glass-card"><div class="stat-icon">📊</div><div class="stat-info"><div class="stat-number">${overall.percent}%</div><div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('statProgress') : 'Tiến độ'}</div></div></div>
      </div>

      <div class="progress-bar-overall">
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${overall.percent}%"></div></div>
        <span class="progress-text">${overall.completed}/${overall.total} ${typeof I18n !== 'undefined' ? I18n.t('lessonsUnit') : 'bài học'}</span>
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
      const levelsUnit = typeof I18n !== 'undefined' ? I18n.t('levelsUnit') : 'cấp độ';
      const techDesc = typeof I18n !== 'undefined' ? I18n.getTechDesc(tech.id, tech.description) : (tech.description || '');

      return `
        <div class="tech-card glass-card" onclick="App.openRoadmap('${tech.id}')">
          <div class="tech-card-header" style="background:${tech.gradient || 'linear-gradient(135deg,#667,#445)'}">
            <span class="tech-icon">${tech.icon || '📦'}</span>
            <span class="tech-badge">${levelsCount} ${levelsUnit}</span>
          </div>
          <div class="tech-card-body">
            <h3 class="tech-name">${tech.name}</h3>
            <p class="tech-desc">${escapeHtml(techDesc)}</p>
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

  function renderRoadmap(container) {
    const tech = CURRICULUM[currentTech];
    if (!tech) { navigateTo('dashboard'); return; }
    const p = getTechProgress(tech.id);
    const techDesc = typeof I18n !== 'undefined' ? I18n.getTechDesc(tech.id, tech.description) : (tech.description || '');

    let html = `
      <div class="roadmap-header">
        <button class="btn-back" onclick="App.goBack()">← ${typeof I18n !== 'undefined' ? I18n.t('back') : 'Quay lại'}</button>
        <div class="roadmap-title-row">
          <span class="roadmap-icon" style="background:${tech.gradient}">${tech.icon}</span>
          <div><h1 class="view-title">${tech.name}</h1><p class="view-subtitle">${escapeHtml(techDesc)}</p></div>
        </div>
        <div class="tech-progress-bar">
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${p.percent}%;background:${tech.gradient}"></div></div>
          <span class="progress-text">${p.completed}/${p.total} ${typeof I18n !== 'undefined' ? I18n.t('lessonsUnit') : 'bài học'} · ${p.percent}%</span>
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
              <div><span class="badge badge-${level.badge || level.id}">${level.name}</span><h3 class="timeline-title">${typeof I18n !== 'undefined' ? I18n.translateTitle(level.desc || level.name) : (level.desc || level.name)}</h3></div>
              <span class="timeline-progress">${lp.completed}/${lp.total}</span>
            </div>
            <div class="lesson-list">
              ${level.lessons.map(lesson => {
                const done = isLessonComplete(tech.id, level.id, lesson.id);
                const titleText = typeof I18n !== 'undefined' ? I18n.translateTitle(lesson.title) : lesson.title;
                return `<div class="lesson-item ${done ? 'done' : ''}" onclick="App.openLesson('${tech.id}','${level.id}','${lesson.id}')">
                  <span class="lesson-check">${done ? '✅' : '⬜'}</span>
                  <span class="lesson-title">${titleText}</span>
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

  function renderLesson(container) {
    const tech = CURRICULUM[currentTech];
    if (!tech) { navigateTo('dashboard'); return; }
    const level = tech.levels.find(l => l.id === currentLevel);
    if (!level) { navigateTo('roadmap', { tech: currentTech }); return; }
    const lesson = level.lessons.find(ls => ls.id === currentLesson);
    if (!lesson) { navigateTo('roadmap', { tech: currentTech }); return; }

    const done = isLessonComplete(tech.id, level.id, lesson.id);
    const lessonKey = `${tech.id}.${level.id}.${lesson.id}`;

    const allLessons = [];
    tech.levels.forEach(lv => lv.lessons.forEach(ls => allLessons.push({ level: lv, lesson: ls })));
    const idx = allLessons.findIndex(x => x.level.id === level.id && x.lesson.id === lesson.id);
    const prev = idx > 0 ? allLessons[idx - 1] : null;
    const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

    const tabs = [
      { id: 'theory', icon: '📖', label: typeof I18n !== 'undefined' ? I18n.t('tabTheory') : 'Lý thuyết' },
      { id: 'code', icon: '💻', label: typeof I18n !== 'undefined' ? I18n.t('tabCode') : 'Code' },
      { id: 'quiz', icon: '🎯', label: typeof I18n !== 'undefined' ? I18n.t('tabQuiz') : 'Quiz' },
      { id: 'exercise', icon: '🏋️', label: typeof I18n !== 'undefined' ? I18n.t('tabExercise') : 'Bài tập' }
    ];

    const localizedTitle = typeof I18n !== 'undefined' ? I18n.translateTitle(lesson.title) : lesson.title;

    let html = `
      <div class="lesson-view">
        <div class="breadcrumb">
          <span class="crumb" onclick="App.goToDashboard()">${typeof I18n !== 'undefined' ? I18n.t('dashboard') : 'Dashboard'}</span>
          <span class="crumb-sep">›</span>
          <span class="crumb" onclick="App.openRoadmap('${tech.id}')">${tech.icon} ${tech.name}</span>
          <span class="crumb-sep">›</span>
          <span class="crumb active">${level.name}</span>
        </div>

        <div class="lesson-header" style="border-left:4px solid ${tech.color}">
          <div class="lesson-header-top">
            <span class="badge badge-${level.badge || level.id}">${level.name}</span>
            <button class="btn-complete ${done ? 'completed' : ''}" onclick="App.markComplete('${tech.id}','${level.id}','${lesson.id}')" id="btn-complete">
              ${done ? (typeof I18n !== 'undefined' ? I18n.t('completed') : '✅ Hoàn thành') : (typeof I18n !== 'undefined' ? I18n.t('markComplete') : '⬜ Đánh dấu hoàn thành')}
            </button>
          </div>
          <h1 class="lesson-main-title">${localizedTitle}</h1>
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
              <h2 class="section-title">📖 ${typeof I18n !== 'undefined' ? I18n.t('tabTheory') : 'Lý thuyết'}</h2>
              <div class="theory-content">${lesson.theory || ('<em>' + I18n.t('noContentAvailable') + '</em>')}</div>
            </div>
            ${lesson.keyPoints && lesson.keyPoints.length ? `
              <div class="lesson-section glass-card">
                <h2 class="section-title">🔑 ${typeof I18n !== 'undefined' ? I18n.t('keyPoints') : 'Điểm chính'}</h2>
                <ul class="key-points">${lesson.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
              </div>` : ''}

          </div>

          <!-- CODE TAB -->
          <div class="tab-panel ${activeTab === 'code' ? 'active' : ''}" id="panel-code">
            ${lesson.code ? `
              <div class="lesson-section glass-card">
                <div class="section-header">
                  <h2 class="section-title">💻 ${I18n.t('codeExample')}</h2>
                  <button class="btn-copy" onclick="App.copyCode(this)" data-code="${encodeURIComponent(lesson.code)}">${I18n.t('copyCode')}</button>
                </div>
                <pre class="code-block"><code class="language-${lesson.lang || 'javascript'}">${escapeHtml(lesson.code)}</code></pre>
              </div>` : `<div class="lesson-section glass-card"><p class="empty-hint">${I18n.t('noCodeExample')}</p></div>`}

          </div>

          <!-- QUIZ TAB -->
          <div class="tab-panel ${activeTab === 'quiz' ? 'active' : ''}" id="panel-quiz">
            <div id="quiz-container" data-key="${lessonKey}">
              ${renderQuizContent(lessonKey, tech, level, lesson)}
            </div>

          </div>

          <!-- EXERCISE TAB -->
          <div class="tab-panel ${activeTab === 'exercise' ? 'active' : ''}" id="panel-exercise">
            <div id="exercise-container" data-key="${lessonKey}">
              ${renderExerciseContent(lessonKey, tech, level, lesson)}
            </div>

          </div>
        </div>

        <div class="unified-lesson-chat-container" style="margin-top:20px;margin-bottom:20px">
     ${renderLessonChatBox(lessonKey, activeTab)}
   </div>
   <!-- LESSON NAV -->
        <div class="lesson-nav">
          ${prev ? `<button class="btn-nav btn-prev" onclick="App.openLesson('${tech.id}','${prev.level.id}','${prev.lesson.id}')">← ${typeof I18n !== 'undefined' ? I18n.translateTitle(prev.lesson.title) : prev.lesson.title}</button>` : '<div></div>'}
          ${next ? `<button class="btn-nav btn-next" onclick="App.openLesson('${tech.id}','${next.level.id}','${next.lesson.id}')">${typeof I18n !== 'undefined' ? I18n.translateTitle(next.lesson.title) : next.lesson.title} →</button>` : '<div></div>'}
        </div>
      </div>`;

    container.innerHTML = html;

    if (activeTab === 'exercise') {
      setTimeout(attachEditorToCurrentTextarea, 50);
    }

    if (typeof I18n !== 'undefined' && I18n.getLang() !== 'vi') {
      setTimeout(() => App.triggerDynamicContentTranslation(activeTab), 50);
    }
  }

  /** Dung 3 file khoi tao cho Sandpack tu code mau cua bai hoc */
  function seedFilesFromLesson(lesson, techId) {
    const raw = String(lesson && lesson.code || '').trim();
    if (!raw) return null;

    // Trang HTML hoan chinh thi de nguyen vao index.html
    if (/<html|<!doctype/i.test(raw)) return [{ name: 'index.html', code: raw }];

    // CSS thuan
    if (/^\s*[.#a-zA-Z][^{]*\{[^}]*:/.test(raw) && !/function|=>|const |let |import /.test(raw)) {
      return [{ name: 'style.css', code: raw }];
    }

    // Code cua bai hoc phai vao dung file entry cua cong nghe do,
    // neu khong React se nhan code vao script.js va khong chay.
    const entry = techId === 'react' ? 'App.jsx'
                : techId === 'vue' ? 'App.js'
                : techId === 'typescript' ? 'main.ts'
                : techId === 'dsa' ? 'main.js'
                : 'script.js';
    return [{ name: entry, code: raw }];
  }

  function renderQuizContent(lessonKey, tech, level, lesson) {
    const cache = quizCache[lessonKey];
    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const localizedTitle = typeof I18n !== 'undefined' ? I18n.translateTitle(lesson.title) : lesson.title;

    if (!cache || !cache.questions || !cache.questions.length) {
      return `
        <div class="lesson-section glass-card quiz-intro">
          <div class="quiz-intro-content">
            <span class="quiz-intro-icon">🎯</span>
            <h3>${typeof I18n !== 'undefined' ? I18n.t('tabQuiz') : 'Quiz'} — ${I18n.t('knowledgeCheck')}</h3>
            <p>${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'AI will generate a practical quiz based on the lesson' : 'AI sẽ tạo câu hỏi trắc nghiệm thực chiến dựa trên nội dung bài học') : 'AI will generate interactive quiz questions based on the lesson'} "${localizedTitle}"</p>
            ${aiEnabled ? `
              <button class="btn-ai btn-generate-quiz" onclick="App.generateQuiz('${lessonKey}')">
                <span class="btn-ai-icon">🤖</span> ${I18n.t('generateQuizAi')}
              </button>` : `
              <div class="ai-disabled-notice">
                <p>⚠️ AI chưa được kích hoạt. Thêm <code>CLAUDE_API_KEY</code> vào file <code>.env</code> và restart server.</p>
              </div>`}
          </div>
        </div>`;
    }

    const { questions, answers, submitted, score } = cache;
    let html = '';

    if (submitted) {
      const pct = Math.round((score / questions.length) * 100);
      const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
      html += `
        <div class="quiz-score glass-card ${pct >= 80 ? 'score-high' : pct >= 50 ? 'score-mid' : 'score-low'}">
          <span class="score-emoji">${emoji}</span>
          <div class="score-info">
            <div class="score-number">${score}/${questions.length}</div>
            <div class="score-label">${pct}% — ${I18n.t(pct >= 80 ? 'scoreExcellent' : pct >= 50 ? 'scoreGood' : 'scoreNeedsReview')}</div>
          </div>
          <button class="btn-ai btn-retry" onclick="App.generateQuiz('${lessonKey}')">
            <span class="btn-ai-icon">🔄</span> Quiz mới
          </button>
        </div>`;
    }

    questions.forEach((q, qi) => {
      const userAnswer = answers[qi];
      const isAnswered = userAnswer !== undefined;
      const isCorrect = isAnswered && userAnswer === q.correct;

      let questionHtml = escapeHtml(q.question);

      questionHtml = questionHtml.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="q-code-block"><code>${code.trim()}</code></pre>`;
      });

      questionHtml = questionHtml.replace(/`([^`]+)`/g, '<code class="q-inline-code">$1</code>');

      const renderOption = (opt) => {
        let optHtml = escapeHtml(opt);
        optHtml = optHtml.replace(/`([^`]+)`/g, '<code class="q-inline-code">$1</code>');
        return optHtml;
      };

      html += `
        <div class="quiz-question glass-card ${submitted ? (isCorrect ? 'q-correct' : 'q-wrong') : ''}">
          <div class="q-header">
            <span class="q-number">Câu ${qi + 1}</span>
            ${submitted ? `<span class="q-result ${isCorrect ? 'correct' : 'wrong'}">${I18n.t(isCorrect ? 'answerCorrect' : 'answerWrong')}</span>` : ''}
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

  function runExerciseSandbox(lessonKey) {
    const editor = document.getElementById('answer-editor');
    if (!editor) return;
    const code = editor.value.trim();
    if (!code) {
      alert(I18n.t('writeCodeFirst'));
      return;
    }
    const [techId] = (lessonKey || '').split('.');
    const isWeb = ['htmlcss', 'react', 'vue', 'angular', 'javascript', 'typescript', 'tailwind'].includes(techId);

    const consoleDrawer = document.getElementById('exercise-console-drawer');
    if (consoleDrawer && typeof SandboxRunner !== 'undefined') {
      consoleDrawer.style.display = 'block';
      SandboxRunner.renderConsoleDrawer('exercise-console-drawer');

      if (isWeb && (code.includes('<html') || code.includes('<div') || code.includes('<body') || code.includes('<script'))) {
        const previewContainer = document.getElementById('exercise-preview-container');
        if (previewContainer) {
          previewContainer.style.display = 'block';
          SandboxRunner.runWebCode({ html: code }, previewContainer);
        }
      } else {
        SandboxRunner.runJavaScript(code);
      }
    }
  }

  function renderExerciseContent(lessonKey, tech, level, lesson) {
    const cache = exerciseCache[lessonKey] || {};
    const userAnswer = cache.userAnswer || '';
    const feedback = cache.feedback || null;
    const aiExercises = cache.aiExercises || [];
    const activeExIdx = cache.activeExIdx || 0;
    const showHints = cache.showHints || false;
    const showSolution = cache.showSolution || false;

    if (tech.id === 'cybersecurity') {
      setTimeout(() => {
        if (typeof CyberTerminal !== 'undefined') {
          CyberTerminal.renderStudio('lesson-cyber-terminal-mount', { challenges: false });
        }
      }, 50);

      return `
        <div class="cyber-exercise-wrapper">
          <div class="lesson-section glass-card" style="margin-bottom:14px;border-left:4px solid #f85149">
            <h2 class="section-title" style="color:#f85149;margin-bottom:6px">🖥️ Thực hành trên Terminal</h2>
            <div class="exercise-description">${escapeHtml(lesson.exercise || 'Mở Terminal bên dưới, sử dụng các lệnh Linux và công cụ bảo mật để hoàn thành thử thách và săn cờ FLAG{...}')}</div>
          </div>
          <div id="lesson-cyber-terminal-mount"></div>
        </div>`;
    }

    // Bai hoc frontend: mo trinh soan thao chia doi man hinh ngay trong bai tap.
    // Nap san code mau cua chinh bai hoc de hoc vien sua tiep, khong phai
    // bat dau tu trang giay trang.
    // Angular can buoc build nen khong chay duoc trong sandbox trinh duyet -> khong gan.
    // typescript va dsa dung che do console: ket qua la van ban in ra,
    // khong phai trang web, nen Sandpack se hien console thay vi khung hien thi.
    const TECH_FRONTEND = ['htmlcss', 'react', 'vue', 'tailwind', 'typescript', 'dsa'];
    if (TECH_FRONTEND.includes(tech.id)) {
      const seed = seedFilesFromLesson(lesson, tech.id);
      setTimeout(() => {
        if (typeof SandpackLive !== 'undefined') {
          SandpackLive.renderStudio('lesson-sandpack-mount', seed, tech.id);
        }
      }, 50);

      return `
        <div class="lesson-practice-wrapper">
          <div class="lesson-section glass-card" style="margin-bottom:14px;border-left:4px solid #58a6ff">
            <h2 class="section-title" style="color:#58a6ff;margin-bottom:6px">🎨 Thực hành trực tiếp</h2>
            <div class="exercise-description">${escapeHtml(lesson.exercise || 'Sửa code bên trái, trang web bên phải đổi ngay. Bật nút Thiết kế để bấm chọn và chỉnh trực tiếp trên trang.')}</div>
          </div>
          <div id="lesson-sandpack-mount"></div>
        </div>`;
    }

    let currentExercise;
    if (activeExIdx === 0) {
      currentExercise = {
        title: I18n.t('originalExercise'),
        description: lesson.exercise || I18n.t('noExerciseYet'),
        hints: [],
        solution: null
      };
    } else {
      currentExercise = aiExercises[activeExIdx - 1] || null;
    }

    let html = '';
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
      html += `<div class="lesson-section glass-card"><p>Không có bài tập.</p></div>`;
      return html;
    }

    html += `
      <div class="lesson-section glass-card exercise-section">
        <h2 class="section-title">📋 ${currentExercise.title}</h2>
        <div class="exercise-description">${currentExercise.description}</div>

        ${currentExercise.sampleInput ? `<div class="exercise-io"><strong>Input mẫu:</strong><pre>${escapeHtml(currentExercise.sampleInput)}</pre></div>` : ''}
        ${currentExercise.expectedOutput ? `<div class="exercise-io"><strong>Output mong đợi:</strong><pre>${escapeHtml(currentExercise.expectedOutput)}</pre></div>` : ''}

        ${currentExercise.hints && currentExercise.hints.length ? `
          <button class="btn-hints" onclick="App.toggleHints('${lessonKey}')">
            ${showHints ? I18n.t('hideHints') : I18n.t('showHintsBtn')} (${currentExercise.hints.length})
          </button>
          ${showHints ? `<div class="hints-list">${currentExercise.hints.map((h, i) => `<div class="hint-item">💡 ${h}</div>`).join('')}</div>` : ''}
        ` : ''}
      </div>`;

    html += `
      <div class="lesson-section glass-card">
        <h2 class="section-title">✍️ Đáp án của bạn</h2>
        <textarea class="answer-editor" id="answer-editor" placeholder="${I18n.t('answerPlaceholder')}" spellcheck="false">${escapeHtml(userAnswer)}</textarea>
        <div class="answer-actions">
          ${aiEnabled ? `
            <button class="btn-ai btn-check" onclick="App.checkAnswer('${lessonKey}')" id="btn-check-answer">
              <span class="btn-ai-icon">🤖</span> AI Chấm bài
            </button>` : ''}
          <button class="btn-ai btn-run-sandbox" style="background:#238636;color:#fff" onclick="App.runExerciseSandbox('${lessonKey}')">
            ▶️ Chạy Code / Run
          </button>
          <button class="btn-clear-answer" onclick="App.clearAnswer('${lessonKey}')">🗑️ Xóa</button>
        </div>
        <div id="exercise-preview-container" style="display:none;margin-top:14px;height:240px;border:1px solid #30363d;border-radius:8px;overflow:hidden"></div>
        <div id="exercise-console-drawer" style="display:none"></div>
      </div>`;

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

    if (currentExercise.solution) {
      html += `
        <div class="lesson-section glass-card">
          <button class="btn-hints" onclick="App.toggleSolution('${lessonKey}')">
            ${showSolution ? I18n.t('hideSolution') : I18n.t('showSolutionBtn')}
          </button>
          ${showSolution ? `<pre class="code-block" style="margin-top:12px"><code class="language-${currentExercise.solutionLang || 'javascript'}">${escapeHtml(currentExercise.solution)}</code></pre>` : ''}
        </div>`;
    }

    html += `
      <div class="exercise-ai-actions">
        ${aiEnabled ? `
          <button class="btn-ai btn-generate-exercise" onclick="App.generateExercise('${lessonKey}')">
            <span class="btn-ai-icon">🤖</span> AI tạo bài tập mới
          </button>` : ''}
      </div>`;

    return html;
  }

  async function generateQuiz(lessonKey) {
    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = CURRICULUM[techId];
    const level = tech.levels.find(l => l.id === levelId);
    const lesson = level.lessons.find(ls => ls.id === lessonId);

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

      if (!newEx || typeof newEx !== 'object') throw new Error('AI trả kết quả không hợp lệ');
      newEx.title = newEx.title || (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? `AI Exercise: ${lesson.title}` : `Bài tập AI: ${lesson.title}`);
      newEx.description = newEx.description || newEx.content || newEx.task || newEx.exercise || (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'No description.' : 'Không có mô tả.');
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

    const editor = $('#answer-editor');
    if (editor) exerciseCache[lessonKey].userAnswer = editor.value;

    const userCode = exerciseCache[lessonKey].userAnswer;
    if (!userCode.trim()) return;

    const btn = $('#btn-check-answer');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '<span class="loading-spinner-inline"></span> Grading...' : '<span class="loading-spinner-inline"></span> Đang chấm...');
    }

    try {

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
        btn.innerHTML = (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '<span class="btn-ai-icon">🤖</span> Grade with AI' : '<span class="btn-ai-icon">🤖</span> AI Chấm bài');
      }
      alert((typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Grading error: ' : 'Lỗi chấm bài: ') + err.message);
    }
  }

  function switchExercise(lessonKey, idx) {
    if (!exerciseCache[lessonKey]) return;

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

  function renderLessonChatBox(lessonKey, tabId) {
    const cache = lessonChatCache[lessonKey];
    const messages = cache ? cache.messages : [];
    const sending = cache ? cache.sending : false;
    const chatId = `lesson-chat-${tabId}`;

    const getTabLabel = (id) => {
      if (typeof I18n === 'undefined') return 'Lesson';
      if (id === 'theory') return I18n.t('tabLabelTheory') || 'Lý thuyết';
      if (id === 'code') return I18n.t('tabLabelCode') || 'Code Lab';
      if (id === 'quiz') return I18n.t('tabLabelQuiz') || 'Quiz';
      if (id === 'exercise') return I18n.t('tabLabelExercise') || 'Bài tập';
      return I18n.t('technologies') || 'Bài học';
    };

    const tabLabel = getTabLabel(tabId);
    const tutorHeader = typeof I18n !== 'undefined' ? I18n.t('tutorHeader') : 'Hỏi Gia sư AI về';
    const tutorWelcome = typeof I18n !== 'undefined' ? I18n.t('tutorWelcome') : 'Hỏi AI bất cứ điều gì về phần này!';
    const explainSimply = typeof I18n !== 'undefined' ? I18n.t('explainSimply') : 'Giải thích đơn giản phần này cho mình';
    const explainSimplyBtn = typeof I18n !== 'undefined' ? I18n.t('explainSimplyBtn') : 'Giải thích đơn giản';
    const moreExamples = typeof I18n !== 'undefined' ? I18n.t('moreExamples') : 'Cho mình thêm ví dụ minh họa thực tế';
    const moreExamplesBtn = typeof I18n !== 'undefined' ? I18n.t('moreExamplesBtn') : 'Thêm ví dụ';
    const keyTakeaways = typeof I18n !== 'undefined' ? I18n.t('keyTakeaways') : 'Điểm mấu chốt quan trọng nhất cần nhớ là gì?';
    const keyTakeawaysBtn = typeof I18n !== 'undefined' ? I18n.t('keyTakeawaysBtn') : 'Phần quan trọng nhất?';
    const askAiPlaceholder = typeof I18n !== 'undefined' ? I18n.t('askAiPlaceholder') : 'Hỏi AI về bài học...';
    const clearChatText = typeof I18n !== 'undefined' ? I18n.t('clearLessonChat') : '🗑️ Xóa hội thoại';

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
          <h3>🤖 ${tutorHeader} ${tabLabel}</h3>
          <span class="lchat-toggle" id="${chatId}-toggle">▼</span>
        </div>
        <div class="lchat-body" id="${chatId}-body">
          <div class="lchat-messages" id="${chatId}-messages">
            ${messages.length === 0 ? `
              <div class="lchat-welcome">
                <p>💡 ${tutorWelcome}</p>
                <div class="lchat-suggestions">
                  <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}', '${escapeHtml(explainSimply)}')">${explainSimplyBtn}</button>
                  <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}', '${escapeHtml(moreExamples)}')">${moreExamplesBtn}</button>
                  <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}', '${escapeHtml(keyTakeaways)}')">${keyTakeawaysBtn}</button>
                </div>
              </div>` : messagesHtml}
          </div>
          <div class="lchat-input-row">
            <textarea class="lchat-input" id="${chatId}-input" placeholder="${askAiPlaceholder}" rows="1"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();App.sendLessonChat('${lessonKey}','${tabId}')}"
              ${sending ? 'disabled' : ''}></textarea>
            <button class="lchat-send-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}')" ${sending ? 'disabled' : ''}>
              ${sending ? '<span class="lchat-spinner"></span>' : '➤'}
            </button>
          </div>
          ${messages.length > 0 ? `<button class="lchat-clear-btn" onclick="App.clearLessonChat('${lessonKey}','${tabId}')">${clearChatText}</button>` : ''}
        </div>
      </div>`;
  }

  function formatLessonChatMessage(text) {
    if (!text) return '';
    let html = text;

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="lchat-code"><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code class="lchat-inline-code">$1</code>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

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

    if (!lessonChatCache[lessonKey]) {
      lessonChatCache[lessonKey] = { messages: [], sending: false };
    }
    const cache = lessonChatCache[lessonKey];
    if (cache.sending) return;

    cache.messages.push({ role: 'user', content: userMessage });
    cache.sending = true;

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

    const [techId, levelId, lessonId] = lessonKey.split('.');
    const tech = (typeof CURRICULUM !== 'undefined' && CURRICULUM[techId]) ? CURRICULUM[techId] : (window.DATA?.find(t => t.id === techId) || null);
    const level = tech?.levels?.find(l => l.id === levelId);
    const lesson = level?.lessons?.find(l => l.id === lessonId);
    const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    let lessonContext = `Công nghệ: ${tech?.name || techId}\nCấp độ: ${level?.name || levelId}\nBài học: ${lesson?.title || lessonId}`;

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

      if (lesson?.theory) {
        lessonContext += `\n\n--- Lý thuyết tham khảo (phụ) ---\n${stripHtml(lesson.theory).substring(0, 1000)}`;
      }
    } else if (tabId === 'quiz') {
      const qCache = quizCache[lessonKey];
      const quizSubmitted = qCache?.submitted || false;
      if (qCache?.questions?.length) {
        lessonContext += `\n\n★★★ CÂU HỎI QUIZ MÀ HỌC VIÊN ĐANG LÀM (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★`;
        lessonContext += `\nTrạng thái: ${quizSubmitted ? 'ĐÃ NỘP BÀI' : 'CHƯA NỘP'}`;
        lessonContext += '\n' + qCache.questions.map((q, i) => {
          let qText = `Câu ${i + 1}: ${q.question || q.q}`;
          if (q.options) qText += '\n' + q.options.map((o, j) => `  ${String.fromCharCode(65 + j)}. ${o}`).join('\n');
          if (quizSubmitted) {

            const correctIdx = q.correct ?? q.answer;
            if (correctIdx !== undefined) qText += `\n  → Đáp án đúng: ${String.fromCharCode(65 + correctIdx)}`;
            const studentAnswer = qCache.answers?.[i];
            if (studentAnswer !== undefined) {
              const isCorrect = studentAnswer === correctIdx;
              qText += `\n  → Học viên chọn: ${String.fromCharCode(65 + studentAnswer)} (${I18n.t(isCorrect ? 'answerCorrect' : 'answerWrong')})`;
            }
            if (q.explanation) qText += `\n  → Giải thích: ${q.explanation}`;
          }
          return qText;
        }).join('\n\n');
      }

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

      if (lesson?.theory) {
        lessonContext += `\n\n★★★ NỘI DUNG LÝ THUYẾT (ĐÂY LÀ NỘI DUNG CHÍNH) ★★★\n${stripHtml(lesson.theory).substring(0, 3000)}`;
      }
      if (lesson?.keyPoints?.length) {
        lessonContext += `\n\n=== ĐIỂM CHÍNH ===\n${lesson.keyPoints.map((kp, i) => `${i + 1}. ${stripHtml(kp)}`).join('\n')}`;
      }
    }

    const isQuizSubmitted = tabId === 'quiz' && quizCache[lessonKey]?.submitted;

    try {
      const aiResponse = await AIService.chatAboutLesson(lessonContext, cache.messages.slice(0, -1), userMessage, tabId, isQuizSubmitted);
      cache.messages.push({ role: 'assistant', content: aiResponse });
    } catch (err) {
      cache.messages.push({ role: 'assistant', content: `⚠️ Lỗi: ${err.message}. Thử lại nhé!` });
    }

    cache.sending = false;

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
            <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}',I18n.t('explainSimplyMsg'))">Giải thích đơn giản</button>
            <button class="lchat-suggest-btn" onclick="App.sendLessonChat('${lessonKey}','${tabId}',I18n.t('moreExamplesMsg'))">Thêm ví dụ</button>
          </div>
        </div>`;
    }

    const clearBtn = document.querySelector(`#${chatId} .lchat-clear-btn`);
    if (clearBtn) clearBtn.remove();
  }

  function switchTab(tabId) {
    activeTab = tabId;

    const editor = $('#answer-editor');
    if (editor) {
      const key = $('#exercise-container')?.dataset.key;
      if (key) {
        if (!exerciseCache[key]) exerciseCache[key] = { userAnswer: '', feedback: null, aiExercises: [], activeExIdx: 0 };
        exerciseCache[key].userAnswer = editor.value;
      }
    }

    $$('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));

    $$('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tabId}`));

    if (typeof Prism !== 'undefined') Prism.highlightAll();

    if (tabId === 'exercise') {
      setTimeout(attachEditorToCurrentTextarea, 50);
      if (currentTech === 'cybersecurity' && typeof CyberTerminal !== 'undefined') {
        setTimeout(() => {
          CyberTerminal.renderStudio('lesson-cyber-terminal-mount');
        }, 60);
      }
    }

    updateDynamicSchemaOrg();
  }

  function renderSidebar() {
    const nav = $('#sidebar-nav');
    if (!nav) return;
    if (!isAuthenticated) { nav.innerHTML = ''; return; }

    const displayName = currentUserProfile?.display_name || currentUserProfile?.username || 'User';
    const currentLang = typeof I18n !== 'undefined' ? I18n.getLang() : 'vi';

    let html = `
      <div class="sidebar-user-section">
        <div class="sidebar-user-avatar">${displayName.charAt(0).toUpperCase()}</div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">${displayName}</span>
          <div style="display:flex;gap:6px;align-items:center">
            <select class="sidebar-lang-select" onchange="App.setLanguage(this.value)" title="${typeof I18n !== 'undefined' ? I18n.t('langSwitch') : 'Language'}" style="background:#161b22;border:1px solid #30363d;color:#58a6ff;font-size:11.5px;font-weight:700;padding:3px 6px;border-radius:6px;cursor:pointer;outline:none">
              <option value="vi" ${currentLang==='vi'?'selected':''}>🇻🇳 Tiếng Việt</option>
              <option value="en" ${currentLang==='en'?'selected':''}>🇬🇧 English</option>
              <option value="ja" ${currentLang==='ja'?'selected':''}>🇯🇵 日本語</option>
              <option value="ko" ${currentLang==='ko'?'selected':''}>🇰🇷 한국어</option>
              <option value="zh" ${currentLang==='zh'?'selected':''}>🇨🇳 中文</option>
              <option value="fr" ${currentLang==='fr'?'selected':''}>🇫🇷 Français</option>
              <option value="de" ${currentLang==='de'?'selected':''}>🇩🇪 Deutsch</option>
              <option value="es" ${currentLang==='es'?'selected':''}>🇪🇸 Español</option>
            </select>
            <button class="sidebar-logout-btn" onclick="App.logout()" title="${I18n.t('logout')}">↗</button>
          </div>
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-item" data-view="dashboard" onclick="App.goToDashboard()">
        <span class="sidebar-icon">🏠</span><span class="sidebar-text">${typeof I18n !== 'undefined' ? I18n.t('dashboard') : 'Dashboard'}</span>
      </div>
      <div class="sidebar-item" data-view="project" onclick="App.goToProject()">
        <span class="sidebar-icon">🚀</span><span class="sidebar-text">${typeof I18n !== 'undefined' ? I18n.t('projectLab') : 'Project Lab'}</span>
      </div>
      <div class="sidebar-item" data-view="my-projects" onclick="App.goToMyProjects()">
        <span class="sidebar-icon">📁</span><span class="sidebar-text">${typeof I18n !== 'undefined' ? I18n.t('myProjects') : 'My Projects'}</span>
      </div>
      <div class="sidebar-item" data-view="challenge" onclick="App.goToChallenge()">
        <span class="sidebar-icon">🚩</span><span class="sidebar-text">${typeof I18n !== 'undefined' ? I18n.t('challengeNav') : 'Thử thách'}</span>
      </div>
      <div class="sidebar-item" data-view="career" onclick="App.goToCareer()">
        <span class="sidebar-icon">💼</span><span class="sidebar-text">${typeof I18n !== 'undefined' ? I18n.t('careerAdvisor') : 'Tư vấn Việc làm'}</span>
      </div>
      <div class="sidebar-divider"></div>`;

    const sidebarGroups = [
      {
        id: 'language',
        title: typeof I18n !== 'undefined' ? I18n.t('catLanguages') : '💻 Ngôn ngữ lập trình',
        techs: []
      },
      {
        id: 'frontend',
        title: typeof I18n !== 'undefined' ? I18n.t('catFrontend') : '🎨 Frontend Development',
        techs: []
      },
      {
        id: 'backend',
        title: typeof I18n !== 'undefined' ? I18n.t('catBackend') : '⚙️ Backend & Database',
        techs: []
      },
      {
        id: 'mobile',
        title: typeof I18n !== 'undefined' ? I18n.t('catMobile') : '📱 Mobile Development',
        techs: []
      },
      {
        id: 'tool',
        title: typeof I18n !== 'undefined' ? I18n.t('catTools') : '🔧 Tools, DevOps & DSA',
        techs: []
      }
    ];

    Object.values(CURRICULUM).forEach(tech => {
      let cat = (tech.category || '').toLowerCase();
      if (tech.id === 'dart' || tech.id === 'flutter') cat = 'mobile';
      else if (tech.id === 'dsa') cat = 'tool';
      else if (cat === 'framework') cat = 'frontend';
      else if (cat === 'database') cat = 'backend';
      else if (cat === 'devops' || cat === 'cloud' || cat === 'concept') cat = 'tool';

      const group = sidebarGroups.find(g => g.id === cat) || sidebarGroups[0];
      group.techs.push(tech);
    });

    sidebarGroups.forEach(group => {
      if (!group.techs.length) return;
      html += `<div class="sidebar-section-title" style="margin-top:12px;font-size:11px;font-weight:700;letter-spacing:0.5px;color:#8b949e;padding:4px 12px">${group.title}</div>`;
      group.techs.forEach(tech => {
        const p = getTechProgress(tech.id);
        html += `
          <div class="sidebar-item" data-tech="${tech.id}" onclick="App.openRoadmap('${tech.id}')">
            <span class="sidebar-icon">${tech.icon}</span>
            <span class="sidebar-text">${tech.name}</span>
            ${p.percent > 0 ? `<span class="sidebar-progress" style="color:${tech.color}">${p.percent}%</span>` : ''}
          </div>`;
      });
    });

    html += `
      <div class="sidebar-divider"></div>
      <div class="sidebar-item ai-status">
        <span class="sidebar-icon">${aiEnabled ? '🤖' : '⚠️'}</span>
        <span class="sidebar-text">${aiEnabled ? (typeof I18n !== 'undefined' ? I18n.t('aiOnline') : 'AI: Sẵn sàng') : (typeof I18n !== 'undefined' ? I18n.t('aiOffline') : 'AI: Offline')}</span>
        <span class="sidebar-progress" style="color:${aiEnabled ? '#2ecc71' : '#e74c3c'}">${aiEnabled ? '●' : '●'}</span>
      </div>`;

    nav.innerHTML = html;
  }

  function updateSidebarActive() {
    $$('.sidebar-item').forEach(item => {
      item.classList.remove('active');
      if (currentView === 'dashboard') {
        if (item.dataset.view === 'dashboard') item.classList.add('active');
      } else if (currentView === 'project' || currentView === 'project-level' || currentView === 'project-topic' || currentView === 'saved-ideas') {
        if (item.dataset.view === 'project') item.classList.add('active');
      } else if (currentView === 'career') {
        if (item.dataset.view === 'career') item.classList.add('active');
      } else if (currentView === 'my-projects') {
        if (item.dataset.view === 'my-projects') item.classList.add('active');
      } else if ((currentView === 'roadmap' || currentView === 'lesson') && currentTech) {
        if (item.dataset.tech === currentTech) item.classList.add('active');
      }
    });
  }

  function updateStats() { renderSidebar(); }

  function bindEvents() {
    const toggleBtn = $('#sidebar-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
      const sidebar = $('#sidebar');
      const menuBtn = $('#mobile-menu-toggle');
      const overlay = $('#sidebar-overlay');
      const mainContent = document.querySelector('.main-content');
      if (!sidebar) return;

      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');

      sidebar.classList.toggle('collapsed');

      if (sidebar.classList.contains('collapsed')) {
        if (menuBtn) menuBtn.style.display = 'flex';
        if (mainContent) {
          mainContent.style.marginLeft = '0';
          mainContent.style.paddingTop = '64px';
        }
      } else {
        if (window.innerWidth > 1024 && menuBtn) menuBtn.style.display = '';
        if (mainContent) {
          mainContent.style.marginLeft = '';
          mainContent.style.paddingTop = '';
        }
      }
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

  const PAIRS = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'", '`': '`' };
  const CLOSE_CHARS = new Set([')', '}', ']', '"', "'", '`']);

  function enhanceCodeEditor(textarea) {
    if (!textarea || textarea._enhanced) return;
    textarea._enhanced = true;

    textarea.addEventListener('keydown', (e) => {
      const { selectionStart: start, selectionEnd: end, value } = textarea;
      const selected = value.substring(start, end);

      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {

          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          const line = value.substring(lineStart, end);
          const stripped = line.replace(/^ {1,2}/, '');
          const removed = line.length - stripped.length;
          textarea.value = value.substring(0, lineStart) + stripped + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start - removed;
        } else {

          insertText(textarea, '  ');
        }
        return;
      }

      if (PAIRS[e.key]) {
        e.preventDefault();
        const open = e.key;
        const close = PAIRS[open];
        if (selected.length > 0) {

          textarea.value = value.substring(0, start) + open + selected + close + value.substring(end);
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        } else {

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

      if (CLOSE_CHARS.has(e.key) && value[start] === e.key && start === end) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = value.substring(lineStart, start);
        const indent = currentLine.match(/^(\s*)/)[1];
        const charBefore = value[start - 1];
        const charAfter = value[start];

        if (charBefore === '{' && charAfter === '}') {

          insertText(textarea, '\n' + indent + '  \n' + indent);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + 2;
        } else if (charBefore === '(' && charAfter === ')') {

          insertText(textarea, '\n' + indent + '  \n' + indent);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + 2;
        } else if (charBefore === '{' || charBefore === ':') {

          insertText(textarea, '\n' + indent + '  ');
        } else {

          insertText(textarea, '\n' + indent);
        }
        return;
      }

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

  function insertText(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

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

  function attachEditorToCurrentTextarea() {
    const editor = $('#answer-editor');
    if (editor) enhanceCodeEditor(editor);
  }

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
            <div class="idea-section-title">${typeof I18n !== 'undefined' ? I18n.t('requirementsTitle') : '📋 Yêu cầu'}</div>
            <ul class="idea-list">${idea.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
          </div>` : ''}

        ${idea.steps && idea.steps.length ? `
          <div class="idea-section">
            <div class="idea-section-title">${typeof I18n !== 'undefined' ? I18n.t('stepsTitle') : '📝 Các bước thực hiện'}</div>
            <ul class="idea-list steps">${idea.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
          </div>` : ''}

        ${idea.bonusFeatures && idea.bonusFeatures.length ? `
          <div class="idea-section">
            <div class="idea-section-title">${typeof I18n !== 'undefined' ? I18n.t('bonusFeaturesTitle') : '⭐ Bonus Features'}</div>
            <ul class="idea-list">${idea.bonusFeatures.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
          </div>` : ''}
      </div>`;
  }

  function renderSaveButton() {
    return `<button class="btn-ai btn-save-idea" onclick="App.saveCurrentIdea()">
      <span class="btn-ai-icon">💾</span> ${typeof I18n !== 'undefined' ? I18n.t('saveIdeaBtn') : 'Lưu Idea'}
    </button>`;
  }

  function renderChatPanel() {
    return `
      <div class="project-chat-section">
        <div class="chat-container">
          <div class="chat-header">${typeof I18n !== 'undefined' ? I18n.t('chatWithAiMentor') : '💬 Chat với AI Mentor'}</div>
          <div class="chat-messages" id="project-chat-messages">
            ${projectChatHistory.length === 0
              ? `<div class="chat-empty">${typeof I18n !== 'undefined' ? I18n.t('askAiAboutProject') : 'Hỏi AI bất cứ điều gì về project này...'}</div>`
              : projectChatHistory.map(msg => {
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
                }).join('')}
            ${projectChatSending ? `
              <div class="chat-message ai-msg">
                <div class="chat-avatar">🤖</div>
                <div class="chat-bubble"><div class="chat-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>
              </div>` : ''}
          </div>
          <div class="chat-input-row">
            <input type="text" class="chat-input" id="project-chat-input" placeholder="${I18n.t('askAboutProject')}" autocomplete="off" onkeydown="if(event.key==='Enter')App.sendProjectChat()" />
            <button class="btn-chat-send" onclick="App.sendProjectChat()" ${projectChatSending ? 'disabled' : ''}>➤</button>
          </div>
        </div>
      </div>`;
  }

  function renderSubmitPanel() {
    const statusLabels = { excellent: (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '🎉 Excellent!' : '🎉 Xuất sắc!'), good: (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '👍 Good!' : '👍 Tốt!'), partial: (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '💪 Needs improvement' : '💪 Cần cải thiện'), needs_work: (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '📝 Needs redo' : '📝 Cần làm lại') };
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
          <!-- khu soan code cua project -->`;

    html += `
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
            <span>${totalChars > 400000 ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '⚠️ Very large - AI will summarize automatically' : '⚠️ Rất lớn - AI sẽ rút gọn tự động') : totalChars > 200000 ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? '📦 Large file' : '📦 File lớn') : '✅ OK'}</span>
          </div>`;

    html += `
          <div class="answer-actions" style="margin-top:16px">
            ${aiEnabled ? `
              <button class="btn-ai btn-check" onclick="App.submitProject()" id="btn-submit-project">
                <span class="btn-ai-icon">🤖</span> AI Chấm Toàn Diện Project (${projectFiles.length} file)
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
            <h2 class="idea-title">${statusLabels[r.status] || (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Result' : 'Kết quả')} — ${r.score}/100</h2>
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

  function renderProjectHub(container) {
    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    container.innerHTML = `
      <div class="project-hub">
        <div class="project-hub-header">
          <h1 class="view-title">🚀 ${typeof I18n !== 'undefined' ? I18n.t('projectLabTitle') : 'Project Lab'}</h1>
          <p class="view-subtitle">${typeof I18n !== 'undefined' ? I18n.t('projectLabSubtitle') : 'Thực hành qua project thực tế.'}</p>
        </div>
        <div class="project-hub-cards">
          <div class="project-hub-card card-level glass-card" onclick="App.goToProjectLevel()">
            <span class="card-emoji">📊</span>
            <h3>${typeof I18n !== 'undefined' ? I18n.t('byLevelTitle') : 'Theo Cấp Độ'}</h3>
            <p>${typeof I18n !== 'undefined' ? I18n.t('byLevelDesc') : 'Chọn mức Newbie → Master.'}</p>
            <span class="card-cta">${typeof I18n !== 'undefined' ? I18n.t('startBtn') : 'Bắt đầu →'}</span>
          </div>
          <div class="project-hub-card card-topic glass-card" onclick="App.goToProjectTopic()">
            <span class="card-emoji">📝</span>
            <h3>${typeof I18n !== 'undefined' ? I18n.t('byTopicTitle') : 'Theo Chủ Đề'}</h3>
            <p>${typeof I18n !== 'undefined' ? I18n.t('byTopicDesc') : 'Nhập chủ đề bạn muốn (game, web, API...).'}</p>
            <span class="card-cta">${typeof I18n !== 'undefined' ? I18n.t('startBtn') : 'Bắt đầu →'}</span>
          </div>
          <div class="project-hub-card card-saved glass-card" onclick="App.goToSavedIdeas()">
            <span class="card-emoji">📂</span>
            <h3>${typeof I18n !== 'undefined' ? I18n.t('savedIdeasTitle') : 'Idea Đã Lưu'}</h3>
            <p>${savedIdeas.length > 0 ? I18n.t('savedIdeasCount', { n: savedIdeas.length }) : (typeof I18n !== 'undefined' ? I18n.t('noSavedIdeasYet') : 'Chưa có idea nào.')}</p>
            <span class="card-cta">${savedIdeas.length > 0 ? (typeof I18n !== 'undefined' ? I18n.t('viewSavedBtn').replace('{n}', savedIdeas.length) : `Xem ${savedIdeas.length} idea →`) : (typeof I18n !== 'undefined' ? I18n.t('noSavedIdeasYet') : 'Chưa có idea')}</span>
          </div>
        </div>
      </div>`;
  }

  function renderProjectByLevel(container) {
    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const levels = [
      { id: 'newbie', name: 'Newbie', emoji: '🌱', desc: I18n.t('levelNewbie') },
      { id: 'junior', name: 'Junior', emoji: '🌿', desc: I18n.t('levelJunior') },
      { id: 'mid', name: 'Mid', emoji: '🌳', desc: I18n.t('levelMid') },
      { id: 'senior', name: 'Senior', emoji: '🔥', desc: I18n.t('levelSenior') },
      { id: 'master', name: 'Master', emoji: '👑', desc: I18n.t('levelMaster') }
    ];

    let html = `
      <div class="project-level-view">
        <button class="btn-back" onclick="App.goToProject()">${typeof I18n !== 'undefined' ? I18n.t('backToProjectLab') : '← Quay lại Project Lab'}</button>
        <h1 class="view-title" style="margin-bottom:8px">${typeof I18n !== 'undefined' ? I18n.t('byLevelHeader') : '📊 Project theo Cấp Độ'}</h1>
        <p class="view-subtitle" style="margin-bottom:28px">${typeof I18n !== 'undefined' ? I18n.t('byLevelHeaderDesc') : 'Chọn cấp độ để nhận idea project phù hợp'}</p>

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
            <span class="btn-ai-icon">🔄</span> ${typeof I18n !== 'undefined' ? I18n.t('newIdeaBtn') : 'Idea mới'}
          </button>
          ${renderSaveButton()}
        </div>`;
        html += renderChatPanel();
        html += renderSubmitPanel();
      } else {
        html += `
          <div class="lesson-section glass-card" style="text-align:center;padding:48px">
            <span style="font-size:48px;display:block;margin-bottom:16px">🎯</span>
            <h3 style="margin-bottom:8px">${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Ready!' : 'Sẵn sàng!') : 'Ready!'}</h3>
            <p style="color:var(--text-secondary);margin-bottom:24px">${I18n.t('clickBelowForIdea', { level: projectSelectedLevel })}</p>
            ${aiEnabled ? `
              <button class="btn-ai btn-generate-quiz" onclick="App.generateProjectByLevel()">
                <span class="btn-ai-icon">🤖</span> ${typeof I18n !== 'undefined' ? I18n.t('generateIdeaBtn') : 'Tạo Project Idea'}
              </button>` : `
              <div class="ai-disabled-notice"><p>⚠️ AI Offline.</p></div>`}
          </div>`;
      }
    }

    html += '</div></div>';
    container.innerHTML = html;
    scrollChatToBottom();
    attachEditorToProjectCode();
  }

  function renderProjectByTopic(container) {
    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const suggestions = ['🎮 Game', '🌐 Website', '📱 Mobile App', '🤖 Chatbot', '📊 Dashboard', '🛒 E-commerce', '📝 Todo App', '🎵 Music Player', '☁️ Weather App', '💬 Social Media'];
    const topicLevels = [
      { id: null, name: 'Auto', emoji: '🎯', desc: I18n.t('aiSelects') },
      { id: 'newbie', name: 'Newbie', emoji: '🌱', desc: I18n.t('levelNewbie') },
      { id: 'junior', name: 'Junior', emoji: '🌿', desc: I18n.t('levelJunior') },
      { id: 'mid', name: 'Mid', emoji: '🌳', desc: I18n.t('levelMid') },
      { id: 'senior', name: 'Senior', emoji: '🔥', desc: I18n.t('levelSenior') },
      { id: 'master', name: 'Master', emoji: '👑', desc: I18n.t('levelMaster') }
    ];

    let html = `
      <div class="project-topic-view">
        <button class="btn-back" onclick="App.goToProject()">${typeof I18n !== 'undefined' ? I18n.t('backToProjectLab') : '← Quay lại Project Lab'}</button>
        <h1 class="view-title" style="margin-bottom:8px">${typeof I18n !== 'undefined' ? I18n.t('byTopicHeader') : '📝 Project theo Chủ Đề'}</h1>
        <p class="view-subtitle" style="margin-bottom:28px">${typeof I18n !== 'undefined' ? I18n.t('byTopicHeaderDesc') : 'Nhập chủ đề bạn muốn, AI sẽ thiết kế project cho bạn'}</p>

        <div class="topic-input-section">
          <input type="text" class="topic-input" id="topic-input" placeholder="${typeof I18n !== 'undefined' ? I18n.t('topicInputPlaceholder') : 'VD: Game rắn săn mồi...'}" value="${escapeHtml(projectTopic)}" onkeydown="if(event.key==='Enter')App.generateProjectByTopic()" />
          ${aiEnabled ? `
            <button class="btn-ai btn-topic-generate" onclick="App.generateProjectByTopic()">
              <span class="btn-ai-icon">🤖</span> ${typeof I18n !== 'undefined' ? I18n.t('generateIdeaBtn') : 'Tạo Idea'}
            </button>` : ''}
        </div>

        <div class="topic-suggestions">
          ${suggestions.map(s => `<button class="topic-chip" onclick="App.setTopic('${s.substring(2)}')">${s}</button>`).join('')}
        </div>

        <div class="topic-level-selector">
          <span class="topic-level-label">${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Level:' : 'Cấp độ:') : 'Level:'}</span>
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
          <span class="btn-ai-icon">🔄</span> ${typeof I18n !== 'undefined' ? I18n.t('newIdeaBtn') : 'Idea mới'}
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

  function renderSavedIdeas(container) {
    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const diffColors = { newbie: '#2ecc71', junior: '#3498db', mid: '#f1c40f', senior: '#e74c3c', master: '#f093fb' };

    let html = `
      <div class="saved-ideas-view">
        <button class="btn-back" onclick="App.goToProject()">${typeof I18n !== 'undefined' ? I18n.t('backToProjectLab') : '← Quay lại Project Lab'}</button>
        <h1 class="view-title" style="margin-bottom:8px">📂 ${typeof I18n !== 'undefined' ? I18n.t('savedIdeasTitle') : 'Idea Đã Lưu'}</h1>
        <p class="view-subtitle" style="margin-bottom:28px">${typeof I18n !== 'undefined' ? I18n.t('savedIdeasDesc') : 'Các project idea bạn đã bookmark để quay lại làm sau'}</p>`;

    if (savedIdeas.length === 0) {
      html += `
        <div class="lesson-section glass-card" style="text-align:center;padding:48px">
          <span style="font-size:48px;display:block;margin-bottom:16px">📭</span>
          <h3 style="margin-bottom:8px">${typeof I18n !== 'undefined' ? I18n.t('noSavedIdeasYet') : 'Chưa có idea nào được lưu'}</h3>
          <p style="color:var(--text-secondary);margin-bottom:24px">${I18n.t('createIdeaThenSave')}</p>
          <button class="btn-ai" onclick="App.goToProjectTopic()">
            <span class="btn-ai-icon">📝</span> ${typeof I18n !== 'undefined' ? I18n.t('createIdeaByTopicBtn') : 'Tạo Idea theo chủ đề'}
          </button>
        </div>`;
    } else {
      html += `<div class="saved-ideas-grid">`;
      savedIdeas.forEach(saved => {
        const idea = saved.idea;
        const date = new Date(saved.savedAt);
        const dateStr = date.toLocaleDateString(isVi ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = date.toLocaleTimeString(isVi ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        const diffColor = diffColors[idea.difficulty] || diffColors.mid;
        const sourceLabel = saved.source === 'topic' ? `📝 ${saved.topic || I18n.t('topicLabel')}` : `📊 ${saved.level || idea.difficulty}`;

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
                  <span class="btn-ai-icon">▶️</span> ${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Start' : 'Bắt đầu làm') : 'Start working'}
                </button>
                <button class="btn-delete-idea" onclick="if(confirm('${I18n.t('deleteIdeaConfirm')}')) App.deleteSavedIdea('${saved.id}')">
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

    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';

    const main = document.getElementById('main-content');
    if (main) {
      const levels = [
        { id: 'newbie', name: 'Newbie', emoji: '🌱', desc: I18n.t('levelNewbie') },
        { id: 'junior', name: 'Junior', emoji: '🌿', desc: I18n.t('levelJunior') },
        { id: 'mid', name: 'Mid', emoji: '🌳', desc: I18n.t('levelMid') },
        { id: 'senior', name: 'Senior', emoji: '🔥', desc: I18n.t('levelSenior') },
        { id: 'master', name: 'Master', emoji: '👑', desc: I18n.t('levelMaster') }
      ];
      main.style.opacity = '1';
      main.style.transform = 'none';
      main.innerHTML = `
        <div class="project-level-view">
          <button class="btn-back" onclick="App.goToProject()">${typeof I18n !== 'undefined' ? I18n.t('backToProjectLab') : '← Quay lại Project Lab'}</button>
          <h1 class="view-title" style="margin-bottom:8px">${typeof I18n !== 'undefined' ? I18n.t('byLevelHeader') : '📊 Project theo Cấp Độ'}</h1>
          <p class="view-subtitle" style="margin-bottom:28px">${typeof I18n !== 'undefined' ? I18n.t('byLevelHeaderDesc') : 'Chọn cấp độ để nhận idea project phù hợp'}</p>
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
            <p>🤖 ${I18n.t('aiGeneratingLevelIdea', { level: projectSelectedLevel })}</p>
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
            <p>${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Error' : 'Lỗi') : 'Error'}: ${err.message}</p>
            <button class="btn-ai" onclick="App.generateProjectByLevel()">${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Retry' : 'Thử lại') : 'Retry'}</button>`;
        }
      }
    }
  }

  async function generateProjectByTopic() {
    const input = document.getElementById('topic-input');
    if (input) projectTopic = input.value;
    if (!projectTopic.trim()) return;

    resetProjectState();

    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const suggestions = ['🎮 Game', '🌐 Website', '📱 Mobile App', '🤖 Chatbot', '📊 Dashboard', '🛒 E-commerce', '📝 Todo App', '🎵 Music Player', '☁️ Weather App', '💬 Social Media'];

    const main = document.getElementById('main-content');
    if (main) {
      main.style.opacity = '1';
      main.style.transform = 'none';
      main.innerHTML = `
        <div class="project-topic-view">
          <button class="btn-back" onclick="App.goToProject()">${typeof I18n !== 'undefined' ? I18n.t('backToProjectLab') : '← Quay lại Project Lab'}</button>
          <h1 class="view-title" style="margin-bottom:8px">${typeof I18n !== 'undefined' ? I18n.t('byTopicHeader') : '📝 Project theo Chủ Đề'}</h1>
          <p class="view-subtitle" style="margin-bottom:28px">${typeof I18n !== 'undefined' ? I18n.t('byTopicHeaderDesc') : 'Nhập chủ đề bạn muốn, AI sẽ thiết kế project cho bạn'}</p>
          <div class="topic-input-section">
            <input type="text" class="topic-input" id="topic-input" placeholder="${typeof I18n !== 'undefined' ? I18n.t('topicInputPlaceholder') : 'VD: Game rắn săn mồi...'}" value="${escapeHtml(projectTopic)}" onkeydown="if(event.key==='Enter')App.generateProjectByTopic()" />
            <button class="btn-ai btn-topic-generate" onclick="App.generateProjectByTopic()" disabled>
              <span class="loading-spinner-inline"></span> ${isVi ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Generating...' : 'Đang tạo...') : 'Generating...'}
            </button>
          </div>
          <div class="topic-suggestions">
            ${suggestions.map(s => `<button class="topic-chip" onclick="App.setTopic('${s.substring(2)}')">${s}</button>`).join('')}
          </div>
          <div class="ai-loading glass-card">
            <div class="loading-spinner"></div>
            <p>🤖 ${I18n.t('aiGeneratingTopicIdea', { topic: escapeHtml(projectTopic) })}</p>
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

      saveCurrentFileCode();
      const codeContext = projectFiles
        .filter(f => f.code.trim())
        .map(f => {
          let code = f.code;

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
      html = `<div class="chat-empty">${typeof I18n !== 'undefined' ? I18n.t('askAiAboutProject') : 'Hỏi AI bất cứ điều gì về project này...'}</div>`;
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

    const sendBtn = messagesEl.closest('.chat-container')?.querySelector('.btn-chat-send');
    if (sendBtn) sendBtn.disabled = projectChatSending;
  }

  function scrollChatToBottom() {
    const el = document.getElementById('project-chat-messages');
    if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
  }

  async function submitProject() {

    saveCurrentFileCode();

    const hasCode = projectFiles.some(f => f.code.trim());
    if (!hasCode || !projectIdea) return;

    const btn = document.getElementById('btn-submit-project');
    const codeFileCount = projectFiles.filter(f => f.code.trim()).length;

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="loading-spinner-inline"></span> ${(typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? `Đang chấm file 1/${codeFileCount}...` : `Reviewing file 1/${codeFileCount}...`}`;
    }

    try {

      const onProgress = (current, total, stepMsg) => {
        if (btn) {
          if (stepMsg.startsWith('🔍') || stepMsg.startsWith('📊') || stepMsg.startsWith('🤖')) {
            btn.innerHTML = `<span class="loading-spinner-inline"></span> ${stepMsg}`;
          } else {
            btn.innerHTML = `<span class="loading-spinner-inline"></span> ${(typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? `Đang chấm ${current}/${total}: ${stepMsg}` : `Reviewing ${current}/${total}: ${stepMsg}`}`;
          }
        }
      };

      projectReview = await AIService.reviewProject(projectIdea, projectFiles, onProgress);

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
        btn.innerHTML = `<span class="btn-ai-icon">🤖</span> ${(typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? `AI Chấm Project (${projectFiles.length} file)` : `AI Review Project (${projectFiles.length} file${projectFiles.length > 1 ? 's' : ''})`}`;
      }
      alert(((typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? 'Lỗi chấm project: ' : 'Project review error: ') + err.message);
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

    const editor = document.getElementById('project-code-editor');
    const nameInput = document.getElementById('file-name-input');
    const langSelect = document.getElementById('project-lang');
    const activeFile = projectFiles[idx];
    if (editor) { editor.value = activeFile.code; editor.placeholder = I18n.t('pasteCodeHere', { file: activeFile.name }); }
    if (nameInput) nameInput.value = activeFile.name;
    if (langSelect) langSelect.value = activeFile.lang;

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

    const extMap = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp', cs: 'csharp', go: 'go', rs: 'rust', php: 'php', html: 'html', css: 'css', json: 'json' };
    const ext = newName.split('.').pop().toLowerCase();
    if (extMap[ext]) {
      projectFiles[projectActiveFileIdx].lang = extMap[ext];
      const langSelect = document.getElementById('project-lang');
      if (langSelect) langSelect.value = extMap[ext];
    }

    const tabs = document.querySelectorAll('.file-tab-name');
    if (tabs[projectActiveFileIdx]) tabs[projectActiveFileIdx].textContent = newName.trim();
  }

  function setProjectFileLang(lang) {
    projectFiles[projectActiveFileIdx].lang = lang;

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

  function renderAuthScreen(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-logo">🚀</div>
          <h1 class="auth-title">DevMaster Hub</h1>
          <p class="auth-subtitle">${I18n.t('authSubtitle')}</p>
          <div class="auth-tabs">
            <button class="auth-tab active" onclick="App.switchAuthTab('login')" id="tab-login">${I18n.t('authLogin')}</button>
            <button class="auth-tab" onclick="App.switchAuthTab('register')" id="tab-register">${I18n.t('authRegister')}</button>
          </div>
          <form class="auth-form" id="auth-form" onsubmit="return App.handleAuth(event)">
            <div class="auth-field">
              <label>${I18n.t('authUsername')}</label>
              <input type="text" id="auth-username" placeholder="${I18n.t('authUsernamePlaceholder')}" required autocomplete="username" />
            </div>
            <div class="auth-field">
              <label>${I18n.t('authPassword')}</label>
              <input type="password" id="auth-password" placeholder="${I18n.t('authPasswordPlaceholder')}" required autocomplete="current-password" />
            </div>
            <div class="auth-field auth-confirm-field" id="confirm-field" style="display:none">
              <label>${I18n.t('authConfirmPassword')}</label>
              <input type="password" id="auth-password2" placeholder="${I18n.t('authConfirmPassword')}" autocomplete="new-password" />
            </div>
            <div class="auth-error" id="auth-error"></div>
            <button type="submit" class="auth-submit-btn" id="auth-submit-btn">${I18n.t('authLogin')}</button>
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
    document.getElementById('auth-submit-btn').textContent = I18n.t(mode === 'login' ? 'authLogin' : 'authRegister');
    document.getElementById('auth-error').textContent = '';
  }

  async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('auth-username')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    const password2 = document.getElementById('auth-password2')?.value;
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-submit-btn');

    if (!username || !password) { errorEl.textContent = I18n.t('fillAllFields'); return false; }

    if (authMode === 'register') {
      if (password !== password2) { errorEl.textContent = I18n.t('passwordMismatch'); return false; }
    }

    btn.disabled = true;
    btn.textContent = I18n.t(authMode === 'login' ? 'loggingIn' : 'registering');
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
      btn.textContent = authMode === 'login' ? (isViSubmit ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Login' : 'Đăng nhập') : 'Login') : (isViSubmit ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Register' : 'Đăng ký') : 'Register');
    }
    return false;
  }

  async function logout() {
    if (confirm(I18n.t('logoutConfirm'))) {
      await AuthService.logout();
    }
  }

  // ═══════════════════════════════════════
  // THU THACH — chi co Linux terminal + CTF + AI sinh de
  // ═══════════════════════════════════════
  let aiChallenge = null;
  let aiChallengeBusy = false;

  function renderChallenge(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="challenge-view">
        <div class="page-header">
          <h1 class="page-title">${I18n.t('challengeTitle')}</h1>
          <p class="page-subtitle">${I18n.t('challengeSubtitle')}</p>
        </div>

        <div class="lesson-section glass-card" style="margin-bottom:16px">
          <div class="ai-challenge-bar">
            <div>
              <h3 style="margin:0 0 4px;font-size:14px">${I18n.t('aiChallengeTitle')}</h3>
              <p style="margin:0;font-size:12px;color:var(--text-muted)">${I18n.t('aiChallengeHint')}</p>
            </div>
            <button class="btn-ai btn-check" id="btn-gen-challenge" onclick="App.generateChallenge()">
              <span class="btn-ai-icon">🎲</span> ${I18n.t('aiChallengeBtn')}
            </button>
          </div>
          <div id="ai-challenge-box">${renderAiChallenge()}</div>
        </div>

        <div id="challenge-terminal-mount"></div>
      </div>`;
  }

  function renderAiChallenge() {
    if (aiChallengeBusy) {
      return `<div class="ai-challenge-card loading">${I18n.t('aiChallengeLoading')}</div>`;
    }
    if (!aiChallenge) return '';
    const c = aiChallenge;
    return `
      <div class="ai-challenge-card">
        <div class="ai-challenge-head">
          <strong>${escapeHtml(c.title || '')}</strong>
          <span class="ai-challenge-level">${escapeHtml(c.level || '')}</span>
        </div>
        <p>${escapeHtml(c.scenario || '')}</p>
        ${(c.steps || []).length ? `<ol>${c.steps.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ol>` : ''}
        ${c.hint ? `<div class="ai-challenge-hint">💡 ${escapeHtml(c.hint)}</div>` : ''}
      </div>`;
  }

  async function generateChallenge() {
    if (aiChallengeBusy) return;
    aiChallengeBusy = true;
    const box = document.getElementById('ai-challenge-box');
    if (box) box.innerHTML = renderAiChallenge();

    const system = [
      'Ban ra de thu thach Linux va an ninh mang cho hoc vien Viet Nam.',
      'De phai lam duoc bang cac lenh Linux co ban trong mot terminal gia lap:',
      'ls, cd, cat, grep, chmod, chown, find, ps, netstat, nmap, whoami, sudo.',
      'CHI tra ve JSON thuan, khong bao markdown:',
      '{"title":"...","level":"De|Trung binh|Kho","scenario":"boi canh 2-3 cau",',
      '"steps":["buoc 1","buoc 2"],"hint":"goi y mot lenh cu the"}',
      'Viet bang tieng Viet co dau day du.'
    ].join('\n');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (typeof AuthService !== 'undefined' && AuthService.isConfigured && AuthService.isConfigured()) {
        Object.assign(headers, await AuthService.authHeaders());
      }
      const res = await fetch('/api/ai', {
        method: 'POST', headers,
        body: JSON.stringify({
          system,
          messages: [{ role: 'user', content: 'Ra mot thu thach moi, khac cac de truoc do.' }],
          temperature: 1.0, max_tokens: 600, taskType: 'general'
        })
      });
      if (res.status === 401) throw new Error(I18n.t('needLogin'));
      if (!res.ok) throw new Error(I18n.t('aiBusy'));
      const data = await res.json();
      let text = (data.content && data.content[0] && data.content[0].text) || '';
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      aiChallenge = JSON.parse(text);
    } catch (e) {
      aiChallenge = { title: '⚠️ ' + e.message, scenario: '', steps: [], hint: '' };
    } finally {
      aiChallengeBusy = false;
      const b = document.getElementById('ai-challenge-box');
      if (b) b.innerHTML = renderAiChallenge();
    }
  }

  function renderCareerAdvisor(container) {
    const searchKeyword = careerLastSearchKeyword;
    const cleanKeyword = (careerLastSearchKeyword || '')
      .replace(/\b(vietnam|viet nam|vn|remote|global|intern|fresher|entry level)\b/gi, '')
      .trim() || careerLastSearchKeyword || 'developer';
    const vnKeyword = encodeURIComponent(cleanKeyword);
    const chatHtml = careerChatHistory.map((msg, idx) => {
      const isUser = msg.role === 'user';
      const cls = isUser ? 'career-msg-user' : 'career-msg-ai';
      const icon = isUser ? '👤' : '💼';
      const content = isUser ? escapeHtml(msg.content) : formatMarkdown(msg.content);

      const actionHtml = isUser ? `
        <div class="career-msg-actions">
          <button class="career-action-btn" onclick="App.editCareerMessage(${idx})" title="${typeof I18n !== 'undefined' ? I18n.t('editQuestion') : 'Chỉnh sửa câu hỏi này'}">
            ${typeof I18n !== 'undefined' ? I18n.t('editQuestion') : '✏️ Sửa câu hỏi'}
          </button>
        </div>` : `
        <div class="career-msg-actions">
          <button class="career-action-btn" onclick="App.regenerateCareerMessage(${idx})" title="${typeof I18n !== 'undefined' ? I18n.t('regenerateAnswer') : 'Yêu cầu AI phân tích và trả lời lại'}">
            ${typeof I18n !== 'undefined' ? I18n.t('regenerateAnswer') : '🔄 Trả lời lại'}
          </button>
        </div>`;

      return `
        <div class="career-msg ${cls}">
          <span class="career-msg-icon">${icon}</span>
          <div class="career-msg-content">
            ${content}
            ${actionHtml}
          </div>
        </div>`;
    }).join('');

    const jobsHtml = careerJobResults.length > 0 ? `
      <div class="career-jobs-section" id="career-jobs-section" style="margin-top:16px">
        <div class="career-jobs-toggle-bar" onclick="App.toggleCareerJobs()" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:12px 18px;background:#161b22;border:1px solid ${careerJobsCollapsed ? '#30363d' : '#58a6ff'};border-radius:10px;transition:all 0.2s ease">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:14px;color:#58a6ff;transition:transform 0.25s ease;transform:${careerJobsCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};display:inline-block">▼</span>
            <span style="font-size:14px;font-weight:600;color:#e6edf3">
              💼 ${typeof I18n !== 'undefined' ? I18n.t('jobsSuggestedBar') : 'Việc làm AI gợi ý'} (<strong style="color:#58a6ff">${careerJobResults.length}</strong>): <span style="color:#58a6ff;font-weight:500">"${escapeHtml(searchKeyword)}"</span>
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:12px;color:#58a6ff;background:rgba(88,166,255,0.12);border:1px solid rgba(88,166,255,0.35);padding:5px 14px;border-radius:8px;font-weight:600">
              ${careerJobsCollapsed ? (typeof I18n !== 'undefined' ? I18n.t('openJobList') : '▶ Bấm để mở danh sách') + ` (${careerJobResults.length})` : (typeof I18n !== 'undefined' ? I18n.t('collapseJobList') : '▲ Thu gọn danh sách (quay lại chat)')}
            </span>
          </div>
        </div>
        <div class="career-jobs-grid" id="career-jobs-grid" style="display:${careerJobsCollapsed ? 'none' : 'grid'};margin-top:14px">
          ${careerJobResults.map(job => {
            const isRemote = job.is_remote;
            const locLower = (job.location || '').toLowerCase();
            const locationFlag = locLower.includes('vietnam') || locLower.includes('việt nam') || locLower.includes('vn') || locLower.includes('hồ chí minh') || locLower.includes('hà nội') || locLower.includes('đà nẵng') ? '🇻🇳' : (isRemote ? '🌍' : '📍');
            const typeLabel = job.employment_type === 'FULLTIME' ? 'Full-time' :
                              job.employment_type === 'PARTTIME' ? 'Part-time' :
                              job.employment_type === 'CONTRACTOR' ? 'Contract' :
                              job.employment_type === 'INTERN' ? 'Intern/Fresher' : (job.employment_type || '');

            const badgeColor = job.status === 'ready' ? '#3fb950' : (job.status === 'gap' ? '#d29922' : '#f85149');
            const badgeBg = job.status === 'ready' ? 'rgba(46, 160, 67, 0.15)' : (job.status === 'gap' ? 'rgba(210, 153, 34, 0.15)' : 'rgba(248, 81, 73, 0.15)');
            const badgeBorder = job.status === 'ready' ? 'rgba(46, 160, 67, 0.4)' : (job.status === 'gap' ? 'rgba(210, 153, 34, 0.4)' : 'rgba(248, 81, 73, 0.4)');

            return `
            <a href="${job.url}" target="_blank" class="career-job-card" style="position:relative;border:1px solid ${badgeBorder}">
              ${job.badgeText ? `
                <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;color:${badgeColor};background:${badgeBg};margin-bottom:10px;border:1px solid ${badgeBorder}">
                  ${escapeHtml(job.badgeText)}
                </div>` : ''}
              <div class="career-job-header">
                ${job.company_logo ? `<img src="${job.company_logo}" alt="" class="career-job-logo" onerror="this.style.display='none'"/>` : '<div class="career-job-logo-placeholder">🏢</div>'}
                <div>
                  <div class="career-job-company">${escapeHtml(job.company_name)}</div>
                  <div class="career-job-source">${escapeHtml(job.source || 'JSearch')}</div>
                </div>
              </div>
              <div class="career-job-title">${escapeHtml(job.title)}</div>
              ${job.fitRecommendation ? `
                <div style="font-size:12.5px;color:#8b949e;margin:8px 0 12px 0;line-height:1.45;background:rgba(255,255,255,0.03);padding:8px 10px;border-radius:6px;border-left:3px solid ${badgeColor}">
                  💡 <strong>${(typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? 'Đánh giá thực lực:' : 'Skill Assessment:'}</strong> ${escapeHtml(job.fitRecommendation)}
                </div>` : ''}
              <div class="career-job-meta">
                <span>${locationFlag} ${escapeHtml(job.location || 'Remote')}</span>
                ${typeLabel ? `<span>⏰ ${typeLabel}</span>` : ''}
                ${job.salary ? `<span>💰 ${escapeHtml(job.salary)}</span>` : ''}
              </div>
              <div class="career-job-tags">${(job.tags || []).filter(t => t).slice(0, 3).map(t => `<span class="career-job-tag">${escapeHtml(t)}</span>`).join('')}</div>
            </a>`;
          }).join('')}
        </div>
      </div>
    ` : `
      <div class="career-jobs-section" id="career-jobs-section" style="margin-top:16px">
        <div class="career-jobs-toggle-bar career-jobs-empty-bar" style="display:flex;align-items:center;justify-content:space-between;padding:11px 18px;background:#161b22;border:1px solid #30363d;border-radius:10px;color:#8b949e">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:14px;color:#8b949e">💼</span>
            <span style="font-size:13.5px;color:#8b949e">${typeof I18n !== 'undefined' ? I18n.t('jobsSuggestedBar') : 'AI Recommended Jobs'} (0): <em style="color:#6e7681">${searchKeyword ? (typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? `No matching jobs found for "${escapeHtml(searchKeyword)}"` : `Không tìm thấy cho "${escapeHtml(searchKeyword)}"`) : (typeof I18n !== 'undefined' ? I18n.t('noJobsFound') : 'No matching jobs yet')}</em></span>
          </div>
          <span style="font-size:12px;color:#8b949e;background:rgba(255,255,255,0.05);padding:4px 10px;border-radius:12px">${typeof I18n !== 'undefined' ? I18n.t('autoTriggerChat') : 'Auto-triggered during chat'}</span>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="career-container">
        <div class="view-breadcrumb">Dashboard › 💼 ${typeof I18n !== 'undefined' ? I18n.t('careerAdvisor') : 'Tư vấn Việc làm'}</div>
        <div class="career-header">
          <h1 class="view-title">${typeof I18n !== 'undefined' ? I18n.t('careerTitle') : '💼 AI Career Advisor'}</h1>
          <p class="view-subtitle">${typeof I18n !== 'undefined' ? I18n.t('careerSubtitle') : 'AI phân tích trình độ của bạn và tư vấn nghề nghiệp phù hợp'}</p>
          <div class="career-actions">
            <button class="btn-career-search" onclick="App.searchCareerJobs()">🔍 ${typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Search Jobs' : 'Tìm việc làm'}</button>
            <button class="btn-career-clear" onclick="App.clearCareerChat()">🗑️ ${typeof I18n !== 'undefined' ? I18n.t('clearChat') : 'Xóa chat'}</button>
          </div>
        </div>
        <div class="career-chat" id="career-chat">
          ${chatHtml || `<div class="career-empty"><p>💬 ${typeof I18n !== 'undefined' && I18n.getLang() === 'en' ? 'Hello! I am your AI Career Advisor. Tell me about your career goals or ask for job opportunities!' : 'Chào bạn! Tui là AI Career Advisor. Hãy kể cho tui nghe về mong muốn nghề nghiệp của bạn nhé!'}</p></div>`}
          ${careerChatSending ? `<div class="career-msg career-msg-ai"><span class="career-msg-icon">💼</span><div class="career-msg-content career-typing">${I18n.t('thinkingShort')}<span class="typing-dots">...</span></div></div>` : ''}
        </div>
        <div class="career-input-area">
          <textarea id="career-input" placeholder="${typeof I18n !== 'undefined' ? I18n.t('searchJobsPlaceholder') : 'Gõ câu hỏi hoặc kể về mong muốn nghề nghiệp...'}" rows="2" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();App.sendCareerMessage();}">${escapeHtml(careerDraftInput)}</textarea>
          <button class="btn-career-send" onclick="App.sendCareerMessage()" ${careerChatSending ? 'disabled' : ''}>${typeof I18n !== 'undefined' ? I18n.t('sendMsg') : 'Gửi'} ➤</button>
        </div>
        ${jobsHtml}
      </div>`;

    const chatEl = document.getElementById('career-chat');
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;

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

  function editCareerMessage(idx) {
    if (idx < 0 || idx >= careerChatHistory.length) return;

    CareerAdvisor.abortMessage();
    careerChatSending = false;

    const userMsg = careerChatHistory[idx].content;
    careerDraftInput = userMsg;
    careerChatHistory = careerChatHistory.slice(0, idx);
    CareerAdvisor.rewindChat(idx);
    try { AuthService.saveCareerChat(careerChatHistory); } catch (e) {}
    render();

    setTimeout(() => {
      const input = document.getElementById('career-input');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 150);
  }

  async function regenerateCareerMessage(idx) {
    if (careerChatSending) {
      CareerAdvisor.abortMessage();
    }
    let userMsgIdx = idx - 1;
    while (userMsgIdx >= 0 && careerChatHistory[userMsgIdx].role !== 'user') {
      userMsgIdx--;
    }
    if (userMsgIdx < 0) return;
    const userText = careerChatHistory[userMsgIdx].content;

    careerChatHistory = careerChatHistory.slice(0, userMsgIdx + 1);
    CareerAdvisor.rewindChat(userMsgIdx + 1);
    careerChatSending = true;
    render();

    try {
      const result = await CareerAdvisor.sendMessage(userText);
      if (!result) {
        careerChatSending = false;
        return;
      }
      const replyText = typeof result === 'object' ? result.text : result;
      const autoJobs = typeof result === 'object' ? result.jobs : null;
      const keyword = typeof result === 'object' ? result.searchKeyword : '';
      careerChatHistory.push({ role: 'assistant', content: replyText });
      if (autoJobs && autoJobs.length > 0) {
        careerJobResults = autoJobs;
      }
      if (keyword) {
        careerLastSearchKeyword = keyword;
      }
      try { await AuthService.saveCareerChat(careerChatHistory); } catch (e) {}
    } catch (err) {
      if (err.name !== 'AbortError') {
        careerChatHistory.push({ role: 'assistant', content: '❌ Lỗi: ' + err.message });
      }
    }
    careerChatSending = false;
    render();
  }

  async function sendCareerMessage() {
    const input = document.getElementById('career-input');
    const msg = input?.value?.trim();
    if (!msg || careerChatSending) return;
    input.value = '';
    careerDraftInput = '';
    careerChatSending = true;
    careerChatHistory.push({ role: 'user', content: msg });
    render();

    try {
      const result = await CareerAdvisor.sendMessage(msg);

      if (!result) {
        careerChatSending = false;
        return;
      }
      const replyText = typeof result === 'object' ? result.text : result;
      const autoJobs = typeof result === 'object' ? result.jobs : null;
      const keyword = typeof result === 'object' ? result.searchKeyword : '';
      careerChatHistory.push({ role: 'assistant', content: replyText });

      if (autoJobs && autoJobs.length > 0) {
        careerJobResults = autoJobs;
      }

      if (keyword) {
        careerLastSearchKeyword = keyword;
        if (!autoJobs || autoJobs.length === 0) {
          careerJobResults = [];
        }
      }

      try { await AuthService.saveCareerChat(careerChatHistory); } catch (e) {}
    } catch (err) {
      if (err.name !== 'AbortError') {
        careerChatHistory.push({ role: 'assistant', content: '❌ Lỗi: ' + err.message });
      }
    }
    careerChatSending = false;
    render();
  }

  async function searchCareerJobs() {
    const query = prompt(I18n.t('jobSearchPlaceholder2'));
    if (!query) return;
    try {
      const jobs = await CareerAdvisor.searchJobs(query);
      careerJobResults = jobs;
      careerLastSearchKeyword = query;
      render();
    } catch (err) {
      alert(((typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? 'Lỗi tìm kiếm: ' : 'Search error: ') + err.message);
    }
  }

  async function clearCareerChat() {
    if (!confirm(I18n.t('clearCareerChatConfirm'))) return;
    careerChatHistory = [];
    careerJobResults = [];
    careerLastSearchKeyword = '';
    careerDraftInput = '';
    await CareerAdvisor.clearChat();
    render();
  }

  function toggleCareerJobs() {
    if (careerJobResults.length === 0) return;
    careerJobsCollapsed = !careerJobsCollapsed;
    render();

    setTimeout(() => {
      if (!careerJobsCollapsed) {

        const sectionEl = document.getElementById('career-jobs-section');
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {

        const inputEl = document.getElementById('career-input');
        const chatEl = document.getElementById('career-chat');
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputEl.focus();
        } else if (chatEl) {
          chatEl.scrollTop = chatEl.scrollHeight;
        }
      }
    }, 80);
  }

  function renderMyProjects(container) {
    if (selectedProjectView) {
      renderProjectDetail(container, selectedProjectView);
      return;
    }

    const isVi = (typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi';
    const listHtml = myProjectsList.length > 0 ? myProjectsList.map(p => `
      <div class="myproject-card" onclick="App.viewProject(${p.id})">
        <div class="myproject-score">${p.score_overall || '?'}<span>/100</span></div>
        <div class="myproject-info">
          <h3>${escapeHtml(p.project_name)}</h3>
          <p>${escapeHtml(p.project_description || '')}</p>
          <div class="myproject-meta">
            <span>📅 ${new Date(p.submitted_at).toLocaleDateString(isVi ? 'vi-VN' : 'en-US')}</span>
            <span>🎯 ${p.difficulty_level || 'N/A'}</span>
            <span>💻 ${(p.languages_used || []).join(', ') || 'N/A'}</span>
          </div>
        </div>
      </div>`).join('') : `<div class="career-empty"><p>📁 ${typeof I18n !== 'undefined' ? I18n.t('noProjectsYet') : 'Chưa có project nào được nộp. Hãy vào Project Lab để bắt đầu!'}</p></div>`;

    container.innerHTML = `
      <div class="myprojects-container">
        <div class="view-breadcrumb">${typeof I18n !== 'undefined' ? I18n.t('myProjectsBreadcrumb') : 'Dashboard › 📁 My Projects'}</div>
        <h1 class="view-title">📁 ${typeof I18n !== 'undefined' ? I18n.t('myProjectsTitle') : 'My Projects'}</h1>
        <p class="view-subtitle">${typeof I18n !== 'undefined' ? I18n.t('myProjectsSubtitle') : 'Xem lại tất cả project đã nộp và kết quả AI review'}</p>
        <div class="myprojects-list">${listHtml}</div>
      </div>`;

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
        <button class="btn-back" onclick="App.goToMyProjects()">${(typeof I18n !== 'undefined' ? I18n.getLang() : 'vi') === 'vi' ? '← Quay lại' : '← Back'}</button>
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
        ${(project.ai_strengths || []).length > 0 ? `<div class="myproject-strengths"><h3>💪 ${typeof I18n !== 'undefined' ? I18n.t('strengths') : 'Điểm mạnh'}</h3><ul>${project.ai_strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>` : ''}
        ${(project.ai_improvements || []).length > 0 ? `<div class="myproject-improve"><h3>📈 ${typeof I18n !== 'undefined' ? I18n.t('improvements') : 'Cần cải thiện'}</h3><ul>${project.ai_improvements.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>` : ''}
        <div class="myproject-files"><h3>📄 Code Files</h3>${filesHtml}</div>
      </div>`;
    if (typeof Prism !== 'undefined') Prism.highlightAll();
  }

  function viewProject(id) {
    selectedProjectView = myProjectsList.find(p => p.id === id) || null;
    render();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatMarkdown(text) {
    if (!text) return '';

    return escapeHtml(text)
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
    goToChallenge: () => navigateTo('challenge'),
    generateChallenge,
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
      if (btn) { btn.className = `btn-complete ${done ? 'completed' : ''}`; btn.innerHTML = done ? (typeof I18n !== 'undefined' ? I18n.t('completed') : '✅ Hoàn thành') : (typeof I18n !== 'undefined' ? I18n.t('markComplete') : '⬜ Đánh dấu hoàn thành'); }
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

    sendLessonChat,
    clearLessonChat,
    toggleLessonChat,

    switchAuthTab,
    handleAuth,
    logout,

    sendCareerMessage,
    searchCareerJobs,
    clearCareerChat,
    editCareerMessage,
    regenerateCareerMessage,
    toggleCareerJobs,

    viewProject,

    selectProjectLevel,
    runExerciseSandbox,
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

    saveCurrentIdea,
    goToSavedIdeas: () => navigateTo('saved-ideas'),
    loadSavedIdea: loadSavedIdeaToWork,
    deleteSavedIdea,

    setLanguage: (lang) => {
      if (typeof I18n !== 'undefined') {
        I18n.setLanguage(lang);
        renderSidebar();
        render();
      }
    },
    toggleLanguage: () => {
      if (typeof I18n !== 'undefined') {
        I18n.toggleLanguage();
        renderSidebar();
        render();
      }
    }
  };
})();

  App.triggerDynamicContentTranslation = async function(activeTab) {
    if (typeof I18n === 'undefined') return;
    const lang = I18n.getLang();
    if (lang === 'vi') return;

    const translateElementSmoothly = async (selector) => {
      const el = document.querySelector(selector);
      if (!el || el.dataset.translatedLang === lang) return;

      const original = el.dataset.originalHtml || el.innerHTML;
      if (!el.dataset.originalHtml) el.dataset.originalHtml = original;

      try {
        const result = await I18n.translateDynamic(original, lang);
        if (result && result !== original) {
          el.style.transition = 'opacity 0.2s ease';
          el.style.opacity = '0.7';
          setTimeout(() => {
            el.innerHTML = result;
            el.style.opacity = '1';
            el.dataset.translatedLang = lang;
          }, 100);
        }
      } catch(e) {

      }
    };

    translateElementSmoothly('.theory-content');
    translateElementSmoothly('.key-points');
    translateElementSmoothly('.exercise-description');
  };

  window.App = App;
document.addEventListener('DOMContentLoaded', App.init);
