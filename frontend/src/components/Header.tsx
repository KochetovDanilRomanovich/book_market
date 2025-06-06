import React from 'react';
import './Header.css'; 

const Header: React.FC = () => {
    const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        event.preventDefault(); 
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
    };

    return (
        <header className="header">
            <div className="logo">
                <a href="#home" className="logo-link" onClick={(e) => scrollToSection(e, 'home')}>BookMarket</a>
            </div>
            <nav className="nav">
                <ul>
                    <li><a href="#books" onClick={(e) => scrollToSection(e, 'home')}>Книги</a></li>
                    <li><a href="#authors" onClick={(e) => scrollToSection(e, 'authors')}>Авторы</a></li>
                    <li><a href="#genres" onClick={(e) => scrollToSection(e, 'genres')}>Жанры</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;


