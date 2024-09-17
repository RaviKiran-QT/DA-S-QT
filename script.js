let questions = [];
let answers = {};
let currentQuestion = null;

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

function postQuestion() {
    const questionInput = document.getElementById('questionInput').value.trim();
    const imageInput = document.getElementById('imageInput').files[0];

    if (questionInput || imageInput) {
        // Check if the question is already posted
        if (!questions.some(q => q.text === questionInput)) {
            const questionData = {
                text: questionInput,
                image: imageInput ? URL.createObjectURL(imageInput) : null
            };
            questions.push(questionData);
            answers[questionInput] = '';
            updateQuestionList();
            document.getElementById('questionInput').value = '';
            document.getElementById('imageInput').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            refreshSearchTab();
        } else {
            alert('Question already posted.');
        }
    } else {
        alert('Please enter a question or upload an image.');
    }
}

function updateQuestionList() {
    const list = document.getElementById('questionsList');
    list.innerHTML = '';
    questions.forEach(question => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${question.text}
            ${question.image ? `<br><img src="${question.image}" alt="Question Image" class="preview-image"/>` : ''}
        `;
        li.onclick = () => selectQuestion(question.text, question.image);
        list.appendChild(li);
    });
}

function selectQuestion(question, image) {
    currentQuestion = question;
    document.getElementById('selectedQuestionLabel').textContent = `Selected Question: ${question}`;
    
    const answerImagePreview = document.getElementById('answerImagePreview');
    answerImagePreview.innerHTML = '';
    if (image) {
        const img = document.createElement('img');
        img.src = image;
        img.classList.add('preview-image');
        answerImagePreview.appendChild(img);
    }

    document.getElementById('answerInput').disabled = false;
    document.getElementById('submitAnswerButton').disabled = false;
    openTab('answers');
}

function submitAnswer() {
    if (currentQuestion) {
        const answerInput = document.getElementById('answerInput').value.trim();
        if (answerInput) {
            answers[currentQuestion] = answerInput;
            document.getElementById('answerInput').value = '';
            updateAnswersDisplay();
            refreshSearchTab();
        } else {
            alert('Please enter an answer.');
        }
    } else {
        alert('No question selected.');
    }
}

function updateAnswersDisplay() {
    const display = document.getElementById('answersDisplay');
    display.innerHTML = questions.map(question => {
        const answer = answers[question.text] || 'No answer available.';
        return `
            <p><strong>Q:</strong> ${question.text}<br><strong>A:</strong> ${answer}</p>
            ${question.image ? `<br><img src="${question.image}" alt="Question Image" class="preview-image"/>` : ''}
        `;
    }).join('');
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';

    if (query) {
        const searchResults = questions.filter(question =>
            question.text.toLowerCase().includes(query)
        );

        if (searchResults.length) {
            searchResults.forEach(question => {
                const answer = answers[question.text] || 'No answer available.';
                results.innerHTML += `
                    <p><strong>Q:</strong> ${question.text}<br><strong>A:</strong> ${answer}</p>
                    ${question.image ? `<br><img src="${question.image}" alt="Question Image" class="preview-image"/>` : ''}
                `;
            });
        } else {
            results.innerHTML = 'No results found.';
        }
    } else {
        results.innerHTML = 'Please enter a search query.';
    }
}

function refreshSearchTab() {
    if (document.getElementById('searchInput').value.trim() === '') {
        performSearch();
    }
}

function previewImage() {
    const fileInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-image');
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}
