# Imagen oficial de Node.js
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Puerto donde escucha Express
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]