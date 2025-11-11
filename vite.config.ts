import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
