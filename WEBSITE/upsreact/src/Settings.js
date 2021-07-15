export default function Settings() {
    return {
        "portalOwnerId": 1038470,

        "server": {
            "db": "https://selester-trial-ml-002.azurewebsites.net/api/db",
        },

        "password-regex": "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$){8,}"
    }
}
