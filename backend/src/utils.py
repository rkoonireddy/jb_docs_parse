# src/utils.py

from PyPDF2 import PdfFileReader
from io import BytesIO

def extract_text_from_pdf(pdf_content: bytes) -> str:
    text = ""
    pdf_file = BytesIO(pdf_content)
    pdf_reader = PdfFileReader(pdf_file)
    for page_num in range(pdf_reader.numPages):
        page = pdf_reader.getPage(page_num)
        text += page.extract_text()
    return text
