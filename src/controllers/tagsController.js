const knex = require("../database/knex")

class TagsController {
  async index(request, response) {
    console.log(request.params)
    const { user_id } = request.params

    const tags = await knex("tags").where("user_id", user_id).orderBy("name")

    return response.json(tags)
  }
}

module.exports = TagsController
