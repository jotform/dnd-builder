#!/usr/bin/env sh
set -e
set -u

# get basedir
argv0=$(echo "$0" | sed -e 's,\\,/,g')
BASEDIR=$(dirname "$(readlink "$0" || echo "$argv0")")
case "$(uname -s)" in
  Darwin) BASEDIR="$( cd "$( dirname "$argv0" )" && pwd )";;
  Linux) BASEDIR=$(dirname "$(readlink -f "$0" || echo "$argv0")");;
esac

# install or update yarn/node packages under system folder
npm --prefix ${BASEDIR} install >/dev/null 2>&1

# export path
export PATH="${BASEDIR}/node_modules/.bin:${PATH}"

# execute yarn
if [ "${YARN_RC_DEBUG-false}" = "true" ]; then
  echo "USING NODE BINARY: $(which node) VERSION: $(node --version)"
  echo "USING YARN BINARY: $(which yarn) VERSION: $(yarn --version)"
fi
yarn "$@"
exit $?
