# src/models.py

from pydantic import BaseModel

class PdfUploadRequest(BaseModel):
    pdf_id: str
