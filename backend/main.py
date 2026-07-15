from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "TritonBudget API is running"}