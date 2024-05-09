// database.js

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'database-1.cj28mcos4kh9.ap-northeast-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Reishi0921',
  database: 'books_db'
})

const addBook = (title, author) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO books (title, author) VALUES (?, ?)';
            const values = [title, author];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                console.log('A new book has been added to the database.');
                resolve();
                }
            });
        });
    };        

    const bookExistsByTitle = (title) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books WHERE title = ?';
            const values = [title];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.length > 0);
                }
            });
        });
    }

    const bookExistsByTitleAndAuthor = (title, author) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books WHERE title = ? AND author = ?';
            const values = [title, author];
    
            connection.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.length > 0);
                }
            });
        });
    }

    const removeBook = (title) => {
        const sql ='DELETE FROM books WHERE title = ?';
        const values = [title];

        connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log('The book has been removed from the database.');
            });        
    }

    const searchBook = (title, author) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM books WHERE title = ? OR author = ?';
            const values = [title, author];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    const getTotalBooks = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as total FROM books';

            connection.query(sql, (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result[0].total);
                }
            })
        })
    }

module.exports = { addBook, bookExistsByTitleAndAuthor, bookExistsByTitle, removeBook, searchBook, getTotalBooks };

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL;', err);
        return;
    }

    console.log('success');
    console.log('Connected as id ' + connection.threadId);
    console.log('Connected to database ' + connection.config.database + 'at ' + connection.config.host);

});

