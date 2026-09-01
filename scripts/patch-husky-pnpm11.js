const fs = require('fs');
const path = require('path');

const hookPath = path.join('.git', 'hooks', 'husky.sh');

if (!fs.existsSync(hookPath)) {
  process.exit(0);
}

const content = fs.readFileSync(hookPath, 'utf8');
const patched = content.replace(
  '"pnpm") run_command pnpx --no-install;;',
  '"pnpm") run_command pnpm exec;;',
);

if (patched === content) {
  process.exit(0);
}

fs.writeFileSync(hookPath, patched);
