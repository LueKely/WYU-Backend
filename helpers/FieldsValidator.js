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
            "categories",
            "ingredients",
            "instructions",
            "image_url",
            "id",
            "user_id",
            "recipe_id",
            "user_comment",
            "user_bio",
            "fb_username",
            "ig_username",
            "twt_username",
            "user_profile_image",
            "user_bg_image",
            "category",
            "name",
            "isSelfVisit",
            "user_level",
            "model",
        ];
    }

    /**
     * Check if specified keys are present in the request body.
     * @param {Object} fields - The keys to check.
     * @returns {boolean} - True if all keys are present, false otherwise.
     */
    areKeysInRequest = (fields = {}, format) => {
        if (format === "body") {
            return Object.keys(fields).every((key) =>
                this.req.body.hasOwnProperty(key)
            );
        } else if (format === "params") {
            return Object.keys(fields).every((key) =>
                this.req.params.hasOwnProperty(key)
            );
        } else if (format === "query") {
            return Object.keys(fields).every((key) =>
                this.req.query.hasOwnProperty(key)
            );
        }
    };

    /**
     * Check if specified keys are accepted fields.
     * @param {Object} fields - The keys to check.
     * @returns {boolean} - True if all keys are accepted, false otherwise.
     */
    areResponseKeysAccepted = (fields = {}) =>
        Object.keys(fields).every((key) => this.acceptedFields.includes(key));

    /**
     * Check if specified values are not empty.
     * @param {Object} fields - The values to check.
     * @returns {boolean} - True if all values are not empty, false otherwise.
     */
    areResponseValuesEmpty = (fields = {}) =>
        Object.values(fields).every((value) => value !== null && value !== "");

    /**
     * Check if specified values contain harmful characters.
     * @param {Object} fields - The values to check.
     * @returns {boolean} - True if any value contains harmful characters, false otherwise.
     */
    hasHarmfulChars = (fields = {}) => {
        const disallowedCharsRegex = /[<>&;{}()=*+?[\]^$|\\]/;
        return Object.values(fields).some((value) =>
            disallowedCharsRegex.test(value)
        );
    };
}

module.exports = Fields;
