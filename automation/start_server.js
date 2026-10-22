const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, 'n8n.log'), { flags: 'a' });

const env = {
    ...process.env,
    N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS: 'true',
    N8N_API_KEY: 'claude-n8n-secret-key'
};

const child = spawn('npx', ['n8n', 'start'], {
    cwd: __dirname,
    env: env,
    shell: true
});

child.stdout.pipe(logStream);
child.stderr.pipe(logStream);

console.log(`n8n started with PID ${child.pid}`);
fs.writeFileSync(path.join(__dirname, 'n8n.pid'), child.pid.toString());
