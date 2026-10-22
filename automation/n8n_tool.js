const http = require('http');

const API_KEY = process.env.N8N_API_KEY || 'claude-n8n-secret-key';
const PORT = 5678;

function apiRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const dataStr = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: `/api/v1${endpoint}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(dataStr ? { 'Content-Length': Buffer.byteLength(dataStr) } : {})
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => reject(err));
        if (dataStr) req.write(dataStr);
        req.end();
    });
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    try {
        if (command === 'list') {
            const res = await apiRequest('GET', '/workflows');
            console.log(JSON.stringify(res, null, 2));
        } else if (command === 'create') {
            // e.g. node n8n_tool.js create '{"name": "My Workflow", "nodes": [], "connections": {}}'
            const workflowData = JSON.parse(args[1]);
            const res = await apiRequest('POST', '/workflows', workflowData);
            console.log(JSON.stringify(res, null, 2));
        } else if (command === 'activate') {
            const id = args[1];
            const res = await apiRequest('POST', `/workflows/${id}/activate`);
            console.log(JSON.stringify(res, null, 2));
        } else {
            console.log('Commands: list, create <json>, activate <id>');
        }
    } catch (err) {
        console.error('Error interacting with n8n:', err.message);
    }
}

main();
