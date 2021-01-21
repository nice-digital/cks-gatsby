#!/bin/sh
echo "install useful tools...."

apt-get update
apt-get install zip unzip wget jq -y

echo "install aws cli...."

wget -nv "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"
unzip -q awscli-exe-linux-x86_64.zip
./aws/install --update
rm awscli-exe-linux-x86_64.zip

aws --version

echo "install terraform...."
wget -nv -O gpg-key https://apt.releases.hashicorp.com/gpg
apt-key add gpg-key
apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
apt-get update && sudo apt-get install terraform -y

terraform --version

