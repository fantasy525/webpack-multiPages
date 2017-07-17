# webpack-multiPages
根据vue-cli的配置自己写了一个多页面的webpack脚手架
## 运行
```
npm install

npm run dev

```
由于是多页面，所以在使用html-webpack-plugin时我会根据入口js的名字自动生成html-webpack-plugin的配置，
所以当npm run dev 时请首先新建页面html，再建页面入口js方式控制台报错，不错报错也没事，因为我用了nodemon，
它不会因为报错而停止运行cmd的，你不用手动再重启 npm
