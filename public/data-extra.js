delete CURRICULUM.dockergit;

Object.assign(CURRICULUM, {

  ...(typeof DATA_CPP !== 'undefined' ? { cpp: DATA_CPP } : {}),

  ...(typeof DATA_PYTHON !== 'undefined' ? { python: DATA_PYTHON } : {}),

  ...(typeof DATA_JAVA !== 'undefined' ? { java: DATA_JAVA } : {}),

  ...(typeof DATA_NODEJS !== 'undefined' ? { nodejs: DATA_NODEJS } : {}),

  ...(typeof DATA_REACT !== 'undefined' ? { react: DATA_REACT } : {}),

  ...(typeof DATA_HTMLCSS !== 'undefined' ? { htmlcss: DATA_HTMLCSS } : {}),

  ...(typeof DATA_SQL !== 'undefined' ? { sql: DATA_SQL } : {}),

  ...(typeof DATA_TYPESCRIPT !== 'undefined' ? { typescript: DATA_TYPESCRIPT } : {}),

  ...(typeof DATA_JEST !== 'undefined' ? { jest: DATA_JEST } : {}),
  ...(typeof DATA_DOCKER !== 'undefined' ? { docker: DATA_DOCKER } : {}),

  ...(typeof DATA_CSHARP !== 'undefined' ? { csharp: DATA_CSHARP } : {}),

  ...(typeof DATA_GO !== 'undefined' ? { go: DATA_GO } : {}),

  ...(typeof DATA_RUST !== 'undefined' ? { rust: DATA_RUST } : {}),

  ...(typeof DATA_PHP !== 'undefined' ? { php: DATA_PHP } : {}),

  ...(typeof DATA_SWIFT !== 'undefined' ? { swift: DATA_SWIFT } : {}),

  ...(typeof DATA_KOTLIN !== 'undefined' ? { kotlin: DATA_KOTLIN } : {}),

  ...(typeof DATA_RUBY !== 'undefined' ? { ruby: DATA_RUBY } : {}),

  ...(typeof DATA_DART !== 'undefined' ? { dart: DATA_DART } : {}),

  ...(typeof DATA_BASH !== 'undefined' ? { bash: DATA_BASH } : {}),
  ...(typeof DATA_DSA !== 'undefined' ? { dsa: DATA_DSA } : {}),

  ...(typeof DATA_ZIG !== 'undefined' ? { zig: DATA_ZIG } : {}),
  ...(typeof DATA_ELIXIR !== 'undefined' ? { elixir: DATA_ELIXIR } : {}),
  ...(typeof DATA_SOLIDITY !== 'undefined' ? { solidity: DATA_SOLIDITY } : {}),
  ...(typeof DATA_LUA !== 'undefined' ? { lua: DATA_LUA } : {}),
  ...(typeof DATA_R !== 'undefined' ? { r: DATA_R } : {}),
  ...(typeof DATA_SCALA !== 'undefined' ? { scala: DATA_SCALA } : {}),

  ...(typeof DATA_VUE !== 'undefined' ? { vue: DATA_VUE } : {}),

  ...(typeof DATA_ANGULAR !== 'undefined' ? { angular: DATA_ANGULAR } : {}),

  ...(typeof DATA_TAILWIND !== 'undefined' ? { tailwind: DATA_TAILWIND } : {}),

  ...(typeof DATA_DJANGO !== 'undefined' ? { django: DATA_DJANGO } : {}),

  ...(typeof DATA_MONGODB !== 'undefined' ? { mongodb: DATA_MONGODB } : {}),

  ...(typeof DATA_GRAPHQL !== 'undefined' ? { graphql: DATA_GRAPHQL } : {}),

  ...(typeof DATA_KUBERNETES !== 'undefined' ? { kubernetes: DATA_KUBERNETES } : {}),
  ...(typeof DATA_CICD !== 'undefined' ? { cicd: DATA_CICD } : {}),
  ...(typeof DATA_NGINX !== 'undefined' ? { nginx: DATA_NGINX } : {}),
  ...(typeof DATA_CYBERSECURITY !== 'undefined' ? { cybersecurity: DATA_CYBERSECURITY } : {}),
});

console.log(`[DevMaster] Total languages loaded: ${Object.keys(CURRICULUM).length}`);
