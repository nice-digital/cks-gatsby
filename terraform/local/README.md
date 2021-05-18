<!-- BEGIN_TF_DOCS -->

## Requirements

| Name                                                                     | Version |
| ------------------------------------------------------------------------ | ------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 0.14 |

## Providers

No providers.

## Modules

| Name                                                                                                                 | Source                 | Version |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------- |
| <a name="module_api_gateway"></a> [api_gateway](#module_api_gateway)                                                 | ../modules/apigateway  |         |
| <a name="module_cf_hosting"></a> [cf_hosting](#module_cf_hosting)                                                    | ../modules/cf_hosting  |         |
| <a name="module_lambda"></a> [lambda](#module_lambda)                                                                | ../modules/lambda      |         |
| <a name="module_origin_request_edge_lambda"></a> [origin_request_edge_lambda](#module_origin_request_edge_lambda)    | ../modules/edge_lambda |         |
| <a name="module_origin_response_edge_lambda"></a> [origin_response_edge_lambda](#module_origin_response_edge_lambda) | ../modules/edge_lambda |         |
| <a name="module_viewer_request_edge_lambda"></a> [viewer_request_edge_lambda](#module_viewer_request_edge_lambda)    | ../modules/edge_lambda |         |

## Resources

No resources.

## Inputs

| Name                                                                                                                                                               | Description                                                                                                                                                                                    | Type     | Default       | Required |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- | :------: |
| <a name="input_application_name"></a> [application_name](#input_application_name)                                                                                  | The name of application/project                                                                                                                                                                | `string` | `"cks"`       |    no    |
| <a name="input_created_by"></a> [created_by](#input_created_by)                                                                                                    | The name of the user or service that created the service or resource. This is to easily identify resources that have been created using Terraform an therefore should not be modified manually | `string` | `"terraform"` |    no    |
| <a name="input_environment_name"></a> [environment_name](#input_environment_name)                                                                                  | The name of NICE environment. Local = local dev laptop, dev = dev environment in AWS, test = test environment in AWS, alpha = alpha environment in AWS etc...                                  | `string` | `"local"`     |    no    |
| <a name="input_org_name"></a> [org_name](#input_org_name)                                                                                                          | The org of application/project. This is needed to correctly and uniquely identify some AWS resources which cannot have duplicate names as other global AWS recourses                           | `string` | `"nice"`      |    no    |
| <a name="input_origin_request_edge_lambda_source_filename"></a> [origin_request_edge_lambda_source_filename](#input_origin_request_edge_lambda_source_filename)    | Supplied manually or via Teamcity variables                                                                                                                                                    | `string` | n/a           |   yes    |
| <a name="input_origin_response_edge_lambda_source_filename"></a> [origin_response_edge_lambda_source_filename](#input_origin_response_edge_lambda_source_filename) | Supplied manually or via Teamcity variables                                                                                                                                                    | `string` | n/a           |   yes    |
| <a name="input_release_number"></a> [release_number](#input_release_number)                                                                                        | Supplied manually or via Teamcity variables                                                                                                                                                    | `string` | n/a           |   yes    |
| <a name="input_search_lambda_source_filename"></a> [search_lambda_source_filename](#input_search_lambda_source_filename)                                           | Supplied manually or via Teamcity variables                                                                                                                                                    | `string` | n/a           |   yes    |
| <a name="input_viewer_request_edge_lambda_source_filename"></a> [viewer_request_edge_lambda_source_filename](#input_viewer_request_edge_lambda_source_filename)    | Supplied manually or via Teamcity variables                                                                                                                                                    | `string` | n/a           |   yes    |

## Outputs

| Name                                                                                                              | Description                                 |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| <a name="output_cloudfront_domain"></a> [cloudfront_domain](#output_cloudfront_domain)                            | The Cloudfront publishing domain            |
| <a name="output_s3_hosting_bucket_id"></a> [s3_hosting_bucket_id](#output_s3_hosting_bucket_id)                   | The name of the bucket.                     |
| <a name="output_s3_hosting_website_domain"></a> [s3_hosting_website_domain](#output_s3_hosting_website_domain)    | The website hosting domain of the s3 bucket |
| <a name="output_search_lambda_api_endpoint"></a> [search_lambda_api_endpoint](#output_search_lambda_api_endpoint) | The endpoint of the search api.             |

<!-- END_TF_DOCS -->

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
