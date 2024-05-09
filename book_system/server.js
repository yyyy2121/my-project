// server.js

const express = require('express');
const path = require('path');
const { addBook, bookExistsByTitle, bookExistsByTitleAndAuthor, removeBook, searchBook, getTotalBooks } = require('./database');  

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.post('/addBook', async (req, res) => {
    const { title, author } = req.body;
    try{
        await addBook(title, author);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/bookExistsByTitle', async (req, res) => {
    const { title } = req.query;
    const exists = await bookExistsByTitle(title);
    res.json(exists);
});

app.get('/bookExistsByTitleAndAuthor', async (req, res) => {
    const { title, author } = req.query;
    const exists = await bookExistsByTitleAndAuthor(title, author);
    res.json(exists);
});

app.delete('/removeBook' , async (req, res) => {
    const { title } = req.query;
    try {
        await removeBook(title);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/searchBook' , async (req, res) => {
    const { title, author } = req.query;
    try {
        const books = await searchBook(title, author);
        res.json(books);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/totalBooks', async (req, res) => {
    try {
        const total = await getTotalBooks();
        res.json(total);
    } catch (err){
        res.status(500).send(err.message);
    }
})

const hostname = "10.0.129.240";
const port = 3000;
app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));
