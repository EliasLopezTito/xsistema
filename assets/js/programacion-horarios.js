$(document).ready(function(){
    cargarInstituciones(true,true);
    cargarInstituciones_(true);
    $(".campo-ciclo").css("display","none");
});

$("#institucion").change(function () {
    cargarTipoEspecialidades(true, true);
})

$("#tipoEspecialidad").change(function(){
    cargarEspecialidades(true,true);
})

$("#institucion_").change(function () {
    cargarTipoEspecialidades_(true);
})

$("#tipoEspecialidad_").change(function () {
    cargarEspecialidades_();
})

$("#frmBuscar").submit(function (e) {

    e.preventDefault();
    let data = $("#frmBuscar").serializeArray();
    data.push({ name: 'opcion', value: 'selectHorarios' });

    var opcionHorario = $("#clasificacion-horario").val();

    var tbody1 = $("#tablaHorariosXCarreras tbody");
    tbody1.find('tr').remove();

    var tbody2 = $("#tablaHorariosXAulas tbody");
    tbody2.find('tr').remove();

    $("#container-horariosxcarreras").css("display", "none");
    $("#container-horariosxaulas").css("display", "none");

    $.ajax({
        url: path + "programacion/horarios",
        type: "POST",
        dataType: "JSON",
        data: $.param(data),
        beforeSend: function () {
            $("#btnBuscar").prop("disabled", true).html("Cargando...");
        },
        complete: function () {
            $("#btnBuscar").prop("disabled", false).html("<span class='icon - search'></span> Buscar");
        },
        success: function (datos) {

            if (datos.respuesta == "success") {

                if (datos.horarios != "vacio") {
                    var horarios = datos.horarios;

                    for (i = 0; i < horarios.length; i++) {

                        var horario = horarios[i];

                        var tr = "<tr style ='background-color: " + horario.bg + "'>" +
                            "   <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                            "   <td class=\"celda-centrada\">" + horario.Descripcion + "</td>" +
                            "   <td class=\"celda-centrada\">" + horario.PrimeraHora + "</td>" +
                            "   <td class=\"celda-centrada\">" + horario.SegundaHora + "</td>" +
                            "   <td class=\"celda-centrada\">" + horario.DescripcionEspecialidad + "</td>";

                        if (opcionHorario == 1) {//CARRERAS

                            tr = tr + "   <td class=\"celda-centrada\">" + horario.Ciclo + "</td>";

                        }


                        tr = tr + "   <td class=\"celda-centrada\">" +
                            "       <button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"editar(this, " + horario.id_Horario + ");\" title=\"Editar horario\"><span class=\"icon-pencil\"></span></button>" +
                            "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminar(this, " + horario.id_Horario + ");\" title=\"Eliminar horario\"><span class=\"icon-bin\"></span></button>" +
                            "   </td>" +
                            "   <td style=\"display:none\">" + horario.CodEspecialidad + "</td>" +
                            "</tr>";

                        if (opcionHorario == 1) {//CARRERAS

                            tbody1.append(tr);
                            $("#container-horariosxcarreras").css("display", "block");
                            $("#container-horariosxaulas").css("display", "none");

                        } else {
                            tbody2.append(tr);
                            $("#container-horariosxcarreras").css("display", "none");
                            $("#container-horariosxaulas").css("display", "block");
                        }
                    }

                } else {
                    Notiflix.Notify.Warning("NO SE ENCONTRÓ INFORMACIÓN CON LOS PARÁMETROS SELECCIONADOS", { timeout: 5000 });
                }

            } else {

                var errores = "";

                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }

                Notiflix.Report.Failure('Error', errores, "Cerrar");
            }
        }
    });

});

