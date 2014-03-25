var viewModel = {};
var fb = new Firebase("https://pray.firebaseio.com/");

$(function() {
  app.onDeviceReady();
});

$(function(){ 
  $(document)
    .foundation()
    .foundation('abide', {
      patterns: {
        text_field: /^.{0,1000}$/
      }
    }); 
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
        app.scrollToForm();
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    
        app.CreateViewModel();
        ko.applyBindings(viewModel);
        $('.prayer_list').show();

        fb.on("child_added", function(data) {
            var prayer = data.val();
            if(prayer != null) { 
                app.onSuccess(prayer.name, prayer.prayer, prayer.date, prayer.type);
            }       
        });
    },

    /********* Constructors ***********/
    CreateViewModel: function() {
        viewModel.prayers = ko.observableArray();

        viewModel.postForm = function () 
        {
            $(this).attr('disabled', 'disabled');

            var name = $("#name").val();
            var prayer = $("#request").val();
            var type = $('input[name=type]:checked', '#prayer_form').val()
            var date = app.getCurrentDate();

            fb.push({ "name" : name, "prayer" : prayer, "date" :  date, "type" : type });

            var body = $("html, body");
            body.animate({scrollTop:0}, '500', 'swing');
            app.clearForm();
        }
    },

    onSuccess: function(name, prayer, date, type) {
        var newprayer = new app.CreatePrayer(name, prayer, date, type);
        viewModel.prayers.unshift(newprayer);
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

    scrollToForm: function() {
        $("#form_link").click(function() {
            $('html, body').animate({
        scrollTop: $("#prayer_form").offset().top}, 2000);
        });
    }
};