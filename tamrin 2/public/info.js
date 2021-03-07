console.log(1);
$(document).ready(function() {
    let creatTable = undefined
    let result = undefined
    let company_id = $('.company_id').val();
    let employee = undefined


    let user_id = ''
    $('body').on('click', '.tr', function() {
        user_id = ($(this).find(".id").html().trim());
        console.log(user_id);
        $.get(`/employees/${user_id}`, function(data, status) {
            employee = data
            $(".E_D").click()
            $('.editBody').html(`
                  <label >first name:</label>
            <input type="text"  id="name" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${employee.name}">
                  <label >last name:</label>
            <input type="text" id="lastName" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${employee.lastName}">
                  <label >social id:</label>
                 <input type="text" id="socialId" class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${employee.socialId}">
                  <label >manager: ${employee.manager}</label>
                  <select id="manager" class="manager form-select" aria-label="Default select example" name="manager">
                  <option value="${employee.manager}" selected disabled hidden>Choose here</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                  </select>
                  <label >birth date:</label>
                 <input type="text" id="date"  class=" form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${employee.birthDate}">
                  <label >gender: ${employee.gender}</label>
                  <select id="gender" class="gender form-select" aria-label="Default select example" name="gender">
                  <option value="${employee.gender}" selected disabled hidden>Choose here</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  </select>`)
        })
        $('body').on('click', '.Esave', function() {
            let name = $('#name').val()
            let lastName = $('#lastName').val()
            let gender = $('#gender').find(":selected").val()
            let manager = $('#manager').find(":selected").val()
            if (manager === "true") {
                manager = true
            } else {
                manager = false
            }
            let socialId = $('#socialId').val()
            let date = $('#date').val()

            function person(name, lastName, gender, manager, socialId, date, company_id) {
                this.name = name;
                this.lastName = lastName;
                this.gender = gender;
                this.birthDate = date;
                this.manager = manager;
                this.socialId = socialId;
                this.company = company_id;

            }
            let newUser = new person(name, lastName, gender, manager, socialId, date, company_id)
            console.log(newUser);
            $.ajax({
                url: `/employees/${employee._id}`,
                type: 'POST',
                data: newUser,
                success: function(data) {
                    $(function() {
                        $('.editBody').html(`<h1 >successfully changed</h1>`)
                        $('.modal-footer').html(``)
                        $('.modal-header').html(``)
                        $(".close").click()
                        setTimeout(() => {

                            window.location = `/company/${company_id}`
                        }, 2000)
                    });

                },
                error: function(err) {
                    alert(err.responseText);
                }
            });
        })
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
                url: `/employees/${employee._id}`,
                type: "DELETE",
                success: (data) => {
                    $('.editBody').html(`<h1 >successfully deleted</h1>`).css({ "background-color": "red" })
                    $('.modal-footer').html(``).css({ "background-color": "red" })
                    $('.modal-header').html(``).css({ "background-color": "red" })
                    setTimeout(() => {
                        window.location = `/company/${company_id}`
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
    $('body').on('click', '.save', function() {
        let name = $('.name').val()
        let lastName = $('.lastName').val()
        let gender = $('.gender').find(":selected").val()
        console.log(gender);
        let manager = $('.manager').find(":selected").val();
        if (manager === "true") {
            manager = true
        } else {
            manager = false
        }
        let socialId = $('.socialId').val()
        let date = $('.date').val()

        function person(name, lastName, gender, manager, socialId, date, company_id) {
            this.name = name;
            this.lastName = lastName;
            this.gender = gender;
            this.birthDate = date;
            this.manager = manager;
            this.socialId = socialId;
            this.company = company_id;

        }
        let newUser = new person(name, lastName, gender, manager, socialId, date, company_id)

        $.ajax({
            url: '/employees/',
            type: 'PUT',
            data: newUser,
            success: function(data) {
                $(function() {
                    $(".close").click()
                    $('.editBody').html(`<h1 >successfully added</h1>`)
                    $('.modal-footer').html(``)
                    $('.modal-header').html(``)
                    $(".E_D").click()
                    setTimeout(() => {
                        window.location = `/company/${company_id}`
                    }, 2000)
                });

            },
            error: function(err) {
                alert(err.responseText);
            }
        });

    })

})