
# Follow-up Management
The Follow-Up Management App allows you to manage follow-ups from Leads and Quotations through a user-friendly interface and interactive dashboards and reports for analytics purposes.


## Description
Follow-Up Management App for Frappe ERPNext – the ultimate solution for efficient follow-up management. With Lead and Quotation at its core, tracking follow-ups becomes effortless, providing a centralized hub for all your follow-up-related activities within a single screen. The app enables tracking of all follow-ups, organizing them based on status and priority, offering reminder functionality, and furnishing Detailed Reports, a Kanban Board, a Calendar View, a Dashboard, and a Dedicated Workspace.


## Installation
  ```sh
  bench get-app https://github.com/darshitvadadoriya/follow_up_management.git
  bench --site site-name install-app follow_up_management
  ```

## Pre-requisites
1. Install ERPNext
2. Setup Default Email Account


## Key Features
1. Manage Follow-Ups of Sales Persons.
2. Enhanced User Interface.
3. Includes Calendar View, Gantt View, Custom Dashboard, Kanban Dashboard, and Custom Report for analytics purposes.
4. Directly accessible for the Lead and Quotation.
5. Email and System Notifications will be sent as a reminder 30 minutes before the scheduled time.
6. Automatically update status.
7. Easy to customize.


## Customizations
- We can easily customize the Follow-up Management App for any DocType to have all of the features.


## Setup
**Step-1:**
- Presenting the new tab named as `Follow Up` in the Lead and Quotation form.
- To create a new follow-up, choose `Create Follow Up`. You can then update or delete follow-ups directly from the follow-up cards.
  
![image](https://github.com/darshitvadadoriya/follow_up_management/assets/147048179/456c4d77-7219-4a2a-8306-bfbb6fa158b9)

  
**Step-2:**

![update-followup](https://github.com/darshitvadadoriya/follow_up_management/assets/132453297/f893bc3f-9fb0-4571-8286-d2d34ec54f1d)

- Update a follow-up by clicking on the update button and redirecting to the follow-up form.
- In this form, users can display follow-up details such as follow-up from, follow-up by, priority, status, communication type, follow-up datetime, and remarks.

**Step-3:**

![delete-follow-up](https://github.com/darshitvadadoriya/follow_up_management/assets/132453297/bd5901e3-286e-486e-adbe-85efe22d555f)

- Users have the option to delete the follow-up from the lead. They can do so by clicking on the delete button, which will prompt a confirmation message before deleting it.

**Step-4**

![reminder](https://github.com/darshitvadadoriya/follow_up_management/assets/132453297/414cdda0-7465-46ca-9bd2-ef873c8efd85)

- Users receive reminders via system notifications and emails 30 minutes before the scheduled follow-up date and time.
- Automatically change status Upcoming to Pending if follow-up taken is missed date-time is missed.



