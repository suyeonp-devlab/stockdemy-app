# syntax=docker/dockerfile:1

# ===== base =====
FROM node:20.18-alpine AS base

# ===== deps: 의존성 설치 단계 =====
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ===== builder: 빌드 수행 단계 =====
FROM base AS builder
WORKDIR /app

# node_modules 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스코드 복사
COPY . .

# 환경변수 주입
ARG NEXT_PUBLIC_API_URL
ARG INTERNAL_API_URL
ARG SITE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
ENV SITE_URL=$SITE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ===== runner: 실제로 컨테이너가 실행될 때 쓰이는 최종 이미지 =====
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# public 폴더 복사
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 빌드 결과물 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 정적 자산 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]