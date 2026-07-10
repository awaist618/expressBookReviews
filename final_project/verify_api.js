const http = require('http');

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'content-type': 'application/json',
        ...headers,
        ...(data ? { 'content-length': Buffer.byteLength(data) } : {})
      }
    }, (res) => {
      let text = '';
      res.on('data', chunk => text += chunk);
      res.on('end', () => resolve({ status: res.statusCode, text }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  const all = await request('GET', '/');
  console.log('GET / ->', all.status, all.text);
  const isbn = await request('GET', '/isbn/1');
  console.log('GET /isbn/1 ->', isbn.status, isbn.text);
  const author = await request('GET', '/author/Chinua%20Achebe');
  console.log('GET /author/Chinua%20Achebe ->', author.status, author.text);
  const title = await request('GET', '/title/Fairy%20tales');
  console.log('GET /title/Fairy%20tales ->', title.status, title.text);
  const review = await request('GET', '/review/1');
  console.log('GET /review/1 ->', review.status, review.text);
  const reg = await request('POST', '/register', { username: 'testuser', password: 'mypassword123' });
  console.log('POST /register ->', reg.status, reg.text);
  const login = await request('POST', '/login', { username: 'testuser', password: 'mypassword123' });
  console.log('POST /login ->', login.status, login.text);
  const token = JSON.parse(login.text).token;
  const addReview = await request('PUT', '/customer/auth/review/1', { review: 'Great book!' }, { authorization: 'Bearer ' + token });
  console.log('PUT /customer/auth/review/1 ->', addReview.status, addReview.text);
  const deleteReview = await request('DELETE', '/customer/auth/review/1', null, { authorization: 'Bearer ' + token });
  console.log('DELETE /customer/auth/review/1 ->', deleteReview.status, deleteReview.text);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
