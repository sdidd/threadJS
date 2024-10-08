import express from 'express';

const app = express();
const PORT = 4000;

// Define a GET endpoint
app.get('/hello', (req, res) => {
    res.send('hello');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
