// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Auth Service (Supabase)
// ═══════════════════════════════════════════════════════════════

const AuthService = (() => {
  // ─── Supabase Config ───
  // Replace these with your Supabase project values
  const SUPABASE_URL = 'https://nlkljhpqwepabglrqkmz.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_0s-SglEeMENWRqgbC2QWuQ_w0pzWJMe';

  let supabase = null;
  let currentUser = null;
  let authListeners = [];

  // ─── Initialize ───
  function init() {
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.error('[Auth] Supabase SDK not loaded');
      return false;
    }
    if (SUPABASE_URL.includes('%%')) {
      console.warn('[Auth] Supabase not configured yet. Set URL and Key in auth-service.js');
      return false;
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;
      authListeners.forEach(cb => cb(event, currentUser));
    });
    
    return true;
  }

  // ─── Check if configured ───
  function isConfigured() {
    return supabase !== null;
  }

  // ─── Register (username + password) ───
  // We use email auth under the hood: username@devmaster.hub
  async function register(username, password) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    // Validate
    username = username.trim().toLowerCase();
    if (username.length < 3) throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự');
    if (username.length > 20) throw new Error('Tên đăng nhập tối đa 20 ký tự');
    if (!/^[a-z0-9_]+$/.test(username)) throw new Error('Tên đăng nhập chỉ chứa chữ thường, số và dấu _');
    if (password.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự');

    const email = `${username}@devmaster.hub`;
    
    // Check if username exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    
    if (existing) throw new Error('Tên đăng nhập đã tồn tại');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: username }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Tên đăng nhập đã tồn tại');
      }
      throw new Error(error.message);
    }

    // Create profile
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username: username,
        display_name: username,
        created_at: new Date().toISOString()
      });
    }

    return data.user;
  }

  // ─── Login ───
  async function login(username, password) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    username = username.trim().toLowerCase();
    const email = `${username}@devmaster.hub`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes('Invalid login')) {
        throw new Error('Sai tên đăng nhập hoặc mật khẩu');
      }
      throw new Error(error.message);
    }

    return data.user;
  }

  // ─── Logout ───
  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
  }

  // ─── Get Current User ───
  function getUser() {
    return currentUser;
  }

  // ─── Get Session ───
  async function getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  // ─── Listen for auth changes ───
  function onAuthChange(callback) {
    authListeners.push(callback);
  }

  // ─── Get Profile ───
  async function getProfile() {
    if (!supabase || !currentUser) return null;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    return data;
  }

  // ─── Update Profile ───
  async function updateProfile(updates) {
    if (!supabase || !currentUser) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  // ═══════════════════════════════════════════════════
  // DATA SYNC — Progress, Projects, Ideas
  // ═══════════════════════════════════════════════════

  // ─── Lesson Progress ───
  async function loadProgress() {
    if (!supabase || !currentUser) return {};
    const { data } = await supabase
      .from('lesson_progress')
      .select('tech_id, level_id, lesson_id, completed, time_spent_seconds')
      .eq('user_id', currentUser.id);
    
    // Convert to the format app.js expects: { "techId.levelId.lessonId": true }
    const progress = {};
    if (data) {
      data.forEach(row => {
        if (row.completed) {
          const key = `${row.tech_id}.${row.level_id}.${row.lesson_id}`;
          progress[key] = true;
        }
      });
    }
    return progress;
  }

  async function saveProgress(progress) {
    if (!supabase || !currentUser) return;
    
    const upserts = Object.entries(progress).map(([key, completed]) => {
      const [tech_id, level_id, lesson_id] = key.split('.');
      return {
        user_id: currentUser.id,
        tech_id,
        level_id,
        lesson_id,
        completed: !!completed,
        completed_at: completed ? new Date().toISOString() : null
      };
    });
    
    if (upserts.length > 0) {
      await supabase
        .from('lesson_progress')
        .upsert(upserts, { onConflict: 'user_id,tech_id,level_id,lesson_id' });
    }
  }

  async function markLessonComplete(techId, levelId, lessonId, completed) {
    if (!supabase || !currentUser) return;
    await supabase.from('lesson_progress').upsert({
      user_id: currentUser.id,
      tech_id: techId,
      level_id: levelId,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    }, { onConflict: 'user_id,tech_id,level_id,lesson_id' });
  }

  // ─── Learning Sessions (time tracking) ───
  let activeSession = null;

  async function startLearningSession(techId, lessonId) {
    if (!supabase || !currentUser) return;
    const { data } = await supabase.from('learning_sessions').insert({
      user_id: currentUser.id,
      tech_id: techId,
      lesson_id: lessonId,
      started_at: new Date().toISOString()
    }).select().single();
    activeSession = data;
  }

  async function endLearningSession() {
    if (!supabase || !currentUser || !activeSession) return;
    const now = new Date();
    const started = new Date(activeSession.started_at);
    const durationSeconds = Math.floor((now - started) / 1000);
    
    await supabase.from('learning_sessions').update({
      ended_at: now.toISOString(),
      duration_seconds: durationSeconds
    }).eq('id', activeSession.id);
    
    // Also update total time on lesson_progress
    await supabase.rpc('increment_time_spent', {
      p_user_id: currentUser.id,
      p_tech_id: activeSession.tech_id,
      p_lesson_id: activeSession.lesson_id,
      p_seconds: durationSeconds
    }).catch(() => {}); // ignore if RPC doesn't exist yet
    
    activeSession = null;
  }

  // ─── Project Submissions ───
  async function saveProjectSubmission(submission) {
    if (!supabase || !currentUser) return null;
    const { data, error } = await supabase.from('project_submissions').insert({
      user_id: currentUser.id,
      project_name: submission.projectName,
      project_description: submission.projectDescription,
      difficulty_level: submission.difficultyLevel,
      topic: submission.topic,
      files: submission.files,
      review: submission.review,
      score_overall: submission.scoreOverall,
      score_code_quality: submission.scoreCodeQuality,
      score_functionality: submission.scoreFunctionality,
      score_best_practices: submission.scoreBestPractices,
      score_creativity: submission.scoreCreativity,
      ai_feedback: submission.aiFeedback,
      ai_strengths: submission.aiStrengths || [],
      ai_improvements: submission.aiImprovements || [],
      languages_used: submission.languagesUsed || []
    }).select().single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async function getProjectSubmissions() {
    if (!supabase || !currentUser) return [];
    const { data } = await supabase
      .from('project_submissions')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('submitted_at', { ascending: false });
    return data || [];
  }

  async function getProjectSummaries() {
    // For Career Advisor: only idea + scores, NOT code
    if (!supabase || !currentUser) return [];
    const { data } = await supabase
      .from('project_submissions')
      .select('project_name, project_description, difficulty_level, topic, score_overall, score_code_quality, score_functionality, score_best_practices, score_creativity, ai_feedback, ai_strengths, ai_improvements, languages_used, submitted_at')
      .eq('user_id', currentUser.id)
      .order('submitted_at', { ascending: false });
    return data || [];
  }

  // ─── Saved Ideas ───
  async function loadSavedIdeas() {
    if (!supabase || !currentUser) return [];
    const { data } = await supabase
      .from('saved_ideas')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('saved_at', { ascending: false });
    return data || [];
  }

  async function saveIdea(idea) {
    if (!supabase || !currentUser) return;
    await supabase.from('saved_ideas').upsert({
      id: idea.id,
      user_id: currentUser.id,
      idea: idea.idea,
      source: idea.source,
      topic: idea.topic,
      level: idea.level,
      saved_at: idea.savedAt
    });
  }

  async function deleteIdea(ideaId) {
    if (!supabase || !currentUser) return;
    await supabase.from('saved_ideas').delete().eq('id', ideaId).eq('user_id', currentUser.id);
  }

  // ─── Career Chat ───
  async function loadCareerChat() {
    if (!supabase || !currentUser) return [];
    const { data } = await supabase
      .from('career_chats')
      .select('messages')
      .eq('user_id', currentUser.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.messages || [];
  }

  async function saveCareerChat(messages) {
    if (!supabase || !currentUser) return;
    // Upsert: one chat per user
    await supabase.from('career_chats').upsert({
      user_id: currentUser.id,
      messages,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  }

  // ─── Stats for Career Advisor ───
  async function getUserStats() {
    if (!supabase || !currentUser) return null;
    
    const [progressData, sessionsData, projectData] = await Promise.all([
      supabase.from('lesson_progress').select('tech_id, level_id, lesson_id, completed, time_spent_seconds').eq('user_id', currentUser.id),
      supabase.from('learning_sessions').select('tech_id, duration_seconds').eq('user_id', currentUser.id),
      getProjectSummaries()
    ]);

    const progress = progressData.data || [];
    const sessions = sessionsData.data || [];

    // Aggregate stats
    const completedLessons = progress.filter(p => p.completed);
    const techMap = {};
    completedLessons.forEach(p => {
      if (!techMap[p.tech_id]) techMap[p.tech_id] = { completed: 0, levels: new Set() };
      techMap[p.tech_id].completed++;
      techMap[p.tech_id].levels.add(p.level_id);
    });

    const totalTimeSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const totalTimeHours = Math.round(totalTimeSeconds / 3600 * 10) / 10;

    return {
      totalLessonsCompleted: completedLessons.length,
      totalTimeHours,
      techBreakdown: Object.entries(techMap).map(([tech, info]) => ({
        tech,
        completed: info.completed,
        highestLevel: getBestLevel([...info.levels])
      })),
      projects: projectData,
      averageProjectScore: projectData.length > 0 
        ? Math.round(projectData.reduce((s, p) => s + (p.score_overall || 0), 0) / projectData.length) 
        : null
    };
  }

  function getBestLevel(levels) {
    const order = ['master', 'senior', 'mid', 'junior', 'newbie'];
    for (const l of order) {
      if (levels.includes(l)) return l;
    }
    return levels[0] || 'newbie';
  }

  // ─── Get Supabase client (for advanced queries) ───
  function getClient() {
    return supabase;
  }

  return {
    init,
    isConfigured,
    register,
    login,
    logout,
    getUser,
    getSession,
    onAuthChange,
    getProfile,
    updateProfile,
    // Data sync
    loadProgress,
    saveProgress,
    markLessonComplete,
    startLearningSession,
    endLearningSession,
    // Projects
    saveProjectSubmission,
    getProjectSubmissions,
    getProjectSummaries,
    // Ideas
    loadSavedIdeas,
    saveIdea,
    deleteIdea,
    // Career
    loadCareerChat,
    saveCareerChat,
    getUserStats,
    // Utils
    getClient
  };
})();
