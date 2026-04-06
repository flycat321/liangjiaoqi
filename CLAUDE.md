@AGENTS.md

# 量角器 Protractor — 项目配置

## 基本信息

- **项目名称：** 量角器（Protractor Design & Build）
- **定位：** 设计师主导的全流程家装管理系统（移动端 Web）
- **正式域名：** https://guogaoliang.cn
- **Vercel 备用：** https://protractor-app-xi.vercel.app
- **GitHub 仓库：** https://github.com/flycat321/liangjiaoqi
- **创建时间：** 2026-04-05

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.2.2 |
| UI | Tailwind CSS | 4 |
| 动画 | Framer Motion + Intersection Observer | — |
| 数据库 | Supabase (PostgreSQL) | — |
| 文件存储 | Supabase Storage（bucket: `photos`） | — |
| 部署 | Vercel（手动 `npx vercel --prod`） | — |
| 语言 | TypeScript | 5 |

## 部署方式

- **非自动部署** — Vercel 未关联 GitHub（两个 GitHub 账号不一致）
- 每次更新需手动：`git push && npx vercel --prod --yes`
- 或使用一键脚本：`./deploy.sh`
- **未来迁移计划：** 客户量增加后迁移到阿里云服务器（`123.57.106.145`，2C2G，Docker 已装）

## 域名与部署

- **域名注册商：** 阿里云
- **域名：** guogaoliang.cn
- **DNS 指向：** Vercel（通过阿里云域名解析配置 CNAME）
- **SSL：** Vercel 自动签发

## 架构要点（国内访问优化）

由于 Supabase 服务器在海外，国内手机浏览器无法直连。所有数据操作均通过**服务端 API 路由**中转：

```
手机浏览器 → Vercel API 路由（服务端）→ Supabase（数据库/存储）
```

**绝对不要在客户端页面直接使用 `createClient()` 查询 Supabase**，必须通过 `/api/` 路由。

已有的 API 路由：
- `/api/auth/login` — 登录认证（服务端验证密码）
- `/api/auth/register` — 注册新用户
- `/api/projects` — 客户项目列表
- `/api/projects/[id]` — 项目详情+阶段
- `/api/projects/[id]/materials` — 材料清单（GET+PATCH确认）
- `/api/projects/[id]/photos` — 施工照片
- `/api/projects/[id]/quote` — 合同费用确认（PATCH）
- `/api/notifications` — 客户通知（GET+POST）
- `/api/notifications/read` — 标记已读
- `/api/admin/projects/[id]` — 管理端项目详情
- `/api/admin/projects/[id]/materials` — 管理端材料CRUD
- `/api/admin/projects/[id]/contract-fee` — 合同费用编辑（GET+POST）
- `/api/admin/projects/[id]/photos` — 照片上传（POST base64）+删除
- `/api/admin/projects/[id]/contracts` — 合同列表
- `/api/admin/clients` — 客户列表
- `/api/admin/notifications` — 发送记录
- `/api/admin/contracts` — 全部项目费用总览
- `/api/seed` — 初始化种子数据
- `/api/migrate` — 数据库迁移
- `/api/reset` — 重置

## 页面清单

### 公开品牌页（5 页）
| 路由 | 说明 |
|------|------|
| `/` | 品牌首页（14 个板块，FounderProfile 暂未启用） |
| `/services` | 11 阶段服务流程 + 八大工艺体系 + 工艺卡 + 定价 |
| `/about` | 创始人 + 四大优势 + 品质承诺 |
| `/contact` | 预约咨询表单 |
| `/login` | 客户/管理员统一登录 |

### 客户门户（需登录）
| 路由 | 说明 |
|------|------|
| `/dashboard` | 项目仪表盘 |
| `/project/[id]` | 项目阶段时间线 |
| `/project/[id]/stage/[stageId]` | 阶段检查项 + 确认 |
| `/project/[id]/materials` | 材料清单确认（管理员添加后显示） |
| `/project/[id]/contract` | 合同费用明细（管理员编辑后显示，可确认） |
| `/project/[id]/photos` | 施工照片墙（点击放大，左右切换） |
| `/notifications` | 消息通知（点击/全部已读，红点提醒） |
| `/profile` | 个人中心 + 退出登录 |

