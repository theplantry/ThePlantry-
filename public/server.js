// filepath: server.js
const express = require('express');
const app = express();
const port = 3000;
// Serve static files from the root directory (e.g., index.html, images)
app.use(express.static('.'));
// Example API endpoint (for full-stack functionality, e.g., fetching data)
app.get('/api/images', (req, res) => {
    res.json([
        { name: 'Criss1', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=900', description: 'description' },
        { name: 'Another', url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=900' }
    ]);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});