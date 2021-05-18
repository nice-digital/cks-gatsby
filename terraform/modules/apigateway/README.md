# NICE AWS API Gateway (v2) Terraform module

A terraform module that creates an API Gateway v2 endpoint and connects the supplied lambda function to it.

## Usage

### Create API Gateway v2 with supplied lambda function

```hcl
module "api_gateway" {
	source = "../modules/apigateway"
	name = "${local.name}-search"

	lambda_invoke_arn = module.lambda.this_lambda_invoke_arn

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

| Name                                                                                                                                                        | Type     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [aws_apigatewayv2_api.lambda_api](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_api)                             | resource |
| [aws_apigatewayv2_integration.lambda_api_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_integration) | resource |
| [aws_apigatewayv2_route.lambda_api_index_route](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_route)             | resource |
| [aws_apigatewayv2_stage.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_stage)                            | resource |

## Inputs

| Name                                                                                 | Description                                                                 | Type          | Default | Required |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------- | ------- | :------: |
| <a name="input_lambda_invoke_arn"></a> [lambda_invoke_arn](#input_lambda_invoke_arn) | The ARN of the lambda function that you want to invoke from this apigateway | `string`      | n/a     |   yes    |
| <a name="input_name"></a> [name](#input_name)                                        | Determines the name of resources created                                    | `string`      | n/a     |   yes    |
| <a name="input_tags"></a> [tags](#input_tags)                                        | Map object of AWS tags to add to each AWS resouce created                   | `map(string)` | `{}`    |    no    |

## Outputs

| Name                                                                                                                                         | Description                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a name="output_this_apigatewayv2_api_execution_arn"></a> [this_apigatewayv2_api_execution_arn](#output_this_apigatewayv2_api_execution_arn) | The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API. |
| <a name="output_this_apigatewayv2_domain_name"></a> [this_apigatewayv2_domain_name](#output_this_apigatewayv2_domain_name)                   | The target domain name.                                                                                                                           |

<!-- END_TF_DOCS -->

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
