const router = require('koa-router')()
const config = require("../config");
const request = require("request-promise");
const fs = require("fs");

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'CMS管理系统'
  })
})

router.post('/uploadBannerImg', async (ctx, next) => {
  var files = ctx.request.files;
  var file = files.file;
  try {
    let options = {
      url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.appId + "&secret=" + config.secret,
      json: true
    }
    let { access_token } = await request(options);
    let fileName = `${Date.now()}.png`;
    let filePath = `banner/${fileName}`;
    options = {
      method: "POST",
      url: "https://api.weixin.qq.com/tcb/uploadfile?access_token=" + access_token,
      body: {
        "env": "yunkaifa-i639t",
        "path": filePath
      },
      json: true
    }
    let res = await request(options);
    let file_id = res.file_id;
    options = {
      method: "POST",
      url: "https://api.weixin.qq.com/tcb/databaseadd?access_token=" + access_token,
      body: {
        "env": "yunkaifa-i639t",
        "query": "db.collection(\"banner\").add({data:{fileId: \"" + file_id + "\"}})"
      },
      json: true
    }
    await request(options);
    options = {
      method: "POST",
      url: res.url,
      formData: {
        "Signature": res.authorization,
        "key": filePath,
        "x-cos-meta-fileid": res.cos_file_id,
        "x-cos-security-token": res.token,
        "file": {
          value: fs.createReadStream(file.path),
          options: {
            filename: fileName,
            contentType: file.type
          }
        }
      }
    }
    res = await request(options);
    ctx.body = res;
  } catch (err) {
    console.log(err.stack);
  }
});

module.exports = router
