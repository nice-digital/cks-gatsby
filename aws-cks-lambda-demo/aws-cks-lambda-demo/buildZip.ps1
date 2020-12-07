Push-Location $PSScriptRoot
 
dotnet publish -c Release -r linux-x64 . /p:GenerateRuntimeConfigurationFiles=true
 
Push-Location .\bin\Release\netcoreapp3.1\linux-x64\publish\
Compress-Archive -Path * -CompressionLevel Fastest -DestinationPath $PSScriptRoot\lambda_function.zip -Force
Pop-Location
