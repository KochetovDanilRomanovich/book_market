import axios from 'axios';

export type Book = {
    book_id: number;
    title: string;
    current_price: number;
    stock_quantity: number;
    author: {
        author_id: number;
        author_name: string;
    };
    genre: {
        genre_id: number;
        genre_name: string;
    };
};

type CreateBookDto = {
    title: string;
    current_price: number;
    stock_quantity: number;
    author_id: number;
    genre_id: number;
};

type UpdateBookDto = Partial<CreateBookDto>;

const API_URL = 'http://localhost:3000/api/books'; 

export const getBooks = async (): Promise<Book[]> => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

export const createBook = async (book: CreateBookDto): Promise<Book> => {
    const response = await axios.post(API_URL, book);
    return response.data;
};

export const updateBook = async (bookId: number, book: UpdateBookDto): Promise<Book> => {
    const response = await axios.patch(`${API_URL}/${bookId}`, book);
    return response.data;
};

export const deleteBook = async (bookId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${bookId}`);
};

export const getBookById = async (bookId: number): Promise<Book | null> => {
    const response = await axios.get(`${API_URL}/${bookId}`);
    return response.data || null;
};
