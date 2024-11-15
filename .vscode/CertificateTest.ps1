# $Certificate=New-SelfSignedCertificate –Subject testing.com -CertStoreLocation Cert:\CurrentUser\My 
Set-ExecutionPolicy RemoteSigned
$Certificate

# Export-Certificate -Cert $Certificate -FilePath "C:\$certname.cer" 

# Get-ChildItem -Path cert:\CurrentUser\my | Export-Certificate -FilePath c:\certs\allcerts.sst  

