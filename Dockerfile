# 多阶段构建：先构建前端和后端
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 先构建后端
COPY doraemon-nodejs/package.json doraemon-nodejs/pnpm-lock.yaml ./doraemon-nodejs/
RUN cd doraemon-nodejs && pnpm install --prod --frozen-lockfile

# 构建前端
COPY doraemon-vue/package.json doraemon-vue/pnpm-lock.yaml ./doraemon-vue/
RUN cd doraemon-vue && pnpm install --frozen-lockfile

# 复制前端源码并构建
COPY doraemon-vue ./doraemon-vue
WORKDIR /app/doraemon-vue
RUN pnpm run build

# 生产环境镜像
FROM node:18-alpine AS production

# 安装必要的系统依赖
RUN apk add --no-cache \
    dumb-init \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

# 设置工作目录
WORKDIR /app

# 复制后端代码和依赖
COPY doraemon-nodejs ./doraemon-nodejs
COPY --from=builder /app/doraemon-nodejs/node_modules ./doraemon-nodejs/node_modules

# 复制前端构建产物
COPY --from=builder /app/doraemon-vue/dist ./doraemon-nodejs/public/dist

# 创建需要持久化的目录
RUN mkdir -p /app/doraemon-nodejs/public/images/avatars \
    && mkdir -p /app/doraemon-nodejs/public/images/news \
    && mkdir -p /app/doraemon-nodejs/public/images/map

# 设置目录权限
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production \
    PORT=3000

# 使用 dumb-init 作为 PID 1
ENTRYPOINT ["dumb-init", "--"]

# 启动应用
CMD ["node", "doraemon-nodejs/bin/www"]