'use strict';

import path from 'path';

import DB from './db';
import Shell from './shell';

const base_path = path.resolve(__filename, "..");

const db = new DB();

[
  { name: "books", path: path.resolve(base_path, "./../data/books.txt") },
  { name: "sellRecord", path: path.resolve(base_path, "./../data/sellRecord.txt") }
].map((file) => {
  db.readFile(file.name, file.path);
});

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();

  if (chunk !== null) {
    let commands = chunk.replace("\n", "")
      .split(" ");

    Shell(commands[0].toLowerCase(), db, commands);
  }
});
