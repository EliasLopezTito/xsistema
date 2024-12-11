$(document).ready(function () {

	$("#codAlumno").focus();

});

$("#codAlumno").keydown(function (event) {
    if (event.keyCode == 13) {
        mostrarInformacionAlumno();
    }
});

$(function(){
  var actualizarHora = function(){
    var fecha = new Date(),
        hora = fecha.getHours(),
        minutos = fecha.getMinutes(),
        segundos = fecha.getSeconds(),
        diaSemana = fecha.getDay(),
        dia = fecha.getDate(),
        mes = fecha.getMonth(),
        anio = fecha.getFullYear(),
        ampm;
    
    var $pHoras = $("#horas"),
        $pSegundos = $("#segundos"),
        $pMinutos = $("#minutos"),
        $pAMPM = $("#ampm"),
        $pDiaSemana = $("#diaSemana"),
        $pDia = $("#dia"),
        $pMes = $("#mes"),
        $pAnio = $("#anio");
    var semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    
    $pDiaSemana.text(semana[diaSemana]);
    $pDia.text(dia);
    $pMes.text(meses[mes]);
    $pAnio.text(anio);
    // if(hora>=12){
    //   hora = hora - 12;
    //   ampm = "PM";
    // }else{
    //   ampm = "AM";
    // }
    // if(hora == 0){
    //   hora = 12;
    // }
    if(hora<10){$pHoras.text("0"+hora)}else{$pHoras.text(hora)};
    if(minutos<10){$pMinutos.text("0"+minutos)}else{$pMinutos.text(minutos)};
    if(segundos<10){$pSegundos.text("0"+segundos)}else{$pSegundos.text(segundos)};
    // $pAMPM.text(ampm);
    
  };
  
  
  actualizarHora();
  var intervalo = setInterval(actualizarHora,1000);
});

function mostrarInformacionAlumno() {
    var url = $("#codAlumno").val();

    if (url != "") {
        $.ajax({
            url: path + "Seguridad/identificacionQR",
            type: "POST",
            data: {
                url: url,
                opcion: "consultaAlumno"
            },
            success: function (data) {
                var datos = JSON.parse(data);
                
                if (datos.respuesta == "success") {
                    var dato = datos.informacionAlumno;
                    
                    if (dato.Tipo === "ALUMNO") {
                        $("#infoAlumno").show();
                        $("#infoVacio").hide();
                        $("#infoDocente").hide();
                        $("#alerta-danger").hide();
                        $("#codigo").text(dato.CodAlumno);
                        $("#nomCompleto").text(dato.Alumno);
                        $("#fMatricula").text(dato.fMatricula);
                        $("#tipoD").text(dato.TipoDocumento);
                        $("#dni").text(dato.DNI);
                        $("#especialidad").text(dato.DescripcionEspecialidad);
                        $("#estado").text(dato.estado);
                        $("#foto-estudiante").attr("src", "https://istalcursos.edu.pe/intranet/assets/files/FotoPerfil/" + dato.NombreArchivo);
                    } else if(dato.Tipo === "EMPLEADO"){
                        $("#infoAlumno").hide();
                        $("#infoVacio").hide();
                        $("#infoDocente").show();
                        $("#alerta-danger").hide();
                        $("#codigoEmpleado").text(dato.codigoEmpleado);
                        $("#nomCompletoEmpleado").text(dato.nomCompletoEmpleado);
                        if(dato.tipoDoc == "DNI/ DOCUMENTO NACIONAL DE IDENTIFICACION"){
                            $("#tipoDoc").text("DNI");
                        }
                        $("#nroDoc").text(dato.nroDoc);
                        $("#fIngreso").text(dato.fIngreso);
                        $("#cargo").text(dato.cargo);
                        $("#estadoEmpleado").text(dato.estadoEmpleado);
                    }else{
                        $("#alerta-danger").show();
                        $("#infoVacio").show();
                        $("#infoAlumno").hide();
                        $("#infoDocente").hide();
                        setTimeout(() => {
                            $("#alerta-danger").hide();
                        }, 4000);
                    }
                    
                    $("#codAlumno").val("");
                } else {
                    var errores = "";
                    for (var i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    }
}