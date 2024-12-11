$(document).ready(function () {
    cargarInstituciones(false);   
    cargarSedes();
    cargarPabellones();  

    $('#aula').select2({
        width: 'style' // need to override the changed default
    });  
        
});

document.addEventListener('change', e => {
    
    if (e.target.matches('#pabellon')) {
        cargarAulasPorPabellon();
    }

})

$("#frmConsultarAulasDisponibles").submit(function(e){
    e.preventDefault();

    let req = $(this).serializeArray();
    req.push({name:"opcion",value:"consultarAulasDisponibles"});      

    $.ajax({
        url: path + "programacion/mantenimientoSecciones",
        type: "POST",
        dataType: "JSON",
        data: req,
        beforeSend: function () {     
            $("#modalLoader").modal();      
            $("#tablaAulasDisponibles tbody").html("");  
            $("#divTablaAlumnosPorProgramacion").css({ "display": "none" });    
            $("#tablaAlumnosPorProgramacion tbody").html("");      
        },
        complete: function(){
            $("#modalLoader").modal("hide");           
        },
        success: function (data) {        
            if (data.respuesta === "success") {                
                if (data.res.length > 0) {
                    data.res.forEach((val, i) => {
                        $("#tablaAulasDisponibles tbody").append(`
                            <tr onclick="cargarAlumnos(this)" class="trAulasDisponibles" aula="${val.cod_aula.trim()}" anio="${val.ano.trim()}" local="${val.cod_local.trim()}" sede="${val.cod_localinst.trim()}" mes="${val.mes.trim()}" turno="${val.cod_turno.trim()}" curso="${val.cod_curso.trim()}" ciclo="${val.cod_ciclo.trim()}" nivel="${val.cod_nivel.trim()}" hora="${val.Hora.trim()}" >
                                <td class="text-center">${val.cod_aula.trim()}</td>
                                <td class="text-center">${val.ano.trim()}</td>
                                <td class="text-center">${val.mes.trim()}</td>
                                <td class="text-center">${val.fechainicio == null ? '-' : val.fechainicio.substring(0,10).trim()}</td>
                                <td class="text-center">${val.fechafinal == null ? '-' : val.fechafinal.substring(0, 10).trim()}</td>
                                <td class="text-center">${val.profesion.trim()}</td>
                                <td class="text-center">${ (val.flag === null ? "" : val.flag.trim() )}</td>
                                <td class="text-center">${val.cod_ciclo.trim()}</td>
                                <td class="text-center">${val.Hora.trim()}</td>
                            </tr>
                        `);
                    });                                       
                }else{
                    $("#tablaAulasDisponibles tbody").html(`
                        <tr><td class="text-center" colspan="9">NO SE ENCONTRARON AULAS DISPONIBLES</td></tr>
                    `);
                }
            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");

            }
        }
    });
})

function cargarAulasPorPabellon() {
    
    $.ajax({
        url: path + "programacion/mantenimientoSecciones",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "aulasPorPabellon",           
            pabellon: $("#pabellon").val(),
            institucion: $("#institucion").val(),
            sede: $("#sede").val(),
        },
        beforeSend: function(){
            
            $("#modalLoader").modal();
            $("#aula").html("").prop("disabled",true);
            $("#btnConsultarAulas").prop("disabled",true);  

            $("#divTablaAlumnosPorProgramacion").css({ "display": "none" });
            $("#tablaAlumnosPorProgramacion tbody").html("")
            $("#tablaAulasDisponibles tbody").html("");     

        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function (data) {

            if (data.respuesta === "success") {                

                Notiflix.Notify.Success("Se cargaron las aulas del pabellón seleccionado.");
                if (data.res.length > 0){
                    data.res.forEach( (val,i) => {
                        $("#aula").append(`
                            <option value="${val.cod_nivel}|${val.cod_aula}"> ${val.cod_nivel} --- ${val.cod_aula} --- Capacidad : ${val.capacidad}</option>
                        `);
                    });
                    $("#aula").prop("disabled", false);
                    $("#btnConsultarAulas").prop("disabled", false);                    
                }

            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");

            }

        }
    });

}

