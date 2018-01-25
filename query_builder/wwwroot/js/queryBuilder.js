var QueryBuilder = function (object) {   
    this.tbName = [];
    this.TableSchema = object;
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
    this.a = [];
    this.r = [];
    this.drawTree = false;
    this.appendTableNames = function ()
    {
        for (var key in this.TableSchema) {
            $("#tables-cont").append(`<ul class="treeview"><li class="dragable t-draggable" tname="${key}">${key}   
            </li></ul>`);
        }
    };
    this.makeDroppable = function ()
    {
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
    this.tableOnDrop = function (event, ui)
    {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.left = event.pageX - this.droploc.offset().left;
        this.top = event.pageY - this.droploc.offset().top;
        this.tableName = $(ui.draggable).attr('tname');
        this.objId = this.tableName + this.IdCounters["TableCount"]++;
        this.droploc.append(`<div class="table-container table-${this.tableName}" id="${this.objId}" style="position:absolute;top:${this.top};left:${this.left};"> <div class="Table">
                            <div id="tbhd_${this.tableName}">${this.tableName}</div>
                             <div id="col-container${this.objId}"></div></div>`);
        this.addColoums("col-container" + this.objId);
        $("#" + this.objId).draggable({ containment: ".DesignPane"});
    };
    this.addColoums = function ($container)
    {
        this.treepusharray();
        for (i = 0; i < this.TableSchema[this.tableName].length; i++)
        {
             this.item = this.TableSchema[this.tableName][i];
             $("#" + $container).append(`<div class="col" tabindex="1" id="${this.tableName}-col${i}" cnm="${this.item.cname}" 
                datatp="${this.item.type}" con="${this.item.constraints}" fortnm="${this.item.foreign_tnm}" 
                forcnm="${this.item.foreign_cnm}" ><span><input type="checkbox" id="mycheck" /></span>
                <span id="ann">${this.item.cname}</span><span>${this.item.type}</span><span class="icon"></span></div>`);
                this.subtreeappend(); 
                 
        }
        $(".col").on("focus", this.builderContextmenu.bind(this));
        this.treeFunction();
    };
    this.subtreeappend = function ()
    {
        if (!this.dropObj.parent().hasClass("treeview-tree"))
        {
            this.dropObj.children("ul").append(`<li class="dragables" colname="${this.item.cname}"  dtp="${this.item.type}">${this.item.cname}</li>`);
            this.drawTree = true;
        }
        this.whereConObject.makeDroppable();
    }
    this.treepusharray = function ()
    {
        this.array.push(this.tableName);
        $.each(this.dropObj.parent().parent().children(), function (i, obj) {
            $(obj).removeClass("tre");
        });
        this.dropObj.parent().addClass("tre");
        if (!this.dropObj.parent().hasClass("treeview-tree"))
        {
            this.dropObj.append("<ul></ul>");
        }
    }
    this.treeFunction = function ()
    {
       if (this.drawTree)
        {
            $('.tre').each(function () {
                var tree = $(this);
                tree.treeview();
            });
            this.drawTree = false;
           
        }
    }
    this.builderContextmenu = function (e)
    {
       var id = $(e.target).attr("id");
       $.contextMenu({
       selector: "#" + id,
       items: {
           "fold1": {
                 "name": "Sort",
                    "items": {
                        "Ascending": { "name": "Ascending", icon: "", callback: this.sortorder.bind(this) },
                        "Descending": { "name": "Descending", icon: "", callback: this.sortorder.bind(this) }
                    }
                }
           }
        });
    }
    this.sortorder = function (itemKey, opt, rootMenu, originalEvent)
    {
        var id = $(opt.selector).attr("id");
        this.tableName = $(opt.selector).parent().siblings().text().replace(/\s/g, '')
        if (itemKey === "Ascending")
        {
            $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-asc'></i>");
            this.columnName = $(opt.selector).attr("cnm");
            $('.nav-tabs a[href="#sort"]').tab("show");
            this.sort();
        }
        else
        {
            $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-desc'></i>");/* $(".context-menu-active")*/
            this.columnName = $(opt.selector).attr("cnm");
            $('.nav-tabs a[href="#sort"]').tab("show");
            this.sort();
        }

    }
    this.sort = function ()
    {
        $("#sortorder_" + this.tableName).append(`<div class="sortbox">${this.columnName}</div>`)
        $(function (){
            $(".sortorder").sortable();
            $(".sortorder").disableSelection();
        });
    };
    this.init = function () {
        this.appendTableNames();
        this.makeDroppable();
        this.whereConObject = new SqlWhereCondition();
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
     //$(".dragable").draggable({
        //    revert: "invalid",
        //    tolerance : "fit",
        //    helper: "clone",
        //    appendTo: "body"
        //});
        //$('.drop').droppable({
        //    tolerance: "fit",
        //    accept: ".dragable",
        //    drop: this.onDropFn.bind(this)

        //});
    //this.onDropFn = function (event, ui)
    //{
    //    this.droploc = $(event.target);
    //    this.dropObj = $(ui.draggable);
    //    this.left = event.pageX - this.droploc.offset().left;
    //    this.top = event.pageY - this.droploc.offset().top;
    //    if (this.dropObj.hasClass("dragable"))
    //    {
    //        this.tableName = $(ui.draggable).attr('tname');
    //        this.objId = this.tableName + this.count++;
    //        this.droploc.append(`<div class="table-${this.tableName}" id="${this.objId}" style="position:absolute;top:${this.top};left:${this.left};"> <div class="Table">
    //        <div id="tbhd_${this.tableName}">${this.tableName}</div>
    //        <div id="Row"></div></div>`);
    //        this.array.push(this.tableName);
    //        $.each(this.dropObj.parent().parent().children(), function (i, obj) {
    //            $(obj).removeClass("tre");
    //        });
    //        this.dropObj.parent().addClass("tre");
    //        if (!this.dropObj.parent().hasClass("treeview-tree")) {
    //            this.dropObj.append("<ul></ul>");
    //        }
    //        if ($('.drop').children().length > 0)
    //        {
    //            for (k = 0; k < this.array.length; k++)
    //            {
    //                var colCollection = this.TableSchema[this.array[k]];
    //                for (i = 0; i < colCollection.length; i++)
    //                {
    //                    if (this.array.indexOf(colCollection[i].foreign_tnm) > -1)
    //                    {
    //                        var fortnm = colCollection[i].foreign_tnm;
    //                        var forcname = colCollection[i].foreign_cnm;
    //                        var cname = colCollection[i].cname;
    //                    }

    //                }
    //            }

    //        }
    //        for (i = 0; i < this.TableSchema[this.tableName].length; i++)
    //        {
    //            var item = this.TableSchema[this.tableName][i];
    //            $("#" + this.objId + " #Row").append(`<div class="col" tabindex="1" id="${this.tableName}-col${i}" cnm="${item.cname}" 
    //            datatp="${item.type}" con="${item.constraints}" fortnm="${item.foreign_tnm}" 
    //            forcnm="${item.foreign_cnm}" ><span><input type="checkbox" id="mycheck" /></span>
    //            <span id="ann">${item.cname}</span><span>${item.type}</span><span class="icon"></span></div>`);
    //             //............................................................................................................................
    //            if (!this.dropObj.parent().hasClass("treeview-tree"))
    //            {
    //                this.dropObj.children("ul").append(`<li class="dragables" colname="${item.cname}"  dtp="${item.type}">${item.cname}</li>`);
    //                this.drawTree = true;

    //            }

    //        }
    //        $('input[type="checkbox"]').on("click", this.get_parent.bind(this));
    //        $(".table-" + this.tableName).draggable({ containment: ".drop" });

    //    }
    //    else
    //    {
    //        $(this.dropObj).css({ top: this.top, left: this.left });
    //    }
    //    $(".col").on("focus", this.builderContextmenu.bind(this));
    //    //.......................................................................................................
    //    if (this.drawTree)
    //    {
    //        $('.tre').each(function () {
    //            var tree = $(this);
    //            tree.treeview();
    //        });
    //        this.drawTree = false;
    //        $("#Sort").append(`<div class="sortorder" id="sortorder_${this.tableName}"></div>`);
    //    }
    //    $(".dragables").draggable({
    //            revert: "invalid",
    //            helper: "clone",
    //            appendTo: "body"
    //    });
    //    $(".where").droppable({
    //        accept: ".dragables",
    //        drop: this.onwhereDropFn.bind(this)
    //    });
    //};
    //this.onwhereDropFn = function (event, ui)
    //{
    //    this.droploc = $(event.target);
    //    this.dropObj = $(ui.draggable);
    //    this.left = event.pageX - this.droploc.offset().left;
    //    this.top = event.pageY - this.droploc.offset().top;
    //    if (this.dropObj.hasClass("dragables"))
    //    {
    //        this.columnName = $(ui.draggable).attr('colname');
    //        this.datatype = $(ui.draggable).attr('dtp')
    //        //this.condition();
    //    }
    //    else
    //    {
    //        $(this.dropObj).css({ top: this.top, left: this.left});
    //    }
    //    this.condition();
    //    $(".where_cond").draggable();
    //    $(".where_cond_grp").droppable({
    //        accept: ".dragables,.where_cond_cond",
    //        drop: this.onwherecond_grpDropFn.bind(this)
    //    });
    //    $(".where_cond_grp").draggable();
    //};
    //this.onwherecond_grpDropFn = function (event, ui)
    //{
    //    this.droploc = $(event.target);
    //    this.dropObj = $(ui.draggable);
    //    this.left = event.pageX - this.droploc.offset().left;
    //    this.top = event.pageY - this.droploc.offset().top;
    //    if ((this.dropObj.hasClass("where_cond_cond")) || (this.dropObj.hasClass("dragables")))
    //    {
    //        this.columnName = $(ui.draggable).attr('colname');
    //        this.datatype = $(ui.draggable).attr('dtp');
    //    }
    //    else
    //    {
    //        $(this.dropObj).css({ top: this.top, left: this.left });
    //    }
    //    this.conditiongrp();
    //    $(".where_cond_cond").draggable();

    //}
    //this.conditiongrp = function ()
    //{
    //    if (this.datatype == "text")
    //    {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.text.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.text[i]}</option>`);
    //        }

    //    }
    //    else if (this.datatype == "integer") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.integer.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.integer[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "numeric") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.numeric.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.numeric[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "date") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.date.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.date[i]}</option>`);
    //        }
    //    }

    //    else if (this.datatype == "serial") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.serial.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.serial[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "real") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.real.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.real[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "boolean") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.boolean.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.boolean[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "time") {
    //        this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.time.length; i++) {
    //            $(".where_cond_cond select").append(`<option value="equal">${this.time[i]}</option>`);
    //        }
    //    }

    //}
    //this.condition = function ()
    //{

    //    if (this.datatype == "text")
    //    {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.text.length; i++)
    //        {
    //            $(".where_cond select").append(`<option value="equal">${this.text[i]}</option>`);
    //        }

    //    }
    //    else if (this.datatype == "integer")
    //    {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.integer.length; i++) {
    //            $(".where_cond select").append(`<option value="equal">${this.integer[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "numeric")
    //    {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.numeric.length; i++)
    //        {
    //            $(".where_cond select").append(`<option value="equal">${this.numeric[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "date")
    //    {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.date.length; i++) {
    //            $(".where_cond select").append(`<option value="equal">${this.date[i]}</option>`);
    //        }
    //    }

    //    else if (this.datatype == "serial")
    //    {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.serial.length; i++) {
    //            $(".where_cond select").append(`<option value="equal">${this.serial[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "real")
    //    {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.real.length; i++) {
    //            $(".where_cond select").append(`<option value="equal">${this.real[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "boolean") {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.boolean.length; i++) {
    //            $(".where_cond select").append(`<option value="equal">${this.boolean[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "time") {
    //        this.droploc.append(`<div class="where_cond_grp"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
    //        for (i = 0; i < this.time.length; i++) {
    //            $(".where_cond select").append(`<option value="equal">${this.time[i]}</option>`);
    //        }
    //    }

    //}
    //this.get_parent = function (event)
    //{
    //    $.each($(event.target).closest(".col").children(), this.get_sibiling.bind(this));
    //    obj = $(event.target).parent();
    //    if ($(event.target).prop("checked"))
    //    {
    //        if ($(obj).next().attr("id") == "ann")
    //        {
    //            this.annamma = $(obj).parent().parent().siblings().text();
    //            this.raju = $(obj).next().text();
    //            $(".display").empty();
    //            if (this.annamma != this.tbName) {
    //                this.tbName.push(`${this.annamma}`);
    //            }
    //            this.columnName.push(`${this.annamma}.${this.raju}`);
    //            $(".display").append(`<span class="sqlkeys">SELECT</span> <span class="colnames">${this.columnName}</span> <span class="sqlkey">FROM</span> <span class="which_table">${this.tbName}</span>`);
    //        }
    //    }
    //    else {
    //        this.columnName.pop($(obj).next().text());
    //        if (($(obj).parent().parent().siblings().text() != this.tbName))
    //        {
    //            this.tbName.pop($(obj).parent().parent().siblings().text());
    //        }
    //        $(".display").empty();
    //        $(".display").append(`<span class="sqlkeys">SELECT</span> <span class="colnames">${this.columnName}</span> <span class="sqlkey">FROM</span> <span class="which_table">${this.tbName}</span>`);
    //    }

    //};
    //this.get_sibiling = function (i, obj)
    //{        
    //    if ($(obj).children().prop("checked")) {
    //        if ($(obj).next().attr("id") == "ann") {
    //            this.columnName = $(obj).next().text();
    //            $("#querywindow").append(`<span class="sqlkeys">SELECT</span> <span class="colnames">${this.columnName}</span> <span class="sqlkey">FROM</span> <span class="which_table">${this.tableName}</span>`);
    //        }
    //    }
    //    else
    //    {
    //    }
    //}
    //this.builderContextmenu = function (e) {
    //    var id = $(e.target).attr("id");
    //    $.contextMenu({
    //        selector: "#" + id,
    //        items: {
    //            "fold1": {

    //                "name": "Sort",
    //                "items": {
    //                    "Ascending": { "name": "Ascending", icon: "", callback: this.sortorder.bind(this) },

    //                    "Descending": { "name": "Descending", icon: "", callback: this.sortorder.bind(this) }
    //                }
    //            },
    //           // "fold2": { "name": "where", icon: "", callback: this.wherecondition.bind(this) }
    //        }
    //    });
    //}
    //this.sortorder = function (itemKey, opt, rootMenu, originalEvent)
    //{
    //    var id = $(opt.selector).attr("id");
    //    this.tableName = $(opt.selector).parent().siblings().text().replace(/\s/g, '')
    //    if (itemKey === "Ascending")
    //    {
    //        $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-asc'></i>");
    //        this.columnName = $(opt.selector).attr("cnm");
    //        $('.nav-tabs a[href="#sort"]').tab("show");
    //        this.sort();
    //    }
    //    else
    //    {
    //        $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-desc'></i>");/* $(".context-menu-active")*/
    //        this.columnName = $(opt.selector).attr("cnm");
    //        $('.nav-tabs a[href="#sort"]').tab("show");
    //        this.sort();
    //    }

    //}
    //this.sort = function ()
    //{
    //    $("#sortorder_" + this.tableName).append(`<div class="sortbox">${this.columnName}</div>`)
    //    //.........................................................sort
    //    $(function () {
    //        $(".sortorder").sortable();
    //        $(".sortorder").disableSelection();
    //    });
    //};
    //this.wherecondition = function (itemKey, opt, rootMenu, originalEvent)
    //{
    //    this.colName = $(opt.selector).attr("cnm");
    //    this.datatype = $(opt.selector).attr("datatp");
    //    $('.nav-tabs a[href="#Condition"]').tab("show");
    //    this.condition();
    //}
    //this.aggrecondition = function (itemKey, opt, rootMenu, originalEvent) {
    //    this.colName = $(opt.selector).attr("cnm");
    //    this.datatype = $(opt.selector).attr("datatp");
    //    $('.nav-tabs a[href="#Aggregate"]').tab("show");

    //}
    //this.condition = function ()
    //{
    //    if (this.datatype == "text")
    //    {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.text.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.text[i]}</option>`);
    //        }

    //    }
    //    else if (this.datatype == "integer")
    //    {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
    //        for (i = 0; i < this.integer.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.integer[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "numeric")
    //    {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select class="achu1" aria-label="Aggregate"></select><input type="text" /></div>`);
    //        for (i = 0; i < this.numeric.length; i++)
    //        {
    //            $(".condition_group1 select").append(`<option value="equal">${this.numeric[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "date")
    //    {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select class="achu1" aria-label="Aggregate"></select><input type="text" /></div>`);
    //        for (i = 0; i < this.date.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.date[i]}</option>`);
    //        }
    //    }

    //    else if(this.datatype == "serial") {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select class="achu1" aria-label="Aggregate"></select><input type="text" /></div>`);
    //        for (i = 0; i < this.serial.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.serial[i]}</option>`);
    //        }
    //    }
    //    else if(this.datatype == "real") {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select class="achu1" aria-label="Aggregate"></select><input type="text" /></div>`);
    //        for (i = 0; i < this.real.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.real[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "boolean") {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select class="achu1" aria-label="Aggregate"></select><select class="achu2" aria-label="Aggregate"><option value="true">true</option><option value="true">false</option></select></div>`);
    //        for (i = 0; i < this.boolean.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.boolean[i]}</option>`);
    //        }
    //    }
    //    else if (this.datatype == "time") {
    //        $(".condition_group1 ").append(`<div class="condition">${this.colName}<select class="achu1" aria-label="Aggregate"></select><input type="text" /></div>`);
    //        for (i = 0; i < this.time.length; i++) {
    //            $(".condition_group1 select").append(`<option value="equal">${this.time[i]}</option>`);
    //        }
    //    }
    //    var text = document.getElementById("myText").value;
    //    var operator = $("#achu1 option:selected").text();
    //    var col = this.colName;
    //    var int_andor = "and";
    //    var array1 = [text, operator, col, int_andor];
    //    var ob = { text, operator, col, ex_andor, int_andor };
    //    if ($(".condition_group1").children().hasClass("condition"))
    //   {

    //    }
    //    if ($(".condition_group2").children().hasClass("condition"))
    //    {
    //        var ex_andor = $("#extern option:selected").text();
    //        var array2 = [text, operator, col, int_andor, ex_andor];
    //    }
    //    this.callAjax(ob);
    //    $(".condition").draggable({
    //        revert: "invalid",
    //        appendTo: "body"
    //    });
    //    $('.condition_group2').droppable({
    //        tolerance: "fit",
    //        accept: ".condition",
    //        drop: this.onDrop2Fn.bind(this)
    //    });
    //    $('.condition_group1').droppable({
    //        tolerance: "fit",
    //        accept: ".condition",
    //        drop: this.onDrop2Fn.bind(this)
    //    });
    //    var x = $("#cond1").offset();
    //    var y = $("#cond2").offset();
    //    var a = $("#cond1").width();
    //    var b = $("#cond1").height();
    //    var c = $("#cond2").width();
    //    var d = $("#cond2").height();
    //    var xpoint1 = x.left + a;
    //    var ypoint1 = x.top + (b / 2);
    //    var xpoint2 = y.left + c;
    //    var ypoint2 = x.top + (d / 2);
    //    var ct = document.getElementById("myCanvas");
    //    var ctx = ct.getContext("2d");
    //    ctx.beginPath();
    //    ctx.moveTo(0, 30);
    //    ctx.lineTo(xpoint1, ypoint1 + 50);
    //    ctx.lineTo(xpoint2 + c, ypoint2 + 50);
    //    ctx.lineTo(35, 30);
    //    ctx.lineTo(35, 96);
    //    ctx.lineTo(0, 96);
    //    ctx.moveTo(xpoint1,ypoint1);
    //    ctx.lineTo(xpoint1, ypoint1+50);
    //    ctx.lineTo(xpoint2 + c, ypoint2+50);
    //    ctx.lineTo(xpoint2,ypoint2);
    //    ctx.stroke();
    //}
    //this.onDropFn2 = function (event, ui)
    //{
    //    //this.dropObj = $(ui.draggable);
    //    //this.tableName = $(ui.draggable).attr('tname');
    //};
    //this.onDropFn2 = function (event, ui) {
    //    this.dropObj = $(ui.draggable);
    //    this.tableName = $(ui.draggable).attr('tname');
    //};
    //this.callAjax = function (ob) 
    //{
    //    $.ajax({
    //        type: 'POST',
    //        url: "../QB/xxxx",
    //        data: ob,
    //        success: function(data)
    //                 {
    //                    for (var i=0; i<data.length; i++) 
    //                    {
    //                         var items = data[i];
    //                    }
    //                 }
    //        })
    //}

    