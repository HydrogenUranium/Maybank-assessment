// Import components
import Header from './Components/Header';
import BootstrapCarousel from './Components/BootstrapCarousel';
import ShipForm from './Components/ShipForm';
import IEDetector from './Components/IEDetector';
import Hero from './Components/Hero';
import ShipNowForm from './Components/ShipNowForm';
import ShipNowTwoStepForm from './Components/ShipNowTwoStepForm';
import MarketoForm from './Components/MarketoForm';
import LanguageDetect from './Components/LanguageDetect';
import Shared from './Components/Shared';
import HorizontalScroll from './Components/HorizontalScroll';
import Accordion from "./Components/Accordion";
import Chatbot from "./Components/Chatbot";

$(document).ready(() => {
  try {
    document.createEvent('TouchEvent');
    $('body').addClass('touch');
  } catch (e) {
    // nothing
  }
  if ((window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone)) $('html').addClass('pwa');
  // Initiate components
  LanguageDetect.init();
  IEDetector.init();
  Header.init();
  BootstrapCarousel.init();
  ShipForm.init();
  Hero.init();
  ShipNowForm.init();
  ShipNowTwoStepForm.init();
  MarketoForm.init();
  Shared.init();
  HorizontalScroll.init();
  Accordion.init();
  Chatbot.init()
});
