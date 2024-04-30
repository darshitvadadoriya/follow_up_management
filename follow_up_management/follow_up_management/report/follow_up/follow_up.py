# Copyright (c) 2024, Sanskar Technolab and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime, timedelta
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
            "fieldtype": "Link",
            "options": "Lead",
            "width": "220",
        },
        # {
        #     "fieldname": "user_name",
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
            "fieldname": "followup_by",
            "label": "Follow Up By",
            "fieldtype": "Link",
            "options": "User",
            "width": "200",
        },
        {
            "fieldname": "user_name",
            "label": "Name",
            "fieldtype": "Link",
            "options": "Lead",
            "width": "160",
        },
        {
            "fieldname": "communication_type",
            "label": "Communication Type",
            "fieldtype": "Select",
            "options": "Call\nEmail\nSMS\nWhatsApp\nVisit",
            "width": "180",
        },
    ]

    # DEFINE CONDITIONS
    conditions = {}

    # DEFINE FILTERS
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

    # DATE RANGE
    date_range = filters.get("date_range")
    if date_range:
        today = frappe.utils.today()

    if date_range == "Today":
        today = datetime.today().strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = ["=", today]

    elif date_range == "Yesterday":
        yesterday = (datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = ["between", [yesterday, yesterday]]

    elif date_range == "This Week":
        start_of_week = (
            datetime.today() - timedelta(days=datetime.today().weekday())
        ).strftime("%Y-%m-%d")
        start_of_week = datetime.strptime(start_of_week, "%Y-%m-%d")
        end_of_week = (start_of_week + timedelta(days=6)).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [
            "between",
            [start_of_week.strftime("%Y-%m-%d"), end_of_week],
        ]

    elif date_range == "Last Week":
        end_of_last_week = datetime.today() - timedelta(days=datetime.today().weekday())
        start_of_last_week = end_of_last_week - timedelta(days=6)
        conditions["follow_up_datetime"] = [
            "between",
            [
                start_of_last_week.strftime("%Y-%m-%d"),
                end_of_last_week.strftime("%Y-%m-%d"),
            ],
        ]

    elif date_range == "Last 15 Days":
        last_15_days = (datetime.today() - timedelta(days=15)).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [
            "between",
            [last_15_days, datetime.today().strftime("%Y-%m-%d")],
        ]

    elif date_range == "This Month":
        start_of_month = datetime.today().replace(day=1)
        _, last_day_of_month = calendar.monthrange(
            start_of_month.year, start_of_month.month
        )
        end_of_month = start_of_month.replace(day=last_day_of_month)
        filters["date_of_visit"] = [
            "between",
            [start_of_month.strftime("%Y-%m-%d"), end_of_month.strftime("%Y-%m-%d")],
        ]

    elif date_range == "Last Month":
        first_day_of_current_month = datetime.today().replace(day=1)
        last_day_of_last_month = first_day_of_current_month - timedelta(days=1)
        start_of_last_month = last_day_of_last_month.replace(day=1).strftime("%Y-%m-%d")
        end_of_last_month = last_day_of_last_month.strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [
            "between",
            [start_of_last_month, end_of_last_month],
        ]

    elif date_range == "This Year":
        start_of_year = datetime.today().replace(month=1, day=1).strftime("%Y-%m-%d")
        conditions["follow_up_datetime"] = [">=", start_of_year]

    data = frappe.db.get_list(
        "Follow Up",
        filters=conditions,
        fields=[
            "name",
            "source_doctype",
            "source",
            "user_name",
            "status",
            "priority",
            "follow_up_datetime",
            "followup_by",
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
