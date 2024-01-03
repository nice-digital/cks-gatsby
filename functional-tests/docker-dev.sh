# Runs functional tests via Docker

# Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
# See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Clean up before starting containers
docker-compose down --remove-orphans && docker-compose rm -vf
docker-compose build && docker-compose up -d --force-recreate
# Leave the user in the tests container once all containers are up and running

# docker-compose exec tests waitforit -t 120 --strict comments:8080 -- bash
winpty docker-compose exec cks-test-runner sh
