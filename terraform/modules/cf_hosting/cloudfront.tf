resource "aws_cloudfront_distribution" "s3_distribution" {

	origin {
		domain_name = aws_s3_bucket.s3_website_bucket.bucket_regional_domain_name
		origin_id   = aws_s3_bucket.s3_website_bucket.id
	}

	enabled             = true
	is_ipv6_enabled     = true
	default_root_object = "index.html"

	comment             = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}"

	price_class = "PriceClass_100" # speed up changes/dev by only deploying to eu/us

#   aliases = ["mysite.example.com", "yoursite.example.com"]

	default_cache_behavior {
		allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = aws_s3_bucket.s3_website_bucket.id

		forwarded_values {
			query_string = false
			headers      = ["CloudFront-Viewer-Country"]

			cookies {
				forward = "none"
			}
		}

		lambda_function_association {
			event_type = "origin-request"
			lambda_arn = var.origin_request_edge_lambda_qualified_arn
		}

		lambda_function_association {
			event_type = "origin-response"
			lambda_arn = var.origin_repsonse_edge_lambda_qualified_arn
		}

		min_ttl                = 0
		default_ttl            = 86400
		max_ttl                = 31536000
		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "/errors/*"

		allowed_methods  = ["GET", "HEAD"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = aws_s3_bucket.s3_website_bucket.id

		forwarded_values {
			query_string = false

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

	restrictions {
		geo_restriction {
			restriction_type = "none"
		}
	}

	custom_error_response {
			error_caching_min_ttl = 3600
			error_code            = 500
			response_code         = 500
			response_page_path    = "/errors/403-forbidden.html"
		}
	custom_error_response {
			error_caching_min_ttl = 3600
			error_code            = 403
			response_code         = 403
			response_page_path    = "/errors/403-forbidden.html"
		}

	tags = var.tags

	viewer_certificate {
		cloudfront_default_certificate = true
	}
}

