from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

class GreetingRequest(BaseModel):
    name: str

@app.post("/greetings")
def greet(body: GreetingRequest) -> dict:
    return {"greeting": f"Hello, {body.name}!"}
