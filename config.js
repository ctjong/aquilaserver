module.exports = 
{
    database:
    {
        engine: "mssql",
        connectionString: process.env.CT_BLACKROCK_CONNECTIONSTRING.replace("{db}", "aquila")
    },
    auth:
    {
        secretKey: process.env.CT_AQUILA_SECRETKEY,
        salt: process.env.CT_AQUILA_SALT,
        passwordReqs:
        {
            minLength: 8,
            uppercaseChar: false,
            lowercaseChar: false,
            digitChar: false,
            specialChar: false
        }
    },
    storage:
    {
        provider: "azure",
        azureStorageConnectionString: process.env.CT_BLUEHAVEN_CONNECTIONSTRING,
        azureStorageContainerName: "aquila"
    },
    monitoring:
    {
        azureAppInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY
    },
    entities:
    {
        "task":
        {
            fields:
            {
                "name": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "date": { type: "int", isEditable: true, createReq: 2, foreignKey: null },
                "recmode": { type: "int", isEditable: true, createReq: 1, foreignKey: null },
                "recdays": { type: "string", isEditable: true, createReq: 1, foreignKey: null },
                "recinterval": { type: "int", isEditable: true, createReq: 1, foreignKey: null },
                "recend": { type: "int", isEditable: true, createReq: 1, foreignKey: null },
                "recholes": { type: "string", isEditable: true, createReq: 0, foreignKey: null },
            },
            allowedRoles:
            {
                "read": ["owner", "admin"],
                "create": ["member"],
                "update": ["owner", "admin"],
                "delete": ["owner", "admin"]
            }
        },
        "plan":
        {
            fields:
            {
                "state": { type: "int", isEditable: true, createReq: 0, foreignKey: null },
                "name": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "description": { type: "string", isEditable: true, createReq: 1, foreignKey: null },
            },
            allowedRoles:
            {
                "read": ["guest", "member", "owner", "admin"],
                "create": ["member"],
                "update": ["owner", "admin"],
                "delete": ["owner", "admin"]
            },
            getReadCondition: function (roles, userId)
            {
                if (!roles.contains("owner") && !roles.contains("admin"))
                    return "state=2";
                return "";
            },
            isWriteAllowed: function (action, roles, userId, dbResource, inputResource)
            {
                if (roles.contains("admin"))
                    return true;
                if (roles.contains("owner"))
                    return (action === "update" && (!!n.state && n.state > o.state && n.state <= 2)) ||
                        (action === "delete" && o.state === 0);
                return false;
            }
        },
        "plantask":
        {
            fields:
            {
                "planid": { type: "int", isEditable: false, createReq: 2, foreignKey: { foreignEntity: "plan", resolvedKeyName: "plan" } },
                "state": { type: "int", isEditable: true, createReq: 0, foreignKey: null },
                "day": { type: "int", isEditable: true, createReq: 2, foreignKey: null },
                "name": { type: "string", isEditable: true, createReq: 2, foreignKey: null },
                "description": { type: "string", isEditable: true, createReq: 1, foreignKey: null },
            },
            allowedRoles:
            {
                "read": ["guest", "member", "owner", "admin"],
                "create": ["member"],
                "update": ["owner", "admin"],
                "delete": ["owner", "admin"]
            },
            getReadCondition: function (roles, userId)
            {
                if (roles.contains("owner") || roles.contains("admin"))
                    return "";
                return "state=2";
            },
            isWriteAllowed: function (action, roles, userId, dbResource, inputResource)
            {
                if (roles.contains("admin"))
                    return true;
                if (roles.contains("owner"))
                    return (action === "update" && ((!!n.state && n.state > o.state && n.state <= 2) && (o.state === 0 || (n.day === o.day && n.name === o.name && n.description === o.description)))) ||
                        (action === "delete" && o.state === 0);
                return false;
            }
        },
        "planenrollment":
        {
            fields:
            {
                "planid": { type: "int", isEditable: false, createReq: 2, foreignKey: { foreignEntity: "plan", resolvedKeyName: "plan" } },
                "startdate": { type: "int", isEditable: true, createReq: 2, foreignKey: null },
                "completeddays": { type: "int", isEditable: true, createReq: 0, foreignKey: null },
            },
            unique: ["ownerid", "planid"],
            allowedRoles:
            {
                "read": ["owner", "admin"],
                "create": ["member"],
                "update": ["owner", "admin"],
                "delete": ["owner", "admin"]
            },
            isWriteAllowed: function (action, roles, userId, dbResource, inputResource)
            {
                if (roles.contains("owner") || roles.contains("admin"))
                    return true;
                if (roles.contains("member"))
                    return (!!n.plan && n.plan.state > 0);
                return false;
            }
        }
    }
};