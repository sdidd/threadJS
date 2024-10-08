import http from 'http';

const numRequests = 3000; // Total number of requests
const url1 = 'http://localhost:5000/hello';
const url2 = 'http://localhost:4000/hello';

const makeRequest = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            res.on('data', () => {});
            res.on('end', resolve);
        }).on('error', reject);
    });
};

// Create an array of requests for both servers
const requests1 = Array.from({ length: numRequests }, () => makeRequest(url1));
const requests2 = Array.from({ length: numRequests }, () => makeRequest(url2));

// Send all requests concurrently
Promise.all([...requests1, ...requests2])
    .then(() => {
        console.log(`All ${numRequests} requests to both servers completed.`);
    })
    .catch((error) => {
        console.error('One or more requests failed:', error);
    });
