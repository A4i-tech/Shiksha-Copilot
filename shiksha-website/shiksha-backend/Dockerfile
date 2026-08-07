FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ARG SHIKSHA_COPILOT_BUILD
ENV SHIKSHA_COPILOT_BUILD=$SHIKSHA_COPILOT_BUILD

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 8080

CMD ["node", "app.js"]
