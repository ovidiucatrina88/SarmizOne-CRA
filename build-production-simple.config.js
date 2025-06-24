// Simplified production build configuration
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  outfile: 'dist/production.cjs',
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  external: [
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
    'tsx'
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
    '__dirname': 'process.cwd()',
    '__filename': '"production.cjs"'
  },
  packages: 'external',
  banner: {
    js: `
// Production build compatibility
const __dirname = process.cwd();
const __filename = 'production.cjs';
`
  }
}).catch(() => process.exit(1));