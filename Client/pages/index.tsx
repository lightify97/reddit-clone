import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Navbar from '../components/Navbar';
import { useMeQuery } from '../graphql/generated/graphql';


export default function HomePage() {
  // const [{ data, fetching }] = useMeQuery();



  return (
    <>

      <Navbar />
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
