// Import components
import Header from './Components/Header';
import HeaderV2 from './Components/HeaderV2';
import Carousel from './Components/Carousel';
import BootstrapCarousel from './Components/BootstrapCarousel';
import SubscribePanel from './Components/SubscribePanel';
import Password from './Components/Password';
import PasswordValidity from './Components/PasswordValidity';
import ShowHide from './Components/ShowHide';
import CookieBanner from './Components/CookieBanner';
import SearchForm from './Components/SearchForm';
import EcomForms from './Components/EcomForms';
import ShipForm from './Components/ShipForm';
import IEDetector from './Components/IEDetector';
import Social from './Components/Social';
import Hero from './Components/Hero';
import AuthenticationEvents from './Components/AuthenticationEvents';
import DeleteAccountForm from './Components/DeleteAccountForm';
import LoginForm from './Components/LoginForm';
import PasswordReminderForm from './Components/PasswordReminderForm';
import RegisterForm from './Components/RegisterForm';
import YourAccountForm from './Components/YourAccountForm';
import ShipNowForm from './Components/ShipNowForm';
import ShipNowTwoStepForm from './Components/ShipNowTwoStepForm';
import CompetitionForm from './Components/CompetitionForm';
import ServiceWorker from './Components/ServiceWorker';
import MarketoForm from './Components/MarketoForm';
import LanguageDetect from './Components/LanguageDetect';
import Shared from './Components/Shared';
import HorizontalScroll from './Components/HorizontalScroll';

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
  HeaderV2.init();
  Carousel.init();
  BootstrapCarousel.init();
  SubscribePanel.init();
  Password.init();
  PasswordValidity.init();
  ShowHide.init();
  CookieBanner.init();
  SearchForm.init();
  EcomForms.init();
  ShipForm.init();
  Social.init();
  Hero.init();
  CompetitionForm.init();
  ShipNowForm.init();
  ShipNowTwoStepForm.init();
  YourAccountForm.init();
  RegisterForm.init();
  PasswordReminderForm.init();
  LoginForm.init();
  DeleteAccountForm.init();
  AuthenticationEvents.init();
  ServiceWorker.init();
  MarketoForm.init();
  Shared.init();
  HorizontalScroll.init();
});
