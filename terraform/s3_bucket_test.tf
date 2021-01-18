module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${random_pet.this.id}-test-s3-bucket"
  acl    = "private"

  versioning = {
    enabled = false
  }

}
