#!/bin/sh
echo packaging $1
cd ../edge-lambdas/$1/
touch -a -m -t 200001010000.00 *  # Remvoe the timestamp to only detect actual changes
zip -r ../../terraform/lambdas/$1.zip .