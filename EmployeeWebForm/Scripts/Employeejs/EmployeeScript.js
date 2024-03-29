﻿

//<script src="~/Scripts/knockout-3.5.1.js"></script>

$(function () {
    ko.applyBindings(CreateViewModel);
    CreateViewModel.viewEmployees();
});

//var ViewModel = new CreateViewModel()
//ViewModel.addressList = addressList;
//ko.applyBindings(ViewModel);
//ViewModel.viewEmployees();
//var AddressList = ["Hyderabad", "Chennai", "Banglore", "Vijayawada"];
var CreateViewModel =
{
    Employee: ko.observableArray([]),
    EmployeeID: ko.observable(),
    EmployeeName: ko.observable(),//.extend({ required: { message: "please enter employeeName" }, minlength: 3, maxlength: 50 }),
    EmailID: ko.observable(),//.extend({ required: { message: "please enter EmailID" }, minlength: 3, maxlength: 50 }),
    PhoneNumber: ko.observable(),//.extend({ required: { message: "please enter PhoneNumber" }, minlength: 10, maxlength: 10 }),
    Address: ko.observable(),//.extend({ required: { message: "please enter Address" }, minlength: 3, maxlength: 50 }),
    DateOfBirth: ko.observable(),//.extend({ required: { message:"please Select date" } }),
    DateOfJoining: ko.observable(),//.extend({ required: { message:"please Select date" } }),
    Salary: ko.observable(),//.extend({ required: { message: "please enter Salary" }, minlength: 4, maxlength: 50 }),
    //AddressList: ko.observable(),
    //errors: ko.validation.group(CreateViewModel, {deep:true,observable:false}),
    showCreateForm: ko.observable(true),
    clearErrorContainer: function () {
        var errorElements = document.getElementsByClassName('errorStyle');
        for (var i = 0; i < errorElements.length; i++) {
            errorElements[i].textContent = '';
            errorElements[i].classList.remove('errorStyle'); // Remove CSS class
        }
    },

    validate: function () {
        this.clearErrorContainer();

        var isValid = true;
        if (!this.EmployeeName() || this.EmployeeName().length < 3 || this.EmployeeName().length > 50) {
            this.displayValidationError('EmployeeName', 'Please enter a valid employee name');
            isValid = false;
        }

        if (!this.EmailID() || this.EmailID().length < 3 || this.EmailID().length > 50 || (!this.EmailID().endsWith('@gmail.com') && !this.EmailID().endsWith('@amtpl.com') && !this.EmailID().endsWith('@yahoo.com'))) {
            this.displayValidationError('EmailID', 'Please enter a valid email address');
            isValid = false;
        }

        if (!this.PhoneNumber() || this.PhoneNumber().length > 10 || this.PhoneNumber().length < 10 || isNaN(this.PhoneNumber())) {
            this.displayValidationError('PhoneNumber', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        if (!this.Address() || this.Address().length < 3 || this.Address().length > 50) {
            this.displayValidationError('Address', 'Please enter a valid address');
            isValid = false;
        }

        if (!this.DateOfBirth()) {
            this.displayValidationError('DateOfBirth', 'Please select a date of birth');
            isValid = false;
        }

        if (!this.DateOfJoining()) {
            this.displayValidationError('DateOfJoining', 'Please select a date of joining');
            isValid = false;
        }

        if (!this.Salary() || this.Salary().length < 4 || this.Salary().length > 50 || isNaN(this.Salary())) {
            this.displayValidationError('Salary', 'Please enter employee salary in Numbers ');
            isValid = false;
        }
        return isValid;
    },
    displayValidationError: function (propertyName, errorMessage) {
        var errorElement = document.getElementById(propertyName + '-error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('errorStyle'); // CSS 
        }
    },


    viewEmployees: function () {
        var add = document.getElementById('create');
        add.type = "button";
        var edit = document.getElementById('edit')
        edit.type = "hidden";
        var self = this;

        try {
            $.ajax({
                url: '/Employee/Index',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    self.Employee(data);
                    $('#employeeTable').DataTable();

                    $(document).ready.function()
                    {
                        $('#employeeTable').DataTable({
                            data: self.Employee(),
                            columns: [
                                { data: 'EmployeeName' },
                                { data: 'EmailID' },
                                { data: 'PhoneNumber' },
                                { data: 'Address' },
                                { data: 'DateOfBirth' },
                                { data: 'DateOfJoining' },
                                { data: 'Salary' }
                            ],
                            searching: true,
                            paging: true,

                            footerCallback: function (row, data, start, end, display) {
                                var app = self.app();
                                $(app.column(0).footer()).html('<input type="text" placeholder="search EmployeeID"/>');
                                $(app.column(1).footer()).html('<input type="text" placeholder="search EmployeeName"/>');
                                $(app.column(2).footer()).html('<input type="text" placeholder="search EmailID"/>');
                                $(app.column(3).footer()).html('<input type="text" placeholder="search PhoneNumber"/>');
                                $(app.column(4).footer()).html('<input type="text" placeholder="search Address"/>');
                                $(app.column(5).footer()).html('<input type="text" placeholder="search DateOfBirth"/>');
                                $(app.column(6).footer()).html('<input type="text" placeholder="search DateOfJoining"/>');
                                $(app.column(7).footer()).html('<input type="text" placeholder="search Salary"/>');
                            }
                        });
                    }
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Employee/Index';
        }
    },

    SaveEmployee: function () {
        if (this.validate()) {
            $.ajax({
                url: '/Employee/Create',
                type: 'POST',
                dataType: 'json',
                data: ko.toJSON(this),
                contentType: 'application/json',
                success: function (result) {
                },
                error: function (err) {
                    if (err.responseText == "Creation Failed") {
                        alert("Creation error")
                        window.location.href = '/Employee/Create/';
                    }
                    else {
                        alert("Status:" + err.responseText);
                        window.location.href = '/Employee/Create/';
                    }
                },
                complete: function ()
                {
                    CreateViewModel.showCreateForm(false);
                    window.location.href = '/Employee/Create/';
                },
            });
        }
        showCreateForm: Function()
        {
            var app = self.app();
            app.$('#employeeTable').show();
            app.$('#createEmployeeContainer').hide();
        }       
    },
    
        EditEmployee: function () {
            if (this.validate()) {
                $.ajax({
                    url: '/Employee/Edit',
                    type: 'post',
                    dataType: 'json',
                    data: ko.toJSON(this),
                    contentType: 'application/json',
                    success: function (result) {
                    },
                    error: function (err) {
                        if (err.responseText == "Creation Failed") {
                            window.location.href = '/Employee/Create/';
                        }
                        else {
                            alert("Status:" + err.responseText);
                            window.location.href = '/Employee/Create/';;
                        }
                    },
                    complete: function () {
                        window.location.href = '/Employee/Create/';
                    }
                });
            }
        },

        Export: function () {
            $.ajax({
                url: '/Employee/Export',
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                },
                error: function (err) {
                    if (err.responseText == "Creation Failed") { window.location.href = '/Employee/Create/'; }
                    else {
                        alert("Status:" + err.responseText);
                        window.location.href = '/Employee/Create/';;
                    }
                },
                complete: function () {
                    window.location.href = '/Employee/Create/';
                }
            });
        },

}

self.EditEmployee = function (emp) {
    var add = document.getElementById('create');
    add.type = "hidden";
    var edit = document.getElementById('edit')
    edit.type = "button";
    CreateViewModel.EmployeeID(emp.EmployeeID);
    CreateViewModel.EmployeeName(emp.EmployeeName);
    CreateViewModel.EmailID(emp.EmailID);
    CreateViewModel.PhoneNumber(emp.PhoneNumber);
    CreateViewModel.Address(emp.Address);
    CreateViewModel.DateOfBirth(emp.DateOfBirth);
    CreateViewModel.DateOfJoining(emp.DateOfJoining);
    CreateViewModel.Salary(emp.Salary);
};
self.DeleteEmployee = function (emp) {
    $.ajax({
        url: '/Employee/Delete/' + emp.EmployeeID,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
        },
        error: function (err) {
            if (err.responseText == "Deletion Failed") {
                window.location.href = '/Employee/Create/';
            }
            else {
                alert("Status:" + err.responseText);
                window.location.href = '/Employee/Create/';;
            }
        },
        complete: function () {
            window.location.href = '/Employee/Create/';
        }
    });
};

function Employee(data)
{
    this.EmployeeID = ko.observable(data.EmployeeID);
    this.EmployeeName = ko.observable(data.EmployeeName);
    this.EmailID = ko.observable(data.EmailID);
    this.PhoneNumber = ko.observable(data.PhoneNumber);
    this.Address = ko.observable(data.Address);
    this.DateOfBirth = ko.observable(data.DateOfBirth);
    this.DateOfJoining = ko.observable(data.DateOfJoining);
    this.Salary = ko.observable(data.Salary);
};
