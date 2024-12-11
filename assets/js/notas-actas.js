$(document).ready(function(){

    secciones = []
    length = 0

    Notiflix.Loading.Init({
        clickToClose: true
    });

    cargarInstituciones(true);
    $("#btnImprimirActa").attr("disabled",true);
    
    $("#institucion").change(function(){
        borrarResultado();
        cargarTipoEspecialidades(true);
    });
    
    $("#tipoEspecialidad").change(function(){
        borrarResultado();
        cargarEspecialidades(true);
    });
    
    $("#especialidad").change(function(){
        borrarResultado();
        cargarMallaCurriculares(true);
    });
    
    $("#periodo").change(function(){
        borrarResultado();
    });
    
    $("#sede").change(function(){
        borrarResultado();
    });
    
    $("#mallaCurricular").change(function(){
        borrarResultado();
    });
    
    $("#turno").change(function(){
        borrarResultado();
    });
    
    $("#ciclo").change(function(){
        borrarResultado();
    });
    
    $("#seccion").change(function(){
        //borrarResultado();

        $(".secciones_ver").show();

        sec = $('#seccion').val();
        console.log("sec", sec);

        $("#btnImprimirActa").attr("disabled", false);

        let seleccionados = JSON.parse($("#secciones_new").val());
        seleccionados.push(sec);
        $("#secciones_new").val(JSON.stringify(seleccionados));
        $("#tablaSeccionSelect tbody").append(`<tr><td class="text-center" style="color:#00b300">${sec}</td>
                                                <td class="text-center"><input type="button" value="X" style="width:40px;height:20px;text-align: center;padding: 0;" class="btn-danger btn-remove-producto fa fa-times f-sm"></input></td></tr>`);                    
    });

    $("#limpiarSecciones").click(function () {
        $("#btnImprimirActa").attr("disabled", true);

        $("#secciones_new").val("[]");
        $("#tablaSeccionSelect tbody").html("");
    });
    
    $("#pagina").change(function(){
        if($("#pagina").val() == 2){
            $("#divFecha").css("display","block");
        }else{
            $("#divFecha").css("display","none");
        }
    });

    $("#cbxBorrador").change(function()
    {

        if($("#cbxBorrador").prop("checked"))
        {//si se selecciona el borrador

            $("#pagina").val(1);//seleccionando primera hoja
            $("#pagina option[value='2']").attr("disabled",""); //deshabilitando segunda hoja

        }else
        {
            $("#pagina option[value='2']").removeAttr("disabled"); //deshabilitando segunda hoja
        }
    });

});

$(document).on("click", ".btn-remove-producto", function () {

    let val = $(this).parents("tr").find("td").eq(0).html()
    let array_seccion = $("#secciones_new").val();
    let result = array_seccion.replace(val, '-');
    new_array = JSON.parse(result).filter(x => x != '-');
    $("#secciones_new").val(JSON.stringify(new_array));
    
    $(this).closest("tr").remove();
})

$("#btnMostrarMatriculados").click(function(){
    cargarAlumnosMatriculados();
    $("#btnImprimirActa").attr("disabled",false);
    $("#btnExportaActa").attr("disabled",false);
    ////////////////////////////
    $("#secciones_new").val("[]");
    $("#tablaSeccionSelect tbody").html("");
});

// $("#btnImprimirActaaa").click(function(){

//     secciones = ["A", "A1", "A2"]
//     length = secciones.length;

//     console.log("length secciones", length);

//     Notiflix.Loading.Hourglass('Cargando...');
//     unaSeccionActa();
// });

