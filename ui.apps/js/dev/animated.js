import './Tests/Fonts';

// Import components
import Header from './Components/Header';
import IEDetector from './Components/IEDetector';
import LandingPageButton from './Components/LandingPageButton';
import Count from './Components/Count';
import CarouselRow from './Components/CarouselRow';
import AnimatedParallax from './Components/AnimatedParallax';
import SmoothScroll from './Components/SmoothScroll';
import AnimatedShowcasePanel from './Components/AnimatedShowcasePanel';
import AnimatedPagesHero from './Components/AnimatedPagesHero';
import InPageNavigation from './Components/InPageNavigation';
import ShipNowTwoStepForm from './Components/ShipNowTwoStepForm';

$(document).ready(() => {
  try {
    document.createEvent('TouchEvent');
    $('body').addClass('touch');
  } catch (e) {
    // nothing
  }
  // Initiate components
  IEDetector.init();
  Header.init();
  Count.init();
  LandingPageButton.init();
  CarouselRow.init();
  AnimatedParallax.init();
  AnimatedShowcasePanel.init();
  InPageNavigation.init();
  ShipNowTwoStepForm.init();

});

AnimatedPagesHero.init();


