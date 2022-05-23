const fs = require('fs');
const path = require('path');

const { stdin, stdout, stderr } = process;

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
);

stdout.write('Hi! Where are you from?\n'); // \033[32m green
stdin.on('data', (data) => {
  writeStream.write(data);
  if (data.indexOf('exit') >= 0) process.exit();
});

writeStream.on('error', (error) => console.log('Error: ', error.message));

process.on('SIGINT', () => process.exit(0));

process.on('exit', (code) => {
  if (code === 0) {
    stdout.write('\nThe end. Good luck!');
  } else {
    stderr.write(`Something happend. Error code: ${code}`);
  }
});
