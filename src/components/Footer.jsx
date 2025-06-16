import footerStyles from '../css/footer.module.css';

function Footer() {
    
    
    return(
        <div className={footerStyles['footer-div']}>
            <h1 className={footerStyles['footer-text']}>This project is a work in progress, no trademarks yet, but please don't steal my shit anyways, I beg of you. Sincerely, Damian Zelinka, the creator.</h1>
        </div>
    )
}

export default Footer