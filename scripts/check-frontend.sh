#!/bin/bash
# Frontend quality gate: install, lint, typecheck, build, unit tests, light/dark palette contrast.

CURRENT_DIR=$(pwd)

if [ ! -f "$CURRENT_DIR/package.json" ]; then
  cd "$CURRENT_DIR/frontend" || exit 1
fi

npm ci --no-update-notifier
if [ $? -ne 0 ]; then
  echo "Issues when installing dependencies. Please review.."
  exit 1
fi

echo "Running checks..."
echo "1/5 - Lint started..."
npm run lint
if [ $? -ne 0 ]; then
  echo "Issues when running lint. Please review.."
  exit 1
fi

echo "2/5 - Typecheck started..."
npm run typecheck
if [ $? -ne 0 ]; then
  echo "Issues when running typecheck. Please review.."
  exit 1
fi

echo "3/5 - Build started..."
npm run build
if [ $? -ne 0 ]; then
  echo "Issues when running build. Please review.."
  exit 1
fi

echo "4/5 - Tests started..."
npm run test
if [ $? -ne 0 ]; then
  echo "Issues when running test. Please review.."
  exit 1
fi

echo "5/5 - Contrast check started..."
npm run check:contrast
if [ $? -ne 0 ]; then
  echo "Issues when running contrast check. Please review.."
  exit 1
fi

echo "You're good to go! Good job!"
exit 0
