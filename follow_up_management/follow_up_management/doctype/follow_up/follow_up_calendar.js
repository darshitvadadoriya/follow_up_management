frappe.views.calendar["Follow Up"] = {
    field_map: {
        start: "follow_up_datetime",
        end: "follow_up_datetime",
        id: "id",
        title: "follow_up_by",
        allDay: 0,
        progress: "progress",
    },
    gantt: true,
    filters: [
        {
            label: __("Follow Up By"),
            fieldname: "follow_up_by",
            fieldtype: "Link",
            options: "Sales Person",
        },
    ],
    get_events_method: "frappe.desk.calendar.get_events",
};