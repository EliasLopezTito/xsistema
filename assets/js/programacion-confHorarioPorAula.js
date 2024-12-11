$(document).ready(function(){
    
    cargarInstituciones(true);  
    cargarTipoEspecialidades(true);      
    cargarInstituciones2(true);
	
});

$("#institucion_").change(function () {
    $("#horarioM").html("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
    cargarTipoEspecialidades2(true);
})

$("#tipoEspecialidad_").change(function () {
    $("#horarioM").html("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
    cargarEspecialidades2();
})

$("#institucion").change(function(){
    cargarTipoEspecialidades(true);
})

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades();
})

//Para filtro de listado
$("#especialidad").change(function () {

    //$("#contenedor_listado").css("display","block");
    //cargarHorariosPorAula();

});

//Para filtro de listado
$("#btnBuscar").click(function () {

    $("#contenedor_listado").css("display", "block");
    cargarHorariosPorAula();

});

$("#anioProg").change(function(){
    //cargarHorariosPorAula();
});

$("#mesProg").change(function(){
    //cargarHorariosPorAula();
});

//Para crear las configuraciones de horarios x aula
$("#btnNuevo").click(function ()
{   
    cargarInstituciones2(true);
    $("#tituloModal").html("NUEVA CONFIGURACIÓN");
    $("#btnGrabarM").attr("title","Grabar configuración");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Configuración");
    $("#opcion").val("create");
    limpiarModal();

    $("#codAulaM").attr("disabled",false);
    $("#anioProgM").attr("disabled",false);
    $("#mesProgM").attr("disabled",false);

    $("#anioProgM").val($("#anioProg").val());
    $("#mesProgM").val($("#mesProg").val());

    $("#modalTurnoVirtual").modal({backdrop: 'static', keyboard: false});
});

$("#especialidad_").change(function () {

    cargarHorariosByCarrera();

});

$("#horarioM").change(function () {

    var horarioM = $("#horarioM").val();

    var parametros = horarioM.split("--");
    var id_Horario = parametros[0];
    var primeraHoraM = parametros[1];
    var segundaHoraM = parametros[2];

    $("#primeraHoraM").val(primeraHoraM);
    $("#segundaHoraM").val(segundaHoraM);

});

