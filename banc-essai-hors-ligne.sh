#!/bin/bash
# Banc d'essai hors-ligne : copie du projet + liens vers les modules globaux (mêmes versions que package.json). N'EST PAS un vrai "pnpm install".
set -e
G=/home/claude/.npm-global/lib/node_modules
rm -rf /home/claude/t && mkdir /home/claude/t && cd /home/claude/w && tar cf - --exclude=node_modules --exclude=source/dist . | (cd /home/claude/t && tar xf -)
cd /home/claude/t/source && mkdir -p node_modules/.bin
ln -s $G/react node_modules/react; ln -s $G/react-dom node_modules/react-dom; ln -s $G/tsx/node_modules/esbuild node_modules/esbuild; ln -s $G/tsx node_modules/tsx
for p in react react-dom esbuild tsx; do echo "  $p $(node -p "require('./node_modules/$p/package.json').version")"; done
echo "== build"; node tools/build-standalone.mjs 2>&1 | tail -3
echo "== copie racine (comme le workflow)"; (cd /home/claude/t && cp -r source/public/. . && cp source/dist/index.html source/dist/app.js source/dist/app.css source/dist/sw.js .)
echo "== tests"; /home/claude/.npm-global/bin/tsx --test "tests/*.test.ts" 2>&1 | grep -E "^# (tests|pass|fail)" || true
echo "== verify"; node tools/verify-sync.mjs "$@" || true
echo "== verify --rebuild"; node tools/verify-sync.mjs /home/claude/t --rebuild "$@" || true
echo "== verify strict (ci)"; node tools/verify-sync.mjs /home/claude/t --rebuild --require-lock 2>&1 | tail -4 || true
