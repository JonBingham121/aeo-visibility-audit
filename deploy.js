const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load credentials from environment or secure storage
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'jonbingham121';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const REPO_NAME = 'aeo-visibility-audit';

if (!GITHUB_TOKEN || !VERCEL_TOKEN) {
  console.error('Missing credentials. Please set GITHUB_TOKEN and VERCEL_TOKEN.');
  process.exit(1);
}

async function apiRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function createGitHubRepo() {
  console.log('Creating GitHub repository...');
  
  const result = await apiRequest({
    hostname: 'api.github.com',
    path: '/user/repos',
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'OpenClaw-Deploy',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  }, {
    name: REPO_NAME,
    description: 'AEO Visibility Audit - Sales Page',
    private: false,
    auto_init: false
  });

  if (result.status === 201) {
    console.log('✅ Repository created successfully');
    return result.data;
  } else if (result.status === 422 && result.data.errors?.[0]?.message?.includes('already exists')) {
    console.log('ℹ️  Repository already exists, continuing...');
    return { html_url: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}` };
  } else {
    throw new Error(`GitHub API error: ${result.status} - ${JSON.stringify(result.data)}`);
  }
}

async function pushToGitHub() {
  console.log('Pushing files to GitHub...');
  
  const repoUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;
  
  try {
    // Initialize git if needed
    if (!fs.existsSync('.git')) {
      execSync('git init', { stdio: 'inherit' });
      execSync('git branch -M main', { stdio: 'inherit' });
    }
    
    // Add files
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit
    try {
      execSync('git commit -m "Deploy AEO Visibility Audit sales page"', { stdio: 'inherit' });
    } catch (e) {
      console.log('ℹ️  No changes to commit or commit already exists');
    }
    
    // Add remote and push
    try {
      execSync(`git remote add origin ${repoUrl}`, { stdio: 'pipe' });
    } catch (e) {
      execSync(`git remote set-url origin ${repoUrl}`, { stdio: 'pipe' });
    }
    
    execSync('git push -u origin main --force', { stdio: 'inherit' });
    console.log('✅ Code pushed to GitHub');
  } catch (error) {
    throw new Error(`Git operation failed: ${error.message}`);
  }
}

async function deployToVercel() {
  console.log('Deploying to Vercel...');
  
  const result = await apiRequest({
    hostname: 'api.vercel.com',
    path: '/v13/deployments',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }, {
    name: REPO_NAME,
    gitSource: {
      type: 'github',
      repo: `${GITHUB_USERNAME}/${REPO_NAME}`,
      ref: 'main'
    },
    projectSettings: {
      framework: null
    }
  });

  if (result.status === 200 || result.status === 201) {
    console.log('✅ Deployment initiated');
    return result.data;
  } else {
    throw new Error(`Vercel API error: ${result.status} - ${JSON.stringify(result.data)}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting deployment process...\n');
    
    const repo = await createGitHubRepo();
    console.log(`📦 GitHub repo: ${repo.html_url}\n`);
    
    await pushToGitHub();
    console.log('');
    
    const deployment = await deployToVercel();
    console.log(`\n🌐 Deployment URL: https://${deployment.url || REPO_NAME + '.vercel.app'}`);
    console.log('✅ Deployment complete!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

main();
