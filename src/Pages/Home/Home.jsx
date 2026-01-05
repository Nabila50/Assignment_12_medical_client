import React from 'react';
import Banner from './Banner';
import PopularCamps from '../shared/PopularCamps';
import RegistrationModal from '../ParticipantRegister';
import FeedbackCards from '../shared/FeedbackCard';
import CommunityImpact from '../shared/CommunityImpact';
 
 

const Home = () => {
  return (
    <div>
        <Banner></Banner>
        <PopularCamps></PopularCamps>
        <FeedbackCards></FeedbackCards>
        <CommunityImpact></CommunityImpact>
    
         
    </div>
  );
};

export default Home;