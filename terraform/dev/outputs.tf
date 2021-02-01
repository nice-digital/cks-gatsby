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
