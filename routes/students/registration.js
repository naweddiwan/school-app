const MODULE_NAME = 'studentRegistration';

const Joi       = require('joi');

const dbClient  = require('../utils/dbHandler').dbClient;
const constants = require('../utils/constants');
const logger    = require('../utils/logger');
const commons   = require('../utils/commonFunctions');

exports.register        = register;

async function register(req, res) {

    const recieverInfo = {
        baseModule          : MODULE_NAME,
        currentModule       : MODULE_NAME,
        baseApi             : '/student/register',
        currentProcessor    : 'register',
        level               : 0
    };
    await logger.track(recieverInfo, {REQUEST: req.body});
    const opts = req.body;

    const schema = Joi.object().keys({
        first_name          : Joi.string().required(),
        last_name           : Joi.string().required(),
        age                 : Joi.number().integer().required(),
        prev_standard       : Joi.string().optional().allow(''),
        current_standard    : Joi.string().required(),

        address             : Joi.string().required(),
        district            : Joi.string().required(),
        state               : Joi.string().required(),
        country             : Joi.string().required(),
        pincode             : Joi.string().required(),

        father_name         : Joi.string().required(),
        father_occupation   : Joi.string().required(),
        mother_name         : Joi.string().required(),
        mother_occupation   : Joi.string().required(),

        contact_no          : Joi.string().required(),
        alt_contact_no      : Joi.string().required(),

        prev_school         : Joi.string().required(),
        gov_id              : Joi.string().required(),
    });
    
    // const result = Joi.validate(opts, schema);

    // if(result.error){
    //     return res.send(constants.responses.PARAMS_MISSING); 
	// } 

    // const firstName         = opts.first_name;
    // const lastName          = opts.last_name;
    // const age               = opts.age;
    // const prevStandard      = opts.prev_standard;
    // const currentStandard   = opts.current_standard;

    // const address           = opts.address;
    // const district          = opts.district;
    // const state             = opts.state;
    // const country           = opts.country;
    // const pincode           = opts.pincode;

    // const fatherName        = opts.father_name;
    // const fatherOccupation  = opts.father_occupation;
    // const motherName        = opts.mother_name;
    // const motherOccupation  = opts.mother_occupation;

    // const contactNo         = opts.contact_no;
    // const altContactNo      = opts.all_contact_no;

    // const prevSchool        = opts.prev_school;
    // const govId             = opts.gov_id;
    try{
        let queryObj = {
            table_name      : 'tb_students',
            required_keys   : ['*'],
            constraints     : [['first_name', 'nawed3']]
        };
        let currentStudents = await commons.fetchData(recieverInfo, queryObj);
        let response = constants.responses.SUCCESS;
        response.data = currentStudents;
        await logger.track(recieverInfo, {RESPONSE_SENT: response});
        return res.send(response);
    }catch(error){
        await logger.error(recieverInfo, {ERROR: error.stack});
        return res.send(constants.responses.FALIURE);
    }
}