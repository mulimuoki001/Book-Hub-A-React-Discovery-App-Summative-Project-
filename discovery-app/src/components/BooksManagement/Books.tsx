import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, deleteaBook, fetchBooks } from "../../redux/slices/bookSlice";
import { RootState } from "../../redux/store";
import "./Books.css";


const BookComponent = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const { books, error, status } = useSelector((state: RootState) => state.book);
    const [filterBy, setFilterBy] = useState("id");
    const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"id" | "title" | "author">("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deleteBook, setDeleteBook] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 6;
    const [expandedBook, setExpandedBook] = useState<string | null>(null);
    const handleSelectedBook = (_id: string) => {
        setSelectedBook(_id);
        if(_id){
            document.body.classList.add('book-selected');
        }else{
            document.body.classList.remove('book-selected');
        }
    }
    const [selectedBook, setSelectedBook] = useState<string | null>(null);
    const [newBook, setNewBook] = useState(
        {
            title: "",
            description: "",
            coverImage: "",
            author: "",
            genre: "",
        }
    );
    const [showForm, setShowForm] = useState(false);


    

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBook.title || !newBook.description || !newBook.coverImage || !newBook.author || !newBook.genre) {
            const missingFields = [];
            if (!newBook.title) missingFields.push("Title");
            if (!newBook.description) missingFields.push("Description");
            if (!newBook.coverImage) missingFields.push("Cover Image");
            if (!newBook.author) missingFields.push("Author");
            if (!newBook.genre) missingFields.push("Genre");
            console.log(missingFields);
            setErrorMessage(`Please fill in the following fields: ${missingFields.join(", ")}`);
            return;

        }
        try {
            (dispatch as any)(addBook(newBook)).unwrap().then(() => {
                setErrorMessage(null);
                setShowForm(false);
            }).catch(() => {
                setErrorMessage("Something went wrong");
            })
        } catch (error) {
        if (error instanceof Error) {
            setErrorMessage(error.message);
        }
        }
    };
    const handleDeleteBook = async (_id: string) => {
        (dispatch as any)(deleteaBook(_id)).unwrap().then(() => {
            deleteBook && setDeleteBook(null);
            setDeleteStatus("deleted");
            setTimeout(() => {
                setDeleteStatus(null);
            },5000
        )
        }).catch(() => {
            setDeleteStatus("failed");
        })
    };

    useEffect(() => {
        if(status === "idle"){
         (dispatch as any)(fetchBooks());
        }
     }, [dispatch, status]);

     useEffect(() => {
         if(expandedBook){
             const expandedBookElement = document.getElementById(expandedBook);
             if (expandedBookElement) {
                 expandedBookElement.scrollIntoView({ behavior: "smooth", block: "center" });
             }
         }
     }, [expandedBook]);
    const filteredBooks = books.filter(book =>{
        if(!book) return false;
        const query = searchQuery.toLowerCase();
        if(filterBy === "id" && book._id.includes(query)) return true;
        if(filterBy === "title" && book.title.toLowerCase().includes(query)) return true;
        if(filterBy === "author" && book.author.toLowerCase().includes(query)) return true;
        if(filterBy === "genre" && book.genre.toLowerCase().includes(query)) return true;
        return false;}
    );

    // Sort books
    const sortedBooks = filteredBooks.sort((a, b) => {
        if (a[sortBy as keyof typeof a] < b[sortBy as keyof typeof b]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy as keyof typeof a] > b[sortBy as keyof typeof b]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });


    //Pagination
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    

    
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const toggleExpandBook = (_id: string) => {
        if (expandedBook === _id) {
            setExpandedBook(null);
        } else {
            setExpandedBook(_id);
        }
    };
    const handleOverlayClick = () => {
        setExpandedBook(null);
    }
    return (
        <div className={`book-container ${expandedBook ? "blur-background" : ""}`}>
            {expandedBook && <div className="overlay" onClick={handleOverlayClick}></div>}
            {error && <p className="error">{error}</p>}
            <div className="search-container">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "id" | "title" | "author")}>
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by ID, Title, Author, Genre"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="_id">ID</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="genre">Genre</option>
                </select>
                
            </div>
            {!showForm && (
                <button className="add-book-button" onClick={() => setShowForm(true)}>Add New Book</button>
            )}
            
            
            {/* Form to add a new book */}
            {showForm && (
                <form className="book-form" onSubmit={handleAddBook}>
                    <h4>Add New Book to the Collection</h4>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                <div className="input-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} 
                    placeholder="Enter the title of the book"/>

                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <input type="text" id="description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} 
                    placeholder="Enter the description of the book"/>

                </div>
                <div className="input-group">
                    <label htmlFor="coverImage">Cover Image:</label>
                    <input type="text" id="coverImage" value={newBook.coverImage} onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })} 
                    placeholder="Enter the cover image URL of the book"/>

                </div>
                <div className="input-group">
                    <label htmlFor="author">Author/s:</label>
                    <input type="text" id="author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} 
                    placeholder="Enter the author of the book"/>

                </div>
                <div className="input-group">
                    <label htmlFor="genre">Genre:</label>
                    <input type="text" id="genre" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} 
                    placeholder="Enter the genre of the book"/>

                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <div className="form-buttons">
                    <button className="add-book-button" type="submit">Add Book</button>
                    <button className="cancel-button1" type="button" onClick={() => setShowForm(false)}>Cancel</button>

                </div>
            </form>
            )}
            <h2>Available Books</h2>
              {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1} className="page-button">Previous</button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="page-button">Next</button>
                </div>
            )}
            {status === "loading" && <p>Loading...</p>}
            {deleteStatus === "deleted" && <p style={{color: deleteStatus === "deleted" ? "green" : "red"}}>Book deleted successfully</p>}
            {status === "failed" && <p>Something went wrong</p>}
            <ul className="book-list">
                {currentBooks.length > 0 ? (
                    currentBooks.map((book) => (
                        <li key={book._id} className={`book-item ${selectedBook=== book._id ? 'selected' : ''}`} onClick={() => handleSelectedBook(selectedBook === book._id ? '' : book._id)}>
                            <img className="book-cover" src={book.coverImage} alt={book.title} />
                            <h3 className="book-title">Book Title: {book.title}</h3>
                            <p className="book-author">Author: {book.author}</p>
                            <p>Genre: {book.genre}</p>
                            
                            <p className="book-details"> {expandedBook === book._id ? book.description : `${book.description.split(' ').slice(0, 10).join('.')}...`}
                                {book.description.split(',').length > 1 && expandedBook !== book._id && (
                                    <span className="read-more" onClick={() => toggleExpandBook(book._id)} style={{ cursor: 'pointer'  ,color: ' rgb(10, 99, 232)', fontStyle: 'italic'}}>
                                        Read more
                                    </span>
                                )}
                            </p>

                            <button className="delete-button1" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No books found</p>
                )
                }
            </ul>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1} className="page-button">Previous</button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="page-button">Next</button>
                </div>
            )}
        </div>
    );
};

export default BookComponent;