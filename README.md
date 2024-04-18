<div align="center">
    <h1>Follow-up Management</h1>
</div>

![follow-up-management](https://github.com/darshitvadadoriya/follow_up_management/assets/132453297/e4f4b7e3-5ff2-4969-8d68-4798ef02b7d6)


## Follow-up Management
Follow-up management entails using ERPNext CRM to initiate follow-ups through leads.

## Installation
1. Get app:
  ```sh
  bench get-app https://github.com/darshitvadadoriya/follow_up_management.git
  ```
2. Install app in site:
  ```sh
  bench --site sitename install-app follow_up_management
  ```

## Pre-requisites
1. Install ERPNext
2. Setup default email account


## Setup
**Step-1:**
    
![create follow-up](https://github.com/darshitvadadoriya/follow_up_management/assets/132453297/cedc0072-9946-4175-891c-3d5d22781770)

- Presenting the new tab in the lead document follow-up.
- To generate a new follow-up, choose "create follow". You can then update or delete follow-ups directly from the follow-up grid.
  
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



