const { execSync } = require('node:child_process');
const { platform } = require('node:os');

const isWin = platform() === 'win32';

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

run('rimraf dist');
run('npx tsup');
if (isWin) {
  run('cpy .env.production dist --flat && move-file dist/.env.production dist/.env');
}
