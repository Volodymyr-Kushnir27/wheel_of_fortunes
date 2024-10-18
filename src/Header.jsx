import './App.css'
import logo from '/image/logo.png'
import instagram from '/image/instagram.png'
import tik from '/image/tik-tok.webp'
function Header() {

    return (
        <>

            <header>
                <div className="logo">
                    <img src={logo} alt="Логотип" />
                </div>
                <div className="name">
                    <h1> PERFUMS BAR</h1>
                </div>
                <div className="social-icons">
                    <a href="https://www.instagram.com/perfumsbar_odessa/" target="_blank" rel="noopener noreferrer">
                        <img src={instagram} alt="Instagram Логотип" className="instagram" />
                    </a>
                    <a href="https://www.tiktok.com/@perfumsbar_odessa" target="_blank" rel="noopener noreferrer">
                        <img src={tik} alt="TikTok Логотип" className="tik-tok" />
                    </a>
                </div>


            </header>
        </>
    )
}

export default Header
