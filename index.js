const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let responses = [];

// Load responses.json when the server starts
fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading responses file:', err);
    } else {
        responses = JSON.parse(data); // Load the existing data into the array
    }
});

app.post('/responses', (req, res) => {
    const newResponse = {
        name: req.body.name,
        hobby: req.body.hobby
    };

    responses.push(newResponse);

    // Save the updated responses to responses.json
    fs.writeFile('responses.json', JSON.stringify(responses, null, 2), (err) => {
        if (err) {
            console.error('Error writing to responses file:', err);
            res.status(500).send('Error saving response.');
        } else {
            res.status(200).send('Response saved!');
        }
    });
});

app.get('/responses', (req, res) => {
    // Send the last entry (previous user's data)
    if (responses.length > 1) {
        const lastResponse = responses[responses.length - 2]; // Get the second-to-last entry
        res.json(lastResponse); 
    } else {
        res.json({ name: 'N/A', hobby: 'N/A' }); // Default if there's only one entry
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
