const express = require("express")
const path = require("path")

const app = express()

// View engine
app.set("view engine", "ejs")

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Route for homepage
app.get("/", (req, res) => {
  res.render("index")
})

// Port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})