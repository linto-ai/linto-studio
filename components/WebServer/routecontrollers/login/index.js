// const model = require(`${process.cwd()}/models/mongodb/models/users`)


// async function getUsers(req, res, next){
//     let lol = await model.getUserbyId('5e82f245c319e56fc6d4be26')
//     res.json({
//         status: lol
//     })
// }

// function checkAuth(req, res, next) {
// 	if (isProduction()) {
// 		// If not connected
// 		if (!!req && !!req.session) {
// 			if (!!req.session.logged) {
// 				if (req.session.logged == 'on' && req.url == '/login') {
// 					req.session.save((err) => {
// 						if (err && err != 'undefined') {
// 							console.error('Err:', err)
// 						}
// 					})
// 					res.redirect('/api')
// 				} else if (req.session.logged == 'on' && req.url != '/login') {
// 					//Pass !
//                     next()
// 				} else if (req.session.logged != 'on' && req.url != '/login') {
// 					//Not logged, redirect to login page
// 					res.redirect('/login')
// 				}
// 			} else {
// 				if (req.url != '/login') {
// 					res.redirect('/login')
// 				} else {
// 					next()
// 				}
// 			}
// 		} else {
// 			res.redirect('/sessionNotFound')
// 		}
// 	} else {
// 		next()
// 	}
// }

// module.exports = {
//     getUsers
// }