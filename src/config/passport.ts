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

const getUser = () => {
    return new Promise((resolve, reject) => {
        resolve(user);
    })
}

/**
 * sign up using email and password
 */
passport.use('signup', new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        // save user
        const user = await getUser();

        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
        const user = await getUser();

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        //@ts-ignore
        const validate = await user.isValidPassword(password);

        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));