function cargarAlumnos(tr,clearId = true) {    

    if(clearId){
        $(".trAulasDisponibles").removeAttr("id");  
        $(tr).prop("id","tr_seleccionado");
        $(".trAulasDisponibles").removeClass("success");
        $(tr).addClass("success");
    }

    const aula = $(tr).attr("aula");
    const anio = $(tr).attr("anio");
    const sede = $(tr).attr("sede");
    const mes = $(tr).attr("mes");
    const turno = $(tr).attr("turno");
    const curso = $(tr).attr("curso");
    const ciclo = $(tr).attr("ciclo");
    const nivel = $(tr).attr("nivel");
    const hora = $(tr).attr("hora");
    const local = $(tr).attr("local");    
      
    $.ajax({
        url: path + "programacion/mantenimientoSecciones",
        type: "POST",
        dataType: "JSON",
        data: {
            aula: aula,
            anio: anio,
            sede: sede,
            mes: mes,
            turno: turno,
            curso: curso,
            ciclo: ciclo,
            nivel: nivel,
            hora: hora,
            local: local,
            opcion: "cargarAlumnosPorAula"
        },
        beforeSend: function () {
            if(clearId){
                console.log("es true");
                $(".text-loader").text("CARGANDO ALUMNOS...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false }); 
            }
            $("#cantidad").text("");
            $("#divTablaAlumnosPorProgramacion").css({ "display": "none" });
            $("#tablaAlumnosPorProgramacion tbody").html("");
            $("#btnAgregarAlumno").prop("disabled", true);
            $("#btnEliminarAlumnos").prop("disabled", true);            
        },
        complete: function () {     
            if (clearId) {   
                $("#modalLoader").modal("hide");           
            }
        },
        success: function (data) {
          
            if (data.respuesta === "success") {
            
                $("#divTablaAlumnosPorProgramacion").css({ "display": "block" })

                if (data.res.length > 0) {
                    
                    const cantidad = data.res.length;
                    const prog = data.res[0];
                    $("#cantidad").text(cantidad);
                    $("#aula_").val(prog.aula.trim());
                    $("#anio_").val(prog.anio.trim());
                    $("#sede_").val(prog.sede.trim());
                    $("#mes_").val(prog.mes.trim());
                    $("#turno_").val(prog.turno.trim());
                    $("#curso_").val(prog.curso.trim());
                    $("#ciclo_").val(prog.ciclo.trim());
                    $("#hora_").val(prog.hora.trim());
                    $("#local_").val(prog.local.trim());
                    $("#especialidad_").val(prog.especialidad.trim());
                    $("#tespecialidad_").val(prog.tespecialidad.trim());
                    $("#semestre_").val(prog.semestre.trim());                                        
                    $("#codigo_grupo").val(prog.grupo.trim());                  
                                        
                    data.res.forEach((val, i) => {
                        $("#tablaAlumnosPorProgramacion tbody").append(`
                            <tr class="trAlumnosProgramados">
                                <td class="text-center"> 
                                    <input type="hidden" class="" value="${val.id_prog}">   
                                    <input type="checkbox" style="cursor:pointer" ></input>  
                                </td>
                                <td class="text-center">
                                    <span style="cursor:pointer" id_prog="${val.id_prog}" codigo="${val.cod_alumno}" ondblclick="actualizarCodigoInterno(this)" >
                                        <b>${val.CodInterno.trim()}</b>
                                    </span>
                                </td>
                                <td class="text-center">${val.Alumno.trim()}</td>
                                <td class="text-center">${val.Curso.trim()}</td>
                                <td class="text-center">${val.Instituto.trim()}</td>
                                <td class="text-center">${val.Especialidad.trim()}</td>
                                <td class="text-center">${val.semestre.trim()}</td>
                                <td class="text-center">${val.Grupo.trim()}</td>                                
                            </tr>
                        `);
                    });

                    $("#btnAgregarAlumno").prop("disabled", false);
                    $("#btnEliminarAlumnos").prop("disabled", false);
                    
                } else {
                    
                    $("#tablaAlumnosPorProgramacion tbody").html(`<tr><td class="text-center" colspan="8">NO SE ENCONTRARON ALUMNOS PROGRAMADOS </td></tr>`);                    
                }

            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");

            }

        }
    });

}

function actualizarCodigoInterno( element ){
    
    const id_prog = $(element).attr("id_prog");
    const cod_alumno = $(element).attr("codigo");

    $.ajax({
        url: path + "programacion/mantenimientoSecciones",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "selectCodigosInternosPorAlumno",
            codigo: cod_alumno
        },
        beforeSend: function () {  
            $("#codInterno_").html(""); 
            $("#btnActualizarCodigoInterno").prop("disabled",true);        
        },
        complete: function () {  
            $("#modalActualizarCodigoInterno").modal();      
        },
        success: function (data) {
            
            if (data.respuesta === "success") {

                if(data.data.length > 0){

                    data.data.forEach(element => {
                        $("#codInterno_").append(`
                            <option value="${id_prog.trim()}?${element.cod_adminis.trim()}"> ${element.cod_adminis.trim()} </option>
                        `); 
                    });

                    $("#btnActualizarCodigoInterno").prop("disabled", false);     

                }
                
            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.", { timeout: 10000 });

            }

        }
    });    

}

