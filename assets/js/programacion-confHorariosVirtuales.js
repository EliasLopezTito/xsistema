$(document).ready(function(){

});

//Para filtro de listado
$("#programaAcademico").change(function () {

    $("#contenedor_listado").css("display","block");
    cargarHorariosPorCarrera();
});

$("#anioProg").change(function(){
    cargarHorariosPorCarrera();
});

$("#mesProg").change(function(){
    cargarHorariosPorCarrera();
});


//Para crear las configuraciones de horarios x carrera
$("#codEspeM").change(function () {

    var ciclo = $("#ciclo").val();

    if(ciclo != undefined) 
    {

        cargarHorariosByCiclo();

    }else
    {

        $("#primeraHoraM").val("");
        $("#segundaHoraM").val("");

    }
    

});

$("#ciclo").change(function () {

    cargarHorariosByCiclo();

});

$("#horarioM").change(function () {

    var horarioM = $("#horarioM").val();

    var parametros = horarioM.split("--");
    var id_Horario = parametros[0];
    var descripcion = parametros[1];
    var primeraHoraM = parametros[2];
    var segundaHoraM = parametros[3];

    $("#primeraHoraM").val(primeraHoraM);
    $("#segundaHoraM").val(segundaHoraM);


});

function cargarHorariosByCiclo() {

    var codEspecialidad = $("#codEspeM").val();
    var ciclo = $("#ciclo").val();

    if(ciclo != undefined) 
    {

        $.ajax({
            url: path + "programacion/confHorariosVirtuales",
            type: "POST",
            data: {
                codEspecialidad: codEspecialidad,
                ciclo: ciclo,
                opcion: 'cargarHorarios'
            },
            success: function (data) {
               // console.log(data);
                $("#primeraHoraM").val("");
                $("#segundaHoraM").val("");

                $("#horarioM").find('option').remove();
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    if (datos.horarios != "vacio") {
                        var horarios = datos.horarios;
                        $("#horarioM").append("<option value=\"00\" selected disabled hidden>00 --- SELECCIONE UNA OPCIÓN</option>");
                        for (i = 0; i < horarios.length; i++) {
                            var horario = horarios[i];
                            $("#horarioM").append("<option value=\"" + horario.id_Horario + "--" + horario.Descripcion + "--" + horario.PrimeraHora + "--" + horario.SegundaHora + "\">" + horario.Descripcion + "</option>");
                        }
                    } else {
                        Notiflix.Report.Failure('Error',"No se encontraron horarios para la carrera y ciclo seleccionado.","Cerrar");
                    }
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });

    }else
    {
        Notiflix.Report.Failure('Error',"Seleccione el ciclo para cargar los horarios correspondientes al programa.","Cerrar");
    }

}

$("#btnNuevo").click(function (){
    $("#tituloModal").html("NUEVA CONFIGURACIÓN");
    $("#btnGrabarM").attr("title","Grabar configuración");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Configuración");
    $("#opcion").val("create");
    limpiarModal();
    
    $("#codEspeM").attr("disabled",false);
    $("#anioProgM").attr("disabled",false);
    $("#mesProgM").attr("disabled",false);
    
    $("#anioProgM").val($("#anioProg").val());
    $("#mesProgM").val($("#mesProg").val());
    
    $("#modalHorarioVirtual").modal({backdrop: 'static', keyboard: false});
});

$("#btnGrabarM").click(function ()
{
    var opcion = $("#opcion").val();
    var codEspe = $("#codEspeM").val();
    var anioProg = $("#anioProgM").val();
    var mesProg = $("#mesProgM").val();
    var horario = $("#horarioM").val();
	var parametros = horario.split("--");
    var id_Horario = parametros[0];
    var descripcion = parametros[1];
    var primeraHoraM = parametros[2];
    var segundaHoraM = parametros[3];
    var primeraHora = $("#primeraHoraM").val();
    var segundaHora = $("#segundaHoraM").val();
    
    $.ajax({
        url: path + "programacion/confHorariosVirtuales",
        type: "POST",
        data: {
            opcion: opcion,
            codEspe: codEspe,
            anioProg: anioProg,
            mesProg: mesProg,
            horario: descripcion,
            primeraHora: primeraHora,
            segundaHora: segundaHora
        },
        success: function(data){

            var datos = JSON.parse(data);

            if(datos.respuesta=="success")
            {   
                $("#programaAcademico").val($("#codEspeM").val());
                cargarHorariosPorCarrera();
                $("#modalHorarioVirtual").modal("hide");

            }else{
                var errores = "";
                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error","ERROR",errores);
            }
        }
    });
});

function editar(btn)
{

    var horario = $(btn).parent().parent().find("td").eq(2).html();
    var primeraHora = $(btn).parent().parent().find("td").eq(3).html();
    var segundaHora = $(btn).parent().parent().find("td").eq(4).html();
    var anioProg = $(btn).parent().parent().find("td").eq(6).html();
    var mesProg = $(btn).parent().parent().find("td").eq(7).html();
    var codEspe = $(btn).parent().parent().find("td").eq(8).html();
    
    $("#tituloModal").html("EDITAR CONFIGURACIÓN");
    $("#btnGrabarM").attr("title","Editar configuracion");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Editar Configuración");
    $("#opcion").val("update");
    limpiarModal();
    
    $("#codEspeM").val(codEspe);
    $("#anioProgM").val(anioProg);
    $("#mesProgM").val(mesProg);
    $("#horarioM").val(horario);
    $("#primeraHoraM").val(primeraHora);
    $("#segundaHoraM").val(segundaHora);
    $("#codEspeM").attr("disabled",true);
    $("#anioProgM").attr("disabled",true);
    $("#mesProgM").attr("disabled",true);
    
    $("#modalHorarioVirtual").modal({backdrop: 'static', keyboard: false});
}

function eliminar(btn){
    var programa = $(btn).parent().parent().find("td").eq(1).html();
    var anioProg = $(btn).parent().parent().find("td").eq(6).html();
    var mesProg = $(btn).parent().parent().find("td").eq(7).html();
    var codEspe = $(btn).parent().parent().find("td").eq(8).html();
    var opcion = "delete";
        
    if(codEspe != null && anioProg != null && mesProg != null && codEspe != "" && anioProg != "" && mesProg != ""){
        $("#codEspeD").val(codEspe);
        $("#anioProgD").val(anioProg);
        $("#mesProgD").val(mesProg);
        $("#opcionD").val(opcion);
        mostrarMensaje("confirmacion","CONFIRMAR","¿Seguro que desea eliminar la configuración del programa acadèmico: " + programa +"?");
    }else{
        $("#codEspeD").val("");
        $("#anioProgD").val("");
        $("#mesProgD").val("");
        $("#opcionD").val("");
        mostrarMensaje("error","ERROR","Debe completar todos los datos");
    }
}

$("#mensaje-boton-aceptar").click(function ()
{

    $("#modalMensaje").modal("hide");

    var codEspe = $("#codEspeD").val();
    var anioProg = $("#anioProgD").val();
    var mesProg = $("#mesProgD").val();
    var opcion = $("#opcionD").val();
        
    if(codEspe != null && anioProg != null && mesProg != null && codEspe != "" && anioProg != "" && mesProg != "")
    {
        var tbody = $("#tablaHorariosCarreras tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/confHorariosVirtuales",
            type: "POST",
            data: {
                opcion: opcion,
                codEspe: codEspe,
                anioProg: anioProg,
                mesProg: mesProg                
            },
            success: function(data){
                var datos = JSON.parse(data);
                if(datos.respuesta=="success")
                {
                    cargarHorariosPorCarrera();
                }else{
                    var errores = "";
                    for(i=0; i<datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error","ERROR",errores);
                }
            }
        });
    }
});

function cargarHorariosPorCarrera()
{
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var programaAcademico = $("#programaAcademico").val();
    var opcion = "select";
        
    if(anioProg != null && mesProg != null && programaAcademico != null)
    {
        var tbody = $("#tablaHorariosCarreras tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/confHorariosVirtuales",
            type: "POST",
            data: {
                opcion: opcion,
                programaAcademico: programaAcademico,
                anioProg: anioProg,
                mesProg: mesProg
            },
            success: function(data)
            {
                var datos = JSON.parse(data);
                if(datos.respuesta=="success")
                {
                    if(datos.horarios != "vacio")
                    {
                        var horarios = datos.horarios;
                        for(i=0; i<horarios.length; i++)
                        {
                            var horario = horarios[i];

                            switch(horario.CodEspecialidad)
                            {
                                case "03":
                                    background_color_fondo_fila = "#abf7ff";
                                    break;
                                case "04":
                                    background_color_fondo_fila = "#b9f1d4;";
                                    break;
                                case "05":
                                    background_color_fondo_fila = "#ffe19c";
                                    break;
                                case "06":
                                    background_color_fondo_fila = "#ffffb8";
                                    break;
                                case "09":
                                    background_color_fondo_fila = "#cee4ff";
                                    break;
                                default:
                                    background_color_fondo_fila= "";
                                    break;
                            }

                            var tr =    "<tr style ='background-color: "+background_color_fondo_fila+"'>" +
                                        "   <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                        "   <td class=\"celda-centrada\">" + horario.DescripcionEspecialidad + "</td>" +
                                        "   <td class=\"celda-centrada\">" + horario.Horario + "</td>" +
                                        "   <td class=\"celda-centrada\">" + horario.PrimeraHora + "</td>" +
                                        "   <td class=\"celda-centrada\">" + horario.SegundaHora + "</td>" +
                                        "   <td class=\"celda-centrada\">" +
                                        "       <button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"editar(this);\" title=\"Editar configuración\"><span class=\"icon-pencil\"></span></button>" +
                                        "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminar(this);\" title=\"Eliminar cofiguración\"><span class=\"icon-bin\"></span></button>" +
                                        "   </td>" +
                                        "   <td style=\"display: none;\">" + anioProg + "</td>" +
                                        "   <td style=\"display: none;\">" + mesProg + "</td>" +
                                        "   <td style=\"display: none;\">" + horario.CodEspecialidad + "</td>" +
                                        "</tr>";
                            tbody.append(tr);
                        }
                    }
                }else{
                    var errores = "";
                    for(i = 0; i < datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error","ERROR",errores);
                }
            }
        });
    }
}

function limpiarModal(){
    var fecha = new Date();
    var mesStr = "";
        
    if((fecha.getMonth() + 1) < 10 ){
        mesStr = "0" + (fecha.getMonth() + 1);
    }
    $("#codEspeM option:selected").prop("selected", false);
    $("#anioProgM").val(fecha.getFullYear());
    $("#mesProgM").val(mesStr);
    $("#horarioM").val("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
}