function unaSeccionActa() {
    if (secciones.length) {

        secciones_new = secciones[0];
        console.log("secciones_new", secciones_new);

        var form = $("#frmActa").serializeArray();
        form.push({ name: "opcion", value: "imprimir" });
        form.push({ name: "seccion_new", value: secciones_new });
        $.ajax({
            url: path + "notas/actas",
            type: "POST",
            data: $.param(form),
            beforeSend: function () {
                // $('.text-loader').text('RELAJATE ISIS :D , POR FAVOR ESPERE...');
                // $("#modalLoader").modal();
            },
            complete: function () {
                // $("#modalLoader").modal("hide");
            },
            success: function (data) {

                //$("#modalLoader").modal("hide");
                var datos = JSON.parse(data);
                //console.log(datos.file);
                //window.open(datos.file,"_blank");
                if (datos.respuesta == "success") {

                    pdf = datos.file;

                    console.log((length - secciones.length) + 1, "DE", length, "->", "success")
                    secciones.shift();
                    unaSeccionActa(pdf);
                    
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    } else {

        var a = $("<a>");
        a.attr("href", datos.file);

        $("body").append(a);
        a.attr("download", "file.pdf");
        a[0].click();
        a.remove();
        $("#NotiflixLoadingWrap").trigger("click");
        console.log("PROCESO COMPLETADO CON EXITO")
        Notiflix.Report.Success("Registro exitoso", "El archivo fue procesado correctamente.", "Aceptar");

        
    }

}

$("#btnImprimirActa").click(function () {
    var form = $("#frmActa").serializeArray();
    form.push({ name: "opcion", value: "imprimir" });
    console.log("form_actra", form);
    $.ajax({
        url: path + "notas/actas",
        type: "POST",
        data: $.param(form),
        beforeSend: function () {
            $('.text-loader').text('RELAJATE ISIS :D , Y POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (data) {

            $("#modalLoader").modal("hide");
            var datos = JSON.parse(data);
            console.log("DATA", data);
            //window.open(datos.file,"_blank");
            //if (datos.respuesta == "success") {
                var a = $("<a>");
                a.attr("href", datos.file);

                $("body").append(a);
                a.attr("download", "file.pdf");
                a[0].click();
                a.remove();
            // } else {
            //     var errores = "";
            //     err = datos.errores
            //     console.log("err",err);
            //     return;
            //     for (i = 0; i < datos.errores.length; i++) {
            //         errores += datos.errores[i] + "<br>";
            //     }
            //     mostrarMensaje("error", "ERROR", errores);
            // }
        }
    });
});

$("#btnExportaActa").click(function(){    

    $("#frmActa").attr("target","_blank");
    $("#frmActa").submit();
});

function borrarResultado(){
    //$("#btnImprimirActa").attr("disabled",true);
    var tbody = $("#tablaMatriculados tbody");
    tbody.find('tr').remove();
    $("#nroAlumnos").html("-");
    
    var thead = $("#tablaMatriculados thead");
    var tr = thead.find('tr')[2];
    tbody.find("tr").remove();
                                                                
    for(i=0; i<$(tr).find("th").length; i++){
        $($(tr).find("th")[i]).html("");
    }
}

function cargarAlumnosMatriculados(){
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
        url: path + "notas/actas",
        type: "POST",
        data: {
            sede : sede,
            institucion : institucion,
            tipoEspecialidad : tipoEspecialidad,
            especialidad : especialidad,
            mallaCurricular : mallaCurricular,
            periodo : periodo,
            turno : turno,
            ciclo : ciclo,
            seccion : seccion,
            opcion: "vista"
        },
        beforeSend: function(){
            $('.text-loader').text('CARGANDO DATOS, ISIS POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function(data){
            //console.log(data);
            
            var datos = JSON.parse(data);

            //console.log(datos.alumnosActa);

            if(datos.respuesta == "success")
            {
                var tbody = $("#tablaMatriculados tbody");
                var thead = $("#tablaMatriculados thead");
                var tr = thead.find('tr')[2];
                tbody.find("tr").remove();

                for(i=0; i<$(tr).find("th").length; i++){
                    $($(tr).find("th")[i]).html("");
                }
                
                if(datos.alumnosActa != "vacio"){

                    var actas = datos.actas;

                    for(i=0; i<actas.length; i++){

                        //console.log(actas[i].nota2);
                                              
                        if(i === 0){
                            $($(tr).find("th")[0]).html(actas[i].creditos1);
                            $($(tr).find("th")[1]).html(actas[i].creditos2);
                            $($(tr).find("th")[2]).html(actas[i].creditos3);
                            $($(tr).find("th")[3]).html(actas[i].creditos4);
                            $($(tr).find("th")[4]).html(actas[i].creditos5);
                            $($(tr).find("th")[5]).html(actas[i].creditos6);
                            $($(tr).find("th")[6]).html(actas[i].creditos7);
                            $($(tr).find("th")[7]).html(actas[i].creditos8);
                            $($(tr).find("th")[8]).html(actas[i].creditos9);
                            $($(tr).find("th")[9]).html(actas[i].creditos10);
                            $($(tr).find("th")[10]).html(actas[i].creditos11);
                        }

                        if(actas[i].nota1 == "")
                        {

                            actas[i].nota1 = "00";

                        }

                        if(actas[i].nota2 == "")
                        {

                            actas[i].nota2 = "00";

                        }

                        if(actas[i].nota3 == "")
                        {

                            actas[i].nota3 = "00";

                        }

                        if(actas[i].nota4 == "")
                        {

                            actas[i].nota4 = "00";

                        }

                        if(actas[i].nota5 == "")
                        {

                            actas[i].nota5 = "00";

                        }

                        if(actas[i].nota6 == "")
                        {

                            actas[i].nota6 = "00";

                        }

                        if(actas[i].nota7 == "")
                        {

                            actas[i].nota7 = "00";

                        }

                        if(actas[i].nota8 == "")
                        {

                            actas[i].nota8 = "00";

                        }

                        if(actas[i].nota9 == "")
                        {

                            actas[i].nota9 = "00";

                        }

                        if(actas[i].nota10 == "")
                        {

                            actas[i].nota10 = "00";

                        }

                        if(actas[i].nota11 == "")
                        {

                            actas[i].nota11 = "00";

                        }
                                                
                        var fila =  "<tr>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].dni + "</td>" +
                                    "   <td class=\"celda-izquierda\">" + actas[i].apenom_alumno + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota1 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota2 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota3 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota4 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota5 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota6 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota7 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota8 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota9 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota10 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].nota11 + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].numCursosAprobados + "</td>" +
                                    "   <td class=\"celda-centrada\">" + actas[i].numCursosDesaprobados + "</td>" +
                                    "</tr>";
                        tbody.append(fila);
                    }
                    var nroAlumnos = $("#tablaMatriculados > tbody > tr").length;
                    $("#nroAlumnos").html(nroAlumnos);
                }else{
                    $("#nroAlumnos").html("0");
                }
                
            }else{
                mostrarMensaje("error","ERROR",datos.errores);
            }
        }
    });
}

