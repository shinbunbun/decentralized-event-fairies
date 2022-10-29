import { Link } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';

function About() {
  return (
    <>
      <Heading>About</Heading>
      <Link to="/">Home</Link>
    </>
  );
}

export default About;
