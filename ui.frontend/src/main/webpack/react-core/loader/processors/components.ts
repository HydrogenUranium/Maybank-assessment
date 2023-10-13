import {
  processComponent
} from './component';

export const processComponents = () => {
  const componentElements = Array.from(document.getElementsByClassName('aem-react-component'));
  componentElements.forEach((e) => processComponent(e));
};
