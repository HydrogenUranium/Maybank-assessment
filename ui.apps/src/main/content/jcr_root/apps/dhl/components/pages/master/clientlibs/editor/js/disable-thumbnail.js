/*
 * This script manages the visibility and interactivity of the thumbnail element in the authoring interface.
 * Specifically:
 * - It checks if the thumbnail file reference matches the "pending deletion" thumbnail.
 * - If the thumbnail is marked for deletion, it applies styles (`opacity: 0.5` and `pointer-events: none`)
 *   to visually indicate that the thumbnail is non-editable.
 * - This behavior ensures that authors cannot edit the thumbnail while a deletion workflow is in progress.
 * - If the deletion request is denied, the workflow can restore the previous thumbnail.
 */
 (function (document, $) {
    "use strict";

    $(document).on("foundation-contentloaded", function (e) {
        Coral.commons.ready(function () {
            const pendingDeletionThumbnail = "/apps/dhl/clientlibs/discover/resources/img/pending-deletion.png";

            const inputElement = document.querySelector(".discover-thumbnail-file-reference");

              if (inputElement && inputElement.value === pendingDeletionThumbnail) {
                  const thumbnailElement = document.querySelector(".discover-thumbnail");
                  if (thumbnailElement) {
                    thumbnailElement.style.opacity = "0.5";
                    thumbnailElement.style.pointerEvents = "none";
                  }
              }
        });
    });
})(document, Granite.$);
