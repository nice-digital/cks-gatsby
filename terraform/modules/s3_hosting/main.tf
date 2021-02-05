##################################################################################
# Locals
##################################################################################

locals {
	s3_origin_id = "${var.application_name}-s3-website-${var.environment_name}"
}

##################################################################################
# Resources
##################################################################################


resource "aws_s3_bucket" "s3_website_bucket" {
  bucket = local.s3_origin_id
  acl    = "public-read"

  force_destroy = true

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

# resource "aws_cloudfront_distribution" "s3_distribution" {

#   origin {
#     domain_name = aws_s3_bucket.s3_website_bucket.bucket_regional_domain_name
#     origin_id   = local.s3_origin_id
#   }

#   enabled             = true
#   is_ipv6_enabled     = true
#   comment             = "CKS test static website CloudFront"
#   default_root_object = "index.html"

# #   aliases = ["mysite.example.com", "yoursite.example.com"]

#   default_cache_behavior {
#     allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = local.s3_origin_id

#     forwarded_values {
#       query_string = false

#       cookies {
#         forward = "none"
#       }
#     }

#     viewer_protocol_policy = "allow-all"
#     min_ttl                = 0
#     default_ttl            = 3600
#     max_ttl                = 86400
#   }

#   # Cache behavior with precedence 0
#   ordered_cache_behavior {
#     path_pattern     = "/*"
#     allowed_methods  = ["GET", "HEAD", "OPTIONS"]
#     cached_methods   = ["GET", "HEAD", "OPTIONS"]
#     target_origin_id = local.s3_origin_id

#     forwarded_values {
#       query_string = false
#       headers      = ["Origin"]

#       cookies {
#         forward = "none"
#       }
#     }

#     min_ttl                = 0
#     default_ttl            = 86400
#     max_ttl                = 31536000
#     compress               = true
#     viewer_protocol_policy = "redirect-to-https"
#   }

# #   price_class = "PriceClass_200"

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     #   locations        = ["US", "CA", "GB", "DE"]
#     }
#   }

#   tags = {
# 	application_name = var.application_name
# 	created_by = var.created_by
# 	environment_name = var.environment_name
# 	teamcity_build_number = var.teamcity_build_number
#   }

#   viewer_certificate {
#     cloudfront_default_certificate = true
#   }
# }
