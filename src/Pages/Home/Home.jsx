import React from 'react';
import Banner from './Banner';
import PopularCamps from '../shared/PopularCamps';
import RegistrationModal from '../ParticipantRegister';
 

const Home = () => {
  return (
    <div>
        <Banner></Banner>
        <PopularCamps></PopularCamps>
         
    </div>
  );
};

export default Home;