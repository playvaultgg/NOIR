const { execSync } = require('child_process');
const fs = require('fs');

try {
    execSync('npx prisma validate', { stdio: 'pipe' });
} catch (e) {
    const err = e.stderr ? e.stderr.toString() : e.stdout.toString();
    fs.writeFileSync('prisma_error.txt', err);
}
