
$pfxFile = "C:\Users\pxiong\OneDrive - ConvergeOne\Apps\c1snaplogic_convergeone_com\2024_to_2025.c1snaplogic_convergeone_com.pfx"
$privateKeyFile = "C:\Users\pxiong\OneDrive - ConvergeOne\Apps\c1snaplogic_convergeone_com\snap_private.key"
$password = "FbQTxfNTAGloL7Kws3r!2"
$certificateFile = "C:\Users\pxiong\OneDrive - ConvergeOne\Apps\c1snaplogic_convergeone_com\snap_public.key"

openssl pkcs12 -in $pfxFile -nocerts -out $privateKeyFile -password pass:$password

openssl pkcs12 -in $pfxFile -clcerts -nokeys -out $certificateFile -password pass:$password