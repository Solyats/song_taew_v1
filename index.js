require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const frontEndRouter = require("./routes/front_end");
const backEndRouter = require("./routes/back_end");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static("public"));

app.use("/", frontEndRouter);
app.use("/", backEndRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
