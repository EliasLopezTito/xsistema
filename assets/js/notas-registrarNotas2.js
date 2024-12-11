$(document).ready(function () {

    //clave()

    autocomplete();

    $("#alumno").focus();
    $("#codAlumno").attr("disabled", true);
    $("#nombreAlumno").attr("disabled", true);
    $("#turno").attr("disabled", true);
    $("#seccion").attr("disabled", true);
    $("#sede").attr("disabled", true);
    $(".panel_notas").css("display", "none");

    $("#btnAgregarCursoExperiencia").click(function(){
       
        var carrera = $("#carrera").val();         
        var parametros = carrera.split("-");            
        var codLocal = parametros[0];
        var tipoEspe = parametros[1];
        var codEspe = parametros[2];
        var mallaCurricular = parametros[3];
        var ciclo = $("#ciclo").val();
        var alumno = $("#alumno").attr("codigo");
        var semestre = $("#periodo").val();
       
        Notiflix.Confirm.Show(
            'CONFIRMACIÓN',
            '¿ESTÁ SEGURO DE AGREGAR EL CURSO EXPERIENCIAS FORMATIVAS EN SITUACIONES REALES DE TRABAJO?',
            'SI',
            'NO',
            function () {

                if (ciclo === "0") {
                    Notiflix.Notify.Warning("DEBE SELECCIONAR UN CICLO PARA AGREGAR EL CURSO.", { timeout: 4000 });
                    return;
                }

                $.ajax({
                    url: path + "notas/registrarNotas2New_",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        opcion: "agregarCursoExperienciaFormativa",
                        codlocal: codLocal,
                        tipoespe: tipoEspe,
                        codespe: codEspe,
                        alumno: alumno,
                        ciclo: ciclo,
                        semestre: semestre,
                        malla: mallaCurricular
                    },
                    success: function (response) {

                        if ( response.respuesta === "success" ) {

                            Notiflix.Notify.Success("EL CURSO SE AGREGO CON ÉXITO.", { timeout: 4000 });
                            cargarCursosMatriculados();

                        } else {

                            Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.", { timeout: 4000 });

                        }

                    }
                });

            }
            , function () {            
            });

    })

    $("#carrera").change(function () {        
        limpiarCampos(2);
        cargarPeriodos();
    });

    $("#periodo").change(function () {        
        if ($("#ciclo").val() !== "" && $("#ciclo").val() !== null && $("#seccion_").val() !== "" && $("#seccion_").val() !== null ){
            limpiarCampos(3);
            $(".panel_notas").css("display", "block");
            cargarCursosMatriculados();
            cargarCursosAplazados();
        }
    });

    $("#ciclo").change(function () {
        if ($("#periodo").val() !== "" && $("#periodo").val() !== null && $("#seccion_").val() !== "" && $("#seccion_").val() !== null ) {
            limpiarCampos(3);
            $(".panel_notas").css("display", "block");
            cargarCursosMatriculados();
            cargarCursosAplazados();
        }
    });

    $("#seccion_").change(function () {
        if ($("#periodo").val() !== "" && $("#periodo").val() !== null && $("#ciclo").val() !== "" && $("#ciclo").val() !== null) {
            limpiarCampos(3);
            $(".panel_notas").css("display", "block");
            cargarCursosMatriculados();
            cargarCursosAplazados();
        }
    });
    
    $("#btnEditarNotasMatriculados").click(function () {
        activarCursosMatriculados(true);
    });

    $("#btnEditarNotasAplazados").click(function () {
        activarCursosAplazados(true);
    });
    
    $("#btnCancelarMatriculados").click(function () {

        mostrarMensaje("confirmacion", "CONFIRMAR", "Seguro que desea cancelar la edición de notas");
        $("#opcion").val(1);//matriculado
    });

    $("#mensaje-boton-aceptar").click(function () {
        
        if($("#opcion").val() == 1)
        {//cancelar curso matriculado - confirmación
            cargarCursosMatriculados(true);  
        
        }else if($("#opcion").val() == 2)
        {//cancelar curso aplazado - confirmación
            cargarCursosAplazados(true);
        
        }else if($("#opcion").val() == 3)
        {//desactivar curso aplazado - confirmacion

            desactivarCursoAplazado($("#idCursoAplazado").val());
        }
        
        $("#modalMensaje").modal("hide");
    });

    $("#btnCancelarAplazados").click(function () {

         mostrarMensaje("confirmacion", "CONFIRMAR", "Seguro que desea cancelar la edición de notas");
        $("#opcion").val(2);//aplazados
        
    });
 
    $("#btnGrabarNotasMatriculados").click(function () {
        var form = $("#frmNotas").serializeArray();
        form.push({name: "opcion", value: "editarNotasMatriculados"});
        $.ajax({
            url: path + "notas/registrarNotas2New_",
            type: "POST",
            data: $.param(form),
            success: function (data) {
                //console.log(data);
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    activarCursosMatriculados(false);
                    mostrarMensaje("exito", "Notas Guardadas", "Las notas fueron guardadas correctamente");
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    });

    $("#btnGrabarNotasAplazados").click(function () {
        var form = $("#frmNotas").serializeArray();
        form.push({name: "opcion", value: "editarNotasAplazados"});       
        $.ajax({
            url: path + "notas/registrarNotas2New_",
            type: "POST",
            data: $.param(form),
            success: function (data) {                
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    activarCursosAplazados(false);
                    mostrarMensaje("exito", "Notas Guardadas", "Las notas de los cursos aplazados fueron guardadas correctamente");
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    });
    
    $("#btnBuscar").click(function () {
        $("#codigoBus").val("");
        $("#apellidosNombresBus").val("");
        $("#tablaModalAlumno tbody").find('tr').remove();
        $("#codigoBus").focus();
        $("#modalAlumnosMatriculados").modal({backdrop: 'static', keyboard: false});
    });

    $("#btnAgregarCursosAplazados").click(function () {

        $("#curso_aplazado").find('option').remove();
        $("#seccion_aplazado").find('option').remove();
        document.getElementById("mas_secciones").checked = false;
        document.getElementById("seccion_aplazado").style.borderColor = "#d2d6de";
       
        var periodo = $("#periodo").val();
        var carrera = $("#carrera").val();
        var ciclo = $("#ciclo").val();
        var seccion = $("#seccion_").val();

        if (carrera !== null && periodo !== null && ciclo !== null && seccion !== null) {

            $("#btnAgregarCursoAplazado").prop("disabled",false);
            var parametros = carrera.split("-");
            if (parametros.length > 1) {
                
                $('#turnoCursoApla').val(parametros[5])

                var codLocal = parametros[0];
                
                var tipoEspe = parametros[1];
                var codEspe = parametros[2];
                var mallaCurricular = parametros[3]; 
                var localinst = parametros[4];
                //var turno = parametros[5];                       
                var turno = $('#turnoCursoApla').val(); 
                var codAlumno = $("#alumno").attr("codigo");

                $.ajax({
                    url: path + "notas/registrarNotas2New_",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        codLocal: codLocal,
                        tipoEspe: tipoEspe,
                        codEspe: codEspe,
                        mallaCurricular: mallaCurricular,
                        periodo: periodo,
                        codAlumno: codAlumno,
                        ciclo: ciclo,
                        seccion: seccion,
                        opcion: "cursosMatriculados"
                    },
                    complete: function(){
                        $("#modalAgregarCursoAplazado").modal({ backdrop: 'static', keyboard: false });
                    },
                    success: function (datos){     
                        if (datos.respuesta === "success") {

                            if (datos.cursos != "vacio") {
                                var cursos = datos.cursos;
                                for (i = 0; i < cursos.length; i++) {
                                    var curso = cursos[i];
                                    $("#curso_aplazado").append("<option value=\"" + curso.id_Nota + "\">" + curso.curso_des + "</option>");
                                }
                            }
                            console.log("asd", datos.cursos[0].cod_sede.trim());
                            $('#sedeAplazado').val(datos.cursos[0].cod_sede.trim())

                            $.ajax({
                                url: path + "notas/registrarNotas2New_",
                                type: "POST",
                                dataType: "JSON",
                                data: {
                                    codLocal: codLocal,
                                    tipoEspe: tipoEspe,
                                    codEspe: codEspe,
                                    mallaCurricular: mallaCurricular,
                                    periodo: periodo,                                
                                    ciclo: ciclo,                           
                                    localinst: localinst,
                                    turno: turno,                                 
                                    opcion: "cargarSeccionesDisponibles"
                                },                                
                                success: function (datos2) {
                                    if (datos2.respuesta === "success") {
                                        
                                        datos2.secciones.forEach( el => {                                            
                                            if (el.cod_seccion.trim().substring(0, 1) == "z" || el.cod_seccion.trim().substring(0, 1) == "Z" ){
                                                $("#seccion_aplazado").append(`
                                                    <option value="${el.cod_seccion.trim()}">${el.cod_seccion.trim()}</option>
                                                `);
                                            }
                                        });                                        

                                    }
                                }
                            });
                            
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

        }else{

            $("#btnAgregarCursoAplazado").prop("disabled",true);
            
        }

    });

});


document.addEventListener('change', (e) => {
    if (e.target.matches('#mas_secciones')) {
        if (e.target.checked) {
            $.ajax({
                url: path + "notas/registrarNotas2New_",
                type: "POST",
                dataType: "JSON",
                data: {                               
                    opcion: "selectSeccionTodas"
                },                                
                success: function (datos2) {
                    //console.log("data", datos2);
                    if (datos2.respuesta === "success") {
                        document.getElementById("seccion_aplazado").style.borderColor = "#008d4c";
                        $("#seccion_aplazado").find('option').remove();
                        
                        datos2.secciones.forEach( el => {                                            
                            if (el.cod_seccion.trim().substring(0, 1) == "z" || el.cod_seccion.trim().substring(0, 1) == "Z" ){
                                $("#seccion_aplazado").append(`
                                    <option value="${el.cod_seccion.trim()}">${el.cod_seccion.trim()}</option>
                                `);    
                            }
                        });                                        
                    } 
                }
            });
        }else{   
            var periodo = $("#periodo").val();
            var carrera = $("#carrera").val();
            var ciclo = $("#ciclo").val();
            var seccion = $("#seccion_").val();

            if (carrera !== null && periodo !== null && ciclo !== null && seccion !== null) {

                $("#btnAgregarCursoAplazado").prop("disabled",false);
                var parametros = carrera.split("-");
                if (parametros.length > 1) {

                    var codLocal = parametros[0];
                    var tipoEspe = parametros[1];
                    var codEspe = parametros[2];
                    var mallaCurricular = parametros[3]; 
                    var localinst = parametros[4];
                    var turno = parametros[5];

                    $.ajax({
                        url: path + "notas/registrarNotas2New_",
                        type: "POST",
                        dataType: "JSON",
                        data: {
                            codLocal: codLocal,
                            tipoEspe: tipoEspe,
                            codEspe: codEspe,
                            mallaCurricular: mallaCurricular,
                            periodo: periodo,                                
                            ciclo: ciclo,                           
                            localinst: localinst,
                            turno: turno,                                 
                            opcion: "cargarSeccionesDisponibles"
                        },                                
                        success: function (datos2) {
                            if (datos2.respuesta === "success") {
                                document.getElementById("seccion_aplazado").style.borderColor = "#d2d6de";
                                $("#seccion_aplazado").find('option').remove();
                                datos2.secciones.forEach( el => {                                            
                                    if (el.cod_seccion.trim().substring(0, 1) == "z" || el.cod_seccion.trim().substring(0, 1) == "Z" ){
                                        $("#seccion_aplazado").append(`
                                            <option value="${el.cod_seccion.trim()}">${el.cod_seccion.trim()}</option>
                                        `);
                                    }
                                });                                        
                            }
                        }
                    });
                }

            }else{

                $("#btnAgregarCursoAplazado").prop("disabled",true);
                
            }
        }
    }

});

function autocomplete(){
    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) { 
                    limpiarCampos(4);
                    $("#alumno").attr("codigo", "");
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
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                cargarCarreras(ui.item.cod_alumno);
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
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };    
}

$("#alumno").keyup(function(){
    if( $(this).val().length < 1 ){
        limpiarCampos(4);
        $("#alumno").attr("codigo", "");
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');    
    }
})

function clave(){

    if(window.location == path+'notas/registrarNotasNew_' || window.location == path+'notas/registrarNotas2New_'){
        let contra = prompt("Introduce la clave","");
    
        if (contra == "M@p@ch3"){
            //location.href = ;
            alert("Bienvenido a parametros del sistema");
        }else{
            alert("Buen intento, clave incorrecta");
            location.href = path+'main';
        }
    }  
}

function cargarCarreras(codAlumno){
    $.ajax({
        url: path + "notas/registrarNotas2New_",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "seleccionarAlumno"
        },
        success: function (data) {            
            limpiarCampos(1);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                            
                $("#codigo").val(codAlumno);
                if (datos.matriculas != "vacio") {
                    var matriculas = datos.matriculas;
                    $("#carrera").append("<option value=\"\" selected disabled hidden></option>");
                    for (i = 0; i < matriculas.length; i++) {
                        var matricula = matriculas[i];
                        $("#carrera").append(`<option value="${matricula.cod_local}-${matricula.tipo_espe}-${matricula.cod_espe}-${matricula.malla_curricular}-${matricula.cod_localinst.trim()}-${matricula.cod_turno.trim()}-${matricula.estado_cur.trim()}">${matricula.cod_local} --- ${matricula.tipo_espe_des} --- ${matricula.especialidad_des} --- ${matricula.malla_curricular_abr}</option>`);
                    }
                } else {
                    mostrarMensaje("error", "ERROR", "El alumno no tiene matriculas registradas");
                }

                $(".panel_notas").css("display", "none");

            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });

    $("#modalAlumnosMatriculados").modal("hide");

}

const CICLOS = { "01": "CICLO I", "02": "CICLO II", "03": "CICLO III", "04": "CICLO IV", "05": "CICLO V", "06": "CICLO VI" };

function cargarPeriodos() {

    var carrera = $("#carrera").val();
    if (carrera !== "") {

        var parametros = carrera.split("-");
        var codLocal = parametros[0];
        var tipoEspe = parametros[1];
        var codEspe = parametros[2];
        var mallaCurricular = parametros[3];
        var codAlumno = $("#alumno").attr("codigo");

        if (parametros.length > 1) {

            $("#cod_local").val(codLocal);
            $("#tipo_espe").val(tipoEspe);
            $("#cod_espe").val(codEspe);
            $("#malla_curricular").val(mallaCurricular);

            $.ajax({
                url: path + "notas/registrarNotas2New_",
                type: "POST",
                data: {
                    codLocal: codLocal,
                    tipoEspe: tipoEspe,
                    codEspe: codEspe,
                    mallaCurricular: mallaCurricular,
                    codAlumno: codAlumno,
                    opcion: "periodos"
                },
                success: function (data) {                    
                    var datos = JSON.parse(data);                    
                    if (datos.respuesta == "success") {

                        if (datos.periodos != "vacio") {

                            var periodos = datos.periodos;
                            $("#periodo").append("<option value=\"\" selected disabled hidden>Seleccione</option>");
                            for (i = 0; i < periodos.length; i++) {
                                var periodo = periodos[i];
                                $("#periodo").append("<option value=\"" + periodo.id_periodo_academico + "\">" + periodo.id_periodo_academico + "</option>");
                            }

                            var ciclos = datos.ciclos;
                            $("#ciclo").append("<option value=\"\" selected disabled hidden>Seleccione</option>");
                            $("#ciclo").append("<option value='0'>TODOS</option>");
                            for (i = 0; i < ciclos.length; i++) {
                                var ciclo = ciclos[i];
                                $("#ciclo").append("<option value=\"" + ciclo.cod_ciclo.trim() + "\">" + CICLOS[ciclo.cod_ciclo.trim()] + "</option>");
                            }

                            var secciones = datos.secciones;                            
                            $("#seccion_").append("<option value=\"\" selected disabled hidden>Seleccione</option>");
                            $("#seccion_").append("<option value='0'>TODOS</option>");                            
                            secciones.forEach( e => {                                
                                $("#seccion_").append("<option value=\"" + e.cod_seccion + "\">" + e.cod_seccion + "</option>");
                            });
                                                            
                            $("#periodos_").html("");
                            $("#periodos_").append("<option value=\"\" selected disabled hidden></option>");
                            for (i = 0; i < periodos.length; i++) {
                                var periodo = periodos[i];
                                $("#periodos_").append("<option value=\"" + periodo.id_periodo_academico.trim() + "\">" + periodo.id_periodo_academico + "</option>");
                            }

                        } else {
                            mostrarMensaje("error", "ERROR", "No existen periodos matriculados para la carrera seleccionada");
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
    }
}

function cargarCursosAplazados() {
    var periodo = $("#periodo").val();
    var carrera = $("#carrera").val();
    var ciclo = $("#ciclo").val();
    var seccion = $("#seccion_").val();

    if (carrera != "" && periodo != "") {
        var tbody = $("#tablaCursosAplazados tbody");
        tbody.find('tr').remove();
        var parametros = carrera.split("-");
        if (parametros.length > 1) {
            var codLocal = parametros[0];
            var tipoEspe = parametros[1];
            var codEspe = parametros[2];
            var mallaCurricular = parametros[3];
            var codAlumno = $("#alumno").attr("codigo");

            //var codCursoRegistrado = 0;

            $.ajax({
                url: path + "notas/registrarNotas2New_",
                type: "POST",
                data: {
                    codLocal: codLocal,
                    tipoEspe: tipoEspe,
                    codEspe: codEspe,
                    mallaCurricular: mallaCurricular,
                    periodo: periodo,
                    codAlumno: codAlumno,
                    ciclo: ciclo,
                    seccion: seccion,
                    opcion: "cursosAplazados"
                },
                success: function (data) {                    
                    var datos = JSON.parse(data);                   
                    if (datos.respuesta == "success") {
                        if (datos.cursos != "vacio") {

                            var cursos = datos.cursos;
                            var selected1 = "";
                            var selected2 = "";

                            for (i = 0; i < cursos.length; i++) {

                                var curso = cursos[i];

                                if (curso.TipoNota == 1) {
                                    selected1 = "selected";
                                } else {
                                    selected1 = "";
                                }
                                if (curso.TipoNota == 2) {
                                    selected2 = "selected";
                                } else {
                                    selected2 = "";
                                }

                                /* if(curso.cod_curso != codCursoRegistrado)
                                 {
 
                                     codCursoRegistrado = curso.cod_curso;
 
                                     var trSeparadorNroVecesCursado = "<tr style=\"background: #cfeefd;color: #286090;\">" +
                                         "   <td class=\"celda-centrada\" colspan=\"18\">"+
                                                 "<label style=\"margin-bottom:unset;\">NRO. DE VEZ CURSADO: "+(parseInt(curso.NroVezCursado) + 1)+"</label><br>"                                                
                                             "</td>" +
                                         "</tr>";
                                     tbody.append(trSeparadorNroVecesCursado);
                                 }*/


                                var tr = "<tr>" +
                                    "    <input type=\"hidden\" name=\"id_CursoAplazadoA[]\" value=\"" + curso.id_CursoAplazado + "\">" +
                                    "    <td class=\"celda-centrada\">" + curso.cod_curso + "</td>" +
                                    "    <td class=\"celda-izquierda\">" + curso.curso_des + "</td>" +
                                    "    <td class=\"celda-centrada\">" + curso.CodCiclo + "</td>" +
                                    "    <td class=\"celda-centrada\">" + curso.cod_seccion + "</td>" +
                                    
                                    "    <td class=\"celda-centrada\">" +
                                    "        <select class=\"selectpicker form-control mipanel-combo\" name=\"tipoNotaA[]\" disabled>" +
                                    "            <option value=\"1\" " + selected1 + ">REG</option>" +
                                    "            <option value=\"2\" " + selected2 + ">CVL</option>" +
                                    "        </select>" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap1A[]\" value=\"" + curso.ap1.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed1A[]\" value=\"" + curso.ed1.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"epA[]\" value=\"" + curso.ep.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac1A[]\" value=\"" + curso.ac1.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr1A[]\" value=\"" + curso.pr1.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap2A[]\" value=\"" + curso.ap2.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed2A[]\" value=\"" + curso.ed2.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"efA[]\" value=\"" + curso.ef.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac2A[]\" value=\"" + curso.ac2.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr2A[]\" value=\"" + curso.pr2.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"prA[]\" value=\"" + curso.pr.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);validarES(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"esA[]\" value=\"" + curso.es.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +
                                    "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pfA[]\" value=\"" + curso.pf.trim() + "\" disabled />" +
                                    "    </td>" +
                                    "    <td class=\"celda-centrada\" >" +

                                    "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"confirmarDesactivacionCursoAplazado(" + curso.id_CursoAplazado + ");\" title=\"Eliminar curso aplazado\"><span class=\"icon-bin\"></span></button>"

                                    + "" +

                                    "<button style=\"margin-left:5px\" class=\"btn boton-tabla boton-verde\" type=\"button\" idcurso=\"" + curso.id_CursoAplazado + "\" curso=\"" + curso.curso_des + "\" codcurso=\"" + curso.cod_curso + "\" onclick=\"modalCambiarPeriodo(this);\" title=\"Cambiar de semestre\" ><span class=\"icon-loop2\"></span></button>"

                                    +

                                    "    </td>" +
                                    "</tr>";
                                tbody.append(tr);
                            }

                            pintarNotasCursosAplazados();

                            $("#btnAgregarCursosAplazados").attr("disabled", false);
                            $("#btnEditarNotasAplazados").attr("disabled", false);
                            $("#btnGrabarNotasAplazados").attr("disabled", true);
                            $("#btnCancelarAplazados").attr("disabled", true);

                        } else {
                            $("#btnAgregarCursosAplazados").attr("disabled", false);
                            $("#btnEditarNotasAplazados").attr("disabled", true);
                            $("#btnGrabarNotasAplazados").attr("disabled", true);
                            $("#btnCancelarAplazados").attr("disabled", true);

                            Notiflix.Notify.Warning("No existen cursos aplazados para el periodo seleccionado")
                            //mostrarMensaje("error", "ERROR", "No existen cursos aplazados para el periodo seleccionado");
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
    }
}

function cargarCursosMatriculados() 
{
    
    var periodo = $("#periodo").val();
    var ciclo = $("#ciclo").val();
    var carrera = $("#carrera").val();
    var seccion = $("#seccion_").val();

    if($("#periodo").val().substring(0,4) <= 2020 || $("#periodo").val().substring(0,7).trim() == '2021-I' || $("#periodo").val().substring(0,7).trim() == '2021-II' || $("#periodo").val().substring(0,7).trim() == '2022-I')
    {//bloqueando edicion de notas del periodo 2021-I para atrás
        $("#btnEditarNotasMatriculados").attr("style","display:none;");
    }else
    {
        $("#btnEditarNotasMatriculados").attr("style","display:inline-block;width: auto; padding-left: 30px; padding-right: 30px;");
    }

    if (carrera != "" && periodo != "")
    {
        var tbody = $("#tablaCursosMatriculados tbody");
        tbody.find('tr').remove();
        var parametros = carrera.split("-");
        if (parametros.length > 1) {
            var codLocal = parametros[0];
            var tipoEspe = parametros[1];
            var codEspe = parametros[2];
            var mallaCurricular = parametros[3];
            var codAlumno = $("#alumno").attr("codigo");

            $.ajax({
                url: path + "notas/registrarNotas2New_",
                type: "POST",
                data: {
                    codLocal: codLocal,
                    tipoEspe: tipoEspe,
                    codEspe: codEspe,
                    mallaCurricular: mallaCurricular,
                    periodo: periodo,
                    ciclo: ciclo,
                    seccion: seccion,
                    codAlumno: codAlumno,
                    opcion: "cursosMatriculados"
                },
                success: function (data) {                    
                    var datos = JSON.parse(data);                    
                    if (datos.respuesta == "success") {
                        if (datos.cursos != "vacio") {
                            var cursos = datos.cursos;
                            var selected1 = "";
                            var selected2 = "";
                            for (i = 0; i < cursos.length; i++) {
                                var curso = cursos[i];

                                if (curso.tipo_nota == 1) {
                                    selected1 = "selected";
                                } else {
                                    selected1 = "";
                                }
                                if (curso.tipo_nota == 2) {
                                    selected2 = "selected";
                                } else {
                                    selected2 = "";
                                }

                                var tr = "<tr>" +
                                        "    <input type=\"hidden\" name=\"id_NotaD[]\" value=\"" + curso.id_Nota + "\">" +
                                        "    <td class=\"celda-centrada\">" + curso.cod_curso + "</td>" +
                                        "    <td class=\"celda-izquierda\">" + curso.curso_des + "</td>" +
                                        "    <td class=\"celda-centrada\">" + curso.cod_ciclo + "</td>" +
                                        
                                        "    <td class=\"celda-centrada\">" +
                                        "        <select class=\"selectpicker form-control mipanel-combo\" name=\"tipoNotaD[]\" disabled>" +
                                        "            <option value=\"1\" " + selected1 + ">REG</option>" +
                                        "            <option value=\"2\" " + selected2 + ">CVL</option>" +
                                        "        </select>" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap1[]\" value=\"" + curso.ap1.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed1[]\" value=\"" + curso.ed1.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ep[]\" value=\"" + curso.ep.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac1[]\" value=\"" + curso.ac1.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr1[]\" value=\"" + curso.pr1.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap2[]\" value=\"" + curso.ap2.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed2[]\" value=\"" + curso.ed2.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ef[]\" value=\"" + curso.ef.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac2[]\" value=\"" + curso.ac2.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr2[]\" value=\"" + curso.pr2.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr[]\" value=\"" + curso.pr.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);validarES(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"es[]\" value=\"" + curso.es.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pf[]\" value=\"" + curso.pf.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "</tr>";
                                tbody.append(tr);
                            }

                            pintarNotasCursosMatriculados();
                            $("#turno").val(curso.turno_des);
                            $("#seccion").val(curso.cod_seccion);
                            $("#sede").val(curso.codigoM + " - " + curso.sede_des);
                            $("#btnEditarNotasMatriculados").attr("disabled", false);
                            $("#btnGrabarNotasMatriculados").attr("disabled", true);
                            $("#btnCancelarMatriculados").attr("disabled", true);

                        } else {
                            $("#btnEditarNotasMatriculados").attr("disabled", true);
                            $("#btnGrabarNotasMatriculados").attr("disabled", true);
                            $("#btnCancelarMatriculados").attr("disabled", true);
                            Notiflix.Notify.Warning("No existen cursos matriculados para el periodo seleccionado")
                            //mostrarMensaje("error", "ERROR", "No existen cursos matriculados para el periodo seleccionado");
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
    }

}

function activarCursosMatriculados(val) {

    var periodo = $("#periodo").val();
    var carrera = $("#carrera").val();
    $("#tablaCursosMatriculados tbody").find("tr").each(function () {
        $(this).find("select").eq(0).attr("disabled", !val);
        var nroCajas = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroCajas; i++) {
            $(this).find("input:text").eq(i).attr("disabled", !val);
        }
    });
    $("#btnEditarNotasMatriculados").attr("disabled", val);
    $("#btnGrabarNotasMatriculados").attr("disabled", !val);
    $("#btnCancelarMatriculados").attr("disabled", !val);
}

function activarCursosAplazados(val) {

    var periodo = $("#periodo").val();
    var carrera = $("#carrera").val();
    $("#tablaCursosAplazados tbody").find("tr").each(function () {
        $(this).find("select").eq(0).attr("disabled", !val);
        var nroCajas = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroCajas; i++) {
            $(this).find("input:text").eq(i).attr("disabled", !val);
        }
    });
    $("#btnEditarNotasAplazados").attr("disabled", val);
    $("#btnGrabarNotasAplazados").attr("disabled", !val);
    $("#btnCancelarAplazados").attr("disabled", !val);
}

function pintarNotasCursosMatriculados() {
    $("#tablaCursosMatriculados tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function validarNota(text) {
    var nota = $(text).val().trim();
    $(text).css({"color": "black"});
    if (isNaN(nota) || nota == "") {
        $(text).val("");
    } else {
        if (isNaN(parseInt(nota))) {
            $(text).val("");
        } else {
            nota = parseInt(nota);
            if (nota < 0 || nota > 20) {
                $(text).val("");
            } else {
                if (nota >= 0 && nota <= 9) {
                    $(text).val("0" + nota.toString());
                } else {
                    $(text).val(nota);
                }
                if (nota < 13) {
                    $(text).css({"color": "red"});
                } else {
                    $(text).css({"color": "blue"});
                }
            }
        }
    }
}

function obtenerPromedio1(elemento)
{

    var ap1 = ($(elemento).parent().parent().find("input:text").eq(0).val()).trim();
    var ed1 = ($(elemento).parent().parent().find("input:text").eq(1).val()).trim();
    var ep = ($(elemento).parent().parent().find("input:text").eq(2).val()).trim();
    var ac1 = ($(elemento).parent().parent().find("input:text").eq(3).val()).trim();
    

    if(ap1  != "" && ed1 != "" && ep != "" && ac1 != "")
    {

        if(ap1 == ""){ ap1 = 0; }
        if(ed1 == ""){ ed1 = 0; }
        if(ep == ""){ ep = 0; }
        if(ac1 == ""){ ac1 = 0; }

        var pr1 = ((parseInt(ap1) + parseInt(ed1) + parseInt(ep) + parseInt(ac1)) / 4).toFixed(0);
        
        $(elemento).parent().parent().find("input:text").eq(4).val(pr1);

        validarNota($(elemento).parent().parent().find("input:text").eq(4));


        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 == ""){ pr1 = 0; }
        if(pr2 == ""){ pr2 = 0; }


        var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(10).val(pr);
        validarNota($(elemento).parent().parent().find("input:text").eq(10));

        //obteniendo promedio final
        obtenerPromedioFinal(elemento);

    }

}

function obtenerPromedio2(elemento)
{

    var ap2 = ($(elemento).parent().parent().find("input:text").eq(5).val()).trim();
    var ed2 = ($(elemento).parent().parent().find("input:text").eq(6).val()).trim();
    var ef = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();
    var ac2 = ($(elemento).parent().parent().find("input:text").eq(8).val()).trim();
    

    //console.log(ap2 + ' ' + ed2 + ' ' + ef + ' '+ ac2);

    if(ap2  != "" && ed2 != "" && ef != "" && ac2 != "")
    {
        if(ap2 == ""){ ap2 = 0; }
        if(ed2 == ""){ ed2 = 0; }
        if(ef == ""){ ef = 0; }
        if(ac2 == ""){ ac2 = 0; }

        var pr2 = ((parseInt(ap2) + parseInt(ed2) + parseInt(ef) + parseInt(ac2)) / 4).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(9).val(pr2);

        validarNota($(elemento).parent().parent().find("input:text").eq(9));


        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 == ""){ pr1 = 0; }
        if(pr2 == ""){ pr2 = 0; }


        var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(10).val(pr);
        validarNota($(elemento).parent().parent().find("input:text").eq(10));

        //obteniendo promedio final
        obtenerPromedioFinal(elemento);

    }      
}

function obtenerPromedioFinal(elemento)
{

    //obteniendo promedio final
    var pr = ($(elemento).parent().parent().find("input:text").eq(10).val()).trim();
    var es = ($(elemento).parent().parent().find("input:text").eq(11).val()).trim();

    if(pr == ""){ pr = 0; }
    if(es == ""){ es = 0; }

    if(parseInt(pr) > parseInt(es))
    {

        $(elemento).parent().parent().find("input:text").eq(12).val(pr);
        
    }else
    {

        $(elemento).parent().parent().find("input:text").eq(12).val(es);

    }

    validarNota($(elemento).parent().parent().find("input:text").eq(12));
}

function validarES(elemento)
{
    
    var pr = ($(elemento).parent().parent().find("input:text").eq(10).val()).trim();
    var es = ($(elemento).parent().parent().find("input:text").eq(11).val()).trim();

    if(pr != "" && es != "")
    {

        obtenerPromedioFinal(elemento);

    }

}

function limpiarCampos(op) {
    switch (op) {
        case 1:            
            $("#codAlumno").val("");
            $("#nombreAlumno").val("");
            $("#carrera").find('option').remove();
            break;
        case 2:                        
            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#malla_curricular").val("");
            $("#periodo").find('option').remove();
            $("#ciclo").find('option').remove();
            $("#seccion_").find('option').remove();
            break;
        case 3:            
            $("#turno").val("");
            $("#seccion").val("");
            $("#sede").val("");
            $("#tablaCursosMatriculados tbody").find('tr').remove();
            $("#tablaCursos tbody").find('tr').remove();
            break;
        case 4:            
            $("#turno").val("");
            $("#seccion").val("");
            $("#sede").val("");
            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#malla_curricular").val("");
            $("#periodo").find('option').remove();
            $("#carrera").find('option').remove();
            $("#ciclo").find('option').remove();
            $("#seccion_").find('option').remove();
            $(".panel_notas").css("display", "none");
            break;
    }
}

$("#btnAgregarCursoAplazado").click(function () {

    var carrera = $("#carrera").val();

    var idNotaCursoAplazado = $("#curso_aplazado").val();//select curso
    var cicloAplazado = $("#ciclo_aplazado").val();
    var periodoAplazado = $("#periodo_aplazado").val();    
    var seccionAplazado = $("#seccion_aplazado").val();
    var parametros = carrera.split("-");         
    var localinst = $("#sedeAplazado").val();
    //var turno = parametros[5];
    var turno = $("#turnoCursoApla").val();
    var estado_cur = parametros[6];

    if (idNotaCursoAplazado !== null && idNotaCursoAplazado !== "" && seccionAplazado !== null && seccionAplazado !== "" ){
        
        $.ajax({
            url: path + "notas/registrarNotas2New_",
            type: "POST",
            dataType: "JSON",
            data: {
                idNotaCursoAplazado: idNotaCursoAplazado,
                cicloAplazado: cicloAplazado,
                periodoAplazado: periodoAplazado,
                localinst: localinst,
                seccion: seccionAplazado,
                turno: turno,
                estado_cur: estado_cur,
                opcion: "grabarCursoAplazado"            
            },
            success: function (datos) {                            
                if (datos.respuesta === "success") {

                $("#modalAgregarCursoAplazado").modal("hide");
                mostrarMensaje("exito", "EXITO", "Se ha agregado exitosamente el curso aplazado");
                cargarCursosAplazados();

                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    }else{
        Notiflix.Notify.Warning('El campo curso ó sección no pueden estar vacías',{timeout:5000});
    }
});

$("#formActualizarSemestre").submit(function(e){
    
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"actualizarSemestre"});
  
    $.ajax({
        url: path + "notas/registrarNotas2New_",
        dataType: "JSON", 
        type: "POST",
        data: data,
        beforeSend: function(){
        },
        complete : function(){
        },
        success: function (response) {
            
            if (response.respuesta == "success") {
                
                Notiflix.Notify.Success('EL SEMESTRE SE ACTUALIZO CON ÉXITO.' , {
                    timeout : 3500
                });

                cargarCursosMatriculados();
                cargarCursosAplazados();

                $("#modalCambiarSemestreCursosAplazados").modal("hide");
                
            } else {
               
                var errores = "";
                for (i = 0; i < response.errores.length; i++) {
                    errores += response.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);

            }
        }
    });

})

function modalCambiarPeriodo( element ){

    const idcurso = $(element).attr("idcurso");
    const curso = $(element).attr("curso");
    const codcurso = $(element).attr("codcurso");

    $("#idcursoaplazado_").val(idcurso);
    $("#codcurso_").val(codcurso);
    $("#curso_").val(curso);

    $("#modalCambiarSemestreCursosAplazados").modal({backdrop: 'static', keyboard: false});

}

function pintarNotasCursosAplazados() {
    $("#tablaCursosAplazados tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function confirmarDesactivacionCursoAplazado(idCursoAplazado) {

    mostrarMensaje("confirmacion", "CONFIRMAR", "¿Seguro que desea eliminar el curso aplazado?");
    $("#opcion").val(3);
    $("#idCursoAplazado").val(idCursoAplazado);//aplazado

}

function desactivarCursoAplazado(idCursoAplazado) {

    $.ajax({
        url: path + "notas/registrarNotas2New_",
        type: "POST",
        data: {
            idCursoAplazado: idCursoAplazado,
            opcion: "desactivarCursoAplazado"
        },
        beforeSend: function()
        {

        },
        success: function (data) {
            //console.log(data);
            
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") 
            {

                //mostrarMensaje("exito", "EXITO", "Se ha desactivado exitosamente el curso aplazado seleccionado.");

                cargarCursosAplazados();
                
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