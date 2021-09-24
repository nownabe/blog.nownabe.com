FROM debian:buster-slim

ENV HUGO_VERSION 0.88.1

RUN apt-get -qq update \
  && apt-get -yqq install --no-install-recommends \
    ca-certificates \
    curl \
    git \
    openssh-client \
  && curl -LSs -o /tmp/hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz \
  && tar xf /tmp/hugo.tar.gz -C /usr/local/bin \
  && apt-get clean \
  && rm -rf /var/lib/apt-lists/*

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["bash", "/entrypoint.sh"]
