//The  script wrapper consists of a self-executing anonymous function (or an immediately-invoked

// This outer function is wrapped in parentheses, and has an extra pair of brackets at the end which cause the anonymous function to execute and return immediately function expression if you prefer).

// This creates closure and protects the name space

(function () {

// Begins on page 92


// tags is set as an empty string and will be used throughout the project
var tags = "",

// getBounties will be used to grab the ajax requests. We'll define up here and use it throughout
getBounties = function(page, callback) {

// Page 95 - Now, call the ajax method and set all it's properties
  $.ajax({
    url: "https://api.stackexchange.com/2.0/questions/featured",
        dataType : "jsonp",
          data: {
            page: page,
            pagesize: 10,
            tagged: tags,
            order: "desc",
            sort: "activity",
            site: "stackoverflow",

// This is a custom filter for the results to return. No authentication needed for it
    filter: "!)4k2jB7EKv1OvDDyMLKT2zyrACssKmSCXeX5DeyrzmOdRu8sC5L8d7X3ZpseW5o_nLvVAFfUSf"
    },
// beforeSend is loading up the loader animation thing
    beforeSend: function(){
      $.mobile.loadingMessageTextVisible = true;
      $.mobile.showPageLoadingMsg("a", "Searching");
    }
// an annonymous funtion to run when complete
  }).done(function (data) {
// within it we invoke a callback to getBounties above and grab the data from the API response
    callback (data);
  });
};

// Page 97 - Using pageinit b/c it's more reliable when using jQ Mobile. On pageinit find the welcome id and run a function on it

$(document).on("pageinit", "#welcome", function(){

  $("#search").on("click", function(){
// add the ui-disabled class to the closest ui-btn
    $(this).closest('ui-btn')
      .addClass('ui-disabled');

//Grab the value that's entered into the search form and set it to the tag variable
      tags = $("tags").val();

      data.currentPage = 1;

// In local storage you can only store arrays and primitive types, so we run the JSON.stringify to get that number
      localStorage.setItem("res", JSON.stringify(data));

//
      $.mobile.changePage("bounty-hunter-list.html", {
          transition: "slide"
    });
  });
});

// Change the page displayed for the search results
$(document).on("pageshow", "#welcome", function(){
    $("#search").closest(".ui-btn")
      .removeClass('ui-disabled');
});

$(document).on("pageinit", "#list", function(){

  var data = JSON.parse(localStorage.getItem("res")),
      total = parseInt(data.total, 10),
      size = parseInt(data.page_size, 10),
      totalPages = Math.ceil(total / size),
      months = {
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      };

    var createDate = function (date){
      var cDate = new Date (date * 1000),
          fDate = [
            cDate.getDate(), months[cDate.getMonth()],
            cDate.getFullYear()
          ].join(" ");

          return fDate;
        }

        $.views.helpers({ CreateDate: createDate});

        $("#results").append($("#listTemplate")
                    .render(data))
                    .find("ul")
                    .listview();

      var setClasses = function (){
        if (data.currentPage > 1) {
          $("a[data-icon='back']").removeClass("ui-disabled");
        } else {
          $("a [data-icon='back']").addClass('ui-disabled');
      }
        if (data.currentPage < totalPages) {
          $("a [data-icon='forward']").removeClass('ui-disabled');
        } else {
          $("a [data-icon='forward']").addClass('ui-disabled');
    }
};

  $("span.num").text(data.currentPage);
  $("span.of").text(totalPages);

  if (totalPages > 1) {
  $("a[data-icon='forward']").removeClass('ui-disabled');
  }

});

  // PAGE 111 - page 128

  $("results").on("click", "li", function (){

  var index = $(this).find("a").attr("id").split("-")[1],
    question = data.items[index];

    question.pageid = "item-view-" + index;

    $("body").append($("#itemTemplate").render(question));

    var page = $("#item-view-" + index);

    page.attr("data-external-page", true).on("pageinit", $.mobile._bindPageRemove);
    $.mobile.changePage(page, {
      transition: "slide"
    });

  });

	//
} ());