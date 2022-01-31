
function check(...validations) {

    for(let validation in validations) {   

        const isValid = validation.fn;
        const value = validation.value

        if (!isValid(value)) return false
    }

    return true
}

module.exports = {
    check
};