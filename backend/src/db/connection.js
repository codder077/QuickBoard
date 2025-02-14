const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Database connected');
        });

        connection.on('error', (err) => {
            console.error('Error connecting to database:', err);
            process.exit(1);
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

module.exports = { connect };
