"use strict";

const myLibrary = [];
const bookLibrary = [];

function Book(title,author,pages,read) {
    try {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = Boolean(read) === true ? "Read" : "Not read";

        if (!title) {this.title = 'Unknown'}
        if (!author) {this.author = 'Unknown'}
        if (!pages) {this.pages = 'Unknown'}

    } catch (err) {
        this.title = "Unknown";
        this.author = "Unknown";
        this.pages = 0;
        this.read = "Not read";
        console.log(err)
    }
}

Book.prototype.info = function() {
    return [this.title,this.author,this.pages,this.read];
}

const bookLib = document.getElementById('library');
const overlay = document.getElementById('overlay');
overlay.style.zIndex = -1;
const cancel = document.getElementById('cancel');
const form = document.getElementById('form');

let toggleOverlay = function() {
    if (overlay.style.zIndex == -1) {
        overlay.style.zIndex = 2;
    } else {
        overlay.style.zIndex = -1;
    }
}

const bookButton = document.getElementById('addBook');
bookButton.addEventListener('click',()=>{
    toggleOverlay();
})

overlay.addEventListener('click',()=>{
    toggleOverlay();
})

cancel.addEventListener('click',()=>{
    toggleOverlay();
})

form.addEventListener("click", function(event) {
    event.stopPropagation();
});

form.addEventListener("submit", function(event) {
    event.preventDefault();
    toggleOverlay();
    addBookToLibrary(form);
});

(()=>{
    if (localStorage.getItem('library')) {
        let lib = JSON.parse(localStorage.getItem('library'));
        for (let key in lib) {
            addBookToLibrary('load',lib[key]);
            myLibrary.push(`${lib[key].title}-${lib[key].author}`);
        }
    }
})()

function createBook(book,bookText) {
    let textArray = book.info();
    let bookDiv = document.createElement('div');
    bookDiv.classList.add("book");
    bookDiv.book = book;

    let bookDetails = document.createElement('p');
    bookDetails.classList.add("book-detail");
    let bookTitle = document.createElement('h1');
    bookTitle.innerText = textArray[0];
    let bookAuthor = document.createElement('h2');
    bookAuthor.innerText = `by ${textArray[1]}`;
    bookDetails.append(bookTitle,bookAuthor);

    let bookDescriptions = document.createElement('div');
    bookDescriptions.classList.add("book-desc");
    let pages = document.createElement('h3');
    pages.innerText = `${textArray[2]} pages`;
    let bookRead = document.createElement('button');
    bookRead.addEventListener('click',()=>{
        if (book.read === 'Read') {
            book.read = 'Not read';
            bookRead.innerText = 'Not read';
        } else {
            book.read = 'Read';
            bookRead.innerText = 'Read';
        }
        localStorage.setItem('library',JSON.stringify(bookLibrary));
    })
    bookRead.innerText = textArray[3];
    let bookDelete = document.createElement('button');
    bookDelete.innerText = 'Delete';
    bookDelete.addEventListener('click',()=>{
        for (let i = 0; i < bookLibrary.length; i++) {
            if (bookLibrary[i] === book) {
                bookLibrary.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < myLibrary.length; i++) {
            if (myLibrary[i] === bookText) {
                myLibrary.splice(i, 1);
                break;
            }
        }
        bookDiv.remove();
        localStorage.setItem('library',JSON.stringify(bookLibrary));
    })
    bookDescriptions.append(pages,bookRead,bookDelete);

    bookDiv.append(bookDetails,bookDescriptions);
    bookLib.appendChild(bookDiv);
}
  
function addBookToLibrary(type,save) {
    let book;
    if (type === 'load') {
        let title = save.title || 'Unknown';
        let author = save.author || 'Unknown';
        let pages = save.pages || 'Unknown';
        let read;
        if (save.read === 'Not read') {
            read = false;
        } else {
            read = true;
        }

        book = new Book(title, author, pages, read);
    } else {
        book = new Book (
            form.elements['title'].value,
            form.elements['author'].value,
            form.elements['pages'].value,
            form.elements['read'].checked,
        )
    }

    let bookText = `${book.title}-${book.author}`;
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i] === bookText) {
            alert(`'${book.title}' by '${book.author}' already exists in the library!`);
            form.reset();
            return;
        }
    }

    myLibrary.push(bookText);
    bookLibrary.push(book);
    localStorage.setItem('library',JSON.stringify(bookLibrary));

    form.reset();
    createBook(book,bookText);
}