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
      remotes: {
        prehost_app:
          "http://localhost:5001/rts_vite_mf_prehost/assets/prehost_appEntry.js", // preview
        // "/api/rts_vite_mf_prehost/assets/prehost_appEntry.js", //proxy
        // "https://framerage.github.io/rts_vite_mf_prehost/assets/prehost_appEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  // server: {
  //   open: "/rts_chat/",
  // },
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
    minify: false,
    cssCodeSplit: false,
  },
  base: "/rts_chat",
  preview: {
    port: 5005,
    cors: false,
    open: "/rts_chat",
  },
  server: {
    open: "/rts_chat",
    port: 5171,
    cors: true,
    origin: "http://localhost:5001/rts_vite_mf_prehost",
    // proxy: {
    //   "/api": {
    //     // target: "[http://localhost:5001http://localhost:5005]",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
});
