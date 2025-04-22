import mysql.connector
from mysql.connector import Error

try:
    # Connexion à la base de données
    connection = mysql.connector.connect(
        host='localhost',
        database='elvitrina',
        user='root',
        password='0000'
    )

    if connection.is_connected():
        db_info = connection.get_server_info()
        print(f"✅ Connexion réussie à MySQL version {db_info}")
        
        # Création du curseur pour exécuter des requêtes
        cursor = connection.cursor()
        
        # Exécution de la requête pour obtenir la base de données active
        cursor.execute("SELECT DATABASE();")
        record = cursor.fetchone()
        print(f"📦 Base de données active : {record[0]}")
        
        # Ajout de la requête pour récupérer les réponses de l'utilisateur
        user_id = 1  # Remplacez par l'ID de l'utilisateur pour lequel vous voulez récupérer les réponses
        cursor.execute("SELECT reponse_user FROM quiz WHERE user_id = %s", (user_id,))
        
        # Récupération et affichage des résultats
        reponses = cursor.fetchall()
        print("📝 Réponses utilisateur :")
        for reponse in reponses:
            print(reponse)
        
        # Ajout de la requête pour récupérer les produits
        cursor.execute("SELECT product_id, product_name, description FROM product")
        products = cursor.fetchall()
        
        # Affichage des produits récupérés
        print("\n🛍️ Produits disponibles :")
        for product in products:
            print(f"ID: {product[0]}, Nom: {product[1]}, Description: {product[2]}")

except Error as e:
    print(f"❌ Erreur de connexion à MySQL : {e}")

finally:
    if 'connection' in locals() and connection.is_connected():
        cursor.close()
        connection.close()
        print("🔒 Connexion MySQL fermée")
