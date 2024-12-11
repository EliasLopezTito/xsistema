$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });
    clave()

    $("#codAlumno").attr("disabled", true);
    $("#nombreAlumno").attr("disabled", true);
    $("#turno").attr("disabled", true);
    $("#seccion").attr("disabled", true);
    $("#sede").attr("disabled", true);

    $(".panel_notas").css("display", "none");


    $("#carrera").change(function () {
        limpiarCampos(2);
        cargarPeriodos();

    });

    $("#periodo").change(function () {
        limpiarCampos(3);

        $(".panel_notas").css("display", "block");

        cargarCursosMatriculados();

        cargarCursosAplazados();
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
            $("#optionCheck").hide();
            $(".optionCheckBody").hide();
        
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
        console.log("form", form);
        $.ajax({
            url: path + "notas/registrarNotasNew_",
            type: "POST",
            data: $.param(form),
            beforeSend: function(){
                Notiflix.Loading.Hourglass('Guardando informacion...');
            },
            complete : function(){
                $("#NotiflixLoadingWrap").trigger("click");
            },
            success: function (data) {
                //console.log(data);
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    activarCursosMatriculados(false);
                    //mostrarMensaje("exito", "Notas Guardadas", "Las notas fueron guardadas correctamente");
                    mostrarMensaje("confirmacion", "CONFIRMAR", "Las notas fueron guardadas correctamente");
                     $("#opcion").val(1);
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
            url: path + "notas/registrarNotasNew_",
            type: "POST",
            data: $.param(form),
            success: function (data) {
                //console.log(data);
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
        $("#modalAgregarCursoAplazado").modal({backdrop: 'static', keyboard: false});

        var periodo = $("#periodo").val();
        var carrera = $("#carrera").val();

        if (carrera != "" && periodo != "") {

            var parametros = carrera.split("-");
            if (parametros.length > 1) {
                var codLocal = parametros[0];
                var tipoEspe = parametros[1];
                var codEspe = parametros[2];
                var mallaCurricular = parametros[3];
                var codAlumno = $("#codAlumno").val();

                $.ajax({
                    url: path + "notas/registrarNotasNew_",
                    type: "POST",
                    data: {
                        codLocal: codLocal,
                        tipoEspe: tipoEspe,
                        codEspe: codEspe,
                        mallaCurricular: mallaCurricular,
                        periodo: periodo,
                        codAlumno: codAlumno,
                        opcion: "cursosMatriculados"
                    },
                    success: function (data) {
                        //console.log(data);
                        var datos = JSON.parse(data);
                        if (datos.respuesta == "success") {
                            if (datos.cursos != "vacio") {
                                var cursos = datos.cursos;

                                for (i = 0; i < cursos.length; i++) {

                                    var curso = cursos[i];

                                    $("#curso_aplazado").append("<option value=\"" + curso.id_Nota + "\">" + curso.curso_des + "</option>");

                                }

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
    });
});

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

function buscarAlumnoMatriculado() {
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    if (codigoBus == "" && apellidosNombresBus == "") {
        $("#errorAlumnoBus").html("Debe ingresar el código o apellidos y nombres a buscar");
        $("#errorAlumnoBus").css("display", "block");
        return false;
    } else {
        $("#errorAlumnoBus").html("");
        $("#errorAlumnoBus").css("display", "none");
    }

    $.ajax({
        url: path + "notas/registrarNotasNew_",
        type: "POST",
        data: {
            codigoBus: codigoBus,
            apellidosNombresBus: apellidosNombresBus,
            opcion: "buscarAlumno"
        },
        success: function (data) {
            
            var tbody = $("#tablaModalAlumno tbody");
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.alumnos != "vacio") {
                    var alumnos = datos.alumnos;
                    for (i = 0; i < alumnos.length; i++) {
                        var alumno = alumnos[i];
                        var tr = "<tr ondblclick=\"seleccionarAlumno(this);\">" +
                                "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                                "<td>" + alumno.apellidos_nombres + "</td>" +
                                "</tr>";
                        tbody.append(tr);
                    }
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

function seleccionarAlumno(tr) {
    var codAlumno = $(tr).find("td").eq(0).html();
    var apellidosNombres = $(tr).find("td").eq(1).html();

    $.ajax({
        url: path + "notas/registrarNotasNew_",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "seleccionarAlumno"
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
        },
        success: function (data) {

            $("#NotiflixLoadingWrap").trigger("click");
            //console.log(data);
            limpiarCampos(1);

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#codAlumno").val(codAlumno);
                $("#nombreAlumno").val(datos.matriculas[0].apellidos_nombres);
                $("#codigo").val(codAlumno);
                if (datos.matriculas != "vacio") {
                    var matriculas = datos.matriculas;
                    $("#carrera").append("<option value=\"\" selected disabled hidden></option>");
                    for (i = 0; i < matriculas.length; i++) {
                        var matricula = matriculas[i];
                        $("#carrera").append("<option value=\"" + matricula.cod_local + "-" + matricula.tipo_espe + "-" + matricula.cod_espe + "-" + matricula.malla_curricular + "\">" + matricula.cod_local + " --- " + matricula.tipo_espe_des + " --- " + matricula.especialidad_des + " --- " + matricula.malla_curricular_abr + "</option>");
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

function cargarPeriodos() {
    var carrera = $("#carrera").val();
    if (carrera !== "") {
        var parametros = carrera.split("-");
        var codLocal = parametros[0];
        var tipoEspe = parametros[1];
        var codEspe = parametros[2];
        var mallaCurricular = parametros[3];
        var codAlumno = $("#codAlumno").val();

        if (parametros.length > 1) {
            $("#cod_local").val(codLocal);
            $("#tipo_espe").val(tipoEspe);
            $("#cod_espe").val(codEspe);
            $("#malla_curricular").val(mallaCurricular);

            $.ajax({
                url: path + "notas/registrarNotasNew_",
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
                    //console.log(data);
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        if (datos.periodos != "vacio") {
                            var periodos = datos.periodos;
                            $("#periodo").append("<option value=\"\" selected disabled hidden></option>");
                            for (i = 0; i < periodos.length; i++) {
                                var periodo = periodos[i];
                                $("#periodo").append("<option value=\"" + periodo.id_periodo_academico + "\">" + periodo.id_periodo_academico + "</option>");
                            }

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

async function bloquearEdicionNotas(){

    let response = await fetch(`${path}notas/registrarNotasNew_`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "opcion": "validarSemestresActivos" })
    });
    response = await response.json();  

    let bloqueo = false;
    response.data.forEach( el => {

        if ($("#periodo").val().trim() == el.Semestre.trim() && el.Activo != 1 ){
            bloqueo = true;            
        }

    });

    if(bloqueo){
        $("#btnEditarNotasMatriculados").attr("style", "display:none;");            
    }else{
        $("#btnEditarNotasMatriculados").attr("style", "display:inline-block;width: auto; padding-left: 30px; padding-right: 30px;");
    }

}

function cargarCursosMatriculados() 
{
    
    var periodo = $("#periodo").val();
    var carrera = $("#carrera").val();

    bloquearEdicionNotas(); 
    
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
            var codAlumno = $("#codAlumno").val();

            $.ajax({
                url: path + "notas/registrarNotasNew_",
                type: "POST",
                data: {
                    codLocal: codLocal,
                    tipoEspe: tipoEspe,
                    codEspe: codEspe,
                    mallaCurricular: mallaCurricular,
                    periodo: periodo,
                    codAlumno: codAlumno,
                    opcion: "cursosMatriculados"
                },
                beforeSend: function(){
                Notiflix.Loading.Hourglass('Guardando informacion...');
                },
                complete : function(){
                    $("#NotiflixLoadingWrap").trigger("click");
                },
                success: function (data) {
                   
                    var datos = JSON.parse(data);
                    console.log(datos);
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
                                        "    <input type=\"hidden\" id=\"" + curso.id_Nota +"\" name=\"vacio[]\" value=\"" + curso.id_Nota + "\">" +
                                        "    <td class=\"celda-centrada\">" + curso.cod_curso + "</td>" +
                                        "    <td class=\"celda-izquierda\">" + curso.curso_des + "</td>" +
                                        "    <td class=\"celda-centrada\">" + curso.creditos + "</td>" +
                                        "    <td class=\"celda-centrada\">" + curso.cod_seccion + " / " + curso.cod_ciclo +"</td>" +                                        
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
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this); regularizarPromedioFinal(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"es[]\" value=\"" + curso.es.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pf[]\" value=\"" + curso.pf.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" style=\"text-align: center; padding-left: 0px; padding-right: 0px; color : black\" name=\"obs[]\" value=\"" + curso.obs.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada optionCheckBody\" style=\"display: none;\"> <input type=\"hidden\" value=\""+ curso.id_Nota +"\"><input style=\"cursor:pointer\" name=\"selectCheckbox[]\" type=\"checkbox\" class=\"selectCheckbox\"></input> </td>" +    
                                        "    <td class=\"celda-centrada\">" + curso.usuario.trim() +"</td>" +    
                                        "    <td class=\"celda-centrada\">" + curso.fecha_registro.trim() +"</td>" + 
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

    $("#optionCheck").show(); 
    $(".optionCheckBody").show();

    $("#btnEditarNotasMatriculados").attr("disabled", val);
    $("#btnGrabarNotasMatriculados").attr("disabled", !val);
    $("#btnCancelarMatriculados").attr("disabled", !val);
}

$(document).on("change",".selectCheckbox",function(){ 
    
    const codigo = $(this).prev("input").val();
    console.log("ENTRA", codigo);
    if($(this).is(":checked")){
        $("#tablaCursosMatriculados tbody").find("tr").each(function () {

            val = $(this).find("input:hidden").eq(0).val();
            if(val == codigo){
                $(this).find("select").eq(0).attr("disabled", !val);
                var nroCajas = $(this).find("input:text").length;
                var i = 0;
                for (i = 0; i < nroCajas; i++) {
                    $(this).find("input:text").eq(i).attr("disabled", !val);
                }
            }
            
        });
        $('#'+codigo).attr('name', 'id_NotaD[]');
        $(this).parent().parent("tr").addClass("success");
    }else{
         $("#tablaCursosMatriculados tbody").find("tr").each(function () {

            val = $(this).find("input:hidden").eq(0).val();
            if(val == codigo){
                $(this).find("select").eq(0).attr("disabled", val);
                var nroCajas = $(this).find("input:text").length;
                var i = 0;
                for (i = 0; i < nroCajas; i++) {
                    $(this).find("input:text").eq(i).attr("disabled", val);
                }
            }
            
        });
        $('#'+codigo).attr('name', 'vacio[]'); 
        $(this).parent().parent("tr").removeClass("success");
    }  
})

// $(".selectCheckbox").on( "change", function() {
//     console.log("emntra");
//     if( $(this).is(':checked') ){
//         // Hacer algo si el checkbox ha sido seleccionado
//         alert("El checkbox con valor " + $(this).val() + " ha sido seleccionado");
//     } else {
//         // Hacer algo si el checkbox ha sido deseleccionado
//         alert("El checkbox con valor " + $(this).val() + " ha sido deseleccionado");
//     }
// });

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
            if( i != 13 ){
                validarNota($(this).find("input:text").eq(i));
            }
        }
    });

}

function validarNota(text) {
    var nota = $(text).val().trim();
    $(text).css({"color": "black"});
    if(nota == '00' || nota == '00')
    {
        console.log("rataponsoña");
        
        $(text).css({"color": "red"});
        $(text).val("00");

    }else if (isNaN(nota) || nota == "") 
    {
        console.log("sin valir");
        $(text).val("");
    }else {
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
    const ep_ = (($(elemento).parent().parent().find("input:text").eq(3).val()).trim());
    const ef_ = (($(elemento).parent().parent().find("input:text").eq(8).val()).trim());

    if(ap1  != "" && ed1 != "" && ep != "" && ac1 != "")
    {

        if (ap1 == "" || ap1 == '00' || ap1 == '00'){ ap1 = 0; }
        if (ed1 == "" || ed1 == '00' || ed1 == '00'){ ed1 = 0; }
        if (ep == "" || ep == '00' || ep == '00'){ ep = 0; }
        if (ac1 == "" || ac1 == '00' || ac1 == '00'){ ac1 = 0; }

        var pr1 = ((parseInt(ap1) + parseInt(ed1) + parseInt(ep) + parseInt(ac1)) / 4).toFixed(0);
        
        $(elemento).parent().parent().find("input:text").eq(4).val(pr1);

        validarNota($(elemento).parent().parent().find("input:text").eq(4));

        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 != "" && pr2 != "" && pr1 != "00" && pr2 != "00" && pr1 != "00" && pr2 != "00")
        { 
            var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);
            $(elemento).parent().parent().find("input:text").eq(10).val(pr);
            validarNota($(elemento).parent().parent().find("input:text").eq(10));
        }else
        {
            $(elemento).parent().parent().find("input:text").eq(10).val("");
        }      

        if((ep_ === "00" || ep_ === "00" ) && (ef_ === "00" || ef_ === "00" ) ){

            $(elemento).parent().parent().find("input:text").eq(10).val("00").css({"color": "red"});
            
        }

    }else{

        $(elemento).parent().parent().find("input:text").eq(10).val("");

        if((ep_ === "00" || ep_ === "00" ) && (ef_ === "00" || ef_ === "00" ) ){ 

            $(elemento).parent().parent().find("input:text").eq(10).val("00").css({"color": "red"});
            
        }

    }

    obtenerPromedioFinal(elemento);

}

function obtenerPromedio2(elemento)
{

    var ap2 = ($(elemento).parent().parent().find("input:text").eq(5).val()).trim();
    var ed2 = ($(elemento).parent().parent().find("input:text").eq(6).val()).trim();
    var ef = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();
    var ac2 = ($(elemento).parent().parent().find("input:text").eq(8).val()).trim();
    const ep_ = (($(elemento).parent().parent().find("input:text").eq(3).val()).trim());
    const ef_ = (($(elemento).parent().parent().find("input:text").eq(8).val()).trim());
    //console.log(ap2 + ' ' + ed2 + ' ' + ef + ' '+ ac2);

    if(ap2  != "" && ed2 != "" && ef != "" && ac2 != "")
    {   

        if (ap2 == "" || ap2 == '00' || ap2 == '00'){ ap2 = 0; }
        if (ed2 == "" || ed2 == '00' || ed2 == '00'){ ed2 = 0; }
        if (ef == "" || ef == '00' || ef == '00'){ ef = 0; }
        if (ac2 == "" || ac2 == '00' || ac2 == '00'){ ac2 = 0; }

        var pr2 = ((parseInt(ap2) + parseInt(ed2) + parseInt(ef) + parseInt(ac2)) / 4).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(9).val(pr2);

        validarNota($(elemento).parent().parent().find("input:text").eq(9));

        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 != "" && pr2 != "" && pr1 != "00" && pr2 != "00" && pr1 != "00" && pr2 != "00")
        { 
            var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);
            $(elemento).parent().parent().find("input:text").eq(10).val(pr);
            validarNota($(elemento).parent().parent().find("input:text").eq(10));
        }else
        {
            $(elemento).parent().parent().find("input:text").eq(10).val("");
        }

        if((ep_ === "00" || ep_ === "00" ) && (ef_ === "00" || ef_ === "00" ) ){ 
            $(elemento).parent().parent().find("input:text").eq(10).val("00").css({"color": "red"});
        } 


    } else {

        $(elemento).parent().parent().find("input:text").eq(10).val("");

        if((ep_ === "00" || ep_ === "00" ) && (ef_ === "00" || ef_ === "00" ) ){ 
            $(elemento).parent().parent().find("input:text").eq(10).val("00").css({"color": "red"});       
        } 

    }     

    obtenerPromedioFinal(elemento);

}

function regularizarPromedioFinal(elemento){
    //obteniendo promedio general
    var ap1 = ($(elemento).parent().parent().find("input:text").eq(0).val()).trim();
    var ed1 = ($(elemento).parent().parent().find("input:text").eq(1).val()).trim();
    var ep = ($(elemento).parent().parent().find("input:text").eq(2).val()).trim();
    var ep_ = (($(elemento).parent().parent().find("input:text").eq(3).val()).trim());
    var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();

    var ap2 = ($(elemento).parent().parent().find("input:text").eq(5).val()).trim();
    var ed2 = ($(elemento).parent().parent().find("input:text").eq(6).val()).trim();
    var ef = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();
    var ef_ = (($(elemento).parent().parent().find("input:text").eq(8).val()).trim());
    var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

    var er = ($(elemento).parent().parent().find("input:text").eq(11).val()).trim();

    if (pr1 != "" && pr2 != "" && pr1 != "00" && pr2 != "00") {
        new00 = ((parseInt(er) * 2.5) / 3).toFixed(0);
        console.log("new00",new00);
        if(ep_ === "00" || ep_ === "0"){
            ep_ = new00;
            var pr1 = ((parseInt(ap1) + parseInt(ed1) + parseInt(ep) + parseInt(ep_)) / 4).toFixed(0);
            console.log("pr1", pr1);

            if (pr1 != "" && pr2 != "" && pr1 != "00" && pr2 != "00" && pr1 != "00" && pr2 != "00") {
                var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);
                $(elemento).parent().parent().find("input:text").eq(10).val(pr);
                validarNota($(elemento).parent().parent().find("input:text").eq(10));
            } else {
                $(elemento).parent().parent().find("input:text").eq(10).val("");
            }

            if ((ep_ === "00" || ep_ === "0") && (ef_ === "00" || ef_ === "0")) {
                $(elemento).parent().parent().find("input:text").eq(10).val("00").css({ "color": "red" });
            }


        } else if (ef_ === "00" || ef_ === "0") {
            ef_ = new00;
            var pr2 = ((parseInt(ap2) + parseInt(ed2) + parseInt(ef) + parseInt(ef_)) / 4).toFixed(0);

            if (pr1 != "" && pr2 != "" && pr1 != "00" && pr2 != "00" && pr1 != "0" && pr2 != "0") {
                var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);
                $(elemento).parent().parent().find("input:text").eq(10).val(pr);
                validarNota($(elemento).parent().parent().find("input:text").eq(10));
            } else {
                $(elemento).parent().parent().find("input:text").eq(10).val("");
            }

            if ((ep_ === "00" || ep_ === "0") && (ef_ === "00" || ef_ === "0")) {
                $(elemento).parent().parent().find("input:text").eq(10).val("00").css({ "color": "red" });
            }
        }
    }

    obtenerPromedioFinal(elemento);
}

function obtenerPromedioFinal(elemento)
{

    //obteniendo promedio final
    var pr = ($(elemento).parent().parent().find("input:text").eq(10).val()).trim();
    var es = ($(elemento).parent().parent().find("input:text").eq(11).val()).trim();

    if(pr == ""){ pr = 0; }
    if(es == ""){ es = 0; }

    // if(parseInt(pr) > parseInt(es))
    // {

        $(elemento).parent().parent().find("input:text").eq(12).val(pr);
        
    // }else
    // {

    //     $(elemento).parent().parent().find("input:text").eq(12).val(es);

    // }

    validarNota($(elemento).parent().parent().find("input:text").eq(12));
}

function limpiarCampos(op) {
    switch (op) {
        case 1:
            $("#codAlumno").val("");
            $("#nombreAlumno").val("");
            $("#carrera").find('option').remove();
        case 2:
            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#malla_curricular").val("");
            $("#periodo").find('option').remove();
        case 3:
            $("#turno").val("");
            $("#seccion").val("");
            $("#sede").val("");
            $("#tablaCursosMatriculados tbody").find('tr').remove();
            $("#tablaCursos tbody").find('tr').remove();
            break;
    }
}


$("#btnAgregarCursoAplazado").click(function () {

    var idNotaCursoAplazado = $("#curso_aplazado").val();
    var cicloAplazado = $("#ciclo_aplazado").val();
    var periodoAplazado = $("#periodo_aplazado").val();


    $.ajax({
        url: path + "notas/registrarNotasNew_",
        type: "POST",
        data: {
            idNotaCursoAplazado: idNotaCursoAplazado,
            cicloAplazado: cicloAplazado,
            periodoAplazado: periodoAplazado,
            opcion: "grabarCursoAplazado"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
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
});

function cargarCursosAplazados() {
    var periodo = $("#periodo").val();
    var carrera = $("#carrera").val();
    
    if (carrera != "" && periodo != "") {
        var tbody = $("#tablaCursosAplazados tbody");
        tbody.find('tr').remove();
        var parametros = carrera.split("-");
        if (parametros.length > 1) {
            var codLocal = parametros[0];
            var tipoEspe = parametros[1];
            var codEspe = parametros[2];
            var mallaCurricular = parametros[3];
            var codAlumno = $("#codAlumno").val();

            //var codCursoRegistrado = 0;

            $.ajax({
                url: path + "notas/registrarNotasNew_",
                type: "POST",
                data: {
                    codLocal: codLocal,
                    tipoEspe: tipoEspe,
                    codEspe: codEspe,
                    mallaCurricular: mallaCurricular,
                    periodo: periodo,
                    codAlumno: codAlumno,
                    opcion: "cursosAplazados"
                },
                success: function (data) {
                    //console.log(data);
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
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);regularizarPromedioFinal(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"esA[]\" value=\"" + curso.es.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +
                                        "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pfA[]\" value=\"" + curso.pf.trim() + "\" disabled />" +
                                        "    </td>" +
                                        "    <td class=\"celda-centrada\" >" +

                                                "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"confirmarDesactivacionCursoAplazado("+curso.id_CursoAplazado+");\" title=\"Eliminar curso aplazado\"><span class=\"icon-bin\"></span></button>" 
                                                                                                
                                                + "" +

                                                "<button style=\"margin-left:5px\" class=\"btn boton-tabla boton-verde\" type=\"button\" idcurso=\""+curso.id_CursoAplazado+"\" curso=\""+curso.curso_des+"\" codcurso=\""+curso.cod_curso+"\" onclick=\"modalCambiarPeriodo(this);\" title=\"Cambiar de semestre\" ><span class=\"icon-loop2\"></span></button>"

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

$("#formActualizarSemestre").submit(function(e){
    
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"actualizarSemestre"});
  
    $.ajax({
        url: path + "notas/registrarNotasNew_",
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
        url: path + "notas/registrarNotasNew_",
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