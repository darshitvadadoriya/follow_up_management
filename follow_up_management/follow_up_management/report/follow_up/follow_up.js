// Copyright (c) 2024, Sanskar Technolab and contributors
// For license information, please see license.txt

frappe.query_reports["Follow Up"] = {
	"filters": [
		{
			"fieldname": "date_range",
			"label": __("Date Range"),
			"fieldtype": "Select",
			"options": "\nToday\nYesterday\nThis Week\nLast Week\nLast 15 Days\nThis Month\nLast Month\nThis Year",
			"default": ""
		},
		{
			"fieldname": "from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": ""
		},
		{
			"fieldname": "to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": ""
		},
		{
			"fieldname": "source_doctype",
			"label": __("Source DocType"),
			"fieldtype": "Link",
			"options": "DocType",
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
	],
	"onload": function (report) {
		initializeFilters();
		frappe.db.get_list("Follow Up", { fields: ["name", "source_doctype"] })
			.then(function (data) {
				console.log(data);
				var sourceOptions = data.map(function (entry) { return entry.source_doctype; });
				let sourceSet = new Set(sourceOptions);
				let sourceArray = Array.from(sourceSet);
				console.log(sourceArray);
				report.page.fields_dict.source_doctype.df.get_query = function () {
					return {
						doctype: "DocType",
						filters: { "name": ["in", sourceArray] }
					};
				};
			})
			.catch(function (err) {
				console.error("Error fetching Source options:", err);
			});
	}
};

function initializeFilters() {
	frappe.query_report.set_filter_value("from_date", "");
	frappe.query_report.set_filter_value("to_date", "");
	frappe.query_report.set_filter_value("date_range", "");

	$("input[data-fieldname=from_date]").off("change").on("change", function () {
		validateDateFilters();
		console.log(this);

	});

	$("input[data-fieldname=to_date]").off("change").on("change", function () {
		validateDateFilters();
		console.log(this);
	});

	$("select[data-fieldname=date_range]").off("change").on("change", function () {
		const dateRange = frappe.query_report.get_filter_value("date_range");

		if (dateRange) {
			frappe.query_report.filters.forEach(function (filter) {
				if (filter.df.fieldname === 'from_date' || filter.df.fieldname === 'to_date') {
					filter.set_input('');
				}
			});
			frappe.query_report.set_filter_value("date_range", dateRange);
		}
	});
}

function validateDateFilters() {
	const fromDate = frappe.query_report.get_filter_value("from_date");
	const toDate = frappe.query_report.get_filter_value("to_date");
	const dateRange = frappe.query_report.get_filter_value("date_range");
	const fromDateObj = frappe.datetime.str_to_obj(fromDate);
	const toDateObj = frappe.datetime.str_to_obj(toDate);
	const currentDate = frappe.datetime.nowdate();

	if (fromDateObj && new Date(fromDateObj) > new Date(currentDate)) {
		frappe.msgprint(__("From Date should not be a future date"));
		frappe.query_report.set_filter_value("from_date", "");
	} else if (toDateObj && new Date(toDateObj) > new Date(currentDate)) {
		frappe.msgprint(__("To Date should not be a future date"));
		frappe.query_report.set_filter_value("to_date", "");
	} else if (fromDateObj && toDateObj && new Date(fromDateObj) > new Date(toDateObj)) {
		frappe.msgprint(__("From Date should not be greater than To Date or To Date should not be less than From Date"));
		frappe.query_report.set_filter_value("from_date", "");
		frappe.query_report.set_filter_value("to_date", "");
	} else if (fromDateObj || toDateObj) {
		frappe.query_report.set_filter_value("date_range", "");
	}
}

// Initialize filters on page load
initializeFilters();