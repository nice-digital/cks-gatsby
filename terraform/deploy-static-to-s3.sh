
while getopts a:s:b:r:p:e:o: flag
do
    case "${flag}" in
        a) awsAccessKeyId=${OPTARG};;
        s) awsSecretAccessKey=${OPTARG};;
        b) s3BucketName=${OPTARG};;
        r) releaseNumber=${OPTARG};;
        p) pathToStaticFiles=${OPTARG};;
        e) releaseEnvironment=${OPTARG};;
        o) runningInOctoDeploy=${OPTARG};;
    esac
done
echo "deploying to....."
echo "awsAccessKey: $awsAccessKeyId";
echo "s3BucketName: $s3BucketName";
echo "releaseNumber: $releaseNumber";
echo "pathToStaticFiles: $pathToStaticFiles";
echo "releaseEnvironment: $releaseEnvironment";
echo "runningInOctoDeploy: $runningInOctoDeploy";

echo "Deploying files to S3 bucket: $s3BucketName from $pathToStaticFiles into $s3BucketName/$releaseNumber"

if [ "$runningInOctoDeploy" = true ]
  then
    echo "seting aws cli access keys...."
    export AWS_ACCESS_KEY_ID=$awsAccessKeyId
    export AWS_SECRET_ACCESS_KEY=$awsSecretAccessKey
    export AWS_DEFAULT_REGION=eu-west-1
fi

if [ "$s3BucketName" = "" ]
  then
    echo "Trying to get s3BucketName"

    s3BucketName=$(cd $releaseEnvironment && terraform output s3_hosting_bucket_id | jq -r .)

    echo "s3BucketName hosting bucket name is.....$s3BucketName"
fi

# # cache-control: public, max-age=0, must-revalidate
# aws s3 cp $pathToStaticFiles s3://$s3BucketName/$releaseNumber \
#  --cache-control 'public, max-age=0, must-revalidate' \
#  --exclude "*" \
#  --include "*.html" \
#  --include "*.json" \
#  --include "sw.js" \
#  --exclude "/static/*" \
#  --recursive --no-progress

# # cache-control: cache-control: public, max-age=31536000, immutable
# aws s3 cp $pathToStaticFiles s3://$s3BucketName/$releaseNumber \
#   --cache-control 'public, max-age=31536000, immutable' \
#   --exclude "*" \
#   --include "*.js" \
#   --include "*.css" \
#   --include "*.jpg" \
#   --include "*.png" \
#   --include "*.woff" \
#   --include "*.woff2" \
#   --include "/static/*" \
#   --recursive --no-progress

# # copy every thing with no cache headers set
# aws s3 cp $pathToStaticFiles s3://$s3BucketName/$releaseNumber \
#   --include "*" \
#   --exclude "*.html" \
#   --exclude "*.json" \
#   --exclude "sw.js" \
#   --exclude "*.js" \
#   --exclude "*.css" \
#   --exclude "*.jpg" \
#   --exclude "*.png" \
#   --exclude "*.woff" \
#   --exclude "*.woff2" \
#   --exclude "/static/*" \
#   --recursive --no-progress
