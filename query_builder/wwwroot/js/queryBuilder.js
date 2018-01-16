
var QueryBuilder = function (object) {
    this.TableSchema = object;
    this.count = 0;
    this.columnName = [];
    this.tbName = [];
    this.appendTableNames = function () {
        for (var key in this.TableSchema) {
            $("#tables-cont").append(`<ul class="treeview"><li class="dragable" tname="${key}">${key}
               
                	<ul>
            			<li><a href="#"></a></li>
            			<li><a href="#"></a>
            				
            			</li>
            			<li><a href="#"></a></li>
            			<li><a href="#"></a></li>
            		</ul>
            	
            </ul></li>`);
        }

        $(".dragable").draggable({

            revert: "invalid",
            helper: "clone",
            appendTo: "body",
            drag: function (event, ui) {
                $(ui.helper).css({ "background": "white", "border": "1px dotted black", "width": "200px" });
                $(ui.helper).children().find('i').css({ "font-size": "50px", "background-color": "transparent" });
            }
        });
        $('.drop').droppable({
            drop: this.onDropFn.bind(this)

        });
    };

    this.onDropFn = function (event, ui) {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.left = event.pageX - this.droploc.offset().left;
        this.top = event.pageY - this.droploc.offset().top;
        if (this.dropObj.hasClass("dragable")) {
            this.tableName = $(ui.draggable).attr('tname');
            this.objId = this.tableName + this.count++;
            this.droploc.append(`<div class="table-${this.tableName}" id="${this.objId}" style="position:absolute;top:${this.top};left:${this.left};"> <div class="Table">
                    <div id="tbhd">
                        ${this.tableName}
                    </div>
                    <div id="Row">

                    </div>
                </div>`);
            for (i = 0; i < this.TableSchema[this.tableName].length; i++) {
                var item = this.TableSchema[this.tableName][i];
                $("#" + this.objId + " #Row").append(`<div class="col" tabindex="1" id="${this.tableName}-col${i}" cnm="${item.cname}" 
                datatp="${item.type}" con="${item.constraints}" fortnm="${item.foreign_tnm}" 
                forcnm="${item.foreign_cnm}" ><span><input type="checkbox" id="mycheck" /></span>
                <span id="ann">${item.cname}</span><span>${item.type}</span><span class="icon"></span>
                </div>`);

            }
            $('input[type="checkbox"]').on("click", this.get_parent.bind(this));
            $(".table-" + this.tableName).draggable({ containment: ".drop" });
        }
        else {
            $(this.dropObj).css({ top: this.top, left: this.left });
        }
        $(".col").on("focus", this.builderContextmenu.bind(this));
    };
    this.get_parent = function (event) {
        //$.each($(event.target).closest(".col").children(), this.get_sibiling.bind(this));
        obj = $(event.target).parent();

        //if ($(event.target).prop("checked")) {
        //    if ($(obj).next().attr("id") == "ann")
        //    {
        //        this.annamma = $(obj).parent().parent().siblings().text();
        //        this.raju = $(obj).next().text();
        //        $(".display_query").empty();
        //        if (this.annamma != this.tbName)
        //        {
        //            this.tbName.push(`${this.annamma}`);
        //        }
        //        this.columnName.push(`${this.annamma}.${this.raju}`);
        //        $(".display_query").append(`<span class="sqlkeys">SELECT</span> <span class="colnames">${this.columnName}</span> <span class="sqlkey">FROM</span> <span class="which_table">${this.tbName}</span>`);
        //    }
        //}
        //else {
        //    this.columnName.pop($(obj).next().text());
        //    //if (($(obj).parent().parent().siblings().text() != this.tbName))
        //    //{
        //      //  this.tbName.pop($(obj).parent().parent().siblings().text());
        //    //}
        //    $(".display_query").empty();
        //    $(".display_query").append(`<span class="sqlkeys">SELECT</span> <span class="colnames">${this.columnName}</span> <span class="sqlkey">FROM</span> <span class="which_table">${this.tbName}</span>`);
        //}

    };



    //this.get_sibiling = function (i, obj)
    //{        
    //    if ($(obj).children().prop("checked")) {
    //        if ($(obj).next().attr("id") == "ann") {
    //            this.columnName = $(obj).next().text();
    //            $(".display_query").append(`<span class="sqlkeys">SELECT</span> <span class="colnames">${this.columnName}</span> <span class="sqlkey">FROM</span> <span class="which_table">${this.tableName}</span>`);
    //        }
    //    }
    //    else {

    //    }


    //}
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
    }
    this.sortorder = function (itemKey, opt, rootMenu, originalEvent) {
        var id = $(opt.selector).attr("id");
        if (itemKey === "Ascending")
            $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-asc'></i>");
        else 
            $("#" + id).children(".icon").empty().append("<i class='fa fa-sort-desc'></i>");/* $(".context-menu-active")*/
    }
    this.init = function () {
        this.appendTableNames();        
        //this.sortorder();
    };
    this.init();
};