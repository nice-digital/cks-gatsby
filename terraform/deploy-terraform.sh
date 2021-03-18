#!/bin/sh

#This script install and runs terraform and supporting tools to deploy a complete
#serverless web project to aws using cloudfront/s3/lambda
# Command
# ./deploy-terraform.sh
#
# Arguments
# -a "awsAccessKeyId" -s "awsSecretAccessKey" -r "releaseNumber" -e "local, dev, aplpha, beta, live" -o "octo"
#
# Example Usage
# ./deploy-terraform.sh -e "local" -r "2"

while getopts a:s:r:p:e:o: flag
do
    case "${flag}" in
        a) awsAccessKeyId=${OPTARG};;
        s) awsSecretAccessKey=${OPTARG};;
        r) releaseNumber=${OPTARG};;
        e) releaseEnvironment=${OPTARG};;
        o) runningInOctoDeploy=${OPTARG};;
    esac
done
echo "deploying to....."
echo "awsAccessKey: $awsAccessKeyId";
echo "releaseNumber: $releaseNumber";
echo "releaseEnvironment: $releaseEnvironment";
echo "runningInOctoDeploy: $runningInOctoDeploy";

echo "setting release to $releaseNumber and deploying to environment $releaseEnvironment"

if [ "$runningInOctoDeploy" = "octo" ]
  then
    echo "seting aws cli access keys...."
    export AWS_ACCESS_KEY_ID=$awsAccessKeyId
    export AWS_SECRET_ACCESS_KEY=$awsSecretAccessKey
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

echo "running cmd......... terraform plan -input=false -out=tfplan -var "application_name=cks" -var "environment_name=$releaseEnvironment" -var "created_by=terraform" -var "search_lambda_source_filename=$searchLambdaLocation" -var "origin_request_edge_lambda_source_filename=$originRequestEdgeLambdaLocation" -var "origin_response_edge_lambda_source_filename=$originResponseEdgeLambdaLocation" -var "viewer_request_edge_lambda_source_filename=$viewerRequestEdgeLambdaLocation""

terraform plan -input=false -out=tfplan \
 -var "application_name=cks" \
 -var "environment_name=$releaseEnvironment" \
 -var "created_by=terraform" \
 -var "search_lambda_source_filename=$searchLambdaLocation" \
 -var "origin_request_edge_lambda_source_filename=$originRequestEdgeLambdaLocation" \
 -var "origin_response_edge_lambda_source_filename=$originResponseEdgeLambdaLocation" \
 -var "viewer_request_edge_lambda_source_filename=$viewerRequestEdgeLambdaLocation"

terraform apply -input=false tfplan

terraform output

if [ "$runningInOctoDeploy" = "octo" ]
  then
    s3BucketName=$(terraform output s3_hosting_bucket_id | jq -r .)
    echo "Static S3 hosting bucket name is.....$s3BucketName"
    set_octopusvariable "StaticSiteS3BucketName" $s3BucketName
fi
