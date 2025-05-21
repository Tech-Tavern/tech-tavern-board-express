FROM node:18-alpine
WORKDIR /app

# copy package files & install
COPY package.json package-lock.json ./
RUN npm install --production

# copy everything (including index.js at root)
COPY . .

EXPOSE 3009
# point at root index.js
CMD ["node", "index.js"]
