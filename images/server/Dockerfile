FROM debian:trixie-slim

ARG SERVER_LINK

WORKDIR /app

RUN apt update && apt install -y \
  unzip \
  wget \
  libcurl4

RUN wget -O server.zip $SERVER_LINK && unzip server.zip && \
  rm server.zip

CMD [ "./bedrock_server" ]