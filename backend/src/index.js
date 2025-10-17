const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Backend ok 🚀'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running on port ${port}`));
