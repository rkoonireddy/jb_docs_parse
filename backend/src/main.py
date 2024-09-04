from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from src.models import ContractFormData, LegalText
from src.pdf_utils import generate_contract_pdf, extract_text_from_pdf
from src.minio_client import minio_client, check_bucket
from src.database import add_pdf, get_pdf, get_clients
from typing import List
import uuid
import io
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
orig_origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orig_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from src.models import ContractFormData, LegalText
from src.pdf_utils import generate_contract_pdf
from src.minio_client import minio_client, check_bucket
from src.database import add_pdf, get_pdf, get_clients
from typing import List
import uuid
import io
from dotenv import load_dotenv
import aiofiles

load_dotenv()

app = FastAPI()

# Configure CORS
orig_origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orig_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import logging

logging.basicConfig(level=logging.INFO)

@app.post("/generate-contract/")
async def generate_contract(data: ContractFormData):
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
        # Add other languages here
    }

    translation = translations.get(data.language, translations["English"])

    document_texts = []
    for doc_id in data.selectedDocuments:
        try:
            key = f"{doc_id}.pdf"
            logging.info(f"Fetching document: {key}")
            response = minio_client.get_object("bjb", key)
            pdf_content = response.read()
            # logging.info({pdf_content})
            text = extract_text_from_pdf(pdf_content)
            logging.info({text})
            document_texts.append(text)
        except Exception as e:
            logging.error(f"Error retrieving document {doc_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error retrieving document {doc_id}: {str(e)}")

    combined_text = " ".join(document_texts)
    logging.info({combined_text})

    contract_data = {
        "contractType": data.contractType,
        "name": data.name,
        "address": data.address,
        "amount": data.amount,
        "duration": data.duration,
        "country": data.country,
        "language": data.language,
        "specialInput": data.specialInput,
        "interestRate": data.interestRate,
        "monthlyRent": data.monthlyRent,
        "combinedText": combined_text
    }
    
    pdf_content = generate_contract_pdf(contract_data, translation)

    buffer = io.BytesIO(pdf_content)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=contract.pdf"})

@app.post("/upload-document/")
async def upload_document(file: UploadFile = File(...)):
    check_bucket()  # Ensure the bucket exists

    # Generate a unique ID for the document
    unique_id = str(uuid.uuid4())
    
    # Define the document ID based on the file name (you may need to sanitize the file name)
    document_id = file.filename
    
    # Define metadata
    metadata = {
        "x-amz-meta-document-id": unique_id,
        "x-amz-meta-filename": document_id,
        "x-amz-meta-content-type": file.content_type,
    }

    # Read file data and convert it to a file-like object
    file_data = await file.read()
    file_data_stream = io.BytesIO(file_data)

    # Upload file to MinIO using the document name as the object name and metadata with unique ID
    try:
        minio_client.put_object(
            "bjb",
            document_id, #this is the key
            file_data_stream,
            len(file_data),
            content_type=file.content_type,
            metadata=metadata
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "File uploaded successfully", "document_id": unique_id}

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

@app.get("/legal-texts", response_model=List[LegalText])
async def get_legal_texts():
    try:
        objects = minio_client.list_objects("bjb")
        legal_texts = []
        for idx, obj in enumerate(objects):
            title = obj.object_name.split('/')[-1].split('.')[0]
            url = f"http://localhost:9000/bjb/{obj.object_name}"
            icon_url = url + "-icon.png"

            legal_texts.append({
                "id": idx,
                "title": title,
                "url": url,
                "iconUrl": icon_url
            })

        return legal_texts
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Welcome to the BJB Contract Generation backend."}
