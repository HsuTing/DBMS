'use strict';

import fs from 'fs';
import path from 'path';
import process from 'process';
import uuid from 'uuid';

import Hash from './hash';

const base_path = path.resolve(__filename, "./../../data/output");

export default class DB {
  constructor() {
    this.data = {};
    this.hashtable = {};
    this.temp_attributes = [];
    this.flag = "";
    this.distinct = false;
    this.query_data = {
      columns: "",
      tables: "",
      datas: ""
    };
    this.error = false;
  }

  readFile(name, file) {
    const base_file_path = process.cwd();

    fs.readFile(path.resolve(base_file_path, file), 'utf-8', (err, data) => {
      if(err) console.log(err);

      this.__parse__(name, data);
      process.stdout.write("[DB] input '" + name + ".txt'\n");
    });
  }

  save(callback) {
    for(let name in this.hashtable) {
      const file_path = path.resolve(base_path, name+".txt");
      const data = this.__format_output__(this.hashtable[name]);

      fs.writeFile(file_path, data, (err) => {
        if(err) console.log(err);

        process.stdout.write("[DB] output '" + name + ".txt'\n");
      });
    }
  }

  getHash() {
    process.stdout.write("[DB] hashtable in cache \n" + JSON.stringify(this.hashtable) + "\n");
  }

  getData() {
    process.stdout.write("[DB] data in cache \n" + JSON.stringify(this.data) + "\n");
  }

  show() {
    let querys = {};
    Object.keys(this.hashtable).map((attribute) => {
      let table_name = attribute.split("_")[0];
      querys[table_name] = "SELECT * from " + table_name;
    });

    for(let table_name in querys) {
      this.query(querys[table_name].split(" "));
    }
  }

  query(commands) {
    this.__default_query__();

    commands.map((command, index) => {
      switch(command.toLowerCase()) {
        case "distinct":
          this.distinct = true;
          break;

        case "select":
          this.__raise_flag__("columns");
          break;

        case "from":
          this.__raise_flag__("tables");
          break;

        case "where":
          this.__raise_flag__("datas");
          break;

        default:
          if(!this.__make_query__(command)) return;
          break;
      }
    });

    this.__select__();
  }

  __select__() {
    this.temp_attributes = [];
    this.error = false;

    const tables = this.query_data.tables.split(",");
    const columns = this.query_data.columns.split(",");
    const datas = this.query_data.datas.replace("and", "AND").split("AND");

    if(tables.length === 1 && tables[0] === "") {
      this.error = true;
      process.stdout.write("[DB] not give a table to select\n");
      return;
    }

    tables.map((table) => {
      if(columns.length === 1 && columns[0].replace(/ /g, "") === "*") {
        this.__get_all_columns__(table.replace(/ /g, ""));
      }
      else {
        columns.map((column) => {
          let attribute_name =  table.replace(/ /g, "") + "_" + column.replace(/ /g, "");
          if(this.hashtable[attribute_name] === undefined) return;

          this.temp_attributes.push(attribute_name);
        });
      }
    });

    let data;
    if(!this.error) {
      data = datas.length === 1 && datas[0] === "" ? this.__get_data_no_setting__(tables) : this.__get_data__(tables, datas) ;
      if(!this.error) {
        this.__output_query__(data);
      }
    }
  }

  __output_query__(data) {
    let table_names = {};
    let output_name = "";
    let attributes = this.temp_attributes.map((attribute, index) => {
      table_names[ attribute.split("_")[0] ] = "";
      return attribute.split("_")[1];
    }).join(" | ");
    for(let table_name in table_names) {
      output_name += "TABLE " + table_name + " ";
    }
    process.stdout.write("[DB] " + output_name + "\n");
    process.stdout.write(attributes + "\n");

    let divider = this.temp_attributes.map((attribute) => {
      let attribute_name = attribute.split("_")[1];
      let temp_divider = "";

      for(let i = 0; i < attribute_name.length; i++) {
        temp_divider += "-";
      }
      return temp_divider;
    }).join("-|-");;
    process.stdout.write(divider + "\n");

    let check_distinct = {};
    if(this.distinct) {
      this.temp_attributes.map((attribute, index) => {
        check_distinct[attribute] = {};
      });
    }

    for(let uuid in data) {
      let check = true;
      let output = this.temp_attributes.map((attribute, index) => {
       const value = data[uuid][attribute];
        if(this.distinct) {
          if(check_distinct[attribute][value]) check = false;
          check_distinct[attribute][value] = true;
        }

        return value;
      }).join(" | ");

      if(check) process.stdout.write(output + "\n");
    }
  }

