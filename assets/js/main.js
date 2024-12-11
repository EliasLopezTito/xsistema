var path = "http://localhost/xsistema/";

$(document).ready(async function () {
        var msj = $("#msj").val();
        if (msj != null && msj != "") {
            mostrarMensaje("error", "ERROR", msj);
        }

        //$('#modalCumple').modal('show');

        // cargarEncuestasAlumnos() // ENCUESTA COORDINADORAS
    //  FUEGOS ARTIFICIALES
    // await loadFull(tsParticles);

    // $("#tsparticles")
    //     .particles()
    //     .init(
    //         {
    //             fullScreen: {
    //                 enable: false
    //             },
    //             detectRetina: true,
    //             background: {
    //                 color: "#1d4064"
    //             },
    //             fpsLimit: 60,
    //             emitters: {
    //                 direction: "top",
    //                 life: {
    //                     count: 0,
    //                     duration: 0.1,
    //                     delay: 0.1
    //                 },
    //                 rate: {
    //                     delay: 0.15,
    //                     quantity: 1
    //                 },
    //                 size: {
    //                     width: 100,
    //                     height: 0
    //                 },
    //                 position: {
    //                     y: 0,
    //                     x: 50
    //                 }
    //             },
    //             particles: {
    //                 number: {
    //                     value: 0
    //                 },
    //                 destroy: {
    //                     mode: "split",
    //                     split: {
    //                         count: 1,
    //                         factor: { value: 1 / 3 },
    //                         rate: {
    //                             value: 80
    //                         },
    //                         particles: {
    //                             stroke: {
    //                                 color: {
    //                                     value: [
    //                                         "#ffffff",
    //                                         "#b22234",
    //                                         "#b22234",
    //                                         "#3c3bfe",
    //                                         "#3c3bfe",
    //                                         "#3c3bfe"
    //                                     ]
    //                                 },
    //                                 width: 1
    //                             },
    //                             number: {
    //                                 value: 0
    //                             },
    //                             collisions: {
    //                                 enable: false
    //                             },
    //                             opacity: {
    //                                 value: 1,
    //                                 animation: {
    //                                     enable: true,
    //                                     speed: 0.7,
    //                                     minimumValue: 0.1,
    //                                     sync: false,
    //                                     startValue: "max",
    //                                     destroy: "min"
    //                                 }
    //                             },
    //                             shape: {
    //                                 type: "circle"
    //                             },
    //                             size: {
    //                                 value: 1,
    //                                 animation: {
    //                                     enable: false
    //                                 }
    //                             },
    //                             life: {
    //                                 count: 1,
    //                                 duration: {
    //                                     value: {
    //                                         min: 1,
    //                                         max: 2
    //                                     }
    //                                 }
    //                             },
    //                             move: {
    //                                 enable: true,
    //                                 gravity: {
    //                                     enable: false
    //                                 },
    //                                 speed: 2,
    //                                 direction: "none",
    //                                 random: true,
    //                                 straight: false,
    //                                 outMode: "destroy"
    //                             }
    //                         }
    //                     }
    //                 },
    //                 life: {
    //                     count: 1
    //                 },
    //                 shape: {
    //                     type: "line"
    //                 },
    //                 size: {
    //                     value: 50,
    //                     animation: {
    //                         enable: true,
    //                         sync: true,
    //                         speed: 15,
    //                         startValue: "max",
    //                         destroy: "min"
    //                     }
    //                 },
    //                 stroke: {
    //                     color: {
    //                         value: "#ffffff"
    //                     },
    //                     width: 1
    //                 },
    //                 rotate: {
    //                     path: true
    //                 },
    //                 move: {
    //                     enable: true,
    //                     gravity: {
    //                         acceleration: 5,
    //                         enable: true,
    //                         inverse: true,
    //                         maxSpeed: 10
    //                     },
    //                     speed: { min: 10, max: 20 },
    //                     outModes: {
    //                         default: "destroy",
    //                         top: "none"
    //                     },
    //                     trail: {
    //                         fillColor: "#1d4064",
    //                         enable: true,
    //                         length: 10
    //                     }
    //                 }
    //             }
    //         },
    //         function (container) {
    //             // container is the particles container where you can play/pause or stop/start.
    //             // the container is already started, you don't need to start it manually.
    //         }
    //     );

    // // or

    // $("#tsparticles")
    //     .particles()
});

