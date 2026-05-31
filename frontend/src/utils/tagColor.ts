const PALETTE = [
  '#6777EF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
  '#85C1E9', '#F0A500', '#E74C3C', '#2ECC71', '#3498DB',
  '#9B59B6', '#1ABC9C', '#E67E22', '#E91E63', '#00BCD4',
]

const PRESET: Record<string, string> = {
  react:       '#61DAFB',
  vue:         '#4FC08D',
  angular:     '#DD0031',
  'spring boot': '#6DB33F',
  spring:      '#6DB33F',
  typescript:  '#3178C6',
  javascript:  '#F7DF1E',
  python:      '#3776AB',
  java:        '#ED8B00',
  docker:      '#2496ED',
  mysql:       '#4479A1',
  redis:       '#DC382D',
  linux:       '#FCC624',
  git:         '#F05032',
  kubernetes:  '#326CE5',
  node:        '#339933',
  rust:        '#CE422B',
  go:          '#00ADD8',
  graphql:     '#E10098',
  fastapi:     '#009688',
  css:         '#1572B6',
  html:        '#E34F26',
  'c#':        '#239120',
  'c++':       '#00599C',
  'c':         '#A8B9CC',
  ruby:        '#CC342D',
  php:         '#777BB4',
  swift:       '#F05138',
  kotlin:      '#7F52FF',
  scala:       '#DC322F',
  mongodb:     '#47A248',
  postgresql:  '#4169E1',
  nginx:       '#009639',
  aws:         '#FF9900',
  gcp:         '#4285F4',
  azure:       '#0078D4',
  flutter:     '#02569B',
  dart:        '#0175C2',
  vite:        '#646CFF',
  webpack:     '#8DD6F9',
  dockercompose: '#2496ED',
  ansible:     '#EE0000',
  terraform:   '#7B42BC',
  jenkins:     '#D33833',
  arduino:     '#00979D',
  raspberrypi: '#C51A4A',
  langchain:   '#0A0A0A',
  openai:      '#412991',
  huggingface: '#FFD21E',
  pytorch:     '#EE4C2C',
  tensorflow:  '#FF6F00',
  keras:       '#D00000',
  nuxt:        '#00DC82',
  nextjs:      '#000000',
  svelte:      '#FF3E00',
  angularjs:   '#E23237',
  jquery:      '#0769AD',
  bootstrap:   '#7952B3',
  tailwind:    '#06B6D4',
  materialui:  '#0081CB',
  echarts:     '#A94442',
  d3js:        '#F9A03C',
  threejs:     '#000000',
  webgl:       '#990000',
  wasm:        '#654FF0',
  deno:        '#70FFAF',
  bun:         '#FBF0F9',
  cobra:       '#6DA4E8',
  fiber:       '#00C4B4',
  gin:         '#00ADD8',
  nestjs:      '#E0234E',
  prisma:      '#5B1682',
  sequelize:   '#52B0E0',
  typeorm:     '#E83535',
  redux:       '#764ABC',
  mobx:        '#F99500',
  tanstackquery: '#FF4154',
  zustand:     '#5E4AE3',
  recoil:      '#3578E5',
  nextui:      '#000000',
  shadcnui:    '#000000',
  radixui:     '#000000',
  clerk:       '#6EE7F2',
  supabase:    '#3FCF8E',
  firebase:    '#FFCA28',
  vercel:      '#000000',
  netlify:     '#00C7B7',
  heroku:      '#430098',
  digitalocean: '#0080FF',
  rag:         '#00D9B5',
  llm:         '#FF6B6B',
  agent:       '#4ECDC4',
  mcp:         '#F7DC6F',
  'ai agent':  '#4ECDC4',
  tui:         '#96CEB4',
  rich:        '#98D8C8',
  langgraph:   '#FF6B6B',
}

const cache = new Map<string, string>()

export function getTagColor(tagName: string): string {
  if (!tagName || typeof tagName !== 'string') return PALETTE[0]
  const key = tagName.toLowerCase().trim()
  if (cache.has(key)) return cache.get(key)!

  let color = PRESET[key]
  if (!color) {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i)
      hash |= 0
    }
    color = PALETTE[Math.abs(hash) % PALETTE.length]
  }

  cache.set(key, color)
  return color
}
