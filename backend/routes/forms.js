const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET all reviews
router.get("/", (req, res) => {
    const sql = "SELECT * FROM songs";
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
  
  // GET review by ID
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM songs WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ message: "Review not found" });
        return;
      }
      res.json(row);
    });
  });


router.post("/", async (req, res) => {
    try {
      // destructuring the req.body to save the values
      const { songName, rating, comments } = req.body;
      const schema =
        "INSERT INTO songs (songName, rating, comments) VALUES (?, ?, ?)";
  
        // Check if required fields are present in the request body
        if (!songName || !rating || !comments) {
            return res.status(400).json({ error: 'Please provide songName, rating, and comments' });
        }
  
      if (isNaN(rating)) {
        return res.status(400).json({
          status: 400,
          success: false,
          error: "The rating should be a number between 1 to 5",
        });
      }
  
      // querying to the database to create the individual data
      db.run(schema, [songName, Number(rating), comments], function (err) {
        if (err) {
          console.error("Error inserting into database:", err);
          res.status(500).json({ status: 500, success: false, error: err });
        } else {
          const insertedId = this.lastID; // Get the ID of the newly inserted row
  
          // returning the status, success and id
          res.status(200).json({ status: 200, success: true, id: insertedId });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ status: 500, success: false, error: err });
    }
  });

module.exports = router;
