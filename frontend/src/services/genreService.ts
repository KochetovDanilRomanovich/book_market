import axios from 'axios';

const API_URL = 'http://localhost:3000/api/genres';

export interface Genre {
    genre_id?: number;
    genre_name: string;
}

export const getGenres = async (): Promise<Genre[]> => {
    const response = await axios.get<{ data: Genre[] }>(API_URL);
    return response.data.data;
};

export const getGenreById = async (id: number): Promise<Genre> => {
    const response = await axios.get<Genre>(`${API_URL}/${id}`);
    return response.data;
};

export const createGenre = async (genre: Genre): Promise<Genre> => {
    const response = await axios.post<Genre>(API_URL, genre);
    return response.data;
};

export const updateGenre = async (id: number, updatedData: { genre_name: string }): Promise<Genre> => {
    const response = await axios.patch<Genre>(`${API_URL}/${id}`, updatedData);
    return response.data;
};

export const deleteGenre = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
