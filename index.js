import express from 'express';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length; // Get the number of CPU cores

class Threads {
    constructor() {
        this.routes = {};
        this.app = express();
    }

    get(path, handler) {
        this.routes[path] = handler;
        this.app.get(path, (req, res) => {
            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Thread-ID': process.pid, // Include the worker ID in the header
                },
                body: '',
                writeHead: function (statusCode, headers) {
                    this.statusCode = statusCode;
                    this.headers = { ...this.headers, ...headers }; // Merge with existing headers
                },
                end: function (body) {
                    this.body = body;
                    res.writeHead(this.statusCode, this.headers);
                    res.end(this.body);
                },
            };
            handler(req, response);
        });
    }

    listen(port) {
        if (cluster.isMaster) {
            // Fork workers
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker) => {
                console.log(`Worker ${worker.process.pid} died`);
                // Optionally fork a new worker if one dies
                cluster.fork();
            });
        } else {
            // Workers will use the same app instance
            this.app.listen(port, () => {
                console.log(`Worker ${process.pid} listening on port ${port}`);
            });
        }
    }
}

export default Threads;
// // Example usage
// const app = new Threads();
// app.get('/hello', (req, res) => {
//     res.end('Hello from worker!');
// });
// app.listen(3000);
