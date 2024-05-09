// main.js

window.onload = function() {
    const addTitleButton = document.getElementById('addTitleButton');
    const addAuthorButton = document.getElementById('addAuthorButton');
    const removeButton = document.getElementById('removeButton');
    const searchButton = document.getElementById('searchButton');
    
    const addTitleInput = document.getElementById('addTitleInput');
    const addAuthorInput = document.getElementById('addAuthorInput');
    const removeInput = document.getElementById('removeInput');
    const searchInput = document.getElementById('searchInput');

    const bookList = document.getElementById('bookList');

    async function updateTotalBooks() {
        const response = await fetch('/totalBooks');
        const total = await response.json();
        document.getElementById('totalBooks').textContent = `本の所持数: ${total}`;
    }

    addTitleButton.addEventListener('click', async function() {
        const title = addTitleInput.value.trim();
        if(!title) {
            alert('Error: Title cannnot be blank');
            return;
        }
        const response = await fetch(`/bookExistsByTitle?title=${title}`);
        if (!response.ok) { 
        const message = await response.text();
        alert(`Error: ${message}`);
            return;
        }   
        const exists = await response.json();
        if(exists) {
            alert('Error: Book already exists');
            return;
        }
        document.getElementById('addAuthorInput').style.display = 'block';
        document.getElementById('addAuthorButton').style.display = 'block';
    });

    addAuthorButton.addEventListener('click', async function() {
        const author = addAuthorInput.value.trim();
        if (!author) {
            alert('Error: Author cannnot be blank');
            return;
        }
        await fetch('/addBook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: addTitleInput.value, author })
        });
        addTitleInput.value = '';
        addAuthorInput.value = '';
        document.getElementById('addAuthorInput').style.display = 'none';
        document.getElementById('addAuthorButton').style.display = 'none';
        await updateTotalBooks();
    });

    removeButton.addEventListener('click', async function() {
        const title = removeInput.value.trim();
        if(!title) {
            alert('Error: Title cannot be blank');
            return;
        }
        const response = await fetch(`/bookExistsByTitle?title=${title}`);
        if (!response.ok) { 
            const message = await response.text();
                alert(`Error: ${message}`);
                return;
            }   
        const exists = await response.json();
        if (!exists) {
            alert('Error; Book does not exists');
            return;
        }
        await fetch(`/removeBook?title=${title}`, { method: 'DELETE'});
        removeInput.value = '';
        await updateTotalBooks();
    });

    searchButton.addEventListener('click', async function() {
        const title = searchTitleInput.value.trim();
        const author = document.getElementById('searchAuthorInput').value.trim();
        if(!title && !author) {
            alert('Error: Title and author cannnot be blank');
            return;
        }
        const response = await fetch(`/searchBook?title=${title}&author=${author}`);
        const result = await response.json();
        if (!Array.isArray(result)) {
            alert('Error: Unexpected server response');
            return;
        }
        if (result.length === 0) {
            alert('Error: Book does not exist')
            return;
        }
        bookList.innerHTML = '';
        result.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `Title: ${book.title}, Author: ${book.author}`;
            bookList.appendChild(listItem);
        });
    });

    updateTotalBooks();
};

