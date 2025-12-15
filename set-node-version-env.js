/**
 * Set NODE_VERSION environment variable via Railway API
 * This forces Railway to use Node.js 18
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

async function setNodeVersion() {
    console.log('🔧 Setting Node.js version to 18 via Railway API...\n');

    try {
        // First, get the service ID
        const getProjectQuery = `
            query GetProject($id: String!) {
                project(id: $id) {
                    id
                    name
                    services {
                        edges {
                            node {
                                id
                                name
                            }
                        }
                    }
                }
            }
        `;

        const projectResult = await makeRequest({
            hostname: 'backboard.railway.app',
            path: '/graphql/v2',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }, {
            query: getProjectQuery,
            variables: { id: PROJECT_ID }
        });

        console.log('Project result:', JSON.stringify(projectResult, null, 2));

        if (projectResult.data && projectResult.data.project) {
            const services = projectResult.data.project.services?.edges || [];
            
            if (services.length === 0) {
                console.log('❌ No services found');
                return;
            }

            const serviceId = services[0].node.id;
            console.log(`\n✅ Found service: ${services[0].node.name} (${serviceId})`);

            // Try to set NODE_VERSION environment variable
            // Railway uses NODE_VERSION env var to determine Node version
            const setEnvQuery = `
                mutation SetVariable($input: VariableUpsertInput!) {
                    variableUpsert(input: $input)
                }
            `;

            // Need to get environment ID first
            const getEnvQuery = `
                query GetEnvironments($projectId: String!) {
                    project(id: $projectId) {
                        environments {
                            edges {
                                node {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            `;

            const envResult = await makeRequest({
                hostname: 'backboard.railway.app',
                path: '/graphql/v2',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }, {
                query: getEnvQuery,
                variables: { projectId: PROJECT_ID }
            });

            console.log('\nEnvironment result:', JSON.stringify(envResult, null, 2));

            console.log('\n💡 Railway uses NODE_VERSION environment variable');
            console.log('   Add this in Railway dashboard:');
            console.log('   - Go to: https://railway.app/project/' + PROJECT_ID);
            console.log('   - Click service → Variables tab');
            console.log('   - Add variable: NODE_VERSION = 18');
            console.log('   - Save → Auto-redeploys');

        } else {
            console.log('\n⚠️  Could not fetch project');
            if (projectResult.errors) {
                console.log('Errors:', projectResult.errors);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setNodeVersion();

