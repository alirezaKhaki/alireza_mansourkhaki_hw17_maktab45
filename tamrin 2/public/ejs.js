$(document).ready(function() {
    let creatTable = undefined
    let result = undefined


    $.get('/company/all', function(data, status) {
        console.log(status);
        console.log(data);
        result = data;
        let company = undefined
        $('body').on('click', '.search', function() {
            let from = $('#from_date').val()
            let to = $('#to_date').val()
            console.log(from);
            let date = {
                to: `${to}`,
                from: `${from}`
            }
            let urlParameters = Object.entries(date).map(e => e.join('=')).join('&');
            console.log(urlParameters);

            window.location.href = `/company/age/${urlParameters}`

        })
        $('body').on('click', '.tr', function() {
            let companyId = ($(this).find(".id").html().trim());

            for (let i in result) {
                if (result[i]._id == companyId) {
                    console.log(result[i]);
                    company = result[i]
                } else {
                    console.log(false);
                }
            }

            console.log(company);

            $('.editBody').html('')
            setTimeout(() => {
                $(".E_D").click()
            }, 2000)

            $('.editBody').html(`
        <input type="text"  id="name" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${company.name}">
        <input type="number" id="createId" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${company.creatId}">
        <input type="number" id="number" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${company.number}">
        <input type="text" id="city" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${company.city}">
        <input type="text" id="province"  class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${company.province}">
        <input type="text" id="date" form-control" class="" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${company.dateOfCreation}">`)

            $('body').on('click', '.Esave', function() {
                let name = $('#name').val()
                let id = $('#createId').val()
                id = Number(id)
                let number = $('#number').val()
                number = Number(number)
                let city = $('#city').val()
                let province = $('#province').val()
                let date = $('#date').val()

                function person(name, id, city, province, number, date) {
                    this.name = name;
                    this.creatId = id;
                    this.city = city;
                    this.province = province;
                    this.number = number;
                    this.dateOfCreation = date;
                }
                let neWcompany = new person(name, id, city, province, number, date)

                $.post(`/company/${company._id}`, (neWcompany), function(result) {
                    $('.editBody').html(`<h1 style="color: rgb(99, 97, 97);">successfully changed</h1>`).css({ "background-color": "rgba(57, 247, 57, 0.74)" })
                    $('.modal-footer').html(``).css({ "background-color": "rgba(57, 247, 57, 0.74)" })
                    $('.modal-header').html(``).css({ "background-color": "rgba(57, 247, 57, 0.74)" })
                    setTimeout(() => {
                        window.location = '/company/companiesPage'
                    }, 2000)

                });

            })
            $('body').on('click', '.delete', function() {

                let txt;
                if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS COMPANY?")) {
                    txt = true;
                } else {
                    txt = false;
                }
                if (txt === true) {
                    $.ajax({
                        url: `/company/${company._id}`,
                        type: "DELETE",
                        success: (data) => {
                            $('.editBody').html(`<h1 >successfully deleted</h1>`).css({ "background-color": "red" })
                            $('.modal-footer').html(``).css({ "background-color": "red" })
                            $('.modal-header').html(``).css({ "background-color": "red" })
                            setTimeout(() => {
                                window.location = '/company/companiesPage'
                            }, 2000)
                        },
                        error: function(err) {
                            alert(err.responseText);
                        }

                    })

                } else {
                    $(".modal .Eclose").click()
                }

            })
        })

        $('body').on('click', '.save', function() {
            let name = $('.name').val()
            let id = $('.createId').val()
            id = Number(id)
            let number = $('.number').val()
            number = Number(number)
            let city = $('.city').val()
            let province = $('.province').val()
            let date = $('.date').val()

            function person(name, id, city, province, number, date) {
                this.name = name;
                this.creatId = id;
                this.city = city;
                this.province = province;
                this.number = number;
                this.dateOfCreation = date;
            }
            let company = new person(name, id, city, province, number, date)

            $.ajax({
                url: '/company/',
                type: 'PUT',
                data: company,
                success: function(data) {
                    $(function() {
                        $(".close").click()
                        $('.editBody').html(`<h1 >successfully added</h1>`)
                        $('.modal-footer').html(``)
                        $('.modal-header').html(``)
                        $(".E_D").click()
                        setTimeout(() => {
                            window.location = '/company/companiesPage'
                        }, 2000)
                    });

                },
                error: function(err) {
                    alert(err.responseText);
                }
            });
        })
    })
});