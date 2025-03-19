require('dotenv').config();

const mysql = require('mysql2/promise');
const oracledb = require('oracledb');
const sqlite3 = require('sqlite3').verbose();

// MySQL配置
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

// Oracle配置
const oracleConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING
};

// SQLite配置
const sqliteConfig = {
  filename: process.env.SQLITE_DATABASE
};

// 创建数据库连接池
const createPool = async (type) => {
  switch (type) {
    case 'mysql':
      return await mysql.createPool(mysqlConfig);
    case 'oracle':
      return await oracledb.createPool(oracleConfig);
    case 'sqlite':
      return new sqlite3.Database(sqliteConfig.filename);
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
};

module.exports = {
  createPool
}; 