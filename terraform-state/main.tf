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

locals {
	default_tags = {
		org_name = var.org_name
		application_name = var.application_name
		environment_name = var.environment_name
		created_by = var.created_by
	}
	name = "${var.org_name}-${var.application_name}-${var.environment_name}"
}


resource "aws_s3_bucket" "b" {
	bucket = "terraform-state-nice-cks-dev"

	lifecycle {
		prevent_destroy = false
	}

	versioning {
		enabled = true
	}

	server_side_encryption_configuration {
		rule {
			apply_server_side_encryption_by_default {
				sse_algorithm = "AES256"
			}
		}
	}

	tags = local.default_tags
}
