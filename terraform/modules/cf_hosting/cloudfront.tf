resource "aws_cloudfront_distribution" "s3_distribution" {

	origin {
		domain_name = "${aws_s3_bucket.s3_website_bucket.id}.${aws_s3_bucket.s3_website_bucket.website_domain}"
		origin_id   = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"
		origin_path = "/${var.release_number}"
		custom_origin_config {
			http_port = 80
			https_port = 443
			origin_protocol_policy = "http-only"
			origin_ssl_protocols = [ "TLSv1.2" ]
		}
	}

	enabled             = true
	is_ipv6_enabled     = true
	# default_root_object = "index.html" - set the default object using s3 website hosting as this covers more than just /

	comment             = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}"

	price_class = "PriceClass_100" # speed up changes/dev by only deploying to eu/us

#   aliases = ["mysite.example.com", "yoursite.example.com"]

	default_cache_behavior {
		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

		forwarded_values {
			query_string = false
			headers      = ["CloudFront-Viewer-Country", "x-nice-allowed-ip"]

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
		lambda_function_association {
			event_type = "viewer-request"
			lambda_arn = var.viewer_request_edge_lambda_qualified_arn
		}

		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "*.js"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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

		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "*.css"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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
		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "*.jpg"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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
		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "*.png"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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
		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "*.woff"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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
		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "*.woff2"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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
		compress               = true
		viewer_protocol_policy = "redirect-to-https"
	}

	ordered_cache_behavior {
		path_pattern = "/static/*"

		allowed_methods  = ["GET", "HEAD", "OPTIONS"]
		cached_methods   = ["GET", "HEAD"]
		target_origin_id = "${var.tags.org_name}-${var.tags.application_name}-${var.tags.environment_name}-orgin"

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
			error_code            = 403
			response_code         = 403
			response_page_path    = "/errors/403.html"
		}
	custom_error_response {
			error_caching_min_ttl = 3600
			error_code            = 403
			response_code         = 403
			response_page_path    = "/errors/403.html"
		}
	custom_error_response {
			error_caching_min_ttl = 3600
			error_code            = 500
			response_code         = 500
			response_page_path    = "/errors/500.html"
		}

	tags = var.tags

	viewer_certificate {
		cloudfront_default_certificate = true
	}
}

