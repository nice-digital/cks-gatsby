#!/bin/sh

#This script install and runs terraform and supporting tools to deploy a complete
#serverless web project to aws using cloudfront/s3/lambda

echo "install terraform and support tools...."
chmod +x install-terraform.sh
sudo ./install-terraform.sh

echo "set aws cli access keys...."
export AWS_ACCESS_KEY_ID=$(get_octopusvariable "TFAWSAccessKey")
export AWS_SECRET_ACCESS_KEY=$(get_octopusvariable "TFAWSAccessSecret")
export AWS_DEFAULT_REGION=eu-west-1

# dotnet publish -c Release -r linux-x64 ../search-lambda/CKS.SearchLambda/CKS.SearchLambda.csproj
releaseNumber=$(get_octopusvariable "Octopus.Release.Number")
releaseEnvironment=$(get_octopusvariable "Octopus.Environment.Name")
echo "Deploying Release Number: $releaseNumber to $releaseEnvironment"
cd $releaseEnvironment
terraform init -input=false
terraform plan -input=false -out=tfplan -var "application_name=cks" -var "environment_name=$releaseEnvironment" -var "created_by=terraform" -var "teamcity_build_number=$releaseNumber"
terraform apply -input=false tfplan
echo "Current working directory is...$(pwd)"
aws s3 sync ../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)
