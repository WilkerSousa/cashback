// Arquivo inicial que carrega as variaveis de ambiente da aplicação
// 'CLIENT_ID_PRD'; // Your client id de Producao
// 'CLIENT_SECRET_PRD'; // Your secret de Producao
// 'REDIRECT_URI_PRD'; // Your redirect uri de Producao
// 'CLIENT_ID_HML'; // Your client id de Homologaçao
// 'CLIENT_SECRET_HML'; // Your secret de Homologaçao
// 'REDIRECT_URI_HML'; // Your redirect uri de Homologaçao

// ************************ VARIAVEIS do WILKER *************************************************
// var client_id = 'f6b1df8cd7404e12b48da9d13c595f5e'; //'CLIENT_ID'; // Your client id         *
// var client_secret = '901d59d059674755a4d0fd2486fac37c'; //'CLIENT_SECRET'; // Your secret    * 
// var redirect_uri = 'http://localhost:8888/callback'; //'REDIRECT_URI'; // Your redirect uri  *
// **********************************************************************************************
  
var express = require('express');
var app = express();

  if(process.env.CLIENT_ID_PRD == "" || process.env.CLIENT_ID_PRD == undefined) {
    console.log("Por favor preencha a variavel de ambiente CLIENT_ID_PRD!!!");
  }
  if(process.env.CLIENT_SECRET_PRD == "" || process.env.CLIENT_SECRET_PRD == undefined) {
    console.log("Por favor preencha a variavel de ambiente CLIENT_SECRET_PRD!!!");
  }
  if(process.env.REDIRECT_URI_PRD == "" || process.env.REDIRECT_URI_PRD == undefined) {
    console.log("Por favor preencha a variavel de ambiente REDIRECT_URI_PRD!!!");
  }
  if(process.env.CLIENT_ID_HML == "" || process.env.CLIENT_ID_HML == undefined) {
    console.log("Por favor preencha a variavel de ambiente CLIENT_ID_HML!!!");
  }
  if(process.env.CLIENT_SECRET_HML == "" || process.env.CLIENT_SECRET_HML == undefined) {
    console.log("Por favor preencha a variavel de ambiente CLIENT_SECRET_HML!!!");
  }
  if(process.env.REDIRECT_URI_HML == "" || process.env.REDIRECT_URI_HML == undefined) {
    console.log("Por favor preencha a variavel de ambiente REDIRECT_URI_HML!!!");
  }

  params = {
    clientidprd: process.env.CLIENT_ID_PRD,
    clientsecretprd: process.env.CLIENT_SECRET_PRD,
    redirecturiprd: process.env.REDIRECT_URI_PRD,
    clientidhml: process.env.CLIENT_ID_HML,
    clientsecrethml: process.env.CLIENT_SECRET_HML,
    redirecturihml:process.env.REDIRECT_URI_HML
  }

  console.log("Variaveis de ambiente preenchidas com SUCESSO!");

  if (params.clientidprd == undefined || params.clientsecretprd == undefined || params.redirecturiprd == undefined || params.clientidhml == undefined || params.clientsecrethml == undefined || params.redirecturihml == undefined){
    process.abort;
  } else {
    module.exports = params

    //Rotas
    const authorization = require('../authorization_code/app.js');
    app.use('/', authorization);
    module.exports = app;
  }
  
