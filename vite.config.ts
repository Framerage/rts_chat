import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "chat_app",
      filename: "chatEntry.js",
      exposes: {
        "./Chat": "./src/App",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    open: "/rts_chat",
  },
  base: "/rts_chat",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    modulePreload: false,
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
  },
});
