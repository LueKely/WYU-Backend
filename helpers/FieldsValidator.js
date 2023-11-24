class Fields {
    constructor(req) {
        this.req = req;
        this.acceptedFields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "login_identifier",
            "recipe_name",
            "difficulty",
            "cooking_time",
            "description",
            "ingredients",
            "instructions",
            "tags",
            "image_url",
            "id",
            "user_id",
            "recipe_id",
            "user_comment",
        ];
    }

    areKeysInRequest = (fields = {}) => {
        if (fields) {
            for (const key in fields) {
                if (!this.req.body.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    areResponseKeysAccepted = (fields = {}) => {
        if (fields) {
            for (const key in fields) {
                if (!this.acceptedFields.includes(key)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    };

    areResponseValuesEmpty = (fields = {}) => {
        return Object.values(fields).every(
            (value) => value !== null && value !== ""
        );
    };

    hasHarmfulChars = (fields = {}) => {
        const disallowedCharsRegex = /[<>&'";{}()=*+?![\]^$|\\]/;

        for (const key in fields) {
            if (disallowedCharsRegex.test(fields[key])) {
                return true;
            }
        }

        return false;
    };
}

module.exports = Fields;
