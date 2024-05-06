import {PropsWithChildren} from 'react';
import  "@/app/styles/css/normalize.css"
import  "@/app/styles/css/webflow.css"
import  "@/app/styles/css/redo.webflow.css"
import GoogleAnalytics from "@/app/components/shared/GoogleAnalytics";

export default function HomeLayout ({children}: PropsWithChildren) {

    return (
        <html lang="en" data-wf-page="6523ce388fee5f8e73eed19f" data-wf-site="6523ce388fee5f8e73eed1a6" suppressHydrationWarning={true} data-new-gr-c-s-check-loaded="14.3.2">
            <body className="body" style={{overflowX: "hidden"}}>
            {children}
            </body>
            <GoogleAnalytics gId={process.env.NEXT_PUBLIC_REDO_GOOGLE_ANALYTICS!}/>
            <GoogleAnalytics gId={process.env.NEXT_PUBLIC_REDO_KOREA_GOOGLE_ANALYTICS!}/>
        </html>
    );
};
