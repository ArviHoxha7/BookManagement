document.getElementById('addBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const price = parseFloat(document.getElementById('price').value);
  
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price.');
      return;
    }
  
    const bookData = { author, title, genre, price };
  
    fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Book added successfully!');
      } else {
        alert('Error adding book.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error adding book.');
    });
  });
  
  document.getElementById('searchBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const keyword = document.getElementById('keyword').value;
  
    fetch(`http://localhost:3000/books/${keyword}`)
    .then(response => response.json())
    .then(data => {
      const resultsDiv = document.getElementById('searchResults');
      resultsDiv.innerHTML = '';
      if (data.length > 0) {
        data.forEach(book => {
          const bookDiv = document.createElement('div');
          bookDiv.innerHTML = `
            <p>ID: ${book.id}</p>
            <p>Author: ${book.author}</p>
            <p>Title: ${book.title}</p>
            <p>Genre: ${book.genre}</p>
            <p>Price: ${book.price}</p>
            <hr>
          `;
          resultsDiv.appendChild(bookDiv);
        });
      } else {
        resultsDiv.innerHTML = '<p>No books found.</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching books.');
    });
  });
  