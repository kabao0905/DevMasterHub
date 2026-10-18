import {
  siAngular, siCplusplus, siDart, siDjango, siDocker, siDotnet, siGithubactions, siGnubash, siGo, siGraphql,
  siHtml5, siJest, siKalilinux, siKotlin, siKubernetes, siLua, siMongodb, siNginx, siNodedotjs, siOpenjdk,
  siPhp, siPostgresql, siPython, siR, siReact, siRuby, siRust, siScala, siSolidity, siSwift, siTailwindcss,
  siThealgorithms, siTypescript, siVuedotjs, siZig
} from 'simple-icons';

const LOGO: Record<string, { path: string }> = {
  cpp: siCplusplus, python: siPython, java: siOpenjdk, typescript: siTypescript, csharp: siDotnet,
  go: siGo, rust: siRust, php: siPhp, swift: siSwift, kotlin: siKotlin, dart: siDart, ruby: siRuby,
  zig: siZig, solidity: siSolidity, lua: siLua, r: siR, scala: siScala, htmlcss: siHtml5, react: siReact,
  vue: siVuedotjs, angular: siAngular, tailwind: siTailwindcss, nodejs: siNodedotjs, django: siDjango,
  sql: siPostgresql, mongodb: siMongodb, graphql: siGraphql, docker: siDocker, kubernetes: siKubernetes,
  cicd: siGithubactions, bash: siGnubash, nginx: siNginx, jest: siJest, cybersecurity: siKalilinux,
  dsa: siThealgorithms
};

export function logoCongNghe(id: string): string | undefined {
  return LOGO[id]?.path;
}
