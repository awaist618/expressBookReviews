const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

function auth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (bearerToken) {
        jwt.verify(bearerToken, "access", (err, user) => {
            if (!err) {
                req.user = user;
                req.session.authorization = { accessToken: bearerToken, username: user.data };
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
        return;
    }

    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
}

app.use('/review', (req, res, next) => {
    if (req.method === 'GET') {
        return next();
    }
    return auth(req, res, next);
});
app.use('/customer/review', auth);
app.use('/customer/auth', auth);

const PORT = 5000;

app.use('/', customer_routes);
app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log("Server is running"));