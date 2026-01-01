FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ARG ALLOW_ORIGIN
RUN if [ -n "$ALLOW_ORIGIN" ]; then sed -i "s|allow_your_website_here|$ALLOW_ORIGIN|g" app.js; fi

EXPOSE 8080

CMD ["node", "app.js"]
