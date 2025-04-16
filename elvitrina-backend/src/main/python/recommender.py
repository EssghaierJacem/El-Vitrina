from flask import Flask, request, jsonify
import mysql.connector
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)  # <== Correction ici
model = SentenceTransformer("all-MiniLM-L6-v2")

MYSQL_CONFIG = {
    'host': 'localhost', #change ca avec ta base de donne
    'user': 'root',
    'password': '0000',
    'database': 'elvitrina'
}

@app.route('/recommend', methods=['POST'])
def recommend_products():
    data = request.json
    responses = data['responses']  # Récupère la liste des réponses utilisateur

    # Crée une phrase avec les réponses utilisateur
    user_text = " ".join(responses)  # On concatène toutes les réponses
    user_embedding = model.encode(user_text).reshape(1, -1)

    # Connexion à MySQL
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, description FROM products")
    products = cursor.fetchall()

    results = []
    for product in products:
        full_text = f"{product['name']}. {product['description']}"
        product_embedding = model.encode(full_text).reshape(1, -1)
        score = cosine_similarity(user_embedding, product_embedding)[0][0]
        results.append((product, score))

    top = sorted(results, key=lambda x: x[1], reverse=True)[:5]

    cursor.close()
    conn.close()

    # Retour des résultats sous forme JSON
    recommendations = [
        {"name": prod['name'], "description": prod['description'], "score": round(score, 3)}
        for prod, score in top
    ]
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
