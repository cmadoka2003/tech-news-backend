var express = require('express');
var router = express.Router();

router.get("/articles", function(req, res) {
    fetch(`https://newsapi.org/v2/everything?sources=techcrunch&apiKey=${process.env.NEWS_API_KEY}`)
        .then((res) => res.json())
        .then((apiData) => res.json(apiData));
})

module.exports = router;
