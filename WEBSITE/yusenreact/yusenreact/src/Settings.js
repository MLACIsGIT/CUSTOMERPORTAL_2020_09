export default function Settings() {
    return {
        "portalOwnerId": 1038482,

        "server": {
            "db": "http://localhost:7071/api/db",
        },

        "password-regex": "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$){8,}"
    }
}
