package com.positive.dhl.core.dam;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class RenditionPatternPickerTest {

    @Mock
    private Rendition originalRendition;

    @Mock
    private Rendition webRendition;

    @Mock
    private Rendition largeRendition;

    @Mock
    private Rendition smallRendition;

    @Mock
    private Rendition customRendition;

    @Mock
    private List<Rendition> renditions;

    @Mock
    private Asset asset;

    @BeforeEach
    public void init() {
        lenient().when(originalRendition.getName()).thenReturn("original");
        lenient().when(largeRendition.getName()).thenReturn("cq5dam.thumbnail.1000.1000");
        lenient().when(smallRendition.getName()).thenReturn("cq5dam.thumbnail.100.100");
        lenient().when(webRendition.getName()).thenReturn("cq5dam.web.1280.1280");
        lenient().when(customRendition.getName()).thenReturn("custom");

        renditions = new ArrayList<>();
        renditions.add(webRendition);
        renditions.add(largeRendition);
        renditions.add(smallRendition);
        renditions.add(customRendition);

        lenient().when(asset.getRenditions()).thenReturn(renditions);
    }

    @Test
    void testGetRendition_MatchingRegex() {
        RenditionPatternPicker instance = new RenditionPatternPicker("^cust.*");
        Rendition expResult = customRendition;
        Rendition result = instance.getRendition(asset);
        assertEquals(expResult, result);
    }

    @Test
    void testGetRendition_MultiMatchingRegex() {
        RenditionPatternPicker instance = new RenditionPatternPicker("^cq5dam\\.thumb*");
        Rendition expResult = largeRendition;
        Rendition result = instance.getRendition(asset);
        assertEquals(expResult, result);
    }

    @Test
    void testGetRendition_NonMatchingRegexWithoutOriginal() {
        RenditionPatternPicker instance = new RenditionPatternPicker("nothinghere");
        Rendition expResult = webRendition;
        Rendition result = instance.getRendition(asset);
        assertEquals(expResult, result);
    }

    @Test
    void testGetRendition_NonMatchingRegexWithOriginal() {
        renditions.add(originalRendition);
        when(asset.getOriginal()).thenReturn(originalRendition);

        RenditionPatternPicker instance = new RenditionPatternPicker("nothinghere");
        Rendition expResult = originalRendition;
        Rendition result = instance.getRendition(asset);
        assertEquals(expResult, result);
    }

    @Test
    void testGetRendition_WithRenditions() {
        lenient().when(asset.getRenditions()).thenReturn(new ArrayList<>());

        RenditionPatternPicker instance = new RenditionPatternPicker("nothinghere");
        Rendition result = instance.getRendition(asset);
        assertNull(result);
    }
}