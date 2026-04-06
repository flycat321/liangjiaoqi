# 量角器 Protractor — 设计师主导的全流程装饰管理系统

> 设计引领 · 精准施工 · 品质交付

量角器是一套面向家装客户的移动端 Web 应用，包含 **品牌展示**、**客户门户**、**管理后台** 三大模块，覆盖从品牌认知到项目交付的完整闭环。

## 线上地址

**正式域名：** https://guogaoliang.cn

| 页面 | 地址 |
|------|------|
| 品牌首页 | https://guogaoliang.cn |
| 服务流程 | https://guogaoliang.cn/services |
| 关于我们 | https://guogaoliang.cn/about |
| 预约咨询 | https://guogaoliang.cn/contact |
| 客户登录 | https://guogaoliang.cn/login |
| 管理后台 | https://guogaoliang.cn/admin |

> Vercel 备用地址：https://protractor-app-xi.vercel.app

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | Tailwind CSS 4 + Framer Motion |
| 数据库 | Supabase (PostgreSQL)，15 张表 |
| 认证 | Supabase Auth + 手机号登录 |
| 部署 | Vercel |
| 语言 | TypeScript 5 |

## 功能模块

### 品牌公开页（5 页）

- `/` — 首页，15 个品牌板块（痛点分析、定位、双引擎、工艺体系、供应链、服务时间线、定价、品质承诺等）
- `/services` — 11 阶段标准化服务流程 + 八大工艺体系 + 工艺卡示例 + 透明定价
- `/about` — 创始人介绍 + 四大优势 + 品质承诺
- `/contact` — 预约咨询表单（姓名/电话/房型/面积/留言）
- `/login` — 客户/管理员统一登录入口

### 客户门户（8 页，需登录）

- 项目仪表盘 — 查看所有项目进度
- 阶段时间线 — 11 阶段进度可视化
- 阶段检查项 — 逐项确认验收
- 材料清单 — 在线确认选材
- 报价单 — 查看并确认报价
- 合同签署 — Canvas 手写签名
- 施工照片墙 — 按阶段浏览现场照片
- 消息通知 + 个人中心

### 管理后台（10 页，需管理员登录）

- 概览面板 — 项目/客户/通知统计
- 项目管理 — 新建/编辑/阶段进度管控
- 客户管理 — 新建客户 + 生成登录账号
- 材料库 — 搜索 + 分类管理
- 合同模板 — 创建/编辑合同模板
- 消息推送 — 向客户发送通知

## 项目结构

```
protractor-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 品牌首页（15 板块）
│   │   ├── not-found.tsx         # 自定义 404
│   │   ├── (public)/             # 品牌页（about/services/contact）
│   │   ├── (auth)/               # 登录 / 邀请
│   │   ├── (portal)/             # 客户门户（需登录）
│   │   ├── (admin)/              # 管理后台（需管理员）
│   │   └── api/                  # API 路由（seed/migrate/auth）
│   ├── components/
│   │   ├── brand/                # 15 个品牌展示组件
│   │   ├── layout/               # Header / Footer / BottomNav
│   │   └── ui/                   # Button / Card / Badge / Skeleton / AnimateInView
│   └── lib/
│       ├── constants/            # 品牌数据 + 11 阶段定义
│       ├── supabase/             # Supabase 客户端（browser / server）
│       └── utils/                # cn / format / demo-auth
├── supabase/migrations/          # 数据库迁移 SQL
├── proxy.ts                      # Next.js 16 Proxy（Supabase session 刷新）
└── .env.local                    # 环境变量（不提交 Git）
```

## 本地开发

```bash
# 克隆仓库
git clone git@github.com:flycat321/liangjiaoqi.git
cd liangjiaoqi

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 填入 Supabase URL 和 Anon Key

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看效果。

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key |

## 数据库

共 15 张表：

`profiles` · `clients` · `invitations` · `projects` · `project_stages` · `stage_items` · `materials` · `project_materials` · `quotes` · `quote_items` · `contracts` · `signatures` · `photos` · `notifications` · `contact_inquiries`

迁移脚本位于 `supabase/migrations/001_initial_schema.sql`。

## 部署

```bash
# 构建
npm run build

# 部署到 Vercel
npx vercel --prod
```

## 设计特色

- **移动端优先** — 所有页面针对手机端优化，支持安全区域适配
- **品牌一致性** — 统一的暖色调设计系统（`#b8956a` 主色调 + 衬线/无衬线字体组合）
- **滚动动画** — Intersection Observer 驱动的进场动画，提升浏览体验
- **骨架屏加载** — 数据加载时显示骨架占位，避免白屏闪烁

## 许可证

私有项目，未经授权不得使用。

---

*量角器 Protractor Design & Build — 设计师画的每一根线，工地都能一毫米不差地落下去。*
