const I18n = (() => {
  const STORAGE_KEY = 'devmaster_hub_lang';

  const LANGUAGES = {
    vi: { name: 'Tiếng Việt', flag: '🇻🇳', code: 'vi' },
    en: { name: 'English', flag: '🇬🇧', code: 'en' },
    ja: { name: '日本語', flag: '🇯🇵', code: 'ja' },
    ko: { name: '한국어', flag: '🇰🇷', code: 'ko' },
    zh: { name: '中文', flag: '🇨🇳', code: 'zh' },
    fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
    de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
    es: { name: 'Español', flag: '🇪🇸', code: 'es' }
  };

  const translations = {
  "vi": {
    "tutorHeader": "Hỏi Gia sư AI về",
    "tutorWelcome": "Hỏi AI bất cứ điều gì về phần này!",
    "explainSimply": "Giải thích đơn giản phần này cho mình",
    "explainSimplyBtn": "Giải thích đơn giản",
    "moreExamples": "Cho mình thêm ví dụ minh họa thực tế",
    "moreExamplesBtn": "Thêm ví dụ",
    "keyTakeaways": "Điểm mấu chốt quan trọng nhất cần nhớ là gì?",
    "keyTakeawaysBtn": "Phần quan trọng nhất?",
    "askAiPlaceholder": "Hỏi AI về bài học...",
    "thinking": "Đang suy nghĩ",
    "clearLessonChat": "🗑️ Xóa hội thoại",
    "tabLabelTheory": "Lý thuyết",
    "tabLabelCode": "Code ví dụ",
    "tabLabelQuiz": "Bài trắc nghiệm",
    "tabLabelExercise": "Bài tập thực hành",
    "dashboard": "Dashboard",
    "projectLab": "Project Lab",
    "myProjects": "Dự án của tôi",
    "careerAdvisor": "Tư vấn Việc làm",
    "technologies": "Lộ trình Công nghệ",
    "logout": "Đăng xuất",
    "aiOnline": "AI: Sẵn sàng",
    "aiOffline": "AI: Ngoại tuyến",
    "langSwitch": "Ngôn ngữ",
    "dashboardTitle": "🚀 Dashboard",
    "dashboardSubtitle": "Lộ trình học lập trình từ Newbie đến Master",
    "searchPlaceholder": "Tìm kiếm bài học, công nghệ, khái niệm...",
    "statTech": "Công nghệ",
    "statLessons": "Bài học",
    "statCompleted": "Hoàn thành",
    "statProgress": "Tiến độ",
    "lessonsUnit": "bài học",
    "levelsUnit": "cấp độ",
    "catLanguages": "💻 Ngôn ngữ lập trình",
    "catFrontend": "🎨 Frontend Development",
    "catBackend": "⚙️ Backend & API",
    "catMobile": "📱 Lập trình Di động & Cross-Platform",
    "catTools": "🔧 Tools, DevOps & DSA",
    "back": "Quay lại",
    "backToRoadmap": "← Quay lại Lộ trình",
    "markComplete": "⬜ Đánh dấu hoàn thành",
    "completed": "✅ Đã hoàn thành",
    "tabTheory": "Lý thuyết",
    "tabCode": "Code Lab",
    "tabQuiz": "Trắc nghiệm Quiz",
    "tabExercise": "Bài tập Thử thách",
    "keyPoints": "🔑 Điểm chính",
    "runCode": "▶ Chạy Code",
    "running": "Đang chạy...",
    "submitQuiz": "Nộp bài Quiz",
    "checkCode": "🤖 AI Chấm bài",
    "checking": "Đang chấm...",
    "showHints": "💡 Gợi ý",
    "showSolution": "🔓 Xem đáp án",
    "clearCode": "Xóa code",
    "nextLesson": "Bài tiếp theo →",
    "prevLesson": "← Bài trước",
    "searchFound": "Tìm thấy {n} kết quả",
    "noSearchResults": "Không tìm thấy kết quả phù hợp cho \"{q}\"",
    "careerTitle": "💼 AI Career Advisor & Cố vấn Việc làm IT",
    "careerSubtitle": "Tư vấn định hướng nghề nghiệp, đánh giá thực lực và kết nối việc làm thực tế theo hồ sơ học tập.",
    "searchJobsPlaceholder": "Nhập câu hỏi hoặc kể về mong muốn nghề nghiệp của bạn...",
    "searchJobsBtn": "Tìm việc làm",
    "sendMsg": "Gửi",
    "clearChat": "Xóa chat",
    "editQuestion": "✏️ Sửa câu hỏi",
    "regenerateAnswer": "🔄 Trả lời lại",
    "jobsSuggestedBar": "Việc làm AI gợi ý",
    "autoTriggerChat": "Tự động kích hoạt khi chat",
    "openJobList": "▶ Bấm để mở danh sách",
    "collapseJobList": "▲ Thu gọn danh sách (quay lại chat)",
    "noJobsFound": "Chưa có việc làm nào (Hãy chat để AI tự động tìm việc)",
    "viewJobs": "Bấm để mở danh sách",
    "collapseJobs": "Thu gọn danh sách (quay lại chat)",
    "applyNow": "Nộp CV / Ứng tuyển ngay →",
    "projectLabTitle": "Project Lab",
    "projectLabSubtitle": "Thực hành qua project thực tế. AI sẽ gợi ý idea, hướng dẫn, và chấm điểm project của bạn.",
    "byLevelTitle": "Theo Cấp Độ",
    "byLevelDesc": "Chọn mức Newbie → Master. AI sẽ gợi ý project phù hợp với trình độ của bạn.",
    "byTopicTitle": "Theo Chủ Đề",
    "byTopicDesc": "Nhập chủ đề bạn muốn (game, web, API...). AI sẽ thiết kế project theo ý bạn.",
    "savedIdeasTitle": "Idea Đã Lưu",
    "savedIdeasDesc": "Xem lại các idea đã bookmark để quay lại làm sau.",
    "startBtn": "Bắt đầu →",
    "viewSavedBtn": "Xem {n} idea →",
    "noSavedIdeasYet": "Chưa có idea nào được lưu.",
    "createIdeaByTopicBtn": "📝 Tạo Idea theo chủ đề",
    "backToProjectLab": "← Quay lại Project Lab",
    "byLevelHeader": "📊 Project theo Cấp Độ",
    "byLevelHeaderDesc": "Chọn cấp độ để nhận idea project phù hợp",
    "byTopicHeader": "📝 Project theo Chủ Đề",
    "byTopicHeaderDesc": "Nhập chủ đề bạn muốn, AI sẽ thiết kế project cho bạn",
    "topicInputPlaceholder": "VD: Game rắn săn mồi, Blog cá nhân, API quản lý sinh viên...",
    "generateIdeaBtn": "Tạo Idea",
    "newIdeaBtn": "Idea mới",
    "saveIdeaBtn": "Lưu Idea",
    "savedIdeaSuccess": "✅ Đã lưu",
    "myProjectsTitle": "My Projects",
    "myProjectsSubtitle": "Xem lại tất cả project đã nộp và kết quả AI review",
    "noProjectsYet": "Chưa có project nào được nộp. Hãy vào Project Lab để bắt đầu!",
    "myProjectsBreadcrumb": "Dashboard › 📁 My Projects",
    "overallScore": "Tổng điểm",
    "codeQuality": "Chất lượng code",
    "functionality": "Chức năng",
    "bestPractices": "Chuẩn quy ước",
    "creativity": "Sáng tạo",
    "aiFeedback": "💬 Nhận xét của AI Mentor",
    "strengths": "💪 Điểm mạnh",
    "improvements": "📈 Cần cải thiện",
    "requirementsTitle": "📋 Yêu cầu",
    "stepsTitle": "📝 Các bước thực hiện",
    "bonusFeaturesTitle": "⭐ Tính năng nâng cao (Bonus)",
    "chatWithAiMentor": "💬 Chat với AI Mentor",
    "askAiAboutProject": "Hỏi AI bất cứ điều gì về project này...",
    "startThisProject": "🚀 Bắt đầu làm Project này →",
    "newIdea": "🔄 Đổi Idea khác",
    "authLogin": "Đăng nhập",
    "authRegister": "Đăng ký",
    "authUsername": "Tên đăng nhập",
    "authUsernamePlaceholder": "vd: devmaster2025",
    "authPassword": "Mật khẩu",
    "authPasswordPlaceholder": "Ít nhất 6 ký tự",
    "authConfirmPassword": "Nhập lại mật khẩu",
    "authSubtitle": "Nền tảng học lập trình từ Newbie đến Master",
    "levelNewbie": "Cơ bản",
    "levelJunior": "Nền tảng",
    "levelMid": "Trung cấp",
    "levelSenior": "Nâng cao",
    "levelMaster": "Chuyên gia",
    "hideHints": "🙈 Ẩn gợi ý",
    "showHintsBtn": "💡 Xem gợi ý",
    "hideSolution": "🙈 Ẩn solution",
    "showSolutionBtn": "👀 Xem solution mẫu",
    "answerPlaceholder": "Viết code hoặc đáp án ở đây...",
    "writeCodeFirst": "Vui lòng viết code trước khi chạy thử!",
    "noContent": "Chưa có nội dung",
    "ideaAlreadySaved": "💡 Idea này đã được lưu trước đó rồi!",
    "ideaSavedShort": "Đã lưu!",
    "noContentAvailable": "Chưa có nội dung",
    "knowledgeCheck": "Kiểm tra kiến thức",
    "generateQuizAi": "Tạo Quiz với AI",
    "codeExample": "Mã ví dụ",
    "copyCode": "📋 Sao chép",
    "noCodeExample": "Chưa có mã ví dụ cho bài học này.",
    "answerCorrect": "✅ Đúng",
    "answerWrong": "❌ Sai",
    "scoreExcellent": "Xuất sắc!",
    "scoreGood": "Khá tốt!",
    "scoreNeedsReview": "Cần ôn lại!",
    "originalExercise": "Bài tập gốc",
    "noExerciseYet": "Chưa có bài tập cho bài này.",
    "savedIdeasCount": "Bạn có <strong>{n}</strong> idea đã lưu.",
    "clickBelowForIdea": "Nhấn nút bên dưới để AI tạo idea project cấp <strong>{level}</strong>",
    "readyTitle": "Sẵn sàng!",
    "aiSelects": "AI tự chọn",
    "createIdeaThenSave": "Tạo project idea rồi nhấn nút \"💾 Lưu Idea\" để bookmark lại nhé!",
    "topicLabel": "Chủ đề",
    "deleteIdeaConfirm": "Xóa idea này?",
    "aiGeneratingLevelIdea": "AI đang tạo idea project cấp <strong>{level}</strong>...",
    "aiGeneratingTopicIdea": "AI đang tạo idea cho chủ đề \"<strong>{topic}</strong>\"...",
    "pasteCodeHere": "Paste code file {file} ở đây...",
    "fillAllFields": "Vui lòng điền đầy đủ thông tin",
    "passwordMismatch": "Mật khẩu không khớp",
    "loggingIn": "Đang đăng nhập...",
    "registering": "Đang đăng ký...",
    "logoutConfirm": "Bạn muốn đăng xuất?",
    "thinkingShort": "Đang suy nghĩ",
    "jobSearchPlaceholder2": "Tìm việc gì? (vd: React developer, Python backend)",
    "clearCareerChatConfirm": "Xóa toàn bộ lịch sử chat tư vấn?",
    "askAboutProject": "Hỏi về project...",
    "explainSimplyMsg": "Giải thích đơn giản phần này cho mình",
    "moreExamplesMsg": "Cho mình thêm ví dụ",
    "submitted": "ĐÃ NỘP BÀI",
    "notSubmitted": "CHƯA NỘP",
    "deleteFile": "Xóa file",
    "addFile": "Thêm file",
    "fileNamePlaceholder": "Tên file...",
    "homeBreadcrumb": "Trang chủ",
    "mr50Title": "🟡 50% Cần Bổ Sung Kỹ Năng",
    "mr50Desc": "Cần học thêm các bài học chuyên môn để đáp ứng yêu cầu tuyển dụng.",
    "mrSeniorMismatchTitle": "🔴 15% Vị Trí Senior (Khác Chuyên Môn)",
    "mrSeniorMismatchDesc": "Vị trí yêu cầu chuyên sâu về {domain}. Bạn chưa hoàn thành lộ trình này trên DevMaster Hub.",
    "mrRoadmapIncompleteTitle": "🔴 25% Chưa Học Lộ Trình {domain}",
    "mrRoadmapIncompleteDesc": "Hồ sơ của bạn chưa có kỹ năng về {domain}. Hãy học thêm lộ trình này trên DevMaster Hub!",
    "mrInternTitle": "🟢 70% Phù Hợp Thực Tập (Intern)",
    "mrInternDesc": "Bạn đã nắm kiến thức cơ bản, đủ điều kiện ứng tuyển Thực tập sinh để vừa học vừa làm!",
    "mrFresherNeedMoreTitle": "🟡 50% Cần Học Thêm 10-15 Bài (Fresher)",
    "mrFresherNeedMoreDesc": "Bạn mới học {n} bài cơ bản. Cần hoàn thành thêm OOP, cấu trúc dữ liệu và 1 mini-project trước khi ứng tuyển Fresher.",
    "mrLongTermSeniorTitle": "🔴 15% Mục Tiêu Dài Hạn (Senior)",
    "mrLongTermSeniorDesc": "Vị trí chuyên gia đòi hỏi nhiều năm kinh nghiệm thực chiến.",
    "mrLevelGapTitle": "🔴 30% Chưa Đủ Trình Độ (Kỹ Sư Chính Thức)",
    "mrLevelGapDesc": "Vị trí kỹ sư chính thức đòi hỏi nắm vững OOP, con trỏ, cấu trúc dữ liệu và kinh nghiệm dự án thực tế.",
    "mrInternStrongTitle": "🟢 95% Dư Sức Ứng Tuyển (Intern)",
    "mrInternStrongDesc": "Nền tảng của bạn rất tốt cho vị trí thực tập!",
    "mrFresherGreatTitle": "🟢 85% Rất Phù Hợp (Fresher)",
    "mrFresherGreatDesc": "Kiến thức hiện tại rất phù hợp cho vị trí Fresher!",
    "mrJuniorReadyTitle": "🟢 75% Sẵn Sàng Ứng Tuyển (Junior)",
    "mrJuniorReadyDesc": "Tự tin nộp CV kèm các project bạn đã làm trên DevMaster Hub!",
    "mrAdvancedTargetTitle": "🔴 30% Mục Tiêu Nâng Cao (Senior)",
    "mrAdvancedTargetDesc": "Cần tích lũy thêm 1-2 năm kinh nghiệm thực tế.",
    "mrNeedProjectTitle": "🟡 65% Cần Chuẩn Bị Project",
    "mrNeedProjectDesc": "Khá phù hợp, hãy hoàn thành thêm 1 project thực tế để tăng cơ hội trúng tuyển.",
    "mrReadyTitle": "🟢 {rate}% Sẵn Sàng Ứng Tuyển",
    "mrReadyDesc": "Kỹ năng của bạn đáp ứng tốt yêu cầu công việc.",
    "challengeNav": "Thử thách",
    "challengeTitle": "🚩 Thử thách Linux & An ninh mạng",
    "challengeSubtitle": "Luyện lệnh Linux trên terminal ảo và săn cờ FLAG. Bấm nút bên dưới để AI ra đề mới.",
    "aiChallengeTitle": "Đề bài do AI ra",
    "aiChallengeHint": "Mỗi lần bấm là một đề khác, làm được bằng các lệnh Linux cơ bản.",
    "aiChallengeBtn": "Ra đề mới",
    "aiChallengeLoading": "AI đang nghĩ đề…",
    "aiChallengeBad": "AI trả lời không đúng định dạng. Bấm 'Ra đề mới' để thử lại.",
    "needLogin": "Bạn cần đăng nhập để dùng tính năng này.",
    "aiBusy": "AI đang bận, thử lại sau ít phút.",
    "challengeEntryHint": "Luyện lệnh Linux trên terminal ảo và săn cờ FLAG"
  },
  "en": {
    "tutorHeader": "Ask AI Tutor about",
    "tutorWelcome": "Ask AI anything about this section!",
    "explainSimply": "Explain this section in simple terms for me",
    "explainSimplyBtn": "Explain simply",
    "moreExamples": "Give me more practical code examples",
    "moreExamplesBtn": "More examples",
    "keyTakeaways": "What is the key takeaway to remember?",
    "keyTakeawaysBtn": "Key takeaways?",
    "askAiPlaceholder": "Ask AI about this lesson...",
    "thinking": "Thinking",
    "clearLessonChat": "🗑️ Clear chat",
    "tabLabelTheory": "Theory",
    "tabLabelCode": "Code Example",
    "tabLabelQuiz": "Quiz",
    "tabLabelExercise": "Exercise",
    "dashboard": "Dashboard",
    "projectLab": "Project Lab",
    "myProjects": "My Projects",
    "careerAdvisor": "Career Advisor",
    "technologies": "Tech Roadmaps",
    "logout": "Sign Out",
    "aiOnline": "AI: Ready",
    "aiOffline": "AI: Offline",
    "langSwitch": "Language",
    "dashboardTitle": "🚀 Dashboard",
    "dashboardSubtitle": "Learning path from Newbie to Master Developer",
    "searchPlaceholder": "Search lessons, technologies, concepts...",
    "statTech": "Technologies",
    "statLessons": "Lessons",
    "statCompleted": "Completed",
    "statProgress": "Progress",
    "lessonsUnit": "lessons",
    "levelsUnit": "levels",
    "catLanguages": "💻 Programming Languages",
    "catFrontend": "🎨 Frontend Development",
    "catBackend": "⚙️ Backend & API",
    "catMobile": "📱 Mobile Development",
    "catTools": "🔧 Tools, DevOps & DSA",
    "back": "Back",
    "backToRoadmap": "← Back to Roadmap",
    "markComplete": "⬜ Mark as Completed",
    "completed": "✅ Completed",
    "tabTheory": "Theory",
    "tabCode": "Code Lab",
    "tabQuiz": "Quiz Challenge",
    "tabExercise": "Coding Exercises",
    "keyPoints": "🔑 Key Takeaways",
    "runCode": "▶ Run Code",
    "running": "Executing...",
    "submitQuiz": "Submit Quiz",
    "checkCode": "🤖 AI Review Code",
    "checking": "Reviewing...",
    "showHints": "💡 Hints",
    "showSolution": "🔓 View Solution",
    "clearCode": "Clear Code",
    "nextLesson": "Next Lesson →",
    "prevLesson": "← Previous Lesson",
    "searchFound": "Found {n} results",
    "noSearchResults": "No matching results found for \"{q}\"",
    "careerTitle": "💼 AI Career Advisor & Job Matcher",
    "careerSubtitle": "Personalized career guidance, realistic skill assessments, and live job matching based on your learning stats.",
    "searchJobsPlaceholder": "Ask a career question or describe your dream tech job...",
    "searchJobsBtn": "Search Jobs",
    "sendMsg": "Send",
    "clearChat": "Clear Chat",
    "editQuestion": "✏️ Edit Question",
    "regenerateAnswer": "🔄 Regenerate Answer",
    "jobsSuggestedBar": "AI Recommended Jobs",
    "autoTriggerChat": "Auto-triggered during chat",
    "openJobList": "▶ Click to open job list",
    "collapseJobList": "▲ Collapse list (back to chat)",
    "noJobsFound": "No jobs yet (Chat with AI to discover matching jobs)",
    "viewJobs": "Click to view matching jobs",
    "collapseJobs": "Collapse job list (back to chat)",
    "applyNow": "Submit Application →",
    "projectLabTitle": "Project Lab",
    "projectLabSubtitle": "Hands-on practice with real projects. AI suggests ideas, guides code, and reviews your projects.",
    "byLevelTitle": "By Difficulty Level",
    "byLevelDesc": "Choose from Newbie → Master. AI will generate project ideas tailored to your skill level.",
    "byTopicTitle": "By Custom Topic",
    "byTopicDesc": "Enter any topic you like (games, web apps, APIs...). AI will design a complete project for you.",
    "savedIdeasTitle": "Saved Ideas",
    "savedIdeasDesc": "Review bookmarked project ideas to work on later.",
    "startBtn": "Start →",
    "viewSavedBtn": "View {n} ideas →",
    "noSavedIdeasYet": "No bookmarked ideas yet.",
    "createIdeaByTopicBtn": "📝 Generate Idea by Topic",
    "backToProjectLab": "← Back to Project Lab",
    "byLevelHeader": "📊 Projects by Level",
    "byLevelHeaderDesc": "Select a difficulty level to get tailored project ideas",
    "byTopicHeader": "📝 Projects by Topic",
    "byTopicHeaderDesc": "Enter your preferred topic and AI will design a custom project",
    "topicInputPlaceholder": "e.g. Snake Game, Personal Blog, Student Management API...",
    "generateIdeaBtn": "Generate Idea",
    "newIdeaBtn": "New Idea",
    "saveIdeaBtn": "Save Idea",
    "savedIdeaSuccess": "✅ Saved",
    "myProjectsTitle": "My Projects",
    "myProjectsSubtitle": "Review all submitted projects and AI mentor feedback scores",
    "noProjectsYet": "No projects submitted yet. Visit Project Lab to get started!",
    "myProjectsBreadcrumb": "Dashboard › 📁 My Projects",
    "overallScore": "Overall Score",
    "codeQuality": "Code Quality",
    "functionality": "Functionality",
    "bestPractices": "Best Practices",
    "creativity": "Creativity",
    "aiFeedback": "💬 AI Mentor Feedback",
    "strengths": "💪 Strengths",
    "improvements": "📈 Areas to Improve",
    "requirementsTitle": "📋 Requirements",
    "stepsTitle": "📝 Implementation Steps",
    "bonusFeaturesTitle": "⭐ Bonus Features",
    "chatWithAiMentor": "💬 Chat with AI Mentor",
    "askAiAboutProject": "Ask AI anything about this project...",
    "startThisProject": "🚀 Start This Project →",
    "newIdea": "🔄 New Idea",
    "authLogin": "Sign In",
    "authRegister": "Sign Up",
    "authUsername": "Username",
    "authUsernamePlaceholder": "e.g. devmaster2025",
    "authPassword": "Password",
    "authPasswordPlaceholder": "At least 6 characters",
    "authConfirmPassword": "Confirm password",
    "authSubtitle": "Developer learning platform from Newbie to Master",
    "levelNewbie": "Beginner",
    "levelJunior": "Foundational",
    "levelMid": "Intermediate",
    "levelSenior": "Advanced",
    "levelMaster": "Expert",
    "hideHints": "🙈 Hide hints",
    "showHintsBtn": "💡 Show hints",
    "hideSolution": "🙈 Hide solution",
    "showSolutionBtn": "👀 View sample solution",
    "answerPlaceholder": "Write your code or answer here...",
    "writeCodeFirst": "Please write some code before running it!",
    "noContent": "No content yet",
    "ideaAlreadySaved": "💡 This idea was already saved!",
    "ideaSavedShort": "Saved!",
    "noContentAvailable": "No content available",
    "knowledgeCheck": "Knowledge Assessment",
    "generateQuizAi": "Generate Quiz with AI",
    "codeExample": "Code Example",
    "copyCode": "📋 Copy",
    "noCodeExample": "No code example available for this lesson.",
    "answerCorrect": "✅ Correct",
    "answerWrong": "❌ Incorrect",
    "scoreExcellent": "Excellent!",
    "scoreGood": "Good job!",
    "scoreNeedsReview": "Needs review!",
    "originalExercise": "Original Exercise",
    "noExerciseYet": "No exercises available for this lesson.",
    "savedIdeasCount": "You have <strong>{n}</strong> saved ideas.",
    "clickBelowForIdea": "Click below for AI to generate a level <strong>{level}</strong> project idea",
    "readyTitle": "Ready!",
    "aiSelects": "AI Selects",
    "createIdeaThenSave": "Create a project idea and click \"💾 Save Idea\" to bookmark it!",
    "topicLabel": "Topic",
    "deleteIdeaConfirm": "Delete this idea?",
    "aiGeneratingLevelIdea": "AI is generating a <strong>{level}</strong> level project idea...",
    "aiGeneratingTopicIdea": "AI is designing a project idea for \"<strong>{topic}</strong>\"...",
    "pasteCodeHere": "Paste code for {file} here...",
    "fillAllFields": "Please fill in all fields",
    "passwordMismatch": "Passwords do not match",
    "loggingIn": "Logging in...",
    "registering": "Registering...",
    "logoutConfirm": "Do you want to log out?",
    "thinkingShort": "Thinking",
    "jobSearchPlaceholder2": "Search for what job? (e.g. React developer, Python backend)",
    "clearCareerChatConfirm": "Clear entire career advice chat history?",
    "askAboutProject": "Ask about this project...",
    "explainSimplyMsg": "Explain this simply for me",
    "moreExamplesMsg": "Give me more examples",
    "submitted": "SUBMITTED",
    "notSubmitted": "NOT SUBMITTED",
    "deleteFile": "Delete file",
    "addFile": "Add file",
    "fileNamePlaceholder": "File name...",
    "homeBreadcrumb": "Home",
    "mr50Title": "🟡 50% Need Additional Skills",
    "mr50Desc": "Need to complete specialized lessons to meet job requirements.",
    "mrSeniorMismatchTitle": "🔴 15% Senior (Domain Mismatch)",
    "mrSeniorMismatchDesc": "This position requires deep expertise in {domain}. Complete this roadmap on DevMaster Hub!",
    "mrRoadmapIncompleteTitle": "🔴 25% Roadmap Incomplete ({domain})",
    "mrRoadmapIncompleteDesc": "Your profile does not yet have skills in {domain}. Study this curriculum on DevMaster Hub!",
    "mrInternTitle": "🟢 70% Suitable for Intern",
    "mrInternDesc": "You have grasped the fundamentals and qualify to apply for internship roles!",
    "mrFresherNeedMoreTitle": "🟡 50% Need 10-15 More Lessons (Fresher)",
    "mrFresherNeedMoreDesc": "You have completed only {n} basic lessons. Complete OOP, data structures, and a mini-project before applying for fresher roles.",
    "mrLongTermSeniorTitle": "🔴 15% Long-term Target (Senior)",
    "mrLongTermSeniorDesc": "Senior expert positions require several years of real-world experience.",
    "mrLevelGapTitle": "🔴 30% Level Gap (Full-time Engineer)",
    "mrLevelGapDesc": "Full-time engineering roles require solid OOP, memory management, data structures, and practical project experience.",
    "mrInternStrongTitle": "🟢 95% Highly Qualified (Intern)",
    "mrInternStrongDesc": "Your foundation is excellent for internship roles!",
    "mrFresherGreatTitle": "🟢 85% Great Fit (Fresher)",
    "mrFresherGreatDesc": "Your current skills are very suitable for fresher positions!",
    "mrJuniorReadyTitle": "🟢 75% Ready to Apply (Junior)",
    "mrJuniorReadyDesc": "Confidently submit your resume with the projects you built on DevMaster Hub!",
    "mrAdvancedTargetTitle": "🔴 30% Advanced Target (Senior)",
    "mrAdvancedTargetDesc": "Needs 1-2 more years of real-world experience.",
    "mrNeedProjectTitle": "🟡 65% Need Practical Project Portfolio",
    "mrNeedProjectDesc": "Good fit — complete one more practical project to boost your chances.",
    "mrReadyTitle": "🟢 {rate}% Ready to Apply",
    "mrReadyDesc": "Your skill profile strongly aligns with the job requirements.",
    "challengeNav": "Challenges",
    "challengeTitle": "🚩 Linux & Security Challenges",
    "challengeSubtitle": "Practice Linux commands in a virtual terminal and capture flags. Click below for a fresh AI-generated challenge.",
    "aiChallengeTitle": "AI-generated challenge",
    "aiChallengeHint": "Each click gives a different challenge, solvable with basic Linux commands.",
    "aiChallengeBtn": "New challenge",
    "aiChallengeLoading": "AI is writing a challenge…",
    "aiChallengeBad": "The AI reply was not in the expected format. Click 'New challenge' to try again.",
    "needLogin": "You need to sign in to use this feature.",
    "aiBusy": "The AI is busy, try again in a moment.",
    "challengeEntryHint": "Practice Linux commands in a virtual terminal and capture flags"
  },
  "ja": {
    "tutorHeader": "AIチューターに質問:",
    "tutorWelcome": "このセクションについてAIに何でも質問してください！",
    "explainSimply": "この部分を初心者向けにわかりやすく説明して",
    "explainSimplyBtn": "わかりやすく説明",
    "moreExamples": "実践的なコード例をもっと教えて",
    "moreExamplesBtn": "他の例を見る",
    "keyTakeaways": "ここで覚えるべき最も重要なポイントは何ですか？",
    "keyTakeawaysBtn": "重要ポイント？",
    "askAiPlaceholder": "このレッスンについてAIに質問する...",
    "thinking": "考え中",
    "clearLessonChat": "🗑️ チャットをクリア",
    "tabLabelTheory": "理論",
    "tabLabelCode": "コードラボ",
    "tabLabelQuiz": "クイズ",
    "tabLabelExercise": "実践課題",
    "dashboard": "ダッシュボード",
    "projectLab": "プロジェクトラボ",
    "myProjects": "マイプロジェクト",
    "careerAdvisor": "キャリアアドバイザー",
    "technologies": "学習ロードマップ",
    "logout": "ログアウト",
    "aiOnline": "AI: 準備完了",
    "aiOffline": "AI: オフライン",
    "langSwitch": "言語",
    "dashboardTitle": "🚀 ダッシュボード",
    "dashboardSubtitle": "初心者からマスターまでのプログラミング学習ロードマップ",
    "searchPlaceholder": "レッスン、技術、概念を検索...",
    "statTech": "技術",
    "statLessons": "レッスン",
    "statCompleted": "完了",
    "statProgress": "進捗",
    "lessonsUnit": "レッスン",
    "levelsUnit": "レベル",
    "catLanguages": "💻 プログラミング言語",
    "catFrontend": "🎨 フロントエンド開発",
    "catBackend": "⚙️ バックエンド & API",
    "catMobile": "📱 モバイル開発",
    "catTools": "🔧 ツール、DevOps & DSA",
    "back": "戻る",
    "backToRoadmap": "← ロードマップに戻る",
    "markComplete": "⬜ 完了にする",
    "completed": "✅ 完了済み",
    "tabTheory": "理論",
    "tabCode": "コードラボ",
    "tabQuiz": "クイズ",
    "tabExercise": "実践課題",
    "keyPoints": "🔑 重要ポイント",
    "runCode": "▶ コード実行",
    "running": "実行中...",
    "submitQuiz": "クイズを提出",
    "checkCode": "🤖 AIコード採点",
    "checking": "採点中...",
    "showHints": "💡 ヒント",
    "showSolution": "🔓 解答を見る",
    "clearCode": "コードをクリア",
    "nextLesson": "次のレッスン →",
    "prevLesson": "← 前のレッスン",
    "searchFound": "{n} 件の結果が見つかりました",
    "noSearchResults": "「{q}」に一致する結果は見つかりませんでした",
    "careerTitle": "💼 AIキャリアアドバイザー",
    "careerSubtitle": "スキル評価とAIマッチングによるリアルタイム求人提案",
    "searchJobsPlaceholder": "キャリアに関する質問や希望する職種を入力...",
    "searchJobsBtn": "求人を検索",
    "sendMsg": "送信",
    "clearChat": "チャットをクリア",
    "editQuestion": "✏️ 質問を編集",
    "regenerateAnswer": "🔄 再回答",
    "jobsSuggestedBar": "AI推奨求人",
    "autoTriggerChat": "チャット時に自動検索",
    "openJobList": "▶ リストを開く",
    "collapseJobList": "▲ リストを閉じる",
    "noJobsFound": "求人はまだありません",
    "viewJobs": "求人を見る",
    "collapseJobs": "閉じる",
    "applyNow": "今すぐ応募 →",
    "projectLabTitle": "プロジェクトラボ",
    "projectLabSubtitle": "実践的なプロジェクトで学ぶ。AIがアイデアを提案しコードをレビューします。",
    "byLevelTitle": "難易度別",
    "byLevelDesc": "NewbieからMasterまでレベルを選択。",
    "byTopicTitle": "トピック別",
    "byTopicDesc": "好きなテーマを入力してプロジェクトを自動設計。",
    "savedIdeasTitle": "保存したアイデア",
    "savedIdeasDesc": "ブックマークしたアイデアを確認。",
    "startBtn": "開始 →",
    "viewSavedBtn": "{n} 件を見る →",
    "noSavedIdeasYet": "保存されたアイデアはありません。",
    "createIdeaByTopicBtn": "📝 トピックから作成",
    "backToProjectLab": "← プロジェクトラボに戻る",
    "byLevelHeader": "📊 難易度別プロジェクト",
    "byLevelHeaderDesc": "レベルを選択してアイデアを取得",
    "byTopicHeader": "📝 トピック別プロジェクト",
    "byTopicHeaderDesc": "テーマを入力してAIが設計",
    "topicInputPlaceholder": "例: スネークゲーム、ブログ...",
    "generateIdeaBtn": "アイデア生成",
    "newIdeaBtn": "新しいアイデア",
    "saveIdeaBtn": "アイデアを保存",
    "savedIdeaSuccess": "✅ 保存完了",
    "myProjectsTitle": "マイプロジェクト",
    "myProjectsSubtitle": "提出したプロジェクトとAIの評価結果",
    "noProjectsYet": "まだ提出されたプロジェクトはありません。",
    "myProjectsBreadcrumb": "ダッシュボード › 📁 マイプロジェクト",
    "overallScore": "総合スコア",
    "codeQuality": "コード品質",
    "functionality": "機能性",
    "bestPractices": "ベストプラクティス",
    "creativity": "創造性",
    "aiFeedback": "💬 AIメンターの講評",
    "strengths": "💪 強み",
    "improvements": "📈 改善点",
    "requirementsTitle": "📋 要件",
    "stepsTitle": "📝 実装手順",
    "bonusFeaturesTitle": "⭐ ボーナス機能",
    "chatWithAiMentor": "💬 AIメンターとチャット",
    "askAiAboutProject": "このプロジェクトについて何でもAIに聞いてください...",
    "startThisProject": "🚀 このプロジェクトを開始 →",
    "newIdea": "🔄 新しいアイデア",
    "authLogin": "ログイン",
    "authRegister": "新規登録",
    "authUsername": "ユーザー名",
    "authUsernamePlaceholder": "例: devmaster2025",
    "authPassword": "パスワード",
    "authPasswordPlaceholder": "6文字以上",
    "authConfirmPassword": "パスワードの確認",
    "authSubtitle": "初心者からマスターまでの開発者学習プラットフォーム",
    "levelNewbie": "入門",
    "levelJunior": "基礎",
    "levelMid": "中級",
    "levelSenior": "上級",
    "levelMaster": "エキスパート",
    "hideHints": "🙈 ヒントを隠す",
    "showHintsBtn": "💡 ヒントを見る",
    "hideSolution": "🙈 解答を隠す",
    "showSolutionBtn": "👀 模範解答を見る",
    "answerPlaceholder": "ここにコードや解答を入力してください...",
    "writeCodeFirst": "実行する前にコードを入力してください。",
    "noContent": "コンテンツがありません",
    "ideaAlreadySaved": "💡 このアイデアは既に保存されています。",
    "ideaSavedShort": "保存しました",
    "noContentAvailable": "コンテンツがありません",
    "knowledgeCheck": "理解度チェック",
    "generateQuizAi": "AIでクイズを作成",
    "codeExample": "コード例",
    "copyCode": "📋 コピー",
    "noCodeExample": "このレッスンにはコード例がありません。",
    "answerCorrect": "✅ 正解",
    "answerWrong": "❌ 不正解",
    "scoreExcellent": "素晴らしい！",
    "scoreGood": "よくできました！",
    "scoreNeedsReview": "復習が必要です",
    "originalExercise": "元の演習",
    "noExerciseYet": "このレッスンには演習がありません。",
    "savedIdeasCount": "保存済みのアイデアが <strong>{n}</strong> 件あります。",
    "clickBelowForIdea": "下のボタンを押すと、AIが <strong>{level}</strong> レベルのプロジェクト案を作成します",
    "readyTitle": "準備完了！",
    "aiSelects": "AIにおまかせ",
    "createIdeaThenSave": "プロジェクト案を作成し、「💾 アイデアを保存」を押してブックマークしましょう。",
    "topicLabel": "テーマ",
    "deleteIdeaConfirm": "このアイデアを削除しますか？",
    "aiGeneratingLevelIdea": "AIが <strong>{level}</strong> レベルのプロジェクト案を作成中...",
    "aiGeneratingTopicIdea": "AIが「<strong>{topic}</strong>」のプロジェクト案を設計中...",
    "pasteCodeHere": "ここに {file} のコードを貼り付けてください...",
    "fillAllFields": "すべての項目を入力してください",
    "passwordMismatch": "パスワードが一致しません",
    "loggingIn": "ログイン中...",
    "registering": "登録中...",
    "logoutConfirm": "ログアウトしますか？",
    "thinkingShort": "考え中",
    "jobSearchPlaceholder2": "どんな求人を探しますか？（例：React developer、Python backend）",
    "clearCareerChatConfirm": "キャリア相談の履歴をすべて削除しますか？",
    "askAboutProject": "このプロジェクトについて質問...",
    "explainSimplyMsg": "この部分をわかりやすく説明してください",
    "moreExamplesMsg": "もっと例を見せてください",
    "submitted": "提出済み",
    "notSubmitted": "未提出",
    "deleteFile": "ファイルを削除",
    "addFile": "ファイルを追加",
    "fileNamePlaceholder": "ファイル名...",
    "homeBreadcrumb": "ホーム",
    "mr50Title": "🟡 50% スキルの補強が必要",
    "mr50Desc": "募集要件を満たすには専門的なレッスンの受講が必要です。",
    "mrSeniorMismatchTitle": "🔴 15% シニア職（専門分野が不一致）",
    "mrSeniorMismatchDesc": "このポジションは {domain} の深い専門知識を必要とします。DevMaster Hub でこのロードマップを修了しましょう。",
    "mrRoadmapIncompleteTitle": "🔴 25% {domain} のロードマップ未修了",
    "mrRoadmapIncompleteDesc": "あなたのプロフィールにはまだ {domain} のスキルがありません。DevMaster Hub でこのカリキュラムを学びましょう。",
    "mrInternTitle": "🟢 70% インターンに適合",
    "mrInternDesc": "基礎を理解しています。インターンに応募する資格があります。",
    "mrFresherNeedMoreTitle": "🟡 50% あと10〜15レッスン必要（新卒）",
    "mrFresherNeedMoreDesc": "基礎レッスンをまだ {n} 件しか終えていません。新卒枠に応募する前に、OOP・データ構造・ミニプロジェクトを完了しましょう。",
    "mrLongTermSeniorTitle": "🔴 15% 長期目標（シニア）",
    "mrLongTermSeniorDesc": "シニア職には数年の実務経験が必要です。",
    "mrLevelGapTitle": "🔴 30% レベル不足（正社員エンジニア）",
    "mrLevelGapDesc": "正社員エンジニア職には、OOP・メモリ管理・データ構造の確かな理解と実プロジェクト経験が必要です。",
    "mrInternStrongTitle": "🟢 95% 十分に応募可能（インターン）",
    "mrInternStrongDesc": "インターンに向けた基礎が非常にしっかりしています。",
    "mrFresherGreatTitle": "🟢 85% 非常に適合（新卒）",
    "mrFresherGreatDesc": "現在のスキルは新卒ポジションに非常に適しています。",
    "mrJuniorReadyTitle": "🟢 75% 応募準備完了（ジュニア）",
    "mrJuniorReadyDesc": "DevMaster Hub で作ったプロジェクトを添えて、自信を持って応募しましょう。",
    "mrAdvancedTargetTitle": "🔴 30% 上級目標（シニア）",
    "mrAdvancedTargetDesc": "あと1〜2年の実務経験が必要です。",
    "mrNeedProjectTitle": "🟡 65% 実践プロジェクトの準備が必要",
    "mrNeedProjectDesc": "良い適合です。採用の可能性を高めるため、実践プロジェクトをもう1件仕上げましょう。",
    "mrReadyTitle": "🟢 {rate}% 応募準備完了",
    "mrReadyDesc": "あなたのスキルは求人要件によく合致しています。",
    "challengeNav": "チャレンジ",
    "challengeTitle": "🚩 Linux とセキュリティのチャレンジ",
    "challengeSubtitle": "仮想ターミナルで Linux コマンドを練習し、フラグを獲得しましょう。下のボタンで AI が新しい問題を出します。",
    "aiChallengeTitle": "AIが作る問題",
    "aiChallengeHint": "押すたびに違う問題が出ます。基本的な Linux コマンドで解けます。",
    "aiChallengeBtn": "新しい問題",
    "aiChallengeLoading": "AIが問題を考えています…",
    "aiChallengeBad": "AIの回答が正しい形式ではありません。「新しい問題」を押して再試行してください。",
    "needLogin": "この機能を使うにはログインが必要です。",
    "aiBusy": "AIが混み合っています。少し待ってからお試しください。",
    "challengeEntryHint": "仮想ターミナルで Linux コマンドを練習し、フラグを獲得"
  },
  "ko": {
    "tutorHeader": "AI 튜터에게 질문하기",
    "tutorWelcome": "이 부분에 대해 무엇이든 물어보세요!",
    "explainSimply": "이 부분을 쉽게 설명해 주세요",
    "explainSimplyBtn": "쉽게 설명",
    "moreExamples": "실용적인 코드 예제를 더 보여주세요",
    "moreExamplesBtn": "예제 더 보기",
    "keyTakeaways": "꼭 기억해야 할 핵심은 무엇인가요?",
    "keyTakeawaysBtn": "핵심 정리",
    "askAiPlaceholder": "이 강의에 대해 AI에게 질문하세요...",
    "thinking": "생각 중",
    "clearLessonChat": "🗑️ 대화 지우기",
    "tabLabelTheory": "이론",
    "tabLabelCode": "코드 예제",
    "tabLabelQuiz": "퀴즈",
    "tabLabelExercise": "실습",
    "dashboard": "대시보드",
    "projectLab": "프로젝트 랩",
    "myProjects": "내 프로젝트",
    "careerAdvisor": "커리어 어드바이저",
    "technologies": "기술 로드맵",
    "logout": "로그아웃",
    "aiOnline": "AI: 준비됨",
    "aiOffline": "AI: 오프라인",
    "langSwitch": "언어",
    "dashboardTitle": "🚀 대시보드",
    "dashboardSubtitle": "입문자에서 마스터 개발자까지의 학습 경로",
    "searchPlaceholder": "강의, 기술, 개념 검색...",
    "statTech": "기술",
    "statLessons": "강의",
    "statCompleted": "완료",
    "statProgress": "진행률",
    "lessonsUnit": "개 강의",
    "levelsUnit": "개 레벨",
    "catLanguages": "💻 프로그래밍 언어",
    "catFrontend": "🎨 프론트엔드 개발",
    "catBackend": "⚙️ 백엔드 & API",
    "catMobile": "📱 모바일 개발",
    "catTools": "🔧 도구, DevOps & 자료구조",
    "back": "뒤로",
    "backToRoadmap": "← 로드맵으로 돌아가기",
    "markComplete": "⬜ 완료로 표시",
    "completed": "✅ 완료됨",
    "tabTheory": "이론",
    "tabCode": "코드 랩",
    "tabQuiz": "퀴즈 챌린지",
    "tabExercise": "코딩 실습",
    "keyPoints": "🔑 핵심 정리",
    "runCode": "▶ 코드 실행",
    "running": "실행 중...",
    "submitQuiz": "퀴즈 제출",
    "checkCode": "🤖 AI 코드 리뷰",
    "checking": "검토 중...",
    "showHints": "💡 힌트",
    "showSolution": "🔓 정답 보기",
    "clearCode": "코드 지우기",
    "nextLesson": "다음 강의 →",
    "prevLesson": "← 이전 강의",
    "searchFound": "{n}개의 결과를 찾았습니다",
    "noSearchResults": "\"{q}\"에 대한 검색 결과가 없습니다",
    "careerTitle": "💼 AI 커리어 어드바이저 & 채용 매칭",
    "careerSubtitle": "학습 기록을 바탕으로 맞춤형 커리어 조언, 현실적인 역량 진단, 실시간 채용 매칭을 제공합니다.",
    "searchJobsPlaceholder": "커리어 질문을 하거나 원하는 개발 직무를 설명해 보세요...",
    "searchJobsBtn": "채용 검색",
    "sendMsg": "보내기",
    "clearChat": "대화 지우기",
    "editQuestion": "✏️ 질문 수정",
    "regenerateAnswer": "🔄 답변 다시 생성",
    "jobsSuggestedBar": "AI 추천 채용공고",
    "autoTriggerChat": "대화 중 자동 추천됨",
    "openJobList": "▶ 클릭하여 채용 목록 열기",
    "collapseJobList": "▲ 목록 접기 (대화로 돌아가기)",
    "noJobsFound": "아직 채용공고가 없습니다 (AI와 대화하면 맞춤 공고를 찾아드립니다)",
    "viewJobs": "맞춤 채용공고 보기",
    "collapseJobs": "채용 목록 접기 (대화로 돌아가기)",
    "applyNow": "지원하기 →",
    "projectLabTitle": "프로젝트 랩",
    "projectLabSubtitle": "실제 프로젝트로 연습하세요. AI가 아이디어를 제안하고 코드를 안내하며 프로젝트를 리뷰합니다.",
    "byLevelTitle": "난이도별",
    "byLevelDesc": "입문자부터 마스터까지 선택하세요. AI가 실력에 맞는 프로젝트 아이디어를 만들어 줍니다.",
    "byTopicTitle": "주제별",
    "byTopicDesc": "원하는 주제를 입력하세요 (게임, 웹 앱, API...). AI가 완성된 프로젝트를 설계해 드립니다.",
    "savedIdeasTitle": "저장한 아이디어",
    "savedIdeasDesc": "나중에 작업할 아이디어를 다시 확인하세요.",
    "startBtn": "시작하기 →",
    "viewSavedBtn": "{n}개 아이디어 보기 →",
    "noSavedIdeasYet": "저장한 아이디어가 없습니다.",
    "createIdeaByTopicBtn": "📝 주제로 아이디어 생성",
    "backToProjectLab": "← 프로젝트 랩으로 돌아가기",
    "byLevelHeader": "📊 레벨별 프로젝트",
    "byLevelHeaderDesc": "난이도를 선택하면 맞춤 프로젝트 아이디어를 받습니다",
    "byTopicHeader": "📝 주제별 프로젝트",
    "byTopicHeaderDesc": "원하는 주제를 입력하면 AI가 맞춤 프로젝트를 설계합니다",
    "topicInputPlaceholder": "예: 스네이크 게임, 개인 블로그, 학생 관리 API...",
    "generateIdeaBtn": "아이디어 생성",
    "newIdeaBtn": "새 아이디어",
    "saveIdeaBtn": "아이디어 저장",
    "savedIdeaSuccess": "✅ 저장됨",
    "myProjectsTitle": "내 프로젝트",
    "myProjectsSubtitle": "제출한 모든 프로젝트와 AI 멘토의 평가 점수를 확인하세요",
    "noProjectsYet": "아직 제출한 프로젝트가 없습니다. 프로젝트 랩에서 시작해 보세요!",
    "myProjectsBreadcrumb": "대시보드 › 📁 내 프로젝트",
    "overallScore": "종합 점수",
    "codeQuality": "코드 품질",
    "functionality": "기능 완성도",
    "bestPractices": "모범 사례",
    "creativity": "창의성",
    "aiFeedback": "💬 AI 멘토 피드백",
    "strengths": "💪 강점",
    "improvements": "📈 개선할 점",
    "requirementsTitle": "📋 요구사항",
    "stepsTitle": "📝 구현 단계",
    "bonusFeaturesTitle": "⭐ 보너스 기능",
    "chatWithAiMentor": "💬 AI 멘토와 대화",
    "askAiAboutProject": "이 프로젝트에 대해 무엇이든 물어보세요...",
    "startThisProject": "🚀 이 프로젝트 시작하기 →",
    "newIdea": "🔄 새 아이디어",
    "authLogin": "로그인",
    "authRegister": "회원가입",
    "authUsername": "아이디",
    "authUsernamePlaceholder": "예: devmaster2025",
    "authPassword": "비밀번호",
    "authPasswordPlaceholder": "6자 이상",
    "authConfirmPassword": "비밀번호 확인",
    "authSubtitle": "입문자부터 마스터까지의 개발자 학습 플랫폼",
    "levelNewbie": "입문",
    "levelJunior": "기초",
    "levelMid": "중급",
    "levelSenior": "고급",
    "levelMaster": "전문가",
    "hideHints": "🙈 힌트 숨기기",
    "showHintsBtn": "💡 힌트 보기",
    "hideSolution": "🙈 정답 숨기기",
    "showSolutionBtn": "👀 모범 답안 보기",
    "answerPlaceholder": "여기에 코드나 답을 작성하세요...",
    "writeCodeFirst": "실행하기 전에 코드를 작성해 주세요!",
    "noContent": "아직 내용이 없습니다",
    "ideaAlreadySaved": "💡 이미 저장한 아이디어입니다!",
    "ideaSavedShort": "저장됨!",
    "noContentAvailable": "내용이 없습니다",
    "knowledgeCheck": "지식 점검",
    "generateQuizAi": "AI로 퀴즈 생성",
    "codeExample": "코드 예제",
    "copyCode": "📋 복사",
    "noCodeExample": "이 강의에는 코드 예제가 없습니다.",
    "answerCorrect": "✅ 정답",
    "answerWrong": "❌ 오답",
    "scoreExcellent": "훌륭합니다!",
    "scoreGood": "잘했어요!",
    "scoreNeedsReview": "복습이 필요해요!",
    "originalExercise": "기본 과제",
    "noExerciseYet": "이 강의에는 과제가 없습니다.",
    "savedIdeasCount": "저장한 아이디어가 <strong>{n}</strong>개 있습니다.",
    "clickBelowForIdea": "아래 버튼을 누르면 AI가 <strong>{level}</strong> 레벨 프로젝트 아이디어를 만들어 줍니다",
    "readyTitle": "준비 완료!",
    "aiSelects": "AI가 선택",
    "createIdeaThenSave": "프로젝트 아이디어를 만든 뒤 \"💾 아이디어 저장\"을 눌러 보관하세요!",
    "topicLabel": "주제",
    "deleteIdeaConfirm": "이 아이디어를 삭제할까요?",
    "aiGeneratingLevelIdea": "AI가 <strong>{level}</strong> 레벨 프로젝트 아이디어를 만드는 중...",
    "aiGeneratingTopicIdea": "AI가 \"<strong>{topic}</strong>\" 주제의 프로젝트를 설계하는 중...",
    "pasteCodeHere": "여기에 {file} 코드를 붙여넣으세요...",
    "fillAllFields": "모든 항목을 입력해 주세요",
    "passwordMismatch": "비밀번호가 일치하지 않습니다",
    "loggingIn": "로그인 중...",
    "registering": "가입 중...",
    "logoutConfirm": "로그아웃할까요?",
    "thinkingShort": "생각 중",
    "jobSearchPlaceholder2": "어떤 채용을 찾으세요? (예: React developer, Python backend)",
    "clearCareerChatConfirm": "커리어 상담 대화 기록을 모두 지울까요?",
    "askAboutProject": "이 프로젝트에 대해 질문하세요...",
    "explainSimplyMsg": "이 부분을 쉽게 설명해 주세요",
    "moreExamplesMsg": "예제를 더 보여주세요",
    "submitted": "제출 완료",
    "notSubmitted": "미제출",
    "deleteFile": "파일 삭제",
    "addFile": "파일 추가",
    "fileNamePlaceholder": "파일 이름...",
    "homeBreadcrumb": "홈",
    "mr50Title": "🟡 50% 추가 역량 필요",
    "mr50Desc": "채용 요건을 충족하려면 전문 강의를 더 수강해야 합니다.",
    "mrSeniorMismatchTitle": "🔴 15% 시니어 직무 (전문 분야 불일치)",
    "mrSeniorMismatchDesc": "이 직무는 {domain} 분야의 깊은 전문성을 요구합니다. DevMaster Hub에서 해당 로드맵을 완료해 보세요.",
    "mrRoadmapIncompleteTitle": "🔴 25% {domain} 로드맵 미완료",
    "mrRoadmapIncompleteDesc": "아직 {domain} 역량이 프로필에 없습니다. DevMaster Hub에서 이 과정을 학습해 보세요!",
    "mrInternTitle": "🟢 70% 인턴 지원 가능",
    "mrInternDesc": "기본기를 갖추었으니 인턴에 지원할 수 있습니다!",
    "mrFresherNeedMoreTitle": "🟡 50% 10~15개 강의 더 필요 (신입)",
    "mrFresherNeedMoreDesc": "기초 강의를 {n}개만 마쳤습니다. 신입 지원 전에 OOP, 자료구조, 미니 프로젝트를 완료하세요.",
    "mrLongTermSeniorTitle": "🔴 15% 장기 목표 (시니어)",
    "mrLongTermSeniorDesc": "시니어 직무는 수년간의 실무 경험이 필요합니다.",
    "mrLevelGapTitle": "🔴 30% 역량 부족 (정규직 엔지니어)",
    "mrLevelGapDesc": "정규직 엔지니어 직무는 OOP, 메모리 관리, 자료구조에 대한 탄탄한 이해와 실전 프로젝트 경험을 요구합니다.",
    "mrInternStrongTitle": "🟢 95% 충분히 지원 가능 (인턴)",
    "mrInternStrongDesc": "인턴 직무에 아주 좋은 기초를 갖추었습니다!",
    "mrFresherGreatTitle": "🟢 85% 매우 적합 (신입)",
    "mrFresherGreatDesc": "현재 역량이 신입 직무에 매우 잘 맞습니다!",
    "mrJuniorReadyTitle": "🟢 75% 지원 준비 완료 (주니어)",
    "mrJuniorReadyDesc": "DevMaster Hub에서 만든 프로젝트와 함께 자신 있게 지원하세요!",
    "mrAdvancedTargetTitle": "🔴 30% 상위 목표 (시니어)",
    "mrAdvancedTargetDesc": "실무 경험 1~2년이 더 필요합니다.",
    "mrNeedProjectTitle": "🟡 65% 실전 프로젝트 준비 필요",
    "mrNeedProjectDesc": "적합도가 좋습니다. 합격 가능성을 높이려면 실전 프로젝트를 하나 더 완성하세요.",
    "mrReadyTitle": "🟢 {rate}% 지원 준비 완료",
    "mrReadyDesc": "보유 역량이 채용 요건과 잘 맞습니다.",
    "challengeNav": "챌린지",
    "challengeTitle": "🚩 리눅스 & 보안 챌린지",
    "challengeSubtitle": "가상 터미널에서 리눅스 명령어를 연습하고 플래그를 찾아보세요. 아래 버튼을 누르면 AI가 새 문제를 냅니다.",
    "aiChallengeTitle": "AI가 만든 문제",
    "aiChallengeHint": "누를 때마다 다른 문제가 나오며, 기본 리눅스 명령어로 풀 수 있습니다.",
    "aiChallengeBtn": "새 문제",
    "aiChallengeLoading": "AI가 문제를 만드는 중…",
    "aiChallengeBad": "AI 응답 형식이 올바르지 않습니다. '새 문제'를 눌러 다시 시도하세요.",
    "needLogin": "이 기능을 사용하려면 로그인이 필요합니다.",
    "aiBusy": "AI가 바쁩니다. 잠시 후 다시 시도하세요.",
    "challengeEntryHint": "가상 터미널에서 리눅스 명령어를 연습하고 플래그 찾기"
  },
  "zh": {
    "tutorHeader": "向 AI 导师提问",
    "tutorWelcome": "关于这部分内容，随便问！",
    "explainSimply": "请用简单的方式讲解这部分",
    "explainSimplyBtn": "简单讲解",
    "moreExamples": "再给我一些实用的代码示例",
    "moreExamplesBtn": "更多示例",
    "keyTakeaways": "最需要记住的要点是什么？",
    "keyTakeawaysBtn": "重点回顾",
    "askAiPlaceholder": "就本课内容向 AI 提问...",
    "thinking": "思考中",
    "clearLessonChat": "🗑️ 清空对话",
    "tabLabelTheory": "理论",
    "tabLabelCode": "代码示例",
    "tabLabelQuiz": "测验",
    "tabLabelExercise": "练习",
    "dashboard": "仪表盘",
    "projectLab": "项目实验室",
    "myProjects": "我的项目",
    "careerAdvisor": "职业顾问",
    "technologies": "技术路线图",
    "logout": "退出登录",
    "aiOnline": "AI：就绪",
    "aiOffline": "AI：离线",
    "langSwitch": "语言",
    "dashboardTitle": "🚀 仪表盘",
    "dashboardSubtitle": "从入门到资深开发者的学习路径",
    "searchPlaceholder": "搜索课程、技术、概念...",
    "statTech": "技术",
    "statLessons": "课程",
    "statCompleted": "已完成",
    "statProgress": "进度",
    "lessonsUnit": "节课",
    "levelsUnit": "个阶段",
    "catLanguages": "💻 编程语言",
    "catFrontend": "🎨 前端开发",
    "catBackend": "⚙️ 后端与 API",
    "catMobile": "📱 移动开发",
    "catTools": "🔧 工具、DevOps 与数据结构",
    "back": "返回",
    "backToRoadmap": "← 返回路线图",
    "markComplete": "⬜ 标记为已完成",
    "completed": "✅ 已完成",
    "tabTheory": "理论",
    "tabCode": "代码实验",
    "tabQuiz": "测验挑战",
    "tabExercise": "编程练习",
    "keyPoints": "🔑 核心要点",
    "runCode": "▶ 运行代码",
    "running": "执行中...",
    "submitQuiz": "提交测验",
    "checkCode": "🤖 AI 代码评审",
    "checking": "评审中...",
    "showHints": "💡 提示",
    "showSolution": "🔓 查看答案",
    "clearCode": "清空代码",
    "nextLesson": "下一课 →",
    "prevLesson": "← 上一课",
    "searchFound": "找到 {n} 条结果",
    "noSearchResults": "没有找到与“{q}”相关的结果",
    "careerTitle": "💼 AI 职业顾问与职位匹配",
    "careerSubtitle": "根据你的学习数据，提供个性化职业建议、务实的能力评估和实时职位匹配。",
    "searchJobsPlaceholder": "提出职业问题，或描述你理想中的技术岗位...",
    "searchJobsBtn": "搜索职位",
    "sendMsg": "发送",
    "clearChat": "清空对话",
    "editQuestion": "✏️ 修改问题",
    "regenerateAnswer": "🔄 重新生成回答",
    "jobsSuggestedBar": "AI 推荐职位",
    "autoTriggerChat": "对话过程中自动推荐",
    "openJobList": "▶ 点击展开职位列表",
    "collapseJobList": "▲ 收起列表（返回对话）",
    "noJobsFound": "暂无职位（与 AI 对话即可发现匹配岗位）",
    "viewJobs": "点击查看匹配职位",
    "collapseJobs": "收起职位列表（返回对话）",
    "applyNow": "立即投递 →",
    "projectLabTitle": "项目实验室",
    "projectLabSubtitle": "用真实项目动手练习。AI 会推荐创意、指导编码并评审你的项目。",
    "byLevelTitle": "按难度级别",
    "byLevelDesc": "从入门到大师任选。AI 会生成契合你水平的项目创意。",
    "byTopicTitle": "按自定主题",
    "byTopicDesc": "输入任何你喜欢的主题（游戏、网页应用、API...），AI 会为你设计完整项目。",
    "savedIdeasTitle": "已保存的创意",
    "savedIdeasDesc": "回顾收藏的项目创意，稍后再动手。",
    "startBtn": "开始 →",
    "viewSavedBtn": "查看 {n} 个创意 →",
    "noSavedIdeasYet": "还没有收藏任何创意。",
    "createIdeaByTopicBtn": "📝 按主题生成创意",
    "backToProjectLab": "← 返回项目实验室",
    "byLevelHeader": "📊 按级别划分的项目",
    "byLevelHeaderDesc": "选择难度级别，获取量身定制的项目创意",
    "byTopicHeader": "📝 按主题划分的项目",
    "byTopicHeaderDesc": "输入你想要的主题，AI 将设计专属项目",
    "topicInputPlaceholder": "例如：贪吃蛇游戏、个人博客、学生管理 API...",
    "generateIdeaBtn": "生成创意",
    "newIdeaBtn": "换个创意",
    "saveIdeaBtn": "保存创意",
    "savedIdeaSuccess": "✅ 已保存",
    "myProjectsTitle": "我的项目",
    "myProjectsSubtitle": "回顾所有已提交的项目以及 AI 导师的评分反馈",
    "noProjectsYet": "还没有提交任何项目。去项目实验室开始吧！",
    "myProjectsBreadcrumb": "仪表盘 › 📁 我的项目",
    "overallScore": "总分",
    "codeQuality": "代码质量",
    "functionality": "功能完成度",
    "bestPractices": "最佳实践",
    "creativity": "创意性",
    "aiFeedback": "💬 AI 导师反馈",
    "strengths": "💪 优势",
    "improvements": "📈 待改进",
    "requirementsTitle": "📋 需求说明",
    "stepsTitle": "📝 实现步骤",
    "bonusFeaturesTitle": "⭐ 加分功能",
    "chatWithAiMentor": "💬 与 AI 导师对话",
    "askAiAboutProject": "关于这个项目，随便问 AI...",
    "startThisProject": "🚀 开始这个项目 →",
    "newIdea": "🔄 换个创意",
    "authLogin": "登录",
    "authRegister": "注册",
    "authUsername": "用户名",
    "authUsernamePlaceholder": "例如：devmaster2025",
    "authPassword": "密码",
    "authPasswordPlaceholder": "至少 6 个字符",
    "authConfirmPassword": "确认密码",
    "authSubtitle": "从入门到大师的开发者学习平台",
    "levelNewbie": "入门",
    "levelJunior": "基础",
    "levelMid": "中级",
    "levelSenior": "高级",
    "levelMaster": "专家",
    "hideHints": "🙈 隐藏提示",
    "showHintsBtn": "💡 查看提示",
    "hideSolution": "🙈 隐藏答案",
    "showSolutionBtn": "👀 查看参考答案",
    "answerPlaceholder": "在此编写代码或答案...",
    "writeCodeFirst": "请先编写代码再运行！",
    "noContent": "暂无内容",
    "ideaAlreadySaved": "💡 这个创意已经保存过了！",
    "ideaSavedShort": "已保存！",
    "noContentAvailable": "暂无内容",
    "knowledgeCheck": "知识检测",
    "generateQuizAi": "用 AI 生成测验",
    "codeExample": "代码示例",
    "copyCode": "📋 复制",
    "noCodeExample": "本课暂无代码示例。",
    "answerCorrect": "✅ 正确",
    "answerWrong": "❌ 错误",
    "scoreExcellent": "非常出色！",
    "scoreGood": "做得不错！",
    "scoreNeedsReview": "需要复习！",
    "originalExercise": "原始练习",
    "noExerciseYet": "本课暂无练习。",
    "savedIdeasCount": "你有 <strong>{n}</strong> 个已保存的创意。",
    "clickBelowForIdea": "点击下方按钮，让 AI 生成 <strong>{level}</strong> 级别的项目创意",
    "readyTitle": "准备就绪！",
    "aiSelects": "由 AI 决定",
    "createIdeaThenSave": "先生成项目创意，再点击“💾 保存创意”收藏起来！",
    "topicLabel": "主题",
    "deleteIdeaConfirm": "要删除这个创意吗？",
    "aiGeneratingLevelIdea": "AI 正在生成 <strong>{level}</strong> 级别的项目创意...",
    "aiGeneratingTopicIdea": "AI 正在为“<strong>{topic}</strong>”设计项目创意...",
    "pasteCodeHere": "在此粘贴 {file} 的代码...",
    "fillAllFields": "请填写所有字段",
    "passwordMismatch": "两次输入的密码不一致",
    "loggingIn": "正在登录...",
    "registering": "正在注册...",
    "logoutConfirm": "要退出登录吗？",
    "thinkingShort": "思考中",
    "jobSearchPlaceholder2": "想找什么职位？（例如：React developer、Python backend）",
    "clearCareerChatConfirm": "要清空全部职业咨询对话记录吗？",
    "askAboutProject": "询问关于这个项目的问题...",
    "explainSimplyMsg": "请用简单的方式讲解这部分",
    "moreExamplesMsg": "再给我一些例子",
    "submitted": "已提交",
    "notSubmitted": "未提交",
    "deleteFile": "删除文件",
    "addFile": "添加文件",
    "fileNamePlaceholder": "文件名...",
    "homeBreadcrumb": "首页",
    "mr50Title": "🟡 50% 需要补充技能",
    "mr50Desc": "需要再学习专业课程才能满足招聘要求。",
    "mrSeniorMismatchTitle": "🔴 15% 资深职位（专业方向不符）",
    "mrSeniorMismatchDesc": "该职位需要 {domain} 方面的深入专长。请在 DevMaster Hub 完成这条学习路线。",
    "mrRoadmapIncompleteTitle": "🔴 25% 尚未学完 {domain} 路线",
    "mrRoadmapIncompleteDesc": "你的档案中还没有 {domain} 相关技能。快去 DevMaster Hub 学习这条路线吧！",
    "mrInternTitle": "🟢 70% 适合实习岗位",
    "mrInternDesc": "你已掌握基础知识，具备申请实习的条件！",
    "mrFresherNeedMoreTitle": "🟡 50% 还需再学 10-15 课（应届）",
    "mrFresherNeedMoreDesc": "你只完成了 {n} 节基础课。申请应届岗位前，请先完成面向对象、数据结构和一个小项目。",
    "mrLongTermSeniorTitle": "🔴 15% 长期目标（资深）",
    "mrLongTermSeniorDesc": "资深专家岗位需要多年实战经验。",
    "mrLevelGapTitle": "🔴 30% 能力不足（正式工程师）",
    "mrLevelGapDesc": "正式工程师岗位要求扎实掌握面向对象、内存管理、数据结构，并具备实际项目经验。",
    "mrInternStrongTitle": "🟢 95% 完全够格（实习）",
    "mrInternStrongDesc": "你的基础非常适合实习岗位！",
    "mrFresherGreatTitle": "🟢 85% 非常匹配（应届）",
    "mrFresherGreatDesc": "你目前的知识非常适合应届岗位！",
    "mrJuniorReadyTitle": "🟢 75% 可以投递（初级）",
    "mrJuniorReadyDesc": "带上你在 DevMaster Hub 完成的项目，自信投递简历吧！",
    "mrAdvancedTargetTitle": "🔴 30% 进阶目标（资深）",
    "mrAdvancedTargetDesc": "还需再积累 1-2 年实际经验。",
    "mrNeedProjectTitle": "🟡 65% 需要准备实战项目",
    "mrNeedProjectDesc": "匹配度不错，再完成一个实战项目可以提高录取几率。",
    "mrReadyTitle": "🟢 {rate}% 可以投递",
    "mrReadyDesc": "你的技能与职位要求高度契合。",
    "challengeNav": "挑战",
    "challengeTitle": "🚩 Linux 与网络安全挑战",
    "challengeSubtitle": "在虚拟终端练习 Linux 命令并夺取旗帜。点击下方按钮让 AI 出新题。",
    "aiChallengeTitle": "AI 出的题目",
    "aiChallengeHint": "每次点击都是不同的题目，用基础 Linux 命令即可完成。",
    "aiChallengeBtn": "出新题",
    "aiChallengeLoading": "AI 正在出题…",
    "aiChallengeBad": "AI 返回的格式不正确。请点击『出新题』重试。",
    "needLogin": "使用此功能需要先登录。",
    "aiBusy": "AI 正忙，请稍后再试。",
    "challengeEntryHint": "在虚拟终端练习 Linux 命令并夺取旗帜"
  },
  "fr": {
    "tutorHeader": "Poser une question au tuteur IA sur",
    "tutorWelcome": "Posez n'importe quelle question sur cette section !",
    "explainSimply": "Explique-moi cette section simplement",
    "explainSimplyBtn": "Explication simple",
    "moreExamples": "Donne-moi plus d'exemples de code concrets",
    "moreExamplesBtn": "Plus d'exemples",
    "keyTakeaways": "Quel est le point essentiel à retenir ?",
    "keyTakeawaysBtn": "Points clés",
    "askAiPlaceholder": "Poser une question sur cette leçon...",
    "thinking": "Réflexion",
    "clearLessonChat": "🗑️ Effacer la conversation",
    "tabLabelTheory": "Théorie",
    "tabLabelCode": "Exemple de code",
    "tabLabelQuiz": "Quiz",
    "tabLabelExercise": "Exercice",
    "dashboard": "Tableau de bord",
    "projectLab": "Atelier projets",
    "myProjects": "Mes projets",
    "careerAdvisor": "Conseiller carrière",
    "technologies": "Parcours techniques",
    "logout": "Déconnexion",
    "aiOnline": "IA : prête",
    "aiOffline": "IA : hors ligne",
    "langSwitch": "Langue",
    "dashboardTitle": "🚀 Tableau de bord",
    "dashboardSubtitle": "Parcours d'apprentissage du débutant au développeur confirmé",
    "searchPlaceholder": "Rechercher leçons, technologies, concepts...",
    "statTech": "Technologies",
    "statLessons": "Leçons",
    "statCompleted": "Terminées",
    "statProgress": "Progression",
    "lessonsUnit": "leçons",
    "levelsUnit": "niveaux",
    "catLanguages": "💻 Langages de programmation",
    "catFrontend": "🎨 Développement frontend",
    "catBackend": "⚙️ Backend et API",
    "catMobile": "📱 Développement mobile",
    "catTools": "🔧 Outils, DevOps et algorithmique",
    "back": "Retour",
    "backToRoadmap": "← Retour au parcours",
    "markComplete": "⬜ Marquer comme terminée",
    "completed": "✅ Terminée",
    "tabTheory": "Théorie",
    "tabCode": "Atelier code",
    "tabQuiz": "Défi quiz",
    "tabExercise": "Exercices de code",
    "keyPoints": "🔑 Points essentiels",
    "runCode": "▶ Exécuter le code",
    "running": "Exécution...",
    "submitQuiz": "Valider le quiz",
    "checkCode": "🤖 Revue de code par l'IA",
    "checking": "Analyse...",
    "showHints": "💡 Indices",
    "showSolution": "🔓 Voir la solution",
    "clearCode": "Effacer le code",
    "nextLesson": "Leçon suivante →",
    "prevLesson": "← Leçon précédente",
    "searchFound": "{n} résultats trouvés",
    "noSearchResults": "Aucun résultat pour « {q} »",
    "careerTitle": "💼 Conseiller carrière IA et recherche d'emploi",
    "careerSubtitle": "Conseils de carrière personnalisés, évaluation réaliste de vos compétences et offres d'emploi en temps réel, à partir de votre progression.",
    "searchJobsPlaceholder": "Posez une question carrière ou décrivez le poste tech de vos rêves...",
    "searchJobsBtn": "Chercher un emploi",
    "sendMsg": "Envoyer",
    "clearChat": "Effacer la conversation",
    "editQuestion": "✏️ Modifier la question",
    "regenerateAnswer": "🔄 Régénérer la réponse",
    "jobsSuggestedBar": "Offres recommandées par l'IA",
    "autoTriggerChat": "Proposées automatiquement pendant la conversation",
    "openJobList": "▶ Cliquer pour voir les offres",
    "collapseJobList": "▲ Réduire la liste (retour à la conversation)",
    "noJobsFound": "Aucune offre pour l'instant (discutez avec l'IA pour en découvrir)",
    "viewJobs": "Voir les offres correspondantes",
    "collapseJobs": "Réduire la liste des offres (retour à la conversation)",
    "applyNow": "Postuler →",
    "projectLabTitle": "Atelier projets",
    "projectLabSubtitle": "Pratiquez sur de vrais projets. L'IA propose des idées, guide votre code et évalue vos réalisations.",
    "byLevelTitle": "Par niveau de difficulté",
    "byLevelDesc": "Du débutant au niveau expert. L'IA génère des idées de projets adaptées à votre niveau.",
    "byTopicTitle": "Par thème libre",
    "byTopicDesc": "Saisissez le thème de votre choix (jeux, applications web, API...). L'IA conçoit un projet complet pour vous.",
    "savedIdeasTitle": "Idées enregistrées",
    "savedIdeasDesc": "Retrouvez les idées mises de côté pour plus tard.",
    "startBtn": "Commencer →",
    "viewSavedBtn": "Voir {n} idées →",
    "noSavedIdeasYet": "Aucune idée enregistrée pour l'instant.",
    "createIdeaByTopicBtn": "📝 Générer une idée par thème",
    "backToProjectLab": "← Retour à l'atelier projets",
    "byLevelHeader": "📊 Projets par niveau",
    "byLevelHeaderDesc": "Choisissez un niveau pour recevoir des idées adaptées",
    "byTopicHeader": "📝 Projets par thème",
    "byTopicHeaderDesc": "Saisissez votre thème et l'IA concevra un projet sur mesure",
    "topicInputPlaceholder": "ex. jeu Snake, blog personnel, API de gestion d'étudiants...",
    "generateIdeaBtn": "Générer une idée",
    "newIdeaBtn": "Nouvelle idée",
    "saveIdeaBtn": "Enregistrer l'idée",
    "savedIdeaSuccess": "✅ Enregistrée",
    "myProjectsTitle": "Mes projets",
    "myProjectsSubtitle": "Retrouvez tous vos projets soumis et les notes du mentor IA",
    "noProjectsYet": "Aucun projet soumis pour l'instant. Rendez-vous dans l'atelier projets pour commencer !",
    "myProjectsBreadcrumb": "Tableau de bord › 📁 Mes projets",
    "overallScore": "Note globale",
    "codeQuality": "Qualité du code",
    "functionality": "Fonctionnalités",
    "bestPractices": "Bonnes pratiques",
    "creativity": "Créativité",
    "aiFeedback": "💬 Retour du mentor IA",
    "strengths": "💪 Points forts",
    "improvements": "📈 Points à améliorer",
    "requirementsTitle": "📋 Cahier des charges",
    "stepsTitle": "📝 Étapes de réalisation",
    "bonusFeaturesTitle": "⭐ Fonctionnalités bonus",
    "chatWithAiMentor": "💬 Discuter avec le mentor IA",
    "askAiAboutProject": "Posez une question sur ce projet...",
    "startThisProject": "🚀 Démarrer ce projet →",
    "newIdea": "🔄 Nouvelle idée",
    "authLogin": "Connexion",
    "authRegister": "Inscription",
    "authUsername": "Nom d'utilisateur",
    "authUsernamePlaceholder": "ex. devmaster2025",
    "authPassword": "Mot de passe",
    "authPasswordPlaceholder": "6 caractères minimum",
    "authConfirmPassword": "Confirmer le mot de passe",
    "authSubtitle": "Plateforme d'apprentissage pour développeurs, du débutant à l'expert",
    "levelNewbie": "Débutant",
    "levelJunior": "Fondamentaux",
    "levelMid": "Intermédiaire",
    "levelSenior": "Avancé",
    "levelMaster": "Expert",
    "hideHints": "🙈 Masquer les indices",
    "showHintsBtn": "💡 Voir les indices",
    "hideSolution": "🙈 Masquer la solution",
    "showSolutionBtn": "👀 Voir la solution type",
    "answerPlaceholder": "Écrivez votre code ou votre réponse ici...",
    "writeCodeFirst": "Merci d'écrire du code avant de l'exécuter !",
    "noContent": "Aucun contenu pour l'instant",
    "ideaAlreadySaved": "💡 Cette idée a déjà été enregistrée !",
    "ideaSavedShort": "Enregistrée !",
    "noContentAvailable": "Aucun contenu disponible",
    "knowledgeCheck": "Évaluation des connaissances",
    "generateQuizAi": "Générer un quiz avec l'IA",
    "codeExample": "Exemple de code",
    "copyCode": "📋 Copier",
    "noCodeExample": "Aucun exemple de code pour cette leçon.",
    "answerCorrect": "✅ Correct",
    "answerWrong": "❌ Incorrect",
    "scoreExcellent": "Excellent !",
    "scoreGood": "Bien joué !",
    "scoreNeedsReview": "À revoir !",
    "originalExercise": "Exercice d'origine",
    "noExerciseYet": "Aucun exercice pour cette leçon.",
    "savedIdeasCount": "Vous avez <strong>{n}</strong> idées enregistrées.",
    "clickBelowForIdea": "Cliquez ci-dessous pour que l'IA génère une idée de projet de niveau <strong>{level}</strong>",
    "readyTitle": "Prêt !",
    "aiSelects": "L'IA choisit",
    "createIdeaThenSave": "Créez une idée de projet puis cliquez sur « 💾 Enregistrer l'idée » pour la garder !",
    "topicLabel": "Thème",
    "deleteIdeaConfirm": "Supprimer cette idée ?",
    "aiGeneratingLevelIdea": "L'IA génère une idée de projet de niveau <strong>{level}</strong>...",
    "aiGeneratingTopicIdea": "L'IA conçoit une idée de projet sur « <strong>{topic}</strong> »...",
    "pasteCodeHere": "Collez ici le code de {file}...",
    "fillAllFields": "Merci de remplir tous les champs",
    "passwordMismatch": "Les mots de passe ne correspondent pas",
    "loggingIn": "Connexion en cours...",
    "registering": "Inscription en cours...",
    "logoutConfirm": "Voulez-vous vous déconnecter ?",
    "thinkingShort": "Réflexion",
    "jobSearchPlaceholder2": "Quel poste cherchez-vous ? (ex. React developer, Python backend)",
    "clearCareerChatConfirm": "Effacer tout l'historique de la conversation carrière ?",
    "askAboutProject": "Poser une question sur ce projet...",
    "explainSimplyMsg": "Explique-moi cela simplement",
    "moreExamplesMsg": "Donne-moi plus d'exemples",
    "submitted": "ENVOYÉ",
    "notSubmitted": "NON ENVOYÉ",
    "deleteFile": "Supprimer le fichier",
    "addFile": "Ajouter un fichier",
    "fileNamePlaceholder": "Nom du fichier...",
    "homeBreadcrumb": "Accueil",
    "mr50Title": "🟡 50% Compétences à compléter",
    "mr50Desc": "Vous devez suivre des leçons spécialisées pour répondre aux exigences du poste.",
    "mrSeniorMismatchTitle": "🔴 15% Poste senior (domaine différent)",
    "mrSeniorMismatchDesc": "Ce poste exige une expertise approfondie en {domain}. Terminez ce parcours sur DevMaster Hub !",
    "mrRoadmapIncompleteTitle": "🔴 25% Parcours {domain} incomplet",
    "mrRoadmapIncompleteDesc": "Votre profil ne comporte pas encore de compétences en {domain}. Suivez ce parcours sur DevMaster Hub !",
    "mrInternTitle": "🟢 70% Adapté à un stage",
    "mrInternDesc": "Vous maîtrisez les bases et pouvez postuler à un stage !",
    "mrFresherNeedMoreTitle": "🟡 50% Encore 10 à 15 leçons (débutant)",
    "mrFresherNeedMoreDesc": "Vous n'avez terminé que {n} leçons de base. Complétez la POO, les structures de données et un mini-projet avant de postuler.",
    "mrLongTermSeniorTitle": "🔴 15% Objectif à long terme (senior)",
    "mrLongTermSeniorDesc": "Les postes d'expert exigent plusieurs années d'expérience concrète.",
    "mrLevelGapTitle": "🔴 30% Niveau insuffisant (ingénieur confirmé)",
    "mrLevelGapDesc": "Les postes d'ingénieur exigent une bonne maîtrise de la POO, de la gestion mémoire, des structures de données et une expérience projet concrète.",
    "mrInternStrongTitle": "🟢 95% Largement qualifié (stage)",
    "mrInternStrongDesc": "Vos bases sont excellentes pour un stage !",
    "mrFresherGreatTitle": "🟢 85% Très bon profil (débutant)",
    "mrFresherGreatDesc": "Vos compétences actuelles conviennent parfaitement à un poste débutant !",
    "mrJuniorReadyTitle": "🟢 75% Prêt à postuler (junior)",
    "mrJuniorReadyDesc": "Envoyez votre CV en toute confiance avec les projets réalisés sur DevMaster Hub !",
    "mrAdvancedTargetTitle": "🔴 30% Objectif avancé (senior)",
    "mrAdvancedTargetDesc": "Il faut encore 1 à 2 ans d'expérience concrète.",
    "mrNeedProjectTitle": "🟡 65% Portfolio de projets à étoffer",
    "mrNeedProjectDesc": "Bon profil — terminez un projet concret de plus pour augmenter vos chances.",
    "mrReadyTitle": "🟢 {rate}% Prêt à postuler",
    "mrReadyDesc": "Vos compétences correspondent bien aux exigences du poste.",
    "challengeNav": "Défis",
    "challengeTitle": "🚩 Défis Linux et sécurité",
    "challengeSubtitle": "Entraînez-vous aux commandes Linux dans un terminal virtuel et capturez les drapeaux. Cliquez ci-dessous pour un nouveau défi généré par l'IA.",
    "aiChallengeTitle": "Défi généré par l'IA",
    "aiChallengeHint": "Chaque clic donne un défi différent, réalisable avec des commandes Linux de base.",
    "aiChallengeBtn": "Nouveau défi",
    "aiChallengeLoading": "L'IA prépare un défi…",
    "aiChallengeBad": "La réponse de l'IA n'a pas le bon format. Cliquez sur « Nouveau défi » pour réessayer.",
    "needLogin": "Vous devez vous connecter pour utiliser cette fonction.",
    "aiBusy": "L'IA est occupée, réessayez dans un instant.",
    "challengeEntryHint": "Entraînez-vous aux commandes Linux et capturez les drapeaux"
  },
  "de": {
    "tutorHeader": "KI-Tutor fragen zu",
    "tutorWelcome": "Frag die KI alles zu diesem Abschnitt!",
    "explainSimply": "Erkläre mir diesen Abschnitt einfach",
    "explainSimplyBtn": "Einfach erklären",
    "moreExamples": "Gib mir mehr praktische Code-Beispiele",
    "moreExamplesBtn": "Mehr Beispiele",
    "keyTakeaways": "Was ist die wichtigste Erkenntnis zum Merken?",
    "keyTakeawaysBtn": "Kernpunkte",
    "askAiPlaceholder": "Die KI zu dieser Lektion fragen...",
    "thinking": "Denkt nach",
    "clearLessonChat": "🗑️ Chat löschen",
    "tabLabelTheory": "Theorie",
    "tabLabelCode": "Code-Beispiel",
    "tabLabelQuiz": "Quiz",
    "tabLabelExercise": "Übung",
    "dashboard": "Übersicht",
    "projectLab": "Projektlabor",
    "myProjects": "Meine Projekte",
    "careerAdvisor": "Karriereberater",
    "technologies": "Lernpfade",
    "logout": "Abmelden",
    "aiOnline": "KI: bereit",
    "aiOffline": "KI: offline",
    "langSwitch": "Sprache",
    "dashboardTitle": "🚀 Übersicht",
    "dashboardSubtitle": "Lernpfad vom Einsteiger zum erfahrenen Entwickler",
    "searchPlaceholder": "Lektionen, Technologien, Konzepte suchen...",
    "statTech": "Technologien",
    "statLessons": "Lektionen",
    "statCompleted": "Abgeschlossen",
    "statProgress": "Fortschritt",
    "lessonsUnit": "Lektionen",
    "levelsUnit": "Stufen",
    "catLanguages": "💻 Programmiersprachen",
    "catFrontend": "🎨 Frontend-Entwicklung",
    "catBackend": "⚙️ Backend und APIs",
    "catMobile": "📱 Mobile Entwicklung",
    "catTools": "🔧 Tools, DevOps und Algorithmen",
    "back": "Zurück",
    "backToRoadmap": "← Zurück zum Lernpfad",
    "markComplete": "⬜ Als erledigt markieren",
    "completed": "✅ Abgeschlossen",
    "tabTheory": "Theorie",
    "tabCode": "Code-Labor",
    "tabQuiz": "Quiz-Challenge",
    "tabExercise": "Programmierübungen",
    "keyPoints": "🔑 Kernpunkte",
    "runCode": "▶ Code ausführen",
    "running": "Wird ausgeführt...",
    "submitQuiz": "Quiz abgeben",
    "checkCode": "🤖 KI-Code-Review",
    "checking": "Wird geprüft...",
    "showHints": "💡 Hinweise",
    "showSolution": "🔓 Lösung ansehen",
    "clearCode": "Code löschen",
    "nextLesson": "Nächste Lektion →",
    "prevLesson": "← Vorherige Lektion",
    "searchFound": "{n} Ergebnisse gefunden",
    "noSearchResults": "Keine Treffer für „{q}“",
    "careerTitle": "💼 KI-Karriereberater und Jobsuche",
    "careerSubtitle": "Persönliche Karriereberatung, ehrliche Einschätzung deiner Fähigkeiten und passende Stellenangebote in Echtzeit, basierend auf deinem Lernfortschritt.",
    "searchJobsPlaceholder": "Stell eine Karrierefrage oder beschreibe deinen Traumjob in der IT...",
    "searchJobsBtn": "Jobs suchen",
    "sendMsg": "Senden",
    "clearChat": "Chat löschen",
    "editQuestion": "✏️ Frage bearbeiten",
    "regenerateAnswer": "🔄 Antwort neu erzeugen",
    "jobsSuggestedBar": "Von der KI empfohlene Stellen",
    "autoTriggerChat": "Automatisch im Chat vorgeschlagen",
    "openJobList": "▶ Klicken, um Stellen anzuzeigen",
    "collapseJobList": "▲ Liste einklappen (zurück zum Chat)",
    "noJobsFound": "Noch keine Stellen (chatte mit der KI, um passende zu finden)",
    "viewJobs": "Passende Stellen ansehen",
    "collapseJobs": "Stellenliste einklappen (zurück zum Chat)",
    "applyNow": "Jetzt bewerben →",
    "projectLabTitle": "Projektlabor",
    "projectLabSubtitle": "Übe an echten Projekten. Die KI schlägt Ideen vor, begleitet deinen Code und bewertet deine Projekte.",
    "byLevelTitle": "Nach Schwierigkeitsgrad",
    "byLevelDesc": "Wähle zwischen Einsteiger und Profi. Die KI erzeugt Projektideen passend zu deinem Niveau.",
    "byTopicTitle": "Nach eigenem Thema",
    "byTopicDesc": "Gib ein beliebiges Thema ein (Spiele, Web-Apps, APIs...). Die KI entwirft ein vollständiges Projekt für dich.",
    "savedIdeasTitle": "Gespeicherte Ideen",
    "savedIdeasDesc": "Sieh dir vorgemerkte Projektideen später wieder an.",
    "startBtn": "Starten →",
    "viewSavedBtn": "{n} Ideen ansehen →",
    "noSavedIdeasYet": "Noch keine Ideen vorgemerkt.",
    "createIdeaByTopicBtn": "📝 Idee nach Thema erzeugen",
    "backToProjectLab": "← Zurück zum Projektlabor",
    "byLevelHeader": "📊 Projekte nach Niveau",
    "byLevelHeaderDesc": "Wähle einen Schwierigkeitsgrad für passende Projektideen",
    "byTopicHeader": "📝 Projekte nach Thema",
    "byTopicHeaderDesc": "Gib dein Wunschthema ein und die KI entwirft ein maßgeschneidertes Projekt",
    "topicInputPlaceholder": "z. B. Snake-Spiel, persönlicher Blog, API zur Studentenverwaltung...",
    "generateIdeaBtn": "Idee erzeugen",
    "newIdeaBtn": "Neue Idee",
    "saveIdeaBtn": "Idee speichern",
    "savedIdeaSuccess": "✅ Gespeichert",
    "myProjectsTitle": "Meine Projekte",
    "myProjectsSubtitle": "Alle eingereichten Projekte und die Bewertungen des KI-Mentors ansehen",
    "noProjectsYet": "Noch keine Projekte eingereicht. Schau im Projektlabor vorbei, um loszulegen!",
    "myProjectsBreadcrumb": "Übersicht › 📁 Meine Projekte",
    "overallScore": "Gesamtnote",
    "codeQuality": "Codequalität",
    "functionality": "Funktionalität",
    "bestPractices": "Best Practices",
    "creativity": "Kreativität",
    "aiFeedback": "💬 Feedback des KI-Mentors",
    "strengths": "💪 Stärken",
    "improvements": "📈 Verbesserungspotenzial",
    "requirementsTitle": "📋 Anforderungen",
    "stepsTitle": "📝 Umsetzungsschritte",
    "bonusFeaturesTitle": "⭐ Bonus-Funktionen",
    "chatWithAiMentor": "💬 Mit dem KI-Mentor chatten",
    "askAiAboutProject": "Frag die KI alles zu diesem Projekt...",
    "startThisProject": "🚀 Dieses Projekt starten →",
    "newIdea": "🔄 Neue Idee",
    "authLogin": "Anmelden",
    "authRegister": "Registrieren",
    "authUsername": "Benutzername",
    "authUsernamePlaceholder": "z. B. devmaster2025",
    "authPassword": "Passwort",
    "authPasswordPlaceholder": "Mindestens 6 Zeichen",
    "authConfirmPassword": "Passwort bestätigen",
    "authSubtitle": "Lernplattform für Entwickler vom Einsteiger bis zum Profi",
    "levelNewbie": "Einsteiger",
    "levelJunior": "Grundlagen",
    "levelMid": "Fortgeschritten",
    "levelSenior": "Höheres Niveau",
    "levelMaster": "Experte",
    "hideHints": "🙈 Hinweise ausblenden",
    "showHintsBtn": "💡 Hinweise anzeigen",
    "hideSolution": "🙈 Lösung ausblenden",
    "showSolutionBtn": "👀 Musterlösung ansehen",
    "answerPlaceholder": "Schreibe hier deinen Code oder deine Antwort...",
    "writeCodeFirst": "Bitte schreibe zuerst Code, bevor du ihn ausführst!",
    "noContent": "Noch kein Inhalt",
    "ideaAlreadySaved": "💡 Diese Idee wurde bereits gespeichert!",
    "ideaSavedShort": "Gespeichert!",
    "noContentAvailable": "Kein Inhalt vorhanden",
    "knowledgeCheck": "Wissensüberprüfung",
    "generateQuizAi": "Quiz mit KI erstellen",
    "codeExample": "Codebeispiel",
    "copyCode": "📋 Kopieren",
    "noCodeExample": "Für diese Lektion gibt es kein Codebeispiel.",
    "answerCorrect": "✅ Richtig",
    "answerWrong": "❌ Falsch",
    "scoreExcellent": "Ausgezeichnet!",
    "scoreGood": "Gut gemacht!",
    "scoreNeedsReview": "Muss wiederholt werden!",
    "originalExercise": "Ursprüngliche Übung",
    "noExerciseYet": "Für diese Lektion gibt es keine Übungen.",
    "savedIdeasCount": "Du hast <strong>{n}</strong> gespeicherte Ideen.",
    "clickBelowForIdea": "Klicke unten, damit die KI eine Projektidee auf Niveau <strong>{level}</strong> erzeugt",
    "readyTitle": "Bereit!",
    "aiSelects": "KI wählt aus",
    "createIdeaThenSave": "Erzeuge eine Projektidee und klicke auf „💾 Idee speichern\", um sie zu merken!",
    "topicLabel": "Thema",
    "deleteIdeaConfirm": "Diese Idee löschen?",
    "aiGeneratingLevelIdea": "Die KI erzeugt eine Projektidee auf Niveau <strong>{level}</strong>...",
    "aiGeneratingTopicIdea": "Die KI entwirft eine Projektidee zu „<strong>{topic}</strong>\"...",
    "pasteCodeHere": "Füge hier den Code von {file} ein...",
    "fillAllFields": "Bitte fülle alle Felder aus",
    "passwordMismatch": "Die Passwörter stimmen nicht überein",
    "loggingIn": "Anmeldung läuft...",
    "registering": "Registrierung läuft...",
    "logoutConfirm": "Möchtest du dich abmelden?",
    "thinkingShort": "Denkt nach",
    "jobSearchPlaceholder2": "Welche Stelle suchst du? (z. B. React developer, Python backend)",
    "clearCareerChatConfirm": "Den gesamten Verlauf der Karriereberatung löschen?",
    "askAboutProject": "Frage zu diesem Projekt stellen...",
    "explainSimplyMsg": "Erkläre mir das einfach",
    "moreExamplesMsg": "Gib mir mehr Beispiele",
    "submitted": "ABGEGEBEN",
    "notSubmitted": "NICHT ABGEGEBEN",
    "deleteFile": "Datei löschen",
    "addFile": "Datei hinzufügen",
    "fileNamePlaceholder": "Dateiname...",
    "homeBreadcrumb": "Startseite",
    "mr50Title": "🟡 50% Zusätzliche Fähigkeiten nötig",
    "mr50Desc": "Du musst weitere Fachlektionen absolvieren, um die Anforderungen zu erfüllen.",
    "mrSeniorMismatchTitle": "🔴 15% Senior-Stelle (anderes Fachgebiet)",
    "mrSeniorMismatchDesc": "Diese Stelle erfordert tiefes Fachwissen in {domain}. Schließe diesen Lernpfad auf DevMaster Hub ab!",
    "mrRoadmapIncompleteTitle": "🔴 25% Lernpfad {domain} unvollständig",
    "mrRoadmapIncompleteDesc": "In deinem Profil fehlen noch Kenntnisse in {domain}. Lerne diesen Pfad auf DevMaster Hub!",
    "mrInternTitle": "🟢 70% Für ein Praktikum geeignet",
    "mrInternDesc": "Du beherrschst die Grundlagen und kannst dich auf ein Praktikum bewerben!",
    "mrFresherNeedMoreTitle": "🟡 50% Noch 10-15 Lektionen nötig (Berufseinsteiger)",
    "mrFresherNeedMoreDesc": "Du hast erst {n} Grundlektionen abgeschlossen. Absolviere OOP, Datenstrukturen und ein Mini-Projekt vor der Bewerbung.",
    "mrLongTermSeniorTitle": "🔴 15% Langfristiges Ziel (Senior)",
    "mrLongTermSeniorDesc": "Expertenstellen erfordern mehrere Jahre Praxiserfahrung.",
    "mrLevelGapTitle": "🔴 30% Niveau reicht nicht (feste Stelle)",
    "mrLevelGapDesc": "Feste Engineering-Stellen verlangen solides OOP, Speicherverwaltung, Datenstrukturen und praktische Projekterfahrung.",
    "mrInternStrongTitle": "🟢 95% Bestens geeignet (Praktikum)",
    "mrInternStrongDesc": "Deine Grundlagen sind hervorragend für ein Praktikum!",
    "mrFresherGreatTitle": "🟢 85% Sehr gute Passung (Einsteiger)",
    "mrFresherGreatDesc": "Deine aktuellen Kenntnisse passen sehr gut zu Einsteigerstellen!",
    "mrJuniorReadyTitle": "🟢 75% Bereit zur Bewerbung (Junior)",
    "mrJuniorReadyDesc": "Bewirb dich selbstbewusst mit den Projekten, die du auf DevMaster Hub gebaut hast!",
    "mrAdvancedTargetTitle": "🔴 30% Weiterführendes Ziel (Senior)",
    "mrAdvancedTargetDesc": "Es fehlen noch 1-2 Jahre Praxiserfahrung.",
    "mrNeedProjectTitle": "🟡 65% Praxisprojekte fehlen noch",
    "mrNeedProjectDesc": "Gute Passung — schließe ein weiteres Praxisprojekt ab, um deine Chancen zu erhöhen.",
    "mrReadyTitle": "🟢 {rate}% Bereit zur Bewerbung",
    "mrReadyDesc": "Dein Profil passt gut zu den Anforderungen der Stelle.",
    "challengeNav": "Challenges",
    "challengeTitle": "🚩 Linux- und Security-Challenges",
    "challengeSubtitle": "Übe Linux-Befehle in einem virtuellen Terminal und sammle Flags. Klicke unten für eine neue KI-Challenge.",
    "aiChallengeTitle": "Von der KI erstellte Aufgabe",
    "aiChallengeHint": "Jeder Klick liefert eine andere Aufgabe, lösbar mit einfachen Linux-Befehlen.",
    "aiChallengeBtn": "Neue Aufgabe",
    "aiChallengeLoading": "Die KI erstellt eine Aufgabe…",
    "aiChallengeBad": "Die KI-Antwort hat nicht das erwartete Format. Klicke auf „Neue Aufgabe“, um es erneut zu versuchen.",
    "needLogin": "Zum Nutzen dieser Funktion musst du dich anmelden.",
    "aiBusy": "Die KI ist ausgelastet, versuche es gleich noch einmal.",
    "challengeEntryHint": "Übe Linux-Befehle und sammle Flags"
  },
  "es": {
    "tutorHeader": "Pregunta al tutor de IA sobre",
    "tutorWelcome": "¡Pregunta lo que quieras sobre esta sección!",
    "explainSimply": "Explícame esta sección de forma sencilla",
    "explainSimplyBtn": "Explicación sencilla",
    "moreExamples": "Dame más ejemplos de código prácticos",
    "moreExamplesBtn": "Más ejemplos",
    "keyTakeaways": "¿Cuál es la idea clave que debo recordar?",
    "keyTakeawaysBtn": "Ideas clave",
    "askAiPlaceholder": "Pregunta a la IA sobre esta lección...",
    "thinking": "Pensando",
    "clearLessonChat": "🗑️ Borrar conversación",
    "tabLabelTheory": "Teoría",
    "tabLabelCode": "Ejemplo de código",
    "tabLabelQuiz": "Cuestionario",
    "tabLabelExercise": "Ejercicio",
    "dashboard": "Panel",
    "projectLab": "Laboratorio de proyectos",
    "myProjects": "Mis proyectos",
    "careerAdvisor": "Asesor profesional",
    "technologies": "Rutas de aprendizaje",
    "logout": "Cerrar sesión",
    "aiOnline": "IA: lista",
    "aiOffline": "IA: sin conexión",
    "langSwitch": "Idioma",
    "dashboardTitle": "🚀 Panel",
    "dashboardSubtitle": "Ruta de aprendizaje de principiante a desarrollador senior",
    "searchPlaceholder": "Buscar lecciones, tecnologías, conceptos...",
    "statTech": "Tecnologías",
    "statLessons": "Lecciones",
    "statCompleted": "Completadas",
    "statProgress": "Progreso",
    "lessonsUnit": "lecciones",
    "levelsUnit": "niveles",
    "catLanguages": "💻 Lenguajes de programación",
    "catFrontend": "🎨 Desarrollo frontend",
    "catBackend": "⚙️ Backend y API",
    "catMobile": "📱 Desarrollo móvil",
    "catTools": "🔧 Herramientas, DevOps y algoritmos",
    "back": "Volver",
    "backToRoadmap": "← Volver a la ruta",
    "markComplete": "⬜ Marcar como completada",
    "completed": "✅ Completada",
    "tabTheory": "Teoría",
    "tabCode": "Laboratorio de código",
    "tabQuiz": "Reto de cuestionario",
    "tabExercise": "Ejercicios de código",
    "keyPoints": "🔑 Ideas clave",
    "runCode": "▶ Ejecutar código",
    "running": "Ejecutando...",
    "submitQuiz": "Enviar cuestionario",
    "checkCode": "🤖 Revisión de código con IA",
    "checking": "Revisando...",
    "showHints": "💡 Pistas",
    "showSolution": "🔓 Ver solución",
    "clearCode": "Borrar código",
    "nextLesson": "Lección siguiente →",
    "prevLesson": "← Lección anterior",
    "searchFound": "Se encontraron {n} resultados",
    "noSearchResults": "No hay resultados para «{q}»",
    "careerTitle": "💼 Asesor profesional con IA y búsqueda de empleo",
    "careerSubtitle": "Orientación profesional personalizada, evaluación realista de tus competencias y ofertas de empleo en tiempo real, según tu progreso de aprendizaje.",
    "searchJobsPlaceholder": "Haz una pregunta sobre tu carrera o describe el puesto tech que buscas...",
    "searchJobsBtn": "Buscar empleo",
    "sendMsg": "Enviar",
    "clearChat": "Borrar conversación",
    "editQuestion": "✏️ Editar pregunta",
    "regenerateAnswer": "🔄 Volver a generar respuesta",
    "jobsSuggestedBar": "Empleos recomendados por la IA",
    "autoTriggerChat": "Sugeridos automáticamente durante la conversación",
    "openJobList": "▶ Haz clic para ver las ofertas",
    "collapseJobList": "▲ Contraer la lista (volver a la conversación)",
    "noJobsFound": "Aún no hay ofertas (habla con la IA para descubrir puestos que encajen)",
    "viewJobs": "Ver ofertas que encajan contigo",
    "collapseJobs": "Contraer la lista de ofertas (volver a la conversación)",
    "applyNow": "Enviar candidatura →",
    "projectLabTitle": "Laboratorio de proyectos",
    "projectLabSubtitle": "Practica con proyectos reales. La IA propone ideas, guía tu código y evalúa tus proyectos.",
    "byLevelTitle": "Por nivel de dificultad",
    "byLevelDesc": "Elige de principiante a experto. La IA generará ideas de proyecto ajustadas a tu nivel.",
    "byTopicTitle": "Por tema libre",
    "byTopicDesc": "Escribe el tema que quieras (juegos, aplicaciones web, API...). La IA diseñará un proyecto completo para ti.",
    "savedIdeasTitle": "Ideas guardadas",
    "savedIdeasDesc": "Repasa las ideas que guardaste para trabajar más adelante.",
    "startBtn": "Empezar →",
    "viewSavedBtn": "Ver {n} ideas →",
    "noSavedIdeasYet": "Todavía no has guardado ninguna idea.",
    "createIdeaByTopicBtn": "📝 Generar idea por tema",
    "backToProjectLab": "← Volver al laboratorio de proyectos",
    "byLevelHeader": "📊 Proyectos por nivel",
    "byLevelHeaderDesc": "Elige un nivel de dificultad para recibir ideas a tu medida",
    "byTopicHeader": "📝 Proyectos por tema",
    "byTopicHeaderDesc": "Escribe tu tema y la IA diseñará un proyecto personalizado",
    "topicInputPlaceholder": "p. ej. juego Snake, blog personal, API de gestión de estudiantes...",
    "generateIdeaBtn": "Generar idea",
    "newIdeaBtn": "Nueva idea",
    "saveIdeaBtn": "Guardar idea",
    "savedIdeaSuccess": "✅ Guardada",
    "myProjectsTitle": "Mis proyectos",
    "myProjectsSubtitle": "Revisa todos los proyectos enviados y las notas del mentor de IA",
    "noProjectsYet": "Aún no has enviado ningún proyecto. ¡Pásate por el laboratorio de proyectos para empezar!",
    "myProjectsBreadcrumb": "Panel › 📁 Mis proyectos",
    "overallScore": "Nota global",
    "codeQuality": "Calidad del código",
    "functionality": "Funcionalidad",
    "bestPractices": "Buenas prácticas",
    "creativity": "Creatividad",
    "aiFeedback": "💬 Comentarios del mentor de IA",
    "strengths": "💪 Puntos fuertes",
    "improvements": "📈 Aspectos a mejorar",
    "requirementsTitle": "📋 Requisitos",
    "stepsTitle": "📝 Pasos de implementación",
    "bonusFeaturesTitle": "⭐ Funciones adicionales",
    "chatWithAiMentor": "💬 Hablar con el mentor de IA",
    "askAiAboutProject": "Pregunta a la IA lo que quieras sobre este proyecto...",
    "startThisProject": "🚀 Empezar este proyecto →",
    "newIdea": "🔄 Nueva idea",
    "authLogin": "Iniciar sesión",
    "authRegister": "Registrarse",
    "authUsername": "Nombre de usuario",
    "authUsernamePlaceholder": "p. ej. devmaster2025",
    "authPassword": "Contraseña",
    "authPasswordPlaceholder": "Mínimo 6 caracteres",
    "authConfirmPassword": "Confirmar contraseña",
    "authSubtitle": "Plataforma de aprendizaje para desarrolladores, de principiante a experto",
    "levelNewbie": "Principiante",
    "levelJunior": "Fundamentos",
    "levelMid": "Intermedio",
    "levelSenior": "Avanzado",
    "levelMaster": "Experto",
    "hideHints": "🙈 Ocultar pistas",
    "showHintsBtn": "💡 Ver pistas",
    "hideSolution": "🙈 Ocultar solución",
    "showSolutionBtn": "👀 Ver solución de ejemplo",
    "answerPlaceholder": "Escribe aquí tu código o tu respuesta...",
    "writeCodeFirst": "¡Escribe algo de código antes de ejecutarlo!",
    "noContent": "Todavía no hay contenido",
    "ideaAlreadySaved": "💡 ¡Esta idea ya estaba guardada!",
    "ideaSavedShort": "¡Guardada!",
    "noContentAvailable": "No hay contenido disponible",
    "knowledgeCheck": "Evaluación de conocimientos",
    "generateQuizAi": "Generar cuestionario con IA",
    "codeExample": "Ejemplo de código",
    "copyCode": "📋 Copiar",
    "noCodeExample": "Esta lección no tiene ejemplo de código.",
    "answerCorrect": "✅ Correcto",
    "answerWrong": "❌ Incorrecto",
    "scoreExcellent": "¡Excelente!",
    "scoreGood": "¡Buen trabajo!",
    "scoreNeedsReview": "¡Hay que repasar!",
    "originalExercise": "Ejercicio original",
    "noExerciseYet": "Esta lección no tiene ejercicios.",
    "savedIdeasCount": "Tienes <strong>{n}</strong> ideas guardadas.",
    "clickBelowForIdea": "Pulsa abajo para que la IA genere una idea de proyecto de nivel <strong>{level}</strong>",
    "readyTitle": "¡Listo!",
    "aiSelects": "Que elija la IA",
    "createIdeaThenSave": "Crea una idea de proyecto y pulsa «💾 Guardar idea» para conservarla.",
    "topicLabel": "Tema",
    "deleteIdeaConfirm": "¿Eliminar esta idea?",
    "aiGeneratingLevelIdea": "La IA está generando una idea de proyecto de nivel <strong>{level}</strong>...",
    "aiGeneratingTopicIdea": "La IA está diseñando una idea de proyecto sobre «<strong>{topic}</strong>»...",
    "pasteCodeHere": "Pega aquí el código de {file}...",
    "fillAllFields": "Rellena todos los campos",
    "passwordMismatch": "Las contraseñas no coinciden",
    "loggingIn": "Iniciando sesión...",
    "registering": "Registrando...",
    "logoutConfirm": "¿Quieres cerrar sesión?",
    "thinkingShort": "Pensando",
    "jobSearchPlaceholder2": "¿Qué puesto buscas? (p. ej. React developer, Python backend)",
    "clearCareerChatConfirm": "¿Borrar todo el historial de asesoramiento profesional?",
    "askAboutProject": "Pregunta sobre este proyecto...",
    "explainSimplyMsg": "Explícame esto de forma sencilla",
    "moreExamplesMsg": "Dame más ejemplos",
    "submitted": "ENVIADO",
    "notSubmitted": "SIN ENVIAR",
    "deleteFile": "Eliminar archivo",
    "addFile": "Añadir archivo",
    "fileNamePlaceholder": "Nombre del archivo...",
    "homeBreadcrumb": "Inicio",
    "mr50Title": "🟡 50% Faltan competencias",
    "mr50Desc": "Necesitas completar lecciones especializadas para cumplir los requisitos del puesto.",
    "mrSeniorMismatchTitle": "🔴 15% Puesto senior (área distinta)",
    "mrSeniorMismatchDesc": "Este puesto exige un dominio profundo de {domain}. ¡Completa esta ruta en DevMaster Hub!",
    "mrRoadmapIncompleteTitle": "🔴 25% Ruta de {domain} incompleta",
    "mrRoadmapIncompleteDesc": "Tu perfil todavía no incluye competencias en {domain}. ¡Estudia esta ruta en DevMaster Hub!",
    "mrInternTitle": "🟢 70% Apto para prácticas",
    "mrInternDesc": "¡Dominas los fundamentos y puedes postularte a prácticas!",
    "mrFresherNeedMoreTitle": "🟡 50% Faltan 10-15 lecciones (junior)",
    "mrFresherNeedMoreDesc": "Solo has completado {n} lecciones básicas. Termina POO, estructuras de datos y un miniproyecto antes de postularte.",
    "mrLongTermSeniorTitle": "🔴 15% Objetivo a largo plazo (senior)",
    "mrLongTermSeniorDesc": "Los puestos senior exigen varios años de experiencia real.",
    "mrLevelGapTitle": "🔴 30% Nivel insuficiente (ingeniero de plantilla)",
    "mrLevelGapDesc": "Los puestos de ingeniero exigen dominar POO, gestión de memoria, estructuras de datos y experiencia real en proyectos.",
    "mrInternStrongTitle": "🟢 95% De sobra cualificado (prácticas)",
    "mrInternStrongDesc": "¡Tu base es excelente para un puesto de prácticas!",
    "mrFresherGreatTitle": "🟢 85% Encaje muy bueno (junior)",
    "mrFresherGreatDesc": "¡Tus conocimientos actuales encajan muy bien en puestos junior!",
    "mrJuniorReadyTitle": "🟢 75% Listo para postular (junior)",
    "mrJuniorReadyDesc": "¡Envía tu CV con confianza junto a los proyectos que hiciste en DevMaster Hub!",
    "mrAdvancedTargetTitle": "🔴 30% Objetivo avanzado (senior)",
    "mrAdvancedTargetDesc": "Necesitas 1-2 años más de experiencia real.",
    "mrNeedProjectTitle": "🟡 65% Falta portafolio de proyectos",
    "mrNeedProjectDesc": "Buen encaje: completa un proyecto práctico más para mejorar tus opciones.",
    "mrReadyTitle": "🟢 {rate}% Listo para postular",
    "mrReadyDesc": "Tus competencias encajan bien con los requisitos del puesto.",
    "challengeNav": "Retos",
    "challengeTitle": "🚩 Retos de Linux y seguridad",
    "challengeSubtitle": "Practica comandos de Linux en una terminal virtual y captura banderas. Pulsa abajo para un reto nuevo generado por la IA.",
    "aiChallengeTitle": "Reto generado por la IA",
    "aiChallengeHint": "Cada clic da un reto distinto, resoluble con comandos básicos de Linux.",
    "aiChallengeBtn": "Nuevo reto",
    "aiChallengeLoading": "La IA está creando un reto…",
    "aiChallengeBad": "La respuesta de la IA no tiene el formato correcto. Pulsa « Nuevo reto » para intentarlo de nuevo.",
    "needLogin": "Necesitas iniciar sesión para usar esta función.",
    "aiBusy": "La IA está ocupada, inténtalo de nuevo en un momento.",
    "challengeEntryHint": "Practica comandos de Linux y captura banderas"
  }
};

  const canonicalTitles = {
  "production-architecture-load-balancing-ssl-tls": {
    "vi": "Kiến trúc máy chủ Production, Cân bằng tải Load Balancing & SSL/TLS",
    "en": "Production Architecture, Load Balancing & SSL/TLS"
  },
  "building-multi-stage-advanced-ci-cd-pipelines": {
    "vi": "Xây dựng Pipeline CI/CD đa giai đoạn nâng cao",
    "en": "Building Multi-Stage Advanced CI/CD Pipelines"
  },
  "ci-cd-foundations-automated-pipelines": {
    "vi": "Nền tảng CI/CD & Pipeline tự động hóa",
    "en": "CI/CD Foundations & Automated Pipelines"
  },
  "async-generics-asp-net-core": {
    "vi": "Bất đồng bộ, Generics & ASP.NET Core",
    "en": "Async, Generics & ASP.NET Core"
  },
  "framework-packaging-xcode-cloud-ci-cd-tca": {
    "vi": "Đóng gói Frameworks, CI/CD Xcode Cloud & Kiến trúc TCA",
    "en": "Framework Packaging, Xcode Cloud CI/CD & TCA"
  },
  "system-design-with-node-js": {
    "vi": "System Design với Node.js",
    "en": "System Design with Node.js",
    "ja": "Node.jsによるシステム設計",
    "ko": "Node.js를 사용한 시스템 설계",
    "zh": "使用 Node.js 进行系统设计",
    "fr": "Conception de système avec Node.js",
    "de": "Systemdesign mit Node.js",
    "es": "Diseño de sistemas con Node.js"
  },
  "advanced-type-system-type-classes-implicits-givens": {
    "vi": "Hệ thống kiểu nâng cao & Type Classes (Implicits/Givens)",
    "en": "Advanced Type System & Type Classes (Implicits/Givens)",
    "ja": "高度な型システムと型クラス (暗黙的/与えられたもの)",
    "ko": "고급 유형 시스템 및 유형 클래스(암시적/주어진)",
    "zh": "高级类型系统和类型类（隐式/给定）",
    "fr": "Système de types avancé et classes de types (implicites/données)",
    "de": "Erweitertes Typsystem und Typklassen (Implizite/Gegebene)",
    "es": "Sistema de tipos avanzado y clases de tipos (implícitos/dados)"
  },
  "embedding-lua-interpreter-in-c-c-programs": {
    "vi": "Nhúng Lua Interpreter vào chương trình C/C++",
    "en": "Embedding Lua Interpreter in C/C++ Programs"
  },
  "async-i-o-network-programming": {
    "vi": "I/O Bất đồng bộ & Lập trình Mạng",
    "en": "Async I/O & Network Programming"
  },
  "user-authentication-authorization-gates-policies": {
    "vi": "Xác thực người dùng & Phân quyền bảo mật (Gates/Policies)",
    "en": "User Authentication & Authorization (Gates/Policies)"
  },
  "performance-optimization-span-memory": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ Span/Memory",
    "en": "Performance Optimization & Span/Memory"
  },
  "building-web-apis-with-asp-net-core": {
    "vi": "Xây dựng Web API với ASP.NET Core",
    "en": "Building Web APIs with ASP.NET Core"
  },
  "asynchronous-programming-with-async-await": {
    "vi": "Lập trình bất đồng bộ Async/Await",
    "en": "Asynchronous Programming with Async/Await"
  },
  "fullstack-vue-development-with-nuxt-js-ssr": {
    "vi": "Phát triển Fullstack Vue với Nuxt.js & SSR",
    "en": "Fullstack Vue Development with Nuxt.js & SSR",
    "ja": "Nuxt.js と SSR を使用したフルスタック Vue 開発",
    "ko": "Nuxt.js 및 SSR을 사용한 풀스택 Vue 개발",
    "zh": "使用 Nuxt.js 和 SSR 进行全栈 Vue 开发",
    "fr": "Développement Fullstack Vue avec Nuxt.js et SSR",
    "de": "Fullstack Vue-Entwicklung mit Nuxt.js & SSR",
    "es": "Desarrollo Fullstack Vue con Nuxt.js y SSR"
  },
  "node-js-foundations-event-loop-model": {
    "vi": "Nền tảng Node.js & Mô hình Event Loop",
    "en": "Node.js Foundations & Event Loop Model"
  },
  "embedding-lua-into-c-c-applications": {
    "vi": "Nhúng Lua vào ứng dụng C/C++",
    "en": "Embedding Lua into C/C++ Applications"
  },
  "performance-optimization-spanmemory": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ Span/Memory",
    "en": "Performance Optimization & Span/Memory"
  },
  "production-deployment-scalability": {
    "vi": "Triển khai ứng dụng lên Production & Mở rộng quy mô",
    "en": "Production Deployment & Scalability"
  },
  "production-architecture-load-balancing-ssltls": {
    "vi": "Kiến trúc máy chủ Production, Cân bằng tải Load Balancing & SSL/TLS",
    "en": "Production Architecture, Load Balancing & SSL/TLS"
  },
  "kien-truc-may-chu-production-can-bang-tai-load-balancing-ssltls": {
    "vi": "Kiến trúc máy chủ Production, Cân bằng tải Load Balancing & SSL/TLS",
    "en": "Production Architecture, Load Balancing & SSL/TLS"
  },
  "nginx-server-optimization-caching-gzip-compression": {
    "vi": "Tối ưu hiệu năng máy chủ Nginx, Caching & Nén Gzip",
    "en": "Nginx Server Optimization, Caching & Gzip Compression"
  },
  "nginx-web-server-fundamentals-reverse-proxy": {
    "vi": "Cơ bản về Nginx Web Server & Cấu hình Reverse Proxy",
    "en": "Nginx Web Server Fundamentals & Reverse Proxy"
  },
  "gitops-with-argocd-automated-deployments": {
    "vi": "Mô hình GitOps với ArgoCD & Tự động triển khai",
    "en": "GitOps with ArgoCD & Automated Deployments"
  },
  "pipeline-security-vulnerability-scanning-quality-gates": {
    "vi": "Bảo mật Pipeline, Quét lỗ hổng & Cổng chất lượng",
    "en": "Pipeline Security, Vulnerability Scanning & Quality Gates",
    "ja": "パイプラインのセキュリティ、脆弱性スキャン、品質ゲート",
    "ko": "파이프라인 보안, 취약점 검색 및 품질 게이트",
    "zh": "管道安全、漏洞扫描和质量门",
    "fr": "Sécurité des pipelines, analyse des vulnérabilités et contrôles de qualité",
    "de": "Pipeline-Sicherheit, Schwachstellen-Scanning und Quality Gates",
    "es": "Seguridad de tuberías, escaneo de vulnerabilidades y puertas de calidad"
  },
  "building-multi-stage-advanced-cicd-pipelines": {
    "vi": "Xây dựng Pipeline CI/CD đa giai đoạn nâng cao",
    "en": "Building Multi-Stage Advanced CI/CD Pipelines"
  },
  "xay-dung-pipeline-cicd-da-giai-doan-nang-cao": {
    "vi": "Xây dựng Pipeline CI/CD đa giai đoạn nâng cao",
    "en": "Building Multi-Stage Advanced CI/CD Pipelines"
  },
  "cicd-foundations-automated-pipelines": {
    "vi": "Nền tảng CI/CD & Pipeline tự động hóa",
    "en": "CI/CD Foundations & Automated Pipelines"
  },
  "nen-tang-cicd-pipeline-tu-dong-hoa": {
    "vi": "Nền tảng CI/CD & Pipeline tự động hóa",
    "en": "CI/CD Foundations & Automated Pipelines"
  },
  "kubernetes-networking-services-ingress": {
    "vi": "Mạng nội bộ Kubernetes, Dịch vụ Services & Ingress",
    "en": "Kubernetes Networking, Services & Ingress"
  },
  "advanced-flutter-architecture-app-deployment": {
    "vi": "Mẫu kiến trúc Flutter nâng cao & Triển khai ứng dụng",
    "en": "Advanced Flutter Architecture & App Deployment"
  },
  "flutter-performance-native-platform-interop": {
    "vi": "Tối ưu hiệu năng Flutter & Tương tác Native Platform",
    "en": "Flutter Performance & Native Platform Interop"
  },
  "flutter-app-architecture-backend-api-integration": {
    "vi": "Kiến trúc ứng dụng Flutter & Kết nối API Backend",
    "en": "Flutter App Architecture & Backend API Integration"
  },
  "system-architecture-distributed-net-design": {
    "vi": "Kiến trúc hệ thống & Thiết kế phân tán .NET",
    "en": "System Architecture & Distributed .NET Design"
  },
  "performance-optimization-advanced-net-features": {
    "vi": "Tối ưu hiệu năng & Tính năng .NET nâng cao",
    "en": "Performance Optimization & Advanced .NET Features",
    "ja": "パフォーマンスの最適化と高度な .NET 機能",
    "ko": "성능 최적화 및 고급 .NET 기능",
    "zh": "性能优化和高级 .NET 功能",
    "fr": "Optimisation des performances et fonctionnalités .NET avancées",
    "de": "Leistungsoptimierung und erweiterte .NET-Funktionen",
    "es": "Optimización del rendimiento y funciones avanzadas de .NET"
  },
  "async-generics-aspnet-core": {
    "vi": "Bất đồng bộ, Generics & ASP.NET Core",
    "en": "Async, Generics & ASP.NET Core"
  },
  "bat-dong-bo-generics-aspnet-core": {
    "vi": "Bất đồng bộ, Generics & ASP.NET Core",
    "en": "Async, Generics & ASP.NET Core"
  },
  "advanced-algorithms-extended-data-structures": {
    "vi": "Thuật toán nâng cao & Cấu trúc dữ liệu mở rộng",
    "en": "Advanced Algorithms & Extended Data Structures"
  },
  "advanced-bash-scripting": {
    "vi": "Lập trình Bash Script nâng cao",
    "en": "Advanced Bash Scripting"
  },
  "system-automation-devops": {
    "vi": "Tự động hóa tác vụ hệ thống & DevOps",
    "en": "System Automation & DevOps"
  },
  "testing-angular-performance-optimization": {
    "vi": "Kiểm thử ứng dụng & Tối ưu hiệu năng Angular",
    "en": "Testing & Angular Performance Optimization"
  },
  "services-dependency-injection-routing": {
    "vi": "Services, Dependency Injection & Định tuyến Routing",
    "en": "Services, Dependency Injection & Routing",
    "ja": "サービス、依存関係の注入、ルーティング",
    "ko": "서비스, 종속성 주입 및 라우팅",
    "zh": "服务、依赖注入和路由",
    "fr": "Services, injection de dépendances et routage",
    "de": "Dienste, Abhängigkeitsinjektion und Routing",
    "es": "Servicios, inyección de dependencia y enrutamiento"
  },
  "decentralized-finance-defi-protocols": {
    "vi": "Giao thức Tài chính Phi tập trung (DeFi)",
    "en": "Decentralized Finance (DeFi) Protocols"
  },
  "erc-20-standards-smart-contract-security": {
    "vi": "Tiêu chuẩn ERC-20 & Bảo mật hợp đồng",
    "en": "ERC-20 Standards & Smart Contract Security"
  },
  "os-level-embedded-programming": {
    "vi": "Lập trình cấp hệ điều hành & Nhúng",
    "en": "OS-Level & Embedded Programming"
  },
  "comptime-asynchronous-programming-ffi": {
    "vi": "Comptime, Lập trình bất đồng bộ & FFI",
    "en": "Comptime, Asynchronous Programming & FFI",
    "ja": "コンプタイム、非同期プログラミング、FFI",
    "ko": "Comptime, 비동기 프로그래밍 및 FFI",
    "zh": "Comptime、异步编程和 FFI",
    "fr": "Comptime, Programmation Asynchrone & FFI",
    "de": "Comptime, asynchrone Programmierung und FFI",
    "es": "Comptime, programación asincrónica y FFI"
  },
  "structs-memory-management-slices": {
    "vi": "Structs, Quản lý bộ nhớ & Slices",
    "en": "Structs, Memory Management & Slices"
  },
  "oop-quan-ly-bo-nho": {
    "vi": "OOP & Quản lý bộ nhớ",
    "en": "OOP & Memory Management",
    "ja": "OOPとメモリ管理",
    "ko": "OOP 및 메모리 관리",
    "zh": "面向对象编程与内存管理",
    "fr": "POO et gestion de la mémoire",
    "de": "OOP & Speicherverwaltung",
    "es": "POO y gestión de memoria"
  },
  "oop-memory-management": {
    "vi": "OOP & quản lý bộ nhớ",
    "en": "OOP & memory management",
    "ja": "OOP とメモリ管理",
    "ko": "OOP 및 메모리 관리",
    "zh": "面向对象编程和内存管理",
    "fr": "POO et gestion de la mémoire",
    "de": "OOP und Speicherverwaltung",
    "es": "POO y gestión de memoria"
  },
  "mau-thiet-ke-proxy-nang-cap-hop-dong": {
    "vi": "Mẫu thiết kế Proxy & Nâng cấp hợp đồng",
    "en": "Proxy Design Pattern & Contract Upgrade",
    "ja": "プロキシ設計パターンと契約のアップグレード",
    "ko": "프록시 디자인 패턴 및 계약 업그레이드",
    "zh": "代理设计模式&合约升级",
    "fr": "Modèle de conception de proxy et mise à niveau du contrat",
    "de": "Proxy-Entwurfsmuster und Vertrags-Upgrade",
    "es": "Patrón de diseño de proxy y actualización de contrato"
  },
  "proxy-patterns-contract-upgrades": {
    "vi": "Mẫu thiết kế Proxy & Nâng cấp hợp đồng",
    "en": "Proxy Patterns & Contract Upgrades",
    "ja": "プロキシパターンとコントラクトアップグレード",
    "ko": "프록시 패턴 및 계약 업그레이드",
    "zh": "代理模式与合约升级",
    "fr": "Modèles de proxy et mises à niveau de contrat",
    "de": "Proxy-Muster & Vertrags-Upgrades",
    "es": "Patrones de proxy y actualizaciones de contratos"
  },
  "kien-truc-protocol-quan-tri-dao": {
    "vi": "Kiến trúc Protocol & Quản trị DAO",
    "en": "Protocol Architecture & DAO Governance",
    "ja": "プロトコルアーキテクチャとDAOガバナンス",
    "ko": "프로토콜 아키텍처 및 DAO 거버넌스",
    "zh": "协议架构和 DAO 治理",
    "fr": "Architecture du protocole et gouvernance du DAO",
    "de": "Protokollarchitektur und DAO-Governance",
    "es": "Arquitectura de protocolo y gobernanza DAO"
  },
  "protocol-architecture-dao-governance": {
    "vi": "Kiến trúc Protocol & Quản trị DAO",
    "en": "Protocol Architecture & DAO Governance",
    "ja": "プロトコルアーキテクチャとDAOガバナンス",
    "ko": "프로토콜 아키텍처 및 DAO 거버넌스",
    "zh": "协议架构和 DAO 治理",
    "fr": "Architecture du protocole et gouvernance du DAO",
    "de": "Protokollarchitektur und DAO-Governance",
    "es": "Arquitectura de protocolo y gobernanza DAO"
  },
  "cu-phap-co-ban-cau-truc-tables": {
    "vi": "Cú pháp cơ bản & Cấu trúc Tables",
    "en": "Basic Syntax & Tables Structure",
    "ja": "基本的な構文とテーブルの構造",
    "ko": "기본 구문 및 테이블 구조",
    "zh": "基本语法和表格结构",
    "fr": "Syntaxe de base et structure des tables",
    "de": "Grundlegende Syntax und Tabellenstruktur",
    "es": "Sintaxis básica y estructura de tablas"
  },
  "basic-syntax-tables-structure": {
    "vi": "Cú pháp cơ bản & Cấu trúc Tables",
    "en": "Basic Syntax & Tables Structure",
    "ja": "基本的な構文とテーブルの構造",
    "ko": "기본 구문 및 테이블 구조",
    "zh": "基本语法和表格结构",
    "fr": "Syntaxe de base et structure des tables",
    "de": "Grundlegende Syntax und Tabellenstruktur",
    "es": "Sintaxis básica y estructura de tablas"
  },
  "huong-doi-tuong-voi-metatables-modules": {
    "vi": "Hướng đối tượng với Metatables & Modules",
    "en": "Object-oriented with Metatables & Modules",
    "ja": "メタテーブルとモジュールを使用したオブジェクト指向",
    "ko": "메타테이블 및 모듈을 사용한 객체 지향",
    "zh": "面向对象的元表和模块",
    "fr": "Orienté objet avec métatables et modules",
    "de": "Objektorientiert mit Metatabellen und Modulen",
    "es": "Orientado a objetos con metatablas y módulos"
  },
  "oop-with-metatables-modules": {
    "vi": "Hướng đối tượng với Metatables & Modules",
    "en": "OOP with Metatables & Modules",
    "ja": "メタテーブルとモジュールによるオブジェクト指向",
    "ko": "메타테이블 및 모듈을 사용한 객체 지향",
    "zh": "使用元表与模块的面向对象",
    "fr": "POO avec métatables et modules",
    "de": "OOP mit Metatables & Modulen",
    "es": "POO con metatablas y módulos"
  },
  "phat-trien-game-voi-love2d-roblox": {
    "vi": "Phát triển Game với Love2D & Roblox",
    "en": "Game Development with Love2D & Roblox",
    "ja": "Love2D と Roblox によるゲーム開発",
    "ko": "Love2D와 Roblox를 이용한 게임 개발",
    "zh": "使用 Love2D 和 Roblox 进行游戏开发",
    "fr": "Développement de jeux avec Love2D et Roblox",
    "de": "Spieleentwicklung mit Love2D & Roblox",
    "es": "Desarrollo de juegos con Love2D y Roblox"
  },
  "game-development-with-love2d-roblox": {
    "vi": "Phát triển Game với Love2D & Roblox",
    "en": "Game Development with Love2D & Roblox",
    "ja": "Love2D と Roblox によるゲーム開発",
    "ko": "Love2D와 Roblox를 이용한 게임 개발",
    "zh": "使用 Love2D 和 Roblox 进行游戏开发",
    "fr": "Développement de jeux avec Love2D et Roblox",
    "de": "Spieleentwicklung mit Love2D & Roblox",
    "es": "Desarrollo de juegos con Love2D y Roblox"
  },
  "nhung-lua-vao-ung-dung-cc": {
    "vi": "Nhúng Lua vào ứng dụng C/C++",
    "en": "Embedding Lua into C/C++ Applications"
  },
  "embedding-lua-into-cc-applications": {
    "vi": "Nhúng Lua vào ứng dụng C/C++",
    "en": "Embedding Lua into C/C++ Applications"
  },
  "coroutines-toi-uu-hoa-voi-luajit": {
    "vi": "Coroutines & Tối ưu hóa với LuaJIT",
    "en": "Coroutines & Optimization with LuaJIT",
    "ja": "LuaJIT によるコルーチンと最適化",
    "ko": "LuaJIT를 사용한 코루틴 및 최적화",
    "zh": "使用 LuaJIT 进行协程和优化",
    "fr": "Coroutines et optimisation avec LuaJIT",
    "de": "Coroutinen & Optimierung mit LuaJIT",
    "es": "Corrutinas y optimización con LuaJIT"
  },
  "coroutines-optimization-with-luajit": {
    "vi": "Coroutines & Tối ưu hóa với LuaJIT",
    "en": "Coroutines & Optimization with LuaJIT",
    "ja": "LuaJIT によるコルーチンと最適化",
    "ko": "LuaJIT를 사용한 코루틴 및 최적화",
    "zh": "使用 LuaJIT 进行协程和优化",
    "fr": "Coroutines et optimisation avec LuaJIT",
    "de": "Coroutinen & Optimierung mit LuaJIT",
    "es": "Corrutinas y optimización con LuaJIT"
  },
  "nen-tang-r-vector-phan-tich-co-ban": {
    "vi": "Nền tảng R, Vector & Phân tích cơ bản",
    "en": "R Foundation, Vector & Fundamental Analysis",
    "ja": "R 基礎、ベクトルおよびファンダメンタルズ分析",
    "ko": "R 기초, 벡터 및 기초 분석",
    "zh": "R 基础、向量和基本面分析",
    "fr": "Fondation R, analyse vectorielle et fondamentale",
    "de": "R Foundation, Vektor- und Fundamentalanalyse",
    "es": "Fundación R, análisis vectorial y fundamental"
  },
  "r-foundations-vectors-basic-analytics": {
    "vi": "Nền tảng R, Vector & Phân tích cơ bản",
    "en": "R Foundations, Vectors & Basic Analytics",
    "ja": "Rの基礎、ベクトル、基本分析",
    "ko": "R 기초, 벡터 및 기본 분석",
    "zh": "R基础、向量与基本分析",
    "fr": "Bases de R, vecteurs et analyse de base",
    "de": "R-Grundlagen, Vektoren & Basisanalyse",
    "es": "Fundamentos de R, vectores y análisis básico"
  },
  "xu-ly-du-lieu-voi-dplyr-thong-ke-suy-dien": {
    "vi": "Xử lý dữ liệu với dplyr & Thống kê suy diễn",
    "en": "Data Processing with dplyr & Inferential Statistics",
    "ja": "dplyr と推論統計によるデータ処理",
    "ko": "dplyr 및 추론 통계를 사용한 데이터 처리",
    "zh": "使用 dplyr 和推理统计进行数据处理",
    "fr": "Traitement des données avec dplyr et statistiques inférentielles",
    "de": "Datenverarbeitung mit dplyr und Inferenzstatistik",
    "es": "Procesamiento de datos con dplyr y estadística inferencial"
  },
  "data-processing-with-dplyr-inferential-statistics": {
    "vi": "Xử lý dữ liệu với dplyr & Thống kê suy diễn",
    "en": "Data Processing with dplyr & Inferential Statistics",
    "ja": "dplyr と推論統計によるデータ処理",
    "ko": "dplyr 및 추론 통계를 사용한 데이터 처리",
    "zh": "使用 dplyr 和推理统计进行数据处理",
    "fr": "Traitement des données avec dplyr et statistiques inférentielles",
    "de": "Datenverarbeitung mit dplyr und Inferenzstatistik",
    "es": "Procesamiento de datos con dplyr y estadística inferencial"
  },
  "machine-learning-hoc-may-trong-r": {
    "vi": "Machine Learning & Học máy trong R",
    "en": "Machine Learning & Machine Learning in R",
    "ja": "機械学習と R の機械学習",
    "ko": "R의 기계 학습 및 기계 학습",
    "zh": "机器学习和 R 中的机器学习",
    "fr": "Apprentissage automatique et apprentissage automatique dans R",
    "de": "Maschinelles Lernen und maschinelles Lernen in R",
    "es": "Aprendizaje automático y aprendizaje automático en R"
  },
  "machine-learning-models-in-r": {
    "vi": "Machine Learning & Học máy trong R",
    "en": "Machine Learning & Models in R",
    "ja": "Rにおける機械学習とモデル",
    "ko": "R에서의 머신러닝 및 모델",
    "zh": "R中的机器学习与模型",
    "fr": "Apprentissage automatique et modèles en R",
    "de": "Maschinelles Lernen & Modelle in R",
    "es": "Aprendizaje automático y modelos en R"
  },
  "xay-dung-dashboard-tuong-tac-voi-shiny": {
    "vi": "Xây dựng Dashboard tương tác với Shiny",
    "en": "Build interactive Dashboards with Shiny",
    "ja": "Shiny を使用してインタラクティブなダッシュボードを構築する",
    "ko": "Shiny를 사용하여 대화형 대시보드 구축",
    "zh": "使用 Shiny 构建交互式仪表板",
    "fr": "Créez des tableaux de bord interactifs avec Shiny",
    "de": "Erstellen Sie interaktive Dashboards mit Shiny",
    "es": "Cree paneles interactivos con Shiny"
  },
  "interactive-dashboard-development-with-shiny": {
    "vi": "Xây dựng Dashboard tương tác với Shiny",
    "en": "Interactive Dashboard Development with Shiny",
    "ja": "Shinyによるインタラクティブダッシュボード構築",
    "ko": "Shiny를 활용한 대화형 대시보드 구축",
    "zh": "使用Shiny构建交互式仪表板",
    "fr": "Création de tableaux de bord interactifs avec Shiny",
    "de": "Interaktive Dashboard-Entwicklung mit Shiny",
    "es": "Construcción de tableros interactivos con Shiny"
  },
  "r-trong-moi-truong-doanh-nghiep-big-data": {
    "vi": "R trong Môi trường Doanh nghiệp & Big Data",
    "en": "R in Enterprise & Big Data Environments",
    "ja": "エンタープライズおよびビッグデータ環境における R",
    "ko": "엔터프라이즈 및 빅 데이터 환경의 R",
    "zh": "企业和大数据环境中的 R",
    "fr": "R dans les environnements d’entreprise et Big Data",
    "de": "R in Unternehmens- und Big-Data-Umgebungen",
    "es": "R en entornos empresariales y de big data"
  },
  "r-in-enterprise-big-data-environments": {
    "vi": "R trong Môi trường Doanh nghiệp & Big Data",
    "en": "R in Enterprise & Big Data Environments",
    "ja": "エンタープライズおよびビッグデータ環境における R",
    "ko": "엔터프라이즈 및 빅 데이터 환경의 R",
    "zh": "企业和大数据环境中的 R",
    "fr": "R dans les environnements d’entreprise et Big Data",
    "de": "R in Unternehmens- und Big-Data-Umgebungen",
    "es": "R en entornos empresariales y de big data"
  },
  "cu-phap-co-ban-bien-collections": {
    "vi": "Cú pháp cơ bản, Biến & Collections",
    "en": "Basic Syntax, Variables & Collections",
    "ja": "基本的な構文、変数、コレクション",
    "ko": "기본 구문, 변수 및 컬렉션",
    "zh": "基本语法、变量和集合",
    "fr": "Syntaxe de base, variables et collections",
    "de": "Grundlegende Syntax, Variablen und Sammlungen",
    "es": "Sintaxis básica, variables y colecciones"
  },
  "basic-syntax-variables-collections": {
    "vi": "Cú pháp cơ bản, Biến & Collections",
    "en": "Basic Syntax, Variables & Collections",
    "ja": "基本的な構文、変数、コレクション",
    "ko": "기본 구문, 변수 및 컬렉션",
    "zh": "基本语法、变量和集合",
    "fr": "Syntaxe de base, variables et collections",
    "de": "Grundlegende Syntax, Variablen und Sammlungen",
    "es": "Sintaxis básica, variables y colecciones"
  },
  "lap-trinh-ham-nang-cao-xu-ly-bat-dong-bo": {
    "vi": "Lập trình Hàm nâng cao & Xử lý Bất đồng bộ",
    "en": "Advanced Functional Programming & Asynchronous Processing",
    "ja": "高度な関数型プログラミングと非同期処理",
    "ko": "고급 함수형 프로그래밍 및 비동기 처리",
    "zh": "高级函数式编程和异步处理",
    "fr": "Programmation fonctionnelle avancée et traitement asynchrone",
    "de": "Erweiterte funktionale Programmierung und asynchrone Verarbeitung",
    "es": "Programación funcional avanzada y procesamiento asincrónico"
  },
  "advanced-functional-programming-async": {
    "vi": "Lập trình Hàm nâng cao & Xử lý Bất đồng bộ",
    "en": "Advanced Functional Programming & Async",
    "ja": "高度な関数型プログラミングと非同期処理",
    "ko": "고급 함수형 프로그래밍 및 비동기 처리",
    "zh": "高级函数式编程与异步处理",
    "fr": "Programmation fonctionnelle avancée et asynchrone",
    "de": "Fortgeschrittene funktionale Programmierung & Asynchronität",
    "es": "Programación funcional avanzada y asíncrona"
  },
  "xu-ly-du-lieu-lon-voi-apache-spark": {
    "vi": "Xử lý Dữ liệu lớn với Apache Spark",
    "en": "Processing Big Data with Apache Spark",
    "ja": "Apache Spark によるビッグデータの処理",
    "ko": "Apache Spark로 빅데이터 처리",
    "zh": "使用 Apache Spark 处理大数据",
    "fr": "Traitement du Big Data avec Apache Spark",
    "de": "Big Data mit Apache Spark verarbeiten",
    "es": "Procesando Big Data con Apache Spark"
  },
  "big-data-processing-with-apache-spark": {
    "vi": "Xử lý Dữ liệu lớn với Apache Spark",
    "en": "Big Data Processing with Apache Spark",
    "ja": "Apache Sparkによるビッグデータ処理",
    "ko": "Apache Spark를 활용한 빅데이터 처리",
    "zh": "使用Apache Spark处理大数据",
    "fr": "Traitement du Big Data avec Apache Spark",
    "de": "Big-Data-Verarbeitung mit Apache Spark",
    "es": "Procesamiento de Big Data con Apache Spark"
  },
  "he-thong-kieu-nang-cao-type-classes": {
    "vi": "Hệ thống Kiểu nâng cao & Type Classes",
    "en": "Advanced Type System & Type Classes",
    "ja": "高度な型システムと型クラス",
    "ko": "고급 유형 시스템 및 유형 클래스",
    "zh": "高级类型系统和类型类",
    "fr": "Système de types avancé et classes de types",
    "de": "Erweitertes Typsystem und Typklassen",
    "es": "Sistema de tipos avanzado y clases de tipos"
  },
  "advanced-type-system-type-classes": {
    "vi": "Hệ thống Kiểu nâng cao & Type Classes",
    "en": "Advanced Type System & Type Classes",
    "ja": "高度な型システムと型クラス",
    "ko": "고급 유형 시스템 및 유형 클래스",
    "zh": "高级类型系统和类型类",
    "fr": "Système de types avancé et classes de types",
    "de": "Erweitertes Typsystem und Typklassen",
    "es": "Sistema de tipos avanzado y clases de tipos"
  },
  "kien-truc-microservices-voi-akka-zio": {
    "vi": "Kiến trúc Microservices với Akka & ZIO",
    "en": "Microservices Architecture with Akka & ZIO",
    "ja": "Akka と ZIO によるマイクロサービス アーキテクチャ",
    "ko": "Akka 및 ZIO를 사용한 마이크로서비스 아키텍처",
    "zh": "使用 Akka 和 ZIO 的微服务架构",
    "fr": "Architecture de microservices avec Akka et ZIO",
    "de": "Microservices-Architektur mit Akka & ZIO",
    "es": "Arquitectura de microservicios con Akka y ZIO"
  },
  "microservices-architecture-with-akka-zio": {
    "vi": "Kiến trúc Microservices với Akka & ZIO",
    "en": "Microservices Architecture with Akka & ZIO",
    "ja": "Akka と ZIO によるマイクロサービス アーキテクチャ",
    "ko": "Akka 및 ZIO를 사용한 마이크로서비스 아키텍처",
    "zh": "使用 Akka 和 ZIO 的微服务架构",
    "fr": "Architecture de microservices avec Akka et ZIO",
    "de": "Microservices-Architektur mit Akka & ZIO",
    "es": "Arquitectura de microservicios con Akka y ZIO"
  },
  "cu-phap-co-ban-he-thong-kieu-trong-go": {
    "vi": "Cú pháp cơ bản & Hệ thống kiểu trong Go",
    "en": "Basic Syntax & Type System in Go",
    "ja": "Go の基本的な構文と型システム",
    "ko": "Go의 기본 구문 및 유형 시스템",
    "zh": "Go 中的基本语法和类型系统",
    "fr": "Syntaxe de base et système de type dans Go",
    "de": "Grundlegende Syntax und Typsystem in Go",
    "es": "Sintaxis básica y sistema de tipos en Go"
  },
  "basic-syntax-type-system-in-go": {
    "vi": "Cú pháp cơ bản & Hệ thống kiểu trong Go",
    "en": "Basic Syntax & Type System in Go",
    "ja": "Go の基本的な構文と型システム",
    "ko": "Go의 기본 구문 및 유형 시스템",
    "zh": "Go 中的基本语法和类型系统",
    "fr": "Syntaxe de base et système de type dans Go",
    "de": "Grundlegende Syntax und Typsystem in Go",
    "es": "Sintaxis básica y sistema de tipos en Go"
  },
  "lap-trinh-dong-thoi-goroutines-xay-dung-web": {
    "vi": "Lập trình đồng thời Goroutines & Xây dựng Web",
    "en": "Concurrent Programming of Goroutines & Web Building",
    "ja": "ゴルーチンと Web 構築の同時プログラミング",
    "ko": "고루틴 및 웹 구축의 동시 프로그래밍",
    "zh": "Goroutines 的并发编程和 Web 构建",
    "fr": "Programmation simultanée de Goroutines et de création de sites Web",
    "de": "Gleichzeitige Programmierung von Goroutinen und Webbuilding",
    "es": "Programación concurrente de gorutinas y construcción web"
  },
  "goroutines-concurrency-web-development": {
    "vi": "Lập trình đồng thời Goroutines & Xây dựng Web",
    "en": "Goroutines Concurrency & Web Development",
    "ja": "Goroutinesの並行性とWeb開発",
    "ko": "Goroutines 동시성 및 웹 개발",
    "zh": "Goroutines并发与Web开发",
    "fr": "Concurrence avec Goroutines et développement Web",
    "de": "Goroutines-Parallelität & Webentwicklung",
    "es": "Concurrencia de Goroutines y desarrollo web"
  },
  "co-so-du-lieu-generics-moi-truong-production": {
    "vi": "Cơ sở dữ liệu, Generics & Môi trường Production",
    "en": "Database, Generics & Production Environment",
    "ja": "データベース、ジェネリック、本番環境",
    "ko": "데이터베이스, 제네릭 및 생산 환경",
    "zh": "数据库、泛型和生产环境",
    "fr": "Base de données, génériques et environnement de production",
    "de": "Datenbank, Generics und Produktionsumgebung",
    "es": "Base de datos, genéricos y entorno de producción"
  },
  "databases-generics-production-deployment": {
    "vi": "Cơ sở dữ liệu, Generics & Môi trường Production",
    "en": "Databases, Generics & Production Deployment",
    "ja": "データベース、ジェネリクス、本番環境",
    "ko": "데이터베이스, 제네릭 및 프로덕션 환경",
    "zh": "数据库、泛型与生产环境",
    "fr": "Bases de données, génériques et production",
    "de": "Datenbanken, Generics & Produktionsumgebung",
    "es": "Bases de datos, genéricos y producción"
  },
  "nen-tang-ngon-ngu-truy-van-graphql-schema": {
    "vi": "Nền tảng ngôn ngữ truy vấn GraphQL & Schema",
    "en": "GraphQL & Schema query language platform",
    "ja": "GraphQL およびスキーマ クエリ言語プラットフォーム",
    "ko": "GraphQL 및 스키마 쿼리 언어 플랫폼",
    "zh": "GraphQL 和 Schema 查询语言平台",
    "fr": "Plateforme de langage de requête GraphQL et Schema",
    "de": "GraphQL- und Schema-Abfragesprachenplattform",
    "es": "Plataforma de lenguaje de consulta GraphQL y Schema"
  },
  "graphql-query-language-foundations-schema": {
    "vi": "Nền tảng ngôn ngữ truy vấn GraphQL & Schema",
    "en": "GraphQL Query Language Foundations & Schema",
    "ja": "GraphQLクエリ言語の基礎とスキーマ",
    "ko": "GraphQL 쿼리 언어 기초 및 스키마",
    "zh": "GraphQL查询语言基础与模式",
    "fr": "Bases du langage de requête GraphQL et schéma",
    "de": "GraphQL-Abfragesprache Grundlagen & Schema",
    "es": "Fundamentos del lenguaje de consulta GraphQL y esquema"
  },
  "cu-phap-java-co-ban": {
    "vi": "Cú pháp Java cơ bản",
    "en": "Basic Java syntax",
    "ja": "基本的な Java 構文",
    "ko": "기본 Java 구문",
    "zh": "基本 Java 语法",
    "fr": "Syntaxe Java de base",
    "de": "Grundlegende Java-Syntax",
    "es": "Sintaxis básica de Java"
  },
  "java-syntax-fundamentals": {
    "vi": "Cú pháp Java cơ bản",
    "en": "Java Syntax Fundamentals",
    "ja": "Java基本構文",
    "ko": "Java 기본 구문",
    "zh": "Java基本语法",
    "fr": "Bases de la syntaxe Java",
    "de": "Java-Syntax-Grundlagen",
    "es": "Fundamentos de sintaxis Java"
  },
  "oop-chuyen-sau-bo-khung-java-collections": {
    "vi": "OOP chuyên sâu & Bộ khung Java Collections",
    "en": "In-depth OOP & Java Collections Framework",
    "ja": "詳細な OOP および Java コレクション フレームワーク",
    "ko": "심층적인 OOP 및 Java 컬렉션 프레임워크",
    "zh": "深入的 OOP 和 Java 集合框架",
    "fr": "Cadre de collections POO et Java approfondi",
    "de": "Ausführliches OOP- und Java Collections Framework",
    "es": "Marco de colecciones de Java y programación orientada a objetos en profundidad"
  },
  "deep-oop-java-collections-framework": {
    "vi": "OOP chuyên sâu & Bộ khung Java Collections",
    "en": "Deep OOP & Java Collections Framework",
    "ja": "詳細なOOPとJavaコレクションフレームワーク",
    "ko": "심층 OOP 및 Java 컬렉션 프레임워크",
    "zh": "深度OOP与Java集合框架",
    "fr": "POO approfondie et framework Java Collections",
    "de": "Vertiefte OOP & Java Collections Framework",
    "es": "POO avanzada y framework Java Collections"
  },
  "phat-trien-ung-dung-web-voi-spring-boot": {
    "vi": "Phát triển ứng dụng Web với Spring Boot",
    "en": "Develop Web applications with Spring Boot",
    "ja": "Spring Boot を使用して Web アプリケーションを開発する",
    "ko": "Spring Boot를 사용하여 웹 애플리케이션 개발",
    "zh": "使用 Spring Boot 开发 Web 应用程序",
    "fr": "Développer des applications Web avec Spring Boot",
    "de": "Entwickeln Sie Webanwendungen mit Spring Boot",
    "es": "Desarrollar aplicaciones web con Spring Boot"
  },
  "web-application-development-with-spring-boot": {
    "vi": "Phát triển ứng dụng Web với Spring Boot",
    "en": "Web Application Development with Spring Boot",
    "ja": "Spring BootによるWebアプリケーション開発",
    "ko": "Spring Boot를 활용한 웹 애플리케이션 개발",
    "zh": "使用Spring Boot开发Web应用",
    "fr": "Développement d'applications Web avec Spring Boot",
    "de": "Webanwendungsentwicklung mit Spring Boot",
    "es": "Desarrollo de aplicaciones web con Spring Boot"
  },
  "co-che-may-ao-jvm-toi-uu-hoa-hieu-nang": {
    "vi": "Cơ chế máy ảo JVM & Tối ưu hóa hiệu năng",
    "en": "JVM Virtual Machine Engine & Performance Optimization",
    "ja": "JVM 仮想マシン エンジンとパフォーマンスの最適化",
    "ko": "JVM 가상 머신 엔진 및 성능 최적화",
    "zh": "JVM虚拟机引擎与性能优化",
    "fr": "Moteur de machine virtuelle JVM et optimisation des performances",
    "de": "JVM Virtual Machine Engine und Leistungsoptimierung",
    "es": "Motor de máquina virtual JVM y optimización del rendimiento"
  },
  "jvm-architecture-performance-tuning": {
    "vi": "Cơ chế máy ảo JVM & Tối ưu hóa hiệu năng",
    "en": "JVM Architecture & Performance Tuning",
    "ja": "JVMアーキテクチャとパフォーマンスチューニング",
    "ko": "JVM 아키텍처 및 성능 튜닝",
    "zh": "JVM架构与性能调优",
    "fr": "Architecture JVM et optimisation des performances",
    "de": "JVM-Architektur & Leistungsoptimierung",
    "es": "Arquitectura JVM y optimización del rendimiento"
  },
  "testing-co-ban-voi-jest": {
    "vi": "Testing cơ bản với Jest",
    "en": "Basic testing with Jest",
    "ja": "Jest を使用した基本的なテスト",
    "ko": "Jest를 사용한 기본 테스트",
    "zh": "使用 Jest 进行基本测试",
    "fr": "Tests de base avec Jest",
    "de": "Grundlegende Tests mit Jest",
    "es": "Pruebas básicas con Jest"
  },
  "testing-fundamentals-with-jest": {
    "vi": "Testing cơ bản với Jest",
    "en": "Testing Fundamentals with Jest",
    "ja": "Jestによるテストの基礎",
    "ko": "Jest를 활용한 기본 테스팅",
    "zh": "使用Jest的基础测试",
    "fr": "Bases des tests avec Jest",
    "de": "Test-Grundlagen mit Jest",
    "es": "Fundamentos de pruebas con Jest"
  },
  "nen-tang-kotlin-co-che-null-safety": {
    "vi": "Nền tảng Kotlin & Cơ chế Null Safety",
    "en": "Kotlin Platform & Null Safety Mechanism",
    "ja": "Kotlin プラットフォームと Null 安全メカニズム",
    "ko": "Kotlin 플랫폼 및 Null 안전 메커니즘",
    "zh": "Kotlin 平台 & Null 安全机制",
    "fr": "Plateforme Kotlin et mécanisme de sécurité nul",
    "de": "Kotlin-Plattform und Null-Sicherheitsmechanismus",
    "es": "Plataforma Kotlin y mecanismo de seguridad nulo"
  },
  "kotlin-foundations-null-safety": {
    "vi": "Nền tảng Kotlin & Cơ chế Null Safety",
    "en": "Kotlin Foundations & Null Safety",
    "ja": "Kotlinの基礎とNull安全機構",
    "ko": "Kotlin 기초 및 Null 안전성",
    "zh": "Kotlin基础与空安全机制",
    "fr": "Bases de Kotlin et sécurité null",
    "de": "Kotlin-Grundlagen & Null-Sicherheit",
    "es": "Fundamentos de Kotlin y seguridad nula"
  },
  "coroutines-xu-ly-luong-jetpack-compose": {
    "vi": "Coroutines, Xử lý luồng & Jetpack Compose",
    "en": "Coroutines, Stream Processing & Jetpack Compose",
    "ja": "コルーチン、ストリーム処理、Jetpack Compose",
    "ko": "코루틴, 스트림 처리, Jetpack Compose",
    "zh": "协程、流处理和 Jetpack Compose",
    "fr": "Coroutines, traitement de flux et Jetpack Compose",
    "de": "Coroutinen, Stream-Verarbeitung und Jetpack Compose",
    "es": "Corrutinas, procesamiento de flujos y redacción de Jetpack"
  },
  "coroutines-threading-jetpack-compose": {
    "vi": "Coroutines, Xử lý luồng & Jetpack Compose",
    "en": "Coroutines, Threading & Jetpack Compose",
    "ja": "コルーチン、スレッド処理、Jetpack Compose",
    "ko": "코루틴, 스레드 처리 및 Jetpack Compose",
    "zh": "协程、线程处理与Jetpack Compose",
    "fr": "Coroutines, threading et Jetpack Compose",
    "de": "Coroutinen, Threading & Jetpack Compose",
    "es": "Corrutinas, hilos y Jetpack Compose"
  },
  "nen-tang-nodejs-mo-hinh-event-loop": {
    "vi": "Nền tảng Node.js & Mô hình Event Loop",
    "en": "Node.js Foundations & Event Loop Model"
  },
  "nodejs-foundations-event-loop-model": {
    "vi": "Nền tảng Node.js & Mô hình Event Loop",
    "en": "Node.js Foundations & Event Loop Model"
  },
  "nen-tang-php-hien-dai-cu-phap-moi": {
    "vi": "Nền tảng PHP hiện đại & Cú pháp mới",
    "en": "Modern PHP Platform & New Syntax",
    "ja": "最新の PHP プラットフォームと新しい構文",
    "ko": "최신 PHP 플랫폼 및 새로운 구문",
    "zh": "现代 PHP 平台和新语法",
    "fr": "Plateforme PHP moderne et nouvelle syntaxe",
    "de": "Moderne PHP-Plattform und neue Syntax",
    "es": "Plataforma PHP moderna y nueva sintaxis"
  },
  "modern-php-foundations-new-syntax": {
    "vi": "Nền tảng PHP hiện đại & Cú pháp mới",
    "en": "Modern PHP Foundations & New Syntax",
    "ja": "モダンPHPの基礎と新構文",
    "ko": "모던 PHP 기초 및 새로운 구문",
    "zh": "现代PHP基础与新语法",
    "fr": "Bases du PHP moderne et nouvelle syntaxe",
    "de": "Moderne PHP-Grundlagen & Neue Syntax",
    "es": "Fundamentos de PHP moderno y nueva sintaxis"
  },
  "cu-phap-jsx-thanh-phan-components-props": {
    "vi": "Cú pháp JSX, Thành phần Components & Props",
    "en": "JSX Syntax, Components & Props",
    "ja": "JSX 構文、コンポーネント、およびプロパティ",
    "ko": "JSX 구문, 구성요소 및 소품",
    "zh": "JSX 语法、组件和属性",
    "fr": "Syntaxe JSX, composants et accessoires",
    "de": "JSX-Syntax, Komponenten und Requisiten",
    "es": "Sintaxis, componentes y accesorios JSX"
  },
  "jsx-syntax-components-props": {
    "vi": "Cú pháp JSX, Thành phần Components & Props",
    "en": "JSX Syntax, Components & Props",
    "ja": "JSX 構文、コンポーネント、およびプロパティ",
    "ko": "JSX 구문, 구성요소 및 소품",
    "zh": "JSX 语法、组件和属性",
    "fr": "Syntaxe JSX, composants et accessoires",
    "de": "JSX-Syntax, Komponenten und Requisiten",
    "es": "Sintaxis, componentes y accesorios JSX"
  },
  "react-hooks-quan-ly-trang-thai-ung-dung": {
    "vi": "React Hooks & Quản lý trạng thái ứng dụng",
    "en": "React Hooks & Application State Management",
    "ja": "React フックとアプリケーションの状態管理",
    "ko": "React Hooks 및 애플리케이션 상태 관리",
    "zh": "React Hooks 和应用程序状态管理",
    "fr": "React Hooks et gestion de l’état des applications",
    "de": "React Hooks und Anwendungsstatusverwaltung",
    "es": "React Hooks y gestión del estado de las aplicaciones"
  },
  "react-hooks-state-management": {
    "vi": "React Hooks & Quản lý trạng thái ứng dụng",
    "en": "React Hooks & State Management",
    "ja": "Reactフックと状態管理",
    "ko": "React 훅 및 상태 관리",
    "zh": "React Hooks与状态管理",
    "fr": "Hooks React et gestion de l'état",
    "de": "React Hooks & Zustandsverwaltung",
    "es": "Hooks de React y gestión de estado"
  },
  "cu-phap-ruby-triet-ly-ngon-ngu": {
    "vi": "Cú pháp Ruby & Triết lý ngôn ngữ",
    "en": "Ruby Syntax & Language Philosophy",
    "ja": "Ruby の構文と言語の哲学",
    "ko": "Ruby 구문 및 언어 철학",
    "zh": "Ruby 语法和语言哲学",
    "fr": "Syntaxe Ruby et philosophie du langage",
    "de": "Ruby-Syntax und Sprachphilosophie",
    "es": "Sintaxis de Ruby y filosofía del lenguaje"
  },
  "ruby-syntax-philosophy": {
    "vi": "Cú pháp Ruby & Triết lý ngôn ngữ",
    "en": "Ruby Syntax & Philosophy",
    "ja": "Ruby構文と言語哲学",
    "ko": "Ruby 구문 및 언어 철학",
    "zh": "Ruby语法与语言哲学",
    "fr": "Syntaxe Ruby et philosophie du langage",
    "de": "Ruby-Syntax & Sprachphilosophie",
    "es": "Sintaxis y filosofía de Ruby"
  },
  "nen-tang-cu-phap-rust-he-thong-kieu": {
    "vi": "Nền tảng cú pháp Rust & Hệ thống kiểu",
    "en": "Rust Syntax Foundation & Type System",
    "ja": "Rustの構文基盤と型システム",
    "ko": "Rust 구문 기반 및 유형 시스템",
    "zh": "Rust 语法基础和类型系统",
    "fr": "Fondation de la syntaxe Rust et système de types",
    "de": "Rust Syntax Foundation & Type System",
    "es": "Base de sintaxis y sistema de tipos de Rust"
  },
  "rust-syntax-foundations-type-system": {
    "vi": "Nền tảng cú pháp Rust & Hệ thống kiểu",
    "en": "Rust Syntax Foundations & Type System",
    "ja": "Rust構文の基礎と型システム",
    "ko": "Rust 구문 기초 및 타입 시스템",
    "zh": "Rust语法基础与类型系统",
    "fr": "Bases de la syntaxe Rust et système de types",
    "de": "Rust-Syntax-Grundlagen & Typsystem",
    "es": "Fundamentos de sintaxis Rust y sistema de tipos"
  },
  "nen-tang-cu-phap-swift-kieu-du-lieu": {
    "vi": "Nền tảng cú pháp Swift & Kiểu dữ liệu",
    "en": "Swift Syntax Foundation & Data Types",
    "ja": "Swift 構文の基礎とデータ型",
    "ko": "Swift 구문 기초 및 데이터 유형",
    "zh": "Swift 语法基础和数据类型",
    "fr": "Fondation de syntaxe Swift et types de données",
    "de": "Swift Syntax Foundation & Datentypen",
    "es": "Bases de sintaxis rápida y tipos de datos"
  },
  "swift-syntax-foundations-data-types": {
    "vi": "Nền tảng cú pháp Swift & Kiểu dữ liệu",
    "en": "Swift Syntax Foundations & Data Types",
    "ja": "Swift構文の基礎とデータ型",
    "ko": "Swift 구문 기초 및 데이터 타입",
    "zh": "Swift语法基础与数据类型",
    "fr": "Bases de la syntaxe Swift et types de données",
    "de": "Swift-Syntax-Grundlagen & Datentypen",
    "es": "Fundamentos de sintaxis Swift y tipos de datos"
  },
  "lap-trinh-giao-dien-swiftui-concurrency": {
    "vi": "Lập trình giao diện SwiftUI & Concurrency",
    "en": "Programming the SwiftUI & Concurrency interface",
    "ja": "SwiftUI と同時実行インターフェイスのプログラミング",
    "ko": "SwiftUI 및 동시성 인터페이스 프로그래밍",
    "zh": "SwiftUI 和并发接口编程",
    "fr": "Programmation de l'interface SwiftUI & Concurrency",
    "de": "Programmierung der SwiftUI- und Concurrency-Schnittstelle",
    "es": "Programación de la interfaz SwiftUI y concurrencia"
  },
  "swiftui-ui-development-concurrency": {
    "vi": "Lập trình giao diện SwiftUI & Concurrency",
    "en": "SwiftUI UI Development & Concurrency",
    "ja": "SwiftUI UI開発と並行処理",
    "ko": "SwiftUI UI 개발 및 동시성",
    "zh": "SwiftUI界面开发与并发",
    "fr": "Développement d'interface SwiftUI et concurrence",
    "de": "SwiftUI UI-Entwicklung & Nebenläufigkeit",
    "es": "Desarrollo de interfaz SwiftUI y concurrencia"
  },
  "swiftui-nang-cao-quan-ly-du-lieu-swiftdata": {
    "vi": "SwiftUI nâng cao & Quản lý dữ liệu SwiftData",
    "en": "Advanced SwiftUI & SwiftData Data Management",
    "ja": "高度な SwiftUI および SwiftData データ管理",
    "ko": "고급 SwiftUI 및 SwiftData 데이터 관리",
    "zh": "高级 SwiftUI 和 SwiftData 数据管理",
    "fr": "Gestion avancée des données SwiftUI et SwiftData",
    "de": "Erweiterte SwiftUI- und SwiftData-Datenverwaltung",
    "es": "Gestión avanzada de datos SwiftUI y SwiftData"
  },
  "advanced-swiftui-swiftdata-management": {
    "vi": "SwiftUI nâng cao & Quản lý dữ liệu SwiftData",
    "en": "Advanced SwiftUI & SwiftData Management",
    "ja": "高度なSwiftUIとSwiftData管理",
    "ko": "고급 SwiftUI 및 SwiftData 관리",
    "zh": "高级SwiftUI与SwiftData管理",
    "fr": "SwiftUI avancé et gestion SwiftData",
    "de": "Erweitertes SwiftUI & SwiftData-Verwaltung",
    "es": "SwiftUI avanzado y gestión de SwiftData"
  },
  "toi-uu-hieu-nang-ios-kiem-thu-xctest": {
    "vi": "Tối ưu hiệu năng iOS & Kiểm thử XCTest",
    "en": "iOS Performance Optimization & XCTest Testing",
    "ja": "iOS パフォーマンスの最適化と XCTest テスト",
    "ko": "iOS 성능 최적화 및 XCTest 테스트",
    "zh": "iOS 性能优化和 XCTest 测试",
    "fr": "Optimisation des performances iOS et tests XCTest",
    "de": "iOS-Leistungsoptimierung und XCTest-Tests",
    "es": "Optimización del rendimiento de iOS y pruebas XCTest"
  },
  "ios-performance-optimization-xctest": {
    "vi": "Tối ưu hiệu năng iOS & Kiểm thử XCTest",
    "en": "iOS Performance Optimization & XCTest",
    "ja": "iOSパフォーマンス最適化とXCTest",
    "ko": "iOS 성능 최적화 및 XCTest",
    "zh": "iOS性能优化与XCTest",
    "fr": "Optimisation des performances iOS et XCTest",
    "de": "iOS-Leistungsoptimierung & XCTest",
    "es": "Optimización del rendimiento de iOS y XCTest"
  },
  "kien-truc-ios-chuyen-sau-he-thong-tca": {
    "vi": "Kiến trúc iOS chuyên sâu & Hệ thống TCA",
    "en": "In-depth iOS Architecture & TCA System",
    "ja": "詳細な iOS アーキテクチャと TCA システム",
    "ko": "심층적인 iOS 아키텍처 및 TCA 시스템",
    "zh": "深入的iOS架构和TCA系统",
    "fr": "Architecture iOS approfondie et système TCA",
    "de": "Ausführliche iOS-Architektur und TCA-System",
    "es": "Arquitectura iOS en profundidad y sistema TCA"
  },
  "deep-ios-architecture-tca-system": {
    "vi": "Kiến trúc iOS chuyên sâu & Hệ thống TCA",
    "en": "Deep iOS Architecture & TCA System",
    "ja": "詳細なiOSアーキテクチャとTCAシステム",
    "ko": "심층 iOS 아키텍처 및 TCA 시스템",
    "zh": "深度iOS架构与TCA系统",
    "fr": "Architecture iOS approfondie et système TCA",
    "de": "Vertiefte iOS-Architektur & TCA-System",
    "es": "Arquitectura avanzada de iOS y sistema TCA"
  },
  "typescript-co-ban": {
    "vi": "TypeScript cơ bản",
    "en": "TypeScript Fundamentals"
  },
  "typescript-fundamentals": {
    "vi": "TypeScript Fundamentals",
    "en": "TypeScript Fundamentals",
    "ja": "TypeScript の基礎",
    "ko": "TypeScript 기초",
    "zh": "TypeScript 基础知识",
    "fr": "Fondamentaux de TypeScript",
    "de": "TypeScript-Grundlagen",
    "es": "Fundamentos de TypeScript"
  },
  "components-composition-api-hien-dai": {
    "vi": "Components & Composition API hiện đại",
    "en": "Modern Components & Composition API",
    "ja": "最新のコンポーネントと構成 API",
    "ko": "최신 구성요소 및 컴포지션 API",
    "zh": "现代组件和组合 API",
    "fr": "API de composants et de composition modernes",
    "de": "Moderne Komponenten- und Kompositions-API",
    "es": "API de composición y componentes modernos"
  },
  "modern-components-composition-api": {
    "vi": "Components & Composition API hiện đại",
    "en": "Modern Components & Composition API",
    "ja": "最新のコンポーネントと構成 API",
    "ko": "최신 구성요소 및 컴포지션 API",
    "zh": "现代组件和组合 API",
    "fr": "API de composants et de composition modernes",
    "de": "Moderne Komponenten- und Kompositions-API",
    "es": "API de composición y componentes modernos"
  },
  "phat-trien-fullstack-vue-voi-nuxtjs-ssr": {
    "vi": "Phát triển Fullstack Vue với Nuxt.js & SSR",
    "en": "Fullstack Vue Development with Nuxt.js & SSR"
  },
  "fullstack-vue-development-with-nuxtjs-ssr": {
    "vi": "Phát triển Fullstack Vue với Nuxt.js & SSR",
    "en": "Fullstack Vue Development with Nuxt.js & SSR"
  },
  "syntax-cau-truc-du-lieu-co-ban": {
    "vi": "Syntax & cấu trúc dữ liệu cơ bản",
    "en": "Syntax & cấu trúc dữ liệu cơ bản"
  },
  "syntax-basic-data-structures": {
    "vi": "Syntax & cấu trúc dữ liệu cơ bản",
    "en": "Syntax & Basic Data Structures",
    "ja": "構文と基本データ構造",
    "ko": "구문 및 기본 데이터 구조",
    "zh": "语法与基本数据结构",
    "fr": "Syntaxe et structures de données de base",
    "de": "Syntax & grundlegende Datenstrukturen",
    "es": "Sintaxis y estructuras de datos básicas"
  },
  "cu-phap-oop-co-ban": {
    "vi": "Cú pháp & OOP cơ bản",
    "en": "Cú pháp & OOP cơ bản"
  },
  "syntax-basic-oop": {
    "vi": "Cú pháp & OOP cơ bản",
    "en": "Syntax & Basic OOP",
    "ja": "構文と基本OOP",
    "ko": "구문 및 기본 OOP",
    "zh": "语法与基础OOP",
    "fr": "Syntaxe et POO de base",
    "de": "Syntax & Basis-OOP",
    "es": "Sintaxis y POO básica"
  },
  "html-co-ban-css-selectors": {
    "vi": "HTML cơ bản & CSS selectors",
    "en": "HTML cơ bản & CSS selectors"
  },
  "html-fundamentals-css-selectors": {
    "vi": "HTML cơ bản & CSS selectors",
    "en": "HTML Fundamentals & CSS Selectors",
    "ja": "HTMLの基礎とCSSセレクター",
    "ko": "HTML 기초 및 CSS 선택자",
    "zh": "HTML基础与CSS选择器",
    "fr": "Bases du HTML et sélecteurs CSS",
    "de": "HTML-Grundlagen & CSS-Selektoren",
    "es": "Fundamentos de HTML y selectores CSS"
  },
  "test-dau-tien-assertions": {
    "vi": "Test đầu tiên & assertions",
    "en": "Test đầu tiên & assertions"
  },
  "first-test-assertions": {
    "vi": "Test đầu tiên & assertions",
    "en": "First Test & Assertions",
    "ja": "最初のテストとアサーション",
    "ko": "첫 번째 테스트 및 어설션",
    "zh": "首个测试与断言",
    "fr": "Premier test et assertions",
    "de": "Erster Test & Zusicherungen",
    "es": "Primera prueba y aserciones"
  },
  "kiem-thu-ung-dung-angular-voi-jasmine-karma": {
    "vi": "Kiểm thử ứng dụng Angular với Jasmine & Karma",
    "en": "Testing Angular Applications with Jasmine & Karma",
    "ja": "Jasmine と Karma を使用した Angular アプリケーションのテスト",
    "ko": "Jasmine & Karma를 사용하여 Angular 애플리케이션 테스트",
    "zh": "使用 Jasmine 和 Karma 测试 Angular 应用程序",
    "fr": "Tester des applications angulaires avec Jasmine & Karma",
    "de": "Testen von Angular-Anwendungen mit Jasmine & Karma",
    "es": "Prueba de aplicaciones angulares con Jasmine y Karma"
  },
  "testing-angular-applications-with-jasmine-karma": {
    "vi": "Kiểm thử ứng dụng Angular với Jasmine & Karma",
    "en": "Testing Angular Applications with Jasmine & Karma",
    "ja": "Jasmine と Karma を使用した Angular アプリケーションのテスト",
    "ko": "Jasmine & Karma를 사용하여 Angular 애플리케이션 테스트",
    "zh": "使用 Jasmine 和 Karma 测试 Angular 应用程序",
    "fr": "Tester des applications angulaires avec Jasmine & Karma",
    "de": "Testen von Angular-Anwendungen mit Jasmine & Karma",
    "es": "Prueba de aplicaciones angulares con Jasmine y Karma"
  },
  "kien-truc-phan-mem-angular-quy-mo-lon": {
    "vi": "Kiến trúc phần mềm Angular quy mô lớn",
    "en": "Large-scale Angular software architecture",
    "ja": "大規模な Angular ソフトウェア アーキテクチャ",
    "ko": "대규모 Angular 소프트웨어 아키텍처",
    "zh": "大型 Angular 软件架构",
    "fr": "Architecture logicielle angulaire à grande échelle",
    "de": "Umfangreiche Angular-Softwarearchitektur",
    "es": "Arquitectura de software angular a gran escala"
  },
  "large-scale-angular-software-architecture": {
    "vi": "Kiến trúc phần mềm Angular quy mô lớn",
    "en": "Large-scale Angular software architecture",
    "ja": "大規模な Angular ソフトウェア アーキテクチャ",
    "ko": "대규모 Angular 소프트웨어 아키텍처",
    "zh": "大型 Angular 软件架构",
    "fr": "Architecture logicielle angulaire à grande échelle",
    "de": "Umfangreiche Angular-Softwarearchitektur",
    "es": "Arquitectura de software angular a gran escala"
  },
  "co-ban-ve-lap-trinh-kich-ban-bash-shell": {
    "vi": "Cơ bản về lập trình kịch bản Bash Shell",
    "en": "Basics of Bash Shell script programming",
    "ja": "Bash Shell スクリプト プログラミングの基本",
    "ko": "Bash 쉘 스크립트 프로그래밍의 기본",
    "zh": "Bash Shell 脚本编程基础知识",
    "fr": "Bases de la programmation de scripts Bash Shell",
    "de": "Grundlagen der Bash-Shell-Skriptprogrammierung",
    "es": "Conceptos básicos de la programación de scripts de Bash Shell"
  },
  "bash-shell-scripting-fundamentals": {
    "vi": "Cơ bản về lập trình kịch bản Bash Shell",
    "en": "Bash Shell Scripting Fundamentals",
    "ja": "Bashシェルスクリプトの基礎",
    "ko": "Bash 셸 스크립팅 기초",
    "zh": "Bash Shell脚本基础",
    "fr": "Bases de l'écriture de scripts Bash Shell",
    "de": "Bash-Shell-Scripting-Grundlagen",
    "es": "Fundamentos de scripting en Bash Shell"
  },
  "viet-kich-ban-tu-dong-hoa-lap-lich-voi-cron-job": {
    "vi": "Viết kịch bản tự động hóa & Lập lịch với Cron Job",
    "en": "Write automation scripts & Schedule with Cron Job",
    "ja": "自動化スクリプトを作成し、Cron ジョブでスケジュールを設定する",
    "ko": "Cron Job으로 자동화 스크립트 작성 및 예약",
    "zh": "使用 Cron Job 编写自动化脚本和计划",
    "fr": "Écrivez des scripts d'automatisation et planifiez avec Cron Job",
    "de": "Schreiben Sie Automatisierungsskripte und planen Sie mit Cron Job",
    "es": "Escriba scripts de automatización y programe con Cron Job"
  },
  "automation-scripting-scheduling-with-cron-jobs": {
    "vi": "Viết kịch bản tự động hóa & Lập lịch với Cron Job",
    "en": "Automation Scripting & Scheduling with Cron Jobs",
    "ja": "Cronジョブによる自動化スクリプトとスケジューリング",
    "ko": "Cron Job을 활용한 자동화 스크립트 및 일정 예약",
    "zh": "使用Cron Job进行自动化脚本编写与调度",
    "fr": "Scripting d'automatisation et planification avec Cron Jobs",
    "de": "Automatisierungsskripte & Planung mit Cron Jobs",
    "es": "Scripting de automatización y programación con Cron Jobs"
  },
  "giam-sat-he-thong-linux-khac-phuc-su-co": {
    "vi": "Giám sát hệ thống Linux & Khắc phục sự cố",
    "en": "Linux System Monitoring & Troubleshooting",
    "ja": "Linux システムの監視とトラブルシューティング",
    "ko": "Linux 시스템 모니터링 및 문제 해결",
    "zh": "Linux 系统监控与故障排除",
    "fr": "Surveillance et dépannage du système Linux",
    "de": "Linux-Systemüberwachung und Fehlerbehebung",
    "es": "Monitoreo y solución de problemas del sistema Linux"
  },
  "linux-system-monitoring-troubleshooting": {
    "vi": "Giám sát hệ thống Linux & Khắc phục sự cố",
    "en": "Linux System Monitoring & Troubleshooting",
    "ja": "Linux システムの監視とトラブルシューティング",
    "ko": "Linux 시스템 모니터링 및 문제 해결",
    "zh": "Linux 系统监控与故障排除",
    "fr": "Surveillance et dépannage du système Linux",
    "de": "Linux-Systemüberwachung und Fehlerbehebung",
    "es": "Monitoreo y solución de problemas del sistema Linux"
  },
  "bash-nang-cao-mang-bat-tin-hieu-traps-mang": {
    "vi": "Bash nâng cao: Mảng, Bắt tín hiệu Traps & Mạng",
    "en": "Advanced Bash: Arrays, Traps & Networks",
    "ja": "高度な Bash: 配列、トラップ、ネットワーク",
    "ko": "고급 Bash: 배열, 트랩 및 네트워크",
    "zh": "高级 Bash：数组、陷阱和网络",
    "fr": "Bash avancé : tableaux, pièges et réseaux",
    "de": "Advanced Bash: Arrays, Traps und Netzwerke",
    "es": "Bash avanzado: matrices, trampas y redes"
  },
  "advanced-bash-arrays-signal-traps-networking": {
    "vi": "Bash nâng cao: Mảng, Bắt tín hiệu Traps & Mạng",
    "en": "Advanced Bash: Arrays, Signal Traps & Networking",
    "ja": "高度なBash：配列、シグナルトラップ、ネットワーク",
    "ko": "고급 Bash: 배열, 신호 트랩 및 네트워킹",
    "zh": "高级Bash：数组、信号捕获与网络",
    "fr": "Bash avancé : tableaux, captures de signaux et réseau",
    "de": "Fortgeschrittenes Bash: Arrays, Signal-Traps & Netzwerke",
    "es": "Bash avanzado: arreglos, captura de señales y redes"
  },
  "bao-mat-shell-script-toi-uu-hieu-nang-thuc-thi": {
    "vi": "Bảo mật Shell Script & Tối ưu hiệu năng thực thi",
    "en": "Secure Shell Script & Optimize Execution Performance",
    "ja": "セキュア シェル スクリプトと実行パフォーマンスの最適化",
    "ko": "보안 쉘 스크립트 및 실행 성능 최적화",
    "zh": "保护 Shell 脚本并优化执行性能",
    "fr": "Sécurisez le script Shell et optimisez les performances d'exécution",
    "de": "Sicheres Shell-Skript und Optimierung der Ausführungsleistung",
    "es": "Proteja el script de Shell y optimice el rendimiento de ejecución"
  },
  "shell-script-security-execution-performance": {
    "vi": "Bảo mật Shell Script & Tối ưu hiệu năng thực thi",
    "en": "Shell Script Security & Execution Performance",
    "ja": "シェルスクリプトのセキュリティと実行パフォーマンス",
    "ko": "셸 스크립트 보안 및 실행 성능 최적화",
    "zh": "Shell脚本安全性与执行性能优化",
    "fr": "Sécurité des scripts Shell et performances d'exécution",
    "de": "Shell-Skript-Sicherheit & Ausführungsleistung",
    "es": "Seguridad de scripts Shell y rendimiento de ejecución"
  },
  "toi-uu-hoa-bo-nho-hieu-nang-c": {
    "vi": "Tối ưu hóa bộ nhớ & Hiệu năng C++",
    "en": "Memory Optimization & C++ Performance",
    "ja": "メモリの最適化と C++ のパフォーマンス",
    "ko": "메모리 최적화 및 C++ 성능",
    "zh": "内存优化和 C++ 性能",
    "fr": "Optimisation de la mémoire et performances C++",
    "de": "Speicheroptimierung und C++-Leistung",
    "es": "Optimización de memoria y rendimiento de C++"
  },
  "memory-optimization-c-performance": {
    "vi": "Tối ưu hóa bộ nhớ & Hiệu năng C++",
    "en": "Memory Optimization & C++ Performance",
    "ja": "メモリの最適化と C++ のパフォーマンス",
    "ko": "메모리 최적화 및 C++ 성능",
    "zh": "内存优化和 C++ 性能",
    "fr": "Optimisation de la mémoire et performances C++",
    "de": "Speicheroptimierung und C++-Leistung",
    "es": "Optimización de memoria y rendimiento de C++"
  },
  "system-design-voi-c": {
    "vi": "System Design với C++",
    "en": "System Design with C++",
    "ja": "C++によるシステム設計",
    "ko": "C++를 사용한 시스템 설계",
    "zh": "使用C++进行系统设计",
    "fr": "Conception de système avec C++",
    "de": "Systemdesign mit C++",
    "es": "Diseño de sistemas con C++"
  },
  "system-design-with-c": {
    "vi": "System Design với C++",
    "en": "System Design with C++",
    "ja": "C++によるシステム設計",
    "ko": "C++를 사용한 시스템 설계",
    "zh": "使用C++进行系统设计",
    "fr": "Conception de système avec C++",
    "de": "Systemdesign mit C++",
    "es": "Diseño de sistemas con C++"
  },
  "cu-phap-c-he-thong-kieu-du-lieu": {
    "vi": "Cú pháp C# & Hệ thống kiểu dữ liệu",
    "en": "C# Syntax & Data Type System",
    "ja": "C# 構文とデータ型システム",
    "ko": "C# 구문 및 데이터 유형 시스템",
    "zh": "C# 语法和数据类型系统",
    "fr": "Syntaxe C# et système de types de données",
    "de": "C#-Syntax- und Datentypsystem",
    "es": "Sistema de tipos de datos y sintaxis de C#"
  },
  "c-syntax-type-system": {
    "vi": "Cú pháp C# & Hệ thống kiểu dữ liệu",
    "en": "C# Syntax & Type System",
    "ja": "C#構文と型システム",
    "ko": "C# 구문 및 타입 시스템",
    "zh": "C#语法与类型系统",
    "fr": "Syntaxe C# et système de types",
    "de": "C#-Syntax & Typsystem",
    "es": "Sintaxis de C# y sistema de tipos"
  },
  "oop-lop-giao-dien-interfaces-records": {
    "vi": "OOP: Lớp, Giao diện (Interfaces) & Records",
    "en": "OOP: Classes, Interfaces & Records",
    "ja": "OOP: クラス、インターフェイス、レコード",
    "ko": "OOP: 클래스, 인터페이스 및 레코드",
    "zh": "OOP：类、接口和记录",
    "fr": "POO : classes, interfaces et enregistrements",
    "de": "OOP: Klassen, Schnittstellen und Datensätze",
    "es": "POO: clases, interfaces y registros"
  },
  "oop-classes-interfaces-records": {
    "vi": "OOP: Lớp, Giao diện (Interfaces) & Records",
    "en": "OOP: Classes, Interfaces & Records",
    "ja": "OOP: クラス、インターフェイス、レコード",
    "ko": "OOP: 클래스, 인터페이스 및 레코드",
    "zh": "OOP：类、接口和记录",
    "fr": "POO : classes, interfaces et enregistrements",
    "de": "OOP: Klassen, Schnittstellen und Datensätze",
    "es": "POO: clases, interfaces y registros"
  },
  "tap-hop-du-lieu-collections-truy-van-linq": {
    "vi": "Tập hợp dữ liệu (Collections) & Truy vấn LINQ",
    "en": "Data Collection (Collections) & LINQ Queries",
    "ja": "データ収集 (コレクション) と LINQ クエリ",
    "ko": "데이터 수집(컬렉션) 및 LINQ 쿼리",
    "zh": "数据收集（Collections）和 LINQ 查询",
    "fr": "Collecte de données (collections) et requêtes LINQ",
    "de": "Datenerfassung (Sammlungen) und LINQ-Abfragen",
    "es": "Recopilación de datos (colecciones) y consultas LINQ"
  },
  "collections-linq-queries": {
    "vi": "Tập hợp dữ liệu (Collections) & Truy vấn LINQ",
    "en": "Collections & LINQ Queries",
    "ja": "コレクションとLINQクエリ",
    "ko": "컬렉션 및 LINQ 쿼리",
    "zh": "集合与LINQ查询",
    "fr": "Collections et requêtes LINQ",
    "de": "Sammlungen & LINQ-Abfragen",
    "es": "Colecciones y consultas LINQ"
  },
  "lap-trinh-bat-dong-bo-asyncawait": {
    "vi": "Lập trình bất đồng bộ Async/Await",
    "en": "Asynchronous Programming with Async/Await"
  },
  "asynchronous-programming-with-asyncawait": {
    "vi": "Lập trình bất đồng bộ Async/Await",
    "en": "Asynchronous Programming with Async/Await"
  },
  "xay-dung-web-api-voi-aspnet-core": {
    "vi": "Xây dựng Web API với ASP.NET Core",
    "en": "Building Web APIs with ASP.NET Core"
  },
  "building-web-apis-with-aspnet-core": {
    "vi": "Xây dựng Web API với ASP.NET Core",
    "en": "Building Web APIs with ASP.NET Core"
  },
  "generics-nang-cao-mau-thiet-ke-trong-c": {
    "vi": "Generics nâng cao & Mẫu thiết kế trong C#",
    "en": "Advanced Generics & Design Patterns in C#",
    "ja": "C# の高度なジェネリックスとデザイン パターン",
    "ko": "C#의 고급 제네릭 및 디자인 패턴",
    "zh": "C# 中的高级泛型和设计模式",
    "fr": "Génériques avancés et modèles de conception en C#",
    "de": "Erweiterte Generics und Designmuster in C#",
    "es": "Genéricos avanzados y patrones de diseño en C#"
  },
  "advanced-generics-design-patterns-in-c": {
    "vi": "Generics nâng cao & Mẫu thiết kế trong C#",
    "en": "Advanced Generics & Design Patterns in C#",
    "ja": "C# の高度なジェネリックスとデザイン パターン",
    "ko": "C#의 고급 제네릭 및 디자인 패턴",
    "zh": "C# 中的高级泛型和设计模式",
    "fr": "Génériques avancés et modèles de conception en C#",
    "de": "Erweiterte Generics und Designmuster in C#",
    "es": "Genéricos avanzados y patrones de diseño en C#"
  },
  "dependency-injection-kien-truc-sach-clean-architecture": {
    "vi": "Dependency Injection & Kiến trúc sạch (Clean Architecture)",
    "en": "Dependency Injection & Clean Architecture",
    "ja": "依存関係の注入とクリーンなアーキテクチャ",
    "ko": "의존성 주입 및 클린 아키텍처",
    "zh": "依赖注入和干净的架构",
    "fr": "Injection de dépendances et architecture propre",
    "de": "Abhängigkeitsinjektion und saubere Architektur",
    "es": "Inyección de dependencias y arquitectura limpia"
  },
  "dependency-injection-clean-architecture": {
    "vi": "Dependency Injection & Kiến trúc sạch (Clean Architecture)",
    "en": "Dependency Injection & Clean Architecture",
    "ja": "依存関係の注入とクリーンなアーキテクチャ",
    "ko": "의존성 주입 및 클린 아키텍처",
    "zh": "依赖注入和干净的架构",
    "fr": "Injection de dépendances et architecture propre",
    "de": "Abhängigkeitsinjektion und saubere Architektur",
    "es": "Inyección de dependencias y arquitectura limpia"
  },
  "middleware-filters-xu-ly-loi-toan-cuc": {
    "vi": "Middleware, Filters & Xử lý lỗi toàn cục",
    "en": "Middleware, Filters & Global Error Handling",
    "ja": "ミドルウェア、フィルター、グローバルエラー処理",
    "ko": "미들웨어, 필터 및 전역 오류 처리",
    "zh": "中间件、过滤器和全局错误处理",
    "fr": "Middleware, filtres et gestion globale des erreurs",
    "de": "Middleware, Filter und globale Fehlerbehandlung",
    "es": "Middleware, filtros y manejo de errores globales"
  },
  "middleware-filters-global-error-handling": {
    "vi": "Middleware, Filters & Xử lý lỗi toàn cục",
    "en": "Middleware, Filters & Global Error Handling",
    "ja": "ミドルウェア、フィルター、グローバルエラー処理",
    "ko": "미들웨어, 필터 및 전역 오류 처리",
    "zh": "中间件、过滤器和全局错误处理",
    "fr": "Middleware, filtres et gestion globale des erreurs",
    "de": "Middleware, Filter und globale Fehlerbehandlung",
    "es": "Middleware, filtros y manejo de errores globales"
  },
  "toi-uu-hoa-hieu-nang-bo-nho-spanmemory": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ Span/Memory",
    "en": "Performance Optimization & Span/Memory"
  },
  "performance-optimization-spanmemory-types": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ Span/Memory",
    "en": "Performance Optimization & Span/Memory Types",
    "ja": "パフォーマンス最適化とSpan/Memory型",
    "ko": "성능 최적화 및 Span/Memory 타입",
    "zh": "性能优化与Span/Memory类型",
    "fr": "Optimisation des performances et types Span/Memory",
    "de": "Leistungsoptimierung & Span/Memory-Typen",
    "es": "Optimización de rendimiento y tipos Span/Memory"
  },
  "cac-tinh-nang-hien-dai-trong-net-the-he-moi": {
    "vi": "Các tính năng hiện đại trong .NET thế hệ mới",
    "en": "Modern features in next generation .NET",
    "ja": "次世代 .NET の最新機能",
    "ko": "차세대 .NET의 최신 기능",
    "zh": "下一代 .NET 中的现代功能",
    "fr": "Fonctionnalités modernes dans .NET nouvelle génération",
    "de": "Moderne Funktionen in .NET der nächsten Generation",
    "es": "Funciones modernas en .NET de próxima generación"
  },
  "modern-features-in-modern-net": {
    "vi": "Các tính năng hiện đại trong .NET thế hệ mới",
    "en": "Modern Features in Modern .NET",
    "ja": "次世代.NETのモダン機能",
    "ko": "차세대 .NET의 모던 기능",
    "zh": "新一代.NET的现代特性",
    "fr": "Fonctionnalités modernes dans le nouveau .NET",
    "de": "Moderne Funktionen in modernem .NET",
    "es": "Características modernas en el nuevo .NET"
  },
  "thiet-ke-kien-truc-he-thong-net-quy-mo-lon": {
    "vi": "Thiết kế kiến trúc hệ thống .NET quy mô lớn",
    "en": "Design large-scale .NET system architecture",
    "ja": "大規模な .NET システム アーキテクチャを設計する",
    "ko": "대규모 .NET 시스템 아키텍처 설계",
    "zh": "设计大型.NET系统架构",
    "fr": "Concevoir une architecture système .NET à grande échelle",
    "de": "Entwerfen Sie eine groß angelegte .NET-Systemarchitektur",
    "es": "Diseñar una arquitectura de sistema .NET a gran escala."
  },
  "large-scale-net-system-architecture-design": {
    "vi": "Thiết kế kiến trúc hệ thống .NET quy mô lớn",
    "en": "Large-Scale .NET System Architecture Design",
    "ja": "大規模.NETシステムアーキテクチャ設計",
    "ko": "대규모 .NET 시스템 아키텍처 설계",
    "zh": "大规模.NET系统架构设计",
    "fr": "Conception d'architecture système .NET à grande échelle",
    "de": "Groß angelegtes .NET-Systemarchitekturdesign",
    "es": "Diseño de arquitectura de sistemas .NET a gran escala"
  },
  "nen-tang-ngon-ngu-dart-kieu-du-lieu": {
    "vi": "Nền tảng ngôn ngữ Dart & Kiểu dữ liệu",
    "en": "Dart Language Platform & Data Types",
    "ja": "Dart 言語プラットフォームとデータ型",
    "ko": "Dart 언어 플랫폼 및 데이터 유형",
    "zh": "Dart 语言平台和数据类型",
    "fr": "Plateforme du langage Dart et types de données",
    "de": "Dart-Sprachplattform und Datentypen",
    "es": "Plataforma de lenguaje Dart y tipos de datos"
  },
  "dart-language-foundations-data-types": {
    "vi": "Nền tảng ngôn ngữ Dart & Kiểu dữ liệu",
    "en": "Dart Language Foundations & Data Types",
    "ja": "Dart言語の基礎とデータ型",
    "ko": "Dart 언어 기초 및 데이터 타입",
    "zh": "Dart语言基础与数据类型",
    "fr": "Bases du langage Dart et types de données",
    "de": "Dart-Sprachgrundlagen & Datentypen",
    "es": "Fundamentos del lenguaje Dart y tipos de datos"
  },
  "dieu-huong-dinh-tuyen-man-hinh-routing": {
    "vi": "Điều hướng & Định tuyến màn hình (Routing)",
    "en": "Screen Navigation & Routing (Routing)",
    "ja": "画面のナビゲーションとルーティング (ルーティング)",
    "ko": "화면 탐색 및 라우팅(Routing)",
    "zh": "屏幕导航和路由（路由）",
    "fr": "Navigation à l'écran et routage (Routage)",
    "de": "Bildschirmnavigation und Routing (Routing)",
    "es": "Navegación en pantalla y enrutamiento (enrutamiento)"
  },
  "screen-navigation-routing": {
    "vi": "Điều hướng & Định tuyến màn hình (Routing)",
    "en": "Screen Navigation & Routing",
    "ja": "画面遷移とルーティング",
    "ko": "화면 탐색 및 라우팅",
    "zh": "屏幕导航与路由",
    "fr": "Navigation et routage d'écrans",
    "de": "Bildschirmnavigation & Routing",
    "es": "Navegación de pantalla y enrutamiento"
  },
  "toi-uu-hieu-nang-bo-nho-dem-caching-tac-vu-celery": {
    "vi": "Tối ưu hiệu năng, Bộ nhớ đệm Caching & Tác vụ Celery",
    "en": "Performance Optimization, Caching & Celery Tasks",
    "ja": "パフォーマンスの最適化、キャッシュ、セロリのタスク",
    "ko": "성능 최적화, 캐싱 및 셀러리 작업",
    "zh": "性能优化、缓存和 Celery 任务",
    "fr": "Optimisation des performances, mise en cache et tâches de céleri",
    "de": "Leistungsoptimierung, Caching und Sellerie-Aufgaben",
    "es": "Optimización del rendimiento, almacenamiento en caché y tareas de apio"
  },
  "performance-optimization-caching-celery-tasks": {
    "vi": "Tối ưu hiệu năng, Bộ nhớ đệm Caching & Tác vụ Celery",
    "en": "Performance Optimization, Caching & Celery Tasks",
    "ja": "パフォーマンスの最適化、キャッシュ、セロリのタスク",
    "ko": "성능 최적화, 캐싱 및 셀러리 작업",
    "zh": "性能优化、缓存和 Celery 任务",
    "fr": "Optimisation des performances, mise en cache et tâches de céleri",
    "de": "Leistungsoptimierung, Caching und Sellerie-Aufgaben",
    "es": "Optimización del rendimiento, almacenamiento en caché y tareas de apio"
  },
  "xac-thuc-nguoi-dung-phan-quyen-bao-mat-gatespolicies": {
    "vi": "Xác thực người dùng & Phân quyền bảo mật (Gates/Policies)",
    "en": "User Authentication & Authorization (Gates/Policies)"
  },
  "user-authentication-authorization-gatespolicies": {
    "vi": "Xác thực người dùng & Phân quyền bảo mật (Gates/Policies)",
    "en": "User Authentication & Authorization (Gates/Policies)"
  },
  "xay-dung-restful-api-chuyen-nghiep-voi-django-rest-framework-drf": {
    "vi": "Xây dựng RESTful API chuyên nghiệp với Django REST Framework (DRF)",
    "en": "Build professional RESTful APIs with Django REST Framework (DRF)",
    "ja": "Django REST Framework (DRF) を使用してプロフェッショナルな RESTful API を構築する",
    "ko": "Django REST Framework(DRF)를 사용하여 전문적인 RESTful API 구축",
    "zh": "使用 Django REST Framework (DRF) 构建专业的 RESTful API",
    "fr": "Créez des API RESTful professionnelles avec Django REST Framework (DRF)",
    "de": "Erstellen Sie professionelle RESTful-APIs mit dem Django REST Framework (DRF)",
    "es": "Cree API RESTful profesionales con Django REST Framework (DRF)"
  },
  "professional-restful-apis-with-django-rest-framework-drf": {
    "vi": "Xây dựng RESTful API chuyên nghiệp với Django REST Framework (DRF)",
    "en": "Professional RESTful APIs with Django REST Framework (DRF)",
    "ja": "Django REST Framework（DRF）によるプロフェッショナルなRESTful API構築",
    "ko": "Django REST Framework (DRF)를 활용한 전문 RESTful API 구축",
    "zh": "使用Django REST Framework (DRF)构建专业RESTful API",
    "fr": "Création d'API RESTful professionnelles avec Django REST Framework (DRF)",
    "de": "Professionelle RESTful APIs mit Django REST Framework (DRF)",
    "es": "Construcción de APIs RESTful profesionales con Django REST Framework (DRF)"
  },
  "tong-quan-zig-cai-dat-moi-truong": {
    "vi": "Tổng quan Zig & Cài đặt môi trường",
    "en": "Zig Overview & Environment Settings",
    "ja": "Zig の概要と環境設定",
    "ko": "Zig 개요 및 환경 설정",
    "zh": "Zig 概述和环境设置",
    "fr": "Présentation de Zig et paramètres d'environnement",
    "de": "Zig-Übersicht und Umgebungseinstellungen",
    "es": "Descripción general de Zig y configuración del entorno"
  },
  "zig-overview-environment-setup": {
    "vi": "Tổng quan Zig & Cài đặt môi trường",
    "en": "Zig Overview & Environment Setup",
    "ja": "Zig概要と環境構築",
    "ko": "Zig 개요 및 환경 설정",
    "zh": "Zig概述与环境搭建",
    "fr": "Présentation de Zig et configuration de l'environnement",
    "de": "Zig-Übersicht & Umgebungseinrichtung",
    "es": "Descripción general de Zig y configuración del entorno"
  },
  "ham-co-che-xu-ly-loi": {
    "vi": "Hàm & Cơ chế xử lý lỗi",
    "en": "Functions & Error Handling Mechanisms",
    "ja": "関数とエラー処理メカニズム",
    "ko": "기능 및 오류 처리 메커니즘",
    "zh": "功能和错误处理机制",
    "fr": "Fonctions et mécanismes de gestion des erreurs",
    "de": "Funktionen und Fehlerbehandlungsmechanismen",
    "es": "Funciones y mecanismos de manejo de errores"
  },
  "functions-error-handling-mechanisms": {
    "vi": "Hàm & Cơ chế xử lý lỗi",
    "en": "Functions & Error Handling Mechanisms",
    "ja": "関数とエラー処理メカニズム",
    "ko": "기능 및 오류 처리 메커니즘",
    "zh": "功能和错误处理机制",
    "fr": "Fonctions et mécanismes de gestion des erreurs",
    "de": "Funktionen und Fehlerbehandlungsmechanismen",
    "es": "Funciones y mecanismos de manejo de errores"
  },
  "cau-truc-structs-phuong-thuc": {
    "vi": "Cấu trúc Structs & Phương thức",
    "en": "Structures & Methods",
    "ja": "構造と方法",
    "ko": "구조 및 방법",
    "zh": "结构与方法",
    "fr": "Structures et méthodes",
    "de": "Strukturen & Methoden",
    "es": "Estructuras y métodos"
  },
  "structs-methods": {
    "vi": "Cấu trúc dữ liệu Structs & Phương thức trong Go",
    "en": "Structs & Methods"
  },
  "mang-slices-chuoi-ky-tu": {
    "vi": "Mảng, Slices & Chuỗi ký tự",
    "en": "Arrays, Slices & Strings",
    "ja": "配列、スライス、文字列",
    "ko": "배열, 슬라이스, 문자열",
    "zh": "数组、切片和字符串",
    "fr": "Tableaux, tranches et chaînes",
    "de": "Arrays, Slices und Strings",
    "es": "Matrices, cortes y cadenas"
  },
  "arrays-slices-strings": {
    "vi": "Mảng, Slices & Chuỗi ký tự",
    "en": "Arrays, Slices & Strings",
    "ja": "配列、スライス、文字列",
    "ko": "배열, 슬라이스, 문자열",
    "zh": "数组、切片和字符串",
    "fr": "Tableaux, tranches et chaînes",
    "de": "Arrays, Slices und Strings",
    "es": "Matrices, cortes y cadenas"
  },
  "quan-ly-bo-nho-allocators": {
    "vi": "Quản lý bộ nhớ & Allocators",
    "en": "Memory Management & Allocators",
    "ja": "メモリ管理とアロケータ",
    "ko": "메모리 관리 및 할당자",
    "zh": "内存管理和分配器",
    "fr": "Gestion de la mémoire et répartiteurs",
    "de": "Speicherverwaltung und Zuweisungen",
    "es": "Gestión de memoria y asignadores"
  },
  "memory-management-allocators": {
    "vi": "Quản lý bộ nhớ & Allocators",
    "en": "Memory Management & Allocators",
    "ja": "メモリ管理とアロケータ",
    "ko": "메모리 관리 및 할당자",
    "zh": "内存管理和分配器",
    "fr": "Gestion de la mémoire et répartiteurs",
    "de": "Speicherverwaltung und Zuweisungen",
    "es": "Gestión de memoria y asignadores"
  },
  "comptime-lap-trinh-generic": {
    "vi": "Comptime & Lập trình Generic",
    "en": "Comptime & Generic Programming",
    "ja": "コンプタイムと汎用プログラミング",
    "ko": "Comptime 및 일반 프로그래밍",
    "zh": "编译时间和通用编程",
    "fr": "Programmation Comptime et générique",
    "de": "Comptime und generische Programmierung",
    "es": "Comptime y programación genérica"
  },
  "comptime-generic-programming": {
    "vi": "Comptime & Lập trình Generic",
    "en": "Comptime & Generic Programming",
    "ja": "コンプタイムと汎用プログラミング",
    "ko": "Comptime 및 일반 프로그래밍",
    "zh": "编译时间和通用编程",
    "fr": "Programmation Comptime et générique",
    "de": "Comptime und generische Programmierung",
    "es": "Comptime y programación genérica"
  },
  "io-bat-dong-bo-lap-trinh-mang": {
    "vi": "I/O Bất đồng bộ & Lập trình Mạng",
    "en": "Async I/O & Network Programming"
  },
  "async-io-network-programming": {
    "vi": "I/O Bất đồng bộ & Lập trình Mạng",
    "en": "Async I/O & Network Programming"
  },
  "tuong-tac-truc-tiep-voi-ma-nguon-c-ffi": {
    "vi": "Tương tác trực tiếp với mã nguồn C (FFI)",
    "en": "Direct interaction with C source code (FFI)",
    "ja": "C ソース コード (FFI) との直接対話",
    "ko": "C 소스 코드(FFI)와의 직접적인 상호 작용",
    "zh": "与 C 源代码直接交互 (FFI)",
    "fr": "Interaction directe avec le code source C (FFI)",
    "de": "Direkte Interaktion mit C-Quellcode (FFI)",
    "es": "Interacción directa con el código fuente C (FFI)"
  },
  "c-interoperability-ffi": {
    "vi": "Tương tác trực tiếp với mã nguồn C (FFI)",
    "en": "C Interoperability (FFI)",
    "ja": "C言語との直接相互運用（FFI）",
    "ko": "C 언어 직접 상호 운용 (FFI)",
    "zh": "与C代码的直接互操作（FFI）",
    "fr": "Interopérabilité directe avec C (FFI)",
    "de": "Direkte C-Interoperabilität (FFI)",
    "es": "Interoperabilidad directa con C (FFI)"
  },
  "he-thong-build-bien-dich-cheo-cross-compilation": {
    "vi": "Hệ thống Build & Biên dịch chéo (Cross-Compilation)",
    "en": "Cross-Compilation & Build System",
    "ja": "クロスコンパイルとビルドシステム",
    "ko": "크로스 컴파일 및 빌드 시스템",
    "zh": "交叉编译和构建系统",
    "fr": "Compilation croisée et système de construction",
    "de": "Cross-Compilation & Build-System",
    "es": "Sistema de compilación y compilación cruzada"
  },
  "build-system-cross-compilation": {
    "vi": "Hệ thống Build & Biên dịch chéo (Cross-Compilation)",
    "en": "Build System & Cross-Compilation",
    "ja": "ビルドシステムとクロスコンパイル",
    "ko": "빌드 시스템 및 크로스 컴파일",
    "zh": "构建系统与交叉编译",
    "fr": "Système de build et compilation croisée",
    "de": "Build-System & Cross-Kompilierung",
    "es": "Sistema de compilación y compilación cruzada"
  },
  "lap-trinh-cap-he-dieu-hanh-syscalls": {
    "vi": "Lập trình cấp hệ điều hành & Syscalls",
    "en": "Operating System Level Programming & Syscalls",
    "ja": "オペレーティング システム レベルのプログラミングとシステムコール",
    "ko": "운영 체제 수준 프로그래밍 및 Syscall",
    "zh": "操作系统级编程和系统调用",
    "fr": "Programmation au niveau du système d'exploitation et appels système",
    "de": "Programmierung und Systemaufrufe auf Betriebssystemebene",
    "es": "Programación a nivel de sistema operativo y llamadas al sistema"
  },
  "os-level-programming-syscalls": {
    "vi": "Lập trình cấp hệ điều hành & Syscalls",
    "en": "OS-Level Programming & Syscalls",
    "ja": "OSレベルプログラミングとシステムコール",
    "ko": "OS 레벨 프로그래밍 및 시스템 콜",
    "zh": "操作系统级编程与系统调用",
    "fr": "Programmation système et appels système",
    "de": "Betriebssystemnahe Programmierung & Syscalls",
    "es": "Programación a nivel de SO y llamadas al sistema"
  },
  "blockchain-hop-dong-thong-minh-co-ban": {
    "vi": "Blockchain & Hợp đồng thông minh cơ bản",
    "en": "Blockchain & Basic Smart Contracts",
    "ja": "ブロックチェーンと基本的なスマートコントラクト",
    "ko": "블록체인 및 기본 스마트 계약",
    "zh": "区块链和基本智能合约",
    "fr": "Blockchain et contrats intelligents de base",
    "de": "Blockchain und grundlegende Smart Contracts",
    "es": "Blockchain y contratos inteligentes básicos"
  },
  "blockchain-smart-contracts-fundamentals": {
    "vi": "Blockchain & Hợp đồng thông minh cơ bản",
    "en": "Blockchain & Smart Contracts Fundamentals",
    "ja": "ブロックチェーンとスマートコントラクトの基礎",
    "ko": "블록체인 및 스마트 계약 기초",
    "zh": "区块链与智能合约基础",
    "fr": "Bases de la blockchain et des smart contracts",
    "de": "Blockchain & Smart Contracts Grundlagen",
    "es": "Fundamentos de blockchain y contratos inteligentes"
  },
  "kieu-du-lieu-bien-ham-trong-solidity": {
    "vi": "Kiểu dữ liệu, Biến & Hàm trong Solidity",
    "en": "Data Types, Variables & Functions in Solidity",
    "ja": "Solidity のデータ型、変数、関数",
    "ko": "Solidity의 데이터 유형, 변수 및 함수",
    "zh": "Solidity 中的数据类型、变量和函数",
    "fr": "Types de données, variables et fonctions dans Solidity",
    "de": "Datentypen, Variablen und Funktionen in Solidity",
    "es": "Tipos de datos, variables y funciones en Solidity"
  },
  "data-types-variables-functions-in-solidity": {
    "vi": "Kiểu dữ liệu, Biến & Hàm trong Solidity",
    "en": "Data Types, Variables & Functions in Solidity",
    "ja": "Solidity のデータ型、変数、関数",
    "ko": "Solidity의 데이터 유형, 변수 및 함수",
    "zh": "Solidity 中的数据类型、变量和函数",
    "fr": "Types de données, variables et fonctions dans Solidity",
    "de": "Datentypen, Variablen und Funktionen in Solidity",
    "es": "Tipos de datos, variables y funciones en Solidity"
  },
  "su-kien-ghi-nhat-ky-events-logs": {
    "vi": "Sự kiện & Ghi nhật ký (Events & Logs)",
    "en": "Events & Logs",
    "ja": "イベントとログ",
    "ko": "이벤트 및 로그",
    "zh": "事件和日志",
    "fr": "Événements et journaux",
    "de": "Ereignisse und Protokolle",
    "es": "Eventos y registros"
  },
  "events-logs-in-smart-contracts": {
    "vi": "Sự kiện & Ghi nhật ký (Events & Logs)",
    "en": "Events & Logs in Smart Contracts",
    "ja": "イベントとログ",
    "ko": "이벤트 및 로그 기록",
    "zh": "事件与日志",
    "fr": "Événements et journaux",
    "de": "Ereignisse & Protokolle",
    "es": "Eventos y registros"
  },
  "xay-dung-token-chuan-erc-20": {
    "vi": "Xây dựng Token chuẩn ERC-20",
    "en": "Build ERC-20 standard Token",
    "ja": "ERC-20標準トークンの構築",
    "ko": "ERC-20 표준 토큰 구축",
    "zh": "构建ERC-20标准Token",
    "fr": "Construire un jeton standard ERC-20",
    "de": "Erstellen Sie ein ERC-20-Standard-Token",
    "es": "Construya un token estándar ERC-20"
  },
  "building-standard-erc-20-tokens": {
    "vi": "Xây dựng Token chuẩn ERC-20",
    "en": "Building Standard ERC-20 Tokens",
    "ja": "標準ERC-20トークンの構築",
    "ko": "표준 ERC-20 토큰 구축",
    "zh": "构建标准ERC-20代币",
    "fr": "Création de tokens standard ERC-20",
    "de": "Erstellen von Standard-ERC-20-Tokens",
    "es": "Construcción de tokens estándar ERC-20"
  },
  "bao-mat-cac-lo-hong-pho-bien-reentrancy": {
    "vi": "Bảo mật & Các lỗ hổng phổ biến (Reentrancy)",
    "en": "Security & Common Vulnerabilities (Reentrancy)",
    "ja": "セキュリティと一般的な脆弱性 (再入可能)",
    "ko": "보안 및 일반 취약점(재진입)",
    "zh": "安全和常见漏洞（可重入）",
    "fr": "Sécurité et vulnérabilités courantes (réentrance)",
    "de": "Sicherheit und häufige Schwachstellen (Wiedereintritt)",
    "es": "Seguridad y vulnerabilidades comunes (reentrada)"
  },
  "smart-contract-security-common-vulnerabilities-reentrancy": {
    "vi": "Bảo mật & Các lỗ hổng phổ biến (Reentrancy)",
    "en": "Smart Contract Security & Common Vulnerabilities (Reentrancy)",
    "ja": "スマートコントラクトのセキュリティと一般的な脆弱性（リエントランシー）",
    "ko": "스마트 계약 보안 및 일반적인 취약점 (재진입 공격)",
    "zh": "智能合约安全与常见漏洞（重入攻击）",
    "fr": "Sécurité des smart contracts et vulnérabilités courantes (Reentrancy)",
    "de": "Smart-Contract-Sicherheit & Häufige Schwachstellen (Reentrancy)",
    "es": "Seguridad de contratos inteligentes y vulnerabilidades comunes (Reentrancy)"
  },
  "giao-thuc-defi-staking-liquidity-pool": {
    "vi": "Giao thức DeFi, Staking & Liquidity Pool",
    "en": "DeFi Protocol, Staking & Liquidity Pool",
    "ja": "DeFiプロトコル、ステーキング、流動性プール",
    "ko": "DeFi 프로토콜, 스테이킹 및 유동성 풀",
    "zh": "DeFi 协议、质押和流动性池",
    "fr": "Protocole DeFi, jalonnement et pool de liquidité",
    "de": "DeFi-Protokoll, Einsatz- und Liquiditätspool",
    "es": "Protocolo DeFi, participación y fondo de liquidez"
  },
  "defi-protocols-staking-liquidity-pools": {
    "vi": "Giao thức DeFi, Staking & Liquidity Pool",
    "en": "DeFi Protocols, Staking & Liquidity Pools",
    "ja": "DeFiプロトコル、ステーキング、流動性プール",
    "ko": "DeFi 프로토콜, 스테이킹 및 유동성 풀",
    "zh": "DeFi协议、质押与流动性池",
    "fr": "Protocoles DeFi, staking et pools de liquidité",
    "de": "DeFi-Protokolle, Staking & Liquiditätspools",
    "es": "Protocolos DeFi, staking y pools de liquidez"
  },
  "proxy-patterns-kha-nang-nang-cap-hop-dong": {
    "vi": "Proxy Patterns & Khả năng nâng cấp hợp đồng",
    "en": "Proxy Patterns & Contract Upgrade Ability",
    "ja": "プロキシ パターンと契約のアップグレード機能",
    "ko": "프록시 패턴 및 계약 업그레이드 능력",
    "zh": "代理模式和合约升级能力",
    "fr": "Modèles de proxy et capacité de mise à niveau du contrat",
    "de": "Proxy-Muster und Möglichkeit zur Vertragsaktualisierung",
    "es": "Patrones de proxy y capacidad de actualización de contratos"
  },
  "proxy-patterns-contract-upgradability": {
    "vi": "Proxy Patterns & Khả năng nâng cấp hợp đồng",
    "en": "Proxy Patterns & Contract Upgradability",
    "ja": "プロキシパターンとコントラクトのアップグレード可能性",
    "ko": "프록시 패턴 및 계약 업그레이드 가능성",
    "zh": "代理模式与合约可升级性",
    "fr": "Modèles de proxy et évolutivité des contrats",
    "de": "Proxy-Muster & Vertrags-Upgradefähigkeit",
    "es": "Patrones de proxy y capacidad de actualización de contratos"
  },
  "kien-truc-dao-tokenomics-quan-tri-phi-tap-trung": {
    "vi": "Kiến trúc DAO, Tokenomics & Quản trị phi tập trung",
    "en": "DAO Architecture, Tokenomics & Decentralized Governance",
    "ja": "DAO アーキテクチャ、トケノミクス、分散型ガバナンス",
    "ko": "DAO 아키텍처, 토큰경제학 및 분산형 거버넌스",
    "zh": "DAO 架构、代币经济学和去中心化治理",
    "fr": "Architecture DAO, Tokenomics et gouvernance décentralisée",
    "de": "DAO-Architektur, Tokenomics und dezentrale Governance",
    "es": "Arquitectura DAO, Tokenomics y Gobernanza Descentralizada"
  },
  "dao-architecture-tokenomics-decentralized-governance": {
    "vi": "Kiến trúc DAO, Tokenomics & Quản trị phi tập trung",
    "en": "DAO Architecture, Tokenomics & Decentralized Governance",
    "ja": "DAO アーキテクチャ、トケノミクス、分散型ガバナンス",
    "ko": "DAO 아키텍처, 토큰경제학 및 분산형 거버넌스",
    "zh": "DAO 架构、代币经济学和去中心化治理",
    "fr": "Architecture DAO, Tokenomics et gouvernance décentralisée",
    "de": "DAO-Architektur, Tokenomics und dezentrale Governance",
    "es": "Arquitectura DAO, Tokenomics y Gobernanza Descentralizada"
  },
  "cu-phap-co-ban-moi-truong-lua": {
    "vi": "Cú pháp cơ bản & Môi trường Lua",
    "en": "Basic Syntax & Lua Environment",
    "ja": "基本的な構文と Lua 環境",
    "ko": "기본 구문 및 Lua 환경",
    "zh": "基本语法和Lua环境",
    "fr": "Syntaxe de base et environnement Lua",
    "de": "Grundlegende Syntax und Lua-Umgebung",
    "es": "Sintaxis básica y entorno Lua"
  },
  "basic-syntax-lua-environment": {
    "vi": "Cú pháp cơ bản & Môi trường Lua",
    "en": "Basic Syntax & Lua Environment",
    "ja": "基本的な構文と Lua 環境",
    "ko": "기본 구문 및 Lua 환경",
    "zh": "基本语法和Lua环境",
    "fr": "Syntaxe de base et environnement Lua",
    "de": "Grundlegende Syntax und Lua-Umgebung",
    "es": "Sintaxis básica y entorno Lua"
  },
  "tables-cau-truc-du-lieu-van-nang-trong-lua": {
    "vi": "Tables — Cấu trúc dữ liệu vạn năng trong Lua",
    "en": "Tables — Universal data structure in Lua",
    "ja": "テーブル — Lua のユニバーサル データ構造",
    "ko": "테이블 — Lua의 범용 데이터 구조",
    "zh": "表——Lua 中的通用数据结构",
    "fr": "Tables — Structure de données universelle dans Lua",
    "de": "Tabellen – Universelle Datenstruktur in Lua",
    "es": "Tablas: estructura de datos universal en Lua"
  },
  "tables-universal-data-structure-in-lua": {
    "vi": "Tables — Cấu trúc dữ liệu vạn năng trong Lua",
    "en": "Tables — Universal data structure in Lua",
    "ja": "テーブル — Lua のユニバーサル データ構造",
    "ko": "테이블 — Lua의 범용 데이터 구조",
    "zh": "表——Lua 中的通用数据结构",
    "fr": "Tables — Structure de données universelle dans Lua",
    "de": "Tabellen – Universelle Datenstruktur in Lua",
    "es": "Tablas: estructura de datos universal en Lua"
  },
  "ham-closures-nhieu-gia-tri-tra-ve": {
    "vi": "Hàm, Closures & Nhiều giá trị trả về",
    "en": "Functions, Closures & Multiple Return Values",
    "ja": "関数、クロージャ、複数の戻り値",
    "ko": "함수, 클로저 및 다중 반환 값",
    "zh": "函数、闭包和多个返回值",
    "fr": "Fonctions, fermetures et valeurs de retour multiples",
    "de": "Funktionen, Abschlüsse und mehrere Rückgabewerte",
    "es": "Funciones, cierres y múltiples valores de retorno"
  },
  "functions-closures-multiple-return-values": {
    "vi": "Hàm, Closures & Nhiều giá trị trả về",
    "en": "Functions, Closures & Multiple Return Values",
    "ja": "関数、クロージャ、複数の戻り値",
    "ko": "함수, 클로저 및 다중 반환 값",
    "zh": "函数、闭包和多个返回值",
    "fr": "Fonctions, fermetures et valeurs de retour multiples",
    "de": "Funktionen, Abschlüsse und mehrere Rückgabewerte",
    "es": "Funciones, cierres y múltiples valores de retorno"
  },
  "lap-trinh-huong-doi-tuong-voi-metatables": {
    "vi": "Lập trình hướng đối tượng với Metatables",
    "en": "Object-oriented programming with Metatables",
    "ja": "Metatables を使用したオブジェクト指向プログラミング",
    "ko": "메타테이블을 사용한 객체지향 프로그래밍",
    "zh": "使用元表进行面向对象编程",
    "fr": "Programmation orientée objet avec Metatables",
    "de": "Objektorientierte Programmierung mit Metatabellen",
    "es": "Programación orientada a objetos con Metatables"
  },
  "object-oriented-programming-with-metatables": {
    "vi": "Lập trình hướng đối tượng với Metatables",
    "en": "Object-oriented programming with Metatables",
    "ja": "Metatables を使用したオブジェクト指向プログラミング",
    "ko": "메타테이블을 사용한 객체지향 프로그래밍",
    "zh": "使用元表进行面向对象编程",
    "fr": "Programmation orientée objet avec Metatables",
    "de": "Objektorientierte Programmierung mit Metatabellen",
    "es": "Programación orientada a objetos con Metatables"
  },
  "module-hoa-quan-ly-thu-vien-voi-luarocks": {
    "vi": "Module hóa & Quản lý thư viện với LuaRocks",
    "en": "Modularization & Library Management with LuaRocks",
    "ja": "LuaRocks によるモジュール化とライブラリ管理",
    "ko": "LuaRocks를 통한 모듈화 및 라이브러리 관리",
    "zh": "使用 LuaRocks 进行模块化和库管理",
    "fr": "Modularisation et gestion de bibliothèque avec LuaRocks",
    "de": "Modularisierung und Bibliotheksverwaltung mit LuaRocks",
    "es": "Modularización y gestión de bibliotecas con LuaRocks"
  },
  "modularization-package-management-with-luarocks": {
    "vi": "Module hóa & Quản lý thư viện với LuaRocks",
    "en": "Modularization & Package Management with LuaRocks",
    "ja": "モジュール化とLuaRocksによるパッケージ管理",
    "ko": "모듈화 및 LuaRocks를 통한 패키지 관리",
    "zh": "模块化与LuaRocks包管理",
    "fr": "Modularisation et gestion des paquets avec LuaRocks",
    "de": "Modularisierung & Paketverwaltung mit LuaRocks",
    "es": "Modularización y gestión de paquetes con LuaRocks"
  },
  "vong-lap-game-loop-lap-trinh-roblox-luau": {
    "vi": "Vòng lặp Game Loop & Lập trình Roblox (Luau)",
    "en": "Game Loop & Roblox Programming (Luau)",
    "ja": "ゲームループと Roblox プログラミング (Luau)",
    "ko": "게임 루프 및 Roblox 프로그래밍(Luau)",
    "zh": "游戏循环和 Roblox 编程（Luau）",
    "fr": "Programmation Game Loop et Roblox (Luau)",
    "de": "Game Loop & Roblox-Programmierung (Luau)",
    "es": "Programación de Game Loop y Roblox (Luau)"
  },
  "game-loops-roblox-programming-luau": {
    "vi": "Vòng lặp Game Loop & Lập trình Roblox (Luau)",
    "en": "Game Loops & Roblox Programming (Luau)",
    "ja": "ゲームループとRobloxプログラミング（Luau）",
    "ko": "게임 루프 및 Roblox 프로그래밍 (Luau)",
    "zh": "游戏循环与Roblox编程（Luau）",
    "fr": "Boucle de jeu et programmation Roblox (Luau)",
    "de": "Game Loops & Roblox-Programmierung (Luau)",
    "es": "Bucles de juego y programación de Roblox (Luau)"
  },
  "nhung-lua-interpreter-vao-chuong-trinh-cc": {
    "vi": "Nhúng Lua Interpreter vào chương trình C/C++",
    "en": "Embedding Lua Interpreter in C/C++ Programs"
  },
  "embedding-lua-interpreter-in-cc-programs": {
    "vi": "Nhúng Lua Interpreter vào chương trình C/C++",
    "en": "Embedding Lua Interpreter in C/C++ Programs"
  },
  "coroutines-luajit-thiet-ke-ngon-ngu-dsl": {
    "vi": "Coroutines, LuaJIT & Thiết kế Ngôn ngữ DSL",
    "en": "Coroutines, LuaJIT & DSL Language Design",
    "ja": "コルーチン、LuaJIT、DSL 言語設計",
    "ko": "코루틴, LuaJIT 및 DSL 언어 디자인",
    "zh": "协程、LuaJIT 和 DSL 语言设计",
    "fr": "Conception de langages Coroutines, LuaJIT et DSL",
    "de": "Coroutinen, LuaJIT und DSL-Sprachdesign",
    "es": "Corrutinas, diseño de lenguajes LuaJIT y DSL"
  },
  "coroutines-luajit-dsl-language-design": {
    "vi": "Coroutines, LuaJIT & Thiết kế Ngôn ngữ DSL",
    "en": "Coroutines, LuaJIT & DSL Language Design",
    "ja": "コルーチン、LuaJIT、DSL 言語設計",
    "ko": "코루틴, LuaJIT 및 DSL 언어 디자인",
    "zh": "协程、LuaJIT 和 DSL 语言设计",
    "fr": "Conception de langages Coroutines, LuaJIT et DSL",
    "de": "Coroutinen, LuaJIT und DSL-Sprachdesign",
    "es": "Corrutinas, diseño de lenguajes LuaJIT y DSL"
  },
  "nen-tang-ngon-ngu-r-moi-truong-rstudio": {
    "vi": "Nền tảng ngôn ngữ R & Môi trường RStudio",
    "en": "R Language Platform & RStudio Environment",
    "ja": "R 言語プラットフォームと RStudio 環境",
    "ko": "R 언어 플랫폼 및 RStudio 환경",
    "zh": "R语言平台和RStudio环境",
    "fr": "Plateforme de langage R et environnement RStudio",
    "de": "R-Sprachplattform und RStudio-Umgebung",
    "es": "Plataforma de lenguaje R y entorno RStudio"
  },
  "r-language-foundations-rstudio-environment": {
    "vi": "Nền tảng ngôn ngữ R & Môi trường RStudio",
    "en": "R Language Foundations & RStudio Environment",
    "ja": "R言語の基礎とRStudio環境",
    "ko": "R 언어 기초 및 RStudio 환경",
    "zh": "R语言基础与RStudio环境",
    "fr": "Bases du langage R et environnement RStudio",
    "de": "R-Sprachgrundlagen & RStudio-Umgebung",
    "es": "Fundamentos del lenguaje R y entorno RStudio"
  },
  "bang-du-lieu-data-frames-trong-r": {
    "vi": "Bảng dữ liệu Data Frames trong R",
    "en": "Data Frames data table in R",
    "ja": "R のデータ フレーム データ テーブル",
    "ko": "R의 데이터 프레임 데이터 테이블",
    "zh": "R 中的数据帧数据表",
    "fr": "Tableau de données des trames de données dans R",
    "de": "Datentabelle „Datenrahmen“ in R",
    "es": "Tabla de datos de marcos de datos en R"
  },
  "data-frames-in-r": {
    "vi": "Bảng dữ liệu Data Frames trong R",
    "en": "Data Frames in R",
    "ja": "Rのデータフレーム",
    "ko": "R의 데이터 프레임",
    "zh": "R中的数据框（Data Frames）",
    "fr": "Data Frames en R",
    "de": "Data Frames in R",
    "es": "Data Frames en R"
  },
  "truc-quan-hoa-bieu-do-voi-base-r-ggplot2": {
    "vi": "Trực quan hóa biểu đồ với Base R & ggplot2",
    "en": "Visualize graphs with Base R & ggplot2",
    "ja": "Base R と ggplot2 でグラフを視覚化する",
    "ko": "Base R 및 ggplot2를 사용하여 그래프 시각화",
    "zh": "使用 Base R 和 ggplot2 可视化图表",
    "fr": "Visualisez des graphiques avec Base R & ggplot2",
    "de": "Visualisieren Sie Diagramme mit Base R und ggplot2",
    "es": "Visualice gráficos con Base R y ggplot2"
  },
  "data-visualization-with-base-r-ggplot2": {
    "vi": "Trực quan hóa biểu đồ với Base R & ggplot2",
    "en": "Data Visualization with Base R & ggplot2",
    "ja": "Base Rとggplot2によるデータ可視化",
    "ko": "Base R 및 ggplot2를 활용한 데이터 시각화",
    "zh": "使用Base R与ggplot2进行数据可视化",
    "fr": "Visualisation des données avec Base R et ggplot2",
    "de": "Datenvisualisierung mit Base R & ggplot2",
    "es": "Visualización de datos con Base R y ggplot2"
  },
  "xu-ly-du-lieu-chuyen-nghiep-voi-dplyr-tidyverse": {
    "vi": "Xử lý dữ liệu chuyên nghiệp với dplyr & Tidyverse",
    "en": "Process data professionally with dplyr & Tidyverse",
    "ja": "dplyr と Tidyverse を使用してデータを専門的に処理する",
    "ko": "dplyr 및 Tidyverse를 사용하여 전문적으로 데이터 처리",
    "zh": "使用 dplyr 和 Tidyverse 专业处理数据",
    "fr": "Traitez les données de manière professionnelle avec dplyr & Tidyverse",
    "de": "Verarbeiten Sie Daten professionell mit dplyr & Tidyverse",
    "es": "Procese datos de forma profesional con dplyr y Tidyverse"
  },
  "data-wrangling-with-dplyr-tidyverse": {
    "vi": "Xử lý dữ liệu chuyên nghiệp với dplyr & Tidyverse",
    "en": "Data Wrangling with dplyr & Tidyverse",
    "ja": "dplyrとTidyverseによる本格的なデータ処理",
    "ko": "dplyr 및 Tidyverse를 활용한 전문 데이터 가공",
    "zh": "使用dplyr与Tidyverse进行专业数据清洗",
    "fr": "Traitement des données avec dplyr et Tidyverse",
    "de": "Datenverarbeitung mit dplyr & Tidyverse",
    "es": "Manipulación de datos con dplyr y Tidyverse"
  },
  "phan-tich-thong-ke-kiem-dinh-gia-thuyet": {
    "vi": "Phân tích thống kê & Kiểm định giả thuyết",
    "en": "Statistical Analysis & Hypothesis Testing",
    "ja": "統計分析と仮説検証",
    "ko": "통계분석 및 가설검증",
    "zh": "统计分析和假设检验",
    "fr": "Analyse statistique et tests d'hypothèses",
    "de": "Statistische Analyse und Hypothesentests",
    "es": "Análisis estadístico y prueba de hipótesis"
  },
  "statistical-analysis-hypothesis-testing": {
    "vi": "Phân tích thống kê & Kiểm định giả thuyết",
    "en": "Statistical Analysis & Hypothesis Testing",
    "ja": "統計分析と仮説検証",
    "ko": "통계분석 및 가설검증",
    "zh": "统计分析和假设检验",
    "fr": "Analyse statistique et tests d'hypothèses",
    "de": "Statistische Analyse und Hypothesentests",
    "es": "Análisis estadístico y prueba de hipótesis"
  },
  "mo-hinh-hoc-may-machine-learning-voi-caret": {
    "vi": "Mô hình Học máy Machine Learning với Caret",
    "en": "Machine Learning Model with Caret",
    "ja": "キャレットを使用した機械学習モデル",
    "ko": "캐럿을 사용한 기계 학습 모델",
    "zh": "带插入符的机器学习模型",
    "fr": "Modèle d'apprentissage automatique avec Caret",
    "de": "Modell für maschinelles Lernen mit Caret",
    "es": "Modelo de aprendizaje automático con Caret"
  },
  "machine-learning-models-with-caret": {
    "vi": "Mô hình Học máy Machine Learning với Caret",
    "en": "Machine Learning Models with Caret",
    "ja": "Caretによる機械学習モデル",
    "ko": "Caret을 활용한 머신러닝 모델링",
    "zh": "使用Caret进行机器学习建模",
    "fr": "Modèles d'apprentissage automatique avec Caret",
    "de": "Maschinelle Lernmodelle mit Caret",
    "es": "Modelos de aprendizaje automático con Caret"
  },
  "xay-dung-web-dashboard-tuong-tac-voi-r-shiny": {
    "vi": "Xây dựng Web Dashboard tương tác với R Shiny",
    "en": "Build an interactive Web Dashboard with R Shiny",
    "ja": "R Shiny を使用してインタラクティブな Web ダッシュボードを構築する",
    "ko": "R Shiny를 사용하여 대화형 웹 대시보드 구축",
    "zh": "使用 R Shiny 构建交互式 Web 仪表板",
    "fr": "Créez un tableau de bord Web interactif avec R Shiny",
    "de": "Erstellen Sie ein interaktives Web-Dashboard mit R Shiny",
    "es": "Cree un panel web interactivo con R Shiny"
  },
  "interactive-web-dashboards-with-r-shiny": {
    "vi": "Xây dựng Web Dashboard tương tác với R Shiny",
    "en": "Interactive Web Dashboards with R Shiny",
    "ja": "R ShinyによるインタラクティブWebダッシュボード構築",
    "ko": "R Shiny를 활용한 대화형 웹 대시보드 구축",
    "zh": "使用R Shiny构建交互式Web仪表板",
    "fr": "Création de tableaux de bord Web interactifs avec R Shiny",
    "de": "Interaktive Web-Dashboards mit R Shiny",
    "es": "Construcción de tableros web interactivos con R Shiny"
  },
  "trien-khai-api-voi-plumber-tich-hop-apache-spark": {
    "vi": "Triển khai API với Plumber & Tích hợp Apache Spark",
    "en": "API Deployment with Plumber & Apache Spark Integration",
    "ja": "Plumber と Apache Spark の統合による API デプロイメント",
    "ko": "배관공 및 Apache Spark 통합을 통한 API 배포",
    "zh": "通过 Plumber 和 Apache Spark 集成进行 API 部署",
    "fr": "Déploiement d'API avec intégration Plumber et Apache Spark",
    "de": "API-Bereitstellung mit Plumber- und Apache Spark-Integration",
    "es": "Implementación de API con integración de Plumber y Apache Spark"
  },
  "api-deployment-with-plumber-apache-spark-integration": {
    "vi": "Triển khai API với Plumber & Tích hợp Apache Spark",
    "en": "API Deployment with Plumber & Apache Spark Integration",
    "ja": "Plumber と Apache Spark の統合による API デプロイメント",
    "ko": "배관공 및 Apache Spark 통합을 통한 API 배포",
    "zh": "通过 Plumber 和 Apache Spark 集成进行 API 部署",
    "fr": "Déploiement d'API avec intégration Plumber et Apache Spark",
    "de": "API-Bereitstellung mit Plumber- und Apache Spark-Integration",
    "es": "Implementación de API con integración de Plumber y Apache Spark"
  },
  "tong-quan-scala-moi-truong-jvm": {
    "vi": "Tổng quan Scala & Môi trường JVM",
    "en": "Scala Overview & JVM Environment",
    "ja": "Scala の概要と JVM 環境",
    "ko": "Scala 개요 및 JVM 환경",
    "zh": "Scala 概述和 JVM 环境",
    "fr": "Présentation de Scala et environnement JVM",
    "de": "Scala-Übersicht und JVM-Umgebung",
    "es": "Descripción general de Scala y entorno JVM"
  },
  "scala-overview-jvm-environment": {
    "vi": "Tổng quan Scala & Môi trường JVM",
    "en": "Scala Overview & JVM Environment",
    "ja": "Scala の概要と JVM 環境",
    "ko": "Scala 개요 및 JVM 환경",
    "zh": "Scala 概述和 JVM 环境",
    "fr": "Présentation de Scala et environnement JVM",
    "de": "Scala-Übersicht und JVM-Umgebung",
    "es": "Descripción general de Scala y entorno JVM"
  },
  "ham-xu-ly-collections-manh-me": {
    "vi": "Hàm & Xử lý Collections mạnh mẽ",
    "en": "Powerful Collections Functions & Handling",
    "ja": "強力なコレクション機能と処理",
    "ko": "강력한 컬렉션 기능 및 처리",
    "zh": "强大的集合功能和处理",
    "fr": "Fonctions et gestion puissantes des collections",
    "de": "Leistungsstarke Sammlungsfunktionen und -verwaltung",
    "es": "Potentes funciones y manejo de colecciones"
  },
  "functions-powerful-collections-processing": {
    "vi": "Hàm & Xử lý Collections mạnh mẽ",
    "en": "Functions & Powerful Collections Processing",
    "ja": "関数と強力なコレクション処理",
    "ko": "함수 및 강력한 컬렉션 처리",
    "zh": "函数与强大的集合处理",
    "fr": "Fonctions et traitement puissant des collections",
    "de": "Funktionen & Leistungsstarke Sammlungsverarbeitung",
    "es": "Funciones y procesamiento avanzado de colecciones"
  },
  "lap-trinh-ham-nang-cao-kieu-option": {
    "vi": "Lập trình hàm nâng cao & Kiểu Option",
    "en": "Advanced functional programming & Option type",
    "ja": "高度な関数型プログラミングとオプションタイプ",
    "ko": "고급 함수형 프로그래밍 및 옵션 유형",
    "zh": "高级函数式编程和选项类型",
    "fr": "Programmation fonctionnelle avancée et type d'option",
    "de": "Erweiterte funktionale Programmierung und Optionstyp",
    "es": "Programación funcional avanzada y tipo de opción"
  },
  "advanced-functional-programming-option-types": {
    "vi": "Lập trình hàm nâng cao & Kiểu Option",
    "en": "Advanced Functional Programming & Option Types",
    "ja": "高度な関数型プログラミングとOption型",
    "ko": "고급 함수형 프로그래밍 및 Option 타입",
    "zh": "高级函数式编程与Option类型",
    "fr": "Programmation fonctionnelle avancée et types Option",
    "de": "Fortgeschrittene funktionale Programmierung & Option-Typen",
    "es": "Programación funcional avanzada y tipos Option"
  },
  "lap-trinh-dong-thoi-voi-futures-promises": {
    "vi": "Lập trình đồng thời với Futures & Promises",
    "en": "Concurrent programming with Futures & Promises",
    "ja": "Futures & Promise による同時プログラミング",
    "ko": "Futures & Promise를 사용한 동시 프로그래밍",
    "zh": "使用 Futures & Promise 进行并发编程",
    "fr": "Programmation simultanée avec Futures & Promises",
    "de": "Gleichzeitige Programmierung mit Futures & Promises",
    "es": "Programación concurrente con Futures & Promises"
  },
  "concurrency-with-futures-promises": {
    "vi": "Lập trình đồng thời với Futures & Promises",
    "en": "Concurrency with Futures & Promises",
    "ja": "FuturesとPromisesによる並行処理",
    "ko": "Futures 및 Promises를 활용한 동시성 프로그래밍",
    "zh": "使用Futures与Promises的并发编程",
    "fr": "Programmation concurrente avec Futures et Promises",
    "de": "Parallelität mit Futures & Promises",
    "es": "Concurrencia con Futures y Promises"
  },
  "phan-tich-du-lieu-lon-voi-apache-spark-dataframes": {
    "vi": "Phân tích Dữ liệu lớn với Apache Spark & DataFrames",
    "en": "Big Data Analytics with Apache Spark & DataFrames",
    "ja": "Apache Spark と DataFrame によるビッグ データ分析",
    "ko": "Apache Spark 및 DataFrames를 사용한 빅데이터 분석",
    "zh": "使用 Apache Spark 和 DataFrames 进行大数据分析",
    "fr": "Analyse Big Data avec Apache Spark et DataFrames",
    "de": "Big Data Analytics mit Apache Spark und DataFrames",
    "es": "Análisis de Big Data con Apache Spark y DataFrames"
  },
  "big-data-analytics-with-apache-spark-dataframes": {
    "vi": "Phân tích Dữ liệu lớn với Apache Spark & DataFrames",
    "en": "Big Data Analytics with Apache Spark & DataFrames",
    "ja": "Apache Spark と DataFrame によるビッグ データ分析",
    "ko": "Apache Spark 및 DataFrames를 사용한 빅데이터 분석",
    "zh": "使用 Apache Spark 和 DataFrames 进行大数据分析",
    "fr": "Analyse Big Data avec Apache Spark et DataFrames",
    "de": "Big Data Analytics mit Apache Spark und DataFrames",
    "es": "Análisis de Big Data con Apache Spark y DataFrames"
  },
  "he-thong-kieu-nang-cao-type-classes-implicitsgivens": {
    "vi": "Hệ thống kiểu nâng cao & Type Classes (Implicits/Givens)",
    "en": "Advanced Type System & Type Classes (Implicits/Givens)"
  },
  "advanced-type-system-type-classes-implicitsgivens": {
    "vi": "Hệ thống kiểu nâng cao & Type Classes (Implicits/Givens)",
    "en": "Advanced Type System & Type Classes (Implicits/Givens)"
  },
  "xay-dung-microservices-voi-akka-http-zio": {
    "vi": "Xây dựng Microservices với Akka HTTP & ZIO",
    "en": "Building Microservices with Akka HTTP & ZIO",
    "ja": "Akka HTTP と ZIO を使用したマイクロサービスの構築",
    "ko": "Akka HTTP 및 ZIO를 사용하여 마이크로서비스 구축",
    "zh": "使用 Akka HTTP 和 ZIO 构建微服务",
    "fr": "Création de microservices avec Akka HTTP et ZIO",
    "de": "Erstellen von Microservices mit Akka HTTP & ZIO",
    "es": "Creación de microservicios con Akka HTTP y ZIO"
  },
  "building-microservices-with-akka-http-zio": {
    "vi": "Xây dựng Microservices với Akka HTTP & ZIO",
    "en": "Building Microservices with Akka HTTP & ZIO",
    "ja": "Akka HTTP と ZIO を使用したマイクロサービスの構築",
    "ko": "Akka HTTP 및 ZIO를 사용하여 마이크로서비스 구축",
    "zh": "使用 Akka HTTP 和 ZIO 构建微服务",
    "fr": "Création de microservices avec Akka HTTP et ZIO",
    "de": "Erstellen von Microservices mit Akka HTTP & ZIO",
    "es": "Creación de microservicios con Akka HTTP y ZIO"
  },
  "cu-phap-go-kieu-du-lieu-co-ban": {
    "vi": "Cú pháp Go & Kiểu dữ liệu cơ bản",
    "en": "Go Syntax & Basic Data Types",
    "ja": "Go 構文と基本的なデータ型",
    "ko": "Go 구문 및 기본 데이터 유형",
    "zh": "Go 语法和基本数据类型",
    "fr": "Go Syntaxe et types de données de base",
    "de": "Gehen Sie zu Syntax und grundlegende Datentypen",
    "es": "Ir a sintaxis y tipos de datos básicos"
  },
  "go-syntax-basic-data-types": {
    "vi": "Cú pháp Go & Kiểu dữ liệu cơ bản",
    "en": "Go Syntax & Basic Data Types",
    "ja": "Go 構文と基本的なデータ型",
    "ko": "Go 구문 및 기본 데이터 유형",
    "zh": "Go 语法和基本数据类型",
    "fr": "Go Syntaxe et types de données de base",
    "de": "Gehen Sie zu Syntax und grundlegende Datentypen",
    "es": "Ir a sintaxis y tipos de datos básicos"
  },
  "ham-xu-ly-loi-tuong-minh-interfaces-trong-go": {
    "vi": "Hàm, Xử lý lỗi tường minh & Interfaces trong Go",
    "en": "Functions, Explicit Error Handling & Interfaces in Go",
    "ja": "Go の関数、明示的なエラー処理、インターフェイス",
    "ko": "Go의 함수, 명시적 오류 처리 및 인터페이스",
    "zh": "Go 中的函数、显式错误处理和接口",
    "fr": "Fonctions, gestion explicite des erreurs et interfaces dans Go",
    "de": "Funktionen, explizite Fehlerbehandlung und Schnittstellen in Go",
    "es": "Funciones, manejo de errores explícitos e interfaces en Go"
  },
  "functions-explicit-error-handling-interfaces-in-go": {
    "vi": "Hàm, Xử lý lỗi tường minh & Interfaces trong Go",
    "en": "Functions, Explicit Error Handling & Interfaces in Go",
    "ja": "Go の関数、明示的なエラー処理、インターフェイス",
    "ko": "Go의 함수, 명시적 오류 처리 및 인터페이스",
    "zh": "Go 中的函数、显式错误处理和接口",
    "fr": "Fonctions, gestion explicite des erreurs et interfaces dans Go",
    "de": "Funktionen, explizite Fehlerbehandlung und Schnittstellen in Go",
    "es": "Funciones, manejo de errores explícitos e interfaces en Go"
  },
  "lap-trinh-da-luong-voi-goroutines-channels": {
    "vi": "Lập trình đa luồng với Goroutines & Channels",
    "en": "Multi-threaded programming with Goroutines & Channels",
    "ja": "ゴルーチンとチャネルを使用したマルチスレッド プログラミング",
    "ko": "고루틴 및 채널을 사용한 멀티스레드 프로그래밍",
    "zh": "使用 Goroutine 和 Channel 进行多线程编程",
    "fr": "Programmation multithread avec Goroutines & Channels",
    "de": "Multithread-Programmierung mit Goroutinen und Kanälen",
    "es": "Programación multiproceso con Goroutines y Canales"
  },
  "concurrency-with-goroutines-channels": {
    "vi": "Lập trình đa luồng với Goroutines & Channels",
    "en": "Concurrency with Goroutines & Channels",
    "ja": "GoroutinesとChannelsによる並行プログラミング",
    "ko": "Goroutines 및 Channels를 활용한 동시성 프로그래밍",
    "zh": "使用Goroutines与Channels进行并发编程",
    "fr": "Concurrence avec Goroutines et Channels",
    "de": "Parallelität mit Goroutines & Channels",
    "es": "Concurrencia con Goroutines y Channels"
  },
  "kieu-du-lieu-dieu-khien": {
    "vi": "Kiểu dữ liệu & Điều khiển",
    "en": "Data Types & Controls",
    "ja": "データ型とコントロール",
    "ko": "데이터 유형 및 컨트롤",
    "zh": "数据类型和控件",
    "fr": "Types de données et contrôles",
    "de": "Datentypen und Steuerelemente",
    "es": "Tipos de datos y controles"
  },
  "data-types-control-flow": {
    "vi": "Kiểu dữ liệu & Luồng điều khiển trong Java",
    "en": "Data Types & Control Flow"
  },
  "mang-ham-arraylist": {
    "vi": "Mảng, Hàm & ArrayList",
    "en": "Mảng, Hàm & ArrayList",
    "ja": "配列、関数、ArrayList",
    "ko": "배열, 함수 및 ArrayList",
    "zh": "数组、函数和 ArrayList",
    "fr": "Tableaux, fonctions et liste de tableaux",
    "de": "Arrays, Funktionen und ArrayList",
    "es": "Matrices, funciones y lista de matrices"
  },
  "arrays-functions-arraylist": {
    "vi": "Mảng, Hàm & ArrayList",
    "en": "Arrays, Functions & ArrayList",
    "ja": "配列、関数、ArrayList",
    "ko": "배열, 함수 및 ArrayList",
    "zh": "数组、函数与ArrayList",
    "fr": "Tableaux, fonctions et ArrayList",
    "de": "Arrays, Funktionen & ArrayList",
    "es": "Arreglos, funciones y ArrayList"
  },
  "khung-du-lieu-collections-xu-ly-luong-streams-api": {
    "vi": "Khung dữ liệu Collections & Xử lý luồng Streams API",
    "en": "Collections Data Frame & Stream Processing Streams API",
    "ja": "コレクション データ フレームとストリーム処理 ストリーム API",
    "ko": "컬렉션 데이터 프레임 및 스트림 처리 스트림 API",
    "zh": "集合 数据帧 & 流处理 Streams API",
    "fr": "API de flux de traitement de trame de données et de flux de collections",
    "de": "Sammlungsdatenrahmen und Stream-Verarbeitungs-Streams-API",
    "es": "Marco de datos de colecciones y procesamiento de flujos API de flujos"
  },
  "collections-framework-streams-api": {
    "vi": "Khung dữ liệu Collections & Xử lý luồng Streams API",
    "en": "Collections Framework & Streams API",
    "ja": "コレクションフレームワークとStreams API",
    "ko": "컬렉션 프레임워크 및 Streams API",
    "zh": "集合框架与Streams API流处理",
    "fr": "Framework Collections et API Streams",
    "de": "Collections Framework & Streams-API",
    "es": "Framework Collections y API Streams"
  },
  "xu-ly-ngoai-le-exceptions-lap-trinh-generics": {
    "vi": "Xử lý ngoại lệ (Exceptions) & Lập trình Generics",
    "en": "Exception Handling & Generics Programming",
    "ja": "例外処理とジェネリックプログラミング",
    "ko": "예외 처리 및 제네릭 프로그래밍",
    "zh": "异常处理和泛型编程",
    "fr": "Gestion des exceptions et programmation générique",
    "de": "Ausnahmebehandlung und generische Programmierung",
    "es": "Manejo de excepciones y programación genérica"
  },
  "exception-handling-generics": {
    "vi": "Xử lý ngoại lệ (Exceptions) & Lập trình Generics",
    "en": "Exception Handling & Generics",
    "ja": "例外処理とジェネリクス",
    "ko": "예외 처리 및 제네릭 프로그래밍",
    "zh": "异常处理与泛型编程",
    "fr": "Gestion des exceptions et génériques",
    "de": "Ausnahmebehandlung & Generics",
    "es": "Manejo de excepciones y genéricos"
  },
  "matchers-assertions-chi-tiet": {
    "vi": "Matchers & Assertions chi tiết",
    "en": "Detailed Matchers & Assertions",
    "ja": "詳細なマッチャーとアサーション",
    "ko": "상세한 일치자 및 어설션",
    "zh": "详细的匹配器和断言",
    "fr": "Correspondants et assertions détaillés",
    "de": "Detaillierte Matcher und Behauptungen",
    "es": "Comparadores y afirmaciones detallados"
  },
  "matchers-assertions-in-depth": {
    "vi": "Matchers & Assertions chi tiết",
    "en": "Matchers & Assertions in Depth",
    "ja": "マッチャーとアサーションの詳細",
    "ko": "매처 및 어설션 상세",
    "zh": "匹配器与断言详解",
    "fr": "Matchers et assertions détaillés",
    "de": "Matchers & Zusicherungen im Detail",
    "es": "Matchers y aserciones en detalle"
  },
  "cu-phap-kotlin-an-toan-kieu-du-lieu-null-safety": {
    "vi": "Cú pháp Kotlin & An toàn kiểu dữ liệu (Null Safety)",
    "en": "Kotlin Syntax & Null Safety",
    "ja": "Kotlin 構文と Null 安全性",
    "ko": "Kotlin 구문 및 Null 안전성",
    "zh": "Kotlin 语法和 Null 安全",
    "fr": "Syntaxe Kotlin et sécurité nulle",
    "de": "Kotlin-Syntax und Nullsicherheit",
    "es": "Sintaxis de Kotlin y seguridad nula"
  },
  "kotlin-syntax-null-safety": {
    "vi": "Cú pháp Kotlin & An toàn kiểu dữ liệu (Null Safety)",
    "en": "Kotlin Syntax & Null Safety",
    "ja": "Kotlin 構文と Null 安全性",
    "ko": "Kotlin 구문 및 Null 안전성",
    "zh": "Kotlin 语法和 Null 安全",
    "fr": "Syntaxe Kotlin et sécurité nulle",
    "de": "Kotlin-Syntax und Nullsicherheit",
    "es": "Sintaxis de Kotlin y seguridad nula"
  },
  "oop-lop-sealed-classes-ham-mo-rong-extensions": {
    "vi": "OOP: Lớp, Sealed Classes & Hàm mở rộng Extensions",
    "en": "OOP: Classes, Sealed Classes & Extensions",
    "ja": "OOP: クラス、Sealed クラス、拡張機能",
    "ko": "OOP: 클래스, 봉인 클래스 및 확장",
    "zh": "OOP：类、密封类和扩展",
    "fr": "POO : classes, classes scellées et extensions",
    "de": "OOP: Klassen, versiegelte Klassen und Erweiterungen",
    "es": "POO: clases, clases selladas y extensiones"
  },
  "oop-classes-sealed-classes-extension-functions": {
    "vi": "OOP: Lớp, Sealed Classes & Hàm mở rộng Extensions",
    "en": "OOP: Classes, Sealed Classes & Extension Functions",
    "ja": "OOP：クラス、Sealedクラス、拡張関数",
    "ko": "OOP: 클래스, Sealed 클래스 및 확장 함수",
    "zh": "OOP：类、密封类与扩展函数",
    "fr": "POO : Classes, classes scellées et fonctions d'extension",
    "de": "OOP: Klassen, versiegelte Klassen & Erweiterungsfunktionen",
    "es": "POO: Clases, clases selladas y funciones de extensión"
  },
  "collections-lap-trinh-ham-trong-kotlin": {
    "vi": "Collections & Lập trình hàm trong Kotlin",
    "en": "Collections & Functional Programming in Kotlin",
    "ja": "Kotlin のコレクションと関数型プログラミング",
    "ko": "Kotlin의 컬렉션 및 함수형 프로그래밍",
    "zh": "Kotlin 中的集合和函数式编程",
    "fr": "Collections et programmation fonctionnelle à Kotlin",
    "de": "Sammlungen und funktionale Programmierung in Kotlin",
    "es": "Colecciones y programación funcional en Kotlin"
  },
  "collections-functional-programming-in-kotlin": {
    "vi": "Collections & Lập trình hàm trong Kotlin",
    "en": "Collections & Functional Programming in Kotlin",
    "ja": "Kotlin のコレクションと関数型プログラミング",
    "ko": "Kotlin의 컬렉션 및 함수형 프로그래밍",
    "zh": "Kotlin 中的集合和函数式编程",
    "fr": "Collections et programmation fonctionnelle à Kotlin",
    "de": "Sammlungen und funktionale Programmierung in Kotlin",
    "es": "Colecciones y programación funcional en Kotlin"
  },
  "kotlin-coroutines-xu-ly-bat-dong-bo-da-luong": {
    "vi": "Kotlin Coroutines & Xử lý bất đồng bộ đa luồng",
    "en": "Kotlin Coroutines & Multithreaded Asynchronous Processing",
    "ja": "Kotlin コルーチンとマルチスレッド非同期処理",
    "ko": "Kotlin 코루틴 및 멀티스레드 비동기 처리",
    "zh": "Kotlin 协程和多线程异步处理",
    "fr": "Coroutines Kotlin et traitement asynchrone multithread",
    "de": "Kotlin-Coroutinen und asynchrone Multithread-Verarbeitung",
    "es": "Corrutinas de Kotlin y procesamiento asincrónico multiproceso"
  },
  "kotlin-coroutines-asynchronous-concurrency": {
    "vi": "Kotlin Coroutines & Xử lý bất đồng bộ đa luồng",
    "en": "Kotlin Coroutines & Asynchronous Concurrency",
    "ja": "Kotlin Coroutinesと非同期並行処理",
    "ko": "Kotlin Coroutines 및 비동기 동시성 처리",
    "zh": "Kotlin协程与异步并发处理",
    "fr": "Coroutines Kotlin et concurrence asynchrone",
    "de": "Kotlin-Coroutinen & Asynchrone Parallelität",
    "es": "Corrutinas de Kotlin y concurrencia asíncrona"
  },
  "thiet-ke-giao-dien-hien-dai-voi-jetpack-compose": {
    "vi": "Thiết kế giao diện hiện đại với Jetpack Compose",
    "en": "Design a modern interface with Jetpack Compose",
    "ja": "Jetpack Compose を使用して最新のインターフェイスを設計する",
    "ko": "Jetpack Compose로 현대적인 인터페이스 디자인",
    "zh": "使用 Jetpack Compose 设计现代界面",
    "fr": "Concevoir une interface moderne avec Jetpack Compose",
    "de": "Entwerfen Sie eine moderne Benutzeroberfläche mit Jetpack Compose",
    "es": "Diseña una interfaz moderna con Jetpack Compose"
  },
  "modern-ui-design-with-jetpack-compose": {
    "vi": "Thiết kế giao diện hiện đại với Jetpack Compose",
    "en": "Modern UI Design with Jetpack Compose",
    "ja": "Jetpack ComposeによるモダンUI設計",
    "ko": "Jetpack Compose를 활용한 모던 UI 디자인",
    "zh": "使用Jetpack Compose设计现代化界面",
    "fr": "Conception d'interface moderne avec Jetpack Compose",
    "de": "Modernes UI-Design mit Jetpack Compose",
    "es": "Diseño de interfaz moderno con Jetpack Compose"
  },
  "server-side-kotlin-voi-ktor": {
    "vi": "Server-side Kotlin với Ktor",
    "en": "Server-side Kotlin with Ktor",
    "ja": "Ktor を使用したサーバーサイド Kotlin",
    "ko": "Ktor를 사용한 서버측 Kotlin",
    "zh": "带有 Ktor 的服务器端 Kotlin",
    "fr": "Kotlin côté serveur avec Ktor",
    "de": "Serverseitiges Kotlin mit Ktor",
    "es": "Kotlin del lado del servidor con Ktor"
  },
  "server-side-kotlin-with-ktor": {
    "vi": "Server-side Kotlin với Ktor",
    "en": "Server-side Kotlin with Ktor",
    "ja": "Ktor を使用したサーバーサイド Kotlin",
    "ko": "Ktor를 사용한 서버측 Kotlin",
    "zh": "带有 Ktor 的服务器端 Kotlin",
    "fr": "Kotlin côté serveur avec Ktor",
    "de": "Serverseitiges Kotlin mit Ktor",
    "es": "Kotlin del lado del servidor con Ktor"
  },
  "thiet-ke-index-toi-uu-hoa-toc-do-truy-van": {
    "vi": "Thiết kế Index & Tối ưu hóa tốc độ truy vấn",
    "en": "Index Design & Query Speed Optimization",
    "ja": "インデックス設計とクエリ速度の最適化",
    "ko": "인덱스 디자인 및 쿼리 속도 최적화",
    "zh": "索引设计&查询速度优化",
    "fr": "Conception d'index et optimisation de la vitesse des requêtes",
    "de": "Indexdesign und Optimierung der Abfragegeschwindigkeit",
    "es": "Diseño de índices y optimización de la velocidad de consultas"
  },
  "index-design-query-optimization": {
    "vi": "Thiết kế Index & Tối ưu hóa tốc độ truy vấn",
    "en": "Index Design & Query Optimization",
    "ja": "インデックス設計とクエリ最適化",
    "ko": "인덱스 설계 및 쿼리 속도 최적화",
    "zh": "索引设计与查询优化",
    "fr": "Conception d'index et optimisation des requêtes",
    "de": "Index-Design & Abfrageoptimierung",
    "es": "Diseño de índices y optimización de consultas"
  },
  "authentication-voi-jwt": {
    "vi": "Authentication với JWT",
    "en": "Authentication with JWT",
    "ja": "JWTによる認証",
    "ko": "JWT로 인증",
    "zh": "使用 JWT 进行身份验证",
    "fr": "Authentification avec JWT",
    "de": "Authentifizierung mit JWT",
    "es": "Autenticación con JWT"
  },
  "authentication-with-jwt": {
    "vi": "Authentication với JWT",
    "en": "Authentication with JWT",
    "ja": "JWTによる認証",
    "ko": "JWT로 인증",
    "zh": "使用 JWT 进行身份验证",
    "fr": "Authentification avec JWT",
    "de": "Authentifizierung mit JWT",
    "es": "Autenticación con JWT"
  },
  "system-design-voi-nodejs": {
    "vi": "System Design với Node.js",
    "en": "System Design with Node.js"
  },
  "system-design-with-nodejs": {
    "vi": "System Design với Node.js",
    "en": "System Design with Node.js"
  },
  "oop-hien-dai-trong-php-8-namespaces": {
    "vi": "OOP hiện đại trong PHP 8 & Namespaces",
    "en": "Modern OOP in PHP 8 & Namespaces",
    "ja": "PHP 8 の最新の OOP と名前空間",
    "ko": "PHP 8 및 네임스페이스의 최신 OOP",
    "zh": "PHP 8 和命名空间中的现代 OOP",
    "fr": "POO moderne en PHP 8 et espaces de noms",
    "de": "Modernes OOP in PHP 8 und Namespaces",
    "es": "POO moderna en PHP 8 y espacios de nombres"
  },
  "modern-oop-in-php-8-namespaces": {
    "vi": "OOP hiện đại trong PHP 8 & Namespaces",
    "en": "Modern OOP in PHP 8 & Namespaces",
    "ja": "PHP 8 の最新の OOP と名前空間",
    "ko": "PHP 8 및 네임스페이스의 최신 OOP",
    "zh": "PHP 8 和命名空间中的现代 OOP",
    "fr": "POO moderne en PHP 8 et espaces de noms",
    "de": "Modernes OOP in PHP 8 und Namespaces",
    "es": "POO moderna en PHP 8 y espacios de nombres"
  },
  "php-testing-voi-phpunit-pest": {
    "vi": "PHP Testing với PHPUnit & Pest",
    "en": "PHP Testing with PHPUnit & Pest",
    "ja": "PHPUnit と Pest を使用した PHP テスト",
    "ko": "PHPUnit 및 Pest를 사용한 PHP 테스트",
    "zh": "使用 PHPUnit 和 Pest 进行 PHP 测试",
    "fr": "Test PHP avec PHPUnit et Pest",
    "de": "PHP-Tests mit PHPUnit & Pest",
    "es": "Pruebas de PHP con PHPUnit y Pest"
  },
  "php-testing-with-phpunit-pest": {
    "vi": "PHP Testing với PHPUnit & Pest",
    "en": "PHP Testing with PHPUnit & Pest",
    "ja": "PHPUnit と Pest を使用した PHP テスト",
    "ko": "PHPUnit 및 Pest를 사용한 PHP 테스트",
    "zh": "使用 PHPUnit 和 Pest 进行 PHP 测试",
    "fr": "Test PHP avec PHPUnit et Pest",
    "de": "PHP-Tests mit PHPUnit & Pest",
    "es": "Pruebas de PHP con PHPUnit y Pest"
  },
  "dieu-kien-toan-tu": {
    "vi": "Điều kiện & Toán tử",
    "en": "Conditions & Operators",
    "ja": "条件と演算子",
    "ko": "조건 및 연산자",
    "zh": "条件和运营商",
    "fr": "Conditions & Opérateurs",
    "de": "Bedingungen & Betreiber",
    "es": "Condiciones y operadores"
  },
  "conditionals-operators": {
    "vi": "Điều kiện & Toán tử",
    "en": "Conditionals & Operators",
    "ja": "条件分岐と演算子",
    "ko": "조건문 및 연산자",
    "zh": "条件与运算符",
    "fr": "Conditions et opérateurs",
    "de": "Bedingungen & Operatoren",
    "es": "Condicionales y operadores"
  },
  "vong-lap-range": {
    "vi": "Vòng lặp & Range",
    "en": "Vòng lặp & Range",
    "ja": "ループと範囲",
    "ko": "루프 및 범위",
    "zh": "循环和范围",
    "fr": "Boucle et portée",
    "de": "Schleife und Reichweite",
    "es": "Bucle y rango"
  },
  "loops-ranges": {
    "vi": "Vòng lặp & Range",
    "en": "Loops & Ranges",
    "ja": "ループと範囲（Range）",
    "ko": "반복문 및 범위",
    "zh": "循环与范围（Range）",
    "fr": "Boucles et plages",
    "de": "Schleifen & Bereiche",
    "es": "Bucles y rangos"
  },
  "ham-lambda": {
    "vi": "Hàm & Lambda",
    "en": "Hàm & Lambda",
    "ja": "関数とラムダ",
    "ko": "함수 및 람다",
    "zh": "函数和 Lambda 表达式",
    "fr": "Fonctions et Lambda",
    "de": "Funktionen und Lambdas",
    "es": "Funciones y Lambdas"
  },
  "functions-lambdas": {
    "vi": "Hàm & Lambda",
    "en": "Functions & Lambdas",
    "ja": "関数とラムダ式",
    "ko": "함수 및 람다",
    "zh": "函数与Lambda",
    "fr": "Fonctions et lambdas",
    "de": "Funktionen & Lambdas",
    "es": "Funciones y lambdas"
  },
  "metaclasses-thuoc-tinh-descriptors": {
    "vi": "Metaclasses & Thuộc tính Descriptors",
    "en": "Metaclasses & Attribute Descriptors",
    "ja": "メタクラスと属性記述子",
    "ko": "메타클래스 및 속성 설명자",
    "zh": "元类和属性描述符",
    "fr": "Métaclasses et descripteurs d'attributs",
    "de": "Metaklassen und Attributdeskriptoren",
    "es": "Metaclases y descriptores de atributos"
  },
  "metaclasses-descriptors": {
    "vi": "Metaclasses & Thuộc tính Descriptors",
    "en": "Metaclasses & Descriptors",
    "ja": "メタクラスとディスクリプタ",
    "ko": "메타클래스 및 디스크립터",
    "zh": "元类与描述符（Descriptors）",
    "fr": "Métaclasses et descripteurs",
    "de": "Metaklassen & Deskriptoren",
    "es": "Metaclases y descriptores"
  },
  "testing-voi-rspec": {
    "vi": "Testing với RSpec",
    "en": "Testing with RSpec",
    "ja": "RSpec を使用したテスト",
    "ko": "RSpec으로 테스트하기",
    "zh": "使用 RSpec 进行测试",
    "fr": "Test avec RSpec",
    "de": "Testen mit RSpec",
    "es": "Pruebas con RSpec"
  },
  "testing-with-rspec": {
    "vi": "Testing với RSpec",
    "en": "Testing with RSpec",
    "ja": "RSpec を使用したテスト",
    "ko": "RSpec으로 테스트하기",
    "zh": "使用 RSpec 进行测试",
    "fr": "Test avec RSpec",
    "de": "Testen mit RSpec",
    "es": "Pruebas con RSpec"
  },
  "dac-ta-hanh-vi-voi-traits-lap-trinh-generics": {
    "vi": "Đặc tả hành vi với Traits & Lập trình Generics",
    "en": "Specification of Behavior with Traits & Programming Generics",
    "ja": "特性とプログラミングジェネリックスによる動作の仕様",
    "ko": "특성 및 프로그래밍 일반을 사용한 동작 사양",
    "zh": "具有特征和编程泛型的行为规范",
    "fr": "Spécification du comportement avec des traits et des génériques de programmation",
    "de": "Spezifikation des Verhaltens mit Merkmalen und Programmiergenerika",
    "es": "Especificación de comportamiento con rasgos y genéricos de programación"
  },
  "traits-generic-programming": {
    "vi": "Đặc tả hành vi với Traits & Lập trình Generics",
    "en": "Traits & Generic Programming",
    "ja": "Traitsとジェネリックプログラミング",
    "ko": "Traits 및 제네릭 프로그래밍",
    "zh": "Traits与泛型编程",
    "fr": "Traits et programmation générique",
    "de": "Traits & Generische Programmierung",
    "es": "Traits y programación genérica"
  },
  "web-development-voi-axum": {
    "vi": "Web Development với Axum",
    "en": "Web Development with Axum",
    "ja": "Axum による Web 開発",
    "ko": "Axum을 사용한 웹 개발",
    "zh": "使用 Axum 进行 Web 开发",
    "fr": "Développement Web avec Axum",
    "de": "Webentwicklung mit Axum",
    "es": "Desarrollo web con Axum"
  },
  "web-development-with-axum": {
    "vi": "Web Development với Axum",
    "en": "Web Development with Axum",
    "ja": "Axum による Web 開発",
    "ko": "Axum을 사용한 웹 개발",
    "zh": "使用 Axum 进行 Web 开发",
    "fr": "Développement Web avec Axum",
    "de": "Webentwicklung mit Axum",
    "es": "Desarrollo web con Axum"
  },
  "lap-trinh-unsafe-rust-tuong-tac-c-ffi": {
    "vi": "Lập trình Unsafe Rust & Tương tác C FFI",
    "en": "Unsafe Rust Programming & C FFI Interaction",
    "ja": "安全でない Rust プログラミングと C FFI の相互作用",
    "ko": "안전하지 않은 Rust 프로그래밍 및 C FFI 상호 작용",
    "zh": "不安全的 Rust 编程和 C FFI 交互",
    "fr": "Programmation Rust dangereuse et interaction C FFI",
    "de": "Unsichere Rust-Programmierung und C-FFI-Interaktion",
    "es": "Programación insegura de Rust e interacción C FFI"
  },
  "unsafe-rust-c-ffi-interoperability": {
    "vi": "Lập trình Unsafe Rust & Tương tác C FFI",
    "en": "Unsafe Rust & C FFI Interoperability",
    "ja": "Unsafe RustとC FFI相互運用",
    "ko": "Unsafe Rust 및 C FFI 상호 운용",
    "zh": "Unsafe Rust与C FFI互操作",
    "fr": "Rust non sécurisé (Unsafe) et FFI C",
    "de": "Unsafe Rust & C-FFI-Interoperabilität",
    "es": "Rust no seguro (Unsafe) e interoperabilidad C FFI"
  },
  "kieu-du-lieu-constraints": {
    "vi": "Kiểu dữ liệu & Constraints",
    "en": "Data Types & Constraints",
    "ja": "データ型と制約",
    "ko": "데이터 유형 및 제약 조건",
    "zh": "数据类型和约束",
    "fr": "Types de données et contraintes",
    "de": "Datentypen und Einschränkungen",
    "es": "Tipos de datos y restricciones"
  },
  "data-types-constraints": {
    "vi": "Kiểu dữ liệu & Constraints",
    "en": "Data Types & Constraints",
    "ja": "データ型と制約",
    "ko": "데이터 유형 및 제약 조건",
    "zh": "数据类型和约束",
    "fr": "Types de données et contraintes",
    "de": "Datentypen und Einschränkungen",
    "es": "Tipos de datos y restricciones"
  },
  "cu-phap-swift-co-che-optionals": {
    "vi": "Cú pháp Swift & Cơ chế Optionals",
    "en": "Swift Syntax & Optionals Mechanism",
    "ja": "Swift 構文とオプションのメカニズム",
    "ko": "Swift 구문 및 옵션 메커니즘",
    "zh": "Swift 语法和可选机制",
    "fr": "Syntaxe Swift et mécanisme d'options",
    "de": "Swift-Syntax und optionaler Mechanismus",
    "es": "Sintaxis rápida y mecanismo opcional"
  },
  "swift-syntax-optionals-mechanism": {
    "vi": "Cú pháp Swift & Cơ chế Optionals",
    "en": "Swift Syntax & Optionals Mechanism",
    "ja": "Swift 構文とオプションのメカニズム",
    "ko": "Swift 구문 및 옵션 메커니즘",
    "zh": "Swift 语法和可选机制",
    "fr": "Syntaxe Swift et mécanisme d'options",
    "de": "Swift-Syntax und optionaler Mechanismus",
    "es": "Sintaxis rápida y mecanismo opcional"
  },
  "ham-closures-giao-thuc-protocols": {
    "vi": "Hàm, Closures & Giao thức Protocols",
    "en": "Functions, Closures & Protocols",
    "ja": "関数、クロージャ、プロトコル",
    "ko": "기능, 클로저 및 프로토콜",
    "zh": "函数、闭包和协议",
    "fr": "Fonctions, fermetures et protocoles",
    "de": "Funktionen, Abschlüsse und Protokolle",
    "es": "Funciones, Cierres y Protocolos"
  },
  "functions-closures-protocols": {
    "vi": "Hàm, Closures & Giao thức Protocols",
    "en": "Functions, Closures & Protocols",
    "ja": "関数、クロージャ、プロトコル",
    "ko": "기능, 클로저 및 프로토콜",
    "zh": "函数、闭包和协议",
    "fr": "Fonctions, fermetures et protocoles",
    "de": "Funktionen, Abschlüsse und Protokolle",
    "es": "Funciones, Cierres y Protocolos"
  },
  "collections-co-che-xu-ly-loi-trong-swift": {
    "vi": "Collections & Cơ chế xử lý lỗi trong Swift",
    "en": "Collections & Error Handling Mechanism in Swift",
    "ja": "Swift のコレクションとエラー処理メカニズム",
    "ko": "Swift의 컬렉션 및 오류 처리 메커니즘",
    "zh": "Swift 中的集合和错误处理机制",
    "fr": "Collections et mécanisme de gestion des erreurs dans Swift",
    "de": "Sammlungen und Fehlerbehandlungsmechanismus in Swift",
    "es": "Mecanismo de manejo de errores y colecciones en Swift"
  },
  "collections-error-handling-in-swift": {
    "vi": "Collections & Cơ chế xử lý lỗi trong Swift",
    "en": "Collections & Error Handling in Swift",
    "ja": "Swiftのコレクションとエラー処理",
    "ko": "Swift의 컬렉션 및 오류 처리",
    "zh": "Swift中的集合与错误处理",
    "fr": "Collections et gestion des erreurs en Swift",
    "de": "Sammlungen & Fehlerbehandlung in Swift",
    "es": "Colecciones y manejo de errores en Swift"
  },
  "nen-tang-giao-dien-khai-bao-swiftui": {
    "vi": "Nền tảng giao diện khai báo SwiftUI",
    "en": "SwiftUI declarative interface platform",
    "ja": "SwiftUI 宣言型インターフェイス プラットフォーム",
    "ko": "SwiftUI 선언적 인터페이스 플랫폼",
    "zh": "SwiftUI 声明式接口平台",
    "fr": "Plateforme d'interface déclarative SwiftUI",
    "de": "Deklarative Schnittstellenplattform SwiftUI",
    "es": "Plataforma de interfaz declarativa SwiftUI"
  },
  "declarative-ui-foundations-with-swiftui": {
    "vi": "Nền tảng giao diện khai báo SwiftUI",
    "en": "Declarative UI Foundations with SwiftUI",
    "ja": "SwiftUIによる宣言的UIの基礎",
    "ko": "SwiftUI 선언형 UI 기초",
    "zh": "SwiftUI声明式UI基础",
    "fr": "Bases de l'interface déclarative avec SwiftUI",
    "de": "Deklarative UI-Grundlagen mit SwiftUI",
    "es": "Fundamentos de interfaz declarativa con SwiftUI"
  },
  "kien-truc-ung-dung-mo-hinh-mvvm-navigation": {
    "vi": "Kiến trúc ứng dụng: Mô hình MVVM & Navigation",
    "en": "Application Architecture: MVVM & Navigation Model",
    "ja": "アプリケーション アーキテクチャ: MVVM とナビゲーション モデル",
    "ko": "애플리케이션 아키텍처: MVVM 및 탐색 모델",
    "zh": "应用架构：MVVM 和导航模型",
    "fr": "Architecture d'application : MVVM et modèle de navigation",
    "de": "Anwendungsarchitektur: MVVM und Navigationsmodell",
    "es": "Arquitectura de aplicaciones: MVVM y modelo de navegación"
  },
  "app-architecture-mvvm-navigation": {
    "vi": "Kiến trúc ứng dụng: Mô hình MVVM & Navigation",
    "en": "App Architecture: MVVM & Navigation",
    "ja": "アプリ設計：MVVMパターンとナビゲーション",
    "ko": "앱 아키텍처: MVVM 패턴 및 내비게이션",
    "zh": "应用架构：MVVM模式与导航",
    "fr": "Architecture d'application : MVVM et navigation",
    "de": "App-Architektur: MVVM-Muster & Navigation",
    "es": "Arquitectura de aplicaciones: MVVM y navegación"
  },
  "luu-tru-du-lieu-ben-vung-voi-swiftdata-core-data": {
    "vi": "Lưu trữ dữ liệu bền vững với SwiftData & Core Data",
    "en": "Persistent data storage with SwiftData & Core Data",
    "ja": "SwiftData と Core Data による永続的なデータ ストレージ",
    "ko": "SwiftData 및 Core Data를 사용한 영구 데이터 저장",
    "zh": "使用 SwiftData 和 Core Data 进行持久数据存储",
    "fr": "Stockage de données persistant avec SwiftData & Core Data",
    "de": "Permanente Datenspeicherung mit SwiftData & Core Data",
    "es": "Almacenamiento de datos persistente con SwiftData y Core Data"
  },
  "persistent-storage-with-swiftdata-core-data": {
    "vi": "Lưu trữ dữ liệu bền vững với SwiftData & Core Data",
    "en": "Persistent Storage with SwiftData & Core Data",
    "ja": "SwiftDataとCore Dataによる永続データ保存",
    "ko": "SwiftData 및 Core Data를 활용한 데이터 영속성",
    "zh": "使用SwiftData与Core Data进行数据持久化",
    "fr": "Stockage persistant avec SwiftData et Core Data",
    "de": "Dauerhafte Datenspeicherung mit SwiftData & Core Data",
    "es": "Almacenamiento persistente con SwiftData y Core Data"
  },
  "mau-thiet-ke-swiftui-nang-cao-animations-gestures": {
    "vi": "Mẫu thiết kế SwiftUI nâng cao, Animations & Gestures",
    "en": "Advanced SwiftUI Design Patterns, Animations & Gestures",
    "ja": "高度な SwiftUI デザイン パターン、アニメーション、ジェスチャー",
    "ko": "고급 SwiftUI 디자인 패턴, 애니메이션 및 제스처",
    "zh": "高级 SwiftUI 设计模式、动画和手势",
    "fr": "Modèles de conception, animations et gestes SwiftUI avancés",
    "de": "Erweiterte SwiftUI-Designmuster, Animationen und Gesten",
    "es": "Patrones de diseño, animaciones y gestos avanzados de SwiftUI"
  },
  "advanced-swiftui-patterns-animations-gestures": {
    "vi": "Mẫu thiết kế SwiftUI nâng cao, Animations & Gestures",
    "en": "Advanced SwiftUI Patterns, Animations & Gestures",
    "ja": "高度なSwiftUIパターン、アニメーション、ジェスチャー",
    "ko": "고급 SwiftUI 디자인 패턴, 애니메이션 및 제스처",
    "zh": "高级SwiftUI设计模式、动画与手势",
    "fr": "Modèles SwiftUI avancés, animations et gestes",
    "de": "Fortgeschrittene SwiftUI-Muster, Animationen & Gesten",
    "es": "Patrones avanzados de SwiftUI, animaciones y gestos"
  },
  "ket-noi-mang-tich-hop-rest-api-voi-urlsession": {
    "vi": "Kết nối mạng & Tích hợp REST API với URLSession",
    "en": "Networking & REST API Integration with URLSession",
    "ja": "ネットワーキングと REST API の URLSession との統合",
    "ko": "URLSession과 네트워킹 및 REST API 통합",
    "zh": "网络和 REST API 与 URLSession 集成",
    "fr": "Intégration de la mise en réseau et de l'API REST avec URLSession",
    "de": "Netzwerk- und REST-API-Integration mit URLSession",
    "es": "Integración de redes y API REST con URLSession"
  },
  "networking-rest-api-integration-with-urlsession": {
    "vi": "Kết nối mạng & Tích hợp REST API với URLSession",
    "en": "Networking & REST API Integration with URLSession",
    "ja": "ネットワーキングと REST API の URLSession との統合",
    "ko": "URLSession과 네트워킹 및 REST API 통합",
    "zh": "网络和 REST API 与 URLSession 集成",
    "fr": "Intégration de la mise en réseau et de l'API REST avec URLSession",
    "de": "Netzwerk- und REST-API-Integration mit URLSession",
    "es": "Integración de redes y API REST con URLSession"
  },
  "do-kiem-hieu-nang-voi-instruments-kiem-thu-xctest": {
    "vi": "Đo kiểm hiệu năng với Instruments & Kiểm thử XCTest",
    "en": "Test performance with Instruments & XCTest Testing",
    "ja": "Instruments と XCTest テストによるパフォーマンスのテスト",
    "ko": "계측기 및 XCTest 테스트를 통한 테스트 성능",
    "zh": "使用 Instruments 和 XCTest 测试测试性能",
    "fr": "Testez les performances avec Instruments et XCTest Testing",
    "de": "Testen Sie die Leistung mit Instruments & XCTest Testing",
    "es": "Pruebe el rendimiento con instrumentos y pruebas XCTest"
  },
  "performance-profiling-with-instruments-xctest": {
    "vi": "Đo kiểm hiệu năng với Instruments & Kiểm thử XCTest",
    "en": "Performance Profiling with Instruments & XCTest",
    "ja": "InstrumentsによるプロファイリングとXCTest",
    "ko": "Instruments를 활용한 성능 프로파일링 및 XCTest",
    "zh": "使用Instruments进行性能分析与XCTest",
    "fr": "Profilage des performances avec Instruments et XCTest",
    "de": "Leistungsprofilierung mit Instruments & XCTest",
    "es": "Perfilado de rendimiento con Instruments y XCTest"
  },
  "dong-goi-frameworks-cicd-xcode-cloud-kien-truc-tca": {
    "vi": "Đóng gói Frameworks, CI/CD Xcode Cloud & Kiến trúc TCA",
    "en": "Framework Packaging, Xcode Cloud CI/CD & TCA"
  },
  "framework-packaging-xcode-cloud-cicd-tca": {
    "vi": "Đóng gói Frameworks, CI/CD Xcode Cloud & Kiến trúc TCA",
    "en": "Framework Packaging, Xcode Cloud CI/CD & TCA"
  },
  "functions-generics-co-ban": {
    "vi": "Hàm & Generics cơ bản trong TypeScript",
    "en": "Functions & Generics cơ bản"
  },
  "functions-basic-generics": {
    "vi": "Functions & Generics cơ bản",
    "en": "Functions & Basic Generics",
    "ja": "関数と基本ジェネリクス",
    "ko": "함수 및 기본 제네릭",
    "zh": "函数与基础泛型",
    "fr": "Fonctions et génériques de base",
    "de": "Funktionen & Basis-Generics",
    "es": "Funciones y genéricos básicos"
  },
  "mau-thiet-ke-react-nang-cao-toi-uu-hieu-nang": {
    "vi": "Mẫu thiết kế React nâng cao & Tối ưu hiệu năng",
    "en": "Advanced React Design Patterns & Performance Optimization",
    "ja": "高度な React 設計パターンとパフォーマンスの最適化",
    "ko": "고급 React 디자인 패턴 및 성능 최적화",
    "zh": "高级 React 设计模式和性能优化",
    "fr": "Modèles de conception React avancés et optimisation des performances",
    "de": "Erweiterte React-Designmuster und Leistungsoptimierung",
    "es": "Patrones de diseño avanzados de React y optimización del rendimiento"
  },
  "advanced-react-design-patterns-performance": {
    "vi": "Mẫu thiết kế React nâng cao & Tối ưu hiệu năng",
    "en": "Advanced React Design Patterns & Performance",
    "ja": "高度なReactデザインパターンとパフォーマンス最適化",
    "ko": "고급 React 디자인 패턴 및 성능 최적화",
    "zh": "高级React设计模式与性能优化",
    "fr": "Modèles de conception React avancés et performances",
    "de": "Fortgeschrittene React-Entwurfsmuster & Leistung",
    "es": "Patrones de diseño avanzados de React y rendimiento"
  },
  "cu-phap-python-co-ban": {
    "vi": "Cú pháp Python cơ bản",
    "en": "Cú pháp Python cơ bản"
  },
  "python-syntax-fundamentals": {
    "vi": "Cú pháp Python cơ bản",
    "en": "Python Syntax Fundamentals",
    "ja": "Python基本構文",
    "ko": "Python 기본 구문",
    "zh": "Python基本语法",
    "fr": "Bases de la syntaxe Python",
    "de": "Python-Syntax-Grundlagen",
    "es": "Fundamentos de sintaxis Python"
  },
  "jsx-components-dau-tien": {
    "vi": "JSX & Components đầu tiên",
    "en": "JSX & Components đầu tiên"
  },
  "first-jsx-components": {
    "vi": "JSX & Components đầu tiên",
    "en": "First JSX & Components",
    "ja": "最初のJSXとコンポーネント",
    "ko": "첫 번째 JSX 및 컴포넌트",
    "zh": "首个JSX与组件",
    "fr": "Premier JSX et composants",
    "de": "Erstes JSX & Komponenten",
    "es": "Primeros JSX y componentes"
  },
  "sql-crud-co-ban": {
    "vi": "SQL CRUD cơ bản",
    "en": "SQL CRUD cơ bản"
  },
  "basic-sql-crud-operations": {
    "vi": "SQL CRUD cơ bản",
    "en": "Basic SQL CRUD Operations",
    "ja": "基本SQL CRUD操作",
    "ko": "기본 SQL CRUD 작업",
    "zh": "基础SQL CRUD操作",
    "fr": "Opérations SQL CRUD de base",
    "de": "Grundlegende SQL-CRUD-Operationen",
    "es": "Operaciones CRUD básicas de SQL"
  },
  "hello-world-cai-dat": {
    "vi": "Hello World & Cài đặt",
    "en": "Hello World & Setup",
    "ja": "Hello Worldと環境構築",
    "ko": "Hello World 및 환경 설정",
    "zh": "Hello World与环境搭建",
    "fr": "Hello World et installation",
    "de": "Hello World und Einrichtung",
    "es": "Hello World e instalación"
  },
  "bien-kieu-du-lieu": {
    "vi": "Biến & Kiểu dữ liệu",
    "en": "Variables & Data Types",
    "ja": "変数とデータ型",
    "ko": "변수 및 데이터 유형",
    "zh": "变量和数据类型",
    "fr": "Variables et types de données",
    "de": "Variablen und Datentypen",
    "es": "Variables y tipos de datos"
  },
  "cau-lenh-dieu-kien": {
    "vi": "Câu lệnh điều kiện",
    "en": "Conditional statement",
    "ja": "条件文",
    "ko": "조건문",
    "zh": "条件语句",
    "fr": "Instruction conditionnelle",
    "de": "Bedingte Anweisung",
    "es": "Declaración condicional"
  },
  "vong-lap-iteration": {
    "vi": "Vòng lặp & Iteration",
    "en": "Loops & Iteration",
    "ja": "ループと反復",
    "ko": "루프 및 반복",
    "zh": "循环与迭代",
    "fr": "Boucles et itération",
    "de": "Schleifen und Iteration",
    "es": "Bucles e iteración"
  },
  "ham-mang": {
    "vi": "Hàm & Mảng",
    "en": "Functions & Arrays",
    "ja": "関数と配列",
    "ko": "함수 및 배열",
    "zh": "函数和数组",
    "fr": "Fonctions et tableaux",
    "de": "Funktionen und Arrays",
    "es": "Funciones y matrices"
  },
  "lop-class-doi-tuong-object-co-ban": {
    "vi": "Lớp (Class) & Đối tượng (Object) cơ bản",
    "en": "Classes & Objects Fundamentals",
    "ja": "クラスとオブジェクトの基礎",
    "ko": "클래스 및 객체 기초",
    "zh": "类与对象基础",
    "fr": "Bases des classes et des objets",
    "de": "Grundlagen von Klassen und Objekten",
    "es": "Fundamentos de clases y objetos"
  },
  "con-tro-pointers-tham-chieu-references": {
    "vi": "Con trỏ (Pointers) & Tham chiếu (References)",
    "en": "Pointers & References",
    "ja": "ポインタと参照",
    "ko": "포인터 및 참조",
    "zh": "指针与引用",
    "fr": "Pointeurs et références",
    "de": "Zeiger und Referenzen",
    "es": "Punteros y referencias"
  },
  "ke-thua-da-hinh": {
    "vi": "Kế thừa & Đa hình",
    "en": "Kế thừa & Đa hình",
    "ja": "継承とポリモーフィズム",
    "ko": "상속과 다형성",
    "zh": "继承与多态",
    "fr": "Héritage et polymorphisme",
    "de": "Vererbung und Polymorphismus",
    "es": "Herencia y polimorfismo"
  },
  "string-xu-ly-file-i-o": {
    "vi": "String xử lý & File I/O",
    "en": "String handling & File I/O",
    "ja": "文字列処理とファイル I/O",
    "ko": "문자열 처리 및 파일 I/O",
    "zh": "字符串处理和文件 I/O",
    "fr": "Gestion des chaînes et E/S de fichiers",
    "de": "String-Verarbeitung und Datei-E/A",
    "es": "Manejo de cadenas y E/S de archivos"
  },
  "templates-lap-trinh-generic": {
    "vi": "Templates & Lập trình Generic",
    "en": "Templates & Generic Programming",
    "ja": "テンプレートと汎用プログラミング",
    "ko": "템플릿 및 일반 프로그래밍",
    "zh": "模板和通用编程",
    "fr": "Modèles et programmation générique",
    "de": "Vorlagen und generische Programmierung",
    "es": "Plantillas y programación genérica"
  },
  "con-tro-thong-minh-smart-pointers-co-che-raii": {
    "vi": "Con trỏ thông minh (Smart Pointers) & Cơ chế RAII",
    "en": "Smart Pointers & RAII Mechanism",
    "ja": "スマート ポインターと RAII メカニズム",
    "ko": "스마트 포인터 및 RAII 메커니즘",
    "zh": "智能指针和RAII机制",
    "fr": "Pointeurs intelligents et mécanisme RAII",
    "de": "Intelligente Zeiger und RAII-Mechanismus",
    "es": "Punteros inteligentes y mecanismo RAII"
  },
  "lambda-modern-c-features": {
    "vi": "Lambda & Modern C++ Features",
    "en": "Lambda & Modern C++ Features",
    "ja": "Lambda と最新の C++ 機能",
    "ko": "람다 및 최신 C++ 기능",
    "zh": "Lambda 和现代 C++ 功能",
    "fr": "Fonctionnalités Lambda et C++ moderne",
    "de": "Lambda- und moderne C++-Funktionen",
    "es": "Funciones de Lambda y C++ moderno"
  },
  "lap-trinh-da-luong-multithreading-concurrency": {
    "vi": "Lập trình đa luồng Multithreading & Concurrency",
    "en": "Multithreading & Concurrency Multithreaded Programming",
    "ja": "マルチスレッドと同時実行 マルチスレッド プログラミング",
    "ko": "멀티스레딩 및 동시성 멀티스레드 프로그래밍",
    "zh": "多线程与并发 多线程编程",
    "fr": "Programmation multithread et simultanéité",
    "de": "Multithreading und parallele Multithread-Programmierung",
    "es": "Multiproceso y concurrencia Programación multiproceso"
  },
  "design-patterns-trong-c": {
    "vi": "Design Patterns trong C++",
    "en": "Design Patterns in C++",
    "ja": "C++ でのデザインパターン",
    "ko": "C++의 디자인 패턴",
    "zh": "C++ 中的设计模式",
    "fr": "Modèles de conception en C++",
    "de": "Entwurfsmuster in C++",
    "es": "Patrones de diseño en C++"
  },
  "template-metaprogramming": {
    "vi": "Template Metaprogramming",
    "en": "Template Metaprogramming",
    "ja": "テンプレートのメタプログラミング",
    "ko": "템플릿 메타프로그래밍",
    "zh": "模板元编程",
    "fr": "Métaprogrammation de modèles",
    "de": "Vorlagen-Metaprogrammierung",
    "es": "Metaprogramación de plantillas"
  },
  "hello-world-co-ban": {
    "vi": "Hello World & Cơ bản",
    "en": "Hello World & Basics",
    "ja": "Hello World と基本",
    "ko": "Hello World 및 기본 사항",
    "zh": "你好世界和基础知识",
    "fr": "Bonjour tout le monde et les bases",
    "de": "Hallo Welt & Grundlagen",
    "es": "Hola mundo y conceptos básicos"
  },
  "collections-data-structures": {
    "vi": "Collections & Data Structures",
    "en": "Collections & Data Structures",
    "ja": "コレクションとデータ構造",
    "ko": "컬렉션 및 데이터 구조",
    "zh": "集合和数据结构",
    "fr": "Collections et structures de données",
    "de": "Collections & Data Structures",
    "es": "Colecciones y estructuras de datos"
  },
  "lap-trinh-huong-doi-tuong-oop-trong-python": {
    "vi": "Lập trình Hướng đối tượng (OOP) trong Python",
    "en": "Lập trình Hướng đối tượng (OOP) trong Python",
    "ja": "Python のオブジェクト指向プログラミング (OOP)",
    "ko": "Python의 객체 지향 프로그래밍(OOP)",
    "zh": "Python 中的面向对象编程 (OOP)",
    "fr": "Programmation orientée objet (POO) en Python",
    "de": "Objektorientierte Programmierung (OOP) in Python",
    "es": "Programación Orientada a Objetos (OOP) en Python"
  },
  "modules-packages-doc-ghi-file-i-o": {
    "vi": "Modules, Packages & Đọc ghi File I/O",
    "en": "Modules, Packages & Đọc ghi File I/O",
    "ja": "モジュール、パッケージ、ファイル I/O の読み取りと書き込み",
    "ko": "모듈, 패키지 및 파일 I/O 읽기 및 쓰기",
    "zh": "模块、包和读写文件 I/O",
    "fr": "Modules, packages et lecture et écriture d'E/S de fichiers",
    "de": "Module, Pakete und Lesen und Schreiben von Datei-I/O",
    "es": "Módulos, paquetes y lectura y escritura de archivos de E/S"
  },
  "xu-ly-loi-go-loi-try-except-debugging": {
    "vi": "Xử lý lỗi & Gỡ lỗi (Try/Except & Debugging)",
    "en": "Xử lý lỗi & Gỡ lỗi (Try/Except & Debugging)",
    "ja": "エラー処理とデバッグ (試行/例外とデバッグ)",
    "ko": "오류 처리 및 디버깅(Try/Except 및 디버깅)",
    "zh": "错误处理和调试（尝试/除外和调试）",
    "fr": "Gestion des erreurs et débogage (Essayer/Excepter et débogage)",
    "de": "Fehlerbehandlung und Debugging (Try/Except & Debugging)",
    "es": "Manejo de errores y depuración (probar/excepto y depurar)"
  },
  "decorators-closures-trong-python": {
    "vi": "Decorators & Closures trong Python",
    "en": "Decorators & Closures in Python",
    "ja": "Python のデコレータとクロージャ",
    "ko": "Python의 데코레이터 및 클로저",
    "zh": "Python 中的装饰器和闭包",
    "fr": "Décorateurs et fermetures en Python",
    "de": "Dekoratoren und Verschlüsse in Python",
    "es": "Decoradores y Cierres en Python"
  },
  "generators-iterators-voi-yield": {
    "vi": "Generators & Iterators với yield",
    "en": "Generators & Iterators with yield",
    "ja": "ジェネレーターとイテレーター (収量付き)",
    "ko": "수율이 있는 생성기 및 반복기",
    "zh": "具有产量的生成器和迭代器",
    "fr": "Générateurs et itérateurs avec rendement",
    "de": "Generatoren und Iteratoren mit Ertrag",
    "es": "Generadores e iteradores con rendimiento"
  },
  "type-hints-dataclasses-hien-dai": {
    "vi": "Type Hints & Dataclasses hiện đại",
    "en": "Modern Type Hints & Dataclasses",
    "ja": "最新の型ヒントとデータクラス",
    "ko": "최신 유형 힌트 및 데이터 클래스",
    "zh": "现代类型提示和数据类",
    "fr": "Astuces de type moderne et classes de données",
    "de": "Moderne Typhinweise und Datenklassen",
    "es": "Sugerencias de tipo moderno y clases de datos"
  },
  "lap-trinh-bat-dong-bo-async-await-concurrency": {
    "vi": "Lập trình Bất đồng bộ Async/Await & Concurrency",
    "en": "Asynchronous Programming Async/Await & Concurrency",
    "ja": "非同期プログラミング 非同期/待機と同時実行",
    "ko": "비동기 프로그래밍 비동기/대기 및 동시성",
    "zh": "异步编程异步/等待和并发",
    "fr": "Programmation asynchrone Async/Await & Concurrency",
    "de": "Asynchrone Programmierung Async/Warten und Parallelität",
    "es": "Programación asincrónica Async/Await y concurrencia"
  },
  "kiem-thu-ung-dung-voi-pytest": {
    "vi": "Kiểm thử ứng dụng với pytest",
    "en": "Test the application with pytest",
    "ja": "pytest でアプリケーションをテストする",
    "ko": "pytest로 애플리케이션 테스트",
    "zh": "使用 pytest 测试应用程序",
    "fr": "Testez l'application avec pytest",
    "de": "Testen Sie die Anwendung mit Pytest",
    "es": "Pruebe la aplicación con pytest"
  },
  "xay-dung-web-backend-voi-fastapi": {
    "vi": "Xây dựng Web Backend với FastAPI",
    "en": "Build Web Backend with FastAPI",
    "ja": "FastAPI を使用して Web バックエンドを構築する",
    "ko": "FastAPI로 웹 백엔드 구축",
    "zh": "使用 FastAPI 构建 Web 后端",
    "fr": "Créez un backend Web avec FastAPI",
    "de": "Erstellen Sie ein Web-Backend mit FastAPI",
    "es": "Cree un backend web con FastAPI"
  },
  "toi-uu-hieu-nang-cpython-internals": {
    "vi": "Tối ưu hiệu năng & CPython Internals",
    "en": "Tối ưu hiệu năng & CPython Internals",
    "ja": "パフォーマンスの最適化と CPython の内部構造",
    "ko": "성능 최적화 및 CPython 내부",
    "zh": "性能优化和 CPython 内部结构",
    "fr": "Optimisation des performances et composants internes de CPython",
    "de": "Leistungsoptimierung und CPython-Interna",
    "es": "Optimización del rendimiento y componentes internos de CPython"
  },
  "hello-world-setup": {
    "vi": "Hello World & Setup",
    "en": "Hello World & Setup",
    "ja": "ハローワールドとセットアップ",
    "ko": "Hello World 및 설정",
    "zh": "你好世界和设置",
    "fr": "Bonjour tout le monde et configuration",
    "de": "Hallo Welt & Setup",
    "es": "Hola mundo y configuración"
  },
  "oop-class-inheritance-interface": {
    "vi": "OOP: Class, Inheritance, Interface",
    "en": "OOP: Class, Inheritance, Interface",
    "ja": "OOP: クラス、継承、インターフェイス",
    "ko": "OOP: 클래스, 상속, 인터페이스",
    "zh": "OOP：类、继承、接口",
    "fr": "POO : classe, héritage, interface",
    "de": "OOP: Klasse, Vererbung, Schnittstelle",
    "es": "POO: clase, herencia, interfaz"
  },
  "design-patterns-trong-java": {
    "vi": "Design Patterns trong Java",
    "en": "Design Patterns trong Java",
    "ja": "Java のデザインパターン",
    "ko": "Java의 디자인 패턴",
    "zh": "Java 中的设计模式",
    "fr": "Modèles de conception en Java",
    "de": "Entwurfsmuster in Java",
    "es": "Patrones de diseño en Java"
  },
  "concurrency-multithreading": {
    "vi": "Concurrency & Multithreading",
    "en": "Concurrency & Multithreading",
    "ja": "同時実行性とマルチスレッド化",
    "ko": "동시성 및 멀티스레딩",
    "zh": "并发和多线程",
    "fr": "Concurrence et multithreading",
    "de": "Parallelität und Multithreading",
    "es": "Concurrencia y subprocesos múltiples"
  },
  "jpa-database-access": {
    "vi": "JPA & Database Access",
    "en": "JPA & Database Access",
    "ja": "JPAとデータベースアクセス",
    "ko": "JPA 및 데이터베이스 액세스",
    "zh": "JPA 和数据库访问",
    "fr": "JPA et accès aux bases de données",
    "de": "JPA- und Datenbankzugriff",
    "es": "JPA y acceso a bases de datos"
  },
  "spring-boot-rest-api": {
    "vi": "Spring Boot REST API",
    "en": "Spring Boot REST API",
    "ja": "Spring Boot REST API",
    "ko": "스프링 부트 REST API",
    "zh": "Spring Boot REST API",
    "fr": "API REST Spring Boot",
    "de": "Spring Boot REST-API",
    "es": "API REST de arranque de primavera"
  },
  "security-authentication": {
    "vi": "Security & Authentication",
    "en": "Security & Authentication",
    "ja": "セキュリティと認証",
    "ko": "보안 및 인증",
    "zh": "安全与认证",
    "fr": "Sécurité et authentification",
    "de": "Sicherheit und Authentifizierung",
    "es": "Seguridad y autenticación"
  },
  "testing-clean-architecture": {
    "vi": "Testing & Clean Architecture",
    "en": "Testing & Clean Architecture",
    "ja": "テストとクリーンなアーキテクチャ",
    "ko": "테스트 및 클린 아키텍처",
    "zh": "测试和清洁架构",
    "fr": "Tests et architecture propre",
    "de": "Testen und saubere Architektur",
    "es": "Pruebas y arquitectura limpia"
  },
  "modern-java-17-21-features": {
    "vi": "Modern Java 17-21 Features",
    "en": "Modern Java 17-21 Features",
    "ja": "最新の Java 17-21 の機能",
    "ko": "최신 Java 17-21 기능",
    "zh": "现代 Java 17-21 功能",
    "fr": "Fonctionnalités modernes de Java 17-21",
    "de": "Moderne Java 17-21-Funktionen",
    "es": "Características modernas de Java 17-21"
  },
  "node-js-npm-basics": {
    "vi": "Node.js & npm Basics",
    "en": "Node.js & npm Basics",
    "ja": "Node.js と npm の基本",
    "ko": "Node.js 및 npm 기본 사항",
    "zh": "Node.js 和 npm 基础知识",
    "fr": "Bases de Node.js et npm",
    "de": "Node.js- und npm-Grundlagen",
    "es": "Conceptos básicos de Node.js y npm"
  },
  "file-system-async-patterns": {
    "vi": "File System & Async Patterns",
    "en": "File System & Async Patterns",
    "ja": "ファイル システムと非同期パターン",
    "ko": "파일 시스템 및 비동기 패턴",
    "zh": "文件系统和异步模式",
    "fr": "Système de fichiers et modèles asynchrones",
    "de": "Dateisystem und asynchrone Muster",
    "es": "Sistema de archivos y patrones asíncronos"
  },
  "http-server-co-ban": {
    "vi": "HTTP Server cơ bản",
    "en": "HTTP Server cơ bản",
    "ja": "基本的なHTTPサーバー",
    "ko": "기본 HTTP 서버",
    "zh": "基本 HTTP 服务器",
    "fr": "Serveur HTTP de base",
    "de": "Grundlegender HTTP-Server",
    "es": "Servidor HTTP básico"
  },
  "express-js-framework": {
    "vi": "Express.js Framework",
    "en": "Express.js Framework",
    "ja": "Express.js フレームワーク",
    "ko": "Express.js 프레임워크",
    "zh": "Express.js 框架",
    "fr": "Cadre Express.js",
    "de": "Express.js-Framework",
    "es": "Marco Express.js"
  },
  "database-prisma-orm": {
    "vi": "Database: Prisma ORM",
    "en": "Database: Prisma ORM",
    "ja": "データベース: プリズマ ORM",
    "ko": "데이터베이스: 프리즈마 ORM",
    "zh": "数据库：Prisma ORM",
    "fr": "Base de données : Prisma ORM",
    "de": "Datenbank: Prisma ORM",
    "es": "Base de datos: Prisma ORM"
  },
  "testing-node-js-apps": {
    "vi": "Testing Node.js Apps",
    "en": "Testing Node.js Apps",
    "ja": "Node.js アプリのテスト",
    "ko": "Node.js 앱 테스트",
    "zh": "测试 Node.js 应用程序",
    "fr": "Test des applications Node.js",
    "de": "Testen von Node.js-Apps",
    "es": "Prueba de aplicaciones Node.js"
  },
  "clean-architecture-error-handling": {
    "vi": "Clean Architecture & Error Handling",
    "en": "Clean Architecture & Error Handling",
    "ja": "クリーンなアーキテクチャとエラー処理",
    "ko": "깔끔한 아키텍처 및 오류 처리",
    "zh": "简洁的架构和错误处理",
    "fr": "Architecture propre et gestion des erreurs",
    "de": "Saubere Architektur und Fehlerbehandlung",
    "es": "Arquitectura limpia y manejo de errores"
  },
  "real-time-websocket-socket-io": {
    "vi": "Real-time: WebSocket & Socket.io",
    "en": "Real-time: WebSocket & Socket.io",
    "ja": "リアルタイム: WebSocket および Socket.io",
    "ko": "실시간: WebSocket 및 Socket.io",
    "zh": "实时：WebSocket 和 Socket.io",
    "fr": "En temps réel : WebSocket et Socket.io",
    "de": "Echtzeit: WebSocket & Socket.io",
    "es": "Tiempo real: WebSocket y Socket.io"
  },
  "microservices-architecture": {
    "vi": "Microservices Architecture",
    "en": "Microservices Architecture",
    "ja": "マイクロサービスアーキテクチャ",
    "ko": "마이크로서비스 아키텍처",
    "zh": "微服务架构",
    "fr": "Architecture des microservices",
    "de": "Microservices-Architektur",
    "es": "Arquitectura de microservicios"
  },
  "performance-scaling": {
    "vi": "Performance & Scaling",
    "en": "Performance & Scaling",
    "ja": "パフォーマンスとスケーリング",
    "ko": "성능 및 확장",
    "zh": "性能和扩展",
    "fr": "Performances et mise à l'échelle",
    "de": "Leistung und Skalierung",
    "es": "Rendimiento y escalamiento"
  },
  "event-loop-v8-internals": {
    "vi": "Event Loop & V8 Internals",
    "en": "Event Loop & V8 Internals",
    "ja": "イベントループとV8の内部構造",
    "ko": "이벤트 루프 및 V8 내부",
    "zh": "事件循环和 V8 内部结构",
    "fr": "Boucle d'événement et composants internes du V8",
    "de": "Ereignisschleife und V8-Interna",
    "es": "Bucle de eventos y componentes internos de V8"
  },
  "system-design-voi-node-js": {
    "vi": "System Design với Node.js",
    "en": "System Design with Node.js",
    "ja": "Node.jsによるシステム設計",
    "ko": "Node.js를 사용한 시스템 설계",
    "zh": "使用 Node.js 进行系统设计",
    "fr": "Conception de système avec Node.js",
    "de": "Systemdesign mit Node.js",
    "es": "Diseño de sistemas con Node.js"
  },
  "jsx-components-co-ban": {
    "vi": "JSX & Components cơ bản",
    "en": "Basic JSX & Components",
    "ja": "基本的な JSX とコンポーネント",
    "ko": "기본 JSX 및 구성 요소",
    "zh": "基本 JSX 和组件",
    "fr": "JSX et composants de base",
    "de": "Grundlegende JSX und Komponenten",
    "es": "JSX básico y componentes"
  },
  "props-events-conditional-rendering": {
    "vi": "Props, Events & Conditional Rendering",
    "en": "Props, Events & Conditional Rendering",
    "ja": "プロップ、イベント、条件付きレンダリング",
    "ko": "소품, 이벤트 및 조건부 렌더링",
    "zh": "道具、事件和条件渲染",
    "fr": "Accessoires, événements et rendu conditionnel",
    "de": "Requisiten, Ereignisse und bedingtes Rendering",
    "es": "Accesorios, eventos y renderizado condicional"
  },
  "lists-keys-children-pattern": {
    "vi": "Lists, Keys & Children Pattern",
    "en": "Lists, Keys & Children Pattern",
    "ja": "リスト、キー、子のパターン",
    "ko": "목록, 키 및 하위 패턴",
    "zh": "列表、键和子模式",
    "fr": "Listes, clés et modèles d'enfants",
    "de": "Muster für Listen, Schlüssel und Kinder",
    "es": "Patrón de listas, claves y niños"
  },
  "usestate-useeffect": {
    "vi": "useState & useEffect",
    "en": "useState & useEffect",
    "ja": "useState と useEffect",
    "ko": "useState 및 useEffect",
    "zh": "使用状态和使用效果",
    "fr": "useState et useEffect",
    "de": "useState & useEffect",
    "es": "useState y useEffect"
  },
  "forms-controlled-components": {
    "vi": "Forms & Controlled Components",
    "en": "Forms & Controlled Components",
    "ja": "フォームと制御コンポーネント",
    "ko": "양식 및 제어 구성 요소",
    "zh": "表格和受控组件",
    "fr": "Formulaires et composants contrôlés",
    "de": "Formulare und kontrollierte Komponenten",
    "es": "Formularios y componentes controlados"
  },
  "react-router-navigation": {
    "vi": "React Router & Navigation",
    "en": "React Router & Navigation",
    "ja": "Reactルーターとナビゲーション",
    "ko": "반응 라우터 및 탐색",
    "zh": "React 路由器和导航",
    "fr": "Réagir au routeur et à la navigation",
    "de": "Reagieren Sie auf Router und Navigation",
    "es": "Reaccionar enrutador y navegación"
  },
  "custom-hooks": {
    "vi": "Custom Hooks",
    "en": "Custom Hooks",
    "ja": "カスタムフック",
    "ko": "맞춤형 후크",
    "zh": "定制挂钩",
    "fr": "Crochets personnalisés",
    "de": "Benutzerdefinierte Haken",
    "es": "Ganchos personalizados"
  },
  "context-api-state-management": {
    "vi": "Context API & State Management",
    "en": "Context API & State Management",
    "ja": "コンテキスト API と状態管理",
    "ko": "컨텍스트 API 및 상태 관리",
    "zh": "上下文 API 和状态管理",
    "fr": "API de contexte et gestion des états",
    "de": "Kontext-API und Statusverwaltung",
    "es": "API de contexto y gestión de estado"
  },
  "toi-uu-hoa-hieu-nang-bo-nho-span-memory": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ Span/Memory",
    "en": "Performance & Span/Memory Optimization",
    "ja": "パフォーマンスとスパン/メモリの最適化",
    "ko": "성능 및 범위/메모리 최적화",
    "zh": "性能和跨度/内存优化",
    "fr": "Optimisation des performances et de l'étendue/de la mémoire",
    "de": "Leistungs- und Spannen-/Speicheroptimierung",
    "es": "Optimización de rendimiento y amplitud/memoria"
  },
  "advanced-patterns-architecture": {
    "vi": "Advanced Patterns & Architecture",
    "en": "Advanced Patterns & Architecture",
    "ja": "高度なパターンとアーキテクチャ",
    "ko": "고급 패턴 및 아키텍처",
    "zh": "高级模式和架构",
    "fr": "Modèles et architecture avancés",
    "de": "Erweiterte Muster und Architektur",
    "es": "Patrones y arquitectura avanzados"
  },
  "next-js-server-components": {
    "vi": "Next.js & Server Components",
    "en": "Next.js & Server Components",
    "ja": "Next.js とサーバー コンポーネント",
    "ko": "Next.js 및 서버 구성요소",
    "zh": "Next.js 和服务器组件",
    "fr": "Next.js et composants du serveur",
    "de": "Next.js und Serverkomponenten",
    "es": "Next.js y componentes del servidor"
  },
  "react-fiber-reconciliation": {
    "vi": "React Fiber & Reconciliation",
    "en": "React Fiber & Reconciliation",
    "ja": "React ファイバーと調整",
    "ko": "React Fiber 및 화해",
    "zh": "反应纤维与调和",
    "fr": "Réagir à la fibre et à la réconciliation",
    "de": "React Fiber & Reconciliation",
    "es": "React Fibra y Reconciliación"
  },
  "react-19-future": {
    "vi": "React 19 & Future",
    "en": "React 19 & Future",
    "ja": "React 19 と将来",
    "ko": "리액트 19와 미래",
    "zh": "React 19 及未来",
    "fr": "Réagir 19 et avenir",
    "de": "Reagieren Sie 19 und Zukunft",
    "es": "Reaccionar 19 y futuro"
  },
  "html5-semantic-structure": {
    "vi": "HTML5 Semantic & Structure",
    "en": "HTML5 Semantic & Structure",
    "ja": "HTML5 のセマンティックと構造",
    "ko": "HTML5 의미 및 구조",
    "zh": "HTML5 语义和结构",
    "fr": "Sémantique et structure HTML5",
    "de": "HTML5-Semantik und -Struktur",
    "es": "Semántica y estructura de HTML5"
  },
  "css-selectors-box-model": {
    "vi": "CSS Selectors & Box Model",
    "en": "CSS Selectors & Box Model",
    "ja": "CSS セレクターとボックス モデル",
    "ko": "CSS 선택기 및 상자 모델",
    "zh": "CSS 选择器和盒子模型",
    "fr": "Sélecteurs CSS et modèle de boîte",
    "de": "CSS-Selektoren und Box-Modell",
    "es": "Selectores CSS y modelo de caja"
  },
  "typography-colors-units": {
    "vi": "Typography, Colors & Units",
    "en": "Typography, Colors & Units",
    "ja": "タイポグラフィー、色、単位",
    "ko": "타이포그래피, 색상 및 단위",
    "zh": "版式、颜色和单位",
    "fr": "Typographie, couleurs et unités",
    "de": "Typografie, Farben und Einheiten",
    "es": "Tipografía, Colores y Unidades"
  },
  "flexbox-layout": {
    "vi": "Flexbox Layout",
    "en": "Flexbox Layout",
    "ja": "フレックスボックスのレイアウト",
    "ko": "Flexbox 레이아웃",
    "zh": "弹性盒布局",
    "fr": "Disposition de la boîte flexible",
    "de": "Flexbox-Layout",
    "es": "Diseño de caja flexible"
  },
  "css-grid-layout": {
    "vi": "CSS Grid Layout",
    "en": "CSS Grid Layout",
    "ja": "CSS グリッド レイアウト",
    "ko": "CSS 그리드 레이아웃",
    "zh": "CSS 网格布局",
    "fr": "Disposition de la grille CSS",
    "de": "CSS-Rasterlayout",
    "es": "Diseño de cuadrícula CSS"
  },
  "responsive-design-media-queries": {
    "vi": "Responsive Design & Media Queries",
    "en": "Responsive Design & Media Queries",
    "ja": "レスポンシブデザインとメディアクエリ",
    "ko": "반응형 디자인 및 미디어 쿼리",
    "zh": "响应式设计和媒体查询",
    "fr": "Conception réactive et requêtes multimédias",
    "de": "Responsive Design und Medienabfragen",
    "es": "Diseño responsivo y consultas de medios"
  },
  "transitions-animations": {
    "vi": "Transitions & Animations",
    "en": "Transitions & Animations",
    "ja": "トランジションとアニメーション",
    "ko": "전환 및 애니메이션",
    "zh": "转场和动画",
    "fr": "Transitions et animations",
    "de": "Übergänge und Animationen",
    "es": "Transiciones y animaciones"
  },
  "modern-css-has-nesting-layers": {
    "vi": "Modern CSS: has(), nesting, layers",
    "en": "Modern CSS: has(), nesting, layers",
    "ja": "最新の CSS: has()、ネスト、レイヤー",
    "ko": "최신 CSS: has(), 중첩, 레이어",
    "zh": "现代 CSS：has()、嵌套、图层",
    "fr": "CSS moderne : has(), imbrication, couches",
    "de": "Modernes CSS: has(), Nesting, Layers",
    "es": "CSS moderno: has(), anidamiento, capas"
  },
  "accessibility-a11y": {
    "vi": "Accessibility (a11y)",
    "en": "Accessibility (a11y)",
    "ja": "アクセシビリティ (a11y)",
    "ko": "접근성(a11y)",
    "zh": "辅助功能 (a11y)",
    "fr": "Accessibilité (a11y)",
    "de": "Barrierefreiheit (a11y)",
    "es": "Accesibilidad (a11 años)"
  },
  "css-architecture-methodology": {
    "vi": "CSS Architecture & Methodology",
    "en": "CSS Architecture & Methodology",
    "ja": "CSS のアーキテクチャと方法論",
    "ko": "CSS 아키텍처 및 방법론",
    "zh": "CSS 架构和方法论",
    "fr": "Architecture et méthodologie CSS",
    "de": "CSS-Architektur und -Methodik",
    "es": "Arquitectura y metodología CSS"
  },
  "building-design-systems": {
    "vi": "Building Design Systems",
    "en": "Building Design Systems",
    "ja": "建築設計システム",
    "ko": "빌딩 설계 시스템",
    "zh": "建筑设计系统",
    "fr": "Systèmes de conception de bâtiments",
    "de": "Gebäudedesignsysteme",
    "es": "Sistemas de diseño de edificios"
  },
  "advanced-css-techniques": {
    "vi": "Advanced CSS Techniques",
    "en": "Advanced CSS Techniques",
    "ja": "高度な CSS テクニック",
    "ko": "고급 CSS 기술",
    "zh": "高级 CSS 技术",
    "fr": "Techniques CSS avancées",
    "de": "Fortgeschrittene CSS-Techniken",
    "es": "Técnicas CSS avanzadas"
  },
  "css-houdini-paint-api": {
    "vi": "CSS Houdini & Paint API",
    "en": "CSS Houdini & Paint API",
    "ja": "CSS Houdini とペイント API",
    "ko": "CSS Houdini 및 페인트 API",
    "zh": "CSS Houdini 和 Paint API",
    "fr": "API CSS Houdini et Paint",
    "de": "CSS Houdini & Paint API",
    "es": "CSS Houdini y API de pintura"
  },
  "select-insert-update-delete": {
    "vi": "SELECT, INSERT, UPDATE, DELETE",
    "en": "SELECT, INSERT, UPDATE, DELETE",
    "ja": "選択、挿入、更新、削除",
    "ko": "선택, 삽입, 업데이트, 삭제",
    "zh": "选择、插入、更新、删除",
    "fr": "SÉLECTIONNER, INSÉRER, METTRE À JOUR, SUPPRIMER",
    "de": "AUSWÄHLEN, EINFÜGEN, AKTUALISIEREN, LÖSCHEN",
    "es": "SELECCIONAR, INSERTAR, ACTUALIZAR, BORRAR"
  },
  "where-operators-functions": {
    "vi": "WHERE, Operators & Functions",
    "en": "WHERE, Operators & Functions",
    "ja": "WHERE、演算子、関数",
    "ko": "WHERE, 연산자 및 함수",
    "zh": "WHERE、运算符和函数",
    "fr": "OÙ, Opérateurs et fonctions",
    "de": "WO, Operatoren und Funktionen",
    "es": "DÓNDE, Operadores y Funciones"
  },
  "joins-relationships": {
    "vi": "JOINs & Relationships",
    "en": "JOINs & Relationships",
    "ja": "JOIN と関係",
    "ko": "조인 및 관계",
    "zh": "连接和关系",
    "fr": "REJOIGNEMENTS et relations",
    "de": "JOINs & Beziehungen",
    "es": "UNIONES y relaciones"
  },
  "subqueries-ctes": {
    "vi": "Subqueries & CTEs",
    "en": "Subqueries & CTEs",
    "ja": "サブクエリと CTE",
    "ko": "하위 쿼리 및 CTE",
    "zh": "子查询和 CTE",
    "fr": "Sous-requêtes et CTE",
    "de": "Unterabfragen und CTEs",
    "es": "Subconsultas y CTE"
  },
  "mongodb-nosql-concepts": {
    "vi": "MongoDB & NoSQL Concepts",
    "en": "MongoDB & NoSQL Concepts",
    "ja": "MongoDB と NoSQL の概念",
    "ko": "MongoDB 및 NoSQL 개념",
    "zh": "MongoDB 和 NoSQL 概念",
    "fr": "Concepts MongoDB et NoSQL",
    "de": "MongoDB- und NoSQL-Konzepte",
    "es": "Conceptos de MongoDB y NoSQL"
  },
  "indexing-query-optimization": {
    "vi": "Indexing & Query Optimization",
    "en": "Indexing & Query Optimization",
    "ja": "インデックス作成とクエリの最適化",
    "ko": "인덱싱 및 쿼리 최적화",
    "zh": "索引和查询优化",
    "fr": "Indexation et optimisation des requêtes",
    "de": "Indizierung und Abfrageoptimierung",
    "es": "Indexación y optimización de consultas"
  },
  "transactions-data-integrity": {
    "vi": "Transactions & Data Integrity",
    "en": "Transactions & Data Integrity",
    "ja": "トランザクションとデータの整合性",
    "ko": "거래 및 데이터 무결성",
    "zh": "交易和数据完整性",
    "fr": "Transactions et intégrité des données",
    "de": "Transaktionen und Datenintegrität",
    "es": "Transacciones e integridad de datos"
  },
  "advanced-data-modeling": {
    "vi": "Advanced Data Modeling",
    "en": "Advanced Data Modeling",
    "ja": "高度なデータモデリング",
    "ko": "고급 데이터 모델링",
    "zh": "高级数据建模",
    "fr": "Modélisation avancée des données",
    "de": "Erweiterte Datenmodellierung",
    "es": "Modelado de datos avanzado"
  },
  "advanced-query-optimization": {
    "vi": "Advanced Query Optimization",
    "en": "Advanced Query Optimization",
    "ja": "高度なクエリ最適化",
    "ko": "고급 쿼리 최적화",
    "zh": "高级查询优化",
    "fr": "Optimisation avancée des requêtes",
    "de": "Erweiterte Abfrageoptimierung",
    "es": "Optimización avanzada de consultas"
  },
  "distributed-databases-cap": {
    "vi": "Distributed Databases & CAP",
    "en": "Distributed Databases & CAP",
    "ja": "分散データベースと CAP",
    "ko": "분산 데이터베이스 및 CAP",
    "zh": "分布式数据库和 CAP",
    "fr": "Bases de données distribuées et CAP",
    "de": "Verteilte Datenbanken und CAP",
    "es": "Bases de datos distribuidas y CAP"
  },
  "database-internals-storage": {
    "vi": "Database Internals & Storage",
    "en": "Database Internals & Storage",
    "ja": "データベースの内部構造とストレージ",
    "ko": "데이터베이스 내부 및 저장소",
    "zh": "数据库内部结构和存储",
    "fr": "Composants internes et stockage de la base de données",
    "de": "Datenbankinterna und Speicher",
    "es": "Componentes internos y almacenamiento de bases de datos"
  },
  "jest-basics-first-tests": {
    "vi": "Jest Basics & First Tests",
    "en": "Jest Basics & First Tests",
    "ja": "Jest の基本と最初のテスト",
    "ko": "Jest 기본 및 첫 번째 테스트",
    "zh": "笑话基础知识和首次测试",
    "fr": "Bases de Jest et premiers tests",
    "de": "Jest-Grundlagen und erste Tests",
    "es": "Conceptos básicos de Jest y primeras pruebas"
  },
  "test-structure-organization": {
    "vi": "Test Structure & Organization",
    "en": "Test Structure & Organization",
    "ja": "テストの構造と組織",
    "ko": "테스트 구조 및 조직",
    "zh": "测试结构和组织",
    "fr": "Structure et organisation des tests",
    "de": "Teststruktur und Organisation",
    "es": "Estructura y organización de la prueba"
  },
  "mocking-spying": {
    "vi": "Mocking & Spying",
    "en": "Mocking & Spying",
    "ja": "嘲笑とスパイ",
    "ko": "조롱 및 스파이 활동",
    "zh": "嘲笑与间谍活动",
    "fr": "Moquerie et espionnage",
    "de": "Spott und Spionage",
    "es": "Burlarse y espiar"
  },
  "testing-async-code": {
    "vi": "Testing Async Code",
    "en": "Testing Async Code",
    "ja": "非同期コードのテスト",
    "ko": "비동기 코드 테스트",
    "zh": "测试异步代码",
    "fr": "Test du code asynchrone",
    "de": "Async-Code testen",
    "es": "Prueba de código asíncrono"
  },
  "setup-config-coverage": {
    "vi": "Setup, Config & Coverage",
    "en": "Setup, Config & Coverage",
    "ja": "セットアップ、構成、カバレッジ",
    "ko": "설정, 구성 및 적용 범위",
    "zh": "设置、配置和覆盖范围",
    "fr": "Installation, configuration et couverture",
    "de": "Einrichtung, Konfiguration und Abdeckung",
    "es": "Instalación, configuración y cobertura"
  },
  "integration-testing": {
    "vi": "Integration Testing",
    "en": "Integration Testing",
    "ja": "統合テスト",
    "ko": "통합 테스트",
    "zh": "集成测试",
    "fr": "Tests d'intégration",
    "de": "Integrationstests",
    "es": "Pruebas de integración"
  },
  "test-driven-development-tdd": {
    "vi": "Test-Driven Development (TDD)",
    "en": "Test-Driven Development (TDD)",
    "ja": "テスト駆動開発 (TDD)",
    "ko": "테스트 주도 개발(TDD)",
    "zh": "测试驱动开发 (TDD)",
    "fr": "Développement piloté par les tests (TDD)",
    "de": "Testgetriebene Entwicklung (TDD)",
    "es": "Desarrollo basado en pruebas (TDD)"
  },
  "testing-strategy-patterns": {
    "vi": "Testing Strategy & Patterns",
    "en": "Testing Strategy & Patterns",
    "ja": "テスト戦略とパターン",
    "ko": "테스트 전략 및 패턴",
    "zh": "测试策略和模式",
    "fr": "Stratégies et modèles de test",
    "de": "Teststrategien und -muster",
    "es": "Estrategias y patrones de prueba"
  },
  "ci-cd-test-automation": {
    "vi": "CI/CD & Test Automation",
    "en": "CI/CD & Test Automation",
    "ja": "CI/CD とテスト自動化",
    "ko": "CI/CD 및 테스트 자동화",
    "zh": "CI/CD 和测试自动化",
    "fr": "CI/CD et automatisation des tests",
    "de": "CI/CD und Testautomatisierung",
    "es": "CI/CD y automatización de pruebas"
  },
  "property-based-contract-testing": {
    "vi": "Property-Based & Contract Testing",
    "en": "Property-Based & Contract Testing",
    "ja": "プロパティベースおよび契約テスト",
    "ko": "자산 기반 및 계약 테스트",
    "zh": "基于属性和合同测试",
    "fr": "Tests basés sur la propriété et sous contrat",
    "de": "Immobilienbasierte und Vertragstests",
    "es": "Pruebas basadas en propiedades y por contrato"
  },
  "testing-architecture-testing-trophy": {
    "vi": "Testing Architecture & Testing Trophy",
    "en": "Testing Architecture & Testing Trophy",
    "ja": "アーキテクチャのテストとトロフィーのテスト",
    "ko": "테스트 아키텍처 및 테스트 트로피",
    "zh": "测试架构和测试奖杯",
    "fr": "Architecture de Test & Trophée des Tests",
    "de": "Testarchitektur und Testtrophäe",
    "es": "Arquitectura de pruebas y trofeo de pruebas"
  },
  "git-fundamentals": {
    "vi": "Git Fundamentals",
    "en": "Git Fundamentals",
    "ja": "Git の基礎",
    "ko": "Git 기초",
    "zh": "Git 基础知识",
    "fr": "Fondamentaux de Git",
    "de": "Git-Grundlagen",
    "es": "Fundamentos de Git"
  },
  "docker-basics": {
    "vi": "Docker Basics",
    "en": "Docker Basics",
    "ja": "Docker の基本",
    "ko": "도커 기본 사항",
    "zh": "Docker 基础知识",
    "fr": "Bases de Docker",
    "de": "Docker-Grundlagen",
    "es": "Conceptos básicos de Docker"
  },
  "gitignore-docker-ignore": {
    "vi": ".gitignore & Docker Ignore",
    "en": ".gitignore & Docker Ignore",
    "ja": ".gitignore と Docker 無視",
    "ko": ".gitignore 및 도커 무시",
    "zh": ".gitignore 和 Docker 忽略",
    "fr": ".gitignore et Docker ignorent",
    "de": ".gitignore & Docker ignorieren",
    "es": ".gitignore y Docker ignorar"
  },
  "git-branching-strategies": {
    "vi": "Git Branching Strategies",
    "en": "Git Branching Strategies",
    "ja": "Git ブランチ戦略",
    "ko": "Git 분기 전략",
    "zh": "Git 分支策略",
    "fr": "Stratégies de branchement Git",
    "de": "Git-Branching-Strategien",
    "es": "Estrategias de ramificación de Git"
  },
  "docker-compose-multi-container": {
    "vi": "Docker Compose & Multi-container",
    "en": "Docker Compose & Multi-container",
    "ja": "Docker Compose とマルチコンテナー",
    "ko": "Docker Compose 및 다중 컨테이너",
    "zh": "Docker Compose 和多容器",
    "fr": "Docker Compose et multi-conteneurs",
    "de": "Docker Compose & Multi-Container",
    "es": "Docker Compose y contenedores múltiples"
  },
  "merge-conflicts-recovery": {
    "vi": "Merge Conflicts & Recovery",
    "en": "Merge Conflicts & Recovery",
    "ja": "マージ競合と回復",
    "ko": "충돌 병합 및 복구",
    "zh": "合并冲突和恢复",
    "fr": "Fusionner les conflits et la récupération",
    "de": "Konflikte und Wiederherstellung zusammenführen",
    "es": "Fusionar conflictos y recuperación"
  },
  "ci-cd-pipelines": {
    "vi": "CI/CD Pipelines",
    "en": "CI/CD Pipelines",
    "ja": "CI/CD パイプライン",
    "ko": "CI/CD 파이프라인",
    "zh": "CI/CD 管道",
    "fr": "Pipelines CI/CD",
    "de": "CI/CD-Pipelines",
    "es": "Canalizaciones de CI/CD"
  },
  "docker-production-patterns": {
    "vi": "Docker Production Patterns",
    "en": "Docker Production Patterns",
    "ja": "Docker のプロダクション パターン",
    "ko": "Docker 생산 패턴",
    "zh": "Docker 生产模式",
    "fr": "Modèles de production Docker",
    "de": "Docker-Produktionsmuster",
    "es": "Patrones de producción de Docker"
  },
  "advanced-git-techniques": {
    "vi": "Advanced Git Techniques",
    "en": "Advanced Git Techniques",
    "ja": "高度な Git テクニック",
    "ko": "고급 Git 기술",
    "zh": "高级 Git 技术",
    "fr": "Techniques Git avancées",
    "de": "Fortgeschrittene Git-Techniken",
    "es": "Técnicas avanzadas de Git"
  },
  "container-security-best-practices": {
    "vi": "Container Security & Best Practices",
    "en": "Container Security & Best Practices",
    "ja": "コンテナのセキュリティとベストプラクティス",
    "ko": "컨테이너 보안 및 모범 사례",
    "zh": "容器安全与最佳实践",
    "fr": "Sécurité des conteneurs et bonnes pratiques",
    "de": "Containersicherheit und Best Practices",
    "es": "Seguridad de contenedores y mejores prácticas"
  },
  "kubernetes-container-orchestration": {
    "vi": "Kubernetes & Container Orchestration",
    "en": "Kubernetes & Container Orchestration",
    "ja": "Kubernetes とコンテナ オーケストレーション",
    "ko": "Kubernetes 및 컨테이너 오케스트레이션",
    "zh": "Kubernetes 和容器编排",
    "fr": "Kubernetes et orchestration de conteneurs",
    "de": "Kubernetes und Container-Orchestrierung",
    "es": "Kubernetes y orquestación de contenedores"
  },
  "gitops-infrastructure-as-code": {
    "vi": "GitOps & Infrastructure as Code",
    "en": "GitOps & Infrastructure as Code",
    "ja": "GitOps とコードとしてのインフラストラクチャ",
    "ko": "GitOps 및 코드형 인프라",
    "zh": "GitOps 和基础设施即代码",
    "fr": "GitOps et infrastructure en tant que code",
    "de": "GitOps und Infrastruktur als Code",
    "es": "GitOps e infraestructura como código"
  },
  "generics-utility-types": {
    "vi": "Generics & Utility Types",
    "en": "Generics & Utility Types",
    "ja": "ジェネリックとユーティリティのタイプ",
    "ko": "제네릭 및 유틸리티 유형",
    "zh": "泛型和实用程序类型",
    "fr": "Génériques et types d'utilitaires",
    "de": "Generika und Versorgungstypen",
    "es": "Genéricos y tipos de utilidad"
  },
  "advanced-type-patterns": {
    "vi": "Advanced Type Patterns",
    "en": "Advanced Type Patterns",
    "ja": "高度な型パターン",
    "ko": "고급 유형 패턴",
    "zh": "高级类型模式",
    "fr": "Modèles de caractères avancés",
    "de": "Erweiterte Typmuster",
    "es": "Patrones de tipo avanzado"
  },
  "type-level-programming": {
    "vi": "Type-Level Programming",
    "en": "Type-Level Programming",
    "ja": "タイプレベルのプログラミング",
    "ko": "유형 수준 프로그래밍",
    "zh": "类型级编程",
    "fr": "Programmation au niveau du type",
    "de": "Programmierung auf Typebene",
    "es": "Programación a nivel de tipo"
  },
  "ts-compiler-internals": {
    "vi": "TS Compiler Internals",
    "en": "TS Compiler Internals",
    "ja": "TS コンパイラの内部構造",
    "ko": "TS 컴파일러 내부",
    "zh": "TS 编译器内部结构",
    "fr": "Composants internes du compilateur TS",
    "de": "TS-Compiler-Interna",
    "es": "Componentes internos del compilador TS"
  },
  "lap-trinh-bat-dong-bo-async-await": {
    "vi": "Lập trình bất đồng bộ Async/Await",
    "en": "Asynchronous programming Async/Await",
    "ja": "非同期プログラミング Async/Await",
    "ko": "비동기 프로그래밍 Async/Await",
    "zh": "异步编程Async/Await",
    "fr": "Programmation asynchrone Async/Await",
    "de": "Asynchrone Programmierung Async/Await",
    "es": "Programación asincrónica Async/Await"
  },
  "xay-dung-web-api-voi-asp-net-core": {
    "vi": "Xây dựng Web API với ASP.NET Core",
    "en": "Build Web API with ASP.NET Core",
    "ja": "ASP.NET Core を使用して Web API を構築する",
    "ko": "ASP.NET Core로 웹 API 구축",
    "zh": "使用 ASP.NET Core 构建 Web API",
    "fr": "Créer une API Web avec ASP.NET Core",
    "de": "Erstellen Sie eine Web-API mit ASP.NET Core",
    "es": "Cree una API web con ASP.NET Core"
  },
  "entity-framework-core": {
    "vi": "Entity Framework Core",
    "en": "Entity Framework Core",
    "ja": "エンティティフレームワークコア",
    "ko": "엔터티 프레임워크 코어",
    "zh": "Entity Framework Core",
    "fr": "Noyau du cadre d'entité",
    "de": "Entity Framework Core",
    "es": "Núcleo del marco de entidad"
  },
  "packages-modules-testing": {
    "vi": "Packages, Modules & Testing",
    "en": "Packages, Modules & Testing",
    "ja": "パッケージ、モジュール、テスト",
    "ko": "패키지, 모듈 및 테스트",
    "zh": "包、模块和测试",
    "fr": "Forfaits, modules et tests",
    "de": "Pakete, Module und Tests",
    "es": "Paquetes, módulos y pruebas"
  },
  "http-server-rest-api": {
    "vi": "HTTP Server & REST API",
    "en": "HTTP Server & REST API",
    "ja": "HTTPサーバーとREST API",
    "ko": "HTTP 서버 및 REST API",
    "zh": "HTTP 服务器和 REST API",
    "fr": "Serveur HTTP et API REST",
    "de": "HTTP-Server und REST-API",
    "es": "Servidor HTTP y API REST"
  },
  "context-middleware-error-patterns": {
    "vi": "Context, Middleware & Error Patterns",
    "en": "Context, Middleware & Error Patterns",
    "ja": "コンテキスト、ミドルウェア、エラーパターン",
    "ko": "컨텍스트, 미들웨어 및 오류 패턴",
    "zh": "上下文、中间件和错误模式",
    "fr": "Contexte, middleware et modèles d'erreurs",
    "de": "Kontext, Middleware und Fehlermuster",
    "es": "Contexto, middleware y patrones de error"
  },
  "database-orm": {
    "vi": "Database & ORM",
    "en": "Databases & ORMs",
    "ja": "データベースとORM",
    "ko": "데이터베이스 및 ORM",
    "zh": "数据库和 ORM",
    "fr": "Bases de données et ORM",
    "de": "Datenbanken und ORMs",
    "es": "Bases de datos y ORM"
  },
  "go-generics-1-18": {
    "vi": "Go Generics (1.18+)",
    "en": "Go Generics (1.18+)",
    "ja": "Go ジェネリック (1.18+)",
    "ko": "Go 제네릭(1.18+)",
    "zh": "Go 泛型 (1.18+)",
    "fr": "Allez aux génériques (1.18+)",
    "de": "Go Generics (1.18+)",
    "es": "Ir a genéricos (1.18+)"
  },
  "production-go-logging-config-graceful-shutdown": {
    "vi": "Production Go: Logging, Config, Graceful Shutdown",
    "en": "Production Go: Logging, Config, Graceful Shutdown",
    "ja": "Production Go: ロギング、構成、正常なシャットダウン",
    "ko": "Production Go: 로깅, 구성, 정상적인 종료",
    "zh": "生产环境：日志记录、配置、正常关闭",
    "fr": "Production Go : journalisation, configuration, arrêt progressif",
    "de": "Produktionsstart: Protokollierung, Konfiguration, ordnungsgemäßes Herunterfahren",
    "es": "Inicio de producción: registro, configuración, cierre ordenado"
  },
  "advanced-concurrency-patterns": {
    "vi": "Advanced Concurrency Patterns",
    "en": "Advanced Concurrency Patterns",
    "ja": "高度な同時実行パターン",
    "ko": "고급 동시성 패턴",
    "zh": "高级并发模式",
    "fr": "Modèles de concurrence avancés",
    "de": "Erweiterte Parallelitätsmuster",
    "es": "Patrones de concurrencia avanzados"
  },
  "go-microservices-architecture": {
    "vi": "Go Microservices Architecture",
    "en": "Go Microservices Architecture",
    "ja": "Go マイクロサービス アーキテクチャ",
    "ko": "Go 마이크로서비스 아키텍처",
    "zh": "Go 微服务架构",
    "fr": "Optez pour l'architecture de microservices",
    "de": "Gehen Sie zur Microservices-Architektur",
    "es": "Ir a la arquitectura de microservicios"
  },
  "go-runtime-scheduler-internals": {
    "vi": "Go Runtime & Scheduler Internals",
    "en": "Go Runtime & Scheduler Internals",
    "ja": "Go ランタイムとスケジューラの内部構造",
    "ko": "런타임 및 스케줄러 내부로 이동",
    "zh": "Go 运行时和调度程序内部结构",
    "fr": "Aller aux composants internes du runtime et du planificateur",
    "de": "Gehen Sie zu Laufzeit- und Scheduler-Interna",
    "es": "Ir a los aspectos internos del tiempo de ejecución y del programador"
  },
  "rust-syntax-ownership": {
    "vi": "Rust Syntax & Ownership",
    "en": "Rust Syntax & Ownership",
    "ja": "Rustの構文と所有権",
    "ko": "Rust 구문 및 소유권",
    "zh": "Rust 语法和所有权",
    "fr": "Syntaxe et propriété de Rust",
    "de": "Rust-Syntax und Eigentum",
    "es": "Sintaxis y propiedad de Rust"
  },
  "enums-structs-pattern-matching": {
    "vi": "Enums, Structs & Pattern Matching",
    "en": "Enums, Structures & Pattern Matching",
    "ja": "列挙型、構造体、パターン マッチング",
    "ko": "열거형, 구조 및 패턴 일치",
    "zh": "枚举、结构和模式匹配",
    "fr": "Énumérations, structures et correspondance de modèles",
    "de": "Aufzählungen, Strukturen und Mustervergleich",
    "es": "Enumeraciones, estructuras y coincidencia de patrones"
  },
  "error-handling-result-t-e": {
    "vi": "Error Handling & Result<T,E>",
    "en": "Error Handling & Result<T,E>",
    "ja": "エラー処理と結果<T,E>",
    "ko": "오류 처리 및 결과<T,E>",
    "zh": "错误处理和结果<T,E>",
    "fr": "Gestion des erreurs et résultat<T,E>",
    "de": "Fehlerbehandlung und Ergebnis<T,E>",
    "es": "Manejo de errores y resultado<T,E>"
  },
  "lifetimes-advanced-ownership": {
    "vi": "Lifetimes & Advanced Ownership",
    "en": "Lifetimes & Advanced Ownership",
    "ja": "生涯および高度な所有権",
    "ko": "수명 및 고급 소유권",
    "zh": "寿命和高级所有权",
    "fr": "Durée de vie et propriété avancée",
    "de": "Lebenslanges und fortgeschrittenes Eigentum",
    "es": "Vida útil y propiedad avanzada"
  },
  "iterators-closures": {
    "vi": "Iterators & Closures",
    "en": "Iterators & Closures",
    "ja": "イテレータとクロージャ",
    "ko": "반복자 및 클로저",
    "zh": "迭代器和闭包",
    "fr": "Itérateurs et fermetures",
    "de": "Iteratoren und Abschlüsse",
    "es": "Iteradores y cierres"
  },
  "async-await-tokio": {
    "vi": "Async/Await & Tokio",
    "en": "Async/Await & Tokio",
    "ja": "非同期/待機 & トキオ",
    "ko": "비동기/대기 및 Tokio",
    "zh": "异步/等待和 Tokio",
    "fr": "Asynchrone/Attendre et Tokio",
    "de": "Async/Await & Tokio",
    "es": "Asíncrono/espera y Tokio"
  },
  "concurrency-threads-mutex-channels": {
    "vi": "Concurrency: Threads, Mutex, Channels",
    "en": "Concurrency: Threads, Mutex, Channels",
    "ja": "同時実行性: スレッド、ミューテックス、チャネル",
    "ko": "동시성: 스레드, 뮤텍스, 채널",
    "zh": "并发：线程、互斥体、通道",
    "fr": "Concurrence : threads, mutex, canaux",
    "de": "Parallelität: Threads, Mutex, Kanäle",
    "es": "Concurrencia: subprocesos, mutex, canales"
  },
  "macros-metaprogramming": {
    "vi": "Macros & Metaprogramming",
    "en": "Macros & Metaprogramming",
    "ja": "マクロとメタプログラミング",
    "ko": "매크로 및 메타프로그래밍",
    "zh": "宏和元编程",
    "fr": "Macros et métaprogrammation",
    "de": "Makros und Metaprogrammierung",
    "es": "Macros y metaprogramación"
  },
  "webassembly-advanced-rust": {
    "vi": "WebAssembly & Advanced Rust",
    "en": "WebAssembly & Advanced Rust",
    "ja": "WebAssembly と高度な Rust",
    "ko": "웹어셈블리와 고급 Rust",
    "zh": "WebAssembly 和高级 Rust",
    "fr": "WebAssembly et rouille avancée",
    "de": "WebAssembly und Advanced Rust",
    "es": "WebAssembly y óxido avanzado"
  },
  "php-syntax-web-basics": {
    "vi": "PHP Syntax & Web Basics",
    "en": "PHP Syntax & Web Basics",
    "ja": "PHP 構文と Web の基本",
    "ko": "PHP 구문 및 웹 기본 사항",
    "zh": "PHP 语法和 Web 基础知识",
    "fr": "Syntaxe PHP et bases du Web",
    "de": "PHP-Syntax und Web-Grundlagen",
    "es": "Sintaxis PHP y conceptos básicos web"
  },
  "laravel-basics": {
    "vi": "Laravel Basics",
    "en": "Laravel Basics",
    "ja": "Laravelの基本",
    "ko": "라라벨 기초",
    "zh": "Laravel 基础知识",
    "fr": "Les bases de Laravel",
    "de": "Laravel-Grundlagen",
    "es": "Conceptos básicos de Laravel"
  },
  "eloquent-advanced-relationships": {
    "vi": "Eloquent Advanced & Relationships",
    "en": "Eloquent Advanced & Relationships",
    "ja": "雄弁な上級者と人間関係",
    "ko": "Eloquent 고급 및 관계",
    "zh": "口才高级与人际关系",
    "fr": "Éloquent avancé et relations",
    "de": "Beredte Fortgeschrittene und Beziehungen",
    "es": "Elocuente Avanzado y Relaciones"
  },
  "queues-events-scheduling": {
    "vi": "Queues, Events & Scheduling",
    "en": "Queues, Events & Scheduling",
    "ja": "キュー、イベント、スケジュール設定",
    "ko": "대기열, 이벤트 및 예약",
    "zh": "队列、事件和日程安排",
    "fr": "Files d'attente, événements et planification",
    "de": "Warteschlangen, Ereignisse und Terminplanung",
    "es": "Colas, eventos y programación"
  },
  "laravel-architecture-patterns": {
    "vi": "Laravel Architecture Patterns",
    "en": "Laravel Architecture Patterns",
    "ja": "Laravel アーキテクチャ パターン",
    "ko": "Laravel 아키텍처 패턴",
    "zh": "Laravel 架构模式",
    "fr": "Modèles d'architecture Laravel",
    "de": "Laravel-Architekturmuster",
    "es": "Patrones de arquitectura de Laravel"
  },
  "caching-performance": {
    "vi": "Caching & Performance",
    "en": "Caching & Performance",
    "ja": "キャッシュとパフォーマンス",
    "ko": "캐싱 및 성능",
    "zh": "缓存和性能",
    "fr": "Mise en cache et performances",
    "de": "Caching und Leistung",
    "es": "Almacenamiento en caché y rendimiento"
  },
  "package-development-advanced": {
    "vi": "Package Development & Advanced",
    "en": "Package Development & Advanced",
    "ja": "パッケージ開発と高度な",
    "ko": "패키지 개발 및 고급",
    "zh": "封装开发与高级",
    "fr": "Développement de packages et avancé",
    "de": "Paketentwicklung und Fortgeschrittene",
    "es": "Desarrollo de paquetes y avanzado"
  },
  "php-scaling-production": {
    "vi": "PHP Scaling & Production",
    "en": "PHP Scaling & Production",
    "ja": "PHPのスケーリングとプロダクション",
    "ko": "PHP 확장 및 생산",
    "zh": "PHP 扩展和生产",
    "fr": "Mise à l'échelle et production PHP",
    "de": "PHP-Skalierung und -Produktion",
    "es": "Escalado y producción de PHP"
  },
  "swift-concurrency-async-await": {
    "vi": "Swift Concurrency (async/await)",
    "en": "Swift Concurrency (async/await)",
    "ja": "Swift 同時実行 (非同期/待機)",
    "ko": "신속한 동시성(비동기/대기)",
    "zh": "Swift 并发（异步/等待）",
    "fr": "Concurrence Swift (asynchrone/attendre)",
    "de": "Schnelle Parallelität (asynchron/warten)",
    "es": "Concurrencia rápida (asíncrona/espera)"
  },
  "dong-goi-frameworks-ci-cd-xcode-cloud-kien-truc-tca": {
    "vi": "Đóng gói Frameworks, CI/CD Xcode Cloud & Kiến trúc TCA",
    "en": "Packaging Frameworks, CI/CD Xcode Cloud & TCA Architecture",
    "ja": "パッケージング フレームワーク、CI/CD Xcode クラウド、TCA アーキテクチャ",
    "ko": "패키징 프레임워크, CI/CD Xcode 클라우드 및 TCA 아키텍처",
    "zh": "打包框架、CI/CD Xcode Cloud 和 TCA 架构",
    "fr": "Cadres d'empaquetage, architecture CI/CD Xcode Cloud et TCA",
    "de": "Verpackungs-Frameworks, CI/CD Xcode Cloud und TCA-Architektur",
    "es": "Marcos de empaquetado, CI/CD Xcode Cloud y arquitectura TCA"
  },
  "android-architecture-components": {
    "vi": "Android Architecture Components",
    "en": "Android Architecture Components",
    "ja": "Android アーキテクチャ コンポーネント",
    "ko": "Android 아키텍처 구성요소",
    "zh": "Android 架构组件",
    "fr": "Composants d'architecture Android",
    "de": "Komponenten der Android-Architektur",
    "es": "Componentes de la arquitectura de Android"
  },
  "kotlin-multiplatform-kmp": {
    "vi": "Kotlin Multiplatform (KMP)",
    "en": "Kotlin Multiplatform (KMP)",
    "ja": "Kotlin マルチプラットフォーム (KMP)",
    "ko": "Kotlin 멀티플랫폼(KMP)",
    "zh": "Kotlin 多平台 (KMP)",
    "fr": "Kotlin multiplateforme (KMP)",
    "de": "Kotlin Multiplattform (KMP)",
    "es": "Kotlin multiplataforma (KMP)"
  },
  "kotlin-dsl-advanced-features": {
    "vi": "Kotlin DSL & Advanced Features",
    "en": "Kotlin DSL & Advanced Features",
    "ja": "Kotlin DSL と高度な機能",
    "ko": "Kotlin DSL 및 고급 기능",
    "zh": "Kotlin DSL 和高级功能",
    "fr": "Kotlin DSL et fonctionnalités avancées",
    "de": "Kotlin DSL und erweiterte Funktionen",
    "es": "Kotlin DSL y funciones avanzadas"
  },
  "kotlin-testing-best-practices": {
    "vi": "Kotlin Testing Best Practices",
    "en": "Kotlin Testing Best Practices",
    "ja": "Kotlin テストのベスト プラクティス",
    "ko": "Kotlin 테스트 모범 사례",
    "zh": "Kotlin 测试最佳实践",
    "fr": "Meilleures pratiques de test Kotlin",
    "de": "Best Practices für Kotlin-Tests",
    "es": "Mejores prácticas de prueba de Kotlin"
  },
  "kotlin-compiler-plugins-meta": {
    "vi": "Kotlin Compiler Plugins & Meta",
    "en": "Kotlin Compiler Plugins & Meta",
    "ja": "Kotlin コンパイラ プラグインとメタ",
    "ko": "Kotlin 컴파일러 플러그인 및 메타",
    "zh": "Kotlin 编译器插件和元数据",
    "fr": "Plugins et méta du compilateur Kotlin",
    "de": "Kotlin-Compiler-Plugins und Meta",
    "es": "Complementos y metadatos del compilador Kotlin"
  },
  "ruby-syntax-everything-is-object": {
    "vi": "Ruby Syntax & Everything is Object",
    "en": "Ruby Syntax & Everything is Object",
    "ja": "Ruby の構文とすべてがオブジェクトである",
    "ko": "Ruby 구문 및 모든 것이 객체입니다",
    "zh": "Ruby 语法和一切皆对象",
    "fr": "Syntaxe Ruby et tout est objet",
    "de": "Ruby-Syntax und alles ist Objekt",
    "es": "Sintaxis de Ruby y todo es objeto"
  },
  "methods-blocks-classes": {
    "vi": "Methods, Blocks & Classes",
    "en": "Methods, Blocks & Classes",
    "ja": "メソッド、ブロック、クラス",
    "ko": "메소드, 블록 및 클래스",
    "zh": "方法、块和类",
    "fr": "Méthodes, blocs et classes",
    "de": "Methoden, Blöcke und Klassen",
    "es": "Métodos, bloques y clases"
  },
  "modules-mixins-error-handling": {
    "vi": "Modules, Mixins & Error Handling",
    "en": "Modules, Mixins & Error Handling",
    "ja": "モジュール、ミックスイン、エラー処理",
    "ko": "모듈, 믹스인 및 오류 처리",
    "zh": "模块、混合和错误处理",
    "fr": "Modules, mixins et gestion des erreurs",
    "de": "Module, Mixins und Fehlerbehandlung",
    "es": "Módulos, mixins y manejo de errores"
  },
  "ruby-on-rails-fundamentals": {
    "vi": "Ruby on Rails Fundamentals",
    "en": "Ruby on Rails Fundamentals",
    "ja": "Ruby on Rails の基礎",
    "ko": "Ruby on Rails 기초",
    "zh": "Ruby on Rails 基础知识",
    "fr": "Principes fondamentaux de Ruby on Rails",
    "de": "Ruby on Rails-Grundlagen",
    "es": "Fundamentos de Ruby on Rails"
  },
  "activerecord-advanced": {
    "vi": "ActiveRecord Advanced",
    "en": "ActiveRecord Advanced",
    "ja": "ActiveRecord アドバンスト",
    "ko": "액티브레코드 어드밴스드",
    "zh": "ActiveRecord 高级版",
    "fr": "ActiveRecord Avancé",
    "de": "ActiveRecord Advanced",
    "es": "ActiveRecord Avanzado"
  },
  "service-objects-design-patterns": {
    "vi": "Service Objects & Design Patterns",
    "en": "Service Objects & Design Patterns",
    "ja": "サービスオブジェクトとデザインパターン",
    "ko": "서비스 객체 및 디자인 패턴",
    "zh": "服务对象和设计模式",
    "fr": "Objets de service et modèles de conception",
    "de": "Serviceobjekte und Entwurfsmuster",
    "es": "Objetos de servicio y patrones de diseño"
  },
  "rails-performance-background-jobs": {
    "vi": "Rails Performance & Background Jobs",
    "en": "Rails Performance & Background Jobs",
    "ja": "Railsのパフォーマンスとバックグラウンドジョブ",
    "ko": "Rails 성능 및 백그라운드 작업",
    "zh": "Rails 性能和后台作业",
    "fr": "Performances Rails et tâches en arrière-plan",
    "de": "Rails-Leistung und Hintergrundjobs",
    "es": "Rendimiento de Rails y trabajos en segundo plano"
  },
  "ruby-metaprogramming": {
    "vi": "Ruby Metaprogramming",
    "en": "Ruby Metaprogramming",
    "ja": "Ruby メタプログラミング",
    "ko": "루비 메타프로그래밍",
    "zh": "Ruby 元编程",
    "fr": "Métaprogrammation Ruby",
    "de": "Ruby-Metaprogrammierung",
    "es": "Metaprogramación Ruby"
  },
  "oop-trong-dart-classes-mixins-generics": {
    "vi": "OOP trong Dart: Classes, Mixins & Generics",
    "en": "OOP in Dart: Classes, Mixins & Generics",
    "ja": "Dart の OOP: クラス、ミックスイン、ジェネリック",
    "ko": "Dart의 OOP: 클래스, 믹스인, 제네릭",
    "zh": "Dart 中的 OOP：类、混合和泛型",
    "fr": "POO dans Dart : classes, mixins et génériques",
    "de": "OOP in Dart: Klassen, Mixins und Generics",
    "es": "Programación orientada a objetos en Dart: clases, mixins y genéricos"
  },
  "async-future-stream-isolate": {
    "vi": "Async: Future, Stream & Isolate",
    "en": "Async: Future, Stream & Isolate",
    "ja": "非同期: 将来、ストリーム、分離",
    "ko": "비동기: 미래, 스트리밍 및 격리",
    "zh": "异步：未来、流和隔离",
    "fr": "Async : avenir, diffusion et isolement",
    "de": "Async: Zukunft, Stream und Isolieren",
    "es": "Asíncrono: futuro, transmisión y aislamiento"
  },
  "flutter-widget-fundamentals": {
    "vi": "Flutter Widget Fundamentals",
    "en": "Flutter Widget Fundamentals",
    "ja": "フラッターウィジェットの基礎",
    "ko": "Flutter 위젯 기초",
    "zh": "Flutter Widget 基础知识",
    "fr": "Principes fondamentaux du widget Flutter",
    "de": "Grundlagen des Flutter-Widgets",
    "es": "Fundamentos del widget Flutter"
  },
  "state-management-riverpod": {
    "vi": "State Management: Riverpod",
    "en": "State Management: Riverpod",
    "ja": "状態管理: リバーポッド",
    "ko": "상태 관리: Riverpod",
    "zh": "状态管理：Riverpod",
    "fr": "Gestion de l'État : Riverpod",
    "de": "Staatsverwaltung: Riverpod",
    "es": "Gestión estatal: Riverpod"
  },
  "clean-architecture-testing": {
    "vi": "Clean Architecture & Testing",
    "en": "Clean Architecture & Testing",
    "ja": "クリーンなアーキテクチャとテスト",
    "ko": "클린 아키텍처 및 테스트",
    "zh": "干净的架构和测试",
    "fr": "Architecture et tests propres",
    "de": "Saubere Architektur und Tests",
    "es": "Arquitectura limpia y pruebas"
  },
  "flutter-performance-platform-channels": {
    "vi": "Flutter Performance & Platform Channels",
    "en": "Flutter Performance & Platform Channels",
    "ja": "Flutter パフォーマンスとプラットフォーム チャネル",
    "ko": "Flutter 성능 및 플랫폼 채널",
    "zh": "Flutter 性能和平台渠道",
    "fr": "Performances Flutter et canaux de plate-forme",
    "de": "Flutter-Leistung und Plattformkanäle",
    "es": "Canales de plataforma y rendimiento de Flutter"
  },
  "advanced-flutter-custom-rendering-animations": {
    "vi": "Advanced Flutter: Custom Rendering & Animations",
    "en": "Advanced Flutter: Custom Rendering & Animations",
    "ja": "高度な Flutter: カスタム レンダリングとアニメーション",
    "ko": "고급 Flutter: 맞춤 렌더링 및 애니메이션",
    "zh": "高级 Flutter：自定义渲染和动画",
    "fr": "Flutter avancé : rendu et animations personnalisés",
    "de": "Advanced Flutter: Benutzerdefiniertes Rendering und Animationen",
    "es": "Flutter avanzado: renderizado y animaciones personalizados"
  },
  "terminal-commands-navigation": {
    "vi": "Terminal Commands & Navigation",
    "en": "Terminal Commands & Navigation",
    "ja": "ターミナルコマンドとナビゲーション",
    "ko": "터미널 명령 및 탐색",
    "zh": "终端命令和导航",
    "fr": "Commandes et navigation du terminal",
    "de": "Terminalbefehle und Navigation",
    "es": "Comandos de terminal y navegación"
  },
  "text-processing-awk-sed-xargs": {
    "vi": "Text Processing: awk, sed, xargs",
    "en": "Text Processing: awk, sed, xargs",
    "ja": "テキスト処理: awk、sed、xargs",
    "ko": "텍스트 처리: awk, sed, xargs",
    "zh": "文本处理：awk、sed、xargs",
    "fr": "Traitement de texte : awk, sed, xargs",
    "de": "Textverarbeitung: awk, sed, xargs",
    "es": "Procesamiento de texto: awk, sed, xargs"
  },
  "docker-docker-compose-scripting": {
    "vi": "Docker & Docker Compose Scripting",
    "en": "Docker & Docker Compose Scripting",
    "ja": "Docker および Docker Compose スクリプト",
    "ko": "Docker 및 Docker Compose 스크립팅",
    "zh": "Docker 和 Docker Compose 脚本",
    "fr": "Docker et Docker Compose Scripts",
    "de": "Docker und Docker Compose Scripting",
    "es": "Docker y Docker Compose secuencias de comandos"
  },
  "production-shell-scripting": {
    "vi": "Production Shell Scripting",
    "en": "Production Shell Scripting",
    "ja": "実稼働シェルスクリプト作成",
    "ko": "프로덕션 셸 스크립팅",
    "zh": "生产外壳脚本",
    "fr": "Scripts de shell de production",
    "de": "Produktions-Shell-Skripting",
    "es": "Secuencias de comandos de Shell de producción"
  },
  "big-o-complexity-analysis": {
    "vi": "Phân tích độ phức tạp thuật toán Big O",
    "en": "Big O & Complexity Analysis"
  },
  "arrays-strings-techniques": {
    "vi": "Kỹ thuật xử lý Mảng & Chuỗi (Two Pointers, Sliding Window)",
    "en": "Arrays & Strings Techniques"
  },
  "linked-list-stack-queue": {
    "vi": "Danh Sách Liên Kết, Ngăn Xếp & Hàng Đợi (Linked List, Stack, Queue)",
    "en": "Linked List, Stack, Queue",
    "ja": "リンクリスト、スタック、キュー",
    "ko": "연결리스트, 스택, 큐",
    "zh": "链表、栈、队列",
    "fr": "Liste chaînée, pile, file d'attente",
    "de": "Verknüpfte Liste, Stapel, Warteschlange",
    "es": "Lista enlazada, pila, cola"
  },
  "hash-maps-sets": {
    "vi": "Bảng băm (Hash Maps) & Tập hợp (Sets)",
    "en": "Hash Maps & Sets"
  },
  "binary-trees-bst": {
    "vi": "Cây nhị phân (Binary Trees) & Cây tìm kiếm nhị phân (BST)",
    "en": "Binary Trees & BST"
  },
  "recursion-backtracking": {
    "vi": "Đệ Quy & Thuật Toán Quay Lui (Recursion & Backtracking)",
    "en": "Recursion & Backtracking",
    "ja": "再帰とバックトラッキング",
    "ko": "재귀 및 역추적",
    "zh": "递归与回溯",
    "fr": "Récursion et retour en arrière",
    "de": "Rekursion und Backtracking",
    "es": "Recursión y retroceso"
  },
  "graph-algorithms": {
    "vi": "Thuật toán đồ thị (Graph Algorithms)",
    "en": "Graph Algorithms"
  },
  "dynamic-programming": {
    "vi": "Thuật toán quy hoạch động (Dynamic Programming)",
    "en": "Dynamic Programming"
  },
  "cau-truc-du-lieu-nang-cao-heap-trie-segment-tree": {
    "vi": "Cấu Trúc Dữ Liệu Nâng Cao: Heap, Trie & Segment Tree",
    "en": "Advanced Data Structures: Heap, Trie & Segment Tree",
    "ja": "高度なデータ構造: ヒープ、トライ、セグメント ツリー",
    "ko": "고급 데이터 구조: 힙, 트라이 및 세그먼트 트리",
    "zh": "高级数据结构：堆、Trie 和段树",
    "fr": "Structures de données avancées : arbre de tas, de tri et de segment",
    "de": "Erweiterte Datenstrukturen: Heap, Trie und Segmentbaum",
    "es": "Estructuras de datos avanzadas: montón, trie y árbol de segmentos"
  },
  "interview-problem-solving-patterns": {
    "vi": "Phương pháp giải bài phỏng vấn thuật toán thực chiến",
    "en": "Interview Problem-Solving Patterns"
  },
  "bien-kieu-du-lieu-trong-zig": {
    "vi": "Biến & Kiểu dữ liệu trong Zig",
    "en": "Variables & Data Types in Zig",
    "ja": "Zig の変数とデータ型",
    "ko": "Zig의 변수 및 데이터 유형",
    "zh": "Zig 中的变量和数据类型",
    "fr": "Variables et types de données dans Zig",
    "de": "Variablen und Datentypen in Zig",
    "es": "Variables y tipos de datos en Zig"
  },
  "i-o-bat-dong-bo-lap-trinh-mang": {
    "vi": "I/O Bất đồng bộ & Lập trình Mạng",
    "en": "Asynchronous I/O & Network Programming",
    "ja": "非同期 I/O およびネットワーク プログラミング",
    "ko": "비동기 I/O 및 네트워크 프로그래밍",
    "zh": "异步 I/O 和网络编程",
    "fr": "E/S asynchrones et programmation réseau",
    "de": "Asynchrone I/O- und Netzwerkprogrammierung",
    "es": "E/S asíncronas y programación de red"
  },
  "nhung-lua-interpreter-vao-chuong-trinh-c-c": {
    "vi": "Nhúng Lua Interpreter vào chương trình C/C++",
    "en": "Embed Lua Interpreter into C/C++ program",
    "ja": "Lua インタプリタを C/C++ プログラムに埋め込む",
    "ko": "C/C++ 프로그램에 Lua 인터프리터 내장",
    "zh": "将Lua解释器嵌入到C/C++程序中",
    "fr": "Intégrer Lua Interpreter dans le programme C/C++",
    "de": "Integrieren Sie den Lua-Interpreter in ein C/C++-Programm",
    "es": "Incrustar Lua Interpreter en el programa C/C++"
  },
  "classes-case-classes-pattern-matching": {
    "vi": "Classes, Case Classes & Pattern Matching",
    "en": "Classes, Case Classes & Pattern Matching",
    "ja": "クラス、ケースクラス、パターンマッチング",
    "ko": "클래스, 케이스 클래스 및 패턴 매칭",
    "zh": "类、案例类和模式匹配",
    "fr": "Classes, classes de cas et correspondance de modèles",
    "de": "Klassen, Fallklassen und Mustervergleich",
    "es": "Clases, clases de casos y coincidencia de patrones"
  },
  "he-thong-kieu-nang-cao-type-classes-implicits-givens": {
    "vi": "Hệ thống kiểu nâng cao & Type Classes (Implicits/Givens)",
    "en": "Advanced Type System & Type Classes (Implicits/Givens)",
    "ja": "高度な型システムと型クラス (暗黙的/与えられたもの)",
    "ko": "고급 유형 시스템 및 유형 클래스(암시적/주어진)",
    "zh": "高级类型系统和类型类（隐式/给定）",
    "fr": "Système de types avancé et classes de types (implicites/données)",
    "de": "Erweitertes Typsystem und Typklassen (Implizite/Gegebene)",
    "es": "Sistema de tipos avanzado y clases de tipos (implícitos/dados)"
  },
  "vue-js-overview-setup": {
    "vi": "Vue.js Overview & Setup",
    "en": "Vue.js Overview & Setup",
    "ja": "Vue.js の概要とセットアップ",
    "ko": "Vue.js 개요 및 설정",
    "zh": "Vue.js 概述和设置",
    "fr": "Vue.js Présentation et configuration",
    "de": "Vue.js Übersicht und Einrichtung",
    "es": "Descripción general y configuración de Vue.js"
  },
  "directives-reactivity": {
    "vi": "Directives & Reactivity",
    "en": "Directives & Reactivity",
    "ja": "指示と反応性",
    "ko": "지시어 및 반응성",
    "zh": "指令和反应",
    "fr": "Directives & Réactivité",
    "de": "Richtlinien und Reaktivität",
    "es": "Directivas y reactividad"
  },
  "events-methods": {
    "vi": "Events & Methods",
    "en": "Events & Methods",
    "ja": "イベントとメソッド",
    "ko": "이벤트 및 방법",
    "zh": "事件与方法",
    "fr": "Événements et méthodes",
    "de": "Ereignisse und Methoden",
    "es": "Eventos y métodos"
  },
  "components-props": {
    "vi": "Components & Props",
    "en": "Components & Props",
    "ja": "コンポーネントと小道具",
    "ko": "구성품 및 소품",
    "zh": "组件和道具",
    "fr": "Composants et accessoires",
    "de": "Komponenten und Requisiten",
    "es": "Componentes y accesorios"
  },
  "composition-api-composables": {
    "vi": "Composition API & Composables",
    "en": "Composition API & Composables",
    "ja": "コンポジション API とコンポーザブル",
    "ko": "컴포지션 API 및 컴포저블",
    "zh": "组合 API 和可组合项",
    "fr": "API de composition et Composables",
    "de": "Kompositions-API und Composables",
    "es": "API de composición y elementos componibles"
  },
  "lifecycle-watchers": {
    "vi": "Lifecycle & Watchers",
    "en": "Lifecycle & Watchers",
    "ja": "ライフサイクルとウォッチャー",
    "ko": "수명주기 및 관찰자",
    "zh": "生命周期和观察者",
    "fr": "Cycle de vie et observateurs",
    "de": "Lebenszyklus und Beobachter",
    "es": "Ciclo de vida y observadores"
  },
  "vue-router": {
    "vi": "Vue Router",
    "en": "Vue Router",
    "ja": "Vueルーター",
    "ko": "Vue 라우터",
    "zh": "Vue路由器",
    "fr": "Routeur Vue",
    "de": "Vue-Router",
    "es": "Enrutador Vue"
  },
  "pinia-state-management": {
    "vi": "Pinia State Management",
    "en": "Pinia State Management",
    "ja": "ピニア州管理",
    "ko": "피니아 상태 관리",
    "zh": "皮尼亚国家管理",
    "fr": "Gestion de l'État de Pinia",
    "de": "Pinia-Staatsverwaltung",
    "es": "Gestión del Estado de Pinia"
  },
  "nuxt-js-framework": {
    "vi": "Nuxt.js Framework",
    "en": "Nuxt.js Framework",
    "ja": "Nuxt.js フレームワーク",
    "ko": "Nuxt.js 프레임워크",
    "zh": "Nuxt.js 框架",
    "fr": "Cadre Nuxt.js",
    "de": "Nuxt.js-Framework",
    "es": "Marco Nuxt.js"
  },
  "angular-overview-cli": {
    "vi": "Angular Overview & CLI",
    "en": "Angular Overview & CLI",
    "ja": "Angular の概要と CLI",
    "ko": "각도 개요 및 CLI",
    "zh": "Angular 概述和 CLI",
    "fr": "Vue d'ensemble angulaire et CLI",
    "de": "Angular-Übersicht und CLI",
    "es": "Descripción general angular y CLI"
  },
  "templates-data-binding": {
    "vi": "Templates & Data Binding",
    "en": "Templates & Data Binding",
    "ja": "テンプレートとデータバインディング",
    "ko": "템플릿 및 데이터 바인딩",
    "zh": "模板和数据绑定",
    "fr": "Modèles et liaison de données",
    "de": "Vorlagen und Datenbindung",
    "es": "Plantillas y enlace de datos"
  },
  "components-input-output": {
    "vi": "Components & Input/Output",
    "en": "Components & Input/Output",
    "ja": "コンポーネントと入出力",
    "ko": "구성 요소 및 입력/출력",
    "zh": "组件和输入/输出",
    "fr": "Composants et entrée/sortie",
    "de": "Komponenten und Eingabe/Ausgabe",
    "es": "Componentes y entrada/salida"
  },
  "services-dependency-injection": {
    "vi": "Services & Dependency Injection",
    "en": "Services & Dependency Injection",
    "ja": "サービスと依存関係の注入",
    "ko": "서비스 및 의존성 주입",
    "zh": "服务和依赖注入",
    "fr": "Services et injection de dépendances",
    "de": "Dienste und Abhängigkeitsinjektion",
    "es": "Servicios e inyección de dependencia"
  },
  "angular-router": {
    "vi": "Angular Router",
    "en": "Angular Router",
    "ja": "アンギュラールーター",
    "ko": "각도 라우터",
    "zh": "角度路由器",
    "fr": "Routeur angulaire",
    "de": "Winkelfräser",
    "es": "Enrutador angular"
  },
  "rxjs-observables": {
    "vi": "RxJS & Observables",
    "en": "RxJS & Observables",
    "ja": "RxJS とオブザーバブル",
    "ko": "RxJS 및 관찰 가능 항목",
    "zh": "RxJS 和可观察对象",
    "fr": "RxJS et observables",
    "de": "RxJS und Observablen",
    "es": "RxJS y observables"
  },
  "reactive-forms": {
    "vi": "Reactive Forms",
    "en": "Reactive Forms",
    "ja": "反応性フォーム",
    "ko": "반응형 양식",
    "zh": "反应形式",
    "fr": "Formes réactives",
    "de": "Reaktive Formen",
    "es": "Formas reactivas"
  },
  "ngrx-state-management": {
    "vi": "NgRx State Management",
    "en": "NgRx State Management",
    "ja": "NgRx 状態管理",
    "ko": "NgRx 상태 관리",
    "zh": "NgRx 状态管理",
    "fr": "Gestion de l'état NgRx",
    "de": "NgRx-Statusverwaltung",
    "es": "Gestión del estado de NgRx"
  },
  "tailwind-css-introduction": {
    "vi": "Tailwind CSS Introduction",
    "en": "Tailwind CSS Introduction",
    "ja": "Tailwind CSS の概要",
    "ko": "순풍 CSS 소개",
    "zh": "Tailwind CSS 介绍",
    "fr": "Introduction au CSS Tailwind",
    "de": "Tailwind CSS-Einführung",
    "es": "Introducción a CSS de viento de cola"
  },
  "layout-flexbox-grid": {
    "vi": "Layout & Flexbox/Grid",
    "en": "Layout & Flexbox/Grid",
    "ja": "レイアウトとフレックスボックス/グリッド",
    "ko": "레이아웃 및 Flexbox/그리드",
    "zh": "布局和 Flexbox/网格",
    "fr": "Mise en page et Flexbox/Grille",
    "de": "Layout & Flexbox/Raster",
    "es": "Diseño y Flexbox/Cuadrícula"
  },
  "building-ui-components": {
    "vi": "Building UI Components",
    "en": "Building UI Components",
    "ja": "UIコンポーネントの構築",
    "ko": "UI 구성요소 빌드",
    "zh": "构建 UI 组件",
    "fr": "Création de composants d'interface utilisateur",
    "de": "Erstellen von UI-Komponenten",
    "es": "Creación de componentes de interfaz de usuario"
  },
  "customizing-tailwind-config": {
    "vi": "Customizing Tailwind Config",
    "en": "Customizing Tailwind Config",
    "ja": "Tailwind 構成のカスタマイズ",
    "ko": "Tailwind 구성 맞춤설정",
    "zh": "自定义 Tailwind 配置",
    "fr": "Personnalisation de la configuration Tailwind",
    "de": "Anpassen der Tailwind-Konfiguration",
    "es": "Personalización de la configuración de Tailwind"
  },
  "apply-custom-utilities": {
    "vi": "@apply & Custom Utilities",
    "en": "@apply & Custom Utilities",
    "ja": "@apply とカスタム ユーティリティ",
    "ko": "@apply 및 사용자 정의 유틸리티",
    "zh": "@apply 和自定义实用程序",
    "fr": "@apply et utilitaires personnalisés",
    "de": "@apply und benutzerdefinierte Dienstprogramme",
    "es": "@apply y utilidades personalizadas"
  },
  "animations-transitions": {
    "vi": "Animations & Transitions",
    "en": "Animations & Transitions",
    "ja": "アニメーションとトランジション",
    "ko": "애니메이션 및 전환",
    "zh": "动画和过渡",
    "fr": "Animations et transitions",
    "de": "Animationen und Übergänge",
    "es": "Animaciones y transiciones"
  },
  "tailwind-css-v4-features": {
    "vi": "Tailwind CSS v4 Features",
    "en": "Tailwind CSS v4 Features",
    "ja": "Tailwind CSS v4 の機能",
    "ko": "Tailwind CSS v4 기능",
    "zh": "Tailwind CSS v4 功能",
    "fr": "Fonctionnalités Tailwind CSS v4",
    "de": "Tailwind CSS v4-Funktionen",
    "es": "Características de Tailwind CSS v4"
  },
  "design-system-architecture": {
    "vi": "Design System Architecture",
    "en": "Design System Architecture",
    "ja": "設計システムアーキテクチャ",
    "ko": "디자인 시스템 아키텍처",
    "zh": "设计系统架构",
    "fr": "Conception de l'architecture du système",
    "de": "Design-Systemarchitektur",
    "es": "Arquitectura del sistema de diseño"
  },
  "django-overview-project-setup": {
    "vi": "Django Overview & Project Setup",
    "en": "Django Overview & Project Setup",
    "ja": "Django の概要とプロジェクトのセットアップ",
    "ko": "Django 개요 및 프로젝트 설정",
    "zh": "Django 概述和项目设置",
    "fr": "Présentation de Django et configuration du projet",
    "de": "Django-Übersicht und Projekt-Setup",
    "es": "Descripción general de Django y configuración del proyecto"
  },
  "models-django-orm": {
    "vi": "Models & Django ORM",
    "en": "Models & Django ORM",
    "ja": "モデルと Django ORM",
    "ko": "모델 및 Django ORM",
    "zh": "模型和 Django ORM",
    "fr": "Modèles et ORM Django",
    "de": "Modelle & Django ORM",
    "es": "Modelos y Django ORM"
  },
  "templates-static-files": {
    "vi": "Templates & Static Files",
    "en": "Templates & Static Files",
    "ja": "テンプレートと静的ファイル",
    "ko": "템플릿 및 정적 파일",
    "zh": "模板和静态文件",
    "fr": "Modèles et fichiers statiques",
    "de": "Vorlagen und statische Dateien",
    "es": "Plantillas y archivos estáticos"
  },
  "django-forms-validation": {
    "vi": "Django Forms & Validation",
    "en": "Django Forms & Validation",
    "ja": "Django のフォームと検証",
    "ko": "Django 양식 및 유효성 검사",
    "zh": "Django 表单和验证",
    "fr": "Formulaires et validation Django",
    "de": "Django-Formulare und -Validierung",
    "es": "Formularios y validación de Django"
  },
  "xac-thuc-nguoi-dung-phan-quyen-bao-mat-gates-policies": {
    "vi": "Xác thực người dùng & Phân quyền bảo mật (Gates/Policies)",
    "en": "User Authentication & Security Authorization (Gates/Policies)",
    "ja": "ユーザー認証とセキュリティ認可 (ゲート/ポリシー)",
    "ko": "사용자 인증 및 보안 인증(게이트/정책)",
    "zh": "用户身份验证和安全授权（门/策略）",
    "fr": "Authentification des utilisateurs et autorisation de sécurité (Portes/Politiques)",
    "de": "Benutzerauthentifizierung und Sicherheitsautorisierung (Gates/Richtlinien)",
    "es": "Autenticación de usuario y autorización de seguridad (puertas/políticas)"
  },
  "class-based-views-mixins": {
    "vi": "Class-Based Views & Mixins",
    "en": "Class-Based Views & Mixins",
    "ja": "クラスベースのビューとミックスイン",
    "ko": "클래스 기반 뷰 및 믹스인",
    "zh": "基于类的视图和混合",
    "fr": "Vues et mixins basés sur les classes",
    "de": "Klassenbasierte Ansichten und Mixins",
    "es": "Vistas y mixins basados en clases"
  },
  "production-deployment": {
    "vi": "Production Deployment",
    "en": "Production Deployment",
    "ja": "本番展開",
    "ko": "프로덕션 배포",
    "zh": "生产部署",
    "fr": "Déploiement de production",
    "de": "Produktionsbereitstellung",
    "es": "Despliegue de producción"
  },
  "queries-operators": {
    "vi": "Queries & Operators",
    "en": "Queries & Operators",
    "ja": "クエリと演算子",
    "ko": "쿼리 및 연산자",
    "zh": "查询和运算符",
    "fr": "Requêtes et opérateurs",
    "de": "Abfragen und Operatoren",
    "es": "Consultas y operadores"
  },
  "mongoose-odm": {
    "vi": "Mongoose ODM",
    "en": "Mongoose ODM",
    "ja": "マングースODM",
    "ko": "몽구스 ODM",
    "zh": "猫鼬ODM",
    "fr": "ODM de mangouste",
    "de": "Mungo ODM",
    "es": "ODM de mangosta"
  },
  "rest-api-with-express-mongodb": {
    "vi": "REST API with Express + MongoDB",
    "en": "REST API with Express + MongoDB",
    "ja": "Express + MongoDB を使用した REST API",
    "ko": "Express + MongoDB를 사용한 REST API",
    "zh": "带有 Express + MongoDB 的 REST API",
    "fr": "API REST avec Express + MongoDB",
    "de": "REST-API mit Express + MongoDB",
    "es": "API REST con Express + MongoDB"
  },
  "aggregation-pipeline": {
    "vi": "Aggregation Pipeline",
    "en": "Aggregation Pipeline",
    "ja": "集約パイプライン",
    "ko": "집계 파이프라인",
    "zh": "聚合管道",
    "fr": "Pipeline d’agrégation",
    "de": "Aggregationspipeline",
    "es": "Tubería de agregación"
  },
  "transactions-replica-sets": {
    "vi": "Transactions & Replica Sets",
    "en": "Transactions & Replica Sets",
    "ja": "トランザクションとレプリカ セット",
    "ko": "트랜잭션 및 복제본 세트",
    "zh": "交易和副本集",
    "fr": "Transactions et ensembles de répliques",
    "de": "Transaktionen und Replikatsätze",
    "es": "Transacciones y conjuntos de réplicas"
  },
  "sharding-production-architecture": {
    "vi": "Sharding & Production Architecture",
    "en": "Sharding & Production Architecture",
    "ja": "シャーディングと本番環境のアーキテクチャ",
    "ko": "샤딩 및 생산 아키텍처",
    "zh": "分片和生产架构",
    "fr": "Architecture de partage et de production",
    "de": "Sharding- und Produktionsarchitektur",
    "es": "Arquitectura de fragmentación y producción"
  },
  "graphql-vs-rest": {
    "vi": "GraphQL vs REST",
    "en": "GraphQL vs REST",
    "ja": "GraphQL と REST の比較",
    "ko": "GraphQL과 REST",
    "zh": "GraphQL 与 REST",
    "fr": "GraphQL contre REST",
    "de": "GraphQL vs. REST",
    "es": "GraphQL frente a DESCANSO"
  },
  "schema-types": {
    "vi": "Schema & Types",
    "en": "Schema & Types",
    "ja": "スキーマと型",
    "ko": "스키마 및 유형",
    "zh": "架构和类型",
    "fr": "Schéma et types",
    "de": "Schema und Typen",
    "es": "Esquema y tipos"
  },
  "building-resolvers": {
    "vi": "Building Resolvers",
    "en": "Building Resolvers",
    "ja": "リゾルバーの構築",
    "ko": "리졸버 구축",
    "zh": "构建解析器",
    "fr": "Construire des résolveurs",
    "de": "Gebäudelöser",
    "es": "Construyendo solucionadores"
  },
  "apollo-client-frontend": {
    "vi": "Apollo Client (Frontend)",
    "en": "Apollo Client (Frontend)",
    "ja": "Apollo クライアント (フロントエンド)",
    "ko": "Apollo 클라이언트(프런트엔드)",
    "zh": "Apollo 客户端（前端）",
    "fr": "Client Apollo (frontal)",
    "de": "Apollo-Client (Frontend)",
    "es": "Cliente Apollo (frontal)"
  },
  "real-time-subscriptions": {
    "vi": "Real-time Subscriptions",
    "en": "Real-time Subscriptions",
    "ja": "リアルタイムのサブスクリプション",
    "ko": "실시간 구독",
    "zh": "实时订阅",
    "fr": "Abonnements en temps réel",
    "de": "Echtzeit-Abonnements",
    "es": "Suscripciones en tiempo real"
  },
  "dataloader-n-1-problem": {
    "vi": "DataLoader & N+1 Problem",
    "en": "DataLoader & N+1 Problem",
    "ja": "データローダーと N+1 問題",
    "ko": "DataLoader 및 N+1 문제",
    "zh": "DataLoader & N+1 问题",
    "fr": "Problème de chargeur de données et N+1",
    "de": "DataLoader & N+1-Problem",
    "es": "Cargador de datos y problema N+1"
  },
  "apollo-federation-microservices": {
    "vi": "Apollo Federation & Microservices",
    "en": "Apollo Federation & Microservices",
    "ja": "Apollo フェデレーションとマイクロサービス",
    "ko": "Apollo 페더레이션 및 마이크로서비스",
    "zh": "Apollo 联盟和微服务",
    "fr": "Fédération Apollo et microservices",
    "de": "Apollo Federation & Microservices",
    "es": "Federación Apollo y microservicios"
  },
  "kubernetes-overview-architecture": {
    "vi": "Kubernetes Overview & Architecture",
    "en": "Kubernetes Overview & Architecture",
    "ja": "Kubernetes の概要とアーキテクチャ",
    "ko": "Kubernetes 개요 및 아키텍처",
    "zh": "Kubernetes 概述与架构",
    "fr": "Présentation et architecture de Kubernetes",
    "de": "Kubernetes-Übersicht und -Architektur",
    "es": "Descripción general y arquitectura de Kubernetes"
  },
  "deployments-services": {
    "vi": "Deployments & Services",
    "en": "Deployments & Services",
    "ja": "Deployments & Services",
    "ko": "배포 및 서비스",
    "zh": "部署和服务",
    "fr": "Déploiements et services",
    "de": "Bereitstellungen und Dienste",
    "es": "Implementaciones y servicios"
  },
  "configmaps-secrets": {
    "vi": "ConfigMaps & Secrets",
    "en": "ConfigMaps & Secrets",
    "ja": "ConfigMap とシークレット",
    "ko": "ConfigMap 및 비밀",
    "zh": "配置映射和秘密",
    "fr": "ConfigMaps & Secrets",
    "de": "ConfigMaps & Secrets",
    "es": "ConfigMapas y secretos"
  },
  "auto-scaling-rolling-updates": {
    "vi": "Auto-Scaling & Rolling Updates",
    "en": "Auto-Scaling & Rolling Updates",
    "ja": "自動スケーリングとローリングアップデート",
    "ko": "자동 확장 및 롤링 업데이트",
    "zh": "自动缩放和滚动更新",
    "fr": "Mises à jour automatiques et progressives",
    "de": "Automatische Skalierung und fortlaufende Updates",
    "es": "Actualizaciones continuas y de escala automática"
  },
  "ingress-networking": {
    "vi": "Ingress & Networking",
    "en": "Ingress & Networking",
    "ja": "Ingress & Networking",
    "ko": "수신 및 네트워킹",
    "zh": "入口和网络",
    "fr": "Entrée et réseautage",
    "de": "Ingress & Networking",
    "es": "Ingreso y redes"
  },
  "helm-charts-templating": {
    "vi": "Helm Charts & Templating",
    "en": "Helm Charts & Templating",
    "ja": "Helm Charts & Templating",
    "ko": "투구 차트 및 템플릿",
    "zh": "Helm 图表和模板",
    "fr": "Graphiques et modèles de barre",
    "de": "Helmdiagramme und Vorlagen",
    "es": "Gráficos y plantillas de timón"
  },
  "production-k8s-architecture": {
    "vi": "Production K8s Architecture",
    "en": "Production K8s Architecture",
    "ja": "プロダクション K8s アーキテクチャ",
    "ko": "프로덕션 K8s 아키텍처",
    "zh": "生产 K8s 架构",
    "fr": "Architecture des K8 de production",
    "de": "Produktions-K8s-Architektur",
    "es": "Arquitectura de producción K8"
  },
  "ci-cd-concepts-github-actions": {
    "vi": "CI/CD Concepts & GitHub Actions",
    "en": "CI/CD Concepts & GitHub Actions",
    "ja": "CI/CD の概念と GitHub アクション",
    "ko": "CI/CD 개념 및 GitHub 작업",
    "zh": "CI/CD 概念和 GitHub 操作",
    "fr": "Concepts CI/CD et actions GitHub",
    "de": "CI/CD-Konzepte und GitHub-Aktionen",
    "es": "Conceptos de CI/CD y acciones de GitHub"
  },
  "automated-deployment": {
    "vi": "Automated Deployment",
    "en": "Automated Deployment",
    "ja": "自動展開",
    "ko": "자동화된 배포",
    "zh": "自动化部署",
    "fr": "Déploiement automatisé",
    "de": "Automatisierte Bereitstellung",
    "es": "Implementación automatizada"
  },
  "docker-build-push-in-ci": {
    "vi": "Docker Build & Push in CI",
    "en": "Docker Build & Push in CI",
    "ja": "CI での Docker のビルドとプッシュ",
    "ko": "CI의 Docker 빌드 및 푸시",
    "zh": "Docker 在 CI 中构建和推送",
    "fr": "Docker Build et Push dans CI",
    "de": "Docker Build & Push in CI",
    "es": "Docker construye e inserta en CI"
  },
  "matrix-strategy-reusable-workflows": {
    "vi": "Matrix Strategy & Reusable Workflows",
    "en": "Matrix Strategy & Reusable Workflows",
    "ja": "マトリックス戦略と再利用可能なワークフロー",
    "ko": "매트릭스 전략 및 재사용 가능한 워크플로우",
    "zh": "矩阵策略和可重用工作流程",
    "fr": "Stratégie matricielle et flux de travail réutilisables",
    "de": "Matrixstrategie und wiederverwendbare Workflows",
    "es": "Estrategia matricial y flujos de trabajo reutilizables"
  },
  "monorepo-conditional-workflows": {
    "vi": "Monorepo & Conditional Workflows",
    "en": "Monorepo & Conditional Workflows",
    "ja": "モノリポジトリと条件付きワークフロー",
    "ko": "모노레포 및 조건부 워크플로",
    "zh": "Monorepo 和条件工作流程",
    "fr": "Monorepo et flux de travail conditionnels",
    "de": "Monorepo und bedingte Workflows",
    "es": "Monorepo y flujos de trabajo condicionales"
  },
  "security-scanning-quality-gates": {
    "vi": "Security Scanning & Quality Gates",
    "en": "Security Scanning & Quality Gates",
    "ja": "セキュリティスキャンと品質ゲート",
    "ko": "보안 스캐닝 및 품질 게이트",
    "zh": "安全扫描和质量门",
    "fr": "Analyse de sécurité et contrôles de qualité",
    "de": "Sicherheitsscans und Qualitätstore",
    "es": "Escaneo de seguridad y puertas de calidad"
  },
  "gitops-multi-environment": {
    "vi": "GitOps & Multi-Environment",
    "en": "GitOps & Multi-Environment",
    "ja": "GitOps とマルチ環境",
    "ko": "GitOps 및 다중 환경",
    "zh": "GitOps 和多环境",
    "fr": "GitOps et multi-environnement",
    "de": "GitOps und Multi-Umgebung",
    "es": "GitOps y entornos múltiples"
  },
  "nginx-overview-installation": {
    "vi": "Nginx Overview & Installation",
    "en": "Nginx Overview & Installation",
    "ja": "Nginx の概要とインストール",
    "ko": "Nginx 개요 및 설치",
    "zh": "Nginx 概述和安装",
    "fr": "Présentation et installation de Nginx",
    "de": "Nginx-Übersicht und Installation",
    "es": "Descripción general e instalación de Nginx"
  },
  "reverse-proxy-node-js": {
    "vi": "Reverse Proxy & Node.js",
    "en": "Reverse Proxy & Node.js",
    "ja": "リバースプロキシとNode.js",
    "ko": "역방향 프록시 및 Node.js",
    "zh": "反向代理和 Node.js",
    "fr": "Proxy inverse et Node.js",
    "de": "Reverse Proxy und Node.js",
    "es": "Proxy inverso y Node.js"
  },
  "ssl-tls-https": {
    "vi": "SSL/TLS & HTTPS",
    "en": "SSL/TLS & HTTPS",
    "ja": "SSL/TLS と HTTPS",
    "ko": "SSL/TLS 및 HTTPS",
    "zh": "SSL/TLS 和 HTTPS",
    "fr": "SSL/TLS et HTTPS",
    "de": "SSL/TLS und HTTPS",
    "es": "SSL/TLS y HTTPS"
  },
  "load-balancing": {
    "vi": "Load Balancing",
    "en": "Load Balancing",
    "ja": "ロードバランシング",
    "ko": "로드 밸런싱",
    "zh": "负载均衡",
    "fr": "Équilibrage de charge",
    "de": "Lastausgleich",
    "es": "Equilibrio de carga"
  },
  "linux-server-administration": {
    "vi": "Linux Server Administration",
    "en": "Linux Server Administration",
    "ja": "Linuxサーバー管理",
    "ko": "Linux 서버 관리",
    "zh": "Linux 服务器管理",
    "fr": "Administration du serveur Linux",
    "de": "Linux-Server-Administration",
    "es": "Administración del servidor Linux"
  },
  "production-infrastructure": {
    "vi": "Production Infrastructure",
    "en": "Production Infrastructure",
    "ja": "生産インフラ",
    "ko": "생산 인프라",
    "zh": "生产基础设施",
    "fr": "Infrastructures de production",
    "de": "Produktionsinfrastruktur",
    "es": "Infraestructura de producción"
  },
  "cu-phap-co-ban-nen-tang": {
    "vi": "Cú pháp cơ bản & nền tảng",
    "en": "Basic Syntax & Fundamentals",
    "ja": "基本構文と基礎",
    "ko": "기본 구문 및 기초",
    "zh": "基础语法与基石",
    "fr": "Syntaxe de base et fondamentaux",
    "de": "Grundlegende Syntax & Grundlagen",
    "es": "Sintaxis básica y fundamentos"
  },
  "templates-stl-modern-c": {
    "vi": "Templates, STL & Modern C++",
    "en": "Templates, STL & Modern C++",
    "ja": "テンプレート、STL、最新の C++",
    "ko": "템플릿, STL 및 최신 C++",
    "zh": "模板、STL 和现代 C++",
    "fr": "Modèles, STL et C++ moderne",
    "de": "Vorlagen, STL und modernes C++",
    "es": "Plantillas, STL y C++ moderno"
  },
  "da-luong-mau-thiet-ke-toi-uu-hieu-nang": {
    "vi": "Đa luồng, Mẫu thiết kế & Tối ưu hiệu năng",
    "en": "Multithreading, Design Patterns & Performance Optimization",
    "ja": "マルチスレッド、デザインパターン、パフォーマンスの最適化",
    "ko": "멀티스레딩, 디자인 패턴 및 성능 최적화",
    "zh": "多线程、设计模式和性能优化",
    "fr": "Multithreading, modèles de conception et optimisation des performances",
    "de": "Multithreading, Designmuster und Leistungsoptimierung",
    "es": "Multiproceso, patrones de diseño y optimización del rendimiento"
  },
  "metaprogramming-system-design": {
    "vi": "Metaprogramming & System Design",
    "en": "Metaprogramming & System Design",
    "ja": "メタプログラミングとシステム設計",
    "ko": "메타프로그래밍 및 시스템 설계",
    "zh": "元编程和系统设计",
    "fr": "Métaprogrammation et conception de systèmes",
    "de": "Metaprogrammierung und Systemdesign",
    "es": "Metaprogramación y diseño de sistemas"
  },
  "syntax-co-ban-python": {
    "vi": "Syntax cơ bản Python",
    "en": "Basic Python Syntax",
    "ja": "基本的な Python 構文",
    "ko": "기본 Python 구문",
    "zh": "基本 Python 语法",
    "fr": "Syntaxe Python de base",
    "de": "Grundlegende Python-Syntax",
    "es": "Sintaxis básica de Python"
  },
  "oop-modules-xu-ly-ngoai-le": {
    "vi": "OOP, Modules & Xử lý ngoại lệ",
    "en": "OOP, Modules & Xử lý ngoại lệ",
    "ja": "OOP、モジュール、例外処理",
    "ko": "OOP, 모듈 및 예외 처리",
    "zh": "OOP、模块和异常处理",
    "fr": "POO, modules et gestion des exceptions",
    "de": "OOP, Module und Ausnahmebehandlung",
    "es": "POO, módulos y manejo de excepciones"
  },
  "decorators-generators-ky-thuat-nang-cao": {
    "vi": "Decorators, Generators & Kỹ thuật nâng cao",
    "en": "Decorators, Generators & Kỹ thuật nâng cao",
    "ja": "デコレーター、ジェネレーター、高度なテクニック",
    "ko": "데코레이터, 생성기 및 고급 기술",
    "zh": "装饰器、生成器和先进技术",
    "fr": "Décorateurs, générateurs et techniques avancées",
    "de": "Dekorateure, Generatoren und fortgeschrittene Techniken",
    "es": "Decoradores, Generadores y Técnicas Avanzadas"
  },
  "lap-trinh-bat-dong-bo-kiem-thu-web-frameworks": {
    "vi": "Lập trình Bất đồng bộ, Kiểm thử & Web Frameworks",
    "en": "Asynchronous Programming, Testing & Web Frameworks",
    "ja": "非同期プログラミング、テスト、Web フレームワーク",
    "ko": "비동기 프로그래밍, 테스트 및 웹 프레임워크",
    "zh": "异步编程、测试和 Web 框架",
    "fr": "Programmation asynchrone, tests et frameworks Web",
    "de": "Asynchrone Programmierung, Tests und Web-Frameworks",
    "es": "Programación asincrónica, pruebas y marcos web"
  },
  "metaclasses-toi-uu-hieu-nang-cpython": {
    "vi": "Metaclasses & Tối ưu hiệu năng CPython",
    "en": "Metaclasses & CPython Performance Optimization",
    "ja": "メタクラスと CPython パフォーマンスの最適化",
    "ko": "메타클래스 및 CPython 성능 최적화",
    "zh": "元类和 CPython 性能优化",
    "fr": "Métaclasses et optimisation des performances CPython",
    "de": "Metaklassen und CPython-Leistungsoptimierung",
    "es": "Metaclases y optimización del rendimiento de CPython"
  },
  "design-patterns-database": {
    "vi": "Design Patterns & Database",
    "en": "Design Patterns & Databases",
    "ja": "デザインパターンとデータベース",
    "ko": "디자인 패턴 및 데이터베이스",
    "zh": "设计模式和数据库",
    "fr": "Modèles de conception et bases de données",
    "de": "Entwurfsmuster und Datenbanken",
    "es": "Patrones de diseño y bases de datos"
  },
  "nen-tang-node-js-mo-hinh-event-loop": {
    "vi": "Nền tảng Node.js & Mô hình Event Loop",
    "en": "Node.js Platform & Event Loop Model",
    "ja": "Node.js プラットフォームとイベント ループ モデル",
    "ko": "Node.js 플랫폼 및 이벤트 루프 모델",
    "zh": "Node.js 平台和事件循环模型",
    "fr": "Plateforme Node.js et modèle de boucle d'événements",
    "de": "Node.js-Plattform- und Ereignisschleifenmodell",
    "es": "Plataforma Node.js y modelo de bucle de eventos"
  },
  "express-rest-api": {
    "vi": "Express & REST API",
    "en": "Express & REST API",
    "ja": "Express API と REST API",
    "ko": "익스프레스 및 REST API",
    "zh": "Express 和 REST API",
    "fr": "API Express et REST",
    "de": "Express- und REST-APIs",
    "es": "API exprés y REST"
  },
  "testing-architecture-middleware": {
    "vi": "Testing, Architecture & Middleware",
    "en": "Testing, Architecture & Middleware",
    "ja": "テスト、アーキテクチャ、ミドルウェア",
    "ko": "테스트, 아키텍처 및 미들웨어",
    "zh": "测试、架构和中间件",
    "fr": "Tests, architecture et middleware",
    "de": "Testen, Architektur und Middleware",
    "es": "Pruebas, arquitectura y middleware"
  },
  "microservices-devops": {
    "vi": "Microservices & DevOps",
    "en": "Microservices & DevOps",
    "ja": "マイクロサービスとDevOps",
    "ko": "마이크로서비스 및 DevOps",
    "zh": "微服务和开发运营",
    "fr": "Microservices et DevOps",
    "de": "Microservices und DevOps",
    "es": "Microservicios y DevOps"
  },
  "system-design-internals": {
    "vi": "System Design & Internals",
    "en": "System Design & Internals",
    "ja": "システム設計と内部構造",
    "ko": "시스템 설계 및 내부",
    "zh": "系统设计和内部结构",
    "fr": "Conception du système et composants internes",
    "de": "Systemdesign und Interna",
    "es": "Diseño del sistema e internos"
  },
  "custom-hooks-context-performance": {
    "vi": "Custom Hooks, Context & Performance",
    "en": "Custom Hooks, Context & Performance",
    "ja": "カスタムフック、コンテキスト、パフォーマンス",
    "ko": "맞춤형 후크, 컨텍스트 및 성능",
    "zh": "自定义 Hook、上下文和性能",
    "fr": "Hooks personnalisés, contexte et performances",
    "de": "Benutzerdefinierte Hooks, Kontext und Leistung",
    "es": "Ganchos personalizados, contexto y rendimiento"
  },
  "patterns-server-components": {
    "vi": "Patterns & Server Components",
    "en": "Patterns & Server Components",
    "ja": "パターンとサーバーコンポーネント",
    "ko": "패턴 및 서버 구성 요소",
    "zh": "模式和服务器组件",
    "fr": "Modèles et composants de serveur",
    "de": "Muster und Serverkomponenten",
    "es": "Patrones y componentes del servidor"
  },
  "internals-react-19": {
    "vi": "Internals & React 19",
    "en": "Internals & React 19",
    "ja": "内部構造と React 19",
    "ko": "내부 및 반응 19",
    "zh": "内部结构和反应 19",
    "fr": "Internes et React 19",
    "de": "Interna & Reaktion 19",
    "es": "Internos y reaccionar 19"
  },
  "html5-css-co-ban": {
    "vi": "HTML5 & CSS cơ bản",
    "en": "Basic HTML5 & CSS",
    "ja": "基本的な HTML5 と CSS",
    "ko": "기본 HTML5 및 CSS",
    "zh": "基本 HTML5 和 CSS",
    "fr": "HTML5 et CSS de base",
    "de": "Grundlegendes HTML5 und CSS",
    "es": "HTML5 y CSS básicos"
  },
  "flexbox-grid-responsive": {
    "vi": "Flexbox, Grid & Responsive",
    "en": "Flexbox, Grid & Responsive",
    "ja": "フレックスボックス、グリッド、レスポンシブ",
    "ko": "Flexbox, 그리드 및 반응형",
    "zh": "Flexbox、网格和响应式",
    "fr": "Flexbox, grille et réactif",
    "de": "Flexbox, Grid & Responsive",
    "es": "Flexbox, cuadrícula y responsivo"
  },
  "animations-variables-modern-css": {
    "vi": "Animations, Variables & Modern CSS",
    "en": "Animations, Variables & Modern CSS",
    "ja": "アニメーション、変数、最新の CSS",
    "ko": "애니메이션, 변수 및 최신 CSS",
    "zh": "动画、变量和现代 CSS",
    "fr": "Animations, variables et CSS modernes",
    "de": "Animationen, Variablen und modernes CSS",
    "es": "Animaciones, variables y CSS moderno"
  },
  "css-architecture-design-systems": {
    "vi": "CSS Architecture & Design Systems",
    "en": "CSS Architecture & Design Systems",
    "ja": "CSS アーキテクチャとデザイン システム",
    "ko": "CSS 아키텍처 및 디자인 시스템",
    "zh": "CSS 架构和设计系统",
    "fr": "Architecture et systèmes de conception CSS",
    "de": "CSS-Architektur- und Designsysteme",
    "es": "Sistemas de diseño y arquitectura CSS"
  },
  "advanced-css-houdini": {
    "vi": "Advanced CSS & Houdini",
    "en": "Advanced CSS & Houdini",
    "ja": "高度な CSS と Houdini",
    "ko": "고급 CSS 및 Houdini",
    "zh": "高级 CSS 和 Houdini",
    "fr": "CSS avancé et Houdini",
    "de": "Erweitertes CSS und Houdini",
    "es": "CSS avanzado y Houdini"
  },
  "sql-co-ban-crud": {
    "vi": "SQL cơ bản & CRUD",
    "en": "Basic SQL & CRUD",
    "ja": "基本的な SQL と CRUD",
    "ko": "기본 SQL 및 CRUD",
    "zh": "基本 SQL 和 CRUD",
    "fr": "SQL de base et CRUD",
    "de": "Grundlegendes SQL und CRUD",
    "es": "SQL básico y CRUD"
  },
  "joins-advanced-queries": {
    "vi": "JOINs & Advanced Queries",
    "en": "JOINs & Advanced Queries",
    "ja": "JOIN と高度なクエリ",
    "ko": "조인 및 고급 쿼리",
    "zh": "JOIN 和高级查询",
    "fr": "JOINs et requêtes avancées",
    "de": "JOINs und erweiterte Abfragen",
    "es": "UNIONES y consultas avanzadas"
  },
  "indexing-transactions-optimization": {
    "vi": "Indexing, Transactions & Optimization",
    "en": "Indexing, Transactions & Optimization",
    "ja": "インデックス作成、トランザクション、最適化",
    "ko": "인덱싱, 트랜잭션 및 최적화",
    "zh": "索引、交易和优化",
    "fr": "Indexation, transactions et optimisation",
    "de": "Indizierung, Transaktionen und Optimierung",
    "es": "Indexación, transacciones y optimización"
  },
  "performance-distributed": {
    "vi": "Performance & Distributed",
    "en": "Performance & Distributed",
    "ja": "パフォーマンスと分散",
    "ko": "성능 및 분산",
    "zh": "性能与分布式",
    "fr": "Performances et distribution",
    "de": "Leistung und Verteilung",
    "es": "Rendimiento y distribuido"
  },
  "database-architecture-internals": {
    "vi": "Database Architecture & Internals",
    "en": "Database Architecture & Internals",
    "ja": "データベースのアーキテクチャと内部構造",
    "ko": "데이터베이스 아키텍처 및 내부",
    "zh": "数据库架构和内部结构",
    "fr": "Architecture de base de données et composants internes",
    "de": "Datenbankarchitektur und Interna",
    "es": "Arquitectura e componentes internos de la base de datos"
  },
  "mocking-async-testing": {
    "vi": "Mocking & Async Testing",
    "en": "Mocking & Async Testing",
    "ja": "モッキングと非同期テスト",
    "ko": "모의 및 비동기 테스트",
    "zh": "模拟和异步测试",
    "fr": "Tests moqueurs et asynchrones",
    "de": "Mocking und Async-Tests",
    "es": "Pruebas simuladas y asincrónicas"
  },
  "integration-advanced-testing": {
    "vi": "Integration & Advanced Testing",
    "en": "Integration & Advanced Testing",
    "ja": "統合と高度なテスト",
    "ko": "통합 및 고급 테스트",
    "zh": "集成和高级测试",
    "fr": "Intégration et tests avancés",
    "de": "Integration und erweiterte Tests",
    "es": "Integración y pruebas avanzadas"
  },
  "advanced-testing-patterns": {
    "vi": "Advanced Testing Patterns",
    "en": "Advanced Testing Patterns",
    "ja": "高度なテストパターン",
    "ko": "고급 테스트 패턴",
    "zh": "高级测试模式",
    "fr": "Modèles de tests avancés",
    "de": "Erweiterte Testmuster",
    "es": "Patrones de prueba avanzados"
  },
  "testing-architecture-philosophy": {
    "vi": "Testing Architecture & Philosophy",
    "en": "Testing Architecture & Philosophy",
    "ja": "アーキテクチャと哲学のテスト",
    "ko": "아키텍처 및 철학 테스트",
    "zh": "测试架构和理念",
    "fr": "Architecture et philosophie des tests",
    "de": "Architektur und Philosophie testen",
    "es": "Pruebas de arquitectura y filosofía"
  },
  "git-docker-co-ban": {
    "vi": "Git & Docker cơ bản",
    "en": "Basic Git & Docker",
    "ja": "基本的な Git と Docker",
    "ko": "기본 Git 및 도커",
    "zh": "基本的 Git 和 Docker",
    "fr": "Git et Docker de base",
    "de": "Grundlegendes Git und Docker",
    "es": "Git básico y Docker"
  },
  "branching-compose-workflows": {
    "vi": "Branching, Compose & Workflows",
    "en": "Branching, Compose & Workflows",
    "ja": "分岐、構成、ワークフロー",
    "ko": "분기, 구성 및 워크플로",
    "zh": "分支、撰写和工作流程",
    "fr": "Branchement, composition et flux de travail",
    "de": "Verzweigung, Verfassen und Workflows",
    "es": "Ramificación, redacción y flujos de trabajo"
  },
  "ci-cd-advanced-docker-git": {
    "vi": "CI/CD, Advanced Docker & Git",
    "en": "CI/CD, Advanced Docker & Git",
    "ja": "CI/CD、高度な Docker および Git",
    "ko": "CI/CD, 고급 도커 및 Git",
    "zh": "CI/CD、高级 Docker 和 Git",
    "fr": "CI/CD, Docker avancé et Git",
    "de": "CI/CD, Advanced Docker und Git",
    "es": "CI/CD, Docker avanzado y Git"
  },
  "docker-security-orchestration": {
    "vi": "Docker Security & Orchestration",
    "en": "Docker Security & Orchestration",
    "ja": "Docker のセキュリティとオーケストレーション",
    "ko": "Docker 보안 및 오케스트레이션",
    "zh": "Docker 安全与编排",
    "fr": "Sécurité et orchestration Docker",
    "de": "Docker-Sicherheit und Orchestrierung",
    "es": "Seguridad y orquestación de Docker"
  },
  "types-co-ban-interfaces": {
    "vi": "Types cơ bản & Interfaces",
    "en": "Basic Types & Interfaces",
    "ja": "基本的な型とインターフェイス",
    "ko": "기본 유형 및 인터페이스",
    "zh": "基本类型和接口",
    "fr": "Types et interfaces de base",
    "de": "Grundlegende Typen und Schnittstellen",
    "es": "Tipos e interfaces básicos"
  },
  "advanced-types-type-guards": {
    "vi": "Advanced types & Type Guards",
    "en": "Advanced types & Type Guards",
    "ja": "高度なタイプとタイプガード",
    "ko": "고급 유형 및 유형 가드",
    "zh": "高级类型和类型防护",
    "fr": "Types avancés et gardes de type",
    "de": "Erweiterte Typen und Typwächter",
    "es": "Tipos avanzados y protectores de tipo"
  },
  "declaration-files-type-level-programming": {
    "vi": "Declaration files, Type-Level Programming",
    "en": "Declaration files, Type-Level Programming",
    "ja": "宣言ファイル、タイプレベルプログラミング",
    "ko": "선언 파일, 유형 수준 프로그래밍",
    "zh": "声明文件，类型级编程",
    "fr": "Fichiers de déclaration, programmation au niveau du type",
    "de": "Deklarationsdateien, Programmierung auf Typebene",
    "es": "Archivos de declaración, programación a nivel de tipo"
  },
  "compiler-api-custom-transformers": {
    "vi": "Compiler API & Custom Transformers",
    "en": "Compiler API & Custom Transformers",
    "ja": "コンパイラー API とカスタム トランスフォーマー",
    "ko": "컴파일러 API 및 사용자 정의 변환기",
    "zh": "编译器 API 和自定义转换器",
    "fr": "API du compilateur et transformateurs personnalisés",
    "de": "Compiler-API und benutzerdefinierte Transformatoren",
    "es": "API del compilador y transformadores personalizados"
  },
  "c-co-ban": {
    "vi": "C# cơ bản",
    "en": "Basic C#",
    "ja": "基本的な C#",
    "ko": "기본 C#",
    "zh": "基础 C#",
    "fr": "C# de base",
    "de": "Grundlegendes C#",
    "es": "C# básico"
  },
  "bat-dong-bo-generics-asp-net-core": {
    "vi": "Bất đồng bộ, Generics & ASP.NET Core",
    "en": "Asynchronous, Generics & ASP.NET Core",
    "ja": "非同期、ジェネリック、ASP.NET Core",
    "ko": "비동기식, 제네릭 및 ASP.NET Core",
    "zh": "异步、泛型和 ASP.NET Core",
    "fr": "Asynchrone, génériques et ASP.NET Core",
    "de": "Asynchron, generisch und ASP.NET Core",
    "es": "Asíncrono, genéricos y ASP.NET Core"
  },
  "entity-framework-core-dependency-injection-kien-truc": {
    "vi": "Entity Framework Core, Dependency Injection & Kiến trúc",
    "en": "Entity Framework Core, Dependency Injection & Architecture",
    "ja": "Entity Framework コア、依存性注入、アーキテクチャ",
    "ko": "Entity Framework 핵심, 종속성 주입 및 아키텍처",
    "zh": "实体框架核心、依赖注入和架构",
    "fr": "Entity Framework Core, injection de dépendances et architecture",
    "de": "Entity Framework Core, Dependency Injection und Architektur",
    "es": "Núcleo de Entity Framework, inyección de dependencias y arquitectura"
  },
  "toi-uu-hieu-nang-tinh-nang-net-nang-cao": {
    "vi": "Tối ưu hiệu năng & Tính năng .NET nâng cao",
    "en": "Performance Optimization & Advanced .NET Features",
    "ja": "パフォーマンスの最適化と高度な .NET 機能",
    "ko": "성능 최적화 및 고급 .NET 기능",
    "zh": "性能优化和高级 .NET 功能",
    "fr": "Optimisation des performances et fonctionnalités .NET avancées",
    "de": "Leistungsoptimierung und erweiterte .NET-Funktionen",
    "es": "Optimización del rendimiento y funciones avanzadas de .NET"
  },
  "kien-truc-he-thong-thiet-ke-phan-tan-net": {
    "vi": "Kiến trúc hệ thống & Thiết kế phân tán .NET",
    "en": "System Architecture & .NET Distributed Design",
    "ja": "システム アーキテクチャと .NET 分散設計",
    "ko": "시스템 아키텍처 및 .NET 분산 설계",
    "zh": "系统架构与.NET分布式设计",
    "fr": "Architecture système et conception distribuée .NET",
    "de": "Systemarchitektur und verteiltes .NET-Design",
    "es": "Arquitectura del sistema y diseño distribuido .NET"
  },
  "concurrency-nang-cao-kien-truc-microservices-go": {
    "vi": "Concurrency nâng cao & Kiến trúc Microservices Go",
    "en": "Advanced Concurrency & Go Microservices Architecture",
    "ja": "高度な同時実行性と Go マイクロサービス アーキテクチャ",
    "ko": "고급 동시성 및 Go 마이크로서비스 아키텍처",
    "zh": "高级并发和 Go 微服务架构",
    "fr": "Architecture avancée de microservices de concurrence et Go",
    "de": "Erweiterte Concurrency & Go Microservices-Architektur",
    "es": "Arquitectura avanzada de microservicios Go y concurrencia"
  },
  "go-runtime-system-programming": {
    "vi": "Go Runtime & System Programming",
    "en": "Go Runtime & System Programming",
    "ja": "Go ランタイムとシステム プログラミング",
    "ko": "런타임 및 시스템 프로그래밍으로 이동",
    "zh": "Go 运行时和系统编程",
    "fr": "Aller à la programmation d'exécution et du système",
    "de": "Gehen Sie zur Laufzeit- und Systemprogrammierung",
    "es": "Ir a la programación del sistema y del tiempo de ejecución"
  },
  "traits-generics-lifetimes": {
    "vi": "Traits, Generics & Lifetimes",
    "en": "Traits, Generics & Lifetimes",
    "ja": "特性、ジェネリック、寿命",
    "ko": "특성, 제네릭 및 수명",
    "zh": "特征、泛型和生命周期",
    "fr": "Traits, génériques et durées de vie",
    "de": "Merkmale, Generika und Lebenszeiten",
    "es": "Rasgos, genéricos y vidas útiles"
  },
  "async-concurrency-crates": {
    "vi": "Async, Concurrency & Crates",
    "en": "Async, Concurrency & Crates",
    "ja": "非同期、同時実行、クレート",
    "ko": "비동기, 동시성 및 크레이트",
    "zh": "异步、并发和 Crates",
    "fr": "Asynchrone, concurrence et caisses",
    "de": "Asynchron, Parallelität und Kisten",
    "es": "Asíncrono, concurrencia y cajas"
  },
  "macros-advanced-patterns": {
    "vi": "Macros & Advanced Patterns",
    "en": "Macros & Advanced Patterns",
    "ja": "マクロと高度なパターン",
    "ko": "매크로 및 고급 패턴",
    "zh": "宏和高级模式",
    "fr": "Macros et modèles avancés",
    "de": "Makros und erweiterte Muster",
    "es": "Macros y patrones avanzados"
  },
  "advanced-systems-wasm": {
    "vi": "Advanced Systems & WASM",
    "en": "Advanced Systems & WASM",
    "ja": "高度なシステムと WASM",
    "ko": "고급 시스템 및 WASM",
    "zh": "先进系统和 WASM",
    "fr": "Systèmes avancés et WASM",
    "de": "Erweiterte Systeme und WASM",
    "es": "Sistemas avanzados y WASM"
  },
  "laravel-advanced-testing": {
    "vi": "Laravel Advanced & Testing",
    "en": "Laravel Advanced & Testing",
    "ja": "Laravel の高度なテストとテスト",
    "ko": "Laravel 고급 및 테스트",
    "zh": "Laravel 高级和测试",
    "fr": "Laravel avancé et tests",
    "de": "Laravel Advanced & Testing",
    "es": "Laravel avanzado y pruebas"
  },
  "architecture-performance": {
    "vi": "Architecture & Performance",
    "en": "Architecture & Performance",
    "ja": "アーキテクチャとパフォーマンス",
    "ko": "아키텍처 및 성능",
    "zh": "架构与性能",
    "fr": "Architecture & Performances",
    "de": "Architektur & Leistung",
    "es": "Arquitectura y Performance"
  },
  "advanced-laravel-packages": {
    "vi": "Advanced Laravel & Packages",
    "en": "Advanced Laravel & Packages",
    "ja": "高度な Laravel とパッケージ",
    "ko": "고급 Laravel 및 패키지",
    "zh": "高级 Laravel 和软件包",
    "fr": "Laravel avancé et packages",
    "de": "Erweitertes Laravel und Pakete",
    "es": "Laravel avanzado y paquetes"
  },
  "php-internals-scaling": {
    "vi": "PHP Internals & Scaling",
    "en": "PHP Internals & Scaling",
    "ja": "PHP の内部構造とスケーリング",
    "ko": "PHP 내부 및 확장",
    "zh": "PHP 内部结构和扩展",
    "fr": "Fonctions internes et mise à l'échelle de PHP",
    "de": "PHP-Interna und Skalierung",
    "es": "Componentes internos y escalado de PHP"
  },
  "kmp-advanced-patterns": {
    "vi": "KMP & Advanced Patterns",
    "en": "KMP & Advanced Patterns",
    "ja": "KMP と高度なパターン",
    "ko": "KMP 및 고급 패턴",
    "zh": "KMP 和高级模式",
    "fr": "KMP et modèles avancés",
    "de": "KMP und erweiterte Muster",
    "es": "KMP y patrones avanzados"
  },
  "server-side-advanced": {
    "vi": "Server-side & Advanced",
    "en": "Server-side & Advanced",
    "ja": "サーバーサイドと高度な",
    "ko": "서버 측 및 고급",
    "zh": "服务器端和高级",
    "fr": "Côté serveur et avancé",
    "de": "Serverseitig und erweitert",
    "es": "Del lado del servidor y avanzado"
  },
  "compiler-plugins-internals": {
    "vi": "Compiler Plugins & Internals",
    "en": "Compiler Plugins & Internals",
    "ja": "コンパイラのプラグインと内部機能",
    "ko": "컴파일러 플러그인 및 내부",
    "zh": "编译器插件和内部结构",
    "fr": "Plugins et composants internes du compilateur",
    "de": "Compiler-Plugins und Interna",
    "es": "Complementos e componentes internos del compilador"
  },
  "rails-basics": {
    "vi": "Rails Basics",
    "en": "Rails Basics",
    "ja": "レールの基本",
    "ko": "레일스 기초",
    "zh": "导轨基础知识",
    "fr": "Bases des rails",
    "de": "Rails-Grundlagen",
    "es": "Conceptos básicos de rieles"
  },
  "rails-architecture": {
    "vi": "Rails Architecture",
    "en": "Rails Architecture",
    "ja": "レールアーキテクチャ",
    "ko": "레일스 아키텍처",
    "zh": "轨道架构",
    "fr": "Architecture des rails",
    "de": "Rails-Architektur",
    "es": "Arquitectura de rieles"
  },
  "metaprogramming-architecture": {
    "vi": "Metaprogramming & Architecture",
    "en": "Metaprogramming & Architecture",
    "ja": "メタプログラミングとアーキテクチャ",
    "ko": "메타프로그래밍 및 아키텍처",
    "zh": "元编程与架构",
    "fr": "Métaprogrammation et architecture",
    "de": "Metaprogrammierung und Architektur",
    "es": "Metaprogramación y arquitectura"
  },
  "dart-co-ban": {
    "vi": "Dart cơ bản",
    "en": "Basic Dart",
    "ja": "ベーシックダーツ",
    "ko": "기본 다트",
    "zh": "基本飞镖",
    "fr": "Fléchette de base",
    "de": "Grundlegender Dart",
    "es": "Dardo Básico"
  },
  "flutter-ui-state": {
    "vi": "Flutter UI & State",
    "en": "Flutter UI & State",
    "ja": "Flutter UI と状態",
    "ko": "Flutter UI 및 상태",
    "zh": "Flutter UI 和状态",
    "fr": "Interface utilisateur et état Flutter",
    "de": "Flutter-Benutzeroberfläche und -Status",
    "es": "Interfaz de usuario y estado de Flutter"
  },
  "kien-truc-ung-dung-flutter-ket-noi-api-backend": {
    "vi": "Kiến trúc ứng dụng Flutter & Kết nối API Backend",
    "en": "Flutter App Architecture & Backend API Connectivity",
    "ja": "Flutter アプリのアーキテクチャとバックエンド API の接続",
    "ko": "Flutter 앱 아키텍처 및 백엔드 API 연결",
    "zh": "Flutter 应用程序架构和后端 API 连接",
    "fr": "Architecture de l'application Flutter et connectivité API backend",
    "de": "Flutter-App-Architektur und Backend-API-Konnektivität",
    "es": "Arquitectura de la aplicación Flutter y conectividad API backend"
  },
  "toi-uu-hieu-nang-flutter-tuong-tac-native-platform": {
    "vi": "Tối ưu hiệu năng Flutter & Tương tác Native Platform",
    "en": "Optimize Flutter performance & Native Platform interaction",
    "ja": "Flutter パフォーマンスとネイティブ プラットフォーム インタラクションを最適化する",
    "ko": "Flutter 성능 및 기본 플랫폼 상호 작용 최적화",
    "zh": "优化 Flutter 性能和原生平台交互",
    "fr": "Optimiser les performances de Flutter et l'interaction avec la plateforme native",
    "de": "Optimieren Sie die Flutter-Leistung und die Interaktion mit der nativen Plattform",
    "es": "Optimice el rendimiento de Flutter y la interacción con la plataforma nativa"
  },
  "mau-kien-truc-flutter-nang-cao-trien-khai-ung-dung": {
    "vi": "Mẫu kiến trúc Flutter nâng cao & Triển khai ứng dụng",
    "en": "Advanced Flutter Architecture Patterns & App Deployment",
    "ja": "高度な Flutter アーキテクチャ パターンとアプリのデプロイメント",
    "ko": "고급 Flutter 아키텍처 패턴 및 앱 배포",
    "zh": "高级 Flutter 架构模式和应用程序部署",
    "fr": "Modèles d'architecture Flutter avancés et déploiement d'applications",
    "de": "Erweiterte Flutter-Architekturmuster und App-Bereitstellung",
    "es": "Patrones avanzados de arquitectura Flutter e implementación de aplicaciones"
  },
  "terminal-co-ban": {
    "vi": "Terminal cơ bản",
    "en": "Basic terminal",
    "ja": "基本端末",
    "ko": "기본단말기",
    "zh": "基本终端",
    "fr": "Borne de base",
    "de": "Basisterminal",
    "es": "terminal básica"
  },
  "tu-dong-hoa-tac-vu-he-thong-devops": {
    "vi": "Tự động hóa tác vụ hệ thống & DevOps",
    "en": "System Task Automation & DevOps",
    "ja": "システムタスクの自動化とDevOps",
    "ko": "시스템 작업 자동화 및 DevOps",
    "zh": "系统任务自动化和 DevOps",
    "fr": "Automatisation des tâches système et DevOps",
    "de": "Automatisierung von Systemaufgaben und DevOps",
    "es": "Automatización de tareas del sistema y DevOps"
  },
  "lap-trinh-bash-script-nang-cao": {
    "vi": "Lập trình Bash Script nâng cao",
    "en": "Advanced Bash Script programming",
    "ja": "高度な Bash スクリプト プログラミング",
    "ko": "고급 Bash 스크립트 프로그래밍",
    "zh": "高级 Bash 脚本编程",
    "fr": "Programmation avancée de scripts Bash",
    "de": "Erweiterte Bash-Skript-Programmierung",
    "es": "Programación avanzada de scripts Bash"
  },
  "production-scripting": {
    "vi": "Production Scripting",
    "en": "Production Scripting",
    "ja": "プロダクションスクリプト作成",
    "ko": "프로덕션 스크립팅",
    "zh": "制作脚本",
    "fr": "Scripts de production",
    "de": "Produktionsskripting",
    "es": "Guión de producción"
  },
  "shell-mastery": {
    "vi": "Shell Mastery",
    "en": "Shell Mastery",
    "ja": "シェルマスタリー",
    "ko": "쉘 마스터리",
    "zh": "精通贝壳",
    "fr": "Maîtrise des obus",
    "de": "Muschelbeherrschung",
    "es": "Dominio del caparazón"
  },
  "cau-truc-du-lieu-co-ban": {
    "vi": "Cấu trúc dữ liệu cơ bản",
    "en": "Basic Data Structures",
    "ja": "基本的なデータ構造",
    "ko": "기본 데이터 구조",
    "zh": "基本数据结构",
    "fr": "Structures de données de base",
    "de": "Grundlegende Datenstrukturen",
    "es": "Estructuras de datos básicas"
  },
  "trees-hash-maps": {
    "vi": "Cây nhị phân & Bảng băm (Hash Maps)",
    "en": "Trees & Hash Maps"
  },
  "graphs-dp": {
    "vi": "Đồ thị (Graphs) & Quy hoạch động (DP)",
    "en": "Graphs & Dynamic Programming"
  },
  "thuat-toan-nang-cao-cau-truc-du-lieu-mo-rong": {
    "vi": "Thuật toán nâng cao & Cấu trúc dữ liệu mở rộng",
    "en": "Advanced Algorithms & Extended Data Structures"
  },
  "interview-patterns": {
    "vi": "Các dạng bài phỏng vấn thuật toán",
    "en": "Interview Problem Patterns"
  },
  "cu-phap-co-ban-nen-tang-zig": {
    "vi": "Cú pháp cơ bản & Nền tảng Zig",
    "en": "Basic Syntax & Zig Foundation",
    "ja": "基本的な構文と Zig の基礎",
    "ko": "기본 구문 및 Zig 기초",
    "zh": "基本语法和 Zig 基础",
    "fr": "Syntaxe de base et fondation Zig",
    "de": "Grundlegende Syntax und Zig Foundation",
    "es": "Sintaxis básica y fundamentos de Zig"
  },
  "structs-quan-ly-bo-nho-slices": {
    "vi": "Structs, Quản lý bộ nhớ & Slices",
    "en": "Structures, Memory Management & Slices",
    "ja": "構造、メモリ管理、スライス",
    "ko": "구조, 메모리 관리 및 슬라이스",
    "zh": "结构、内存管理和切片",
    "fr": "Structures, gestion de la mémoire et tranches",
    "de": "Strukturen, Speicherverwaltung und Slices",
    "es": "Estructuras, gestión de memoria y cortes"
  },
  "comptime-lap-trinh-bat-dong-bo-ffi": {
    "vi": "Comptime, Lập trình bất đồng bộ & FFI",
    "en": "Comptime, Asynchronous Programming & FFI",
    "ja": "コンプタイム、非同期プログラミング、FFI",
    "ko": "Comptime, 비동기 프로그래밍 및 FFI",
    "zh": "Comptime、异步编程和 FFI",
    "fr": "Comptime, Programmation Asynchrone & FFI",
    "de": "Comptime, asynchrone Programmierung und FFI",
    "es": "Comptime, programación asincrónica y FFI"
  },
  "he-thong-build-bien-dich-cheo": {
    "vi": "Hệ thống Build & Biên dịch chéo",
    "en": "Build & Cross Compile System",
    "ja": "ビルド&クロスコンパイルシステム",
    "ko": "빌드 및 크로스 컴파일 시스템",
    "zh": "构建和交叉编译系统",
    "fr": "Système de construction et de compilation croisée",
    "de": "Build- und Cross-Compile-System",
    "es": "Sistema de compilación y compilación cruzada"
  },
  "lap-trinh-cap-he-dieu-hanh-nhung": {
    "vi": "Lập trình cấp hệ điều hành & Nhúng",
    "en": "Operating System Level Programming & Embedded",
    "ja": "オペレーティング システム レベルのプログラミングと組み込み",
    "ko": "운영 체제 수준 프로그래밍 및 임베디드",
    "zh": "操作系统级编程和嵌入式",
    "fr": "Programmation au niveau du système d'exploitation et embarqué",
    "de": "Programmierung und Einbettung auf Betriebssystemebene",
    "es": "Programación a nivel de sistema operativo e integrado"
  },
  "blockchain-smart-contracts-co-ban": {
    "vi": "Blockchain & Smart Contracts cơ bản",
    "en": "Basic Blockchain & Smart Contracts",
    "ja": "基本的なブロックチェーンとスマートコントラクト",
    "ko": "기본 블록체인 및 스마트 계약",
    "zh": "基础区块链和智能合约",
    "fr": "Blockchain de base et contrats intelligents",
    "de": "Grundlegende Blockchain und Smart Contracts",
    "es": "Blockchain básica y contratos inteligentes"
  },
  "tieu-chuan-erc-20-bao-mat-hop-dong": {
    "vi": "Tiêu chuẩn ERC-20 & Bảo mật hợp đồng",
    "en": "ERC-20 Standard & Contract Security",
    "ja": "ERC-20 標準および契約セキュリティ",
    "ko": "ERC-20 표준 및 계약 보안",
    "zh": "ERC-20标准和合约安全",
    "fr": "Norme ERC-20 et sécurité des contrats",
    "de": "ERC-20 Standard- und Vertragssicherheit",
    "es": "Estándar ERC-20 y seguridad del contrato"
  },
  "giao-thuc-tai-chinh-phi-tap-trung-defi": {
    "vi": "Giao thức Tài chính Phi tập trung (DeFi)",
    "en": "Decentralized Finance (DeFi) Protocol",
    "ja": "分散型金融 (DeFi) プロトコル",
    "ko": "탈중앙화 금융(DeFi) 프로토콜",
    "zh": "去中心化金融（DeFi）协议",
    "fr": "Protocole de finance décentralisée (DeFi)",
    "de": "Dezentrales Finanzprotokoll (DeFi).",
    "es": "Protocolo de finanzas descentralizadas (DeFi)"
  },
  "nhung-lua-vao-ung-dung-c-c": {
    "vi": "Nhúng Lua vào ứng dụng C/C++",
    "en": "Embed Lua into C/C++ applications",
    "ja": "Lua を C/C++ アプリケーションに埋め込む",
    "ko": "C/C++ 애플리케이션에 Lua 포함",
    "zh": "将 Lua 嵌入到 C/C++ 应用程序中",
    "fr": "Intégrer Lua dans les applications C/C++",
    "de": "Integrieren Sie Lua in C/C++-Anwendungen",
    "es": "Incruste Lua en aplicaciones C/C++"
  },
  "vue-basics-template-syntax": {
    "vi": "Vue basics & template syntax",
    "en": "Vue basics & template syntax",
    "ja": "Vue の基本とテンプレート構文",
    "ko": "Vue 기본 및 템플릿 구문",
    "zh": "Vue 基础知识和模板语法",
    "fr": "Bases de Vue et syntaxe des modèles",
    "de": "Vue-Grundlagen und Vorlagensyntax",
    "es": "Conceptos básicos de Vue y sintaxis de plantillas"
  },
  "vue-router-pinia": {
    "vi": "Vue Router & Pinia",
    "en": "Vue Router & Pinia",
    "ja": "Vue ルーターと Pinia",
    "ko": "Vue 라우터 & 피니아",
    "zh": "Vue 路由器和 Pinia",
    "fr": "Routeur Vue et Pinia",
    "de": "Vue Router & Pinia",
    "es": "Enrutador Vue y Pinia"
  },
  "phat-trien-fullstack-vue-voi-nuxt-js-ssr": {
    "vi": "Phát triển Fullstack Vue với Nuxt.js & SSR",
    "en": "Fullstack Vue Development with Nuxt.js & SSR",
    "ja": "Nuxt.js と SSR を使用したフルスタック Vue 開発",
    "ko": "Nuxt.js 및 SSR을 사용한 풀스택 Vue 개발",
    "zh": "使用 Nuxt.js 和 SSR 进行全栈 Vue 开发",
    "fr": "Développement Fullstack Vue avec Nuxt.js et SSR",
    "de": "Fullstack Vue-Entwicklung mit Nuxt.js & SSR",
    "es": "Desarrollo Fullstack Vue con Nuxt.js y SSR"
  },
  "performance-production": {
    "vi": "Performance & Production",
    "en": "Performance & Production",
    "ja": "パフォーマンスとプロダクション",
    "ko": "성능 및 생산",
    "zh": "演出与制作",
    "fr": "Performances et production",
    "de": "Leistung und Produktion",
    "es": "Rendimiento y producción"
  },
  "nen-tang-angular-data-binding": {
    "vi": "Nền tảng Angular & Data Binding",
    "en": "Angular & Data Binding Platform",
    "ja": "Angular およびデータ バインディング プラットフォーム",
    "ko": "각도 및 데이터 바인딩 플랫폼",
    "zh": "Angular 和数据绑定平台",
    "fr": "Plateforme angulaire et de liaison de données",
    "de": "Angular- und Datenbindungsplattform",
    "es": "Plataforma angular y de enlace de datos"
  },
  "services-dependency-injection-dinh-tuyen-routing": {
    "vi": "Services, Dependency Injection & Định tuyến Routing",
    "en": "Services, Dependency Injection & Routing",
    "ja": "サービス、依存関係の注入、ルーティング",
    "ko": "서비스, 종속성 주입 및 라우팅",
    "zh": "服务、依赖注入和路由",
    "fr": "Services, injection de dépendances et routage",
    "de": "Dienste, Abhängigkeitsinjektion und Routing",
    "es": "Servicios, inyección de dependencia y enrutamiento"
  },
  "forms-state-management": {
    "vi": "Forms & State Management",
    "en": "Forms & State Management",
    "ja": "フォームと状態の管理",
    "ko": "양식 및 상태 관리",
    "zh": "表单和状态管理",
    "fr": "Formulaires et gestion de l'état",
    "de": "Formulare und Statusverwaltung",
    "es": "Gestión de formularios y estados"
  },
  "kiem-thu-ung-dung-toi-uu-hieu-nang-angular": {
    "vi": "Kiểm thử ứng dụng & Tối ưu hiệu năng Angular",
    "en": "Application Testing & Angular Performance Optimization",
    "ja": "アプリケーションのテストと角度パフォーマンスの最適化",
    "ko": "애플리케이션 테스트 및 각도 성능 최적화",
    "zh": "应用程序测试和角度性能优化",
    "fr": "Tests d'applications et optimisation des performances angulaires",
    "de": "Anwendungstests und Angular-Leistungsoptimierung",
    "es": "Pruebas de aplicaciones y optimización del rendimiento angular"
  },
  "enterprise-patterns": {
    "vi": "Enterprise Patterns",
    "en": "Enterprise Patterns",
    "ja": "エンタープライズパターン",
    "ko": "엔터프라이즈 패턴",
    "zh": "企业模式",
    "fr": "Modèles d'entreprise",
    "de": "Unternehmensmuster",
    "es": "Patrones empresariales"
  },
  "utility-first-basics": {
    "vi": "Utility-first basics",
    "en": "Utility-first basics",
    "ja": "ユーティリティファーストの基本",
    "ko": "유틸리티 우선의 기본",
    "zh": "实用至上的基础知识",
    "fr": "Les bases de l'utilitaire",
    "de": "Utility-First-Grundlagen",
    "es": "Conceptos básicos de los servicios públicos"
  },
  "customization-theming": {
    "vi": "Customization & Theming",
    "en": "Customization & Theming",
    "ja": "カスタマイズとテーマ設定",
    "ko": "사용자 정의 및 테마",
    "zh": "定制和主题化",
    "fr": "Personnalisation et thème",
    "de": "Anpassung und Themengestaltung",
    "es": "Personalización y tematización"
  },
  "advanced-patterns": {
    "vi": "Advanced patterns",
    "en": "Advanced patterns",
    "ja": "高度なパターン",
    "ko": "고급 패턴",
    "zh": "高级模式",
    "fr": "Modèles avancés",
    "de": "Erweiterte Muster",
    "es": "Patrones avanzados"
  },
  "tailwind-v4-design-systems": {
    "vi": "Tailwind v4 & Design Systems",
    "en": "Tailwind v4 & Design Systems",
    "ja": "Tailwind v4 とデザイン システム",
    "ko": "Tailwind v4 및 디자인 시스템",
    "zh": "Tailwind v4 和设计系统",
    "fr": "Tailwind v4 et systèmes de conception",
    "de": "Tailwind v4 & Designsysteme",
    "es": "Tailwind v4 y sistemas de diseño"
  },
  "production-design-systems": {
    "vi": "Production Design Systems",
    "en": "Production Design Systems",
    "ja": "プロダクションデザインシステム",
    "ko": "생산 디자인 시스템",
    "zh": "生产设计系统",
    "fr": "Systèmes de conception de production",
    "de": "Produktionsdesignsysteme",
    "es": "Sistemas de diseño de producción"
  },
  "nen-tang-django-kien-truc-mvt": {
    "vi": "Nền tảng Django & Kiến trúc MVT",
    "en": "Django Platform & MVT Architecture",
    "ja": "Django プラットフォームと MVT アーキテクチャ",
    "ko": "Django 플랫폼 및 MVT 아키텍처",
    "zh": "Django 平台和 MVT 架构",
    "fr": "Plateforme Django et architecture MVT",
    "de": "Django-Plattform und MVT-Architektur",
    "es": "Plataforma Django y arquitectura MVT"
  },
  "forms-auth-admin": {
    "vi": "Forms, Auth & Admin",
    "en": "Forms, Auth & Admin",
    "ja": "フォーム、認証、管理",
    "ko": "양식, 인증 및 관리",
    "zh": "表单、身份验证和管理",
    "fr": "Formulaires, authentification et administration",
    "de": "Formulare, Authentifizierung und Verwaltung",
    "es": "Formularios, autenticación y administración"
  },
  "rest-api-class-based-views": {
    "vi": "REST API & Class-Based Views",
    "en": "REST API & Class-Based Views",
    "ja": "REST API とクラスベースのビュー",
    "ko": "REST API 및 클래스 기반 보기",
    "zh": "REST API 和基于类的视图",
    "fr": "API REST et vues basées sur les classes",
    "de": "REST-API und klassenbasierte Ansichten",
    "es": "API REST y vistas basadas en clases"
  },
  "trien-khai-ung-dung-len-production-mo-rong-quy-mo": {
    "vi": "Triển khai ứng dụng lên Production & Mở rộng quy mô",
    "en": "Deploy application to Production & Scale up",
    "ja": "アプリケーションを本番環境にデプロイし、スケールアップする",
    "ko": "프로덕션 및 확장에 애플리케이션 배포",
    "zh": "将应用程序部署到生产并扩大规模",
    "fr": "Déployer l'application en production et passer à l'échelle",
    "de": "Stellen Sie die Anwendung für die Produktion bereit und skalieren Sie sie",
    "es": "Implementar la aplicación en producción y escalar"
  },
  "mongodb-basics": {
    "vi": "MongoDB basics",
    "en": "MongoDB basics",
    "ja": "MongoDB の基本",
    "ko": "몽고DB 기본",
    "zh": "MongoDB 基础知识",
    "fr": "Les bases de MongoDB",
    "de": "MongoDB-Grundlagen",
    "es": "Conceptos básicos de MongoDB"
  },
  "node-js-integration-mongoose": {
    "vi": "Node.js integration & Mongoose",
    "en": "Node.js integration & Mongoose",
    "ja": "Node.js の統合と Mongoose",
    "ko": "Node.js 통합 및 몽구스",
    "zh": "Node.js 集成和 Mongoose",
    "fr": "Intégration Node.js & Mongoose",
    "de": "Node.js-Integration und Mongoose",
    "es": "Integración de Node.js y mangosta"
  },
  "aggregation-indexing": {
    "vi": "Aggregation & Indexing",
    "en": "Aggregation & Indexing",
    "ja": "集約とインデックス作成",
    "ko": "집계 및 인덱싱",
    "zh": "聚合和索引",
    "fr": "Agrégation et indexation",
    "de": "Aggregation und Indizierung",
    "es": "Agregación e indexación"
  },
  "transactions-atlas": {
    "vi": "Transactions & Atlas",
    "en": "Transactions & Atlas",
    "ja": "トランザクションとアトラス",
    "ko": "거래 및 아틀라스",
    "zh": "交易与图集",
    "fr": "Transactions et Atlas",
    "de": "Transaktionen & Atlas",
    "es": "Transacciones y Atlas"
  },
  "scaling-architecture": {
    "vi": "Scaling & Architecture",
    "en": "Scaling & Architecture",
    "ja": "スケーリングとアーキテクチャ",
    "ko": "확장 및 아키텍처",
    "zh": "扩展和架构",
    "fr": "Mise à l'échelle et architecture",
    "de": "Skalierung & Architektur",
    "es": "Escalado y arquitectura"
  },
  "resolvers-apollo-server": {
    "vi": "Resolvers & Apollo Server",
    "en": "Resolvers & Apollo Server",
    "ja": "リゾルバーと Apollo サーバー",
    "ko": "리졸버 및 Apollo 서버",
    "zh": "解析器和 Apollo 服务器",
    "fr": "Résolveurs et serveur Apollo",
    "de": "Resolver und Apollo-Server",
    "es": "Resolutores y servidor Apollo"
  },
  "subscriptions-advanced": {
    "vi": "Subscriptions & Advanced",
    "en": "Subscriptions & Advanced",
    "ja": "サブスクリプションとアドバンスト",
    "ko": "구독 및 고급",
    "zh": "订阅和高级",
    "fr": "Abonnements et avancé",
    "de": "Abonnements und Erweitert",
    "es": "Suscripciones y Avanzado"
  },
  "n-1-dataloader": {
    "vi": "N+1 & DataLoader",
    "en": "N+1 & DataLoader",
    "ja": "N+1 とデータローダー",
    "ko": "N+1 및 데이터로더",
    "zh": "N+1 和数据加载器",
    "fr": "N+1 et chargeur de données",
    "de": "N+1 & DataLoader",
    "es": "N+1 y cargador de datos"
  },
  "federation-production": {
    "vi": "Federation & Production",
    "en": "Federation & Production",
    "ja": "フェデレーションとプロダクション",
    "ko": "연합 및 생산",
    "zh": "联盟与生产",
    "fr": "Fédération & Production",
    "de": "Föderation & Produktion",
    "es": "Federación y Producción"
  },
  "nen-tang-kubernetes-kien-truc-pods": {
    "vi": "Nền tảng Kubernetes & Kiến trúc Pods",
    "en": "Kubernetes Platform & Pods Architecture",
    "ja": "Kubernetes プラットフォームとポッドのアーキテクチャ",
    "ko": "Kubernetes 플랫폼 및 포드 아키텍처",
    "zh": "Kubernetes 平台和 Pod 架构",
    "fr": "Architecture de la plateforme et des pods Kubernetes",
    "de": "Kubernetes-Plattform- und Pods-Architektur",
    "es": "Plataforma Kubernetes y arquitectura de pods"
  },
  "configmaps-secrets-volumes": {
    "vi": "ConfigMaps, Secrets, Volumes",
    "en": "ConfigMaps, Secrets, Volumes",
    "ja": "ConfigMap、シークレット、ボリューム",
    "ko": "ConfigMap, 비밀, 볼륨",
    "zh": "ConfigMap、秘密、卷",
    "fr": "ConfigMaps, secrets, volumes",
    "de": "ConfigMaps, Geheimnisse, Volumes",
    "es": "ConfigMaps, secretos, volúmenes"
  },
  "mang-noi-bo-kubernetes-dich-vu-services-ingress": {
    "vi": "Mạng nội bộ Kubernetes, Dịch vụ Services & Ingress",
    "en": "Kubernetes Intranet, Services & Ingress",
    "ja": "Kubernetes イントラネット、サービス、Ingress",
    "ko": "Kubernetes 인트라넷, 서비스 및 수신",
    "zh": "Kubernetes 内联网、服务和入口",
    "fr": "Intranet, services et entrée Kubernetes",
    "de": "Kubernetes-Intranet, Dienste und Ingress",
    "es": "Intranet, servicios e ingreso de Kubernetes"
  },
  "helm-operators": {
    "vi": "Helm & Operators",
    "en": "Helm & Operators",
    "ja": "ヘルムとオペレーター",
    "ko": "투구 및 운영자",
    "zh": "舵手和操作员",
    "fr": "Barre et opérateurs",
    "de": "Helm und Bediener",
    "es": "Timón y operadores"
  },
  "production-best-practices": {
    "vi": "Production Best Practices",
    "en": "Production Best Practices",
    "ja": "本番環境のベストプラクティス",
    "ko": "생산 모범 사례",
    "zh": "生产最佳实践",
    "fr": "Meilleures pratiques de production",
    "de": "Best Practices für die Produktion",
    "es": "Mejores prácticas de producción"
  },
  "nen-tang-ci-cd-pipeline-tu-dong-hoa": {
    "vi": "Nền tảng CI/CD & Pipeline tự động hóa",
    "en": "CI/CD Platform & Automation Pipeline",
    "ja": "CI/CD プラットフォームと自動化パイプライン",
    "ko": "CI/CD 플랫폼 및 자동화 파이프라인",
    "zh": "CI/CD 平台和自动化管道",
    "fr": "Plateforme CI/CD et pipeline d'automatisation",
    "de": "CI/CD-Plattform und Automatisierungspipeline",
    "es": "Plataforma CI/CD y canal de automatización"
  },
  "docker-builds-caching": {
    "vi": "Docker builds & Caching",
    "en": "Docker builds & Caching",
    "ja": "Docker のビルドとキャッシュ",
    "ko": "Docker 빌드 및 캐싱",
    "zh": "Docker 构建和缓存",
    "fr": "Constructions Docker et mise en cache",
    "de": "Docker-Builds und Caching",
    "es": "Compilaciones y almacenamiento en caché de Docker"
  },
  "xay-dung-pipeline-ci-cd-da-giai-doan-nang-cao": {
    "vi": "Xây dựng Pipeline CI/CD đa giai đoạn nâng cao",
    "en": "Build an advanced multi-stage CI/CD Pipeline",
    "ja": "高度なマルチステージ CI/CD パイプラインを構築する",
    "ko": "고급 다단계 CI/CD 파이프라인 구축",
    "zh": "构建先进的多阶段 CI/CD 管道",
    "fr": "Créez un pipeline CI/CD avancé à plusieurs étapes",
    "de": "Erstellen Sie eine erweiterte mehrstufige CI/CD-Pipeline",
    "es": "Cree una canalización avanzada de CI/CD de varias etapas"
  },
  "bao-mat-pipeline-quet-lo-hong-cong-chat-luong": {
    "vi": "Bảo mật Pipeline, Quét lỗ hổng & Cổng chất lượng",
    "en": "Pipeline Security, Vulnerability Scanning & Quality Gates",
    "ja": "パイプラインのセキュリティ、脆弱性スキャン、品質ゲート",
    "ko": "파이프라인 보안, 취약점 검색 및 품질 게이트",
    "zh": "管道安全、漏洞扫描和质量门",
    "fr": "Sécurité des pipelines, analyse des vulnérabilités et contrôles de qualité",
    "de": "Pipeline-Sicherheit, Schwachstellen-Scanning und Quality Gates",
    "es": "Seguridad de tuberías, escaneo de vulnerabilidades y puertas de calidad"
  },
  "mo-hinh-gitops-voi-argocd-tu-dong-trien-khai": {
    "vi": "Mô hình GitOps với ArgoCD & Tự động triển khai",
    "en": "GitOps Model with ArgoCD & Deployment Automation",
    "ja": "ArgoCD とデプロイメント自動化を備えた GitOps モデル",
    "ko": "ArgoCD 및 배포 자동화를 갖춘 GitOps 모델",
    "zh": "具有 ArgoCD 和部署自动化的 GitOps 模型",
    "fr": "Modèle GitOps avec ArgoCD et automatisation du déploiement",
    "de": "GitOps-Modell mit ArgoCD und Bereitstellungsautomatisierung",
    "es": "Modelo GitOps con ArgoCD y automatización de implementación"
  },
  "co-ban-ve-nginx-web-server-cau-hinh-reverse-proxy": {
    "vi": "Cơ bản về Nginx Web Server & Cấu hình Reverse Proxy",
    "en": "Nginx Web Server Basics & Reverse Proxy Configuration",
    "ja": "Nginx Web サーバーの基本とリバース プロキシ構成",
    "ko": "Nginx 웹 서버 기본 사항 및 역방향 프록시 구성",
    "zh": "Nginx Web 服务器基础知识和反向代理配置",
    "fr": "Bases du serveur Web Nginx et configuration du proxy inverse",
    "de": "Nginx-Webserver-Grundlagen und Reverse-Proxy-Konfiguration",
    "es": "Conceptos básicos del servidor web Nginx y configuración del proxy inverso"
  },
  "ssl-load-balancing": {
    "vi": "SSL & Load Balancing",
    "en": "SSL & Load Balancing",
    "ja": "SSLとロードバランシング",
    "ko": "SSL 및 로드 밸런싱",
    "zh": "SSL 和负载平衡",
    "fr": "SSL et équilibrage de charge",
    "de": "SSL und Lastausgleich",
    "es": "SSL y equilibrio de carga"
  },
  "toi-uu-hieu-nang-may-chu-nginx-caching-nen-gzip": {
    "vi": "Tối ưu hiệu năng máy chủ Nginx, Caching & Nén Gzip",
    "en": "Optimize Nginx server performance, Caching & Gzip compression",
    "ja": "Nginx サーバーのパフォーマンス、キャッシュ、Gzip 圧縮を最適化します。",
    "ko": "Nginx 서버 성능, 캐싱 및 Gzip 압축 최적화",
    "zh": "优化 Nginx 服务器性能、缓存和 Gzip 压缩",
    "fr": "Optimiser les performances du serveur Nginx, la mise en cache et la compression Gzip",
    "de": "Optimieren Sie die Leistung des Nginx-Servers, Caching und Gzip-Komprimierung",
    "es": "Optimice el rendimiento del servidor Nginx, el almacenamiento en caché y la compresión Gzip"
  },
  "linux-server-admin": {
    "vi": "Linux server admin",
    "en": "Linux server admin",
    "ja": "Linuxサーバー管理者",
    "ko": "리눅스 서버 관리자",
    "zh": "Linux 服务器管理员",
    "fr": "Administrateur de serveur Linux",
    "de": "Linux-Serveradministrator",
    "es": "Administrador del servidor Linux"
  },
  "kien-truc-may-chu-production-can-bang-tai-load-balancing-ssl-tls": {
    "vi": "Kiến trúc máy chủ Production, Cân bằng tải Load Balancing & SSL/TLS",
    "en": "Production server architecture, Load Balancing & SSL/TLS",
    "ja": "運用サーバー アーキテクチャ、ロード バランシング、SSL/TLS",
    "ko": "프로덕션 서버 아키텍처, 로드 밸런싱 및 SSL/TLS",
    "zh": "生产服务器架构、负载平衡和 SSL/TLS",
    "fr": "Architecture serveur de production, Load Balancing & SSL/TLS",
    "de": "Produktionsserverarchitektur, Lastausgleich und SSL/TLS",
    "es": "Arquitectura del servidor de producción, equilibrio de carga y SSL/TLS"
  },
  "ngrx-quan-ly-trang-thai": {
    "vi": "NgRx Quản lý trạng thái",
    "en": "NgRx State Management"
  },
  "terminal-commands-dieu-huong": {
    "vi": "Terminal Commands & Điều hướng",
    "en": "Terminal Commands & Navigation"
  },
  "graph-thuat-toan": {
    "vi": "Graph Thuật toán",
    "en": "Graph Algorithms"
  },
  "bieu-thuc-lambda-tinh-nang-c-hien-dai": {
    "vi": "Biểu thức Lambda & Tính năng C++ hiện đại",
    "en": "Lambda & Modern C++ Features"
  },
  "lap-trinh-da-luong-multithreading-lap-trinh-dong-thoi": {
    "vi": "Lập trình đa luồng Multithreading & Lập trình đồng thời",
    "en": "Lập trình đa luồng Multithreading & Concurrency"
  },
  "mau-thiet-ke-trong-c": {
    "vi": "Mẫu thiết kế trong C++",
    "en": "Design Patterns trong C++"
  },
  "lap-trinh-sieu-mau-template-metaprogramming": {
    "vi": "Lập trình siêu mẫu Template Metaprogramming",
    "en": "Template Metaprogramming"
  },
  "thiet-ke-he-thong-hieu-nang-cao-voi-c": {
    "vi": "Thiết kế hệ thống hiệu năng cao với C++",
    "en": "System Design với C++"
  },
  "dependency-injection-kien-truc-sach-clean-kien-truc": {
    "vi": "Dependency Injection & Kiến trúc sạch (Clean Kiến trúc)",
    "en": "Dependency Injection & Kiến trúc sạch (Clean Architecture)"
  },
  "flutter-widget-co-ban": {
    "vi": "Flutter Widget cơ bản",
    "en": "Flutter Widget Fundamentals"
  },
  "quan-ly-trang-thai-riverpod": {
    "vi": "Quản lý trạng thái: Riverpod",
    "en": "State Management: Riverpod"
  },
  "dieu-huong-dinh-tuyen-man-hinh-dinh-tuyen": {
    "vi": "Điều hướng & Định tuyến màn hình (Định tuyến)",
    "en": "Điều hướng & Định tuyến màn hình (Routing)"
  },
  "clean-kien-truc-kiem-thu": {
    "vi": "Clean Kiến trúc & Kiểm thử",
    "en": "Clean Architecture & Testing"
  },
  "flutter-hieu-nang-platform-channels": {
    "vi": "Flutter Hiệu năng & Platform Channels",
    "en": "Flutter Performance & Platform Channels"
  },
  "nang-cao-flutter-custom-rendering-animations": {
    "vi": "nâng cao Flutter: Custom Rendering & Animations",
    "en": "Advanced Flutter: Custom Rendering & Animations"
  },
  "kubernetes-overview-kien-truc": {
    "vi": "Kubernetes Overview & Kiến trúc",
    "en": "Kubernetes Overview & Architecture"
  },
  "auto-mo-rong-quy-mo-rolling-updates": {
    "vi": "Auto-Mở rộng quy mô & Rolling Updates",
    "en": "Auto-Scaling & Rolling Updates"
  },
  "production-k8s-kien-truc": {
    "vi": "Production K8s Kiến trúc",
    "en": "Production K8s Architecture"
  },
  "automated-trien-khai": {
    "vi": "Automated Triển khai",
    "en": "Automated Deployment"
  },
  "bao-mat-scanning-quality-gates": {
    "vi": "Bảo mật Scanning & Quality Gates",
    "en": "Security Scanning & Quality Gates"
  },
  "production-trien-khai": {
    "vi": "Production Triển khai",
    "en": "Production Deployment"
  },
  "xay-dung-vi-dich-vu-microservices-voi-akka-http-zio": {
    "vi": "Xây dựng Vi dịch vụ Microservices với Akka HTTP & ZIO",
    "en": "Xây dựng Microservices với Akka HTTP & ZIO"
  },
  "packages-modules-kiem-thu": {
    "vi": "Packages, Modules & Kiểm thử",
    "en": "Packages, Modules & Testing"
  },
  "nang-cao-lap-trinh-dong-thoi-patterns": {
    "vi": "nâng cao Lập trình đồng thời Patterns",
    "en": "Advanced Concurrency Patterns"
  },
  "go-vi-dich-vu-microservices-kien-truc": {
    "vi": "Go Vi dịch vụ Microservices Kiến trúc",
    "en": "Go Microservices Architecture"
  },
  "apollo-federation-vi-dich-vu-microservices": {
    "vi": "Apollo Federation & Vi dịch vụ Microservices",
    "en": "Apollo Federation & Microservices"
  },
  "cau-truc-ngu-nghia-the-html5-semantic": {
    "vi": "Cấu trúc ngữ nghĩa & Thẻ HTML5 Semantic",
    "en": "HTML5 Semantic & Structure"
  },
  "bo-chon-css-mo-hinh-hop-box-model": {
    "vi": "Bộ chọn CSS & Mô hình hộp (Box Model)",
    "en": "CSS Selectors & Box Model"
  },
  "typography-he-mau-don-vi-trong-css": {
    "vi": "Typography, Hệ màu & Đơn vị trong CSS",
    "en": "Typography, Colors & Units"
  },
  "bo-cuc-giao-dien-linh-hoat-voi-css-flexbox": {
    "vi": "Bố cục giao diện linh hoạt với CSS Flexbox",
    "en": "Flexbox Layout"
  },
  "bo-cuc-luoi-hai-chieu-voi-css-grid": {
    "vi": "Bố cục lưới hai chiều với CSS Grid",
    "en": "CSS Grid Layout"
  },
  "thiet-ke-responsive-media-queries": {
    "vi": "Thiết kế Responsive & Media Queries",
    "en": "Responsive Design & Media Queries"
  },
  "hieu-ung-chuyen-dong-transitions-animations": {
    "vi": "Hiệu ứng chuyển động Transitions & Animations",
    "en": "Transitions & Animations"
  },
  "tinh-nang-css-hien-dai-has-nesting-layer": {
    "vi": "Tính năng CSS hiện đại: has(), nesting, @layer",
    "en": "Modern CSS: has(), nesting, layers"
  },
  "kha-nang-tiep-can-web-toan-dien-accessibility-a11y": {
    "vi": "Khả năng tiếp cận Web toàn diện (Accessibility - a11y)",
    "en": "Accessibility (a11y)"
  },
  "phuong-phap-luan-kien-truc-css-quy-mo-lon": {
    "vi": "Phương pháp luận & Kiến trúc CSS quy mô lớn",
    "en": "CSS Architecture & Methodology"
  },
  "xay-dung-he-thong-thiet-ke-design-systems": {
    "vi": "Xây dựng hệ thống thiết kế (Design Systems)",
    "en": "Building Design Systems"
  },
  "ky-thuat-css-chuyen-sau-toi-uu-hien-thi": {
    "vi": "Kỹ thuật CSS chuyên sâu & Tối ưu hiển thị",
    "en": "Advanced CSS Techniques"
  },
  "css-houdini-paint-api-cap-thap": {
    "vi": "CSS Houdini & Paint API cấp thấp",
    "en": "CSS Houdini & Paint API"
  },
  "oop-lop-ke-thua-giao-dien-interface": {
    "vi": "OOP: Lớp, Kế thừa & Giao diện (Interface)",
    "en": "OOP: Class, Inheritance, Interface"
  },
  "mau-thiet-ke-design-patterns-trong-java": {
    "vi": "Mẫu thiết kế (Design Patterns) trong Java",
    "en": "Design Patterns trong Java"
  },
  "lap-trinh-dong-thoi-da-luong-multithreading": {
    "vi": "Lập trình đồng thời & Đa luồng (Multithreading)",
    "en": "Concurrency & Multithreading"
  },
  "jpa-truy-xuat-co-so-du-lieu": {
    "vi": "JPA & Truy xuất cơ sở dữ liệu",
    "en": "JPA & Database Access"
  },
  "xay-dung-rest-api-voi-spring-boot": {
    "vi": "Xây dựng REST API với Spring Boot",
    "en": "Spring Boot REST API"
  },
  "bao-mat-xac-thuc-nguoi-dung-auth": {
    "vi": "Bảo mật & Xác thực người dùng (Auth)",
    "en": "Security & Authentication"
  },
  "kiem-thu-phan-mem-kien-truc-sach": {
    "vi": "Kiểm thử phần mềm & Kiến trúc sạch",
    "en": "Testing & Clean Architecture"
  },
  "tinh-nang-java-hien-dai-java-17-21": {
    "vi": "Tính năng Java hiện đại (Java 17 - 21)",
    "en": "Modern Java 17-21 Features"
  },
  "jest-co-ban-first-tests": {
    "vi": "Jest cơ bản & First Tests",
    "en": "Jest Basics & First Tests"
  },
  "learn-jest": {
    "vi": "Học kiểm thử tự động với Jest",
    "en": "Learn Jest"
  },
  "kiem-thu-async-code": {
    "vi": "Kiểm thử Async Code",
    "en": "Testing Async Code"
  },
  "integration-kiem-thu": {
    "vi": "Integration Kiểm thử",
    "en": "Integration Testing"
  },
  "test-todo": {
    "vi": "Test todo (Chuyên đề)",
    "en": "Test todo"
  },
  "a": {
    "vi": "A (Chuyên đề)",
    "en": "A"
  },
  "b": {
    "vi": "B (Chuyên đề)",
    "en": "B"
  },
  "kiem-thu-strategy-patterns": {
    "vi": "Kiểm thử Strategy & Patterns",
    "en": "Testing Strategy & Patterns"
  },
  "property-based-contract-kiem-thu": {
    "vi": "Property-Based & Contract Kiểm thử",
    "en": "Property-Based & Contract Testing"
  },
  "kiem-thu-kien-truc-kiem-thu-trophy": {
    "vi": "Kiểm thử Kiến trúc & Kiểm thử Trophy",
    "en": "Testing Architecture & Testing Trophy"
  },
  "git-co-ban": {
    "vi": "Git cơ bản",
    "en": "Git Fundamentals"
  },
  "docker-co-ban": {
    "vi": "Docker cơ bản",
    "en": "Docker Basics"
  },
  "docker-compose-quan-ly-da-container": {
    "vi": "Docker Compose & Quản lý đa Container",
    "en": "Docker Compose & Multi-container"
  },
  "nang-cao-git-techniques": {
    "vi": "nâng cao Git Techniques",
    "en": "Advanced Git Techniques"
  },
  "container-bao-mat-thuc-hanh-chuan": {
    "vi": "Container Bảo mật & Thực hành chuẩn",
    "en": "Container Security & Best Practices"
  },
  "android-kien-truc-components": {
    "vi": "Android Kiến trúc Components",
    "en": "Android Architecture Components"
  },
  "kotlin-dsl-nang-cao-features": {
    "vi": "Kotlin DSL & nâng cao Features",
    "en": "Kotlin DSL & Advanced Features"
  },
  "kotlin-kiem-thu-thuc-hanh-chuan": {
    "vi": "Kotlin Kiểm thử Thực hành chuẩn",
    "en": "Kotlin Testing Best Practices"
  },
  "text": {
    "vi": "text (Chuyên đề)",
    "en": "text"
  },
  "sharding-production-kien-truc": {
    "vi": "Sharding & Production Kiến trúc",
    "en": "Sharding & Production Architecture"
  },
  "nen-tang-node-js-trinh-quan-ly-goi-npm": {
    "vi": "Nền tảng Node.js & Trình quản lý gói npm",
    "en": "Node.js & npm Basics"
  },
  "he-thong-file-mau-lap-trinh-bat-dong-bo": {
    "vi": "Hệ thống File & Mẫu lập trình bất đồng bộ",
    "en": "File System & Async Patterns"
  },
  "xay-dung-web-server-voi-express-js": {
    "vi": "Xây dựng Web Server với Express.js",
    "en": "Express.js Framework"
  },
  "xac-thuc-voi-jwt": {
    "vi": "Xác thực với JWT",
    "en": "Authentication với JWT"
  },
  "co-so-du-lieu-tuong-tac-voi-prisma-orm": {
    "vi": "Cơ sở dữ liệu & Tương tác với Prisma ORM",
    "en": "Database: Prisma ORM"
  },
  "first-post": {
    "vi": "First Post (Chuyên đề)",
    "en": "First Post"
  },
  "second-post": {
    "vi": "Second Post (Chuyên đề)",
    "en": "Second Post"
  },
  "kiem-thu-ung-dung-node-js-jest-supertest": {
    "vi": "Kiểm thử ứng dụng Node.js (Jest/Supertest)",
    "en": "Testing Node.js Apps"
  },
  "kien-truc-sach-xu-ly-loi-toan-cuc": {
    "vi": "Kiến trúc sạch & Xử lý lỗi toàn cục",
    "en": "Clean Architecture & Error Handling"
  },
  "ung-dung-thoi-gian-thuc-voi-websocket-socket-io": {
    "vi": "Ứng dụng thời gian thực với WebSocket & Socket.io",
    "en": "Real-time: WebSocket & Socket.io"
  },
  "kien-truc-he-thong-microservices": {
    "vi": "Kiến trúc hệ thống Microservices",
    "en": "Microservices Architecture"
  },
  "toi-uu-hoa-hieu-nang-mo-rong-quy-mo": {
    "vi": "Tối ưu hóa hiệu năng & Mở rộng quy mô",
    "en": "Performance & Scaling"
  },
  "co-che-event-loop-kien-truc-v8-engine": {
    "vi": "Cơ chế Event Loop & Kiến trúc V8 Engine",
    "en": "Event Loop & V8 Internals"
  },
  "thiet-ke-he-thong-quy-mo-lon-voi-node-js": {
    "vi": "Thiết kế hệ thống quy mô lớn với Node.js",
    "en": "System Design với Node.js"
  },
  "php-syntax-web-co-ban": {
    "vi": "PHP Syntax & Web cơ bản",
    "en": "PHP Syntax & Web Basics"
  },
  "laravel-co-ban": {
    "vi": "Laravel cơ bản",
    "en": "Laravel Basics"
  },
  "eloquent-nang-cao-relationships": {
    "vi": "Eloquent nâng cao & Relationships",
    "en": "Eloquent Advanced & Relationships"
  },
  "php-kiem-thu-voi-phpunit-pest": {
    "vi": "PHP Kiểm thử với PHPUnit & Pest",
    "en": "PHP Testing với PHPUnit & Pest"
  },
  "laravel-kien-truc-patterns": {
    "vi": "Laravel Kiến trúc Patterns",
    "en": "Laravel Architecture Patterns"
  },
  "caching-hieu-nang": {
    "vi": "Caching & Hiệu năng",
    "en": "Caching & Performance"
  },
  "package-development-nang-cao": {
    "vi": "Package Development & nâng cao",
    "en": "Package Development & Advanced"
  },
  "php-mo-rong-quy-mo-production": {
    "vi": "PHP Mở rộng quy mô & Production",
    "en": "PHP Scaling & Production"
  },
  "collections-cau-truc-du-lieu": {
    "vi": "Collections & Cấu trúc dữ liệu",
    "en": "Collections & Data Structures"
  },
  "lap-trinh-bat-dong-bo-async-await-lap-trinh-dong-thoi": {
    "vi": "Lập trình Bất đồng bộ Async/Await & Lập trình đồng thời",
    "en": "Lập trình Bất đồng bộ Async/Await & Concurrency"
  },
  "props-xu-ly-su-kien-render-co-dieu-kien": {
    "vi": "Props, Xử lý sự kiện & Render có điều kiện",
    "en": "Props, Events & Conditional Rendering"
  },
  "learn-react": {
    "vi": "Learn React (Chuyên đề)",
    "en": "Learn React"
  },
  "build-project": {
    "vi": "Build Project (Chuyên đề)",
    "en": "Build Project"
  },
  "danh-sach-keys-mau-component-children": {
    "vi": "Danh sách, Keys & Mẫu Component Children",
    "en": "Lists, Keys & Children Pattern"
  },
  "quan-ly-trang-thai-voi-usestate-useeffect": {
    "vi": "Quản lý trạng thái với useState & useEffect",
    "en": "useState & useEffect"
  },
  "xu-ly-form-controlled-components": {
    "vi": "Xử lý Form & Controlled Components",
    "en": "Forms & Controlled Components"
  },
  "dieu-huong-dinh-tuyen-voi-react-router": {
    "vi": "Điều hướng & Định tuyến với React Router",
    "en": "React Router & Navigation"
  },
  "xay-dung-custom-hooks-tai-su-dung-logic": {
    "vi": "Xây dựng Custom Hooks tái sử dụng logic",
    "en": "Custom Hooks"
  },
  "quan-ly-state-toan-cuc-voi-context-api": {
    "vi": "Quản lý State toàn cục với Context API",
    "en": "Context API & State Management"
  },
  "mau-thiet-ke-nang-cao-kien-truc-react": {
    "vi": "Mẫu thiết kế nâng cao & Kiến trúc React",
    "en": "Advanced Patterns & Architecture"
  },
  "next-js-kien-truc-react-server-components": {
    "vi": "Next.js & Kiến trúc React Server Components",
    "en": "Next.js & Server Components"
  },
  "kien-truc-react-fiber-co-che-reconciliation": {
    "vi": "Kiến trúc React Fiber & Cơ chế Reconciliation",
    "en": "React Fiber & Reconciliation"
  },
  "react-19-tuong-lai-cua-react": {
    "vi": "React 19 & Tương lai của React",
    "en": "React 19 & Future"
  },
  "modules-mixins-xu-ly-loi": {
    "vi": "Modules, Mixins & Xử lý lỗi",
    "en": "Modules, Mixins & Error Handling"
  },
  "ruby-on-rails-co-ban": {
    "vi": "Ruby on Rails cơ bản",
    "en": "Ruby on Rails Fundamentals"
  },
  "activerecord-nang-cao": {
    "vi": "ActiveRecord nâng cao",
    "en": "ActiveRecord Advanced"
  },
  "kiem-thu-voi-rspec": {
    "vi": "Kiểm thử với RSpec",
    "en": "Testing với RSpec"
  },
  "test": {
    "vi": "Test (Chuyên đề)",
    "en": "Test"
  },
  "service-objects-mau-thiet-ke": {
    "vi": "Service Objects & Mẫu thiết kế",
    "en": "Service Objects & Design Patterns"
  },
  "rails-hieu-nang-background-jobs": {
    "vi": "Rails Hiệu năng & Background Jobs",
    "en": "Rails Performance & Background Jobs"
  },
  "xu-ly-loi-result-t-e": {
    "vi": "Xử lý lỗi & Result<T,E>",
    "en": "Error Handling & Result<T,E>"
  },
  "lifetimes-nang-cao-ownership": {
    "vi": "Lifetimes & nâng cao Ownership",
    "en": "Lifetimes & Advanced Ownership"
  },
  "lap-trinh-dong-thoi-threads-mutex-channels": {
    "vi": "Lập trình đồng thời: Threads, Mutex, Channels",
    "en": "Concurrency: Threads, Mutex, Channels"
  },
  "webassembly-nang-cao-rust": {
    "vi": "WebAssembly & nâng cao Rust",
    "en": "WebAssembly & Advanced Rust"
  },
  "thao-tac-du-lieu-select-insert-update-delete": {
    "vi": "Thao tác dữ liệu: SELECT, INSERT, UPDATE, DELETE",
    "en": "SELECT, INSERT, UPDATE, DELETE"
  },
  "menh-de-where-toan-tu-ham-xu-ly-du-lieu": {
    "vi": "Mệnh đề WHERE, Toán tử & Hàm xử lý dữ liệu",
    "en": "WHERE, Operators & Functions"
  },
  "lien-ket-bang-joins-quan-he-du-lieu": {
    "vi": "Liên kết bảng (JOINs) & Quan hệ dữ liệu",
    "en": "JOINs & Relationships"
  },
  "truy-van-con-subqueries-bang-tam-ctes": {
    "vi": "Truy vấn con (Subqueries) & Bảng tạm CTEs",
    "en": "Subqueries & CTEs"
  },
  "indexing-query-toi-uu-hoa": {
    "vi": "Indexing & Query Tối ưu hóa",
    "en": "Indexing & Query Optimization"
  },
  "nang-cao-data-modeling": {
    "vi": "nâng cao Data Modeling",
    "en": "Advanced Data Modeling"
  },
  "nang-cao-query-toi-uu-hoa": {
    "vi": "nâng cao Query Tối ưu hóa",
    "en": "Advanced Query Optimization"
  },
  "swift-lap-trinh-dong-thoi-async-await": {
    "vi": "Swift Lập trình đồng thời (async/await)",
    "en": "Swift Concurrency (async/await)"
  },
  "kien-truc-ung-dung-mo-hinh-mvvm-dieu-huong": {
    "vi": "Kiến trúc ứng dụng: Mô hình MVVM & Điều hướng",
    "en": "Kiến trúc ứng dụng: Mô hình MVVM & Navigation"
  },
  "design-system-kien-truc": {
    "vi": "Design System Kiến trúc",
    "en": "Design System Architecture"
  },
  "nen-tang-typescript-co-ban": {
    "vi": "Nền tảng TypeScript cơ bản",
    "en": "TypeScript Fundamentals"
  },
  "interfaces-type-aliases": {
    "vi": "Interfaces & Bí danh kiểu (Type Aliases)",
    "en": "Interfaces & Type Aliases"
  },
  "interfaces-bi-danh-kieu-type-aliases": {
    "vi": "Interfaces & Bí danh kiểu (Type Aliases)",
    "en": "Interfaces & Type Aliases"
  },
  "ham-generics-co-ban": {
    "vi": "Hàm & Generics cơ bản",
    "en": "Functions & Generics cơ bản"
  },
  "advanced-generics": {
    "vi": "Generics nâng cao & Ràng buộc kiểu",
    "en": "Advanced Generics"
  },
  "generics-nang-cao-rang-buoc-kieu": {
    "vi": "Generics nâng cao & Ràng buộc kiểu",
    "en": "Advanced Generics"
  },
  "utility-types-mapped-types": {
    "vi": "Utility Types & Mapped Types",
    "en": "Utility Types & Mapped Types"
  },
  "discriminated-unions-type-guards": {
    "vi": "Discriminated Unions & Type Guards",
    "en": "Discriminated Unions & Type Guards"
  },
  "conditional-types-infer": {
    "vi": "Kiểu điều kiện (Conditional Types) & Từ khóa infer",
    "en": "Conditional Types & Infer"
  },
  "kieu-dieu-kien-conditional-types-tu-khoa-infer": {
    "vi": "Kiểu điều kiện (Conditional Types) & Từ khóa infer",
    "en": "Conditional Types & Infer"
  },
  "advanced-typescript-patterns": {
    "vi": "Các mẫu Type nâng cao trong TypeScript",
    "en": "Advanced TypeScript Patterns"
  },
  "cac-mau-type-nang-cao-trong-typescript": {
    "vi": "Các mẫu Type nâng cao trong TypeScript",
    "en": "Advanced Type Patterns"
  },
  "declaration-files-module-types": {
    "vi": "File khai báo (.d.ts) & Module Types",
    "en": "Declaration Files & Module Types"
  },
  "file-khai-bao-d-ts-module-types": {
    "vi": "File khai báo (.d.ts) & Module Types",
    "en": "Declaration Files & Module Types"
  },
  "lap-trinh-muc-type-type-level-programming": {
    "vi": "Lập trình mức Type (Type-Level Programming)",
    "en": "Type-Level Programming"
  },
  "typescript-ecosystem-best-practices": {
    "vi": "Hệ sinh thái TypeScript & Thực hành chuẩn",
    "en": "TypeScript Ecosystem & Best Practices"
  },
  "he-sinh-thai-typescript-thuc-hanh-chuan": {
    "vi": "Hệ sinh thái TypeScript & Thực hành chuẩn",
    "en": "TypeScript Ecosystem & Best Practices"
  },
  "typescript-compiler-internals": {
    "vi": "TypeScript Compiler Kiến trúc bên trong",
    "en": "TypeScript Compiler Internals"
  },
  "pinia-quan-ly-trang-thai": {
    "vi": "Pinia Quản lý trạng thái",
    "en": "Pinia State Management"
  },
  "list-dict-set-tuple": {
    "vi": "List, Dict, Set, Tuple (Chuyên đề)",
    "en": "List, Dict, Set, Tuple"
  },
  "decorators-generators": {
    "vi": "Decorators & Generators (Chuyên đề)",
    "en": "Decorators & Generators"
  },
  "java-fundamentals": {
    "vi": "Java cơ bản",
    "en": "Java Fundamentals"
  },
  "java-co-ban": {
    "vi": "Java cơ bản",
    "en": "Java Fundamentals"
  },
  "generics-design-patterns": {
    "vi": "Generics & Mẫu thiết kế",
    "en": "Generics & Design Patterns"
  },
  "generics-mau-thiet-ke": {
    "vi": "Generics & Mẫu thiết kế",
    "en": "Generics & Design Patterns"
  },
  "spring-boot-essentials": {
    "vi": "Spring Boot Essentials (Chuyên đề)",
    "en": "Spring Boot Essentials"
  },
  "jvm-internals-gc-tuning": {
    "vi": "JVM Kiến trúc bên trong & GC Tuning",
    "en": "JVM Internals & GC Tuning"
  },
  "node-js-fundamentals": {
    "vi": "Node.js cơ bản",
    "en": "Node.js Fundamentals"
  },
  "node-js-co-ban": {
    "vi": "Node.js cơ bản",
    "en": "Node.js Fundamentals"
  },
  "express-js-rest-api": {
    "vi": "Express.js REST API (Chuyên đề)",
    "en": "Express.js REST API"
  },
  "authentication-jwt": {
    "vi": "Xác thực & JWT",
    "en": "Authentication & JWT"
  },
  "xac-thuc-jwt": {
    "vi": "Xác thực & JWT",
    "en": "Authentication & JWT"
  },
  "microservices-event-driven": {
    "vi": "Microservices & Event-Driven (Chuyên đề)",
    "en": "Microservices & Event-Driven"
  },
  "vi-dich-vu-microservices-event-driven": {
    "vi": "Vi dịch vụ Microservices & Event-Driven",
    "en": "Microservices & Event-Driven"
  },
  "v8-engine-performance-tuning": {
    "vi": "V8 Engine & Hiệu năng Tuning",
    "en": "V8 Engine & Performance Tuning"
  },
  "v8-engine-hieu-nang-tuning": {
    "vi": "V8 Engine & Hiệu năng Tuning",
    "en": "V8 Engine & Performance Tuning"
  },
  "custom-hooks-performance": {
    "vi": "Custom Hooks & Hiệu năng",
    "en": "Custom Hooks & Performance"
  },
  "custom-hooks-hieu-nang": {
    "vi": "Custom Hooks & Hiệu năng",
    "en": "Custom Hooks & Performance"
  },
  "react-architecture-patterns": {
    "vi": "React Kiến trúc Mẫu thiết kế",
    "en": "React Architecture Patterns"
  },
  "react-kien-truc-patterns": {
    "vi": "React Kiến trúc Patterns",
    "en": "React Architecture Patterns"
  },
  "html5-semantic-css-basics": {
    "vi": "HTML5 Semantic & CSS cơ bản",
    "en": "HTML5 Semantic & CSS Basics"
  },
  "html5-semantic-css-co-ban": {
    "vi": "HTML5 Semantic & CSS cơ bản",
    "en": "HTML5 Semantic & CSS Basics"
  },
  "flexbox-grid-layout": {
    "vi": "Flexbox & Grid Layout (Chuyên đề)",
    "en": "Flexbox & Grid Layout"
  },
  "css-variables-animations": {
    "vi": "CSS Biến số & Animations",
    "en": "CSS Variables & Animations"
  },
  "css-architecture-a11y": {
    "vi": "CSS Kiến trúc & a11y",
    "en": "CSS Architecture & a11y"
  },
  "css-kien-truc-a11y": {
    "vi": "CSS Kiến trúc & a11y",
    "en": "CSS Architecture & a11y"
  },
  "design-systems-houdini": {
    "vi": "Design Systems & Houdini (Chuyên đề)",
    "en": "Design Systems & Houdini"
  },
  "mongodb-nosql-patterns": {
    "vi": "MongoDB & NoSQL Mẫu thiết kế",
    "en": "MongoDB & NoSQL Patterns"
  },
  "query-optimization-explain": {
    "vi": "Query Tối ưu hóa & EXPLAIN",
    "en": "Query Optimization & EXPLAIN"
  },
  "query-toi-uu-hoa-explain": {
    "vi": "Query Tối ưu hóa & EXPLAIN",
    "en": "Query Optimization & EXPLAIN"
  },
  "jest-basics-assertions": {
    "vi": "Jest cơ bản & Assertions",
    "en": "Jest Basics & Assertions"
  },
  "jest-co-ban-assertions": {
    "vi": "Jest cơ bản & Assertions",
    "en": "Jest Basics & Assertions"
  },
  "mocking-async-tests": {
    "vi": "Mocking & Async Tests (Chuyên đề)",
    "en": "Mocking & Async Tests"
  },
  "integration-testing-patterns": {
    "vi": "Tích hợp Kiểm thử Mẫu thiết kế",
    "en": "Integration Testing Patterns"
  },
  "integration-kiem-thu-patterns": {
    "vi": "Integration Kiểm thử Patterns",
    "en": "Integration Testing Patterns"
  },
  "testing-strategy-best-practices": {
    "vi": "Kiểm thử Strategy & Best Practices",
    "en": "Testing Strategy & Best Practices"
  },
  "kiem-thu-strategy-thuc-hanh-chuan": {
    "vi": "Kiểm thử Strategy & Thực hành chuẩn",
    "en": "Testing Strategy & Best Practices"
  },
  "dockerfile-docker-compose": {
    "vi": "Dockerfile & Docker Compose (Chuyên đề)",
    "en": "Dockerfile & Docker Compose"
  },
  "git-flow-ci-cd": {
    "vi": "Git Flow & CI/CD (Chuyên đề)",
    "en": "Git Flow & CI/CD"
  },
  "docker-production-best-practices": {
    "vi": "Docker Production Best Practices (Chuyên đề)",
    "en": "Docker Production Best Practices"
  },
  "docker-production-thuc-hanh-chuan": {
    "vi": "Docker Production Thực hành chuẩn",
    "en": "Docker Production Best Practices"
  },
  "kubernetes-gitops": {
    "vi": "Kubernetes & GitOps (Chuyên đề)",
    "en": "Kubernetes & GitOps"
  },
  "database-design-normalization": {
    "vi": "Thiết kế CSDL & Chuẩn hóa dữ liệu (Normalization)",
    "en": "Database Design & Normalization"
  },
  "thiet-ke-csdl-chuan-hoa-du-lieu-normalization": {
    "vi": "Thiết kế CSDL & Chuẩn hóa dữ liệu (Normalization)",
    "en": "Database Design & Normalization"
  },
  "indexes-performance-tuning": {
    "vi": "Đánh chỉ mục (Indexes) & Tối ưu hóa truy vấn",
    "en": "Indexes & Performance Tuning"
  },
  "danh-chi-muc-indexes-toi-uu-hoa-truy-van": {
    "vi": "Đánh chỉ mục (Indexes) & Tối ưu hóa truy vấn",
    "en": "Indexes & Performance Tuning"
  },
  "transactions-acid-properties": {
    "vi": "Giao dịch (Transactions) & Tính chất ACID",
    "en": "Transactions & ACID Properties"
  },
  "giao-dich-transactions-tinh-chat-acid": {
    "vi": "Giao dịch (Transactions) & Tính chất ACID",
    "en": "Transactions & ACID Properties"
  },
  "views-stored-procedures-triggers": {
    "vi": "Views, Stored Procedures & Triggers",
    "en": "Views, Stored Procedures & Triggers"
  },
  "nosql-mongodb-redis": {
    "vi": "Cơ sở dữ liệu NoSQL: MongoDB & Redis Caching",
    "en": "NoSQL: MongoDB & Redis"
  },
  "co-so-du-lieu-nosql-mongodb-redis-caching": {
    "vi": "Cơ sở dữ liệu NoSQL: MongoDB & Redis Caching",
    "en": "NoSQL: MongoDB & Redis"
  },
  "query-optimization-execution-plans": {
    "vi": "Tối ưu hóa truy vấn & Phân tích Execution Plan",
    "en": "Query Optimization & Execution Plans"
  },
  "toi-uu-hoa-truy-van-phan-tich-execution-plan": {
    "vi": "Tối ưu hóa truy vấn & Phân tích Execution Plan",
    "en": "Query Optimization & Execution Plans"
  },
  "scaling-replication-sharding": {
    "vi": "Mở rộng CSDL: Nhân bản (Replication) & Phân mảnh (Sharding)",
    "en": "Scaling: Replication & Sharding"
  },
  "mo-rong-csdl-nhan-ban-replication-phan-manh-sharding": {
    "vi": "Mở rộng CSDL: Nhân bản (Replication) & Phân mảnh (Sharding)",
    "en": "Scaling: Replication & Sharding"
  },
  "database-internals-storage-engines": {
    "vi": "Kiến trúc bên trong CSDL & Storage Engines",
    "en": "Database Internals & Storage Engines"
  },
  "kien-truc-ben-trong-csdl-storage-engines": {
    "vi": "Kiến trúc bên trong CSDL & Storage Engines",
    "en": "Database Internals & Storage Engines"
  },
  "git-co-ban-init-add-commit-log": {
    "vi": "Git cơ bản: init, add, commit, log",
    "en": "Git cơ bản: init, add, commit, log"
  },
  "branching-merging": {
    "vi": "Quản lý nhánh (Branching) & Trộn mã (Merging)",
    "en": "Branching & Merging"
  },
  "quan-ly-nhanh-branching-tron-ma-merging": {
    "vi": "Quản lý nhánh (Branching) & Trộn mã (Merging)",
    "en": "Branching & Merging"
  },
  "remote-repositories-github": {
    "vi": "Kho lưu trữ từ xa & Làm việc với GitHub",
    "en": "Remote Repositories & GitHub"
  },
  "kho-luu-tru-tu-xa-lam-viec-voi-github": {
    "vi": "Kho lưu trữ từ xa & Làm việc với GitHub",
    "en": "Remote Repositories & GitHub"
  },
  "docker-basics-dockerfile": {
    "vi": "Cơ bản về Docker & Cấu hình Dockerfile",
    "en": "Docker Basics & Dockerfile"
  },
  "co-ban-ve-docker-cau-hinh-dockerfile": {
    "vi": "Cơ bản về Docker & Cấu hình Dockerfile",
    "en": "Docker Basics & Dockerfile"
  },
  "advanced-git-rebase-cherry-pick-bisect": {
    "vi": "Git nâng cao: rebase, cherry-pick, bisect",
    "en": "Advanced Git: rebase, cherry-pick, bisect"
  },
  "git-nang-cao-rebase-cherry-pick-bisect": {
    "vi": "Git nâng cao: rebase, cherry-pick, bisect",
    "en": "Advanced Git: rebase, cherry-pick, bisect"
  },
  "docker-networking-volumes": {
    "vi": "Mạng Docker (Networking) & Lưu trữ Volumes",
    "en": "Docker Networking & Volumes"
  },
  "mang-docker-networking-luu-tru-volumes": {
    "vi": "Mạng Docker (Networking) & Lưu trữ Volumes",
    "en": "Docker Networking & Volumes"
  },
  "multi-stage-builds-optimization": {
    "vi": "Multi-stage Builds & Tối ưu hóa dung lượng Image",
    "en": "Multi-stage Builds & Optimization"
  },
  "multi-stage-builds-toi-uu-hoa-dung-luong-image": {
    "vi": "Multi-stage Builds & Tối ưu hóa dung lượng Image",
    "en": "Multi-stage Builds & Optimization"
  },
  "docker-trong-production-security": {
    "vi": "Bảo mật Docker & Vận hành Production",
    "en": "Docker trong Production & Security"
  },
  "bao-mat-docker-van-hanh-production": {
    "vi": "Bảo mật Docker & Vận hành Production",
    "en": "Docker trong Production & Security"
  },
  "git-internals-recovery": {
    "vi": "Kiến trúc bên trong Git & Phục hồi dữ liệu",
    "en": "Git Internals & Recovery"
  },
  "kien-truc-ben-trong-git-phuc-hoi-du-lieu": {
    "vi": "Kiến trúc bên trong Git & Phục hồi dữ liệu",
    "en": "Git Internals & Recovery"
  },
  "bieu-mau-forms-quan-ly-trang-thai": {
    "vi": "Biểu mẫu (Forms) & Quản lý trạng thái",
    "en": "Forms & State Management"
  },
  "mau-kien-truc-doanh-nghiep": {
    "vi": "Mẫu kiến trúc doanh nghiệp",
    "en": "Enterprise Patterns"
  },
  "kich-ban-tu-dong-hoa-production": {
    "vi": "Kịch bản tự động hóa Production",
    "en": "Production Scripting"
  },
  "lam-chu-shell-quan-tri-he-thong": {
    "vi": "Làm chủ Shell & Quản trị hệ thống",
    "en": "Shell Mastery"
  },
  "cay-nhi-phan-bang-bam-hash-maps": {
    "vi": "Cây nhị phân & Bảng băm (Hash Maps)",
    "en": "Trees & Hash Maps"
  },
  "do-thi-graphs-quy-hoach-dong-dp": {
    "vi": "Đồ thị (Graphs) & Quy hoạch động (DP)",
    "en": "Graphs & Dynamic Programming"
  },
  "cac-dang-bai-phong-van-thuat-toan": {
    "vi": "Các dạng bài phỏng vấn thuật toán",
    "en": "Interview Problem Patterns"
  },
  "templates-thu-vien-stl-c-hien-dai": {
    "vi": "Templates, Thư viện STL & C++ hiện đại",
    "en": "Templates, STL & Modern C++"
  },
  "lap-trinh-sieu-mau-thiet-ke-he-thong": {
    "vi": "Lập trình siêu mẫu & Thiết kế hệ thống",
    "en": "Metaprogramming & System Design"
  },
  "giao-dien-flutter-quan-ly-state": {
    "vi": "Giao diện Flutter & Quản lý State",
    "en": "Flutter UI & State"
  },
  "cau-hinh-configmaps-secrets-luu-tru-volumes": {
    "vi": "Cấu hình ConfigMaps, Secrets & Lưu trữ Volumes",
    "en": "ConfigMaps, Secrets, Volumes"
  },
  "quan-ly-goi-helm-kubernetes-operators": {
    "vi": "Quản lý gói Helm & Kubernetes Operators",
    "en": "Helm & Operators"
  },
  "thuc-hanh-chuan-trong-moi-truong-production": {
    "vi": "Thực hành chuẩn trong môi trường Production",
    "en": "Production Best Practices"
  },
  "toi-uu-hoa-docker-builds-bo-nho-dem-caching": {
    "vi": "Tối ưu hóa Docker Builds & Bộ nhớ đệm Caching",
    "en": "Docker builds & Caching"
  },
  "chung-chi-ssl-can-bang-tai-load-balancing": {
    "vi": "Chứng chỉ SSL & Cân bằng tải Load Balancing",
    "en": "SSL & Load Balancing"
  },
  "quan-tri-may-chu-linux-chuyen-nghiep": {
    "vi": "Quản trị máy chủ Linux chuyên nghiệp",
    "en": "Linux server admin"
  },
  "bieu-mau-xac-thuc-nguoi-dung-trang-quan-tri": {
    "vi": "Biểu mẫu, Xác thực người dùng & Trang quản trị",
    "en": "Forms, Auth & Admin"
  },
  "xay-dung-rest-api-class-based-views": {
    "vi": "Xây dựng REST API & Class-Based Views",
    "en": "REST API & Class-Based Views"
  },
  "co-che-go-runtime-lap-trinh-he-thong": {
    "vi": "Cơ chế Go Runtime & Lập trình hệ thống",
    "en": "Go Runtime & System Programming"
  },
  "xu-ly-resolvers-apollo-server": {
    "vi": "Xử lý Resolvers & Apollo Server",
    "en": "Resolvers & Apollo Server"
  },
  "realtime-subscriptions-ky-thuat-nang-cao": {
    "vi": "Realtime Subscriptions & Kỹ thuật nâng cao",
    "en": "Subscriptions & Advanced"
  },
  "toi-uu-hoa-truy-van-n-1-dataloader": {
    "vi": "Tối ưu hóa truy vấn N+1 & DataLoader",
    "en": "N+1 & DataLoader"
  },
  "kien-truc-graphql-federation-production": {
    "vi": "Kiến trúc GraphQL Federation & Production",
    "en": "Federation & Production"
  },
  "bo-cuc-flexbox-css-grid-responsive": {
    "vi": "Bố cục Flexbox, CSS Grid & Responsive",
    "en": "Flexbox, Grid & Responsive"
  },
  "hieu-ung-chuyen-dong-css-variables-css-hien-dai": {
    "vi": "Hiệu ứng chuyển động, CSS Variables & CSS hiện đại",
    "en": "Animations, Variables & Modern CSS"
  },
  "kien-truc-css-he-thong-thiet-ke-design-systems": {
    "vi": "Kiến trúc CSS & Hệ thống thiết kế Design Systems",
    "en": "CSS Architecture & Design Systems"
  },
  "ky-thuat-css-nang-cao-paint-api-houdini": {
    "vi": "Kỹ thuật CSS nâng cao & Paint API Houdini",
    "en": "Advanced CSS & Houdini"
  },
  "mau-thiet-ke-phan-mem-tuong-tac-csdl": {
    "vi": "Mẫu thiết kế phần mềm & Tương tác CSDL",
    "en": "Design Patterns & Database"
  },
  "ky-thuat-mocking-kiem-thu-bat-dong-bo": {
    "vi": "Kỹ thuật Mocking & Kiểm thử bất đồng bộ",
    "en": "Mocking & Async Testing"
  },
  "kiem-thu-tich-hop-ky-thuat-chuyen-sau": {
    "vi": "Kiểm thử tích hợp & Kỹ thuật chuyên sâu",
    "en": "Integration & Advanced Testing"
  },
  "ci-cd-multi-stage-security": {
    "vi": "Quy trình CI/CD, Multi-stage & Bảo mật",
    "en": "CI/CD, Multi-stage & Security"
  },
  "quy-trinh-ci-cd-multi-stage-bao-mat": {
    "vi": "Quy trình CI/CD, Multi-stage & Bảo mật",
    "en": "CI/CD, Multi-stage & Security"
  },
  "production-advanced-patterns": {
    "vi": "Vận hành Production & Mẫu thiết kế nâng cao",
    "en": "Production & Advanced Patterns"
  },
  "van-hanh-production-mau-thiet-ke-nang-cao": {
    "vi": "Vận hành Production & Mẫu thiết kế nâng cao",
    "en": "Production & Advanced Patterns"
  },
  "advanced-types-patterns": {
    "vi": "nâng cao Types & Mẫu thiết kế",
    "en": "Advanced Types & Patterns"
  },
  "cac-kieu-du-lieu-nang-cao-mau-thiet-ke": {
    "vi": "Các kiểu dữ liệu nâng cao & Mẫu thiết kế",
    "en": "Advanced Types & Patterns"
  },
  "conditional-types-advanced-patterns": {
    "vi": "Conditional Types & nâng cao Mẫu thiết kế",
    "en": "Conditional Types & Advanced Patterns"
  },
  "kieu-dieu-kien-conditional-types-mau-thiet-ke-nang-cao": {
    "vi": "Kiểu điều kiện (Conditional Types) & Mẫu thiết kế nâng cao",
    "en": "Conditional Types & Advanced Patterns"
  },
  "lap-trinh-muc-type-chuyen-sau": {
    "vi": "Lập trình mức Type chuyên sâu",
    "en": "Type-Level Programming"
  },
  "reactive-ui-state": {
    "vi": "Giao diện phản ứng Reactive & Quản lý State",
    "en": "Reactive UI & State"
  },
  "giao-dien-phan-ung-reactive-quan-ly-state": {
    "vi": "Giao diện phản ứng Reactive & Quản lý State",
    "en": "Reactive UI & State"
  },
  "components-composition": {
    "vi": "Kiến trúc Component & Composition API",
    "en": "Components & Composition"
  },
  "kien-truc-component-composition-api": {
    "vi": "Kiến trúc Component & Composition API",
    "en": "Components & Composition"
  },
  "nuxt-fullstack-vue": {
    "vi": "Phát triển Fullstack Vue với Nuxt.js",
    "en": "Nuxt & Fullstack Vue"
  },
  "phat-trien-fullstack-vue-voi-nuxt-js": {
    "vi": "Phát triển Fullstack Vue với Nuxt.js",
    "en": "Nuxt & Fullstack Vue"
  },
  "vue-internals-performance": {
    "vi": "Kiến trúc bên trong Vue & Tối ưu hiệu năng",
    "en": "Vue Internals & Performance"
  },
  "kien-truc-ben-trong-vue-toi-uu-hieu-nang": {
    "vi": "Kiến trúc bên trong Vue & Tối ưu hiệu năng",
    "en": "Vue Internals & Performance"
  },
  "tong-quan-ve-angular-angular-cli": {
    "vi": "Tổng quan về Angular & Angular CLI",
    "en": "Angular Overview & CLI"
  },
  "templates-lien-ket-du-lieu-data-binding": {
    "vi": "Templates & Liên kết dữ liệu (Data Binding)",
    "en": "Templates & Data Binding"
  },
  "kien-truc-components-truyen-du-lieu-input-output": {
    "vi": "Kiến trúc Components & Truyền dữ liệu Input/Output",
    "en": "Components & Input/Output"
  },
  "dich-vu-services-tiem-phu-thuoc-di": {
    "vi": "Dịch vụ (Services) & Tiêm phụ thuộc (DI)",
    "en": "Services & Dependency Injection"
  },
  "dinh-tuyen-dieu-huong-voi-angular-router": {
    "vi": "Định tuyến & Điều hướng với Angular Router",
    "en": "Angular Router"
  },
  "lap-trinh-phan-ung-voi-rxjs-observables": {
    "vi": "Lập trình phản ứng với RxJS & Observables",
    "en": "RxJS & Observables"
  },
  "xu-ly-bieu-mau-phan-ung-reactive-forms": {
    "vi": "Xử lý biểu mẫu phản ứng (Reactive Forms)",
    "en": "Reactive Forms"
  },
  "xu-ly-van-ban-dong-lenh-awk-sed-xargs": {
    "vi": "Xử lý văn bản dòng lệnh: awk, sed, xargs",
    "en": "Text Processing: awk, sed, xargs"
  },
  "viet-kich-ban-tu-dong-hoa-docker-compose": {
    "vi": "Viết kịch bản tự động hóa Docker & Compose",
    "en": "Docker & Docker Compose Scripting"
  },
  "kich-ban-shell-cho-moi-truong-production": {
    "vi": "Kịch bản Shell cho môi trường Production",
    "en": "Production Shell Scripting"
  },
  "phan-tich-do-phuc-tap-thuat-toan-big-o": {
    "vi": "Phân tích độ phức tạp thuật toán Big O",
    "en": "Big O & Complexity Analysis"
  },
  "ky-thuat-xu-ly-mang-chuoi-two-pointers-sliding-window": {
    "vi": "Kỹ thuật xử lý Mảng & Chuỗi (Two Pointers, Sliding Window)",
    "en": "Arrays & Strings Techniques"
  },
  "danh-sach-lien-ket-ngan-xep-stack-hang-doi-queue": {
    "vi": "Danh sách liên kết, Ngăn xếp (Stack) & Hàng đợi (Queue)",
    "en": "Linked List & Stack/Queue"
  },
  "bang-bam-hash-maps-tap-hop-sets": {
    "vi": "Bảng băm (Hash Maps) & Tập hợp (Sets)",
    "en": "Hash Maps & Sets"
  },
  "cay-nhi-phan-binary-trees-cay-tim-kiem-nhi-phan-bst": {
    "vi": "Cây nhị phân (Binary Trees) & Cây tìm kiếm nhị phân (BST)",
    "en": "Binary Trees & BST"
  },
  "thuat-toan-de-quy-quay-lui-backtracking": {
    "vi": "Thuật toán đệ quy & Quay lui (Backtracking)",
    "en": "Recursion & Backtracking"
  },
  "thuat-toan-quy-hoach-dong-dynamic-programming": {
    "vi": "Thuật toán quy hoạch động (Dynamic Programming)",
    "en": "Dynamic Programming"
  },
  "phuong-phap-giai-bai-phong-van-thuat-toan-thuc-chien": {
    "vi": "Phương pháp giải bài phỏng vấn thuật toán thực chiến",
    "en": "Interview Problem-Solving Patterns"
  },
  "tuong-tac-co-so-du-lieu-voi-entity-framework-core": {
    "vi": "Tương tác cơ sở dữ liệu với Entity Framework Core",
    "en": "Entity Framework Core"
  },
  "lap-trinh-bat-dong-bo-future-stream-isolate": {
    "vi": "Lập trình bất đồng bộ: Future, Stream & Isolate",
    "en": "Async: Future, Stream & Isolate"
  },
  "quan-ly-kubernetes-deployments-services": {
    "vi": "Quản lý Kubernetes Deployments & Services",
    "en": "Deployments & Services"
  },
  "cau-hinh-ung-dung-voi-configmaps-secrets": {
    "vi": "Cấu hình ứng dụng với ConfigMaps & Secrets",
    "en": "ConfigMaps & Secrets"
  },
  "dinh-tuyen-ingress-mang-kubernetes": {
    "vi": "Định tuyến Ingress & Mạng Kubernetes",
    "en": "Ingress & Networking"
  },
  "dong-goi-ung-dung-voi-helm-charts-templating": {
    "vi": "Đóng gói ứng dụng với Helm Charts & Templating",
    "en": "Helm Charts & Templating"
  },
  "khai-niem-ci-cd-lam-viec-voi-github-actions": {
    "vi": "Khái niệm CI/CD & Làm việc với GitHub Actions",
    "en": "CI/CD Concepts & GitHub Actions"
  },
  "tu-dong-build-push-docker-image-trong-ci": {
    "vi": "Tự động Build & Push Docker Image trong CI",
    "en": "Docker Build & Push in CI"
  },
  "chien-luoc-matrix-tai-su-dung-workflows": {
    "vi": "Chiến lược Matrix & Tái sử dụng Workflows",
    "en": "Matrix Strategy & Reusable Workflows"
  },
  "quan-ly-monorepo-workflows-co-dieu-kien": {
    "vi": "Quản lý Monorepo & Workflows có điều kiện",
    "en": "Monorepo & Conditional Workflows"
  },
  "mo-hinh-gitops-trien-khai-da-moi-truong": {
    "vi": "Mô hình GitOps & Triển khai đa môi trường",
    "en": "GitOps & Multi-Environment"
  },
  "nginx-basics-configuration": {
    "vi": "Cơ bản về Nginx & Cấu hình máy chủ",
    "en": "Nginx Basics & Configuration"
  },
  "co-ban-ve-nginx-cau-hinh-may-chu": {
    "vi": "Cơ bản về Nginx & Cấu hình máy chủ",
    "en": "Nginx Basics & Configuration"
  },
  "reverse-proxy-load-balancing": {
    "vi": "Cấu hình Reverse Proxy & Cân bằng tải",
    "en": "Reverse Proxy & Load Balancing"
  },
  "cau-hinh-reverse-proxy-can-bang-tai": {
    "vi": "Cấu hình Reverse Proxy & Cân bằng tải",
    "en": "Reverse Proxy & Load Balancing"
  },
  "ssl-tls-security-headers": {
    "vi": "Bảo mật SSL/TLS & Cấu hình Security Headers",
    "en": "SSL/TLS & Security Headers"
  },
  "bao-mat-ssl-tls-cau-hinh-security-headers": {
    "vi": "Bảo mật SSL/TLS & Cấu hình Security Headers",
    "en": "SSL/TLS & Security Headers"
  },
  "performance-caching": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ đệm Nginx",
    "en": "Performance & Caching"
  },
  "toi-uu-hoa-hieu-nang-bo-nho-dem-nginx": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ đệm Nginx",
    "en": "Performance & Caching"
  },
  "logging-monitoring": {
    "vi": "Ghi nhật ký (Logging) & Giám sát hệ thống",
    "en": "Logging & Monitoring"
  },
  "ghi-nhat-ky-logging-giam-sat-he-thong": {
    "vi": "Ghi nhật ký (Logging) & Giám sát hệ thống",
    "en": "Logging & Monitoring"
  },
  "go-overview-toolchain": {
    "vi": "Tổng quan về Go & Bộ công cụ Go Toolchain",
    "en": "Go Overview & Toolchain"
  },
  "tong-quan-ve-go-bo-cong-cu-go-toolchain": {
    "vi": "Tổng quan về Go & Bộ công cụ Go Toolchain",
    "en": "Go Overview & Toolchain"
  },
  "packages-modules": {
    "vi": "Quản lý Packages & Go Modules",
    "en": "Packages & Modules"
  },
  "quan-ly-packages-go-modules": {
    "vi": "Quản lý Packages & Go Modules",
    "en": "Packages & Modules"
  },
  "cau-truc-du-lieu-structs-phuong-thuc-trong-go": {
    "vi": "Cấu trúc dữ liệu Structs & Phương thức trong Go",
    "en": "Structs & Methods"
  },
  "interfaces-type-system": {
    "vi": "Giao diện Interfaces & Hệ thống kiểu trong Go",
    "en": "Interfaces & Type System"
  },
  "giao-dien-interfaces-he-thong-kieu-trong-go": {
    "vi": "Giao diện Interfaces & Hệ thống kiểu trong Go",
    "en": "Interfaces & Type System"
  },
  "goroutines-concurrency": {
    "vi": "Lập trình đa luồng với Goroutines & Channels",
    "en": "Goroutines & Concurrency"
  },
  "standard-library-file-i-o": {
    "vi": "Thư viện chuẩn Standard Library & Đọc ghi File I/O",
    "en": "Standard Library & File I/O"
  },
  "thu-vien-chuan-standard-library-doc-ghi-file-i-o": {
    "vi": "Thư viện chuẩn Standard Library & Đọc ghi File I/O",
    "en": "Standard Library & File I/O"
  },
  "web-development-with-net-http": {
    "vi": "Xây dựng Web Server với net/http & Gin",
    "en": "Web Development with net/http"
  },
  "xay-dung-web-server-voi-net-http-gin": {
    "vi": "Xây dựng Web Server với net/http & Gin",
    "en": "Web Development with net/http"
  },
  "database-sql-in-go": {
    "vi": "Tương tác cơ sở dữ liệu & SQL trong Go",
    "en": "Database & SQL in Go"
  },
  "tuong-tac-co-so-du-lieu-sql-trong-go": {
    "vi": "Tương tác cơ sở dữ liệu & SQL trong Go",
    "en": "Database & SQL in Go"
  },
  "testing-benchmarking": {
    "vi": "Kiểm thử phần mềm & Đo kiểm hiệu năng (Benchmark)",
    "en": "Testing & Benchmarking"
  },
  "kiem-thu-phan-mem-do-kiem-hieu-nang-benchmark": {
    "vi": "Kiểm thử phần mềm & Đo kiểm hiệu năng (Benchmark)",
    "en": "Testing & Benchmarking"
  },
  "graphql-overview-schema": {
    "vi": "Tổng quan về GraphQL & Định nghĩa Schema",
    "en": "GraphQL Overview & Schema"
  },
  "tong-quan-ve-graphql-dinh-nghia-schema": {
    "vi": "Tổng quan về GraphQL & Định nghĩa Schema",
    "en": "GraphQL Overview & Schema"
  },
  "queries-mutations": {
    "vi": "Truy vấn dữ liệu (Queries) & Thao tác thay đổi (Mutations)",
    "en": "Queries & Mutations"
  },
  "truy-van-du-lieu-queries-thao-tac-thay-doi-mutations": {
    "vi": "Truy vấn dữ liệu (Queries) & Thao tác thay đổi (Mutations)",
    "en": "Queries & Mutations"
  },
  "apollo-client-integration": {
    "vi": "Tích hợp Apollo Client vào ứng dụng Frontend",
    "en": "Apollo Client Integration"
  },
  "tich-hop-apollo-client-vao-ung-dung-frontend": {
    "vi": "Tích hợp Apollo Client vào ứng dụng Frontend",
    "en": "Apollo Client (Frontend)"
  },
  "pagination-cursor-based": {
    "vi": "Phân trang dữ liệu theo Offset & Cursor-based",
    "en": "Pagination & Cursor-based"
  },
  "phan-trang-du-lieu-theo-offset-cursor-based": {
    "vi": "Phân trang dữ liệu theo Offset & Cursor-based",
    "en": "Pagination & Cursor-based"
  },
  "authentication-authorization-in-graphql": {
    "vi": "Xác thực & Phân quyền bảo mật trong GraphQL",
    "en": "Authentication & Authorization in GraphQL"
  },
  "xac-thuc-phan-quyen-bao-mat-trong-graphql": {
    "vi": "Xác thực & Phân quyền bảo mật trong GraphQL",
    "en": "Authentication & Authorization in GraphQL"
  },
  "microservices-with-graphql": {
    "vi": "Kiến trúc Microservices kết hợp GraphQL",
    "en": "Microservices with GraphQL"
  },
  "kien-truc-microservices-ket-hop-graphql": {
    "vi": "Kiến trúc Microservices kết hợp GraphQL",
    "en": "Microservices with GraphQL"
  },
  "html-basics-semantic-tags": {
    "vi": "Cơ bản về HTML & Các thẻ ngữ nghĩa Semantic",
    "en": "HTML Basics & Semantic Tags"
  },
  "co-ban-ve-html-cac-the-ngu-nghia-semantic": {
    "vi": "Cơ bản về HTML & Các thẻ ngữ nghĩa Semantic",
    "en": "HTML Basics & Semantic Tags"
  },
  "forms-inputs": {
    "vi": "Biểu mẫu HTML & Các loại trường nhập liệu Inputs",
    "en": "Forms & Inputs"
  },
  "bieu-mau-html-cac-loai-truong-nhap-lieu-inputs": {
    "vi": "Biểu mẫu HTML & Các loại trường nhập liệu Inputs",
    "en": "Forms & Inputs"
  },
  "css-fundamentals-selectors": {
    "vi": "Nền tảng CSS cơ bản & Các loại bộ chọn Selectors",
    "en": "CSS Fundamentals & Selectors"
  },
  "nen-tang-css-co-ban-cac-loai-bo-chon-selectors": {
    "vi": "Nền tảng CSS cơ bản & Các loại bộ chọn Selectors",
    "en": "CSS Fundamentals & Selectors"
  },
  "box-model-layout": {
    "vi": "Mô hình hộp Box Model & Bố cục trang",
    "en": "Box Model & Layout"
  },
  "mo-hinh-hop-box-model-bo-cuc-trang": {
    "vi": "Mô hình hộp Box Model & Bố cục trang",
    "en": "Box Model & Layout"
  },
  "flexbox-deep-dive": {
    "vi": "Chuyên sâu về bố cục giao diện CSS Flexbox",
    "en": "Flexbox Deep Dive"
  },
  "chuyen-sau-ve-bo-cuc-giao-dien-css-flexbox": {
    "vi": "Chuyên sâu về bố cục giao diện CSS Flexbox",
    "en": "Flexbox Deep Dive"
  },
  "css-grid-deep-dive": {
    "vi": "Chuyên sâu về bố cục lưới CSS Grid",
    "en": "CSS Grid Deep Dive"
  },
  "chuyen-sau-ve-bo-cuc-luoi-css-grid": {
    "vi": "Chuyên sâu về bố cục lưới CSS Grid",
    "en": "CSS Grid Deep Dive"
  },
  "responsive-design": {
    "vi": "Thiết kế giao diện thích ứng đa màn hình (Responsive)",
    "en": "Responsive Design"
  },
  "thiet-ke-giao-dien-thich-ung-da-man-hinh-responsive": {
    "vi": "Thiết kế giao diện thích ứng đa màn hình (Responsive)",
    "en": "Responsive Design"
  },
  "css-variables-theming": {
    "vi": "Biến CSS (Custom Properties) & Xây dựng giao diện Dark/Light",
    "en": "CSS Variables & Theming"
  },
  "bien-css-custom-properties-xay-dung-giao-dien-dark-light": {
    "vi": "Biến CSS (Custom Properties) & Xây dựng giao diện Dark/Light",
    "en": "CSS Variables & Theming"
  },
  "css-animations-keyframes": {
    "vi": "Hiệu ứng chuyển động CSS Animations & Keyframes",
    "en": "CSS Animations & Keyframes"
  },
  "hieu-ung-chuyen-dong-css-animations-keyframes": {
    "vi": "Hiệu ứng chuyển động CSS Animations & Keyframes",
    "en": "CSS Animations & Keyframes"
  },
  "modern-css-features": {
    "vi": "Các tính năng CSS thế hệ mới",
    "en": "Modern CSS Features"
  },
  "cac-tinh-nang-css-the-he-moi": {
    "vi": "Các tính năng CSS thế hệ mới",
    "en": "Modern CSS Features"
  },
  "java-overview-jdk-setup": {
    "vi": "Tổng quan về Java & Cài đặt môi trường JDK",
    "en": "Java Overview & JDK Setup"
  },
  "tong-quan-ve-java-cai-dat-moi-truong-jdk": {
    "vi": "Tổng quan về Java & Cài đặt môi trường JDK",
    "en": "Java Overview & JDK Setup"
  },
  "kieu-du-lieu-luong-dieu-khien-trong-java": {
    "vi": "Kiểu dữ liệu & Luồng điều khiển trong Java",
    "en": "Data Types & Control Flow"
  },
  "methods-arrays": {
    "vi": "Phương thức & Mảng dữ liệu trong Java",
    "en": "Methods & Arrays"
  },
  "phuong-thuc-mang-du-lieu-trong-java": {
    "vi": "Phương thức & Mảng dữ liệu trong Java",
    "en": "Methods & Arrays"
  },
  "oop-fundamentals-in-java": {
    "vi": "Nền tảng lập trình hướng đối tượng trong Java",
    "en": "OOP Fundamentals in Java"
  },
  "nen-tang-lap-trinh-huong-doi-tuong-trong-java": {
    "vi": "Nền tảng lập trình hướng đối tượng trong Java",
    "en": "OOP Fundamentals in Java"
  },
  "exception-handling-collections": {
    "vi": "Xử lý ngoại lệ & Bộ khung Java Collections",
    "en": "Exception Handling & Collections"
  },
  "xu-ly-ngoai-le-bo-khung-java-collections": {
    "vi": "Xử lý ngoại lệ & Bộ khung Java Collections",
    "en": "Exception Handling & Collections"
  },
  "generics-lambda-in-java": {
    "vi": "Lập trình Generics & Biểu thức Lambda trong Java",
    "en": "Generics & Lambda in Java"
  },
  "lap-trinh-generics-bieu-thuc-lambda-trong-java": {
    "vi": "Lập trình Generics & Biểu thức Lambda trong Java",
    "en": "Generics & Lambda in Java"
  },
  "streams-api-optional": {
    "vi": "Xử lý dữ liệu với Streams API & Kiểu Optional",
    "en": "Streams API & Optional"
  },
  "xu-ly-du-lieu-voi-streams-api-kieu-optional": {
    "vi": "Xử lý dữ liệu với Streams API & Kiểu Optional",
    "en": "Streams API & Optional"
  },
  "file-i-o-serialization": {
    "vi": "Đọc ghi File I/O & Tuần tự hóa dữ liệu",
    "en": "File I/O & Serialization"
  },
  "doc-ghi-file-i-o-tuan-tu-hoa-du-lieu": {
    "vi": "Đọc ghi File I/O & Tuần tự hóa dữ liệu",
    "en": "File I/O & Serialization"
  },
  "spring-framework-basics": {
    "vi": "Nền tảng Spring Framework & Inversion of Control",
    "en": "Spring Framework Basics"
  },
  "nen-tang-spring-framework-inversion-of-control": {
    "vi": "Nền tảng Spring Framework & Inversion of Control",
    "en": "Spring Framework Basics"
  },
  "spring-data-jpa-hibernate": {
    "vi": "Quản lý dữ liệu với Spring Data JPA & Hibernate",
    "en": "Spring Data JPA & Hibernate"
  },
  "quan-ly-du-lieu-voi-spring-data-jpa-hibernate": {
    "vi": "Quản lý dữ liệu với Spring Data JPA & Hibernate",
    "en": "Spring Data JPA & Hibernate"
  },
  "spring-security-jwt": {
    "vi": "Bảo mật ứng dụng với Spring Security & JWT Token",
    "en": "Spring Security & JWT"
  },
  "bao-mat-ung-dung-voi-spring-security-jwt-token": {
    "vi": "Bảo mật ứng dụng với Spring Security & JWT Token",
    "en": "Spring Security & JWT"
  },
  "jest-basics-matchers": {
    "vi": "Cơ bản về Jest & Các bộ so khớp Matchers",
    "en": "Jest Basics & Matchers"
  },
  "co-ban-ve-jest-cac-bo-so-khop-matchers": {
    "vi": "Cơ bản về Jest & Các bộ so khớp Matchers",
    "en": "Jest Basics & Matchers"
  },
  "kiem-thu-ma-nguon-bat-dong-bo-async-testing": {
    "vi": "Kiểm thử mã nguồn bất đồng bộ (Async Testing)",
    "en": "Testing Async Code"
  },
  "mock-functions-spies": {
    "vi": "Kỹ thuật Mock Functions & Spies trong Jest",
    "en": "Mock Functions & Spies"
  },
  "ky-thuat-mock-functions-spies-trong-jest": {
    "vi": "Kỹ thuật Mock Functions & Spies trong Jest",
    "en": "Mock Functions & Spies"
  },
  "snapshot-testing-component-testing": {
    "vi": "Kiểm thử ảnh chụp Snapshots & Components",
    "en": "Snapshot Testing & Component Testing"
  },
  "kiem-thu-anh-chup-snapshots-components": {
    "vi": "Kiểm thử ảnh chụp Snapshots & Components",
    "en": "Snapshot Testing & Component Testing"
  },
  "tdd-test-driven-development": {
    "vi": "Quy trình phát triển hướng kiểm thử (TDD)",
    "en": "TDD (Test Driven Development)"
  },
  "quy-trinh-phat-trien-huong-kiem-thu-tdd": {
    "vi": "Quy trình phát triển hướng kiểm thử (TDD)",
    "en": "TDD (Test Driven Development)"
  },
  "docker-overview-installation": {
    "vi": "Tổng quan về Docker & Cài đặt môi trường",
    "en": "Docker Overview & Installation"
  },
  "tong-quan-ve-docker-cai-dat-moi-truong": {
    "vi": "Tổng quan về Docker & Cài đặt môi trường",
    "en": "Docker Overview & Installation"
  },
  "docker-images-dockerfile": {
    "vi": "Xây dựng Docker Images với Dockerfile",
    "en": "Docker Images & Dockerfile"
  },
  "xay-dung-docker-images-voi-dockerfile": {
    "vi": "Xây dựng Docker Images với Dockerfile",
    "en": "Docker Images & Dockerfile"
  },
  "docker-containers-lifecycle": {
    "vi": "Vòng đời hoạt động của Docker Containers",
    "en": "Docker Containers Lifecycle"
  },
  "vong-doi-hoat-dong-cua-docker-containers": {
    "vi": "Vòng đời hoạt động của Docker Containers",
    "en": "Docker Containers Lifecycle"
  },
  "docker-volumes-storage": {
    "vi": "Lưu trữ dữ liệu bền vững với Docker Volumes",
    "en": "Docker Volumes & Storage"
  },
  "luu-tru-du-lieu-ben-vung-voi-docker-volumes": {
    "vi": "Lưu trữ dữ liệu bền vững với Docker Volumes",
    "en": "Docker Volumes & Storage"
  },
  "docker-compose-multi-service": {
    "vi": "Quản lý đa dịch vụ với Docker Compose",
    "en": "Docker Compose Multi-Service"
  },
  "quan-ly-da-dich-vu-voi-docker-compose": {
    "vi": "Quản lý đa dịch vụ với Docker Compose",
    "en": "Docker Compose Multi-Service"
  },
  "vue-overview-project-setup": {
    "vi": "Tổng quan về Vue.js & Khởi tạo dự án với Vite",
    "en": "Vue Overview & Project Setup"
  },
  "tong-quan-ve-vue-js-khoi-tao-du-an-voi-vite": {
    "vi": "Tổng quan về Vue.js & Khởi tạo dự án với Vite",
    "en": "Vue Overview & Project Setup"
  },
  "template-syntax-directives": {
    "vi": "Cú pháp Template & Các chỉ thị Directives",
    "en": "Template Syntax & Directives"
  },
  "cu-phap-template-cac-chi-thi-directives": {
    "vi": "Cú pháp Template & Các chỉ thị Directives",
    "en": "Template Syntax & Directives"
  },
  "reactivity-fundamentals": {
    "vi": "Cơ chế phản ứng Reactivity với ref và reactive",
    "en": "Reactivity Fundamentals"
  },
  "co-che-phan-ung-reactivity-voi-ref-va-reactive": {
    "vi": "Cơ chế phản ứng Reactivity với ref và reactive",
    "en": "Reactivity Fundamentals"
  },
  "computed-properties-watchers": {
    "vi": "Thuộc tính tính toán Computed & Trình theo dõi Watchers",
    "en": "Computed Properties & Watchers"
  },
  "thuoc-tinh-tinh-toan-computed-trinh-theo-doi-watchers": {
    "vi": "Thuộc tính tính toán Computed & Trình theo dõi Watchers",
    "en": "Computed Properties & Watchers"
  },
  "components-props-emits": {
    "vi": "Kiến trúc Component, truyền Props & phát Emits",
    "en": "Components & Props/Emits"
  },
  "kien-truc-component-truyen-props-phat-emits": {
    "vi": "Kiến trúc Component, truyền Props & phát Emits",
    "en": "Components & Props/Emits"
  },
  "composition-api-in-depth": {
    "vi": "Chuyên sâu về Composition API & Composables",
    "en": "Composition API in Depth"
  },
  "chuyen-sau-ve-composition-api-composables": {
    "vi": "Chuyên sâu về Composition API & Composables",
    "en": "Composition API in Depth"
  },
  "vue-router-navigation": {
    "vi": "Điều hướng trang với Vue Router",
    "en": "Vue Router Navigation"
  },
  "dieu-huong-trang-voi-vue-router": {
    "vi": "Điều hướng trang với Vue Router",
    "en": "Vue Router Navigation"
  },
  "quan-ly-trang-thai-toan-cuc-voi-pinia": {
    "vi": "Quản lý trạng thái toàn cục với Pinia",
    "en": "Pinia State Management"
  },
  "nuxt-js-ssr-server-engine": {
    "vi": "Server-Side Rendering & Fullstack với Nuxt.js",
    "en": "Nuxt.js SSR & Server Engine"
  },
  "server-side-rendering-fullstack-voi-nuxt-js": {
    "vi": "Server-Side Rendering & Fullstack với Nuxt.js",
    "en": "Nuxt.js SSR & Server Engine"
  },
  "vue-3-performance-internals": {
    "vi": "Kiến trúc bên trong Vue 3 & Tối ưu hiệu năng",
    "en": "Vue 3 Performance & Internals"
  },
  "kien-truc-ben-trong-vue-3-toi-uu-hieu-nang": {
    "vi": "Kiến trúc bên trong Vue 3 & Tối ưu hiệu năng",
    "en": "Vue 3 Performance & Internals"
  },
  "services-dependency-injection-dinh-tuyen-dinh-tuyen": {
    "vi": "Services, Dependency Injection & Định tuyến Định tuyến",
    "en": "Services, Dependency Injection & Định tuyến Routing"
  },
  "forms-quan-ly-trang-thai": {
    "vi": "Forms & Quản lý trạng thái",
    "en": "Forms & State Management"
  },
  "angular-tong-quan-cli": {
    "vi": "Angular Tổng quan & CLI",
    "en": "Angular Overview & CLI"
  },
  "kubernetes-tong-quan-kien-truc": {
    "vi": "Kubernetes Tổng quan & Kiến trúc",
    "en": "Kubernetes Overview & Architecture"
  },
  "ingress-mang": {
    "vi": "Ingress & Mạng",
    "en": "Ingress & Networking"
  },
  "matrix-strategy-reusable-quy-trinh-lam-viec": {
    "vi": "Matrix Strategy & Reusable Quy trình làm việc",
    "en": "Matrix Strategy & Reusable Workflows"
  },
  "monorepo-conditional-quy-trinh-lam-viec": {
    "vi": "Monorepo & Conditional Quy trình làm việc",
    "en": "Monorepo & Conditional Workflows"
  },
  "tong-quan-ve-nginx-cai-dat-may-chu": {
    "vi": "Tổng quan về Nginx & Cài đặt máy chủ",
    "en": "Nginx Overview & Installation"
  },
  "cau-hinh-reverse-proxy-chuyen-tiep-ung-dung-node-js": {
    "vi": "Cấu hình Reverse Proxy chuyển tiếp ứng dụng Node.js",
    "en": "Reverse Proxy & Node.js"
  },
  "cau-hinh-chung-chi-bao-mat-ssl-tls-https": {
    "vi": "Cấu hình chứng chỉ bảo mật SSL/TLS & HTTPS",
    "en": "SSL/TLS & HTTPS"
  },
  "can-bang-tai-luu-luong-mang-load-balancing": {
    "vi": "Cân bằng tải lưu lượng mạng (Load Balancing)",
    "en": "Load Balancing"
  },
  "quan-tri-van-hanh-may-chu-linux": {
    "vi": "Quản trị & Vận hành máy chủ Linux",
    "en": "Linux Server Administration"
  },
  "co-so-ha-tang-may-chu-production": {
    "vi": "Cơ sở hạ tầng máy chủ Production",
    "en": "Production Infrastructure"
  },
  "tong-quan-django-khoi-tao-du-an": {
    "vi": "Tổng quan Django & Khởi tạo dự án",
    "en": "Django Overview & Project Setup"
  },
  "dinh-nghia-models-thao-tac-django-orm": {
    "vi": "Định nghĩa Models & Thao tác Django ORM",
    "en": "Models & Django ORM"
  },
  "giao-dien-templates-quan-ly-static-files": {
    "vi": "Giao diện Templates & Quản lý Static Files",
    "en": "Templates & Static Files"
  },
  "xu-ly-bieu-mau-django-forms-xac-thuc-du-lieu": {
    "vi": "Xử lý biểu mẫu Django Forms & Xác thực dữ liệu",
    "en": "Django Forms & Validation"
  },
  "xay-dung-class-based-views-mixins": {
    "vi": "Xây dựng Class-Based Views & Mixins",
    "en": "Class-Based Views & Mixins"
  },
  "lop-case-classes-khop-mau-pattern-matching": {
    "vi": "Lớp, Case Classes & Khớp mẫu Pattern Matching",
    "en": "Classes, Case Classes & Pattern Matching"
  },
  "lap-trinh-dong-thoi-nang-cao-kien-truc-microservices-go": {
    "vi": "Lập trình đồng thời nâng cao & Kiến trúc Microservices Go",
    "en": "Concurrency nâng cao & Kiến trúc Microservices Go"
  },
  "xay-dung-http-server-restful-api": {
    "vi": "Xây dựng HTTP Server & RESTful API",
    "en": "HTTP Server & REST API"
  },
  "su-dung-context-middleware-xu-ly-loi": {
    "vi": "Sử dụng Context, Middleware & Xử lý lỗi",
    "en": "Context, Middleware & Error Patterns"
  },
  "ket-noi-co-so-du-lieu-thao-tac-orm": {
    "vi": "Kết nối Cơ sở dữ liệu & Thao tác ORM",
    "en": "Database & ORM"
  },
  "lap-trinh-generic-trong-go-go-1-18": {
    "vi": "Lập trình Generic trong Go (Go 1.18+)",
    "en": "Go Generics (1.18+)"
  },
  "van-hanh-go-production-logging-config-graceful-shutdown": {
    "vi": "Vận hành Go Production: Logging, Config & Graceful Shutdown",
    "en": "Production Go: Logging, Config, Graceful Shutdown"
  },
  "go-microservices-kien-truc": {
    "vi": "Go Microservices Kiến trúc",
    "en": "Go Microservices Architecture"
  },
  "kien-truc-ben-trong-go-runtime-go-scheduler": {
    "vi": "Kiến trúc bên trong Go Runtime & Go Scheduler",
    "en": "Go Runtime & Scheduler Internals"
  },
  "subscriptions-nang-cao": {
    "vi": "Subscriptions & nâng cao",
    "en": "Subscriptions & Advanced"
  },
  "so-sanh-kien-truc-graphql-va-rest-api": {
    "vi": "So sánh kiến trúc GraphQL và REST API",
    "en": "GraphQL vs REST"
  },
  "dinh-nghia-graphql-schema-kieu-du-lieu": {
    "vi": "Định nghĩa GraphQL Schema & Kiểu dữ liệu",
    "en": "Schema & Types"
  },
  "xay-dung-ham-xu-ly-graphql-resolvers": {
    "vi": "Xây dựng hàm xử lý GraphQL Resolvers",
    "en": "Building Resolvers"
  },
  "lang-nghe-du-lieu-thoi-gian-thuc-voi-subscriptions": {
    "vi": "Lắng nghe dữ liệu thời gian thực với Subscriptions",
    "en": "Real-time Subscriptions"
  },
  "giai-quyet-bai-toan-n-1-voi-dataloader": {
    "vi": "Giải quyết bài toán N+1 với DataLoader",
    "en": "DataLoader & N+1 Problem"
  },
  "css-kien-truc-design-systems": {
    "vi": "CSS Kiến trúc & Design Systems",
    "en": "CSS Architecture & Design Systems"
  },
  "nang-cao-css-houdini": {
    "vi": "nâng cao CSS & Houdini",
    "en": "Advanced CSS & Houdini"
  },
  "css-kien-truc-methodology": {
    "vi": "CSS Kiến trúc & Methodology",
    "en": "CSS Architecture & Methodology"
  },
  "nang-cao-css-techniques": {
    "vi": "nâng cao CSS Techniques",
    "en": "Advanced CSS Techniques"
  },
  "mau-thiet-ke-database": {
    "vi": "Mẫu thiết kế & Database",
    "en": "Design Patterns & Database"
  },
  "hello-world-cai-dat-moi-truong-lap-trinh": {
    "vi": "Hello World & Cài đặt môi trường lập trình",
    "en": "Hello World & Setup"
  },
  "mau-thiet-ke-trong-java": {
    "vi": "Mẫu thiết kế trong Java",
    "en": "Design Patterns trong Java"
  },
  "lap-trinh-dong-thoi-multithreading": {
    "vi": "Lập trình đồng thời & Multithreading",
    "en": "Concurrency & Multithreading"
  },
  "bao-mat-xac-thuc": {
    "vi": "Bảo mật & Xác thực",
    "en": "Security & Authentication"
  },
  "kiem-thu-clean-kien-truc": {
    "vi": "Kiểm thử & Clean Kiến trúc",
    "en": "Testing & Clean Architecture"
  },
  "kiem-thu-co-ban-voi-jest": {
    "vi": "Kiểm thử cơ bản với Jest",
    "en": "Testing cơ bản với Jest"
  },
  "mocking-async-kiem-thu": {
    "vi": "Mocking & Async Kiểm thử",
    "en": "Mocking & Async Testing"
  },
  "tich-hop-nang-cao-kiem-thu": {
    "vi": "Tích hợp & nâng cao Kiểm thử",
    "en": "Integration & Advanced Testing"
  },
  "cac-mau-kiem-thu-nang-cao": {
    "vi": "Các mẫu kiểm thử nâng cao",
    "en": "Advanced Testing Patterns"
  },
  "kien-truc-triet-ly-kiem-thu-phan-mem": {
    "vi": "Kiến trúc & Triết lý kiểm thử phần mềm",
    "en": "Testing Architecture & Philosophy"
  },
  "phan-nhanh-docker-compose-quy-trinh-lam-viec": {
    "vi": "Phân nhánh, Docker Compose & Quy trình làm việc",
    "en": "Branching, Compose & Workflows"
  },
  "ci-cd-ky-thuat-nang-cao-voi-docker-git": {
    "vi": "CI/CD, Kỹ thuật nâng cao với Docker & Git",
    "en": "CI/CD, Advanced Docker & Git"
  },
  "bao-mat-docker-dieu-phoi-container": {
    "vi": "Bảo mật Docker & Điều phối Container",
    "en": "Docker Security & Orchestration"
  },
  "mo-hinh-gitops-co-so-ha-tang-duoi-dang-ma-iac": {
    "vi": "Mô hình GitOps & Cơ sở hạ tầng dưới dạng mã (IaC)",
    "en": "GitOps & Infrastructure as Code"
  },
  "cau-truc-bai-test-to-chuc-thu-muc-kiem-thu": {
    "vi": "Cấu trúc bài test & Tổ chức thư mục kiểm thử",
    "en": "Test Structure & Organization"
  },
  "hoc-kiem-thu-tu-dong-voi-jest": {
    "vi": "Học kiểm thử tự động với Jest",
    "en": "Learn Jest"
  },
  "ky-thuat-mocking-theo-doi-hanh-vi-spying": {
    "vi": "Kỹ thuật Mocking & Theo dõi hành vi (Spying)",
    "en": "Mocking & Spying"
  },
  "cau-hinh-kiem-thu-do-do-bao-phu-ma-nguon-coverage": {
    "vi": "Cấu hình kiểm thử & Đo độ bao phủ mã nguồn (Coverage)",
    "en": "Setup, Config & Coverage"
  },
  "tich-hop-kiem-thu": {
    "vi": "Tích hợp Kiểm thử",
    "en": "Integration Testing"
  },
  "container-bao-mat-best-practices": {
    "vi": "Container Bảo mật & Best Practices",
    "en": "Container Security & Best Practices"
  },
  "kotlin-multiplatform-cac-mau-nang-cao": {
    "vi": "Kotlin Multiplatform & Các mẫu nâng cao",
    "en": "KMP & Advanced Patterns"
  },
  "phat-trien-server-side-ky-thuat-chuyen-sau": {
    "vi": "Phát triển Server-side & Kỹ thuật chuyên sâu",
    "en": "Server-side & Advanced"
  },
  "compiler-plugins-kien-truc-ben-trong": {
    "vi": "Compiler Plugins & Kiến trúc bên trong",
    "en": "Compiler Plugins & Internals"
  },
  "kotlin-kiem-thu-best-practices": {
    "vi": "Kotlin Kiểm thử Best Practices",
    "en": "Kotlin Testing Best Practices"
  },
  "co-ban-ve-mongodb": {
    "vi": "Cơ bản về MongoDB",
    "en": "MongoDB basics"
  },
  "tich-hop-node-js-mongoose-odm": {
    "vi": "Tích hợp Node.js & Mongoose ODM",
    "en": "Node.js integration & Mongoose"
  },
  "pipeline-aggregation-danh-chi-muc-indexing": {
    "vi": "Pipeline Aggregation & Đánh chỉ mục Indexing",
    "en": "Aggregation & Indexing"
  },
  "giao-dich-transactions-dich-vu-mongodb-atlas": {
    "vi": "Giao dịch Transactions & Dịch vụ MongoDB Atlas",
    "en": "Transactions & Atlas"
  },
  "mo-rong-quy-mo-thiet-ke-kien-truc-csdl": {
    "vi": "Mở rộng quy mô & Thiết kế kiến trúc CSDL",
    "en": "Scaling & Architecture"
  },
  "phan-manh-du-lieu-production-kien-truc": {
    "vi": "Phân mảnh dữ liệu & Production Kiến trúc",
    "en": "Sharding & Production Architecture"
  },
  "xay-dung-rest-api-voi-express-js": {
    "vi": "Xây dựng REST API với Express.js",
    "en": "Express & REST API"
  },
  "kiem-thu-kien-truc-sach-he-thong-middleware": {
    "vi": "Kiểm thử, Kiến trúc sạch & Hệ thống Middleware",
    "en": "Testing, Architecture & Middleware"
  },
  "kien-truc-microservices-tich-hop-devops": {
    "vi": "Kiến trúc Microservices & Tích hợp DevOps",
    "en": "Microservices & DevOps"
  },
  "thiet-ke-he-thong-kien-truc-ben-trong": {
    "vi": "Thiết kế hệ thống & Kiến trúc bên trong",
    "en": "System Design & Internals"
  },
  "node-js-npm-co-ban": {
    "vi": "Node.js & npm cơ bản",
    "en": "Node.js & npm Basics"
  },
  "kiem-thu-node-js-apps": {
    "vi": "Kiểm thử Node.js Apps",
    "en": "Testing Node.js Apps"
  },
  "clean-kien-truc-error-handling": {
    "vi": "Clean Kiến trúc & Error Handling",
    "en": "Clean Architecture & Error Handling"
  },
  "microservices-kien-truc": {
    "vi": "Microservices Kiến trúc",
    "en": "Microservices Architecture"
  },
  "hieu-nang-mo-rong-quy-mo": {
    "vi": "Hiệu năng & Mở rộng quy mô",
    "en": "Performance & Scaling"
  },
  "event-loop-v8-kien-truc-ben-trong": {
    "vi": "Event Loop & V8 Kiến trúc bên trong",
    "en": "Event Loop & V8 Internals"
  },
  "laravel-nang-cao-kiem-thu-ung-dung": {
    "vi": "Laravel nâng cao & Kiểm thử ứng dụng",
    "en": "Laravel Advanced & Testing"
  },
  "kien-truc-phan-mem-toi-uu-hieu-nang": {
    "vi": "Kiến trúc phần mềm & Tối ưu hiệu năng",
    "en": "Architecture & Performance"
  },
  "laravel-chuyen-sau-xay-dung-packages": {
    "vi": "Laravel chuyên sâu & Xây dựng Packages",
    "en": "Advanced Laravel & Packages"
  },
  "kien-truc-ben-trong-php-mo-rong-quy-mo": {
    "vi": "Kiến trúc bên trong PHP & Mở rộng quy mô",
    "en": "PHP Internals & Scaling"
  },
  "toi-uu-hieu-nang-cpython-kien-truc-ben-trong": {
    "vi": "Tối ưu hiệu năng & CPython Kiến trúc bên trong",
    "en": "Tối ưu hiệu năng & CPython Internals"
  },
  "custom-hooks-context-api-toi-uu-hieu-nang": {
    "vi": "Custom Hooks, Context API & Tối ưu hiệu năng",
    "en": "Custom Hooks, Context & Performance"
  },
  "mau-thiet-ke-react-server-components": {
    "vi": "Mẫu thiết kế & React Server Components",
    "en": "Patterns & Server Components"
  },
  "kien-truc-ben-trong-react-tinh-nang-react-19": {
    "vi": "Kiến trúc bên trong React & Tính năng React 19",
    "en": "Internals & React 19"
  },
  "context-api-quan-ly-trang-thai": {
    "vi": "Context API & Quản lý trạng thái",
    "en": "Context API & State Management"
  },
  "nang-cao-patterns-kien-truc": {
    "vi": "nâng cao Patterns & Kiến trúc",
    "en": "Advanced Patterns & Architecture"
  },
  "nen-tang-ruby-on-rails-co-ban": {
    "vi": "Nền tảng Ruby on Rails cơ bản",
    "en": "Rails Basics"
  },
  "kien-truc-ung-dung-ruby-on-rails": {
    "vi": "Kiến trúc ứng dụng Ruby on Rails",
    "en": "Rails Architecture"
  },
  "lap-trinh-sieu-hinh-metaprogramming-kien-truc": {
    "vi": "Lập trình siêu hình (Metaprogramming) & Kiến trúc",
    "en": "Metaprogramming & Architecture"
  },
  "traits-generics-quan-ly-vong-doi-lifetimes": {
    "vi": "Traits, Generics & Quản lý vòng đời (Lifetimes)",
    "en": "Traits, Generics & Lifetimes"
  },
  "bat-dong-bo-lap-trinh-dong-thoi-he-sinh-thai-crates": {
    "vi": "Bất đồng bộ, Lập trình đồng thời & Hệ sinh thái Crates",
    "en": "Async, Concurrency & Crates"
  },
  "macros-nang-cao-patterns": {
    "vi": "Macros & nâng cao Patterns",
    "en": "Macros & Advanced Patterns"
  },
  "nang-cao-systems-wasm": {
    "vi": "nâng cao Systems & WASM",
    "en": "Advanced Systems & WASM"
  },
  "joins-nang-cao-queries": {
    "vi": "JOINs & nâng cao Queries",
    "en": "JOINs & Advanced Queries"
  },
  "indexing-transactions-toi-uu-hoa": {
    "vi": "Indexing, Transactions & Tối ưu hóa",
    "en": "Indexing, Transactions & Optimization"
  },
  "hieu-nang-distributed": {
    "vi": "Hiệu năng & Distributed",
    "en": "Performance & Distributed"
  },
  "database-kien-truc-kien-truc-ben-trong": {
    "vi": "Database Kiến trúc & Kiến trúc bên trong",
    "en": "Database Architecture & Internals"
  },
  "database-kien-truc-ben-trong-luu-tru": {
    "vi": "Database Kiến trúc bên trong & Lưu trữ",
    "en": "Database Internals & Storage"
  },
  "lap-trinh-giao-dien-swiftui-lap-trinh-dong-thoi": {
    "vi": "Lập trình giao diện SwiftUI & Lập trình đồng thời",
    "en": "Lập trình giao diện SwiftUI & Concurrency"
  },
  "utility-first-co-ban": {
    "vi": "Utility-first cơ bản",
    "en": "Utility-first basics"
  },
  "customization-giao-dien": {
    "vi": "Customization & Giao diện",
    "en": "Customization & Theming"
  },
  "nang-cao-patterns": {
    "vi": "nâng cao patterns",
    "en": "Advanced patterns"
  },
  "tailwind-css-v4-xay-dung-he-thong-thiet-ke": {
    "vi": "Tailwind CSS v4 & Xây dựng hệ thống thiết kế",
    "en": "Tailwind v4 & Design Systems"
  },
  "he-thong-thiet-ke-cho-moi-truong-production": {
    "vi": "Hệ thống thiết kế cho môi trường Production",
    "en": "Production Design Systems"
  },
  "nang-cao-types-patterns": {
    "vi": "nâng cao Types & Patterns",
    "en": "Advanced Types & Patterns"
  },
  "conditional-types-nang-cao-patterns": {
    "vi": "Conditional Types & nâng cao Patterns",
    "en": "Conditional Types & Advanced Patterns"
  },
  "compiler-advanced-internals": {
    "vi": "Compiler & nâng cao Kiến trúc bên trong",
    "en": "Compiler & Advanced Internals"
  },
  "compiler-nang-cao-kien-truc-ben-trong": {
    "vi": "Compiler & nâng cao Kiến trúc bên trong",
    "en": "Compiler & Advanced Internals"
  },
  "nang-cao-generics": {
    "vi": "nâng cao Generics",
    "en": "Advanced Generics"
  },
  "nang-cao-typescript-patterns": {
    "vi": "nâng cao TypeScript Patterns",
    "en": "Advanced TypeScript Patterns"
  },
  "typescript-compiler-kien-truc-ben-trong": {
    "vi": "TypeScript Compiler Kiến trúc bên trong",
    "en": "TypeScript Compiler Internals"
  },
  "vue-co-ban-template-syntax": {
    "vi": "Vue cơ bản & template syntax",
    "en": "Vue basics & template syntax"
  },
  "hieu-nang-production": {
    "vi": "Hiệu năng & Production",
    "en": "Performance & Production"
  },
  "vue-js-tong-quan-setup": {
    "vi": "Vue.js Tổng quan & Setup",
    "en": "Vue.js Overview & Setup"
  },
  "chi-thi-reactivity": {
    "vi": "Chỉ thị & Reactivity",
    "en": "Directives & Reactivity"
  },
  "vong-doi-watchers": {
    "vi": "Vòng đời & Watchers",
    "en": "Lifecycle & Watchers"
  },
  "decorators-generators-async": {
    "vi": "Decorators, Generators & Lập trình bất đồng bộ",
    "en": "Decorators, Generators & Async"
  },
  "architecture-testing-performance": {
    "vi": "Kiến trúc, Kiểm thử & Hiệu năng",
    "en": "Architecture, Testing & Performance"
  },
  "kien-truc-kiem-thu-hieu-nang": {
    "vi": "Kiến trúc, Kiểm thử & Hiệu năng",
    "en": "Architecture, Testing & Performance"
  },
  "metaclasses-c-extensions-system-design": {
    "vi": "Metaclasses, C Extensions & Thiết kế hệ thống",
    "en": "Metaclasses, C Extensions & System Design"
  },
  "collections-streams-exception-handling": {
    "vi": "Collections, Streams API & Xử lý ngoại lệ",
    "en": "Collections, Streams & Exception Handling"
  },
  "generics-design-patterns-jdbc": {
    "vi": "Generics, Mẫu thiết kế & JDBC",
    "en": "Generics, Design Patterns & JDBC"
  },
  "generics-mau-thiet-ke-jdbc": {
    "vi": "Generics, Mẫu thiết kế & JDBC",
    "en": "Generics, Design Patterns & JDBC"
  },
  "spring-boot-concurrency-architecture": {
    "vi": "Spring Boot, Lập trình đồng thời & Kiến trúc",
    "en": "Spring Boot, Concurrency & Architecture"
  },
  "spring-boot-lap-trinh-dong-thoi-kien-truc": {
    "vi": "Spring Boot, Lập trình đồng thời & Kiến trúc",
    "en": "Spring Boot, Concurrency & Architecture"
  },
  "jvm-internals-performance-tuning-reactive": {
    "vi": "JVM Kiến trúc bên trong, Hiệu năng Tuning & Reactive",
    "en": "JVM Internals, Performance Tuning & Reactive"
  },
  "jvm-kien-truc-ben-trong-hieu-nang-tuning-reactive": {
    "vi": "JVM Kiến trúc bên trong, Hiệu năng Tuning & Reactive",
    "en": "JVM Internals, Performance Tuning & Reactive"
  },
  "node-basics-npm-modules": {
    "vi": "Node cơ bản, npm & modules",
    "en": "Node basics, npm & modules"
  },
  "node-co-ban-npm-modules": {
    "vi": "Node cơ bản, npm & modules",
    "en": "Node basics, npm & modules"
  },
  "express-rest-api-middleware": {
    "vi": "Express, REST API & Middleware (Chuyên đề)",
    "en": "Express, REST API & Middleware"
  },
  "database-auth-testing": {
    "vi": "Database, Auth & Kiểm thử",
    "en": "Database, Auth & Testing"
  },
  "database-auth-kiem-thu": {
    "vi": "Database, Auth & Kiểm thử",
    "en": "Database, Auth & Testing"
  },
  "architecture-scaling-devops": {
    "vi": "Kiến trúc, Mở rộng quy mô & DevOps",
    "en": "Architecture, Scaling & DevOps"
  },
  "kien-truc-mo-rong-quy-mo-devops": {
    "vi": "Kiến trúc, Mở rộng quy mô & DevOps",
    "en": "Architecture, Scaling & DevOps"
  },
  "v8-internals-performance-system-design": {
    "vi": "V8 Kiến trúc bên trong, Hiệu năng & System Design",
    "en": "V8 Internals, Performance & System Design"
  },
  "v8-kien-truc-ben-trong-hieu-nang-system-design": {
    "vi": "V8 Kiến trúc bên trong, Hiệu năng & System Design",
    "en": "V8 Internals, Performance & System Design"
  },
  "hooks-state-effects": {
    "vi": "Hooks, State & Effects (Chuyên đề)",
    "en": "Hooks, State & Effects"
  },
  "custom-hooks-context-patterns": {
    "vi": "Custom Hooks, Context & Mẫu thiết kế",
    "en": "Custom Hooks, Context & Patterns"
  },
  "architecture-server-components-advanced-patterns": {
    "vi": "Kiến trúc, Server Components & nâng cao Mẫu thiết kế",
    "en": "Architecture, Server Components & Advanced Patterns"
  },
  "kien-truc-server-components-nang-cao-patterns": {
    "vi": "Kiến trúc, Server Components & nâng cao Patterns",
    "en": "Architecture, Server Components & Advanced Patterns"
  },
  "react-internals-fiber-compiler": {
    "vi": "React Kiến trúc bên trong, Fiber & Compiler",
    "en": "React Internals, Fiber & Compiler"
  },
  "react-kien-truc-ben-trong-fiber-compiler": {
    "vi": "React Kiến trúc bên trong, Fiber & Compiler",
    "en": "React Internals, Fiber & Compiler"
  },
  "architecture-performance-accessibility": {
    "vi": "Kiến trúc, Hiệu năng & Accessibility",
    "en": "Architecture, Performance & Accessibility"
  },
  "kien-truc-hieu-nang-accessibility": {
    "vi": "Kiến trúc, Hiệu năng & Accessibility",
    "en": "Architecture, Performance & Accessibility"
  },
  "houdini-layout-algorithms-design-systems": {
    "vi": "Houdini, Layout Thuật toán & Design Systems",
    "en": "Houdini, Layout Algorithms & Design Systems"
  },
  "houdini-layout-thuat-toan-design-systems": {
    "vi": "Houdini, Layout Thuật toán & Design Systems",
    "en": "Houdini, Layout Algorithms & Design Systems"
  },
  "joins-subqueries-grouping": {
    "vi": "JOINs, Subqueries & Grouping (Chuyên đề)",
    "en": "JOINs, Subqueries & Grouping"
  },
  "indexing-transactions-nosql": {
    "vi": "Indexing, Transactions & NoSQL (Chuyên đề)",
    "en": "Indexing, Transactions & NoSQL"
  },
  "query-optimization-scaling": {
    "vi": "Query Tối ưu hóa & Mở rộng quy mô",
    "en": "Query Optimization & Scaling"
  },
  "query-toi-uu-hoa-mo-rong-quy-mo": {
    "vi": "Query Tối ưu hóa & Mở rộng quy mô",
    "en": "Query Optimization & Scaling"
  },
  "distributed-db-sharding-cap-theorem": {
    "vi": "Distributed DB, Phân mảnh dữ liệu & CAP Theorem",
    "en": "Distributed DB, Sharding & CAP Theorem"
  },
  "distributed-db-phan-manh-du-lieu-cap-theorem": {
    "vi": "Distributed DB, Phân mảnh dữ liệu & CAP Theorem",
    "en": "Distributed DB, Sharding & CAP Theorem"
  },
  "mocking-async-testing-setup": {
    "vi": "Mocking, Async Kiểm thử & Setup",
    "en": "Mocking, Async testing & Setup"
  },
  "mocking-async-kiem-thu-setup": {
    "vi": "Mocking, Async Kiểm thử & Setup",
    "en": "Mocking, Async testing & Setup"
  },
  "integration-tests-test-patterns": {
    "vi": "Tích hợp tests & Test Mẫu thiết kế",
    "en": "Integration tests & Test patterns"
  },
  "tich-hop-tests-test-patterns": {
    "vi": "Tích hợp tests & Test patterns",
    "en": "Integration tests & Test patterns"
  },
  "coverage-ci-cd-test-strategy": {
    "vi": "Coverage, CI/CD & Test Strategy (Chuyên đề)",
    "en": "Coverage, CI/CD & Test Strategy"
  },
  "property-based-testing-tdd-mastery": {
    "vi": "Property-based Kiểm thử & TDD mastery",
    "en": "Property-based testing & TDD mastery"
  },
  "property-based-kiem-thu-tdd-mastery": {
    "vi": "Property-based Kiểm thử & TDD mastery",
    "en": "Property-based testing & TDD mastery"
  },
  "git-basics-docker-containers": {
    "vi": "Git cơ bản & Docker containers",
    "en": "Git basics & Docker containers"
  },
  "git-co-ban-docker-containers": {
    "vi": "Git cơ bản & Docker containers",
    "en": "Git basics & Docker containers"
  },
  "docker-images-compose": {
    "vi": "Docker images & Compose (Chuyên đề)",
    "en": "Docker images & Compose"
  },
  "git-branching-strategies-ci-cd": {
    "vi": "Git branching strategies & CI/CD (Chuyên đề)",
    "en": "Git branching strategies & CI/CD"
  },
  "docker-networking-security-optimization": {
    "vi": "Docker Mạng, Bảo mật & Tối ưu hóa",
    "en": "Docker networking, security & optimization"
  },
  "docker-mang-bao-mat-toi-uu-hoa": {
    "vi": "Docker Mạng, Bảo mật & Tối ưu hóa",
    "en": "Docker networking, security & optimization"
  },
  "kubernetes-orchestration-gitops": {
    "vi": "Kubernetes, Orchestration & GitOps (Chuyên đề)",
    "en": "Kubernetes, Orchestration & GitOps"
  },
  "nang-cao-types-type-guards": {
    "vi": "nâng cao types & Type Guards",
    "en": "Advanced types & Type Guards"
  },
  "jvm-kien-truc-ben-trong-gc-tuning": {
    "vi": "JVM Kiến trúc bên trong & GC Tuning",
    "en": "JVM Internals & GC Tuning"
  },
  "tich-hop-kiem-thu-patterns": {
    "vi": "Tích hợp Kiểm thử Patterns",
    "en": "Integration Testing Patterns"
  },
  "kiem-thu-strategy-best-practices": {
    "vi": "Kiểm thử Strategy & Best Practices",
    "en": "Testing Strategy & Best Practices"
  },
  "nang-cao-type-patterns": {
    "vi": "nâng cao Type Patterns",
    "en": "Advanced Type Patterns"
  },
  "ts-compiler-kien-truc-ben-trong": {
    "vi": "TS Compiler Kiến trúc bên trong",
    "en": "TS Compiler Internals"
  },
  "advanced-rust-unsafe": {
    "vi": "Rust chuyên sâu & Lập trình Unsafe",
    "en": "Advanced Rust & Unsafe"
  },
  "rust-chuyen-sau-lap-trinh-unsafe": {
    "vi": "Rust chuyên sâu & Lập trình Unsafe",
    "en": "Advanced Rust & Unsafe"
  },
  "compiler-performance": {
    "vi": "Cơ chế Rust Compiler & Tối ưu hiệu năng",
    "en": "Compiler & Performance"
  },
  "co-che-rust-compiler-toi-uu-hieu-nang": {
    "vi": "Cơ chế Rust Compiler & Tối ưu hiệu năng",
    "en": "Compiler & Performance"
  },
  "database-sql-optimization": {
    "vi": "Cơ sở dữ liệu, Truy vấn SQL & Tối ưu hóa",
    "en": "Database, SQL & Optimization"
  },
  "co-so-du-lieu-truy-van-sql-toi-uu-hoa": {
    "vi": "Cơ sở dữ liệu, Truy vấn SQL & Tối ưu hóa",
    "en": "Database, SQL & Optimization"
  },
  "swiftui-data-flow": {
    "vi": "Lập trình giao diện SwiftUI & Luồng dữ liệu",
    "en": "SwiftUI & Data Flow"
  },
  "lap-trinh-giao-dien-swiftui-luong-du-lieu": {
    "vi": "Lập trình giao diện SwiftUI & Luồng dữ liệu",
    "en": "SwiftUI & Data Flow"
  },
  "advanced-swiftui-concurrency": {
    "vi": "SwiftUI nâng cao & Lập trình đồng thời",
    "en": "Advanced SwiftUI & Concurrency"
  },
  "swiftui-nang-cao-lap-trinh-dong-thoi": {
    "vi": "SwiftUI nâng cao & Lập trình đồng thời",
    "en": "Advanced SwiftUI & Concurrency"
  },
  "performance-testing": {
    "vi": "Tối ưu hóa hiệu năng & Kiểm thử phần mềm",
    "en": "Performance & Testing"
  },
  "toi-uu-hoa-hieu-nang-kiem-thu-phan-mem": {
    "vi": "Tối ưu hóa hiệu năng & Kiểm thử phần mềm",
    "en": "Performance & Testing"
  },
  "enterprise-architecture-tca": {
    "vi": "Kiến trúc doanh nghiệp & Hệ thống TCA",
    "en": "Enterprise Architecture & TCA"
  },
  "kien-truc-doanh-nghiep-he-thong-tca": {
    "vi": "Kiến trúc doanh nghiệp & Hệ thống TCA",
    "en": "Enterprise Architecture & TCA"
  },
  "lam-chu-dong-lenh-shell-quan-tri-he-thong": {
    "vi": "Làm chủ dòng lệnh Shell & Quản trị hệ thống",
    "en": "Shell Mastery"
  },
  "lenh-terminal-dieu-huong-he-thong-tap-tin": {
    "vi": "Lệnh Terminal & Điều hướng hệ thống tập tin",
    "en": "Terminal Commands & Navigation"
  },
  "tu-dong-hoa-quy-trinh-trien-khai-ung-dung": {
    "vi": "Tự động hóa quy trình triển khai ứng dụng",
    "en": "Automated Deployment"
  },
  "production-deployment-chuyen-de": {
    "vi": "Production Deployment (Chuyên đề)",
    "en": "Production Deployment"
  },
  "proxy-mau-thiet-ke-kha-nang-nang-cap-hop-dong": {
    "vi": "Proxy Mẫu thiết kế & Khả năng nâng cấp hợp đồng",
    "en": "Proxy Patterns & Khả năng nâng cấp hợp đồng"
  },
  "nang-cao-lap-trinh-dong-thoi-mau-thiet-ke": {
    "vi": "nâng cao Lập trình đồng thời Mẫu thiết kế",
    "en": "Advanced Concurrency Patterns"
  },
  "apollo-federation-microservices-chuyen-de": {
    "vi": "Apollo Federation & Microservices (Chuyên đề)",
    "en": "Apollo Federation & Microservices"
  },
  "html5-semantic-structure-chuyen-de": {
    "vi": "HTML5 Semantic & Structure (Chuyên đề)",
    "en": "HTML5 Semantic & Structure"
  },
  "css-selectors-box-model-chuyen-de": {
    "vi": "CSS Selectors & Box Model (Chuyên đề)",
    "en": "CSS Selectors & Box Model"
  },
  "typography-colors-units-chuyen-de": {
    "vi": "Typography, Colors & Units (Chuyên đề)",
    "en": "Typography, Colors & Units"
  },
  "flexbox-layout-chuyen-de": {
    "vi": "Flexbox Layout (Chuyên đề)",
    "en": "Flexbox Layout"
  },
  "css-grid-layout-chuyen-de": {
    "vi": "CSS Grid Layout (Chuyên đề)",
    "en": "CSS Grid Layout"
  },
  "responsive-design-media-queries-chuyen-de": {
    "vi": "Responsive Design & Media Queries (Chuyên đề)",
    "en": "Responsive Design & Media Queries"
  },
  "transitions-animations-chuyen-de": {
    "vi": "Transitions & Animations (Chuyên đề)",
    "en": "Transitions & Animations"
  },
  "modern-css-has-nesting-layers-chuyen-de": {
    "vi": "Modern CSS: has(), nesting, layers (Chuyên đề)",
    "en": "Modern CSS: has(), nesting, layers"
  },
  "accessibility-a11y-chuyen-de": {
    "vi": "Accessibility (a11y) (Chuyên đề)",
    "en": "Accessibility (a11y)"
  },
  "building-design-systems-chuyen-de": {
    "vi": "Building Design Systems (Chuyên đề)",
    "en": "Building Design Systems"
  },
  "nang-cao-css-ky-thuat": {
    "vi": "nâng cao CSS Kỹ thuật",
    "en": "Advanced CSS Techniques"
  },
  "css-houdini-paint-api-chuyen-de": {
    "vi": "CSS Houdini & Paint API (Chuyên đề)",
    "en": "CSS Houdini & Paint API"
  },
  "oop-class-inheritance-interface-chuyen-de": {
    "vi": "OOP: Class, Inheritance, Interface (Chuyên đề)",
    "en": "OOP: Class, Inheritance, Interface"
  },
  "jpa-database-access-chuyen-de": {
    "vi": "JPA & Database Access (Chuyên đề)",
    "en": "JPA & Database Access"
  },
  "spring-boot-rest-api-chuyen-de": {
    "vi": "Spring Boot REST API (Chuyên đề)",
    "en": "Spring Boot REST API"
  },
  "modern-java-17-21-features-chuyen-de": {
    "vi": "Modern Java 17-21 Features (Chuyên đề)",
    "en": "Modern Java 17-21 Features"
  },
  "test-todo-chuyen-de": {
    "vi": "Test todo (Chuyên đề)",
    "en": "Test todo"
  },
  "a-chuyen-de": {
    "vi": "A (Chuyên đề)",
    "en": "A"
  },
  "b-chuyen-de": {
    "vi": "B (Chuyên đề)",
    "en": "B"
  },
  "test-driven-development-tdd-chuyen-de": {
    "vi": "Test-Driven Development (TDD) (Chuyên đề)",
    "en": "Test-Driven Development (TDD)"
  },
  "kiem-thu-strategy-mau-thiet-ke": {
    "vi": "Kiểm thử Strategy & Mẫu thiết kế",
    "en": "Testing Strategy & Patterns"
  },
  "ci-cd-test-automation-chuyen-de": {
    "vi": "CI/CD & Test Automation (Chuyên đề)",
    "en": "CI/CD & Test Automation"
  },
  "gitignore-docker-ignore-chuyen-de": {
    "vi": ".gitignore & Docker Ignore (Chuyên đề)",
    "en": ".gitignore & Docker Ignore"
  },
  "git-branching-strategies-chuyen-de": {
    "vi": "Git Branching Strategies (Chuyên đề)",
    "en": "Git Branching Strategies"
  },
  "docker-compose-multi-container-chuyen-de": {
    "vi": "Docker Compose & Multi-container (Chuyên đề)",
    "en": "Docker Compose & Multi-container"
  },
  "merge-conflicts-recovery-chuyen-de": {
    "vi": "Merge Conflicts & Recovery (Chuyên đề)",
    "en": "Merge Conflicts & Recovery"
  },
  "ci-cd-pipelines-chuyen-de": {
    "vi": "CI/CD Pipelines (Chuyên đề)",
    "en": "CI/CD Pipelines"
  },
  "docker-production-mau-thiet-ke": {
    "vi": "Docker Production Mẫu thiết kế",
    "en": "Docker Production Patterns"
  },
  "nang-cao-git-ky-thuat": {
    "vi": "nâng cao Git Kỹ thuật",
    "en": "Advanced Git Techniques"
  },
  "kubernetes-container-orchestration-chuyen-de": {
    "vi": "Kubernetes & Container Orchestration (Chuyên đề)",
    "en": "Kubernetes & Container Orchestration"
  },
  "kotlin-multiplatform-kmp-chuyen-de": {
    "vi": "Kotlin Multiplatform (KMP) (Chuyên đề)",
    "en": "Kotlin Multiplatform (KMP)"
  },
  "kotlin-compiler-plugins-meta-chuyen-de": {
    "vi": "Kotlin Compiler Plugins & Meta (Chuyên đề)",
    "en": "Kotlin Compiler Plugins & Meta"
  },
  "mongodb-nosql-concepts-chuyen-de": {
    "vi": "MongoDB & NoSQL Concepts (Chuyên đề)",
    "en": "MongoDB & NoSQL Concepts"
  },
  "queries-operators-chuyen-de": {
    "vi": "Queries & Operators (Chuyên đề)",
    "en": "Queries & Operators"
  },
  "mongoose-odm-chuyen-de": {
    "vi": "Mongoose ODM (Chuyên đề)",
    "en": "Mongoose ODM"
  },
  "rest-api-with-express-mongodb-chuyen-de": {
    "vi": "REST API with Express + MongoDB (Chuyên đề)",
    "en": "REST API with Express + MongoDB"
  },
  "aggregation-pipeline-chuyen-de": {
    "vi": "Aggregation Pipeline (Chuyên đề)",
    "en": "Aggregation Pipeline"
  },
  "text-chuyen-de": {
    "vi": "text (Chuyên đề)",
    "en": "text"
  },
  "transactions-replica-sets-chuyen-de": {
    "vi": "Transactions & Replica Sets (Chuyên đề)",
    "en": "Transactions & Replica Sets"
  },
  "file-system-async-mau-thiet-ke": {
    "vi": "File System & Async Mẫu thiết kế",
    "en": "File System & Async Patterns"
  },
  "express-js-framework-chuyen-de": {
    "vi": "Express.js Framework (Chuyên đề)",
    "en": "Express.js Framework"
  },
  "database-prisma-orm-chuyen-de": {
    "vi": "Database: Prisma ORM (Chuyên đề)",
    "en": "Database: Prisma ORM"
  },
  "first-post-chuyen-de": {
    "vi": "First Post (Chuyên đề)",
    "en": "First Post"
  },
  "second-post-chuyen-de": {
    "vi": "Second Post (Chuyên đề)",
    "en": "Second Post"
  },
  "clean-kien-truc-error-xu-ly": {
    "vi": "Clean Kiến trúc & Error Xử lý",
    "en": "Clean Architecture & Error Handling"
  },
  "real-time-websocket-socket-io-chuyen-de": {
    "vi": "Real-time: WebSocket & Socket.io (Chuyên đề)",
    "en": "Real-time: WebSocket & Socket.io"
  },
  "queues-events-scheduling-chuyen-de": {
    "vi": "Queues, Events & Scheduling (Chuyên đề)",
    "en": "Queues, Events & Scheduling"
  },
  "laravel-kien-truc-mau-thiet-ke": {
    "vi": "Laravel Kiến trúc Mẫu thiết kế",
    "en": "Laravel Architecture Patterns"
  },
  "decorators-closures-trong-python-chuyen-de": {
    "vi": "Decorators & Closures trong Python (Chuyên đề)",
    "en": "Decorators & Closures trong Python"
  },
  "props-events-conditional-rendering-chuyen-de": {
    "vi": "Props, Events & Conditional Rendering (Chuyên đề)",
    "en": "Props, Events & Conditional Rendering"
  },
  "learn-react-chuyen-de": {
    "vi": "Learn React (Chuyên đề)",
    "en": "Learn React"
  },
  "build-project-chuyen-de": {
    "vi": "Build Project (Chuyên đề)",
    "en": "Build Project"
  },
  "lists-keys-children-pattern-chuyen-de": {
    "vi": "Lists, Keys & Children Pattern (Chuyên đề)",
    "en": "Lists, Keys & Children Pattern"
  },
  "usestate-useeffect-chuyen-de": {
    "vi": "useState & useEffect (Chuyên đề)",
    "en": "useState & useEffect"
  },
  "forms-controlled-components-chuyen-de": {
    "vi": "Forms & Controlled Components (Chuyên đề)",
    "en": "Forms & Controlled Components"
  },
  "react-router-dieu-huong": {
    "vi": "React Router & Điều hướng",
    "en": "React Router & Navigation"
  },
  "custom-hooks-chuyen-de": {
    "vi": "Custom Hooks (Chuyên đề)",
    "en": "Custom Hooks"
  },
  "nang-cao-mau-thiet-ke-kien-truc": {
    "vi": "nâng cao Mẫu thiết kế & Kiến trúc",
    "en": "Advanced Patterns & Architecture"
  },
  "next-js-server-components-chuyen-de": {
    "vi": "Next.js & Server Components (Chuyên đề)",
    "en": "Next.js & Server Components"
  },
  "react-fiber-reconciliation-chuyen-de": {
    "vi": "React Fiber & Reconciliation (Chuyên đề)",
    "en": "React Fiber & Reconciliation"
  },
  "react-19-future-chuyen-de": {
    "vi": "React 19 & Future (Chuyên đề)",
    "en": "React 19 & Future"
  },
  "ruby-syntax-everything-is-object-chuyen-de": {
    "vi": "Ruby Syntax & Everything is Object (Chuyên đề)",
    "en": "Ruby Syntax & Everything is Object"
  },
  "methods-blocks-classes-chuyen-de": {
    "vi": "Methods, Blocks & Classes (Chuyên đề)",
    "en": "Methods, Blocks & Classes"
  },
  "modules-mixins-error-xu-ly": {
    "vi": "Modules, Mixins & Error Xử lý",
    "en": "Modules, Mixins & Error Handling"
  },
  "test-chuyen-de": {
    "vi": "Test (Chuyên đề)",
    "en": "Test"
  },
  "ruby-metaprogramming-chuyen-de": {
    "vi": "Ruby Metaprogramming (Chuyên đề)",
    "en": "Ruby Metaprogramming"
  },
  "macros-nang-cao-mau-thiet-ke": {
    "vi": "Macros & nâng cao Mẫu thiết kế",
    "en": "Macros & Advanced Patterns"
  },
  "rust-syntax-ownership-chuyen-de": {
    "vi": "Rust Syntax & Ownership (Chuyên đề)",
    "en": "Rust Syntax & Ownership"
  },
  "enums-structs-pattern-matching-chuyen-de": {
    "vi": "Enums, Structs & Pattern Matching (Chuyên đề)",
    "en": "Enums, Structs & Pattern Matching"
  },
  "error-xu-ly-result-t-e": {
    "vi": "Error Xử lý & Result<T,E>",
    "en": "Error Handling & Result<T,E>"
  },
  "iterators-closures-chuyen-de": {
    "vi": "Iterators & Closures (Chuyên đề)",
    "en": "Iterators & Closures"
  },
  "async-await-tokio-chuyen-de": {
    "vi": "Async/Await & Tokio (Chuyên đề)",
    "en": "Async/Await & Tokio"
  },
  "macros-metaprogramming-chuyen-de": {
    "vi": "Macros & Metaprogramming (Chuyên đề)",
    "en": "Macros & Metaprogramming"
  },
  "select-insert-update-delete-chuyen-de": {
    "vi": "SELECT, INSERT, UPDATE, DELETE (Chuyên đề)",
    "en": "SELECT, INSERT, UPDATE, DELETE"
  },
  "where-operators-ham": {
    "vi": "WHERE, Operators & Hàm",
    "en": "WHERE, Operators & Functions"
  },
  "joins-relationships-chuyen-de": {
    "vi": "JOINs & Relationships (Chuyên đề)",
    "en": "JOINs & Relationships"
  },
  "subqueries-ctes-chuyen-de": {
    "vi": "Subqueries & CTEs (Chuyên đề)",
    "en": "Subqueries & CTEs"
  },
  "transactions-data-integrity-chuyen-de": {
    "vi": "Transactions & Data Integrity (Chuyên đề)",
    "en": "Transactions & Data Integrity"
  },
  "distributed-databases-cap-chuyen-de": {
    "vi": "Distributed Databases & CAP (Chuyên đề)",
    "en": "Distributed Databases & CAP"
  },
  "nang-cao-mau-thiet-ke": {
    "vi": "nâng cao Mẫu thiết kế",
    "en": "Advanced patterns"
  },
  "tailwind-css-introduction-chuyen-de": {
    "vi": "Tailwind CSS Introduction (Chuyên đề)",
    "en": "Tailwind CSS Introduction"
  },
  "layout-flexbox-grid-chuyen-de": {
    "vi": "Layout & Flexbox/Grid (Chuyên đề)",
    "en": "Layout & Flexbox/Grid"
  },
  "building-ui-components-chuyen-de": {
    "vi": "Building UI Components (Chuyên đề)",
    "en": "Building UI Components"
  },
  "customizing-tailwind-config-chuyen-de": {
    "vi": "Customizing Tailwind Config (Chuyên đề)",
    "en": "Customizing Tailwind Config"
  },
  "animations-transitions-chuyen-de": {
    "vi": "Animations & Transitions (Chuyên đề)",
    "en": "Animations & Transitions"
  },
  "tailwind-css-v4-features-chuyen-de": {
    "vi": "Tailwind CSS v4 Features (Chuyên đề)",
    "en": "Tailwind CSS v4 Features"
  },
  "nang-cao-types-mau-thiet-ke": {
    "vi": "nâng cao Types & Mẫu thiết kế",
    "en": "Advanced Types & Patterns"
  },
  "conditional-types-nang-cao-mau-thiet-ke": {
    "vi": "Conditional Types & nâng cao Mẫu thiết kế",
    "en": "Conditional Types & Advanced Patterns"
  },
  "interfaces-type-aliases-chuyen-de": {
    "vi": "Interfaces & Type Aliases (Chuyên đề)",
    "en": "Interfaces & Type Aliases"
  },
  "utility-types-mapped-types-chuyen-de": {
    "vi": "Utility Types & Mapped Types (Chuyên đề)",
    "en": "Utility Types & Mapped Types"
  },
  "discriminated-unions-type-guards-chuyen-de": {
    "vi": "Discriminated Unions & Type Guards (Chuyên đề)",
    "en": "Discriminated Unions & Type Guards"
  },
  "conditional-types-infer-chuyen-de": {
    "vi": "Conditional Types & Infer (Chuyên đề)",
    "en": "Conditional Types & Infer"
  },
  "nang-cao-typescript-mau-thiet-ke": {
    "vi": "nâng cao TypeScript Mẫu thiết kế",
    "en": "Advanced TypeScript Patterns"
  },
  "declaration-files-module-types-chuyen-de": {
    "vi": "Declaration Files & Module Types (Chuyên đề)",
    "en": "Declaration Files & Module Types"
  },
  "typescript-ecosystem-best-practices-chuyen-de": {
    "vi": "TypeScript Ecosystem & Best Practices (Chuyên đề)",
    "en": "TypeScript Ecosystem & Best Practices"
  },
  "dinh-tuyen-vue-router-quan-ly-state-pinia": {
    "vi": "Định tuyến Vue Router & Quản lý State Pinia",
    "en": "Vue Router & Pinia"
  },
  "events-methods-chuyen-de": {
    "vi": "Events & Methods (Chuyên đề)",
    "en": "Events & Methods"
  },
  "components-props-chuyen-de": {
    "vi": "Components & Props (Chuyên đề)",
    "en": "Components & Props"
  },
  "composition-api-composables-chuyen-de": {
    "vi": "Composition API & Composables (Chuyên đề)",
    "en": "Composition API & Composables"
  },
  "vue-router-chuyen-de": {
    "vi": "Vue Router (Chuyên đề)",
    "en": "Vue Router"
  },
  "nuxt-js-framework-chuyen-de": {
    "vi": "Nuxt.js Framework (Chuyên đề)",
    "en": "Nuxt.js Framework"
  },
  "decorators-generators-lap-trinh-bat-dong-bo": {
    "vi": "Decorators, Generators & Lập trình bất đồng bộ",
    "en": "Decorators, Generators & Async"
  },
  "metaclasses-c-extensions-thiet-ke-he-thong": {
    "vi": "Metaclasses, C Extensions & Thiết kế hệ thống",
    "en": "Metaclasses, C Extensions & System Design"
  },
  "collections-streams-api-xu-ly-ngoai-le": {
    "vi": "Collections, Streams API & Xử lý ngoại lệ",
    "en": "Collections, Streams & Exception Handling"
  },
  "express-rest-api-middleware-chuyen-de": {
    "vi": "Express, REST API & Middleware (Chuyên đề)",
    "en": "Express, REST API & Middleware"
  },
  "hooks-state-effects-chuyen-de": {
    "vi": "Hooks, State & Effects (Chuyên đề)",
    "en": "Hooks, State & Effects"
  },
  "custom-hooks-context-mau-thiet-ke": {
    "vi": "Custom Hooks, Context & Mẫu thiết kế",
    "en": "Custom Hooks, Context & Patterns"
  },
  "kien-truc-server-components-nang-cao-mau-thiet-ke": {
    "vi": "Kiến trúc, Server Components & nâng cao Mẫu thiết kế",
    "en": "Architecture, Server Components & Advanced Patterns"
  },
  "joins-subqueries-grouping-chuyen-de": {
    "vi": "JOINs, Subqueries & Grouping (Chuyên đề)",
    "en": "JOINs, Subqueries & Grouping"
  },
  "indexing-transactions-nosql-chuyen-de": {
    "vi": "Indexing, Transactions & NoSQL (Chuyên đề)",
    "en": "Indexing, Transactions & NoSQL"
  },
  "tich-hop-tests-test-mau-thiet-ke": {
    "vi": "Tích hợp tests & Test Mẫu thiết kế",
    "en": "Integration tests & Test patterns"
  },
  "coverage-ci-cd-test-strategy-chuyen-de": {
    "vi": "Coverage, CI/CD & Test Strategy (Chuyên đề)",
    "en": "Coverage, CI/CD & Test Strategy"
  },
  "docker-images-compose-chuyen-de": {
    "vi": "Docker images & Compose (Chuyên đề)",
    "en": "Docker images & Compose"
  },
  "git-branching-strategies-ci-cd-chuyen-de": {
    "vi": "Git branching strategies & CI/CD (Chuyên đề)",
    "en": "Git branching strategies & CI/CD"
  },
  "kubernetes-orchestration-gitops-chuyen-de": {
    "vi": "Kubernetes, Orchestration & GitOps (Chuyên đề)",
    "en": "Kubernetes, Orchestration & GitOps"
  },
  "generics-utility-types-chuyen-de": {
    "vi": "Generics & Utility Types (Chuyên đề)",
    "en": "Generics & Utility Types"
  },
  "declaration-files-type-level-programming-chuyen-de": {
    "vi": "Declaration files, Type-Level Programming (Chuyên đề)",
    "en": "Declaration files, Type-Level Programming"
  },
  "compiler-api-custom-transformers-chuyen-de": {
    "vi": "Compiler API & Custom Transformers (Chuyên đề)",
    "en": "Compiler API & Custom Transformers"
  },
  "list-dict-set-tuple-chuyen-de": {
    "vi": "List, Dict, Set, Tuple (Chuyên đề)",
    "en": "List, Dict, Set, Tuple"
  },
  "decorators-generators-chuyen-de": {
    "vi": "Decorators & Generators (Chuyên đề)",
    "en": "Decorators & Generators"
  },
  "spring-boot-essentials-chuyen-de": {
    "vi": "Spring Boot Essentials (Chuyên đề)",
    "en": "Spring Boot Essentials"
  },
  "express-js-rest-api-chuyen-de": {
    "vi": "Express.js REST API (Chuyên đề)",
    "en": "Express.js REST API"
  },
  "microservices-event-driven-chuyen-de": {
    "vi": "Microservices & Event-Driven (Chuyên đề)",
    "en": "Microservices & Event-Driven"
  },
  "react-kien-truc-mau-thiet-ke": {
    "vi": "React Kiến trúc Mẫu thiết kế",
    "en": "React Architecture Patterns"
  },
  "flexbox-grid-layout-chuyen-de": {
    "vi": "Flexbox & Grid Layout (Chuyên đề)",
    "en": "Flexbox & Grid Layout"
  },
  "css-bien-so-animations": {
    "vi": "CSS Biến số & Animations",
    "en": "CSS Variables & Animations"
  },
  "design-systems-houdini-chuyen-de": {
    "vi": "Design Systems & Houdini (Chuyên đề)",
    "en": "Design Systems & Houdini"
  },
  "mongodb-nosql-mau-thiet-ke": {
    "vi": "MongoDB & NoSQL Mẫu thiết kế",
    "en": "MongoDB & NoSQL Patterns"
  },
  "mocking-async-tests-chuyen-de": {
    "vi": "Mocking & Async Tests (Chuyên đề)",
    "en": "Mocking & Async Tests"
  },
  "tich-hop-kiem-thu-mau-thiet-ke": {
    "vi": "Tích hợp Kiểm thử Mẫu thiết kế",
    "en": "Integration Testing Patterns"
  },
  "dockerfile-docker-compose-chuyen-de": {
    "vi": "Dockerfile & Docker Compose (Chuyên đề)",
    "en": "Dockerfile & Docker Compose"
  },
  "git-flow-ci-cd-chuyen-de": {
    "vi": "Git Flow & CI/CD (Chuyên đề)",
    "en": "Git Flow & CI/CD"
  },
  "docker-production-best-practices-chuyen-de": {
    "vi": "Docker Production Best Practices (Chuyên đề)",
    "en": "Docker Production Best Practices"
  },
  "kubernetes-gitops-chuyen-de": {
    "vi": "Kubernetes & GitOps (Chuyên đề)",
    "en": "Kubernetes & GitOps"
  },
  "nang-cao-type-mau-thiet-ke": {
    "vi": "nâng cao Type Mẫu thiết kế",
    "en": "Advanced Type Patterns"
  },
  "ham-generics-co-ban-trong-typescript": {
    "vi": "Hàm & Generics cơ bản trong TypeScript",
    "en": "Functions & Generics cơ bản"
  },
  "lap-trinh-huong-doi-tuong-trong-dart-classes-mixins-generics": {
    "vi": "Lập trình hướng đối tượng trong Dart: Classes, Mixins & Generics",
    "en": "OOP trong Dart: Classes, Mixins & Generics"
  },
  "basic-data-structures": {
    "vi": "Cấu trúc dữ liệu cơ bản",
    "en": "Basic Data Structures",
    "ja": "基本的なデータ構造",
    "ko": "기본 데이터 구조",
    "zh": "基本数据结构",
    "fr": "Structures de données de base",
    "de": "Grundlegende Datenstrukturen",
    "es": "Estructuras de datos básicas"
  },
  "graphs-dynamic-programming": {
    "vi": "Đồ thị (Graphs) & Quy hoạch động (DP)",
    "en": "Graphs & Dynamic Programming"
  },
  "interview-problem-patterns": {
    "vi": "Các dạng bài phỏng vấn thuật toán",
    "en": "Interview Problem Patterns"
  },
  "thuat-toan-do-thi-graph-algorithms": {
    "vi": "Thuật toán đồ thị (Graph Algorithms)",
    "en": "Graph Algorithms"
  },
  "advanced-data-structures-heap-trie-segment-tree": {
    "vi": "Cấu Trúc Dữ Liệu Nâng Cao: Heap, Trie & Segment Tree",
    "en": "Advanced Data Structures: Heap, Trie & Segment Tree",
    "ja": "高度なデータ構造: ヒープ、トライ、セグメント ツリー",
    "ko": "고급 데이터 구조: 힙, 트라이 및 세그먼트 트리",
    "zh": "高级数据结构：堆、Trie 和段树",
    "fr": "Structures de données avancées : arbre de tas, de tri et de segment",
    "de": "Erweiterte Datenstrukturen: Heap, Trie und Segmentbaum",
    "es": "Estructuras de datos avanzadas: montón, trie y árbol de segmentos"
  },
  "senior": {
    "vi": "Senior",
    "en": "Senior",
    "ja": "シニア",
    "ko": "상위",
    "zh": "高级的",
    "fr": "Senior",
    "de": "Senior",
    "es": "Sénior"
  },
  "newbie": {
    "vi": "Newbie",
    "en": "Newbie",
    "ja": "初心者",
    "ko": "초보자",
    "zh": "新手",
    "fr": "Débutant",
    "de": "Neuling",
    "es": "novato"
  },
  "string-handling-file-i-o": {
    "vi": "String xử lý & File I/O",
    "en": "String handling & File I/O",
    "ja": "文字列処理とファイル I/O",
    "ko": "문자열 처리 및 파일 I/O",
    "zh": "字符串处理和文件 I/O",
    "fr": "Gestion des chaînes et E/S de fichiers",
    "de": "String-Verarbeitung und Datei-E/A",
    "es": "Manejo de cadenas y E/S de archivos"
  },
  "mid-level": {
    "vi": "Mid-Level",
    "en": "Mid-Level",
    "ja": "中級レベル",
    "ko": "중간 수준",
    "zh": "中层",
    "fr": "Niveau intermédiaire",
    "de": "Mittleres Niveau",
    "es": "Nivel medio"
  },
  "functions-arrays": {
    "vi": "Hàm & Mảng",
    "en": "Functions & Arrays",
    "ja": "関数と配列",
    "ko": "함수 및 배열",
    "zh": "函数和数组",
    "fr": "Fonctions et tableaux",
    "de": "Funktionen und Arrays",
    "es": "Funciones y matrices"
  },
  "templates-generic-programming": {
    "vi": "Templates & Lập trình Generic",
    "en": "Templates & Generic Programming",
    "ja": "テンプレートと汎用プログラミング",
    "ko": "템플릿 및 일반 프로그래밍",
    "zh": "模板和通用编程",
    "fr": "Modèles et programmation générique",
    "de": "Vorlagen und generische Programmierung",
    "es": "Plantillas y programación genérica"
  },
  "multithreading-design-patterns-performance-optimization": {
    "vi": "Đa luồng, Mẫu thiết kế & Tối ưu hiệu năng",
    "en": "Multithreading, Design Patterns & Performance Optimization",
    "ja": "マルチスレッド、デザインパターン、パフォーマンスの最適化",
    "ko": "멀티스레딩, 디자인 패턴 및 성능 최적화",
    "zh": "多线程、设计模式和性能优化",
    "fr": "Multithreading, modèles de conception et optimisation des performances",
    "de": "Multithreading, Designmuster und Leistungsoptimierung",
    "es": "Multiproceso, patrones de diseño y optimización del rendimiento"
  },
  "conditional-statement": {
    "vi": "Câu lệnh điều kiện",
    "en": "Conditional statement",
    "ja": "条件文",
    "ko": "조건문",
    "zh": "条件语句",
    "fr": "Instruction conditionnelle",
    "de": "Bedingte Anweisung",
    "es": "Declaración condicional"
  },
  "loops-iteration": {
    "vi": "Vòng lặp & Iteration",
    "en": "Loops & Iteration",
    "ja": "ループと反復",
    "ko": "루프 및 반복",
    "zh": "循环与迭代",
    "fr": "Boucles et itération",
    "de": "Schleifen und Iteration",
    "es": "Bucles e iteración"
  },
  "variables-data-types": {
    "vi": "Biến & Kiểu dữ liệu",
    "en": "Variables & Data Types",
    "ja": "変数とデータ型",
    "ko": "변수 및 데이터 유형",
    "zh": "变量和数据类型",
    "fr": "Variables et types de données",
    "de": "Variablen und Datentypen",
    "es": "Variables y tipos de datos"
  },
  "hello-world-settings": {
    "vi": "Hello World & Cài đặt",
    "en": "Hello World & Settings",
    "ja": "ハローワールドと設定",
    "ko": "Hello World 및 설정",
    "zh": "你好世界和设置",
    "fr": "Bonjour tout le monde et paramètres",
    "de": "Hallo Welt & Einstellungen",
    "es": "Hola mundo y configuración"
  },
  "smart-pointers-raii-mechanism": {
    "vi": "Con trỏ thông minh (Smart Pointers) & Cơ chế RAII",
    "en": "Smart Pointers & RAII Mechanism",
    "ja": "スマート ポインターと RAII メカニズム",
    "ko": "스마트 포인터 및 RAII 메커니즘",
    "zh": "智能指针和RAII机制",
    "fr": "Pointeurs intelligents et mécanisme RAII",
    "de": "Intelligente Zeiger und RAII-Mechanismus",
    "es": "Punteros inteligentes y mecanismo RAII"
  },
  "basic-syntax-foundations": {
    "vi": "Cú pháp cơ bản & nền tảng",
    "en": "Basic syntax & foundations",
    "ja": "基本的な構文と基礎",
    "ko": "기본 구문 및 기초",
    "zh": "基本语法和基础",
    "fr": "Syntaxe et fondements de base",
    "de": "Grundlegende Syntax und Grundlagen",
    "es": "Sintaxis y fundamentos básicos"
  },
  "junior": {
    "vi": "Junior",
    "en": "Junior",
    "ja": "ジュニア",
    "ko": "후진",
    "zh": "初级",
    "fr": "Junior",
    "de": "Junior",
    "es": "Júnior"
  },
  "master": {
    "vi": "Master",
    "en": "Master",
    "ja": "マスター",
    "ko": "주인",
    "zh": "掌握",
    "fr": "Maître",
    "de": "Master",
    "es": "Maestro"
  },
  "generators-iterators-with-yield": {
    "vi": "Generators & Iterators với yield",
    "en": "Generators & Iterators with yield",
    "ja": "ジェネレーターとイテレーター (収量付き)",
    "ko": "수율이 있는 생성기 및 반복기",
    "zh": "具有产量的生成器和迭代器",
    "fr": "Générateurs et itérateurs avec rendement",
    "de": "Generatoren und Iteratoren mit Ertrag",
    "es": "Generadores e iteradores con rendimiento"
  },
  "hello-world-basics": {
    "vi": "Hello World & Cơ bản",
    "en": "Hello World & Basics",
    "ja": "Hello World と基本",
    "ko": "Hello World 및 기본 사항",
    "zh": "你好世界和基础知识",
    "fr": "Bonjour tout le monde et les bases",
    "de": "Hallo Welt & Grundlagen",
    "es": "Hola mundo y conceptos básicos"
  },
  "decorators-closures-in-python": {
    "vi": "Decorators & Closures trong Python",
    "en": "Decorators & Closures in Python",
    "ja": "Python のデコレータとクロージャ",
    "ko": "Python의 데코레이터 및 클로저",
    "zh": "Python 中的装饰器和闭包",
    "fr": "Décorateurs et fermetures en Python",
    "de": "Dekoratoren und Verschlüsse in Python",
    "es": "Decoradores y Cierres en Python"
  },
  "design-patterns-in-c": {
    "vi": "Design Patterns trong C++",
    "en": "Design Patterns in C++",
    "ja": "C++ でのデザインパターン",
    "ko": "C++의 디자인 패턴",
    "zh": "C++ 中的设计模式",
    "fr": "Modèles de conception en C++",
    "de": "Entwurfsmuster in C++",
    "es": "Patrones de diseño en C++"
  },
  "conditions-operators": {
    "vi": "Điều kiện & Toán tử",
    "en": "Conditions & Operators",
    "ja": "条件と演算子",
    "ko": "조건 및 연산자",
    "zh": "条件和运营商",
    "fr": "Conditions & Opérateurs",
    "de": "Bedingungen & Betreiber",
    "es": "Condiciones y operadores"
  },
  "basic-python-syntax": {
    "vi": "Syntax cơ bản Python",
    "en": "Basic Python Syntax",
    "ja": "基本的な Python 構文",
    "ko": "기본 Python 구문",
    "zh": "基本 Python 语法",
    "fr": "Syntaxe Python de base",
    "de": "Grundlegende Python-Syntax",
    "es": "Sintaxis básica de Python"
  },
  "multithreading-concurrency-multithreaded-programming": {
    "vi": "Lập trình đa luồng Multithreading & Concurrency",
    "en": "Multithreading & Concurrency Multithreaded Programming",
    "ja": "マルチスレッドと同時実行 マルチスレッド プログラミング",
    "ko": "멀티스레딩 및 동시성 멀티스레드 프로그래밍",
    "zh": "多线程与并发 多线程编程",
    "fr": "Programmation multithread et simultanéité",
    "de": "Multithreading und parallele Multithread-Programmierung",
    "es": "Multiproceso y concurrencia Programación multiproceso"
  },
  "asynchronous-programming-async-await-concurrency": {
    "vi": "Lập trình Bất đồng bộ Async/Await & Concurrency",
    "en": "Asynchronous Programming Async/Await & Concurrency",
    "ja": "非同期プログラミング 非同期/待機と同時実行",
    "ko": "비동기 프로그래밍 비동기/대기 및 동시성",
    "zh": "异步编程异步/等待和并发",
    "fr": "Programmation asynchrone Async/Await & Concurrency",
    "de": "Asynchrone Programmierung Async/Warten und Parallelität",
    "es": "Programación asincrónica Async/Await y concurrencia"
  },
  "asynchronous-programming-testing-web-frameworks": {
    "vi": "Lập trình Bất đồng bộ, Kiểm thử & Web Frameworks",
    "en": "Asynchronous Programming, Testing & Web Frameworks",
    "ja": "非同期プログラミング、テスト、Web フレームワーク",
    "ko": "비동기 프로그래밍, 테스트 및 웹 프레임워크",
    "zh": "异步编程、测试和 Web 框架",
    "fr": "Programmation asynchrone, tests et frameworks Web",
    "de": "Asynchrone Programmierung, Tests und Web-Frameworks",
    "es": "Programación asincrónica, pruebas y marcos web"
  },
  "data-types-controls": {
    "vi": "Kiểu dữ liệu & Điều khiển",
    "en": "Data Types & Controls",
    "ja": "データ型とコントロール",
    "ko": "데이터 유형 및 컨트롤",
    "zh": "数据类型和控件",
    "fr": "Types de données et contrôles",
    "de": "Datentypen und Steuerelemente",
    "es": "Tipos de datos y controles"
  },
  "in-depth-oop-java-collections-framework": {
    "vi": "OOP chuyên sâu & Bộ khung Java Collections",
    "en": "In-depth OOP & Java Collections Framework",
    "ja": "詳細な OOP および Java コレクション フレームワーク",
    "ko": "심층적인 OOP 및 Java 컬렉션 프레임워크",
    "zh": "深入的 OOP 和 Java 集合框架",
    "fr": "Cadre de collections POO et Java approfondi",
    "de": "Ausführliches OOP- und Java Collections Framework",
    "es": "Marco de colecciones de Java y programación orientada a objetos en profundidad"
  },
  "modern-type-hints-dataclasses": {
    "vi": "Type Hints & Dataclasses hiện đại",
    "en": "Modern Type Hints & Dataclasses",
    "ja": "最新の型ヒントとデータクラス",
    "ko": "최신 유형 힌트 및 데이터 클래스",
    "zh": "现代类型提示和数据类",
    "fr": "Astuces de type moderne et classes de données",
    "de": "Moderne Typhinweise und Datenklassen",
    "es": "Sugerencias de tipo moderno y clases de datos"
  },
  "exception-handling-generics-programming": {
    "vi": "Xử lý ngoại lệ (Exceptions) & Lập trình Generics",
    "en": "Exception Handling & Generics Programming",
    "ja": "例外処理とジェネリックプログラミング",
    "ko": "예외 처리 및 제네릭 프로그래밍",
    "zh": "异常处理和泛型编程",
    "fr": "Gestion des exceptions et programmation générique",
    "de": "Ausnahmebehandlung und generische Programmierung",
    "es": "Manejo de excepciones y programación genérica"
  },
  "metaclasses-cpython-performance-optimization": {
    "vi": "Metaclasses & Tối ưu hiệu năng CPython",
    "en": "Metaclasses & CPython Performance Optimization",
    "ja": "メタクラスと CPython パフォーマンスの最適化",
    "ko": "메타클래스 및 CPython 성능 최적화",
    "zh": "元类和 CPython 性能优化",
    "fr": "Métaclasses et optimisation des performances CPython",
    "de": "Metaklassen und CPython-Leistungsoptimierung",
    "es": "Metaclases y optimización del rendimiento de CPython"
  },
  "design-patterns-databases": {
    "vi": "Design Patterns & Database",
    "en": "Design Patterns & Databases",
    "ja": "デザインパターンとデータベース",
    "ko": "디자인 패턴 및 데이터베이스",
    "zh": "设计模式和数据库",
    "fr": "Modèles de conception et bases de données",
    "de": "Entwurfsmuster und Datenbanken",
    "es": "Patrones de diseño y bases de datos"
  },
  "build-web-backend-with-fastapi": {
    "vi": "Xây dựng Web Backend với FastAPI",
    "en": "Build Web Backend with FastAPI",
    "ja": "FastAPI を使用して Web バックエンドを構築する",
    "ko": "FastAPI로 웹 백엔드 구축",
    "zh": "使用 FastAPI 构建 Web 后端",
    "fr": "Créez un backend Web avec FastAPI",
    "de": "Erstellen Sie ein Web-Backend mit FastAPI",
    "es": "Cree un backend web con FastAPI"
  },
  "metaclasses-attribute-descriptors": {
    "vi": "Metaclasses & Thuộc tính Descriptors",
    "en": "Metaclasses & Attribute Descriptors",
    "ja": "メタクラスと属性記述子",
    "ko": "메타클래스 및 속성 설명자",
    "zh": "元类和属性描述符",
    "fr": "Métaclasses et descripteurs d'attributs",
    "de": "Metaklassen und Attributdeskriptoren",
    "es": "Metaclases y descriptores de atributos"
  },
  "test-the-application-with-pytest": {
    "vi": "Kiểm thử ứng dụng với pytest",
    "en": "Test the application with pytest",
    "ja": "pytest でアプリケーションをテストする",
    "ko": "pytest로 애플리케이션 테스트",
    "zh": "使用 pytest 测试应用程序",
    "fr": "Testez l'application avec pytest",
    "de": "Testen Sie die Anwendung mit Pytest",
    "es": "Pruebe la aplicación con pytest"
  },
  "basic-java-syntax": {
    "vi": "Cú pháp Java cơ bản",
    "en": "Basic Java syntax",
    "ja": "基本的な Java 構文",
    "ko": "기본 Java 구문",
    "zh": "基本 Java 语法",
    "fr": "Syntaxe Java de base",
    "de": "Grundlegende Java-Syntax",
    "es": "Sintaxis básica de Java"
  },
  "collections-data-frame-stream-processing-streams-api": {
    "vi": "Khung dữ liệu Collections & Xử lý luồng Streams API",
    "en": "Collections Data Frame & Stream Processing Streams API",
    "ja": "コレクション データ フレームとストリーム処理 ストリーム API",
    "ko": "컬렉션 데이터 프레임 및 스트림 처리 스트림 API",
    "zh": "集合 数据帧 & 流处理 Streams API",
    "fr": "API de flux de traitement de trame de données et de flux de collections",
    "de": "Sammlungsdatenrahmen und Stream-Verarbeitungs-Streams-API",
    "es": "Marco de datos de colecciones y procesamiento de flujos API de flujos"
  },
  "jvm-virtual-machine-engine-performance-optimization": {
    "vi": "Cơ chế máy ảo JVM & Tối ưu hóa hiệu năng",
    "en": "JVM Virtual Machine Engine & Performance Optimization",
    "ja": "JVM 仮想マシン エンジンとパフォーマンスの最適化",
    "ko": "JVM 가상 머신 엔진 및 성능 최적화",
    "zh": "JVM虚拟机引擎与性能优化",
    "fr": "Moteur de machine virtuelle JVM et optimisation des performances",
    "de": "JVM Virtual Machine Engine und Leistungsoptimierung",
    "es": "Motor de máquina virtual JVM y optimización del rendimiento"
  },
  "node-js-platform-event-loop-model": {
    "vi": "Nền tảng Node.js & Mô hình Event Loop",
    "en": "Node.js Platform & Event Loop Model",
    "ja": "Node.js プラットフォームとイベント ループ モデル",
    "ko": "Node.js 플랫폼 및 이벤트 루프 모델",
    "zh": "Node.js 平台和事件循环模型",
    "fr": "Plateforme Node.js et modèle de boucle d'événements",
    "de": "Node.js-Plattform- und Ereignisschleifenmodell",
    "es": "Plataforma Node.js y modelo de bucle de eventos"
  },
  "develop-web-applications-with-spring-boot": {
    "vi": "Phát triển ứng dụng Web với Spring Boot",
    "en": "Develop Web applications with Spring Boot",
    "ja": "Spring Boot を使用して Web アプリケーションを開発する",
    "ko": "Spring Boot를 사용하여 웹 애플리케이션 개발",
    "zh": "使用 Spring Boot 开发 Web 应用程序",
    "fr": "Développer des applications Web avec Spring Boot",
    "de": "Entwickeln Sie Webanwendungen mit Spring Boot",
    "es": "Desarrollar aplicaciones web con Spring Boot"
  },
  "performance-span-memory-optimization": {
    "vi": "Tối ưu hóa hiệu năng & Bộ nhớ Span/Memory",
    "en": "Performance & Span/Memory Optimization",
    "ja": "パフォーマンスとスパン/メモリの最適化",
    "ko": "성능 및 범위/메모리 최적화",
    "zh": "性能和跨度/内存优化",
    "fr": "Optimisation des performances et de l'étendue/de la mémoire",
    "de": "Leistungs- und Spannen-/Speicheroptimierung",
    "es": "Optimización de rendimiento y amplitud/memoria"
  },
  "basic-jsx-components": {
    "vi": "JSX & Components cơ bản",
    "en": "Basic JSX & Components",
    "ja": "基本的な JSX とコンポーネント",
    "ko": "기본 JSX 및 구성 요소",
    "zh": "基本 JSX 和组件",
    "fr": "JSX et composants de base",
    "de": "Grundlegende JSX und Komponenten",
    "es": "JSX básico y componentes"
  },
  "react-hooks-application-state-management": {
    "vi": "React Hooks & Quản lý trạng thái ứng dụng",
    "en": "React Hooks & Application State Management",
    "ja": "React フックとアプリケーションの状態管理",
    "ko": "React Hooks 및 애플리케이션 상태 관리",
    "zh": "React Hooks 和应用程序状态管理",
    "fr": "React Hooks et gestion de l’état des applications",
    "de": "React Hooks und Anwendungsstatusverwaltung",
    "es": "React Hooks y gestión del estado de las aplicaciones"
  },
  "basic-html5-css": {
    "vi": "HTML5 & CSS cơ bản",
    "en": "Basic HTML5 & CSS",
    "ja": "基本的な HTML5 と CSS",
    "ko": "기본 HTML5 및 CSS",
    "zh": "基本 HTML5 和 CSS",
    "fr": "HTML5 et CSS de base",
    "de": "Grundlegendes HTML5 und CSS",
    "es": "HTML5 y CSS básicos"
  },
  "detailed-matchers-assertions": {
    "vi": "Matchers & Assertions chi tiết",
    "en": "Detailed Matchers & Assertions",
    "ja": "詳細なマッチャーとアサーション",
    "ko": "상세한 일치자 및 어설션",
    "zh": "详细的匹配器和断言",
    "fr": "Correspondants et assertions détaillés",
    "de": "Detaillierte Matcher und Behauptungen",
    "es": "Comparadores y afirmaciones detallados"
  },
  "basic-testing-with-jest": {
    "vi": "Testing cơ bản với Jest",
    "en": "Basic testing with Jest",
    "ja": "Jest を使用した基本的なテスト",
    "ko": "Jest를 사용한 기본 테스트",
    "zh": "使用 Jest 进行基本测试",
    "fr": "Tests de base avec Jest",
    "de": "Grundlegende Tests mit Jest",
    "es": "Pruebas básicas con Jest"
  },
  "basic-sql-crud": {
    "vi": "SQL cơ bản & CRUD",
    "en": "Basic SQL & CRUD",
    "ja": "基本的な SQL と CRUD",
    "ko": "기본 SQL 및 CRUD",
    "zh": "基本 SQL 和 CRUD",
    "fr": "SQL de base et CRUD",
    "de": "Grundlegendes SQL und CRUD",
    "es": "SQL básico y CRUD"
  },
  "basic-git-docker": {
    "vi": "Git & Docker cơ bản",
    "en": "Basic Git & Docker",
    "ja": "基本的な Git と Docker",
    "ko": "기본 Git 및 도커",
    "zh": "基本的 Git 和 Docker",
    "fr": "Git et Docker de base",
    "de": "Grundlegendes Git und Docker",
    "es": "Git básico y Docker"
  },
  "basic-c": {
    "vi": "C# cơ bản",
    "en": "Basic C#",
    "ja": "基本的な C#",
    "ko": "기본 C#",
    "zh": "基础 C#",
    "fr": "C# de base",
    "de": "Grundlegendes C#",
    "es": "C# básico"
  },
  "basic-types-interfaces": {
    "vi": "Types cơ bản & Interfaces",
    "en": "Basic Types & Interfaces",
    "ja": "基本的な型とインターフェイス",
    "ko": "기본 유형 및 인터페이스",
    "zh": "基本类型和接口",
    "fr": "Types et interfaces de base",
    "de": "Grundlegende Typen und Schnittstellen",
    "es": "Tipos e interfaces básicos"
  },
  "system-architecture-net-distributed-design": {
    "vi": "Kiến trúc hệ thống & Thiết kế phân tán .NET",
    "en": "System Architecture & .NET Distributed Design",
    "ja": "システム アーキテクチャと .NET 分散設計",
    "ko": "시스템 아키텍처 및 .NET 분산 설계",
    "zh": "系统架构与.NET分布式设计",
    "fr": "Architecture système et conception distribuée .NET",
    "de": "Systemarchitektur und verteiltes .NET-Design",
    "es": "Arquitectura del sistema y diseño distribuido .NET"
  },
  "data-collection-collections-linq-queries": {
    "vi": "Tập hợp dữ liệu (Collections) & Truy vấn LINQ",
    "en": "Data Collection (Collections) & LINQ Queries",
    "ja": "データ収集 (コレクション) と LINQ クエリ",
    "ko": "데이터 수집(컬렉션) 및 LINQ 쿼리",
    "zh": "数据收集（Collections）和 LINQ 查询",
    "fr": "Collecte de données (collections) et requêtes LINQ",
    "de": "Datenerfassung (Sammlungen) und LINQ-Abfragen",
    "es": "Recopilación de datos (colecciones) y consultas LINQ"
  },
  "asynchronous-programming-async-await": {
    "vi": "Lập trình bất đồng bộ Async/Await",
    "en": "Asynchronous programming Async/Await",
    "ja": "非同期プログラミング Async/Await",
    "ko": "비동기 프로그래밍 Async/Await",
    "zh": "异步编程Async/Await",
    "fr": "Programmation asynchrone Async/Await",
    "de": "Asynchrone Programmierung Async/Await",
    "es": "Programación asincrónica Async/Await"
  },
  "c-syntax-data-type-system": {
    "vi": "Cú pháp C# & Hệ thống kiểu dữ liệu",
    "en": "C# Syntax & Data Type System",
    "ja": "C# 構文とデータ型システム",
    "ko": "C# 구문 및 데이터 유형 시스템",
    "zh": "C# 语法和数据类型系统",
    "fr": "Syntaxe C# et système de types de données",
    "de": "C#-Syntax- und Datentypsystem",
    "es": "Sistema de tipos de datos y sintaxis de C#"
  },
  "concurrent-programming-of-goroutines-web-building": {
    "vi": "Lập trình đồng thời Goroutines & Xây dựng Web",
    "en": "Concurrent Programming of Goroutines & Web Building",
    "ja": "ゴルーチンと Web 構築の同時プログラミング",
    "ko": "고루틴 및 웹 구축의 동시 프로그래밍",
    "zh": "Goroutines 的并发编程和 Web 构建",
    "fr": "Programmation simultanée de Goroutines et de création de sites Web",
    "de": "Gleichzeitige Programmierung von Goroutinen und Webbuilding",
    "es": "Programación concurrente de gorutinas y construcción web"
  },
  "asynchronous-generics-asp-net-core": {
    "vi": "Bất đồng bộ, Generics & ASP.NET Core",
    "en": "Asynchronous, Generics & ASP.NET Core",
    "ja": "非同期、ジェネリック、ASP.NET Core",
    "ko": "비동기식, 제네릭 및 ASP.NET Core",
    "zh": "异步、泛型和 ASP.NET Core",
    "fr": "Asynchrone, génériques et ASP.NET Core",
    "de": "Asynchron, generisch und ASP.NET Core",
    "es": "Asíncrono, genéricos y ASP.NET Core"
  },
  "design-large-scale-net-system-architecture": {
    "vi": "Thiết kế kiến trúc hệ thống .NET quy mô lớn",
    "en": "Design large-scale .NET system architecture",
    "ja": "大規模な .NET システム アーキテクチャを設計する",
    "ko": "대규모 .NET 시스템 아키텍처 설계",
    "zh": "设计大型.NET系统架构",
    "fr": "Concevoir une architecture système .NET à grande échelle",
    "de": "Entwerfen Sie eine groß angelegte .NET-Systemarchitektur",
    "es": "Diseñar una arquitectura de sistema .NET a gran escala."
  },
  "build-web-api-with-asp-net-core": {
    "vi": "Xây dựng Web API với ASP.NET Core",
    "en": "Build Web API with ASP.NET Core",
    "ja": "ASP.NET Core を使用して Web API を構築する",
    "ko": "ASP.NET Core로 웹 API 구축",
    "zh": "使用 ASP.NET Core 构建 Web API",
    "fr": "Créer une API Web avec ASP.NET Core",
    "de": "Erstellen Sie eine Web-API mit ASP.NET Core",
    "es": "Cree una API web con ASP.NET Core"
  },
  "modern-features-in-next-generation-net": {
    "vi": "Các tính năng hiện đại trong .NET thế hệ mới",
    "en": "Modern features in next generation .NET",
    "ja": "次世代 .NET の最新機能",
    "ko": "차세대 .NET의 최신 기능",
    "zh": "下一代 .NET 中的现代功能",
    "fr": "Fonctionnalités modernes dans .NET nouvelle génération",
    "de": "Moderne Funktionen in .NET der nächsten Generation",
    "es": "Funciones modernas en .NET de próxima generación"
  },
  "entity-framework-core-dependency-injection-architecture": {
    "vi": "Entity Framework Core, Dependency Injection & Kiến trúc",
    "en": "Entity Framework Core, Dependency Injection & Architecture",
    "ja": "Entity Framework コア、依存性注入、アーキテクチャ",
    "ko": "Entity Framework 핵심, 종속성 주입 및 아키텍처",
    "zh": "实体框架核心、依赖注入和架构",
    "fr": "Entity Framework Core, injection de dépendances et architecture",
    "de": "Entity Framework Core, Dependency Injection und Architektur",
    "es": "Núcleo de Entity Framework, inyección de dependencias y arquitectura"
  },
  "rust-syntax-foundation-type-system": {
    "vi": "Nền tảng cú pháp Rust & Hệ thống kiểu",
    "en": "Rust Syntax Foundation & Type System",
    "ja": "Rustの構文基盤と型システム",
    "ko": "Rust 구문 기반 및 유형 시스템",
    "zh": "Rust 语法基础和类型系统",
    "fr": "Fondation de la syntaxe Rust et système de types",
    "de": "Rust Syntax Foundation & Type System",
    "es": "Base de sintaxis y sistema de tipos de Rust"
  },
  "database-generics-production-environment": {
    "vi": "Cơ sở dữ liệu, Generics & Môi trường Production",
    "en": "Database, Generics & Production Environment",
    "ja": "データベース、ジェネリック、本番環境",
    "ko": "데이터베이스, 제네릭 및 생산 환경",
    "zh": "数据库、泛型和生产环境",
    "fr": "Base de données, génériques et environnement de production",
    "de": "Datenbank, Generics und Produktionsumgebung",
    "es": "Base de datos, genéricos y entorno de producción"
  },
  "enums-structures-pattern-matching": {
    "vi": "Enums, Structs & Pattern Matching",
    "en": "Enums, Structures & Pattern Matching",
    "ja": "列挙型、構造体、パターン マッチング",
    "ko": "열거형, 구조 및 패턴 일치",
    "zh": "枚举、结构和模式匹配",
    "fr": "Énumérations, structures et correspondance de modèles",
    "de": "Aufzählungen, Strukturen und Mustervergleich",
    "es": "Enumeraciones, estructuras y coincidencia de patrones"
  },
  "specification-of-behavior-with-traits-programming-generics": {
    "vi": "Đặc tả hành vi với Traits & Lập trình Generics",
    "en": "Specification of Behavior with Traits & Programming Generics",
    "ja": "特性とプログラミングジェネリックスによる動作の仕様",
    "ko": "특성 및 프로그래밍 일반을 사용한 동작 사양",
    "zh": "具有特征和编程泛型的行为规范",
    "fr": "Spécification du comportement avec des traits et des génériques de programmation",
    "de": "Spezifikation des Verhaltens mit Merkmalen und Programmiergenerika",
    "es": "Especificación de comportamiento con rasgos y genéricos de programación"
  },
  "advanced-concurrency-go-microservices-architecture": {
    "vi": "Concurrency nâng cao & Kiến trúc Microservices Go",
    "en": "Advanced Concurrency & Go Microservices Architecture",
    "ja": "高度な同時実行性と Go マイクロサービス アーキテクチャ",
    "ko": "고급 동시성 및 Go 마이크로서비스 아키텍처",
    "zh": "高级并发和 Go 微服务架构",
    "fr": "Architecture avancée de microservices de concurrence et Go",
    "de": "Erweiterte Concurrency & Go Microservices-Architektur",
    "es": "Arquitectura avanzada de microservicios Go y concurrencia"
  },
  "multi-threaded-programming-with-goroutines-channels": {
    "vi": "Lập trình đa luồng với Goroutines & Channels",
    "en": "Multi-threaded programming with Goroutines & Channels",
    "ja": "ゴルーチンとチャネルを使用したマルチスレッド プログラミング",
    "ko": "고루틴 및 채널을 사용한 멀티스레드 프로그래밍",
    "zh": "使用 Goroutine 和 Channel 进行多线程编程",
    "fr": "Programmation multithread avec Goroutines & Channels",
    "de": "Multithread-Programmierung mit Goroutinen und Kanälen",
    "es": "Programación multiproceso con Goroutines y Canales"
  },
  "databases-orms": {
    "vi": "Database & ORM",
    "en": "Databases & ORMs",
    "ja": "データベースとORM",
    "ko": "데이터베이스 및 ORM",
    "zh": "数据库和 ORM",
    "fr": "Bases de données et ORM",
    "de": "Datenbanken und ORMs",
    "es": "Bases de datos y ORM"
  },
  "modern-php-platform-new-syntax": {
    "vi": "Nền tảng PHP hiện đại & Cú pháp mới",
    "en": "Modern PHP Platform & New Syntax",
    "ja": "最新の PHP プラットフォームと新しい構文",
    "ko": "최신 PHP 플랫폼 및 새로운 구문",
    "zh": "现代 PHP 平台和新语法",
    "fr": "Plateforme PHP moderne et nouvelle syntaxe",
    "de": "Moderne PHP-Plattform und neue Syntax",
    "es": "Plataforma PHP moderna y nueva sintaxis"
  },
  "unsafe-rust-programming-c-ffi-interaction": {
    "vi": "Lập trình Unsafe Rust & Tương tác C FFI",
    "en": "Unsafe Rust Programming & C FFI Interaction",
    "ja": "安全でない Rust プログラミングと C FFI の相互作用",
    "ko": "안전하지 않은 Rust 프로그래밍 및 C FFI 상호 작용",
    "zh": "不安全的 Rust 编程和 C FFI 交互",
    "fr": "Programmation Rust dangereuse et interaction C FFI",
    "de": "Unsichere Rust-Programmierung und C-FFI-Interaktion",
    "es": "Programación insegura de Rust e interacción C FFI"
  },
  "advanced-swiftui-design-patterns-animations-gestures": {
    "vi": "Mẫu thiết kế SwiftUI nâng cao, Animations & Gestures",
    "en": "Advanced SwiftUI Design Patterns, Animations & Gestures",
    "ja": "高度な SwiftUI デザイン パターン、アニメーション、ジェスチャー",
    "ko": "고급 SwiftUI 디자인 패턴, 애니메이션 및 제스처",
    "zh": "高级 SwiftUI 设计模式、动画和手势",
    "fr": "Modèles de conception, animations et gestes SwiftUI avancés",
    "de": "Erweiterte SwiftUI-Designmuster, Animationen und Gesten",
    "es": "Patrones de diseño, animaciones y gestos avanzados de SwiftUI"
  },
  "test-performance-with-instruments-xctest-testing": {
    "vi": "Đo kiểm hiệu năng với Instruments & Kiểm thử XCTest",
    "en": "Test performance with Instruments & XCTest Testing",
    "ja": "Instruments と XCTest テストによるパフォーマンスのテスト",
    "ko": "계측기 및 XCTest 테스트를 통한 테스트 성능",
    "zh": "使用 Instruments 和 XCTest 测试测试性能",
    "fr": "Testez les performances avec Instruments et XCTest Testing",
    "de": "Testen Sie die Leistung mit Instruments & XCTest Testing",
    "es": "Pruebe el rendimiento con instrumentos y pruebas XCTest"
  },
  "collections-error-handling-mechanism-in-swift": {
    "vi": "Collections & Cơ chế xử lý lỗi trong Swift",
    "en": "Collections & Error Handling Mechanism in Swift",
    "ja": "Swift のコレクションとエラー処理メカニズム",
    "ko": "Swift의 컬렉션 및 오류 처리 메커니즘",
    "zh": "Swift 中的集合和错误处理机制",
    "fr": "Collections et mécanisme de gestion des erreurs dans Swift",
    "de": "Sammlungen und Fehlerbehandlungsmechanismus in Swift",
    "es": "Mecanismo de manejo de errores y colecciones en Swift"
  },
  "swift-syntax-foundation-data-types": {
    "vi": "Nền tảng cú pháp Swift & Kiểu dữ liệu",
    "en": "Swift Syntax Foundation & Data Types",
    "ja": "Swift 構文の基礎とデータ型",
    "ko": "Swift 구문 기초 및 데이터 유형",
    "zh": "Swift 语法基础和数据类型",
    "fr": "Fondation de syntaxe Swift et types de données",
    "de": "Swift Syntax Foundation & Datentypen",
    "es": "Bases de sintaxis rápida y tipos de datos"
  },
  "advanced-swiftui-swiftdata-data-management": {
    "vi": "SwiftUI nâng cao & Quản lý dữ liệu SwiftData",
    "en": "Advanced SwiftUI & SwiftData Data Management",
    "ja": "高度な SwiftUI および SwiftData データ管理",
    "ko": "고급 SwiftUI 및 SwiftData 데이터 관리",
    "zh": "高级 SwiftUI 和 SwiftData 数据管理",
    "fr": "Gestion avancée des données SwiftUI et SwiftData",
    "de": "Erweiterte SwiftUI- und SwiftData-Datenverwaltung",
    "es": "Gestión avanzada de datos SwiftUI y SwiftData"
  },
  "persistent-data-storage-with-swiftdata-core-data": {
    "vi": "Lưu trữ dữ liệu bền vững với SwiftData & Core Data",
    "en": "Persistent data storage with SwiftData & Core Data",
    "ja": "SwiftData と Core Data による永続的なデータ ストレージ",
    "ko": "SwiftData 및 Core Data를 사용한 영구 데이터 저장",
    "zh": "使用 SwiftData 和 Core Data 进行持久数据存储",
    "fr": "Stockage de données persistant avec SwiftData & Core Data",
    "de": "Permanente Datenspeicherung mit SwiftData & Core Data",
    "es": "Almacenamiento de datos persistente con SwiftData y Core Data"
  },
  "application-architecture-mvvm-navigation-model": {
    "vi": "Kiến trúc ứng dụng: Mô hình MVVM & Navigation",
    "en": "Application Architecture: MVVM & Navigation Model",
    "ja": "アプリケーション アーキテクチャ: MVVM とナビゲーション モデル",
    "ko": "애플리케이션 아키텍처: MVVM 및 탐색 모델",
    "zh": "应用架构：MVVM 和导航模型",
    "fr": "Architecture d'application : MVVM et modèle de navigation",
    "de": "Anwendungsarchitektur: MVVM und Navigationsmodell",
    "es": "Arquitectura de aplicaciones: MVVM y modelo de navegación"
  },
  "packaging-frameworks-ci-cd-xcode-cloud-tca-architecture": {
    "vi": "Đóng gói Frameworks, CI/CD Xcode Cloud & Kiến trúc TCA",
    "en": "Packaging Frameworks, CI/CD Xcode Cloud & TCA Architecture",
    "ja": "パッケージング フレームワーク、CI/CD Xcode クラウド、TCA アーキテクチャ",
    "ko": "패키징 프레임워크, CI/CD Xcode 클라우드 및 TCA 아키텍처",
    "zh": "打包框架、CI/CD Xcode Cloud 和 TCA 架构",
    "fr": "Cadres d'empaquetage, architecture CI/CD Xcode Cloud et TCA",
    "de": "Verpackungs-Frameworks, CI/CD Xcode Cloud und TCA-Architektur",
    "es": "Marcos de empaquetado, CI/CD Xcode Cloud y arquitectura TCA"
  },
  "ios-performance-optimization-xctest-testing": {
    "vi": "Tối ưu hiệu năng iOS & Kiểm thử XCTest",
    "en": "iOS Performance Optimization & XCTest Testing",
    "ja": "iOS パフォーマンスの最適化と XCTest テスト",
    "ko": "iOS 성능 최적화 및 XCTest 테스트",
    "zh": "iOS 性能优化和 XCTest 测试",
    "fr": "Optimisation des performances iOS et tests XCTest",
    "de": "iOS-Leistungsoptimierung und XCTest-Tests",
    "es": "Optimización del rendimiento de iOS y pruebas XCTest"
  },
  "programming-the-swiftui-concurrency-interface": {
    "vi": "Lập trình giao diện SwiftUI & Concurrency",
    "en": "Programming the SwiftUI & Concurrency interface",
    "ja": "SwiftUI と同時実行インターフェイスのプログラミング",
    "ko": "SwiftUI 및 동시성 인터페이스 프로그래밍",
    "zh": "SwiftUI 和并发接口编程",
    "fr": "Programmation de l'interface SwiftUI & Concurrency",
    "de": "Programmierung der SwiftUI- und Concurrency-Schnittstelle",
    "es": "Programación de la interfaz SwiftUI y concurrencia"
  },
  "swiftui-declarative-interface-platform": {
    "vi": "Nền tảng giao diện khai báo SwiftUI",
    "en": "SwiftUI declarative interface platform",
    "ja": "SwiftUI 宣言型インターフェイス プラットフォーム",
    "ko": "SwiftUI 선언적 인터페이스 플랫폼",
    "zh": "SwiftUI 声明式接口平台",
    "fr": "Plateforme d'interface déclarative SwiftUI",
    "de": "Deklarative Schnittstellenplattform SwiftUI",
    "es": "Plataforma de interfaz declarativa SwiftUI"
  },
  "in-depth-ios-architecture-tca-system": {
    "vi": "Kiến trúc iOS chuyên sâu & Hệ thống TCA",
    "en": "In-depth iOS Architecture & TCA System",
    "ja": "詳細な iOS アーキテクチャと TCA システム",
    "ko": "심층적인 iOS 아키텍처 및 TCA 시스템",
    "zh": "深入的iOS架构和TCA系统",
    "fr": "Architecture iOS approfondie et système TCA",
    "de": "Ausführliche iOS-Architektur und TCA-System",
    "es": "Arquitectura iOS en profundidad y sistema TCA"
  },
  "ruby-syntax-language-philosophy": {
    "vi": "Cú pháp Ruby & Triết lý ngôn ngữ",
    "en": "Ruby Syntax & Language Philosophy",
    "ja": "Ruby の構文と言語の哲学",
    "ko": "Ruby 구문 및 언어 철학",
    "zh": "Ruby 语法和语言哲学",
    "fr": "Syntaxe Ruby et philosophie du langage",
    "de": "Ruby-Syntax und Sprachphilosophie",
    "es": "Sintaxis de Ruby y filosofía del lenguaje"
  },
  "oop-classes-sealed-classes-extensions": {
    "vi": "OOP: Lớp, Sealed Classes & Hàm mở rộng Extensions",
    "en": "OOP: Classes, Sealed Classes & Extensions",
    "ja": "OOP: クラス、Sealed クラス、拡張機能",
    "ko": "OOP: 클래스, 봉인 클래스 및 확장",
    "zh": "OOP：类、密封类和扩展",
    "fr": "POO : classes, classes scellées et extensions",
    "de": "OOP: Klassen, versiegelte Klassen und Erweiterungen",
    "es": "POO: clases, clases selladas y extensiones"
  },
  "coroutines-stream-processing-jetpack-compose": {
    "vi": "Coroutines, Xử lý luồng & Jetpack Compose",
    "en": "Coroutines, Stream Processing & Jetpack Compose",
    "ja": "コルーチン、ストリーム処理、Jetpack Compose",
    "ko": "코루틴, 스트림 처리, Jetpack Compose",
    "zh": "协程、流处理和 Jetpack Compose",
    "fr": "Coroutines, traitement de flux et Jetpack Compose",
    "de": "Coroutinen, Stream-Verarbeitung und Jetpack Compose",
    "es": "Corrutinas, procesamiento de flujos y redacción de Jetpack"
  },
  "design-a-modern-interface-with-jetpack-compose": {
    "vi": "Thiết kế giao diện hiện đại với Jetpack Compose",
    "en": "Design a modern interface with Jetpack Compose",
    "ja": "Jetpack Compose を使用して最新のインターフェイスを設計する",
    "ko": "Jetpack Compose로 현대적인 인터페이스 디자인",
    "zh": "使用 Jetpack Compose 设计现代界面",
    "fr": "Concevoir une interface moderne avec Jetpack Compose",
    "de": "Entwerfen Sie eine moderne Benutzeroberfläche mit Jetpack Compose",
    "es": "Diseña una interfaz moderna con Jetpack Compose"
  },
  "kotlin-platform-null-safety-mechanism": {
    "vi": "Nền tảng Kotlin & Cơ chế Null Safety",
    "en": "Kotlin Platform & Null Safety Mechanism",
    "ja": "Kotlin プラットフォームと Null 安全メカニズム",
    "ko": "Kotlin 플랫폼 및 Null 안전 메커니즘",
    "zh": "Kotlin 平台 & Null 安全机制",
    "fr": "Plateforme Kotlin et mécanisme de sécurité nul",
    "de": "Kotlin-Plattform und Null-Sicherheitsmechanismus",
    "es": "Plataforma Kotlin y mecanismo de seguridad nulo"
  },
  "kotlin-coroutines-multithreaded-asynchronous-processing": {
    "vi": "Kotlin Coroutines & Xử lý bất đồng bộ đa luồng",
    "en": "Kotlin Coroutines & Multithreaded Asynchronous Processing",
    "ja": "Kotlin コルーチンとマルチスレッド非同期処理",
    "ko": "Kotlin 코루틴 및 멀티스레드 비동기 처리",
    "zh": "Kotlin 协程和多线程异步处理",
    "fr": "Coroutines Kotlin et traitement asynchrone multithread",
    "de": "Kotlin-Coroutinen und asynchrone Multithread-Verarbeitung",
    "es": "Corrutinas de Kotlin y procesamiento asincrónico multiproceso"
  },
  "oop-in-dart-classes-mixins-generics": {
    "vi": "OOP trong Dart: Classes, Mixins & Generics",
    "en": "OOP in Dart: Classes, Mixins & Generics",
    "ja": "Dart の OOP: クラス、ミックスイン、ジェネリック",
    "ko": "Dart의 OOP: 클래스, 믹스인, 제네릭",
    "zh": "Dart 中的 OOP：类、混合和泛型",
    "fr": "POO dans Dart : classes, mixins et génériques",
    "de": "OOP in Dart: Klassen, Mixins und Generics",
    "es": "Programación orientada a objetos en Dart: clases, mixins y genéricos"
  },
  "dart-language-platform-data-types": {
    "vi": "Nền tảng ngôn ngữ Dart & Kiểu dữ liệu",
    "en": "Dart Language Platform & Data Types",
    "ja": "Dart 言語プラットフォームとデータ型",
    "ko": "Dart 언어 플랫폼 및 데이터 유형",
    "zh": "Dart 语言平台和数据类型",
    "fr": "Plateforme du langage Dart et types de données",
    "de": "Dart-Sprachplattform und Datentypen",
    "es": "Plataforma de lenguaje Dart y tipos de datos"
  },
  "basic-dart": {
    "vi": "Dart cơ bản",
    "en": "Basic Dart",
    "ja": "ベーシックダーツ",
    "ko": "기본 다트",
    "zh": "基本飞镖",
    "fr": "Fléchette de base",
    "de": "Grundlegender Dart",
    "es": "Dardo Básico"
  },
  "flutter-app-architecture-backend-api-connectivity": {
    "vi": "Kiến trúc ứng dụng Flutter & Kết nối API Backend",
    "en": "Flutter App Architecture & Backend API Connectivity",
    "ja": "Flutter アプリのアーキテクチャとバックエンド API の接続",
    "ko": "Flutter 앱 아키텍처 및 백엔드 API 연결",
    "zh": "Flutter 应用程序架构和后端 API 连接",
    "fr": "Architecture de l'application Flutter et connectivité API backend",
    "de": "Flutter-App-Architektur und Backend-API-Konnektivität",
    "es": "Arquitectura de la aplicación Flutter y conectividad API backend"
  },
  "optimize-flutter-performance-native-platform-interaction": {
    "vi": "Tối ưu hiệu năng Flutter & Tương tác Native Platform",
    "en": "Optimize Flutter performance & Native Platform interaction",
    "ja": "Flutter パフォーマンスとネイティブ プラットフォーム インタラクションを最適化する",
    "ko": "Flutter 성능 및 기본 플랫폼 상호 작용 최적화",
    "zh": "优化 Flutter 性能和原生平台交互",
    "fr": "Optimiser les performances de Flutter et l'interaction avec la plateforme native",
    "de": "Optimieren Sie die Flutter-Leistung und die Interaktion mit der nativen Plattform",
    "es": "Optimice el rendimiento de Flutter y la interacción con la plataforma nativa"
  },
  "screen-navigation-routing-routing": {
    "vi": "Điều hướng & Định tuyến màn hình (Routing)",
    "en": "Screen Navigation & Routing (Routing)",
    "ja": "画面のナビゲーションとルーティング (ルーティング)",
    "ko": "화면 탐색 및 라우팅(Routing)",
    "zh": "屏幕导航和路由（路由）",
    "fr": "Navigation à l'écran et routage (Routage)",
    "de": "Bildschirmnavigation und Routing (Routing)",
    "es": "Navegación en pantalla y enrutamiento (enrutamiento)"
  },
  "basics-of-bash-shell-script-programming": {
    "vi": "Cơ bản về lập trình kịch bản Bash Shell",
    "en": "Basics of Bash Shell script programming",
    "ja": "Bash Shell スクリプト プログラミングの基本",
    "ko": "Bash 쉘 스크립트 프로그래밍의 기본",
    "zh": "Bash Shell 脚本编程基础知识",
    "fr": "Bases de la programmation de scripts Bash Shell",
    "de": "Grundlagen der Bash-Shell-Skriptprogrammierung",
    "es": "Conceptos básicos de la programación de scripts de Bash Shell"
  },
  "advanced-bash-arrays-traps-networks": {
    "vi": "Bash nâng cao: Mảng, Bắt tín hiệu Traps & Mạng",
    "en": "Advanced Bash: Arrays, Traps & Networks",
    "ja": "高度な Bash: 配列、トラップ、ネットワーク",
    "ko": "고급 Bash: 배열, 트랩 및 네트워크",
    "zh": "高级 Bash：数组、陷阱和网络",
    "fr": "Bash avancé : tableaux, pièges et réseaux",
    "de": "Advanced Bash: Arrays, Traps und Netzwerke",
    "es": "Bash avanzado: matrices, trampas y redes"
  },
  "system-task-automation-devops": {
    "vi": "Tự động hóa tác vụ hệ thống & DevOps",
    "en": "System Task Automation & DevOps",
    "ja": "システムタスクの自動化とDevOps",
    "ko": "시스템 작업 자동화 및 DevOps",
    "zh": "系统任务自动化和 DevOps",
    "fr": "Automatisation des tâches système et DevOps",
    "de": "Automatisierung von Systemaufgaben und DevOps",
    "es": "Automatización de tareas del sistema y DevOps"
  },
  "advanced-bash-script-programming": {
    "vi": "Lập trình Bash Script nâng cao",
    "en": "Advanced Bash Script programming",
    "ja": "高度な Bash スクリプト プログラミング",
    "ko": "고급 Bash 스크립트 프로그래밍",
    "zh": "高级 Bash 脚本编程",
    "fr": "Programmation avancée de scripts Bash",
    "de": "Erweiterte Bash-Skript-Programmierung",
    "es": "Programación avanzada de scripts Bash"
  },
  "secure-shell-script-optimize-execution-performance": {
    "vi": "Bảo mật Shell Script & Tối ưu hiệu năng thực thi",
    "en": "Secure Shell Script & Optimize Execution Performance",
    "ja": "セキュア シェル スクリプトと実行パフォーマンスの最適化",
    "ko": "보안 쉘 스크립트 및 실행 성능 최적화",
    "zh": "保护 Shell 脚本并优化执行性能",
    "fr": "Sécurisez le script Shell et optimisez les performances d'exécution",
    "de": "Sicheres Shell-Skript und Optimierung der Ausführungsleistung",
    "es": "Proteja el script de Shell y optimice el rendimiento de ejecución"
  },
  "advanced-flutter-architecture-patterns-app-deployment": {
    "vi": "Mẫu kiến trúc Flutter nâng cao & Triển khai ứng dụng",
    "en": "Advanced Flutter Architecture Patterns & App Deployment",
    "ja": "高度な Flutter アーキテクチャ パターンとアプリのデプロイメント",
    "ko": "고급 Flutter 아키텍처 패턴 및 앱 배포",
    "zh": "高级 Flutter 架构模式和应用程序部署",
    "fr": "Modèles d'architecture Flutter avancés et déploiement d'applications",
    "de": "Erweiterte Flutter-Architekturmuster und App-Bereitstellung",
    "es": "Patrones avanzados de arquitectura Flutter e implementación de aplicaciones"
  },
  "big-o-phan-tich-do-phuc-tap-thuat-toan": {
    "vi": "Big O & Phân Tích Độ Phức Tạp Thuật Toán",
    "en": "Big O & Algorithmic Complexity Analysis",
    "ja": "Big O とアルゴリズムの複雑さの分析",
    "ko": "Big O 및 알고리즘 복잡성 분석",
    "zh": "Big O 与算法复杂度分析",
    "fr": "Big O et analyse de complexité algorithmique",
    "de": "Big O und algorithmische Komplexitätsanalyse",
    "es": "Big O y análisis de complejidad algorítmica"
  },
  "big-o-algorithmic-complexity-analysis": {
    "vi": "Big O & Phân Tích Độ Phức Tạp Thuật Toán",
    "en": "Big O & Algorithmic Complexity Analysis",
    "ja": "Big O とアルゴリズムの複雑さの分析",
    "ko": "Big O 및 알고리즘 복잡성 분석",
    "zh": "Big O 与算法复杂度分析",
    "fr": "Big O et analyse de complexité algorithmique",
    "de": "Big O und algorithmische Komplexitätsanalyse",
    "es": "Big O y análisis de complejidad algorítmica"
  },
  "ky-thuat-xu-ly-mang-chuoi-arrays-strings": {
    "vi": "Kỹ Thuật Xử Lý Mảng & Chuỗi (Arrays & Strings)",
    "en": "Arrays & Strings Processing Techniques (Arrays & Strings)",
    "ja": "配列と文字列の処理テクニック (配列と文字列)",
    "ko": "배열 및 문자열 처리 기술(배열 및 문자열)",
    "zh": "数组和字符串处理技术（Arrays & Strings）",
    "fr": "Techniques de traitement des tableaux et des chaînes (tableaux et chaînes)",
    "de": "Verarbeitungstechniken für Arrays und Strings (Arrays und Strings)",
    "es": "Técnicas de procesamiento de matrices y cadenas (arrays y cadenas)"
  },
  "arrays-strings-processing-techniques-arrays-strings": {
    "vi": "Kỹ Thuật Xử Lý Mảng & Chuỗi (Arrays & Strings)",
    "en": "Arrays & Strings Processing Techniques (Arrays & Strings)",
    "ja": "配列と文字列の処理テクニック (配列と文字列)",
    "ko": "배열 및 문자열 처리 기술(배열 및 문자열)",
    "zh": "数组和字符串处理技术（Arrays & Strings）",
    "fr": "Techniques de traitement des tableaux et des chaînes (tableaux et chaînes)",
    "de": "Verarbeitungstechniken für Arrays und Strings (Arrays und Strings)",
    "es": "Técnicas de procesamiento de matrices y cadenas (arrays y cadenas)"
  },
  "write-automation-scripts-schedule-with-cron-job": {
    "vi": "Viết kịch bản tự động hóa & Lập lịch với Cron Job",
    "en": "Write automation scripts & Schedule with Cron Job",
    "ja": "自動化スクリプトを作成し、Cron ジョブでスケジュールを設定する",
    "ko": "Cron Job으로 자동화 스크립트 작성 및 예약",
    "zh": "使用 Cron Job 编写自动化脚本和计划",
    "fr": "Écrivez des scripts d'automatisation et planifiez avec Cron Job",
    "de": "Schreiben Sie Automatisierungsskripte und planen Sie mit Cron Job",
    "es": "Escriba scripts de automatización y programe con Cron Job"
  },
  "basic-terminal": {
    "vi": "Terminal cơ bản",
    "en": "Basic terminal",
    "ja": "基本端末",
    "ko": "기본단말기",
    "zh": "基本终端",
    "fr": "Borne de base",
    "de": "Basisterminal",
    "es": "terminal básica"
  },
  "do-thi-quy-hoach-dong": {
    "vi": "Đồ thị & Quy hoạch động",
    "en": "Graphs & Dynamic Planning",
    "ja": "グラフと動的計画",
    "ko": "그래프 및 동적 계획",
    "zh": "图表与动态规划",
    "fr": "Graphiques et planification dynamique",
    "de": "Diagramme und dynamische Planung",
    "es": "Gráficos y planificación dinámica"
  },
  "graphs-dynamic-planning": {
    "vi": "Đồ thị & Quy hoạch động",
    "en": "Graphs & Dynamic Planning",
    "ja": "グラフと動的計画",
    "ko": "그래프 및 동적 계획",
    "zh": "图表与动态规划",
    "fr": "Graphiques et planification dynamique",
    "de": "Diagramme und dynamische Planung",
    "es": "Gráficos y planificación dinámica"
  },
  "danh-sach-lien-ket-ngan-xep-hang-doi-linked-list-stack-queue": {
    "vi": "Danh Sách Liên Kết, Ngăn Xếp & Hàng Đợi (Linked List, Stack, Queue)",
    "en": "Linked List, Stack, Queue",
    "ja": "リンクリスト、スタック、キュー",
    "ko": "연결리스트, 스택, 큐",
    "zh": "链表、栈、队列",
    "fr": "Liste chaînée, pile, file d'attente",
    "de": "Verknüpfte Liste, Stapel, Warteschlange",
    "es": "Lista enlazada, pila, cola"
  },
  "quy-hoach-dong-dynamic-programming-1d-2d-dp": {
    "vi": "Quy Hoạch Động (Dynamic Programming: 1D & 2D DP)",
    "en": "Dynamic Programming: 1D & 2D DP",
    "ja": "動的プログラミング: 1D および 2D DP",
    "ko": "동적 프로그래밍: 1D 및 2D DP",
    "zh": "动态规划：一维和二维动态规划",
    "fr": "Programmation dynamique : DP 1D et 2D",
    "de": "Dynamische Programmierung: 1D- und 2D-DP",
    "es": "Programación dinámica: DP 1D y 2D"
  },
  "dynamic-programming-1d-2d-dp": {
    "vi": "Quy Hoạch Động (Dynamic Programming: 1D & 2D DP)",
    "en": "Dynamic Programming: 1D & 2D DP",
    "ja": "動的プログラミング: 1D および 2D DP",
    "ko": "동적 프로그래밍: 1D 및 2D DP",
    "zh": "动态规划：一维和二维动态规划",
    "fr": "Programmation dynamique : DP 1D et 2D",
    "de": "Dynamische Programmierung: 1D- und 2D-DP",
    "es": "Programación dinámica: DP 1D y 2D"
  },
  "zig-overview-environment-settings": {
    "vi": "Tổng quan Zig & Cài đặt môi trường",
    "en": "Zig Overview & Environment Settings",
    "ja": "Zig の概要と環境設定",
    "ko": "Zig 개요 및 환경 설정",
    "zh": "Zig 概述和环境设置",
    "fr": "Présentation de Zig et paramètres d'environnement",
    "de": "Zig-Übersicht und Umgebungseinstellungen",
    "es": "Descripción general de Zig y configuración del entorno"
  },
  "14-mau-tu-duy-giai-thuat-phong-van-coding-interview-patterns": {
    "vi": "14 Mẫu Tư Duy Giải Thuật Phỏng Vấn (Coding Interview Patterns)",
    "en": "14 Coding Interview Patterns",
    "ja": "14 のコーディング面接パターン",
    "ko": "14가지 코딩 인터뷰 패턴",
    "zh": "14 种面试编程模式",
    "fr": "14 Modèles d’entretien de codage",
    "de": "14 Interviewmuster kodieren",
    "es": "14 patrones de entrevistas de codificación"
  },
  "14-coding-interview-patterns": {
    "vi": "14 Mẫu Tư Duy Giải Thuật Phỏng Vấn (Coding Interview Patterns)",
    "en": "14 Coding Interview Patterns",
    "ja": "14 のコーディング面接パターン",
    "ko": "14가지 코딩 인터뷰 패턴",
    "zh": "14 种面试编程模式",
    "fr": "14 Modèles d’entretien de codage",
    "de": "14 Interviewmuster kodieren",
    "es": "14 patrones de entrevistas de codificación"
  },
  "variables-data-types-in-zig": {
    "vi": "Biến & Kiểu dữ liệu trong Zig",
    "en": "Variables & Data Types in Zig",
    "ja": "Zig の変数とデータ型",
    "ko": "Zig의 변수 및 데이터 유형",
    "zh": "Zig 中的变量和数据类型",
    "fr": "Variables et types de données dans Zig",
    "de": "Variablen und Datentypen in Zig",
    "es": "Variables y tipos de datos en Zig"
  },
  "chien-thuat-phong-van-big-tech": {
    "vi": "Chiến thuật phỏng vấn Big Tech",
    "en": "Big Tech interview strategies",
    "ja": "ビッグテックの面接戦略",
    "ko": "Big Tech 면접 전략",
    "zh": "大型科技面试策略",
    "fr": "Stratégies d'entretien Big Tech",
    "de": "Interviewstrategien für Big Tech",
    "es": "Estrategias de entrevista de Big Tech"
  },
  "big-tech-interview-strategies": {
    "vi": "Chiến thuật phỏng vấn Big Tech",
    "en": "Big Tech interview strategies",
    "ja": "ビッグテックの面接戦略",
    "ko": "Big Tech 면접 전략",
    "zh": "大型科技面试策略",
    "fr": "Stratégies d'entretien Big Tech",
    "de": "Interviewstrategien für Big Tech",
    "es": "Estrategias de entrevista de Big Tech"
  },
  "de-quy-thuat-toan-quay-lui-recursion-backtracking": {
    "vi": "Đệ Quy & Thuật Toán Quay Lui (Recursion & Backtracking)",
    "en": "Recursion & Backtracking",
    "ja": "再帰とバックトラッキング",
    "ko": "재귀 및 역추적",
    "zh": "递归与回溯",
    "fr": "Récursion et retour en arrière",
    "de": "Rekursion und Backtracking",
    "es": "Recursión y retroceso"
  },
  "cay-nhi-phan-cay-tim-kiem-nhi-phan-binary-tree-bst": {
    "vi": "Cây Nhị Phân & Cây Tìm Kiếm Nhị Phân (Binary Tree & BST)",
    "en": "Binary Tree & Binary Search Tree (Binary Tree & BST)",
    "ja": "二分木＆二分探索木（二分木＆BST）",
    "ko": "이진 트리 및 이진 검색 트리(이진 트리 및 BST)",
    "zh": "二叉树和二叉搜索树（二叉树和BST）",
    "fr": "Arbre binaire et arbre de recherche binaire (arbre binaire et BST)",
    "de": "Binärbaum und binärer Suchbaum (Binärbaum und BST)",
    "es": "Árbol binario y árbol de búsqueda binaria (árbol binario y BST)"
  },
  "binary-tree-binary-search-tree-binary-tree-bst": {
    "vi": "Cây Nhị Phân & Cây Tìm Kiếm Nhị Phân (Binary Tree & BST)",
    "en": "Binary Tree & Binary Search Tree (Binary Tree & BST)",
    "ja": "二分木＆二分探索木（二分木＆BST）",
    "ko": "이진 트리 및 이진 검색 트리(이진 트리 및 BST)",
    "zh": "二叉树和二叉搜索树（二叉树和BST）",
    "fr": "Arbre binaire et arbre de recherche binaire (arbre binaire et BST)",
    "de": "Binärbaum und binärer Suchbaum (Binärbaum und BST)",
    "es": "Árbol binario y árbol de búsqueda binaria (árbol binario y BST)"
  },
  "basic-syntax-zig-foundation": {
    "vi": "Cú pháp cơ bản & Nền tảng Zig",
    "en": "Basic Syntax & Zig Foundation",
    "ja": "基本的な構文と Zig の基礎",
    "ko": "기본 구문 및 Zig 기초",
    "zh": "基本语法和 Zig 基础",
    "fr": "Syntaxe de base et fondation Zig",
    "de": "Grundlegende Syntax und Zig Foundation",
    "es": "Sintaxis básica y fundamentos de Zig"
  },
  "thuat-toan-cau-truc-nang-cao": {
    "vi": "Thuật toán & Cấu trúc nâng cao",
    "en": "Advanced Algorithms & Structures",
    "ja": "高度なアルゴリズムと構造",
    "ko": "고급 알고리즘 및 구조",
    "zh": "先进的算法和结构",
    "fr": "Algorithmes et structures avancés",
    "de": "Erweiterte Algorithmen und Strukturen",
    "es": "Algoritmos y estructuras avanzados"
  },
  "advanced-algorithms-structures": {
    "vi": "Thuật toán & Cấu trúc nâng cao",
    "en": "Advanced Algorithms & Structures",
    "ja": "高度なアルゴリズムと構造",
    "ko": "고급 알고리즘 및 구조",
    "zh": "先进的算法和结构",
    "fr": "Algorithmes et structures avancés",
    "de": "Erweiterte Algorithmen und Strukturen",
    "es": "Algoritmos y estructuras avanzados"
  },
  "structures-memory-management-slices": {
    "vi": "Structs, Quản lý bộ nhớ & Slices",
    "en": "Structures, Memory Management & Slices",
    "ja": "構造、メモリ管理、スライス",
    "ko": "구조, 메모리 관리 및 슬라이스",
    "zh": "结构、内存管理和切片",
    "fr": "Structures, gestion de la mémoire et tranches",
    "de": "Strukturen, Speicherverwaltung und Slices",
    "es": "Estructuras, gestión de memoria y cortes"
  },
  "thuat-toan-do-thi-graph-algorithms-bfs-dfs-topo-sort": {
    "vi": "Thuật Toán Đồ Thị (Graph Algorithms: BFS, DFS, Topo Sort)",
    "en": "Graph Algorithms: BFS, DFS, Topo Sort",
    "ja": "グラフアルゴリズム: BFS、DFS、Topo Sort",
    "ko": "그래프 알고리즘: BFS, DFS, Topo 정렬",
    "zh": "图算法：BFS、DFS、拓扑排序",
    "fr": "Algorithmes graphiques : BFS, DFS, Topo Sort",
    "de": "Graphalgorithmen: BFS, DFS, Topo Sort",
    "es": "Algoritmos de gráficos: BFS, DFS, clasificación topográfica"
  },
  "graph-algorithms-bfs-dfs-topo-sort": {
    "vi": "Thuật Toán Đồ Thị (Graph Algorithms: BFS, DFS, Topo Sort)",
    "en": "Graph Algorithms: BFS, DFS, Topo Sort",
    "ja": "グラフアルゴリズム: BFS、DFS、Topo Sort",
    "ko": "그래프 알고리즘: BFS, DFS, Topo 정렬",
    "zh": "图算法：BFS、DFS、拓扑排序",
    "fr": "Algorithmes graphiques : BFS, DFS, Topo Sort",
    "de": "Graphalgorithmen: BFS, DFS, Topo Sort",
    "es": "Algoritmos de gráficos: BFS, DFS, clasificación topográfica"
  },
  "structures-methods": {
    "vi": "Cấu trúc Structs & Phương thức",
    "en": "Structures & Methods",
    "ja": "構造と方法",
    "ko": "구조 및 방법",
    "zh": "结构与方法",
    "fr": "Structures et méthodes",
    "de": "Strukturen & Methoden",
    "es": "Estructuras y métodos"
  },
  "bang-bam-tap-hop-hash-maps-hash-sets": {
    "vi": "Bảng Băm & Tập Hợp (Hash Maps & Hash Sets)",
    "en": "Hash Maps & Hash Sets",
    "ja": "ハッシュマップとハッシュセット",
    "ko": "해시 맵 및 해시 세트",
    "zh": "哈希图和哈希集",
    "fr": "Cartes de hachage et ensembles de hachage",
    "de": "Hash-Maps und Hash-Sets",
    "es": "Mapas hash y conjuntos hash"
  },
  "hash-maps-hash-sets": {
    "vi": "Bảng Băm & Tập Hợp (Hash Maps & Hash Sets)",
    "en": "Hash Maps & Hash Sets",
    "ja": "ハッシュマップとハッシュセット",
    "ko": "해시 맵 및 해시 세트",
    "zh": "哈希图和哈希集",
    "fr": "Cartes de hachage et ensembles de hachage",
    "de": "Hash-Maps und Hash-Sets",
    "es": "Mapas hash y conjuntos hash"
  },
  "cay-nhi-phan-bang-bam": {
    "vi": "Cây nhị phân & Bảng băm",
    "en": "Binary Tree & Hash Table",
    "ja": "バイナリ ツリーとハッシュ テーブル",
    "ko": "이진 트리 및 해시 테이블",
    "zh": "二叉树和哈希表",
    "fr": "Arbre binaire et table de hachage",
    "de": "Binärbaum und Hash-Tabelle",
    "es": "Árbol binario y tabla hash"
  },
  "binary-tree-hash-table": {
    "vi": "Cây nhị phân & Bảng băm",
    "en": "Binary Tree & Hash Table",
    "ja": "バイナリ ツリーとハッシュ テーブル",
    "ko": "이진 트리 및 해시 테이블",
    "zh": "二叉树和哈希表",
    "fr": "Arbre binaire et table de hachage",
    "de": "Binärbaum und Hash-Tabelle",
    "es": "Árbol binario y tabla hash"
  },
  "operating-system-level-programming-embedded": {
    "vi": "Lập trình cấp hệ điều hành & Nhúng",
    "en": "Operating System Level Programming & Embedded",
    "ja": "オペレーティング システム レベルのプログラミングと組み込み",
    "ko": "운영 체제 수준 프로그래밍 및 임베디드",
    "zh": "操作系统级编程和嵌入式",
    "fr": "Programmation au niveau du système d'exploitation et embarqué",
    "de": "Programmierung und Einbettung auf Betriebssystemebene",
    "es": "Programación a nivel de sistema operativo e integrado"
  },
  "operating-system-level-programming-syscalls": {
    "vi": "Lập trình cấp hệ điều hành & Syscalls",
    "en": "Operating System Level Programming & Syscalls",
    "ja": "オペレーティング システム レベルのプログラミングとシステムコール",
    "ko": "운영 체제 수준 프로그래밍 및 Syscall",
    "zh": "操作系统级编程和系统调用",
    "fr": "Programmation au niveau du système d'exploitation et appels système",
    "de": "Programmierung und Systemaufrufe auf Betriebssystemebene",
    "es": "Programación a nivel de sistema operativo y llamadas al sistema"
  },
  "defi-protocol-staking-liquidity-pool": {
    "vi": "Giao thức DeFi, Staking & Liquidity Pool",
    "en": "DeFi Protocol, Staking & Liquidity Pool",
    "ja": "DeFiプロトコル、ステーキング、流動性プール",
    "ko": "DeFi 프로토콜, 스테이킹 및 유동성 풀",
    "zh": "DeFi 协议、质押和流动性池",
    "fr": "Protocole DeFi, jalonnement et pool de liquidité",
    "de": "DeFi-Protokoll, Einsatz- und Liquiditätspool",
    "es": "Protocolo DeFi, participación y fondo de liquidez"
  },
  "cross-compilation-build-system": {
    "vi": "Hệ thống Build & Biên dịch chéo (Cross-Compilation)",
    "en": "Cross-Compilation & Build System",
    "ja": "クロスコンパイルとビルドシステム",
    "ko": "크로스 컴파일 및 빌드 시스템",
    "zh": "交叉编译和构建系统",
    "fr": "Compilation croisée et système de construction",
    "de": "Cross-Compilation & Build-System",
    "es": "Sistema de compilación y compilación cruzada"
  },
  "asynchronous-i-o-network-programming": {
    "vi": "I/O Bất đồng bộ & Lập trình Mạng",
    "en": "Asynchronous I/O & Network Programming",
    "ja": "非同期 I/O およびネットワーク プログラミング",
    "ko": "비동기 I/O 및 네트워크 프로그래밍",
    "zh": "异步 I/O 和网络编程",
    "fr": "E/S asynchrones et programmation réseau",
    "de": "Asynchrone I/O- und Netzwerkprogrammierung",
    "es": "E/S asíncronas y programación de red"
  },
  "build-cross-compile-system": {
    "vi": "Hệ thống Build & Biên dịch chéo",
    "en": "Build & Cross Compile System",
    "ja": "ビルド&クロスコンパイルシステム",
    "ko": "빌드 및 크로스 컴파일 시스템",
    "zh": "构建和交叉编译系统",
    "fr": "Système de construction et de compilation croisée",
    "de": "Build- und Cross-Compile-System",
    "es": "Sistema de compilación y compilación cruzada"
  },
  "basic-blockchain-smart-contracts": {
    "vi": "Blockchain & Smart Contracts cơ bản",
    "en": "Basic Blockchain & Smart Contracts",
    "ja": "基本的なブロックチェーンとスマートコントラクト",
    "ko": "기본 블록체인 및 스마트 계약",
    "zh": "基础区块链和智能合约",
    "fr": "Blockchain de base et contrats intelligents",
    "de": "Grundlegende Blockchain und Smart Contracts",
    "es": "Blockchain básica y contratos inteligentes"
  },
  "proxy-patterns-contract-upgrade-ability": {
    "vi": "Proxy Patterns & Khả năng nâng cấp hợp đồng",
    "en": "Proxy Patterns & Contract Upgrade Ability",
    "ja": "プロキシ パターンと契約のアップグレード機能",
    "ko": "프록시 패턴 및 계약 업그레이드 능력",
    "zh": "代理模式和合约升级能力",
    "fr": "Modèles de proxy et capacité de mise à niveau du contrat",
    "de": "Proxy-Muster und Möglichkeit zur Vertragsaktualisierung",
    "es": "Patrones de proxy y capacidad de actualización de contratos"
  },
  "blockchain-basic-smart-contracts": {
    "vi": "Blockchain & Hợp đồng thông minh cơ bản",
    "en": "Blockchain & Basic Smart Contracts",
    "ja": "ブロックチェーンと基本的なスマートコントラクト",
    "ko": "블록체인 및 기본 스마트 계약",
    "zh": "区块链和基本智能合约",
    "fr": "Blockchain et contrats intelligents de base",
    "de": "Blockchain und grundlegende Smart Contracts",
    "es": "Blockchain y contratos inteligentes básicos"
  },
  "build-erc-20-standard-token": {
    "vi": "Xây dựng Token chuẩn ERC-20",
    "en": "Build ERC-20 standard Token",
    "ja": "ERC-20標準トークンの構築",
    "ko": "ERC-20 표준 토큰 구축",
    "zh": "构建ERC-20标准Token",
    "fr": "Construire un jeton standard ERC-20",
    "de": "Erstellen Sie ein ERC-20-Standard-Token",
    "es": "Construya un token estándar ERC-20"
  },
  "proxy-design-pattern-contract-upgrade": {
    "vi": "Mẫu thiết kế Proxy & Nâng cấp hợp đồng",
    "en": "Proxy Design Pattern & Contract Upgrade",
    "ja": "プロキシ設計パターンと契約のアップグレード",
    "ko": "프록시 디자인 패턴 및 계약 업그레이드",
    "zh": "代理设计模式&合约升级",
    "fr": "Modèle de conception de proxy et mise à niveau du contrat",
    "de": "Proxy-Entwurfsmuster und Vertrags-Upgrade",
    "es": "Patrón de diseño de proxy y actualización de contrato"
  },
  "direct-interaction-with-c-source-code-ffi": {
    "vi": "Tương tác trực tiếp với mã nguồn C (FFI)",
    "en": "Direct interaction with C source code (FFI)",
    "ja": "C ソース コード (FFI) との直接対話",
    "ko": "C 소스 코드(FFI)와의 직접적인 상호 작용",
    "zh": "与 C 源代码直接交互 (FFI)",
    "fr": "Interaction directe avec le code source C (FFI)",
    "de": "Direkte Interaktion mit C-Quellcode (FFI)",
    "es": "Interacción directa con el código fuente C (FFI)"
  },
  "security-common-vulnerabilities-reentrancy": {
    "vi": "Bảo mật & Các lỗ hổng phổ biến (Reentrancy)",
    "en": "Security & Common Vulnerabilities (Reentrancy)",
    "ja": "セキュリティと一般的な脆弱性 (再入可能)",
    "ko": "보안 및 일반 취약점(재진입)",
    "zh": "安全和常见漏洞（可重入）",
    "fr": "Sécurité et vulnérabilités courantes (réentrance)",
    "de": "Sicherheit und häufige Schwachstellen (Wiedereintritt)",
    "es": "Seguridad y vulnerabilidades comunes (reentrada)"
  },
  "decentralized-finance-defi-protocol": {
    "vi": "Giao thức Tài chính Phi tập trung (DeFi)",
    "en": "Decentralized Finance (DeFi) Protocol",
    "ja": "分散型金融 (DeFi) プロトコル",
    "ko": "탈중앙화 금융(DeFi) 프로토콜",
    "zh": "去中心化金融（DeFi）协议",
    "fr": "Protocole de finance décentralisée (DeFi)",
    "de": "Dezentrales Finanzprotokoll (DeFi).",
    "es": "Protocolo de finanzas descentralizadas (DeFi)"
  },
  "erc-20-standard-contract-security": {
    "vi": "Tiêu chuẩn ERC-20 & Bảo mật hợp đồng",
    "en": "ERC-20 Standard & Contract Security",
    "ja": "ERC-20 標準および契約セキュリティ",
    "ko": "ERC-20 표준 및 계약 보안",
    "zh": "ERC-20标准和合约安全",
    "fr": "Norme ERC-20 et sécurité des contrats",
    "de": "ERC-20 Standard- und Vertragssicherheit",
    "es": "Estándar ERC-20 y seguridad del contrato"
  },
  "events-logs": {
    "vi": "Sự kiện & Ghi nhật ký (Events & Logs)",
    "en": "Events & Logs",
    "ja": "イベントとログ",
    "ko": "이벤트 및 로그",
    "zh": "事件和日志",
    "fr": "Événements et journaux",
    "de": "Ereignisse und Protokolle",
    "es": "Eventos y registros"
  },
  "modularization-library-management-with-luarocks": {
    "vi": "Module hóa & Quản lý thư viện với LuaRocks",
    "en": "Modularization & Library Management with LuaRocks",
    "ja": "LuaRocks によるモジュール化とライブラリ管理",
    "ko": "LuaRocks를 통한 모듈화 및 라이브러리 관리",
    "zh": "使用 LuaRocks 进行模块化和库管理",
    "fr": "Modularisation et gestion de bibliothèque avec LuaRocks",
    "de": "Modularisierung und Bibliotheksverwaltung mit LuaRocks",
    "es": "Modularización y gestión de bibliotecas con LuaRocks"
  },
  "game-loop-roblox-programming-luau": {
    "vi": "Vòng lặp Game Loop & Lập trình Roblox (Luau)",
    "en": "Game Loop & Roblox Programming (Luau)",
    "ja": "ゲームループと Roblox プログラミング (Luau)",
    "ko": "게임 루프 및 Roblox 프로그래밍(Luau)",
    "zh": "游戏循环和 Roblox 编程（Luau）",
    "fr": "Programmation Game Loop et Roblox (Luau)",
    "de": "Game Loop & Roblox-Programmierung (Luau)",
    "es": "Programación de Game Loop y Roblox (Luau)"
  },
  "data-frames-data-table-in-r": {
    "vi": "Bảng dữ liệu Data Frames trong R",
    "en": "Data Frames data table in R",
    "ja": "R のデータ フレーム データ テーブル",
    "ko": "R의 데이터 프레임 데이터 테이블",
    "zh": "R 中的数据帧数据表",
    "fr": "Tableau de données des trames de données dans R",
    "de": "Datentabelle „Datenrahmen“ in R",
    "es": "Tabla de datos de marcos de datos en R"
  },
  "r-language-platform-rstudio-environment": {
    "vi": "Nền tảng ngôn ngữ R & Môi trường RStudio",
    "en": "R Language Platform & RStudio Environment",
    "ja": "R 言語プラットフォームと RStudio 環境",
    "ko": "R 언어 플랫폼 및 RStudio 환경",
    "zh": "R语言平台和RStudio环境",
    "fr": "Plateforme de langage R et environnement RStudio",
    "de": "R-Sprachplattform und RStudio-Umgebung",
    "es": "Plataforma de lenguaje R y entorno RStudio"
  },
  "embed-lua-into-c-c-applications": {
    "vi": "Nhúng Lua vào ứng dụng C/C++",
    "en": "Embed Lua into C/C++ applications",
    "ja": "Lua を C/C++ アプリケーションに埋め込む",
    "ko": "C/C++ 애플리케이션에 Lua 포함",
    "zh": "将 Lua 嵌入到 C/C++ 应用程序中",
    "fr": "Intégrer Lua dans les applications C/C++",
    "de": "Integrieren Sie Lua in C/C++-Anwendungen",
    "es": "Incruste Lua en aplicaciones C/C++"
  },
  "process-data-professionally-with-dplyr-tidyverse": {
    "vi": "Xử lý dữ liệu chuyên nghiệp với dplyr & Tidyverse",
    "en": "Process data professionally with dplyr & Tidyverse",
    "ja": "dplyr と Tidyverse を使用してデータを専門的に処理する",
    "ko": "dplyr 및 Tidyverse를 사용하여 전문적으로 데이터 처리",
    "zh": "使用 dplyr 和 Tidyverse 专业处理数据",
    "fr": "Traitez les données de manière professionnelle avec dplyr & Tidyverse",
    "de": "Verarbeiten Sie Daten professionell mit dplyr & Tidyverse",
    "es": "Procese datos de forma profesional con dplyr y Tidyverse"
  },
  "visualize-graphs-with-base-r-ggplot2": {
    "vi": "Trực quan hóa biểu đồ với Base R & ggplot2",
    "en": "Visualize graphs with Base R & ggplot2",
    "ja": "Base R と ggplot2 でグラフを視覚化する",
    "ko": "Base R 및 ggplot2를 사용하여 그래프 시각화",
    "zh": "使用 Base R 和 ggplot2 可视化图表",
    "fr": "Visualisez des graphiques avec Base R & ggplot2",
    "de": "Visualisieren Sie Diagramme mit Base R und ggplot2",
    "es": "Visualice gráficos con Base R y ggplot2"
  },
  "embed-lua-interpreter-into-c-c-program": {
    "vi": "Nhúng Lua Interpreter vào chương trình C/C++",
    "en": "Embed Lua Interpreter into C/C++ program",
    "ja": "Lua インタプリタを C/C++ プログラムに埋め込む",
    "ko": "C/C++ 프로그램에 Lua 인터프리터 내장",
    "zh": "将Lua解释器嵌入到C/C++程序中",
    "fr": "Intégrer Lua Interpreter dans le programme C/C++",
    "de": "Integrieren Sie den Lua-Interpreter in ein C/C++-Programm",
    "es": "Incrustar Lua Interpreter en el programa C/C++"
  },
  "object-oriented-with-metatables-modules": {
    "vi": "Hướng đối tượng với Metatables & Modules",
    "en": "Object-oriented with Metatables & Modules",
    "ja": "メタテーブルとモジュールを使用したオブジェクト指向",
    "ko": "메타테이블 및 모듈을 사용한 객체 지향",
    "zh": "面向对象的元表和模块",
    "fr": "Orienté objet avec métatables et modules",
    "de": "Objektorientiert mit Metatabellen und Modulen",
    "es": "Orientado a objetos con metatablas y módulos"
  },
  "r-foundation-vector-fundamental-analysis": {
    "vi": "Nền tảng R, Vector & Phân tích cơ bản",
    "en": "R Foundation, Vector & Fundamental Analysis",
    "ja": "R 基礎、ベクトルおよびファンダメンタルズ分析",
    "ko": "R 기초, 벡터 및 기초 분석",
    "zh": "R 基础、向量和基本面分析",
    "fr": "Fondation R, analyse vectorielle et fondamentale",
    "de": "R Foundation, Vektor- und Fundamentalanalyse",
    "es": "Fundación R, análisis vectorial y fundamental"
  },
  "concurrent-programming-with-futures-promises": {
    "vi": "Lập trình đồng thời với Futures & Promises",
    "en": "Concurrent programming with Futures & Promises",
    "ja": "Futures & Promise による同時プログラミング",
    "ko": "Futures & Promise를 사용한 동시 프로그래밍",
    "zh": "使用 Futures & Promise 进行并发编程",
    "fr": "Programmation simultanée avec Futures & Promises",
    "de": "Gleichzeitige Programmierung mit Futures & Promises",
    "es": "Programación concurrente con Futures & Promises"
  },
  "build-interactive-dashboards-with-shiny": {
    "vi": "Xây dựng Dashboard tương tác với Shiny",
    "en": "Build interactive Dashboards with Shiny",
    "ja": "Shiny を使用してインタラクティブなダッシュボードを構築する",
    "ko": "Shiny를 사용하여 대화형 대시보드 구축",
    "zh": "使用 Shiny 构建交互式仪表板",
    "fr": "Créez des tableaux de bord interactifs avec Shiny",
    "de": "Erstellen Sie interaktive Dashboards mit Shiny",
    "es": "Cree paneles interactivos con Shiny"
  },
  "machine-learning-model-with-caret": {
    "vi": "Mô hình Học máy Machine Learning với Caret",
    "en": "Machine Learning Model with Caret",
    "ja": "キャレットを使用した機械学習モデル",
    "ko": "캐럿을 사용한 기계 학습 모델",
    "zh": "带插入符的机器学习模型",
    "fr": "Modèle d'apprentissage automatique avec Caret",
    "de": "Modell für maschinelles Lernen mit Caret",
    "es": "Modelo de aprendizaje automático con Caret"
  },
  "build-an-interactive-web-dashboard-with-r-shiny": {
    "vi": "Xây dựng Web Dashboard tương tác với R Shiny",
    "en": "Build an interactive Web Dashboard with R Shiny",
    "ja": "R Shiny を使用してインタラクティブな Web ダッシュボードを構築する",
    "ko": "R Shiny를 사용하여 대화형 웹 대시보드 구축",
    "zh": "使用 R Shiny 构建交互式 Web 仪表板",
    "fr": "Créez un tableau de bord Web interactif avec R Shiny",
    "de": "Erstellen Sie ein interaktives Web-Dashboard mit R Shiny",
    "es": "Cree un panel web interactivo con R Shiny"
  },
  "powerful-collections-functions-handling": {
    "vi": "Hàm & Xử lý Collections mạnh mẽ",
    "en": "Powerful Collections Functions & Handling",
    "ja": "強力なコレクション機能と処理",
    "ko": "강력한 컬렉션 기능 및 처리",
    "zh": "强大的集合功能和处理",
    "fr": "Fonctions et gestion puissantes des collections",
    "de": "Leistungsstarke Sammlungsfunktionen und -verwaltung",
    "es": "Potentes funciones y manejo de colecciones"
  },
  "machine-learning-machine-learning-in-r": {
    "vi": "Machine Learning & Học máy trong R",
    "en": "Machine Learning & Machine Learning in R",
    "ja": "機械学習と R の機械学習",
    "ko": "R의 기계 학습 및 기계 학습",
    "zh": "机器学习和 R 中的机器学习",
    "fr": "Apprentissage automatique et apprentissage automatique dans R",
    "de": "Maschinelles Lernen und maschinelles Lernen in R",
    "es": "Aprendizaje automático y aprendizaje automático en R"
  },
  "advanced-functional-programming-asynchronous-processing": {
    "vi": "Lập trình Hàm nâng cao & Xử lý Bất đồng bộ",
    "en": "Advanced Functional Programming & Asynchronous Processing",
    "ja": "高度な関数型プログラミングと非同期処理",
    "ko": "고급 함수형 프로그래밍 및 비동기 처리",
    "zh": "高级函数式编程和异步处理",
    "fr": "Programmation fonctionnelle avancée et traitement asynchrone",
    "de": "Erweiterte funktionale Programmierung und asynchrone Verarbeitung",
    "es": "Programación funcional avanzada y procesamiento asincrónico"
  },
  "processing-big-data-with-apache-spark": {
    "vi": "Xử lý Dữ liệu lớn với Apache Spark",
    "en": "Processing Big Data with Apache Spark",
    "ja": "Apache Spark によるビッグデータの処理",
    "ko": "Apache Spark로 빅데이터 처리",
    "zh": "使用 Apache Spark 处理大数据",
    "fr": "Traitement du Big Data avec Apache Spark",
    "de": "Big Data mit Apache Spark verarbeiten",
    "es": "Procesando Big Data con Apache Spark"
  },
  "advanced-functional-programming-option-type": {
    "vi": "Lập trình hàm nâng cao & Kiểu Option",
    "en": "Advanced functional programming & Option type",
    "ja": "高度な関数型プログラミングとオプションタイプ",
    "ko": "고급 함수형 프로그래밍 및 옵션 유형",
    "zh": "高级函数式编程和选项类型",
    "fr": "Programmation fonctionnelle avancée et type d'option",
    "de": "Erweiterte funktionale Programmierung und Optionstyp",
    "es": "Programación funcional avanzada y tipo de opción"
  },
  "angular-data-binding-platform": {
    "vi": "Nền tảng Angular & Data Binding",
    "en": "Angular & Data Binding Platform",
    "ja": "Angular およびデータ バインディング プラットフォーム",
    "ko": "각도 및 데이터 바인딩 플랫폼",
    "zh": "Angular 和数据绑定平台",
    "fr": "Plateforme angulaire et de liaison de données",
    "de": "Angular- und Datenbindungsplattform",
    "es": "Plataforma angular y de enlace de datos"
  },
  "advanced-react-design-patterns-performance-optimization": {
    "vi": "Mẫu thiết kế React nâng cao & Tối ưu hiệu năng",
    "en": "Advanced React Design Patterns & Performance Optimization",
    "ja": "高度な React 設計パターンとパフォーマンスの最適化",
    "ko": "고급 React 디자인 패턴 및 성능 최적화",
    "zh": "高级 React 设计模式和性能优化",
    "fr": "Modèles de conception React avancés et optimisation des performances",
    "de": "Erweiterte React-Designmuster und Leistungsoptimierung",
    "es": "Patrones de diseño avanzados de React y optimización del rendimiento"
  },
  "application-testing-angular-performance-optimization": {
    "vi": "Kiểm thử ứng dụng & Tối ưu hiệu năng Angular",
    "en": "Application Testing & Angular Performance Optimization",
    "ja": "アプリケーションのテストと角度パフォーマンスの最適化",
    "ko": "애플리케이션 테스트 및 각도 성능 최적화",
    "zh": "应用程序测试和角度性能优化",
    "fr": "Tests d'applications et optimisation des performances angulaires",
    "de": "Anwendungstests und Angular-Leistungsoptimierung",
    "es": "Pruebas de aplicaciones y optimización del rendimiento angular"
  },
  "deploy-application-to-production-scale-up": {
    "vi": "Triển khai ứng dụng lên Production & Mở rộng quy mô",
    "en": "Deploy application to Production & Scale up",
    "ja": "アプリケーションを本番環境にデプロイし、スケールアップする",
    "ko": "프로덕션 및 확장에 애플리케이션 배포",
    "zh": "将应用程序部署到生产并扩大规模",
    "fr": "Déployer l'application en production et passer à l'échelle",
    "de": "Stellen Sie die Anwendung für die Produktion bereit und skalieren Sie sie",
    "es": "Implementar la aplicación en producción y escalar"
  },
  "django-platform-mvt-architecture": {
    "vi": "Nền tảng Django & Kiến trúc MVT",
    "en": "Django Platform & MVT Architecture",
    "ja": "Django プラットフォームと MVT アーキテクチャ",
    "ko": "Django 플랫폼 및 MVT 아키텍처",
    "zh": "Django 平台和 MVT 架构",
    "fr": "Plateforme Django et architecture MVT",
    "de": "Django-Plattform und MVT-Architektur",
    "es": "Plataforma Django y arquitectura MVT"
  },
  "user-authentication-security-authorization-gates-policies": {
    "vi": "Xác thực người dùng & Phân quyền bảo mật (Gates/Policies)",
    "en": "User Authentication & Security Authorization (Gates/Policies)",
    "ja": "ユーザー認証とセキュリティ認可 (ゲート/ポリシー)",
    "ko": "사용자 인증 및 보안 인증(게이트/정책)",
    "zh": "用户身份验证和安全授权（门/策略）",
    "fr": "Authentification des utilisateurs et autorisation de sécurité (Portes/Politiques)",
    "de": "Benutzerauthentifizierung und Sicherheitsautorisierung (Gates/Richtlinien)",
    "es": "Autenticación de usuario y autorización de seguridad (puertas/políticas)"
  },
  "build-professional-restful-apis-with-django-rest-framework-drf": {
    "vi": "Xây dựng RESTful API chuyên nghiệp với Django REST Framework (DRF)",
    "en": "Build professional RESTful APIs with Django REST Framework (DRF)",
    "ja": "Django REST Framework (DRF) を使用してプロフェッショナルな RESTful API を構築する",
    "ko": "Django REST Framework(DRF)를 사용하여 전문적인 RESTful API 구축",
    "zh": "使用 Django REST Framework (DRF) 构建专业的 RESTful API",
    "fr": "Créez des API RESTful professionnelles avec Django REST Framework (DRF)",
    "de": "Erstellen Sie professionelle RESTful-APIs mit dem Django REST Framework (DRF)",
    "es": "Cree API RESTful profesionales con Django REST Framework (DRF)"
  },
  "graphql-schema-query-language-platform": {
    "vi": "Nền tảng ngôn ngữ truy vấn GraphQL & Schema",
    "en": "GraphQL & Schema query language platform",
    "ja": "GraphQL およびスキーマ クエリ言語プラットフォーム",
    "ko": "GraphQL 및 스키마 쿼리 언어 플랫폼",
    "zh": "GraphQL 和 Schema 查询语言平台",
    "fr": "Plateforme de langage de requête GraphQL et Schema",
    "de": "GraphQL- und Schema-Abfragesprachenplattform",
    "es": "Plataforma de lenguaje de consulta GraphQL y Schema"
  },
  "index-design-query-speed-optimization": {
    "vi": "Thiết kế Index & Tối ưu hóa tốc độ truy vấn",
    "en": "Index Design & Query Speed Optimization",
    "ja": "インデックス設計とクエリ速度の最適化",
    "ko": "인덱스 디자인 및 쿼리 속도 최적화",
    "zh": "索引设计&查询速度优化",
    "fr": "Conception d'index et optimisation de la vitesse des requêtes",
    "de": "Indexdesign und Optimierung der Abfragegeschwindigkeit",
    "es": "Diseño de índices y optimización de la velocidad de consultas"
  },
  "ci-cd-platform-automation-pipeline": {
    "vi": "Nền tảng CI/CD & Pipeline tự động hóa",
    "en": "CI/CD Platform & Automation Pipeline",
    "ja": "CI/CD プラットフォームと自動化パイプライン",
    "ko": "CI/CD 플랫폼 및 자동화 파이프라인",
    "zh": "CI/CD 平台和自动化管道",
    "fr": "Plateforme CI/CD et pipeline d'automatisation",
    "de": "CI/CD-Plattform und Automatisierungspipeline",
    "es": "Plataforma CI/CD y canal de automatización"
  },
  "kubernetes-platform-pods-architecture": {
    "vi": "Nền tảng Kubernetes & Kiến trúc Pods",
    "en": "Kubernetes Platform & Pods Architecture",
    "ja": "Kubernetes プラットフォームとポッドのアーキテクチャ",
    "ko": "Kubernetes 플랫폼 및 포드 아키텍처",
    "zh": "Kubernetes 平台和 Pod 架构",
    "fr": "Architecture de la plateforme et des pods Kubernetes",
    "de": "Kubernetes-Plattform- und Pods-Architektur",
    "es": "Plataforma Kubernetes y arquitectura de pods"
  },
  "kubernetes-intranet-services-ingress": {
    "vi": "Mạng nội bộ Kubernetes, Dịch vụ Services & Ingress",
    "en": "Kubernetes Intranet, Services & Ingress",
    "ja": "Kubernetes イントラネット、サービス、Ingress",
    "ko": "Kubernetes 인트라넷, 서비스 및 수신",
    "zh": "Kubernetes 内联网、服务和入口",
    "fr": "Intranet, services et entrée Kubernetes",
    "de": "Kubernetes-Intranet, Dienste und Ingress",
    "es": "Intranet, servicios e ingreso de Kubernetes"
  },
  "build-an-advanced-multi-stage-ci-cd-pipeline": {
    "vi": "Xây dựng Pipeline CI/CD đa giai đoạn nâng cao",
    "en": "Build an advanced multi-stage CI/CD Pipeline",
    "ja": "高度なマルチステージ CI/CD パイプラインを構築する",
    "ko": "고급 다단계 CI/CD 파이프라인 구축",
    "zh": "构建先进的多阶段 CI/CD 管道",
    "fr": "Créez un pipeline CI/CD avancé à plusieurs étapes",
    "de": "Erstellen Sie eine erweiterte mehrstufige CI/CD-Pipeline",
    "es": "Cree una canalización avanzada de CI/CD de varias etapas"
  },
  "production-server-architecture-load-balancing-ssl-tls": {
    "vi": "Kiến trúc máy chủ Production, Cân bằng tải Load Balancing & SSL/TLS",
    "en": "Production server architecture, Load Balancing & SSL/TLS",
    "ja": "運用サーバー アーキテクチャ、ロード バランシング、SSL/TLS",
    "ko": "프로덕션 서버 아키텍처, 로드 밸런싱 및 SSL/TLS",
    "zh": "生产服务器架构、负载平衡和 SSL/TLS",
    "fr": "Architecture serveur de production, Load Balancing & SSL/TLS",
    "de": "Produktionsserverarchitektur, Lastausgleich und SSL/TLS",
    "es": "Arquitectura del servidor de producción, equilibrio de carga y SSL/TLS"
  },
  "gitops-model-with-argocd-deployment-automation": {
    "vi": "Mô hình GitOps với ArgoCD & Tự động triển khai",
    "en": "GitOps Model with ArgoCD & Deployment Automation",
    "ja": "ArgoCD とデプロイメント自動化を備えた GitOps モデル",
    "ko": "ArgoCD 및 배포 자동화를 갖춘 GitOps 모델",
    "zh": "具有 ArgoCD 和部署自动化的 GitOps 模型",
    "fr": "Modèle GitOps avec ArgoCD et automatisation du déploiement",
    "de": "GitOps-Modell mit ArgoCD und Bereitstellungsautomatisierung",
    "es": "Modelo GitOps con ArgoCD y automatización de implementación"
  },
  "optimize-nginx-server-performance-caching-gzip-compression": {
    "vi": "Tối ưu hiệu năng máy chủ Nginx, Caching & Nén Gzip",
    "en": "Optimize Nginx server performance, Caching & Gzip compression",
    "ja": "Nginx サーバーのパフォーマンス、キャッシュ、Gzip 圧縮を最適化します。",
    "ko": "Nginx 서버 성능, 캐싱 및 Gzip 압축 최적화",
    "zh": "优化 Nginx 服务器性能、缓存和 Gzip 压缩",
    "fr": "Optimiser les performances du serveur Nginx, la mise en cache et la compression Gzip",
    "de": "Optimieren Sie die Leistung des Nginx-Servers, Caching und Gzip-Komprimierung",
    "es": "Optimice el rendimiento del servidor Nginx, el almacenamiento en caché y la compresión Gzip"
  },
  "nginx-web-server-basics-reverse-proxy-configuration": {
    "vi": "Cơ bản về Nginx Web Server & Cấu hình Reverse Proxy",
    "en": "Nginx Web Server Basics & Reverse Proxy Configuration",
    "ja": "Nginx Web サーバーの基本とリバース プロキシ構成",
    "ko": "Nginx 웹 서버 기본 사항 및 역방향 프록시 구성",
    "zh": "Nginx Web 服务器基础知识和反向代理配置",
    "fr": "Bases du serveur Web Nginx et configuration du proxy inverse",
    "de": "Nginx-Webserver-Grundlagen und Reverse-Proxy-Konfiguration",
    "es": "Conceptos básicos del servidor web Nginx y configuración del proxy inverso"
  }
};

  function normalizeKey(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, '-');
  }

  function detectInitialLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES[saved]) return saved;
    } catch (e) {}

    const browserLang = (navigator.language || navigator.userLanguage || 'vi').toLowerCase();
    for (const code of Object.keys(LANGUAGES)) {
      if (browserLang.startsWith(code)) return code;
    }
    return 'vi';
  }

  let currentLang = detectInitialLang();

  function detectTextLanguage(text) {
    if (!text || typeof text !== 'string') return currentLang;
    const clean = text.toLowerCase().trim();

    const viChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    const viWords = /\b(tui|tôi|bạn|học|làm|việc|công việc|ở|tại|thế nào|không|được|như|với|cho|của)\b/i;
    if (viChars.test(clean) || viWords.test(clean)) return 'vi';

    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(clean)) return 'ja';

    if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(clean)) return 'ko';

    if (/[\u4E00-\u9FFF]/.test(clean)) return 'zh';

    const enWords = /\b(the|is|are|how|what|find|job|jobs|work|career|learn|project|code|can|you|help|me|in|at|where|when|why)\b/i;
    if (enWords.test(clean)) return 'en';

    return currentLang;
  }

  function setLanguage(lang) {
    if (!LANGUAGES[lang]) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    if (typeof document !== 'undefined' && document.documentElement) document.documentElement.lang = lang;
  }

  function getLanguages() {
    return LANGUAGES;
  }

  function t(key, fallbackOrVars = '', maybeVars = null) {
    const dict = translations[currentLang] || translations['en'] || translations['vi'];
    let s = dict[key] || translations['en']?.[key] || translations['vi']?.[key];
    const vars = (fallbackOrVars && typeof fallbackOrVars === 'object') ? fallbackOrVars : maybeVars;
    if (s === undefined || s === null) {
      s = (typeof fallbackOrVars === 'string' && fallbackOrVars) ? fallbackOrVars : key;
    }
    if (vars) s = String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
    return s;
  }

  function getTechDesc(techId, fallbackDesc = '') {
    if (!techId) return fallbackDesc;
    const tid = String(techId).toLowerCase();
    if (techDescriptions[tid]) {
      const entry = techDescriptions[tid];
      if (entry[currentLang]) return entry[currentLang];
      if (currentLang === 'vi' && entry.vi) return entry.vi;
      if (entry.en) return entry.en;
    }
    return fallbackDesc;
  }

  function translateTitle(title) {
    if (!title) return '';
    const norm = normalizeKey(title);
    if (canonicalTitles[norm]) {
      const entry = canonicalTitles[norm];
      if (entry[currentLang]) return entry[currentLang];
      if (currentLang === 'vi' && entry.vi) return entry.vi;
      if (entry.en) return entry.en;
    }
    return title;
  }

  function translateDesc(desc) {
    if (!desc) return '';
    const norm = normalizeKey(desc);
    if (canonicalTitles[norm]) {
      const entry = canonicalTitles[norm];
      if (entry[currentLang]) return entry[currentLang];
      if (currentLang === 'vi' && entry.vi) return entry.vi;
      if (entry.en) return entry.en;
    }
    return desc;
  }

      const techDescriptions = {
  "cpp": {
    "vi": "Lập trình hệ thống, game engine, ứng dụng hiệu năng cao",
    "en": "Systems programming, game engines, high-performance applications",
    "ja": "システムプログラミング、ゲームエンジン、高性能アプリケーション",
    "ko": "시스템 프로그래밍, 게임 엔진, 고성능 애플리케이션",
    "zh": "系统编程、游戏引擎、高性能应用程序",
    "fr": "Programmation système, moteurs de jeu, applications haute performance",
    "de": "Systemprogrammierung, Game-Engines, Hochleistungsanwendungen",
    "es": "Programación de sistemas, motores de juegos, aplicaciones de alto rendimiento"
  },
  "python": {
    "vi": "Trí tuệ nhân tạo (AI/ML), web backend, khoa học dữ liệu, tự động hóa",
    "en": "AI/ML, web backend, data science, scripting & automation",
    "ja": "AI/機械学習、Webバックエンド、データサイエンス、自動化スクリプト",
    "ko": "AI/머신러닝, 웹 백엔드, 데이터 과학, 자동화 스크립트",
    "zh": "人工智能/机器学习、Web后端、数据科学、自动化脚本",
    "fr": "IA/ML, backend web, science des données, scripts et automatisation",
    "de": "KI/ML, Web-Backend, Data Science, Scripting & Automatisierung",
    "es": "IA/ML, backend web, ciencia de datos, scripts y automatización"
  },
  "java": {
    "vi": "Ứng dụng doanh nghiệp, Android, dịch vụ backend, microservices",
    "en": "Enterprise apps, Android, backend services, microservices",
    "ja": "エンタープライズアプリ、Android、バックエンドサービス、マイクロサービス",
    "ko": "엔터프라이즈 앱, Android, 백엔드 서비스, 마이크로서비스",
    "zh": "企业级应用、Android、后端服务、微服务架构",
    "fr": "Applications d'entreprise, Android, services backend, microservices",
    "de": "Enterprise-Anwendungen, Android, Backend-Services, Microservices",
    "es": "Aplicaciones empresariales, Android, servicios backend, microservicios"
  },
  "typescript": {
    "vi": "JavaScript định kiểu tĩnh, ứng dụng quy mô lớn, trải nghiệm lập trình vượt trội",
    "en": "Typed JavaScript, large-scale enterprise apps, superior developer experience",
    "ja": "型安全なJavaScript、大規模エンタープライズ開発、優れた開発体験",
    "ko": "정적 타입 JavaScript, 대규모 엔터프라이즈 앱, 탁월한 개발 생산성",
    "zh": "强类型JavaScript、大规模企业应用、极佳开发体验",
    "fr": "JavaScript typé, applications d'entreprise à grande échelle, meilleure productivité",
    "de": "Typisiertes JavaScript, skalierbare Enterprise-Apps, exzellente Developer Experience",
    "es": "JavaScript tipado, aplicaciones empresariales a gran escala, excelente experiencia"
  },
  "csharp": {
    "vi": "Hệ sinh thái .NET, phát triển game (Unity), ứng dụng doanh nghiệp đa nền tảng",
    "en": ".NET ecosystem, game dev (Unity), enterprise cross-platform apps",
    "ja": ".NETエコシステム、Unityゲーム開発、クロスプラットフォーム企業アプリ",
    "ko": ".NET 생태계, Unity 게임 개발, 크로스 플랫폼 엔터프라이즈 앱",
    "zh": ".NET生态系统、Unity游戏开发、跨平台企业级应用",
    "fr": "Écosystème .NET, développement de jeux (Unity), applications multiplateformes",
    "de": ".NET-Ökosystem, Spieleentwicklung (Unity), plattformübergreifende Enterprise-Apps",
    "es": "Ecosistema .NET, desarrollo de juegos (Unity), aplicaciones multiplataforma"
  },
  "go": {
    "vi": "Điện toán đám mây Cloud-Native, microservices, lập trình đồng thời hiệu năng cao",
    "en": "Cloud-native, microservices, high-concurrency programming, DevOps tools",
    "ja": "クラウドネイティブ、マイクロサービス、高並行プログラミング、DevOpsツール",
    "ko": "클라우드 네이티브, 마이크로서비스, 고성능 동시성 프로그래밍, DevOps 도구",
    "zh": "云原生、微服务、高并发并发编程、DevOps工具链",
    "fr": "Cloud-native, microservices, programmation concurrente haute performance, outils DevOps",
    "de": "Cloud-Native, Microservices, hochparallele Programmierung, DevOps-Tools",
    "es": "Nube nativa, microservicios, programación concurrente de alto rendimiento, herramientas DevOps"
  },
  "rust": {
    "vi": "Lập trình hệ thống an toàn bộ nhớ tuyệt đối, hiệu năng cực cao, WebAssembly",
    "en": "Systems programming, zero-cost memory safety, high performance, WebAssembly",
    "ja": "システムプログラミング、メモリ安全性、超高性能、WebAssembly",
    "ko": "시스템 프로그래밍, 메모리 안전성 보장, 초고성능, WebAssembly",
    "zh": "系统编程、零成本内存安全、极致性能、WebAssembly",
    "fr": "Programmation système, sécurité mémoire sans coût, haute performance, WebAssembly",
    "de": "Systemprogrammierung, speichersichere Abstraktionen, maximale Leistung, WebAssembly",
    "es": "Programación de sistemas, seguridad de memoria sin coste, alto rendimiento, WebAssembly"
  },
  "php": {
    "vi": "Phát triển web toàn diện, Laravel framework, WordPress, xử lý phía máy chủ",
    "en": "Full-stack web development, Laravel framework, WordPress, server-side scripting",
    "ja": "Web開発、Laravelフレームワーク、WordPress、サーバーサイド処理",
    "ko": "풀스택 웹 개발, Laravel 프레임워크, WordPress, 서버사이드 스크립팅",
    "zh": "全栈Web开发、Laravel框架、WordPress、服务端脚本处理",
    "fr": "Développement web complet, framework Laravel, WordPress, scripts côté serveur",
    "de": "Fullstack-Webentwicklung, Laravel-Framework, WordPress, serverseitige Skripte",
    "es": "Desarrollo web integral, framework Laravel, WordPress, procesamiento del lado del servidor"
  },
  "swift": {
    "vi": "Phát triển ứng dụng iOS, macOS, giao diện hiện đại SwiftUI, backend Swift",
    "en": "iOS & macOS development, modern declarative SwiftUI, server-side Swift",
    "ja": "iOS/macOS開発、モダンなSwiftUI、サーバーサイドSwift",
    "ko": "iOS 및 macOS 개발, 모던 선언형 SwiftUI, 서버사이드 Swift",
    "zh": "iOS与macOS应用开发、现代化声明式SwiftUI、服务端Swift",
    "fr": "Développement iOS et macOS, SwiftUI moderne, Swift côté serveur",
    "de": "iOS- und macOS-Entwicklung, modernes SwiftUI, serverseitiges Swift",
    "es": "Desarrollo de iOS y macOS, interfaz moderna SwiftUI, Swift del lado del servidor"
  },
  "kotlin": {
    "vi": "Phát triển Android hiện đại, hệ sinh thái JVM, Coroutines & Jetpack Compose",
    "en": "Modern Android development, JVM ecosystem, Coroutines & Jetpack Compose",
    "ja": "モダンAndroid開発、JVMエコシステム、Coroutines、Jetpack Compose",
    "ko": "모던 Android 개발, JVM 생태계, 코루틴 및 Jetpack Compose",
    "zh": "现代Android开发、JVM生态系统、协程与Jetpack Compose",
    "fr": "Développement Android moderne, écosystème JVM, Coroutines et Jetpack Compose",
    "de": "Moderne Android-Entwicklung, JVM-Ökosystem, Coroutinen & Jetpack Compose",
    "es": "Desarrollo moderno de Android, ecosistema JVM, corrutinas y Jetpack Compose"
  },
  "dart": {
    "vi": "Lập trình đa nền tảng di động Mobile, Web & Desktop với Flutter",
    "en": "Cross-platform mobile, web & desktop app development with Flutter",
    "ja": "Flutterによるクロスプラットフォーム（モバイル・Web・デスクトップ）開発",
    "ko": "Flutter 기반 모바일, 웹 및 데스크톱 크로스 플랫폼 애플리케이션 개발",
    "zh": "使用Flutter进行跨平台移动端、Web与桌面端应用开发",
    "fr": "Développement d'applications multiplateformes mobile, web et bureau avec Flutter",
    "de": "Plattformübergreifende Mobile-, Web- und Desktop-App-Entwicklung mit Flutter",
    "es": "Desarrollo de aplicaciones multiplataforma móvil, web y escritorio con Flutter"
  },
  "ruby": {
    "vi": "Khung phát triển Ruby on Rails, xây dựng web nhanh chóng, cú pháp thanh lịch",
    "en": "Ruby on Rails framework, rapid web development, elegant syntax",
    "ja": "Ruby on Railsフレームワーク、迅速なWeb開発、エレガントな構文",
    "ko": "Ruby on Rails 프레임워크, 빠른 웹 개발 생산성, 우아한 구문",
    "zh": "Ruby on Rails框架、敏捷高效Web开发、优雅表达力语法",
    "fr": "Framework Ruby on Rails, développement web rapide, syntaxe élégante",
    "de": "Ruby on Rails Framework, schnelle Webentwicklung, elegante Syntax",
    "es": "Framework Ruby on Rails, desarrollo web rápido, sintaxis elegante"
  },
  "zig": {
    "vi": "Ngôn ngữ lập trình hệ thống — Tốc độ cao, an toàn bộ nhớ, thay thế C hiện đại",
    "en": "Systems programming language — High performance, memory safety, modern C replacement",
    "ja": "システムプログラミング言語 — 高性能、メモリ安全性、現代的なC言語の代替",
    "ko": "시스템 프로그래밍 언어 — 고성능, 메모리 안전성, 현대적 C 대체제",
    "zh": "系统编程语言 — 极致性能、内存安全、现代C语言替代者",
    "fr": "Langage système — Haute performance, sécurité mémoire, remplacement moderne du C",
    "de": "Systemprogrammiersprache — Höchstleistung, Speichersicherheit, moderner C-Ersatz",
    "es": "Lenguaje de programación de sistemas — Alto rendimiento, seguridad de memoria, reemplazo moderno de C"
  },
  "solidity": {
    "vi": "Hợp đồng thông minh — Nền tảng Ethereum, Web3, DeFi & công nghệ Blockchain",
    "en": "Smart Contracts — Ethereum, Web3, DeFi & Blockchain development",
    "ja": "スマートコントラクト — Ethereum、Web3、DeFi、ブロックチェーン開発",
    "ko": "스마트 계약 — Ethereum, Web3, DeFi 및 블록체인 개발",
    "zh": "智能合约 — Ethereum、Web3、DeFi与区块链开发",
    "fr": "Contrats intelligents — Ethereum, Web3, DeFi et développement Blockchain",
    "de": "Smart Contracts — Ethereum, Web3, DeFi & Blockchain-Entwicklung",
    "es": "Contratos inteligentes — Ethereum, Web3, DeFi y desarrollo Blockchain"
  },
  "lua": {
    "vi": "Ngôn ngữ kịch bản siêu nhẹ — Lập trình game Love2D, Roblox & hệ thống nhúng",
    "en": "Ultra-lightweight scripting — Game development, Roblox & embedded systems",
    "ja": "超軽量スクリプト言語 — Love2Dゲーム開発、Roblox、組み込みシステム",
    "ko": "초경량 스크립팅 언어 — Love2D 게임 개발, Roblox 및 임베디드 시스템",
    "zh": "超轻量级脚本语言 — Love2D游戏开发、Roblox与嵌入式系统",
    "fr": "Langage de script ultra-léger — Développement de jeux Love2D, Roblox et systèmes embarqués",
    "de": "Ultraleichte Skriptsprache — Love2D-Spieleentwicklung, Roblox & eingebettete Systeme",
    "es": "Lenguaje de scripting ultraligero — Desarrollo de juegos Love2D, Roblox y sistemas embebidos"
  },
  "r": {
    "vi": "Tính toán thống kê, khoa học dữ liệu, trực quan hóa biểu đồ phân tích chuyên sâu",
    "en": "Statistical computing, data science, charts & deep data visualization",
    "ja": "統計計算、データサイエンス、高度なグラフ可視化分析",
    "ko": "통계 컴퓨팅, 데이터 과학, 심층 차트 데이터 시각화",
    "zh": "统计计算、数据科学、深度数据图表可视化分析",
    "fr": "Calcul statistique, science des données, graphiques et visualisation approfondie",
    "de": "Statistische Berechnungen, Data Science, Diagramme & tiefe Datenvisualisierung",
    "es": "Computación estadística, ciencia de datos, gráficos y visualización avanzada de datos"
  },
  "scala": {
    "vi": "Hệ sinh thái JVM, xử lý Dữ liệu lớn (Big Data / Apache Spark), hàm kết hợp OOP",
    "en": "JVM ecosystem, Big Data processing (Apache Spark), functional + OOP",
    "ja": "JVMエコシステム、ビッグデータ処理（Apache Spark）、関数型＋オブジェクト指向",
    "ko": "JVM 생태계, 빅데이터 처리(Apache Spark), 함수형 및 객체지향 결합",
    "zh": "JVM生态系统、大数据处理（Apache Spark）、函数式与面向对象融合",
    "fr": "Écosystème JVM, traitement Big Data (Apache Spark), paradigme fonctionnel et POO",
    "de": "JVM-Ökosystem, Big-Data-Verarbeitung (Apache Spark), funktional + OOP",
    "es": "Ecosistema JVM, procesamiento de Big Data (Apache Spark), funcional y POO"
  },
  "htmlcss": {
    "vi": "Nền tảng giao diện web, thiết kế Responsive thích ứng, hiệu ứng animation & Modern CSS",
    "en": "Web fundamentals, responsive design, animations & modern CSS architecture",
    "ja": "Web基礎、レスポンシブデザイン、アニメーション、モダンCSS設計",
    "ko": "웹 기초, 반응형 디자인, 애니메이션 및 모던 CSS 아키텍처",
    "zh": "Web前端基石、响应式自适应布局、动画特效与现代CSS架构",
    "fr": "Fondamentaux du web, conception réactive, animations et architecture CSS moderne",
    "de": "Web-Grundlagen, responsives Design, Animationen & moderne CSS-Architektur",
    "es": "Fundamentos de la web, diseño responsivo, animaciones y arquitectura CSS moderna"
  },
  "react": {
    "vi": "Thư viện giao diện người dùng SPA hàng đầu, kiến trúc Component, Next.js & React Native",
    "en": "Leading SPA UI library, component-based architecture, Next.js & React Native",
    "ja": "主要なSPA UIライブラリ、コンポーネント指向、Next.js、React Native",
    "ko": "선도적인 SPA UI 라이브러리, 컴포넌트 기반 아키텍처, Next.js 및 React Native",
    "zh": "主流SPA前端UI库、组件化架构、Next.js全栈与React Native跨端",
    "fr": "Bibliothèque UI de premier plan, architecture à composants, Next.js et React Native",
    "de": "Führende SPA-UI-Bibliothek, komponentenbasierte Architektur, Next.js & React Native",
    "es": "Biblioteca líder de interfaz SPA, arquitectura basada en componentes, Next.js y React Native"
  },
  "vue": {
    "vi": "Khung phát triển tiến bộ — Giao diện phản ứng Reactive UI, Composition API, Nuxt.js",
    "en": "Progressive framework — Reactive UI, modern Composition API & Nuxt.js SSR",
    "ja": "プログレッシブフレームワーク — リアクティブUI、Composition API、Nuxt.js",
    "ko": "프로그레시브 프레임워크 — 반응형 UI, 모던 Composition API 및 Nuxt.js SSR",
    "zh": "渐进式前端框架 — 响应式UI系统、现代化Composition API与Nuxt.js全栈",
    "fr": "Framework progressif — Interface réactive, Composition API moderne et Nuxt.js SSR",
    "de": "Progressives Framework — Reaktive Benutzeroberflächen, moderne Composition API & Nuxt.js SSR",
    "es": "Framework progresivo — Interfaz reactiva, Composition API moderna y Nuxt.js SSR"
  },
  "angular": {
    "vi": "Khung ứng dụng doanh nghiệp toàn diện — TypeScript, RxJS, Dependency Injection",
    "en": "Enterprise application framework — TypeScript, RxJS & Dependency Injection",
    "ja": "エンタープライズ向け総合フレームワーク — TypeScript、RxJS、依存性注入",
    "ko": "엔터프라이즈 프레임워크 — TypeScript, RxJS 및 의존성 주입(DI)",
    "zh": "企业级全功能应用框架 — TypeScript、RxJS响应式与依赖注入",
    "fr": "Framework d'application d'entreprise — TypeScript, RxJS et injection de dépendances",
    "de": "Enterprise-Anwendungsframework — TypeScript, RxJS & Dependency Injection",
    "es": "Framework de aplicaciones empresariales — TypeScript, RxJS e inyección de dependencias"
  },
  "tailwind": {
    "vi": "Khung CSS Utility-first hiện đại — Xây dựng giao diện thần tốc, tùy biến linh hoạt",
    "en": "Modern utility-first CSS framework — Rapid UI development, highly customizable",
    "ja": "ユーティリティファーストCSS — 高速なUI構築と柔軟なカスタマイズ性",
    "ko": "모던 유틸리티 우선 CSS 프레임워크 — 빠른 UI 구축 및 뛰어난 커스터마이징",
    "zh": "现代化原子类CSS框架 — 极速构建高颜值UI、高度可定制设计系统",
    "fr": "Framework CSS moderne utility-first — Développement d'interface rapide et personnalisable",
    "de": "Modernes Utility-First-CSS-Framework — Schnelle UI-Entwicklung, hochgradig anpassbar",
    "es": "Framework CSS moderno utility-first — Desarrollo rápido de interfaz y altamente personalizable"
  },
  "nodejs": {
    "vi": "Backend JavaScript đa nền tảng, kiến trúc REST API, ứng dụng thời gian thực",
    "en": "Cross-platform JavaScript backend, REST APIs, real-time apps & microservices",
    "ja": "JavaScriptバックエンド、REST API設計、リアルタイムアプリ、マイクロサービス",
    "ko": "크로스 플랫폼 JavaScript 백엔드, REST API, 실시간 통신 앱 및 마이크로서비스",
    "zh": "跨平台JavaScript服务端开发、REST API架构、实时通信应用与微服务",
    "fr": "Backend JavaScript multiplateforme, API REST, applications temps réel et microservices",
    "de": "Plattformübergreifendes JavaScript-Backend, REST-APIs, Echtzeitanwendungen & Microservices",
    "es": "Backend JavaScript multiplataforma, API REST, aplicaciones en tiempo real y microservicios"
  },
  "django": {
    "vi": "Khung phát triển web Python bảo mật cao — Tích hợp sẵn ORM, xác thực & trang quản trị",
    "en": "High-security Python web framework — Batteries-included, ORM, Auth & Admin",
    "ja": "堅牢なPython Webフレームワーク — ORM、認証、管理画面を標準搭載",
    "ko": "고보안 Python 웹 프레임워크 — ORM, 인증 및 관리자 대시보드 기본 제공",
    "zh": "高安全性Python Web框架 — 开箱即用、ORM数据库映射、用户鉴权与后台管理",
    "fr": "Framework web Python hautement sécurisé — Batteries incluses, ORM, authentification et administration",
    "de": "Sicheres Python-Webframework — Alles inklusive, ORM, Authentifizierung & Admin-Panel",
    "es": "Framework web de Python de alta seguridad — Todo incluido, ORM, autenticación y panel de administración"
  },
  "sql": {
    "vi": "Cơ sở dữ liệu quan hệ (PostgreSQL, MySQL), NoSQL, tối ưu hóa truy vấn & thiết kế dữ liệu",
    "en": "Relational databases (Postgres, MySQL), NoSQL, query tuning & data modeling",
    "ja": "リレーショナルDB（PostgreSQL、MySQL）、NoSQL、クエリ最適化、データ設計",
    "ko": "관계형 데이터베이스(PostgreSQL, MySQL), NoSQL, 쿼리 튜닝 및 데이터 모델링",
    "zh": "关系型数据库（PostgreSQL、MySQL）、NoSQL、查询性能调优与数据建模",
    "fr": "Bases de données relationnelles (Postgres, MySQL), NoSQL, optimisation des requêtes et modélisation",
    "de": "Relationale Datenbanken (Postgres, MySQL), NoSQL, Abfrageoptimierung & Datenmodellierung",
    "es": "Bases de datos relacionales (Postgres, MySQL), NoSQL, optimización de consultas y modelado de datos"
  },
  "mongodb": {
    "vi": "Cơ sở dữ liệu NoSQL hướng tài liệu, khả năng mở rộng linh hoạt theo quy mô lớn",
    "en": "Document-based NoSQL database — Scalable, high availability, flexible schema",
    "ja": "ドキュメント指向NoSQLデータベース — スケーラブル、高可用性、柔軟なスキーマ",
    "ko": "문서 지향 NoSQL 데이터베이스 — 고확장성, 고가용성 및 유연한 스키마",
    "zh": "文档型NoSQL数据库 — 弹性高扩展、高可用性、灵活的数据模式",
    "fr": "Base de données NoSQL orientée documents — Évolutive, haute disponibilité et schéma flexible",
    "de": "Dokumentenbasierte NoSQL-Datenbank — Skalierbar, hochverfügbar & flexibles Schema",
    "es": "Base de datos NoSQL orientada a documentos — Escalable, alta disponibilidad y esquema flexible"
  },
  "graphql": {
    "vi": "Ngôn ngữ truy vấn API linh hoạt — Truy vấn chính xác dữ liệu, Typed Schema & Subscriptions",
    "en": "Flexible API query language — Precise data fetching, typed schema & real-time subscriptions",
    "ja": "柔軟なAPIクエリ言語 — 必要なデータのみ取得、型定義スキーマ、リアルタイム購読",
    "ko": "유연한 API 쿼리 언어 — 정확한 데이터 패칭, 타입 정의 스키마 및 실시간 구독",
    "zh": "灵活的API查询语言 — 按需精准获取数据、强类型模式定义与实时订阅",
    "fr": "Langage de requête d'API flexible — Récupération précise, schéma typé et abonnements en temps réel",
    "de": "Flexible API-Abfragesprache — Präziser Datenabruf, typisiertes Schema & Echtzeit-Abonnements",
    "es": "Lenguaje de consulta de API flexible — Obtención precisa de datos, esquema tipado y suscripciones en tiempo real"
  },
  "docker": {
    "vi": "Công nghệ Container hóa ứng dụng, quản lý phiên bản Git, quy trình CI/CD & Deploy",
    "en": "Containerization technology, Git version control, CI/CD pipelines & deployment",
    "ja": "コンテナ仮想化技術、Gitバージョン管理、CI/CDパイプライン、自動デプロイ",
    "ko": "컨테이너 가상화 기술, Git 버전 관리, CI/CD 파이프라인 및 배포 자동화",
    "zh": "容器化虚拟化技术、Git版本控制、CI/CD自动化流水线与生产部署",
    "fr": "Conteneurisation, contrôle de version Git, pipelines CI/CD et déploiement",
    "de": "Containerisierung, Git-Versionskontrolle, CI/CD-Pipelines & Bereitstellung",
    "es": "Tecnología de contenedorización, control de versiones Git, pipelines CI/CD y despliegue"
  },
  "kubernetes": {
    "vi": "Điều phối và tự động hóa quản lý cụm Container — Triển khai, mở rộng quy mô sản xuất",
    "en": "Container orchestration — Automated deployment, scaling & production management",
    "ja": "コンテナオーケストレーション — デプロイ自動化、スケーリング、本番運用管理",
    "ko": "컨테이너 오케스트레이션 — 자동화된 배포, 오토스케일링 및 프로덕션 운영 관리",
    "zh": "容器编排管理系统 — 自动化部署、弹性伸缩与生产环境集群管理",
    "fr": "Orchestration de conteneurs — Déploiement automatisé, mise à l'échelle et gestion en production",
    "de": "Container-Orchestrierung — Automatisiertes Deployment, Skalierung & Produktionsmanagement",
    "es": "Orquestación de contenedores — Despliegue automatizado, escalado y gestión de producción"
  },
  "cicd": {
    "vi": "Tích hợp và triển khai liên tục — GitHub Actions, tự động hóa kiểm thử & phát hành",
    "en": "Continuous Integration & Deployment — GitHub Actions, automated test & release pipelines",
    "ja": "継続的インテグレーション/デプロイ — GitHub Actions、自動テスト、リリース管理",
    "ko": "지속적 통합 및 배포 — GitHub Actions, 자동화된 테스트 및 릴리스 파이프라인",
    "zh": "持续集成与持续交付 — GitHub Actions、自动化测试与版本发布流水线",
    "fr": "Intégration et déploiement continus — GitHub Actions, tests automatisés et livraison",
    "de": "Kontinuierliche Integration & Bereitstellung — GitHub Actions, automatisierte Test- & Release-Pipelines",
    "es": "Integración y despliegue continuos — GitHub Actions, pruebas automatizadas y pipelines de lanzamiento"
  },
  "bash": {
    "vi": "Dòng lệnh Linux Terminal, viết kịch bản Shell tự động hóa quản trị hệ thống DevOps",
    "en": "Linux terminal, shell scripting, system automation & DevOps essentials",
    "ja": "Linuxターミナル操作、シェルスクリプト、システム自動化、DevOps必須スキル",
    "ko": "Linux 터미널 환경, 쉘 스크립팅, 시스템 자동화 및 DevOps 핵심 기초",
    "zh": "Linux终端命令行、Shell脚本编程、系统运维自动化与DevOps核心基础",
    "fr": "Terminal Linux, scripts shell, automatisation système et compétences essentielles DevOps",
    "de": "Linux-Terminal, Shell-Scripting, Systemautomatisierung & DevOps-Grundlagen",
    "es": "Terminal de Linux, scripting en shell, automatización de sistemas y aspectos esenciales de DevOps"
  },
  "nginx": {
    "vi": "Máy chủ Web hiệu năng cao, Reverse Proxy, cân bằng tải Load Balancing & bảo mật Linux",
    "en": "High-performance web server, reverse proxy, load balancing & Linux server security",
    "ja": "高性能Webサーバー、リバースプロキシ、ロードバランシング、Linuxサーバー管理",
    "ko": "고성능 웹 서버, 리버스 프록시, 로드 밸런싱 및 Linux 서버 보안 관리",
    "zh": "高性能Web服务器、反向代理、负载均衡Load Balancing与Linux服务器安全运维",
    "fr": "Serveur web haute performance, reverse proxy, équilibrage de charge et sécurité Linux",
    "de": "Hochleistungs-Webserver, Reverse-Proxy, Lastverteilung & Linux-Serversicherheit",
    "es": "Servidor web de alto rendimiento, proxy inverso, balanceo de carga y seguridad de servidores Linux"
  },
  "dsa": {
    "vi": "Cấu trúc dữ liệu & Giải thuật chuyên sâu, phân tích độ phức tạp Big O, kỹ năng phỏng vấn IT",
    "en": "Data Structures & Algorithms in-depth, Big O complexity, technical interview prep",
    "ja": "データ構造とアルゴリズム、計算量オーダーBig O、技術面接対策",
    "ko": "자료구조 및 알고리즘 심화, Big O 시간복잡도 분석, 개발자 코딩테스트 준비",
    "zh": "数据结构与经典算法进阶、Big O复杂度分析、大厂技术面试刷题突破",
    "fr": "Structures de données et algorithmes approfondis, complexité Big O, préparation aux entretiens techniques",
    "de": "Datenstrukturen & Algorithmen im Detail, Big-O-Komplexität, Vorbereitung auf technische Interviews",
    "es": "Estructuras de datos y algoritmos avanzados, complejidad Big O, preparación para entrevistas técnicas"
  },
  "jest": {
    "vi": "Kiểm thử phần mềm tự động (Unit / Integration Test), phương pháp TDD, đảm bảo chất lượng code",
    "en": "Automated software testing (Unit / Integration), TDD methodology & code quality assurance",
    "ja": "自動テスト（単体/結合テスト）、TDD開発手法、コード品質保証",
    "ko": "소프트웨어 자동 테스트(단위/통합 테스트), TDD 개발 방법론 및 코드 품질 보증",
    "zh": "自动化软件测试（单元测试/集成测试）、TDD测试驱动开发与代码质量工程",
    "fr": "Tests logiciels automatisés (unitaires/intégration), méthodologie TDD et assurance qualité",
    "de": "Automatisiertes Softwaretesten (Unit-/Integrationstests), TDD-Methodik & Qualitätssicherung",
    "es": "Pruebas automatizadas de software (unitarias/integración), metodología TDD y garantía de calidad"
  }
};

  const translationCache = {};

  async function translateDynamic(text, targetLang) {
    if (!text || typeof text !== 'string') return text;
    if (targetLang === 'vi') return text;

    const cacheKey = targetLang + '_' + text.length + '_' + text.substring(0, 30);
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    const localCacheKey = 'devmaster_trans_' + cacheKey;
    try {
      const cached = localStorage.getItem(localCacheKey);
      if (cached) {
        translationCache[cacheKey] = cached;
        return cached;
      }
    } catch(e) {}

    try {

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      let translatedText = '';
      if (data && data[0]) {
        data[0].forEach(item => {
          if (item[0]) translatedText += item[0];
        });
      }

      const finalResult = translatedText || text;
      translationCache[cacheKey] = finalResult;
      try { localStorage.setItem(localCacheKey, finalResult); } catch(e) {}

      return finalResult;
    } catch (e) {
      console.warn('Dynamic translation failed:', e);
      return text;
    }
  }

  const api = {
    translateDynamic,
    getLang: () => currentLang,
    getLanguages,
    setLanguage,
    detectTextLanguage,
    t,
    getTechDesc,
    translateTitle,
    translateDesc
  };

  if (typeof window !== 'undefined') window.I18n = api;
  if (typeof module !== 'undefined') module.exports = api;
  return api;
})();
