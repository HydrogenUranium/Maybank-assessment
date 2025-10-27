import './Tests/Fonts';

// Import components
import IEDetector from './Components/IEDetector';
import Count from './Components/Count';
import CarouselRow from './Components/CarouselRow';
import AnimatedParallax from './Components/AnimatedParallax';
import AnimatedShowcasePanel from './Components/AnimatedShowcasePanel';
import AnimatedPagesHero from './Components/AnimatedPagesHero';
import InPageNavigation from './Components/InPageNavigation';
import ShipNowTwoStepForm from './Components/ShipNowTwoStepForm';
import EmbedYoutube from "./Components/EmbedYoutube";


$(document).ready(() => {
  try {
    document.createEvent('TouchEvent');
    $('body').addClass('touch');
  } catch (e) {
    // nothing
  }
  // Initiate components
  IEDetector.init();
  Count.init();
  CarouselRow.init();
  AnimatedParallax.init();
  AnimatedShowcasePanel.init();
  InPageNavigation.init();
  ShipNowTwoStepForm.init();
  EmbedYoutube.init();

});

AnimatedPagesHero.init();


