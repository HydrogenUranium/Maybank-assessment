package com.dhl.discover.core.constants;

import org.apache.sling.sitemap.builder.Url;

import java.util.HashMap;
import java.util.Map;

public enum ChangeFrequencyEnum {
    ALWAYS("always", Url.ChangeFrequency.ALWAYS),
    HOURLY("hourly", Url.ChangeFrequency.HOURLY),
    DAILY("daily", Url.ChangeFrequency.DAILY),
    WEEKLY("weekly", Url.ChangeFrequency.WEEKLY),
    MONTHLY("monthly", Url.ChangeFrequency.MONTHLY),
    YEARLY("yearly", Url.ChangeFrequency.YEARLY),
    NEVER("never", Url.ChangeFrequency.NEVER);

    private static final Map<String, Url.ChangeFrequency> CHANGE_FREQUENCY_MAP = new HashMap<>();

    static {
        for (ChangeFrequencyEnum e : values()) {
            CHANGE_FREQUENCY_MAP.put(e.label, e.changeFrequency);
        }
    }

    public final String label;
    public final Url.ChangeFrequency changeFrequency;

    ChangeFrequencyEnum(String label, Url.ChangeFrequency changeFrequency) {
        this.label = label;
        this.changeFrequency = changeFrequency;
    }

    public static Url.ChangeFrequency getChangeFrequencyByLabel(String label) {
        return CHANGE_FREQUENCY_MAP.get(label);
    }
}
