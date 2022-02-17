const express = require("express"), app = express(), mongoose = require("mongoose"), AppointmentService = require("./services/AppointmentService");

app.use(express.static("public"), express.urlencoded({extended: false}), express.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/agendamento");

app.get("/", (req, res)=>{
  res.render("Home")
});

app.get("/cadastro", (req, res)=>{
  res.render("Cadastro")
});

app.post("/create", (req, res)=>{
  const status = AppointmentService.Create(req.body.nome, req.body.email, req.body.docCpf, req.body.description, req.body.date, req.body.time);

  status ? res.redirect("/") : res.send("Ocorreu um erro no cadastro da consulta. Tente novamente.");
});

app.get("/getcalendar", async(req, res)=> {
  const consultas = await AppointmentService.GetAll(false);
  res.json(consultas);
});

// Redirecionar para página do evento
app.get("/event/:id", async (req, res)=>{
  const {id} = req.params;

  const appo = await AppointmentService.GetById(id);
  // console.log(appo);
  
  res.render("event", {appo});
});

app.post("/finish", async (req, res)=>{
  const {id} = req.body, result = await AppointmentService.Finish(id);

  res.redirect("/");
});

// List - A página de consultas o professor chamou de "list" na aula.
app.get("/consultas", async (req, res)=>{
  const appos = await AppointmentService.GetAll(true);

  res.render("consultas", {appos});
});

app.get("/searchresult", async(req, res)=>{
  // req.query - como o método usado no form do HTML foi GET, os dados são passados do front para o back na barra de busca, então deve-se usar o query params  
  const {search} = req.query;

  const appos = await AppointmentService.Search(search);

  res.render("consultas", {appos});
});

// NOTIFICAÇÕES
// Tempo em milissegundos
const time = 5 * 1000;
setInterval(async()=>{
  // const appos = await AppointmentService.GetAll(false);
  // console.log(appos);
  const appos = await AppointmentService.SendNotification();
  return appos;
}, time)

app.listen(8080, ()=> console.log("Server rodando..."));