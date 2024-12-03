const http = require('http');
const app = require('./app');

http.createServer(app).listen(8000, () => {
    console.log('Server běží ná http://localhost:8000...');
});
