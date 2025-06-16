document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeButton = document.getElementById('analyzeButton');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // ドラッグ＆ドロップのイベントハンドラ
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4a90e2';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // クリックでファイル選択
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // ファイル処理関数
    function handleFiles(files) {
        if (files.length === 0) return;

        // プレビューセクションを表示
        previewSection.style.display = 'block';
        imagePreview.innerHTML = '';

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }

    // コーディネート分析ボタンのイベントハンドラ
    analyzeButton.addEventListener('click', async () => {
        // 結果セクションを表示
        resultSection.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        resultContent.innerHTML = '';

        try {
            const response = await fetch('/.netlify/functions/analyze-outfit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('サーバーからの応答がありません');
            }

            const data = await response.json();
            
            // ローディングインジケータを非表示
            loadingIndicator.style.display = 'none';
            
            // 結果を表示
            resultContent.innerHTML = `
                <div class="result-text">
                    <h3>明日のコーディネート提案</h3>
                    <p>${data.suggestion}</p>
                </div>
            `;
        } catch (error) {
            loadingIndicator.style.display = 'none';
            resultContent.innerHTML = `
                <div class="error-message">
                    <p>申し訳ありません。エラーが発生しました。</p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    });
}); 