# 游戏金币交易平台 - 管理端

现代化的游戏金币交易平台管理后台，提供完整的商家管理、订单处理和系统管理功能。

## 技术栈

- Vue 3 + Composition API + TypeScript
- Vite + TailwindCSS + Naive UI
- Pinia (状态管理)
- Vue Router (路由管理)

## 核心功能

- 管理员登录系统
- 商家管理（添加、编辑、删除商家）
- 订单管理（查看、处理订单）
- 权限管理（管理员权限控制）
- 数据统计面板

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署

### Vercel部署

1. 连接GitHub仓库到Vercel
2. 设置环境变量：
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   VITE_APP_TITLE=游戏金币交易平台管理端
   VITE_BUILD_TYPE=admin
   ```
3. 部署完成

## 项目结构

```
src/
├── api/                # API接口层
├── assets/            # 静态资源
├── components/        # 可复用组件
│   └── admin/         # 管理端专用组件
├── layouts/           # 布局组件
├── router/           # 路由配置
├── stores/           # 状态管理
├── views/            # 页面组件
│   └── admin/        # 管理端页面
├── types.ts          # 类型定义
└── main.ts           # 应用入口
```

## 环境变量

- `VITE_API_BASE_URL`: 后端API地址
- `VITE_APP_TITLE`: 应用标题
- `VITE_BUILD_TYPE`: 构建类型 (admin)

## 默认登录信息

- 用户名：admin
- 密码：admin123

## 访问地址

- 登录页面：`/admin/login`
- 管理面板：`/admin/dashboard`
- 商家管理：`/admin/merchants`
- 订单管理：`/admin/orders`
