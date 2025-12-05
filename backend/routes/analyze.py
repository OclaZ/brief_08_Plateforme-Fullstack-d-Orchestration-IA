
from fastapi import APIRouter , HTTPException, status
from dotenv import load_dotenv
import os
import requests
import httpx
from schemas.schemas import AnalyzeRequest, AnalyzeResponse , ErrorResponse
import google.generativeai as genai

load_dotenv()

router = APIRouter(tags=["Analyze"])
API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli"
HF_TOKEN = os.getenv("HF_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TIMEOUT=30

genai.configure(api_key=GEMINI_API_KEY)

def validate_api_key() -> str:
    if not HF_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clé API Hugging Face non configurée. Veuillez configurer HF_TOKEN dans le fichier .env"
        )
    return  HF_TOKEN

def query_huggingface_api(payload: dict) -> dict:
    apikey = validate_api_key()
    headers = {
        "Authorization": f"Bearer {apikey}",
        'Content-Type': 'application/json'
    }   
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            response = client.post(API_URL, headers=headers, json=payload)

            # Error handling logic (kept from your snippet)
            if response.status_code == 401:
                raise HTTPException(status_code=503, detail="Clé API Hugging Face invalide")
            elif response.status_code == 503:
                raise HTTPException(status_code=503, detail="Modèle en chargement")
            elif response.status_code >= 500:
                raise HTTPException(status_code=503, detail="Erreur serveur HF")

            response.raise_for_status()
            result = response.json()
            
            # Hugging Face usually returns a list/dict structure depending on the task
            return result

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout Hugging Face")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Erreur API: {str(e)}")
    
def query_gemini(text: str, category: str):
    try:
        model = genai.GenerativeModel('gemini-2.5-pro')
        prompt = f"""
        Role: Media Analyst.
        Context: An article classified as '{category}'.
        Input Text: "{text}"
        
        Task:
        1. Summarize the text in 2 sentences max.
        2. Detect the sentiment (Positive, Negative, or Neutral).
        
        Output format:
        SENTIMENT: [One Word]
        SUMMARY: [Text]
        """
        response = model.generate_content(prompt)
        content = response.text
        
        # Basic parsing
        sentiment = "Neutral"
        summary = "No summary generated."
        
        for line in content.split('\n'):
            if "SENTIMENT:" in line:
                sentiment = line.replace("SENTIMENT:", "").strip()
            if "SUMMARY:" in line:
                summary = line.replace("SUMMARY:", "").strip()
                
        return summary, sentiment
    except Exception as e:
        # Fallback if Gemini fails so the whole app doesn't crash
        return f"Error: {str(e)}", "Neutral"



@router.post("/analyze",response_model=AnalyzeResponse ,responses={
        400: {"model": ErrorResponse, "description": "Requête invalide"},
        401: {"model": ErrorResponse, "description": "Token invalide ou expiré"},
        500: {"model": ErrorResponse, "description": "Clé API Hugging Face non configurée"},
        503: {"model": ErrorResponse, "description": "Service Hugging Face non disponible"},
        504: {"model": ErrorResponse, "description": "Timeout lors de l'appel à l'API Hugging Face"}
    },
)
async def analyze_article(request: AnalyzeRequest):

    candidate_labels = [
    
    "Finance", 
    "Human Resources", 
    "IT", 
    "Operations", 
    "Marketing", 
    "Legal", 
    "Politics",
    "Healthcare",
    "Education",
    "Real Estate",
    "Manufacturing",
    "Technology",
    "Economics",
    "Other"
]
    # 2. Prepare Payload for Hugging Face
    hf_payload = {
        "inputs": request.text,
        "parameters": {
            "candidate_labels": candidate_labels,
            "multi_label": False 
        }
    }
    
    # 3. Call Hugging Face
    hf_response = query_huggingface_api(hf_payload)
    print(f"DEBUG HF RESPONSE: {hf_response}")
    
    try:
        # On récupère le premier élément de la liste (le résultat le plus probable)
        response_data = hf_response[0] if isinstance(hf_response, list) else hf_response

        # DEBUG : Affichez ceci pour être sûr de ce que le modèle renvoie comme catégorie
        # Si vous voyez "Entailment" ou "Contradiction", le paramétrage Zero-Shot a échoué.
        # Si vous voyez "Finance" ou "IT", c'est parfait.
        print(f"DEBUG: Label reçu: {response_data.get('label')}, Score: {response_data.get('score')}")

        # ADAPTATION : L'API renvoie parfois 'label'/'score' (singulier) au lieu de 'labels'/'scores' (pluriel)
        if "label" in response_data:
            best_category = response_data["label"]
            best_score = response_data["score"]
        elif "labels" in response_data:
            best_category = response_data["labels"][0]
            best_score = response_data["scores"][0]
        else:
             raise KeyError("Aucune clé 'label' ou 'labels' trouvée")

    except (KeyError, IndexError, TypeError) as e:
        print(f"DEBUG FULL RESPONSE: {hf_response}")
        raise HTTPException(status_code=500, detail=f"Erreur d'extraction des données HF: {str(e)}")

    # 5. Call Gemini for Summary & Tone
    summary, sentiment = query_gemini(request.text, best_category)

    # 6. Return JSON
    return AnalyzeResponse(
        category=best_category,
        confidence_score=best_score,
        summary=summary,
        sentiment=sentiment
    )