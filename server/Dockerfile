FROM node:lts-alpine
WORKDIR /EngineServer
EXPOSE 3001

# copy local files
COPY [".", "/EngineServer"]

ENV SOURCE_REPO https://github.com/official-stockfish/Stockfish
ENV VERSION master

# install server dependencies and run server
RUN npm install --silent

RUN rm -rf ./engine

RUN mkdir engine

ADD ${SOURCE_REPO}/archive/${VERSION}.tar.gz /EngineServer/engine

WORKDIR /EngineServer/engine

RUN apk update && apk add --no-cache make g++

RUN ls

# * if directory exists ?
RUN if [ ! -d Stockfish-${VERSION} ]; then tar xvzf *.tar.gz; fi \
  && cd Stockfish-${VERSION}/src \
  && make build ARCH=x86-64-modern \
  && make install \
  && cd ../.. && rm -rf Stockfish-${VERSION} *.tar.gz


CMD ["npm", "start"]