# Netlify 部署说明

本项目已配置为可以直接部署到 Netlify。

## 自动部署

1. 将代码推送到 GitHub/GitLab/Bitbucket 仓库
2. 在 Netlify 控制台中连接你的仓库
3. Netlify 会自动检测到 `netlify.toml` 配置文件并使用其中的设置

## 配置说明

项目包含以下配置：

### `netlify.toml`
- **构建命令**: `pnpm install && pnpm run build`
- **发布目录**: `.vitepress/dist`
- **Node.js 版本**: 22
- **pnpm 版本**: 10.13.1

### 安全头部
配置了以下安全头部：
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer
- X-XSS-Protection: 1; mode=block

### 缓存策略
- 静态资源 (assets) 缓存 1 年
- 图片文件缓存 7 天
- 包含防盗链和安全重定向

## 手动部署

如果你想手动部署，可以：

1. 本地构建：
```bash
pnpm install
pnpm run build
```

2. 将 `.vitepress/dist` 目录内容上传到 Netlify

## 环境要求

- Node.js >= 22.0.0
- pnpm >= 10.13.0

## 故障排除

如果构建失败，请检查：
1. Node.js 和 pnpm 版本是否符合要求
2. 所有依赖是否正确安装
3. 构建命令是否成功执行 
