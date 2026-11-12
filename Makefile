ENV_FILE := var/.env
COMPOSE  := docker compose --env-file $(ENV_FILE)
DOCKERFILE := build/app/Dockerfile

.PHONY: help build test verify up down lint format shell logs migrate seed security

help: ## Show the available targets
	@echo "build    - build the runtime image (the runtime stage)"
	@echo "test     - run the formatting check and the unit tests (the test stage; the build fails if they fail)"
	@echo "verify   - the whole gate: compose config, the tests, then the runtime image"
	@echo "up       - build, test, and start the stack (depends on verify)"
	@echo "down     - stop and remove the stack"
	@echo "lint     - check formatting (Prettier) and types (tsc) inside the test-stage image"
	@echo "format   - format the source with Prettier (writes back into the working tree)"
	@echo "shell    - open a shell in the test container"
	@echo "logs     - follow the application container's logs"
	@echo "migrate  - no database in this frontend stack; nothing to migrate"
	@echo "seed     - no database in this frontend stack; nothing to seed"
	@echo "security - audit the dependencies (npm audit) inside the test-stage image"

# --- Images ---

build: ## Build the runtime image (the `runtime` stage of the Dockerfile)
	$(COMPOSE) build app

test: ## Run the formatting check and the unit tests (the `test` stage; the build fails if they fail)
	docker build -f $(DOCKERFILE) --target test .

verify: ## The whole gate: validate compose, run the tests, then build the runtime image
	$(COMPOSE) config --quiet
	docker build -f $(DOCKERFILE) --target test .
	docker build -f $(DOCKERFILE) --target runtime .

up: verify ## Build, test, and start the stack (depends on `verify`)
	$(COMPOSE) up -d

down: ## Stop and remove the stack
	$(COMPOSE) down

logs: ## Follow the application container's logs
	$(COMPOSE) logs -f app

# --- Quality ---

lint: ## Check formatting (Prettier) and types (TypeScript) inside the test-stage image
	$(COMPOSE) --profile test run --rm test sh -c "npx prettier --check . && npx tsc --noEmit -p tsconfig.app.json"

format: ## Format the source with Prettier inside the test-stage image, writing back to the working tree
	docker compose --profile test build test
	docker run --rm -v "$(CURDIR):/tmp/src:z" -w /tmp/src angular-plussaz-test:latest /app/node_modules/.bin/prettier --write /tmp/src

# --- Lifecycle (no database in this frontend stack) ---

migrate: ## No database in this frontend stack; nothing to migrate
	@echo "migrate: this stack has no database; nothing to migrate"

seed: ## No database in this frontend stack; nothing to seed
	@echo "seed: this stack has no database; nothing to seed"

# --- Security ---

security: ## Audit the dependencies (npm audit) inside the test-stage image
	$(COMPOSE) --profile test run --rm --entrypoint npm test audit --audit-level=high
	@echo "security: for the image scan run docker scout cves on the built runtime image (or trivy); see docs/security.md"
