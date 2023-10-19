const express = require('express');
const cors = require('cors');
const app = express(cors());
const PORT = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('SrsTech server is ready')
})

app.listen(PORT, ()=>{
    console.log(`SrsTech server is running on http://127.0.0.1:${PORT}`)
})