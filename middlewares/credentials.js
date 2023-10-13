const credentials = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'https://e-commerce-client-rlwo.onrender.com');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('ngrok-skip-browser-warning',true);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept ');
    next()
}

module.exports = credentials