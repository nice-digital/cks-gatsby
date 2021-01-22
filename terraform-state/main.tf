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

	tags = {
		application_name = "cks"
		created_by = "cm"
		environment_name = "state-storage"
	}
}


# resource "aws_s3_bucket_policy" "terrafrom-state-policy" {
# 	# depends_on = [ module.s3_bucket ]
#     # bucket = local.bucket_name
#     bucket = aws_s3_bucket.b.bucket


#   policy = <<POLICY
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": "s3:ListBucket",
#       "Resource": "arn:aws:s3:::mybucket"
#     },
#     {
#       "Effect": "Allow",
#       "Action": ["s3:GetObject", "s3:PutObject"],
#       "Resource": "arn:aws:s3:::${aws_s3_bucket.b.bucket}"
#     }
#   ]
# }
# POLICY
# }
