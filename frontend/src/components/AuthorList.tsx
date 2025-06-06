import React, { useState, useEffect } from 'react';
import { getAuthors, createAuthor, deleteAuthor, updateAuthor, getAuthorById, type Author } from '../services/authorService';
import './AuthorList.css'; 

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [newAuthor, setNewAuthor] = useState<Author>({ author_name: '' });
    const [authorIdToFind, setAuthorIdToFind] = useState<number | ''>('');
    const [authorIdToUpdate, setAuthorIdToUpdate] = useState<number | ''>('');
    const [updatedAuthorName, setUpdatedAuthorName] = useState<string>('');
    const [authorIdToDelete, setAuthorIdToDelete] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchAuthors = async () => {
        try {
            const authorsData = await getAuthors();
            setAuthors(authorsData.sort((a, b) => (a.author_id || 0) - (b.author_id || 0)));
        } catch (error: unknown) {
            setErrorMessage('Ошибка при получении авторов');
        }
    };

    const handleAddAuthor = async () => {
        const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;

        if (!newAuthor.author_name.trim()) {
            setErrorMessage('Имя автора не может быть пустым');
            return;
        }

        if (!namePattern.test(newAuthor.author_name)) {
            setErrorMessage('Имя автора должно содержать только буквы');
            return;
        }

        try {
            const existingAuthor = await getAuthorByName(newAuthor.author_name);
            if (existingAuthor) {
                setErrorMessage('Автор с таким именем уже существует');
                return;
            }

            await createAuthor(newAuthor);
            setNewAuthor({ author_name: '' });
            fetchAuthors();
        } catch (error: unknown) {
            setErrorMessage('Ошибка при добавлении автора: ' + (error as Error).message);
        }
    };

    const handleDeleteAuthor = async () => {
        if (authorIdToDelete && authorIdToDelete > 0) {
            try {
                await deleteAuthor(authorIdToDelete);
                setAuthorIdToDelete('');
                fetchAuthors();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при удалении автора: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для удаления');
        }
    };

    const handleFindAuthor = async () => {
        if (authorIdToFind && authorIdToFind > 0) {
            try {
                const author = await getAuthorById(authorIdToFind);
                if (author) {
                    alert(`Автор найден: ${author.author_name}`);
                } else {
                    setErrorMessage('Автор не найден');
                }
            } catch (error: unknown) {
                setErrorMessage('Ошибка при поиске автора: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID');
        }
    };

    const handleUpdateAuthor = async () => {
        const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;

        if (authorIdToUpdate && authorIdToUpdate > 0 && updatedAuthorName) {
            if (!namePattern.test(updatedAuthorName)) {
                setErrorMessage('Новое имя автора должно содержать только буквы');
                return;
            }

            try {
                await updateAuthor(authorIdToUpdate, { author_name: updatedAuthorName });
                setAuthorIdToUpdate('');
                setUpdatedAuthorName('');
                fetchAuthors();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при обновлении автора: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для обновления и новое имя автора');
        }
    };

    const getAuthorByName = async (authorName: string): Promise<Author | null> => {
        try {
            const authorsData = await getAuthors();
            const existingAuthor = authorsData.find(author => author.author_name === authorName);
            return existingAuthor || null;
        } catch (error: unknown) {
            setErrorMessage('Ошибка при поиске автора по имени: ' + (error as Error).message);
            return null;
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    return (
        <div className="author-list-container">
            <h1>Список авторов</h1>
            <div className="table-container">
                <table className="author-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя автора</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map(author => (
                            <tr key={author.author_id}>
                                <td>{author.author_id}</td>
                                <td>{author.author_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Имя автора"
                        value={newAuthor.author_name}
                        onChange={(e) => setNewAuthor({ ...newAuthor, author_name: e.target.value })}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleAddAuthor}>Добавить автора</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID автора для поиска"
                        value={authorIdToFind || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setAuthorIdToFind(value);
                            } else {
                                setAuthorIdToFind('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleFindAuthor}>Найти автора по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID автора для изменения"
                        value={authorIdToUpdate || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setAuthorIdToUpdate(value);
                            } else {
                                setAuthorIdToUpdate('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <input
                        type="text"
                        placeholder="Новое имя автора"
                        value={updatedAuthorName}
                        onChange={(e) => setUpdatedAuthorName(e.target.value)}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleUpdateAuthor}>Изменить автора по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID автора для удаления"
                        value={authorIdToDelete || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setAuthorIdToDelete(value);
                            } else {
                                setAuthorIdToDelete('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleDeleteAuthor}>Удалить автора по ID</button>
                </div>
            </div>

            {errorMessage && (
                <div className="error-popup">
                    <div className="error-message">
                        <span>{errorMessage}</span>
                        <button onClick={handleCloseError} className="close-button">Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorList;



