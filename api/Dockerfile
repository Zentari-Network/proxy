FROM oven/bun:debian

EXPOSE 3000/tcp

WORKDIR /app

RUN apt update && apt install -y \
  curl

COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./src/ ./src/

RUN bun install -p

CMD [ "bun", "src/main" ]