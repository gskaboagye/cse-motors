const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

const app = express()

// View engine
app.set("view engine", "ejs")

// Layout configuration
app.use(expressLayouts)
app.set("layout", "layouts/main")

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Route for homepage
app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors"
  })
})

// Port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})