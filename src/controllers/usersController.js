const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

const { hash, compare } = require("bcryptjs")

class UsersControllers {
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()

    const checkIfUserExists = await database.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (checkIfUserExists) {
      throw new AppError("Email já cadastrado", 400)
    }

    const passwordHash = await hash(password, 8)

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    )

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, old_password, password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()

    const user = await database.get("SELECT * FROM users WHERE id = ?", [id])
    if (!user) throw new AppError("Usuário não encontrado", 404)

    const checkUserWithEmail = await database.get(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, id]
    )

    if (checkUserWithEmail) {
      throw new AppError("Email já cadastrado", 400)
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError("Senha antiga é obrigatória", 400)
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)
      if (!checkOldPassword) {
        throw new AppError("Senha antiga incorreta", 400)
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `
    UPDATE users SET 
      name = ?,
      email = ?, 
      password = ?,
      updated_at = DATETIME('now') 
      WHERE id = ?`,
      [user.name, user.email, user.password, user.id]
    )

    return response.status(204).json()
  }
}

module.exports = UsersControllers
