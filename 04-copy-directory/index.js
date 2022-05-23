const fs = require('fs');
const { readdir, copyFile, rm } = require('fs/promises');
const path = require('path');
const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

(async function () {
  await rm(dest, {
    force: true,
    recursive: true,
  }).then((error) => {
    if (error) return console.log(error);
  });
  await createDir(dest);
  copyDir(src);
})();

function createDir(dir) {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function copyDir(dir) {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      try {
        await copyFile(path.join(src, file), path.join(dest, file));
      } catch (error) {
        console.log('The file could not be copied', error);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
