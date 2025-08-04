const express = require("express");
const app = express();

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Multivendor Marketplace API is running!",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
