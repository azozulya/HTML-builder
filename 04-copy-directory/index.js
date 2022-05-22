const fs = require('fs');
const { readdir, copyFile } = require('fs/promises');
const path = require('path');
const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

fs.mkdir(dest, { recursive: true }, (err) => {
  if (err) throw err;
});

(async function (dir) {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      console.log(file);
      try {
        await copyFile(path.join(src, file), path.join(dest, file));
      } catch (error) {
        console.log('The file could not be copied', error);
      }
    }
  } catch (err) {
    console.error(err);
  }
})(src);
