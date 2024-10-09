import { create } from "zustand";
import {persist} from 'zustand/middleware'

const useUserstore = create(persist((set) => ({
    currentUser: null,
    error: null,
    loading: false,

    signInStart: () => set({
        loading: true, error: null
    }),
    signInSuccess: (user) => set({
        currentUser: user, loading: false, error: null
    }),
    signInFailure: (error) => set({
        error, loading: false
    }),

    updateStart: () => set({
        loading: true, error: null
    }),
    updateSuccess: (user) => set({
        currentUser: user, loading: false, error: null
    }),
    updateFailure: (error) => set({
        loading: false, error
    }),

    deleteStart: () => set({
        loading: true, error: null
    }),
    deleteSuccess: () => set({
        currentUser: null, loading: false, error: null
    }),
    deleteFailure: (error) => ({
        loading: false, error
    }),

    signOutSuccess: () => set({
        currentUser: null, loading: false, error: null
    }),
}),
    {
        name: 'user-storage',
        getStorage: () => localStorage,
    }
))


export default useUserstore