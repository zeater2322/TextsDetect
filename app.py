
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
ocr_model = PaddleOCR(lang='en')#Traditional chinese

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'})

    # 直接處理上傳的圖片
    result = process_image(file)

    return jsonify({'result': result})

def process_image(file):
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





@app.route('/en')
def en():
    ocr_model_en = PaddleOCR(lang='en')#Traditional chinese
    return render_template('en.html')

@app.route('/ch')
def ch():
    ocr_model_ch = PaddleOCR(lang='ch')#Traditional chinese
    return render_template('ch.html')

@app.route('/jp')
def jp():
    ocr_model_jp = PaddleOCR(lang='japan')#Traditional chinese
    return render_template('jp.html')

@app.route('/kr')
def kr():
    ocr_model_kr = PaddleOCR(lang='korean')#Traditional chinese
    return render_template('kr.html')

@app.route('/fr')
def fr():
    ocr_model_fr = PaddleOCR(lang='fr')#Traditional chinese
    return render_template('fr.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
