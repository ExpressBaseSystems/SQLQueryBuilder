var counter = 0;
var QueryBuilder = function (object) {

    this.tbName = [];
    this.dragableArray = [];
    this.TableSchema = object;
    this.DesignPane = $(".DesignPane");
    this.SortPane = $(".SortPane");
    this.ConditionPane = $(".ConditionPane");
    this.QueryPane = $(".QueryPane");
    this.bodyid = {};
    this.IdCounters = {
        TableCount: 0
    }
    this.count = 0;
    this.columnName = [];
    this.drawTree = false;
    this.drake = {};
    this.date = ["=", "!="];
    this.integer = ["<", ">", "<=", ">=", "=", "!=", "BETWEEN"];
    this.real = ["<", ">", "<=", ">=", "=", "!="];
    this.text = ["=", "!="];
    this.boolean = ["=", "=!"];
    this.time = ["=", "=!"];
    this.groupCounter = 1;
    this.arraycol = [];
    this.ConditionPane = $(".conditiong-gp-container");
    this.where_cond_grp = $(".where_cond_grp");
    this.subtreeName = {};
    this.sorfun = {
        colNamesorder: [],
        value: ""
    };

    this.condFlatObj = {};

    this.ConditionGroup = function () {   //Constructor
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

    this.appendTableNames = function () {
        for (var key in this.TableSchema) {
            $("#tables-cont").append(`<ul class="treeview" tree_ul="treeview_${key}" tname="${key}">
                                            <li class="t-draggable" id="tname_${key}" tname="${key}">${key}   
                                                <ul id="treeview_${key}" class="cols-cont" style="display:none;">
                                                </ul>
                                            </li>
                                      </ul>`);
            this.appendTCol($("#tname_" + key), this.TableSchema[key]);
        }

    };

    this.appendTCol = function ($container, colArray) {
        for (i = 0; i < colArray.length; i++) {
            $container.children("ul").append(`<li class="col-draggable" colname="${colArray[i].cname}"  datatype="${colArray[i].type}">${colArray[i].cname}</li>`);

        }
    };

    this.makeDroppable = function () {
        this.drake = new dragula([document.getElementById("tables-cont"), document.getElementById("designpane")], {
            copy: function (el, source) {
                return (el.className === 'treeview' || el.className === 'col-draggable');
            },
            moves: this.movesFn.bind(this),
            accepts: this.acceptFn.bind(this)
        });
        //this.drake.copy = true;
        this.drake.on("drop", this.tableOnDrop.bind(this));
        this.drake.on("drag", this.tableOnDrag.bind(this))
    };

    this.movesFn = function (el, source, handle, sibling) {
        return true;
    };

    this.acceptFn = function (el, target, source, sibling) {
        //this.copyTrue();
        //main tree accept function.......
        if ($(source).attr("id") === "tables-cont" && $(target).attr("id") === "tables-cont") {
            return false;
        }
        else if ($(source).attr("id") === "tables-cont" && $(target).attr("id") === "firstBody") {
            return false;
        }
        else if ($(source).attr("id") === "tables-cont" && $(target).attr("id") === this.bodyid) {
            return false;
        }
        //sub tree accept function..........
        else if ($(source).attr("id") === "treeview_" + this.subtreeName && $(target).attr("id") == "designpane") {
            return false;
        }
        else if ($(source).attr("id") === "treeview_" + this.subtreeName && $(target).attr("id") == "tables-cont") {
            return false;
        }
        else if ($(source).attr("id") === "designpane" && $(target).attr("id") == "treeview_" + this.subtreeName) {
            return false;
        }
        else if ($(source).attr("id") === "designpane") {
            //this.copyFalse();
            this.drake.copy = false;
            return true;
        }
        else
            return true;
    };

    this.tableOnDrag = function (el, source) {
        this.subtreeName = $(source).parent().attr("tname")
    }

    this.tableOnDrop = function (el, target, source, sibling) {
        this.targetId = $(target).attr("id");
        var sourceId = $(source).attr("id");
        if (sourceId === "tables-cont" && this.targetId === "designpane") {
            this.droploc = $(target);
            this.dropObj = $(el).children("li");
            var treeid = $(el).attr("tree_ul");
            $(el).remove();
            this.left = event.pageX - this.droploc.offset().left;
            this.top = event.pageY - this.droploc.offset().top;
            this.tableName = this.dropObj.attr('tname');
            this.objId = this.tableName + this.IdCounters["TableCount"]++;

            this.droploc.append(`<div id="${this.objId}"
                             style="position:absolute;top:${this.top};left:${this.left};">
                             <div class="Table">
                             <div id="tbhd_${this.tableName}">${this.tableName}
                             <button class="btn">
                             <i class="fa fa-window-close" aria-hidden="true"></i></button> </div>
                             <div id="col-container${this.objId}"></div></div>`);
            this.addColoums("col-container" + this.objId);
            $($("#" + this.objId).find("#tbhd_" + this.tableName).find(".btn")).on("click", this.removTable.bind(this));
            $("#" + treeid).show();
            if (this.drake.containers.indexOf(treeid) === -1)
                this.drake.containers.push(document.getElementById(treeid));
        }

        else if (sourceId == "treeview_" + this.subtreeName) {
            this.droploc = $(target);
            this.droploc_id = $(target).attr("id");
            this.columnName = $(el).attr("colname");
            this.datatype = $(el).attr("datatype");
            $(el).remove();
            this.condId = this.columnName + this.IdCounters["TableCount"]++;
            this.oncond();

        }
        else if (true)
        {
            this.dropobj_id = $(el).attr("id");
            if (sourceId == "firstBody")
            {
                var cond;
                for (var i = 0; i < this.WHEREclouseQ.Condition_Coll.length; i++)
                {
                    if (this.dropobj_id == this.WHEREclouseQ.Condition_Coll[i]['id']) {
                        this.firstBody_cond = this.WHEREclouseQ.Condition_Coll[i];
                        var index = this.WHEREclouseQ.Condition_Coll.indexOf(this.firstBody_cond);
                        cond = this.WHEREclouseQ.Condition_Coll.splice(index, 1);
                        //return false;
                    }
                }
                if (this.targetId == "firstBody") {
                    this.WHEREclouseQ.Condition_Coll.push(cond)
                }
                else
                    this.recPushOuterCond(this.WHEREclouseQ.ConditionGroup_Coll,cond);
            }
            else
                this.recDropCond(this.WHEREclouseQ.ConditionGroup_Coll);

        }

        if (this.drake.containers.indexOf("firstBody") === -1)
            this.drake.containers.push(document.getElementById("firstBody"));
    };

    this.recPushOuterCond = function (coll,cond)
    {
        for (var i = 0; i < coll.length; i++) {
            if (this.targetId == coll[i]["id"]) {
                coll[i].Condition_Coll.push(cond);
                return false;
            }
            else
                this.recPushOuterCond(coll[i]["ConditionGroup_Coll"],cond);
        }
    }

    this.recDropCond = function (coll) {
        var temp = false;
        var cond;
        for (var i = 0; i < coll.length; i++) {
            for (var j = 0; j < coll[i].Condition_Coll.length; j++) {
                if (this.dropobj_id == coll[i].Condition_Coll[j]['id']) {
                    this.next_cond = coll[i].Condition_Coll[j];
                    var index = coll[i].Condition_Coll.indexOf(this.next_cond);
                    cond = coll[i].Condition_Coll.splice(index, 1);
                    temp = true;
                }
                if (temp)
                    break;
            }
            if (temp)
                break;
        }
        if (this.targetId == "firstBody") {
            this.WHEREclouseQ.Condition_Coll.push(cond)
        }
        else
            this.recPushOuterCond(this.WHEREclouseQ.ConditionGroup_Coll,cond);
        if (!temp)
            this.recDropCond(coll.ConditionGroup_Coll);
        return false;
    }

    this.oncond = function ()
    {
        this.droploc.append(`<div class="droped form-inline" id="${this.condId}">
                                <div class="d-inline">${this.columnName}</div>
                                <select class="form-control d-inline selectOptr" id="select_id" ></select>
                                <input type="text" class="form-control d-inline textChange" id="myText">
                                <button class="btn btn-default pull-right"  style="display:none;"><i class="fa fa-edit fa-lg"></i></button>
                                <button flatObjId="${this.condId}" class="btn btn-default pull-right conditionCheck"><i class="fa fa-check fa-lg"></i></button>
                                <button class="btn btn-default pull-right conditionRemove"><i class="fa fa-close fa-lg"></i></button>
                             </div>`);
        this.datatype_check(this.condId);
        this.cond = new this.Condition(); //new condition created
        this.cond.id = this.condId;
        this.cond.CName = this.columnName;
        this.cond.Operator = $("#select_id option:selected").text();
        this.condFlatObj[this.condId] = this.cond;

        if (this.droploc_id == "firstBody") {
            this.WHEREclouseQ.Condition_Coll.push(this.cond);
        }
        else {
            this.recCond(this.WHEREclouseQ.ConditionGroup_Coll);
        }

    }

    this.condRemoveFn = function (event) {
        var $el = $(event.target).closest(".btn");
        this.dropobj_id = $el.parent().attr("id");
        var parentBox = $el.parent().parent().attr("id");
        $("#"+$el.parent().attr("id")).remove();
       
        if (parentBox == "firstBody") {
            for (var i = 0; i < this.WHEREclouseQ.Condition_Coll.length; i++) {
                if (this.dropobj_id == this.WHEREclouseQ.Condition_Coll[i]['id']) {
                    this.firstBody_cond = this.WHEREclouseQ.Condition_Coll[i];
                    var index = this.WHEREclouseQ.Condition_Coll.indexOf(this.firstBody_cond);
                    var cond = this.WHEREclouseQ.Condition_Coll.splice(index, 1);
                    return false;
                }
            }
        }
        else {
            this.recDropCond(this.WHEREclouseQ.ConditionGroup_Coll);

        }
    }

    this.condCheckFn = function (event) {
        var colName;
        var optr;
        var text
        var $el = $(event.target).closest(".btn");
        var condObjId = $el.attr("flatobjid");
        for (var key in this.condFlatObj) {
            if (condObjId === key) {
                colName = this.condFlatObj[key].CName;
                optr = this.condFlatObj[key].Operator;
                text = this.condFlatObj[key].Value;
                return false;
            }
        }
    }

    this.recCond = function (coll) {
        for (var i = 0; i < coll.length; i++) {
            if (this.droploc_id === coll[i]['id']) {
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

    }

    this.treedFunc = function (e) {
        if ($(e.target).css("display") === "block")
            $(e.target).children().hide();
        else
            $(e.target).children().show();
    };

    this.addColoums = function ($container) {
        for (i = 0; i < this.TableSchema[this.tableName].length; i++) {
            this.item = this.TableSchema[this.tableName][i];
            $("#" + $container).append(`<div class="col"  tabindex="1" id="${this.tableName}-col${i}" cnm="${this.item.cname}" 
                datatp="${this.item.type}" con="${this.item.constraints}" fortnm="${this.item.foreign_tnm}" 
                forcnm="${this.item.foreign_cnm}" ><span><input type="checkbox" id="mycheck" /></span>
                <span id="ann">${this.item.cname}</span><span>${this.item.type}</span><span class="icon"></span></div>`);
        }
       
     

    };

    this.addGroupCondition = function (e) {
        var appendloc = $(e.target).parents(1).siblings(".conditiong-gp-container-body");
        this.locid = $(e.target).parents(1).siblings(".conditiong-gp-container-body").attr("id");
        this.appendGroupCondition(appendloc);
    }

    this.appendGroupCondition = function (appendloc) {
        var objid = "groupCondition" + this.groupCounter++;
        this.bodyid = "groupBody" + this.groupCounter++;

        appendloc.append(`<div class="cond-grp2"  id= "${objid}" >
                            <div class=" conditiong-gp-container-header form-inline">
                                <div class="btn-group btn-toggle where-toggle">
                                    <button class="btn btn-sm btn-default grpAndOrBtn" value="AND">AND</button>
                                    <button class="btn btn-sm btn-primary grpAndOrBtn" value="OR" active">OR</button>
                                </div>
                            <div class="btn-group where-btns">
                                 <button type="button" data-counter="${counter}" class="btn btn-xs btn-success where-btn2 addGroup" id="group${counter}"><i class="glyphicon glyphicon-plus-sign"></i>Group</button>
                            </div>
                        </div>
                        <div class="m-l-35 conditiong-gp-container-body" id="${this.bodyid}">
                        </div>`);

        this.cg = new this.ConditionGroup();// new box object created
        this.cg.id = this.bodyid;         //add id into box
        if (this.locid == "firstBody") {
            this.WHEREclouseQ.ConditionGroup_Coll.push(this.cg);
        }
        else {
            this.recCondGrp(this.WHEREclouseQ.ConditionGroup_Coll);
        }
        $("#" + objid + " .addGroup").on("click", this.addGroupCondition.bind(this));

        if (this.drake.containers.indexOf(this.bodyid === -1))
            this.drake.containers.push(document.getElementById(this.bodyid));
    };

    this.grpAndOrBtnFn = function (event) {
        var Opr = $(event.target).val();
        var parentBox = $(event.target).parent().parent().siblings().attr("id");
        if (parentBox == "firstBody") {
            this.WHEREclouseQ.operator = Opr;
        }
        else {
            this.recgrpAndOrBtnFn(this.WHEREclouseQ.ConditionGroup_Coll, parentBox, Opr);

        }
    }

    this.recgrpAndOrBtnFn = function (coll, parentBox, Opr) {
        
        for (var i = 0; i < coll.length; i++) {
            if (parentBox == coll[i]['id']) {
                coll[i].operator = Opr;
                return false;

            }
            else
                this.recgrpAndOrBtnFn(coll[i].ConditionGroup_Coll, parentBox, Opr)
        }
    }

    this.condTextChangeFn = function (event)
    {
        var cont = $(event.target).val();
        var condId = $(event.target).parent().attr("id");
        var boxId = $(event.target).parent().parent().attr("id");
        if (boxId == "firstBody")
        {
            for (var i = 0; i < this.WHEREclouseQ.Condition_Coll.length; i++) {
                if (condId == this.WHEREclouseQ.Condition_Coll[i]['id']) {
                    this.WHEREclouseQ.Condition_Coll[i].Value = cont;
                    return false;
                }
            }
        }
        else {
            this.recCondTextChangeFn(this.WHEREclouseQ.ConditionGroup_Coll, cont, condId);

        }
    }

    this.recCondTextChangeFn = function (coll, cont, condId)
    {
        var temp = false;
        for (var i = 0; i < coll.length; i++)
        {
            for (j = 0; j < coll[i].Condition_Coll.length; j++)
            {
                if (condId == coll[i].Condition_Coll[j]['id']) {
                    coll[i].Condition_Coll[j].Value = cont;
                    temp = true;
                    return false;
                }
                if (temp)
                    break;
            }
            if (!temp)
                this.recCondTextChangeFn(coll[i].ConditionGroup_Coll, cont, condId)
        }
       
    }

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

    this.removTable = function (event) {
        // this.objID = $(event.target).closest('.Table').parent();//.text().trim()
        $($(event.target).closest('.Table').parent()).remove();
        this.tableName = $(event.target).closest("#tbhd_" + this.tableName).text().trim();
        this.array.pop(this.tableName);
    };

    this.init = function () {
        this.appendTableNames();
        this.makeDroppable();
        $(".conditiong-gp-container .addGroup").off("click").on("click", this.addGroupCondition.bind(this));
        this.WHEREclouseQ.id = "firstBody";    //add id into box
        $("body").on("click", ".conditionRemove", this.condRemoveFn.bind(this));
        $("body").on("click", ".conditionCheck", this.condCheckFn.bind(this));
        $("body").on("click", ".grpAndOrBtn", this.grpAndOrBtnFn.bind(this));
        $("body").on("change", ".textChange", this.condTextChangeFn.bind(this));
        //$("body").on("change", ".selectOptr", this.condSelectOptrFn.bind(this));

    };

    this.init();
}