// new Snowflakes({
//     color: "green",
//     container: document.querySelector('#snowflakes-container'),
//     count: 100,
//     minOpacity: 0.6,
//     maxOpacity: 1,
//     minSize: 15,
//     maxSize: 60,
//     rotation: true,
//     speed: 1,
//     wind: true,
//     //width: 500, 
//     //height: 950, 
//     //zIndex: 100, 
//     autoResize: true
// });



// var hojas = ""
// let estre = [12,2]

// estre.forEach(row => {
//     new Array(row).fill('').forEach((v,i) => {
//         hojas+=([
//             //...Array(9-i).fill("<span>-</span>"),
//             ...Array(1+i+1).fill("<span class='rojo'>*</span>"),
//             //...Array(9-i).fill("<span>-</span>")
//         ].join('')) 
//         hojas += "<p class='br'>"
//     })
// })

//document.getElementById("arbol").innerHTML = hojas

// let animacion = document.querySelectorAll(".rojo")
// animacion.innerHTML = hojas
// function animar() {
//     for(var i=0; i<animacion.length; i++) {
//         let tiempo = i/20+1
//         animacion[i].style.animation = "colores "+tiempo+"s infinite"
//     }
// }

// window.addEventListener('load', animar)

function cargarEncuestasAlumnos() {
    $.ajax({
        url: path + "Main/index",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarEncuestasAlumnos",
        },
        beforeSend: function () {

        },
        success: function (response) {
            console.log("response", response);
            if (response.respuesta === "success") {

                $("#contenidoEncuestasEmpleabilidad").html("");
                const encuestas = response.data;
                const numeroEncuentas = response.numeroEncuentas;
                console.log("numeroEncuentas", numeroEncuentas);
                if(encuestas.length > 0){

                    $("#modalEncuestaEmpleabilidad").modal({ backdrop: 'static', keyboard: false });

                    const agrupadoPorId = encuestas.reduce((acumulador, elemento) => {
                        // Verificar si ya existe una entrada para este ID
                        if (!acumulador[elemento.IDP]) {
                            acumulador[elemento.IDP] = []; // Si no existe, crear un nuevo array
                        }
                        acumulador[elemento.IDP].push(elemento); // Agregar el elemento al array correspondiente al ID
                        return acumulador;
                    }, {});

                    pregu = []
                    pregu.push(agrupadoPorId)

                    numeroEncuentas.forEach(function (encuesta, index) {
                        console.log("ec", encuesta);
                        let idEncuesta = encuesta.Op;
                        let titulo = encuesta.Nombre
                        let preguntas = pregu
                        let count = index + 1;

                        let plantilla = plantillaEncuestasAlumnos(titulo, idEncuesta, preguntas, count);
                        $("#contenidoEncuestasEmpleabilidad").append(plantilla);

                    });

                    $(".div__preguntas__encuesta:first").next().toggle("fast")

                    $("#modalEncuestaEmpleabilidad").modal({ backdrop: 'static', keyboard: false });

                }else{

                    console.log("No hay encuesta");

                }

            }

        },
    });

}

