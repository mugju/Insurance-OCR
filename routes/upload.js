const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Upload, Tag } = require('../model');

const { isLoggedIn } = require('./loginCheck');

const router = express.Router();

//OCR
const tesseract = require("node-tesseract-ocr");

const config = {
    lang: "kor+eng",
    oem: 1,
    psm: 3,
};
let filename_ocr = '' ;
let kor = '';
let eng = '';


try { //업로드 폴더가 있나요..?
    fs.readdirSync('uploads');

} catch (error) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },

    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log('이미지 경로',req.file);
    filename_ocr = `uploads/${req.file.filename}`;
    res.json({ url: `/img/${req.file.filename}` });

    //OCR 코드
    tesseract
    .recognize(filename_ocr, config)
    .then((text) => {
        kor = text.replace(/[a-zA-Z]{0,}/gi,"").replace(/\n|[0-9]{0,}/gi,"").replace(/[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》“”’—_©{}]|[ㄱ-ㅎ]|[ㅏ-ㅣ]/gi,"").replace(/\s{1,}/gi," #");
        kor = '#' + kor;
        eng = text.replace(/[가-힣]{0,}/gi,"").replace(/\n|[0-9]{0,}/gi,"").replace(/[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》“”’—_©{}]|[ㄱ-ㅎ]|[ㅏ-ㅣ]/gi,"").replace(/\s{1,}/gi," #");
        console.log("=======");
        let kor_arr = kor.split(" ");
        let arr = [];
        for (let k = 0; k < kor_arr.length; k++) {
            if(kor_arr[k].length > 2){
                arr.push(kor_arr[k]);
            }
        }
        const set = new Set(arr);
        kor = [...set];
        
        console.log("", kor);
        console.log("=======");
        console.log("", eng);
    })
    .catch((error) => {
        console.log(error.message)
    })

    
});



const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {

        const post = await Upload.create({
            content: req.body.content +"자동 사진 분석 : " +kor,
            img: req.body.url,
            UserId: req.user.id,
        });
        console.log('이미지 주소확인 post',req.body.url);
        const hashtags = (req.body.content).match(/#[^\s#]+/g);
        console.log(req.body.content);
        // + kor.match(/#[^\s#]+/g)
        console.log(kor);
        console.log(hashtags);
        const new_hashtags = hashtags.concat(kor);

    
        if (new_hashtags) {
            console.log(new_hashtags);
            const result = await Promise.all(
                new_hashtags.map(tag => {
                    return Tag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() }
                    })
                }),
            );
            await post.addTags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;