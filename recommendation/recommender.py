from flask import Flask, request, jsonify
from flask_cors import CORS;
import mysql.connector
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
model = SentenceTransformer("all-MiniLM-L6-v2")
CORS(app)
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'elvitrina'
}

@app.route('/recommend', methods=['POST'])
def recommend_products():
    data = request.json
    user_id = data['user_id']

    # Connexion MySQL
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor(dictionary=True)

    # Récupération des réponses utilisateur
    cursor.execute("SELECT reponse_user FROM quiz WHERE user_id = %s", (user_id,))
    reponses = cursor.fetchall()

    if not reponses:
        return jsonify({"error": "No quiz answers found for user"}), 404

    user_text = " ".join([r['reponse_user'] for r in reponses if r['reponse_user']])
    user_embedding = model.encode(user_text).reshape(1, -1)

    # Récupération des produits
    cursor.execute("SELECT product_id, product_name, description FROM product")
    products = cursor.fetchall()

    results = []
    for product in products:
        full_text = f"{product['product_name']}. {product['description']}"
        product_embedding = model.encode(full_text).reshape(1, -1)
        score = cosine_similarity(user_embedding, product_embedding)[0][0]
        results.append((product, score))

    top = sorted(results, key=lambda x: x[1], reverse=True)[:5]

    cursor.close()
    conn.close()

    recommendations = [
        {
            "name": prod['product_name'],
            "description": prod['description'],
            "score": round(float(score), 3)  # Correction ici
        }
        for prod, score in top
    ]

    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
