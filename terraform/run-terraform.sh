#!/bin/sh
# dotnet publish -c Release -r linux-x64 ../search-lambda/CKS.SearchLambda/CKS.SearchLambda.csproj
terraform init -input=false
terraform plan
terraform apply -auto-approve
# aws s3 sync ../test-static-site/ s3://$(terraform output this_s3_bucket_id | jq -r .)
