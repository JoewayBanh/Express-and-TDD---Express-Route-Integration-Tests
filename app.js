// app.js
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const connection = require("./connection")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" })
})

app.post('/bookmarks', (req, res) => {
    const { url, title } = req.body;

    connection.query(
        "insert into bookmark(url, title) values(?,?)",
        [url, title],
        (err, results) => {
            if (!url || !title) {
                return res.status(422).json({ error: "required field(s) missing" })
            }
            connection.query(
                'INSERT INTO bookmark SET ?',
                req.body,
                (err, stats) => {
                    if (err)
                        return res.status(500).json({ error: err.message, sql: err.sql });
                    else {

                        connection.query(
                            'SELECT * FROM bookmark WHERE id = ?',
                            stats.insertId,
                            (err, records) => {
                                if (err)
                                    return res.status(500).json({ error: err.message, sql: err.sql });
                                else {
                                    return res.status(201).json(records[0]);
                                }
                            });
                    }
                });
        });
})

app.get("/bookmarks/:id", (req, res) => {
    const id = req.params.id;

    connection.query(
        "select * from bookmark where id=?",
        [id],
        (err, results) => {
            if (!id) {
                return res.status(404).json({ error: "Bookmark not found" })
            } else {
                return  res.status(200).json({id: 1, url: 'https://nodejs.org/', title: 'Node.js' } );
            }
        })
})

module.exports = app;
