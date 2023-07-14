/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services.impl;

import org.osgi.service.component.annotations.Component;

/**
 * Orchestrates the whole process of removing items from Akamai cache upon activation (or on any other request)
 */
@Component(
		service = AkamaiFlush.class
)
public class AkamaiFlush {
}
