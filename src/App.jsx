import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image_url: ''});
  const [editBook, setEditBook] = useState(null);
  const uri = 'https://symmetrical-sniffle-694jwv46jgr5hxxrx-5001.app.github.dev/'
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${uri}/books`);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleCreateBook = async () => {
    try {
      const response = await axios.post(`${uri}/books`, newBook);
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', image_url: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleEditBook = (book) => {
    console.log("Editing book:", book); // ✅ Debugging
    setEditBook({ ...book });
  };
  

  const handleUpdateBook = async () => {
    try {
      console.log("Updating book with ID:", editBook._id); 
      console.log("Updating data:", editBook); // ✅ Debugging ข้อมูลที่ส่งไป
      
      const response = await axios.put(`${uri}/books/${editBook._id}`, {
        title: editBook.title,
        author: editBook.author,
        image_url: editBook.image_url
      });

      console.log("Response:", response.data); // ✅ Debugging ตรวจสอบ Response จาก Backend

      const updatedBooks = books.map((book) =>
        book._id === editBook._id ? response.data : book
      );

      setBooks(updatedBooks);
      setEditBook(null); // Clear edit mode
    } catch (error) {
      console.error('Error updating book:', error.response?.data || error);
    }
};

  
  

  const handleDeleteBook = async (bookId) => {
    try {
      console.log("Attempting to delete book with ID:", bookId); // Debugging
      await axios.delete(`${uri}/books/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };
  

  return (
    <div>
      <h1>Book List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book._id}</td>
              <td>
                {editBook && editBook._id === book._id ? (
                  <input
                    type="text"
                    name="image_url"
                    value={editBook.image_url}
                    onChange={handleInputChange}
                  />
                ) : (
                  <img src={book.image_url} alt={book.title} width="50" />
                )}
              </td>
              <td>
                {editBook && editBook._id === book._id ? (
                  <input
                    type="text"
                    name="title"
                    value={editBook.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editBook && editBook._id === book._id ? (
                  <input
                    type="text"
                    name="author"
                    value={editBook.author}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editBook && editBook._id === book._id ? (
                  <button onClick={handleUpdateBook}>Update</button>
                ) : (
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                )}
                <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Book</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newBook.title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={newBook.author}
        onChange={handleInputChange}
      />
      <input  
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={newBook.image_url}
        onChange={handleInputChange}
      />
      <button onClick={handleCreateBook}>Create</button>
    </div>
  );
};

export default App;