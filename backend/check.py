import google.generativeai as genai
import os
from dotenv import load_dotenv

# Charge les variables d'environnement
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Erreur : Clé API non trouvée.")
else:
    genai.configure(api_key=api_key)
    
    print("Liste des modèles disponibles pour generateContent :")
    print("--------------------------------------------------")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Erreur lors de la connexion : {e}")