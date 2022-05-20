const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
stream.on('data', (data) => console.log(data));
stream.on('end', () => console.log('The end'));
stream.on('error', (error) => console.log(error.message));
