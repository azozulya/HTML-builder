const { readdir } = require('fs/promises');
const { stat } = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'secret-folder');

(async function (dirPath) {
  try {
    const files = await readdir(dirPath);
    for (const file of files) {
      stat(path.join(dir, file), (err, stats) => {
        const { name, ext } = path.parse(file);
        if (stats.isFile())
          console.log(
            `${name} - ${ext.replace('.', '')} - ${stats.size * 0.001}kb`
          );
        if (err) console.log('Error:', err);
      });
    }
  } catch (err) {
    console.error(err);
  }
})(dir);
