import React, { FunctionComponent }  from 'react';
import ReactDOM from 'react-dom/client';

export const processComponent = (element) => {
  try {
    const content = element.getAttribute('data-config').replace(/\n/g, '');
    const componentConfig = JSON.parse(content);
    const componentName = element.getAttribute('data-component-name').toString();
    const componentSource = window.ComponentRegistry.get(componentName);
    const subscribeComponent = React.createElement(componentSource as FunctionComponent<any>, {
      componentName,
      ...componentConfig,
    });
    const root = ReactDOM.createRoot(element);
    root.render(subscribeComponent);
  } catch (error) {
    console.log(error);
  }
};
