// import fs from "fs";
// import path from "path";
// import { fileURLToPath, pathToFileURL } from "url";
// import Sequelize from "sequelize";
// import configFile from "../../config/config.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const env = process.env.NODE_ENV || "development";
// const config = configFile[env];
// const db = {};

// const sequelize = config.use_env_variable
//   ? new Sequelize(process.env[config.use_env_variable], config)
//   : new Sequelize(config.database, config.username, config.password, config);

//   const files = fs.readdirSync(__dirname).filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== path.basename(__filename) &&
//       file.slice(-3) === ".js"
//     );
//   });
  
//   for (const file of files) {
//     const modelModule = await import(pathToFileURL(path.join(__dirname, file)));
//     const model = modelModule.default(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   }
  
//   Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });
  

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;


// export default db;


// src/models/index.js
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import configFile from "../../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];
const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== path.basename(__filename) &&
    file.slice(-3) === ".js"
  );
});

for (const file of files) {
  const modelModule = await import(pathToFileURL(path.join(__dirname, file)));

  // ✅ Fix: agar default export hai use lelo, warna pehla exported function lo
  const modelFn =
    typeof modelModule.default === "function"
      ? modelModule.default
      : Object.values(modelModule).find((exp) => typeof exp === "function");

  if (!modelFn) {
    console.warn(`⚠️ Model file ${file} did not export a function`);
    continue;
  }

  const model = modelFn(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

