import React, { useState, useEffect } from 'react';
import { getBooks, createBook, deleteBook, updateBook, getBookById, type Book } from '../services/bookService';
import './BookList.css';

type NewBook = {
    title: string;
    current_price: number;
    stock_quantity: number;
    author_id: number;
    genre_id: number;
};

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [newBook, setNewBook] = useState<NewBook>({
        title: '',
        current_price: 0,
        stock_quantity: 0,
        author_id: 0,
        genre_id: 0,
    });
    const [bookIdToFind, setBookIdToFind] = useState<number | ''>('');
    const [bookIdToUpdate, setBookIdToUpdate] = useState<number | ''>('');
    const [updatedBook, setUpdatedBook] = useState<Partial<NewBook>>({});
    const [bookIdToDelete, setBookIdToDelete] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            const booksData = await getBooks();
            setBooks(booksData.sort((a, b) => a.book_id - b.book_id));
        } catch (error: unknown) {
            setErrorMessage('Ошибка при получении книг');
        }
    };

    const handleAddBook = async () => {
        if (!newBook.title.trim() || newBook.current_price <= 0 || newBook.stock_quantity <= 0 || newBook.author_id <= 0 || newBook.genre_id <= 0) {
            setErrorMessage('Пожалуйста, заполните все поля корректно');
            return;
        }

        try {
            const existingBook = books.find(book => 
                book.title === newBook.title &&
                book.author.author_id === newBook.author_id &&
                book.genre.genre_id === newBook.genre_id
            );

            if (existingBook) {
                setErrorMessage('Книга с такими данными уже существует');
                return;
            }

            await createBook({
                title: newBook.title,
                current_price: newBook.current_price,
                stock_quantity: newBook.stock_quantity,
                author_id: newBook.author_id,
                genre_id: newBook.genre_id
            });
            
            setNewBook({ title: '', current_price: 0, stock_quantity: 0, author_id: 0, genre_id: 0 });
            fetchBooks();
        } catch (error: unknown) {
            setErrorMessage('Ошибка при добавлении книги: ' + (error as Error).message);
        }
    };

    const handleDeleteBook = async () => {
        if (bookIdToDelete && bookIdToDelete > 0) {
            try {
                await deleteBook(bookIdToDelete);
                setBookIdToDelete('');
                fetchBooks();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при удалении книги: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для удаления');
        }
    };

    const handleFindBook = async () => {
        if (bookIdToFind && bookIdToFind > 0) {
            try {
                const book = await getBookById(bookIdToFind);
                if (book) {
                    alert(`Книга найдена: ${book.title}, Автор: ${book.author.author_name}, Жанр: ${book.genre.genre_name}, Цена: ${book.current_price}, Количество: ${book.stock_quantity}`);
                } else {
                    setErrorMessage('Книга не найдена');
                }
            } catch (error: unknown) {
                setErrorMessage('Ошибка при поиске книги: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID');
        }
    };

    const handleUpdateBook = async () => {
        if (bookIdToUpdate && bookIdToUpdate > 0) {
            // Проверяем, что хотя бы одно поле изменено
            if (!updatedBook.title && updatedBook.current_price === undefined && updatedBook.stock_quantity === undefined && updatedBook.author_id === undefined && updatedBook.genre_id === undefined) {
                setErrorMessage('Необходимо изменить хотя бы одно поле');
                return;
            }

            try {
                await updateBook(bookIdToUpdate, updatedBook);
                setBookIdToUpdate('');
                setUpdatedBook({});
                fetchBooks();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при обновлении книги: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для обновления');
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="book-list-container">
            <h1>Список книг</h1>
            <div className="table-container">
                <table className="book-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Автор</th>
                            <th>Жанр</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.book_id}>
                                <td>{book.book_id}</td>
                                <td>{book.title}</td>
                                <td>{book.current_price}</td>
                                <td>{book.stock_quantity}</td>
                                <td>{book.author.author_name}</td>
                                <td>{book.genre.genre_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Название книги"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    />
                    <input
                        type="number" 
                        placeholder="Цена книги"
                        value={newBook.current_price || ''}
                        onChange={(e) => {
                            const price = parseFloat(e.target.value);
                            if (!isNaN(price)) {
                                setNewBook({ ...newBook, current_price: price });
                            }
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Количество в наличии"
                        value={newBook.stock_quantity || ''}
                        onChange={(e) => setNewBook({ ...newBook, stock_quantity: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="ID автора"
                        value={newBook.author_id || ''}
                        onChange={(e) => setNewBook({ ...newBook, author_id: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="ID жанра"
                        value={newBook.genre_id || ''}
                        onChange={(e) => setNewBook({ ...newBook, genre_id: Number(e.target.value) })}
                    />
                    <button onClick={handleAddBook}>Добавить книгу</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID книги для поиска"
                        value={bookIdToFind || ''}
                        onChange={(e) => setBookIdToFind(Number(e.target.value))}
                    />
                    <button onClick={handleFindBook}>Найти книгу по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID книги для изменения"
                        value={bookIdToUpdate || ''}
                        onChange={(e) => setBookIdToUpdate(Number(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="Новое название книги"
                        value={updatedBook.title || ''}
                        onChange={(e) => setUpdatedBook({ ...updatedBook, title: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Новая цена книги"
                        value={updatedBook.current_price || ''}
                        onChange={(e) => {
                            const price = parseFloat(e.target.value);
                            if (!isNaN(price)) {
                                setUpdatedBook({ ...updatedBook, current_price: price });
                            }
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Новое количество"
                        value={updatedBook.stock_quantity || ''}
                        onChange={(e) => setUpdatedBook({ ...updatedBook, stock_quantity: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Новый ID автора"
                        value={updatedBook.author_id || ''}
                        onChange={(e) => setUpdatedBook({ ...updatedBook, author_id: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Новый ID жанра"
                        value={updatedBook.genre_id || ''}
                        onChange={(e) => setUpdatedBook({ ...updatedBook, genre_id: Number(e.target.value) })}
                    />
                    <button onClick={handleUpdateBook}>Изменить книгу по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID книги для удаления"
                        value={bookIdToDelete || ''}
                        onChange={(e) => setBookIdToDelete(Number(e.target.value))}
                    />
                    <button onClick={handleDeleteBook}>Удалить книгу по ID</button>
                </div>
            </div>

            {errorMessage && (
                <div className="error-popup">
                    <div className="error-message">
                        <span>{errorMessage}</span>
                        <button className="close-button" onClick={handleCloseError}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;



