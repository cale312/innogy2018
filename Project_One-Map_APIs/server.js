const express = require('express');
const path = require('path');

const app = express();

// cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// port config
const port = process.env.PORT || 9000;
app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`server running on https://localhost:${port}`);
});
