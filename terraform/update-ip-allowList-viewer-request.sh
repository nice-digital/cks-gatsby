#!/bin/sh
echo Updating ipAllowList.json
cd ipAllowListUpdater
touch -a -m -t 200001010000.00 ipAllowList.json
zip ../lambdas/viewer-request-edge-lambda.zip ipAllowList.json
