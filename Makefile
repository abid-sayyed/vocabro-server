#Backend
BACKEND_DOCKERFILE_PATH=./vocabro-server/compose.yaml
BACKEND_ENV_FILE=./vocabro-server/.env.production

#Frontend
FRONTEND_DOCKERFILE_PATH=./vocabro_frontend/compose.yaml
FRONTEND_ENV_FILE=./vocabro_frontend/.env.production

# Default target
.DEFAULT_GOAL := help


# Build all services (frontend and backend) using docker-compose
build-production:
	docker compose -f $(BACKEND_DOCKERFILE_PATH) build && \
	docker compose -f $(FRONTEND_DOCKERFILE_PATH) build

run-production:
	docker compose -f $(BACKEND_DOCKERFILE_PATH) --env-file $(BACKEND_ENV_FILE) up -d && \
	docker compose -f $(FRONTEND_DOCKERFILE_PATH) --env-file $(FRONTEND_ENV_FILE) up -d

all: build-production run-production

stop-production:
	docker compose -f $(BACKEND_DOCKERFILE_PATH) down && \
	docker compose -f $(FRONTEND_DOCKERFILE_PATH) down

logs-backend:
	docker compose -f $(BACKEND_DOCKERFILE_PATH) logs -f

logs-frontend:
	docker compose -f $(FRONTEND_DOCKERFILE_PATH) logs -f

build-backend:
	docker compose -f $(BACKEND_DOCKERFILE_PATH) up --build -d

build-frontend:
	docker compose -f $(FRONTEND_DOCKERFILE_PATH) up --build -d




# Help message
help:
	@echo "Usage:"
	@echo "  make build-production            Build production images for both frontend and backend"
	@echo "  make run-production              Run production services for both frontend and backend"
	@echo "  make all                         Build and run all production services"
	@echo "  make stop-production             Stop and remove all production services"
	@echo "  make logs-backend                View logs for the backend service"
	@echo "  make logs-frontend               View logs for the frontend service"
	@echo "  make build-backend               Build the backend service image and run"
	@echo "  make build-frontend              Build the frontend service image and run"
	

