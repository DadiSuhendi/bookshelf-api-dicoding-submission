const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const id = nanoid(16)
  let finished = false
  if (pageCount === readPage) {
    finished = true
  }
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt
  }
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
}

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query
  let filteredName
  let filteredReading
  let filteredFinished
  if (name) {
    filteredName = books.filter((book) => book.name.toLowerCase() === name.toLowerCase())
  } else if (reading) {
    filteredReading = books.filter((book) => {
      if (reading == 0) {
        return book.reading === false
      } else if (reading == 1) {
        return book.reading === true
      } else {
        return book
      }
    })
  } else if (finished) {
    filteredFinished = books.filter((book) => {
      if (finished == 0) {
        return book.finished === false
      } else if (finished == 1) {
        return book.finished === true
      } else {
        return book
      }
    })
  }

  let showBooks
  if (filteredName !== undefined) {
    showBooks = filteredName.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  } else if (filteredReading !== undefined) {
    showBooks = filteredReading.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  } else if (filteredFinished !== undefined) {
    showBooks = filteredFinished.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  } else {
    showBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  }
  return {
    status: 'success',
    data: {
      books: showBooks
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.findIndex((book) => book.id === bookId)

  if (book === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    books.splice(book, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
}
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
