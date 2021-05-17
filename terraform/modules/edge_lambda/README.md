# AWS Lambda@Edge Terraform module

Terraform module which creates Lambda@Edge functions for use with CloudFront CDN Platform

These features/configs of Lambda@Edge are supported:

- Origin Request
- Origin Response
- Viewer Request
- Viewer Response

## Usage

### Origin request edge lambda

```hcl
module "origin_request_edge_lambda" {
  source = "../modules/edge_lambda"

  lambda_source_filename = var.origin_request_edge_lambda_source_filename

  name = local.name
  event_type = "origin-request"

  tags = local.default_tags
}
```

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.12.26 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.36 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.36 |
| <a name="provider_aws.us_east_1"></a> [aws.us\_east\_1](#provider\_aws.us\_east\_1) | >= 3.36 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.lambda_at_edge](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_lambda_function.edge_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_iam_policy_document.assume_role_policy_doc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_event_type"></a> [event\_type](#input\_event\_type) | Determines the event type of the created lambda can be 'origin-request' , 'origin-response', 'viewer-request' or 'viewer-response' | `string` | n/a | yes |
| <a name="input_lambda_source_filename"></a> [lambda\_source\_filename](#input\_lambda\_source\_filename) | Full path and source name to the lambda function source code packaged zip | `string` | n/a | yes |
| <a name="input_name"></a> [name](#input\_name) | Determines the name of resources created | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Map object of AWS tags to add to each AWS resouce created | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_this_lambda_arn"></a> [this\_lambda\_arn](#output\_this\_lambda\_arn) | The ARN of the lambda. Will be of format arn:aws:lambda:us-east-1::functionname |
| <a name="output_this_lambda_qualified_arn"></a> [this\_lambda\_qualified\_arn](#output\_this\_lambda\_qualified\_arn) | The qualified ARN of the lambda. Will be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber} |

<!-- END_TF_DOCS -->

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
