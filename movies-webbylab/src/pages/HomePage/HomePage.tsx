import { MovieCard } from "./components/MovieCard";
import { Navbar } from "./components/Navbar";

export const HomePage = () => {
  return (
    <div>
      <Navbar />
     <MovieCard />
    </div>
  );
}