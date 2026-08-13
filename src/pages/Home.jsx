import HeroSection from "../components/home/HeroSection";
import SearchBar from "../components/home/SearchBar";
import CategorySection from "../components/home/CategorySection";
import PopularProducts from "../components/home/PopularProducts";
import HomeCTA from "../components/home/HomeCTA";

function Home() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <CategorySection />
      <PopularProducts />
      <HomeCTA />
    </>
  );
}

export default Home;
