A.app({
  appName: "Bien TAMS",
  appIcon: "heartbeat",
  theme: 'bien',
  onlyAuthenticated: true,
  menuItems: [
    	{
	name: "Client Management",
      	icon: "institution",
	children: [
        {
        name: "Client",
        entityTypeId: "ClientFlowBoard",
        icon: "institution",
	},
	{
      	name: "Contact",
      	entityTypeId: "ContactFlowBoard",
      	icon: "users"
    	},
	{
        name: "Statuses",
        entityTypeId: "Status",
        icon: "flash"
        }
   	]
    },
    {
	name: "Requirement Management",
	icon: "diamond",
	children: [
	{
	name: "Positions",
	entityTypeId: "Positions",
	icon: "bullseye"
	},
	{
	name: "Applicants",
      	entityTypeId: "Applicants",
      	icon: "envelope-o"
	},
	{
	name: "Position Status",
	entityTypeId: "PositionStatus"
	},
        {
        name: "Applicant Status",
        entityTypeId: "ApplicantStatus"
        },
	{
        name: "Industry",
        entityTypeId: "Industry"
        }
	]
    }
  ],

  entities: function(Fields) {
    return {
      Client: {
        fields: {
          company: Fields.text("Company").required(),
          site: Fields.text("Site"),
          phone: Fields.text("Phone"),
          lastContactDate: Fields.date('Last contact date'),
          status: Fields.fixedReference("Status", "Status")
        },
	referenceName: "company",
        views: {
          ClientFlowBoard: {
            customView: "board"
          }
        }
      },
      Contact: {
        fields: {
	  company: Fields.fixedReference("Organization", "Client").required(),
          name: Fields.text("Name").required(),
          email: Fields.text("Email").required(),
          phone: Fields.text("Phone").required(),
          lastContactDate: Fields.date('Last contact date'),
          status: Fields.fixedReference("Status", "Status")
        },
	referenceName: "name",
        views: {
          ContactFlowBoard: {
            customView: "contactboard"
          }
        }
      },
      Positions: {
        fields: {
        company: Fields.fixedReference("Client", "Client").required(),
        contact: Fields.fixedReference("Contact", "Contact").required(),
	positionopendate: Fields.date('Position Open Date'),
	position: Fields.text("Position").required(),
        vacanciesopen: Fields.text("Vacancies Open").required(),
	vacanciesclosed: Fields.text("Vacancies Closed").required(),
	location: Fields.text("Location").required(),
	rolenresp: Fields.textarea("Roles & Responsibilities").required(),
	requiredskills: Fields.textarea("Required Skills").required(),
	experience: Fields.integer("Experience").required(),
	salaryrange: Fields.money("Salary Range"),
	Industry: Fields.fixedReference("Industry", "Industry").required(),
	positionJD: Fields.attachment("JD"),
        CloseByDate: Fields.date('Close By Date'),
	positionstatus: Fields.fixedReference("Status", "PositionStatus").required()
        },
	referenceName: "positionstatus",
	referenceName: "industry",
	referenceName: "position",
        views: {
	Positions: {
	showInGrid: ['company', 'position', 'positionopebdate', 'vacanciesopen', 'vacanciesclosed', 'positionstatus', 'CloseByDate']
	},
          PositionsFlowBoard: {
            customView: "board",
          }
        }
        },
      Applicants: {
	fields: {
	applicantname: Fields.text("Applicant Name").required(),
	applicantemail: Fields.text("Applicant Email").required(),
        applicantphone: Fields.text("Applicant Phone").required(),
	positionapplied: Fields.fixedReference("Position Applied", "Positions").required(),
        positionorganization: Fields.fixedReference("Organization", "Client").required(),
	positionpostedby: Fields.fixedReference("Posted By", "Contact").required(),
        applicantlastContactDate: Fields.date('Last Contact Date'),
        applicantstatus: Fields.fixedReference("Applicant Status", "ApplicantStatus").required()
	},
        beforeSave: function (Entity, Crud) {
          if (Entity.applicantstatus === 'Applicant Joined') {
            return Crud.crudFor('Positions').find({}).then(function (last) {
              Entity.vacanciesopen = last[0].vacanciesopen;
              return Crud.crudFor('Positions').updateEntity({id: last[0].id, vacanciesopen: last[0].vacanciesopen - 1});  
            })
         
          }
        }, 
        views: {
	Applicants: {
	showInGrid: ['applicantname', 'positionapplied', 'positionorganization', 'applicantlastContactDate', 'applicantstatus']
	},
          ApplicantsFlowBoard: {
            customView: "board"
          }
        }
	},
      Status: {
        fields: {
          name: Fields.text("Name").required(),
          order: Fields.integer("Order").required()
        },
        sorting: [['order', 1]],
        referenceName: "name"
      },
      PositionStatus: {
        fields: {
          name: Fields.text("Name").required(),
          order: Fields.integer("Order").required()
        },
        sorting: [['order', 1]],
        referenceName: "name"
      },
      ApplicantStatus: {
        fields: {
          name: Fields.text("Name").required(),
          order: Fields.integer("Order").required()
        },
        sorting: [['order', 1]],
        referenceName: "name"
      },
      Industry: {
        fields: {
          name: Fields.text("Industry").required(),
          order: Fields.integer("Order").required()
        },
        sorting: [['order', 1]],
        referenceName: "name"
      }
    }
  },
  migrations: function (Migrations) { return [
    {
      name: "statuses",
      operation: Migrations.insert("Status", [
        {id: "1", name: "Message Sent", order: 1},
        {id: "2", name: "Answered", order: 2},
        {id: "3", name: "Meeting Approved", order: 3},
        {id: "4", name: "Meeting Finished", order: 4},
        {id: "5", name: "Rejected", order: 5}
      ])
    },
    {
    	name: "positionstatus",
	operation: Migrations.insert("PositionStatus", [
        {id: "1", name: "Position Opened", order: 1},
	{id: "2", name: "Souring CVs", order: 2},
	{id: "3", name: "Lining Up Candidates", order: 3},
        {id: "4", name: "Position Closed", order: 4},
     ])
    },
    {
        name: "applicantstatus",
        operation: Migrations.insert("ApplicantStatus", [
        {id: "1", name: "Registered In System", order: 1},
        {id: "2", name: "Screened", order: 2},
        {id: "3", name: "Sent To Client", order: 3},
        {id: "4", name: "Scheduled For Interview", order: 4},
        {id: "5", name: "Shortlisted By Client", order: 5},
        {id: "6", name: "Rejected By Client", order: 6},
        {id: "7", name: "Awaiting Offer Letter", order: 7},
        {id: "8", name: "Offer Letter Rolled", order: 8},
        {id: "9", name: "Negotiations", order: 9},
        {id: "10", name: "Applicant Joined", order: 10},
        {id: "11", name: "Applicant Rejected", order: 11}
     ])
    },
    {
        name: "industry",
        operation: Migrations.insert("Industry", [
        {id: "1", name: "Information Technology", order: 1},
        {id: "2", name: "BFSI", order: 2}
     ])
    },
    {
      name: "bien-clients",
      operation: Migrations.insert("Client", [
        {id: "1", company: "Credit Mantri", site: "creditmantri.com", phone: "+918939621266", status: {id: "1"}, lastContactDate: "2015-07-18"},
        {id: "2", company: "Wedding Vows", site: "weddingvows.com", phone: "+917829826677", status: {id: "2"}, lastContactDate: "2015-07-18"}
      ])
    },
    {
      name: "bien-contacts",
      operation: Migrations.insert("Contact", [
        {id: "1", name: "John Doe", company: {id: "1"}, email: "john@acme.com", site: "acme.com", status: {id: "1"}, lastContactDate: "2015-07-18"},
        {id: "2", name: "Peter Stone", company: {id: "1"}, email: "peter@foobar.com", status: {id: "2"}, lastContactDate: "2015-07-17"}
      ])
    }
  ]}
});
