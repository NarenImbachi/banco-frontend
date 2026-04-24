# Etapa de build
FROM node:24-alpine3.21 AS build

WORKDIR /app

# 1. Copiar solo archivos de dependencias
COPY package*.json ./

# 2. Instalar dependencias reproducibles y cacheables
RUN npm ci

# 3. Copiar el resto del código (esto invalida el cache solo si cambia el código fuente)
COPY . .



# 5. Build con configuración
RUN npm run build

# Etapa final
FROM httpd:alpine3.18


# 6. Establecer carpeta de destino
WORKDIR /usr/local/apache2/htdocs/

# 7. Crear subdirectorio para la build específica
RUN mkdir -p /usr/local/apache2/htdocs

# 8. Copiar archivos compilados
COPY --from=build /app/dist/*/browser/ /usr/local/apache2/htdocs/

EXPOSE 80