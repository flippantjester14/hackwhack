const express = require('express');
const bodyParser = require('body-parser');
const redis = require('./redis');
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Register Endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await redis.get(`user:${username}`);
  if (userExists) {
    return res.json({ success: false, message: 'User already exists' });
  }

  await redis.set(`user:${username}`, JSON.stringify({ email, password }));
  res.json({ success: true });
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await redis.get(`user:${username}`);
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  const parsedUser = JSON.parse(user);
  if (parsedUser.password === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Incorrect password' });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
