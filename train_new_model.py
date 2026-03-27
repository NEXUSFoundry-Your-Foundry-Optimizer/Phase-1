import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os

# Filter only Normal rows for training
df = pd.read_csv('foundry_test_dataset.csv')
normal_df = df[df['label'] == 0]
anomaly_df = df[df['label'] == 1]

features = ['melt_temp', 'power_kw', 'vibration_g', 'lining_health', 'humidity', 'ambient_temp']
normal_data = normal_df[features].values
anomaly_data = anomaly_df[features].values

# 1. Train Scaler on Normal Data
scaler = StandardScaler()
normal_scaled = scaler.fit_transform(normal_data)
anomaly_scaled = scaler.transform(anomaly_data)

# Save the new scaler
joblib.dump(scaler, 'scaler.pkl')

SEQ_LENGTH = 30
def create_sequences(data, seq_length):
    sequences = []
    # To save time in training, stride by 5
    for i in range(0, len(data) - seq_length + 1, 5):
        sequences.append(data[i:i+seq_length])
    return np.array(sequences)

normal_seq = create_sequences(normal_scaled, SEQ_LENGTH)

# Limit training data size to speed up the process (max 5000 sequences)
if len(normal_seq) > 5000:
    indices = np.random.choice(len(normal_seq), 5000, replace=False)
    normal_seq = normal_seq[indices]

X_train, X_val = train_test_split(normal_seq, test_size=0.2, random_state=42)

# 2. Build and Train LSTM-AE
def build_lstm_ae(input_shape, latent_dim=16):
    inputs = layers.Input(shape=input_shape)
    x = layers.LSTM(32, return_sequences=True)(inputs)
    encoded = layers.LSTM(latent_dim, return_sequences=False)(x)
    x = layers.RepeatVector(input_shape[0])(encoded)
    x = layers.LSTM(latent_dim, return_sequences=True)(x)
    x = layers.LSTM(32, return_sequences=True)(x)
    decoded = layers.TimeDistributed(layers.Dense(input_shape[1]))(x)
    model = models.Model(inputs, decoded)
    model.compile(optimizer='adam', loss='mse')
    return model

input_shape = (SEQ_LENGTH, len(features))
model = build_lstm_ae(input_shape)

early_stopping = callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

model.fit(
    X_train, X_train,
    epochs=15, # Quick train
    batch_size=64,
    validation_data=(X_val, X_val),
    callbacks=[early_stopping],
    verbose=1
)

# Overwrite the model file
model.save('lstm_ae_model.h5')

# 3. Calculate New Threshold
train_recon = model.predict(X_train[:1000], verbose=0)
train_errors = np.mean(np.square(X_train[:1000] - train_recon), axis=(1, 2))
threshold = np.percentile(train_errors, 95)

# Save new threshold
np.save('anomaly_threshold.npy', threshold)

print(f"✅ Retraining Complete! New Threshold: {threshold:.6f}")
