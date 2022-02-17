class AppointmentFactory {
  Build(simpleAppointment){
    const day = simpleAppointment.date.getDate()+1, month = simpleAppointment.date.getMonth(), year = simpleAppointment.date.getFullYear(), hour = Number.parseInt(simpleAppointment.time.split(":")[0]), minutes = Number.parseInt(simpleAppointment.time.split(":")[1]);

    // Formato de data para aparecer no FullCalendar
    const startDate = new Date(year, month, day, hour, minutes, 0, 0);

    let appo = {
      id: simpleAppointment._id,
      title: simpleAppointment.nome + " - " + simpleAppointment.description,
      start: startDate,
      end: startDate,
      notified: simpleAppointment.notified,
      email: simpleAppointment.email
    }

    return appo;
  }
};

module.exports = new AppointmentFactory();