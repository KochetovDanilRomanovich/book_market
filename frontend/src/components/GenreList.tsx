import React, { useState, useEffect } from 'react';
import { getGenres, createGenre, deleteGenre, updateGenre, getGenreById, type Genre } from '../services/genreService';
import './GenreList.css'; 

const GenreList: React.FC = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [newGenre, setNewGenre] = useState<Genre>({ genre_name: '' });
    const [genreIdToFind, setGenreIdToFind] = useState<number | ''>('');
    const [genreIdToUpdate, setGenreIdToUpdate] = useState<number | ''>('');
    const [updatedGenreName, setUpdatedGenreName] = useState<string>('');
    const [genreIdToDelete, setGenreIdToDelete] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchGenres = async () => {
        try {
            const genresData = await getGenres();
            setGenres(genresData.sort((a, b) => (a.genre_id || 0) - (b.genre_id || 0)));
        } catch (error: unknown) {
            setErrorMessage('Ошибка при получении жанров');
        }
    };

    const handleAddGenre = async () => {
        const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;

        if (!newGenre.genre_name.trim()) {
            setErrorMessage('Название жанра не может быть пустым');
            return;
        }

        if (!namePattern.test(newGenre.genre_name)) {
            setErrorMessage('Название жанра должно содержать только буквы');
            return;
        }

        try {
            const existingGenre = await getGenreByName(newGenre.genre_name);
            if (existingGenre) {
                setErrorMessage('Жанр с таким названием уже существует');
                return;
            }

            await createGenre(newGenre);
            setNewGenre({ genre_name: '' });
            fetchGenres();
        } catch (error: unknown) {
            setErrorMessage('Ошибка при добавлении жанра: ' + (error as Error).message);
        }
    };

    const handleDeleteGenre = async () => {
        if (genreIdToDelete && genreIdToDelete > 0) {
            try {
                await deleteGenre(genreIdToDelete);
                setGenreIdToDelete('');
                fetchGenres();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при удалении жанра: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для удаления');
        }
    };

    const handleFindGenre = async () => {
        if (genreIdToFind && genreIdToFind > 0) {
            try {
                const genre = await getGenreById(genreIdToFind);
                if (genre) {
                    alert(`Жанр найден: ${genre.genre_name}`);
                } else {
                    setErrorMessage('Жанр не найден');
                }
            } catch (error: unknown) {
                setErrorMessage('Ошибка при поиске жанра: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID');
        }
    };

    const handleUpdateGenre = async () => {
        const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;

        if (genreIdToUpdate && genreIdToUpdate > 0 && updatedGenreName) {
            if (!namePattern.test(updatedGenreName)) {
                setErrorMessage('Новое название жанра должно содержать только буквы');
                return;
            }

            try {
                await updateGenre(genreIdToUpdate, { genre_name: updatedGenreName });
                setGenreIdToUpdate('');
                setUpdatedGenreName('');
                fetchGenres();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при обновлении жанра: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для обновления и новое название жанра');
        }
    };

    const getGenreByName = async (genreName: string): Promise<Genre | null> => {
        try {
            const genresData = await getGenres();
            const existingGenre = genresData.find(genre => genre.genre_name === genreName);
            return existingGenre || null;
        } catch (error: unknown) {
            setErrorMessage('Ошибка при поиске жанра по названию: ' + (error as Error).message);
            return null;
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    return (
        <div className="genre-list-container">
            <h1>Список жанров</h1>
            <div className="table-container">
                <table className="genre-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название жанра</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres.map(genre => (
                            <tr key={genre.genre_id}>
                                <td>{genre.genre_id}</td>
                                <td>{genre.genre_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Название жанра"
                        value={newGenre.genre_name}
                        onChange={(e) => setNewGenre({ ...newGenre, genre_name: e.target.value })}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleAddGenre}>Добавить жанр</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID жанра для поиска"
                        value={genreIdToFind || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setGenreIdToFind(value);
                            } else {
                                setGenreIdToFind('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleFindGenre}>Найти жанр по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID жанра для изменения"
                        value={genreIdToUpdate || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setGenreIdToUpdate(value);
                            } else {
                                setGenreIdToUpdate('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <input
                        type="text"
                        placeholder="Новое название жанра"
                        value={updatedGenreName}
                        onChange={(e) => setUpdatedGenreName(e.target.value)}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleUpdateGenre}>Изменить жанр по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID жанра для удаления"
                        value={genreIdToDelete || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setGenreIdToDelete(value);
                            } else {
                                setGenreIdToDelete('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleDeleteGenre}>Удалить жанр по ID</button>
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

export default GenreList;
