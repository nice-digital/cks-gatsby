#!/bin/sh
echo "install terraform and support tools...."
chmod +x install-terraform.sh
sudo ./install-terraform.sh

echo "set aws cli access keys...."
export AWS_ACCESS_KEY_ID=$(get_octopusvariable "TFAWSAccessKey")
export AWS_SECRET_ACCESS_KEY=$(get_octopusvariable "TFAWSAccessSecret")
export AWS_DEFAULT_REGION=eu-west-1

# dotnet publish -c Release -r linux-x64 ../search-lambda/CKS.SearchLambda/CKS.SearchLambda.csproj
terraform init -input=false
terraform plan
terraform apply -auto-approve
# aws s3 sync ../test-static-site/ s3://$(terraform output this_s3_bucket_id | jq -r .)
