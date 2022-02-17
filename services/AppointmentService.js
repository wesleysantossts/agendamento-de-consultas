const mongoose = require("mongoose"), Appo = require("../model/Appointment"), AppointmentFactory = require("../factories/AppointmentFactory"), mailer = require("nodemailer");

class AppointmentService {
  async Create(nome, email, docCpf, description, date, time){
    const appointmentCheck = Appo.create({
      nome,
      email,
      docCpf,
      description,
      date,
      time,
      finished: false,
      notified: false
    });

    try {
      appointmentCheck && true
    } catch (error) {
      console.log("Erro de criação de reserva", appointmentCheck);
      return false
    }
  }

  async GetAll(finished){
    if(finished){
      return await Appo.find();
    } else {
      let appos = await Appo.find({"finished": false}), appointments = [];
      
      appos.forEach(appoints => {

        if(appoints.date != undefined){
          appointments.push(AppointmentFactory.Build(appoints))
        }

      });

      return appointments;
    }
  }

  async GetById(id){
    try {
      const event = await Appo.findOne({"_id": id});
      return event;
    } catch(err){
      console.log(err)
    }
  }

  async Finish(id){
    try {
      await Appo.updateOne({_id: String(id)}, {finished: true});
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  async Search(query){
    try {
      // .or([{propriedadeDesejada: valores},{propriedadeDesejada: valores}...]) - usado após o ".find()" para apontar condições desejadas de busca.
      const appos = await Appo.find().or([{email: query},{nome: query}]);
      return appos;
    } catch(error){
      console.log("Erro no service de busca.", error)
    }
  }

  async SendNotification(){
    const appos = await this.GetAll(false); 
    // .createTransport({host: "hospedagem do email", port: porta do email, auth: {user: "emailremetente@email.com", pass: "senha do remetente"}}) - método do nodemailer para criar um transport (configurações iniciais do email)
    const transport = mailer.createTransport({host: "smtp.mailtrap.io", port: 2525, auth: {user: "a9365bd897cfa9", pass: "6619753b7131b2"}});

    appos.forEach(async appos =>{
      const date = appos.start.getTime();
      const hour = 1000*60*60;
      // Mostrar quanto tempo falta para a consulta
      const gap = date - Date.now();

      if(gap < hour){

        if(!appos.notified){
          await Appo.findByIdAndUpdate(appos.id, {notified: true});
          
          /* 
          .sendMail - usado para enviar o email com o nodemailer.
          transport.sendMail({
            from: "Remetente <email@email.com>",
            to: destinario[, ...],
            subject: "Titulo desejado",
            text: "Corpo do email (aceita HTML)"
          })
          */
          transport.sendMail({
            from: "Wesley Santos <wesleysts.ws@gmail.com>",
            to: appos.email,
            subject: appos.title,
            text: "Testando o nodemailer"
          }).then(async ()=>{
          }).catch((err)=>{console.log("Erro de envio de email.", err)})
        }
      }
    });
  }
}

module.exports = new AppointmentService();