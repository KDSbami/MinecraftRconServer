require('dotenv').config({path:__dirname+'/.env'});
let app = require('./index');

app = app.server;

const PORT = process.env['PORT'] 

app.listen(PORT, (error) => {
	if(error) {
		console.error({ message: new Error(error) });
	} else {
		console.info(`server is up on ${PORT}`);
	}
});