### 管理后台（需管理员登录）
| 路由 | 说明 |
|------|------|
| `/admin` | 概览面板 |
| `/admin/projects` | 项目列表 |
| `/admin/projects/new` | 新建项目 |
| `/admin/projects/[id]` | 项目管理详情（动态加载） |
| `/admin/projects/[id]/stages` | 阶段进度管理 |
| `/admin/projects/[id]/materials` | 材料管理（添加/删除） |
| `/admin/projects/[id]/contract` | 合同费用编辑（设计费+施工费+专项+管理费） |
| `/admin/projects/[id]/photos` | 照片上传/管理（Supabase Storage） |
| `/admin/clients` | 客户列表 |
| `/admin/clients/new` | 新建客户 + 生成账号 |
| `/admin/materials` | 材料库管理 |
| `/admin/contracts` | 合同费用总览（链接到各项目合同编辑） |
| `/admin/notifications` | 消息推送（写入数据库，客户实时收到） |

## 合同费用结构

| 费用项 | 计算方式 |
|--------|---------|
| 设计费 | 房屋面积（自动读取）× 单价（管理员填写） |
| 施工费 | 水电/防水/瓦工/木工/油漆，逐项填写金额 |
| 专项费用 | 全屋智能/全屋定制/家具/电器/软装，逐项填写 |
| 施工管理费 | 施工费 × 15% |
| 专项管理费 | 专项费用 × 10% |

数据存储在 `quotes` + `quote_items` 表，"合同"选项卡和项目内"合同与费用"共用同一套数据。

## 登录账号

| 角色 | 手机号 | 密码 | 跳转 |
|------|--------|------|------|
| 管理员（郭高亮） | `18629148762` | `admin123` | `/admin` |
| 客户（张伟） | `13800001111` | `123456` | `/dashboard` |
| 客户（李婷） | `13800002222` | `123456` | `/dashboard` |

管理员通过后台新建的客户也可登录（Supabase Auth，服务端认证）。

## Supabase 配置

| 项目 | 值 |
|------|---|
| Project URL | https://yinizhlydudvbuhpevzp.supabase.co |
| 数据库表 | 15 张 |
| Storage Bucket | `photos`（public） |

环境变量存放于 `.env.local`（不提交 Git）。

## 数据库表

`profiles` · `clients` · `invitations` · `projects` · `project_stages` · `stage_items` · `materials` · `project_materials` · `quotes` · `quote_items` · `contracts` · `signatures` · `photos` · `notifications` · `contact_inquiries`

## 品牌设计系统

| 变量 | 色值 | 用途 |
|------|------|------|
| `--brand-bg` | `#f8f5f1` | 背景色 |
| `--brand-text` | `#1a1a1a` | 正文色 |
| `--brand-accent` | `#b8956a` | 主色调（暖金） |
| `--brand-border` | `#e8e2da` | 边框色 |

字体：Noto Sans SC（无衬线）+ Noto Serif SC（衬线）

## 开发注意事项

1. **proxy.ts 而非 middleware.ts** — Next.js 16 已将 middleware 重命名为 proxy，导出函数名为 `proxy`
2. **FounderProfile 组件已创建但首页未启用** — `src/app/page.tsx` 中被注释掉，`/about` 页面正常使用
3. **SSH 推送需 443 端口** — 本地代理拦截 22 端口，已配置 `~/.ssh/config` 走 `ssh.github.com:443`
4. **AnimateInView** — 自定义滚动进场动画组件，基于 Intersection Observer，已应用到所有品牌组件
5. **骨架屏** — `(portal)/loading.tsx` 和 `(admin)/loading.tsx` 提供加载态
6. **所有数据查询必须走服务端 API** — 不要在客户端组件中直接 import `createClient` 查 Supabase
7. **登录认证走服务端** — `/api/auth/login` 在 Vercel 服务器上验证密码，避免浏览器直连 Supabase
8. **通知系统** — notifications 表用 `recipient_id` 关联 `profiles.id`，不是 `client_id`
9. **照片上传** — base64 编码发送到 `/api/admin/projects/[id]/photos`，存入 Supabase Storage `photos` bucket

## 已知限制与后续计划

- **Vercel 未自动部署** — GitHub 账号不一致（Vercel 绑定 `bingdaomogu-droid`，仓库在 `flycat321`），需手动 `./deploy.sh`
- **阿里云迁移** — 客户量增加后迁移到阿里云（`123.57.106.145`，Docker 已装），一台服务器跑网站+数据库+照片存储
- **管理后台浏览器直连 Supabase** — 部分管理页面（客户列表、材料库等）仍直接用浏览器 Supabase 客户端，管理员在桌面端使用暂无问题，后续统一改为 API

## 常用命令

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 一键推送+部署
./deploy.sh

# 或分步
git push origin main
npx vercel --prod --yes
```

---

*最后更新：2026-04-06*
