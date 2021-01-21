variable "application_name" {
  description = "The name of application"
  	type = string
	default = "nice-cks"
}

variable "environment_name" {
  description = "The name of environment"
  	type = string
	default = "dev"
}
variable "created_by" {
	description = "The name of the user or service that created the service or resouce"
}

variable "teamcity_build_number" {
  description = "The TeamCity build number of the build that triggered the creation of this resource"
  type = string
  default = "xxx"
}


terraform {
  required_version = ">= 0.14"
}

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

# resource "random_pet" "this" {
#   length = 3
# }

# # Put all extra resources which don't belong anywhere
# resource "aws_codedeploy_app" "this" {
#   name             = random_pet.this.id
#   compute_platform = "Lambda"
# }

module "s3_hosting" {
  source = "../modules/s3_hosting"

  application_name = var.application_name
  environment_name = var.environment_name
  teamcity_build_number = var.teamcity_build_number
}
