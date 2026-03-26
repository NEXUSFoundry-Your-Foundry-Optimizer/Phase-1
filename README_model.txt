# LSTM-AE Model for Melting Twin
========================================

Model Information:
- Model Type: LSTM Autoencoder
- Input Shape: (30, 6)  # 30 timesteps × 6 sensors
- Total Parameters: 181,254
- Anomaly Threshold: 0.873302
- Detection Rate: 99.6%
- False Positive Rate: 5.1%

Features Order (6 sensors):
1. melt_temp (°C)
2. power_kw (kW)
3. vibration_g (g)
4. lining_health (0-1)
5. humidity (%)
6. ambient_temp (°C)

Usage in Melting Twin:
------------------------------------------------
from tensorflow.keras.models import load_model
import joblib
import numpy as np

# Load model and files
model = load_model('lstm_ae_model.h5')
scaler = joblib.load('scaler.pkl')
threshold = np.load('anomaly_threshold.npy')

# Detect anomaly
window = np.array(sensor_window)  # Shape: (30, 6)
window_scaled = scaler.transform(window)
window_input = window_scaled.reshape(1, 30, 6)
reconstructed = model.predict(window_input, verbose=0)
error = np.mean(np.square(window_input - reconstructed))
is_anomaly = error > threshold
