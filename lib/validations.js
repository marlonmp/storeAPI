
function Optional(validator) {
    if (!value) return () => true

    return validator
}

function productName(value) {
    return /^[\w\d\ \-\_\(\)]{3,40}$/.test(string(value));
}

function productDescription(value) {
    return /^[\w\d\ \-\_\(\)]{3,150}$/.test(string(value));
}

function searchQuery(value) {
    return /^[\w\d\ \-\_\(\)]{1,80}$/.test(string(value));
}

function decimal(value) {
    return /(^\d{1,7}$)|(^\d{1,7}\.\d{1,2}$)|(^\.\d{1,2}$)/.test(string(value))
}

function userName(value) {
    return /^[a-z\d\'\ ]{2,45}$/i.test(string(value))
}

function userEmail(value) {
    return /^(?=[a-z\d\.\-\_]+\@[a-z\d\.\-\_]+\.[a-z\.]+)[a-z\d\.\-\_\@]{8,60}$/i.test(string(value))
}

function userPassword(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,60}$/.test(string(value))
}

module.exports = {
    Optional,
    productName,
    productDescription,
    searchQuery,
    decimal,
    userName,
    userEmail,
    userPassword,
};