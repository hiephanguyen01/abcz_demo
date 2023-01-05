# abcz_demo
# Steps for SSL cert generation (in 3 steps):
1. Generate a private key. 
- openssl genrsa -out key.pem  
2. Create a CSR (certificate signing request) using private key. 
- openssl req -new -key key.pem -out csr.pem  
3. Generate the SSL certificate from CSR.
- openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

