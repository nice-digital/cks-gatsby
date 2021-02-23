##################################################################################
# Locals
##################################################################################

# locals {
# 	s3_origin_id = "${var.name}-s3-webhost-${var.environment_name}"
# }

##################################################################################
# Resources
##################################################################################


resource "aws_s3_bucket" "s3_website_bucket" {
  bucket = "${var.name}-s3-web-hosting"
  acl    = "public-read"

  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "error.html"
	}

	tags = var.tags
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
