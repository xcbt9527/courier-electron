import Datastore from "nedb";
import path from "path";

export default new Datastore({
  autoload: true,
  filename: path.resolve(__dirname, "../../../data/data.db")
});

// let doc = {
//   id: 1,
//   password:'admin',
//   user:'admin',
//   name: 'user'
// }
// this.$db.insert(doc, function(err, new_doc) {
//   'use strict'
//   console.log(err, new_doc)
// })
