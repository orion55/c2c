const { execSync } = require('node:child_process');
const { cpSync } = require('node:fs');
const { platform } = require('node:os');

const isWin = platform() === 'win32';

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function copyPageAssets() {
  const source = 'src/server/routes/indexPage';
  const destination = 'dist/indexPage';

  console.log(`copy ${source} -> ${destination}`);
  cpSync(source, destination, { recursive: true });
}

run('rimraf dist');
run('npx tsup');
copyPageAssets();
if (isWin) {
  run('cpy .env.production dist --flat && move-file dist/.env.production dist/.env');
}
