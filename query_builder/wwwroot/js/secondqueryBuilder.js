var SqlWhereCondition = function ()
{
    this.date = ["=", "!="];
    this.integer = ["<", ">", "<=", ">=", "=", "!=", "BETWEEN"];
    this.real = ["<", ">", "<=", ">=", "=", "!="];
    this.text = ["=", "!="];
    this.boolean = ["=", "=!"];
    this.time = ["=", "=!"];
    this.ConditionPane = $(".ConditionPane");
    this.where_cond_grp = $(".where_cond_grp");
    this.cond_grp_btn = "AND";
    //this.WhereConditionObj = {
    //    ConditionGroups: [{
    //        id: 1, cg: { Conditions: [{ CName: "", Operator: "", Value: "" }, { CName: "", Operator: "", Value: "" }], operator: "+" }, { id: 2, con }, { id: 1, con }, { id: 1, con },],
    //    Operator: ""
    //}
    this.WHEREcond = {              //object
        ConditionGroupColl : [],
        Operator : ""
    };

    this.ConditionGroup = function () {   //Constructor
        this.id = null;
        this.ConditionColl = [];
        this.operator = "";
    };

    this.Condition = function () {  //Constructor
        this.id = null;
        this.CName = "";
        this.Operator = "";
        this.Value = "";
    };

    this.IdCounters = { TableCount: 0 };

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

    this.makeDroppable = function () {
        $(".dragables").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body",
           
        });
        this.ConditionPane.droppable({
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
            $(event.target).append($(ui.draggable).detach().css({ 'top': '0px', 'left': ' 0px' }));
            this.dropobj_id = this.dropObj.attr("id");

            for (var i = 0; i < this.WHEREcond.ConditionGroupColl.length; i++) //condition removed from previous box
            {
                for (var j = 0; j < this.WHEREcond.ConditionGroupColl[i].ConditionColl.length; j++)
                {
                    if (this.dropobj_id == this.WHEREcond.ConditionGroupColl[i].ConditionColl[j]['id'])
                    {
                        this.add_cond = this.WHEREcond.ConditionGroupColl[i].ConditionColl[j];
                        //this.WHEREcond.ConditionGroupColl[i].ConditionColl[j].pop();
                    }
                }
            }

            for (var i = 0; i < this.WHEREcond.ConditionGroupColl.length; i++) //condition added into a new box
            {
                for (var j = 0; j < this.WHEREcond.ConditionGroupColl[i].ConditionColl.length; j++)
                {
                    if (this.dropobj_id != this.WHEREcond.ConditionGroupColl[i].ConditionColl[j]['id'])
                    {
                        if (this.droploc_id == this.WHEREcond.ConditionGroupColl[i]['id'])
                        {
                            this.WHEREcond.ConditionGroupColl[i].ConditionColl.push(this.add_cond);
                        }
                    }
                    }
            }

        }
        else
        {
            this.MlayerDrop.registerDrop(function ()
            {
                this.columnName = $(ui.draggable).attr('colname');
                this.datatype = $(ui.draggable).attr('datatype')
                this.condId = this.columnName + this.IdCounters["TableCount"]++;
                if (this.droploc.hasClass("ConditionPane"))// box is created ,then one condition is put into a  box
                {
                   this.objId = this.columnName + this.IdCounters["TableCount"]++;
                   this.onConNGrp();
                   
                }
                else// new condition is added into a box
                {
                   this.oncond();
                }
            }.bind(this));
        }
    };

    this.onConNGrp = function ()
    {
        this.droploc.append(`<div class="where_cond_grp" id="${this.objId}" style="left:200px; top:100px;position:relative">
        <form><div class="cond_grp_header">
                <div class="btn-group anbtn">
                <button type="button" class="btn btn-primary">AND</button>
                <button type="button" class="btn btn-primary">OR</button>
                </div>
                <div class="btn-group pull-right rule-actions"><button type="button" class="btn btn-xs btn-danger delbtn" ><i class="glyphicon glyphicon-remove"></i> Delete</button></div>
            </div><br>
            <div class="droped row " id="${this.condId}">
                <div class="col-sm-3 frst">${this.columnName}</div>
                <div class="col-sm-3 sec"><select class="form-control" id="select_id" ></select></div>
                <div class="col-sm-6 third"><input type="text" class="form-control" id="myText"></div>
            </div>
       </form></div><br>`);

        this.datatype_check(this.condId); //check datatype,then user select particular operator from operator collection 

        $("#" + this.objId).droppable({ accept: ".dragables,.droped", drop: this.onwhereDropFn.bind(this) });

        $(`#${this.objId} .btn`).click(function () //box button
        {
            this.cond_grp_btn = $(this).text();
        });

        var cg = new this.ConditionGroup();// new box object created
        cg.id = this.objId;         //add id into box
        cg.operator = this.cond_grp_btn; //add operator into a box

        var cond = new this.Condition(); //new condition object created
        cond.id = this.condId;
        cond.CName = this.columnName;
        cond.Operator = $("#select_id option:selected").text();
        cond.Value = document.getElementById("myText").value;

        cg.ConditionColl.push(cond);
        this.WHEREcond.ConditionGroupColl.push(cg); // push box into box collection
    }
    this.oncond = function ()
    {
        this.droploc.append(`<form><div class="droped row " id="${this.condId}">
                <div class="col-sm-3 frst">${this.columnName}</div>
                <div class="col-sm-3 sec"><select class="form-control" id="select_id" ></select></div>
                <div class="col-sm-6 third"><input type="text" class="form-control" id="myText"></div>
            </div></form>`);
        this.datatype_check(this.condId);
        var cond = new this.Condition(); //new condition created
        cond.id = this.condId;
        cond.CName = this.columnName;
        cond.Operator = $("#select_id option:selected").text();
        cond.Value = document.getElementById("myText").value;
        for (var i = 0; i < this.WHEREcond.ConditionGroupColl.length; i++)
        {
            if (this.droploc_id == this.WHEREcond.ConditionGroupColl[i]['id'])
            {
                this.WHEREcond.ConditionGroupColl[i].ConditionColl.push(cond); // push condition into condition collection
            }
        }
    }
    
    this.datatype_check = function ($container)
    {
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
        $('.droped').draggable();
        this.sort();
    }


    this.sort = function () {
        $(function () {
            $(".sortorder").sortable();
            $(".sortorder").disableSelection();
        });
    };


    this.init = function () {
        this.makeDroppable();

    };
    this.init()
};