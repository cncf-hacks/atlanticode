FROM golang:alpine AS build-env
ENV GOPATH /go
WORKDIR /go/src
COPY ./go.* ./
WORKDIR /go/src/atlantisBackend
RUN go mod download
COPY . /go/src/atlantisBackend
RUN  go build -o atlantisBackend ./main.go

FROM alpine
WORKDIR /
COPY .env /
COPY --from=build-env /go/src/atlantisBackend/atlantisBackend /

EXPOSE 8080 

# Mutually exclusive with the above line
ENTRYPOINT [ "./atlantisBackend" ]