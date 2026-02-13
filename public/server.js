const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Check if index.html exists
const indexPath = path.join(__dirname, 'index.html');
console.log('Checking for index.html at:', indexPath);
console.log('File exists?', fs.existsSync(indexPath));

// List all files in the directory
console.log('\nFiles in public directory:');
fs.readdirSync(__dirname).forEach(file => {
    console.log('  -', file);
});

// Serve static files
app.use(express.static(__dirname));

// Main route
app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:3000/`);
});