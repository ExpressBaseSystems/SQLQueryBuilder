aliasarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var join = function (l, r, act) {
    this.leftnode = l;
    this.rightnode = r;
    this.activity = act;
};

var QueryBuilder = function (object) {


    this.mySVG = $(".DesignPane").connectSVG();


    this.arraysort = [];

    this.LeftNode;
    this.RightNode;
    this.joinArray = [];
    this.tableExist = false;
    this.lineId = 0;

    this.drawTree = false;
    this.storeTableNames = [];
    this.dupTableNames = [];
    this.dragableArray = [];
    this.TableSchema = object;
    this.DesignPane = $(".DesignPane");
    this.SortPane = $(".SortPane");
    this.ConditionPane = $(".ConditionPane");
    this.QueryPane = $(".QueryPane");
    this.IdCounters = {
        TableCount: 0
    };
    this.count = 0;
    this.columnName = [];
    this.tbName = [];
    this.array = [];
    this.drawTree = false;
    this.QueryDisply = {};
    this.lateststr = "";
    this.mergeString = "";
    this.saveFormatString = "";
    this.alias_name = function (a, b) {
        this.r = a;
        this.alias = b;
    };
    this.query = [];
    this.tb = [];
    this.ForGrp = {};

    var d = function () {
        this.jointype = "",
            this.fortnames = "",
            this.forcnames = "",
            this.tables = "",
            this.cnames = ""
    };

    var QueryObject = function () {
        this.TableCollection = [];
        this.QueryString = "";
        this.Conditions = {};
    };

    this.tables = function () {  //Constructor
        this.id = "";
        this.tableName = "";
        this.columns = [];
        this.aliasName = "";
    };

    this.appendDraggableTableNames = function () {
        for (var key in this.TableSchema) {
            $("#tables-cont").append(`<ul class="treeview"><li class="dragable t-draggable" tname="${key}">${key}   
            </li></ul>`);
        }

    };

    this.appendDragulaTableNames = function () {
        for (var key in this.TableSchema) {
            $("#dragula-tables-cont").append(`<ul class="treeviewDragula" style="display:none">
                                            <li id="tname_${key}" tname="${key}">${key}   
                                                <ul id="treeview_${key}" class="cols-cont" style="display:none">
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
        $(".t-draggable").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        this.DesignPane.droppable({
            accept: ".t-draggable",
            drop: this.tableOnDrop.bind(this)
        });
    };

    this.tableOnDrop = function (event, ui) {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.left = event.pageX - this.droploc.offset().left;
        this.top = event.pageY - this.droploc.offset().top;
        this.tableName = $(ui.draggable).attr('tname');
        this.objId = this.tableName + this.IdCounters["TableCount"]++;
        this.droploc.append(`<div class="table-container table-${this.tableName}" id="${this.objId}" style="position:absolute;top:${this.top};left:${this.left};">
                                <div class="Table">
                                <div id="tbhd_${this.tableName}">${this.tableName}</div>  
                                <div id="col-container${this.objId}"></div></div>`);
        this.addColoums("col-container" + this.objId);
        //$("#" + this.objId).draggable({ containment: ".DesignPane" });
        $($("#" + this.objId).find("#tbhd_" + this.tableName).find(".btn0")).on("click", this.removTable.bind(this));
        $("#" + this.objId).draggable({ containment: ".DesignPane", handle: "#tbhd_" + this.tableName });
        this.arraycol = [];
        this.tablesObj = new this.tables();
        this.tablesObj.tableName = this.tableName;
        this.tablesObj.id = this.objId;
        this.saveQueryObject.TableCollection.push(this.tablesObj);
        this.dupTableNames.push(this.tableName);
        for (var i = 0; i < this.dupTableNames.length; i++) {
            if (this.storeTableNames.indexOf(this.dupTableNames[i]) === -1)
                this.storeTableNames.push(this.dupTableNames[i]);
        }

    };

    this.addColoums = function ($container) {
        this.treepusharray();
        for (i = 0; i < this.TableSchema[this.tableName].length; i++) {
            this.keyId = "keyId" + this.IdCounters["TableCount"]++;
            this.item = this.TableSchema[this.tableName][i];
            $("#" + $container).append(`<div class="col form-inline" tabindex="1" id="${this.tableName}-col${i}" cnm="${this.item.cname}" datatp="${this.item.type}" con="${this.item.constraints}" fortnm="${this.item.foreign_tnm}" forcnm="${this.item.foreign_cnm}" >
                <span><input type="checkbox" id="mycheck" class="checkBoxClass" /></span>
                <span id="ann">${this.item.cname}</span>
                <span>${this.item.type}</span>
                <span><i class="fa fa-key" id="${this.keyId}" aria-hidden="true" style="display:none"></i></span></div>`);
            this.subtreeappend();
            if (this.item.constraints === "PRIMARY KEY")
                $("#" + this.keyId).show();
        }

        this.treeFunction();
        this.foreignConstruct();
        $('input[type="checkbox"]').on("click", this.get_parent.bind(this));
        $(".col").on("focus", this.sortOrder.builderContextmenu);
        this.makeDroppableColumn();
    };

    this.treepusharray = function () {
        if (this.array.indexOf(this.tableName) === -1) {
            this.array.push(this.tableName);
        }
        $.each(this.dropObj.parent().parent().children(), function (i, obj) {
            $(obj).removeClass("tre");
        });
        this.dropObj.parent().addClass("tre");
        if (!this.dropObj.parent().hasClass("treeview-tree")) {
            this.dropObj.append("<ul></ul>");
        }

    };

    this.subtreeappend = function () {
        if (!this.dropObj.parent().hasClass("treeview-tree")) {
            this.dropObj.children("ul").append(`<li class="dragables" colname="${this.item.cname}"  datatype="${this.item.type}">${this.item.cname}</li>`);
            this.drawTree = true;

        }
    };

    this.treeFunction = function () {
        if (this.drawTree) {
            $('.tre').each(function () {
                var tree = $(this);
                tree.treeview();
            });
            this.drawTree = false;
            $("#Sort").append(`<div class="sortorder" id="sortorder_${this.tableName}"></div>`);
        }
    };

    this.whereClauseFn = function () {
        $("#tables-cont").hide();
        $(".treeviewDragula").show();
        for (var key in this.storeTableNames) {
            var tblName = this.storeTableNames[key];
            $("#treeview_" + tblName).show();
            if ($("#treeview_" + tblName).parent().parent().hasClass("treeview-tree")) {
                $("#treeview_" + tblName).parent().parent().removeClass("Dtre");
            }
            else {
                $("#treeview_" + tblName).parent().parent().addClass("Dtre");
                this.drawDTree = true;
            }
        }
        if (this.drawDTree) {
            $(".Dtre").each(function () {
                var tree = $(this);
                tree.treeview();
            });
            this.drawDTree = false;
        }
        this.whereClauseObjects.makeDroppable(this.storeTableNames);
    };

    this.get_parent = function (event) {
        var obj = $(event.target).parent();
        this.a = $(obj).parent().parent().siblings().text().trim();
        this.b = $(obj).parent().parent().parent().parent().attr("id");
        var ida = $(obj).parent().parent().parent().parent().attr("id").substr(-1);
        this.r = [];
        if ($(event.target).prop("checked")) {
            if ($(obj).next().attr("id") === "ann") {
                for (i = 0; i < this.saveQueryObject["TableCollection"].length; i++) {
                    if (this.saveQueryObject["TableCollection"][i].id === this.objId) {
                        this.saveQueryObject["TableCollection"][i].columns.push($(obj).next().text());
                    }
                }
                if (Object.keys(this.QueryDisply).indexOf(this.b) === -1) {
                    this.r.push($(obj).next().text());
                    this.QueryDisply[this.b] = new this.alias_name(this.r, aliasarray[ida]);
                    var aliasNm = aliasarray[ida];
                    for (i = 0; i < this.saveQueryObject["TableCollection"].length; i++) {
                        if (this.saveQueryObject["TableCollection"][i].id === this.objId) {
                            this.saveQueryObject["TableCollection"][i].aliasName = aliasNm;
                        }
                    }
                }
                else {
                    $.each($("#col-container" + this.b).children(), function (i, ob) {
                        if ($(ob).children().find("#mycheck").prop("checked")) {
                            this.r.push($(ob).children("#ann").text());
                        }
                    }.bind(this));
                    this.QueryDisply[this.b] = new this.alias_name(this.r, aliasarray[ida]);
                }
            }

        }
        else {
            for (i = 0; i < this.saveQueryObject["TableCollection"].length; i++) {
                if (this.saveQueryObject["TableCollection"][i].id === this.objId) {
                    this.saveQueryObject["TableCollection"][i].columns.splice(i, 1);
                }
            }

            $.each($("#col-container" + this.b).children(), function (i, obe) {
                if ($(obe).children().find("#mycheck").prop("checked")) {
                    this.r.push($(obe).children("#ann").text());
                }
            }.bind(this));

            this.QueryDisply[this.b] = new this.alias_name(this.r, aliasarray[ida]);
            if (this.r.length === 0) {
                delete this.QueryDisply[this.b];
            }

        }
        if (Object.keys(this.QueryDisply).length !== 0) {

            var str = "SELECT";
            this.tb = [];
            $.each(this.QueryDisply, function (key, value) {
                this.tb.push(key);
                $.each(value.r, function (i, ob) {
                    str += ` ${value.alias}.${ob} ,`;
                });
            }.bind(this));
            str = str.replace(/,\s*$/, "");
            str += "FROM";
            $.each(this.QueryDisply, function (key, value) {
                var updateKey = key.substring(key.length - 1, -1);
                str += ` ${updateKey} ${value.alias},`;
            });
            this.lateststr = str.substring(str.length - 1, -1);
            if (this.saveFormatString !== "") {
                this.mergeString = this.lateststr + " " + "\n" + "\t" + "WHERE" + " " + this.saveFormatString;
                this.saveQueryObject.QueryString = btoa(this.mergeString);
                this.editor.setValue((`${this.mergeString}`).replace(/,\s*$/, ""));
            }
            else {
                this.saveQueryObject.QueryString = btoa(this.lateststr);
                this.editor.setValue((`${this.lateststr}`).replace(/,\s*$/, ""));
            }
        }
        else
            this.editor.setValue("");

    };

    this.finalQueryFn = function (event) {

        $(".keypressEventText").each(function (i, ob) {
            if ($(ob).val().trim() === "")
                $("#saveError").html("please fill out fields").show().fadeOut("slow");
        });
        $(".changeEventTextFn").each(function (i, ob) {
            if ($(ob).val().trim() === "")
                $("#saveError").html("please fill out fields").show().fadeOut("slow");
        });
        var finalString = this.whereClauseObjects.recFinalQueryFn(this.whereClauseObjects.WHEREclouseQ);
        this.saveFormatString = finalString.substr(1);
        if (this.lateststr !== "") {
            this.mergeString = this.lateststr + " " + "\n" + "\t" + "WHERE" + " " + this.saveFormatString;
        }
        this.saveQueryObject.QueryString = btoa(this.mergeString);
        this.editor.setValue((`${this.mergeString}`).replace(/,\s*$/, ""));
    };

    this.saveQBFn = function () {
        var str = JSON.stringify(this.saveQueryObject);
        $.ajax({
            type: 'POST',
            url: "../QB/selectClause",
            data: {
                Json: str,
                Name: $("#queryobj_name").val()
            },
            success: function (data) {
                $("#myModal").modal("toggle");
            }
        });
    };

    this.finaljoinQueryFn = function (event) {
        this.finaljoinstring = this.JoinQuery(this.ForGrp);

    };

    this.makeDroppableColumn = function () {
        $(".col").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        $(".col").droppable({
            accept: ".col",
            drop: this.ColumnOnDrop.bind(this)
        })
    };

    this.forignkeyline_Contextmenu = function (e) {
        $.contextMenu({
            selector: "g",
            items: {
                "left join": { name: "Left join", icon: "leftjoin", callback: this.Joinleft.bind(this), },
                "right join": { name: "Right join", icon: "rightjoin", callback: this.Joinright.bind(this), },
                "full join": { name: "Full join", icon: "fulljoin", callback: this.colourChange.bind(this), },
                "delete": { name: "Delete", icon: "delete", callback: this.removLine.bind(this), },

            }

        });

    };

    this.ColumnOnDrop = function (event, ui) {

        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.div1 = $(ui.draggable).attr("id");
        this.div2 = $(event.target).attr("id");
        this.foreign_key("#" + this.div1, "#" + this.div2);

        this.ForGrp[this.c].fortnames = this.div1.split("-")[0];
        this.ForGrp[this.c].forcnames = $("#" + this.div1).attr('cnm');
        this.ForGrp[this.c].cnames = $("#" + this.div2).attr('cnm');
        this.ForGrp[this.c].tables = this.div2.split("-")[0];

    };

    this.JoinQuery = function (ForGrp) {
        var QString = '';
        for (key in ForGrp) {
            QString += ForGrp[key].jointype + " " + ForGrp[key].fortnames + " " + "On" + " " + ForGrp[key].fortnames + "." + ForGrp[key].forcnames + " " + "=" + " " + ForGrp[key].tables + "." + ForGrp[key].cnames;
        }
        return QString;




    };

    this.removTable = function (event) {
        $($(event.target).closest('.Table').parent()).remove();
        this.tableName = $(event.target).closest("#tbhd_" + this.tableName).text().trim();
        this.array.pop(this.tableName);
        this.mySVG.redrawLines();
    };

    this.foreignConstruct = function () {
        if ($('.DesignPane').children().length > 0) {
            for (k = 0; k < this.array.length; k++) {
                var colCollection = this.TableSchema[this.array[k]];
                for (i = 0; i < colCollection.length; i++) {
                    if (this.array.indexOf(colCollection[i].foreign_tnm) > -1 && (colCollection[i].foreign_tnm === this.tableName || this.array[k] === this.tableName)) {

                        var fortname = colCollection[i].foreign_tnm;
                        var forcname = colCollection[i].foreign_cnm;
                        var cname = colCollection[i].cname;
                        this.fcm = $("div[cnm='" + forcname + "']").attr("id");
                        this.cnme = $("div[cnm='" + cname + "']").attr("id");

                        this.foreign_key("#" + this.fcm, "#" + this.cnme);

                        this.ForGrp[this.c].fortnames = fortname;
                        this.ForGrp[this.c].forcnames = forcname;
                        this.ForGrp[this.c].cnames = cname;
                        this.ForGrp[this.c].tables = this.cnme.split("-")[0];


                    }
                }
            }
        }
    };

    this.foreign_key = function (a, b) {
        this.c = this.lineId++;
        if (!this.tableExist) {

            this.mySVG.drawLine({
                left_node: a,
                right_node: b,
                horizantal_gap: 0,
                status: '',
                Counter: this.c
            });
            this.ForGrp[this.c] = new d();
            this.ForGrp[this.c].jointype = "innerjoin";

        }
        this.tableExist = false;
        $(a).parent().parent().parent().draggable({
            drag: function (event, ui) {
                this.mySVG.redrawLines(this.LeftNode, this.RightNode);
                this.LeftNode = null; this.RightNode = null;

            }.bind(this)
        });
        $(b).parent().parent().parent().draggable({
            drag: function (event, ui) {
                this.mySVG.redrawLines(this.LeftNode, this.RightNode);
                this.LeftNode = null; this.RightNode = null;

            }.bind(this)
        });

        this.forignkeyline_Contextmenu();
        this.LeftNode = null;
        this.RightNode = null;



    };

    this.Joinleft = function (itemKey, opt, rootMenu, originalEvent) {
        var flag = false;
        var LeftNode = $(".context-menu-active").attr("left");
        var RightNode = $(".context-menu-active").attr("right");

        $.each(this.joinArray, function (i, obj) {
            if ((obj.leftnode === LeftNode) && (obj.rightnode === RightNode)) {
                obj.activity = "leftjoin";

                flag = true;
            }
        }.bind(this));
        if (!flag)
            this.joinArray.push(new join(LeftNode, RightNode, "leftjoin"));
        $(".context-menu-active").children().attr("stroke", 'blue');
        this.mySVG.ChangeLineColor($(".context-menu-active").attr("left"), $(".context-menu-active").attr("right"), "leftjoin");
        let key = $(".context-menu-active").attr('id');
        this.ForGrp.hasOwnProperty(key) ? this.ForGrp[key].jointype = "leftjoin" : null;

    };

    this.Joinright = function (itemKey, opt, rootMenu, originalEvent) {
        var flag = false;
        var LeftNode = $(".context-menu-active").attr("left");
        var RightNode = $(".context-menu-active").attr("right");

        $.each(this.joinArray, function (i, obj) {
            if ((obj.leftnode === LeftNode) && (obj.rightnode === RightNode)) {
                obj.activity = "rightjoin";

                flag = true;
            }
        }.bind(this));
        if (!flag)
            this.joinArray.push(new join(LeftNode, RightNode, "rightjoin"));
        $(".context-menu-active").children().attr("stroke", 'green');
        this.mySVG.ChangeLineColor($(".context-menu-active").attr("left"), $(".context-menu-active").attr("right"), "rightjoin");
        let key = $(".context-menu-active").attr('id');
        this.ForGrp.hasOwnProperty(key) ? this.ForGrp[key].jointype = "rightjoin" : null;

    };

    this.colourChange = function (itemKey, opt, rootMenu, originalEvent) {
        var flag = false;
        var LeftNode = $(".context-menu-active").attr("left");
        var RightNode = $(".context-menu-active").attr("right");
        $.each(this.joinArray, function (i, obj) {
            if ((obj.rightnode === RightNode)) {
                obj.activity = "fulljoin";

                flag = true;
            }
        }.bind(this));
        if (!flag)
            this.joinArray.push(new join(LeftNode, RightNode, "fulljoin"));
        $(".context-menu-active").children().attr("stroke", '#FF0000');
        this.mySVG.ChangeLineColor($(".context-menu-active").attr("left"), $(".context-menu-active").attr("right"), "fulljoin");
        let key = $(".context-menu-active").attr('id');
        this.ForGrp.hasOwnProperty(key) ? this.ForGrp[key].jointype = "fulljoin" : null;

    };

    this.removLine = function (itemKey, opt, rootMenu, originalEvent) {
        this.LeftNode = $(".context-menu-active").attr("left");
        this.RightNode = $(".context-menu-active").attr("right");
        this.ForGrp.hasOwnProperty($(".context-menu-active").attr('id')) ? delete this.ForGrp[$(".context-menu-active").attr('id')] : null;
        $(".context-menu-active").remove();
    };

    this.init = function () {
        this.saveQueryObject = new QueryObject();
        this.appendDraggableTableNames();
        this.appendDragulaTableNames();
        this.makeDroppable();
        this.sortOrder = new SqLsortOrder();
        this.whereClauseObjects = new WhereBuilder(this);
        this.saveQueryObject.Conditions = this.whereClauseObjects.WHEREclouseQ;
        $("a[href='#Condition']").on("click", this.whereClauseFn.bind(this));
        $("body").on("click", ".saveQuery", this.finalQueryFn.bind(this));
        $("body").on("click", ".saveQB", this.saveQBFn.bind(this));
        this.editor = new CodeMirror.fromTextArea(document.getElementById("QueryPane"),
            {
                mode: "text/x-pgsql",
                lineNumbers: true,
                lineWrapping: false,
                autoRefresh: true,
                readOnly: false,
                foldGutter: { rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment) },
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            });
        //$("#modal_btnSave").on("click", this.saveQBFn.bind(this));
        //$("#save_query_form").on("submit", this.callAjax.bind(this));
        //$("#save_queryobj").on("click", this.saveQBFn.bind(this));
    };

    this.init();
}
$.fn.extend({
    treeview: function () {
        return this.each(function () {
            // Initialize the top levels;
            var tree = $(this);
            tree.addClass('treeview-tree');
            tree.find('li').each(function () {
                var stick = $(this);
            });
            tree.find('li').has("ul").each(function () {
                var branch = $(this); //li with children ul
                branch.prepend("<i class='tree-indicator glyphicon glyphicon-chevron-right'></i>");
                branch.addClass('tree-branch');
                branch.on('click', function (e) {
                    if (this === e.target) {
                        var icon = $(this).children('i:first');
                        icon.toggleClass("glyphicon-chevron-down glyphicon-chevron-right");
                        $(this).children().children().toggle();
                    }
                })
                branch.children().children().toggle();
                branch.children('.tree-indicator, button, a').click(function (e) {
                    branch.click();
                    e.preventDefault();
                });
            });
        });
    }
});














































