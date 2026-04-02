/* DevMaster Hub — Merge all modular curriculum data into CURRICULUM */

// Merge expanded modular data (overrides old minimal entries)
Object.assign(CURRICULUM, {
  // From data-cpp.js (already in data.js but overridden with expanded version)
  ...(typeof DATA_CPP !== 'undefined' ? { cpp: DATA_CPP } : {}),
  // From data-python.js
  ...(typeof DATA_PYTHON !== 'undefined' ? { python: DATA_PYTHON } : {}),
  // From data-java.js
  ...(typeof DATA_JAVA !== 'undefined' ? { java: DATA_JAVA } : {}),
  // From data-nodejs.js
  ...(typeof DATA_NODEJS !== 'undefined' ? { nodejs: DATA_NODEJS } : {}),
  // From data-react.js
  ...(typeof DATA_REACT !== 'undefined' ? { react: DATA_REACT } : {}),
  // From data-htmlcss.js
  ...(typeof DATA_HTMLCSS !== 'undefined' ? { htmlcss: DATA_HTMLCSS } : {}),
  // From data-sql.js
  ...(typeof DATA_SQL !== 'undefined' ? { sql: DATA_SQL } : {}),
  // From data-typescript.js
  ...(typeof DATA_TYPESCRIPT !== 'undefined' ? { typescript: DATA_TYPESCRIPT } : {}),
  // From data-jest-docker.js
  ...(typeof DATA_JEST !== 'undefined' ? { jest: DATA_JEST } : {}),
  ...(typeof DATA_DOCKER !== 'undefined' ? { docker: DATA_DOCKER } : {}),
  // From data-csharp.js
  ...(typeof DATA_CSHARP !== 'undefined' ? { csharp: DATA_CSHARP } : {}),
  // From data-go.js
  ...(typeof DATA_GO !== 'undefined' ? { go: DATA_GO } : {}),
  // From data-rust.js
  ...(typeof DATA_RUST !== 'undefined' ? { rust: DATA_RUST } : {}),
  // From data-php.js
  ...(typeof DATA_PHP !== 'undefined' ? { php: DATA_PHP } : {}),
  // From data-swift.js
  ...(typeof DATA_SWIFT !== 'undefined' ? { swift: DATA_SWIFT } : {}),
  // From data-kotlin.js
  ...(typeof DATA_KOTLIN !== 'undefined' ? { kotlin: DATA_KOTLIN } : {}),
  // From data-ruby.js
  ...(typeof DATA_RUBY !== 'undefined' ? { ruby: DATA_RUBY } : {}),
  // From data-dart.js
  ...(typeof DATA_DART !== 'undefined' ? { dart: DATA_DART } : {}),
  // From data-bash-dsa.js
  ...(typeof DATA_BASH !== 'undefined' ? { bash: DATA_BASH } : {}),
  ...(typeof DATA_DSA !== 'undefined' ? { dsa: DATA_DSA } : {}),
  // From data-extra2.js (Pack 2)
  ...(typeof DATA_ZIG !== 'undefined' ? { zig: DATA_ZIG } : {}),
  ...(typeof DATA_ELIXIR !== 'undefined' ? { elixir: DATA_ELIXIR } : {}),
  ...(typeof DATA_SOLIDITY !== 'undefined' ? { solidity: DATA_SOLIDITY } : {}),
  ...(typeof DATA_LUA !== 'undefined' ? { lua: DATA_LUA } : {}),
  ...(typeof DATA_R !== 'undefined' ? { r: DATA_R } : {}),
  ...(typeof DATA_SCALA !== 'undefined' ? { scala: DATA_SCALA } : {}),
  // From data-vue.js (Frontend)
  ...(typeof DATA_VUE !== 'undefined' ? { vue: DATA_VUE } : {}),
  // From data-angular.js (Frontend)
  ...(typeof DATA_ANGULAR !== 'undefined' ? { angular: DATA_ANGULAR } : {}),
  // From data-tailwind.js (Frontend)
  ...(typeof DATA_TAILWIND !== 'undefined' ? { tailwind: DATA_TAILWIND } : {}),
  // From data-django.js (Backend)
  ...(typeof DATA_DJANGO !== 'undefined' ? { django: DATA_DJANGO } : {}),
  // From data-mongodb.js (Backend)
  ...(typeof DATA_MONGODB !== 'undefined' ? { mongodb: DATA_MONGODB } : {}),
  // From data-graphql.js (Backend)
  ...(typeof DATA_GRAPHQL !== 'undefined' ? { graphql: DATA_GRAPHQL } : {}),
  // From data-devops.js (Tools & DevOps)
  ...(typeof DATA_KUBERNETES !== 'undefined' ? { kubernetes: DATA_KUBERNETES } : {}),
  ...(typeof DATA_CICD !== 'undefined' ? { cicd: DATA_CICD } : {}),
  ...(typeof DATA_NGINX !== 'undefined' ? { nginx: DATA_NGINX } : {}),
});

console.log(`[DevMaster] Total languages loaded: ${Object.keys(CURRICULUM).length}`);
