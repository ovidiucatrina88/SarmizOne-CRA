import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

const BASE_URL = 'http://127.0.0.1:5000';
const cookieJar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

// Colors for output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(status: 'PASS' | 'FAIL' | 'WARN' | 'INFO', message: string, details?: any) {
    const color = status === 'PASS' ? GREEN : status === 'FAIL' ? RED : status === 'WARN' ? YELLOW : RESET;
    console.log(`${color}[${status}] ${message}${RESET}`);
    if (details) {
        console.log(JSON.stringify(details, null, 2));
    }
}

async function validateApi() {
    console.log('Starting API Validation...');

    // 1. Authentication (Try default credentials)
    // Note: In a real scenario, we might need to create a user first or use known creds.
    // For now, we'll try to hit an endpoint. If 401, we'll try to login.

    let needsAuth = false;
    try {
        const check = await fetchWithCookies(`${BASE_URL}/api/assets`);
        if (check.status === 401) {
            needsAuth = true;
        }
    } catch (e) {
        log('FAIL', 'Server not reachable. Is it running?');
        process.exit(1);
    }

    if (needsAuth) {
        log('INFO', 'Authentication required. Attempting login...');
        // Try default admin/admin - adjust if you know the actual dev creds
        const loginRes = await fetchWithCookies(`${BASE_URL}/auth/login/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password' }) // Common dev default
        });

        if (!loginRes.ok) {
            // Try registering a temp admin if login fails? Or just warn.
            log('WARN', 'Login failed with default credentials. Some endpoints might fail if they require auth.');
        } else {
            log('PASS', 'Authentication successful');
        }
    }

    // 2. Smoke Tests (GET Endpoints)
    const endpoints = [
        '/api/assets',
        '/api/assets/summary',
        '/api/risks',
        '/api/controls',
        '/api/legal-entities',
        '/api/enterprise-architecture',
        '/api/vulnerabilities',
        '/api/dashboard/summary',
        '/api/risk-summary/latest'
    ];

    for (const endpoint of endpoints) {
        try {
            const res = await fetchWithCookies(`${BASE_URL}${endpoint}`);
            if (res.ok) {
                // Check if it's JSON
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    log('PASS', `GET ${endpoint} - ${res.status}`);
                } else {
                    log('FAIL', `GET ${endpoint} - Returned ${contentType} instead of JSON`);
                }
            } else {
                log('FAIL', `GET ${endpoint} - ${res.status} ${res.statusText}`);
            }
        } catch (error) {
            log('FAIL', `GET ${endpoint} - Network Error: ${error.message}`);
        }
    }

    // 3. CRUD Test: Assets
    log('INFO', 'Testing Asset CRUD Lifecycle...');
    const testAsset = {
        name: 'TEST_ASSET_VALIDATION',
        assetId: `TEST-${Date.now()}`,
        type: 'application',
        status: 'Active',
        owner: 'Test Script',
        confidentiality: 'low',
        integrity: 'low',
        availability: 'low',
        assetValue: 1000,
        currency: 'USD',
        externalInternal: 'internal'
    };

    let createdAssetId: number | null = null;

    // CREATE
    try {
        const res = await fetchWithCookies(`${BASE_URL}/api/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testAsset)
        });

        if (res.ok) {
            const data = await res.json();
            createdAssetId = data.id || data.data?.id; // Handle wrapped responses
            if (createdAssetId) {
                log('PASS', 'CREATE Asset successful');
            } else {
                log('FAIL', 'CREATE Asset - No ID returned', data);
            }
        } else {
            const err = await res.text();
            log('FAIL', `CREATE Asset - ${res.status}`, err);
        }
    } catch (e) {
        log('FAIL', `CREATE Asset - Error: ${e.message}`);
    }

    if (createdAssetId) {
        // UPDATE (PUT)
        try {
            const res = await fetchWithCookies(`${BASE_URL}/api/assets/${createdAssetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...testAsset, description: 'Updated via PUT' })
            });
            if (res.ok) log('PASS', 'PUT Asset successful');
            else log('FAIL', `PUT Asset - ${res.status}`);
        } catch (e) { log('FAIL', `PUT Asset error: ${e.message}`); }

        // UPDATE (PATCH)
        try {
            const res = await fetchWithCookies(`${BASE_URL}/api/assets/${createdAssetId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: 'Updated via PATCH' })
            });
            if (res.ok) log('PASS', 'PATCH Asset successful');
            else log('FAIL', `PATCH Asset - ${res.status}`);
        } catch (e) { log('FAIL', `PATCH Asset error: ${e.message}`); }

        // DELETE
        try {
            const res = await fetchWithCookies(`${BASE_URL}/api/assets/${createdAssetId}`, {
                method: 'DELETE'
            });
            if (res.ok) log('PASS', 'DELETE Asset successful');
            else log('FAIL', `DELETE Asset - ${res.status}`);
        } catch (e) { log('FAIL', `DELETE Asset error: ${e.message}`); }
    }

    console.log('Validation Complete.');
}

validateApi().catch(console.error);
