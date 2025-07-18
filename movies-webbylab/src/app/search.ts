import {createSlice} from '@reduxjs/toolkit';

 const initialState = {
    results: [],
    totalResults: 0,
    page: 0,
    totalPages: 0,
    isLoading: false,
 };

const searchSlice = createSlice({
    name: 'searchslice',
    initialState,
    reducers: {
        searchMovies: (state) => {
            return {
                ...state,
                isLoading: true
            };
        },
        fetchedSearchMovies: (state, action) => {
            return {
                ...state,
                isLoading: false, 
                results: action.payload.results,
                totalResults: action.payload.totalResults,
                page: action.payload.page,
                totalPages: action.payload.totalPages
            };
    },
    resetState: (state) => {
        return initialState;
    }
}
});

export const { searchMovies, fetchedSearchMovies, resetState} = searchSlice.actions;

export default searchSlice.reducer;