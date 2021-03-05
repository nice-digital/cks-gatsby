#!/bin/sh
# Usage deploy-static-to-s3.sh <name of s3 bucket> <build number>
# eg deploy-static-to-s3.sh nice-cks-local-s3-web-hosting 123
echo "Deploying files to S3 bucket: $1"

# aws s3 cp ./../../gatsby/public/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --cache-control max-age=31536000 --exclude "*.html" --exclude "*.json" --recursive
# aws s3 cp ./../../gatsby/public/ s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --cache-control max-age=31536000 --exclude "*.html" --exclude "*.json" --recursive

# aws s3 cp ./../test-static-site/css/* s3://$(terraform output s3_hosting_bucket_id | jq -r .)/css/ --cache-control max-age=31536000
# aws s3 cp ./../test-static-site/*.html s3://$(terraform output s3_hosting_bucket_id | jq -r .)/ --cache-control max-age=30



