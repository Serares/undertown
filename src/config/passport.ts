import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

let user = {
    name: "User1",
    email: "email@",
    password: "12345678",
    isValidPassword: (psw: any) => {
        console.log("Parola->", psw);
        return true;
    }
}

const getUser = (userCredentials: any) => {
    return new Promise((resolve, reject) => {
        if(userCredentials.email !== user.email || userCredentials.password !== user.password){
            resolve(null)
        }
        resolve(user);
    })
}

passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
        const user = await getUser({email, password});

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));