function plantillaEncuestasAlumnos(titulo, idEncuesta, preguntas, count) {
    let trPregunta = "";

    arrayValues = Object.values(preguntas[0]);
    console.log("arrayValues", arrayValues);
    
    arrayValues.forEach(function (preg, index) {
        console.log("preg", arrayValues.length);

        let alternativas = preg;

        let tdOpciones = "";

        // if (preg.tipoPregunta === 1) {

            console.log("atler", alternativas);

            alternativas.forEach(function (alter, index2) {
                if (alter !== "" && alter !== null) {
                    tdOpciones += ` 
                        <div class="radio" style="display:flex;justify-content: space-between;align-items:center">
                            <span style="text-transform:uppercase">${alter.Respuesta}</span>
                            <label style="padding-left: 55px">
                                <input ${(index2 === 0 ? 'required' : '')} type="radio" value="${alter.IDR}" name="respuesta${index + 1}" >                                                   
                            </label>
                        </div>
                    `;
                };

            });
        // } else {
        //     tdOpciones = `<textarea required name="respuesta${index + 1}" class="form-control" placeholder="Escriba su respuesta" style="height: 35px;margin:10px 0"></textarea>`
        // }

        trPregunta += `<tr style="border: rgb(249 168 212) 3px solid;">
                <input type="hidden" name="idPreguntas[]" value="${preg[0].IDP}">   
                <td class="text-center" style="text-transform:uppercase;">${preg[0].Pregunta}</td>
                <td style="padding:0 20px">${tdOpciones +`<textarea required name="respuestaOpcional${index + 1}" class="form-control" placeholder="Escriba el detalle de su respuesta (OPCIONAL)" style="height: 40px; width: 300px;margin:10px 0"></textarea>` }</td>  
            </tr>`

    });

    const plantilla = `<div style="border:1px solid #EAEDED ;border-radius:5px;margin-bottom:20px">                
                            <div class="div__preguntas__encuesta">
                                <span> ${titulo} </span> <span class="icon-circle-down" style="font-size: 21px;color: #24b124"></span>
                            </div>
                            <div class="table-responsive" style="padding:15px;display:none">
                                <form id="formEncuestaEmple${count}">
                                    <input type='hidden' name='idEncuesta' value='${idEncuesta}' />
                                    <input type='hidden' id="cantPreguntas" value='${arrayValues.length}' />
                                    <table  class="table table-condensed table-bordered mi-tabla" style="border: rgb(249 168 212) 3px solid;">
                                        <thead>
                                            <tr><th style="min-width:430px; background-color: rgb(249 168 212);" class="celda-centrada">PREGUNTAS</th><th style="min-width:150px;max-width:300px; background-color: rgb(249 168 212);" class="celda-centrada">-</th></tr>
                                        </thead>
                                        <tbody>${trPregunta}</tbody>                                                        
                                    </table>
                                    <div style="display:flex;justify-content: end;margin-top:18px">
                                        <button type="button" class="btn btn-success mipanel-btn-img-texto btnRegistrarRespuestasEE">
                                            <span class="icon-pencil padding_right_10px"></span> Registrar respuestas
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>`;

    return plantilla;

}

$(document).on("click",".btnRegistrarRespuestasEE",function(){

    const formulario = $(this).parent().parent().prop("id");  
    let form = $("#"+formulario).serializeArray();
    camtPreguntas = $('#cantPreguntas').val();

    if($('#sede').val() == null){
        Notiflix.Notify.Warning('COMPLETE LA SEDE Y TURNO PARA CONTINUAR.');
        return;
    }

    let camposvacios = false
    console.log("form", form);
    form.forEach( ( values, index ) => {
        
        cant = index - (Number(camtPreguntas) * 2) 
        console.log("index", index);
         console.log("camtPreguntas", camtPreguntas);
        console.log("can", cant);

        if(cant != Number(camtPreguntas)){
            camposvacios = true
        }else{
            camposvacios = false
        }
        // if(values.value == ""){
        //     camposvacios = true
        // }
    });
    if(camposvacios){
        Notiflix.Notify.Warning('COMPLETE LA ENCUESTA PARA CONTINUAR.');
        return;
    }


    form.push({name: "opcion", value: "registrar"}, {name: "sede", value: $('#sede').val()}, {name: "turno", value: $('#turno').val()});

    console.log("FORM", form);
    $.ajax({
        url: path + "Main/Index",
        type: "POST",
        dataType:"JSON",
        data: form,
        beforeSend: function () {
            Notiflix.Loading.Standard('Registrando encuesta...');
        },
        success: function (response) {

            if(response.respuesta === "success"){

                $("#"+formulario).parent().parent().remove();
                $(".div__preguntas__encuesta:first").next().toggle("slow")
                Notiflix.Report.Success("Operación éxitosa", "La encuesta se registro de manera éxitosa" ,"cerrar");
                Notiflix.Loading.Remove();
                //if(response.cantidadRestante < 1){
                    $("#modalEncuestaEmpleabilidad").modal("hide");
                //}


            }else if(response.respuesta === "warning"){
                Notiflix.Report.Warning("AVISO DE SISTEMA", response.error ,"cerrar");
                Notiflix.Loading.Remove(); 
            }else{
                Notiflix.Report.Failure("OCURRIO UN ERROR INESPERADO", response.error ,"cerrar");
                Notiflix.Loading.Remove();
            }
            
        },
    });

})

