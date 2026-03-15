import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 10000,
    hmr: {
      overlay: false,
    },
  },
  // Add this preview configuration for production
  preview: {
    host: true, // Listen on all addresses
    port: 10000, // Render expects port 10000
    allowedHosts: [
      '.onrender.com', // Allow all Render subdomains
      '.herokuapp.com', // Allow all Render subdomains
      'winelectricride.click' // Allow all Render subdomains
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
