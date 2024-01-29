const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3001; // Choose a different port from your React Native app

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_db'
});

app.post('/api/query', (req, res) => {
  const { query, values } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: 'Query is required in the request body.' });
  }

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(200).json({ success: true, results });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const port2 = 3002; // Choose a different port from your React Native app

app.post('/api/send-sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  // Replace with your Twilio account credentials
  const accountSid = 'your_account_sid';
  const authToken = 'your_auth_token';

  const client = require('twilio')(accountSid, authToken);

  try {
    await client.messages.create({
      to: phoneNumber,
      from: 'your_twilio_phone_number',
      body: message
    });
    res.status(200).json({ success: true, message: 'SMS sent successfully.' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, error: 'Failed to send SMS.' });
  }
});

app.listen(port2, () => {
  console.log(`Server is running on port ${port2}`);
});
