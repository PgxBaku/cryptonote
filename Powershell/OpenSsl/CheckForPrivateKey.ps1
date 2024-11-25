$pfxFile = "C:\Users\pxiong\OneDrive - ConvergeOne\Apps\c1snaplogic_convergeone_com\2024_to_2025.c1snaplogic_convergeone_com.pfx"

Get-ChildItem -path cert:$pfxFile | Where-Object {$_.HasPrivateKey -eq $true}