export const NGON_NGU_TERMINAL = ['vi', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es'] as const;
export type MaNgonNgu = (typeof NGON_NGU_TERMINAL)[number];
export type Dich8 = readonly [string, string, string, string, string, string, string, string];

export function chonBan(ds: Dich8, lang: string): string {
  const i = (NGON_NGU_TERMINAL as readonly string[]).indexOf(lang);
  return ds[i >= 0 ? i : 1];
}

export const chenBien = (s: string, bien: Record<string, string | number> = {}) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in bien ? String(bien[k]) : m));

export const THONG_BAO = {
  'help.tieuDe': ['📋 CÁC LỆNH ĐƯỢC HỖ TRỢ — nối lệnh bằng | ; &&, ghi tệp bằng > >>, đọc tệp bằng <, ký tự đại diện *', '📋 AVAILABLE COMMANDS — chain with | ; &&, write files with > >>, read with <, wildcard *', '📋 使えるコマンド — | ; && で連結、> >> で書き込み、< で読み込み、ワイルドカード *', '📋 사용 가능한 명령 — | ; && 로 연결, > >> 로 파일 쓰기, < 로 읽기, 와일드카드 *', '📋 可用命令 — 用 | ; && 连接，> >> 写文件，< 读文件，通配符 *', '📋 COMMANDES DISPONIBLES — enchaîner avec | ; &&, écrire avec > >>, lire avec <, joker *', '📋 VERFÜGBARE BEFEHLE — verketten mit | ; &&, schreiben mit > >>, lesen mit <, Platzhalter *', '📋 COMANDOS DISPONIBLES — encadena con | ; &&, escribe con > >>, lee con <, comodín *'],
  'help.tep': ['📂 TỆP, THƯ MỤC & SHELL', '📂 FILES, DIRECTORIES & SHELL', '📂 ファイル・ディレクトリ・シェル', '📂 파일, 디렉터리 & 셸', '📂 文件、目录与 Shell', '📂 FICHIERS, DOSSIERS & SHELL', '📂 DATEIEN, VERZEICHNISSE & SHELL', '📂 ARCHIVOS, DIRECTORIOS Y SHELL'],
  'help.vanBan': ['🔎 XỬ LÝ VĂN BẢN', '🔎 TEXT PROCESSING', '🔎 テキスト処理', '🔎 텍스트 처리', '🔎 文本处理', '🔎 TRAITEMENT DE TEXTE', '🔎 TEXTVERARBEITUNG', '🔎 PROCESAMIENTO DE TEXTO'],
  'help.maHoa': ['🔐 MÃ HÓA', '🔐 ENCODING & HASHING', '🔐 エンコード・ハッシュ', '🔐 인코딩 & 해시', '🔐 编码与哈希', '🔐 ENCODAGE & HACHAGE', '🔐 KODIERUNG & HASHES', '🔐 CODIFICACIÓN Y HASH'],
  'help.heThong': ['🌐 HỆ THỐNG & MẠNG', '🌐 SYSTEM & NETWORK', '🌐 システム・ネットワーク', '🌐 시스템 & 네트워크', '🌐 系统与网络', '🌐 SYSTÈME & RÉSEAU', '🌐 SYSTEM & NETZWERK', '🌐 SISTEMA Y RED'],
  'goiY.help': ['Gõ "help" để xem danh sách lệnh.', 'Type "help" to see the command list.', '"help" と入力するとコマンド一覧が見られます。', '"help" 를 입력하면 명령 목록을 볼 수 있어요.', '输入 "help" 查看命令列表。', 'Tapez "help" pour voir la liste des commandes.', 'Gib "help" ein, um die Befehlsliste zu sehen.', 'Escribe "help" para ver la lista de comandos.'],
  'loi.noiBo': ['lỗi khi chạy lệnh ({loi})', 'error while running the command ({loi})', 'コマンド実行中のエラー ({loi})', '명령 실행 중 오류 ({loi})', '运行命令时出错 ({loi})', "erreur pendant l'exécution ({loi})", 'Fehler beim Ausführen ({loi})', 'error al ejecutar el comando ({loi})'],
  'loi.longNhau': ['quá nhiều tầng script lồng nhau', 'too many nested scripts', 'スクリプトの入れ子が深すぎます', '스크립트가 너무 깊게 중첩됨', '脚本嵌套层数过多', 'trop de scripts imbriqués', 'zu viele verschachtelte Skripte', 'demasiados scripts anidados'],
  'loi.chmodX': ['(chạy "chmod +x {tep}" trước)', '(run "chmod +x {tep}" first)', '(先に "chmod +x {tep}" を実行)', '(먼저 "chmod +x {tep}" 실행)', '(请先运行 "chmod +x {tep}")', '(lancez d’abord "chmod +x {tep}")', '(zuerst "chmod +x {tep}" ausführen)', '(ejecuta primero "chmod +x {tep}")'],
  'loi.nhiPhan': ['tệp nhị phân không chạy được trong terminal giả lập', 'binary files cannot run in the simulated terminal', 'バイナリはシミュレーターでは実行できません', '바이너리는 시뮬레이터에서 실행할 수 없어요', '模拟终端无法运行二进制文件', 'les binaires ne peuvent pas tourner dans le terminal simulé', 'Binärdateien laufen im simulierten Terminal nicht', 'los binarios no se ejecutan en el terminal simulado'],
  'loi.thieuTepPipe': ['thiếu tên tệp (hoặc dùng qua pipe, vd: {vd})', 'missing file name (or pipe into it, e.g. {vd})', 'ファイル名がありません (パイプでも可。例: {vd})', '파일 이름이 없어요 (파이프로도 가능, 예: {vd})', '缺少文件名 (也可用管道，例: {vd})', 'nom de fichier manquant (ou via un pipe, ex. {vd})', 'Dateiname fehlt (oder per Pipe, z. B. {vd})', 'falta el nombre del archivo (o usa un pipe, p. ej. {vd})'],
  'loi.thieuTepVd': ['thiếu tên tệp (vd: {vd})', 'missing file name (e.g. {vd})', 'ファイル名がありません (例: {vd})', '파일 이름이 없어요 (예: {vd})', '缺少文件名 (例: {vd})', 'nom de fichier manquant (ex. {vd})', 'Dateiname fehlt (z. B. {vd})', 'falta el nombre del archivo (p. ej. {vd})'],
  'loi.thieuLenh': ['thiếu tên lệnh (vd: {vd})', 'missing command name (e.g. {vd})', 'コマンド名がありません (例: {vd})', '명령 이름이 없어요 (예: {vd})', '缺少命令名 (例: {vd})', 'nom de commande manquant (ex. {vd})', 'Befehlsname fehlt (z. B. {vd})', 'falta el nombre del comando (p. ej. {vd})'],
  'loi.cachDung': ['cách dùng: {cu}', 'usage: {cu}', '使い方: {cu}', '사용법: {cu}', '用法: {cu}', 'utilisation : {cu}', 'Verwendung: {cu}', 'uso: {cu}'],
  'loi.chiHoTro': ['terminal giả lập chỉ hỗ trợ: {ds}', 'the simulated terminal only supports: {ds}', 'シミュレーターが対応しているのは: {ds}', '시뮬레이터는 다음만 지원해요: {ds}', '模拟终端仅支持: {ds}', 'le terminal simulé ne prend en charge que : {ds}', 'das simulierte Terminal unterstützt nur: {ds}', 'el terminal simulado solo admite: {ds}'],
  'loi.chiPipe': ['chỉ đọc từ pipe (vd: {vd})', 'reads from a pipe only (e.g. {vd})', 'パイプからのみ読み込みます (例: {vd})', '파이프로만 읽어요 (예: {vd})', '只从管道读取 (例: {vd})', 'lit uniquement depuis un pipe (ex. {vd})', 'liest nur aus einer Pipe (z. B. {vd})', 'solo lee desde un pipe (p. ej. {vd})'],
  'loi.soDong': ["số dòng không hợp lệ: '{gt}'", "invalid number of lines: '{gt}'", "行数が不正です: '{gt}'", "줄 수가 올바르지 않아요: '{gt}'", "行数无效: '{gt}'", "nombre de lignes invalide : '{gt}'", "ungültige Zeilenanzahl: '{gt}'", "número de líneas no válido: '{gt}'"],
  'loi.danhSach': ["danh sách không hợp lệ: '{gt}'", "invalid list: '{gt}'", "リストが不正です: '{gt}'", "목록이 올바르지 않아요: '{gt}'", "列表无效: '{gt}'", "liste invalide : '{gt}'", "ungültige Liste: '{gt}'", "lista no válida: '{gt}'"],
  'loi.cutCan': ['cần -f N (kèm -d X) hoặc -c N', 'needs -f N (with -d X) or -c N', '-f N (-d X と併用) か -c N が必要です', '-f N (-d X 와 함께) 또는 -c N 이 필요해요', '需要 -f N (配合 -d X) 或 -c N', 'il faut -f N (avec -d X) ou -c N', 'braucht -f N (mit -d X) oder -c N', 'necesita -f N (con -d X) o -c N'],
  'loi.thieuTap': ['thiếu tập ký tự (vd: {vd})', 'missing character set (e.g. {vd})', '文字セットがありません (例: {vd})', '문자 집합이 없어요 (예: {vd})', '缺少字符集 (例: {vd})', 'jeu de caractères manquant (ex. {vd})', 'Zeichensatz fehlt (z. B. {vd})', 'falta el conjunto de caracteres (p. ej. {vd})'],
  'loi.canChuoi': ['cần một chuỗi lệnh', 'needs a command string', 'コマンド文字列が必要です', '명령 문자열이 필요해요', '需要一个命令字符串', 'il faut une chaîne de commande', 'braucht eine Befehlszeichenkette', 'necesita una cadena de comandos'],
  'loi.chiChayScript': ['terminal giả lập chỉ chạy tệp script: {cu}', 'the simulated terminal only runs script files: {cu}', 'シミュレーターはスクリプトファイルのみ実行します: {cu}', '시뮬레이터는 스크립트 파일만 실행해요: {cu}', '模拟终端只运行脚本文件: {cu}', 'le terminal simulé exécute seulement des scripts : {cu}', 'das simulierte Terminal führt nur Skriptdateien aus: {cu}', 'el terminal simulado solo ejecuta scripts: {cu}'],
  'loi.khongRoot': ['terminal giả lập không chạy lệnh bằng quyền root (dùng "sudo -l" để xem quyền của bạn)', 'the simulated terminal cannot run commands as root (use "sudo -l" to see your rights)', 'シミュレーターでは root 権限で実行できません ("sudo -l" で権限を確認)', '시뮬레이터에선 root 권한으로 실행할 수 없어요 ("sudo -l" 로 권한 확인)', '模拟终端不能以 root 运行命令 (用 "sudo -l" 查看权限)', 'le terminal simulé ne peut pas exécuter en root (utilisez "sudo -l" pour voir vos droits)', 'das simulierte Terminal kann nichts als root ausführen ("sudo -l" zeigt deine Rechte)', 'el terminal simulado no ejecuta como root (usa "sudo -l" para ver tus permisos)'],
  'loi.thieuNhay': ['thiếu dấu nháy đóng {kt}', 'missing closing quote {kt}', '閉じ引用符 {kt} がありません', '닫는 따옴표 {kt} 가 없어요', '缺少闭合引号 {kt}', 'guillemet fermant {kt} manquant', 'schließendes Anführungszeichen {kt} fehlt', 'falta la comilla de cierre {kt}'],
  'loi.cuPhap': ['lỗi cú pháp gần "{t}"', 'syntax error near "{t}"', '"{t}" 付近で構文エラー', '"{t}" 근처 문법 오류', '"{t}" 附近有语法错误', 'erreur de syntaxe près de "{t}"', 'Syntaxfehler bei "{t}"', 'error de sintaxis cerca de "{t}"'],
  'loi.hanhDong': ['hành động "{hd}" chưa được hỗ trợ (dùng status, reload, restart)', 'action "{hd}" is not supported (use status, reload, restart)', '"{hd}" は未対応です (status, reload, restart を使用)', '"{hd}" 동작은 지원하지 않아요 (status, reload, restart 사용)', '不支持 "{hd}" 操作 (请用 status, reload, restart)', 'action "{hd}" non prise en charge (utilisez status, reload, restart)', 'Aktion "{hd}" wird nicht unterstützt (status, reload, restart nutzen)', 'la acción "{hd}" no es compatible (usa status, reload, restart)'],
  'loi.trong': ['(trống)', '(empty)', '(空)', '(비어 있음)', '(空)', '(vide)', '(leer)', '(vacío)'],
  'nginx.loi': ['(cấu hình Nginx đang lỗi — chạy "nginx -t" để xem chi tiết)', '(the Nginx config is broken — run "nginx -t" for details)', '(Nginx の設定にエラー — 詳細は "nginx -t")', '(Nginx 설정 오류 — 자세한 내용은 "nginx -t")', '(Nginx 配置有误 — 运行 "nginx -t" 查看详情)', '(la config Nginx est cassée — lancez "nginx -t" pour les détails)', '(Nginx-Konfiguration fehlerhaft — Details mit "nginx -t")', '(la config de Nginx tiene errores — ejecuta "nginx -t" para ver detalles)'],
  'nginx.khongRoot': ['(không tìm thấy chỉ thị root trong {tep})', '(no root directive found in {tep})', '({tep} に root 指示子がありません)', '({tep} 에 root 지시어가 없어요)', '({tep} 中没有 root 指令)', '(aucune directive root dans {tep})', '(keine root-Direktive in {tep})', '(no hay directiva root en {tep})'],
  'nginx.khongCo': ['(không có {tep})', '({tep} does not exist)', '({tep} がありません)', '({tep} 이(가) 없어요)', '({tep} 不存在)', "({tep} n'existe pas)", '({tep} existiert nicht)', '({tep} no existe)'],
  'nginx.dong': [' (dòng {n})', ' (line {n})', ' ({n} 行目)', ' ({n}번째 줄)', ' (第 {n} 行)', ' (ligne {n})', ' (Zeile {n})', ' (línea {n})'],
  'nginx.trong': ['trong {tep}', 'in {tep}', '({tep})', '({tep})', '(位于 {tep})', 'dans {tep}', 'in {tep}', 'en {tep}'],
  'nginx.khongMo': ['không mở được {tep}', 'cannot open {tep}', '{tep} を開けません', '{tep} 을(를) 열 수 없어요', '无法打开 {tep}', "impossible d'ouvrir {tep}", '{tep} kann nicht geöffnet werden', 'no se puede abrir {tep}'],
  'nginx.thuaNgoac': ['thừa dấu ngoặc đóng', 'extra closing brace', '閉じ括弧が多すぎます', '닫는 중괄호가 남아요', '多余的右括号', 'accolade fermante en trop', 'überzählige schließende Klammer', 'llave de cierre sobrante'],
  'nginx.thieuChamPhay': ['thiếu dấu chấm phẩy ở cuối dòng', 'missing semicolon at end of line', '行末のセミコロンがありません', '줄 끝에 세미콜론이 없어요', '行尾缺少分号', 'point-virgule manquant en fin de ligne', 'Semikolon am Zeilenende fehlt', 'falta punto y coma al final de la línea'],
  'nginx.thieuNgoac': ['thiếu {n} dấu ngoặc đóng', 'missing {n} closing brace(s)', '閉じ括弧が {n} 個足りません', '닫는 중괄호 {n}개가 없어요', '缺少 {n} 个右括号', '{n} accolade(s) fermante(s) manquante(s)', '{n} schließende Klammer(n) fehlen', 'faltan {n} llaves de cierre'],
  'nginx.xemChiTiet': ['Xem chi tiết bằng: nginx -t', 'See details with: nginx -t', '詳細: nginx -t', '자세히 보기: nginx -t', '查看详情: nginx -t', 'Détails avec : nginx -t', 'Details mit: nginx -t', 'Detalles con: nginx -t'],
  'co.daNop': ['⚠️ Cờ "{co}" đã được nộp trước đó!', '⚠️ Flag "{co}" was already submitted!', '⚠️ フラグ "{co}" は提出済みです!', '⚠️ 플래그 "{co}" 는 이미 제출했어요!', '⚠️ 旗帜 "{co}" 已经提交过了!', '⚠️ Le drapeau "{co}" a déjà été soumis !', '⚠️ Flagge "{co}" wurde schon eingereicht!', '⚠️ ¡La bandera "{co}" ya se envió!'],
  'co.dung': ['🎉 CHÍNH XÁC! Bạn đã mở khóa: {ten} (+ {diem} XP)!', '🎉 CORRECT! You unlocked: {ten} (+ {diem} XP)!', '🎉 正解! 解除: {ten} (+ {diem} XP)!', '🎉 정답! 잠금 해제: {ten} (+ {diem} XP)!', '🎉 正确! 已解锁: {ten} (+ {diem} XP)!', '🎉 CORRECT ! Débloqué : {ten} (+ {diem} XP) !', '🎉 RICHTIG! Freigeschaltet: {ten} (+ {diem} XP)!', '🎉 ¡CORRECTO! Desbloqueaste: {ten} (+ {diem} XP)!'],
  'co.sai': ['❌ Cờ không hợp lệ: "{co}". Hãy kiểm tra lại định dạng!', '❌ Invalid flag: "{co}". Check the format!', '❌ 無効なフラグ: "{co}"。形式を確認してください!', '❌ 잘못된 플래그: "{co}". 형식을 확인하세요!', '❌ 无效的旗帜: "{co}"。请检查格式!', '❌ Drapeau invalide : "{co}". Vérifiez le format !', '❌ Ungültige Flagge: "{co}". Prüfe das Format!', '❌ Bandera no válida: "{co}". ¡Revisa el formato!']
} satisfies Record<string, Dich8>;

