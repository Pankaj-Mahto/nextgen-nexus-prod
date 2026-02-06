import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null, // Initialize as null, will be set to an array
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload; // Expects an array
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;