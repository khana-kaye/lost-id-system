import Navbar from '../components/navbar';
import Landingpage from '../components/landingpage';

function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <Landingpage />
    </div>
  );
}

export default Home;