package com.dhl.discover.core.servlets;

import com.adobe.granite.crypto.CryptoException;
import com.adobe.granite.crypto.CryptoSupport;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.servlets.post.Modification;
import org.apache.sling.servlets.post.SlingPostProcessor;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import java.util.List;

@Component(service = SlingPostProcessor.class)
public class FieldEncryptionPostProcessor implements SlingPostProcessor {

    @Reference
    private CryptoSupport cryptoSupport;

    private String[] getValues(String string) {
        if(string.startsWith("[") && string.endsWith("]")) {
            return string.substring(1, string.length() - 1).split(",");
        }
        return new String[]{ string };
    }

    @Override
    public void process(SlingHttpServletRequest request, List<Modification> modifications) throws RepositoryException, CryptoException {
        String toEncrypt = request.getParameter("./encryptedFields");

        if (StringUtils.isBlank(toEncrypt)) {
            return;
        }

        String[] fields = getValues(toEncrypt);

        Resource resource = request.getResource();
        ModifiableValueMap map = resource.adaptTo(ModifiableValueMap.class);

        if (map == null) {
            return;
        }

        for (String field : fields) {
            field = field.trim();
            String value = request.getParameter(field);

            if (StringUtils.isNotBlank(value) && !cryptoSupport.isProtected(value)) {
                String encrypted = cryptoSupport.protect(value);
                map.put(field.replaceFirst("^\\./", ""), encrypted);
            }
        }
    }
}
