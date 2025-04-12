# chatapi.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from healthcarechatbot import chatbot
from labagent import load_lab_chain 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    name: str
    age: int
    medical_history: str
    query: str

@app.post("/chat/")
async def chat(request: ChatRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query is required.")

    formatted_input = (
        f"name-{request.name}, "
        f"age-{request.age}, "
        f"medicalhistory-{request.medical_history}, "
        f"message-{request.query}"
    )

    response = chatbot.invoke({"input": formatted_input})
    return {"response": response['output']}


@app.post("/upload_lab/")
async def upload_lab(file: UploadFile = File(...)):
    file_path = f"uploaded_files/{file.filename}"
    os.makedirs("uploaded_files", exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        load_lab_chain(file_path)  
        return {"message": "Lab file uploaded and indexed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
