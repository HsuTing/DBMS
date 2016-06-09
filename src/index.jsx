'use strict';

import path from 'path';

import DB from './db';
import Hash from './hash';

const base_path = path.resolve(__filename, "..");

const db = new DB();

[
  { name: "books", path: path.resolve(base_path, "./../data/books.txt") },
  { name: "sellRecord", path: path.resolve(base_path, "./../data/sellRecord.txt") }
].map((file) => {
  db.readFile(file.name, file.path);
});
