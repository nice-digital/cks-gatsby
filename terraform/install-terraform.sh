#!/bin/sh
cat /etc/*-release

echo "check for sudo...."
sudo -l

sudo apt-get install zip unzip

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install --update

aws --version

echo "set aws cli access keys...."
echo $TFAWSAccessKey
export AWS_ACCESS_KEY_ID=$(get_octopusvariable "TFAWSAccessKey")
# export AWS_SECRET_ACCESS_KEY=$TFAWSAccessSecret
export AWS_SECRET_ACCESS_KEY=$(get_octopusvariable "TFAWSAccessSecret")
export AWS_DEFAULT_REGION=eu-west-1
accesskey=$(get_octopusvariable "TFAWSAccessKey")
echo "Access key string is: $accesskey"

echo $TFAWSAccessKey

echo "check that aws cli is working...."

aws s3 ls

# terraform --version
