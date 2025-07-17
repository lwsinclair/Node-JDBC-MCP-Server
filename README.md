[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/darksheep404-node-jdbc-mcp-server-badge.png)](https://mseep.ai/app/darksheep404-node-jdbc-mcp-server)

# Node.js JDBC MCP Server

这是一个基于Node.js的JDBC MCP服务器，支持MySQL、Oracle和SQLite数据库。

## 系统要求

- Node.js >= 18.0.0
- MySQL Server
- Oracle Database (可选)
- SQLite3

## 安装

1. 克隆项目：
```bash
git clone [repository-url]
cd node-jdbc-server
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
复制 `.env.example` 文件为 `.env`，并根据实际情况修改配置。

## 使用方法

1. 启动服务器：
```bash
npm start
```

2. 开发模式启动（支持热重载）：
```bash
npm run dev
```

## API接口

### 健康检查
```
GET /health
```

### 执行SQL查询
```
POST /query
Content-Type: application/json

{
  "type": "mysql|oracle|sqlite",
  "sql": "SELECT * FROM users WHERE id = ?",
  "params": [1]
}
```

### 关闭数据库连接
```
POST /close
Content-Type: application/json

{
  "type": "mysql|oracle|sqlite"
}
```

## 注意事项

1. 使用Oracle数据库时，需要安装Oracle客户端
2. 确保数据库服务器已启动并可访问
3. 正确配置数据库连接信息
4. 建议在生产环境中使用环境变量管理敏感信息 