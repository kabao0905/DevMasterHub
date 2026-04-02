// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — AI Career Advisor Service
// ═══════════════════════════════════════════════════════════════

const CareerAdvisor = (() => {
  let chatHistory = [];
  let isLoading = false;

  // ─── Build System Prompt with User Context ───
  async function buildSystemPrompt() {
    let userContext = 'Chưa có dữ liệu người dùng.';
    
    try {
      const stats = await AuthService.getUserStats();
      if (stats) {
        let parts = [];
        
        // Learning progress
        parts.push(`📚 Tổng bài học đã hoàn thành: ${stats.totalLessonsCompleted}`);
        parts.push(`⏱️ Tổng thời gian học: ${stats.totalTimeHours} giờ`);
        
        if (stats.techBreakdown.length > 0) {
          parts.push('\n🔧 Kỹ năng theo ngôn ngữ:');
          stats.techBreakdown.forEach(t => {
            const techName = CURRICULUM[t.tech]?.name || t.tech;
            parts.push(`  - ${techName}: ${t.completed} bài hoàn thành (cao nhất: ${t.highestLevel})`);
          });
        }

        // Project scores
        if (stats.projects && stats.projects.length > 0) {
          parts.push(`\n🏗️ Projects đã nộp: ${stats.projects.length}`);
          if (stats.averageProjectScore !== null) {
            parts.push(`📊 Điểm trung bình: ${stats.averageProjectScore}/100`);
          }
          stats.projects.slice(0, 5).forEach(p => {
            parts.push(`  - "${p.project_name}" (${p.difficulty_level || 'N/A'}): ${p.score_overall || '?'}/100`);
            if (p.ai_strengths?.length) parts.push(`    💪 Điểm mạnh: ${p.ai_strengths.join(', ')}`);
            if (p.ai_improvements?.length) parts.push(`    📈 Cần cải thiện: ${p.ai_improvements.join(', ')}`);
          });
        }

        userContext = parts.join('\n');
      }
    } catch (e) {
      console.warn('[CareerAdvisor] Could not load user stats:', e);
    }

    return `Bạn là AI Career Advisor chuyên nghiệp cho nền tảng học lập trình DevMaster Hub.

═══ HỒ SƠ NGƯỜI DÙNG ═══
${userContext}
═══════════════════════════

NHIỆM VỤ CỦA BẠN:
1. Phân tích trình độ thực tế của người dùng dựa trên dữ liệu trên
2. Đặt câu hỏi để hiểu rõ hơn về:
   - Mong muốn nghề nghiệp (frontend, backend, fullstack, mobile, DevOps, data, AI/ML...)
   - Kinh nghiệm thực tế (sinh viên, fresh graduate, đang chuyển ngành, đã có kinh nghiệm...)
   - Thị trường mong muốn (Việt Nam, remote global, hoặc cả hai)
   - Mức lương kỳ vọng
   - Điều kiện làm việc ưa thích (remote, hybrid, onsite)
3. Dựa trên tất cả thông tin → đưa ra lời khuyên CỤ THỂ:
   - Nên học thêm gì (ngôn ngữ, framework, kỹ năng)
   - Job titles phù hợp với trình độ hiện tại
   - Lộ trình phát triển (3 tháng, 6 tháng, 1 năm)
   - Tips cho CV và phỏng vấn
4. Khi user yêu cầu tìm việc → BẮT BUỘC dùng format đặc biệt (xem bên dưới)

═══ ⚠️ BẮT BUỘC: TÍNH NĂNG TÌM VIỆC THỰC TẾ ═══
Bạn CÓ KHẢ NĂNG search việc làm thật qua API. Đây KHÔNG phải role-play!

QUY TẮC SẮT ĐÁ - PHẢI TUÂN THỦ 100%:
Khi user nhắc đến BẤT KỲ từ khóa nào liên quan đến tìm/search/kiếm việc làm:
→ Dòng ĐẦU TIÊN TUYỆT ĐỐI của response PHẢI là: [SEARCH_JOBS: english keyword]
→ KHÔNG được viết BẤT CỨ GÌ trước [SEARCH_JOBS: ...]
→ keyword PHẢI bằng tiếng Anh cho API search

VÍ DỤ ĐÚNG:
User: "tìm việc react" → Response bắt đầu bằng: [SEARCH_JOBS: react developer]
User: "search python backend" → Response bắt đầu bằng: [SEARCH_JOBS: python backend]
User: "kiếm job devops" → Response bắt đầu bằng: [SEARCH_JOBS: devops engineer]
User: "tìm việc ở VinaCapital" → Response bắt đầu bằng: [SEARCH_JOBS: software developer]
User: "có công việc nào cho fresher không" → Response bắt đầu bằng: [SEARCH_JOBS: junior developer]
User: "job frontend" → Response bắt đầu bằng: [SEARCH_JOBS: frontend developer]

SAU dòng [SEARCH_JOBS: ...] → viết nhận xét, tips, thông tin thị trường cho vị trí đó.
Nếu user hỏi công ty CỤ THỂ → vẫn dùng [SEARCH_JOBS: job title] VÀ gợi ý thêm LinkedIn, TopCV, Glassdoor.

CÁC TỪ KHÓA KÍCH HOẠT SEARCH (bất kỳ từ nào xuất hiện → PHẢI dùng [SEARCH_JOBS:]):
tìm việc, search job, kiếm việc, tuyển dụng, công việc, vị trí, hiring,
job, work, position, vacancy, career opportunity, remote job, find job

NGUYÊN TẮC:
- Trả lời bằng tiếng Việt, thân thiện nhưng chuyên nghiệp
- Không hứa hẹn quá mức — thực tế và trung thực
- Nếu user chưa học đủ → khuyên học thêm trước khi apply
- Luôn khuyến khích và tạo động lực
- Mỗi lần KHÔNG hỏi quá 2 câu hỏi
- Dùng emoji cho sinh động
- Format bằng markdown khi cần`;
  }

  // ─── Send Message ───
  // IMPORTANT: app.js manages the display array (careerChatHistory).
  // This function does NOT push to any array - it only calls the API
  // and returns the result. app.js handles all state updates.
  async function sendMessage(userMessage) {
    if (isLoading) return null;
    isLoading = true;

    try {
      const systemPrompt = await buildSystemPrompt();
      
      // Build messages array for API call:
      // Use chatHistory (internal tracking) + the new user message
      const apiMessages = [...chatHistory, { role: 'user', content: userMessage }];
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: systemPrompt,
          messages: apiMessages.slice(-20),
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) throw new Error('AI service error');
      
      const data = await response.json();
      let aiText = data.content?.[0]?.text || 'Xin lỗi, tui không thể trả lời lúc này.';
      
      // ─── Auto-detect job search command from AI ───
      let autoSearchResults = null;
      let usedSearchKeyword = '';
      // Match [SEARCH_JOBS: ...] ANYWHERE in the response (not just at start)
      const searchMatch = aiText.match(/\[SEARCH_JOBS:\s*(.+?)\]/i);
      if (searchMatch) {
        usedSearchKeyword = searchMatch[1].trim();
        // Remove the tag from display (wherever it appears)
        aiText = aiText.replace(/\[SEARCH_JOBS:\s*.+?\]/i, '').trim();
        try {
          autoSearchResults = await searchJobs(usedSearchKeyword);
          if (autoSearchResults.length > 0) {
            aiText = `🔍 **Đã tìm thấy ${autoSearchResults.length} việc làm cho "${usedSearchKeyword}"!** (Vietnam + Remote) Xem kết quả bên dưới 👇\n\n` + aiText;
          } else {
            aiText = `🔍 Không tìm thấy kết quả cho "${usedSearchKeyword}" lúc này. Thử keyword khác nhé! 👇\n\n` + aiText;
          }
        } catch (e) {
          console.warn('[CareerAdvisor] Auto job search failed:', e);
        }
      } else {
        // ─── FALLBACK: Client-side intent detection ───
        const fallbackKeyword = detectJobSearchIntent(userMessage);
        if (fallbackKeyword) {
          usedSearchKeyword = fallbackKeyword;
          try {
            autoSearchResults = await searchJobs(fallbackKeyword);
            if (autoSearchResults.length > 0) {
              aiText += `\n\n🔍 **Mình đã tìm thêm ${autoSearchResults.length} việc làm cho "${fallbackKeyword}"!** (Vietnam + Remote) Xem bên dưới 👇`;
            }
          } catch (e) {
            console.warn('[CareerAdvisor] Fallback job search failed:', e);
          }
        }
      }
      
      // Update internal tracking (for next API call context)
      chatHistory = [...apiMessages, { role: 'assistant', content: aiText }];
      
      isLoading = false;
      return { text: aiText, jobs: autoSearchResults, searchKeyword: usedSearchKeyword };
    } catch (err) {
      isLoading = false;
      throw err;
    }
  }

  // ─── Detect job search intent from user message ───
  // Fallback when AI doesn't use [SEARCH_JOBS:] tag
  function detectJobSearchIntent(message) {
    const msg = message.toLowerCase();
    
    // Vietnamese + English trigger keywords
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
    
    // Extract search keyword from user message
    // Tech keywords mapping (Vietnamese → English search terms)
    const techKeywords = {
      'react': 'react developer', 'angular': 'angular developer', 'vue': 'vue developer',
      'node': 'nodejs developer', 'nodejs': 'nodejs developer', 'node.js': 'nodejs developer',
      'python': 'python developer', 'java': 'java developer', 'javascript': 'javascript developer',
      'typescript': 'typescript developer', 'c++': 'c++ developer', 'c#': 'csharp developer',
      'go': 'golang developer', 'golang': 'golang developer', 'rust': 'rust developer',
      'php': 'php developer', 'ruby': 'ruby developer', 'swift': 'swift developer',
      'kotlin': 'kotlin developer', 'flutter': 'flutter developer', 'dart': 'dart developer',
      'frontend': 'frontend developer', 'front-end': 'frontend developer', 'front end': 'frontend developer',
      'backend': 'backend developer', 'back-end': 'backend developer', 'back end': 'backend developer',
      'fullstack': 'fullstack developer', 'full-stack': 'fullstack developer', 'full stack': 'fullstack developer',
      'devops': 'devops engineer', 'sre': 'site reliability engineer',
      'data': 'data engineer', 'ml': 'machine learning engineer', 'ai': 'ai engineer',
      'mobile': 'mobile developer', 'ios': 'ios developer', 'android': 'android developer',
      'qa': 'qa engineer', 'test': 'qa engineer', 'tester': 'qa engineer',
      'security': 'security engineer', 'cloud': 'cloud engineer', 'aws': 'aws engineer',
      'data science': 'data scientist', 'data scientist': 'data scientist',
      'fresher': 'junior developer', 'junior': 'junior developer', 'senior': 'senior developer',
      'intern': 'software intern', 'thực tập': 'software intern',
      'designer': 'ui ux designer', 'ui/ux': 'ui ux designer', 'ui': 'ui designer',
    };
    
    // Check for tech keywords in message
    for (const [key, value] of Object.entries(techKeywords)) {
      if (msg.includes(key)) return value;
    }
    
    // Default: generic software developer search
    return 'software developer';
  }

  // ─── Search Jobs (JSearch API — supports Vietnam + Remote) ───
  async function searchJobs(query, location = '') {
    try {
      const params = new URLSearchParams();
      params.set('search', query);
      params.set('limit', '10');
      
      // Search Vietnam first, then remote as fallback
      const locations = location ? [location] : ['Vietnam', 'Remote'];
      let allJobs = [];
      
      for (const loc of locations) {
        params.set('location', loc);
        const response = await fetch(`/api/jobs?${params.toString()}`);
        if (!response.ok) continue;
        
        const data = await response.json();
        const jobs = data.jobs || [];
        
        // Tag jobs with their search location for display
        jobs.forEach(j => {
          if (!j._searchLocation) j._searchLocation = loc;
        });
        
        allJobs = allJobs.concat(jobs);
        
        // If we got enough results from VN, limit total
        if (allJobs.length >= 10) break;
      }
      
      // Deduplicate by URL
      const seen = new Set();
      allJobs = allJobs.filter(j => {
        if (seen.has(j.url)) return false;
        seen.add(j.url);
        return true;
      });
      
      return allJobs.slice(0, 15); // Max 15 results
    } catch (err) {
      console.error('[CareerAdvisor] Job search error:', err);
      return [];
    }
  }

  // ─── Load saved chat ───
  async function loadChat() {
    try {
      const saved = await AuthService.loadCareerChat();
      if (saved && saved.length > 0) {
        // Store internally for API context
        chatHistory = saved;
        // Return a DEEP COPY so app.js has its own independent array
        // This prevents shared-reference mutation bugs
        return saved.map(m => ({ role: m.role, content: m.content }));
      }
    } catch (e) {
      console.warn('[CareerAdvisor] Could not load chat:', e);
    }
    return [];
  }

  // ─── Clear chat ───
  async function clearChat() {
    chatHistory = [];
    try {
      await AuthService.saveCareerChat([]);
    } catch (e) {}
  }

  // ─── Getters ───
  function getHistory() { return chatHistory; }
  function getIsLoading() { return isLoading; }

  return {
    sendMessage,
    searchJobs,
    loadChat,
    clearChat,
    getHistory,
    getIsLoading
  };
})();
