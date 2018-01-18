function LineItems_Databound(cellVal, staticguid) {
    var thereturn = '<div class="btn-group" ><button data-toggle="dropdown" ';
    if (cellVal === 'Red') {
        thereturn = thereturn + 'class="btn btn-danger dropdown-toggle"><strong>Red';
    }
    else if (cellVal === 'Yellow') {
        thereturn = thereturn + 'class="btn btn-warning dropdown-toggle"><strong>Yellow';
    }
    else if (cellVal === 'Green') {
        thereturn = thereturn + 'class="btn btn-success dropdown-toggle"><strong>Green';
    }
    else {
        thereturn = thereturn + 'class="btn dropdown-toggle"><strong>Grey';
    }
    thereturn = thereturn + '</strong>&nbsp;&nbsp;<span class="caret"></span></button><ul class="dropdown-menu"  role="menu" ><li><a class="btn btn-danger" onclick="SetStatus(\'' + staticguid + '\',\'Red\');">Red</a></li><li><a class="btn btn-warning" onclick="SetStatus(\'' + staticguid + '\',\'Yellow\');">Yellow</a></li><li><a class="btn btn-success" onclick="SetStatus(\'' + staticguid + '\',\'Green\');">Green</a></li><li><a class="btn btn-default" onclick="SetStatus(\'' + staticguid + '\',\'Grey\');">Grey</a></li></ul></div>';
    return thereturn;
}
function LineItems_Databounddisabled(cellVal, staticguid) {
    var thereturn = '<span ';
    if (cellVal === 'Red') {
        thereturn = thereturn + 'class="label label-danger"><strong>Red';
    }
    else if (cellVal === 'Yellow') {
        thereturn = thereturn + 'class="label label-warning dropdown-toggle"><strong>Yellow';
    }
    else if (cellVal === 'Green') {
        thereturn = thereturn + 'class="label label-success dropdown-toggle"><strong>Green';
    }
    else {
        thereturn = thereturn + 'class="label label-default"><strong>Grey';
    }
    thereturn = thereturn + '</strong></span>';
    return thereturn;
}
function restoreEvent(theUrl, staticGUID, toolname) {
    $Ajax.ajaxAntiForgery({
        url: theUrl,
        type: 'POST',
        data: {
            StaticGUID: staticGUID,
            ToolName: toolname
        },
        success: function (response) {
            if (response.success === false) {
                $.notify({ message: response.Message }, { type: 'danger' });
            }
            else {
            }
        },
        error: function (xhr, status, error) {
            Main.handlejqerr(xhr, status, error);
        }
    });
}
//# sourceMappingURL=cobartsStatus.js.map