# K8s CI/CD Pipeline with GitOps

This repository contains a complete CI/CD pipeline setup for deploying microservices to Kubernetes using GitOps methodology. It features a modern TypeScript monorepo application with automated build, test, and GitOps-based deployment workflows.

## 🚀 Overview

This project implements a complete DevOps pipeline using:

- **Monorepo Architecture**: Turborepo-based monorepo with multiple packages and applications
- **CI/CD Pipeline**: GitHub Actions for automated Docker image building and pushing
- **Containerization**: Multi-stage Docker builds for optimized container images
- **GitOps Deployment**: ArgoCD for automated Kubernetes deployments
- **Modern Tech Stack**: TypeScript, Hono, tRPC, Prisma, and more

## 📁 Project Structure

```
k8s-cicd-pipline/
├── demo-api/              # Main application (Turborepo monorepo)
│   ├── apps/
│   │   └── server/        # Backend API server (Hono, tRPC)
│   ├── packages/
│   │   ├── api/           # Shared API layer & business logic
│   │   ├── auth/          # Authentication configuration & logic (Better-Auth)
│   │   ├── config/        # Shared configuration
│   │   └── db/            # Database schema & queries (Prisma)
│   ├── Dockerfile         # Multi-stage Dockerfile for optimized builds
│   ├── pnpm-workspace.yaml # Package workspace configuration
│   ├── turbo.json         # Turborepo configuration
│   └── package.json       # Root package configuration
└── github/
    └── pipline.yml        # GitHub Actions CI/CD workflow

Note: The GitOps repository is maintained separately and contains Kubernetes manifests
that reference the Docker images built in this repository.
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Hono (lightweight, performant server framework)
- **Type Safety**: TypeScript with end-to-end type safety via tRPC
- **Database**: Prisma ORM with SQLite/Turso
- **Authentication**: Better-Auth for secure authentication
- **Build System**: Turborepo for optimized monorepo builds

### DevOps
- **Package Manager**: pnpm
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions
- **Container Registry**: GitHub Container Registry (GHCR)
- **GitOps**: ArgoCD for declarative, automated deployments
- **Orchestration**: Kubernetes

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- pnpm (v10.11.1 or higher)
- Docker
- Kubernetes cluster (for deployment)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd k8s-cicd-pipline
   ```

2. **Navigate to the demo-api directory**:
   ```bash
   cd demo-api
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up the database**:
   ```bash
   cd apps/server
   pnpm run db:local  # Start local SQLite database
   ```

5. **Update environment variables** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

6. **Push the database schema**:
   ```bash
   pnpm run db:push
   ```

7. **Run the development server**:
   ```bash
   pnpm run dev
   ```

The API will be running at [http://localhost:3000](http://localhost:3000).

## 🔧 Available Scripts

### Root (demo-api/)
- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:studio`: Open database studio UI

### Server App (demo-api/apps/server/)
- `pnpm run dev`: Start server in watch mode
- `pnpm run build`: Compile the server
- `pnpm run start`: Start the compiled server
- `pnpm run check-types`: Type check the server code

## 🚀 CI/CD Pipeline with GitOps Integration

The project includes an automated CI/CD pipeline configured in `.github/pipline.yml` that works in conjunction with GitOps for seamless deployments:

### Pipeline Triggers:
- On pushes to the `main` branch
- On pull requests to the `main` branch
- Manual dispatch

### Pipeline Steps:
1. Checkout code
2. Setup Docker Buildx
3. Login to GitHub Container Registry
4. Extract metadata for Docker (tags & labels)
5. Build and push Docker image

### GitOps Integration:
After the Docker image is built and pushed, the CI/CD pipeline can be extended to update the GitOps repository with the new image tag. In a complete setup:
1. The pipeline would update the Kubernetes manifests in the GitOps repository with the new image tag
2. ArgoCD continuously monitors the GitOps repository and automatically applies the changes to the Kubernetes cluster
3. This creates a complete CI/CD pipeline from code commit to production deployment

### Extending the Pipeline for GitOps Updates

the GitOps workflow will use an extended GitHub Actions pipeline with additional steps 



### Docker Image Tags:
- Branch name (e.g., `main`)
- Pull request number (e.g., `pr-123`)
- Git commit SHA (e.g., `main-abc1234`)
- `latest`

## 🔄 GitOps Workflow

This project implements a complete GitOps workflow where the Git repository serves as the single source of truth for both application code and infrastructure configuration:

### Development Flow:
1. Developer commits code changes
2. CI pipeline builds and tests the application
3. Docker image is built and pushed to container registry
4. (Optional) GitOps repository is updated with new image tag
5. ArgoCD detects changes and synchronizes the Kubernetes cluster

### Benefits of GitOps:
- **Declarative Configuration**: Infrastructure state is defined in code
- **Version Control**: Complete history of all changes to the system
- **Automation**: Self-healing infrastructure that automatically reconciles drift
- **Audit Trail**: Every change is tracked in Git
- **Collaboration**: Standardized workflow for teams to manage infrastructure

## 🐳 Docker Containerization

The project uses a multi-stage Docker build process:

1. **Base Stage**: Installs dependencies and creates the base environment
2. **Builder Stage**: Builds the application using Turborepo
3. **Production Stage**: Creates a minimal production image with only necessary files

### Health Check
The container includes a health check that verifies the service is responding at `/` every 30 seconds.

## 📦 Project Architecture

The application follows a monorepo pattern with:

- **apps/server**: The main API server built with Hono and tRPC
- **packages/api**: Shared API layer and business logic
- **packages/auth**: Authentication configuration and logic
- **packages/db**: Database schema and queries using Prisma
- **packages/config**: Shared configuration files

This structure promotes code reusability and maintainability across multiple services.

## 🚢 GitOps Deployment with ArgoCD

The deployment process follows GitOps methodology using ArgoCD for automated, declarative deployments to Kubernetes:

1. Push changes to trigger the CI/CD pipeline
2. The Docker image will be published to GitHub Container Registry
3. ArgoCD continuously monitors the Git repository for changes
4. When new Docker images are published, ArgoCD updates the Kubernetes manifests in the GitOps repository
5. ArgoCD automatically synchronizes the Kubernetes cluster state with the desired state in Git

### GitOps Repository Structure

The GitOps repository contains Kubernetes manifests that reference the Docker images from GitHub Container Registry:

```
gitops-repo/
├── base/
│   └── kustomization.yaml
└── overlays/
    ├── development/
    │   ├── kustomization.yaml
    │   └── deployment.yaml
    ├── staging/
    │   ├── kustomization.yaml
    │   └── deployment.yaml
    └── production/
        ├── kustomization.yaml
        └── deployment.yaml
```

## 🔐 Environment Variables

The application requires the following environment variables:

- `DATABASE_URL`: Database connection string
- `AUTH_SECRET`: Authentication secret
- `NODE_ENV`: Environment mode (`development`, `production`, etc.)

See `.env.example` files in respective applications for detailed configuration.


