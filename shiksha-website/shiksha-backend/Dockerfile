FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ARG ALLOW_ORIGIN
RUN if [ -n "$ALLOW_ORIGIN" ]; then sed -i "s|allow_your_website_here|$ALLOW_ORIGIN|g" app.js; fi

ENV NODE_ENV=production \
    PORT=8080 \
    MONGO_URL="mongodb://127.0.0.1:27017/shikshana?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8" \
    JWT_SECRET=your_crypto_secret \
    PIN_SECRET_KEY=secret-key

EXPOSE 8080

CMD ["node", "app.js"]
