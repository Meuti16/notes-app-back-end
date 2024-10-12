// 3. membuat fungsi handler (logika) untuk menangani setiap permintaan
const { nanoid } = require('nanoid'); // jangan lupa untuk mengimpor terlebih dahulu nanoid dari package nya
const notes = require('./notes');
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload; // properti ini saja yang akan kita dapatkan dari client sisanya kita olah sendiri
  // pertama untuk mendapatkan properti id yang merupakan string dan harus unik kita akan menggunakan library nanoid
  // untuk menginstall library nanoid menggunakan perintah : npm install nanoid@3
  // untuk menggunakannya cukup dengan memanggil method nanoid() dan memberikan parameter number yang merupakan ukuran dari stringnya.

  const id = nanoid(16); // panjang dari id nya kita tetapkan 16
  // kedua untuk property createdAt dan updatedAt kita bisa memberikan nilai newDate().toISOString();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  // membuat objek baru bernama newNote yang berisi beberapa properti yang telah didefiniskan sebelumnya dengan nama yang sama.
  // memasukan nilai nilai tsb ke dalam array notes menggunakan method push().
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };
  notes.push(newNote); // jangan lupa mengimpor array notes pada berkas note.js
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    ststus: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  }
});
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id) [0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: ' Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler };