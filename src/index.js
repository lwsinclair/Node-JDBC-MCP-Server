require('dotenv').config();
const express = require('express');
const cors = require('cors');
const databaseService = require('./services/databaseService');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 执行SQL查询接口
app.post('/query', async (req, res) => {
  try {
    const { type, sql, params } = req.body;
    
    if (!type || !sql) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const results = await databaseService.query(type, sql, params);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 关闭数据库连接接口
app.post('/close', async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Missing database type' });
    }

    await databaseService.close(type);
    res.json({ success: true, message: `Closed connection to ${type}` });
  } catch (error) {
    console.error('Close connection error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing database connections...');
  await Promise.all([
    databaseService.close('mysql'),
    databaseService.close('oracle'),
    databaseService.close('sqlite')
  ]);
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 