import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { _electron as electron } from 'playwright';

const userId = '00000000-0000-4000-8000-000000000001';
const smokeEmail = 'smoke@life-os.app';
const mockPort = 0;
let mockBaseUrl = 'http://127.0.0.1';
const anonKey = 'test-anon-key';

const base64Url = (input) =>
  Buffer.from(input).toString('base64url');

const createJwt = (subject) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    aud: 'authenticated',
    exp: now + 3600,
    iat: now,
    iss: `${mockBaseUrl}/auth/v1`,
    role: 'authenticated',
    sub: subject,
    email: smokeEmail,
  };

  const jwtSignature = base64Url('signature');
  return `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}.${jwtSignature}`;
};

let accessToken = '';
const refreshToken = 'smoke-refresh-token';

const requestLog = [];

const json = (res, code, body) => {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    apikey: anonKey,
  });
  res.end(JSON.stringify(body));
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, mockBaseUrl);
  requestLog.push({ method: req.method, path: `${reqUrl.pathname}${reqUrl.search}` });

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && reqUrl.pathname === '/auth/v1/token' && reqUrl.searchParams.get('grant_type') === 'password') {
    json(res, 200, {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: refreshToken,
      user: {
        id: userId,
        email: smokeEmail,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email' },
        user_metadata: {},
      },
    });
    return;
  }

  if (req.method === 'GET' && reqUrl.pathname === '/auth/v1/user') {
    json(res, 200, {
      id: userId,
      email: smokeEmail,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'email' },
      user_metadata: {},
    });
    return;
  }

  if (req.method === 'POST' && reqUrl.pathname === '/auth/v1/logout') {
    json(res, 200, {});
    return;
  }

  if (req.method === 'GET' && reqUrl.pathname === '/rest/v1/profiles') {
    json(res, 200, [
      {
        id: userId,
        full_name: 'Smoke User',
        nickname: 'Smoke',
        theme: 'dark',
        onboarding_completed: true,
      },
    ]);
    return;
  }

  json(res, 404, { error: 'not found', path: `${reqUrl.pathname}${reqUrl.search}` });
});

const launchPackaged = async (homeDir, executablePath) => {
  const processLogs = [];
  const app = await electron.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-gpu'],
    env: {
      ...process.env,
      HOME: homeDir,
      XDG_CONFIG_HOME: path.join(homeDir, '.config'),
      VITE_SUPABASE_URL: mockBaseUrl,
      VITE_SUPABASE_ANON_KEY: anonKey,
      NODE_ENV: 'production',
    },
  });

  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  const proc = app.process();
  if (proc?.stdout) {
    proc.stdout.on('data', (chunk) => {
      processLogs.push(String(chunk));
    });
  }
  if (proc?.stderr) {
    proc.stderr.on('data', (chunk) => {
      processLogs.push(String(chunk));
    });
  }

  return { app, window, processLogs };
};

const getDbPath = (homeDir) => path.join(homeDir, '.config', 'life-os', 'lifeos.db');

const queryAuthSessionViaElectronNode = (homeDir, executablePath) => {
  const dbPath = getDbPath(homeDir);
  const script = `const Database=require('better-sqlite3');const fs=require('fs');const dbPath=${JSON.stringify(
    dbPath
  )};if(!fs.existsSync(dbPath)){console.log(JSON.stringify({exists:false,count:0,row:null}));process.exit(0);}const db=new Database(dbPath,{readonly:true});const row=db.prepare('SELECT id,user_id,expires_at FROM auth_session ORDER BY expires_at DESC LIMIT 1').get()||null;const count=db.prepare('SELECT COUNT(*) AS count FROM auth_session').get().count;db.close();console.log(JSON.stringify({exists:true,count,row}));`;

  const result = spawnSync(executablePath, ['-e', script], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      HOME: homeDir,
      XDG_CONFIG_HOME: path.join(homeDir, '.config'),
    },
    encoding: 'utf-8',
  });

  if (result.status !== 0) {
    return {
      error: result.stderr || result.stdout || `exit ${String(result.status)}`,
      exists: null,
      count: null,
      row: null,
    };
  }

  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    return {
      error: `invalid-json:${result.stdout}`,
      exists: null,
      count: null,
      row: null,
    };
  }
};

