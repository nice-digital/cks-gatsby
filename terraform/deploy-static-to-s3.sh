#!/bin/sh
# Usage deploy-static-to-s3.sh <name of s3 bucket> <build number>
# eg deploy-static-to-s3.sh nice-cks-local-s3-web-hosting 123
echo "Deploying files to S3 bucket: $1 into folder $2"

# cache-control: public, max-age=0, must-revalidate
aws s3 cp ../gatsby/public/ s3://$1/$2 --cache-control 'public, max-age=0, must-revalidate' --exclude "*" --include "*.html" --include "*.json" --recursive

# cache-control: cache-control: public, max-age=31536000, immutable
aws s3 cp ../gatsby/public/ s3://$1/$2 --cache-control 'public, max-age=0, must-revalidate' --exclude "*" --include "*.js" --include "*.css" --recursive





