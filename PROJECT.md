# 量角器 Protractor — 移动端 Web 应用

## 项目概述

量角器是一家设计师主导的装饰公司的全流程项目管理系统，包含品牌展示、客户门户、管理后台三大模块。

- **技术栈**：Next.js 16 (App Router) + Supabase + Tailwind CSS
- **部署平台**：Vercel
- **数据库**：Supabase (PostgreSQL)
- **创建时间**：2026-04-05

---

## 线上地址

**正式域名：** https://guogaoliang.cn

| 页面 | 地址 |
|------|------|
| 品牌首页 | https://guogaoliang.cn |
| 服务流程 | https://guogaoliang.cn/services |
| 关于我们 | https://guogaoliang.cn/about |
| 预约咨询 | https://guogaoliang.cn/contact |
| **客户登录** | https://guogaoliang.cn/login |
| **客户仪表盘** | https://guogaoliang.cn/dashboard |
| **管理后台** | https://guogaoliang.cn/admin |

> Vercel 备用地址：https://protractor-app-xi.vercel.app

## 本地开发地址

| 页面 | 地址 |
|------|------|
| 品牌首页 | http://localhost:3000 |
| **客户登录** | http://localhost:3000/login |
| **客户仪表盘** | http://localhost:3000/dashboard |
| **管理后台** | http://localhost:3000/admin |

---

## 登录账号

| 角色 | 手机号 | 密码 | 登录后跳转 |
|------|--------|------|-----------|
| 管理员（郭高亮） | `18629148762` | `admin123` | `/admin` |
| 客户（张伟） | `13800001111` | `123456` | `/dashboard` |
| 客户（李婷） | `13800002222` | `123456` | `/dashboard` |

统一登录入口：`/login`，根据角色自动跳转。

---

## Supabase 配置

| 项目 | 值 |
|------|---|
| Project Name | protractor |
| Project URL | https://yinizhlydudvbuhpevzp.supabase.co |
| Region | 见 Supabase Dashboard |
| 数据库表 | 15 张（profiles, clients, invitations, projects, project_stages, stage_items, materials, project_materials, quotes, quote_items, contracts, signatures, photos, notifications, contact_inquiries） |

环境变量存放于 `.env.local`（不提交 Git）。

---

## 页面清单（26页）

### 公开品牌页（5页）
- `/` — 品牌首页（15个板块完整展示）
- `/about` — 关于我们 + 创始人 + 优势 + 品质承诺
- `/services` — 11阶段时间线 + 8大工艺体系 + 工艺卡 + 定价
- `/contact` — 预约咨询表单
- `/login` — 客户/管理员登录

### 客户门户（8页，需登录）
- `/dashboard` — 项目仪表盘
- `/project/[id]` — 项目阶段时间线
- `/project/[id]/stage/[stageId]` — 阶段检查项 + 确认
- `/project/[id]/materials` — 材料清单 + 在线确认
- `/project/[id]/quote` — 报价单 + 确认签字
- `/project/[id]/contract` — 合同 + Canvas 手写签名
- `/project/[id]/photos` — 施工照片墙
- `/notifications` — 消息通知
- `/profile` — 个人中心 + 退出登录

### 管理后台（11页，需管理员登录）
- `/admin` — 概览面板
- `/admin/projects` — 项目列表
- `/admin/projects/new` — 新建项目
- `/admin/projects/[id]` — 项目管理详情
- `/admin/projects/[id]/stages` — 阶段进度管理（展开/勾选/状态切换）
- `/admin/clients` — 客户列表
- `/admin/clients/new` — 新建客户 + 生成登录账号
- `/admin/materials` — 材料库（搜索 + 分类）
- `/admin/contracts` — 合同模板管理
- `/admin/notifications` — 消息推送

### 认证（1页）
- `/invite/[token]` — 邀请链接落地页

---

## 首页内容结构（15个板块）

| 序号 | 组件 | 板块 | 背景 |
|------|------|------|------|
| 01 | HeroSection | 品牌封面 + slogan + 数据 | 浅 |
| 02 | PainPoints | 行业痛点（三个真相） | 深 |
| 03 | Positioning | 第四类装饰公司 + 金句 | 浅 |
| 04 | FounderProfile | 创始人（郭高亮） | 浅 |
| 05 | ValueCards | 我们相信（三大价值观） | 深 |
| 06 | TwoEngines | 双引擎驱动 | 浅 |
| 07 | CraftSystems | 八大标准化工艺体系 | 深 |
| 08 | CraftCard | 工艺卡示例（防水涂刷） | 浅 |
| 09 | SupplierSystem | 严选供应商（6大品类） | 浅 |
| 10 | ServiceTimeline | 全流程服务（11阶段） | 浅 |
| 11 | PricingTable | 透明定价模型 | 浅 |
| 12 | WhyProtractor | 为什么选择量角器（4大优势） | 深 |
| 13 | QualityPromise | 品质承诺（100%/5年/48h） | 浅 |
| 14 | IdealClient | 理想客户画像 | 深 |
| 15 | ContactCTA | 联系方式 + 预约CTA | 深 |

---

## 本地开发

```bash
cd ~/Desktop/量角器品牌PPT/protractor-app

# 启动开发服务器
npm run dev

# 构建
npm run build

# 部署到 Vercel
npx vercel --prod
```

---

## 核心目录结构

```
protractor-app/
├── .env.local                    # Supabase 密钥（不提交Git）
├── PROJECT.md                    # 本文件
├── supabase/migrations/          # 数据库 SQL
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页（15个板块）
│   │   ├── (public)/             # 公开页（about/services/contact）
│   │   ├── (auth)/               # 登录/邀请
│   │   ├── (portal)/             # 客户门户
│   │   ├── (admin)/              # 管理后台
│   │   └── api/                  # API 路由
│   ├── components/
│   │   ├── ui/                   # 基础组件（Button/Card/Badge/ProgressBar）
│   │   ├── layout/               # 布局（Header/BottomNav）
│   │   ├── brand/                # 品牌展示组件（15个）
│   │   ├── portal/               # 客户门户组件
│   │   └── admin/                # 管理后台组件
│   └── lib/
│       ├── supabase/             # Supabase 客户端
│       ├── constants/            # 品牌常量 + 11阶段数据
│       └── utils/                # 工具函数
```

---

*最后更新：2026-04-06*
