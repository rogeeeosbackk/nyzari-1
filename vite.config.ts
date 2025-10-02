import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Determine base path based on environment
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  const repoName = process.env.REPO_NAME || 'nyzari-1';
  
  // For GitHub Pages, use the repository name as base path
  // For Vercel and other platforms, use root path
  const base = isGitHubPages ? `/${repoName}/` : '/';

  return {
    base,
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // Ensure proper asset handling
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    // Ensure proper asset handling in production
    assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.webp'],
  };
});