const readDbMetadata = (homeDir) => {
  const dbPath = getDbPath(homeDir);
  if (!fs.existsSync(dbPath)) {
    return { exists: false, dbPath, size: 0, containsUserId: false };
  }

  const content = fs.readFileSync(dbPath);
  return {
    exists: true,
    dbPath,
    size: content.length,
    containsUserId: content.includes(Buffer.from(userId)),
  };
};

const main = async () => {
  const projectRoot = process.cwd();
  const linuxUnpackedDir = path.join(projectRoot, 'release', '0.1.0', 'linux-unpacked');
  const lifeOsBinary = path.join(linuxUnpackedDir, 'life-os');
  const electronBinary = path.join(linuxUnpackedDir, 'electron');
  const executablePath = fs.existsSync(lifeOsBinary) ? lifeOsBinary : electronBinary;
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'life-os-auth-smoke-'));

  if (!fs.existsSync(executablePath)) {
    throw new Error(`Packaged executable not found at ${executablePath}. Run npm run electron:build first.`);
  }

  await new Promise((resolve) => server.listen(mockPort, '127.0.0.1', resolve));
  const serverAddress = server.address();
  if (!serverAddress || typeof serverAddress === 'string') {
    throw new Error('Unable to resolve mock server address');
  }

  mockBaseUrl = `http://127.0.0.1:${serverAddress.port}`;
  accessToken = createJwt(userId);

  console.log(`mock_server=up base_url=${mockBaseUrl}`);
  console.log(`packaged_executable=${executablePath}`);
  console.log(`temp_home=${tempHome}`);

  try {
    console.log('step=login (first launch)');
    const first = await launchPackaged(tempHome, executablePath);
    const loginResult = await first.window.evaluate(() =>
      window.api.auth.login({ email: 'smoke@life-os.app', password: 'TestPass123!' })
    );
    await first.app.close();
    const dbAfterLogin = readDbMetadata(tempHome);
    const authSessionAfterLogin = queryAuthSessionViaElectronNode(tempHome, executablePath);

    console.log(`login_result=${JSON.stringify({
      hasSession: !!loginResult?.session,
      userId: loginResult?.user?.id ?? null,
      profileId: loginResult?.profile?.id ?? null,
      dbAfterLogin,
      authSessionAfterLogin,
      processLogs: first.processLogs.join('').trim() || null,
    })}`);

    console.log('step=auth:check (second launch, restore persisted session)');
    const second = await launchPackaged(tempHome, executablePath);
    const dbBeforeRestore = readDbMetadata(tempHome);
    const authSessionBeforeRestore = queryAuthSessionViaElectronNode(tempHome, executablePath);
    const checkResult = await second.window.evaluate(() => window.api.auth.check());
    console.log(`auth_check=${JSON.stringify({
      hasSession: !!checkResult?.session,
      userId: checkResult?.session?.user?.id ?? null,
      profileId: checkResult?.profile?.id ?? null,
      dbBeforeRestore,
      authSessionBeforeRestore,
      processLogs: second.processLogs.join('').trim() || null,
    })}`);

    console.log('step=logout (second launch)');
    const logoutResult = await second.window.evaluate(() => window.api.auth.logout());
    await second.app.close();
    const dbAfterLogout = readDbMetadata(tempHome);
    const authSessionAfterLogout = queryAuthSessionViaElectronNode(tempHome, executablePath);

    console.log(`logout_result=${JSON.stringify({
      apiResult: logoutResult,
      dbAfterLogout,
      authSessionAfterLogout,
      processLogs: second.processLogs.join('').trim() || null,
    })}`);

    console.log('step=auth:check (third launch, verify cleared session)');
    const third = await launchPackaged(tempHome, executablePath);
    const postLogoutCheck = await third.window.evaluate(() => window.api.auth.check());
    await third.app.close();

    console.log(`post_logout_check=${JSON.stringify({
      hasSession: !!postLogoutCheck?.session,
      profileId: postLogoutCheck?.profile?.id ?? null,
      processLogs: third.processLogs.join('').trim() || null,
    })}`);

    for (const req of requestLog) {
      console.log(`mock_request method=${req.method} path=${req.path}`);
    }

    const pass =
      !!loginResult?.session &&
      !!checkResult?.session &&
      !postLogoutCheck?.session;

    if (!pass) {
      throw new Error('Packaged auth smoke assertions failed');
    }

    console.log('auth_smoke=passed');
  } finally {
    server.close();
    console.log('mock_server=down');
  }
};

main().catch((error) => {
  console.error(`auth_smoke=failed error=${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
