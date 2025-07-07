import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{ padding: '1rem' }}>
                {children}
            </main>
        </>
    );
};

export default Layout;
