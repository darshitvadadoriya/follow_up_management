frappe.listview_settings["Follow Up"] = {
    refresh: function (listview) {
        // Check if the "Calendar View" option already exists
        let existingCalendarView = document.querySelector(
            'ul.dropdown-menu li[data-view="Calendar View"]'
        );

        // If the "Calendar View" option doesn't exist, append it
        if (!existingCalendarView) {
            let dropdown_ul = document.querySelector("ul.dropdown-menu");
            let custom_li = document.createElement("li");
            custom_li.setAttribute("data-view", "Calendar View");
            custom_li.style.padding = "4px 0px";
            custom_li.style.cursor = "pointer";
            custom_li.style.transition = "background-color 0.3s";

            custom_li.addEventListener("mouseenter", function () {
                this.style.backgroundColor = "rgb(243, 243, 243)";
                this.style.borderRadius = "8px";
            });

            custom_li.addEventListener("mouseleave", function () {
                this.style.backgroundColor = "initial";
            });
            let custom_link = document.createElement("a");
            custom_link.style.padding = "6px 8px";
            custom_link.setAttribute(
                "href",
                `/app/follow-up/view/calendar/Follow%20Up`
            );
            let custom_span1 = document.createElement("span");
            let custom_span2 = document.createElement("span");
            custom_span1.style.marginRight = "10px";
            custom_span1.innerHTML = `<svg class="icon  icon-sm" style="" aria-hidden="true">
            <use class="" href="#icon-calendar"></use>
        </svg>`;
            custom_span2.innerHTML = "Calendar View";
            custom_link.appendChild(custom_span1);
            custom_link.appendChild(custom_span2);
            custom_li.appendChild(custom_link);
            dropdown_ul.appendChild(custom_li);
        }
    },
};
