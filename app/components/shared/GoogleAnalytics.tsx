import Script from "next/script";

const GoogleAnalytics = ({gId}: {gId: string}) => {
    return (
        <>
            <Script  strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gId}`} />
            <Script id={gId} strategy="lazyOnload">
                    {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
     
              gtag('config', '${gId}');
            `}
            </Script>
        </>
    );
};

export default GoogleAnalytics;