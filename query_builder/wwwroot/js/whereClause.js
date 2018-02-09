var counter = 0;
var SqlWhereClause = function ()
{
    this.date = ["=", "!="];
    this.integer = ["<", ">", "<=", ">=", "=", "!=", "BETWEEN"];
    this.real = ["<", ">", "<=", ">=", "=", "!="];
    this.text = ["=", "!="];
    this.boolean = ["=", "=!"];
    this.time = ["=", "=!"];
    this.ConditionPane = $(".conditiong-gp-container");
    this.where_cond_grp = $(".where_cond_grp");
    this.IdCounters = { TableCount: 0 };
    this.groupCounter = 1;
    this.MlayerDrop = {
        state: {
            dropAction: function () { },
            dropTimer: null
        },
        registerDrop: function (cb) {
            this.MlayerDrop.state.dropAction = cb;
            if (this.MlayerDrop.state.dropTimer) {
                clearTimeout(this.MlayerDrop.state.dropTimer);
            }
            this.MlayerDrop.state.dropTimer = setTimeout(function () {
                this.MlayerDrop.state.dropAction();
            }.bind(this), 2);
        }.bind(this)
    };

    this.init = function () {
        this.makeDroppable();
        $(".conditiong-gp-container .addGroup").off("click").on("click", this.addGroupCondition.bind(this));
        //$("#group0").off("click").on("click", this.groupButtonClick.bind(this));
       
    };

    this.addGroupCondition = function (e)
    {
            var appendloc = $(e.target).parents(1).siblings(".conditiong-gp-container-body")
            this.appendGroupCondition(appendloc);     
    }

    this.appendGroupCondition = function (appendloc)
    { 
        var objid = "groupCondition" + this.groupCounter++;
        var bodyid = "groupBody" + this.groupCounter++;
        appendloc.append(`<div class="cond-grp2"  id= "${objid}" >
            <div class=" conditiong-gp-container-header form-inline">
                <div class="btn-group btn-toggle where-toggle">
                    <button class="btn btn-sm btn-default">AND</button>
                    <button class="btn btn-sm btn-primary active">OR</button>
                </div>
                <div class="btn-group where-btns">
                   <button type="button" data-counter="${counter}" class="btn btn-xs btn-success where-btn2 addGroup" id="group${counter}"><i class="glyphicon glyphicon-plus-sign"></i>Group</button>
                </div>
            </div>
            <div class="m-l-35 conditiong-gp-container-body" id="${bodyid}">
             </div>`);
        $("#" + objid + " .addGroup").on("click", this.addGroupCondition.bind(this));
        $("#firstBody").droppable({
            accept: ".dragables",
            drop: this.onwhereDropFn.bind(this)
        });
        $("#" + bodyid).droppable({
            accept: ".dragables,.droped",
            drop: this.onwhereDropFn.bind(this)
        });
    };


    this.makeDroppable = function ()
    {
        $(".dragables").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body",
        });

        $(".conditiong-gp-container").droppable({
           accept: ".dragables",
          drop: this.onwhereDropFn.bind(this)
        });
      

    };

    this.onwhereDropFn = function (event, ui)
    {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.droploc_id = $(event.target).attr("id");
        if (this.dropObj.hasClass("droped")) //conditions drag from one box,then droped into another box
        {
            $(event.target).append($(ui.draggable).detach().css({ 'top': '0px', 'left': '0px' }));
        }
        else {
            this.MlayerDrop.registerDrop(function () {
                this.columnName = $(ui.draggable).attr('colname');
                this.datatype = $(ui.draggable).attr('datatype')
                this.condId = this.columnName + this.IdCounters["TableCount"]++;
                this.oncond();

            }.bind(this));
        }
    };


    this.oncond = function ()
    {
        this.droploc.append(`<form><div class="droped row " id="${this.condId}">
                <div class="col-sm-2 frst">${this.columnName}</div>
                <div class="col-sm-3 sec"><select class="form-control" id="select_id" ></select></div>
                <div class="col-sm-5 third"><input type="text" class="form-control" id="myText"></div>
                <div class="col-sm-2">
                    <div class="col-sm-4 fourth btn-group" ><button class="glyphicon glyphicon-edit"></button></div>
                    <div class="col-sm-4 fourth btn-group" ><button class="checkbtn"><i class="glyphicon glyphicon-check"></i></button></div>
                    <div class="col-sm-4 fourth btn-group" ><button onclick="$('#${this.condId}').remove()"><i class="glyphicon glyphicon-remove"></i></button></div>
                </div>
            </div></form>`);
       
        this.datatype_check(this.condId);
        $(".checkbtn").on("click", this.checkBtnFun.bind(this));
    }
   
    this.datatype_check = function ($container) {
        if (this.datatype == "text") {
            this.loopcheck(this.text, $container);
        }
        else if (this.datatype == "integer") {
            this.loopcheck(this.integer, $container);
        }
        else if (this.datatype == "date") {
            this.loopcheck(this.date, $container);
        }
        else if (this.datatype == "real") {
            this.loopcheck(this.real, $container);
        }
        else if (this.datatype == "boolean") {
            this.loopcheck(this.boolean, $container);
        }
        else if (this.datatype == "time") {
            this.loopcheck(this.time, $container);
        }
    }
    this.checkBtnFun = function (event) {

    }
    this.loopcheck = function (arr, $container) {
        for (i = 0; i < arr.length; i++) {
            $("#" + $container + " select").append(`<option value="equal">${arr[i]}</option>`);
        }
        $(".droped").draggable();
    }

    this.groupButtonClick = function () {
        var x = $(event.target).attr("data-counter");
        counter++;
        this.conditionGroupClick(x);
    };

    this.condButtonClick = function () {
        var x = $(event.target).attr("data-counter");
        counter++;
        this.conditionClick(x);
    };

    this.conditionGroupClick = function (x)
    {
          
        $(".conditiong-gp-container-body" + x).append(`<div class="cond-grp2"  id="${this.objId}">
                            <div class=" conditiong-gp-container-header form-inline">
                                <div class="btn-group btn-toggle where-toggle">
                                    <button class="btn btn-sm btn-default">AND</button>
                                    <button class="btn btn-sm btn-primary active">OR</button>
                                </div>
                                 <div class="btn-group where-btns">
                                    
                                    <button type="button" data-counter="${counter}" class="btn btn-xs btn-success where-btn2" id="group${counter}"><i class="glyphicon glyphicon-plus-sign"></i>Group</button>
                                </div>
                             </div>
                            <div class="m-l-35 conditiong-gp-container-body">
                                  
                                 </div>`);
     
     $(`#group${counter}`).off("click").on("click", this.groupButtonClick.bind(this));
        
       // $(`.conditiong-gp-container-body${counter}`).droppable({ accept: ".dragables", drop: this.onwhereDropFn.bind(this) });
    }
    
    this.init();
};