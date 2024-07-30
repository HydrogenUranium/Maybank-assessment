boolean DRY_RUN = true

sql2Query("""
    SELECT * FROM [nt:unstructured] AS node
    WHERE ISDESCENDANTNODE('/content/dhl') 
    AND node.[sling:resourceType] = 'dhl/components/pages/editable-animated-page'
    AND node.[cq:lastReplicationAction] = "Activate"
""").each({

    aecu.contentUpgradeBuilder().forResources((String[])[it.getPath()])
            .doActivateResource()
            .run(DRY_RUN)
})