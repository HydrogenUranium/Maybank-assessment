package com.positive.dhl.core.injectors;

import org.apache.sling.models.annotations.Source;
import org.apache.sling.models.spi.injectorspecific.InjectAnnotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@InjectAnnotation
@Source("discover-home-asset-property")
public @interface InjectHomeAssetProperty {
    boolean optional() default false;
}
