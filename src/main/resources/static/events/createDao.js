let h1form=document.getElementById('h1form')
h1form.addEventListener('submit', function (event) {
    if (h1form.checkValidity()) {
        $('#h1form').hide();
        $('#neinei').show();
        register_obj.create($('#maddress').val(), $('#mname').val(), $('#msname').val(), $('#mremark').val(), true)
            .then(re => {
                $('#neinei').hide();
                $('#h1formResult').show();
                $('#h1hash').html(re);
            })
    }
    h1form.classList.add('was-validated')
    event.preventDefault()
    event.stopPropagation()
}, false)