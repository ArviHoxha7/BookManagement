const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Δημιουργία ή σύνδεση με τη βάση δεδομένων σε αρχείο books.sqlite
const db = new sqlite3.Database('books.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author VARCHAR(25) NOT NULL,
      title VARCHAR(40) NOT NULL,
      genre VARCHAR(20) NOT NULL,
      price REAL NOT NULL
    )
  `);
});

// Endpoint για καταχώρηση νέου βιβλίου
app.post('/books', (req, res) => {
  const { author, title, genre, price } = req.body;
  const stmt = db.prepare("INSERT INTO books (author, title, genre, price) VALUES (?, ?, ?, ?)");
  stmt.run(author, title, genre, price, function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Error inserting book' });
    } else {
      res.status(201).json({ success: true, id: this.lastID });
    }
  });
  stmt.finalize();
});

// Endpoint για αναζήτηση βιβλίου
app.get('/books/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.all("SELECT * FROM books WHERE title LIKE ?", [keyword], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error retrieving books' });
    } else {
      res.json(rows);
    }
  });
});

// Σερβίρισμα της index.html
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
