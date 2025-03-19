const { createPool } = require('../config/database');

class DatabaseService {
  constructor() {
    this.pools = {};
  }

  async connect(type) {
    if (!this.pools[type]) {
      this.pools[type] = await createPool(type);
    }
    return this.pools[type];
  }

  async query(type, sql, params = []) {
    const pool = await this.connect(type);
    
    try {
      switch (type) {
        case 'mysql':
          const [results] = await pool.execute(sql, params);
          return results;
        
        case 'oracle':
          const connection = await pool.getConnection();
          try {
            const result = await connection.execute(sql, params);
            return result.rows;
          } finally {
            connection.close();
          }
        
        case 'sqlite':
          return new Promise((resolve, reject) => {
            pool.all(sql, params, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          });
        
        default:
          throw new Error(`Unsupported database type: ${type}`);
      }
    } catch (error) {
      console.error(`Database query error: ${error.message}`);
      throw error;
    }
  }

  async close(type) {
    if (this.pools[type]) {
      switch (type) {
        case 'mysql':
          await this.pools[type].end();
          break;
        case 'oracle':
          await this.pools[type].close();
          break;
        case 'sqlite':
          this.pools[type].close();
          break;
      }
      delete this.pools[type];
    }
  }
}

module.exports = new DatabaseService(); 