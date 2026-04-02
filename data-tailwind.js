// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Tailwind CSS Curriculum (Frontend)
// ═══════════════════════════════════════════════════════════════
const DATA_TAILWIND = {
  id:'tailwind', name:'Tailwind CSS', icon:'🎐', color:'#06B6D4',
  gradient:'linear-gradient(135deg,#06B6D4,#8B5CF6)',
  category:'frontend',
  description:'Utility-first CSS framework — rapid UI development, customizable',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Utility-first basics',lessons:[
      {id:'intro',title:'Tailwind CSS Introduction',
       theory:'<p><b>Tailwind CSS</b> = utility-first framework. Thay vì viết CSS custom, dùng class utilities trực tiếp trong HTML.</p><p>Advantages: rapid development, consistent design, small bundle (purge unused).</p>',
       code:'<!-- Traditional CSS -->\n<style>\n.btn { padding: 8px 16px; background: blue; color: white; border-radius: 8px; }\n</style>\n<button class="btn">Click me</button>\n\n<!-- Tailwind CSS -->\n<button class="px-4 py-2 bg-blue-500 text-white rounded-lg\n               hover:bg-blue-600 transition-colors">\n  Click me\n</button>\n\n<!-- Responsive -->\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n  <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">\n    Card 1\n  </div>\n</div>',
       lang:'markup',
       keyPoints:['Utility classes thay CSS custom','Responsive: sm:, md:, lg:','hover:, focus: pseudo-class','dark: dark mode support'],
       exercise:'Tạo hero section dùng Tailwind utilities'},
      {id:'layout',title:'Layout & Flexbox/Grid',
       theory:'<p>Tailwind layout: flex, grid, container, spacing. Responsive-first approach.</p>',
       code:'<!-- Flexbox navigation -->\n<nav class="flex items-center justify-between p-4 bg-white shadow">\n  <div class="text-xl font-bold text-blue-600">Logo</div>\n  <div class="hidden md:flex space-x-6">\n    <a href="#" class="text-gray-700 hover:text-blue-500">Home</a>\n    <a href="#" class="text-gray-700 hover:text-blue-500">About</a>\n    <a href="#" class="text-gray-700 hover:text-blue-500">Contact</a>\n  </div>\n</nav>\n\n<!-- Grid layout -->\n<div class="container mx-auto px-4 py-8">\n  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\n    <div class="aspect-square bg-gradient-to-br from-purple-500\n                to-pink-500 rounded-2xl flex items-center justify-center\n                text-white text-2xl font-bold shadow-xl\n                hover:scale-105 transition-transform">\n      01\n    </div>\n  </div>\n</div>',
       lang:'markup',
       keyPoints:['flex, items-center, justify-between','grid, grid-cols-{n}, gap-{n}','container mx-auto','space-x/y for spacing'],
       exercise:'Tạo responsive dashboard layout'},
      {id:'components',title:'Building UI Components',
       theory:'<p>Tạo components phổ biến: cards, buttons, modals, forms dùng Tailwind.</p>',
       code:'<!-- Modern Card -->\n<div class="max-w-sm rounded-2xl overflow-hidden bg-white\n            dark:bg-gray-800 shadow-xl hover:shadow-2xl\n            transition-shadow duration-300">\n  <img class="w-full h-48 object-cover" src="image.jpg" alt="">\n  <div class="p-6">\n    <span class="inline-block px-3 py-1 text-xs font-semibold\n                 bg-blue-100 text-blue-800 rounded-full">New</span>\n    <h3 class="mt-3 text-xl font-bold text-gray-900\n              dark:text-white">Card Title</h3>\n    <p class="mt-2 text-gray-600 dark:text-gray-300\n             line-clamp-2">Description here...</p>\n    <button class="mt-4 w-full py-2 bg-gradient-to-r from-blue-500\n                   to-purple-600 text-white rounded-lg font-medium\n                   hover:from-blue-600 hover:to-purple-700\n                   transition-all">\n      Learn More\n    </button>\n  </div>\n</div>',
       lang:'markup',
       keyPoints:['Gradient: from-{color} to-{color}','Hover states: hover:','Transition animations','Dark mode: dark:'],
       exercise:'Tạo pricing card component'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Customization & Theming',lessons:[
      {id:'config',title:'Customizing Tailwind Config',
       theory:'<p>tailwind.config.js cho custom colors, fonts, breakpoints, plugins.</p>',
       code:'// tailwind.config.js\nmodule.exports = {\n  content: [\'./src/**/*.{html,js,jsx,tsx}\'],\n  darkMode: \'class\',\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n          50: \'#eff6ff\',\n          500: \'#3b82f6\',\n          900: \'#1e3a5f\'\n        }\n      },\n      fontFamily: {\n        sans: [\'Inter\', \'sans-serif\'],\n        mono: [\'JetBrains Mono\', \'monospace\']\n      },\n      animation: {\n        \'slide-up\': \'slideUp 0.3s ease-out\',\n        \'fade-in\': \'fadeIn 0.5s ease-in\'\n      },\n      keyframes: {\n        slideUp: {\n          \'0%\': { transform: \'translateY(10px)\', opacity: 0 },\n          \'100%\': { transform: \'translateY(0)\', opacity: 1 }\n        }\n      }\n    }\n  },\n  plugins: [require(\'@tailwindcss/forms\'), require(\'@tailwindcss/typography\')]\n}',
       lang:'javascript',
       keyPoints:['Custom color palette','Extended animations','Plugin system','Content paths for purging'],
       exercise:'Tạo custom design system trong config'},
      {id:'directives',title:'@apply & Custom Utilities',
       theory:'<p>@apply gom utilities thành class reusable. @layer cho custom utilities.</p>',
       code:'/* globals.css */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  body {\n    @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100;\n  }\n}\n\n@layer components {\n  .btn-primary {\n    @apply px-4 py-2 bg-brand-500 text-white rounded-lg\n           font-medium hover:bg-brand-600\n           focus:outline-none focus:ring-2 focus:ring-brand-500\n           focus:ring-offset-2 transition-colors;\n  }\n\n  .card {\n    @apply bg-white dark:bg-gray-800 rounded-2xl\n           shadow-lg hover:shadow-xl transition-shadow\n           p-6 border border-gray-100 dark:border-gray-700;\n  }\n\n  .input {\n    @apply w-full px-4 py-2 rounded-lg border border-gray-300\n           dark:border-gray-600 bg-white dark:bg-gray-700\n           focus:ring-2 focus:ring-brand-500 focus:border-transparent;\n  }\n}',
       lang:'css',
       keyPoints:['@apply = reuse utilities','@layer base/components/utilities','Custom component classes','Design tokens'],
       exercise:'Tạo component library với @apply'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Advanced patterns',lessons:[
      {id:'animation',title:'Animations & Transitions',
       theory:'<p>Tailwind animations: transition, transform, keyframes, animate-*.</p>',
       code:'<!-- Hover effects -->\n<div class="group relative overflow-hidden rounded-2xl cursor-pointer">\n  <img class="w-full h-64 object-cover transition-transform\n              duration-500 group-hover:scale-110" src="photo.jpg">\n  <div class="absolute inset-0 bg-gradient-to-t from-black/70\n              to-transparent opacity-0 group-hover:opacity-100\n              transition-opacity duration-300">\n    <div class="absolute bottom-4 left-4 text-white\n                translate-y-4 group-hover:translate-y-0\n                transition-transform duration-300">\n      <h3 class="text-xl font-bold">Title</h3>\n      <p class="text-sm text-gray-200">Description</p>\n    </div>\n  </div>\n</div>\n\n<!-- Loading skeleton -->\n<div class="animate-pulse space-y-4">\n  <div class="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>\n  <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>\n  <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>\n</div>',
       lang:'markup',
       keyPoints:['group / group-hover pattern','Transition duration/ease','animate-pulse skeleton','Transform utilities'],
       exercise:'Tạo image gallery với hover effects'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Tailwind v4 & Design Systems',lessons:[
      {id:'v4',title:'Tailwind CSS v4 Features',
       theory:'<p>Tailwind v4: CSS-first config, container queries, 3D transforms, color-mix().</p>',
       code:'/* Tailwind v4 — CSS-first config */\n@import "tailwindcss";\n\n@theme {\n  --color-brand: #3b82f6;\n  --font-sans: "Inter", sans-serif;\n  --breakpoint-xs: 475px;\n}\n\n/* Container queries */\n<div class="@container">\n  <div class="@sm:flex @lg:grid @lg:grid-cols-2">\n    <p class="@md:text-lg">Responsive to container!</p>\n  </div>\n</div>\n\n/* 3D transforms */\n<div class="perspective-500">\n  <div class="rotate-y-12 hover:rotate-y-0 transition-transform\n              duration-500 preserve-3d">\n    3D Card\n  </div>\n</div>',
       lang:'css',
       keyPoints:['CSS-first @theme config','Container queries @container','3D transforms','color-mix() colors'],
       exercise:'Migrate Tailwind v3 project to v4'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Production Design Systems',lessons:[
      {id:'system',title:'Design System Architecture',
       theory:'<p>Production design system: tokens, components, documentation, accessibility.</p>',
       code:'// Design tokens → Tailwind config\nconst tokens = {\n  colors: {\n    primary: { DEFAULT: \'#2563EB\', hover: \'#1D4ED8\', light: \'#DBEAFE\' },\n    semantic: { success: \'#16A34A\', error: \'#DC2626\', warning: \'#F59E0B\' }\n  },\n  spacing: { xs: \'0.25rem\', sm: \'0.5rem\', md: \'1rem\', lg: \'1.5rem\', xl: \'2rem\' },\n  radii: { sm: \'0.375rem\', md: \'0.5rem\', lg: \'1rem\', full: \'9999px\' }\n};\n\n// Component variants with class-variance-authority\nimport { cva } from \'class-variance-authority\';\n\nconst button = cva(\n  \'inline-flex items-center font-medium rounded-lg transition-colors\',\n  {\n    variants: {\n      intent: {\n        primary: \'bg-primary text-white hover:bg-primary-hover\',\n        secondary: \'bg-gray-100 text-gray-900 hover:bg-gray-200\'\n      },\n      size: {\n        sm: \'px-3 py-1.5 text-sm\',\n        md: \'px-4 py-2 text-base\',\n        lg: \'px-6 py-3 text-lg\'\n      }\n    },\n    defaultVariants: { intent: \'primary\', size: \'md\' }\n  }\n);',
       lang:'javascript',
       keyPoints:['Design tokens','CVA variants','Consistent API','Documentation'],
       exercise:'Build complete design system with CVA'}
    ]}
  ]
};
