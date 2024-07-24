import Hero from "./components/Hero";
import Hightlights from "./components/Hightlights";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Hightlights />
    </main>
  );
}
