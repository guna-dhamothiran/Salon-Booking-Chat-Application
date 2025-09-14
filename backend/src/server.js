const express = require("express");
const mongoose = require("mongoose");
const agentRoutes = require("./routes/agentRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/salon", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/agent", agentRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
