export const metadata = {
    title: 'Redo | Landing-Page',
    description: 'Powered by Redo',
}
export default function Home () {

    const baseUrl = `${process.env.NEXT_PUBLIC_REDO_BASE_URL}`
    const allowSignUp = process.env.DISABLE_REDO_SIGNUP === 'false'

    return (
        <>
            <div className="section1">
            <div className="div-block-6">
                    <div
                        data-animation="default"
                        data-collapse="small"
                        data-duration={400}
                        data-easing="ease"
                        data-easing2="ease"
                        role="banner"
                        className="navbar-logo-left-3"
                    >
                        <div className="navbarcontainer w-container">
                            <div
                                data-w-id="15695eea-2c4c-8a1f-e100-28b15506c50a"
                                style={{opacity: 0}}
                                className="navbar-content"
                            >
                                <div className="navbar-brand">
                                    <img src="/images/WeTax_Logo.svg" loading="lazy" alt=""/>
                                </div>
                                <aside role="navigation" className="navbar-menu w-nav-menu">
                                    {/*<div*/}
                                    {/*    data-hover="false"*/}
                                    {/*    data-delay={0}*/}
                                    {/*    className="dropdown w-dropdown"*/}
                                    {/*>*/}
                                    {/*    <div className="dropdown-toggle w-dropdown-toggle">*/}
                                    {/*        <img src="/images/icon_public.svg" loading="lazy" alt="" />*/}
                                    {/*        <div className="text-block-44">English</div>*/}
                                    {/*    </div>*/}
                                    {/*    <nav className="dropdown-list w-dropdown-list">*/}
                                    {/*        <a href="#" className="w-dropdown-link">*/}
                                    {/*            English*/}
                                    {/*        </a>*/}
                                    {/*        <a href="#" className="w-dropdown-link">*/}
                                    {/*            Khmer*/}
                                    {/*        </a>*/}
                                    {/*        <a href="#" className="w-dropdown-link">*/}
                                    {/*            Vietnam*/}
                                    {/*        </a>*/}
                                    {/*    </nav>*/}
                                    {/*</div>*/}
                                    {/*<a href="#" className="navbar-link w-nav-link">*/}
                                    {/*    <div className="text-13">Pricing</div>*/}
                                    {/*</a>*/}
                                    <a
                                        // href="https://wetax.com.vn/login"
                                        href={baseUrl + "/login"}
                                        className="button-15"
                                    >
                                        <div className="text-79">Sign in</div>
                                        <img
                                            src="/images/Arrow.svg"
                                            loading="lazy"
                                            width="6.9248046875"
                                            height="11.7509765625"
                                            alt="Chevron"
                                            className="vectors-wrapper-26"
                                        />
                                    </a>
                                    {allowSignUp && (
                                        <a
                                            // href="https://wetax.com.vn/signup"
                                            href={baseUrl + "/signup"}
                                            className="button-16"
                                        >
                                            <div className="text-80">Start Now</div>
                                            <img
                                                src="/images/Vectors-Wrapper_2.svg"
                                                loading="lazy"
                                                width="6.9248046875"
                                                height="11.7509765625"
                                                alt="Chevron"
                                                className="vectors-wrapper-26"
                                            />
                                        </a>
                                    )}
                                </aside>
                            </div>
                            <div
                                data-w-id="15695eea-2c4c-8a1f-e100-28b15506c526"
                                style={{opacity: 0}}
                                className="menu-button w-nav-button"
                            >
                                <div className="icon w-icon-nav-menu"/>
                            </div>
                        </div>
                    </div>
                <div className="small-container">
                    <div className="frame-5404">
                        <div
                            data-w-id="15695eea-2c4c-8a1f-e100-28b15506c52a"
                            style={{opacity: 0}}
                            className="text-17"
                        >
                            Issue e-invoice in 1 second
                        </div>
                        <div
                            data-w-id="15695eea-2c4c-8a1f-e100-28b15506c52c"
                            style={{opacity: 0}}
                            className="error-62e8c5e4-4400-c7ca-4835-4a635ae97041"
                        >
                            Perfect solution
                            <br/>
                            for issuing e-invoice
                            <br/>
                            with POS
                        </div>
                        {allowSignUp && (
                            <a
                                // href="https://wetax.com.vn/signup"
                                href={baseUrl + "/signup"}
                                data-w-id="915ecada-bd5b-d481-95da-2f8923136e9f"
                                style={{opacity: 0}}
                                className="button-23"
                            >
                                <div className="text-94">Start now</div>
                                <img
                                    src="/images/Vectors-Wrapper.svg"
                                    loading="lazy"
                                    width="11.4609375"
                                    height="19.79296875"
                                    alt="Chevron"
                                    className="vectors-wrapper-30"
                                />
                            </a>
                        )}
                    </div>
                </div>
                <div
                    data-w-id="c1003800-e8b3-84ff-4ef4-8163dce41e14"
                    style={{opacity: 0}}
                    className="mainimage"
                >
                    <div className="img-block">
                        <img
                            src="/images/Group-1000001766.svg"
                            loading="lazy"
                            alt=""
                            className="image-48"
                        />
                        <img
                            src="/images/Group-1000001807.svg"
                            loading="lazy"
                            alt=""
                            className="image-49"
                        />
                        <img
                            src="/images/Group-1000001806.svg"
                            loading="lazy"
                            alt=""
                            className="image-44"
                        />
                    </div>
                </div>
            </div>
            </div>
            <div className="section2">
            <div data-w-id="fe6eb545-494f-5aa5-53c3-bdb847d110bc" style={{opacity: 0}} className="title-section">
                    <div>
                        <p className="text-content-middle">No longer need to issue e-Invoice one by one.</p>
                        <p className="sub-text-content-middle">
                            <span className="orange">WeTax</span>&nbsp;
                            <span>will help you to</span>&nbsp;
                            <span className="orange">issue e-Invoice automatically.</span>
                        </p>
                    </div>
                </div>
                <div className="div-block-7">
                    <div
                        data-w-id="8b8af936-6dfe-138b-fbb1-e2464870ff5c"
                        style={{opacity: 0}}
                        data-current="For Business"
                        data-easing="ease-in-cubic"
                        data-duration-in={0}
                        data-duration-out={0}
                        className="tabs w-tabs"
                    >
                        <div className="tabs-menu w-tab-menu">
                            <a
                                data-w-tab="For Business"
                                data-w-id="8b8af936-6dfe-138b-fbb1-e2464870ff5e"
                                className="tab-link-for-business w-inline-block w-tab-link w--current"
                            >
                                <div className="text-block-22">For Business</div>
                            </a>
                            <a
                                data-w-tab="For Customer"
                                data-w-id="8b8af936-6dfe-138b-fbb1-e2464870ff61"
                                className="tab-link-for-customer w-inline-block w-tab-link"
                            >
                                <div className="text-block-21">For Customer</div>
                            </a>
                        </div>
                        <div className="tabs-content w-tab-content">
                            <div
                                data-w-tab="For Business"
                                className="tab-pane-for-business w-tab-pane w--tab-active"
                            >
                                <div className="for-buss">
                                    <div className="text-97">Make your work easier</div>
                                    <span
                                        className="for-buss-header">No longer need to issue e-Invoice one by one.</span>
                                </div>
                                <span className="for-buss-header1">WeTax will help you to issue POS e-invoice automatically.</span>
                                <div className="qr-block">
                                    <img loading="lazy" src="/images/Group-1000001803.svg" alt=""/>
                                    {/*custom content on image*/}
                                    <div style={{
                                        position: "absolute",
                                        backgroundColor: "#fff",
                                        width: 315,
                                        height: 100,
                                        marginTop: 375,
                                        marginBottom: 160,
                                        marginLeft: 140,
                                        marginRight: 100,
                                        textAlign: "center"
                                    }}>
                                        <p style={{
                                            fontSize: 21,
                                            lineHeight: "22px",
                                            fontWeight: "500",
                                            color: "#000000",
                                            fontFamily: "Inter, sans-serif"
                                        }}>
                                            <span>Sales data from POS will be <br/>sent to&nbsp;</span>
                                            <span style={{color: "blue", fontWeight: "bold"}}>WeTax</span> in real-time.
                                            <br/>
                                            <br/>
                                            <span style={{color: "blue", fontWeight: "bold"}}>WeTax</span> will
                                            automatically issue <br/> e-Invoices with the POS data.
                                        </p>
                                    </div>
                                    {/*end custom content on image*/}
                                </div>
                            </div>
                            <div data-w-tab="For Customer" className="tab-pane-for-customer w-tab-pane">
                                <div className="for-cust">
                                    <div className="text-97">Quick &amp; Convenient</div>
                                    <span className="for-cust-header">
                                        Customers no longer have to
                                        <br/>
                                        wait for e-invoice issuance.
                                    </span>
                                </div>
                                <span className="for-cust-header1">Now receive e-invoice within the receipt.</span>
                                <div className="receiptblock">
                                    <img
                                        loading="lazy"
                                        src="/images/Receipt_Mask.svg"
                                        alt=""
                                        className="image-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section4">
                <div className="container-2">
                    <div className="section-title-2">
                        <div
                            data-w-id="2817c56b-13ec-adf1-84c1-c8bfa8ae819f"
                            style={{opacity: 0}}
                            className="error-8bb275e9-668a-00b0-187a-4faca412314e"
                        >
                            {`What's getting`}<span className="text-span-10"> better?</span>
                        </div>
                    </div>
                    <div className="columns-2 f2wf-columns-2">
                        <div className="card-3">
                            <div
                                data-w-id="2817c56b-13ec-adf1-84c1-c8bfa8ae81a7"
                                style={{opacity: 0}}
                                className="frame-5445-copy"
                            >
                                <div className="pc">POS&nbsp;in Shop</div>
                                <div className="text-36">
                                    <span className="text-span-22">No More Receipts</span> <br/>
                                    for e-Invoice Issuance!
                                    <br/>
                                    <br/>
                                    All you need to do is making payments at POS.
                                    <br/>
                                    Sales data will be automatically stored in WeTax.
                                </div>
                            </div>
                            <img
                                src="/images/shop_cashier3-3.svg"
                                loading="lazy"
                                alt=""
                                className="image-37"
                            />
                        </div>
                        <div className="card-3-copy">
                            <div
                                data-w-id="2817c56b-13ec-adf1-84c1-c8bfa8ae81b2"
                                style={{opacity: 0}}
                                className="frame-5445-copy"
                            >
                                <div className="mobile">WeTax</div>
                                <div className="text-36">
                                    <span className="text-span-11">No need</span> to refer to the
                                    receipts and organize the sales details in&nbsp;
                                    <span className="text-span-23">Excel</span>.<br/>
                                    <span className="text-span-24">Easily issue POS e-invoice</span> based
                                    on the sales data. <br/>
                                    Reporting to the Tax Office is also easily done with just&nbsp;
                                    <span className="text-span-25">a click</span>.
                                </div>
                            </div>
                            <img
                                src="/images/Screen.svg"
                                loading="lazy"
                                alt=""
                                className="image-45"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="section5">
                <div className="container-3">
                    <div className="section-title-3">
                        <div
                            data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aedd4"
                            style={{opacity: 0}}
                            className="variety-of-industries-that-will-love-webill"
                        >
                            Variety of industries
                            <br/>
                            that <span className="text-span-13">will love</span>{" "}
                            <span className="text-span-16">WeTax</span>
                        </div>
                    </div>
                    <div
                        data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aedd6"
                        style={{opacity: 0}}
                        className="frame-5446"
                    >
                        <div className="frame-5447">
                            <img
                                src="/images/Group-1000001784_Food.svg"
                                loading="lazy"
                                alt=""
                                className="image-39"
                            />
                            <div
                                data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aedd9"
                                style={{opacity: 0, fontWeight: "bold"}}
                                className="text-37"
                            >
                                Food
                            </div>
                        </div>
                        <div className="frame-5447">
                            <img
                                src="/images/Group-1000001784_Cafe.svg"
                                loading="lazy"
                                alt=""
                                className="image-40"
                            />
                            <div
                                data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aeddd"
                                style={{opacity: 0, fontWeight: "bold"}}
                                className="text-37"
                            >
                                Cafe
                            </div>
                        </div>
                        <div className="frame-5447">
                            <img
                                src="/images/Group-1000001784_Bar.svg"
                                loading="lazy"
                                alt=""
                                className="image-41"
                            />
                            <div
                                data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aede1"
                                style={{opacity: 0, fontWeight: "bold"}}
                                className="text-37"
                            >
                                Bar
                            </div>
                        </div>
                        <div className="frame-5447">
                            <img
                                src="/images/Group-1000001784_Hotel.svg"
                                loading="lazy"
                                alt=""
                                className="image-42"
                            />
                            <div
                                data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aede5"
                                style={{opacity: 0, fontWeight: "bold"}}
                                className="text-37"
                            >
                                Hotel
                            </div>
                        </div>
                        <div className="frame-5447">
                            <img
                                src="/images/Group-1000001784_Jewerlry.svg"
                                loading="lazy"
                                alt=""
                                className="image-43"
                            />
                            <div
                                data-w-id="2a024c56-2bd0-873e-7bdb-4cc8b84aede9"
                                style={{opacity: 0, fontWeight: "bold"}}
                                className="text-37"
                            >
                                Jewelry
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section7">
                <div
                    data-w-id="83c1ac6f-b2b4-b12f-91f9-58d775f92fcd"
                    style={{opacity: 0}}
                    className="div-block-2"
                >
                    <div
                        data-w-id="1afdaabe-4837-8faf-23ce-38cf147f2bac"
                        style={{opacity: 0}}
                        className="frame-5475"
                    >
                        <div className="frame-5476">
                            <div className="text-60">
                                Ready to <span className="text-span-15">issue now?</span>
                            </div>
                            <div className="text-61">
                                Start growing your business with WeTax & POS
                            </div>
                        </div>
                        {allowSignUp && (
                            <a
                                // href="https://wetax.com.vn/signup"
                                href={baseUrl+"/signup"}
                                data-w-id="915ecada-bd5b-d481-95da-2f8923136e9f"
                                style={{ opacity: 0 }}
                                className="button-23"
                            >
                                <div className="text-94">Start now</div>
                                <img
                                    src="/images/Vectors-Wrapper.svg"
                                    loading="lazy"
                                    width="11.4609375"
                                    height="19.79296875"
                                    alt="Chevron"
                                    className="vectors-wrapper-30"
                                />
                            </a>
                        )}
                    </div>
                    <img
                        src="/images/Mask-group.svg"
                        loading="lazy"
                        alt=""
                        className="image-38"
                    />
                </div>
            </div>
            <div className="main_footer">
                <div className="frame-5468">
                    <div className="frame-5469">
                        <img
                            src="/images/WeTax_Logo.svg"
                            loading="lazy"
                            style={{opacity: 0}}
                            data-w-id="1cd3b764-3816-c9cb-cc24-4f6fa7cd4df8"
                            alt=""
                        />
                        <div
                            data-w-id="240f7bc1-d76e-69a6-0efd-ddf343f4fe1e"
                            style={{opacity: 0, color: "#808080"}}
                            className="error-5ade7e59-6ca9-e086-d640-fa1bd0e6d16c"
                        >
                            B.0022-23 Room, Sarica Apartment, NO.06, D9 street, An Loi Dong
                            <br/>
                            Ward, Thu Duc City (District 2), HCM City
                        </div>
                    </div>
                    <div
                        data-w-id="240f7bc1-d76e-69a6-0efd-ddf343f4fe20"
                        style={{opacity: 0}}
                        className="frame-5470"
                    >
                        <div className="error-5ade7e59-6ca9-e086-d640-fa1bd0e6d16c">
                            Email
                            <br/>
                            Tel
                        </div>
                        <div className="info-webill-com-kh-855-23-900-530-copy">
                            info.vn@wabooks.com
                            <br/>
                            (+84) 028 7300 1660 Vietnamese, English
                            <br/>
                            (+84) 028 7300 1661 Korean
                        </div>
                    </div>
                    <div
                        data-w-id="240f7bc1-d76e-69a6-0efd-ddf343f4fe25"
                        style={{opacity: 0}}
                        className="frame-5471"
                    >
                        <div className="text-58">
                            Copyright © 2023 Webcash Vietnam Co., Ltd. All Rights Reserved.
                        </div>
                    </div>
                </div>
            </div>

            <script
                src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6523ce388fee5f8e73eed1a6"
                type="text/javascript" defer>
            </script>
            <script src="/js/webflow.js" defer></script>
            <script src="/js/truncatetext.js" defer></script>
            <script property="" src="/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6523ce388fee5f8e73eed1a6"
                    type="text/javascript" defer>
            </script>
        </>
    );
};

