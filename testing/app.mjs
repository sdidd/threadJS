// app.mjs
import Threads from '../index.js';

const app = new Threads();

app.get('/hello', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from thread ${req.threadId}!`);
});

app.get('/goodbye', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Goodbye from thread ${req.threadId}!`);
});

app.listen(5000);
