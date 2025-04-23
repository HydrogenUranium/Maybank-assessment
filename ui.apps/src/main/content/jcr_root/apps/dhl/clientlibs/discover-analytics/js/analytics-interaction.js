// 9fbef606107a605d69c0edbcd8029e5d

/**
 * The purpose of this code here is to dispatch corresponding analytics events.
 * To enable this, an EventListener is added to all click events on <a> and
 * <button> elements, which have an attribute called [data-analytics]. The value
 * of this attribute is a stringified JSON object, which contains all information
 * to generate a CustomEvent which then can be dispatched.
 *
 * The (parsed) JSON object stored in the attribute [data-analytics] looks like
 * following example - Note: the values for the content property are described in
 * https://tools.publicis.sapient.com/confluence/display/DPDHLPA/Tracked+interactions#Trackedinteractions-AEMBackendlogic):
 *
 * @example
 *{
 *	"trackedInteractions": "Off" or "Basic" or "Advanced",
 *	"interactionType": "dhl_utf_contentInteraction" or "dhl_utf_engagementInteraction" or "dhl_utf_conversionInteraction",
 *	"content": {
 *		"name": "STRING",
 *		"type": "STRING",
 *		"interaction": "STRING",
 *		"position": "STRING",
 *		"context": "STRING",
 *		"attributes": {
 *			"name1": "STRING",
 *			"name2": "STRING",
 *			.
 *			.
 *		}
 *	}
 */

const REDIRECT_DELAY_TIME = 333; // ms (recommendations range from 100-500 ms)
const ANALYTICS_ATTRIBUTE_NAME = 'data-analytics';
const ANALYTICS_LINK_SELECTOR = `a[href][${ANALYTICS_ATTRIBUTE_NAME}]`; // <a> without [href] is valid HTML but not relevant for analytics
const ANALYTICS_BUTTON_SELECTOR = `button[${ANALYTICS_ATTRIBUTE_NAME}]`;

const ANALYTICS_LINK_DELAY_IGNORE_CLASS = 'analytics-ignore-delay'; // CSS class for handling exceptions with ANALYTICS_LINK_DELAY_SELECTOR
const ANALYTICS_LINK_DELAY_EXCLUSION_SELECTOR = `:not(.${ANALYTICS_LINK_DELAY_IGNORE_CLASS}):not([href^="#"]):not([href^="javascript"]):not([target="_blank"])`;
const ANALYTICS_LINK_DELAY_SELECTOR = `${ANALYTICS_LINK_SELECTOR}${ANALYTICS_LINK_DELAY_EXCLUSION_SELECTOR}`; // <a> loading new page in same tab
const ANALYTICS_ELEMENT_IGNORE_SELECTOR = '.analytics-ignore-element';

const ANALYTICS_ELEMENT_SELECTOR = `${ANALYTICS_LINK_SELECTOR}:not(${ANALYTICS_ELEMENT_IGNORE_SELECTOR}), ${ANALYTICS_BUTTON_SELECTOR}:not(${ANALYTICS_ELEMENT_IGNORE_SELECTOR})`;

const TRACKED_INTERACTIONS_OFF = 'off';

const MOUSE_AUX_BUTTON = 1;

const eventRegistry = {};

const getMatchesSelector = () => {
    const methods = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"];
    for (let method of methods) {
        if (document.body[method]) return method;
    }
    return null;
};

const matchesSelector = getMatchesSelector();

const handleEvent = (event) => {
    const handlers = eventRegistry[event.type];
    if (!handlers) return;

    for (const selector in handlers) {
        if (handlers.hasOwnProperty(selector)) {
            let target = event.target;
            while (target && target !== document) {
                if (target[matchesSelector](selector)) {
                    handlers[selector].handler.call(target, event, handlers[selector].data);
                    break;
                }
                target = target.parentElement;
            }
        }
    }
};

const addListener = (eventType, selector, data, handler) => {
    if (!eventRegistry[eventType]) {
        eventRegistry[eventType] = {};
        document.body.addEventListener(eventType, handleEvent, false);
    }

    eventRegistry[eventType][selector] = {
        selector,
        data,
        handler
    };
};

const removeListener = (eventType, selector) => {
    if (!eventRegistry[eventType]) return;

    delete eventRegistry[eventType][selector];

    if (Object.keys(eventRegistry[eventType]).length === 0) {
        delete eventRegistry[eventType];
        document.body.removeEventListener(eventType, handleEvent, false);
    }
};

