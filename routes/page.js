const express = require('express');


const {isLoggedIn, isNotLoggedIn} = require("./loginCheck");
const router = express.Router();

//관리자 계정당 배정된 고객수 count할것.

//기능구현 끝

router.get('/profile',isLoggedIn, (req,res)=>{
    res.render('profile',{title : `내 정보 - DD보험OCR솔루션`}); //내정보 정적파일
});

router.get('/join', isNotLoggedIn, (req,res)=>{
    res.render('join',{title:'회원 가입 - DD보험OCR솔루션'}); //회원가입 폼
});

//지금까지 올린 자료 조회. 수정요망.
router.get('/', async (req, res, next)=>{
    try{
        const posts = await Post.findAll({
            include : {
                model : User,
                attributes : ['id',nick],
            },
            order : [['createdAt', 'DESC']],
        });
        res.render('main', {
            title : scoreloader,
            twits : posts,

        });
    }catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;