$("#btnActualizarCodigoInterno").click(function(){

    $.ajax({
        url: path + "programacion/mantenimientoSecciones",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "updateCodigoInternoPorAlumno",
            req: $("#codInterno_").val()
        },
        beforeSend: function () {            
        },
        complete: function () { 
            $("#modalActualizarCodigoInterno").modal("hide");
            cargarAlumnos("#tr_seleccionado", false);            
        },
        success: function (data) {

            if (data.respuesta === "success") {

                Notiflix.Notify.Success("EL CÓDIGO INTERNO SE ACTUALIZÓ CON ÉXITO", { timeout: 4000 });

            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.", { timeout: 7000 });

            }

        }
    });

})

$(document).on("click",".trAlumnosProgramados",function(){

    if($(this).hasClass("info")){
        $(this).removeClass("info");
        $(this).children("td").children("input[type=checkbox]").prop("checked",false);
        $(this).children("td").children("input[type=hidden]").removeClass("id_seleccionado");
    }else{
        $(this).addClass("info");
        $(this).children("td").children("input[type=checkbox]").prop("checked", true);          
        $(this).children("td").children("input[type=hidden]").addClass("id_seleccionado");     
    }
    
})

$("#btnAgregarAlumno").click(function(){

    $("#modalAgregarAlumno").modal({
        backdrop: 'static',
        keyboard: false
    })

})

$("#alumno").autocomplete({
    source: function (request, response) {
        $.ajax({
            url: path + "Programacion/mantenimientoSecciones",
            dataType: "json",
            type: 'post',
            data: {
                term: request.term,
                opcion: 'buscarAlumno'
            },
            success: function (data) {
               
                $("#alumno").next('i').removeClass('glyphicon-ok');
                $("#alumno").next('i').addClass('glyphicon-remove');
                $("#alumno").parent().removeClass('has-success');
                $("#alumno").parent().addClass('has-error');               
                let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                response(result);
            }
        });
    },
    minLength: 2,
    select: function (event, ui) {
        if (ui.item.vacio) {
            event.preventDefault();
        } else {

            $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.alumno);            
            $("#alumno").next('i').removeClass('glyphicon-remove');
            $("#alumno").next('i').addClass('glyphicon-ok');
            $("#alumno").parent().removeClass('has-error');
            $("#alumno").parent().addClass('has-success');
            $("#btnRegistrarAlumnos").prop("disabled",false)
            cargarAlumnoSeleccionado(ui.item.cod_alumno, ui.item.alumno , ui.item.Especialidad , ui.item.Cod_local , ui.item.Cod_espe , ui.item.cod_interno );

        }
        return false;
    }
})
.autocomplete("instance")._renderItem = function (ul, item) {

    if (item.hasOwnProperty('vacio')) {
        return $("<li>")
            .append("<div>No se encontraron resultados</div>")
            .appendTo(ul);
    }

    return $("<li>")
        .append("<div style='font-size:12px'><b>" + item.cod_alumno + "</b> - " + item.alumno +"</div>")
        .appendTo(ul);
};

