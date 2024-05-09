frappe.ui.form.on("Quotation", {
    refresh(frm) {
        frm.trigger("followupdetails");
        frm.trigger("delete_follow_up");
    },
    custom_create_follow_up(frm) {
        let create_follow_up_dialog = new frappe.ui.Dialog({
            title: "Create Follow Up",
            fields: [
                {
                  label: "Follow Up Datetime",
                  fieldname: "follow_up_datetime",
                  fieldtype: "Datetime",
                  reqd: 1,
                  onchange: function(e) {
                    var currentDatetime = this.value
            
                    // convert str to date obj
                    var datetimeObject = frappe.datetime.str_to_obj(currentDatetime);
                    
                    // Add 30 minutes to the datetime
                    datetimeObject.setMinutes(datetimeObject.getMinutes() + 30);
                    
                    // Format the new datetime as a string with date and time
                    var diff_datetime = frappe.datetime.get_datetime_as_string(datetimeObject);
                    cur_dialog.set_value("follow_up_end_datetime",diff_datetime)
                  }
                },
                {
                  label: "Follow Up End Datetime",
                  fieldname: "follow_up_end_datetime",
                  fieldtype: "Datetime",
                  read_only:1,
                  default:frappe.datetime.now_datetime()
                },
                
                {
                  label: "Follow Up By",
                  fieldname: "follow_up_by",
                  fieldtype: "Link",
                  options: "Sales Person",
                },
                {
                  label: "Status",
                  fieldname: "status",
                  fieldtype: "Select",
                  options: "Upcoming\nCompleted\nCancelled\nPending",
                  default: "Upcoming",
                  reqd: 1,
                },
                {
                  label: "Priority",
                  fieldname: "priority",
                  fieldtype: "Select",
                  options: "Hot\nWarm\nCold",
                  reqd: 1,
                },
                {
                  label: "Communication Type",
                  fieldname: "communication_type",
                  fieldtype: "Select",
                  options: "Call\nEmail\nSMS\nWhatsApp\nVisit",
                  reqd: 1,
                },
                {
                  label: "Color",
                  fieldname: "color",
                  fieldtype: "Color",
                  reqd: 0,
                  description:"set color for calender and gantt view"
                },
                {
                  label: "Remarks",
                  fieldname: "remarks",
                  fieldtype: "Small Text",
                  reqd: 0,
                },
              ],
            primary_action_label: "Submit",
            primary_action(values) {
                frappe.call({
                    method:
                        "frappe.client.insert",
                    args: {
                        doc: {
                            doctype: "Follow Up",
                            source_doctype: "Quotation",
                            source: frm.doc.name,
                            follow_up_datetime: values.follow_up_datetime,
                            follow_up_by: values.follow_up_by ? values.follow_up_by : "",
                            status: values.status,
                            priority: values.priority,
                            communication_type: values.communication_type,
                            color:values.color ? values.color:"",
                            remarks: values.remarks ? values.remarks : "",
                        }
                    },
                    callback: function (res) {
                        var response_message = res.message;
                        if (response_message) {
                            if (frm.is_dirty()) {
                                frm.save();
                            } else {
                                frm.reload_doc();
                            }
                        }
                    }
                });
                create_follow_up_dialog.hide();
            },
        });
        create_follow_up_dialog.show();
    },


    //Follow up view
    followupdetails(frm) {
        frappe.call({
            method:
                "frappe.client.get_list",
            args: {
                doctype: "Follow Up",
                filters: { source_doctype: "Quotation", source: frm.doc.name, },
                fields: ["name", "source_doctype", "source", "follow_up_datetime", "follow_up_by", "status", "priority", "communication_type", "remarks",],
                order_by: "follow_up_datetime desc",
                page_limit: 0,
            },
            callback: function (res) {
                var data = res.message;
                // console.log(data);
                if (data) {
                    var custom_followup_details = `<style>
                                                    .grid {
                                                    display: grid;
                                                    grid-template-columns: repeat(1, minmax(0, 1fr));
                                                    gap: 26px;
                                                    max-width: 360px;
                                                    margin-left: auto;
                                                    margin-right: auto;
                                                    }                      
                                                    @media (min-width: 768px) {
                                                    .grid {
                                                        max-width: none;
                                                        grid-template-columns: repeat(2, minmax(0, 1fr));
                                                    }
                                                    }
                                                    @media (min-width: 1140px) {
                                                    .grid {
                                                        grid-template-columns: repeat(3, minmax(0, 1fr));
                                                    }
                                                    }
                                                    </style>`;
                    data.forEach((data) => {
                        custom_followup_details += `<div class="card-view" style="min-width: 200px;box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);padding: 20px;border-radius: 15px;font-size: 16px;">
                                                        <p> Name:<span class="uniqueId">${data.name}</span></p>
                                                        <p>Status:<span class="text-danger">${data.status}</span></p>
                                                        <p>Priority: ${data.priority}</p>
                                                        <p>Date: ${data.follow_up_datetime}</p>
                                                        <p>Followup By: ${data.follow_up_by}</p>
                                                        <p>Communication Type: ${data.communication_type}</p>
                                                        <div>
                                                            <a href="/app/follow-up/${data.name}" class="btn btn-sm btn-primary edit-btn"> Edit Details </a>
                                                            <button style="margin-left: 10px" type="button" class="btn btn-sm btn-danger delete-btn">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>`
                    });
                    frm.set_df_property(
                        "custom_follow_up_details",
                        "options",
                        "<div class='grid w-100' style='padding:20px 0px;'>" +
                        custom_followup_details +
                        "</div>"
                    );
                    frm.refresh_field("custom_follow_up_details");
                }
            }
        });
    },


    //delete follow up
    delete_follow_up(frm) {
        setTimeout(() => {
            var card = document.querySelectorAll(".card-view");
            card.forEach((data) => {
                var deleteButton = data.querySelector(".delete-btn");
                var uniqueId = data.querySelector(".uniqueId").innerHTML;

                // console.log(uniqueId);

                // for delete button
                deleteButton.addEventListener("click", () => {
                    frappe.confirm(
                        "Are you sure you want to proceed?",
                        () => {
                            frappe.call({
                                method: "frappe.client.delete",
                                args: {
                                    doctype: "Follow Up",
                                    name: uniqueId
                                },
                                callback: function (res) {
                                    frappe.show_alert("Follow up Successfully Deleted!");
                                    if (frm.is_dirty()) {
                                        frm.save();
                                    } else {
                                        frm.reload_doc();
                                    }
                                }
                            })
                        },
                        () => {
                        }
                    );
                });
            });
        }, 200);
    },
});


