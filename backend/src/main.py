from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import add_pdf, get_pdf, get_clients
from .utils import extract_text_from_pdf

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
