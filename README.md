# DBMS

This is homework for [DBMS](http://dblab.csie.ncku.edu.tw/course/2016u/index.html). This is a simple sql database using `hash table`.

- Development Environment: Mac OS X 10.11.5
- [Node.js](https://nodejs.org/en/) must be installed.

## Install

- Install package
```
  npm install -i
```

- Build project
```
  npm run build
```

## Usage

- Run
```
  npm run start
```

- Command
    - read -> read file
    - hash -> show all hash table in class
    - data -> show all data in class
    - save -> save hash table to local
    - show -> show all table
    - select -> use like 'select' query
    - help -> show command informantion
    - exit

## Program structure

```
├── bin
│   └── index.js
├── data
│   ├── books.txt
│   └── sellRecord.txt
└── src
    ├── db.jsx
    ├── hash.jsx
    ├── index.jsx
    └── shell.jsx
```

- `bin/index.js` -> execute program
- `data` -> default databse file for program
- `src` -> `es6` files
    - hash -> hash function which teacher give
    - index -> control program mainly
    - shell -> shell for program
    - db -> `db` class for save data and execute function
        - readFile -> read database from local files
        - save -> save hash table to local
        - getHash -> get hash table in class
        - getData -> get data in class
        - show -> show all table
        - query -> query to database(just 'select')

## How to make this program

1. Read database from local files
2. Save data to `data` and `hashtable` in class
3. Analyze query and operate `data` and `hashtable` to output result

## Example

- [output hash table](https://github.com/HsuTing/DBMS/tree/master/data/output)

- SELECT * FROM books
```
[DB] TABLE books 
isbn | author | title | price | subject
-----|--------|-------|-------|--------
345350499 | Marion Zimmer Bradley | The mists of avalon | 12.95 | FICTION
034538475X | Anne Rice | The tale of the body thief | 6.99 | FICTION
439139597 | J. K. Rowling | Harry Potter and the goblet of fire | 25.95 | CHILDREN
439064864 | J. K. Rowling | Harry Potter and the chambers of secrets | 17.95 | CHILDREN
375810609 | Jean DE Brunhoff | Bonjour Babar | 29.95 | CHILDREN
345377648 | Anne Rice | Lasher | 14 | FICTION
439136350 | J. K. Rowling | Harry Potter and the chamber of secrets | 19.95 | CHILDREN
395851580 | James Marshall | George and Martha the complete stories of two best friends | 25 | CHILDREN
345313860 | Anne Rice | The vampire lestat | 6.99 | FICTION
042510107X |  Tom Clancy | Red Storm Rising | 7.99 | FICTION
345337662 | Anne Rice | Interview with a vampire | 6.99 | FICTION
```

- SELECT title,author FROM books
```
[DB] TABLE books 
title | author
------|-------
Harry Potter and the goblet of fire | J. K. Rowling
George and Martha the complete stories of two best friends | James Marshall
The mists of avalon | Marion Zimmer Bradley
Interview with a vampire | Anne Rice
Lasher | Anne Rice
Harry Potter and the chambers of secrets | J. K. Rowling
The vampire lestat | Anne Rice
The tale of the body thief | Anne Rice
Harry Potter and the chamber of secrets | J. K. Rowling
Bonjour Babar | Jean DE Brunhoff
Red Storm Rising |  Tom Clancy
```

- SELECT title,author FROM books WHERE author='J. K. Rowling'
```
[DB] TABLE books 
title | author
------|-------
Harry Potter and the goblet of fire | J. K. Rowling
Harry Potter and the chambers of secrets | J. K. Rowling
Harry Potter and the chamber of secrets | J. K. Rowling
```

- SELECT title FROM books,sellRecord WHERE isbn=isbn_no AND author='J. K. Rowling'
```
[DB] TABLE books 
title
-----
Harry Potter and the goblet of fire
Harry Potter and the goblet of fire
Harry Potter and the chambers of secrets
Harry Potter and the chamber of secrets
Harry Potter and the chamber of secrets
```

- SELECT DISTINCT author FROM books
```
[DB] TABLE books 
author
------
Marion Zimmer Bradley
J. K. Rowling
 Tom Clancy
Anne Rice
James Marshall
Jean DE Brunhoff
```
