// Build configuration for production
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server/production.ts'],
  bundle: true,
  outfile: 'dist/production.cjs',
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  external: [
    // All npm packages - let them be resolved at runtime
    'pg',
    'express',
    'drizzle-orm',
    'bcryptjs',
    'express-session',
    'connect-pg-simple',
    'dotenv',
    'uuid',
    'ws',
    'openai',
    'axios'
  ],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  packages: 'external'
}).catch(() => process.exit(1));