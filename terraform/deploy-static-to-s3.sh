#!/bin/sh
# Usage deploy-static-to-s3.sh  <AWS_ACCESS_KEY_ID> <AWS_SECRET_ACCESS_KEY> <s3 bucket name> <releaseNumber> <static site files path> <local or octo>
# eg deploy-static-to-s3.sh nice-cks-local-s3-web-hosting 123 ../gatsby/public

s3BucketName=$3
releaseNumber=$4
pathToStaticFiles=$5

if [ "$6" = "octo" ]
  then
    runningInOctoDeploy=true
  else
    runningInOctoDeploy=false
fi

echo "Deploying files to S3 bucket: $s3BucketName from folder $pathToStaticFiles into $releaseNumber"

if [ "$runningInOctoDeploy" = true ]
  then
    echo "seting aws cli access keys...."
    export AWS_ACCESS_KEY_ID=$1
    export AWS_SECRET_ACCESS_KEY=$2
    export AWS_DEFAULT_REGION=eu-west-1
fi

s3BucketName=$(terraform output s3_hosting_bucket_id | jq -r .)
echo "Static S3 hosting bucket name is.....$s3BucketName"

cd $releaseEnvironment

# cache-control: public, max-age=0, must-revalidate
aws s3 cp $pathToStaticFiles s3://$s3BucketName/$releaseNumber \
 --cache-control 'public, max-age=0, must-revalidate' \
 --exclude "*" \
 --include "*.html" \
 --include "*.json" \
 --include "sw.js" \
 --exclude "/static/*" \
 --recursive --no-progress

# cache-control: cache-control: public, max-age=31536000, immutable
aws s3 cp $pathToStaticFiles s3://$s3BucketName/$releaseNumber \
  --cache-control 'public, max-age=31536000, immutable' \
  --exclude "*" \
  --include "*.js" \
  --include "*.css" \
  --include "*.jpg" \
  --include "*.png" \
  --include "*.woff" \
  --include "*.woff2" \
  --include "/static/*" \
  --recursive --no-progress

# copy every thing with no cache headers set
aws s3 cp $pathToStaticFiles s3://$s3BucketName/$releaseNumber \
  --include "*" \
  --exclude "*.html" \
  --exclude "*.json" \
  --exclude "sw.js" \
  --exclude "*.js" \
  --exclude "*.css" \
  --exclude "*.jpg" \
  --exclude "*.png" \
  --exclude "*.woff" \
  --exclude "*.woff2" \
  --exclude "/static/*" \
  --recursive --no-progress
