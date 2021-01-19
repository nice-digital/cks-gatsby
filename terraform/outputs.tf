output "this_s3_bucket_bucket_domain_name" {
  description = "The bucket domain name. Will be of format bucketname.s3.amazonaws.com"
  value       = module.s3_bucket.this_s3_bucket_bucket_domain_name
}
