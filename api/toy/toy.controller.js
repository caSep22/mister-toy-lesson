const toyService = require('./toy.service.js')
const logger = require('../../services/logger.service')

// GET LIST
async function getToys(req, res) {
  try {
    var queryParams = req.query
    const toys = await toyService.query(queryParams)
    res.json(toys)
  } catch (err) {
    res.status(404).send(err)
  }
}

// GET BY ID
async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    res.status(404).send(err)
  }
}

// POST (add toy)
async function addToy(req, res) {
  console.log('aadding toyy')
  const toy = req.body
  try {
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    res.status(500).send(err)
  }
}

// PUT (Update toy)
async function updateToy(req, res) {
  try {
    const toy = req.body
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)
  } catch (err) {
    res.status(500).send(err)
  }
}

// DELETE (Remove bug)
async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const removedId = await toyService.remove(toyId)
    res.send(removedId)
  } catch (err) {
    res.status(500).send(err)
  }
}

async function addReview(req, res) {
  const toyId = req.params.id
  const review = req.body
  try {
    const addedReview = await toyService.addReview(review, toyId)
    res.send(addedReview)
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  addReview,
}
