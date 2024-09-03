from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from minio import Minio
from minio.error import S3Error
from .database import add_pdf, get_pdf, get_clients
from .utils import extract_text_from_pdf
import sys
import os
import io
from dotenv import load_dotenv
load_dotenv()



sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()

# Configure CORS
orig_origins = [
    "http://localhost:3000",  # Add your frontend origin here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orig_origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()

# Configure CORS
orig_origins = [
    "http://localhost:3000",  # Add your frontend origin here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orig_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractFormData(BaseModel):
    contractType: str
    name: str
    address: str
    amount: float = None
    duration: int = None
    country: str
    language: str
    specialInput: str
    interestRate: float = None
    monthlyRent: float = None

@app.post("/generate-contract/")
async def generate_contract(data: ContractFormData):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    translations = {
        "English": {
            "contractType": "Contract Type",
            "name": "Name",
            "address": "Address",
            "country": "Country",
            "language": "Language",
            "specialInput": "Special Input",
            "amount": "Amount",
            "duration": "Duration (months)",
            "interestRate": "Interest Rate (%)",
            "monthlyRent": "Monthly Rent",
        },
        "French": {
            "contractType": "Type de contrat",
            "name": "Nom",
            "address": "Adresse",
            "country": "Pays",
            "language": "Langue",
            "specialInput": "Entrée spéciale",
            "amount": "Montant",
            "duration": "Durée (mois)",
            "interestRate": "Taux d'intérêt (%)",
            "monthlyRent": "Loyer mensuel",
        },
        "German": {
            "contractType": "Vertragstyp",
            "name": "Name",
            "address": "Adresse",
            "country": "Land",
            "language": "Sprache",
            "specialInput": "Besondere Eingabe",
            "amount": "Betrag",
            "duration": "Dauer (Monate)",
            "interestRate": "Zinssatz (%)",
            "monthlyRent": "Monatsmiete",
        },
        "Spanish": {
            "contractType": "Tipo de contrato",
            "name": "Nombre",
            "address": "Dirección",
            "country": "País",
            "language": "Idioma",
            "specialInput": "Entrada especial",
            "amount": "Cantidad",
            "duration": "Duración (meses)",
            "interestRate": "Tasa de interés (%)",
            "monthlyRent": "Renta mensual",
        },
        "Italian": {
            "contractType": "Tipo di contratto",
            "name": "Nome",
            "address": "Indirizzo",
            "country": "Paese",
            "language": "Lingua",
            "specialInput": "Input speciale",
            "amount": "Importo",
            "duration": "Durata (mesi)",
            "interestRate": "Tasso d'interesse (%)",
            "monthlyRent": "Affitto mensile",
        }
    }

    translation = translations.get(data.language, translations["English"])

    p.drawString(72, height - 100, f"{translation['contractType']}: {data.contractType}")
    p.drawString(72, height - 120, f"{translation['name']}: {data.name}")
    p.drawString(72, height - 140, f"{translation['address']}: {data.address}")
    p.drawString(72, height - 160, f"{translation['country']}: {data.country}")
    p.drawString(72, height - 180, f"{translation['language']}: {data.language}")
    p.drawString(72, height - 200, f"{translation['specialInput']}: {data.specialInput}")

    if data.contractType == 'mortgage':
        p.drawString(72, height - 220, f"{translation['amount']}: {data.amount}")
        p.drawString(72, height - 240, f"{translation['duration']}: {data.duration} months")
    elif data.contractType == 'loan':
        p.drawString(72, height - 220, f"{translation['interestRate']}: {data.interestRate}%")
    elif data.contractType == 'lease':
        p.drawString(72, height - 220, f"{translation['monthlyRent']}: {data.monthlyRent}")

    p.showPage()
    p.save()

    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=contract.pdf"})


#change bucket name
bucket_name = "bjb"
minio_access_key = os.getenv('MINIO_ACCESS_KEY')
minio_secret_key = os.getenv('MINIO_SECRET_KEY')

# MinIO client
minio_client = Minio(
    "localhost:9000",  # MinIO server endpoint
    access_key = minio_access_key,
    secret_key= minio_secret_key,
    secure=False  # Set to True if using HTTPS
)


@app.post("/upload-document/")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Check if the bucket exists, create it if it doesn't
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)

        # Read file data and convert it to a file-like object
        file_data = await file.read()
        file_data_stream = io.BytesIO(file_data)

        # Upload file to MinIO
        minio_client.put_object(bucket_name, file.filename, file_data_stream, len(file_data))
        return {"message": "File uploaded successfully"}
    except S3Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/upload-pdf/")
async def upload_pdf(pdf_id: str, file: UploadFile = File(...)):
    if get_pdf(pdf_id) is not None:
        raise HTTPException(status_code=400, detail="PDF with this ID already exists.")
    pdf_content = await file.read()
    add_pdf(pdf_id, pdf_content)
    return {"message": "PDF uploaded successfully", "pdf_id": pdf_id}

@app.get("/retrieve-pdf/{pdf_id}")
async def retrieve_pdf(pdf_id: str):
    pdf_content = get_pdf(pdf_id)
    if pdf_content is None:
        raise HTTPException(status_code=404, detail="PDF not found.")
    text = extract_text_from_pdf(pdf_content)
    return {"pdf_id": pdf_id, "text": text}

@app.get("/clients")
async def list_clients():
    clients = get_clients()
    return {"data": clients}

@app.get("/")
async def root():
    return {"message": "Welcome to the PDF Processing API"}
