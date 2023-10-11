/**
 * @jest-environment jsdom
 */
const marketo = require('../../Components/MarketoForm.js');

test('marketo init', () =>{
  expect(marketo.default.init().toBe(true));
});
