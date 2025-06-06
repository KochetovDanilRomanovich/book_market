import React from 'react';
import AuthorList from './components/AuthorList';
import GenreList from './components/GenreList';
import BookList from './components/BookList';
import Header from './components/Header';

const App: React.FC = () => {
    return (
        <div>
            <Header />
            <div id="home" style={{ paddingTop: '60px' }}> {/* Отступ для фиксированного Header */}
                <BookList />
            </div>
            <div id="authors">
                <AuthorList />
            </div>
            <div id="genres">
                <GenreList />
            </div>
        </div>
    );
};

export default App;


