import {create} from "zustand";


export const useForgotUserIDStore = create<{
    titel: any,
    openHeader: boolean,
    openForgotID: boolean,
    openForgotPassword: boolean,
    setOpenForgotPassword: (openForgotPassword: boolean) => void,
    setOpenForgotID: (openForgotID: boolean) => void
    setOpenHeader: (openHeader: boolean) => void
    setTitle: (titel: any) => void

}>(set => ({
    openForgotID: true,
    openForgotPassword: false,
    openHeader: false,
    titel: 'Recover forgotten ID or password',
    setTitle: (titel: any) => set((state): any => ({...state, titel})),
    setOpenHeader: (openHeader: boolean) => set((state): any => ({...state, openHeader})),
    setOpenForgotID: (openForgotID: boolean) => set((state): any => ({...state, openForgotID})),
    setOpenForgotPassword: (openForgotPassword: boolean) => set((state): any => ({...state, openForgotPassword})),

}))
export const useLoginStore = create<{
    userId: any,
    setUserId: (userId: any) => void
}>(set => ({
    userId: '',
    setUserId: (userId: any) => set((state): any => ({...state, userId})),
}));

