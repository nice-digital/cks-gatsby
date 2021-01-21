resource "aws_s3_bucket" "s3_website_bucket" {
  bucket = "${var.application_name}-s3_website-${var.environment_name}"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
	}

  tags = {
	application_name = var.application_name
	created_by = var.created_by
	environment_name = var.environment_name
	teamcity_build_number = var.teamcity_build_number

  }
}

# locals {
#   bucket_name = random_pet.this.id
# }

# module "s3_bucket" {
#   source  = "terraform-aws-modules/s3-bucket/aws"
#   version = "~> 1.0"

#   bucket        = local.bucket_name
#   acl           = "private"
#   force_destroy = true

#   website = {
# 	  index_document = "index.html"
#   }


#   // S3 bucket-level Public Access Block configuration
#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

resource "aws_s3_bucket_policy" "test-static-site-policy" {
	depends_on = [ aws_s3_bucket.s3_website_bucket ]
    bucket = aws_s3_bucket.s3_website_bucket.id
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "test-static-site-policy",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.s3_website_bucket.id}/*"
            ]
        }
    ]
}
POLICY
}


# module "cdn" {
#   source = "terraform-aws-modules/cloudfront/aws"

#   comment             = "CKS test static website CloudFront"
#   enabled             = true
#   is_ipv6_enabled     = true
#   price_class         = "PriceClass_All"
#   retain_on_delete    = false
#   wait_for_deployment = false

#   create_origin_access_identity = true
#   origin_access_identities = {
#     s3_bucket = "CKS test static website"
#   }
#   default_root_object = "index.html"

#   origin = {

#     s3_bucket = {
#       domain_name = module.s3_bucket.this_s3_bucket_bucket_regional_domain_name
#       s3_origin_config = {
#         origin_access_identity = "s3_bucket"
#       }
#     }
#   }

#   cache_behavior = {
#     default = {
#       path_pattern           = "/*"
#       target_origin_id       = "s3_bucket"
#       viewer_protocol_policy = "redirect-to-https"

#       allowed_methods = ["GET", "HEAD", "OPTIONS"]
#       cached_methods  = ["GET", "HEAD"]
#       compress        = true
#       query_string    = true
#     }
#   }
# }
# }
