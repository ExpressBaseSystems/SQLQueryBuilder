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
    this.WHEREclouseQ = {};
  
    this.ConditionGroup = function (){   //Constructor
        this.id = null;
        this.operator = "";
        this.ConditionGroup_Coll = [];
        this.Condition_Coll = [];
    };

    this.Condition = function () {  //Constructor
        this.id = null;
        this.CName = "";
        this.Operator = "";
        this.Value = "";
    };

    this.WHEREclouseQ = new this.ConditionGroup();

    this.MlayerDrop = {
        state: {
            dropAction: function () { },
            dropTimer: null
        },
        registerDrop: function (cb)
        {
            this.MlayerDrop.state.dropAction = cb;
            if (this.MlayerDrop.state.dropTimer) {
                clearTimeout(this.MlayerDrop.state.dropTimer);
            }
            this.MlayerDrop.state.dropTimer = setTimeout(function () {
                this.MlayerDrop.state.dropAction();
            }.bind(this), 2);
        }.bind(this)
    };

    this.init = function ()
    {
        this.makeDroppable();
        $(".conditiong-gp-container .addGroup").off("click").on("click", this.addGroupCondition.bind(this));
        //$("#group0").off("click").on("click", this.groupButtonClick.bind(this));
        $("#firstBody").droppable({
            accept: ".dragables,.droped",
            drop: this.onwhereDropFn.bind(this)
        });
        this.WHEREclouseQ.id = "firstBody";    //add id into box
    };

    this.addGroupCondition = function (e)
    {
        var appendloc = $(e.target).parents(1).siblings(".conditiong-gp-container-body");
        this.locid = $(e.target).parents(1).siblings(".conditiong-gp-container-body").attr("id");
        this.appendGroupCondition(appendloc);   
    }

    this.appendGroupCondition = function (appendloc)
    { 
        var objid = "groupCondition" + this.groupCounter++;
        this.bodyid = "groupBody" + this.groupCounter++;
        
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
            <div class="m-l-35 conditiong-gp-container-body" id="${this.bodyid}">
             </div>`);

        this.cg = new this.ConditionGroup();// new box object created
        this.cg.id = this.bodyid;         //add id into box
       
        if (this.locid == "firstBody")
        {
            this.WHEREclouseQ.ConditionGroup_Coll.push(this.cg);
        }
        else {
            this.recCondGrp(this.WHEREclouseQ.ConditionGroup_Coll);
        }
       

        $("#" + objid + " .addGroup").on("click", this.addGroupCondition.bind(this));
       
        $("#" + this.bodyid).droppable({
            accept: ".dragables,.droped",
            drop: this.onwhereDropFn.bind(this)
        });


    };

    this.recCondGrp = function (Coll) {
        for (var i = 0; i < Coll.length; i++) {
            if (this.locid == Coll[i]['id']) {
                Coll[i].ConditionGroup_Coll.push(this.cg); // push condition into condition collection
                return false;
            }
            else
                this.recCondGrp(Coll[i].ConditionGroup_Coll);
        }
    }

    this.makeDroppable = function ()
    {
        $(".dragables").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body",
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
            this.dropobj_id = this.dropObj.attr("id");
            if (this.dragloc == "firstBody")
            {
                for (var i = 0; i < this.WHEREclouseQ.Condition_Coll.length; i++)
                {
                    if (this.dropobj_id == this.WHEREclouseQ.Condition_Coll[i]['id'])
                    {
                        this.firstBody_cond = this.WHEREclouseQ.Condition_Coll[i];
                        var index = this.WHEREclouseQ.Condition_Coll.indexOf(this.firstBody_cond);
                        this.WHEREclouseQ.Condition_Coll.splice(index, 1);
                        return false;
                    }
                }
            }
            else
            {
                this.recDropCond(this.WHEREclouseQ.ConditionGroup_Coll);

            }


        }
        else
        {
            this.MlayerDrop.registerDrop(function () {
                this.columnName = $(ui.draggable).attr('colname');
                this.datatype = $(ui.draggable).attr('datatype')
                this.condId = this.columnName + this.IdCounters["TableCount"]++;
                this.oncond();

            }.bind(this));
        }
    };

    this.recDropCond = function (coll)
    {
        var temp = false;
        for (var i = 0; i < coll.length; i++)
        {
            for (var j = 0; i < coll[i].Condition_Coll.length; j++)
            {
                if (this.dropobj_id == coll[i].Condition_Coll[j]['id'])
                {                  
                    this.next_cond = coll[i].Condition_Coll[j];
                    var index = coll[i].Condition_Coll.indexOf(this.next_cond);
                    coll[i].Condition_Coll.splice(index, 1);                   
                    temp = true;
                } 
                if (temp)
                    break;
            } 
            if (temp)
                break;
        }
        if (!temp)
            this.recCond(coll.ConditionGroup_Coll);
        return false;
    }

    this.oncond = function ()
    {
        this.droploc.append(`<div class="droped form-inline" id="${this.condId}">
                <div class="d-inline">${this.columnName}</div>
                <select class="form-control d-inline" id="select_id" ></select>
                <input type="text" class="form-control d-inline" id="myText">
                <button class="btn btn-default pull-right"><i class="fa fa-edit fa-lg"></i></button>
                <button class="btn btn-default pull-right" id="checkbtn"><i class="fa fa-check fa-lg"></i></button>
                <button class="btn btn-default pull-right" onclick="$('#${this.condId}').remove()"><i class="fa fa-close fa-lg"></i></button>
              </div>`);
        this.datatype_check(this.condId);

       // $("#checkbtn").off("click").on("click", this.checkBtnFun.bind(this));
       
        this.cond = new this.Condition(); //new condition created
        this.cond.id = this.condId;
        this.cond.CName = this.columnName;
        this.cond.Operator = $("#select_id option:selected").text();
        this.cond.Value = document.getElementById("myText").value;
        if (this.droploc_id == "firstBody") {
            this.WHEREclouseQ.Condition_Coll.push(this.cond);
        }
        else {
            this.recCond(this.WHEREclouseQ.ConditionGroup_Coll);
        }
    }

    this.recCond = function (coll)
    {
        for (var i = 0; i < coll.length; i++)
        {
            if (this.droploc_id == coll[i]['id'])
            {
                coll[i].Condition_Coll.push(this.cond); // push condition into condition collection
                return false;
            }
            else
                this.recCond(coll[i].ConditionGroup_Coll);
        }
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

    this.loopcheck = function (arr, $container) {
        for (i = 0; i < arr.length; i++) {
            $("#" + $container + " select").append(`<option value="equal">${arr[i]}</option>`);
        }
        $(".droped").draggable({
            containment: ".conditiong-gp-container",
            start: this.onDragLoc.bind(this)
        });
    }

    this.onDragLoc = function (event, ui) {
        this.dragloc = $(event.target).parent().attr("id");
    }

    {

        //this.checkBtnFun = function (event)
        //{
        //    this.checkcolName = $($($(event.target).closest(".droped")).children()[0]).text();
        //    this.checkOptr = $($($(event.target).closest(".droped")).children()[1]).text();
        //    this.checkText = $($($(event.target).closest(".droped")).children()[2]).text();
        //    this.checkloc = $($(event.target).closest(".droped"));
        //    this.checkloc.empty();
        //    this.checkloc.append(`<div class="checkAppendClass row">
        //            <div class="col-sm-2 frst">${this.checkcolName}</div>
        //            <div class="col-sm-3 sec">${this.checkOptr}</div>
        //            <div class="col-sm-5 third">${this.checkText}</div>
        //            <div class="col-sm-2">
        //                <div class="col-sm-4 fourth btn-group" ><button class="glyphicon glyphicon-edit"></button></div>
        //                <div class="col-sm-4 fourth btn-group" ><button onclick="$('#${this.condId}').remove()"><i class="glyphicon glyphicon-remove"></i></button></div>
        //            </div>
        //        </div>`);
        //}


        //    this.groupButtonClick = function () {
        //        var x = $(event.target).attr("data-counter");
        //        counter++;
        //        this.conditionGroupClick(x);
        //    };

        //    this.condButtonClick = function () {
        //        var x = $(event.target).attr("data-counter");
        //        counter++;
        //        this.conditionClick(x);
        //    };

        //    this.conditionGroupClick = function (x)
        //    {

        //$(".conditiong-gp-container-body" + x).append(`<div class="cond-grp2"  id="${this.objId}">
        //                            <div class=" conditiong-gp-container-header form-inline">
        //                                <div class="btn-group btn-toggle where-toggle">
        //                                    <button class="btn btn-sm btn-default">AND</button>
        //                                    <button class="btn btn-sm btn-primary active">OR</button>
        //                                </div>
        //                                 <div class="btn-group where-btns">

        //                                    <button type="button" data-counter="${counter}" class="btn btn-xs btn-success where-btn2" id="group${counter}"><i class="glyphicon glyphicon-plus-sign"></i>Group</button>
        //                                </div>
        //                             </div>
        //                            <div class="m-l-35 conditiong-gp-container-body">

        //                                 </div>`);

        //        $(`#group${counter}`).off("click").on("click", this.groupButtonClick.bind(this));

        //    }
    }
    
    this.init();
};