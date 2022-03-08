FROM node:lts-alpine
WORKDIR /app
EXPOSE 3000

COPY [".", "/app"]
RUN npm install --silent
RUN npm run build

CMD ["npm", "run", "start"]