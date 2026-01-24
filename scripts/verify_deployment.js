
import http from 'http';

const check = (url, name) => {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            console.log(`✅ [${name}] Status: ${res.statusCode}`);
            resolve(true);
        });
        req.on('error', (e) => {
            console.error(`❌ [${name}] Error: ${e.message}`);
            resolve(false);
        });
    });
};

(async () => {
    console.log("🔍 Verifying Deployment...");
    const fe = await check('http://localhost:5173', 'Frontend');
    // Backend root usually returns 404 "API not found" which is actually GOOD (means server is running)
    // Connection Refused would be bad.
    const be = await check('http://localhost:3001/api/unknown_route', 'Backend');

    if (fe && be) {
        console.log("\n🚀 Verification PASSED: Both services are reachable.");
        process.exit(0);
    } else {
        console.error("\n💥 Verification FAILED: Services not reachable.");
        process.exit(1);
    }
})();
