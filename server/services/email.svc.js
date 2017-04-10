var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
// exports.sendEmail = function(to, from, subject, content) {
// 	var request = sg.emptyRequest({
// 		method: 'POST',
// 		path: '/v3/mail/send',
// 		body: {
// 			personalizations: [
// 				{ to: [{email: to }], subject: subject }
// 			],
// 			from: { email: from },
// 			content: [ { type: 'text/html', content: content } ]
//         }
// 	});
// 	return sg.API(request);
// }
function makeRequest(to, subject, content) {
    return sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: to,
                        },
                    ],
                    subject: subject,
                },
            ],
            from: {
                email: 'minfoage@gmail.com',
            },
            content: [
                {
                    type: 'text/plain',
                    value: content,
                },
            ],
        },
    });
};

exports.sendEmail = function (to, subject, content) {
    var request = makeRequest(to, subject, content);
    //With promise
    sg.API(request)
        .then(response => {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        .catch(error => {
            //error is an instance of SendGridError
            //The full response is attached to error.response
            console.log(error.response.statusCode);
        });
}