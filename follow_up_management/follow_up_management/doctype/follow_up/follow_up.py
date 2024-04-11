# Copyright (c) 2024, Sanskar Technolab and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime, timedelta
from frappe.utils import get_url
from frappe.model.document import Document


class FollowUp(Document):
	pass



@frappe.whitelist()
def create_follow_up_lead(follow_up_of,lead,follow_up_datetime,follow_up_by,status,priority,communication_type,remarks):
	
	doc=frappe.new_doc("Follow Up")
	doc.follow_up_from=follow_up_of
	doc.lead=lead
	doc.priority=priority
	doc.follow_up_datetime=follow_up_datetime
	doc.followup_by=follow_up_by
	doc.status=status
	doc.communication_type=communication_type
	doc.remarks=remarks
	doc.insert()
 
 
@frappe.whitelist()
def view_follow_up_lead(docname):
	doc=frappe.get_list('Follow Up',filters={'lead': docname},fields=['name','user_name','priority','follow_up_datetime','status','communication_type','remarks'])
	return doc


@frappe.whitelist()
def delete_follow_up_lead(docname):
	doc=frappe.delete_doc("Follow Up",docname)
	return True


@frappe.whitelist()
def reminder():
	doc=frappe.get_list("Follow Up",filters={'status': 'Upcoming'})
	return True


# Change status upcoming to pending if the follow-up has passed--------------
@frappe.whitelist()
def check_followup_status():
    # Fetch all upcoming follow-ups
    docs = frappe.get_all(
		"Follow Up", 
		filters={"status": "Upcoming"}, 
		fields=["name", "follow_up_datetime"]
	)
    
    for doc in docs:
        follow_up_datetime = doc.get("follow_up_datetime")

        visit_datetime = datetime.strptime(f"{follow_up_datetime}", "%Y-%m-%d %H:%M:%S")
        
        # Get current datetime
        current_datetime = datetime.now()
        
        # Check if the follow-up has passed
        if visit_datetime <= current_datetime:
          
            # Update the status of the follow-up to "Pending"
            frappe.db.set_value("Follow Up", doc.get("name"), "status", "Pending")
    
    frappe.db.commit()
    
    
    
    
    
# send reminder before 1 hours
@frappe.whitelist()
def reminder():
    # Fetch all upcoming follow-ups
    docs = frappe.get_all(
		"Follow Up", 
		filters={"status": "Upcoming","sent_reminder":0}, 
		fields=["name", "follow_up_datetime","followup_by"]
	)
    def_email = frappe.get_list("Email Account",filters={'default_outgoing':1})
    for doc in docs:
        follow_up_datetime = doc.get("follow_up_datetime")

        visit_datetime = datetime.strptime(f"{follow_up_datetime}", "%Y-%m-%d %H:%M:%S")
        
        # Get current datetime
        current_datetime = datetime.now()
        
        time_diff = visit_datetime - timedelta(hours=0, minutes=30)
        if time_diff <= current_datetime:
           
            
            follow_up = doc.get("name")
            user = doc.get("followup_by")
            
            base_url = get_url()+"/app/follow-up/"+follow_up
            
            doc = frappe.new_doc("Notification Log")
            doc.document_name = follow_up
            doc.document_type = "Follow Up"
            doc.for_user = user
            doc.subject = "Followup Reminder"
            doc.email_content = "Schedule Followup for this time"
            doc.type = "Alert"
            doc.insert(ignore_permissions=True)
            
            
            
            if len(def_email) != 0:
                
                frappe.sendmail(
					recipients=user,
					subject = "Followup Reminder",
					message="""
								<h3>Followup Reminder <a href={}>{}</a></h3>
							
						""".format(base_url,follow_up)
            	)
                
            frappe.db.set_value("Follow Up",follow_up,"sent_reminder",1)
            
            
    frappe.db.commit()
        
    
