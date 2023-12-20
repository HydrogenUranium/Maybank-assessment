/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import MarketoForm from '../../Components/MarketoForm';

beforeAll(() => {
  initMarketoJs();
});
jest.mock('jquery', () => {
  const m$ = { on: jest.fn(), ready: jest.fn(), addClass: jest.fn()};
  return jest.fn(() => m$);
});

describe('Do we need Marketo API submission', () => {
  test.each([
    ['hiddenFormId="1796"'],
    ['hiddenFormId="23487"'],
    ['hiddenFormId=""']
  ])('Attribute: %s', (attribute) => {
    document.body.innerHTML = `
    <div data-marketo-form class="forms marketoForm" ${attribute} id="mktoForm_1795"></div>
    `;
    MarketoForm.init();
    const baseElement = document.getElementById('mktoForm_1795');
    const response = MarketoForm.isValidAPISubmission(baseElement);
    if (attribute === 'hiddenFormId=""') {
      expect(response).toBeFalsy();
    } else {
      expect(response).toBeTruthy();
    }
  });
});

describe('Marketo initialization', () => {
  it('init', () => {
    $().ready.mockImplementation((callback) => callback());
    $().on.mockImplementation((event, handler) => handler());
    expect(MarketoForm.init()).toBeTruthy();
  });
});

function initMarketoJs() {
  $().ready.mockImplementation((callback) => callback());
  $().on.mockImplementation((event, handler) => handler());
  MarketoForm.init();
}
