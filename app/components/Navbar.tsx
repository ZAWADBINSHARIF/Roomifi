import { Box } from "lucide-react";
import Button from "./ui/Button";
import { redirect, useNavigate, useOutletContext } from "react-router";

export const Navbar = () => {

    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

    let navigate = useNavigate();

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }

            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <header className="navbar">
            <nav className="inner">
                <div onClick={goToHome} className="left">
                    <div className="brand">
                        <Box className="logo" />

                        <span className="name">
                            Roomify
                        </span>
                    </div>

                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `Hi, ${userName}` : 'Signed in'}
                            </span>

                            <Button size="sm" onClick={handleAuthClick} className="btn">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleAuthClick} size="sm" variant="ghost">
                                Log In
                            </Button>

                            <a href="#upload" className="cta">Get Started</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};
