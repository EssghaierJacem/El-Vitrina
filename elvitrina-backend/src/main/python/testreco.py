import requests

url = "http://localhost:8080/recommend"

# Simuler une requête avec user_id=1
payload = {
    "user_id": 1
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
