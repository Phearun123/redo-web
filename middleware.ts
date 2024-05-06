import { withAuth } from "next-auth/middleware"
export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            return !!token;
        }
    },
    pages: {
        signIn: '/login',
    }
})

export const config = {
    matcher: [
        "/sale/e-invoice/:path*",
        "/sale/pos-invoice",
        "/sale/status/:path*",
        "/sale/parking",
        "/customers",
    ]
}
