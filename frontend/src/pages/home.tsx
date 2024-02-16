import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {
  const addToCartHandler = () => {};
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>

      <main>
        <ProductCard
          productId="dkjj"
          name="HP Victus"
          price={65000}
          stock={47}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/71h9nOTd93L._SX569_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
