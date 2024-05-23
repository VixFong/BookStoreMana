import 'bootstrap/dist/css/bootstrap.min.css';

export const Carousel = () => {
    return (
        <div>
            <div id="demo" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://images-production.bookshop.org/spree/affiliate_profiles/banner_images/97435/original/Buzz_on_by_and_get_your_cozy_reads_%282048_%C3%97_600_px%29.jpg?1695754128" alt="Book Day1" className="d-block w-100" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images-production.bookshop.org/spree/affiliate_profiles/banner_images/66799/original/Copy_of_bloomville_%282048_x_600_px%29.jpg?1699159240" alt="Book Day2" className="d-block w-100" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://bookshop-uk-prod-images.storage.googleapis.com/spree/affiliate_profiles/banner_images/9407/original/HOBF_TwitterBanners_%28002%29.jpg?1657016259" alt="Sale Ups" className="d-block w-100" />
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>
        </div>
    );
};