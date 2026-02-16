// array buku

let books = [];

const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener('DOMContentLoaded', function () {
    loadBooksFromStorage();
    renderBooks();
    setupEventListener();
});

function setupEventListener() {
    const bookForm = document.getElementById('bookForm');
    const searchBook = document.getElementById('searchBook');
    const bookFormIsComplete = document.getElementById('bookFormIsComplete');

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });

    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        searchBooks();
    });

    bookFormIsComplete.addEventListener('change', function (e) {
        const submitButton = document.querySelector('#bookFormSubmit span');
        if (bookFormIsComplete.checked) {
            submitButton.innerText = 'Selesai dibaca';
        } else {
            submitButton.innerText = 'Belum selesai dibaca';
        }
    });
}

function addBook() {
    const bookTitle = document.getElementById('bookFormTitle').value;
    const bookAuthor = document.getElementById('bookFormAuthor').value;
    const bookYear = parseInt(document.getElementById('bookFormYear').value);
    const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

    const book = {
        id: +new Date(),
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: bookIsComplete
    };

    books.push(book);
    saveBooksToStorage();
    renderBooks();

    // reset
    document.getElementById('bookForm').reset();
    document.querySelector('#bookFormSubmit span').innerText = 'Belum selesai dibaca';

    alert('Buku berhasil ditambahkan!');
}

function createBookItem(book) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    const title = document.createElement('h3');
    title.setAttribute('data-testid', 'bookItemTitle');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.setAttribute('data-testid', 'bookItemAuthor');
    author.textContent = `Penulis: ${book.author}`;

    const year = document.createElement('p');
    year.setAttribute('data-testid', 'bookItemYear');
    year.textContent = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement('div');

    const completeButton = document.createElement('button');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    completeButton.addEventListener('click', function () {
        toggleBookComplete(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.textContent = 'Hapus Buku';
    deleteButton.addEventListener('click', function() {
        deleteBook(book.id);
    });

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.textContent = 'Edit Buku';
    editButton.addEventListener('click', function() {
        editBook(book.id);
    });

    buttonContainer.append(completeButton, deleteButton, editButton);
    bookItem.append(title, author, year, buttonContainer);

    return bookItem;
}

function renderBooks(filteredBooks = null) {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    const booksToRender = filteredBooks || books;

    const incompleteBooks = booksToRender.filter(book => !book.isComplete);
    const completeBooks = booksToRender.filter(book => book.isComplete);

    if (incompleteBooks.length === 0) {
        incompleteBookList.innerHTML = '<p class="empty-message">Belum ada Buku</p>';
    } else {
        incompleteBooks.forEach(book => {
            incompleteBookList.appendChild(createBookItem(book));
        })
    }

    if (completeBooks.length === 0) {
        completeBookList.innerHTML = '<p class="empty-message">Tidak ada buku yang selesai dibaca.</p>';
    } else {
        completeBooks.forEach(book => {
            completeBookList.appendChild(createBookItem(book));
        })
    }
}

function toggleBookComplete(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooksToStorage();
        renderBooks();
    }
}

function deleteBook(bookId) {
    const confirmation = confirm('Apakah Anda yakin ingin menghapus buku ini?');
    if (confirmation) {
        books = books.filter(b => b.id !== bookId);
        saveBooksToStorage();
        renderBooks();
        alert('Buku berhasil dihapus!');
    }
}

function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;

        const submitButton = document.querySelector('#bookFormSubmit span');
        if (book.isComplete) {
            submitButton.innerText = 'Selesai dibaca';
        } else {
            submitButton.innerText = 'Belum selesai dibaca';
        }

        books = books.filter(b => b.id !== bookId);
        saveBooksToStorage();
        renderBooks();

        window.scrollTo({ top: 0, behavior: 'smooth' });

        alert('Silakan edit data buku pada form di atas.');
    }
}

function searchBooks() {
    const searchInput = document.getElementById('searchBookTitle').value.toLowerCase();

    if (searchInput === '') {
        renderBooks();
        return;
    }

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchInput));

    if (filteredBooks.length === 0) {
        alert('Buku tidak ditemukan.');
        renderBooks();
    } else {
        renderBooks(filteredBooks);
    }
}

function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooksFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        books = JSON.parse(data);
    }
}