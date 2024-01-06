const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // This is important.
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
const userRouter = require('./routes/user.routes.js');
const productRouter = require('./routes/product.routes.js')

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

module.exports = { app };
