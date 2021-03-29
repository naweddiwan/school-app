
exports.responses = {
    SUCCESS: {
        status: 101,
        message:'Operation Success!'
    },
    FALIURE: {
        status: 501,
        message:'Operation Failure!'
    },

    PARAMS_MISSING: {
        status: 601,
        message:'Parameter(s) are missing or invalid!'
    },
};

exports.errors = {
    INVALID_FORMAT: 'Specified format is wrong, please check!'
};