const { readdir, readFile } = require('fs/promises');
const { createWriteStream } = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'styles');

const writeStream = createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css')
);

writeStream.on('error', (error) => console.log('Error: ', error.message));

try {
  readdir(dir, { withFileTypes: true }).then((files) => {
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        readFile(path.join(dir, file.name), 'utf-8').then((content) => {
          writeStream.write(content);
        });
      }
    }
  });
} catch (err) {
  console.error(err);
}
