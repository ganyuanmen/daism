let h2form=document.getElementById('h2form')
h2form.addEventListener('submit', function (event) {
    if (h2form.checkValidity()) {
        $('#h2form').hide();
        $('#neinei').show();
        logos_obj.changeLogo($('#logoDaoList').val(), $('#selectDaoLogo').html())
            .then((re) => {
                $('#neinei').hide();
                $('#h1formResult').show();
                $('#h1hash').html(re);
            });
    }

    h2form.classList.add('was-validated')
    event.preventDefault()
    event.stopPropagation()
}, false)


