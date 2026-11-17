ARG PLAYWRIGHT_IMAGE_VERSION

FROM mcr.microsoft.com/playwright:$PLAYWRIGHT_IMAGE_VERSION

ARG UBUNTU_MIRROR

RUN set -ex; sed -i "s|http://archive.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list && \
  sed -i "s|http://security.ubuntu.com/ubuntu/|${UBUNTU_MIRROR}|g" /etc/apt/sources.list && \
  apt update && \
  apt upgrade -y && \
  apt install default-jre locales locales-all jq -y && \
  export LANGUAGE=en_US.UTF-8 && \
  export LANG=en_US.UTF-8 && \
  export LC_ALL=en_US.UTF-8 && \
  dpkg-reconfigure locales && \
  apt autoremove -y && \
  apt clean all
