# ⚾ Max Liu's Personal Website

> 棒球少年 · 成长记录 | [**maxliu.cn**](https://maxliu.cn)

![License](https://img.shields.io/badge/license-MIT-blue)
![Astro](https://img.shields.io/badge/Astro-5.x-orange)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-black)

## 📖 项目简介

这是 Max（刘Max）的个人网站，用于展示他的 **棒球成长轨迹、比赛数据、文学创作和生活记录**。

### 核心目标

- 📊 **棒球数据展示**：比赛记录、打击三围（AVG/OBP/SLG）、训练日志、成长曲线图
- ✍️ **文学创作空间**：作文、诗歌、读后感等文字作品
- 📷 **生活记录**：旅行、爱好、日常点滴
- 📱 **小程序友好**：提供 JSON API 接口，方便微信小程序调用
- 🎯 **体育特长申请**：长期数据积累，为未来升学做准备

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| [Astro 5.x](https://astro.build) | 静态站点生成器 |
| CSS (Custom Properties) | 设计系统与响应式布局 |
| SVG | 数据可视化图表 |
| GitHub Actions | CI/CD 自动部署 |
| GitHub Pages | 静态托管 + 自定义域名 |

## 📁 项目结构

```
max-website/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro     # 全局布局（Header/Footer/Meta）
│   ├── pages/
│   │   ├── index.astro           # 首页
│   │   ├── baseball/index.astro  # 棒球专区（比赛+统计+训练+图表）
│   │   ├── writing/index.astro   # 文学创作
│   │   ├── life/index.astro      # 生活记录
│   │   ├── about/index.astro     # 关于Max（时间线+荣誉+能力雷达）
│   │   └── api/                  # 微信小程序 API 端点
│   │       ├── index.ts          # 综合数据接口
│   │       ├── games.ts          # 比赛记录接口
│   │       └── stats.ts          # 统计数据接口
│   └── styles/
│       └── global.css            # 设计系统（CSS变量/组件样式）
├── data/                          # JSON 数据文件（小程序API数据源）
│   ├── profile.json              # 个人资料
│   ├── games.json                # 比赛记录
│   └── stats.json                # 统计数据（含月度趋势）
├── public/
│   ├── CNAME                     # 自定义域名配置
│   └── images/                   # 图片资源目录
├── .github/workflows/
│   └── deploy.yml                # GitHub Actions 部署流程
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:4321)
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署到 GitHub Pages

1. Fork 或 Clone 此仓库
2. 在仓库设置中启用 GitHub Pages：
   - Settings → Pages → Source → 选择 `GitHub Actions`
3. 将代码推送到 `main` 分支，自动触发构建和部署
4. （可选）在 Settings → Pages → Custom domain 中设置 `maxliu.cn`
5. 在域名 DNS 管理处添加 CNAME 记录指向 `<username>.github.io`

## 📱 微信小程序对接

网站提供了 RESTful JSON API，供微信小程序调用：

| 接口 | 说明 |
|------|------|
| `/api/overview` | 综合数据（个人信息 + 赛事摘要 + 最近赛事 + 核心统计） |
| `/api/tournaments` | 完整赛事记录 + 派生汇总统计（按年/队/级别/地点） |
| `/api/games` | 单场比赛记录（完整列表，分页由小程序端处理） |
| `/api/stats` | 单场打击统计数据 |

> 说明：本站部署在 GitHub Pages（纯静态托管），服务端无法解析 URL query 分页参数。
> 因此 `/api/games` 返回完整列表，分页由小程序端自行处理（如 `games.slice(offset, offset + limit)`）。

### 调用示例

```javascript
// 获取赛事记录（含汇总统计）
const res = await wx.request({
  url: 'https://maxliu.cn/api/tournaments',
  method: 'GET'
});
// res.data = { code: 0, data: { summary: {...}, tournaments: [...] } }

// 获取单场比赛记录，并在小程序端分页
const gamesRes = await wx.request({
  url: 'https://maxliu.cn/api/games',
  method: 'GET'
});
const { total, games } = gamesRes.data.data;
const page = games.slice(0, 10); // 第 1 页 10 条
```

## 📝 内容更新指南

### 更新比赛记录

编辑 `data/games.json`，添加新的比赛对象：

```json
{
  "id": "game-YYYY-MM-DD-event",
  "date": "2026-09-01",
  "league": "联赛名称",
  "round": "轮次",
  "opponent": "对手",
  "result": "win/loss",
  "score": "胜分:负分",
  "position": "SS/2B/3B等",
  "stats": {
    "ab": 4, "h": 2, "rbi": 1, "bb": 0, "so": 1
  },
  "highlight": "关键表现描述",
  "tags": ["标签"]
}
```

### 更新统计数据

编辑 `data/stats.json`，更新对应赛季的数据。月度趋势会自动反映在成长曲线图中。

### 更新文学创作

编辑 `src/pages/writing/index.astro` 中的 `articles` 数组，或后续迁移为 Markdown 文件管理。

## 🎨 设计特点

- **运动活力风格**：深色背景 + 活力橙主色调 + 薄荷绿强调色
- **移动端优先**：全面适配手机屏幕（375px ~ 1440px）
- **微信小程序友好**：
  - 响应式设计确保手机端体验
  - JSON API 提供结构化数据
  - 语义化 HTML 方便内容解析
- **性能优化**：零默认 JavaScript、CSS 自定义属性系统、SVG 图表
- **SEO 就绪**：完整的 Meta 标签、Open Graph、Sitemap

## 🔧 配置说明

### 环境变量

当前版本无需环境变量。如需扩展：

- `PUBLIC_SITE_URL`：站点 URL（默认 `https://maxliu.cn`）

### Astro 配置

`astro.config.mjs` 中的关键配置：

- `site`: 站点根 URL，影响 sitemap 和 canonical URL
- `trailingSlash`: URL 格式（当前为无尾部斜杠）

## 📋 待办 / 未来规划

- [ ] Markdown 内容管理（将文章迁移为 `.md` 文件）
- [ ] 图片上传与管理功能
- [ ] 更多数据可视化（热力图、对比分析）
- [ ] 多语言支持（中英文切换）
- [ ] 评论/互动功能
- [ ] 微信小程序端开发

## 📄 License

MIT License © 2026 Max Liu

---

<p align="center">
  <strong>⚾ 记录成长，追逐梦想</strong><br>
  <sub>Built with ❤️ using Astro & GitHub Pages</sub>
</p>
