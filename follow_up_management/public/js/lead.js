frappe.ui.form.on("Lead", {

    refresh(frm){
        frm.trigger("followupdetails");
        frm.trigger("delete_follow_up");
    },

    custom_create_follow_up(frm){
        let d = new frappe.ui.Dialog({
            title: "Create Follow-up",
            fields: [
            
              {
                label: "Follow up Date&Time",
                fieldname: "follow_up_datetime",
                fieldtype: "Datetime",
                reqd: 1,
              },
              
              {
                label: "Follow Up By",
                fieldname: "follow_up_by",
                fieldtype: "Link",
                options: "User",
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
                label: "Communication type",
                fieldname: "communication_type",
                fieldtype: "Select",
                options: "Call\nEmail\nSMS\nWhatsApp",
                reqd: 1,
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
                    "follow_up_management.follow_up_management.doctype.follow_up.follow_up.create_follow_up_lead",
                  args: {
                    follow_up_of: "Lead",
                    lead: frm.doc.name,
                    follow_up_datetime: values.follow_up_datetime,
                    follow_up_by: values.follow_up_by ? values.follow_up_by : "",
                    status: values.status,
                    priority: values.priority,
                    communication_type: values.communication_type,
                    remarks: values.remarks ? values.remarks : "",
                  },
                });
              
              d.hide();
      
              if (frm.is_dirty()) {
                frm.save();
              } else {
                frm.reload_doc();
              }
            },
          });
          d.show();
    

        },


          //Follow up view
followupdetails(frm) {
    
    frappe.call({
      method:
        "follow_up_management.follow_up_management.doctype.follow_up.follow_up.view_follow_up_lead",
      args: {
        docname: frm.doc.name,
      },
      callback: function (response) {
        // frappe.msgprint(response)
        var data = response.message;
        if (data) {
          // console.log(data);

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
            // console.log(data);
            var statusView = "";
            var priorityView = "";
            var dateView = "";
            var agentView = "";
            var communicationView = "";
            var uniqueId = "";

            uniqueId = "<p class='d-none uniqueId'>" + data.name + "</p>";
            statusView =
              "<p>Status:<span class='text-danger'>" +
              data.status +
              "</span></p>";
            priorityView = "<p>Priority: " + data.priority + "</p>";
            dateView = "<p>Date: " + frappe.datetime.str_to_user(data.follow_up_datetime) + "</p>";
            agentView = "<p>Followup By: " + data.user_name + " </p>";
            communicationView =
              "<p>Communication Type: " + data.communication_type + "</p>";

              custom_followup_details +=
              "<div class='card-view' style='min-width:200px;box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1);padding:20px;border-radius:15px;font-size:16px'>" +
              uniqueId +
              statusView +
              priorityView +
              dateView +
              agentView +
              communicationView +
              "<div><a href='' class='btn btn-sm btn-primary edit-btn'>Edit Details</a><button style='margin-left:10px' type='button' class='btn btn-sm btn-danger delete-btn'>Delete</button></div></div>";
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
      },
    });
  },


  //delete follow up
  delete_follow_up(frm) {
    setTimeout(() => {
      var card = document.querySelectorAll(".card-view");
      // console.log(card)
      card.forEach((data) => {
        var deleteButton = data.querySelector(".delete-btn");
        var editButton = data.querySelector(".edit-btn");
        var uniqueId = data.querySelector(".uniqueId").innerHTML;

        // for delete button
        deleteButton.addEventListener("click", () => {
          frappe.confirm(
            "Are you sure you want to proceed?",
            () => {
              // console.log(uniqueId);
              frappe.call({
                method:
                  "follow_up_management.follow_up_management.doctype.follow_up.follow_up.delete_follow_up_lead",
                args: {
                  docname: uniqueId,
                },
                callback: function (response) {
                  if (response.message) {
                    frappe.show_alert("Follow up Successfully Deleted!");
                  }
                },
              });
              setTimeout(() => {
                if (frm.is_dirty()) {
                  frm.save();
                } else {
                  frm.reload_doc();
                }
              }, 300);
            },
            () => {
              // console.log("No");
            }
          );
        });

        // for edit button
        editButton.addEventListener("click", () => {
          editButton.href =
            window.location.origin + "/app/follow-up/" + uniqueId;
          // console.log(window.location.origin+"/app/follow-up/"+uniqueId)
        });
      });
    }, 200);
  },


})


