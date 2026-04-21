FROM debian:trixie-slim

WORKDIR /app

RUN apt update && apt install -y \
  golang-go \
  ca-certificates

COPY ./go.mod ./go.mod
COPY ./go.sum ./go.sum
RUN go mod download

COPY ./main.go ./main.go
COPY ./proxy/ ./proxy/
COPY ./utils/ ./utils/

RUN go build -o output ./

CMD [ "./output" ]