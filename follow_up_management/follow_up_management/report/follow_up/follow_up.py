# Copyright (c) 2024, Sanskar Technolab and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime, timedelta,date
from frappe.utils import getdate
import calendar
from dateutil.relativedelta import relativedelta


def execute(filters=None):
    columns = [
        {
            "fieldname": "name",
            "label": "Follow Up",
            "fieldtype": "Link",
            "options": "Follow Up",
            "width": "220",
        },
        {
            "fieldname": "source_doctype",
            "label": "Source DocType",
            "fieldtype": "Link",
            "options": "DocType",
            "width": "150",
        },
        {
            "fieldname": "source",
            "label": "Source",
            "fieldtype": "Dynamic Link",
            "options": "source_doctype",
            "width": "220",
        },
        # {
        #     "fieldname": "follow_up_by_name",
        #     "label": "Name",
        #     "fieldtype": "Link",
        #     "options": "Lead",
        #     "width": "200",
        # },
        {
            "fieldname": "status",
            "label": "Status",
            "fieldtype": "Select",
            "options": "Upcoming\nCompleted\nMissed\nPending\nCancelled",
            "width": "100",
        },
        {
            "fieldname": "priority",
            "label": "Priority",
            "fieldtype": "Select",
            "options": "Cold\nWarm\nHot",
            "width": "100",
        },
        {
            "fieldname": "follow_up_datetime",
            "label": "Follow Up Datetime",
            "fieldtype": "Datetime",
            "width": "200",
        },
        {
            "fieldname": "follow_up_by",
            "label": "Follow Up By",
            "fieldtype": "Link",
            "options": "Sales Person",
            "width": "200",
        },
        {
            "fieldname": "communication_type",
            "label": "Communication Type",
            "fieldtype": "Select",
            "options": "Call\nEmail\nSMS\nWhatsApp\nVisit",
            "width": "180",
        },
    ]

    today = date.today()

    start_of_year = today.replace(month=1, day=1)
    end_of_year = today.replace(month=12, day=31)

    # DEFINE CONDITIONS
    conditions = {}

    # DEFINE FILTERS
    follow_up_by_filter = filters.get("follow_up_by")
    if follow_up_by_filter:
        conditions["follow_up_by"] = follow_up_by_filter

    source_filter = filters.get("source_doctype")
    if source_filter:
        conditions["source_doctype"] = source_filter

    status_filter = filters.get("status")
    if status_filter:
        conditions["status"] = status_filter

    priority_filter = filters.get("priority")
    if priority_filter:
        conditions["priority"] = priority_filter

    # FROM DATE
    from_date_filter = filters.get("from_date")
    if from_date_filter:
        conditions["from_date"] = from_date_filter

    # TO DATE
    to_date_filter = filters.get("to_date")
    if from_date_filter:
        conditions["to_date"] = to_date_filter

    # FOR FROM AND TO DATE
    # if only from_date is applied
    if "from_date" in conditions and "to_date" not in conditions:
        # calling the from_date from the condition dict to_date
        from_date = getdate(conditions.get("from_date"))

        # setting the to_date one year ahead of the from_date
        to_date = from_date + relativedelta(years=1)

        # removing the from_date from the condition dict
        conditions.pop("from_date", None)

        # adding the query filter to the condition dict
        conditions["follow_up_datetime"] = ["between", [from_date, to_date]]

        # if only to_date is applied
    elif "to_date" in conditions and "from_date" not in conditions:
        # calling the to_date from the condition dict to_date
        to_date = getdate(conditions.get("to_date"))

        # setting the from_date one year less than the to_date
        from_date = to_date - relativedelta(years=1)

        # removing the to_date from the condition dict
        conditions.pop("to_date", None)

        # adding the query filter to the condition dict
        conditions["follow_up_datetime"] = ["between", [from_date, to_date]]

        # if from_date and to_date both applied
    elif "from_date" and "to_date" in conditions:
        # calling from_date and to_date from the condition dict to_date
        from_date = getdate(conditions.get("from_date"))
        to_date = getdate(conditions.get("to_date"))

        # removing from_date and to_date from the condition dict
        conditions.pop("from_date", None)
        conditions.pop("to_date", None)

        # adding the query filter to the condition dict
        conditions["follow_up_datetime"] = ["between", [from_date, to_date]]

  # FOR DATE RANGE FILTER
    filter = filters.get("filter")
    if filter:
        today = frappe.utils.today()

    if filter == "today_only":
        today = datetime.today().strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = ["between", [today,today]]

    elif filter == "yesterday":
        yesterday = (datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = ["between", [yesterday, yesterday]]

    elif filter == "this_week":
        start_of_week = (
            datetime.today() - timedelta(days=datetime.today().weekday())
        ).strftime("%Y-%m-%d")
        start_of_week = datetime.strptime(start_of_week, "%Y-%m-%d")
        end_of_week = (start_of_week + timedelta(days=6)).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [
            "between",
            [start_of_week.strftime("%Y-%m-%d"), end_of_week],
        ]

    elif filter == "last_week":
        end_of_last_week = datetime.today() - timedelta(days=datetime.today().weekday())
        start_of_last_week = end_of_last_week - timedelta(days=6)
        conditions["follow_up_datetime"] = [
            "between",
            [
                start_of_last_week.strftime("%Y-%m-%d"),
                end_of_last_week.strftime("%Y-%m-%d"),
            ],
        ]

    elif filter == "last_15_days":
        last_15_days = (datetime.today() - timedelta(days=15)).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [
            "between",
            [last_15_days, datetime.today().strftime("%Y-%m-%d")],
        ]

    elif filter == "this_month":
        today = datetime.today()  # Get today's date
        start_of_month = today.replace(day=1)  # First day of the current month
        end_of_month = start_of_month.replace(day=calendar.monthrange(today.year, today.month)[1])  # Last day of the current month

        # Print for debugging
        # print("Today:", today)
        # print("Start of Month:", start_of_month)
        # print("End of Month:", end_of_month)

        conditions["follow_up_datetime"] = [
            "between",
            [start_of_month.strftime("%Y-%m-%d"), end_of_month.strftime("%Y-%m-%d")],
            
        ]
    elif filter == "last_month":
        first_day_of_current_month = datetime.today().replace(day=1)
        last_day_of_last_month = first_day_of_current_month - timedelta(days=1)
        start_of_last_month = last_day_of_last_month.replace(day=1).strftime("%Y-%m-%d")
        end_of_last_month = last_day_of_last_month.strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [
            "between",
            [start_of_last_month, end_of_last_month],
        ]

    elif filter == "this_year":
        start_of_year = datetime.today().replace(month=1, day=1).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [">=", start_of_year]

  

    data = frappe.db.get_list(
        "Follow Up",
        filters=conditions,
        fields=[
            "name",
            "source_doctype",
            "source",
            "status",
            "priority",
            "follow_up_datetime",
            "follow_up_by",
            "communication_type",
        ],
    )

    for item in data:

        color = "white"
        if item["status"] == "Upcoming":
            color = "#1e87ff"

        elif item["status"] == "Completed":
            color = "#11c711"

        elif item["status"] == "Missed":
            color = "#525252"

        elif item["status"] == "Pending":
            color = "#ff7800"

        elif item["status"] == "Cancelled":
            color = "#ed1717"

        item["status"] = f'<span style="color:{color}"; >{item["status"]}</span>'

    return columns, data
