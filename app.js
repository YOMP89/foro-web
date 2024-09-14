// app.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const newThreadSection = document.getElementById('new-thread');
    const createThreadBtn = document.getElementById('create-thread-btn');
    const threadsList = document.getElementById('threads-list');

    let currentUser = null;
    let threads = [];

    function init() {
        currentUser = localStorage.getItem('currentUser');
        threads = JSON.parse(localStorage.getItem('threads')) || [];
        updateUI();
        renderThreads();
    }

    function updateUI() {
        if (currentUser) {
            welcomeMessage.textContent = `Bienvenido, ${currentUser}`;
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            newThreadSection.style.display = 'block';
        } else {
            welcomeMessage.textContent = '';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            newThreadSection.style.display = 'none';
        }
    }

    function renderThreads() {
        threadsList.innerHTML = '';
        threads.forEach((thread, index) => {
            const threadDiv = document.createElement('div');
            threadDiv.classList.add('thread');

            const title = document.createElement('h3');
            title.textContent = thread.title;

            const content = document.createElement('p');
            content.textContent = thread.content;

            const author = document.createElement('small');
            author.textContent = `Por: ${thread.author}`;

            const actionsDiv = document.createElement('div');

            const likes = document.createElement('span');
            likes.classList.add('likes');
            likes.textContent = `❤️ ${thread.likes}`;
            likes.addEventListener('click', () => {
                if (currentUser) {
                    thread.likes += 1;
                    saveThreads();
                    renderThreads();
                } else {
                    alert('Debes iniciar sesión para dar me gusta.');
                }
            });

            const replyBtn = document.createElement('button');
            replyBtn.textContent = 'Responder';
            replyBtn.addEventListener('click', () => {
                if (currentUser) {
                    const replyContent = prompt('Escribe tu respuesta:');
                    if (replyContent) {
                        thread.replies.push({
                            author: currentUser,
                            content: replyContent
                        });
                        saveThreads();
                        renderThreads();
                    }
                } else {
                    alert('Debes iniciar sesión para responder.');
                }
            });

            actionsDiv.appendChild(likes);
            actionsDiv.appendChild(replyBtn);

            const repliesDiv = document.createElement('div');
            repliesDiv.classList.add('replies');
            thread.replies.forEach(reply => {
                const replyDiv = document.createElement('div');
                replyDiv.classList.add('reply');

                const replyAuthor = document.createElement('small');
                replyAuthor.textContent = `Por: ${reply.author}`;

                const replyContent = document.createElement('p');
                replyContent.textContent = reply.content;

                replyDiv.appendChild(replyAuthor);
                replyDiv.appendChild(replyContent);

                repliesDiv.appendChild(replyDiv);
            });

            threadDiv.appendChild(title);
            threadDiv.appendChild(content);
            threadDiv.appendChild(author);
            threadDiv.appendChild(actionsDiv);
            threadDiv.appendChild(repliesDiv);

            threadsList.appendChild(threadDiv);
        });
    }

    function saveThreads() {
        localStorage.setItem('threads', JSON.stringify(threads));
    }

    loginBtn.addEventListener('click', () => {
        const username = prompt('Ingresa tu nombre de usuario:');
        if (username) {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            updateUI();
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUI();
    });

    createThreadBtn.addEventListener('click', () => {
        const title = document.getElementById('thread-title').value;
        const content = document.getElementById('thread-content').value;
        if (title && content) {
            threads.unshift({
                title,
                content,
                author: currentUser,
                likes: 0,
                replies: []
            });
            saveThreads();
            renderThreads();
            document.getElementById('thread-title').value = '';
            document.getElementById('thread-content').value = '';
        } else {
            alert('Debes completar el título y contenido del hilo.');
        }
    });

    init();
});
