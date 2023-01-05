const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const https = require('https');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.set('strictQuery', false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const serverOptions = {
  // Certificate(s) & Key(s)
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),

  // TLS Versions
  maxVersion: 'TLSv1.3',
  minVersion: 'TLSv1.2',
};
const sslServer = https.createServer(serverOptions, app);
const port = process.env.PORT || 3000;
const server = sslServer.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