function bloquearMasivos(){
    var hoy = new Date();
    var hora = hoy.getHours();// + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    if(hora < 18 ){
        $("input").prop("disabled",true);
        $("select").prop("disabled", true);
        $("button").prop("disabled", true);   
        $("checkbox").prop("disabled", true);                
    }else{
        $("input").prop("disabled", false);
        $("select").prop("disabled", false);
        $("button").prop("disabled", false);        
        $("checkbox").prop("disabled", false);        
    }

    Notiflix.Notify.Warning("ESTA OPCION ESTARÁ DISPONIBLE A PARTIR DE LAS 6 DE LA TARDE DE CADA DÍA.",{timeout:10000});

}

function mostrarMensaje(estilo, titulo, mensaje) {
    asignarEstiloModal(estilo);
    $("#mensaje-titulo").html(titulo);
    $("#mensaje-contenido").html(mensaje);
    $("#modalMensaje").modal({backdrop: 'static', keyboard: false});
}

$("#codigoBus, #apellidosNombresBus").keydown(function (event) {
    if (event.keyCode == 13) {
        buscarAlumnoMatriculado();
    }

    if(this.value.length > 2) {
        buscarAlumnoMatriculado();
    }
});

$("#codigoBus").attr('placeholder', 'Escriba codigo');
$("#apellidosNombresBus").attr('placeholder', 'Escriba nombre o apellido del alumno');

$("#codigoDocenteBus").attr('placeholder', 'Escriba codigo');
$("#apellidosNombresDocenteBus").attr('placeholder', 'Escriba nombre o apellido del docente');


$("#cbxTodasLasSedes").change(function () {
    buscarAlumnoMatriculado();
});

function asignarEstiloModal(estilo) {
    switch (estilo) {
        case "mensaje":
            $("#mensaje-header").css({"background-color": "#326299"});
            $("#mensaje-boton").css({"background-color": "#326299"});
            $("#mensaje-boton-aceptar").css({"display": "none"});
            $("#mensaje-boton").html("Aceptar");
            $("#mensaje-icono").removeClass().addClass("icon-info");
            break;
        case "exito":
            $("#mensaje-header").css({"background-color": "#6aa777"});
            $("#mensaje-boton").css({"background-color": "#6aa777"});
            $("#mensaje-boton-aceptar").css({"display": "none"});
            $("#mensaje-boton").html("Aceptar");
            $("#mensaje-icono").removeClass().addClass("icon-notification");
            break;
        case "error":
            $("#mensaje-header").css({"background-color": "#b95d63"});
            $("#mensaje-boton").css({"background-color": "#b95d63"});
            $("#mensaje-boton-aceptar").css({"display": "none"});
            $("#mensaje-boton").html("Aceptar");
            $("#mensaje-icono").removeClass().addClass("icon-warning");
            break;
        case "confirmacion":
            $("#mensaje-header").css({"background-color": "#d27131"});
            $("#mensaje-boton").css({"background-color": "#d27131"});
            $("#mensaje-boton-aceptar").css({"background-color": "#b1b43c"});
            $("#mensaje-boton-aceptar").css({"display": "inline"});
            $("#mensaje-boton").html("Cancelar");
            $("#mensaje-boton-aceptar").html("Aceptar");
            $("#mensaje-icono").removeClass().addClass("icon-question");
            break;
        default :
            $("#mensaje-header").css({"background-color": "#326299"});
            $("#mensaje-boton").css({"background-color": "#326299"});
            $("#mensaje-boton-aceptar").css({"display": "none"});
            $("#mensaje-boton").html("Aceptar");
            $("#mensaje-icono").removeClass();
            break;
    }
}

