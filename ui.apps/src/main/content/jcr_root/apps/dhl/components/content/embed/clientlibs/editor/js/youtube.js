/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function(document, $, Coral) {
    "use strict";

    var dialogContent;
    var submitButton;
    var action;

    var selectors = {
        dialogContent: ".cmp-embeddable-youtube__editor",
        enableSwitch: ".enable-schema-markup-switch",
        videoId: ".youtube-video-id",
        submitButton: ".cq-dialog-submit",
        fetchButton: ".fetch-schema-markup-button",
        schemaMarkupField: ".schema-markup-textarea",
    };

    $(document).on("dialog-loaded", function(event) {
        var $dialog = event.dialog;

        if ($dialog.length) {
            dialogContent = $dialog[0].querySelector(selectors.dialogContent);
            submitButton = $dialog[0].querySelector(selectors.submitButton);
            action = $dialog[0].action;
            if (dialogContent) {
                const fetchButton = dialogContent.querySelector(selectors.fetchButton);
                const videoId = dialogContent.querySelector(selectors.videoId);
                const enableSwitch = dialogContent.querySelector(selectors.enableSwitch);

                enableSwitch.addEventListener("change", function() {
                  handleSwitch();
                });

                fetchButton.addEventListener("click", function() {
                  handleFetch();
                });

                videoId.addEventListener("input", function() {
                  handleFetch();
                });
            }
        }
    });

    function handleFetch() {
      if(!isEnabled()) {
        return;
      }
      dialogContent.querySelector(selectors.schemaMarkupField).value = "";
      const fetchButton = dialogContent.querySelector(selectors.fetchButton);
      fetchButton.disabled = true;
      submitButton.disabled = true;
      addSchemaToPage()
        .finally(() => {
             fetchButton.disabled = false;
             submitButton.disabled = false;
         });
    }

    function handleSwitch() {
      if(isEnabled) {
        handleFetch();
      } else {
        dialogContent.querySelector(selectors.schemaMarkupField).value = "";
      }
    }

    function isEnabled() {
      return dialogContent.querySelector(selectors.enableSwitch).checked;
    }

    function getVideoId() {
        return dialogContent.querySelector(selectors.videoId).value;
    }

  async function fetchVideoDetails(videoId) {
    const url = `/apps/dhl/discoverdhlapi/youtube/index.json?videoId=${videoId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
  }

    function generateSchemaMarkup(videoData) {
        return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": videoData.snippet.title,
            "description": videoData.snippet.description,
            "thumbnailUrl": videoData.snippet.thumbnails.high.url,
            "uploadDate": videoData.snippet.publishedAt,
            "duration": videoData.contentDetails.duration,
            "contentUrl": `https://www.youtube.com/watch?v=${videoData.id}`,
            "embedUrl": `https://www.youtube.com/embed/${videoData.id}`,
            "interactionCount": videoData.statistics.viewCount
        };
    }

    async function addSchemaToPage() {
        const videoData = await fetchVideoDetails(getVideoId());
        if(videoData) {
          const schemaMarkup = generateSchemaMarkup(videoData);
          dialogContent.querySelector(selectors.schemaMarkupField).value = JSON.stringify(schemaMarkup, null, 2)
        }
    }
})(document, Granite.$, Coral);
