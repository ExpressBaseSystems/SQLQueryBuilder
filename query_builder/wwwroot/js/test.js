
var join = function (l, r, act) {
    this.leftnode = l;
    this.rightnode = r;
    this.activity = act;
}
var QueryBuilder = function (object) {
    this.tbName = [];
    this.arraysort = [];
    // this.a = [];
    // this.r = [];
    this.drawTree = false;
    //this.deleteflag = false;
    this.LeftNode;
    this.RightNode;
    this.joinArray = [];

    this.storeTableNames = [];
    this.dupTableNames = [];
    this.dragableArray = [];
    this.TableSchema = object;
    this.mySVG = $(".DesignPane").connectSVG();
    this.DesignPane = $(".DesignPane");
    this.SortPane = $(".SortPane");
    this.ConditionPane = $(".ConditionPane");
    this.QueryPane = $(".QueryPane");
    this.IdCounters = {
        TableCount: 0
    }
    this.count = 0;
    this.columnName = [];
    this.tbName = [];
    this.array = [];
    this.drawTree = false;
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
                                                <ul id="treeview_${key}" class="cols-cont"style="display:none">
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
        })
    };

    this.tableOnDrop = function (event, ui) {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.left = event.pageX - this.droploc.offset().left;
        this.top = event.pageY - this.droploc.offset().top;
        this.tableName = $(ui.draggable).attr('tname');
        this.objId = this.tableName + this.IdCounters["TableCount"]++;                                         //count.....
        this.droploc.append(`<div class="table-container table-${this.tableName}" id="${this.objId}"
                             style="position:absolute;top:${this.top};left:${this.left};">
                             <div class="Table">
                             <div id="tbhd_${this.tableName}">${this.tableName}
                             <button class="btn0">
                             <i class="fa fa-window-close" aria-hidden="true"></i></button> </div>
                             <div id="col-container${this.objId}"></div></div>`);
        // onclick="$('#${this.objId}').remove()"
        this.addColoums("col-container" + this.objId);
        $($("#" + this.objId).find("#tbhd_" + this.tableName).find(".btn0")).on("click", this.removTable.bind(this));
        $("#" + this.objId).draggable({ containment: ".DesignPane", handle: "#tbhd_" + this.tableName });
        this.arraycol = [];
        this.dupTableNames.push(this.tableName);
        for (var i = 0; i < this.dupTableNames.length; i++) {
            if (this.storeTableNames.indexOf(this.dupTableNames[i]) == -1) {
                this.storeTableNames.push(this.dupTableNames[i])
            }
        }

    };

    this.removTable = function (event) {
        $($(event.target).closest('.Table').parent()).remove();
        this.tableName = $(event.target).closest("#tbhd_" + this.tableName).text().trim();
        this.array.pop(this.tableName);
        this.mySVG.redrawLines();
    };


    this.addColoums = function ($container) {
        this.treepusharray();
        for (i = 0; i < this.TableSchema[this.tableName].length; i++) {
            this.item = this.TableSchema[this.tableName][i];
            $("#" + $container).append(`<div class="col" tabindex="1" id="${this.tableName}-col${i}" cnm="${this.item.cname}" 
                datatp="${this.item.type}" con="${this.item.constraints}" fortnm="${this.item.foreign_tnm}" 
                forcnm="${this.item.foreign_cnm}" ><span><input type="checkbox" id="mycheck" /></span>
                <span id="ann">${this.item.cname}</span><span>${this.item.type}</span><span class="icon"></span></div>`);
            this.subtreeappend();

        }

        this.treeFunction();
        this.foreignConstruct();
        $('input[type="checkbox"]').on("click", this.querywriter.get_parent);
        $(".col").on("focus", this.sortOrder.builderContextmenu);



        this.makeDroppableColumn();
    };

    //tree

    this.treepusharray = function () {
        if (this.array.indexOf(this.tableName) === -1)
            this.array.push(this.tableName);
        else
            return;
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
        }
        this.whereClauseObjects.makeDroppable(this.storeTableNames);
    };

    this.forkey = {
        fortname: [],
        forcname: [],
        table: [],
        cname: []
    };

    this.foreign_key = function (a, b) {
        this.mySVG.drawLine({
            left_node: a,
            right_node: b,
            horizantal_gap: 0,
            status: ''
        });
        $(a).parent().parent().parent().draggable({
            drag: function (event, ui) {
                this.mySVG.redrawLines(this.LeftNode, this.RightNode);
                this.LeftNode = null; this.RightNode = null;
                // this.lineLoopfunction();
            }.bind(this)
        });
        $(b).parent().parent().parent().draggable({
            drag: function (event, ui) {
                this.mySVG.redrawLines(this.LeftNode, this.RightNode);
                this.LeftNode = null; this.RightNode = null;
                // this.lineLoopfunction();
            }.bind(this)
        });

        this.forignkeyline_Contextmenu();
        this.LeftNode = null;
        this.RightNode = null;
        //svg g: hover innerWidth {sroke: 10px; }


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


    this.foreignConstruct = function () {
        if ($('.DesignPane').children().length > 0) {

            //mySVG = $('.DesignPane').connectSVG();
            for (k = 0; k < this.array.length; k++) {
                var colCollection = this.TableSchema[this.array[k]];
                for (i = 0; i < colCollection.length; i++) {
                    if (this.array.indexOf(colCollection[i].foreign_tnm) > -1 && (colCollection[i].foreign_tnm === this.tableName || this.array[k] === this.tableName)) {
                        //if (colCollection[i].foreign_tnm === this.tableName ){
                        var fortname = colCollection[i].foreign_tnm;
                        var forcname = colCollection[i].foreign_cnm;
                        var cname = colCollection[i].cname;
                        this.fcm = $("div[cnm='" + forcname + "']").attr("id");
                        this.cnme = $("div[cnm='" + cname + "']").attr("id");

                        this.foreign_key("#" + this.fcm, "#" + this.cnme);
                        //}
                    }
                }
            }
        }
    };

    this.ColumnOnDrop = function (event, ui) {
        //mySVG = $('.DesignPane').connectSVG();
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.div1 = $(ui.draggable).attr("id");
        this.div2 = $(event.target).attr("id");
        this.foreign_key("#" + this.div1, "#" + this.div2);

    };

    //...........
    //this.lineLoopfunction = function () {
    //    $.each($("svg g"), function (i, obj) {
    //        $.each(this.joinArray, function (i, obe) {
    //            if (($(obj).attr("left") === obe.leftnode) && ($(obj).attr("right") === obe.rightnode)) { 
    //                if (obe.activity === "leftjoin") {

    //                }
    //                if (obe.activity === "rightjoin") {

    //                }

    //            }
    //        }.bind(this));

    //    }.bind(this));

    //};context-menu-item context-menu-icon context-menu-icon-leftjoin context-menu-visible context-menu-hover


    this.forignkeyline_Contextmenu = function (e) {

        $.contextMenu({
            selector: "g",

            items: {
                "left join": { name: "Left join", icon: "leftjoin", callback: this.Joinleft.bind(this), },
                "right join": { name: "Right join", icon: "rightjoin", callback: this.Joinright.bind(this), },
                "full join": { name: "Full join", icon: "fulljoin", callback: this.colourChange.bind(this), },
                "delete": { name: "Delete", icon: "delete", callback: this.removLine.bind(this), },
                //"sep1": "---------",
                //"quit": { name: "Quit", icon: function ($element, key, item) { return 'context-menu-icon context-menu-icon-quit'; } }
            }

        });
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
    }

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
    }

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
        $(".context-menu-active").children().attr("stroke", 'red');
        this.mySVG.ChangeLineColor($(".context-menu-active").attr("left"), $(".context-menu-active").attr("right"), "fulljoin");
    }

    this.removLine = function (itemKey, opt, rootMenu, originalEvent) {
        //opt.$trigger.remove();
        this.LeftNode = $(".context-menu-active").attr("left");
        this.RightNode = $(".context-menu-active").attr("right");
        $(".context-menu-active").remove();

    };
    this.init = function () {
        this.appendDraggableTableNames();
        this.appendDragulaTableNames();
        this.makeDroppable();
        this.querywriter = new SQLqDisplay();
        this.sortOrder = new SqLsortOrder();
        this.whereClauseObjects = new WhereBuilder();
        $("a[href='#Condition']").on("click", this.whereClauseFn.bind(this));
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
                    if (this == e.target) {
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













