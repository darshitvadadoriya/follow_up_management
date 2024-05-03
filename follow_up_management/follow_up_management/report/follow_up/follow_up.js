// Copyright (c) 2024, Sanskar Technolab and contributors
// For license information, please see license.txt

frappe.query_reports["Follow Up"] = {
	"filters": [
		  {
			fieldname: "filter",
			label: __("Date Range"),
			fieldtype: "Select",
			options: [
			  { value: "", label: __("") },
			  { value: "select_date_range", label: __("Select Date Range") },
			  { value: "today_only", label: __("Today") },
			  { value: "yesterday", label: __("Yesterday") },
			  { value: "this_week", label: __("This Week") },
			  { value: "last_week", label: __("Last Week") },
			  { value: "last_15_days", label: __("Last 15 Days") },
			  { value: "this_month", label: __("This Month") },
			  { value: "last_month", label: __("Last Month") },
			  { value: "this_year", label: __("This Year") },
			],
			default: "",
		  },
		{
			"fieldname": "from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": "",
			"depends_on": "eval: doc.filter=='select_date_range' ",
		},
		{
			"fieldname": "to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": "",
			"depends_on": "eval: doc.filter=='select_date_range' ",
		},
		{
			"fieldname": "source_doctype",
			"label": __("Source DocType"),
			"fieldtype": "Select",
			"options": "\nLead\nQuotation",
		},
		{
			"fieldname": "status",
			"label": __("Status"),
			"fieldtype": "Select",
			"options": "\nUpcoming\nCompleted\nMissed\nPending\nCancelled",
			"default": ""
		},
		{
			"fieldname": "priority",
			"label": "Priority",
			"fieldtype": "Select",
			"options": "\nCold\nWarm\nHot",
			"width": "100",
		},
		{
			"fieldname": "follow_up_by",
			"label": "Follow Up By",
			"fieldtype": "Link",
			"options": "Sales Person",
			"width": "100",
		},
	],
};
