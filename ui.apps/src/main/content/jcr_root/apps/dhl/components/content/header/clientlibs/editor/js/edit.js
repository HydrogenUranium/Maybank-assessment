(function($, granite) {
    "use strict";

    granite.author.actions.openHeaderMobilePopup = function(constructor) {
        const header = constructor.dom[0];
        if(header) {
          header.querySelector("a.header__navigation").click();
          const meganav = header.querySelector(".header__meganav");
          if (meganav.style.position === "unset") {
              meganav.style.position = ""; // Remove style
          } else {
              meganav.style.position = "unset"; // Add style
          }

          const wrapper = header.querySelector(".header-wrapper");
            if (wrapper.style.display === "block") {
                wrapper.style.display = ""; // Remove style
            } else {
                wrapper.style.display = "block"; // Add style
            }
        }
    };
})(jQuery, Granite);
