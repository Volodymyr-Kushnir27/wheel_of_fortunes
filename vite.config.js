// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/wheel_of_fortunes/',
  plugins: [react()],
});

