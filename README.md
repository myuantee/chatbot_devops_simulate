# Chatbot DevOps Example

This project demonstrates DevOps practices for a chatbot web application using Docker, Docker Compose, and GitHub Actions.

## Features

- Voice-enabled chatbot interface
- MySQL database for chat history
- Docker containerization with multi-stage builds
- Docker Compose for local development
- GitHub Actions CI/CD pipeline
- Security scanning with Trivy
- Health checks and monitoring

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Start

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd chatbot-devops
   ```
2. Start the application
   ```bash 
   docker-compose up -d
   ```
3. Access the chatbot at http://localhost:3000