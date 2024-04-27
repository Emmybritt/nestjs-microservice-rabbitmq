FROM node:18-slim  as production
USER node
WORKDIR /usr/app
ENV NODE_ENV production
ENV PORT 3000
EXPOSE $PORT
ARG APP_DIR


COPY ["dist/$APP_DIR/package.json", "package-lock.json", "./"]
RUN npm ci
COPY ./dist/$APP_DIR .
CMD node main.js
