'use strict';

import fs from 'fs';
import path from 'path';

import Hash from './hash';

const base_path = path.resolve(__filename, "./../../data/output");

export default class DB {
  constructor() {
    this.data = {};
    this.temp_attributes = [];
  }

  readFile(name, file) {
    fs.readFile(file, 'utf-8', (err, data) => {
      if(err) console.log(err);

      this.__parse__(name, data);
    });
  }

  save() {
    for(let name in this.data) {
      const file_path = path.resolve(base_path, name+".txt");
      const data = this.__format_output__(this.data[name]);

      fs.writeFile(file_path, data, (err) => {
        if(err) console.log(err);

        console.log(name + " is OK.");
      });
    }
  }

  __parse__(name, data) {
    const lines = data.split("\r\n");

    lines.map((line, index) => {
      if(line === "") return;
      if(index === 0) {
        this.__get_attributes__(name, line);
        return;
      }   

      line
        .split("|")
        .map((value, index) => {
          const attribute_name = name + "_" + this.temp_attributes[index];
          this.data[attribute_name][ Hash(value) ].push(value);
        });
    }); 

    this.save();
  }

  __get_attributes__(name, data) {
    const attributes = data
      .replace(/[\/]|[\*]|[ ]/g, "") 
      .split("|");

    attributes.map((attribute, index) => {
      const attribute_name = name + "_" + attribute;
      let default_object = {};

      Array.apply(null, {length: 10}).map((d, i) => {
        default_object[i] = [];
      });

      this.data[attribute_name] = default_object;
    });

    this.temp_attributes = attributes;
  }

  __format_output__(data) {
    let output = "";
    for(let num in data) {
      output += "Bucket " + num + " | ";
      data[num].map((d, i) => {
        output += i === 0 ? "" : ", ";
        output += d; 
      });
      output += "\n";
    }

    return output;
  }
};
