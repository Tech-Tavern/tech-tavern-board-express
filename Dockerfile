FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3009

# run migrations on every container start, then boot
CMD ["sh", "-c", "npm run migrate && node index.js"]
