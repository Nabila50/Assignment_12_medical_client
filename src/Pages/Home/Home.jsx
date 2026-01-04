import React from 'react';
import Banner from './Banner';
import PopularCamps from '../shared/PopularCamps';
import RegistrationModal from '../ParticipantRegister';
import FeedbackCards from '../shared/FeedbackCard';
 
 

const Home = () => {
  return (
    <div>
        <Banner></Banner>
        <PopularCamps></PopularCamps>
        <FeedbackCards></FeedbackCards>
    
         
    </div>
  );
};

export default Home;