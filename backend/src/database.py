# src/database.py

# In-memory database
db = {
    "pdfs": {},  # Store PDFs with unique IDs
}

def add_pdf(pdf_id: str, pdf_content: bytes):
    db["pdfs"][pdf_id] = pdf_content

def get_pdf(pdf_id: str):
    return db["pdfs"].get(pdf_id, None)
