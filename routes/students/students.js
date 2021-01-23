const dbClient = require('../utils/dbHandler').dbClient;

exports.test        = test;



async function test(req, res) {
    let result = await dbClient.executeQuery({query: 'SELECT * FROM tb_students LIMIT 10', args: []});

    return res.send({
        status: 100,
        message: 'Glenhill Rocks!!!',
        result
    });
}