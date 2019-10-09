#!/bin/bash

set -eu


mkdir -p /root/.ssh
chmod 700 /root/.ssh
ssh-keyscan -t rsa github.com > /root/.ssh/known_hosts
echo "${INPUT_DEPLOY_KEY}" > /root/.ssh/id_rsa
chmod 400 /root/.ssh/id_rsa


git_name=$(git log -1 --pretty=format:"%cn")
git_email=$(git log -1 --pretty=format:"%ce")

git clone \
  --depth 1 \
  --branch ${INPUT_BRANCH} \
  ssh://git@github.com/${GITHUB_REPOSITORY}.git \
  public


hugo -t ${INPUT_TEMPLATE}

cd public

git config user.name ${git_name}
git config user.email ${git_email}

git add .
git commit --allow-empty -m "Automated build at `date -Iseconds`"

git push