function cargarInstituciones( enlazado ,todos = false , func = null ) {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion");
            cboInstitucion.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.instituciones != "vacio") {
                    var instituciones = datos.instituciones;
                    for (i = 0; i < instituciones.length; i++) {
                        var institucion = instituciones[i];
                        var selected = institucion.cod_local === "10" ? "selected" : "" ;                        
                        cboInstitucion.append("<option "+selected+" value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + ((institucion.descripcionM===null||institucion.descripcionM==="")?institucion.descripcion:institucion.descripcionM) + "</option>");
                    }
                    if (enlazado == true) {
                        cargarTipoEspecialidades(enlazado , todos , func);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades( enlazado , todos = false , func = null ) {
    var institucion = $("#institucion").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad");
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
                        cargarEspecialidades(enlazado,todos,func);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades( enlazado , todos = false , func = null ) {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    
                    if(todos){
                        cboEspecialidad.append("<option value='0'>TODOS</option>");
                    }

                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }

                    if (func !== null) {
                        func();
                    }

                    if (enlazado == true) {
                        cargarMallaCurriculares(enlazado);
                    }                    

                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarInstituciones2(enlazado, todos = false, func = null) {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion2");
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
                        cargarTipoEspecialidades2(enlazado, todos, func);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades2(enlazado, todos = false, func = null) {
    var institucion = $("#institucion2").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad2");
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
                        cargarEspecialidades2(enlazado, todos, func);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades2(enlazado, todos = false, func = null) {
    var institucion = $("#institucion2").val();
    var tipoEspecialidad = $("#tipoEspecialidad2").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad2");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;

                    if (todos) {
                        cboEspecialidad.append("<option value='0'>TODOS</option>");
                    }

                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }

                    if (func !== null) {
                        func();
                    }
                   
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarSedes2() {
    $.ajax({
        url: path + "sede/getSedes",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboSede = $("#sede2");
            cboSede.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.sedes != "vacio") {
                    var sedes = datos.sedes;
                    for (i = 0; i < sedes.length; i++) {
                        var sede = sedes[i];
                        cboSede.append("<option value=\"" + sede.cod_localinst + "\" >" + sede.cod_localinst + " - " + sede.descripcion_local + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarMallaCurriculares(enlazado) {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();

    $.ajax({
        url: path + "mallaCurricular/getMallaCurriculares",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad
        },
        success: function (data) {
            //console.log(data);
            var cboMallaCurricular = $("#mallaCurricular");
            cboMallaCurricular.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.mallaCurriculares != "vacio") {
                    var mallaCurriculares = datos.mallaCurriculares;
                    for (i = 0; i < mallaCurriculares.length; i++) {
                        var mallaCurricular = mallaCurriculares[i];
                        cboMallaCurricular.append("<option value=\"" + mallaCurricular.malla_curricular + "\" >" + mallaCurricular.abreviatura + "</option>");
                    }
                    if (enlazado == true) {
                        //cargarMatriculados();
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarSedes(todos = false) {
    $.ajax({
        url: path + "sede/getSedes",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboSede = $("#sede");
            cboSede.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.sedes != "vacio") {
                    var sedes = datos.sedes;
                    if(todos){
                        cboSede.append("<option value='0'>TODOS</option>");
                    }
                    for (i = 0; i < sedes.length; i++) {
                        var sede = sedes[i];
                        cboSede.append("<option value=\"" + sede.cod_localinst + "\" >" + sede.cod_localinst + " - " + sede.descripcion_local + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarPabellones() {
    $.ajax({
        url: path + "pabellon/getPabellones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboPabellon = $("#pabellon");
            cboPabellon.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.pabellones != "vacio") {
                    var pabellones = datos.pabellones;
                    for (i = 0; i < pabellones.length; i++) {
                        var pabellon = pabellones[i];
                        cboPabellon.append("<option value=\"" + pabellon.descripcion + "\" >" + pabellon.descripcion + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarPisos() {
    $.ajax({
        url: path + "piso/getPisos",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboPiso = $("#piso");
            cboPiso.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.pisos != "vacio") {
                    var pisos = datos.pisos;
                    for (i = 0; i < pisos.length; i++) {
                        var piso = pisos[i];
                        cboPiso.append("<option value=\"" + piso.descripcion + "\" >" + piso.descripcion + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

/* Funcines basicas */
function isNumero(valor) {
    if (isNaN(valor)) {
        return false;
    }
    return true;
}

function showModalVideoTutorial(){

    $("#modalVideoTutorial").modal({backdrop: 'static', keyboard: false});

    var video= document.getElementById('video_tutorial');
    
    cargarVideo(video);

}

function cargarVideo(elementoVideo){

    elementoVideo.addEventListener('ended', function(ev) {
          
          elementoVideo.load();

    }, false);

}

function reproducirVideo(elementoVideo){

    elementoVideo.play();

}

function pausarVideo(elementoVideo){

    elementoVideo.pause();

}

function pararVideo(elementoVideo){

    elementoVideo.load();

}

function cerrarVideo(elementoModal,elementoVideo){

    pararVideo(elementoVideo);
    $("#modalVideoTutorial").modal("hide");

}