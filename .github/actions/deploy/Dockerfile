FROM alpine:3.14

ENV HUGO_VERSION 0.88.1

RUN apk add --no-cache \
    bash \
    curl \
    git \
    openssh-client \
  && curl -LSs -o /tmp/hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz \
  && tar xf /tmp/hugo.tar.gz -C /usr/local/bin \
  && apk del curl

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["bash", "/entrypoint.sh"]
