from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import logging
import pandas as pd

try:
    import numpy as np
    import joblib
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("Warning: ML dependencies not found. Please install requirements.")

app = FastAPI(title="NEXUS-Foundry Melting Twin Backend")

# Global dataset variable
dataset = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model variables
model = None
scaler = None
threshold = 0.779624

# For simulation we need 30 timesteps. We'll duplicate the single input 30 times 
# to represent a stable state, since it's a "what-if" static prediction.
SEQUENCE_LENGTH = 30 
NUM_FEATURES = 6

@app.on_event("startup")
async def load_ml_models():
    global model, scaler, threshold
    if not ML_AVAILABLE:
        logger.warning("ML libraries missing. Running in mock mode.")
        return

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, 'lstm_ae_model.h5')
    scaler_path = os.path.join(base_dir, 'scaler.pkl')
    threshold_path = os.path.join(base_dir, 'anomaly_threshold.npy')

    # Load Model & Scaler
    try:
        # We use compile=False to avoid deserialization issues with custom metrics
        # since we only need the model for inference.
        model = load_model(model_path, compile=False)
        scaler = joblib.load(scaler_path)
        logger.info("LSTM-AE Model (inference-only) and Scaler loaded successfully.")
        
        if os.path.exists(threshold_path):
            threshold = float(np.load(threshold_path))
            logger.info(f"Loaded threshold: {threshold}")
        else:
            logger.info(f"Using default threshold: {threshold}")
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")

    # Load Dataset for Streaming
    try:
        dataset_path = os.path.join(base_dir, 'combined_dataset_validation.csv')
        if os.path.exists(dataset_path):
            global dataset
            # Load only a subset to be safe with memory
            dataset = pd.read_csv(dataset_path).head(1000)
            logger.info(f"Loaded {len(dataset)} rows from validation dataset for streaming.")
        else:
            logger.warning(f"Validation dataset not found at: {dataset_path}")
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")


class SimulationInput(BaseModel):
    temp: float
    power: float
    vibration: float
    lining: float

@app.post("/api/simulate")
async def simulate_what_if(data: SimulationInput):
    if not ML_AVAILABLE or model is None or scaler is None:
        # Mock Response
        fake_error = 1.25 if data.temp > 1430 or data.lining < 65 else 0.45
        return {
            "error": fake_error,
            "threshold": threshold,
            "status": "anomaly" if fake_error > threshold else "normal"
        }

    try:
        # 1. melt_temp, 2. power_kw, 3. vibration_g, 4. lining_health, 5. humidity, 6. ambient_temp
        # Humidity and Ambient temp are kept constant at averages (e.g. 45%, 35°C)
        single_reading = [data.temp, data.power, data.vibration, data.lining, 45.0, 35.0]
        
        # Create a stable sequence of 30 timesteps
        window = np.array([single_reading for _ in range(SEQUENCE_LENGTH)])
        
        # Scale the window
        window_scaled = scaler.transform(window)
        window_input = window_scaled.reshape(1, SEQUENCE_LENGTH, NUM_FEATURES)
        
        # Predict using LSTM-AE
        reconstructed = model.predict(window_input, verbose=0)
        
        # Calculate reconstruction error (MSE)
        error = np.mean(np.square(window_input - reconstructed))
        
        # Determine status
        status = "anomaly" if error > threshold else "normal"
        
        return {
            "error": float(error),
            "threshold": float(threshold),
            "status": status
        }
        
    except Exception as e:
        logger.error(f"Simulation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dataset/row/{index}")
async def get_dataset_row(index: int):
    global dataset, model, scaler, threshold
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not loaded")
    
    if index < 0 or index >= len(dataset):
        raise HTTPException(status_code=400, detail="Index out of range")
    
    row = dataset.iloc[index].to_dict()
    
    # Run inference automatically for this row
    try:
        # features: 1. melt_temp, 2. power_kw, 3. vibration_g, 4. lining_health, 5. humidity, 6. ambient_temp
        single_reading = [
            row['melt_temp'], 
            row['power_kw'], 
            row['vibration_g'], 
            row['lining_health'], 
            row['humidity'], 
            row['ambient_temp']
        ]
        
        # Build sequence of 30 duplicate readings for static analysis of this row
        window = np.array([single_reading for _ in range(SEQUENCE_LENGTH)])
        window_scaled = scaler.transform(window)
        window_input = window_scaled.reshape(1, SEQUENCE_LENGTH, NUM_FEATURES)
        
        reconstructed = model.predict(window_input, verbose=0)
        error = np.mean(np.square(window_input - reconstructed))
        status = "anomaly" if error > threshold else "normal"
        
        return {
            "row": row,
            "error": float(error),
            "threshold": float(threshold),
            "status": status
        }
    except Exception as e:
        return {
            "row": row,
            "error": 0.0,
            "status": "error",
            "message": str(e)
        }


@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Client connected to live telemetry stream")
    try:
        while True:
            # Placeholder for actual telemetry consumption (e.g. MQTT/Kafka)
            data = await websocket.receive_text()
            await websocket.send_text(f"Received: {data}")
    except Exception as e:
        logger.info(f"Client disconnected: {str(e)}")

# To run: uvicorn main:app --reload --port 8000
