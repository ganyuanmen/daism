# 第一阶段：依赖安装
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json  package-lock.json* ./

# 安装依赖（仅生产依赖）
RUN npm ci && npm cache clean --force

# 第二阶段：项目构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY src ./src
COPY messages ./messages
COPY public ./public
COPY next.config.ts .
COPY eslint.config.mjs .
COPY tsconfig.json .
COPY next-env.d.ts .
COPY package.json   ./
#RUN mkdir uploads

ENV NODE_ENV=production

# ---- 所有环境变量，只定义 ARG，不写明文 ----
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_BLOCKCHAIN_NETWORK
ARG NEXT_PUBLIC_HTTPS_URL
ARG NEXT_PUBLIC_ADMI_ACTOR
ARG NEXT_PUBLIC_SITEMANAGER
ARG NEXT_PUBLIC_TOTAL
ARG NEXT_PUBLIC_SCREGISTRAR
ARG NEXT_PUBLIC_IADD
ARG NEXT_PUBLIC_UNITTOKEN
ARG NEXT_PUBLIC_SCTOKEN
ARG NEXT_PUBLIC_COMMULATE
ARG NEXT_PUBLIC_SC
ARG NEXT_PUBLIC_UNITNFT
ARG NEXT_PUBLIC_DAISMDOMAIN
ARG NEXT_PUBLIC_DAISMNFT
ARG NEXT_PUBLIC_DAISMSINGLENFT
ARG NEXT_PUBLIC_DAiSMIADDPROXY
ARG NEXT_PUBLIC_DONATION

# ---- Server Action Key，不要明文，允许从外部传递 ----
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

# ---- 将 ARG 转成 ENV（必须，否则 Next.js 读不到）----
ENV NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}
ENV NEXT_PUBLIC_BLOCKCHAIN_NETWORK=${NEXT_PUBLIC_BLOCKCHAIN_NETWORK}
ENV NEXT_PUBLIC_HTTPS_URL=${NEXT_PUBLIC_HTTPS_URL}
ENV NEXT_PUBLIC_ADMI_ACTOR=${NEXT_PUBLIC_ADMI_ACTOR}
ENV NEXT_PUBLIC_SITEMANAGER=${NEXT_PUBLIC_SITEMANAGER}
ENV NEXT_PUBLIC_TOTAL=${NEXT_PUBLIC_TOTAL}
ENV NEXT_PUBLIC_SCREGISTRAR=${NEXT_PUBLIC_SCREGISTRAR}
ENV NEXT_PUBLIC_IADD=${NEXT_PUBLIC_IADD}
ENV NEXT_PUBLIC_UNITTOKEN=${NEXT_PUBLIC_UNITTOKEN}
ENV NEXT_PUBLIC_SCTOKEN=${NEXT_PUBLIC_SCTOKEN}
ENV NEXT_PUBLIC_COMMULATE=${NEXT_PUBLIC_COMMULATE}
ENV NEXT_PUBLIC_SC=${NEXT_PUBLIC_SC}
ENV NEXT_PUBLIC_UNITNFT=${NEXT_PUBLIC_UNITNFT}
ENV NEXT_PUBLIC_DAISMDOMAIN=${NEXT_PUBLIC_DAISMDOMAIN}
ENV NEXT_PUBLIC_DAISMNFT=${NEXT_PUBLIC_DAISMNFT}
ENV NEXT_PUBLIC_DAISMSINGLENFT=${NEXT_PUBLIC_DAISMSINGLENFT}
ENV NEXT_PUBLIC_DAiSMIADDPROXY=${NEXT_PUBLIC_DAiSMIADDPROXY}
ENV NEXT_PUBLIC_DONATION=${NEXT_PUBLIC_DONATION}

# ---- Server Action Key 注入 ----
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${NEXT_SERVER_ACTIONS_ENCRYPTION_KEY}

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 创建 .next/cache/images 并设置所有用户可写，防止 distroless 权限问题
# RUN mkdir -p /app/.next/cache && chmod -R 777 /app/.next/cache
#RUN mkdir -p /app/.next/cache/images && chmod -R 777 /app/.next/cache/images
# RUN mkdir -p /app/uploads && chmod -R 777 /app/uploads
# RUN mkdir -p /app/enki && chmod -R 777 /app/enki

# =========================
# Production 阶段
# =========================
# ---------- Production ----------
FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /app
USER nonroot
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
# 复制静态资源
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/server ./.next/server



# 直接用 next start 启动
CMD ["server.js"]