function editar(btn, idHorario) {

    var clasificacionHorario = $("#clasificacion-horario").val();

    if (clasificacionHorario == 1) {//CARRERAS

        var ciclo = $(btn).parent().parent().find("td").eq(5).html();
        $(".campo-ciclo").css("display", "block");

        var codProgramaAcademico = $(btn).parent().parent().find("td").eq(7).html();
        var ProgramaAcademico = $(btn).parent().parent().find("td").eq(4).html();

    } else if (clasificacionHorario == 2) {//AULAS
        $(".campo-ciclo").css("display", "none");
        var ciclo = "00";
        var codProgramaAcademico = $(btn).parent().parent().find("td").eq(6).html();
        var ProgramaAcademico = $(btn).parent().parent().find("td").eq(4).html();
    }

    console.log(codProgramaAcademico);

    var descripcionHora1 = $(btn).parent().parent().find("td").eq(1).html().substring(0, 5);
    var descripcionHora2 = $(btn).parent().parent().find("td").eq(1).html().substring(8, 13);
    var primeraHora1 = $(btn).parent().parent().find("td").eq(2).html().substring(0, 5);
    var primeraHora2 = $(btn).parent().parent().find("td").eq(2).html().substring(8, 13);
    var segundaHora1 = $(btn).parent().parent().find("td").eq(3).html().substring(0, 5);
    var segundaHora2 = $(btn).parent().parent().find("td").eq(3).html().substring(8, 13);

    $("#tituloModal").html("EDITAR HORARIO");
    $("#btnGrabarM").attr("title", "Editar configuracion");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Editar Horario");
    $("#opcion").val("update");

    $("#clasificacion-horario-modal").val(clasificacionHorario);
    $("#clasificacion-horario-modal").attr("disabled", true);
    $("#descripcion-hora1").val(descripcionHora1);
    $("#descripcion-hora2").val(descripcionHora2);
    $("#primerahora-hora1").val(primeraHora1);
    $("#primerahora-hora2").val(primeraHora2);
    $("#segundahora-hora1").val(segundaHora1);
    $("#segundahora-hora2").val(segundaHora2);
    $("#especialidad_").html(`<option value="${codProgramaAcademico}">${ProgramaAcademico}</option>`);
    $("#ciclo").val(ciclo);
    $("#idhorario").val(idHorario);
    $("#especialidad_").attr("disabled", true);
    $("#ciclo").attr("disabled", true);

    $(".ocultar").css({"display":"none"});

    $("#modalHorario").modal({ backdrop: 'static', keyboard: false });

}

$("#clasificacion-horario-modal").change(function () {
    if($("#clasificacion-horario-modal").val() == 1)
    {//CARRERAS
        $(".campo-ciclo").css("display","block");
    }else if($("#clasificacion-horario-modal").val() == 2)
    {//AULAS
        $(".campo-ciclo").css("display","none");
    }
});

$("#btnNuevo").click(function (){
    $("#tituloModal").html("NUEVO HORARIO");
    $("#btnGrabarM").attr("title","Grabar horario");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Horario");
    $("#opcion").val("create");

    limpiarModalNuevoEditarHorario();

    $("#modalHorario").modal({backdrop: 'static', keyboard: false});
});

function limpiarModalNuevoEditarHorario(){
    $("#clasificacion-horario-modal").val("00");
    $("#clasificacion-horario-modal").attr("disabled",false);
    $("#descripcion-hora1").val("");
    $("#descripcion-hora2").val("");
    $("#primerahora-hora1").val("");
    $("#primerahora-hora2").val("");
    $("#segundahora-hora1").val("");
    $("#segundahora-hora2").val("");    
    $("#ciclo").val("00");
    $("#especialidad_").attr("disabled",false);
    $("#ciclo").attr("disabled",false);
    cargarInstituciones_(true);
    $(".ocultar").css({ "display": "block" });
}

