import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Safely expose specific environment variables to the client
      // Default to empty string to ensure JSON.stringify doesn't produce 'undefined'
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ''),
      // Shim process.env to prevent runtime crashes if code accesses other properties
      'process.env': {}
    }
  };
});