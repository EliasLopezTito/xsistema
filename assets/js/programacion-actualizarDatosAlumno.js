$(document).ready(function(){
    $("#filtro").keydown(function(event){
        if(event.which === 13){
            filtrar();
        }
    });
    $("#btnBuscar").click(function(){
        filtrar();
    });

});

function filtrar(){
    var filtro = $("#filtro").val().trim();
    if(filtro.length >= 5){
        $.ajax({
            url: path + "programacion/actualizarDatosAlumno",
            type: "POST",
            data: {
                opcion : "select",
                filtro : filtro
            },
            success: function(data){
                var tbody = $("#tablaAlumnos tbody");
                tbody.find("tr").remove();

                var datos = JSON.parse(data);
                if(datos.respuesta == "success"){
                    if(datos.alumnos != "vacio"){
                        var alumnos = datos.alumnos;

                        for(i=0; i<alumnos.length; i++){
                            var fila =  "<tr>" +
                                        "   <td class='celda-centrada'>" + alumnos[i].cod_alumno + "</td>" +
                                        "   <td>" + alumnos[i].apellidos + " " + alumnos[i].nombres + "</td>" +
                                        "   <td>" + alumnos[i].apellidos + "</td>" +
                                        "   <td>" + alumnos[i].nombres + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].sexo + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].TipoDoc + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].NumeroDocumento + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].domicilio + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].fecha_naci + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].telefono + "</td>" +
                                        "   <td class=\"celda-centrada\">" + alumnos[i].email + "</td>" +
                                        "   <td class=\"celda-centrada\">" +
                                        "       <button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"editar(this);\" title=\"Editar datos\"><span class=\"icon-pencil\"></span></button>" +
                                        "   </td>" +
                                        "</tr>";
                            tbody.append(fila);
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
    }else{
        limpiarDatosBuscados();
        mostrarMensaje("error","ERROR","Debe ingresar por lo menos 5 caracteres o números");
    }
}

function editar(btn){
    var codigo = $(btn).parent().parent().find("td").eq(0).html();
    var apellidos = $(btn).parent().parent().find("td").eq(2).html();
    var nombres = $(btn).parent().parent().find("td").eq(3).html();
    var sexo = $(btn).parent().parent().find("td").eq(4).html();
    var tipoDoc = $(btn).parent().parent().find("td").eq(5).html();
    var numDoc = $(btn).parent().parent().find("td").eq(6).html();
    var domicilio = $(btn).parent().parent().find("td").eq(7).html();
    var fechaNac = $(btn).parent().parent().find("td").eq(8).html();
    var celular = $(btn).parent().parent().find("td").eq(9).html();
    var email = $(btn).parent().parent().find("td").eq(10).html();

    $("#tituloModal").html("EDITANDO DATOS");
    $("#btnGrabarM").attr("title","Guardar datos");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Datos");
    $("#opcion").val("update");
    limpiarModal();
    
    $("#codigo").val(codigo);
    $("#apellidos").val(apellidos);
    $("#nombre").val(nombres);
    if (sexo === 'F') $("#sexo option[value='F']").attr("selected", true);
    if (tipoDoc === 'CARNET DE EXTRANJERIA') $("#tipoDoc option[value='CARNET DE EXTRANJERIA']").attr("selected", true);
    $("#f_nac").val(fechaNac);
    $("#numDoc").val(numDoc);
    $("#domicilio").val(domicilio);
    $("#telefono").val(celular);
    $("#email").val(email);
        
    $("#modalEditarDatos").modal({keyboard: false});
}

$("#btnGrabarM").click(function (){

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea actualizar los datos del alumno?',
        'Si',
        'No',
        function(){
            let codigo = $("#codigo").val();
            let apellidos = $("#apellidos").val();
            let nombres = $("#nombre").val();
            let sexo = $("#sexo").val();
            let f_nac = $("#f_nac").val();
            let tipoDoc = $("#tipoDoc").val();
            let numDoc = $("#numDoc").val();
            let domicilio = $("#domicilio").val();
            let telefono = $("#telefono").val();
            let email = $("#email").val();
         
            $.ajax({
                url: path + "programacion/actualizarDatosAlumno",
                type: "POST",
                data: {
                    opcion: "update",
                    codigo: codigo,
                    apellidos: apellidos,
                    nombres: nombres,
                    sexo: sexo,
                    fecha_nac: f_nac,
                    tipoDoc: tipoDoc,
                    numDoc: numDoc,
                    domicilio: domicilio,
                    celular: telefono,
                    email: email
                },
                success: function(data){
                    var datos = JSON.parse(data);
                    if(datos.respuesta=="success"){
                        $("#modalEditarDatos").modal("hide");
                        filtrar();
                        Notiflix.Notify.Success('Datos actualizados correctamente!');
                    }else{
                        var errores = "";
                        for(i=0; i<datos.errores.length; i++){
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error","ERROR",errores);
                    }
                }
            });
        },
        function(){
           
        }
    );

 
});

function limpiarModal(){
    $("#codigoM").html("");
    $("#nombreM").html("");
    $("#celularM").val("");
    $("#emailM").val("");
}

function limpiarDatosBuscados(){
    var tbody = $("#tablaAlumnos tbody");
    tbody.find("tr").remove();
}
