$(document).ready(function(){
    bloquearDesbloquear(1);
    $("#codAlumno").attr("readonly",true);
});

$("#apellidos").keydown(function(event){
    if(event.keyCode == 13){
        console.log("enviar");
    }
});

$("#btnBuscar").click(function(){
    $("#codigoBus").val("");
    $("#apellidosNombresBus").val("");
    $("#tablaModalAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#modalAlumnos").modal({backdrop: 'static', keyboard: false});
});

$("#btnEditar").click(function(){
    bloquearDesbloquear(3);
});

$("#btnCancelar").click(function(){
    bloquearDesbloquear(2);
});


function bloquearDesbloquear(op){
    var band = true;
    switch(op){
        case 1: //inicio
            $("#btnBuscar").attr("disabled",false);
            $("#btnEditar").attr("disabled",true);
            $("#btnGrabar").attr("disabled",true);
            $("#btnCancelar").attr("disabled",true);
            band = true;
            break;
        case 2: //select
            $("#btnBuscar").attr("disabled",false);
            $("#btnEditar").attr("disabled",false);
            $("#btnGrabar").attr("disabled",true);
            $("#btnCancelar").attr("disabled",true);
            band = true;
            break;
        case 3: //editar
            $("#btnBuscar").attr("disabled",true);
            $("#btnEditar").attr("disabled",true);
            $("#btnGrabar").attr("disabled",false);
            $("#btnCancelar").attr("disabled",false);
            band = false;
            break;
    }
    
    $("#apellidos").attr("readonly", band);
    $("#nombres").attr("readonly", band);
    $("#dni").attr("readonly", band);
    $("#fechaNac").attr("readonly", band);
    $("#edad").attr("readonly", band);
    $("#sexo").attr("disabled", band);
    $("#telefono").attr("readonly", band);
    $("#fechaMat").attr("readonly", band);
    $("#direccion").attr("readonly", band);
    $("#distrito").attr("readonly", band);
    $("#email").attr("readonly", band);
}

function buscarAlumnoMatriculado(){
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();
        
    $.ajax({
        url: path + "notas/alumnos",
        type: "POST",
        data: {
            codigoBus : codigoBus,
            apellidosNombresBus : apellidosNombresBus,
            opcion: "buscar"
        },
        success: function(data){
            //console.log(data);
            var tbody = $("#tablaModalAlumno tbody");
            tbody.find('tr').remove();
            var datos = JSON.parse(data);
            if(datos.respuesta=="success"){
                if(datos.alumnos != "vacio"){
                    var alumnos = datos.alumnos;
                    for(i=0; i<alumnos.length; i++){
                        var alumno = alumnos[i];
                        var tr = "<tr ondblclick=\"seleccionarAlumno(this);\">" +
                                 "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                                 "<td>" + alumno.apellidos_nombres + "</td>" +
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

function seleccionarAlumno(tr){
    var codAlumno = $(tr).find("td").eq(0).html();
    
    $.ajax({
        url: path + "notas/alumnos",
        type: "POST",
        data: {            
            codAlumno : codAlumno,
            opcion: "seleccionar"
        },
        success: function(data){
            var datos = JSON.parse(data);
            if(datos.respuesta == "success"){
                $("#modalAlumnos").modal("hide");
                if(datos.alumno != "vacio"){
                    var alumno = datos.alumno[0];
                    $("#codAlumno").val(alumno.cod_alumno.trim());
                    $("#apellidos").val(alumno.apell_alumno.trim());
                    $("#nombres").val(alumno.nombre_alumno.trim());
                    $("#dni").val(alumno.dni);
                    $("#fechaNac").val(alumno.fecha_naci);
                    $("#edad").val(alumno.edad);
                    $("#sexo").val(alumno.sexo);
                    $("#telefono").val(alumno.telefono);
                    $("#fechaMat").val(alumno.fecha_matricula);
                    $("#direccion").val(alumno.domicilio);
                    $("#distrito").val(alumno.distrito);
                    $("#email").val(alumno.email);
                    if(datos.resfoto === true){
                        $("#foto").attr({"src": "https://www.istalcursos.edu.pe/intranet/assets/files/FotoPerfil/"+datos.foto.NombreArchivo});
                    }else{
                        $("#foto").attr({"src": path+datos.foto});
                    }
                    
                    bloquearDesbloquear(2);
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


