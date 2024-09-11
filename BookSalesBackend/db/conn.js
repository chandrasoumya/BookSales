const mongoose = require("mongoose");

// Connecting to the database
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected to " + process.env.URL);
  })
  .catch((err) => {
    console.log(err);
  });
