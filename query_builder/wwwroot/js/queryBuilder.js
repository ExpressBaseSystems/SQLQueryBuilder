var QueryBuilder = function (object) {
    this.TableSchema = object;
    this.count = 0;
    this.appendTableNames = function () {
        for (var key in this.TableSchema) {
            $("#tables-cont").append(`<li class="dragable" tname="${key}">${key}</li>`);
        }
        $(".dragable").draggable({
            
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        $('.drop').droppable({
            drop: this.onDropFn.bind(this)
                
        });
    }

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
                $("#" + this.objId+" #Row").append(`<div>${item.cname},${item.type},${item.constraints},${item.foreign_tnm}</div>`);
            }

            $(".table-" + this.tableName).draggable({ containment: ".drop"});
        }
        else
             $(this.dropObj).css({ top: this.top , left: this.left});
           
    };

    this.init = function () {
        this.appendTableNames();
    };
    this.init();
}

