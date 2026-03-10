# EcoRoute Astana - Development Container
# Картамен жұмыс істеуге қажетті Linux пакеттерімен

FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

# Системні пакеттер (карталар + geo-деректер)
RUN apt-get update && apt-get install -y --no-install-recommends \
    # PostGIS / PostgreSQL client
    libpq-dev \
    postgresql-client \
    # GDAL & Geo libraries (интерактивті карталар үшін)
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    # Binutils (map data processing)
    binutils \
    libproj-dev \
    proj-bin \
    # Image processing (map tiles)
    libpng-dev \
    libjpeg-dev \
    # Additional utilities
    curl \
    git \
    jq \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Python орнату (geo-скрипттер үшін)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Global Node.js инструменттер
RUN npm install -g \
    typescript \
    ts-node \
    nodemon \
    concurrently

# Жұмыс директориясы 
WORKDIR /workspaces/ecoroute-astana

# Порттар
EXPOSE 3000 4000 5432 6379