$("#btnGrabarM").click(function ()
{
    var opcion = $("#opcion").val();
    var clasificacionHorario = $("#clasificacion-horario-modal").val();
    var local = $("#institucion_").val();
    var tespe = $("#tipoEspecialidad_").val();
    var programaAcademico = $("#especialidad_").val();
    var ciclo = $("#ciclo").val();
    var idhorario = $("#idhorario").val();
    var respuesta = true;

    if(clasificacionHorario == "00" || clasificacionHorario == null|| clasificacionHorario == "")
    {
        respuesta = false;
        Notiflix.Report.Failure('Error',"Debe seleccionar una opción en Horario","Cerrar");
    
    }else if(programaAcademico == "00" || programaAcademico == null|| programaAcademico == "")
    {
        respuesta = false;
        Notiflix.Report.Failure('Error',"Debe seleccionar el programa académico","Cerrar");
    
    }else if(clasificacionHorario == "1" && (ciclo == "00" || ciclo == null || ciclo == ""))
    {
        respuesta = false;
        Notiflix.Report.Failure('Error',"Debe seleccionar el ciclo","Cerrar");
    
    }else if($("#descripcion-hora1").val() == "" || $("#descripcion-hora2").val() == "")
    {
        respuesta = false;
        Notiflix.Report.Failure('Error',"Debe brindar la hora en descripción","Cerrar");
    
    }else if($("#primerahora-hora1").val() == "" || $("#primerahora-hora2").val() == "")
    {
        respuesta = false;
        Notiflix.Report.Failure('Error',"Debe brindar la hora en primera hora","Cerrar");
    
    }else if($("#segundahora-hora1").val() == "" || $("#segundahora-hora2").val() == "")
    {
        respuesta = false;
        Notiflix.Report.Failure('Error',"Debe brindar la hora en segunda hora","Cerrar");
    
    }

    if(respuesta)
    {

        var descripcion = $("#descripcion-hora1").val() + ' - ' + $("#descripcion-hora2").val();
        var primerahora = $("#primerahora-hora1").val() + ' - ' + $("#primerahora-hora2").val();
        var segundahora = $("#segundahora-hora1").val() + ' - ' + $("#segundahora-hora2").val();
        
        $.ajax({
            url: path + "programacion/horarios",
            type: "POST",
            data: {
                opcion: opcion,
                clasificacionHorario: clasificacionHorario,
                descripcion: descripcion,
                primerahora: primerahora,
                segundahora: segundahora,
                programaAcademico: programaAcademico,
                ciclo: ciclo,
                idhorario: idhorario,
                local: local,
                tespe: tespe
            },
            success: function(data)
            {
                var datos = JSON.parse(data);

                if(datos.respuesta=="success")
                {

                    $("#clasificacion-horario").val(clasificacionHorario);                    
                    $("#frmBuscar").submit();
                    $("#modalHorario").modal("hide");

                }else
                {
                    var errores = "";

                    for(i = 0; i < datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }

                    Notiflix.Report.Failure('Error',errores,"Cerrar");
                }
            }
        });

    }

});

function eliminar(btn, idHorario)
{

    var opcion = "delete";

    if(idHorario != null && idHorario != "")
    {

        Notiflix.Confirm.Show(
            'Mensaje de confirmación',
            '¿Seguro que desea eliminar el horario?',
            'Continuar',
            'Cancelar',
            function(){ // Yes button callback

                $.ajax({
                    url: path + "programacion/horarios",
                    type: "POST",
                    data: {
                        opcion: opcion,
                        idHorario: idHorario,
                        idEstadoACambiar: 2
                    },
                    success: function(data)
                    {

                        var datos = JSON.parse(data);

                        if(datos.respuesta=="success")
                        {

                            let clasificacionHorario = $("#clasificacion-horario").val();
                            cargarHorarios(clasificacionHorario);
                            $("#modalHorario").modal("hide");
                        
                        }else
                        {
                            var errores = "";
                            for(i=0; i<datos.errores.length; i++){
                                errores += datos.errores[i] + "<br>";
                            }
                            Notiflix.Report.Failure('Error',errores,"Cerrar");
                        }
                    }
                });

            },
            function(){ // No button callback
                
            } 
        ); 

        
    }else
    {

        Notiflix.Report.Failure('Error',"No se brindó el horario","Cerrar");
    }
}



///////////////////////
function cargarInstituciones_(enlazado, todos = false) {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion_");
            cboInstitucion.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.instituciones != "vacio") {
                    var instituciones = datos.instituciones;
                    for (i = 0; i < instituciones.length; i++) {
                        var institucion = instituciones[i];
                        var selected = institucion.cod_local === "10" ? "selected" : "";
                        cboInstitucion.append("<option " + selected + " value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + ((institucion.descripcionM === null || institucion.descripcionM === "") ? institucion.descripcion : institucion.descripcionM) + "</option>");
                    }
                    if (enlazado == true) {
                        cargarTipoEspecialidades_(enlazado, todos);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades_(enlazado, todos = false) {
    var institucion = $("#institucion_").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad_");
            cboTipoEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.tipoEspecialidades != "vacio") {
                    var tipoEspecialidades = datos.tipoEspecialidades;
                    for (i = 0; i < tipoEspecialidades.length; i++) {
                        var tipoEspecialidad = tipoEspecialidades[i];
                        cboTipoEspecialidad.append("<option value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    if (enlazado == true) {
                        cargarEspecialidades_(enlazado, todos);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades_() {
    var institucion = $("#institucion_").val();
    var tipoEspecialidad = $("#tipoEspecialidad_").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad_");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }                   
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}