Ext.onReady(function(){

    var operateRecord = {};
    let window = new Ext.Window({
        id:'window',
        title:'请输入信息',
        modal:true,
        width:300,
        height:200,
        layout:'form',
        labelWidth:70,
        labelAlign:'right',
        items:[
            {
                fieldLabel:'name',
                xtype:'textfield',
                emptyText:'请输入name'
            },
            {
                fieldLabel:'className',
                xtype:'textfield',
                emptyText:'请输入className'
            },
            {
                fieldLabel:'sex',
                xtype:'textfield',
                emptyText:'请输入sex'
            },
            {
                fieldLabel:'birthday',
                xtype:'datefield',
                format:'Y/m/d',
                emptyText:'请输入birthday'
            },
            {
                fieldLabel:'avatar',
                xtype:'textfield',
                emptyText:'请输入avatar'
            }
        ],
        buttons:[
            {
                text:'确定',
                handler:function(){
                    let inputValue = Ext.getCmp('window').items.items;
                    let name = inputValue[0].getValue();
                    let className = inputValue[1].getValue();
                    let sex = inputValue[2].getValue();
                    let birthday = inputValue[3].getValue();
                    let avatar = inputValue[4].getValue();

                    let record = new Ext.data.Record({
                        name:name,
                        className: className,
                        sex:sex,
                        birthday:birthday,
                        avatar:avatar                      
                    });

                    if(operateRecord.selectRowIndex == undefined || operateRecord.selectRowIndex == null)
                        groupingStore.insert(0,record);
                    else
                        groupingStore.insert(operateRecord.selectRowIndex,record);

                    for(let i = 0; i < inputValue.length; i++)
                        inputValue[i].setValue('');
                    window.hide();
                }
            },
            {
                text:'取消',
                handler:function(){
                    window.hide();
                }
            }
        ],
        listeners:{
            beforeclose:function(){
                window.hide();
                return false;
            }
        }
    });

    let data = [
        ['刘一','A','male',new Date(),'1'],
        ['陈二','A','female',new Date(),'2'],
        ['张三','B','male',new Date(),'3'],
        ['李四','B','male',new Date(),'4'],
        ['王五','C','male',new Date(),'5']
    ]
    let sm = new Ext.grid.CheckboxSelectionModel({
        listeners:{
            rowselect:function(){
                console.log('selected');
            }
        }
    });
    let cm = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        sm,
        {
            header:'name',
            dataIndex:'name',
            editor: new Ext.grid.GridEditor(
                new Ext.form.TextField({
                    allowBlank: false
                })
            )
        },
        {
            header:'class',
            dataIndex:'className',
            editor: new Ext.grid.GridEditor(
                new Ext.form.TextField({
                    allowBlank: false
                })
            )},
        {
            header:'sex',
            dataIndex:'sex',
            editor: new Ext.grid.GridEditor(
                new Ext.form.TextField({
                    allowBlank: false
                })
        )},
        {
            header:'birthday',
            dataIndex:'birthday',
            renderer: Ext.util.Format.dateRenderer('Y/m/d'),
            editor: new Ext.grid.GridEditor(
                new Ext.form.TextField({
                    allowBlank: false
                })
            )},
        {
            header:'avatar',
            dataIndex:'avatar',
            editor: new Ext.grid.GridEditor(
                new Ext.form.TextField({
                    allowBlank: false
                })
            )}
    ]);

    let groupingStore = new Ext.data.GroupingStore({
        proxy: new Ext.data.PagingMemoryProxy(data),
        reader: new Ext.data.ArrayReader({},[
            {name:'name'},
            {name:'className',sortable:true},
            {name:'sex'},
            {name:'birthday'},
            {name:'avatar'}
        ]),
        groupField:'className',
        sortInfo: {field:'className',field:'name',direction:'DESC'}
    });
    
    groupingStore.load({params:{start:0,limit:4}});

    let contextMenu = new Ext.menu.Menu({
        items:[
            {
                text:'Up',
                handler:function(){

                }
            },
            {
                text:'Down',
                handler:function(){
                    
                }
            },
            {
                text:'First',
                handler:function(){
                    
                }
            },
            {
                text:'Last',
                handler:function(){
                    
                }
            }
        ]
    });

    let grid = new Ext.grid.EditorGridPanel({
        renderTo:'test',
        height:500,
        store:groupingStore,
        cm:cm,
        sm:sm,
        contextMenu:contextMenu,
        tbar:[{
            text:'add',
            handler:function(){
                window.show();
            }
        },'-',{
            text:'move',
            handler:function(){
                console.log(operateRecord);
            }
        },'-',{
            text:'Delete',
            handler:function(){
                let selections = grid.getSelectionModel().getSelections();
                grid.getStore().remove(selections);
            }
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 4,
            store: groupingStore,
            displayInfo: true,
            displayMsg: '显示第{0}条 到{1}条记录，一共{2}条',
            emptyMsg: '没有记录'
        }),
        view: new Ext.grid.GroupingView(),
        listeners:{
            rowcontextmenu:function(grid, rowIndex, event){
                event.preventDefault();
                grid.getSelectionModel().selectRow(rowIndex);
                contextMenu.showAt(event.getXY());
                console.log(grid.getSelectionModel().getSelected())
            }
        }
    });

    

})