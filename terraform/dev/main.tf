terraform {
  required_version = ">= 0.14"
  backend "s3" {
	  encrypt = true
	  bucket = "terraform-state-nice-cks-dev"
	  region = "eu-west-1"
	  key = "nice/cks/dev"
  }
}

####
# Naming convetion
# org-application-env-component
# nice-cks-local-s3-hosting
####

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
# Locals
##################################################################################

locals {
	default_tags = {
		org_name = var.org_name
		application_name = var.application_name
		environment_name = var.environment_name
		teamcity_build_number = var.teamcity_build_number
		created_by = var.created_by
	}
	name = "${var.org_name}-${var.application_name}-${var.environment_name}"
}

##################################################################################
# MODULES
##################################################################################

module "cf_hosting" {
  source = "../modules/cf_hosting"

  name = local.name
  edge_lambda_qualified_arn = module.edge_lambda.this_lambda_qualified_arn

  tags = local.default_tags

}

module "lambda" {
  source = "../modules/lambda"

  lambda_source_filename = var.search_lambda_source_filename
  apigatewayv2_api_execution_arn = module.api_gateway.this_apigatewayv2_api_execution_arn

  application_name = var.application_name
  environment_name = var.environment_name
  teamcity_build_number = var.teamcity_build_number

}

module "api_gateway" {
  source = "../modules/apigateway"

  lambda_invoke_arn = module.lambda.this_lambda_invoke_arn

  application_name = var.application_name
  environment_name = var.environment_name
  teamcity_build_number = var.teamcity_build_number
}

module "edge_lambda" {
  source = "../modules/lambda_edge"

  lambda_source_filename = var.edge_lambda_source_filename

  name = local.name

  tags = local.default_tags
}
