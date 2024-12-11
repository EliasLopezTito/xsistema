let $anio = document.getElementById('anio');
let $mes = document.getElementById('mes');

document.addEventListener('change', e => {
    if (e.target.matches('#mes') || e.target.matches('#anio')) {

        if ($mes.value !== '' && $anio.value !== '') cargarAulas();

    }
});

document.addEventListener('click', e => {
    if (e.target.matches('#btnBuscar')) {
        cargarAulas();
    }
})

function generarReporte(e) {
    
    aula = e.getAttribute("data-aula");
    mes = e.getAttribute("data-mes");
    anio = e.getAttribute("data-anio");
    let formData = new FormData();
    formData.append('mes', mes);
    formData.append('anio', anio);
    formData.append('aula', aula);

    $.ajax({
        type:'POST',
        url:`${path}tutores/generarReporte`,
        data: formData,
        dataType:'json',
        contentType:false,
        processData:false,
        cache:false,
        beforeSend: function(){
            $('.text-loader').text('Estamos creando tu reporte, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data){
            console.log(data);
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
            var $a = $("<a>");
            $a.attr("href",data.file);
            $("body").append($a);
            $a.attr("download","file.xls");
            $a[0].click();
            $a.remove();
        },
        error: function(error){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
            Notiflix.Notify.Failure('Ocurrió un error al crear el reporte!');
        }
    });
}

function generarReporteConsolidado(e) {
    anio = document.getElementById('anio').value;
    mes = document.getElementById('mes').value;
    let formData = new FormData();
    formData.append('mes', mes);
    formData.append('anio', anio);

    $.ajax({
        type:'POST',
        url:`${path}tutores/reporteConsolidadoTutor`,
        data: formData,
        dataType:'json',
        contentType:false,
        processData:false,
        cache:false,
        // beforeSend: function(){
        //     $('.text-loader').text('Estamos creando tu reporte, por favor espere...');
        //     $("#modalLoader").modal();
        // },
        success: function(data){
            console.log(data);
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
            var $a = $("<a>");
            $a.attr("href",data.file);
            $("body").append($a);
            $a.attr("download","file.xls");
            $a[0].click();
            $a.remove();
        },
        error: function(error){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
            Notiflix.Notify.Failure('Ocurrió un error al crear el reporte!');
        }
    });
}

function cargarAulas() {
    
    anio = $anio.value;
    mes = $mes.value;
	$.ajax({
		url: path + "tutores/aulasTutores",
		type: "POST",
        dataType: 'json',
		data: {
            opcion: 'cargarAulas',
            anio: anio,
            mes: mes
        },
		success: function (data) {
			console.log(data);

            if (data.respuesta === 'success') {

                var tbody = $("#tablaListado tbody");
                tbody.find('tr').remove();

                if (data.aulas !== 'vacio') {

                    if (data.respuesta !== 'error') {
                        $.each(data.aulas, function(i, listado) {
                            
                            tr=`<tr>
                                    <td class='text-center'>${(i+1)}</td>
                                    <td class='text-center'>${listado.Nro_Aula.trim()}</td>
                                    <td class='text-center'>${listado.MesProgramado}</td>
                                    <td class='text-center'>${listado.AnoProgramado}</td>
                                    <td class='text-center'>
                                        <button type='button' onclick='generarReporte(this)' id='btnReporte' data-aula='${listado.Nro_Aula.trim()}' data-mes='${listado.MesProgramado}' data-anio='${listado.AnoProgramado}' class='btn boton-tabla boton-verde btn-sm'> <span class='icon-file-excel'></span></button>
                                    </td>
                                    </tr>`;
                            tbody.append(tr);
                        });

                        tr=`<tr>
                                <td class='text-center' colspan='4' style='background: #b5b5b5;'>Descargar Todo</td>
                                <td class='text-center'>
                                    <button type='button' onclick='generarReporteConsolidado(this)' id='btnReporte' class='btn boton-tabla boton-naranja btn-sm'> <span class='icon-file-excel'></span></button>
                                </td>
                                </tr>`;
                        tbody.append(tr);
                    }
                    
                } else{
                    tr="<tr><td class='text-center' colspan='5'>No hay aulas asignadas para el periodo seleccionado..</td></tr>";
                    tbody.append(tr);
                }
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al cargar las aulas!');
            }

		},
        error: function(xh, text, thr) {
            Notiflix.Notify.Failure('Ocurrió un error al cargar las aulas!');
            console.log('Hay un error: ' + thr);
        }
	});
}

