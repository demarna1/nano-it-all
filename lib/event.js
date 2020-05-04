const Event = Object.freeze({

    // Server-to-client events
    S2C: Object.freeze({
        ADDRESS_ERROR: "address.error",
        PASSWORD_ERROR: "password.error",
        LOGIN_DUPLICATE: "login.duplicate",
        LOGIN_SUCCESS: "login.success",
        LOGIN_VERIFY: "login.verify",
        LOGOUT_SUCCESS: "logout.success",
        STATE_CHANGE: "state"
    }),

    // Client-to-server events
    C2S: Object.freeze({
        LOGIN_ADDRESS: "login.address",
        LOGIN_NAME: "login.name",
        LOGIN_PASSWORD: "login.password",
        LOGOUT: "logout"
    })
});

module.exports = Event;