function cargarHorariosByCarrera() {

    var local = $("#institucion_").val();
    var tipoEspecialidad = $("#tipoEspecialidad_").val();
    var codEspecialidad = $("#especialidad_").val();

     $.ajax({
            url: path + "programacion/confHorarioPorAula",
            type: "POST",
            data: {
                codEspecialidad: codEspecialidad,
                opcion: 'cargarHorarios',
                local:local,
                tipoEspecialidad:tipoEspecialidad
            },
            success: function (data) {
                //console.log(data);
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
                            $("#horarioM").append("<option value=\"" + horario.id_Horario + "--" + horario.PrimeraHora + "--" + horario.SegundaHora + "\">" + horario.Descripcion + "</option>");
                        }
                    } else {
                        mostrarMensaje("error", "ERROR", "No se encontraron horarios para la carrera seleccionada.");
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
}

$("#btnGrabarM").click(function ()
{   

    var opcion = $("#opcion").val();
    var codAula = $("#codAulaM").val();
    var anioProg = $("#anioProgM").val();
    var mesProg = $("#mesProgM").val();
    var primeraHora = $("#primeraHoraM").val();
    var segundaHora = $("#segundaHoraM").val();

    //var local = $("#institucion_").val();
    //var tipoEspecialidad = $("#tipoEspecialidad_").val();
    //var codEspecialidad = $("#especialidad_").val();
    
    $.ajax({
        url: path + "programacion/confHorarioPorAula",
        type: "POST",
        data: {
            opcion: opcion,
            codAula: codAula,
            anioProg: anioProg,
            mesProg: mesProg,
            primeraHora: primeraHora,
            segundaHora: segundaHora
            //local: local,
            //tipo: tipoEspecialidad,
            //especialidad: codEspecialidad 
        },
        success: function(data){
            var datos = JSON.parse(data);
            if(datos.respuesta=="success")
            {

                /**$("#especialidad").val( $("#especialidad_").val() ); 
                $("#anioProg").val($("#").val()); 
                $("#mesProg").val($("#").val());    
                $("#institucion").val( $("#especialidad_").val() );
                $("#tipoEspecialidad").val( $("#tipoEspecialidad_").val() );
                $("#especialidad").val( $("#especialidad_").val() );                                                        
                cargarHorariosPorAula();**/
                $("#institucion").val("10");
                cargarInstituciones(true);

                var tbody = $("#tablaCambioTurnoVirtual tbody");
                tbody.find('tr').remove();
                $("#contenedor_listado").css({"display":"none"})

                //reiniciar modal
                $("#codAulaM").val('100');
                $("#horarioM").html("");
                $("#primeraHoraM").val("");
                $("#segundaHoraM").val("");
                $("#institucion_").val("10");
                cargarInstituciones2(true);

                $("#modalTurnoVirtual").modal("hide");

                Notiflix.Notify.Success('LA OPERACIÓN SE REALIZO CON ÉXITO');

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

function limpiarModal(){
    var fecha = new Date();
    var mesStr = "";
        
    if((fecha.getMonth() + 1) < 10 ){
        mesStr = "0" + (fecha.getMonth() + 1);
    }
    $("#codAulaM option:selected").prop("selected", false);
    $("#anioProgM").val(fecha.getFullYear());
    $("#mesProgM").val(mesStr);
}

async function editar(btn)
{
    var aula = $(btn).parent().parent().find("td").eq(2).html();
    var primeraHora = $(btn).parent().parent().find("td").eq(3).html();
    var segundaHora = $(btn).parent().parent().find("td").eq(4).html();
    var anioProg = $(btn).parent().parent().find("td").eq(6).html();
    var mesProg = $(btn).parent().parent().find("td").eq(7).html();
    var codEspe = $(btn).parent().parent().find("td").eq(8).html();
    var local = $(btn).parent().parent().find("td").eq(9).html();
    var tipo_espe = $(btn).parent().parent().find("td").eq(10).html();
    $("#institucion_").html("");
    $("#tipoEspecialidad_").html("");
    $("#especialidad_").html("");
 
    const response = await fetch(`${path}institucion/getInstituciones`, {
        method:"POST" , headers:{"Content-Type":"application/json"}
    });
    const instituciones = await response.json();    
    instituciones.instituciones.forEach( (val) => { 
        if (val.cod_local.trim() === local.trim()) $("#institucion_").append(`<option value="${val.cod_local.trim()}"> ${val.cod_local.trim()} - ${val.descripcion.trim()} </option>`); 
    });
    
    const response2 = await fetch(`${path}tipoEspecialidad/getTipoEspecialidades`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Accept': 'application/json', },
        body: JSON.stringify({ "institucion" : local })
    });
    const tipoEspecialidades = await response2.json();      
    tipoEspecialidades.tipoEspecialidades.forEach( (val) => {
        if (val.tipo_espe.trim() === tipo_espe.trim()) $("#tipoEspecialidad_").append(`<option value="${val.tipo_espe.trim()}" >${val.tipo_espe.trim()} - ${val.descripcion.trim()} </option>`)         
    });

    const response3 = await fetch(`${path}especialidad/getEspecialidades`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Accept': 'application/json', },
        body: JSON.stringify({ "institucion": local , "tipoEspecialidad" : tipo_espe})
    });
    const especialidades = await response3.json();
    especialidades.especialidades.forEach((val) => {
        $("#especialidad_").append(`<option ${(val.cod_espe.trim()===codEspe.trim())?"selected":""} value="${val.cod_espe.trim()}" >${val.cod_espe.trim()} - ${val.descripcion.trim()} </option>`)
    });

    $("#tituloModal").html("EDITAR CONFIGURACIÓN");
    $("#btnGrabarM").attr("title", "Editar configuración");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Editar Configuración");
    $("#opcion").val("update");
    limpiarModal();
    $("#codAulaM").val(aula.trim());
    $("#anioProgM").val(anioProg.trim());
    $("#mesProgM").val(mesProg.trim());
    $("#primeraHoraM").val(primeraHora);
    $("#segundaHoraM").val(segundaHora);   
    $("#codAulaM").attr("disabled",true);
    $("#anioProgM").attr("disabled",true);
    $("#mesProgM").attr("disabled",true);

    cargarHorariosByCarrera();
    
    $("#modalTurnoVirtual").modal({backdrop: 'static', keyboard: false});
    
}

function eliminar(btn)
{
    var codAula = $(btn).parent().parent().find("td").eq(2).html();
    var anioProg = $(btn).parent().parent().find("td").eq(6).html();
    var mesProg = $(btn).parent().parent().find("td").eq(7).html();
    var opcion = "delete";
        
    if(codAula != null && anioProg != null && mesProg != null && codAula != "" && anioProg != "" && mesProg != "")
    {

        $("#codAulaD").val(codAula);
        $("#anioProgD").val(anioProg);
        $("#mesProgD").val(mesProg);
        $("#opcionD").val(opcion);
        mostrarMensaje("confirmacion","CONFIRMAR","¿Seguro que desea eliminar la configuración del aula: " + codAula +"?");

    }else{
        $("#codAulaD").val("");
        $("#anioProgD").val("");
        $("#mesProgD").val("");
        $("#opcionD").val("");
        mostrarMensaje("error","ERROR","Debe completar todos los datos");
    }
}

$("#mensaje-boton-aceptar").click(function ()
{

    $("#modalMensaje").modal("hide");
    var codAula = $("#codAulaD").val();
    var anioProg = $("#anioProgD").val();
    var mesProg = $("#mesProgD").val();
    var opcion = $("#opcionD").val();
        
    if(codAula != null && anioProg != null && mesProg != null && codAula != "" && anioProg != "" && mesProg != "")
    {
        var tbody = $("#tablaCambioTurnoVirtual tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/confHorarioPorAula",
            type: "POST",
            data: {
                opcion: opcion,
                codAula: codAula,
                anioProg: anioProg,
                mesProg: mesProg
            },
            success: function(data){

                var datos = JSON.parse(data);

                if(datos.respuesta=="success")
                {
                    cargarHorariosPorAula();
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

function cargarHorariosPorAula()
{
    var anioProg = $("#anioProg").val();
    var local = $("#institucion").val();
    var tipo_espe = $("#tipoEspecialidad").val();
    var mesProg = $("#mesProg").val();
    var programaAcademico = $("#especialidad").val();
    var opcion = "select";

       
    if(anioProg != null && mesProg != null && programaAcademico != null)
    {
        var tbody = $("#tablaCambioTurnoVirtual tbody");
        tbody.find('tr').remove();

        $.ajax({
            url: path + "programacion/confHorarioPorAula",
            type: "POST",
            data: {
                opcion: opcion,
                programaAcademico: programaAcademico,
                anioProg: anioProg,
                mesProg: mesProg,
                local: local,
                tipo_espe: tipo_espe
            },
            success: function(data){
                var datos = JSON.parse(data);

                if(datos.respuesta=="success")
                {
                    if(datos.aulas != "vacio")
                    {
                        var aulas = datos.aulas;
                        for(i=0;i<aulas.length;i++)
                        {
                            var aula = aulas[i];

                            switch(aula.CodEspecialidad)
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

                            var tr =    `<tr style='background-color:${background_color_fondo_fila}'>
                                           <td class="celda-centrada"> ${(i + 1)} </td>
                                           <td class="celda-centrada"> ${aula.DescripcionEspecialidad} </td>
                                           <td class="celda-centrada"> ${aula.Aula} </td>
                                           <td class="celda-centrada"> ${aula.PrimeraHora} </td>
                                           <td class="celda-centrada"> ${aula.SegundaHora} </td>
                                           <td class="celda-centrada">
                                               <button class="btn boton-tabla boton-azul" type="button" onclick="editar(this);" title="Editar configuración"><span class="icon-pencil"></span></button>
                                               <button class="btn boton-tabla boton-rojo" type="button" onclick="eliminar(this);" title="Eliminar configuración"><span class="icon-bin"></span></button>
                                           </td>
                                           <td style="display:none"> ${anioProg} </td>
                                           <td style="display:none"> ${mesProg} </td>
                                           <td style="display:none"> ${aula.CodEspecialidad} </td>                                            
                                           <td style="display:none"> ${aula.cod_local} </td>
                                           <td style="display:none"> ${aula.tipo_espe} </td> 
                                        </tr>`;
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
    }else
    {
        Notiflix.Report.Failure('Error',"Debe seleccionar un programa académico, mes y año.","Cerrar");
    }
}



//============================

function cargarInstituciones2(enlazado) {
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
                        cargarTipoEspecialidades2(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades2(enlazado) {
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
                        cargarEspecialidades2(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades2() {
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