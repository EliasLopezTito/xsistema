$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });
    
    cargarSedes2();
    cargarInstituciones(true);

    $("#institucion").change(function () {
        borrarResultado();
        cargarTipoEspecialidades(true);
    });

    $("#tipoEspecialidad").change(function () {
        borrarResultado();
        cargarEspecialidades(true);
    });

    $("#especialidad").change(function () {
        borrarResultado();
        cargarMallaCurriculares(true);
    });

    $("#periodo").change(function () {
        borrarResultado();
        cargarTurnos( $(this).val() );
    });

    $("#sede").change(function () {
        borrarResultado();
    });

    $("#mallaCurricular").change(function () {
        borrarResultado();
    });

    $("#turno").change(function () {
        borrarResultado();
    });

    $("#ciclo").change(function () {
        borrarResultado();
    });

    $("#seccion").change(function () {
        borrarResultado();
    });

    $("#btnAgregarAlumnos").attr("disabled", true);
    $("#btnFrmCambiarTurnoSeccion2").attr("disabled", true);
});

function cargarTurnos(periodo){

    $.ajax({
        url: path + "notas/organizarSeccion",
        type: "POST",
        dataType: "JSON",
        data: {
            periodo: periodo,            
            opcion: "cargarTurnos"
        },   
        beforeSend: function(){
            $("#turno").html("");
        },  
        success: function (response) {  

            if ( response.respuesta === "success" ) {

                response.data.forEach( (e,key) => {
                    $("#turno").append(`
                        <option value="${e.Cod_turno.trim()}">${e.Cod_turno.trim()} - ${e.Descripcion.trim()}</option>
                    `)
                });

            } else {
                


            }

        }
    });

}

$("#btnMostrarMatriculados").click(function () {    
    cargarAlumnosMatriculados();
    $("#btnAgregarAlumnos").attr("disabled", false);
});

$("#btnAgregarAlumnos").click(function () {
    $("#codigoBus").val("");
    $("#apellidosNombresBus").val("");
    $("#tablaModalAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#modalAlumnosMatriculados").modal({backdrop: 'static', keyboard: false});
});

function borrarResultado() {
    $("#btnAgregarAlumnos").attr("disabled", true);
    $("#btnFrmCambiarTurnoSeccion2").attr("disabled", true);
    var tbody = $("#tablaMatriculados tbody");
    tbody.find('tr').remove();
    $("#nroAlumnos").html("-");
    $("#restantes").html("-");
    $("#seleccionados").html("-");
    $("#alum-seleccionados").val("[]");
    $("#check-todo").prop("checked", false);
}

