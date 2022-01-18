const express = require('express');


const {isLoggedIn, isNotLoggedIn} = require("./loginCheck");
const {Upload, User, Admin, Tag} = require('../model');
const router = express.Router();

router.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
});

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
        // const contents = await Upload.findAll({
        //     include : {
        //         model : User,
        //         // attributes : ['id',Kname],
        //         attributes : 'id',
        //     },
        //     order : [['createdAt', 'DESC']],
        // });
        res.render('index', {
            title : 'vmfhsxmdpsem rotlfdj',
            // sheets : contents, //올란 서류

        });
    }catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;