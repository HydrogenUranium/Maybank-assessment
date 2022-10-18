// Import components
import Header from './Components/Header';
import BootstrapCarousel from './Components/BootstrapCarousel';
import ArticleGrid from './Components/ArticleGrid';
import SubscribePanel from './Components/SubscribePanel';
import Password from './Components/Password';
import PasswordValidity from './Components/PasswordValidity';
import FormValidation from './Components/FormValidation';
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
import Offline from './Components/Offline';
import LandingPoints from './Components/LandingPoints';
import BackButton from './Components/BackButton';
import ArticleCounter from './Components/ArticleCounter';
import MarketoForm from './Components/MarketoForm';
import LanguageDetect from './Components/LanguageDetect';

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
  // ArticleCounter.init();
  IEDetector.init();
  Header.init();
  BootstrapCarousel.init();
  ArticleGrid.init();
  SubscribePanel.init();
  Password.init();
  PasswordValidity.init();
  // FormValidation.init();
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
  Offline.init();
  LandingPoints.init();
  BackButton.init();
  MarketoForm.init();
});
