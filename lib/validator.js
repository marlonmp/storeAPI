class Validator {

    #valid;
        
    /** @type { JSONObject } */
    #obj;
    
    /** @type { JSONObject } */
    #validObj;

    /** @param { JSONObject } obj  */
    constructor(obj) {
        this.#valid = true;
        
        this.#obj = obj;
        
        this.#validObj = {};
    }

    #matchType(type, value) {
        if (value == undefined || (value.constructor != type.constructor)) this.#valid = false;
    }

    #matchRegExp(regexp, value) {
        if (!regexp.test(value)) this.#valid = false;
    }

    /** @param { RegExp } regexp */
    match(key = '', type, regexp = undefined) {
        
        if (this.#valid) {
            const value = this.#obj?.[key];
            
            this.#matchType(type, value);
            
            if (regexp) this.#matchRegExp(regexp, value);

            if (this.#valid) this.#validObj[key] = value;
        }

        return this;
    }

    optionalMatch(key = '', type, regexp = undefined) {
        if (this.#obj?.[key] != undefined) return this.match(key, type, regexp);

        return this;
    }

    /** @returns { boolean } */
    isOk() {
        return this.#valid;
    }
    
    /** @returns { JSONObject } */
    getValidObj() {
        return this.#validObj;
    }
}

module.exports = Validator;