  __get_data__(tables, settings) {
    let check_times = settings.length;
    let candidates = {};
    let attributes = [];

    settings.map((setting) => {
      let attr = setting.split("=");

      tables.map((table) => {
        let hash_table_name = table.replace(/ /g, "") + "_" + attr[0].replace(/ /g, "");

        if(this.hashtable[hash_table_name] !== undefined) {
          let values = attr[1].split("'");

          if(values.length !== 1) {
            attributes.push({
              name: hash_table_name,
              value: values[1],
              hash: Hash(values[1])
            });
          }
          else {
            tables.map((temp_table) => {
              let temp_hash_table_name = temp_table.replace(/ /g, "") + "_" + values[0].replace(/ /g, "");
              if(this.hashtable[temp_hash_table_name] === undefined) return;

              let temp_hashtable = this.hashtable[temp_hash_table_name];
              for(let num in temp_hashtable) {
                temp_hashtable[num].map((d) => {
                  this.hashtable[hash_table_name][ Hash(d.value) ].map((dd) => {
                    if(dd.value === d.value) {
                      if(candidates[dd.uuid] === undefined) {
                        candidates[dd.uuid] = { time: 1, other: {} };
                        candidates[dd.uuid].other[d.uuid] = "";
                      }
                      else {
                        candidates[dd.uuid].time += 1;
                        candidates[dd.uuid].other[d.uuid] = "";
                      }
                    }
                  });
                });
              }
            });
          }
        }
      });
    });

    attributes.map((attribute) => {
      this.hashtable[attribute.name][attribute.hash].map((d) => {
        if(d.value !== attribute.value) return;
        if(candidates[d.uuid] === undefined) {
          candidates[d.uuid] = { time: 1, other: {} };
        }
        else {
          candidates[d.uuid].time += 1;
        }
      });
    });

    let output = {};
    for(let uuid in candidates) {
      if(candidates[uuid].time < check_times) continue;

      if(Object.keys(candidates[uuid].other).length === 0) {
        output[uuid] = this.data[uuid];
      }
      else {
        for(let other in candidates[uuid].other) {
          output[ uuid+"_"+other ] = {};
          for(let data in this.data[uuid]) {
            output[ uuid+"_"+other ][data] = this.data[uuid][data];
          }
          for(let other_data in this.data[other]) {
            output[ uuid+"_"+other ][other_data] = this.data[other][other_data];
          }
        }
      }
    }

    let real_output = {};
    for(let uuid in output) {
      let check = 0;
      attributes.map((attribute) => {
        if(output[uuid][attribute.name] === attribute.value) {
          check = check + 1;
        }
      });
      if(check === attributes.length) {
        real_output[uuid] = output[uuid];
      }
    }

    return real_output;
  }

  __get_data_no_setting__(tables) {
    if(tables.length !== 1) {
      this.error = true;
      process.stdout.write("[DB] Can not select data from tables without setting 'WHERE'\n");
      return;
    }

    let data = {};
    const attribute = this.temp_attributes[0];
    const hashtable = this.hashtable[attribute];

    if(hashtable === undefined) {
      const name = attribute.split("_");
      this.error = true;
      process.stdout.write("[DB] no column '" + name[1] + "' in table '" + name[0] + "'\n");
      return;
    }

    for(let i in hashtable) {
      hashtable[i].map((d, i) => {
        if(data[d.uuid] !== undefined) return;
        data[d.uuid] = this.data[d.uuid];
      });
    }

    return data;
  }

  __get_all_columns__(table_name) {
    const attributes = Object.keys(this.hashtable);

    attributes.map((attribute) => {
      if(attribute.indexOf(table_name) === -1) return;

      this.temp_attributes.push(attribute);
    });

    if(this.temp_attributes.length === 0) {
      process.stdout.write("[DB] No such table '" + table_name + "'\n");
      this.error = true;
    }
  }

  __make_query__(data) {
    if(this.query_data[ this.flag ] === undefined) {
      process.stdout.write("[DB] do not key any word before 'select'");
      return false;
    }

    this.query_data[ this.flag ] += data + " ";
    return true;
  }

  __default_query__() {
    this.flag = "";
    this.distinct = false;
    for(let query_name in this.query_data) {
      this.query_data[ query_name ] = "";
    }
  }

  __raise_flag__(flag) {
    this.flag = flag;
  }

  __parse__(name, data) {
    const lines = data.split("\r\n");

    lines.map((line, index) => {
      if(line === "") return;
      if(index === 0) {
        this.__get_attributes__(name, line);
        return;
      }   

      let temp_data = {};
      let data_uuid = uuid.v4();

      line
        .split("|")
        .map((value, index) => {
          const attribute_name = name + "_" + this.temp_attributes[index];

          this.hashtable[attribute_name][ Hash(value) ].push({uuid: data_uuid, value: value});
          temp_data[attribute_name] = value;
        });
      this.data[ data_uuid ] = temp_data;
    }); 
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

      this.hashtable[attribute_name] = default_object;
    });

    this.temp_attributes = attributes;
  }

  __format_output__(data) {
    let output = "";
    for(let num in data) {
      output += "Bucket " + num + " | ";
      data[num].map((d, i) => {
        output += i === 0 ? "" : ", ";
        output += d.value; 
      });
      output += "\n";
    }

    return output;
  }
};
