import { Link } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';

function Home() {
  return (
    <>
      <Heading>Home</Heading>
      <Link to="/about">About</Link>
    </>
  );
}

export default Home;
