const { readFile, readdir, copyFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const destFolder = 'project-dist';
const assetsFolder = 'assets';
const cssFolder = 'styles';

(function () {
  createDir(path.join(__dirname, destFolder));
  copyDirectory(
    path.join(__dirname, assetsFolder),
    path.join(__dirname, destFolder, assetsFolder)
  );
  buildCss(path.join(__dirname, cssFolder), path.join(__dirname, destFolder));
  buildPage(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, destFolder)
  );
})();

async function createDir(dir) {
  await fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
  console.log(`Create directory ${dir}`);
}

async function copyDirectory(src, dest) {
  try {
    const files = await readdir(src, { withFileTypes: true });
    for (const file of files) {
      try {
        if (file.isFile()) {
          await copyFile(path.join(src, file.name), path.join(dest, file.name));
        }
        if (file.isDirectory()) {
          await createDir(path.join(dest, file.name));
          await copyDirectory(
            path.join(src, file.name),
            path.join(dest, file.name)
          );
        }
      } catch (error) {
        console.log('The file could not be copied', error);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function buildCss(src, dest, name = 'style.css') {
  const writeStream = fs.createWriteStream(path.join(dest, name));

  writeStream.on('error', (error) => console.log('Error: ', error.message));

  try {
    readdir(src, { withFileTypes: true }).then((files) => {
      for (const file of files) {
        if (file.isFile() && path.extname(file.name) === '.css') {
          readFile(path.join(src, file.name), 'utf-8').then((content) => {
            writeStream.write(content);
          });
        }
      }
      console.log('Build css');
    });
  } catch (err) {
    console.error(err);
  }
}

function buildPage(template, dest, pageName = 'index.html') {
  let pageTemplate = '';

  const writeStream = fs.createWriteStream(path.join(dest, pageName), 'utf-8');

  writeStream.on('error', (error) => console.log('Error: ', error.message));

  const readStream = fs.createReadStream(template, 'utf-8');

  readStream.on('data', (data) => {
    pageTemplate = data;

    const regexp = /{{(\w+)}}/g;
    const matches = data.matchAll(regexp);

    const components = Array.from(matches, (match) => match[1]);

    Promise.all(
      components.map((component) => {
        return readFile(
          path.join(__dirname, 'components', `${component}.html`),
          'utf-8'
        );
      })
    )
      .then((componentsBuffer) => {
        components.forEach((component, index) => {
          const regexp = new RegExp(`{{${component}}}`);
          pageTemplate = pageTemplate.replace(regexp, componentsBuffer[index]);
        });
        writeStream.write(pageTemplate);
        console.log(`Build ${pageName}`);
      })
      .catch((error) => console.error(error.message));
  });

  readStream.on('error', (error) => console.log(error.message));
}
