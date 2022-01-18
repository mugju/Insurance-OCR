const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const ejs = require('ejs');

const dotenv = require('dorenv');
const path = require('path');

dotenv.config();



//라우터 들어갈 자리들
//기본라우터
const pageRouter = require('./routes/page'); //서류 검색
const authRouter = require("./routes/auth"); //인증 및 로그인 관련.
const uploadRouter = require("./routes/upload"); //서류 업로드 관련


//라우터 선언끝

const app = express();
app.set('port', process.env.PORT || 8085); //8085포트 사용예정임.
app.set('views', __dirname + '/views'); //ejs 쓸 예정.
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public'))); //정적파일경로 public폴더내에 정리 할 것.

app.use('/img', express.static(path.join(__dirname, 'uploads'))); //이미지 업로드 경로. 일반 사용자는 접근 못하도록 해야하고 관리자 권한 일 경우에만..! 

app.use(express.json());
app.use(express.urlencoded({extended : false})); //qs는 사용안함.

//쿠키관련 설정.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitalized: false,
    secret : process.env.COOKIE_SECRET,
    cookie:{
        httpOnly : true,
        secure:false, //http 
    },
}));



//라우터 없음.
app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 이 존재하지 않습니다.`);
    error.status = 404;
    next(error);
});


app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    
    res.render('error');
    
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 실행중.');
});
