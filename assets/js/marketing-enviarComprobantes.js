$(document).ready(function(){

    setFechaInputDate();

})

function setFechaInputDate(){
    let date = new Date();
    let fecha_inicio = `${date.getFullYear()}-0${date.getMonth() + 1}-01`;
    let fecha_fin = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString().split('/');
    fecha_fin = `${fecha_fin[2]}-${fecha_fin[1].padStart(2,'0')}-${fecha_fin[0]}`;

    document.getElementById('desde').value = fecha_inicio;
    document.getElementById('hasta').value = fecha_fin;
    //document.getElementById('fechaDesde').value = '2021-07-01';
    //document.getElementById('fechaHasta').value = '2021-07-30';
}

$('#formBuscar').submit(function(e){

    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({name: "opcion", value: "buscar"});

    $.ajax({

        url: path + "Marketing/enviarComprobantes",
        type: "POST",
        dataType:"JSON",
        data: $.param(form) ,
        beforeSend: function () {
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        success: function (response) {
          
            if(response.respuesta === "success" ){

                const alumnos = response.alumnos
                const count = alumnos.length
                $("#tablaListadoAlumnos tbody").find('tr').remove();

                if( count > 0 ){

                    alumnos.forEach(function(index,key){

                        let plantilla = `<tr>
                            <td>${key+1}</td>
                            <td>${index.Alumno}</td>
                            <td>${index.Codigo_Alumno}</td>
                            <td class="text-center">${index.Descripcion}</td>
                            <td class="text-center">${index.Fecha}</td>
                            <td class="text-center">${index.Talon}</td>
                            <td class="text-center">${index.Recibo}</td>
                            <td class="text-center">S/ ${index.Monto}</td>
                            <td class="text-center">${index.EnvSunat.toUpperCase()}</td>    
                            <td class="text-center">  
                                <button class="btn boton-tabla boton-verde" fecha-comprobante="${index.Fecha.trim()}" data-codigo="${index.Codigo_Alumno.trim()}" data-talon="${index.Talon.trim()}" data-recibo="${index.Recibo.trim()}" type="button" onclick="enviarBoletaCorreo(this)"><span class="icon-envelop" style=""></span></button>      
                            </td>    
                        </tr>`;

                        $("#tablaListadoAlumnos tbody").append(plantilla)

                    });

                }else{

                    $("#tablaListadoAlumnos tbody").html("<tr><td class='text-center' colspan='9'><b>SIN RESULTADOS</b></td></tr>")

                }
                
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Success('La información se cargo de manera éxitosa');

            }else{

                $("#modalLoader").modal("hide");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }         

        },
    });

})


function enviarBoletaCorreo(btn){
    
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro se envíar el comprobante al alumno?',
        'Si',
        'No',
        function(){
            
            const talon = btn.getAttribute('data-talon');
            const recibo = btn.getAttribute('data-recibo');
            const codigoAlumno = btn.getAttribute("data-codigo");
            const fechaComprobante = btn.getAttribute("fecha-comprobante");
            
            $.ajax({

                url: path + "Marketing/enviarComprobantes",
                type: "POST",
                dataType:"JSON",
                data: {
                    opcion : "enviar",
                    talon : talon,
                    recibo : recibo,
                    codigoAlumno : codigoAlumno,
                    fechaComprobante : fechaComprobante
                } ,
                beforeSend: function () {
                    $('.text-loader').text('ENVIANDO CORREO ELECTRÓNICO, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                success: function (response) {
                    console.log(response)
                    if(response.respuesta === "success" ){
                        
                        Notiflix.Notify.Success('El comprobante de venta ha sido envíado de manera satisfactoria');
                        //Notiflix.Report.Success("Operación éxitosa","El comprobante de venta ha sido envíado de manera satisfactoria.", "Aceptar");

                    }else if(response.respuesta === "warning"){
                
                        Notiflix.Report.Warning("Aviso de sistema",response.error,"Aceptar");

                    }else{

                        Notiflix.Report.Failure("Ocurrio un error inesperado",response.error,"Aceptar");

                    }   
                    
                    $("#modalLoader").modal("hide");
                },
            });

        },
        function(){
           
        }
    );

}