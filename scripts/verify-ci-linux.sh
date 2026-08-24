#!/bin/sh

set -eu

script_directory=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repository_directory=$(dirname "$script_directory")

docker run --rm --init --ipc=host \
  --env CI=true \
  --volume "$repository_directory:/work" \
  --volume /work/node_modules \
  --workdir /work \
  mcr.microsoft.com/playwright:v1.62.1-noble \
  /bin/bash -lc 'corepack enable && corepack prepare pnpm@10.33.0 --activate && pnpm install --frozen-lockfile && pnpm verify:ci'
