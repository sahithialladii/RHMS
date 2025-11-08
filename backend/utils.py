import torch
import librosa
import numpy as np
import os

# Load your RDLINet model here
MODEL_PATH = "model_weights/rdlinet.pth"

# Placeholder model class (replace with actual RDLINet class)
class RDLINet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.dummy = torch.nn.Linear(10, 2)
    def forward(self, x):
        return self.dummy(torch.randn(1,10))

MODEL = RDLINet()
# MODEL.load_state_dict(torch.load(MODEL_PATH, map_location='cpu'))
MODEL.eval()

# def predict_audio(file_path: str):
#     """
#     Preprocess audio & return dummy prediction (replace with actual RDLINet inference)
#     """
#     y, sr = librosa.load(file_path, sr=16000)
#     S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
#     S_db = librosa.power_to_db(S, ref=np.max)
#     img = np.stack([S_db, S_db, S_db], axis=-1).astype(np.float32)
#     tensor = torch.from_numpy(img).permute(2,0,1).unsqueeze(0)
    
#     with torch.no_grad():
#         logits = MODEL(tensor)
#         probs = torch.nn.functional.softmax(logits, dim=1).cpu().numpy()
#         pred_idx = int(np.argmax(probs))
#         pred_label = "normal" if pred_idx == 0 else "abnormal"
    
#     return {"prediction": pred_label, "score": float(probs[0][pred_idx])}


def predict_audio(file_path: str):


    y, sr = librosa.load(file_path, sr=16000)
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
    S_db = librosa.power_to_db(S, ref=np.max)
    img = np.stack([S_db, S_db, S_db], axis=-1).astype(np.float32)
    tensor = torch.from_numpy(img).permute(2,0,1).unsqueeze(0)
    
    # Dummy model prediction (replace with your RDLINet)
    import torch.nn.functional as F
    logits = torch.randn(1,2)
    probs = F.softmax(logits, dim=1).cpu().numpy()
    pred_idx = int(np.argmax(probs))
    pred_label = "normal" if pred_idx == 0 else "abnormal"
    
    return {"prediction": pred_label, "score": float(probs[0][pred_idx])}
