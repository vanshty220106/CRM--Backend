const http = require('http');
const data = JSON.stringify({
  uid: 'test_uid_123',
  email: 'testsync@local.com',
  name: 'Sync Tester',
  role: 'citizen'
});
const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/firebase-sync',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
req.write(data);
req.end();