$("#alumno").keyup(function(){
    if($(this).val()===""){
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

$("#limpiarAutocomplete").click(function(){
    $("#alumno").val("")
    $("#alumno").next('i').removeClass('glyphicon-ok');
    $("#alumno").next('i').addClass('glyphicon-remove');
    $("#alumno").parent().removeClass('has-success');
    $("#alumno").parent().addClass('has-error');
    $("#alumno").focus()
})

function cargarAlumnoSeleccionado(codigo,alumno,especialidad,local,codigo_espe,cod_interno,tipo_espe){

    $("#tablaAlumnosSeleccionados tbody").append(`
        <tr>
            <td class="text-center">
                <input type="hidden" name="codigos[]" value="${codigo.trim()}"></input>
                ${codigo.trim()}
            </td>
            <td class="text-center">${alumno.trim()}</td>
            <td class="text-center">                
                ${especialidad.trim()}
            </td>
            <td class="text-center">${local.trim()}</td>            
            <td class="text-center"> 
                <input required type="hidden" value="${cod_interno}" name="cod_interno[]" maxlength="10"></input>
                ${cod_interno}
            </td>
            <td class="text-center"> 
                <button class="btn boton-tabla boton-rojo" type="button" onclick="quitarAlumno(this)"><span class="icon-bin"></span></button>             
            </td>
        </tr>   
    `)

}

function quitarAlumno(btn){
    $(btn).parent("td").parent("tr").remove();
    if ($("#tablaAlumnosSeleccionados tbody tr").length < 1){
        $("#btnRegistrarAlumnos").prop("disabled", true)
    }    
}

$("#formRegistrarAlumnos").submit(function(e){

    e.preventDefault();
    let req = $(this).serializeArray();
    req.push({ name: "opcion", value: "registrarAlumnos" });

    $.ajax({
        url: path + "programacion/mantenimientoSecciones",
        type: "POST",
        dataType: "JSON",
        data: req,
        beforeSend: function () {
            $(".text-loader").text("REGISTRANDO ALUMNOS, POR FAVOR ESPERE...");
            /**$("#modalLoader").modal({
                backdrop: 'static',
                keyboard: false
            });**/ 
            $("#btnRegistrarAlumnos").prop("disabled", true);  
            //$("body").css({ "padding": 0 });          
        },
        complete: function () {
            //$("#modalLoader").modal("hide");    
            //$("body").css({ "padding": "0px !important" });                                
        },
        success: function (data) {
          
            if (data.respuesta === "success") {

                Notiflix.Notify.Success("LOS ALUMNOS SE AGREGARON CON ÉXITO.",{timeout:7000});
                $("#modalAgregarAlumno").modal("hide");
                clearModalAgregarAlumno();
                cargarAlumnos("#tr_seleccionado",false)

            } else {

                Notiflix.Notify.Failure( "OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO." , { timeout:10000 } );

            }
            
        }
    });

})

$("#btnCerrarModalAgregarAlumno").click(function(){

    clearModalAgregarAlumno();

})

function clearModalAgregarAlumno(){

    $("#tablaAlumnosSeleccionados tbody").html("");
    $("#btnRegistrarAlumnos").prop("disabled", true);
    $("#alumno").val("");
    $("#alumno").next('i').removeClass('glyphicon-ok');
    $("#alumno").next('i').addClass('glyphicon-remove');
    $("#alumno").parent().removeClass('has-success');
    $("#alumno").parent().addClass('has-error');    

}

$("#btnModificarAlumnos").click(function(){

    if ( $(".id_seleccionado").length > 0 ){
        
        $("#codigo_grupal_update").val("");
        $("#modalActualizarCodigoGrupal").modal({ backdrop: 'static', keyboard: false });             
                
    }else{

        Notiflix.Notify.Warning("PARA MODIFICAR EL CÓDIGO GRUPAL DEBE SELECCIONAR MÍNIMO UN ALUMNO.", { timeout: 5000 });

    }

})

$("#btnActualizarCodigoGrupal").click(function () {

    let programaciones = [];
    $(".id_seleccionado").each(function (index, element) {
        programaciones.push(element.value);
    })
    const codigo = $("#codigo_grupal_update").val();
    
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de actualizar el código grupal de los alumnos seleccionados?',
        'Si',
        'No',
        function () {

            $.ajax({
                url: path + "programacion/mantenimientoSecciones",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "actualizarCodigoGrupal",
                    programaciones: JSON.stringify(programaciones),
                    codigo: codigo
                },
                beforeSend: function () {                              
                    $("#btnActualizarCodigoGrupal").prop("disabled",true);                    
                },
                complete: function () {                    
                    $("#btnActualizarCodigoGrupal").prop("disabled", false); 
                    cargarAlumnos("#tr_seleccionado", false);                                                                                  
                },
                success: function (data) {
                
                    if (data.respuesta === "success") {
                        
                        $("#modalActualizarCodigoGrupal").modal("hide");                                                       
                        Notiflix.Notify.Success("LOS CÓDIGOS SE ACTUALIZARON CON ÉXITO.");                                           

                    } else {

                        Notiflix.Notify.Failure("NO SE PUDO ACTUALIZAR LOS ALUMNOS SELECCIONADOS, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO", { timeout: 8000 });

                    }

                }
            });

        }
        , function () {
        }
    );
    
})

$("#btnEliminarAlumnos").click(function () {

    if ($(".id_seleccionado").length > 0) {

        let codigos = [];

        $(".id_seleccionado").each(function (index, element) {
            codigos.push(element.value);
        })

        Notiflix.Confirm.Show(
            'Confirmación',
            '¿Está seguro de eliminar los alumnos seleccionados?',
            'Si',
            'No',
            function () {

                $.ajax({
                    url: path + "programacion/mantenimientoSecciones",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        opcion: "eliminarAlumnos",
                        codigos: JSON.stringify(codigos)
                    },
                    beforeSend: function () {
                        $(".text-loader").text("ELIMINANDO ALUMNOS SELECCIONADOS, POR FAVOR ESPERE...");
                        $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                    },
                    complete: function () {
                        $("#modalLoader").modal("hide");
                    },
                    success: function (data) {

                        if (data.respuesta === "success") {

                            Notiflix.Notify.Success("LOS ALUMNOS SE ELIMINARON CON ÉXITO.");
                            cargarAlumnos("#tr_seleccionado", false)

                        } else {

                            Notiflix.Notify.Failure("NO SE PUDO ELIMINAR LOS ALUMNOS SELECCIONADOS, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO", { timeout: 8000 });

                        }

                    }
                });

            }
            , function () {

            });

    } else {

        Notiflix.Notify.Warning("PARA ELIMINAR DEBE SELECCIONAR MÍNIMO UN ALUMNO.", { timeout: 3000 });

    }

})