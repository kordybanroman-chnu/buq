import type { Config } from 'tailwindcss'
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        bg: {
          page: 'var(--bg-page)',
          card: 'var(--bg-card)',
          header: 'var(--bg-header)',
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        border: 'var(--border)',
        accent: 'var(--accent)',
        'accent-glow': 'var(--accent-glow)',
      }
    }
  }
}