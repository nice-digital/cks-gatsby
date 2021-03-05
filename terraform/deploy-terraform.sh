#!/bin/sh

#This script install and runs terraform and supporting tools to deploy a complete
#serverless web project to aws using cloudfront/s3/lambda

# Usage deploy-terraform.sh <AWS_ACCESS_KEY_ID> <AWS_SECRET_ACCESS_KEY> <releaseNumber> <releaseEnvironment> <local or octo>

if [ "$5" = "octo" ]
  then
    runningInOctoDeploy=true
  else
    runningInOctoDeploy=false
fi

echo "setting release to $3 and deploying to environment $4"
releaseNumber=$3
releaseEnvironment=$4

if [ "$runningInOctoDeploy" = true ]
  then
    echo "seting aws cli access keys...."
    export AWS_ACCESS_KEY_ID=$1
    export AWS_SECRET_ACCESS_KEY=$2
    export AWS_DEFAULT_REGION=eu-west-1
  else
    dotnet lambda package $searchLambdaLocation --project-location ../search-lambda/CKS.SearchLambda

    ./package-lambda.sh origin-request-edge-lambda
    ./package-lambda.sh origin-response-edge-lambda
    ./package-lambda.sh viewer-request-edge-lambda
fi

searchLambdaLocation="../lambdas/search-lambda.zip"

originRequestEdgeLambdaLocation="../lambdas/origin-request-edge-lambda.zip"
originResponseEdgeLambdaLocation="../lambdas/origin-reponse-edge-lambda.zip"
viewerRequestEdgeLambdaLocation="../lambdas/viewer-request-edge-lambda.zip"

echo "Deploying Release Number: $releaseNumber to $releaseEnvironment"

cd $releaseEnvironment
terraform init -input=false

echo "running cmd......... terraform plan -input=false -out=tfplan -var "application_name=cks" -var "environment_name=$releaseEnvironment" -var "created_by=terraform" -var "teamcity_build_number=$releaseNumber" -var "search_lambda_source_filename=$searchLambdaLocation" -var "origin_request_edge_lambda_source_filename=$originRequestEdgeLambdaLocation" -var "origin_response_edge_lambda_source_filename=$originResponseEdgeLambdaLocation" -var "viewer_request_edge_lambda_source_filename=$viewerRequestEdgeLambdaLocation""

terraform plan -input=false -out=tfplan \
 -var "application_name=cks" \
 -var "environment_name=$releaseEnvironment" \
 -var "created_by=terraform" \
 -var "teamcity_build_number=$releaseNumber" \
 -var "search_lambda_source_filename=$searchLambdaLocation" \
 -var "origin_request_edge_lambda_source_filename=$originRequestEdgeLambdaLocation" \
 -var "origin_response_edge_lambda_source_filename=$originResponseEdgeLambdaLocation" \
 -var "viewer_request_edge_lambda_source_filename=$viewerRequestEdgeLambdaLocation"

terraform apply -input=false tfplan

terraform output

# runningInOctoDeploy=false

# if [ -d /home/cksocto/.octopus/OctopusServer/ ]
  # then
    # runningInOctoDeploy=true
    # echo "running script in octo......."
    # searchLambdaSourceLocation=$(get_octopusvariable "Octopus.Action[Copy Search Lambda Package].Output[CKS-Terraform].Package.FilePath")
    # echo "search lambda location....... $searchLambdaSourceLocation"
# fi




# if [ "$runningInOctoDeploy" = false ]
#   then
#   # echo "install terraform and support tools...."
#   # chmod +x install-terraform.sh
#   # sudo ./install-terraform.sh

#   # echo "set aws cli access keys...."
#   # export AWS_ACCESS_KEY_ID=$(get_octopusvariable "TFAWSAccessKey")
#   # export AWS_SECRET_ACCESS_KEY=$(get_octopusvariable "TFAWSAccessSecret")
#   # export AWS_DEFAULT_REGION=eu-west-1
#   # releaseNumber=$(get_octopusvariable "Octopus.Release.Number")
#   # releaseEnvironment=$(get_octopusvariable "Octopus.Environment.Name")

# # else # local
#   dotnet lambda package $searchLambdaLocation --project-location ../search-lambda/CKS.SearchLambda

#   ./package-lambda.sh origin-request-edge-lambda
#   ./package-lambda.sh origin-response-edge-lambda
#   ./package-lambda.sh viewer-request-edge-lambda

#   releaseEnvironment="local"
#   releaseNumber="local-01"
# fi

# echo "Deploying Release Number: $releaseNumber to $releaseEnvironment"


# echo "Current working directory is...$(pwd)"
# # aws s3 sync ../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)
# aws s3 cp ./../test-static-site/css/* s3://$(terraform output s3_hosting_bucket_id | jq -r .)/css/ --cache-control max-age=31536000
# aws s3 cp ./../test-static-site/*.html s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --cache-control max-age=30
# aws s3 cp ./../test-static-site/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --recursive --cache-control max-age=31536000 # copy all files

# rm $searchLambdaSourceLocation
# rm $edgeLambdaSourceLocation

