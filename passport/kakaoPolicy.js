const passport = require("passport");

const kakaoPoilcy = require("passport-kakao").Strategy;

const User = require("../model/user");

module.exports = () =>{
    passport.use(new kakaoPoilcy({
        clientID : process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile,done) =>{
        console.log("kakao profile", profile);
        try{
            const exUser = await User.findOne({
                where: {snsId : profile.id, provider : 'kakao'},
            });
            if (exUser){
                done(null, exUser);
            } else{
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick : profile.displayName,
                    snsId :profile.id,
                    provider : 'kakao',
                    manager : 'unknown',
                });
                done(null, newUser);
            }

        }catch(error){
            console.error(error);
            done(error);

        }
    }
    ));
}
