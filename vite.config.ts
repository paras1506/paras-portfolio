import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './src/content/projects'

/** Emits sitemap.xml from the project list, so new projects are indexed automatically. */
function sitemap(site: string): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const urls = ['/', ...projects.map((p) => `/work/${p.slug}`)]
      const body = urls.map((u) => `  <url><loc>${site}${u}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const site = loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL ?? 'https://paraswane.dev'
  return {
    plugins: [react(), tailwindcss(), sitemap(site)],
    build: {
      rollupOptions: {
        output: {
          // Keep three.js and its helpers in their own lazily loaded chunk.
          manualChunks(id: string) {
            if (/node_modules[\\/](three|@react-three)/.test(id)) return 'scene'
          },
        },
      },
    },
  }
})
