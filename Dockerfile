FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3009

# Wait until MySQL is ready, then run migrations and start the API
CMD sh -c 'until mysqladmin ping -h "$DB_DOCKER_HOST" -P "$DB_DOCKER_PORT" -u"$DB_USER" -p"$DB_PASS" --silent; do \
             echo "waiting for db…" && sleep 2; \
           done && \
           echo "db is up" && \
           npm run migrate && \
           node index.js'
