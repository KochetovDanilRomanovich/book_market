import axios from 'axios';

const API_URL = 'http://localhost:3000/api/authors'; 

export interface Author {
    author_id?: number; 
    author_name: string; 
}

export const getAuthors = async (): Promise<Author[]> => {
    const response = await axios.get<{ data: Author[] }>(API_URL);
    return response.data.data; 
};

export const getAuthorById = async (id: number): Promise<Author> => {
    const response = await axios.get<Author>(`${API_URL}/${id}`);
    return response.data; 
};

export const createAuthor = async (author: Author): Promise<Author> => {
    const response = await axios.post<Author>(API_URL, author);
    return response.data;
};

export const updateAuthor = async (id: number, updatedData: { author_name: string }): Promise<Author> => {
    const response = await axios.patch<Author>(`${API_URL}/${id}`, updatedData);
    return response.data; 
};

export const deleteAuthor = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
