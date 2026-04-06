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
| 部署 | Vercel | — |
| 语言 | TypeScript | 5 |

## 域名与部署

- **域名注册商：** 阿里云
- **域名：** guogaoliang.cn
- **DNS 指向：** Vercel（通过阿里云域名解析配置 CNAME）
- **SSL：** Vercel 自动签发

## 页面清单（26 页）

### 公开品牌页（5 页）
| 路由 | 说明 |
|------|------|
| `/` | 品牌首页（14 个板块，FounderProfile 暂未启用） |
| `/services` | 11 阶段服务流程 + 八大工艺体系 + 工艺卡 + 定价 |
| `/about` | 创始人 + 四大优势 + 品质承诺 |
| `/contact` | 预约咨询表单 |
| `/login` | 客户/管理员统一登录 |

### 客户门户（8 页，需登录）
| 路由 | 说明 |
|------|------|
| `/dashboard` | 项目仪表盘 |
| `/project/[id]` | 项目阶段时间线 |
| `/project/[id]/stage/[stageId]` | 阶段检查项 + 确认 |
| `/project/[id]/materials` | 材料清单确认 |
| `/project/[id]/quote` | 报价单确认 |
| `/project/[id]/contract` | 合同 + Canvas 手写签名 |
| `/project/[id]/photos` | 施工照片墙 |
| `/notifications` | 消息通知 |
| `/profile` | 个人中心 |

### 管理后台（10 页，需管理员登录）
| 路由 | 说明 |
|------|------|
| `/admin` | 概览面板 |
| `/admin/projects` | 项目列表 |
| `/admin/projects/new` | 新建项目 |
| `/admin/projects/[id]` | 项目管理详情 |
| `/admin/projects/[id]/stages` | 阶段进度管理 |
| `/admin/clients` | 客户列表 |
| `/admin/clients/new` | 新建客户 + 生成账号 |
| `/admin/materials` | 材料库管理 |
| `/admin/contracts` | 合同模板管理 |
| `/admin/notifications` | 消息推送 |

### 其他
| 路由 | 说明 |
|------|------|
| `/invite/[token]` | 邀请链接落地页 |
| `/not-found` | 自定义 404 页面 |

## 登录账号

| 角色 | 手机号 | 密码 | 跳转 |
|------|--------|------|------|
| 管理员（郭高亮） | `18629148762` | `admin123` | `/admin` |
| 客户（张伟） | `13800001111` | `123456` | `/dashboard` |
| 客户（李婷） | `13800002222` | `123456` | `/dashboard` |

## Supabase 配置

| 项目 | 值 |
|------|---|
| Project URL | https://yinizhlydudvbuhpevzp.supabase.co |
| 数据库表 | 15 张 |

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

## 常用命令

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 部署到 Vercel
npx vercel --prod

# Git 推送
git push origin main
```

---

*最后更新：2026-04-06*
