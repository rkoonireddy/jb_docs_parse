# src/models.py

from pydantic import BaseModel
from typing import List, Dict
from pydantic import BaseModel
from typing import List, Optional

class ContractFormData(BaseModel):
    contractType: str
    name: str
    address: str
    amount: Optional[float] = None
    duration: Optional[int] = None
    country: str
    language: str
    specialInput: str
    interestRate: Optional[float] = None
    monthlyRent: Optional[float] = None
    selectedDocuments: List[str]  # Add this line to include selectedDocuments


class LegalText(BaseModel):
    id: int
    title: str
    url: str
    iconUrl: str
