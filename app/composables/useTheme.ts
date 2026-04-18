import { ref, readonly, onMounted } from 'vue'
const DARK_THEME_KEY = 'buq-dark-theme'
const isDark = ref(true)
function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark-mode', dark)
}
function loadThemeFromStorage() {
  const saved = localStorage.getItem(DARK_THEME_KEY)
  if (saved !== null) {
    isDark.value = saved === 'true'
  }
  applyTheme(isDark.value)
}
export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem(DARK_THEME_KEY, String(isDark.value))
  }
  onMounted(() => {
    loadThemeFromStorage()
  })
  return {
    isDark: readonly(isDark),
    toggleTheme
  }
}