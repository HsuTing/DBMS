'use strict';

import process from 'process';

export default (command, db, setting) => {
  switch(command) {
    case "read":
      db.readFile(setting[1], setting[2]);
      break;

    case "hash":
      db.getHash();
      break;

    case "data":
      db.getData();
      break;

    case "save":
      db.save();
      break;

    case "show":
      db.show();
      break;

    case "select":
      if(setting.length === 1) {
        process.stdout.write("[DB] 'select' need arguments\n");
      }
      else {
        db.query(setting);
      }
      break;

    case "help":
      process.stdout.write("[DB] 'read' to read file\n");
      process.stdout.write("[DB] 'hash' to show all hash table in class\n");
      process.stdout.write("[DB] 'data' to show all data in class\n");
      process.stdout.write("[DB] 'save' to save hash table to local\n");
      process.stdout.write("[DB] 'show' to show all table\n");
      process.stdout.write("[DB] 'select' to use like 'select' query\n");
      process.stdout.write("[DB] 'exit' to leave\n");
      break;

    case "exit":
      process.exit(0);
      break;

    default:
      process.stdout.write("[DB] con not find this command: " + command + "\n");
      process.stdout.write("[DB] 'exit' to leave\n");
      process.stdout.write("[DB] 'help' to get command\n");
      break;
  }
};
