require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")
const express = require("express")
const routes = require("./routes")
const AppError = require("./utils/AppError")

const app = express()
app.use(express.json())

app.use(routes)

migrationsRun()

app.use((error, req, response, next) => {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ error: "error", message: error.message })
  }
  console.log(error)

  return response
    .status(500)
    .json({ error: "error", message: "Internal server error" })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
