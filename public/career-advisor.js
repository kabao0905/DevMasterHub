const CareerAdvisor = (() => {
  let chatHistory = [];
  let isLoading = false;
  let cachedUserLevel = 'newbie';
  let cachedLearnedTechs = [];
  let cachedStats = null;
  let activeAbortController = null;

  function abortMessage() {
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
    isLoading = false;
  }

  async function getUserLevelContext() {
    try {
      if (typeof AuthService !== 'undefined') {
        const stats = await AuthService.getUserStats();
        if (stats) {
          cachedStats = stats;
          cachedLearnedTechs = stats.techBreakdown.map(t => t.tech.toLowerCase());
          const totalLessons = stats.totalLessonsCompleted || 0;

          let level = 'newbie';
          if (totalLessons >= 50) {
            level = 'senior';
          } else if (totalLessons >= 30) {
            level = 'mid';
          } else if (totalLessons >= 15) {
            level = 'junior';
          } else {
            level = 'newbie';
          }
          cachedUserLevel = level;
          return { stats, level, totalLessons, learnedTechs: cachedLearnedTechs };
        }
      }
    } catch (e) {
      console.warn('[CareerAdvisor] Could not compute user level:', e);
    }
    return { stats: null, level: 'newbie', totalLessons: 0, learnedTechs: [] };
  }

  async function buildSystemPrompt(crawledData = null) {
    let userContext = 'Người dùng mới bắt đầu (Cấp độ: Newbie, chưa hoàn thành bài học nào).';
    let userLevelName = 'Newbie (Người mới bắt đầu)';

    try {
      const { stats, level } = await getUserLevelContext();
      if (stats) {
        let parts = [];
        const levelLabels = {
          newbie: '🌱 Newbie (Mới nhập môn - Dưới 15 bài học)',
          junior: '🌿 Junior Khởi Điểm (15-30 bài học)',
          mid: '🌳 Mid-level (30-50 bài học)',
          senior: '🔥 Senior (Trên 50 bài học)'
        };
        userLevelName = levelLabels[level] || level;
        parts.push(`🎯 CẤP ĐỘ THỰC TẾ CỦA HỌC VIÊN: ${userLevelName}`);
        parts.push(`📚 Tổng bài học & bài tập đã hoàn thành: ${stats.totalLessonsCompleted} bài`);
        if (stats.totalTimeHours > 0) {
          parts.push(`⏱️ Thời gian thực hành code: ${stats.totalTimeHours} giờ`);
        }

        if (stats.techBreakdown.length > 0) {
          parts.push('\n🔧 Kỹ năng đã học thực tế:');
          stats.techBreakdown.forEach(t => {
            const techName = (typeof CURRICULUM !== 'undefined' && CURRICULUM[t.tech]?.name) || t.tech;
            parts.push(`  - ${techName}: ${t.completed} bài`);
          });
        }

        if (stats.projects && stats.projects.length > 0) {
          parts.push(`\n🚀 Dự án thực tế (Project Lab) đã nộp (${stats.projects.length} dự án):`);
          stats.projects.forEach(p => {
            parts.push(`  - ${p.title || 'Project'} (${p.tech || 'Tech'}): Điểm đánh giá ${p.score_overall || 0}/100`);
          });
          if (stats.averageProjectScore) {
            parts.push(`⭐ Điểm dự án trung bình: ${stats.averageProjectScore}/100`);
          }
        }

        userContext = parts.join('\n');
      }
    } catch (e) {
      console.warn('[CareerAdvisor] Could not load user stats:', e);
    }

    let prompt = `Bạn là AI Career Advisor của DevMaster Hub. Phong cách: Thẳng thắn, trung thực, mang tính xây dựng, không tâng bốc hoa mĩ.

═══ HỒ SƠ THỰC TẾ HỌC VIÊN ═══
${userContext}
═══════════════════════════════

🎯 NGUYÊN TẮC TƯ VẤN THỰC TẾ & ĐỘ DÀI VỪA PHẢI (KHOẢNG 80 - 140 TỪ):

1. ĐÁNH GIÁ ĐÚNG THỰC LỰC (THẲNG THẮN - KHÔNG VẼ VỜI):
   - Nếu học viên học DƯỚI 15 BÀI (VD: mới học 6-7 bài C++):
     👉 Phải nói thật: Học viên mới ở mức Nhập môn (Newbie), mới nắm cú pháp cơ bản.
     👉 CHƯA ĐỦ TRÌNH ĐỘ làm Junior hay Kỹ sư chính thức!
     👉 Cơ hội thực tế lúc này chỉ là Thực tập sinh (Intern) vừa học vừa làm, hoặc cần hoàn thành tiếp các chủ đề cốt lõi (OOP, Con trỏ, Cấu trúc dữ liệu).
     👉 ❌ TUYỆT ĐỐI KHÔNG tâng bốc học viên là Junior hay bảo họ đủ sức làm Systems Programmer/Backend.

2. KHI HỌC VIÊN HỎI TÌM VIỆC LÀM:
   - Dòng 1: [SEARCH_JOBS: từ_khóa_vị_trí]
     Ví dụ: [SEARCH_JOBS: Python Developer], [SEARCH_JOBS: React Developer], [SEARCH_JOBS: C++ Intern]
   - ⚠️ NGUYÊN TẮC BẮT BUỘC: CHỈ xuất tên vị trí chuyên môn (role/tech/seniority). TUYỆT ĐỐI KHÔNG tự động gắn thêm bất kỳ thành phố hay quốc gia nào (KHÔNG thêm TP.HCM, không thêm Hà Nội, không thêm Vietnam...) TRỪ KHI học viên nêu đích danh địa điểm trong câu hỏi!
   - Đoạn tiếp theo: Viết 1 đoạn văn chân thực (3-4 câu) nhận xét thẳng thắn về mức độ sẵn sàng của học viên với các vị trí bên dưới.

3. 🌐 TỰ ĐỘNG THÍCH ỨNG ĐA NGÔN NGỮ (SMART MULTI-LANGUAGE):
   - Bạn BẮT BUỘC nhận diện và trả lời 100% bằng chính ngôn ngữ học viên đang dùng:
     👉 Nếu học viên hỏi bằng Tiếng Anh (English) -> Trả lời hoàn toàn bằng Tiếng Anh tự nhiên, chuẩn mực.
     👉 Nếu học viên hỏi bằng Tiếng Việt -> Trả lời hoàn toàn bằng Tiếng Việt trong sáng, dễ hiểu.
     👉 Nếu học viên hỏi bằng bất kỳ ngôn ngữ nào khác (Nhật, Hàn, Pháp, Trung...) -> Tự động nhận diện và phản hồi lưu loát bằng đúng ngôn ngữ đó.
   - ❌ Tuyệt đối không pha trộn lộn xộn từ ngữ giữa 2 ngôn ngữ gây khó hiểu.

4. ⛔ TRÁNH 2 CỰC ĐOAN:
   ❌ KHÔNG viết bài luận dài lê thê 500 từ, không vẽ bảng markdown dài dòng.
   ❌ KHÔNG trả lời cộc lốc 1 câu cụt lủn. Hãy trả lời tự nhiên, có tâm, mang lại giá trị thật cho người học.`;

    if (crawledData && crawledData.content) {
      prompt += `\n\n═══ 🌐 DỮ LIỆU ĐÃ CÀO TỪ LINK (${crawledData.url}) ═══
Tiêu đề: ${crawledData.pageTitle}
Nội dung: ${crawledData.content}
═══════════════════════════════════════════════════════
Nhiệm vụ: Viết ngắn gọn 3 câu tóm tắt vị trí phù hợp nhất trong link và khuyên học viên nên ứng tuyển hay cần học thêm gì.`;
    }

    return prompt;
  }

  async function sendMessage(userMessage) {
    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;
    isLoading = true;

    try {

      const urlMatch = userMessage.match(/https?:\/\/[^\s<>"'()]+/i);
      let crawledData = null;
      if (urlMatch) {
        const targetUrl = urlMatch[0];
        try {
          console.log('[CareerAdvisor] Detected link in chat, crawling live:', targetUrl);
          const crawlAuth = (typeof AuthService !== 'undefined' && AuthService.isConfigured())
            ? await AuthService.authHeaders() : {};
          const crawlRes = await fetch('/api/crawl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...crawlAuth },
            body: JSON.stringify({ url: targetUrl }),
            signal
          });
          if (crawlRes.ok) {
            crawledData = await crawlRes.json();
          }
        } catch (e) {
          if (e.name === 'AbortError' || signal.aborted) return null;
          console.warn('[CareerAdvisor] Live crawl failed:', e);
        }
      }

      if (signal.aborted) return null;

      const systemPrompt = await buildSystemPrompt(crawledData);

      const apiMessages = chatHistory.slice(-8).map(m => {
        if (m.role === 'assistant' && m.content.length > 300) {
          return { role: m.role, content: m.content.substring(0, 250) + '...' };
        }
        return m;
      });
      apiMessages.push({ role: 'user', content: userMessage });

      const aiAuth = (typeof AuthService !== 'undefined' && AuthService.isConfigured())
        ? await AuthService.authHeaders() : {};
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...aiAuth },
        body: JSON.stringify({
          system: systemPrompt,
          messages: apiMessages,
          temperature: 0.5,
          max_tokens: 1024
        }),
        signal
      });

      if (signal.aborted) return null;
      if (response.status === 401) {
        const e = await response.json().catch(() => ({}));
        throw new Error(e.error || 'Bạn cần đăng nhập để dùng Cố vấn Nghề nghiệp.');
      }
      if (!response.ok) throw new Error('AI service error');

      const data = await response.json();
      if (signal.aborted) return null;
      let aiText = data.content?.[0]?.text || 'Xin lỗi, tôi không thể trả lời lúc này.';

      let autoSearchResults = null;
      let usedSearchKeyword = '';

      const searchMatch = aiText.match(/\[SEARCH_JOBS:\s*(.+?)\]/i);
      if (searchMatch) {
        usedSearchKeyword = searchMatch[1].trim();

        const userAskedLocation = /\b(hcm|tp\.?\s*hcm|hồ chí minh|saigon|sài gòn|hà nội|ha noi|hn|đà nẵng|da nang|dn|vietnam|việt nam|vn|remote)\b/i.test(userMessage);
        if (!userAskedLocation) {

          usedSearchKeyword = usedSearchKeyword
            .replace(/\b(tp\.?\s*hcm|tp\s*hồ chí minh|hồ chí minh|hcm|saigon|sài gòn|hà nội|ha noi|hn|đà nẵng|da nang|vietnam|việt nam|vn)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        }

        aiText = aiText.replace(/\[SEARCH_JOBS:[^\]]*\]/gi, '').replace(/\n\s*🔍\s*\*\*\s*/g, '\n').replace(/^\s*🔍\s*/g, '').trim();
        try {
          autoSearchResults = await searchJobs(usedSearchKeyword, signal);
        } catch (e) {
          if (e.name === 'AbortError' || signal.aborted) return null;
          console.warn('[CareerAdvisor] Auto job search failed:', e);
        }
      } else {

        const fallbackKeyword = detectJobSearchIntent(userMessage);
        if (fallbackKeyword) {
          usedSearchKeyword = fallbackKeyword;
          try {
            autoSearchResults = await searchJobs(fallbackKeyword, signal);
          } catch (e) {
            if (e.name === 'AbortError' || signal.aborted) return null;
            console.warn('[CareerAdvisor] Fallback job search failed:', e);
          }
        }
      }

      if (signal.aborted) return null;

      chatHistory = [...chatHistory, { role: 'user', content: userMessage }, { role: 'assistant', content: aiText }];
      isLoading = false;
      activeAbortController = null;
      return { text: aiText, jobs: autoSearchResults, searchKeyword: usedSearchKeyword };
    } catch (err) {
      isLoading = false;
      activeAbortController = null;
      if (err.name === 'AbortError') {
        console.log('[CareerAdvisor] Request aborted by user');
        return null;
      }
      throw err;
    }
  }

  function detectJobSearchIntent(message) {
    const msg = message.toLowerCase();

    const triggerPatterns = [
      /tìm\s*(việc|job|công\s*việc|vị\s*trí)/i,
      /kiếm\s*(việc|job|công\s*việc)/i,
      /search\s*(job|work|position|việc)/i,
      /find\s*(job|work|position)/i,
      /tuyển\s*dụng/i,
      /hiring/i,
      /job\s*(opening|vacancy|position|listing)/i,
      /remote\s*job/i,
      /việc\s*làm/i,
      /có\s*(công\s*việc|job|vị\s*trí)\s*nào/i,
    ];

    const isJobSearch = triggerPatterns.some(p => p.test(msg));
    if (!isJobSearch) return null;

    const isNewbie = cachedUserLevel === 'newbie';
    const prefix = isNewbie ? 'intern ' : '';

    const techKeywords = {
      'firmware': 'firmware', 'embedded': 'embedded', 'nhúng': 'embedded',
      'react': `${prefix}react developer`, 'angular': `${prefix}angular developer`, 'vue': `${prefix}vue developer`,
      'node': `${prefix}nodejs developer`, 'nodejs': `${prefix}nodejs developer`, 'node.js': `${prefix}nodejs developer`,
      'python': `${prefix}python developer`, 'java': `${prefix}java developer`, 'javascript': `${prefix}javascript developer`,
      'typescript': `${prefix}typescript developer`, 'c++': `${prefix}c++ developer`, 'c#': `${prefix}csharp developer`,
      'go': `${prefix}golang developer`, 'golang': `${prefix}golang developer`, 'rust': `${prefix}rust developer`,
      'php': `${prefix}php developer`, 'ruby': `${prefix}ruby developer`, 'swift': `${prefix}swift developer`,
      'kotlin': `${prefix}kotlin developer`, 'flutter': `${prefix}flutter developer`, 'dart': `${prefix}dart developer`,
      'frontend': `${prefix}frontend developer`, 'front-end': `${prefix}frontend developer`, 'front end': `${prefix}frontend developer`,
      'backend': `${prefix}backend developer`, 'back-end': `${prefix}backend developer`, 'back end': `${prefix}backend developer`,
      'fullstack': `${prefix}fullstack developer`, 'full-stack': `${prefix}fullstack developer`, 'full stack': `${prefix}fullstack developer`,
      'devops': `${prefix}devops engineer`, 'sre': `${prefix}sre engineer`,
      'data': `${prefix}data engineer`, 'ml': `${prefix}machine learning engineer`, 'ai': `${prefix}ai engineer`,
      'mobile': `${prefix}mobile developer`, 'ios': `${prefix}ios developer`, 'android': `${prefix}android developer`,
      'qa': `${prefix}qa tester`, 'test': `${prefix}tester`, 'tester': `${prefix}tester`,
      'security': `${prefix}security engineer`, 'cloud': `${prefix}cloud engineer`,
      'fresher': 'fresher developer', 'junior': 'junior developer', 'intern': 'software intern', 'thực tập': 'software intern'
    };

    let locSuffix = '';
    if (/\b(hcm|tp\.?\s*hcm|hồ chí minh|ho chi minh|sài gòn|saigon)\b/i.test(msg)) {
      locSuffix = ' TP.HCM';
    } else if (/\b(hà nội|ha noi|hn)\b/i.test(msg)) {
      locSuffix = ' Hà Nội';
    } else if (/\b(đà nẵng|da nang)\b/i.test(msg)) {
      locSuffix = ' Đà Nẵng';
    } else if (/\b(remote|nước ngoài|từ xa)\b/i.test(msg)) {
      locSuffix = ' Remote';
    }

    for (const [key, value] of Object.entries(techKeywords)) {
      if (msg.includes(key)) return value + locSuffix;
    }

    return (isNewbie ? 'intern developer' : 'software developer') + locSuffix;
  }

  function evaluateJobMatch(job, userLevel, learnedTechs, stats) {
    const title = (job.title || '').toLowerCase();
    const desc = (job.description_snippet || '').toLowerCase();
    const tags = (job.tags || []).map(t => String(t).toLowerCase());
    const combinedText = (title + ' ' + tags.join(' ') + ' ' + desc).toLowerCase();

    const domainRules = [
      { key: 'ai', name: 'AI & DATA SCIENCE', keywords: ['ai engineer', 'machine learning', 'data science', 'deep learning', 'nlp', 'llm', 'computer vision', 'ai trainee'] },
      { key: 'embedded', name: 'EMBEDDED & FIRMWARE', keywords: ['firmware', 'embedded', 'nhúng', 'microcontroller', 'stm32', 'arduino', 'rtos', 'autosar', 'mcu'] },
      { key: 'cpp', name: 'C/C++', keywords: ['c++', 'c/c++', 'cpp', 'qt', 'unreal'] },
      { key: 'frontend', name: 'FRONTEND', keywords: ['frontend', 'front-end', 'react', 'vue', 'angular', 'javascript', 'typescript', 'next.js', 'html', 'css', 'ui/ux'] },
      { key: 'backend', name: 'BACKEND', keywords: ['backend', 'back-end', 'node', 'python', 'django', 'fastapi', 'java', 'spring', 'golang', 'rust', 'c#', '.net', 'api', 'microservice'] },
      { key: 'devops', name: 'DEVOPS & CLOUD', keywords: ['devops', 'sre', 'cloud', 'infrastructure', 'docker', 'kubernetes', 'ci/cd', 'aws', 'linux'] },
      { key: 'mobile', name: 'MOBILE', keywords: ['mobile', 'flutter', 'react native', 'ios', 'android', 'swift', 'kotlin'] },
      { key: 'qa', name: 'QA & TESTING', keywords: ['qa', 'tester', 'test engineer', 'automation test'] }
    ];

    let matchedDomain = domainRules[2];
    for (const d of domainRules) {
      if (d.keywords.some(k => combinedText.includes(k))) {
        matchedDomain = d;
        break;
      }
    }

    const techMap = {
      cpp: ['cpp', 'c++', 'c/c++', 'c', 'embedded', 'firmware', 'mcu', 'rtos'],
      python: ['python', 'py', 'django', 'fastapi', 'flask', 'ai', 'data science', 'microservice'],
      react: ['react', 'reactjs', 'javascript', 'typescript', 'frontend', 'ui/ux', 'next.js'],
      nodejs: ['node', 'nodejs', 'express', 'backend', 'api', 'microservice'],
      devops: ['devops', 'docker', 'kubernetes', 'linux', 'ci/cd', 'cloud', 'aws'],
      java: ['java', 'spring', 'backend', 'microservice']
    };

    let expandedUserTechs = [];
    (learnedTechs || []).forEach(t => {
      expandedUserTechs.push(t.toLowerCase());
      if (techMap[t.toLowerCase()]) expandedUserTechs.push(...techMap[t.toLowerCase()]);
    });

    const hasLearnedRelevantTech = expandedUserTechs.some(u => combinedText.includes(u));
    const totalLessons = stats?.totalLessonsCompleted || 0;

    let matchRate = 50;
    let status = 'gap';
    let badgeText = I18n.t('mr50Title');
    let statusClass = 'match-gap';
    let fitRecommendation = I18n.t('mr50Desc');

    if (!hasLearnedRelevantTech) {
      if (isSenior) {
        matchRate = 15;
        status = 'target';
        badgeText = I18n.t('mrSeniorMismatchTitle');
        statusClass = 'match-target';
        fitRecommendation = I18n.t('mrSeniorMismatchDesc', { domain: matchedDomain.name });
      } else {
        matchRate = 25;
        status = 'target';
        badgeText = I18n.t('mrRoadmapIncompleteTitle', { domain: matchedDomain.name });
        statusClass = 'match-target';
        fitRecommendation = I18n.t('mrRoadmapIncompleteDesc', { domain: matchedDomain.name });
      }
      return { matchRate, status, badgeText, statusClass, fitRecommendation };
    }

    const isIntern = title.includes('intern') || title.includes('thực tập') || title.includes('trainee');
    const isFresher = title.includes('fresher') || title.includes('entry') || title.includes('graduate');
    const isJunior = title.includes('junior') || title.includes('associate');
    const isSenior = title.includes('senior') || title.includes('lead') || title.includes('principal') || title.includes('staff') || title.includes('head') || title.includes('manager');

    if (totalLessons < 15) {

      if (isIntern) {
        matchRate = 70;
        status = 'ready';
        badgeText = I18n.t('mrInternTitle');
        statusClass = 'match-ready';
        fitRecommendation = I18n.t('mrInternDesc');
      } else if (isFresher) {
        matchRate = 50;
        status = 'gap';
        badgeText = I18n.t('mrFresherNeedMoreTitle');
        statusClass = 'match-gap';
        fitRecommendation = I18n.t('mrFresherNeedMoreDesc', { n: totalLessons });
      } else if (isSenior) {
        matchRate = 15;
        status = 'target';
        badgeText = I18n.t('mrLongTermSeniorTitle');
        statusClass = 'match-target';
        fitRecommendation = I18n.t('mrLongTermSeniorDesc');
      } else {

        matchRate = 30;
        status = 'target';
        badgeText = I18n.t('mrLevelGapTitle');
        statusClass = 'match-target';
        fitRecommendation = I18n.t('mrLevelGapDesc');
      }
    } else if (totalLessons < 35) {

      if (isIntern) {
        matchRate = 95;
        status = 'ready';
        badgeText = I18n.t('mrInternStrongTitle');
        statusClass = 'match-ready';
        fitRecommendation = I18n.t('mrInternStrongDesc');
      } else if (isFresher) {
        matchRate = 85;
        status = 'ready';
        badgeText = I18n.t('mrFresherGreatTitle');
        statusClass = 'match-ready';
        fitRecommendation = I18n.t('mrFresherGreatDesc');
      } else if (isJunior) {
        matchRate = 75;
        status = 'ready';
        badgeText = I18n.t('mrJuniorReadyTitle');
        statusClass = 'match-ready';
        fitRecommendation = I18n.t('mrJuniorReadyDesc');
      } else if (isSenior) {
        matchRate = 30;
        status = 'target';
        badgeText = I18n.t('mrAdvancedTargetTitle');
        statusClass = 'match-target';
        fitRecommendation = I18n.t('mrAdvancedTargetDesc');
      } else {
        matchRate = 65;
        status = 'gap';
        badgeText = I18n.t('mrNeedProjectTitle');
        statusClass = 'match-gap';
        fitRecommendation = I18n.t('mrNeedProjectDesc');
      }
    } else {

      matchRate = isSenior ? 85 : 95;
      status = 'ready';
      badgeText = I18n.t('mrReadyTitle', { rate: matchRate });
      statusClass = 'match-ready';
      fitRecommendation = I18n.t('mrReadyDesc');
    }

    return { matchRate, status, badgeText, statusClass, fitRecommendation };
  }

  async function searchJobs(query, signal = null) {
    try {
      const { level, learnedTechs, stats } = await getUserLevelContext();
      const params = new URLSearchParams();
      params.set('search', query);
      params.set('lang', typeof I18n !== 'undefined' ? I18n.getLang() : 'vi');
      params.set('limit', '15');

      const fetchOptions = signal ? { signal } : {};
      const response = await fetch(`/api/jobs?${params.toString()}`, fetchOptions);
      if (!response.ok) {
        console.warn('[CareerAdvisor] Job API returned:', response.status);
        return [];
      }

      const data = await response.json();
      const rawJobs = data.jobs || [];

      const evaluatedJobs = rawJobs.map(job => {
        const evaluation = evaluateJobMatch(job, level, learnedTechs, stats);
        return {
          ...job,
          ...evaluation
        };
      });

      evaluatedJobs.sort((a, b) => b.matchRate - a.matchRate);
      return evaluatedJobs;
    } catch (err) {
      if (err.name === 'AbortError') return [];
      console.error('[CareerAdvisor] Job search error:', err);
      return [];
    }
  }

  async function loadChat() {
    try {
      if (typeof AuthService !== 'undefined') {
        const saved = await AuthService.loadCareerChat();
        if (saved && saved.length > 0) {
          chatHistory = saved;
          return saved.map(m => ({ role: m.role, content: m.content }));
        }
      }
    } catch (e) {
      console.warn('[CareerAdvisor] Could not load chat:', e);
    }
    return [];
  }

  async function clearChat() {
    abortMessage();
    chatHistory = [];
    try {
      if (typeof AuthService !== 'undefined') {
        await AuthService.saveCareerChat([]);
      }
    } catch (e) {}
  }

  function rewindChat(targetIdx) {
    abortMessage();
    if (targetIdx >= 0 && targetIdx < chatHistory.length) {
      chatHistory = chatHistory.slice(0, targetIdx);
    }
  }

  return {
    sendMessage,
    searchJobs,
    loadChat,
    clearChat,
    rewindChat,
    abortMessage,
    getUserLevelContext,
    getHistory: () => chatHistory,
    getIsLoading: () => isLoading
  };
})();
