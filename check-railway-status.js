/**
 * Check Railway deployment status
 */

const https = require('https');

const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN || '5707f1f1-5074-4fca-90f9-2fecbe8f6788';
const PROJECT_ID = '80ac42a9-fbf5-4fd0-bf7b-277a11580934';

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function checkStatus() {
    console.log('🔍 Checking Railway deployment status...\n');

    try {
        // Get project info
        const query = `
            query GetProject($id: String!) {
                project(id: $id) {
                    id
                    name
                    services {
                        edges {
                            node {
                                id
                                name
                                status
                            }
                        }
                    }
                }
            }
        `;

        const result = await makeRequest({
            hostname: 'backboard.railway.app',
            path: '/graphql/v2',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }, {
            query: query,
            variables: { id: PROJECT_ID }
        });

        console.log('Railway Status:', JSON.stringify(result, null, 2));

        if (result.data && result.data.project) {
            const project = result.data.project;
            console.log(`\n✅ Project: ${project.name}`);
            
            if (project.services && project.services.edges) {
                const services = project.services.edges.map(e => e.node);
                console.log(`\n📦 Services (${services.length}):`);
                services.forEach(service => {
                    console.log(`   - ${service.name}: ${service.status || 'unknown'}`);
                });
            } else {
                console.log('\n⚠️  No services found!');
            }
        } else {
            console.log('\n⚠️  Could not fetch project info');
            if (result.errors) {
                console.log('Errors:', result.errors);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkStatus();

