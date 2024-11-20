package com.dhl.discover.core.models;

import javax.inject.Named;

import org.apache.commons.codec.binary.Base64;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
public class DownloadAsset {
	@ValueMapValue
	@Named("assetpath")
	@Optional
	public String assetpath;
	
    /**
	 * 
	 */
	public String encodedAssetPath() {
		Base64 base64 = new Base64(true);
		byte[] encodedBytes = base64.encode(assetpath.getBytes());
		return new String(encodedBytes);
	}
}