//// <reference path="../node_modules/@types/service_worker_api/index.d.ts" />
//// <reference path="./thinkgeo/openlayers-2.10.0.d.ts" />
//// <reference path="./signalRHubs.d.ts" />

//import * as $ from 'jquery';
//import { $Ajax } from './jqAjaxCSF';
//import * as bootstrap from 'bootstrap';
//import 'bootstrap-notify';
//import * as moment from 'moment';
//import '../node_modules/@progress/kendo-ui/js/kendo.web';
//import '../node_modules/@progress/kendo-ui/js/kendo.aspnetmvc';
//import './jquery.blockUI';
//import 'SignalR';
//import 'QTip2';
//import 'jquery-validation';

interface ToolRoleObject extends kendo.data.ObservableObject {
  ToolRoleGUID: string;
}

/*export*/ namespace Main {
  //can't get moment to work.  this is a hack
  declare var moment: any;
  declare function openWindow(): void;

  export function currentUrlPrefix(): string {
    var pathname = window.location.pathname;
    var sitename = pathname.split('/')[1];
    var ret = window.location.protocol + "//" + window.location.host + "/" + sitename + "/";
    return ret;
  }
  export var cbraPush;
  var alertitemRemoved;
  var lastSignalRUpdate: Date;

}
/*export*/ class Guid {
  static emptyGuidString: string = "00000000-0000-0000-0000-000000000000";
  private static emptyGuid = new Guid(Guid.emptyGuidString);
  private id: string;
  constructor(id: string) {
    this.id = id.toLowerCase();
  }
  static empty() {
    return Guid.emptyGuid;
  }
  static newGuid() {
    return new Guid(
      Guid.s4() + Guid.s4() + "-" + Guid.s4() + "-" + Guid.s4() + "-" +
      Guid.s4() + "-" + Guid.s4() + Guid.s4() + Guid.s4()
    );
  }
  static regex(format?: string) {
    switch (format) {
      case "x":
      case "X":
        return (/\{[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}\}/i);

      default:
        return (/[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}/i);
    }
  }
  private static s4() {
    return Math
      .floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  toString(format: string) {
    switch (format) {
      case "x":
      case "X":
        return "{" + this.id + "}";

      default:
        return this.id;
    }
  }
  valueOf() {
    return this.id;
  }
}
$(document).ajaxStart(function () {
  $("#imgHeader").attr("style", "animation: blink 2s ease-in infinite");
});
$(document).ajaxStop(function () {
  //$("#imgHeader").attr("style", "animation: ");
  $("#imgHeader").css("animation", "");
});
// http://opserver2/gemini5/project/Web4434/10038/item/111598
//$(window).on("beforeunload", function () {
(<any>jQuery.fn).rotate = function (degrees) {
  $(this).css({
    '-webkit-transform': 'rotate(' + degrees + 'deg)',
    '-moz-transform': 'rotate(' + degrees + 'deg)',
    '-ms-transform': 'rotate(' + degrees + 'deg)',
    'transform': 'rotate(' + degrees + 'deg)'
  });
  return $(this);
};
//FOR IE 11
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}
/*export*/ var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();
