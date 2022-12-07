from firebase import firebase


def connection():
    fb = firebase.FirebaseApplication(
        "https://dta-cache-default-rtdb.firebaseio.com/", None
    )
    return fb


# MODEL PROFILE
NUM_LABEL = 30
# MAX_LEN=256
BERT_NAME = "phobert-base"
MODEL_FILE_NAME = "last_step.pth"
# HARDWARE
DEVICE = "cpu"
# PACKAGES
VN_STOP_WORD = "vietnamese-stopwords-dash.txt"
# VNCORENLP = "VnCoreNLP\VnCoreNLP-1.1.1.jar"
