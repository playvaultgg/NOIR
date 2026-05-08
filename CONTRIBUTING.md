# Contributing to Maison NOIR

Thank you for your interest in contributing to Maison NOIR. This document provides guidelines to ensure a smooth collaboration process.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   npx prisma generate
   ```
5. **Make your changes** following the guidelines below
6. **Test** your changes locally
7. **Submit** a Pull Request

---

## Branch Naming Convention

| Prefix | Purpose | Example |
|:-------|:--------|:--------|
| `feature/` | New features | `feature/wishlist-export` |
| `fix/` | Bug fixes | `fix/checkout-500-error` |
| `security/` | Security patches | `security/csp-header-update` |
| `docs/` | Documentation only | `docs/api-endpoints` |
| `refactor/` | Code improvement (no behavior change) | `refactor/prisma-pooling` |

---

## Code Standards

### JavaScript / React
- Use **functional components** with hooks
- Use **`'use client'`** directive only when client-side APIs are needed
- Keep components focused — one responsibility per file
- Use the `src/lib/` directory for shared utilities
- Use the `src/containers/` directory for context providers

### CSS
- Use **Vanilla CSS** with CSS Variables (design tokens)
- Follow the luxury design system (`--noir-gold: #C6A972`, `--noir-black: #0A0A0A`)
- No Tailwind CSS unless explicitly discussed

### API Routes
- Wrap sensitive endpoints with `withApiSecurity()` from `src/lib/api-guard.js`
- Use the structured `logger` from `src/lib/logger.js` instead of `console.log`
- Validate all inputs with utilities from `src/lib/security.js`

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add wishlist export to PDF
fix: resolve checkout race condition on stale sessions
security: update CSP to block inline eval
docs: add API rate limiting documentation
refactor: extract payment logic into separate module
```

---

## Pull Request Process

1. Ensure your code **builds successfully** (`npm run build`)
2. Ensure **no security vulnerabilities** (`npm audit --audit-level=high`)
3. Update documentation if your change affects:
   - API endpoints → update `README.md`
   - Security controls → update `SECURITY.md`
   - Infrastructure → update `INFRASTRUCTURE.md`
4. Reference the issue number in your PR description
5. Request review from a maintainer

---

## Architecture Guidelines

Before adding new features, review the [STRUCTURE.md](STRUCTURE.md) to understand the 13-layer architecture. New code should fit within the existing layer boundaries:

| If you're adding... | It belongs in... |
|:-------------------|:----------------|
| A new page | `src/app/` |
| A new API endpoint | `src/app/api/` |
| A shared utility | `src/lib/` |
| A React context/provider | `src/containers/` or `src/providers/` |
| A reusable UI component | `src/components/` |
| Infrastructure config | Root directory (`Dockerfile`, `docker-compose.yml`, etc.) |
| CI/CD changes | `.github/workflows/` |

---

## Security Contributions

If your contribution involves security:

- **DO NOT** commit secrets, API keys, or credentials
- **DO** use environment variables for sensitive values
- **DO** sanitize all user inputs before database operations
- **DO** add rate limiting to new API endpoints
- See [`SECURITY.md`](SECURITY.md) for the full security policy

---

## Questions?

Open a [GitHub Issue](https://github.com/GodlLuffy/NOIR-1/issues) or reach out directly:
- **Email**: [Gundelwaranup119@gmail.com](mailto:Gundelwaranup119@gmail.com)

---

*Thank you for helping build Maison NOIR to the highest standard.*
