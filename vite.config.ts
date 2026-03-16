import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the magic part
    proxy: {
      "/api": {
        target: "http://localhost:4000", // Your Go API address
        changeOrigin: true,
      },
    },
  },
});
