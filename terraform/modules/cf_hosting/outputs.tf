  ##################################################################################
  # OUTPUT
  ##################################################################################

output this_s3_bucket_id {
	description = "The name of the bucket."
	value = aws_s3_bucket.s3_website_bucket.id
}

output this_s3_bucket_website_domain {
	description = "The name of the bucket webstie domain - used to upload files using aws cli tools."
	value = aws_s3_bucket.s3_website_bucket.website_endpoint
}

output this_cloudfront_distribution_domain {
	description = "The domain name corresponding to the distribution."
	value = aws_cloudfront_distribution.s3_distribution.domain_name
}
