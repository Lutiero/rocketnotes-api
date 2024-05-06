const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
class UsersControllers {
  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection()

    const checkIfUserExists = await database.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (checkIfUserExists) {
      throw new AppError("Email já cadastrado", 400)
    }

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    )

    res.status(201).json({ message: "Usuário cadastrado com sucesso" })
  }
}

module.exports = UsersControllers
