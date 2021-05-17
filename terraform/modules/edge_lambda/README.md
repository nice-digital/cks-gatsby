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

| Name                                                                                                                                                 | Type        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [aws_iam_role.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role)                                            | resource    |
| [aws_lambda_function.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_functiony)                             | resource    |
| [aws_iam_policy_document.assume_role_policy_doc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name                  | Description                                                                                                                        | Type          | Default | Required |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------- | -------- |
| name                  | Determines the name of resources created                                                                                           | `string`      | `null`  | `yes`    |
| event_type            | Determines the event type of the created lambda can be "origin-request" , "origin-response", "viewer-request" or "viewer-response" | `string`      | `null`  | `yes`    |
| lambda_souce_filename | Full path and source name to the lambda function source code packaged zip file                                                     | `string`      | `null`  | `yes`    |
| tags                  |                                                                                                                                    | `map(string)` | `{}`    | `no`     |

## Outputs

| Name                      | Description                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | --- |
| this_lambda_arn           | The ARN of the lambda. Will be of format arn:aws:lambda:us-east-1::functionname.                           |
| this_lambda_qualified_arn | The qualified ARN of the lambda. Will be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber} |     |

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
