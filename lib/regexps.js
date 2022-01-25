module.exports = {
    productName: /^[\w\d\ \-\_\(\)]{3,40}$/,
    productDescription: /^[\w\d\ \-\_\(\)]{3,150}$/,
    searchQuery: /^[\w\d\ \-\_\(\)]{1,80}$/,
    decimal: /(^\d{1,7}$)|(^\d{1,7}\.\d{1,2}$)|(^\.\d{1,2}$)/,
    userName: /^[a-z\d\'\ ]{2,45}$/i,
    userEmail: /^(?=[a-z\d\.\-\_]+\@[a-z\d\.\-\_]+\.[a-z\.]+)[a-z\d\.\-\_\@]{8,60}$/i,
    userPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,60}$/
};