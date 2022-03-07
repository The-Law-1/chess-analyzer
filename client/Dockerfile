FROM node:lts-alpine
WORKDIR /app
EXPOSE 3000

COPY ["client", "/app"]
RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]