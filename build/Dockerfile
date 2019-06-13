FROM alpine:3.9

ENV HUGO_VERSION 0.55.6

RUN apk add --no-cache \
    bash \
    curl \
    git \
  && curl -LSs -o /tmp/hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz \
  && tar xf /tmp/hugo.tar.gz -C /usr/local/bin \
  && apk del curl
