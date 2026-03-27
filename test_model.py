import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

tf.get_logger().setLevel('ERROR')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

model = load_model('lstm_ae_model.h5', compile=False)
scaler = joblib.load('scaler.pkl')
threshold = float(np.load('anomaly_threshold.npy'))

print("Threshold:", threshold)

df = pd.read_csv('foundry_test_dataset.csv', nrows=100)
features = ['melt_temp', 'power_kw', 'vibration_g', 'lining_health', 'humidity', 'ambient_temp']
scaled_data = scaler.transform(df[features])

def build_sequence(data, seq_length=30):
    windows = []
    for i in range(len(data) - seq_length + 1):
        windows.append(data[i:i+seq_length])
    return np.array(windows)

real_seq = build_sequence(scaled_data, 30)
reconstructed = model.predict(real_seq, verbose=0)
mse_real = np.mean(np.square(real_seq - reconstructed), axis=(1,2))
with open('test_results.txt', 'w') as f:
    f.write(f'Threshold: {threshold}\n')
    f.write(f'Real Rolling Window MSE (f5): {mse_real[:5]}\n')
    f.write(f'Duplicated Single Row MSE: {mse_dummy}\n')

