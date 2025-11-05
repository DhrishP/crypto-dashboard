# Git Hooks Setup

This project uses **Husky** and **lint-staged** for git hooks to ensure code quality before commits and pushes.

## Setup

After cloning the repository, run:

```bash
make install-hooks
# or
bun run prepare
```

This will install Husky and set up the git hooks.

## Pre-commit Hook

Before each commit, the pre-commit hook will:

- **Automatically format** staged files using Prettier
- **Run ESLint** with auto-fix on staged TypeScript/JavaScript files

This ensures all committed code follows the project's formatting and linting rules.

## Pre-push Hook

Before each push, the pre-push hook will:

1. **Check formatting** - Verify all files are properly formatted
2. **Run linting** - Check for any linting errors
3. **Build project** - Ensure the project builds successfully

If any of these checks fail, the push will be blocked. Fix the issues and try again.

## Manual Commands

You can also run these checks manually:

```bash
# Format all files
make format
# or
bun run format

# Check formatting without fixing
bun run format:check

# Lint code
make lint
# or
bun run lint

# Build project
make build
# or
bun run build

# Run all checks (format, lint, build)
make check-all
```

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass hooks (not recommended for production):

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip pre-push hook
git push --no-verify
```

**Warning**: Only bypass hooks if you understand the consequences and are fixing issues immediately after.
