# Deploy — Dolphin Edu frontend

Static export → **GitHub Pages** (`nchithanh/dolphinEduFE`). Custom domain qua **Cloudflare**.

## CI

Workflow: `.github/workflows/deploy-pages.yml`

- Trigger: push `main` hoặc `workflow_dispatch`
- Build: `GITHUB_PAGES=true npm run build` → artifact `out/`
- Deploy: GitHub Actions `deploy-pages`

## GitHub (1 lần)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Sau khi có domain: **Settings → Pages → Custom domain** → nhập FQDN (vd. `edu.example.com`)
3. Bật **Enforce HTTPS** khi certificate sẵn sàng

## Cloudflare DNS

Trỏ domain về GitHub Pages (chọn một):

| Mục tiêu | Ghi chú |
| --- | --- |
| **CNAME** `edu` → `nchithanh.github.io` | Subdomain (khuyên dùng) |
| **CNAME** `@` → `nchithanh.github.io` | Apex — cần CNAME flattening (Cloudflare hỗ trợ) |

- SSL/TLS: **Full** hoặc **Full (strict)** sau khi GitHub cấp cert cho custom domain
- Nếu cert pending: tạm **DNS only** (grey cloud) hoặc đợi GitHub verify domain

## URL

| Giai đoạn | URL |
| --- | --- |
| Project Pages (fallback) | https://nchithanh.github.io/dolphinEduFE/ — cần `GITHUB_PAGES_BASE_PATH=/dolphinEduFE` trong workflow nếu chưa có custom domain |
| Custom domain (Cloudflare) | `https://<your-domain>/` — `basePath` rỗng (mặc định CI hiện tại) |

## Local artifact (giống CI)

```bash
npm run build:pages
# static files in out/
```

## Push

```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes' git push origin main
```
