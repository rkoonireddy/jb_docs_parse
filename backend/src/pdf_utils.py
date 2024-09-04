import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from typing import Dict, List
from PyPDF2 import PdfReader

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from a PDF file.

    Args:
        pdf_content (bytes): The PDF file content in bytes.

    Returns:
        str: The extracted text from the PDF.
    """
    text = ""
    with io.BytesIO(pdf_content) as pdf_stream:
        reader = PdfReader(pdf_stream)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text


def generate_contract_pdf(data: Dict, translations: Dict) -> bytes:
    """Generate a PDF contract based on the provided data and translations.

    Args:
        data (Dict): The contract data.
        translations (Dict): Translations for the contract fields.

    Returns:
        bytes: The generated PDF as bytes.
    """
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Example content (you would generate content based on `data`)
    p.drawString(72, height - 100, f"{translations['contractType']}: {data['contractType']}")
    p.drawString(72, height - 120, f"{translations['name']}: {data['name']}")
    p.drawString(72, height - 140, f"{translations['address']}: {data['address']}")
    p.drawString(72, height - 160, f"{translations['country']}: {data['country']}")
    p.drawString(72, height - 180, f"{translations['language']}: {data['language']}")
    p.drawString(72, height - 200, f"{translations['specialInput']}: {data['specialInput']}")

    if data['contractType'] == 'mortgage':
        p.drawString(72, height - 220, f"{translations['amount']}: {data['amount']}")
        p.drawString(72, height - 240, f"{translations['duration']}: {data['duration']} months")
    elif data['contractType'] == 'loan':
        p.drawString(72, height - 220, f"{translations['interestRate']}: {data['interestRate']}%")
    elif data['contractType'] == 'lease':
        p.drawString(72, height - 220, f"{translations['monthlyRent']}: {data['monthlyRent']}")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer.read()
