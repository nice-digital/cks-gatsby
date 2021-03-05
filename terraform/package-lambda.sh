#!/bin/sh
echo packaging $1
cd ../edge-lambdas/$1/
zip -r ../../terraform/lambdas/$1.zip .