export type KhoaThongBao = keyof typeof THONG_BAO;
export type HamDich = (khoa: KhoaThongBao, bien?: Record<string, string | number>) => string;

export function taoHamDich(lang: () => string, khiLoi: () => void = () => {}): HamDich {
  return (khoa, bien) => {
    if (khoa.startsWith('loi.')) khiLoi();
    return chenBien(chonBan(THONG_BAO[khoa], lang()), bien);
  };
}

type DeCtf = { title: Dich8; desc: Dich8; hint: Dich8 };
const DE_CTF: Record<string, DeCtf> = {
  'ctf-1': {
    title: ['Challenge 1: Thám Tử Linux', 'Challenge 1: Linux Detective', 'Challenge 1: Linux 探偵', 'Challenge 1: 리눅스 탐정', 'Challenge 1: Linux 侦探', 'Challenge 1 : Détective Linux', 'Challenge 1: Linux-Detektiv', 'Challenge 1: Detective de Linux'],
    desc: ['Tìm kiếm tệp cờ ẩn đầu tiên trong thư mục cá nhân.', 'Find the first hidden flag file in your home directory.', 'ホームディレクトリにある最初の隠しフラグを探そう。', '홈 디렉터리에 숨은 첫 번째 플래그 파일을 찾으세요.', '在个人目录中找到第一个隐藏的旗帜文件。', 'Trouvez le premier fichier drapeau caché dans votre dossier personnel.', 'Finde die erste versteckte Flaggendatei in deinem Home-Verzeichnis.', 'Encuentra el primer archivo de bandera oculto en tu carpeta personal.'],
    hint: ['Dùng lệnh "ls -la" và "cat flag1.txt"', 'Use "ls -la" and "cat flag1.txt"', '"ls -la" と "cat flag1.txt" を使おう', '"ls -la" 와 "cat flag1.txt" 를 써 보세요', '使用 "ls -la" 和 "cat flag1.txt"', 'Utilisez "ls -la" et "cat flag1.txt"', 'Nutze "ls -la" und "cat flag1.txt"', 'Usa "ls -la" y "cat flag1.txt"']
  },
  'ctf-2': {
    title: ['Challenge 2: Giải Mã Base64', 'Challenge 2: Decode Base64', 'Challenge 2: Base64 を解読', 'Challenge 2: Base64 해독', 'Challenge 2: 解码 Base64', 'Challenge 2 : Décoder le Base64', 'Challenge 2: Base64 entschlüsseln', 'Challenge 2: Decodificar Base64'],
    desc: ['Admin đã lưu một đoạn chuỗi mã hóa trong "secret_b64.txt". Hãy giải mã nó.', 'The admin saved an encoded string in "secret_b64.txt". Decode it.', '管理者が "secret_b64.txt" に符号化した文字列を保存した。解読しよう。', '관리자가 "secret_b64.txt" 에 인코딩된 문자열을 저장했어요. 해독하세요.', '管理员在 "secret_b64.txt" 中保存了一段编码字符串，把它解码。', "L'admin a enregistré une chaîne encodée dans \"secret_b64.txt\". Décodez-la.", 'Der Admin hat in "secret_b64.txt" eine kodierte Zeichenkette gespeichert. Dekodiere sie.', 'El administrador guardó una cadena codificada en "secret_b64.txt". Decodifícala.'],
    hint: ['Dùng lệnh: cat secret_b64.txt | base64 -d hoặc base64 -d secret_b64.txt', 'Use: cat secret_b64.txt | base64 -d or base64 -d secret_b64.txt', '使い方: cat secret_b64.txt | base64 -d または base64 -d secret_b64.txt', '사용: cat secret_b64.txt | base64 -d 또는 base64 -d secret_b64.txt', '使用: cat secret_b64.txt | base64 -d 或 base64 -d secret_b64.txt', 'Utilisez : cat secret_b64.txt | base64 -d ou base64 -d secret_b64.txt', 'Nutze: cat secret_b64.txt | base64 -d oder base64 -d secret_b64.txt', 'Usa: cat secret_b64.txt | base64 -d o base64 -d secret_b64.txt']
  },
  'ctf-3': {
    title: ['Challenge 3: Điều Tra Nhật Ký (Log Forensics)', 'Challenge 3: Log Forensics', 'Challenge 3: ログ調査 (Log Forensics)', 'Challenge 3: 로그 포렌식', 'Challenge 3: 日志取证 (Log Forensics)', 'Challenge 3 : Analyse de journaux', 'Challenge 3: Log-Forensik', 'Challenge 3: Análisis forense de registros'],
    desc: ['Có dấu vết đăng nhập trái phép trong nhật ký xác thực "/var/log/auth.log".', 'There are traces of an unauthorized login in the auth log "/var/log/auth.log".', '認証ログ "/var/log/auth.log" に不正ログインの痕跡がある。', '인증 로그 "/var/log/auth.log" 에 무단 로그인 흔적이 있어요.', '认证日志 "/var/log/auth.log" 中有非法登录的痕迹。', "Le journal d'authentification \"/var/log/auth.log\" contient des traces de connexion non autorisée.", 'Im Auth-Log "/var/log/auth.log" gibt es Spuren eines unerlaubten Logins.', 'Hay rastros de un acceso no autorizado en el registro "/var/log/auth.log".'],
    hint: ['Dùng lệnh "cat /var/log/auth.log" hoặc "grep FLAG /var/log/auth.log"', 'Use "cat /var/log/auth.log" or "grep FLAG /var/log/auth.log"', '"cat /var/log/auth.log" か "grep FLAG /var/log/auth.log" を使おう', '"cat /var/log/auth.log" 또는 "grep FLAG /var/log/auth.log" 사용', '使用 "cat /var/log/auth.log" 或 "grep FLAG /var/log/auth.log"', 'Utilisez "cat /var/log/auth.log" ou "grep FLAG /var/log/auth.log"', 'Nutze "cat /var/log/auth.log" oder "grep FLAG /var/log/auth.log"', 'Usa "cat /var/log/auth.log" o "grep FLAG /var/log/auth.log"']
  },
  'ctf-4': {
    title: ['Challenge 4: Quét Cổng Mạng (Port Scanning)', 'Challenge 4: Port Scanning', 'Challenge 4: ポートスキャン', 'Challenge 4: 포트 스캔', 'Challenge 4: 端口扫描', 'Challenge 4 : Scan de ports', 'Challenge 4: Portscan', 'Challenge 4: Escaneo de puertos'],
    desc: ['Quét máy chủ mục tiêu "192.168.1.100" để tìm các dịch vụ đang mở.', 'Scan the target server "192.168.1.100" to find open services.', 'ターゲットサーバー "192.168.1.100" をスキャンして開いているサービスを探そう。', '대상 서버 "192.168.1.100" 을 스캔해 열린 서비스를 찾으세요.', '扫描目标服务器 "192.168.1.100"，找出开放的服务。', 'Scannez le serveur cible "192.168.1.100" pour trouver les services ouverts.', 'Scanne den Zielserver "192.168.1.100", um offene Dienste zu finden.', 'Escanea el servidor objetivo "192.168.1.100" para encontrar servicios abiertos.'],
    hint: ['Dùng lệnh: nmap 192.168.1.100', 'Use: nmap 192.168.1.100', '使い方: nmap 192.168.1.100', '사용: nmap 192.168.1.100', '使用: nmap 192.168.1.100', 'Utilisez : nmap 192.168.1.100', 'Nutze: nmap 192.168.1.100', 'Usa: nmap 192.168.1.100']
  },
  'ctf-5': {
    title: ['Challenge 5: Rò Rỉ Cấu Hình Web Server', 'Challenge 5: Web Server Config Leak', 'Challenge 5: Web サーバー設定の漏えい', 'Challenge 5: 웹 서버 설정 유출', 'Challenge 5: Web 服务器配置泄露', 'Challenge 5 : Fuite de config du serveur web', 'Challenge 5: Webserver-Konfigurationsleck', 'Challenge 5: Fuga de configuración del servidor web'],
    desc: ['Kiểm tra mã nguồn web server trong "/var/www/html/config.php" để lấy mật khẩu bí mật.', 'Inspect the web server code in "/var/www/html/config.php" to get the secret password.', '"/var/www/html/config.php" を調べて秘密のパスワードを手に入れよう。', '"/var/www/html/config.php" 를 살펴 비밀 비밀번호를 찾으세요.', '检查 "/var/www/html/config.php" 中的代码，拿到秘密密码。', 'Examinez "/var/www/html/config.php" pour obtenir le mot de passe secret.', 'Untersuche "/var/www/html/config.php", um das geheime Passwort zu finden.', 'Revisa "/var/www/html/config.php" para obtener la contraseña secreta.'],
    hint: ['Dùng lệnh: cat /var/www/html/config.php', 'Use: cat /var/www/html/config.php', '使い方: cat /var/www/html/config.php', '사용: cat /var/www/html/config.php', '使用: cat /var/www/html/config.php', 'Utilisez : cat /var/www/html/config.php', 'Nutze: cat /var/www/html/config.php', 'Usa: cat /var/www/html/config.php']
  },
  'ctf-6': {
    title: ['Challenge 6: Truy Tìm Backdoor Ẩn', 'Challenge 6: Hunt the Hidden Backdoor', 'Challenge 6: 隠れたバックドアを追え', 'Challenge 6: 숨은 백도어 추적', 'Challenge 6: 追踪隐藏后门', 'Challenge 6 : Traquer la backdoor cachée', 'Challenge 6: Die versteckte Hintertür finden', 'Challenge 6: Rastrear la puerta trasera oculta'],
    desc: ['Máy chủ mở một cổng lạ và có tiến trình chạy ngầm. Lần theo cổng đó để tìm tệp cấu hình của kẻ tấn công.', "The server has a strange open port and a hidden process. Follow that port to the attacker's config file.", 'サーバーに怪しいポートと隠れたプロセスがある。ポートをたどって攻撃者の設定ファイルを見つけよう。', '서버에 수상한 포트와 숨은 프로세스가 있어요. 그 포트를 따라 공격자의 설정 파일을 찾으세요.', '服务器开着一个奇怪的端口，还有后台进程。顺着端口找到攻击者的配置文件。', "Le serveur a un port étrange et un processus caché. Suivez ce port jusqu'au fichier de config de l'attaquant.", 'Der Server hat einen seltsamen offenen Port und einen versteckten Prozess. Folge dem Port zur Konfigurationsdatei des Angreifers.', 'El servidor tiene un puerto extraño y un proceso oculto. Sigue ese puerto hasta el archivo de configuración del atacante.'],
    hint: ['Dùng: netstat -tuln → ps aux → cat tệp cấu hình mà tiến trình lạ đang dùng', 'Use: netstat -tuln → ps aux → cat the config file the strange process uses', '使い方: netstat -tuln → ps aux → 怪しいプロセスが使う設定ファイルを cat', '사용: netstat -tuln → ps aux → 수상한 프로세스가 쓰는 설정 파일을 cat', '使用: netstat -tuln → ps aux → cat 可疑进程使用的配置文件', 'Utilisez : netstat -tuln → ps aux → cat du fichier de config du processus suspect', 'Nutze: netstat -tuln → ps aux → cat der Konfigurationsdatei des seltsamen Prozesses', 'Usa: netstat -tuln → ps aux → cat del archivo de configuración del proceso extraño']
  },
  'ctf-7': {
    title: ['Challenge 7: Rò Rỉ Qua HTTP Header', 'Challenge 7: HTTP Header Leak', 'Challenge 7: HTTP ヘッダーからの漏えい', 'Challenge 7: HTTP 헤더 유출', 'Challenge 7: HTTP 头泄露', 'Challenge 7 : Fuite par en-tête HTTP', 'Challenge 7: Leck über HTTP-Header', 'Challenge 7: Fuga por cabecera HTTP'],
    desc: ['Web server trên máy này để lộ thông tin qua header phản hồi. Tìm token debug bị quên tắt.', 'The web server on this machine leaks information in its response headers. Find the debug token someone forgot to turn off.', 'このマシンの Web サーバーはレスポンスヘッダーで情報を漏らしている。消し忘れたデバッグトークンを探そう。', '이 컴퓨터의 웹 서버가 응답 헤더로 정보를 흘리고 있어요. 끄지 않은 디버그 토큰을 찾으세요.', '这台机器的 Web 服务器在响应头中泄露了信息。找出忘记关闭的调试令牌。', 'Le serveur web de cette machine laisse fuiter des infos dans ses en-têtes de réponse. Trouvez le jeton de débogage oublié.', 'Der Webserver dieser Maschine verrät Informationen in seinen Antwort-Headern. Finde das vergessene Debug-Token.', 'El servidor web de esta máquina filtra información en sus cabeceras de respuesta. Encuentra el token de depuración olvidado.'],
    hint: ['Dùng: curl -I http://localhost (chỉ xem header) hoặc curl -i http://localhost', 'Use: curl -I http://localhost (headers only) or curl -i http://localhost', '使い方: curl -I http://localhost (ヘッダーのみ) または curl -i http://localhost', '사용: curl -I http://localhost (헤더만) 또는 curl -i http://localhost', '使用: curl -I http://localhost (只看响应头) 或 curl -i http://localhost', 'Utilisez : curl -I http://localhost (en-têtes seuls) ou curl -i http://localhost', 'Nutze: curl -I http://localhost (nur Header) oder curl -i http://localhost', 'Usa: curl -I http://localhost (solo cabeceras) o curl -i http://localhost']
  }
};

