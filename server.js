const express =  require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport =  require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config'),
      stripe = require('stripe')('sk_test_ojIEBahfiCZioN7BIQjalw3A'),
      // stripe = require('passport-stripe'),
      cors = require('cors');

const app = express();
// Connect to front end!!!!
app.use(bodyParser.json());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname));

const massiveInstance = massive.connectSync({connectionString: 'postgres://postgres:Milkyway6933@localhost/yoga'})

app.set('db', massiveInstance);
const db = app.get('db');

// db.createUser(function(err, user) {
//   if (err) console.log(err);
//   else console.log('CREATED USER');
//   console.log(user);
// })

passport.use(new Auth0Strategy({
  domain: config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  callbackURL: config.auth0.callbackURL
},
function(accessToken, refreshToken, extraParams, profile, done) {
  console.log(profile);
    db.getUserByAuthId([profile.id], function(err, user){
      user = user[0];
      if (!user) {
        console.log('CREATING USER');
        db.createUserByAuth([profile.displayName, profile.id], function(err, user) {
          console.log('USER CREATED', userA);
          return done(err, user[0]);
        })
      } else {
        console.log('FOUND USER', user);
        return done(err, user);
      }
    })
}
));


passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: '/#/cart',
  failureRedirect: '/auth'
}));

app.get('/auth/me', function(req, res, next){
  if (!req.user) { return res.status(404).send('User not found');
}
 return  res.status(200).send(req.user);
});

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})



app.post('/api/payment', function(req, res, next){
  console.log(req.body);

  //convert amount to pennies
  const chargeAmt = req.body.amount;
  const amountArray = chargeAmt.toString().split('');
  const pennies = [];
  for (var i = 0; i < amountArray.length; i++) {
    if(amountArray[i] === ".") {
      if (typeof amountArray[i + 1] === "string") {
        pennies.push(amountArray[i + 1]);
      } else {
        pennies.push("0");
      }
      if (typeof amountArray[i + 2] === "string") {
        pennies.push(amountArray[i + 2]);
      } else {
        pennies.push("0");
      }
    	break;
    } else {
    	pennies.push(amountArray[i])
    }
  }
  const convertedAmt = parseInt(pennies.join(''));
  console.log("Pennies: ");
  console.log(convertedAmt);

  const charge = stripe.charges.create({
  amount: convertedAmt, // amount in cents, again
  currency: 'usd',
  source: req.body.payment.token,
  description: 'Test charge from grahms repo'
}, function(err, charge) {
     res.sendStatus(200);
  // if (err && err.type === 'StripeCardError') {
  //   // The card has been declined
  // }
});
});
// passport.use(new StripeStrategy({
//     clientID: config.stripe0.clientID,
//     clientSecret: config.stripe0.clientSecret,
//     callbackURL: "http://localhost:3000/auth/stripe/callback"
//   },
//   function(accessToken, refreshToken, stripe_properties, done) {
//     User.findOrCreate({ stripeId: stripe_properties.stripe_user_id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));
// function(payment, price) {
//
//     db.getamount([data.amount], function(err, user){
//        data = data[0];
//       if (amount === 10 ) {
//         console.log('Logging payment');
//         db.logmembership([data.amount], function(err, amount) {
//           return done(err, user[0]);
//         })
//       } else if(amount === 20) {
//         db.logmembership([data.amount], function(err, amount) {
//           return done(err, user[0]);
//         })
//       } else if(amount === 100) {
//         db.logmembership([data.amount], function(err, amount) {
//           return done(err, user[0]);
//       } else {
//         console.log('FOUND USER', user);
//         return done(err, user);
//       }
//     })
// }
// ));

app.listen(3000, function() {
  console.log('Connected on 3000')
})
