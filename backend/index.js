const dotenv = require('dotenv');
const { connectDB } = require('./db/db.js');
const { app } = require('./app.js');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`DB Connection failed: ${error}`);
    });


module.exports = app