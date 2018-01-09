var QueryBuilder = function (object) {
    this.TableSchema = object;

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
        this.tableName = $(ui.draggable).attr('tname');
        this.droploc.append(`<div class="table-${this.tableName}" style="positon:absolute;top:;left:;"> <div class="Table">
                    <div id="tbhd">
                        ${this.tableName}
                    </div>
                    <div id="Row">

                    </div>
                </div>`);
        $(".table" + this.tableName)
        for (i = 0; i < this.TableSchema[this.tableName].length; i++) {
            var item = this.TableSchema[this.tableName][i];
            $(".table-" + this.tableName + " #Row").append(`<div>${item.cname},${item.type},${item.constraints},${item.foreign_tnm}</div>`);
        }
    };

    this.init = function () {
        this.appendTableNames();
    };
    this.init();
}

