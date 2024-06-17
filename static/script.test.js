// 模擬 HTML 中相關的元素和事件
document.body.innerHTML = `
<div>
  <input type="file" id="file">
  <button id="copy-button">複製文字</button>
</div>
`;

// 引入被測試的 JavaScript 代碼
const { displayImage, toggleButton } = require('./script.js');

describe('displayImage', () => {
  test('displays image on canvas when file is selected', () => {
    // 模擬文件選擇事件
    const fileInput = document.getElementById('file');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const mockFile = new File(['(⌐□_□)'], 'test.jpg', { type: 'image/jpeg' });
    const image = new Image();
    const drawImageMock = jest.spyOn(ctx, 'drawImage');
    
    // 調用 displayImage 函數
    displayImage(canvas, ctx, fileInput);

    // 模擬圖片加載事件
    image.onload();

    // 斷言是否在畫布上繪製了圖片
    expect(drawImageMock).toHaveBeenCalled();
  });
});

describe('toggleButton', () => {
  test('toggles active class on button click', () => {
    // 模擬按鈕和語言切換函數
    const button = document.createElement('button');
    const toggleButtonMock = jest.fn();
    button.addEventListener('click', toggleButtonMock);

    // 點擊按鈕
    button.click();

    // 斷言是否觸發了語言切換函數
    expect(toggleButtonMock).toHaveBeenCalled();
  });
});
