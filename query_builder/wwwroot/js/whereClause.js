﻿var counter = 0;
var WhereBuilder = function (Queryobj) {
    this.QueryObj = Queryobj;
    this.tbName = [];
    this.dragableArray = [];
    this.DesignPane = $(".DesignPane");
    this.SortPane = $(".SortPane");
    this.ConditionPane = $(".ConditionPane");
    this.QueryPane = $(".QueryPane");
    this.bodyid = {};
    this.IdCounters = {
        TableCount: 0
    };
    this.saveFormatString = "";
    this.count = 0;
    this.columnName = [];
    this.drawTree = false;
    this.drake = null;
    this.date = ["=", "!="];
    this.integer = ["=", ">", "<=", ">=", "<", "!=", "BETWEEN"];
    this.real = ["=", ">", "<=", ">=", "<", "!="];
    this.text = ["=", "!=", "Like"];
    this.boolean = ["=", "=!"];
    this.time = ["=", "=!"];
    this.groupCounter = 1;
    this.arraycol = [];
    this.ConditionPane = $(".conditiong-gp-container");
    this.where_cond_grp = $(".where_cond_grp");
    this.movingItem = null;
    this.movingGrp = null;
    this.subtreeName = {};

    this.condFlatObj = {};

    this.ConditionGroup = function () {   //Constructor
        this.id = null;
        this.operator = "";
        this.ConditionGroup_Coll = [];
        this.Condition_Coll = [];
    };

    this.Condition = function () {  //Constructor
        this.id = null;
        this.condTabName = "";
        this.CName = "";
        this.CNmType = "";
        this.Operator = "";
        this.Value = "";
    };

    this.WHEREclouseQ = new this.ConditionGroup();
    
    this.makeDroppable = function ($storeTableNames)
    {
        this.storedNames = $storeTableNames;
        if (this.drake === null)
        {
        this.drake = new dragula([document.getElementById("firstBody")], {
            copy: function (el, source) {
                return (el.className === 'col-draggable');
            },
            accepts: this.acceptFn.bind(this)
            });

        this.drake.on("drop", this.tableOnDrop.bind(this));
        this.drake.on("drag", this.tableOnDrag.bind(this));
        }
        for (var key in this.storedNames) {
            var tblName = this.storedNames[key];
            this.drake.containers.push(document.getElementById("treeview_" + tblName));
        }
    };

    this.acceptFn = function (el, target, source, sibling) {

       
        if ($(target).attr("class") === "cols-cont")
            return false;
        else
            return true;
    };

    this.tableOnDrag = function (el, source) {
        this.subtreeName = $(source).parent().attr("tname")
    };

    this.tableOnDrop = function (el, target, source, sibling) {
        var targetId = $(target).attr("id");
        var sourceId = $(source).attr("id");
        if (sourceId === "treeview_" + this.subtreeName) {
            this.droploc = $(target);
            this.droploc_id = $(target).attr("id");
            this.columnName = $(el).attr("colname");
            this.onDropTabName = $(source).parent().attr("tname");
            this.datatype = $(el).attr("datatype");
            $(el).remove();
            this.condId = this.columnName + this.IdCounters["TableCount"]++;
            this.normalTextId = "normalTextId" + this.IdCounters["TableCount"]++;
            this.boolTextId = "boolTextId" + this.IdCounters["TableCount"]++;
            this.oncond();

        }
        else if (false) {
            var dropobj_id = $(el).children(".conditiong-gp-container-body").attr("id");
            this.popCollGrpRec(this.WHEREclouseQ, sourceId, dropobj_id);
            this.pushCollGrpRec(this.WHEREclouseQ, targetId, dropobj_id)

        }

        else if (true) {
            var dropobj_id = $(el).attr("id");
            this.popCollCondRec(this.WHEREclouseQ, sourceId, dropobj_id);
            this.pushCollCondRec(this.WHEREclouseQ, targetId, dropobj_id)
        }
    };

    this.popCollGrpRec = function (condGrp, source, dropObjid) {
        if (condGrp.id === source) {
            for (i = 0; i < condGrp.ConditionGroup_Coll.length; i++) {
                if (condGrp.ConditionGroup_Coll[i]["id"] === dropObjid) {
                    this.movingGrp = condGrp.ConditionGroup_Coll[i];
                    condGrp.ConditionGroup_Coll.splice(i, 1);
                }
            }
        }
        else {
            if (condGrp.hasOwnProperty('ConditionGroup_Coll')) {
                for (var k = 0; k < condGrp.ConditionGroup_Coll.length; k++)
                    this.popCollGrpRec(condGrp.ConditionGroup_Coll[k], source, dropObjid)
            }
        }
    };

    this.pushCollGrpRec = function (condGrp, destinatn, dropObjid) {
        if (condGrp.id === destinatn)
            condGrp.ConditionGroup_Coll.push(this.movingGrp)
        else {
            if (condGrp.hasOwnProperty('ConditionGroup_Coll')) {
                for (var k = 0; k < condGrp.ConditionGroup_Coll.length; k++)
                    this.pushCollGrpRec(condGrp.ConditionGroup_Coll[k], destinatn, dropObjid)
            }
        }
    };

    this.pushCollCondRec = function (condGrp, destinatn, dropObjid) {
        if (condGrp.id === destinatn)
            condGrp.Condition_Coll.push(this.movingItem)
        else {
            if (condGrp.hasOwnProperty('ConditionGroup_Coll')) {
                for (var k = 0; k < condGrp.ConditionGroup_Coll.length; k++)
                    this.pushCollCondRec(condGrp.ConditionGroup_Coll[k], destinatn, dropObjid)
            }
        }
    };

    this.popCollCondRec = function (condGrp, source, dropObjid) {
        if (condGrp.id === source) {
            for (i = 0; i < condGrp.Condition_Coll.length; i++) {
                if (condGrp.Condition_Coll[i].id === dropObjid) {
                    this.movingItem = condGrp.Condition_Coll[i];
                    condGrp.Condition_Coll.splice(i, 1);
                }
            }
        }
        else {
            if (condGrp.hasOwnProperty('ConditionGroup_Coll')) {
                for (var k = 0; k < condGrp.ConditionGroup_Coll.length; k++)
                    this.popCollCondRec(condGrp.ConditionGroup_Coll[k], source, dropObjid)
            }
        }
    };

    this.addGroupCondition = function (e) {
        var appendloc = $(e.target).parents(1).siblings(".conditiong-gp-container-body");
        this.locid = $(e.target).parents(1).siblings(".conditiong-gp-container-body").attr("id");
        this.appendGroupCondition(appendloc);
    };

    this.appendGroupCondition = function (appendloc) {
        var objid = "groupCondition" + this.groupCounter++;
        this.bodyid = "groupBody" + this.groupCounter++;

        appendloc.append(`<div class="groupBox"  id= "${objid}" >
                            <div class=" conditiong-gp-container-header form-inline">
                                <div class="btn-group btn-toggle where-toggle">
                                    <button class="btn btn-sm btn-default grpAndOrBtn" value="AND">AND</button>
                                    <button class="btn btn-sm btn-default grpAndOrBtn active" value="OR">OR</button>
                                </div>
                            <div class="btn-group where-btns">
                                 <button type="button" data-counter="${counter}" class="btn btn-xs btn-success where-btn2 addGroup" id="group${counter}"><i class="glyphicon glyphicon-plus-sign"></i>Group</button>
                                 <button type="button" class="btn btn-xs btn-danger groupRemove" data-delete="group"><i class="glyphicon glyphicon-remove"></i> Delete</button>
                                </div>
                        </div>
                        <div class="m-l-35 conditiong-gp-container-body" id="${this.bodyid}">
                        </div>`);

        this.cg = new this.ConditionGroup();// new box object created
        this.cg.id = this.bodyid;         //add id into box
        this.cg.operator = "OR";
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

    this.recCondGrp = function (Coll) {
        for (var i = 0; i < Coll.length; i++) {
            if (this.locid === Coll[i]['id']) {
                Coll[i].ConditionGroup_Coll.push(this.cg); // push condition into condition collection
                return false;
            }
            else
                this.recCondGrp(Coll[i].ConditionGroup_Coll);
        }
    };

    this.grpRemoveFn = function (event) {
        var $el = $(event.target).closest(".btn");
        var source = $el.parent().parent().siblings().attr("id");
        $("#" + $el.parent().parent().parent().attr("id")).remove();
        this.recGrpRemoveFn(this.WHEREclouseQ, source);
    };

    this.recGrpRemoveFn = function (condGrp, source) {
        if (condGrp.hasOwnProperty('ConditionGroup_Coll')) {
            for (var k = 0; k < condGrp.ConditionGroup_Coll.length; k++) {
                if (source === condGrp.ConditionGroup_Coll[k]["id"])
                    condGrp.ConditionGroup_Coll.splice(k, 1);
                else
                    this.recGrpRemoveFn(condGrp.ConditionGroup_Coll[k], source)
            }
        }
    };

    this.grpAndOrBtnFn = function (event) {
        var Opr = $(event.target).val();
        var parentBox = $(event.target).parent().parent().siblings().attr("id");
        $(event.target).addClass('active');
        $(event.target).siblings().removeClass('active');
        if (parentBox === "firstBody") {
            this.WHEREclouseQ.operator = Opr;
        }
        else {
            this.recgrpAndOrBtnFn(this.WHEREclouseQ.ConditionGroup_Coll, parentBox, Opr);

        }
    };

    this.recgrpAndOrBtnFn = function (coll, parentBox, Opr) {

        for (var i = 0; i < coll.length; i++) {
            if (parentBox === coll[i]['id']) {
                coll[i].operator = Opr;
                return false;

            }
            else
                this.recgrpAndOrBtnFn(coll[i].ConditionGroup_Coll, parentBox, Opr)
        }
    };

    this.oncond = function () {
        this.droploc.append(`<div class="droped form-inline" id="${this.condId}">
                                <div class="d-inline columnName" dataType = "${this.datatype}">${this.columnName}</div>
                                <select flatObjId="${this.condId}" class="form-control d-inline selectOptr" id="select_id" ></select>
                                <button class="btn btn-default pull-right conditionEdit"  style="display:none;"><i class="fa fa-edit fa-lg"></i></button>
                                <button flatObjId="${this.condId}" class="btn btn-default pull-right conditionCheck"><i class="fa fa-check fa-lg"></i></button>
                                <button class="btn btn-default pull-right conditionRemove"><i class="fa fa-close fa-lg"></i></button>
                              </div>`);

        this.datatype_check(this.condId);
        this.cond = new this.Condition(); //new condition created
        this.cond.id = this.condId;
        this.cond.CNmType = this.datatype;
        this.cond.condTabName = this.onDropTabName;
        this.cond.CName = this.columnName;
        this.cond.Operator = $("#select_id option:selected").text();
        this.condFlatObj[this.condId] = this.cond;

        if (this.droploc_id === "firstBody") {
            this.WHEREclouseQ.Condition_Coll.push(this.cond);
        }
        else {
            this.recCond(this.WHEREclouseQ.ConditionGroup_Coll);
        }

    };

    this.datatype_check = function ($container) {
        if (this.datatype === "text") {
            $("#" + this.condId + " select").after(` <input type="text" flatObjId="${this.condId}" class="form-control d-inline keypressEventText"  id = "${this.normalTextId}">`);
            this.loopcheck(this.text, $container);
        }
        else if (this.datatype === "integer") {
            $("#" + this.condId + " select").after(` <input type="text" flatObjId="${this.condId}" class="form-control d-inline keypressEventText"  id = "${this.normalTextId}">`);
            this.loopcheck(this.integer, $container);

        }
        else if (this.datatype === "date") {
            $("#" + this.condId + " select").after(` <input type="date" flatObjId="${this.condId}" class="form-control d-inline changeEventTextFn"  id = "${this.boolTextId}"/>`)
            this.loopcheck(this.date, $container);
        }
        else if (this.datatype === "real") {
            this.loopcheck(this.real, $container);
        }
        else if (this.datatype === "boolean") {
            $("#" + this.condId + " select").after(` <input type="text" flatObjId="${this.condId}" class="form-control d-inline changeEventTextFn"  id = "${this.boolTextId}">`)
            this.loopcheck(this.boolean, $container);
        }
        else if (this.datatype === "time") {
            $("#" + this.condId + " select").after(` <input type="time" flatObjId="${this.condId}" class="form-control d-inline changeEventTextFn"  id = "${this.boolTextId}"/>`)
            this.loopcheck(this.time, $container);
        }
    };

    this.loopcheck = function (arr, $container) {
        for (i = 0; i < arr.length; i++) {
            $("#" + $container + " select").append(`<option value="equal">${arr[i]}</option>`);
        }

    };

    this.recCond = function (coll) {
        for (var i = 0; i < coll.length; i++) {
            if (this.droploc_id === coll[i]['id']) {
                coll[i].Condition_Coll.push(this.cond); // push condition into condition collection
                return false;
            }
            else
                this.recCond(coll[i].ConditionGroup_Coll);
        }
    };

    this.condCheckFn = function (event) {
        var colName;
        var optr;
        var text
        var $el = $(event.target).closest(".btn");
        droploc = $(event.target).closest(".btn").parent();

        var condObjId = $el.attr("flatobjid");
        for (let key in this.condFlatObj) {
            if (condObjId === key) {
                colName = this.condFlatObj[key].CName;
                optr = this.condFlatObj[key].Operator;
                text = this.condFlatObj[key].Value;
            }
        }
        var string = colName + " " + optr + " " + text;
        $el.siblings(".d-inline").hide()
        $el.hide()
        $el.siblings(".conditionEdit").show()
        droploc.prepend(`<label class="checkText">${string}</label>`);
    };

    this.condEditFn = function (event) {
        var $el = $(event.target).closest(".btn");
        $el.hide();
        $el.siblings(".checkText").hide();
        $el.siblings(".conditionCheck").show();
        $el.siblings(".d-inline").show();
    };

    this.keypressEventTextFn = function (event) {
        var cont = $(event.target).val() + window.event.key;
        var $el = $(event.target);
        var condDataType = $el.siblings(".columnName").attr("dataType");
        var condObjId = $el.attr("flatObjId");
        if (condDataType === "text") {


            try {

                if (window.event) {

                    var charCode = window.event.keyCode;

                }

                else if (e) {

                    var charCode = e.which;

                }

                else {
                    return true;
                }

                if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode === 37) || (charCode === 95)) {
                    for (var key in this.condFlatObj) {
                        if (condObjId === key) {
                            this.condFlatObj[key].Value =cont;
                        }
                    }
                }



                else {
                    
                    return false;
                }
            }

            catch (err) {

                alert(err.Description);

            }


        }
        else if (condDataType == "integer") {


            try {

                if (window.event) {

                    var charCode = window.event.keyCode;

                }

                else if (e) {

                    var charCode = e.which;

                }

                else { return true; }

                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                else {
                    for (var key in this.condFlatObj) {
                        if (condObjId === key) {
                            this.condFlatObj[key].Value = cont;
                        }
                    }
                }

            }

            catch (err) {

                alert(err.Description);

            }
        }

    };

    this.changeEventTextFn = function (event) {
        var con = $(event.target).val().trim();
        var $el = $(event.target);
        var id = $el.attr("id");
        var condDataType = $el.siblings(".columnName").attr("dataType");
        var condObjId = $el.attr("flatObjId");
        if (condDataType == "boolean") {
            if (con == "y" || con == "Y" || con == "f" || con == "F" || con == "yes" || con == "no" || con == "YES" || con == "NO" || con == "true" || con == "false" || con == "TRUE" || con == "FALSE" || con == "T" || con == "F" || con == "False" || con == "True" || con == "Yes" || con == "No") {
                for (let key in this.condFlatObj) {
                    if (condObjId === key) {
                        this.condFlatObj[key].Value = con;
                    }
                }
            }
            else {
                $el.val("");
                for (let key in this.condFlatObj) {
                    if (condObjId === key) {
                        this.condFlatObj[key].Value = "";
                    }
                }
            }
        }
        else if (condDataType == "date") {
            for (let key in this.condFlatObj) {
                if (condObjId === key) {
                    this.condFlatObj[key].Value =con;
                }
            }
        }
        else if (condDataType === "time") {
            for (let key in this.condFlatObj) {
                if (condObjId === key) {
                    this.condFlatObj[key].Value = con;
                }
            }
        }
    };

    this.condSelectOptrFn = function (event) {
        var optionSelected = $(event.target).find("option:selected");
        var optionText = optionSelected.text();
        var $el = $(event.target);
        var condObjId = $el.attr("flatobjid");
        for (let key in this.condFlatObj) {
            if (condObjId === key) {
                this.condFlatObj[key].Operator = optionText;
            }
        }
    };

    this.condRemoveFn = function (event) {
        var $el = $(event.target).closest(".btn");
        var dropObjid = $el.parent().attr("id");
        var source = $el.parent().parent().attr("id");
        $("#" + $el.parent().attr("id")).remove();
        this.popCollCondRec(this.WHEREclouseQ, source, dropObjid);
    };

    this.createQueryForCondGroup = function (condGrp) {
        if (condGrp.Condition_Coll.length > 0) {
           
            var queryString = "((" + condGrp.Condition_Coll[0]["CName"] + " " + condGrp.Condition_Coll[0]["Operator"] + " " + ((condGrp.Condition_Coll[0]["CNmType"]=== ("text" || "date" || "time")) ? "'"+ condGrp.Condition_Coll[0]["Value"] + "'" : condGrp.Condition_Coll[0]["Value"]) + ") ";
            for (i = 1; i < condGrp.Condition_Coll.length; i++)
                queryString += condGrp.operator + " (" + condGrp.Condition_Coll[i]["CName"] + " " + condGrp.Condition_Coll[i]["Operator"] + " " + ((condGrp.Condition_Coll[i]["CNmType"] === ("text" || "date" || "time")) ? "'" + condGrp.Condition_Coll[i]["Value"] + "'" : condGrp.Condition_Coll[i]["Value"]) + ") ";
            //queryString += ")";
            return queryString;
        }
        return "";
    };

    this.recFinalQueryFn = function (condGrp) {
        var fString = this.createQueryForCondGroup(condGrp);

        if (condGrp.ConditionGroup_Coll.length > 0) {
            for (var k = 0; k < condGrp.ConditionGroup_Coll.length; k++) {
                fString += ((fString.length === 0) ? "" : condGrp.operator) + " " + this.recFinalQueryFn(condGrp.ConditionGroup_Coll[k]) + ") ";
            }
        }
        return fString;
    };

    this.designPaneFn = function () {
        $(".treeviewDragula").hide();
        $("#tables-cont").show();
    };

    this.init = function () {
        this.makeDroppable();
        $(".conditiong-gp-container .addGroup").off("click").on("click", this.addGroupCondition.bind(this));
        this.WHEREclouseQ.id = "firstBody";    //add id into box
        this.WHEREclouseQ.operator = "OR";
        //this.queryDisplayObj = new QueryBuilder();
        $("body").on("click", ".conditionRemove", this.condRemoveFn.bind(this));
        $("body").on("click", ".groupRemove", this.grpRemoveFn.bind(this));
        $("body").on("click", ".conditionCheck", this.condCheckFn.bind(this));
        $("body").on("click", ".conditionEdit", this.condEditFn.bind(this));
        $("body").on("click", ".grpAndOrBtn", this.grpAndOrBtnFn.bind(this));
        $("body").on("keypress", ".keypressEventText", this.keypressEventTextFn.bind(this));
        $("body").on("change", ".changeEventTextFn", this.changeEventTextFn.bind(this));
        $("body").on("change", ".selectOptr", this.condSelectOptrFn.bind(this));
        $("a[href='#Design']").on("click", this.designPaneFn.bind(this));
    };

    this.init();
}

//this.createQueryForCondGroup = function (condGrp) {
//    if (condGrp.Condition_Coll.length > 0) {

//        var queryString = "((" + condGrp.Condition_Coll[0]["CName"] + " " + condGrp.Condition_Coll[0]["Operator"] + " " + condGrp.Condition_Coll[0]["Value"] + ") ";
//        for (i = 1; i < condGrp.Condition_Coll.length; i++)
//            queryString += condGrp.operator + " (" + condGrp.Condition_Coll[i]["CName"] + " " + condGrp.Condition_Coll[i]["Operator"] + " " + condGrp.Condition_Coll[i]["Value"] + ") ";
//        //queryString += ")";
//        return queryString;
//    }
//    return "";
//};







