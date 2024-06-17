document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("upload-form");
    const fileInput = document.getElementById("file");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // 顯示圖片的函式
    function displayImage() {
        //清除上次偵測結果
        const textResults = document.getElementById("text-results");
        textResults.innerHTML = "";

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let img = new Image();
        img.src = URL.createObjectURL(fileInput.files[0]);
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            // Debugging line: Log when the image is loaded
            console.log("Image loaded");
        };
    }

    let activeButton = null;
    let activeLang = 'en'; // 默認為英文

    function toggleButton(buttonIndex) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
            if (index === buttonIndex) {
                button.classList.toggle('active');
                activeLang = button.dataset.lang; // 獲取當前按鈕的語言設置
            } else {
                button.classList.remove('active');
            }
        });
        // 获取提示信息的元素
        const messageDivElement = document.getElementById('language-switch-message');
        // 發送POST請求更新語言設置
        fetch('/switch_lang', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `lang=${activeLang}`
        })
        .then(response => response.json())
        .then(data => {
            console.log('Language switched to:', activeLang);

            // 更新提示信息為 "切換中"
            messageDivElement.textContent = '切換中...';

            // 更新提示信息
            let languageName;
            switch (activeLang) {
                case 'chinese_cht':
                    languageName = '繁體中文';
                    break;
                case 'ch':
                    languageName = '簡中&英文';
                    break;
                case 'en':
                    languageName = '英文';
                    break;
                case 'japan':
                    languageName = '日文';
                    break;
                case 'korean':
                    languageName = '韓文';
                    break;
                case 'fr':
                    languageName = '法文';
                    break;
                default:
                    languageName = '未知語言';
            }
            messageDivElement.textContent = `已切換為 ${languageName}`;
        })
        .catch(error => {
            console.error('Error switching language:', error);
            messageDivElement.textContent = '切換語言失敗';
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Debugging line: Log when the form is submitted
        console.log("Form submitted");

        // Display the image immediately after selecting
        displayImage();

        // Create a FormData object and append the file
        let formData = new FormData();
        formData.append("file", fileInput.files[0]);

        // Fetch the image and run object detection
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => {
            // Debugging line: Log the HTTP response status
            console.log("HTTP Response Status:", response.status);
            return response.json();
        })
        .then(data => {
            // Update the detected text in the HTML
            const textResults = document.getElementById("text-results");
            textResults.innerHTML = "";  // Clear previous results

            for (const text of data.result) {
                const listItem = document.createElement("li");
                listItem.textContent = text;
                textResults.appendChild(listItem);
            }  

            // Debugging line: Log the data received from the server
            console.log("Data received:", data);

            // Draw the bounding boxes and labels
            for (const obj of data.result) {
                const [x, y, x2, y2] = obj.box;
                ctx.strokeStyle = "#FF0000";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, x2 - x, y2 - y);

                ctx.fillStyle = "#FF0000";
                ctx.font = "24px Arial";
                const text = `${obj.label} (${Math.round(obj.confidence * 100)}%)`;
                ctx.fillText(text, x, y > 20 ? y - 5 : 20);
            }
        })
        .catch(error => {
            // Debugging line: Log any errors
            console.error("Error:", error);
        });
    });

    // 增加一個事件監聽器，當選擇圖片時，直接顯示圖片
    fileInput.addEventListener("change", displayImage);

    // 新增的部分
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => toggleButton(index));
    });
});

module.exports = {
    displayImage,
    toggleButton
  };
  
