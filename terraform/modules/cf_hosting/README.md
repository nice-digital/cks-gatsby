# NICE Cloudfront Hosting Terraform module

A terraform module that creates an S3 web hosting bucket and points a Cloudfront CDN distribution to it. It also creates origin request, origin response, and viewer request edge lambda behaviour using the supplied lambda functions.

Please not that the lambda functions need to be created in "us-east-1" in order that they can be converted to lambda functions (something that AWS does in the background with secret sauce)

## Usage

### S3 Website hosted delivered via Cloudfront CDN with edge lambda request/response modifiers

```hcl
module "cf_hosting" {
  source = "../modules/cf_hosting"
  release_number = var.release_number

  name = local.name
  origin_request_edge_lambda_qualified_arn = module.origin_request_edge_lambda.this_lambda_qualified_arn
  origin_response_edge_lambda_qualified_arn = module.origin_response_edge_lambda.this_lambda_qualified_arn
  viewer_request_edge_lambda_qualified_arn = module.viewer_request_edge_lambda.this_lambda_qualified_arn

  tags = local.default_tags
}
```

<!-- BEGIN_TF_DOCS -->

## Requirements

| Name                                                                     | Version |
| ------------------------------------------------------------------------ | ------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 0.14 |
| <a name="requirement_aws"></a> [aws](#requirement_aws)                   | >= 3.36 |

## Providers

| Name                                             | Version |
| ------------------------------------------------ | ------- |
| <a name="provider_aws"></a> [aws](#provider_aws) | >= 3.36 |

## Modules

No modules.

## Resources

| Name                                                                                                                                               | Type     |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [aws_cloudfront_distribution.s3_distribution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution) | resource |
| [aws_s3_bucket.s3_website_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)                           | resource |
| [aws_s3_bucket_policy.test-static-site-policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy)       | resource |

## Inputs

| Name                                                                                                                                                         | Description                                                                                                                              | Type          | Default | Required |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------- | :------: |
| <a name="input_name"></a> [name](#input_name)                                                                                                                | Determines the name of resources created                                                                                                 | `string`      | n/a     |   yes    |
| <a name="input_origin_repsonse_edge_lambda_qualified_arn"></a> [origin_repsonse_edge_lambda_qualified_arn](#input_origin_repsonse_edge_lambda_qualified_arn) | The qualified ARN of the lambda. Needs to be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}                           | `string`      | n/a     |   yes    |
| <a name="input_origin_request_edge_lambda_qualified_arn"></a> [origin_request_edge_lambda_qualified_arn](#input_origin_request_edge_lambda_qualified_arn)    | The qualified ARN of the lambda. Needs to be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}                           | `string`      | n/a     |   yes    |
| <a name="input_release_number"></a> [release_number](#input_release_number)                                                                                  | Version number of of the release. This is used to create a seperate versioned folder in the S3 bucket and sets cloudfront to point to it | `string`      | n/a     |   yes    |
| <a name="input_tags"></a> [tags](#input_tags)                                                                                                                | Map object of AWS tags to add to each AWS resouce created                                                                                | `map(string)` | `{}`    |    no    |
| <a name="input_viewer_request_edge_lambda_qualified_arn"></a> [viewer_request_edge_lambda_qualified_arn](#input_viewer_request_edge_lambda_qualified_arn)    | The qualified ARN of the lambda. Needs to be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}                           | `string`      | n/a     |   yes    |

## Outputs

| Name                                                                                                                                         | Description                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| <a name="output_this_cloudfront_distribution_domain"></a> [this_cloudfront_distribution_domain](#output_this_cloudfront_distribution_domain) | The domain name corresponding to the distribution.                                |
| <a name="output_this_s3_bucket_id"></a> [this_s3_bucket_id](#output_this_s3_bucket_id)                                                       | The name of the bucket.                                                           |
| <a name="output_this_s3_bucket_website_domain"></a> [this_s3_bucket_website_domain](#output_this_s3_bucket_website_domain)                   | The name of the bucket webstie domain - used to upload files using aws cli tools. |

<!-- END_TF_DOCS -->

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
