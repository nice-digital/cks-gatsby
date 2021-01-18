#!/bin/sh
cat /etc/*-release

echo "install useful tools...."

sudo apt-get update
sudo apt-get install zip unzip wget

echo "install aws cli...."

wget "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install --update

aws --version

echo "set aws cli access keys...."
export AWS_ACCESS_KEY_ID=$(get_octopusvariable "TFAWSAccessKey")
export AWS_SECRET_ACCESS_KEY=$(get_octopusvariable "TFAWSAccessSecret")
export AWS_DEFAULT_REGION=eu-west-1

echo "install terraform...."
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

terraform --version

