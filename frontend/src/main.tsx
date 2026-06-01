import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

// 修复浏览器 autofill 白色背景闪烁：在 React 渲染之前就把样式注入 head
const style = document.createElement('style')
style.textContent = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #0D1117 inset !important;
    -webkit-text-fill-color: #F1F5F9 !important;
    caret-color: #F1F5F9;
    transition: background-color 9999999s ease-in-out 0s !important;
  }
`
document.head.appendChild(style)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
