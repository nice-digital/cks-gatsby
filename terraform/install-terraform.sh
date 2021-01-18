#!/bin/sh
echo "install useful tools...."

apt-get update
apt-get install zip unzip wget

echo "install aws cli...."

wget "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"
unzip -q awscli-exe-linux-x86_64.zip
./aws/install --update

aws --version

echo "install terraform...."
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
apt-get update && sudo apt-get install terraform

terraform --version

