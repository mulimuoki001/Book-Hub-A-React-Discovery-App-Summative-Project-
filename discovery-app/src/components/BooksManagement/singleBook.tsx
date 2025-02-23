import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import "./singleBook.css";

const SingleBook = () => {
    const {id} = useParams<{id:string}>();
   const book = useSelector((state:RootState) => state.book.books.find(b => b._id === id));
   if(!book){
    return <div>Book not found</div>
   }
   const navigate = useNavigate();
   const handleBack = () => {
    navigate(-1);
   }
   // Split the content into sentences based on punctuation marks.
   const sentences = book?.bookContent.match(/[^.!?]+[.!?]+/g) || []; // Match sentences ending with a punctuation mark.

   // Group sentences into paragraphs of 4 sentences each.
   const paragraphs = [];
   for (let i = 0; i < sentences.length; i += 4) {
       paragraphs.push(sentences.slice(i, i + 4).join(' '));
   }


    return (
        <div className="single-book-container"><button onClick={handleBack}>Back</button>
            <div className="single-book">
                <div className="single-book-info">
                    <img src={book?.coverImage} alt={book?.title} />
                    <h2>Title: {book?.title}</h2>
                    <h3>Author: {book?.author}</h3>
                    <h3>Year of Publication: {book?.yearOfPublication}</h3>
                    <h4>Genre: {book?.genre}</h4>
                    <p className="single-book-description">{book?.description}</p>
                </div>
                <div className='single-book-content'>
                    <h2>Book Content Summary</h2>
                    {paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SingleBook