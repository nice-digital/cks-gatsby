#!/bin/bash

# Runs functional tests via Docker

# Clean up before we start
rm -rf docker-output && rm -rf allure-results && rm -rf allure-report

# Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
# See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Clean up before starting containers
docker-compose down --remove-orphans --volumes && docker-compose rm -vf
docker-compose up -d

# Wait for the web app to be up before running the tests
docker-compose run -T test-runner npm run wait-then-test

# Generate an Allure test report
docker-compose run -T test-runner allure generate --clean

# Copy error shots and logs to use as a TeamCity artifact for debugging purposes
mkdir -p docker-output
docker cp test-runner:/tests/screenshots ./docker-output
docker cp test-runner:/tests/allure-report ./docker-output
#docker cp cks-web-app:/app/logs ./docker-output/cks-web-app
docker-compose logs --no-color > ./docker-output/logs.txt

# Clean up
docker-compose down --remove-orphans --volumes
