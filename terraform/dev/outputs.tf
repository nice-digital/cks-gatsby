  ##################################################################################
  # OUTPUT
  ##################################################################################

output s3_hosting_bucket_id {
	description = "The name of the bucket."
	value = module.s3_hosting.this_s3_bucket_id
}

output s3_hosting_website_domain {
	description = "The name of the bucket."
	value = "http://${module.s3_hosting.this_s3_bucket_website_domain}"
}

output search_lambda_api_endpoint {
	description = "The endpoint of the search api."
	value = "${module.api_gateway.this_apigatewayv2_domain_name}"
}