function buscarAlumnoMatriculado() {
    var sede = $("#sede").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    if (codigoBus == "" && apellidosNombresBus == "") {
        $("#errorAlumnoBus").html("Debe ingresar el codigo o apellidos y nombres a buscar");
        $("#errorAlumnoBus").css("display", "block");
        return false;
    } else {
        $("#errorAlumnoBus").html("");
        $("#errorAlumnoBus").css("display", "none");
    }

    $.ajax({
        url: path + "notas/organizarSeccion",
        type: "POST",
        data: {
            sede: sede,
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            mallaCurricular: mallaCurricular,
            codigoBus: codigoBus,
            apellidosNombresBus: apellidosNombresBus,
            opcion: "buscarAlumnoMatriculado"
        },
        success: function (data) {
            //console.log(data);
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
    var periodo = $("#periodo").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var ciclo = $("#ciclo").val();
    var sede = $("#sede").val();
    var turno = $("#turno").val();
    var seccion = $("#seccion").val();
    var estadoMatricula = "R";

    // bloquearAgregarNotasSeccion()
    // return

    let respuesta = bloquearAgregarNotasSeccion(); //tienes una promesa
    respuesta.then(response => {
        console.log(response);
        if(response){
            console.log("SE BLOQUEA")
            Notiflix.Notify.Warning("El semestre " + periodo +" no se encuentra activo")
        }else{
            console.log("NO SE BLOQUEA");
            $.ajax({
                url: path + "notas/organizarSeccion",
                type: "POST",
                data: {
                    periodo: periodo,
                    institucion: institucion,
                    tipoEspecialidad: tipoEspecialidad,
                    especialidad: especialidad,
                    mallaCurricular: mallaCurricular,
                    ciclo: ciclo,
                    codAlumno: codAlumno,
                    sede: sede,
                    turno: turno,
                    seccion: seccion,
                    estadoMatricula: estadoMatricula,
                    opcion: "agregarAlumnoSeccion"
                },
                success: function (data) {
                    console.log(data);
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        cargarAlumnosMatriculados();
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
    })

}

async function bloquearAgregarNotasSeccion() {

    let response = await fetch(`${path}notas/registrarNotasNew_`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "opcion": "validarSemestresActivos" })
    });
    response = await response.json();

    let bloqueo = false;
    response.data.forEach(el => {

        if ($("#periodo").val().trim() == el.Semestre.trim() && el.AlumSec == 0) {
            bloqueo = true;
        }

    });

    if (bloqueo) {
        return true;
    } else {
        return false;
    }

}

function retirarAlumno(btn) {
    $("#nroOperacion").val(1);
    $("#codAlumno").val($(btn).parent().parent().find("td").eq(1).html());
    $("#nombreAlumno").val($(btn).parent().parent().find("td").eq(2).html());
    var mensaje = "Seguro de retirar al alumno(a): " + $("#nombreAlumno").val() + "<br>De la seccion: " + $("#seccion").val() + "<br>En el periodo: " + $("#periodo").val() + "<br>Al retirar al alumno(a) de la seccion se eliminaran las notas registradas en el periodo: " + $("#periodo").val();
    mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}

function cambiarTurnoSeccion(btn) {
    $("#nroOperacion").val(2);
    $("#codAlumno").val($(btn).parent().parent().find("td").eq(1).html());
    $("#nombreAlumno").val($(btn).parent().parent().find("td").eq(2).html());
    $("#apellidos_nombres_A").html($(btn).parent().parent().find("td").eq(2).html());
    $("#periodo_A").html($("#periodo").val());

    $("#periodox").val($("#periodo").val())
    
    $("#turno_A").html($('#turno option:selected').html());
    $("#seccion_A").html($('#seccion option:selected').html());
    $("#sede_A").html($('#sede option:selected').html() );

    $("#sede_N").val( $('#sede option:selected').val() );
    $("#turno_N option:selected").prop("selected", false);
    $("#seccion_N option:selected").prop("selected", false);

    $("#turno_N option[value='" + $("#turno").val() + "']").attr("selected", true);
    //$("#seccion_N option[value='" + $("#seccion").val() + "']").attr("selected", true);
    $("#seccion_N").val($("#seccion").val());
    $("#btnCambiarTurnoSeccion").attr("disabled", true);
    $("#modalCambioTurnoSeccion").modal({backdrop: 'static', keyboard: false});
}

$("#turno_N").change(function () {
    if ($("#turno_N").val() != $("#turno").val() || $("#seccion_N").val() != $("#seccion").val() || $("#sede_N").val() != $("#sede").val() || $("#periodox").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion").attr("disabled", true);
    }
});

$("#seccion_N").change(function () {
    if ($("#turno_N").val() != $("#turno").val() || $("#seccion_N").val() != $("#seccion").val() || $("#sede_N").val() != $("#sede").val() || $("#periodox").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion").attr("disabled", true);
    }
});

$("#sede_N").change(function () {
    if ($("#turno_N").val() != $("#turno").val() || $("#seccion_N").val() != $("#seccion").val() || $("#sede_N").val() != $("#sede").val() || $("#periodox").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion").attr("disabled", true);
    }
});

$("#periodox").change(function () {
    if ($("#turno_N").val() != $("#turno").val() || $("#seccion_N").val() != $("#seccion").val() || $("#sede_N").val() != $("#sede").val() || $("#periodox").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion").attr("disabled", true);
    }
});

$("#btnFrmCambiarTurnoSeccion2").click(function () {
    $("#periodo_A2").html($("#periodo").val());

    $("#periodox2").val($("#periodo").val())
    
    $("#sede_A2").html($('#sede option:selected').html());
    $("#sede2").val( $('#sede option:selected').val() );    

    var programa = $('#institucion option:selected').html() + "<br />";
    programa += $('#tipoEspecialidad option:selected').html() + "<br />";
    programa += $('#especialidad option:selected').html() + "<br />";
    programa += $('#mallaCurricular option:selected').html();
    $("#programa_A2").html(programa);
    $("#ciclo_A2").html($('#ciclo option:selected').html());
    $("#turno_A2").html($('#turno option:selected').html());
    $("#seccion_A2").html($('#seccion option:selected').html());

    $("#turno_N2 option").each(function () {
        $(this).removeAttr("selected");
    });

    $("#turno_N2 option[value='" + $("#turno").val() + "']").attr("selected", true);
    //$("#seccion_N2 option[value='" + $("#seccion").val() + "']").attr("selected", true);
    $("#seccion_N2").val($("#seccion").val());
    $("#btnCambiarTurnoSeccion2").attr("disabled", true);
    $("#modalCambioTurnoSeccion2").modal({backdrop: 'static', keyboard: false});
});

$("#turno_N2").change(function () {
    if ($("#turno_N2").val() != $("#turno").val() || $("#seccion_N2").val() != $("#seccion").val() || $("#sede2").val() != $("#sede").val() || $("#periodox2").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion2").attr("disabled", false);
    } else {
        $("#btperiodoxnCambiarTurnoSeccion2").attr("disabled", true);
    }
});

$("#seccion_N2").change(function () {
    if ($("#turno_N2").val() != $("#turno").val() || $("#seccion_N2").val() != $("#seccion").val() || $("#sede2").val() != $("#sede").val() || $("#periodox2").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion2").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion2").attr("disabled", true);
    }
});

$("#sede2").change(function () {
    if ($("#turno_N2").val() != $("#turno").val() || $("#seccion_N2").val() != $("#seccion").val() || $("#sede2").val() != $("#sede").val() || $("#periodox2").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion2").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion2").attr("disabled", true);
    }
});

$("#periodox2").change(function () {
    if ($("#turno_N2").val() != $("#turno").val() || $("#seccion_N2").val() != $("#seccion").val() || $("#sede2").val() != $("#sede").val() || $("#periodox2").val() != $("#periodo").val()) {
        $("#btnCambiarTurnoSeccion2").attr("disabled", false);
    } else {
        $("#btnCambiarTurnoSeccion2").attr("disabled", true);
    }
});

$("#btnCambiarTurnoSeccion").click(function () {
    var codAlumno = $("#codAlumno").val();
    var periodo = $("#periodo").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var ciclo = $("#ciclo").val();
    var sede = $("#sede").val();
    var turno = $("#turno").val();
    var seccion = $("#seccion").val();
    var turnoN = $("#turno_N").val();
    var seccionN = $("#seccion_N").val();
    var sedeN = $("#sede_N").val();
    var periodo = $("#periodox").val();

    $.ajax({
        url: path + "notas/organizarSeccion",
        type: "POST",
        data: {
            periodo: periodo,
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            mallaCurricular: mallaCurricular,
            ciclo: ciclo,
            codAlumno: codAlumno,
            sede: sede,
            turno: turno,
            seccion: seccion,
            turnoN: turnoN,
            seccionN: seccionN,
            sedeN: sedeN,
            periodo: periodo,
            opcion: "cambiarTurnoSeccion"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalCambioTurnoSeccion").modal("hide");
                cargarAlumnosMatriculados();
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

$("#btnCambiarTurnoSeccion2").click(function () {
    var periodo = $("#periodo").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var ciclo = $("#ciclo").val();
    var sede = $("#sede").val();    
    var turno = $("#turno").val();
    var seccion = $("#seccion").val();
    var turnoN = $("#turno_N2").val();
    var seccionN = $("#seccion_N2").val();    
    var sedeN = $("#sede2").val();
    var alumnos = $("#alum-seleccionados").val();
    var periodo2 = $("#periodox2").val();

    $.ajax({
        url: path + "notas/organizarSeccion",
        type: "POST",
        data: {
            periodo: periodo,
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            mallaCurricular: mallaCurricular,
            ciclo: ciclo,
            sede: sede,
            turno: turno,
            seccion: seccion,
            turnoN: turnoN,
            seccionN: seccionN,
            sedeN: sedeN,
            alumnos: alumnos,
            periodo2: periodo2,
            opcion: "cambiarTurnoSeccion2"
        },
        beforeSend: function(){
            $("#btnCambiarTurnoSeccion2").html("Guardando cambios...").prop("disabled",true);
        },
        complete: function(){
            $("#btnCambiarTurnoSeccion2").html(`<span class="icon-floppy-disk"></span> Grabar Cambios`).prop("disabled", false);
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalCambioTurnoSeccion2").modal("hide");
                cargarAlumnosMatriculados();
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

function cargarAlumnosMatriculados() {   //ya esta

    $("#alum-seleccionados").val("[]");
    $("#check-todo").prop("checked", false);
    var sede = $("#sede").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var periodo = $("#periodo").val();
    var turno = $("#turno").val();
    var ciclo = $("#ciclo").val();
    var seccion = $("#seccion").val();

    $.ajax({
        url: path + "notas/organizarSeccion",
        type: "POST",
        data: {
            sede: sede,
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            mallaCurricular: mallaCurricular,
            periodo: periodo,
            turno: turno,
            ciclo: ciclo,
            seccion: seccion,
            opcion: "alumnosMatriculados"
        },
        success: function (data) {
            //console.log(data);            
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                var tbody = $("#tablaMatriculados tbody");
                tbody.find('tr').remove();
                if (datos.alumnos != "vacio") {
                    var alumnos = datos.alumnos;
                    if (alumnos.length > 0) {
                        $("#btnFrmCambiarTurnoSeccion2").attr("disabled", false);
                    } else {
                        $("#btnFrmCambiarTurnoSeccion2").attr("disabled", true);
                    }
                    for (i = 0; i < alumnos.length; i++) {
                        var alumno = alumnos[i];
                        var fila = `<tr>
                                    <td class="celda-centrada">${i + 1}</td>
                                    <td class="celda-centrada">${alumno.cod_alumno}</td>
                                    <td>${alumno.apellidos_nombres}</td>
                                    <td class="celda-centrada">
                                        <button class="btn boton-tabla boton-rojo" type="button" onclick="retirarAlumno(this);" title="Retirar alumno de la seccion"><span class="icon-user-minus"></span></button>
                                        <button class="btn boton-tabla boton-verde" type="button" onclick="cambiarTurnoSeccion(this);" title="Cambiar Turno y/o Seccion"><span class="icon-magic-wand"></span></button>
                                    </td>
                                    <td class="celda-centrada">
                                        <input type="hidden" value="${alumno.cod_alumno}"></input>
                                        <input type="checkbox" class="check-cambio" style="cursor:pointer"></input>
                                    </td>
                                </tr>`;
                        tbody.append(fila);
                    }
                    var nroAlumnos = $("#tablaMatriculados > tbody > tr").length;
                    $("#nroAlumnos").html(nroAlumnos);
                    $("#restantes").html(nroAlumnos);
                    $("#seleccionados").html("-");                    
                } else {
                    $("#nroAlumnos").html("0");
                    $("#restantes").html("-");
                    $("#seleccionados").html("-");
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

$(document).on('change', ".check-cambio" , function () {

    $("#check-todo").prop("checked", false);
    let seleccionados = JSON.parse( $("#alum-seleccionados").val() ); 
    const codigo = $(this).prev("input").val();
    const cantidad = seleccionados.length;  
    const total = Number($("#nroAlumnos").text())  

    if ($(this).is(':checked')) {
                 
        seleccionados.push( codigo );
        $("#alum-seleccionados").val( JSON.stringify(seleccionados) );              
        $("#seleccionados").html(cantidad + 1);
        $("#restantes").html( total - (cantidad + 1) );        

    } else {

        seleccionados = seleccionados.filter( key => key !== codigo );
        $("#alum-seleccionados").val( JSON.stringify(seleccionados) );        
        $("#seleccionados").html(cantidad - 1);
        $("#restantes").html( Number($("#restantes").text()) + 1);

    }

});

$("#check-todo").change(function(){

    if ($(this).is(':checked')) {

        let seleccionados = [];
        $(".check-cambio").each( function( key , check ){
            
            $(check).prop("checked",true);
            const codigo = $(check).prev("input").val();                              
            seleccionados.push(codigo);
            $("#alum-seleccionados").val(JSON.stringify(seleccionados));
            $("#seleccionados").html($("#nroAlumnos").text());
            $("#restantes").html("0");
                     
        })

    }else{

        $("#alum-seleccionados").val("[]");
        $(".check-cambio").prop("checked",false);
        $("#seleccionados").html("0");
        $("#restantes").html($("#nroAlumnos").text());

    }

})

$("#mensaje-boton-aceptar").click(function () {
    $("#modalMensaje").modal("hide");
    var operacion = $("#nroOperacion").val();

    switch (operacion) {
        case "1":
            var codAlumno = $("#codAlumno").val();
            var periodo = $("#periodo").val();
            var institucion = $("#institucion").val();
            var tipoEspecialidad = $("#tipoEspecialidad").val();
            var especialidad = $("#especialidad").val();
            var mallaCurricular = $("#mallaCurricular").val();
            var ciclo = $("#ciclo").val();
            var sede = $("#sede").val();
            var turno = $("#turno").val();
            var seccion = $("#seccion").val();

            $.ajax({
                url: path + "notas/organizarSeccion",
                type: "POST",
                data: {
                    periodo: periodo,
                    institucion: institucion,
                    tipoEspecialidad: tipoEspecialidad,
                    especialidad: especialidad,
                    mallaCurricular: mallaCurricular,
                    ciclo: ciclo,
                    codAlumno: codAlumno,
                    sede: sede,
                    turno: turno,
                    seccion: seccion,
                    opcion: "retirarAlumnoMatriculado"
                },
                success: function (data) {
                    //console.log(data);
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        cargarAlumnosMatriculados();
                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });
            break;
        default :
            alert("Operacion desconocida");
    }
});

$("#btnMostrarNroAluXSeccion").click(function () {



    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var periodo = $("#periodo").val();
    var turno = $("#turno").val();
    var seccion = $("#seccion").val();
    var ciclo = $("#ciclo").val();
    var colorFondo = "";


    $('#tablaModalNroAlumnoPorSeccion').dataTable().fnDestroy();

    
    
    tablaEgresados = $("#tablaModalNroAlumnoPorSeccion").DataTable({
        ordering: false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ], 
        ajax: {
            url: path + "notas/organizarSeccion",
            type: "POST",

            beforeSend: function () {

                Notiflix.Loading.Hourglass('Cargando...');

            },
            data: {
                institucion: institucion,
                tipoEspecialidad: tipoEspecialidad,
                especialidad: especialidad,
                periodo: periodo,
                turno: turno,
                seccion: seccion,
                ciclo: ciclo,
                opcion: "mostrarCantAluXSeccion"
            },
            dataSrc: function (response) {

                return response.data;
            },
            complete: function (data) {
                $("#NotiflixLoadingWrap").trigger("click");

                $("#modalNroAlumnosPorSeccion").modal({ backdrop: 'static', keyboard: false });
            }
           
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 25, 50, 75, 100],
            [10, 25, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Instituto.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Sede.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Especialidad.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Ciclo.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Secciòn.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Turno.trim();
                }

            },
            {
                data: null,
                render: function (data) {
                    return data.Periodo.trim();
                }

            },
            {
                data: null,
                render: function (data) {
                    return data.NroAlumnos;
                }

            }

        ],
        createdRow : function( row, data, dataIndex ) {
            if ( data.NroAlumnos == 1 ) {
                //$( row ).addClass( "success" );
                $(row).css("background-color", "#ffff26");
            }
        },
        language: {
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "No se encontraron registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "search": "Buscar:",
            "infoThousands": ",",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
        }
    });

    // var tbody = $("#tablaModalNroAlumnoPorSeccion tbody");
    // tbody.find('tr').remove();

    // var institucion = $("#institucion").val();
    // var tipoEspecialidad = $("#tipoEspecialidad").val();
    // var especialidad = $("#especialidad").val();
    // var periodo = $("#periodo").val();
    // var turno = $("#turno").val();
    // var seccion = $("#seccion").val();
    // var ciclo = $("#ciclo").val();
    // var colorFondo = "";

    // $.ajax({
    //     url: path + "notas/organizarSeccion",
    //     type: "POST",
    //     data: {
    //         institucion: institucion,
    //         tipoEspecialidad: tipoEspecialidad,
    //         especialidad: especialidad,
    //         periodo: periodo,
    //         turno: turno,
    //         seccion: seccion,
    //         ciclo: ciclo,
    //         opcion: "mostrarCantAluXSeccion"
    //     },
    //     beforeSend: function()
    //     {

    //         Notiflix.Loading.Hourglass('Cargando...');

    //     },
    //     success: function (data)
    //     {
    //         //console.log(data);

    //         $("#NotiflixLoadingWrap").trigger("click");

    //         var datos = JSON.parse(data);

    //         if (datos.respuesta == "success") 
    //         {

    //             $("#modalNroAlumnosPorSeccion").modal({backdrop: 'static', keyboard: false});

    //             if (datos.secciones != "vacio")
    //             {
    //                 var secciones = datos.secciones;

    //                 for (i = 0; i < secciones.length; i++)
    //                 {
    //                     var seccion = secciones[i];

    //                     if(seccion.NroAlumnos == 1 )
    //                     {
    //                         colorFondo= "#ffff26";

    //                     }else
    //                     {
    //                         colorFondo = "";
    //                     }

    //                     var tr = "<tr>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + (i + 1) + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Instituto + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Sede + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Especialidad + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Ciclo + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Secciòn + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Turno + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.Periodo + "</td>" +
    //                             "<td class=\"celda-centrada\" style=\"background-color:"+ colorFondo + ";\">" + seccion.NroAlumnos + "</td>" +
    //                             "</tr>";

    //                     tbody.append(tr);
    //                 }

    //             }else
    //             {
    //                 var tr = "<tr>" +
    //                             "<td class=\"celda-centrada\" colspan=\"9\">NO SE ENCONTRARON SECCIONES</td>" +
    //                          "</tr>";

    //                 tbody.append(tr);
    //             }

    //         } else
    //         {
    //             var errores = "";
    //             for (i = 0; i < datos.errores.length; i++) 
    //             {
    //                 errores += datos.errores[i] + "<br>";
    //             }

    //             mostrarMensaje("error", "ERROR", errores);
    //         }
    //     }
    // });
});