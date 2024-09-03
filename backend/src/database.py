db = {
    "pdfs": {},  # Store PDFs with unique IDs
    "clients": [
        {"id": "1", "name": "Client A"},
        {"id": "2", "name": "Client B"},
        {"id": "3", "name": "Client C"}
    ]  # Example clients
}

def add_pdf(pdf_id: str, pdf_content: bytes):
    db["pdfs"][pdf_id] = pdf_content

def get_pdf(pdf_id: str):
    return db["pdfs"].get(pdf_id, None)

def get_clients():
    return db["clients"]