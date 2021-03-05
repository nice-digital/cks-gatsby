#!/bin/sh

#This script install and runs terraform and supporting tools to deploy a complete
#serverless web project to aws using cloudfront/s3/lambda

runningInOctoDeploy=false

# if [ -d /home/cksocto/.octopus/OctopusServer/ ]
  # then
    # runningInOctoDeploy=true
    # echo "running script in octo......."
    # searchLambdaSourceLocation=$(get_octopusvariable "Octopus.Action[Copy Search Lambda Package].Output[CKS-Terraform].Package.FilePath")
    # echo "search lambda location....... $searchLambdaSourceLocation"
# fi


originRequestEdgeLambdaLocation="./lambdas/origin-request-edge-lambda.zip"
originResponseEdgeLambdaLocation="./lambdas/origin-reponse-edge-lambda.zip"
viewerRequestEdgeLambdaLocation="./lambdas/viewer-request-edge-lambda.zip"

searchLambdaLocation="./lambdas/search-lambda.zip"

if [ "$runningInOctoDeploy" = true ]
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

else # local
  dotnet lambda package $searchLambdaLocation --project-location ../search-lambda/CKS.SearchLambda

  ./package-lambda.sh origin-request-edge-lambda
  ./package-lambda.sh origin-response-edge-lambda
  ./package-lambda.sh viewer-request-edge-lambda

  releaseEnvironment="dev"
  releaseNumber="local-01"
fi

echo "Deploying Release Number: $releaseNumber to $releaseEnvironment"

cd $releaseEnvironment
terraform init -input=false
terraform plan -input=false -out=tfplan -var "application_name=cks" -var "environment_name=$releaseEnvironment" -var "created_by=terraform" -var "teamcity_build_number=$releaseNumber" -var "search_lambda_source_filename=$searchLambdaLocation" -var "origin_request_edge_lambda_source_filename=$edgeLambdaSourceLocation" -var "origin_response_edge_lambda_source_filename=$edgeLambdaSourceLocation" -var "viewer_request_edge_lambda_source_filename=$edgeLambdaSourceLocation"
terraform apply -input=false tfplan


# echo "Current working directory is...$(pwd)"
# # aws s3 sync ../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)
# aws s3 cp ./../test-static-site/css/* s3://$(terraform output s3_hosting_bucket_id | jq -r .)/css/ --cache-control max-age=31536000
# aws s3 cp ./../test-static-site/*.html s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --cache-control max-age=30
# aws s3 cp ./../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --recursive --cache-control max-age=31536000 # copy all files

rm $searchLambdaSourceLocation
rm $edgeLambdaSourceLocation

