const dbService = require('../../services/db.service')
const utilService = require('../../services/utilService.js')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
  //maybe need to add filter here
  const criteria = _buildCriteria(filterBy)
  // const criteria = {};

  const collection = await dbService.getCollection('toy')
  var toys = await collection.find(criteria).toArray()
  return toys
}

async function getById(toyId) {
  const collection = await dbService.getCollection('toy')
  const toy = collection.findOne({ _id: ObjectId(toyId) })
  return toy
}

async function remove(toyId) {
  const collection = await dbService.getCollection('toy')
  await collection.deleteOne({ _id: ObjectId(toyId) })
  return toyId
}

async function add(toy) {
  const collection = await dbService.getCollection('toy')
  const addedToy = await collection.insertOne(toy)
  return addedToy
}
async function update(toy) {
  var id = ObjectId(toy._id)
  delete toy._id
  const collection = await dbService.getCollection('toy')
  await collection.updateOne({ _id: id }, { $set: { ...toy } })
  return toy
}

async function addReview(review, toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    review.id = utilService.makeId()
    review.createdAt = Date.now()
    await collection.updateOne(
      { _id: ObjectId(toyId) },
      { $push: { reviews: review } }
    )
    return review
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addReview,
}

function _createToys() {
  return [
    _createToy('Bobo', 120),
    _createToy('Mikmik', 80),
    _createToy('Puki the bear', 30),
    _createToy('Toy car'),
    _createToy('Baby doll', 60),
  ]
}

function _createToy(name = 'Unknown', price = 35) {
  return {
    _id: _makeId(),
    name,
    price,
    type: _getRandomType(),
    inStock: true,
    createdAt: Date.now(),
  }
}
function _getRandomType() {
  const types = ['Educational', 'Funny', 'Adult']
  const randIdx = Math.floor(Math.random() * types.length)
  return types[randIdx]
}

function _buildCriteria(filterBy = {}) {
  const criteria = {}

  console.log('function_buildCriteria -> filterBy', filterBy)
  if (filterBy.name) {
    criteria.name = { $regex: new RegExp(filterBy.name, 'ig') }
  }
  if (filterBy.type !== 'All' && filterBy.type) {
    criteria.labels = filterBy.type
  }
  if (filterBy.inStock) {
    criteria.inStock = true
  }
  if (filterBy.minPrice || filterBy.maxPrice) {
    criteria.price = {
      $gte: +filterBy.minPrice || 0,
      $lte: +filterBy.maxPrice || Infinity,
    }
  }

  return criteria
}
