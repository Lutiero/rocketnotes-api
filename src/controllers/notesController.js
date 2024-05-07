const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body
    const { user_id } = request.params

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    })

    const tagsInserted = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      }
    })

    await knex("tags").insert(tagsInserted)

    const linksInserted = links.map((link) => {
      return {
        note_id,
        url: link,
      }
    })

    await knex("links").insert(linksInserted)

    response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex("notes").where("id", id).first()
    const tags = await knex("tags").where("note_id", id).orderBy("name")
    const links = await knex("links").where("note_id", id).orderBy("created_at")

    response.json({
      ...note,
      tags,
      links,
    })
  }

  async delete(request, response) {
    const { id } = request.params
    const deletedNotes = await knex("notes").where("id", id).delete()

    if (!deletedNotes) {
      response.status(404).json()
    }

    response.status(200).json()
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query

    let notes

    if (tags) {
      let tagsFiltered = tags.split(",").map((tag) => tag.trim())

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", tagsFiltered)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title", "asc")
    } else {
      notes = await knex("notes")
        .where("user_id", user_id)
        .whereLike("title", `%${title}%`)
        .orderBy("created_at", "desc")

      if (notes.length === 0) {
        response.status(404).json()
      }
    }

    const userTags = await knex("tags").where("user_id", user_id)
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id)
      return {
        ...note,
        tags: noteTags,
      }
    })

    response.json(notesWithTags)
  }
}

module.exports = NotesController
