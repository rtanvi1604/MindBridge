const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      onError: (err, req, res) => {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Backend not reachable. Please start the FastAPI server.',
          detail: 'Run: cd backend && uvicorn app:app --reload --port 8000'
        }));
      },
    })
  );
};
