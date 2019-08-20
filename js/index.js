Ext.onReady(function(){

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
                id:'name',
                fieldLabel:'name',
                xtype:'textfield',
                emptyText:'请输入name'
            },
            {
                id:'className',
                fieldLabel:'className',
                xtype:'textfield',
                emptyText:'请输入className'
            },
            {
                id:'sex',
                fieldLabel:'sex',
                xtype:'textfield',
                emptyText:'请输入sex'
            },
            {
                fieldLabel:'birthday',
                xtype:'datefield',
                format:'Y/m/d',
                emptyText:'请输入birthday'
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

                    let record = new Ext.data.Record({
                        name:name,
                        className: className,
                        sex:sex,
                        birthday:birthday                     
                    });

                    let selectedRecord = grid.getSelectionModel().getSelected();
                    let recordIndex = grid.getStore().indexOf(selectedRecord);
                    if(recordIndex == -1){
                        console.log('if里面'+recordIndex);
                        groupingStore.insert(0,record);
                    }
                        
                    else{
                        console.log('else里面'+recordIndex);
                        let className = selectedRecord.data.className;
                        record.className = className;
                        inputValue[1].setValue(className);
                        groupingStore.insert(recordIndex,record);
                    }
                        

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
        ['刘一','A','male',new Date()],
        ['陈二','A','female',new Date()],
        ['张三','A','female',new Date()],
        ['李四','B','male',new Date()],
        ['王五','B','male',new Date()],
        ['赵六','C','male',new Date()]
    ]

    let addAvadar = (content,record,c)=>{
        if(c.data.sex == 'female')
            record.style += 'color:green;background:url(./pic/gril.png) no-repeat 28px 1px';
        else
            record.style += 'color:red;background:url(./pic/boy.png) no-repeat 28px 1px;';
        return content;
    };

    let sm = new Ext.grid.CheckboxSelectionModel();
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
            renderer:addAvadar}
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
        multiSortInfo: {sorters:[{field:'className',direction:'DESC'},{field:'name',direction:'DESC'}],direction:'DESC'}
    });
    
    groupingStore.load({params:{start:0,limit:4}});

    let contextMenu = new Ext.menu.Menu({
        items:[
            {
                text:'Up',
                handler:function(){
                    let store = grid.getStore();
                    let curSelection = grid.getSelectionModel().getSelected();
                    let curIndex = store.indexOf(curSelection);
                    let className = curSelection.data.className;      
                    
                    let lastSelection;
                    let startIndex = -1;
                    while(true){
                        startIndex = store.find('className',className,startIndex+1);
                        if(curIndex > startIndex)
                            lastSelection = store.getAt(startIndex);
                        else
                            break;
                    };
                    if(lastSelection != null && lastSelection != curSelection){
                        let insertIndex = store.indexOf(lastSelection);
                        store.remove(curSelection);
                        store.insert(insertIndex,curSelection);
                    }
                }
            },
            {
                text:'Down',
                handler:function(){
                    let store = grid.getStore();
                    let curSelection = grid.getSelectionModel().getSelected();
                    let curIndex = store.indexOf(curSelection);
                    let className = curSelection.data.className;      
                    
                    let lastIndex = store.find('className',className,curIndex + 1);
                    let lastSelection = store.getAt(lastIndex);
                    if(lastSelection != null && lastSelection != curSelection){
                        store.remove(lastSelection);
                        store.insert(curIndex,lastSelection);
                    }
                }
            },
            {
                text:'First',
                handler:function(){
                    let store = grid.getStore();
                    let curSelection = grid.getSelectionModel().getSelected();
                    let className = curSelection.data.className;      
                    
                    let fistIndex = store.find('className',className);
                    let firstSelection = store.getAt(fistIndex);
                    if(firstSelection != null && firstSelection != curSelection){
                        store.remove(curSelection);
                        store.insert(fistIndex,curSelection);
                    }
                }
            },
            {
                text:'Last',
                handler:function(){
                    let store = grid.getStore();
                    let curSelection = grid.getSelectionModel().getSelected();
                    let curIndex = store.indexOf(curSelection);
                    let className = curSelection.data.className;      
                    
                    let endSelection;
                    let matchIndex=curIndex;
                    while(true){
                        matchIndex = store.find('className',className,matchIndex+1);
                        if(matchIndex != -1)
                            endSelection = store.getAt(matchIndex);
                        else
                            break;
                    };
                    if(endSelection != null){
                        let insertIndex = store.indexOf(endSelection);
                        store.remove(curSelection);
                        store.insert(insertIndex+1,curSelection);
                    }
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
                let record = grid.getSelectionModel().getSelected();
                if(record != undefined){
                    Ext.getCmp('className').setValue(record.data.className);
                    console.log(record.data.className);

                }        
                window.show();
            }
        },'-',{
            text:'Delete',
            handler:function(){
                Ext.Msg.confirm('温馨提示','你确定要删除吗?',function(btn){
                    if(btn =='yes'){
                        let selections = grid.getSelectionModel().getSelections();
                        grid.getStore().remove(selections);
                    }
                });     
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
            }
        }
    });

    

})