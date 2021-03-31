#!/bin/sh
echo packaging $1
cd ../edge-lambdas/$1/
touch -a -m -t 200001010000.00 *  # Remvoe the timestamp to only detect actual changes
rm -f ../../terraform/lambdas/$1.zip
zip -r -X ../../terraform/lambdas/$1.zip .
