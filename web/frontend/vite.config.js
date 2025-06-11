import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    "process.env.VITE_PREDICT_API_URL": JSON.stringify(
      process.env.VITE_PREDICT_API_URL
    ),
  },
});
