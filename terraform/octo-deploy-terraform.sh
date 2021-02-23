#!/bin/sh

#This script install and runs terraform and supporting tools to deploy a complete
#serverless web project to aws using cloudfront/s3/lambda




# dotnet publish -c Release -r linux-x64 ../search-lambda/CKS.SearchLambda/CKS.SearchLambda.csproj
runningInOctoDeploy=false

if [ -d /home/cksocto/.octopus/OctopusServer/ ]
  then
    runningInOctoDeploy=true
    echo "running script in octo......."
    searchLambdaSourceLocation=$(get_octopusvariable "Octopus.Action[Copy Search Lambda Package].Output[CKS-Terraform].Package.FilePath")
    echo "search lambda location....... $searchLambdaSourceLocation"
fi


if [ "$runningInOctoDeploy" = true ] # Check to see if this script is runing in octo
  then
    echo "install terraform and support tools...."
    chmod +x install-terraform.sh
    sudo ./install-terraform.sh

    echo "set aws cli access keys...."
    export AWS_ACCESS_KEY_ID=$(get_octopusvariable "TFAWSAccessKey")
    export AWS_SECRET_ACCESS_KEY=$(get_octopusvariable "TFAWSAccessSecret")
    export AWS_DEFAULT_REGION=eu-west-1
    releaseNumber=$(get_octopusvariable "Octopus.Release.Number")
    releaseEnvironment=$(get_octopusvariable "Octopus.Environment.Name")
  else

  # Build files locally
  dotnet lambda package CKS.SearchLambda.zip --project-location ../search-lambda/CKS.SearchLambda
  zip -r -D -j CKS.EdgeLambda.zip ../edge-lambda/*

  # Set local parameters for local development
  searchLambdaSourceLocation="../CKS.SearchLambda.zip"
  edgeLambdaSourceLocation="../CKS.EdgeLambda.zip"
  releaseEnvironment="dev"
  releaseNumber="local-01"
fi

echo "Deploying Release Number: $releaseNumber to $releaseEnvironment"
echo "Using lambda search source files from..... $searchLambdaSourceLocation"
echo "Using edge lambda search source files from..... $edgeLambdaSourceLocation"
cd $releaseEnvironment
terraform init -input=false
terraform plan -input=false -out=tfplan -var "application_name=cks" -var "environment_name=$releaseEnvironment" -var "created_by=terraform" -var "teamcity_build_number=$releaseNumber" -var "search_lambda_source_filename=$searchLambdaSourceLocation" -var "edge_lambda_source_filename=$edgeLambdaSourceLocation"
terraform apply -input=false tfplan
echo "Current working directory is...$(pwd)"
# # aws s3 sync ../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)
# aws s3 cp ./../test-static-site/css/* s3://$(terraform output s3_hosting_bucket_id | jq -r .)/css/ --cache-control max-age=31536000
# aws s3 cp ./../test-static-site/*.html s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --cache-control max-age=30
aws s3 cp ./../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --recursive --cache-control max-age=31536000 # copy all files

rm $searchLambdaSourceLocation
rm $edgeLambdaSourceLocation

