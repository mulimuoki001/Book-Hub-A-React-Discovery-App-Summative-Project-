import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Book {
    _id: string,
    title: string,
    description: string,
    coverImage: string,
    author: string,
    genre: string,
    status: string
}

interface BookState {
    books: Book[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
    
}

const initialState: BookState = {
    books: [],
    error: null,
    status: 'idle'
}

export const fetchBooks = createAsyncThunk('book/fetchBooks', async () => {
    const response = await axios.get('http://localhost:5000/api/books');
    const books = response.data;
    return books
});
export const addBook = createAsyncThunk('book/addBook', async ({title, description, coverImage, author, genre}: {title: string, description: string, coverImage: string, author: string, genre: string}, {rejectWithValue}) => {
    try{
        const response = await axios.post('http://localhost:5000/api/books', {title, description, coverImage, author, genre});
        const book = response.data;

        return book;
    }catch(error: any){
        const errorData = error.response?.data.message || "Something went wrong";
        console.log(errorData);
        return rejectWithValue(errorData);
    }
})

export const deleteaBook = createAsyncThunk('book/deleteBook', async (_id: string, {rejectWithValue}) => {
    try{
        console.log("Deleting a book with id:", _id);
        await axios.delete(`http://localhost:5000/api/books/${_id}`);
    }catch(error: any){
        const errorData = error.response?.data.message || "Something went wrong";
        console.log(errorData);
        return rejectWithValue(errorData);
    }
})
const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        
        deleteBook: (state, action: PayloadAction<string>) => {
            state.books = state.books.filter(book => book._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.books = action.payload;
        });
        builder.addCase(fetchBooks.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchBooks.rejected, (state, action) => {
            state.error = action.error.message || "Something went wrong";
            state.status = 'failed';
        })
        builder.addCase(addBook.fulfilled, (state, action) => {
            state.books.push(action.payload);
            state.status = 'succeeded';

        });
        builder.addCase(addBook.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(addBook.rejected, (state, action) => {
            state.error = action.error.message || "Something went wrong";
            state.status = 'failed';
        })
        builder.addCase(deleteaBook.fulfilled, (state, action) => {
            state.books = state.books.filter(book => book._id !== action.meta.arg);
            state.status = 'succeeded';
        });
        builder.addCase(deleteaBook.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(deleteaBook.rejected, (state, action) => {
            state.error = action.error.message || "Something went wrong";
            state.status = 'failed';
        })

    }
})

export const { deleteBook} = bookSlice.actions;
export default bookSlice.reducer

