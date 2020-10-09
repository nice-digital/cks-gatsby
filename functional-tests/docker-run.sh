#!/bin/bash

# Runs functional tests via Docker

function prepairForLocalTestRun()
{
	echo "Preparing to run the tests locally"
	buildGatsbySite
	buildWebApp
	publishWebApp
	copyGatsbyStaticPagesToWebApp
}

function buildWebApp()
{
	dotnet restore ../web-app
	dotnet build ../web-app
}

function buildGatsbySite()
{
	cd ../gatsby && npm run build
}

function publishWebApp()
{
	cd ../web-app && dotnet publish CKS.Web/CKS.Web.csproj -o publish
}

function copyGatsbyStaticPagesToWebApp()
{
    echo "WARNING: Ensure you build the gatsby site with npm build"

	if [ -d ../gatsby/public/ ]; then
		if [ -z "$(ls -A ../gatsby/public/topics)" ]; then
			echo "Error: Gatsby build directory is empty. Try running npm build"
		fi
	else
		echo "Error: Gatsby build directory does not exists. Try running npm build"
	fi
	
	cp -rT ../gatsby/public ../web-app/publish/wwwroot
}

function cleanupBeforeStart()
{
  echo "Cleanup before start"
  # Clean up before we start
  rm -rf docker-output && rm -rf allure-results && rm -rf allure-report

  # Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
  # See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
  export COMPOSE_CONVERT_WINDOWS_PATHS=1

  # Clean up before starting containers
  docker-compose down --remove-orphans --volumes && docker-compose rm -vf
}

function IncreaseVirtualMemory()
{
  sysctl -w vm.max_map_count=262144
}

function startDockerContainer()
{
  echo "Starting docker containers"
  docker-compose up -d --scale selenium-chrome=5
}

function runTests()
{
  echo "Running tests"
  # Wait for the web app to be up before running the tests
  docker-compose run -T test-runner npm run wait-then-test
  # Or for dev mode, uncomment:
  #winpty docker-compose exec test-runner bash
}

function processTestOutput()
{
  echo "Process  test outfit"
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
  echo "Running docker cleanup"
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

#Uncomment next line to run tests locally in docker
#prepairForLocalTestRun
cleanupBeforeStart
IncreaseVirtualMemory
startDockerContainer
runTests
processTestOutput
cleanup
exitWithCode $error
