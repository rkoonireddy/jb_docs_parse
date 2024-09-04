# src/minio_client.py

from minio import Minio
import os
from dotenv import load_dotenv

load_dotenv()

# MinIO configuration
bucket_name = "bjb"

minio_client = Minio(
    "localhost:9000",
    access_key=os.getenv('MINIO_ACCESS_KEY'),
    secret_key=os.getenv('MINIO_SECRET_KEY'),
    secure=False
)

def check_bucket():
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
