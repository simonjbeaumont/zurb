var viewModel = {};
var masterList = new Array();

$(function() {
  app.onDeviceReady();
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    
        app.initForm();

        /******** Setting Prayer List ********/    
        $.ajax({
            url: "https://api.mongolab.com/api/1/databases/prayerrequests/collections/prayers?apiKey=b_xGNRQ8Z1eJvZcBB1OyqrPRmCEoH_JK",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                
                /****** Draw prayer list ******/
                app.CreateViewModel(data);
                ko.applyBindings(viewModel);
                $('.prayer_list').show();
                masterList = data;
            }
        });
    },

    /********* Constructors ***********/
    CreateViewModel: function(data) {
        viewModel.prayers = ko.observableArray();
                
        for(var i = 0; i < data.length; i++)
        {
            viewModel.prayers.push(new app.CreatePrayer(data[i].name, data[i].prayer, data[i].date, data[i].type));
        }
                
        viewModel.postForm = function () 
        {
            var name = $("#name").val();
            var prayer = $("#request").val();
            var type = $("#type").val();
            var date = app.getCurrentDate();

            $.ajax( { url: "https://api.mongolab.com/api/1/databases/prayerrequests/collections/prayers?apiKey=b_xGNRQ8Z1eJvZcBB1OyqrPRmCEoH_JK",
              data: JSON.stringify( { "name" : name, "prayer" : prayer, "date" :  date, "type" : type } ),
              type: "POST",
              contentType: "application/json",
              success: function() { app.onSuccess(name, prayer, date, type); }
            });
        }
    },

    onSuccess: function(name, prayer, date, type) {
        var newprayer = new app.CreatePrayer(name, prayer, date, type);
        viewModel.prayers.push(newprayer);
        masterList.push(newprayer);
        app.clearForm();
    },

    CreatePrayer: function(name, prayer, date, type) {
        this.name = name;
        this.prayer = prayer;
        this.date = date;
        this.type = type;
    },

    /********** Helpers ***********/
    getCurrentDate: function() {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        return day + "/" + month + "/" + year;
    },     

    getRandom: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    clearForm: function() {
        $('input[type=submit]').removeAttr("disabled");

        $('#prayer_form').each(function(){
            this.reset();
        });
    },

    initForm: function() {
        $('input[type=submit]').click(function() {
            $(this).attr('disabled', 'disabled');
            $(this).parents('form').submit()
        });
    }
};
