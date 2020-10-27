const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening at PORT ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));