import pickle
try:
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    print("Features expected:", scaler.feature_names_in_)
except Exception as e:
    print("Error:", e)
