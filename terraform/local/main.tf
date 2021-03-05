terraform {
  required_version = ">= 0.14"

}

################################################################################
# AWS Naming convetion
# org-application-env-component
# eg....org = nice, application = cks, env = local, component = s3-hosing
# nice-cks-local-s3-hosting
################################################################################

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

# Search endpoint service

module "lambda" {
	source = "../modules/lambda"
	name = "${local.name}-search"

	lambda_source_filename = var.search_lambda_source_filename
	apigatewayv2_api_execution_arn = module.api_gateway.this_apigatewayv2_api_execution_arn

	tags = local.default_tags
}

module "api_gateway" {
	source = "../modules/apigateway"
	name = "${local.name}-search"

	lambda_invoke_arn = module.lambda.this_lambda_invoke_arn

	tags = local.default_tags
}

# Cloudfront / Hosting / Georestrictions

module "cf_hosting" {
  source = "../modules/cf_hosting"

  name = local.name
  origin_request_edge_lambda_qualified_arn = module.origin_request_edge_lambda.this_lambda_qualified_arn
  origin_repsonse_edge_lambda_qualified_arn = module.origin_response_edge_lambda.this_lambda_qualified_arn
  viewer_request_edge_lambda_qualified_arn = module.viewer_request_edge_lambda.this_lambda_qualified_arn


  tags = local.default_tags
}

module "origin_request_edge_lambda" {
  source = "../modules/edge_lambda"

  lambda_source_filename = var.origin_request_edge_lambda_source_filename

  name = local.name
  event_type = "origin-request"

  tags = local.default_tags
}

module "origin_response_edge_lambda" {
  source = "../modules/edge_lambda"

  lambda_source_filename = var.origin_response_edge_lambda_source_filename

  name = local.name
  event_type = "origin-response"

  tags = local.default_tags
}

module "viewer_request_edge_lambda" {
  source = "../modules/edge_lambda"

  lambda_source_filename = var.viewer_request_edge_lambda_source_filename

  name = local.name
  event_type = "viewer-request"

  tags = local.default_tags
}