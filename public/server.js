// filepath: server.js
const express = require('express');
const app = express();
const port = 3000;
// Serve static files from the root directory (e.g., index.html, images)
app.use(express.static('.'));
// Example API endpoint (for full-stack functionality, e.g., fetching data)
app.get('/api/images', (req, res) => {
    res.json([
        { name: 'Criss1', url: 'https://res.cloudinary.com/dlilbzrl9/image/upload/v1773877452/IMG_1891_snw6am.heic', description: 'description' },
        { name: 'Another', url: 'https://res.cloudinary.com/dlilbzrl9/image/upload/v1773877391/IMG_1439.heic_ywjajh.webp' }
    ]);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});