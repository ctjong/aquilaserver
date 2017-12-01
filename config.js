module.exports = 
{
    secretKey: process.env.CT_AQUILA_SECRETKEY,
    salt: process.env.CT_AQUILA_SALT,
    databaseConnectionString: process.env.CT_BLACKROCK_CONNECTIONSTRING.replace("{db}", "aquila"),
    storageConnectionString: process.env.CT_BLUEHAVEN_CONNECTIONSTRING,
    facebookAppSecret: process.env.CT_AQUILA_FBAPSECRET,
    facebookAppId: process.env.CT_AQUILA_FBAPPID,
    storageContainerName: "aquila",
    emailVerificationRequired: false,
    captchaEnabled: false,
    passwordReqs:
    {
        minLength: 8,
        uppercaseChar: false,
        lowercaseChar: false,
        digitChar: false,
        specialChar: false
    },
    roles: ["member", "admin"],
    defaultRole: "member",
    entities:
    {
        "asset":
        {
            fields:
            {
                "id": { type: "id", isEditable: false, createReq: 0, foreignKey: null },
                "ownerid": { type: "int", isEditable: false, createReq: 0, foreignKey: { foreignEntity: "user", resolvedKeyName: "owner" } },
                "filename": { type: "string", isEditable: true, createReq: 2, foreignKey: null }
            },
            readConditionStrings: [],
            validators:
            {
                create: [],
                update: [],
                delete: []
            }
        },
        "user":
        {
            fields:
            {
                "id": { type: "id", isEditable: false, createReq: 0, foreignKey: null },
                "domain": { type: "string", isEditable: false, createReq: 0, foreignKey: null },
                "domainid": { type: "string", isEditable: false, createReq: 0, foreignKey: null },
                "roles": { type: "string", isEditable: false, createReq: 0, foreignKey: null },
                "username": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "password": { type: "secret", isEditable: false, createReq: 2, foreignKey: null },
                "email": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "firstname": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "lastname": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "createdtime": { type: "timestamp", isEditable: false, createReq: 0, foreignKey: null }
            },
            readConditionStrings: [{ roles: ["member", "owner", "admin"], fn: function (u) { return ""; } }],
            validators:
            {
                create: [{ roles: ["guest"], fn: function (n) { return true; } }],
                update: [{ roles: ["owner", "admin"], fn: function (u, o, n) { return true; } }],
                delete: [{ roles: ["admin"], fn: function (o) { return true; } }]
            }
        },
        "task":
        {
            fields:
            {
                "id": { type: "id", isEditable: false, createReq: 0, foreignKey: null },
                "ownerid": { type: "int", isEditable: false, createReq: 0, foreignKey: { foreignEntity: "user", resolvedKeyName: "owner" } },
                "name": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "date": { type: "int", isEditable: true, createReq: 2, foreignKey: null },
                "recmode": { type: "int", isEditable: true, createReq: 1, foreignKey: null },
                "recdays": { type: "string", isEditable: true, createReq: 1, foreignKey: null },
                "recinterval": { type: "int", isEditable: true, createReq: 1, foreignKey: null },
                "recend": { type: "int", isEditable: true, createReq: 1, foreignKey: null },
                "recholes": { type: "string", isEditable: true, createReq: 0, foreignKey: null },
                "createdtime": { type: "timestamp", isEditable: false, createReq: 0, foreignKey: null }
            },
            readConditionStrings: [{ roles: ["owner", "admin"], fn: function (u) { return ""; } }],
            validators:
            {
                create: [{ roles: ["member"], fn: function (n) { return true; } }],
                update: [{ roles: ["owner", "admin"], fn: function (u, o, n) { return true; } }],
                delete: [{ roles: ["owner", "admin"], fn: function (o) { return true; } }]
            }
        },
        "plan":
        {
            fields:
            {
                "id": { type: "id", isEditable: false, createReq: 0, foreignKey: null },
                "ownerid": { type: "int", isEditable: false, createReq: 0, foreignKey: { foreignEntity: "user", resolvedKeyName: "owner" } },
                "state": { type: "int", isEditable: true, createReq: 0, foreignKey: null },
                "name": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "description": { type: "string", isEditable: true, createReq: 1, foreignKey: null },
                "createdtime": { type: "timestamp", isEditable: false, createReq: 0, foreignKey: null }
            },
            readConditionStrings:
            [
                { roles: ["guest", "member"], fn: function (u) { return "state=2"; } },
                { roles: ["owner", "admin"], fn: function (u) { return ""; } }
            ],
            validators:
            {
                create:
                [
                    { roles: ["member"], fn: function (n) { return true; } }
                ],
                update:
                [
                    { roles: ["owner"], fn: function (u, o, n) { return (!!n.state && n.state > o.state && n.state <= 2); } },
                    { roles: ["admin"], fn: function (u, o, n) { return true; } }
                ],
                delete:
                [
                    { roles: ["owner"], fn: function (o) { return o.state === 0; } },
                    { roles: ["admin"], fn: function (o) { return true; } }
                ]
            }
        },
        "plantask":
        {
            fields:
            {
                "id": { type: "id", isEditable: false, createReq: 0, foreignKey: null },
                "ownerid": { type: "int", isEditable: false, createReq: 0, foreignKey: { foreignEntity: "user", resolvedKeyName: "owner" } },
                "planid": { type: "int", isEditable: false, createReq: 2, foreignKey: { foreignEntity: "plan", resolvedKeyName: "plan" } },
                "state": { type: "int", isEditable: true, createReq: 0, foreignKey: null },
                "day": { type: "int", isEditable: true, createReq: 2, foreignKey: null },
                "name": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "description": { type: "string", isEditable: true, createReq: 1, foreignKey: null },
                "createdtime": { type: "timestamp", isEditable: false, createReq: 0, foreignKey: null }
            },
            readConditionStrings:
            [
                { roles: ["guest", "member"], fn: function (u) { return "state=2"; } },
                { roles: ["owner", "admin"], fn: function (u) { return ""; } }
            ],
            validators:
            {
                create:
                [
                    { roles: ["member"], fn: function (n) { return true; } }
                ],
                update:
                [
                    { roles: ["owner"], fn: function (u, o, n) { return ((!!n.state && n.state > o.state && n.state <= 2) && (o.state === 0 || (n.day === o.day && n.name === o.name && n.description === o.description))); } },
                    { roles: ["admin"], fn: function (u, o, n) { return true; } }
                ],
                delete:
                [
                    { roles: ["owner"], fn: function (o) { return o.state === 0; } },
                    { roles: ["admin"], fn: function (o) { return true; } }
                ]
            }
        },
        "planenrollment":
        {
            fields:
            {
                "id": { type: "id", isEditable: false, createReq: 0, foreignKey: null },
                "ownerid": { type: "int", isEditable: false, createReq: 0, foreignKey: { foreignEntity: "user", resolvedKeyName: "owner" } },
                "planid": { type: "int", isEditable: false, createReq: 2, foreignKey: { foreignEntity: "plan", resolvedKeyName: "plan" } },
                "startdate": { type: "int", isEditable: true, createReq: 2, foreignKey: null },
                "completeddays": { type: "int", isEditable: true, createReq: 0, foreignKey: null },
                "createdtime": { type: "timestamp", isEditable: false, createReq: 0, foreignKey: null }
            },
            unique: ["ownerid", "planid"],
            readConditionStrings: [{ roles: ["owner", "admin"], fn: function (u) { return ""; } }],
            validators:
            {
                create: [{ roles: ["member"], fn: function (n) { return (!!n.plan && n.plan.state > 0); } }],
                update: [{ roles: ["owner", "admin"], fn: function (u, o, n) { return true; } }],
                delete: [{ roles: ["owner", "admin"], fn: function (o) { return true; } }]
            }
        }
    }
};