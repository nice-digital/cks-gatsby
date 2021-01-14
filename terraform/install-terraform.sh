#!/bin/sh
cat /etc/*-release

echo "check for sudo...."
sudo -l

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

aws --version

# terraform --version
