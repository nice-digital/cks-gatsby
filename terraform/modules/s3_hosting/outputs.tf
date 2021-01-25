output this_s3_bucket_id {
	description = "The name of the bucket."
	value = aws_s3_bucket.s3_website_bucket.id
}

output this_s3_bucket_website_domain {
	description = "The name of the bucket."
	value = aws_s3_bucket.s3_website_bucket.website_endpoint
}

