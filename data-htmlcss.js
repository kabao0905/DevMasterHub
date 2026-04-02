// HTML/CSS Full Curriculum
const DATA_HTMLCSS = {
id:'htmlcss', name:'HTML/CSS', icon:'🎨', color:'#E44D26',
gradient:'linear-gradient(135deg,#E44D26,#264DE4)',
category:'frontend',
description:'Web fundamentals, responsive design, animations, modern CSS',
levels:[
  {id:'newbie',name:'Newbie',badge:'newbie',desc:'HTML5 & CSS cơ bản',lessons:[
    {id:'html5',title:'HTML5 Semantic & Structure',
     theory:'<p>HTML5 dùng <strong>semantic tags</strong>: <code>header, nav, main, article, section, footer</code> — giúp SEO và accessibility. <code>form</code> elements có validation built-in.</p>',
     code:'<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Portfolio</title>\n</head>\n<body>\n  <header>\n    <nav>\n      <a href="#about">About</a>\n      <a href="#skills">Skills</a>\n    </nav>\n  </header>\n  <main>\n    <article>\n      <h1>DevMaster</h1>\n      <p>Full-stack developer</p>\n    </article>\n    <section id="skills">\n      <h2>Skills</h2>\n      <ul>\n        <li>HTML & CSS</li>\n        <li>JavaScript</li>\n      </ul>\n    </section>\n  </main>\n  <footer>\n    <p>&copy; 2025 DevMaster</p>\n  </footer>\n</body>\n</html>',
     lang:'html',
     keyPoints:['Semantic tags: header, nav, main, section, article, footer','meta viewport cho responsive mobile','Heading hierarchy: h1 → h6, chỉ 1 h1 mỗi page'],
     exercise:'Tạo trang portfolio cá nhân với đầy đủ semantic HTML.'},

    {id:'css-basics',title:'CSS Selectors & Box Model',
     theory:'<p><strong>Box Model</strong>: content → padding → border → margin. <code>box-sizing: border-box</code> bao gồm padding/border trong width. Selectors: element, .class, #id, [attr], :pseudo-class.</p>',
     code:'/* Reset & Box Model */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n/* Selectors */\n.card {\n  background: #1a1a2e;\n  border-radius: 12px;\n  padding: 24px;\n  margin: 16px;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 24px rgba(0,0,0,0.3);\n}\n\n/* Specificity: inline > #id > .class > element */\nh1 { font-size: 2rem; }          /* 0,0,1 */\n.title { color: #61dafb; }       /* 0,1,0 */\n#main-title { font-weight: 700; }/* 1,0,0 */\n\n/* Pseudo-classes & pseudo-elements */\n.list li:nth-child(odd) { background: #16213e; }\n.list li:first-child { font-weight: bold; }\n.btn::before { content: "→ "; }',
     lang:'css',
     keyPoints:['box-sizing: border-box mặc định cho mọi project','Specificity: inline(1000) > id(100) > class(10) > tag(1)','Pseudo: :hover, :focus, :nth-child() | ::before, ::after'],
     exercise:'Style một card component với hover effects và box shadow.'},

    {id:'typography',title:'Typography, Colors & Units',
     theory:'<p>Chọn font: Google Fonts hoặc system fonts. Units: <code>rem</code> cho font-size, <code>em</code> cho spacing, <code>%/vw/vh</code> cho layout. Colors: HSL dễ điều chỉnh hơn HEX.</p>',
     code:'/* Google Fonts */\n@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");\n\n:root {\n  /* Color system - HSL */\n  --primary: hsl(220, 90%, 56%);\n  --primary-light: hsl(220, 90%, 70%);\n  --bg: hsl(220, 20%, 10%);\n  --text: hsl(220, 10%, 90%);\n  --text-muted: hsl(220, 10%, 60%);\n\n  /* Typography scale */\n  --fs-xs: 0.75rem;   /* 12px */\n  --fs-sm: 0.875rem;  /* 14px */\n  --fs-base: 1rem;    /* 16px */\n  --fs-lg: 1.25rem;   /* 20px */\n  --fs-xl: 1.5rem;    /* 24px */\n  --fs-2xl: 2rem;     /* 32px */\n  --fs-3xl: 3rem;     /* 48px */\n}\n\nbody {\n  font-family: "Inter", system-ui, sans-serif;\n  font-size: var(--fs-base);\n  color: var(--text);\n  background: var(--bg);\n  line-height: 1.6;\n}\n\nh1 { font-size: var(--fs-3xl); line-height: 1.2; }\nh2 { font-size: var(--fs-2xl); }\n.muted { color: var(--text-muted); font-size: var(--fs-sm); }',
     lang:'css',
     keyPoints:['rem = relative to root font-size (16px default)','HSL(hue, saturation%, lightness%) dễ tạo color palettes','CSS Variables (--name) cho design tokens tái sử dụng'],
     exercise:'Tạo design system với color palette, typography scale, spacing.'}
  ]},

  {id:'junior',name:'Junior',badge:'junior',desc:'Flexbox, Grid & Responsive',lessons:[
    {id:'flexbox',title:'Flexbox Layout',
     theory:'<p><strong>Flexbox</strong> cho 1D layout (row hoặc column). Container: <code>display: flex</code>, items tự align. <code>justify-content</code> theo main axis, <code>align-items</code> theo cross axis.</p>',
     code:'.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n  gap: 16px;\n}\n\n.nav-links {\n  display: flex;\n  gap: 24px;\n  list-style: none;\n}\n\n/* Card row */\n.card-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.card {\n  flex: 1 1 300px; /* grow, shrink, basis */\n  min-width: 0; /* prevent overflow */\n}\n\n/* Centering */\n.hero {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  text-align: center;\n}\n\n/* Holy grail footer */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n.page main { flex: 1; } /* fills remaining space */\n.page footer { margin-top: auto; }',
     lang:'css',
     keyPoints:['flex: grow shrink basis — shorthand cho item sizing','gap thay margin cho spacing giữa flex items','justify-content: main axis, align-items: cross axis'],
     exercise:'Tạo responsive navbar + card grid chỉ dùng flexbox.'},

    {id:'grid',title:'CSS Grid Layout',
     theory:'<p><strong>Grid</strong> cho 2D layout (rows + columns). <code>grid-template-columns/rows</code> định nghĩa layout. <code>fr</code> unit chia không gian linh hoạt. <code>grid-area</code> cho named areas.</p>',
     code:'.dashboard {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 60px 1fr 40px;\n  grid-template-areas:\n    "sidebar header"\n    "sidebar main"\n    "sidebar footer";\n  min-height: 100vh;\n}\n\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }\n\n/* Auto-fit card grid */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 24px;\n  padding: 24px;\n}\n\n/* Responsive without media queries! */\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 16px;\n}\n\n/* Span multiple cells */\n.featured {\n  grid-column: span 2;\n  grid-row: span 2;\n}',
     lang:'css',
     keyPoints:['fr unit: chia proportional space (1fr 2fr = 1:2)','repeat(auto-fit, minmax(280px, 1fr)) responsive không media query','grid-template-areas cho visual layout definition'],
     exercise:'Tạo dashboard layout với Grid: sidebar, header, main, widgets.'},

    {id:'responsive',title:'Responsive Design & Media Queries',
     theory:'<p><strong>Mobile-first</strong>: viết CSS cho mobile trước, dùng <code>min-width</code> media queries cho màn hình lớn hơn. <code>clamp()</code> cho fluid typography. Container queries (CSS 2023) cho component-level responsiveness.</p>',
     code:'/* Mobile-first approach */\n.container {\n  width: 100%;\n  padding: 16px;\n  margin: 0 auto;\n}\n\n/* Fluid typography */\nh1 {\n  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);\n}\n\n/* Breakpoints */\n@media (min-width: 640px) {\n  .container { max-width: 640px; }\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (min-width: 1024px) {\n  .container { max-width: 1024px; }\n  .grid { grid-template-columns: repeat(3, 1fr); }\n  .sidebar { display: block; }\n}\n\n/* Container Queries (modern) */\n.card-wrapper {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    flex-direction: row;\n  }\n}\n\n/* Responsive images */\nimg {\n  max-width: 100%;\n  height: auto;\n  object-fit: cover;\n}',
     lang:'css',
     keyPoints:['Mobile-first: base styles mobile, min-width breakpoints up','clamp(min, preferred, max) cho fluid sizing','Container queries: responsive theo container, không viewport'],
     exercise:'Redesign một trang web desktop-only thành responsive mobile-first.'}
  ]},

  {id:'mid',name:'Mid-Level',badge:'mid',desc:'Animations, Variables & Modern CSS',lessons:[
    {id:'animations',title:'Transitions & Animations',
     theory:'<p><code>transition</code> cho state changes mượt mà. <code>@keyframes</code> cho animations phức tạp. <code>transform</code> (translate, scale, rotate) hardware-accelerated → smooth 60fps.</p>',
     code:'/* Transition */\n.btn {\n  background: hsl(220, 90%, 56%);\n  padding: 12px 24px;\n  border-radius: 8px;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.btn:hover {\n  background: hsl(220, 90%, 46%);\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px hsla(220, 90%, 56%, 0.4);\n}\n\n/* Keyframes animation */\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.card {\n  animation: slideIn 0.5s ease-out forwards;\n}\n\n/* Staggered animations */\n.card:nth-child(1) { animation-delay: 0.1s; }\n.card:nth-child(2) { animation-delay: 0.2s; }\n.card:nth-child(3) { animation-delay: 0.3s; }\n\n/* Loading spinner */\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n.spinner {\n  width: 40px; height: 40px;\n  border: 3px solid rgba(255,255,255,0.1);\n  border-top-color: hsl(220, 90%, 56%);\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}',
     lang:'css',
     keyPoints:['transition: property duration timing-function cho smooth changes','transform + opacity được GPU accelerated → smooth 60fps','animation-delay cho staggered effects'],
     exercise:'Tạo animated card grid với staggered entrance animations.'},

    {id:'modern-css',title:'Modern CSS: has(), nesting, layers',
     theory:'<p>CSS mới (2023-2025): <code>:has()</code> parent selector, <code>nesting</code> native, <code>@layer</code> cascade control, <code>color-mix()</code>, <code>view transitions</code>. Không cần preprocessor!</p>',
     code:'/* Native CSS Nesting */\n.card {\n  background: var(--surface);\n  border-radius: 12px;\n  padding: 24px;\n\n  & .title {\n    font-size: 1.25rem;\n    font-weight: 600;\n  }\n\n  & .body {\n    color: var(--text-muted);\n    margin-top: 8px;\n  }\n\n  &:hover {\n    transform: translateY(-4px);\n  }\n\n  &.featured {\n    border: 2px solid var(--primary);\n  }\n}\n\n/* :has() - parent selector */\n.form-group:has(input:invalid) {\n  border-color: red;\n}\n\n.card:has(img) {\n  padding-top: 0; /* remove top padding if has image */\n}\n\n/* color-mix() */\n.btn-hover {\n  background: color-mix(in srgb, var(--primary), black 20%);\n}\n\n/* @layer - cascade control */\n@layer reset, base, components, utilities;\n\n@layer reset {\n  * { margin: 0; box-sizing: border-box; }\n}\n\n@layer components {\n  .btn { padding: 12px 24px; }\n}',
     lang:'css',
     keyPoints:[':has() selector chọn parent dựa trên children','Native nesting: & thay cho SASS nesting','@layer kiểm soát cascade priority'],
     exercise:'Refactor SCSS codebase sang pure modern CSS.'},

    {id:'accessibility',title:'Accessibility (a11y)',
     theory:'<p>Web accessibility đảm bảo tất cả users truy cập được, kể cả người khuyết tật. <code>ARIA</code> attributes, keyboard navigation, focus management, color contrast. WCAG 2.1 AA standard.</p>',
     code:'<!-- Accessible button -->\n<button\n  aria-label="Close dialog"\n  aria-expanded="false"\n  class="icon-btn"\n>\n  <svg>...</svg>\n</button>\n\n<!-- Skip navigation -->\n<a href="#main-content" class="skip-link">\n  Skip to main content\n</a>\n\n<!-- Accessible form -->\n<form role="form" aria-label="Registration">\n  <div class="field">\n    <label for="email">Email *</label>\n    <input\n      id="email"\n      type="email"\n      required\n      aria-describedby="email-help"\n      aria-invalid="false"\n    />\n    <small id="email-help">We will never share your email</small>\n  </div>\n</form>\n\n<style>\n/* Focus visible */\n:focus-visible {\n  outline: 2px solid var(--primary);\n  outline-offset: 2px;\n}\n\n/* Skip link */\n.skip-link {\n  position: absolute;\n  top: -100%;\n  left: 16px;\n}\n.skip-link:focus {\n  top: 16px;\n  z-index: 1000;\n}\n\n/* Reduced motion */\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n</style>',
     lang:'html',
     keyPoints:['aria-label, aria-expanded, role cho screen readers',':focus-visible thay :focus, chỉ show cho keyboard users','prefers-reduced-motion respect user motion preferences'],
     exercise:'Audit và fix accessibility issues trên một trang web, đạt WCAG AA.'}
  ]},

  {id:'senior',name:'Senior',badge:'senior',desc:'CSS Architecture & Design Systems',lessons:[
    {id:'architecture',title:'CSS Architecture & Methodology',
     theory:'<p>CSS at scale cần architecture: <strong>BEM</strong> naming, <strong>CSS Modules</strong>, <strong>CSS-in-JS</strong>. Design tokens cho consistency. Theme switching. Performance: Critical CSS, content-visibility.</p>',
     code:'/* BEM Methodology */\n.card { /* Block */ }\n.card__title { /* Element */ }\n.card__title--highlighted { /* Modifier */ }\n.card--featured { /* Block modifier */ }\n\n/* Design Token Architecture */\n:root {\n  /* Primitive tokens */\n  --blue-50: hsl(220, 90%, 95%);\n  --blue-500: hsl(220, 90%, 56%);\n  --blue-900: hsl(220, 90%, 15%);\n  --gray-800: hsl(220, 15%, 15%);\n\n  /* Semantic tokens */\n  --color-primary: var(--blue-500);\n  --color-surface: var(--gray-800);\n  --color-text: hsl(0, 0%, 92%);\n  --radius-sm: 4px;\n  --radius-md: 8px;\n  --radius-lg: 16px;\n  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);\n  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);\n}\n\n/* Dark/Light theme */\n[data-theme="light"] {\n  --color-surface: hsl(0, 0%, 98%);\n  --color-text: hsl(0, 0%, 10%);\n}\n\n/* Performance */\n.offscreen-section {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 500px;\n}',
     lang:'css',
     keyPoints:['BEM: Block__Element--Modifier cho naming convention','Design tokens: primitive → semantic → component levels','content-visibility: auto cho lazy rendering offscreen content'],
     exercise:'Xây design system với themes, tokens, và documentation.'},

    {id:'design-system',title:'Building Design Systems',
     theory:'<p>Design system = tokens + components + patterns + documentation. Storybook cho component showcase. Figma → CSS pipeline. Versioning và distribution.</p>',
     code:'/* Component library with CSS custom properties */\n\n/* Button component */\n.btn {\n  --btn-bg: var(--color-primary);\n  --btn-color: white;\n  --btn-radius: var(--radius-md);\n  --btn-padding: 10px 20px;\n  --btn-font-size: var(--fs-sm);\n\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: var(--btn-padding);\n  font-size: var(--btn-font-size);\n  font-weight: 600;\n  color: var(--btn-color);\n  background: var(--btn-bg);\n  border: none;\n  border-radius: var(--btn-radius);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.btn--sm { --btn-padding: 6px 12px; --btn-font-size: var(--fs-xs); }\n.btn--lg { --btn-padding: 14px 28px; --btn-font-size: var(--fs-base); }\n\n.btn--outline {\n  --btn-bg: transparent;\n  --btn-color: var(--color-primary);\n  border: 2px solid var(--color-primary);\n}\n\n.btn--ghost {\n  --btn-bg: transparent;\n  --btn-color: var(--color-primary);\n}\n\n.btn:hover { filter: brightness(1.1); }\n.btn:active { transform: scale(0.98); }',
     lang:'css',
     keyPoints:['Component-level CSS variables cho theming flexibility','Variants qua modifier classes: --sm, --outline, --ghost','Design tokens bridge Figma designs → code implementation'],
     exercise:'Tạo mini design system: Button, Input, Card, Modal, Toast.'}
  ]},

  {id:'master',name:'Master',badge:'master',desc:'Advanced CSS & Houdini',lessons:[
    {id:'advanced',title:'Advanced CSS Techniques',
     theory:'<p>CSS scroll-driven animations, view transitions API, anchor positioning, popover API. Subgrid cho complex nested layouts. Custom properties animation.</p>',
     code:'/* Scroll-driven animations */\n@keyframes reveal {\n  from { opacity: 0; transform: translateY(50px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.reveal-on-scroll {\n  animation: reveal linear both;\n  animation-timeline: view();\n  animation-range: entry 0% entry 50%;\n}\n\n/* View Transitions API */\n::view-transition-old(main) {\n  animation: slideOut 0.3s ease-in;\n}\n::view-transition-new(main) {\n  animation: slideIn 0.3s ease-out;\n}\n\n.main-content {\n  view-transition-name: main;\n}\n\n/* Subgrid */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}\n.card {\n  display: grid;\n  grid-template-rows: subgrid;\n  grid-row: span 3; /* header, body, footer aligned across cards */\n}\n\n/* @property for animatable custom props */\n@property --gradient-angle {\n  syntax: "<angle>";\n  initial-value: 0deg;\n  inherits: false;\n}\n.gradient-border {\n  background: conic-gradient(from var(--gradient-angle), #f00, #0f0, #00f, #f00);\n  animation: rotate 3s linear infinite;\n}\n@keyframes rotate { to { --gradient-angle: 360deg; } }',
     lang:'css',
     keyPoints:['Scroll-driven animations: animation-timeline: view()','View Transitions API cho page transition effects','@property: custom properties có thể animate'],
     exercise:'Tạo trang web với scroll animations và view transitions.'},

    {id:'houdini',title:'CSS Houdini & Paint API',
     theory:'<p><strong>Houdini</strong> mở rộng CSS engine. <code>Paint API</code> vẽ custom backgrounds. <code>Layout API</code> custom layout algorithms. <code>Properties & Values API</code> typed custom properties.</p>',
     code:'// Paint Worklet (paint.js)\nclass DotPattern {\n  static get inputProperties() {\n    return ["--dot-color", "--dot-size", "--dot-spacing"];\n  }\n\n  paint(ctx, size, props) {\n    const color = props.get("--dot-color").toString() || "#333";\n    const dotSize = parseInt(props.get("--dot-size")) || 2;\n    const spacing = parseInt(props.get("--dot-spacing")) || 20;\n\n    ctx.fillStyle = color;\n    for (let x = 0; x < size.width; x += spacing) {\n      for (let y = 0; y < size.height; y += spacing) {\n        ctx.beginPath();\n        ctx.arc(x, y, dotSize, 0, Math.PI * 2);\n        ctx.fill();\n      }\n    }\n  }\n}\n\nregisterPaint("dots", DotPattern);\n\n/* Usage in CSS */\n.dotted-bg {\n  --dot-color: rgba(255, 255, 255, 0.1);\n  --dot-size: 1;\n  --dot-spacing: 24;\n  background-image: paint(dots);\n}',
     lang:'javascript',
     keyPoints:['CSS.registerProperty() cho typed, animatable custom properties','Paint API: custom backgrounds drawn with Canvas API','Layout API: create custom layout algorithms (masonry, etc)'],
     exercise:'Tạo custom paint worklet cho gradient border animation.'}
  ]}
]
};
