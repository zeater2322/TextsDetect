from flask import render_template  
from flask import Flask, request, jsonify
from flask_cors import CORS  
import numpy as np
import torch
from paddleocr import PaddleOCR,draw_ocr
from matplotlib import pyplot as plt 
import cv2 
import os 

app = Flask(__name__)
CORS(app) 
app.ocr_model = PaddleOCR(lang='en')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/switch_lang', methods=['POST'])
def switch_lang():
    lang = request.form.get('lang', 'en')
    app.ocr_model = PaddleOCR(lang=lang)  # 將新的語言模型保存到應用程序上下文中
    return jsonify({'success': True})

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'})

    # 使用保存在應用程序上下文中的模型進行文字檢測
    result = process_image(file, app.ocr_model)
    return jsonify({'result': result})

def process_image(file, ocr_model):
    # 將上傳的文件轉換成 OpenCV 格式的圖片
    nparr = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 使用 PaddleOCR 進行文字偵測
    result = ocr_model.ocr(img)
    texts = []
    for res in result:
        for item in res:
            texts.append(item[1][0])
    return texts


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4500,debug=True)

