# src/main.py

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from src.database import add_pdf, get_pdf
from src.models import PdfUploadRequest
from src.utils import extract_text_from_pdf

app = FastAPI()

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

@app.get("/")
async def root():
    return {"message": "Welcome to the PDF Processing API"}
