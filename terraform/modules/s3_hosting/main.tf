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

resource "aws_cloudfront_distribution" "s3_distribution" {

  origin {
    domain_name = aws_s3_bucket.s3_website_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    # s3_origin_config {
    #   origin_access_identity = "CKS dev static website"
    # }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CKS test static website CloudFront"
  default_root_object = "index.html"

#   logging_config {
#     include_cookies = false
#     bucket          = "mylogs.s3.amazonaws.com"
#     prefix          = "myprefix"
#   }

#   aliases = ["mysite.example.com", "yoursite.example.com"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior with precedence 1
#   ordered_cache_behavior {
#     path_pattern     = "/*"
#     allowed_methods  = ["GET", "HEAD", "OPTIONS"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = local.s3_origin_id

#     forwarded_values {
#       query_string = false

#       cookies {
#         forward = "none"
#       }
#     }

#     min_ttl                = 0
#     default_ttl            = 3600
#     max_ttl                = 86400
#     compress               = true
#     viewer_protocol_policy = "redirect-to-https"
#   }

#   price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    #   locations        = ["US", "CA", "GB", "DE"]
    }
  }

  tags = {
	application_name = var.application_name
	created_by = var.created_by
	environment_name = var.environment_name
	teamcity_build_number = var.teamcity_build_number
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
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
