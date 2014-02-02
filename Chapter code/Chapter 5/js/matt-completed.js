// This is a immediately invoked anonymous function
// The semicolon in the front protects our code from other jQuery plugins that might not have stopped executing. This is just in case another plugin didn't end its functions with a semicolon
;(function ($) {


// Let's declare our variables

// This is an object literal that will be used as a configuration object for our plugin
var defaults = {

  // An object within the parent object. this one is for all the text strings we'll use in the plugin. This will make it easier to localize
  strings: {
    title: "Up - jQuery uploader",
    dropText: "drag files here",
    altText: "Or select using the button",
    buttons: {
      choose: "Choose files",
      upload: "Upload files"
    },
    tableHeadings: [
      "Type", "Name", "Size", "Remove all x"
    ]
  }
}


// This is a constructor function that will generate instances of our widget. Capitalize the first letters because that's the convention for functions that we'll instantiate with the New keyword

// Our constructor accepts two arguments. the first is a jQuery element or collection of elements and the second is a configuration object defined by the developer using our plugin
function Up(el, opts) {
// Used to merge two objects together. It extend Jquery's method. defaults and opts will be merged here
  this.config = $.extend(true, {}, defaults, opts);

// Store a reference to the element so that we can operate on it later on
  this.el;

// Theses are empty arrays that we'll use to store the objects that we upload.
  this.fileList = [];
  this.allXHR = [];
}


// jQuery provides the fn to access its prototype, which is how jQuery is extended
$.fn.up = function(options) {
  new Up(this, options).init();
  return this;
};


Up.prototype.init = function(){
  var widget = this,
    strings = widget.config.strings,
    container = $("<article/>", {
      "class": "up"
  }),

  heading = $("<header/>").appendTo(container),
  title = $("<h1/>", {
    text: strings.title
  }).appendTo(heading),

    drop = $("<div/>", {
    "class": "up-drop-target",
    html: $("<h2/>", {
      text: strings.dropText
    })

  }).appendTo(container),
  alt = $("<h3/>", {
    text: strings.altText
    }.appendTo(container),
     upload = $("<input/>", {
        type: "file"
      }).prop("multiple", true).appendTo(container),
      select = $("<a/>"), {
        href: "#",
        "class": "button up-choose",
        text: strings.buttons.choose
      }).appendTo(container),
  selected = $("<div/>", {
    "class": "up-selected"
  }).appendTo(container),
upload = $("<a/>", {
    href: "#",
    "class": "button up-upload",
    text: strings.buttons.upload
}).appendTo(container);

  widget.el.append(container);
}

widget.el.on("click", "a.up-choose", function(e) {
  e.preventDefault();

  widget.el.find("input[type = 'file']").click();

});

  widget.el.on("drop change dragover", "article.up", function(e){

    if (e.type === "dragover") {
        e.preventDefault();
        e.stopPopagation();
        return false;
    } else if (e.type === "drop") {
        e.preventDefault();
        e.stopPopagation();
        widget.files = e.originalEvent.dataTransfer.files;
    } else {
        widget.files = widget.el
        .find("input[type = 'file']") [0]
        .files;
    }

    widget.handleFiles();

});

Up.prototype.handleFiles = function() {
  var widget = this,
      container = widget.el.find("div.up-selected"),
      row = $("<tr/>"),
      cell = $("<td/>"),
      remove = $("<a/>", {
        href: "#"
      }),
table;

if (!container.find("table").length) {
  table = $("<table/>");

  var header = row.clone().appendTo(table),
      strings = widget.config.strings.tableHeadings;

    $.each(strings, function(i, string) {
      var cs = string.toLowerCase().replace(/\s/g, "_"),
        newCell = cell.clone().addClass("up-table-head " + cs).appendTo(header);

      if (i === strings.length - 1) {
        var clear = remove.clone().text(string).addClass("up-remove-all");

        newCell.html(clear).attr("colspan", 2);
      } else {
        newCell.text(string);
      }
    });

    } else {
      table = container.find("table");


}

$.each(widget.files, function(i, file){

  var fileRow = row.clone(),
      filename = file.name.split("."),
      ext = filename[filename.length - 1],
      del = remove.clone().text("x").addClass("up-remove");

      cell.clone()
        .addClass("icon " + ext)
        .appendTo(filerow)

      cell.clone()
        .text(file.name).appendTo(fileRow);
      cell.clone()
        .text((Math.round(file.size / 1024)) + " kb" )
        .appendTo(fileRow);

      cell.clone()
      .html(del).appendTo(fileRow);

      cell.clone()
      html("<div class='up-progress'/>")
      appendTo(fileRow);

      fileRow.appendTo(table);

      widget.fileList.push(file);
    });

    if (!container.find("table").length){
      table.appendTo(container);
  }
}

// This anonymous function wrapper will ensure that the plugin will work with jQuery's noConflict () method by locally storing the $ character within our plugin and passing the jQuesry object into the anonymous function

}(jQuery));