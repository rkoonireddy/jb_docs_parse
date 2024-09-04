# src/database.py

from typing import List, Dict

# Dummy implementations for example purposes
pdf_storage = {}
client_list = []

def add_pdf(pdf_id: str, pdf_content: bytes):
    pdf_storage[pdf_id] = pdf_content

def get_pdf(pdf_id: str) -> bytes:
    return pdf_storage.get(pdf_id, None)

def get_clients() -> List[Dict]:
    return client_list
