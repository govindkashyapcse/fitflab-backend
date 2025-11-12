# token = "your_encoded_jwt_string" # Replace with an actual JWT
# secret_key = "your-secret-key"
# algorithm = "HS256"

# try:
#     decoded_payload = jwt.decode(token, secret_key, algorithms=[algorithm])
#     print(decoded_payload)
# except jwt.ExpiredSignatureError:
#     print("Token has expired.")
# except jwt.InvalidTokenError:
#     print("Invalid token.")
    
# encoded = jwt.encode({"some": "payload"}, "secret", algorithm="HS256")
# print(encoded)
# """eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb21lIjoicGF5bG9hZCJ9.4twFt5NiznN84AWoo1d7KO1T_yoc0Z6XOpOVswacPZg"""
# jwt.decode(encoded, "secret", algorithms=["HS256"])
# {'some': 'payload'}