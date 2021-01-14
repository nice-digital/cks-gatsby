#!/bin/sh
cat /etc/*-release

echo "check for sudo...."
sudo -l

# wget "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
# unzip awscli-bundle.zip
# ./awscli-bundle/install -b ~/bin/aws

aws --version

terraform --version
