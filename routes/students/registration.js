const Joi       = require('joi');

const dbClient  = require('../utils/dbHandler').dbClient;

exports.register        = register;

async function register(req, res) {
    console.log({REQUEST: req.body});
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

    const result = Joi.validate(opts, schema);

    if(result.error){
        return res.send({
            flag: 300,
            message: 'Failure'
        }); 
	} 

    const firstName         = opts.first_name;
    const lastName          = opts.last_name;
    const age               = opts.age;
    const standard          = opts.standard;
    const address           = opts.address;
    const fatherName        = opts.father_name;
    const fatherOccupation  = opts.father_occupation;
    const motherName        = opts.mother_name;
    const motherOccupation  = opts.mother_occupation;
    const contactNo         = opts.contact_no;
    const altContactNo      = opts.all_contact_no;
    const prevSchool        = opts.prev_school;
    const govId             = opts.gov_id;
    const photo             = opts.photo;

    

}