import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  platform: 'node',
  target: 'es2022',
  splitting: false,
  sourcemap: false,
  clean: false,
  treeshake: false,
  minify: true,
  skipNodeModulesBundle: true,
  external: [
    '@prisma/client',
    '@prisma/mysql-client',
    '@prisma/sqlite-client',
    '@prisma/engines',
    '@prisma/engines-version',
  ],
  noExternal: [/.*/],
});
