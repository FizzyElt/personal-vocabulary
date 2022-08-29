const fs = require('fs');

function createJsonFile(name, content, path) {
  fs.writeFile(`${path}/${name}.json`, JSON.stringify(content), (err, data) => {
    if (err) {
      console.error('fail', err);
    }
    console.log(`create ${name} file successfully`);
  });
}

[
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
].forEach((name) => {
  createJsonFile(name, { words: [] }, 'words');
});
