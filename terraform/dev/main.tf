terraform {
  required_version = ">= 0.14"
#   backend "s3" {
# 	  encrypt = true
# 	  bucket = "terraform-state-nice-cks-dev"
# 	  region = "eu-west-1"
# 	  key = "nice/cks/dev"
#   }
}

##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  region = "eu-west-1"

  # Make it faster by skipping something
  skip_get_ec2_platforms      = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_credentials_validation = true

  # skip_requesting_account_id should be disabled to generate valid ARN in apigatewayv2_api_execution_arn
  skip_requesting_account_id = false
}

##################################################################################
# DATA
##################################################################################



##################################################################################
# MODULES
##################################################################################

module "s3_hosting" {
  source = "../modules/s3_hosting"

  application_name = var.application_name
  environment_name = var.environment_name
  teamcity_build_number = var.teamcity_build_number
}

module "lambda" {
  source = "../modules/lambda"

  application_name = var.application_name
  environment_name = var.environment_name
  teamcity_build_number = var.teamcity_build_number
  lambda_source_filename = var.search_lambda_source_filename
  apigatewayv2_api_execution_arn = module.api_gateway.this_apigatewayv2_api_execution_arn

}

module "api_gateway" {
  source = "../modules/apigateway"

  application_name = var.application_name
  environment_name = var.environment_name
  teamcity_build_number = var.teamcity_build_number
  lambda_invoke_arn = module.lambda.this_lambda_invoke_arn

}
