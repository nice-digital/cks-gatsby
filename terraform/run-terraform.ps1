dotnet publish -c Release -r linux-x64 ..\search-lambda\CKS.SearchLambda\CKS.SearchLambda.csproj
terraform init -input=false
terraform plan
terraform apply