export function dichThuThach<T extends { id: string; title: string; desc: string; hint: string }>(c: T, lang: string): T {
  const d = DE_CTF[c.id];
  return d ? { ...c, title: chonBan(d.title, lang), desc: chonBan(d.desc, lang), hint: chonBan(d.hint, lang) } : c;
}

export const TEP_MAC_DINH: Record<string, Dich8> = {
  '/home/hacker/readme.txt': [
    'Chào mừng chiến binh An ninh mạng! Hãy dùng các lệnh Linux (ls, cat, grep, nmap, base64) để tìm cờ ẩn trong hệ thống.',
    'Welcome, cyber security warrior! Use Linux commands (ls, cat, grep, nmap, base64) to find the flags hidden in this system.',
    'ようこそ、サイバーセキュリティの戦士! Linux コマンド (ls, cat, grep, nmap, base64) でシステムに隠れたフラグを探そう。',
    '사이버 보안 전사여, 환영합니다! Linux 명령 (ls, cat, grep, nmap, base64) 으로 시스템에 숨은 플래그를 찾으세요.',
    '欢迎，网络安全战士！用 Linux 命令 (ls, cat, grep, nmap, base64) 找出系统中隐藏的旗帜。',
    'Bienvenue, guerrier de la cybersécurité ! Utilisez les commandes Linux (ls, cat, grep, nmap, base64) pour trouver les drapeaux cachés.',
    'Willkommen, Cybersecurity-Krieger! Finde mit Linux-Befehlen (ls, cat, grep, nmap, base64) die versteckten Flaggen im System.',
    '¡Bienvenido, guerrero de la ciberseguridad! Usa comandos de Linux (ls, cat, grep, nmap, base64) para encontrar las banderas ocultas.'
  ],
  '/home/hacker/notes.md': [
    '# Ghi chú của Admin:\n- Mật khẩu server test: admin123\n- Web server đang chạy ở cổng 8080\n- Đã sao lưu hash trong /etc/shadow',
    "# Admin's notes:\n- Test server password: admin123\n- Web server is running on port 8080\n- Hashes backed up in /etc/shadow",
    '# 管理者メモ:\n- テストサーバーのパスワード: admin123\n- Web サーバーはポート 8080 で稼働中\n- ハッシュは /etc/shadow にバックアップ済み',
    '# 관리자 메모:\n- 테스트 서버 비밀번호: admin123\n- 웹 서버는 8080 포트에서 실행 중\n- 해시는 /etc/shadow 에 백업함',
    '# 管理员笔记:\n- 测试服务器密码: admin123\n- Web 服务器运行在 8080 端口\n- 哈希已备份到 /etc/shadow',
    "# Notes de l'admin :\n- Mot de passe du serveur de test : admin123\n- Le serveur web tourne sur le port 8080\n- Hachages sauvegardés dans /etc/shadow",
    '# Notizen des Admins:\n- Passwort des Testservers: admin123\n- Webserver läuft auf Port 8080\n- Hashes in /etc/shadow gesichert',
    '# Notas del administrador:\n- Contraseña del servidor de pruebas: admin123\n- El servidor web corre en el puerto 8080\n- Hashes respaldados en /etc/shadow'
  ],
  '/flag/README.txt': [
    'Cờ không để sẵn ở đây đâu.\nHãy tự truy tìm trong hệ thống bằng: ls -la, cat, grep, find, ps, netstat, nmap, curl.',
    'The flags are not stored here.\nHunt for them yourself with: ls -la, cat, grep, find, ps, netstat, nmap, curl.',
    'フラグはここにはありません。\n自分で探そう: ls -la, cat, grep, find, ps, netstat, nmap, curl。',
    '플래그는 여기 없어요.\n직접 찾아보세요: ls -la, cat, grep, find, ps, netstat, nmap, curl.',
    '旗帜不在这里。\n自己去找: ls -la, cat, grep, find, ps, netstat, nmap, curl。',
    'Les drapeaux ne sont pas ici.\nCherchez-les vous-même avec : ls -la, cat, grep, find, ps, netstat, nmap, curl.',
    'Die Flaggen liegen nicht hier.\nSuche sie selbst mit: ls -la, cat, grep, find, ps, netstat, nmap, curl.',
    'Las banderas no están aquí.\nBúscalas tú mismo con: ls -la, cat, grep, find, ps, netstat, nmap, curl.'
  ]
};
