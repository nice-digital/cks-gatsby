#!/bin/bash

# Runs functional tests via Docker

function cleanupBeforeStart()
{
  # Clean up before we start
  rm -rf docker-output && rm -rf allure-results && rm -rf allure-report

  # Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
  # See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
  export COMPOSE_CONVERT_WINDOWS_PATHS=1

  # Clean up before starting containers
  docker-compose down --remove-orphans --volumes && docker-compose rm -vf
}



function runTests()
{
  # Wait for the web app to be up before running the tests
  docker-compose run -T test-runner npm run wait-then-test
}

function processTestOutput()
{
  # Generate an Allure test report
  docker-compose run -T test-runner allure generate --clean

  # Copy error shots and logs to use as a TeamCity artifact for debugging purposes
  mkdir -p docker-output
  docker cp test-runner:/tests/screenshots ./docker-output
  docker cp test-runner:/tests/allure-report ./docker-output

  #docker cp cks-web-app:/app/logs ./docker-output/cks-web-app
  docker-compose logs --no-color > ./docker-output/logs.txt
}



function cleanup()
{
  docker-compose down --remove-orphans --volumes
}

function exitWithCode()
{
  echo "exit code is: $1"
  if [ "$1" -gt 0 ]
  then
    exit 1
  else
    exit 0
  fi
}

error=0
trap 'catch' ERR
catch() {
  error=1
}

cleanupBeforeStart
docker-compose up --abort-on-container-exit --scale selenium-chrome=5
runTests
processTestOutput
cleanup
exitWithCode $error
