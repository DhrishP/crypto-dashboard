.PHONY: install-hooks format lint build check-all precommit prepush

install-hooks:
	bunx husky install
	chmod +x .husky/pre-commit .husky/pre-push

format:
	bun run format

lint:
	bun run lint

build:
	bun run build

check-all:
	bun run format:check && bun run lint && bun run build

precommit:
	bun run lint-staged

prepush:
	bun run format:check && bun run lint && bun run build
