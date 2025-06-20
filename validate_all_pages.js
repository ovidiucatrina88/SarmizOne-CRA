/**
 * Comprehensive page and API validation script
 */

const pages = [
  { name: 'Dashboard', path: '/', api: '/api/dashboard/summary' },
  { name: 'Assets', path: '/assets', api: '/api/assets' },
  { name: 'Asset Hierarchy', path: '/asset-hierarchy', api: '/api/enterprise-architecture' },
  { name: 'Risks', path: '/risks', api: '/api/risks' },
  { name: 'Risk Library', path: '/risk-library', api: '/api/risk-library' },
  { name: 'Controls', path: '/controls', api: '/api/controls' },
  { name: 'Control Library', path: '/control-library', api: '/api/control-library' },
  { name: 'Control ROI', path: '/control-roi', api: '/api/risk-costs/calculate/all' },
  { name: 'Control Mappings', path: '/control-mappings', api: '/api/control-mappings/risks' },
  { name: 'Reports', path: '/reports', api: '/api/reports' },
  { name: 'Integrations', path: '/integrations', api: '/api/integrations' },
  { name: 'Legal Entities', path: '/legal-entities', api: '/api/legal-entities' },
  { name: 'Cost Modules', path: '/cost-modules', api: '/api/cost-modules' },
  { name: 'Admin', path: '/admin', api: '/api/auth/users' },
  { name: 'Vulnerabilities', path: null, api: '/api/vulnerabilities' },
  { name: 'Asset Vulnerabilities', path: null, api: '/api/assets/vulnerabilities' },
  { name: 'Asset Vuln Import', path: null, api: '/api/assets/vulnerabilities/import' }
];

async function testAPI(url, method = 'GET') {
  try {
    const response = await fetch(`http://localhost:5000${url}`, { method });
    const contentType = response.headers.get('content-type');
    const isJSON = contentType && contentType.includes('application/json');
    
    if (!isJSON) {
      return { status: response.status, type: 'HTML', error: 'Returns HTML instead of JSON' };
    }
    
    const data = await response.json();
    return { status: response.status, type: 'JSON', success: data.success, data };
  } catch (error) {
    return { status: 'ERROR', error: error.message };
  }
}

async function validateAll() {
  console.log('🔍 Validating All Pages and APIs\n');
  
  const results = {
    working: [],
    broken: [],
    returning_html: []
  };
  
  for (const page of pages) {
    console.log(`Testing: ${page.name}`);
    
    if (page.api) {
      const result = await testAPI(page.api);
      
      if (result.type === 'HTML') {
        results.returning_html.push({ ...page, result });
        console.log(`  ⚠️  API returns HTML: ${page.api}`);
      } else if (result.status === 200 && result.success) {
        results.working.push({ ...page, result });
        console.log(`  ✅ API working: ${page.api}`);
      } else {
        results.broken.push({ ...page, result });
        console.log(`  ❌ API broken: ${page.api} (${result.status})`);
      }
    }
  }
  
  // Test POST endpoints
  console.log('\nTesting POST endpoints...');
  const postResult = await testAPI('/api/assets/vulnerabilities/import', 'POST');
  if (postResult.type === 'JSON' && postResult.status === 200) {
    console.log('  ✅ POST /api/assets/vulnerabilities/import working');
    results.working.push({ name: 'Vuln Import POST', api: '/api/assets/vulnerabilities/import', result: postResult });
  } else {
    console.log('  ❌ POST /api/assets/vulnerabilities/import broken');
    results.broken.push({ name: 'Vuln Import POST', api: '/api/assets/vulnerabilities/import', result: postResult });
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Working APIs: ${results.working.length}`);
  console.log(`❌ Broken APIs: ${results.broken.length}`);
  console.log(`⚠️  HTML responses: ${results.returning_html.length}`);
  
  if (results.broken.length > 0) {
    console.log('\n❌ BROKEN APIs:');
    results.broken.forEach(item => {
      console.log(`  - ${item.name}: ${item.api} (${item.result.status}) ${item.result.error || ''}`);
    });
  }
  
  if (results.returning_html.length > 0) {
    console.log('\n⚠️  APIs RETURNING HTML:');
    results.returning_html.forEach(item => {
      console.log(`  - ${item.name}: ${item.api}`);
    });
  }
  
  return results;
}

if (typeof window === 'undefined') {
  // Running in Node.js
  const fetch = require('node-fetch');
  validateAll().then(() => process.exit(0));
}