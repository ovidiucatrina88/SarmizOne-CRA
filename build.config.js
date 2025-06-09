// Build configuration for production
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server/production.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  format: 'esm',
  target: 'node18',
  external: [
    // External packages that should not be bundled
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
    'axios',
    'passport',
    'passport-local',
    'passport-openidconnect',
    // Node.js built-in modules
    'url',
    'crypto',
    'fs',
    'path',
    'http',
    'https',
    'util',
    'stream',
    'buffer',
    'events',
    'querystring'
  ],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).catch(() => process.exit(1));