var SqLsortOrder = function () {
    //SortbuilderContextmenu
    this.sorfun = {
        colNamesorder: [],
        value: ""
    };

    this.builderContextmenu = function (e) {
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
    }.bind(this);

    this.sortorder = function (itemKey, opt, rootMenu, originalEvent) {
        var id = $(opt.selector).attr("id");
        this.tableName = $(opt.selector).parent().siblings().text().replace(/\s/g, '')
        if (itemKey === "Ascending") {
            $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-asc adad'></i>");
            this.columnNames = $(opt.selector).attr("cnm");
            this.icon = $(opt.selector).attr(".icon, newIcon");
            $('.nav-tabs a[href="#sort"]').tab("show");
            this.sort();
        }
        else {
            $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-desc adad'></i>");/* $(".context-menu-active")*/
            this.columnNames = $(opt.selector).attr("cnm");
            this.icon = $(opt.selector).attr(".icon, newIcon");
            $('.nav-tabs a[href="#sort"]').tab("show");
            this.sort();
        }
    }

    this.sort = function () {
        var count = $(".sortfunction").children(".sortbox").length;
        for (var i = 0; i < count; i++) {
            if ($($(".sortfunction").children(".sortbox")[i]).text().trim() === this.columnNames) {
                $($(".sortfunction").children(".sortbox")[i]).remove();
                break;
            }
        }
        $(".sortfunction").append(`<div class="sortbox  sortbox_${this.columnNames}" cnm="${this.columnNames}" 
                                  id="${this.tableName}-col${i}">${this.columnNames} 
                              <button class="btn1">
                             <i class="fa fa-window-close" aria-hidden="true"></i></button></div>`);

        $($(`.sortbox_${this.columnNames}`).find(".btn1")).on("click", this.removFunc.bind(this));

        this.sorfun.value = $("itemKey").text();
        this.sorfun.colNamesorder.push(this.columnNames);
        $(function () {
            $(".sortfunction").sortable();
            $(".sortfunction").disableSelection();
        });
    };

    this.removFunc = function (event) {
        this.columnName = $(event.target).closest(".sortbox").text().trim();

        var str = $(event.target).closest(".sortbox").attr("id");
        var splits = str.split("-");
        this.tableName = splits[0];
        $.each($(".table-" + this.tableName).children().children().next().children(), function (i, obj) {
            if (this.columnName == $(obj).attr("cnm")) {
                $(obj).children(".icon").children().remove();
            }

        }.bind(this));
        $('.sortbox_' + this.columnName).remove();
        this.sorfun.colNamesorder.pop(this.columnName);
    };
    this.makeDroppablesort = function () {
        $(".dragables").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        $(".sortfunction").droppable({
            accept: ".dragables",
            drop: this.onsortDropFn.bind(this)
        });
    };

    this.onsortDropFn = function (event, ui) {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);

        this.columnNames = $(ui.draggable).attr('colname');
        this.tableName = $(ui.draggable).parent().parent().attr('tname');
        this.sort();
    };

    this.init = function () {

        this.makeDroppablesort();
    };
};