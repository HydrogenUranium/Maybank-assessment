/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import MarketoForm from '../../Components/MarketoForm';

jest.mock('jquery', () => {
  const m$ = { on: jest.fn(), ready: jest.fn(), addClass: jest.fn()};
  return jest.fn(() => m$);
});

describe('Marketo initialization', () => {
  it('init', () => {
    $().ready.mockImplementation((callback) => callback());
    $().on.mockImplementation((event, handler) => handler());
    MarketoForm.init();
  });
});

