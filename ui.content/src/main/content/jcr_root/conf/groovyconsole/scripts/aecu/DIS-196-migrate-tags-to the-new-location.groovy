def DRY_RUN = true

def targetDirectory = "/content/cq:tags"

def tagsDirectory = "/etc/tags"

def moveTags = {
    resource ->
        def resourceResolver = resource.resourceResolver

        def resourcePath = resource.path
        def parentPath = resource.parent.path
        def targetParentPath = parentPath.replace(tagsDirectory, targetDirectory)
        def targetResource = resourceResolver.getResource(targetParentPath + "/" + resource.name)
        def isExist = targetResource != null
        def output = ""
        if(!isExist) {
            resourceResolver.copy(resourcePath, targetParentPath)
            output = resourcePath + " move to " + targetParentPath
        }

        return output
} as Object

aecu
        .contentUpgradeBuilder()
        .forDescendantResourcesOf(tagsDirectory)
        .filterByNotPathRegex(".*/rep:policy.*")
        .doCustomResourceBasedAction(moveTags)
        .run(DRY_RUN)

aecu
        .contentUpgradeBuilder()
        .forResources((String[]) ["/etc/tags"])
        .doDeleteResource()
        .run(DRY_RUN)