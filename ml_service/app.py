from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
from transformers import AutoTokenizer, AutoModelForSeq2SeqGeneration, pipeline
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI setup
app = FastAPI(title="AI Classroom ML Service")

# Add CORS middleware with environment variable
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and tokenizer
model = None
tokenizer = None
qg_pipeline = None

# Initialize model at startup
@app.on_event("startup")
async def load_model():
    global model, tokenizer, qg_pipeline
    logger.info("Loading NLP model...")
    model_name = "valhalla/t5-base-qg-hl"
    
    # Load tokenizer and model with smaller configuration
    tokenizer = AutoTokenizer.from_pretrained(model_name, model_max_length=512)
    model = AutoModelForSeq2SeqGeneration.from_pretrained(
        model_name,
        torch_dtype="auto",
        low_cpu_mem_usage=True,
        device_map="auto"
    )
    
    qg_pipeline = pipeline(
        "text2text-generation",
        model=model,
        tokenizer=tokenizer,
        device=-1  # Force CPU usage
    )
    logger.info("Model loaded successfully")

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        logger.info(f"Successfully extracted {len(text)} characters from PDF")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise

# Health check endpoint
@app.get("/")
async def read_root():
    return {"status": "healthy", "message": "ML Service is running"}

# @app.post("/upload")
# async def upload_pdf(pdf_file: UploadFile = File(...)):
#     try:
#         logger.info(f"Received file: {pdf_file.filename}")
        
#         # Save uploaded file
#         pdf_path = "uploaded.pdf"
#         with open(pdf_path, "wb") as buffer:
#             content = await pdf_file.read()
#             buffer.write(content)
#         logger.info("File saved successfully")
        
#         # Process the PDF
#         text = extract_text_from_pdf(pdf_path)
#         logger.info(f"Extracted text length: {len(text)}")
        
#         # Generate a single question using the qg_pipeline
#         logger.info("Generating question...")
#         question = qg_pipeline(text, max_length=128, num_return_sequences=1)[0]['generated_text']
#         logger.info(f"Generated question: {question}")
        
#         # Clean up
#         if os.path.exists(pdf_path):
#             os.remove(pdf_path)
#             logger.info("Temporary PDF file removed")
        
#         # Add more detailed response
#         response_data = {
#             "question": question,
#             "status": "success",
#             "text_length": len(text)
#         }
        
#         logger.info(f"Sending response: {response_data}")
#         return JSONResponse(response_data)
        
#     except Exception as e:
#         logger.error(f"Error processing PDF: {str(e)}")
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "error": str(e),
#                 "status": "error"
#             }
#         )


@app.post("/upload")
async def upload_pdf(pdf_file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {pdf_file.filename}")
        
        # Save uploaded file
        pdf_path = "uploaded.pdf"
        with open(pdf_path, "wb") as buffer:
            content = await pdf_file.read()
            buffer.write(content)
        
        # Process the PDF
        text = extract_text_from_pdf(pdf_path)
        
        # Split text into chunks
        sentences = text.split('.')
        chunks = ['. '.join(sentences[i:i+3]) for i in range(0, len(sentences), 3)]
        
        # Generate diverse questions
        questions = []
        for chunk in chunks[:5]:
            # Add question prefix to force question generation
            input_text = f"generate question: {chunk}"
            result = qg_pipeline(
                input_text,
                max_length=128,
                num_return_sequences=1,
                num_beams=5,
                temperature=0.7,
                top_k=50,
                top_p=0.95,
                do_sample=True,
                early_stopping=True
            )
            if result and len(result) > 0:
                question = result[0]['generated_text']
                # Ensure the output is a question
                if not question.endswith('?'):
                    question += '?'
                if not any(question.startswith(w) for w in ['What', 'How', 'Why', 'When', 'Where', 'Who', 'Which']):
                    question = f"What is meant by: {question}"
                questions.append(question)
            if len(questions) >= 5:
                break
        
        # Clean up
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        
        response_data = {
            "questions": questions[:5],
            "status": "success"
        }
        
        return JSONResponse(response_data)
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

# Run the app
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)


