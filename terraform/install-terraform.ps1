Write-Host 'Checking PowerShell version.....'
$PSVersionTable.PSVersion

Write-Host "Getting octo dir parameters.............."

Write-Host $OctopusParameters["Octopus.Action.Package.CustomInstallationDirectory"]

Write-Host "Getting octo parameters.............."

Write-Host $OctopusParameters

Write-Host 'Setting TLS version....'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Check if PowerShell.Archive is available......"
Get-Module "Microsoft.PowerShell.Archive" -ListAvailable
Import-Module Microsoft.PowerShell.Archive

Write-Host "Starting Terraform Install"
Write-Host "Downloading Terraform....."
$url = "https://releases.hashicorp.com/terraform/0.14.3/terraform_0.14.3_windows_amd64.zip"

$output = "terraform.zip"

Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Unziping Terraform....."

Expand-Archive -Path $output










# $tfVersion = "0.14"
# $InstallPath = '.'
# $os = 'windows'
# $arch = 'amd64'


# if ($ENV:TF_VERSION) {$tfVersion = $ENV:TF_VERSION}
# $tfAvailableVersions = (Invoke-Restmethod -UseBasicParsing 'https://releases.hashicorp.com/terraform/index.json').versions

# #If a minor release was provided (e.g. 12.0), find the latest bugfix version available
# if ($tfVersion -match '^\d+\.\d+$') {
# 	$tfSearchVersion = [version]$tfVersion
# 	#Exclude Prereleases
# 	$tfAvailableVersionNums = [version[]]($tfAvailableVersions.psobject.properties.name | Where-Object {$PSItem -match '^\d+\.\d+\.\d+$'})
# 	[string]$tfVersion = $tfAvailableVersionNums | where minor -eq $tfSearchVersion.Minor | Sort-Object -descending | Select-Object -first 1
# }

# $tfSelectedVersion = $tfAvailableVersions.$tfVersion
# if (-not $TFSelectedVersion) {write-error "TF Version $TFVersion was not found on the terraform server"; return}
# $tfDownloadUri = $tfSelectedVersion.builds | where os -eq $os | where arch -eq $arch | Select-Object -first 1 | % url
# ("Selected Version: " + $tfSelectedVersion.version)
# "Downloading $tfDownloadUri"
# $DownloadPath= [io.path]::GetTempFileName()
# #TODO: Hash Verification
# if ($PSEdition -eq 'Desktop') {
# 	#Fixes performance problem with Invoke-WebRequest
# 	$ProgressPreference = 'Continue'
# }

# iwr -useb $tfDownloadUri -OutFile $DownloadPath
# $ResolvedInstallPath = resolve-path $InstallPath
# "Extracting terraform to $ResolvedInstallPath"
# $tfZipPath = Join-Path (Split-Path $DownloadPath -Parent) 'terraform.zip'
# Move-Item $DownloadPath $tfZipPath
# Expand-Archive -Path $tfZipPath -DestinationPath $InstallPath -Force
# if (($ResolvedInstallPath) -notin $env:PATH.split([IO.Path]::PathSeparator)) {write-warning "$ResolvedInstallPath was not found in your PATH environment variable. Call terraform directly with $(join-path $ResolvedInstallPath 'terraform')"}


# #Run the last function in this file unless this script is dotsourced, using any arguments provided
# # if ($myinvocation.Line -notmatch '^\. ') {
# #     $command = 'beginblock','processblock','endblock' | foreach {
# #         $myInvocation.mycommand.scriptblock.ast.$PSItem.statements
# #     } | Where-Object {$PSItem -is [Management.Automation.Language.FunctionDefinitionAst]} | % name | Select-Object -last 1
# #     $myargs = $myinvocation.UnboundArguments
# #     [ScriptBlock]$invokeScriptBlock = [Scriptblock]::Create("$command $myargs")
# #     invoke-command $invokeScriptBlock
# # }

# Write-Host "Deploying with Terraform"
# terraform --version
