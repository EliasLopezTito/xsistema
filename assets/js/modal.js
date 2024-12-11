$(document).ready(function(){

    $("#paternoBus, #maternoBus, #nombresBus").keydown(function(event){        
        if(event.keyCode == 13){
            buscarPersona();            
        }
    }); 
    $("#paternoBus, #maternoBus, #nombresBus").blur(function(){
        buscarPersona();        
    });
    
    $("#codigoBus, #apellidosNombresBus").keydown(function(event){
        if(event.keyCode == 13){
            buscarAlumno();
        }
    }); 
    $("#codigoBus, #apellidosNombresBus").blur(function(){
        buscarAlumno();        
    });

    $("#paternoBusNew, #maternoBusNew, #nombresBusNew").keydown(function(event){
        if(event.keyCode == 13){
            buscarPersona();
        }
    });     
    $("#paternoBusNew, #maternoBusNew, #nombresBusNew").blur(function(){
        buscarPersona();        
    }); 
});

function iniciarModalPersona(){    
    $("#paternoBus").val("");
    $("#maternoBus").val("");
    $("#nombresBus").val("");
    $("#tablaBuscaPersona tbody").find('tr').remove();
    $("#paternoBus").focus();
    $("#miModalPersona").modal({backdrop: 'static', keyboard: false});
    $("#miModalPersona").draggable({ handle: ".modal-header"});
}

function iniciarModalAlumno(){    
    $("#codigoBus").val("");    
    $("#apellidosNombresBus").val("");
    $("#tablaBuscaAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#miModalAlumno").modal({backdrop: 'static', keyboard: false});
    $("#miModalAlumno").draggable({ handle: ".modal-header"});
}

function buscarPersona(){    
    var paterno = $("#paternoBus").val().trim();
    var materno = $("#maternoBus").val().trim();
    var nombres = $("#nombresBus").val().trim();
        
    if((paterno!="" && paterno.length>3) || (materno!="" && materno.length>3) || (nombres!="" && nombres.length>3)){
        $.ajax({
            url: path + "persona/listar",
            type: "POST",
            data: {
                paterno: paterno,
                materno: materno,
                nombres: nombres,
            },
            success: function(data){              
                var tbody = $("#tablaBuscaPersona tbody");
                tbody.find('tr').remove();
                
                var datos = JSON.parse(data);
                if(datos.respuesta=="success"){
                    if(datos.personas != "vacio"){
                        var personas = datos.personas;
                        for(i=0;i<personas.length;i++){
                            var persona = personas[i];
                            
                            var tr = "<tr class=\"selectPersona\" onclick=\"seleccionarPersona('" + persona.PERSONA + "')\">" + 
                                     "<td>" + persona.APELLIDO_PATERNO + " " + persona.APELLIDO_MATERNO + ", " + persona.NOMBRES + "</td>" +
                                     "</tr>";
                        
                            tbody.append(tr);
                        }
                    }
                }else{        
                    $("#errorPersona").text(datos.error);
                    $("#errorPersona").css("color","red");
                    $("#errorPersona").css("display","block");
                }
            }
        });        
    }
}

function buscarAlumno(){
    var codigo = $("#codigoBus").val().trim();
    var apellidosNombres = $("#apellidosNombresBus").val().trim();    
    
    if((codigo!="" && codigo.length>=5) || (apellidosNombres!="" && apellidosNombres.length>3)){
        $.ajax({
            url: path + "alumno/listarModal",
            type: "POST",
            data: {
                codigo: codigo,
                apellidosNombres: apellidosNombres,
            },
            success: function(data){
                var tbody = $("#tablaBuscaAlumno tbody");
                tbody.find('tr').remove();
                
                var datos = JSON.parse(data);
                if(datos.respuesta=="success"){
                    if(datos.alumnos != "vacio"){
                        var alumnos = datos.alumnos;
                        for(i=0;i<alumnos.length;i++){
                            var alumno = alumnos[i];
                            
                            var tr = "<tr class=\"selectPersona\" onclick=\"seleccionarAlumno('" + alumno.ALUMNO + "')\">" + 
                                     "<td>" + alumno.ALUMNO + "</td>" + 
                                     "<td>" + alumno.APELLIDOS_NOMBRES + "</td>" +
                                     "</tr>";
                        
                            tbody.append(tr);
                        }
                    }
                }else{
                    $("#errorAlumno").text(datos.error);
                    $("#errorAlumno").css("display","block");
                }
            }
        });
    }
}
