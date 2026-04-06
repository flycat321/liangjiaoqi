#!/bin/bash
# 一键推送 + 部署
set -e
cd "$(dirname "$0")"

echo "📦 推送代码到 GitHub..."
git push

echo "🚀 部署到 Vercel..."
npx vercel --prod --yes 2>&1 | tail -3

echo "✅ 部署完成 → https://guogaoliang.cn"
