# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
