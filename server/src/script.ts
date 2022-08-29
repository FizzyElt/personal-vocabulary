import fs from 'fs';

function createJsonFile(name: string, content: any, path: string) {
  if (fs.existsSync(`${path}/${name}.json`)) return;

  fs.appendFileSync(`${path}/${name}.json`, JSON.stringify(content));

  //fs.writeFileSync(`${path}/${name}.json`, JSON.stringify(content));
}

export function generateWordFiles(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
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
    // try {
    //   fs.accessSync(`${path}/${name}.json`, fs.constants.F_OK);
    // } catch (err) {
    createJsonFile(name, { words: [] }, path);
  });
}
