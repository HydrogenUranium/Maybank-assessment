/*
 ADOBE CONFIDENTIAL
 Copyright 2016 Adobe Systems Incorporated
 All Rights Reserved.
 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any. The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and may be covered by U.S. and Foreign Patents,
 patents in process, and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
 */
(function(document, XSS, $) {

    "use strict";
    var confHome = "/conf";
    var libsHome = "/libs";
    var appsHome = "/apps";
    var modulePath = "cloudconfigs/google-ads";
    var columnViewSelector = ".cq-cloudservices-google-ads-list";
    var selectedColumnId = "data-foundation-collection-id";
    var configCreateActivator = ".cq-google-ads-config-create";
    var createButtonSelector = "#cloudservice-addform-submit";
    var cloudServiceTitle = "#config-title";
    var cloudServiceName = "#config-name";
    var footer = '<button is="coral-button" variant="primary" coral-close="" size="M">' + Granite.I18n.get('Close') + '</button>';
    var formPostURL = Granite.HTTP.externalize("/apps/dhl/google-ads/content/cloudservice/console/_jcr_content/content/items/create");

    const NON_VALID_CHARS = new RegExp("[%/\\\\:*?\\\"\\[\\]|\\n\\t\\r. ]", "g");

    $(document).ready(function() {
        Coral.commons.ready(document, function () {
            toggleCreate(true);
        });
    });

	$(document).on('coral-columnview:navigate', columnViewSelector, function(e) {
        var selectedItem = $(columnViewSelector)[0].getAttribute(selectedColumnId);
        if (selectedItem.startsWith(libsHome) || selectedItem.startsWith(appsHome) || selectedItem == confHome) {
            toggleCreate(true);
        } else if (selectedItem.indexOf(modulePath) == -1) {
            // Some context in conf
            toggleCreate(false);
        } else {
            toggleCreate(true);
        }
    });

    $(document).on("keyup", "coral-dialog", function() {
        let serviceTitle = $(cloudServiceTitle)[0].value.trim();
        let serviceName = $(cloudServiceName)[0].value.trim();
        if (serviceTitle != "" && serviceName != "") {
            $(createButtonSelector)[0].disabled = false;
        } else {
            $(createButtonSelector)[0].disabled = true;
        }
    });

    $(document).on("click", createButtonSelector, function (e) {
        createCloudService(e);
    });

    function toggleCreate(bHide) {
        if (bHide) {
            $(configCreateActivator)[0].setAttribute("hidden", true);
        } else {
            $(configCreateActivator)[0].removeAttribute("hidden");
        }
    }
  function isSafeRedirectUrl(url) {
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }
    function createCloudService(e) {

        var configParent = $(columnViewSelector).attr(selectedColumnId);
        var configTitle = $(cloudServiceTitle)[0].value.trim();
        var configName = $(cloudServiceName)[0].value.trim().replace(NON_VALID_CHARS, "-");
        var data = {"configPath" : configParent, "title" : configTitle, "name": configName, "template": "/apps/dhl/google-ads/templates/utilities/google-ads-cloudconfig"};

        $.ajax({
            url: formPostURL,
            type: "post",
            data: data,
                success: function(response) {
                  if (response.href && isSafeRedirectUrl(response.href)) {
                    window.location.href = response.href;
                  } else {
                    showDialog("error", "error", "Invalid redirect", "The redirect URL is invalid or not allowed.");
                  }
                },
                error: function(xhr) {
                    showDialog("error", "error", Granite.I18n.get("Failed"), Granite.I18n.get("Failed to create cloud service"), footer);
                }
        });
    }

    function showDialog(id, variant, header, content, footer) {
        var $dialog = $('#' + id);
        var dialog;
        if ($dialog.length === 0) {
            dialog = new Coral.Dialog().set({
                id: id,
                variant: variant,
                closable: "on",
                header: {
                    innerHTML: header
                },
                content: {
                    innerHTML: content
                },
                footer: {
                    innerHTML: footer
                }
            });
            document.body.appendChild(dialog);
        } else {
            dialog = $dialog[0];
            dialog.header.innerHTML = header;
            dialog.content.innerHTML = content;
            dialog.footer.innerHTML = footer;
        }
        dialog.show();
    }

    $(document).on("foundation-contentloaded", function (e) {
        $(cloudServiceTitle).on('input', function(event) {
            const $title = $(cloudServiceTitle);
            const $name = $(cloudServiceName);

            const title = $title.val();
            const oldTitle = $title.data("value") || "";

            $title.data("value", title)
            if( title != oldTitle ) {
                const replaced = title.replace(NON_VALID_CHARS,"-");
                const replacedOld = oldTitle.replace(NON_VALID_CHARS,"-");

                if( $name.val() == replacedOld || $name.val().length == 0) {
                    $name.val(replaced);
                }
            }
        });

        $(cloudServiceName).on('input', function(event) {
            const $name = $(cloudServiceName);
            const name = $name.val();

            if (NON_VALID_CHARS.test(name)) {
                const replaced = name.replace(NON_VALID_CHARS, "-");
                $name.val(replaced);
            }
        });

    });

})(document, _g.XSS, Granite.$);
