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
  runTestsCmd = 'docker-compose run -T test-runner npm run wait-then-test'
  searchForFailedTestsCmd = '| grep "Test failed"'
  cmd = "$runTestsCmd $searchForFailedTestsCmd"
  echo "$cmd"
  if eval "$cmd"; then
  then
    return 1
  else
    return 0
  fi
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



function cleanupAtEnd()
{
  # Clean up
  docker-compose down --remove-orphans --volumes
  echo "$1"
  if [ $1 -gt 0 ]
  then
    exit 1
  else
    exit 0
  fi
}

cleanupBeforeStart
docker-compose up -d
runTests
error=$?
echo "dylan $error"
processTestOutput
cleanupAtEnd $error