/**
 * Catch up on the prevented native redirect of a link element via JavaScript. If
 * required, the redirect can be performed delayed so other JavaScript logic can
 * be executed in the meantime. Although it might be an edge case, also the
 * rather rarely used [target] values "_top", "_parent", arbitrary "<framename>"
 * and therefore any type of frames are supported.
 *
 * @param {HTMLElement} linkElement - The clicked link element that should be used for the redirect
 * @param {Boolean} redirectDelayed - Whether the redirect should be performed delayed
 */
const performRedirect = (linkElement, redirectDelayed = false) => {
	setTimeout(() => {
		window.open(linkElement.getAttribute('href') ?? '', linkElement.getAttribute('target') || '_self');
	}, redirectDelayed ? REDIRECT_DELAY_TIME : 0);
};

/**
 * Read the corresponding value of the attribute [data-analytics] and handle it
 * accordingly to prepare a CustomEvent and dispatch it. Several exceptions
 * (e.g. parsing errors) that might occur are considered as well.
 *
 * @param {Event} event - The click event from <a> and <button> elements
 */
const performDefaultAnalyticsCall = (event) => {
	let redirectViaJavaScript = false;
	let element = event.target;

	// in case the clicked element (= event.target) is a child of the actual target
	// (e.g. <span> inside of <a>), we need to move up the DOM and correct this in
	// our variable
	if (!element.matches(ANALYTICS_ELEMENT_SELECTOR)) {
		element = element.closest(ANALYTICS_ELEMENT_SELECTOR);
	}

	// in case there will be a native redirect in the same tab, we need to delay
	// this until the analytics event has been properly dispatched
	if (element.matches(ANALYTICS_LINK_DELAY_SELECTOR)) {
		event.preventDefault();
		redirectViaJavaScript = true;
	}

	let analyticsData = element.getAttribute(ANALYTICS_ATTRIBUTE_NAME);

	try {

		// this might throw an error which is why we need the try/catch
		analyticsData = JSON.parse(analyticsData);

		// check for invalid data or turned off analytics
		if (!analyticsData || analyticsData?.trackedInteractions?.toLowerCase() === TRACKED_INTERACTIONS_OFF) {

			if (redirectViaJavaScript) {
				performRedirect(element);
			}
		}
		// create and dispatch the CustomEvent with the analytics data
		else {
		  const detail = {};
      if (analyticsData.content) {
          detail.content = analyticsData.content;
      }
      if (analyticsData.conversion) {
          detail.conversion = analyticsData.conversion;
      }

			const customEvent = new CustomEvent(analyticsData.interactionType, {
				bubbles: true,
				detail: detail,
			});

			window.dispatchEvent(customEvent);

			if (redirectViaJavaScript) {
				performRedirect(element, true);
			}
		}

	}
	catch (error) {
		console.error('[UTF] ==> JSON.parse() of [data-analytics] failed:', error);

		if (redirectViaJavaScript) {
			performRedirect(element);
		}
	}
};

/**
 * Read the corresponding value of the attribute [data-analytics] and handle it
 * accordingly to prepare a CustomEvent and dispatch it. Several exceptions
 * (e.g. parsing errors) that might occur are considered as well.
 * Unlike "performDefaultAnalyticsCall", which handles only clicks for buttons and links (that are not an exception),
 * "performCustomAnalyticsCall" handles any kind of event for any targeted HTML element.
 *
 * @param {HTMLElement} element - The element that holds the value of the attribute [data-analytics]
 */
const performCustomAnalyticsCall = (element) => {
	let analyticsData = element.getAttribute(ANALYTICS_ATTRIBUTE_NAME);

	try {

        // this might throw an error which is why we need the try/catch
		analyticsData = JSON.parse(analyticsData);

        // check for invalid data or turned off analytics
		if (analyticsData && analyticsData.trackedInteractions.toLowerCase() !== TRACKED_INTERACTIONS_OFF) {
			const customEvent = new CustomEvent(analyticsData.interactionType, {
				bubbles: true,
				detail: {
					content: analyticsData.content
				}
			});

			window.dispatchEvent(customEvent);
		}
	}
	catch (error) {
		console.error('[UTF] ==> JSON.parse() of [data-analytics] failed:', error);
	}
};

/**
 * Initialize the JavaScript module.
 */
const initialize = () => {
	addListener('click', ANALYTICS_ELEMENT_SELECTOR, {}, (event) => {
		performDefaultAnalyticsCall(event);
	});

	// Auxclick event is not supported by major browser Safari
	// auxclick covers all but the primary/left btnright btn
	// should be ignored so context menu can be normally used
	addListener('auxclick', ANALYTICS_ELEMENT_SELECTOR, {}, (event) => {
		if (event.button === MOUSE_AUX_BUTTON) {
			performDefaultAnalyticsCall(event);
		}
	});
};

initialize();
